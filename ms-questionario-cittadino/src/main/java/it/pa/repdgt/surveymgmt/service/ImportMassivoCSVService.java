package it.pa.repdgt.surveymgmt.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import it.pa.repdgt.shared.entity.*;
import it.pa.repdgt.shared.entity.key.EnteSedeProgettoFacilitatoreKey;
import it.pa.repdgt.shared.entityenum.JobStatusEnum;
import it.pa.repdgt.shared.entityenum.PolicyEnum;
import it.pa.repdgt.shared.exception.CodiceErroreEnum;
import it.pa.repdgt.surveymgmt.collection.SezioneQ3Collection;
import it.pa.repdgt.surveymgmt.components.ServiziElaboratiCsvWriter;
import it.pa.repdgt.surveymgmt.constants.NoteCSV;
import it.pa.repdgt.surveymgmt.dto.NuovoCittadinoDTO;
import it.pa.repdgt.surveymgmt.dto.ServiziAggiuntiDTO;
import it.pa.repdgt.surveymgmt.dto.ServiziElaboratiDTO;
import it.pa.repdgt.surveymgmt.dto.ServiziElaboratiDTOResponse;
import it.pa.repdgt.surveymgmt.exception.CittadinoException;
import it.pa.repdgt.surveymgmt.exception.QuestionarioCompilatoException;
import it.pa.repdgt.surveymgmt.exception.ResourceNotFoundException;
import it.pa.repdgt.surveymgmt.exception.ServizioException;
import it.pa.repdgt.surveymgmt.exception.ValidationException;
import it.pa.repdgt.surveymgmt.model.ElaboratoCSVRequest;
import it.pa.repdgt.surveymgmt.model.ElaboratoCSVResponse;
import it.pa.repdgt.surveymgmt.mongo.repository.QuestionarioCompilatoMongoRepository;
import it.pa.repdgt.surveymgmt.mongo.repository.SezioneQ3Respository;
import it.pa.repdgt.surveymgmt.repository.*;
import it.pa.repdgt.surveymgmt.request.QuestionarioCompilatoRequest;
import it.pa.repdgt.surveymgmt.request.ServizioRequest;
import it.pa.repdgt.surveymgmt.restapi.ServizioCittadinoRestApi;
import it.pa.repdgt.surveymgmt.util.CSVMapUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.apache.commons.collections4.CollectionUtils;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.IncorrectResultSizeDataAccessException;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ImportMassivoCSVService {
    private final RegistroAttivitaRepository registroAttivitaRepository;
    private final SezioneQ3Respository sezioneQ3Respository;
    private final ProgettoRepository progettoRepository;
    private final RestTemplateS3Service restTemplateS3Service;
    private final SedeRepository sedeRepository;
    private final UtenteRepository utenteRepository;
    private final ServiziElaboratiCsvWriter serviziElaboratiCsvWriter;
    private final ServizioService servizioService;
    private final CittadiniServizioService cittadiniServizioService;
    private final ServizioCittadinoRestApi servizioCittadinoRestApi;
    private final ServizioSqlRepository servizioSqlRepository;
    private final EnteSedeProgettoFacilitatoreRepository enteSedeProgettoFacilitatoreRepository;
    private final RegistroAttivitaService registroAttivitaService;
    @Autowired
    private ServizioXCittadinoRepository servizioXCittadinoRepository;
    @Autowired
    private CittadinoService cittadinoService;
    @Autowired
    private QuestionarioCompilatoService questionarioCompilatoService;
    private static final String FILE_NAME = "%s_righe_scartate_%s_%s.csv";
    @Autowired
	private ProgettoService progettoService;
    @Autowired
    private QuestionarioCompilatoRepository questionarioCompilatoRepository;
    private DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH-mm", Locale.ITALIAN);


    @Async
    public void process(ElaboratoCSVRequest csvRequest, String uuid, PolicyEnum policy, String estensioneInput) throws IOException {
        List<ServiziElaboratiDTO> serviziValidati = csvRequest.getServiziValidati();
        List<ServiziElaboratiDTO> serviziScartati = csvRequest.getServiziScartati();
        String UUID = replaceUUID(uuid);
        int totaleRighe = serviziScartati.size() + serviziValidati.size();
        List<ServiziElaboratiDTO> servizi = !serviziValidati.isEmpty()
                ? serviziValidati
                : serviziScartati;
        String cfUtenteLoggato = servizi != null && servizi.size() > 0
                ? servizi.get(0).getServizioRequest().getCfUtenteLoggato()
                : null;

        Long idEnte = servizi.get(0).getNuovoCittadinoServizioRequest().getIdEnte();
        Long idProgetto = servizi.get(0).getNuovoCittadinoServizioRequest().getIdProgetto();

        RegistroAttivitaEntity registroAttivitaEntity = faseInizializzazioneSalvataggioRegistroAttivita(UUID,
                cfUtenteLoggato, idEnte, idProgetto, estensioneInput);

        try {
            ElaboratoCSVResponse response = buildResponse(serviziValidati, serviziScartati, UUID,
                    registroAttivitaEntity, policy);
            // registroAttivitaEntity = faseIntermezzoSalvataggioRegistroAttivita(UUID,
            // csvRequest,
            // cfUtenteLoggato);
            try {
                uploadFile(response, registroAttivitaEntity.getId());
            } catch (IOException e) {
                log.info("-XXX- Errore durante il salvataggio del file scarti, id RegistroAttivitaEntity: {} -XXX",
                        registroAttivitaEntity.getId());
                e.printStackTrace();
                try {
                    rollbackCaricamentoMassivo(registroAttivitaEntity.getId());
                    registroAttivitaEntity.setJobStatus(JobStatusEnum.FAIL_S3_UPLOAD);
                    registroAttivitaEntity.setNote("Upload del file su s3 Fallito");
                    registroAttivitaEntity.setDataFineInserimento(new Date());
                    registroAttivitaRepository.save(registroAttivitaEntity);
                } catch (Exception e2) {
                    log.info(
                            "-XXX- Errore durante il rollback del caricamento massivo, id RegistroAttivitaEntity: {} -XXX",
                            registroAttivitaEntity.getId());
                    e2.printStackTrace();
                    registroAttivitaEntity.setJobStatus(JobStatusEnum.FAIL_S3_UPLOAD);
                    registroAttivitaEntity.setNote("Upload del file su s3 Fallito, rollback fallito");
                    registroAttivitaEntity.setDataFineInserimento(new Date());
                    registroAttivitaRepository.save(registroAttivitaEntity);
                }
            }
            throw new Exception();
            // aggiornaRegistroAttivita(totaleRighe, serviziScartati.size(), serviziValidati.size(),
            //         registroAttivitaEntity,
            //         response.getResponse(), response.getFileName());
        } catch (Exception e) {

            log.info("-XXX- Errore generico durante l'elaborazione del file, id RegistroAttivitaEntity: {} -XXX-",
                    registroAttivitaEntity.getId());
            e.printStackTrace();
            try {
                rollbackCaricamentoMassivo(registroAttivitaEntity.getId());
                registroAttivitaEntity.setJobStatus(JobStatusEnum.GENERIC_FAIL);
                registroAttivitaEntity.setNote("Caricamento fallito");
                registroAttivitaEntity.setDataFineInserimento(new Date());
                registroAttivitaRepository.save(registroAttivitaEntity);
            } catch (Exception e2) {
                log.info("-XXX- Errore durante il rollback del caricamento massivo, id RegistroAttivitaEntity: {} -XXX",
                        registroAttivitaEntity.getId());
                e2.printStackTrace();
                registroAttivitaEntity.setJobStatus(JobStatusEnum.GENERIC_FAIL);
                registroAttivitaEntity.setNote("Caricamento fallito, rollback fallito");
                registroAttivitaEntity.setDataFineInserimento(new Date());
                registroAttivitaRepository.save(registroAttivitaEntity);

            }
        }
    }

    public void checkPreliminareCaricamentoMassivo(Long idEnte, Long idProgetto) {
        List<RegistroAttivitaEntity> registroAttivita = registroAttivitaRepository
                .findByIdEnteAndIdProgettoAndJobStatus(idEnte, idProgetto, JobStatusEnum.IN_PROGRESS);
        if (CollectionUtils.isNotEmpty(registroAttivita)) {
            log.info("E' già in corso un caricamento dati: idEnte {} - idProgetto {}", idEnte, idProgetto);
            throw new ValidationException("E' già in corso un caricamento dati", CodiceErroreEnum.CM01);
        }
    }

    private void aggiornaRegistroAttivita(int totaleRighe, int numeroScartati, int numeroValidati,
            RegistroAttivitaEntity registroAttivitaEntity,
            ServiziElaboratiDTOResponse response, String fileName) {
        registroAttivitaEntity.setCittadiniAggiunti(response.getCittadiniAggiunti());
        registroAttivitaEntity.setRigheScartate(numeroScartati);
        registroAttivitaEntity.setTotaleRigheFile(totaleRighe);
        registroAttivitaEntity.setFileUpdated(true);
        registroAttivitaEntity.setRilevazioneDiEsperienzaCompilate(response.getQuestionariAggiunti());
        registroAttivitaEntity.setServiziAcquisiti(response.getServiziAggiunti());
        registroAttivitaEntity.setFileName(fileName);
        registroAttivitaEntity.setJobStatus(JobStatusEnum.SUCCESS);
        registroAttivitaEntity.setDataFineInserimento(new Date());
        registroAttivitaRepository.save(registroAttivitaEntity);
    }

    private String replaceUUID(String uuid) {
        return uuid.replaceAll("-", "");
    }

    private RegistroAttivitaEntity faseInizializzazioneSalvataggioRegistroAttivita(String uuid,
            String cfUtenteLoggato, Long idEnte, Long idProgetto, String estensioneInput) {

        RegistroAttivitaEntity registroAttivita = RegistroAttivitaEntity.builder()
                .jobStatus(JobStatusEnum.IN_PROGRESS)
                .operatore(cfUtenteLoggato)
                .totaleRigheFile(0)
                .righeScartate(0)
                .serviziAcquisiti(0)
                .cittadiniAggiunti(0)
                .rilevazioneDiEsperienzaCompilate(0)
                .idEnte(idEnte)
                .idProgetto(idProgetto)
                .jobUUID(uuid)
                .jobStatus(JobStatusEnum.IN_PROGRESS)
                .estensioneInput(estensioneInput)
                .build();
        return registroAttivitaService.saveRegistroAttivita(registroAttivita);
    }

    @Transactional
    public ElaboratoCSVResponse buildResponse(List<ServiziElaboratiDTO> serviziValidati, List<ServiziElaboratiDTO> serviziScartati, String uuid, RegistroAttivitaEntity registroAttivitaEntity, PolicyEnum policy) {
        Long idServizio = null;
        Integer serviziAggiunti = 0;
        Integer cittadiniAggiunti = 0;
        Integer questionariAggiunti = 0;
        String idQuestionario = null;
        List<ServiziAggiuntiDTO> serviziAggiuntiList = new ArrayList<>();
        NuovoCittadinoDTO nuovoCittadinoDTO = new NuovoCittadinoDTO();
        for (ServiziElaboratiDTO servizioElaborato : serviziValidati) {
            Optional<ServizioEntity> servizioOpt = Optional.empty();
            boolean nuovoAggiunto = false;
            idServizio = null;
            // GESTIONE SERVIZIO
            try {
                Optional<UtenteEntity> utenteFacilitatoreDellaRichiesta = recuperaUtenteFacilitatoreDaRichiesta(
                        servizioElaborato.getCampiAggiuntiviCSV().getIdFacilitatore(),
                        servizioElaborato.getCampiAggiuntiviCSV().getNominativoFacilitatore());
                if (!utenteFacilitatoreDellaRichiesta.isPresent()) {
                    throw new ResourceNotFoundException(NoteCSV.NOTE_FACILITATORE_NON_PRESENTE, CodiceErroreEnum.C01);
                }
                String nominativoSedeModified = servizioElaborato.getCampiAggiuntiviCSV().getNominativoSede().replace(" ", "").toUpperCase();
                Optional<SedeEntity> optSedeRecuperata = recuperaSedeDaRichiesta(nominativoSedeModified);
                if (!optSedeRecuperata.isPresent()) {
                    throw new ResourceNotFoundException(NoteCSV.NOTE_SEDE_NON_PRESENTE, CodiceErroreEnum.C01);
                }
                SedeEntity sedeRecuperata = optSedeRecuperata.get();
                UtenteEntity utenteRecuperato = utenteFacilitatoreDellaRichiesta.get();
                ServizioRequest servizioRequest = servizioElaborato.getServizioRequest();
                servizioRequest.setCfUtenteLoggato(utenteRecuperato.getCodiceFiscale());
                servizioRequest.setIdSedeServizio(sedeRecuperata.getId());
                EnteSedeProgettoFacilitatoreEntity enteSedeProgettoFacilitatore = enteSedeProgettoFacilitatoreRepository
                        .existsByChiave(
                                servizioRequest.getCfUtenteLoggato(),
                                servizioRequest.getIdEnteServizio(),
                                servizioRequest.getIdProgetto(),
                                servizioRequest.getIdSedeServizio());
                if (enteSedeProgettoFacilitatore == null) {
                    throw new ResourceNotFoundException(NoteCSV.NOTE_UTENTE_SEDE_NON_ASSOCIATI_AL_PROGETTO,
                            CodiceErroreEnum.C01);
                }
                if(policy.equals(PolicyEnum.RFD)){ // Per SCD dovrò sempre inserire un nuovo servizio, il controllo sarà sulla coppia servizio_x_cittadino
                servizioOpt = getServizioDaListaAggiunti(serviziAggiuntiList, servizioElaborato);  // Recupero servizio uguale da quelli della stessa istanza di caricamento massivo
                if (!servizioOpt.isPresent()) {
                    // Recupero i servizi uguali su MYSQL
                    List<ServizioEntity> listaServizi = getServizioByDatiControllo(
                            servizioElaborato.getServizioRequest(), enteSedeProgettoFacilitatore.getId());

                    log.info("-XXX- Dati che sto per confrontare: {}  -XXX-", String.join(" - ",
                            Arrays.asList(
                                    servizioElaborato.getCampiAggiuntiviCSV().getDescrizioneDettagliServizio(),
                                    servizioElaborato.getCampiAggiuntiviCSV().getAmbitoServiziDigitaliTrattati(),
                                    servizioElaborato.getCampiAggiuntiviCSV()
                                            .getCompetenzeTrattateSecondoLivello())));
                    for (ServizioEntity servizioRecuperato : listaServizi) {
                        // Recupero le info aggiuntive su MongoDB
                        servizioOpt = Optional.ofNullable(servizioRecuperato);
                        Optional<SezioneQ3Collection> optSezioneQ3Collection = sezioneQ3Respository
                                .findById(servizioRecuperato.getIdTemplateCompilatoQ3());
                        if (optSezioneQ3Collection.isPresent()) {
                            // String descrizioneMongo = recuperaDescrizioneDaMongo(optSezioneQ3Collection);
                            boolean isStessoServizio = true;
                            if (!recuperaDescrizioneDaMongo(optSezioneQ3Collection, 6, null).equalsIgnoreCase(
                                    servizioElaborato.getCampiAggiuntiviCSV().getDescrizioneDettagliServizio())) {
                                isStessoServizio = false;
                                // servizioOpt = Optional.empty();
                            }
                            if (!recuperaDescrizioneDaMongo(optSezioneQ3Collection, 5, CSVMapUtil.getSE6Map())
                                    .equalsIgnoreCase(servizioElaborato.getCampiAggiuntiviCSV()
                                            .getAmbitoServiziDigitaliTrattati().replace(" ", ""))) {
                                isStessoServizio = false;
                                // servizioOpt = Optional.empty();
                            }
                            if (!recuperaDescrizioneDaMongo(optSezioneQ3Collection, 4, CSVMapUtil.getSE5Map())
                                    .equalsIgnoreCase(servizioElaborato.getCampiAggiuntiviCSV()
                                            .getCompetenzeTrattateSecondoLivello().replace(" ", ""))) {
                                isStessoServizio = false;
                                // servizioOpt = Optional.empty();
                            }
                            if (!isStessoServizio) {
                                servizioOpt = Optional.empty();
                            } else {
                                log.info("-XXX- Servizio uguale a quello che sto inserendo: {} -XXX-",
                                        servizioOpt.get().getId());

                                break;
                            }
                        }
                    }
                }
            }
                if (!servizioOpt.isPresent()) {
                    serviziAggiunti++;
                    nuovoAggiunto = true;
                }
                servizioRequest.setCodiceRuoloUtenteLoggato(enteSedeProgettoFacilitatore.getRuoloUtente());
                servizioElaborato.setServizioRequest(servizioRequest);
                servizioElaborato.getNuovoCittadinoServizioRequest()
                        .setCfUtenteLoggato(utenteFacilitatoreDellaRichiesta.get().getCodiceFiscale());
                servizioElaborato.getNuovoCittadinoServizioRequest().setCodiceRuoloUtenteLoggato("FAC");
                QuestionarioCompilatoRequest questionarioCompilatoRequest = servizioElaborato
                        .getQuestionarioCompilatoRequest();
                questionarioCompilatoRequest.setCodiceRuoloUtenteLoggato("FAC");
                questionarioCompilatoRequest.setCodiceFiscaleDaAggiornare(utenteRecuperato.getCodiceFiscale());
                questionarioCompilatoRequest.setIdEnte(servizioRequest.getIdEnteServizio());
                questionarioCompilatoRequest.setIdProgetto(servizioRequest.getIdProgetto());
                Optional<ProgettoEntity> progettoEntity = progettoRepository
                        .findById(servizioRequest.getIdProgetto());
                if (progettoEntity.isPresent()) {
                    questionarioCompilatoRequest.setIdProgramma(progettoEntity.get().getProgramma().getId());
                } else {
                    throw new ResourceNotFoundException(NoteCSV.NOTE_PROGETTO_NON_PRESENTE, CodiceErroreEnum.C01);
                }
                ProgettoEntity progettoEntityData = progettoEntity.get();
                if (!servizioRequest.getDataServizio().after(progettoEntityData.getDataFineProgetto()) &&
                        !servizioRequest.getDataServizio().before(progettoEntityData.getDataInizioProgetto())) {
                    servizioElaborato.setQuestionarioCompilatoRequest(questionarioCompilatoRequest);
                    
                    ServizioEntity servizioEntity = salvaServizio(servizioOpt,                  
                            servizioElaborato.getServizioRequest(), registroAttivitaEntity.getId().toString());                                //QUA
                    if (nuovoAggiunto) {
                        ServiziAggiuntiDTO servizioAggiunto = new ServiziAggiuntiDTO(servizioElaborato,
                                servizioEntity);
                        serviziAggiuntiList.add(servizioAggiunto);
                        log.info("-XXX- Servizio aggiunto alla lista {} -XXX-",
                                servizioAggiunto.getServizioEntity().getId());
                    }

                    idServizio = servizioEntity.getId();
                } else {
                    throw new ResourceNotFoundException(NoteCSV.NOTE_DATA_SERVIZIO_NON_COMPRESA_IN_PROGETTO,
                            CodiceErroreEnum.A06);
                }
            } catch (ResourceNotFoundException ex) {
                if (serviziAggiunti > 0 && nuovoAggiunto)
                    serviziAggiunti--;
                log.info("-XXX- Eccezione gestita servizio: {} -XXX-", ex.getMessage());
                ex.printStackTrace();
                servizioElaborato.getCampiAggiuntiviCSV().setNote(ex.getMessage());
                serviziScartati.add(servizioElaborato);
                try {
                    if (nuovoAggiunto && idServizio != null) {
                        servizioService.eliminaServizioForce(idServizio);
                        removeFromList(serviziAggiuntiList, idServizio);
                    }
                } catch (Exception exc) {
                    log.info("-XXX- Exception eccezione bonifica record servizio: {} -XXX-", exc.getMessage());
                    exc.printStackTrace();
                    log.info("-XXX- Eccezione bonifica record andato in errore in servizio: {}", idServizio);
                }
                continue;
            } catch (RuntimeException e) {
                if (serviziAggiunti > 0 && nuovoAggiunto)
                    serviziAggiunti--;
                log.info("-XXX- Eccezione gestita servizio: {} -XXX-", e.getMessage());
                e.printStackTrace();
                servizioElaborato.getCampiAggiuntiviCSV().setNote(e.getMessage());
                serviziScartati.add(servizioElaborato);
                try {
                    if (nuovoAggiunto && idServizio != null) {
                        servizioService.eliminaServizioForce(idServizio);
                        removeFromList(serviziAggiuntiList, idServizio);
                    }
                } catch (Exception exc) {
                    log.info("-XXX- Exception eccezione bonifica record servizio: {} -XXX-", exc.getMessage());
                    exc.printStackTrace();
                    log.info("-XXX- Eccezione bonifica record andato in errore in servizio: {}", idServizio);
                }
                continue;
            } catch (Exception e) {
                if (serviziAggiunti > 0 && nuovoAggiunto)
                    serviziAggiunti--;
                log.info("-XXX- Eccezione gestita servizio: {} -XXX-", e.getMessage());
                e.printStackTrace();
                servizioElaborato.getCampiAggiuntiviCSV().setNote(
                        "Impossibile salvare i dati del servizio, controllare bene tutti le colonne inserite e riprovare.");
                serviziScartati.add(servizioElaborato);
                try {
                    if (nuovoAggiunto && idServizio != null) {
                        servizioService.eliminaServizioForce(idServizio);
                        removeFromList(serviziAggiuntiList, idServizio);
                    }
                } catch (Exception exc) {
                    log.info("-XXX- Exception eccezione bonifica record servizio: {} -XXX-", exc.getMessage());
                    exc.printStackTrace();
                    log.info("-XXX- Eccezione bonifica record andato in errore in servizio: {} -XXX-", idServizio);
                }
                continue;
            }
            // GESTIONE CITTADINO
            try {
                cittadiniAggiunti++;
                idQuestionario = null;
                nuovoCittadinoDTO = null;
                nuovoCittadinoDTO = cittadiniServizioService.creaNuovoCittadinoImportCsv(idServizio, servizioElaborato.getNuovoCittadinoServizioRequest(), registroAttivitaEntity.getId().toString());
                idQuestionario = nuovoCittadinoDTO.getCittadinoEntity().getQuestionarioCompilato().get(0).getId();
                if(!nuovoCittadinoDTO.isNuovoCittadino() && policy.equals(PolicyEnum.SCD)){
                    // Se cittadino non è stato appena inserito, controllare che esso non sia associato ad un servizio identico a quello appena inserito
                    // recuperando su MySQL i servizi a lui associato che combaciano con le caratteristiche
                    ServizioRequest servizioRequest = servizioElaborato.getServizioRequest();
                    EnteSedeProgettoFacilitatoreEntity enteSedeProgettoFacilitatore = enteSedeProgettoFacilitatoreRepository.existsByChiave(
                        servizioRequest.getCfUtenteLoggato(),
                        servizioRequest.getIdEnteServizio(),
                        servizioRequest.getIdProgetto(),
                        servizioRequest.getIdSedeServizio());
                    List<ServizioEntity> listaServizi = getServizioByDatiControlloPerSingoloCittadino(servizioElaborato.getServizioRequest(), enteSedeProgettoFacilitatore.getId(), nuovoCittadinoDTO.getCittadinoEntity().getId(), idServizio);
                    if(CollectionUtils.isNotEmpty(listaServizi)){
                        // controllare uguaglianza per ogni servizio con servizio appena inserito
                        Boolean isStessoServizio = false;
                        for(ServizioEntity servizioEntity : listaServizi){                           
                            isStessoServizio = checkUguaglianzaServizio(servizioEntity, servizioElaborato);
                            if(isStessoServizio){
                                // servizio_x_cittadino duplicato, rollback
                                throw new CittadinoException(NoteCSV.NOTE_CITTADINO_PRESENTE, CodiceErroreEnum.U23);
                            }
                            // Se no vado avanti

                        }
                    }
                }
            } catch (CittadinoException | ServizioException e) {
                if (cittadiniAggiunti > 0)
                    cittadiniAggiunti--;
                log.info("-XXX- Eccezione gestita cittadino: {} -XXX-", e.getMessage());
                e.printStackTrace();
                servizioElaborato.getCampiAggiuntiviCSV().setNote(e.getMessage());
                serviziScartati.add(servizioElaborato);
                try {
                    if (idQuestionario != null) {
                        questionarioCompilatoService.rimuoviQuestionarioById(idQuestionario);
                    }
                    if (nuovoCittadinoDTO != null && nuovoCittadinoDTO.isNuovoCittadino()) {
                        cittadinoService.removeCittadino(nuovoCittadinoDTO.getCittadinoEntity().getId());
                    }
                    if (nuovoAggiunto) {
                        servizioService.eliminaServizioForce(idServizio);
                        removeFromList(serviziAggiuntiList, idServizio);
                        if (serviziAggiunti > 0)
                            serviziAggiunti--;
                    }
                } catch (Exception exc) {
                    log.info("-XXX- Exception eccezione bonifica record cittadino: {} -XXX-", exc.getMessage());
                    exc.printStackTrace();
                    log.info(
                            "-XXX- Eccezione bonifica record andato in errore in servizio: {} e cittadino {} -XXX-",
                            idServizio,
                            nuovoCittadinoDTO != null && nuovoCittadinoDTO.getCittadinoEntity() != null
                                    ? nuovoCittadinoDTO.getCittadinoEntity().getId()
                                    : "NON ANCORA CREATO");
                }
                continue;
            } catch (ResponseStatusException e) {
                if (cittadiniAggiunti > 0)
                    cittadiniAggiunti--;
                log.info("-XXX- Eccezione gestita cittadino: {} -XXX-", e.getReason());
                e.printStackTrace();
                servizioElaborato.getCampiAggiuntiviCSV().setNote(e.getReason());
                serviziScartati.add(servizioElaborato);
                try {
                    if (idQuestionario != null) {
                        questionarioCompilatoService.rimuoviQuestionarioById(idQuestionario);
                    }
                    if (nuovoCittadinoDTO != null && nuovoCittadinoDTO.isNuovoCittadino()) {
                        cittadinoService.removeCittadino(nuovoCittadinoDTO.getCittadinoEntity().getId());
                    }
                    if (nuovoAggiunto) {
                        servizioService.eliminaServizioForce(idServizio);
                        removeFromList(serviziAggiuntiList, idServizio);
                        if (serviziAggiunti > 0)
                            serviziAggiunti--;
                    }
                } catch (Exception exc) {
                    log.info("-XXX- Exception eccezione bonifica record cittadino: {} -XXX-", exc.getMessage());
                    exc.printStackTrace();
                    log.info(
                            "-XXX- Eccezione bonifica record andato in errore in servizio: {} e cittadino {} -XXX-",
                            idServizio,
                            nuovoCittadinoDTO != null && nuovoCittadinoDTO.getCittadinoEntity() != null
                                    ? nuovoCittadinoDTO.getCittadinoEntity().getId()
                                    : "NON ANCORA CREATO");
                }
                continue;
            } catch (IncorrectResultSizeDataAccessException incorrectException) {
                if (cittadiniAggiunti > 0)
                    cittadiniAggiunti--;
                log.info("-XXX- Eccezione gestita cittadino: {} -XXX-", incorrectException.getMessage());
                incorrectException.printStackTrace();
                servizioElaborato.getCampiAggiuntiviCSV().setNote(NoteCSV.NOTE_CITTADINO_PRESENTE);
                serviziScartati.add(servizioElaborato);
                try {
                    if (idQuestionario != null) {
                        questionarioCompilatoService.rimuoviQuestionarioById(idQuestionario);
                    }
                    if (nuovoCittadinoDTO != null && nuovoCittadinoDTO.isNuovoCittadino()) {
                        cittadinoService.removeCittadino(nuovoCittadinoDTO.getCittadinoEntity().getId());
                    }
                    if (nuovoAggiunto) {
                        servizioService.eliminaServizioForce(idServizio);
                        removeFromList(serviziAggiuntiList, idServizio);
                        if (serviziAggiunti > 0)
                            serviziAggiunti--;
                    }
                } catch (Exception exc) {
                    log.info("-XXX- Exception eccezione bonifica record cittadino: {} -XXX-", exc.getMessage());
                    exc.printStackTrace();
                    log.info(
                            "-XXX- Eccezione bonifica record andato in errore in servizio: {} e cittadino {} -XXX-",
                            idServizio,
                            nuovoCittadinoDTO != null && nuovoCittadinoDTO.getCittadinoEntity() != null
                                    ? nuovoCittadinoDTO.getCittadinoEntity().getId()
                                    : "NON ANCORA CREATO");
                }
                continue;
            } catch (RuntimeException e) {
                if (cittadiniAggiunti > 0)
                    cittadiniAggiunti--;
                log.info("-XXX- Eccezione gestita cittadino: {} -XXX-", e.getMessage());
                e.printStackTrace();
                servizioElaborato.getCampiAggiuntiviCSV().setNote(NoteCSV.NOTE_CITTADINO);
                serviziScartati.add(servizioElaborato);
                try {
                    if (idQuestionario != null) {
                        questionarioCompilatoService.rimuoviQuestionarioById(idQuestionario);
                    }
                    if (nuovoCittadinoDTO != null && nuovoCittadinoDTO.isNuovoCittadino()) {
                        cittadinoService.removeCittadino(nuovoCittadinoDTO.getCittadinoEntity().getId());
                    }
                    if (nuovoAggiunto) {
                        servizioService.eliminaServizioForce(idServizio);
                        removeFromList(serviziAggiuntiList, idServizio);
                        if (serviziAggiunti > 0)
                            serviziAggiunti--;
                    }
                } catch (Exception exc) {
                    log.info("-XXX- Exception eccezione bonifica record cittadino: {} -XXX-", exc.getMessage());
                    exc.printStackTrace();
                    log.info(
                            "-XXX- Eccezione bonifica record andato in errore in servizio: {} e cittadino {} -XXX-",
                            idServizio,
                            nuovoCittadinoDTO != null && nuovoCittadinoDTO.getCittadinoEntity() != null
                                    ? nuovoCittadinoDTO.getCittadinoEntity().getId()
                                    : "NON ANCORA CREATO");
                }
                continue;
            } catch (Exception e) {
                if (cittadiniAggiunti > 0)
                    cittadiniAggiunti--;
                log.info("-XXX- Eccezione gestita cittadino: {} -XXX-", e.getMessage());
                e.printStackTrace();
                servizioElaborato.getCampiAggiuntiviCSV().setNote(
                        "Impossibile salvare i dati del cittadino, non saranno salvati neanche quelli del servizio.");
                serviziScartati.add(servizioElaborato);
                try {
                    if (idQuestionario != null) {
                        questionarioCompilatoService.rimuoviQuestionarioById(idQuestionario);
                    }
                    if (nuovoCittadinoDTO != null && nuovoCittadinoDTO.isNuovoCittadino()) {
                        cittadinoService.removeCittadino(nuovoCittadinoDTO.getCittadinoEntity().getId());
                    }
                    if (nuovoAggiunto) {
                        servizioService.eliminaServizioForce(idServizio);
                        removeFromList(serviziAggiuntiList, idServizio);
                        if (serviziAggiunti > 0)
                            serviziAggiunti--;
                    }
                } catch (Exception exc) {
                    log.info("-XXX- Exception eccezione bonifica record cittadino: {} -XXX-", exc.getMessage());
                    exc.printStackTrace();
                    log.info(
                            "-XXX- Eccezione bonifica record andato in errore in servizio: {} e cittadino {} -XXX-",
                            idServizio,
                            nuovoCittadinoDTO != null && nuovoCittadinoDTO.getCittadinoEntity() != null
                                    ? nuovoCittadinoDTO.getCittadinoEntity().getId()
                                    : "NON ANCORA CREATO");
                }
                continue;
            }
            try {
                QuestionarioCompilatoRequest questionarioCompilatoRequest = servizioElaborato
                        .getQuestionarioCompilatoRequest();
                questionarioCompilatoRequest.setCodInserimento(registroAttivitaEntity.getId().toString());
                questionariAggiunti++;
                servizioCittadinoRestApi.compilaQuestionario(idQuestionario,            //QUA
                                        questionarioCompilatoRequest);
            } catch (CittadinoException | ServizioException | QuestionarioCompilatoException e) {
                if (questionariAggiunti > 0)
                    questionariAggiunti--;
                log.info("-XXX- Eccezione gestita questionario: {} -XXX-", e.getMessage());
                e.printStackTrace();
                servizioElaborato.getCampiAggiuntiviCSV().setNote(e.getCodiceErroreEnum().getDescrizioneErrore());
                serviziScartati.add(servizioElaborato);
                try {
                    if (idQuestionario != null) {
                        questionarioCompilatoService.rimuoviQuestionarioById(idQuestionario);
                    }
                    if (nuovoCittadinoDTO != null && nuovoCittadinoDTO.getCittadinoEntity() != null) {
                        servizioXCittadinoRepository.deleteRelazioneByIdServizioAndIdCittadino(idServizio,
                                nuovoCittadinoDTO.getCittadinoEntity().getId());
                        if (cittadiniAggiunti > 0)
                            cittadiniAggiunti--;
                    }
                    if (nuovoCittadinoDTO != null && nuovoCittadinoDTO.isNuovoCittadino()) {
                        cittadinoService.removeCittadino(nuovoCittadinoDTO.getCittadinoEntity().getId());
                    }
                    if (nuovoAggiunto) {
                        servizioService.eliminaServizioForce(idServizio);
                        removeFromList(serviziAggiuntiList, idServizio);
                        if (serviziAggiunti > 0)
                            serviziAggiunti--;
                    }
                } catch (Exception exc) {
                    log.info("-XXX- Exception eccezione bonifica record questionario: {} -XXX-", exc.getMessage());
                    exc.printStackTrace();
                    log.info(
                            "-XXX- Eccezione bonifica record andato in errore in servizio: {} e cittadino {} -XXX-",
                            idServizio,
                            nuovoCittadinoDTO != null && nuovoCittadinoDTO.getCittadinoEntity() != null
                                    ? nuovoCittadinoDTO.getCittadinoEntity().getId()
                                    : "NON ANCORA CREATO");
                }
            } catch (RuntimeException e) {
                if (questionariAggiunti > 0)
                    questionariAggiunti--;
                log.info("-XXX- Eccezione gestita questionario: {} -XXX-", e.getMessage());
                e.printStackTrace();
                servizioElaborato.getCampiAggiuntiviCSV().setNote(NoteCSV.NOTE_QUESTIONARIO);
                serviziScartati.add(servizioElaborato);
                try {
                    if (idQuestionario != null) {
                        questionarioCompilatoService.rimuoviQuestionarioById(idQuestionario);
                    }
                    if (nuovoCittadinoDTO != null && nuovoCittadinoDTO.getCittadinoEntity() != null) {
                        servizioXCittadinoRepository.deleteRelazioneByIdServizioAndIdCittadino(idServizio,
                                nuovoCittadinoDTO.getCittadinoEntity().getId());
                        if (cittadiniAggiunti > 0)
                            cittadiniAggiunti--;
                    }
                    if (nuovoCittadinoDTO != null && nuovoCittadinoDTO.isNuovoCittadino()) {
                        cittadinoService.removeCittadino(nuovoCittadinoDTO.getCittadinoEntity().getId());
                    }
                    if (nuovoAggiunto) {
                        servizioService.eliminaServizioForce(idServizio);
                        removeFromList(serviziAggiuntiList, idServizio);
                        if (serviziAggiunti > 0)
                            serviziAggiunti--;
                    }
                } catch (Exception exc) {
                    log.info("-XXX- Exception eccezione bonifica record questionario: {} -XXX-", exc.getMessage());
                    exc.printStackTrace();
                    log.info(
                            "-XXX- Eccezione bonifica record andato in errore in servizio: {} e cittadino {} -XXX-",
                            idServizio,
                            nuovoCittadinoDTO != null && nuovoCittadinoDTO.getCittadinoEntity() != null
                                    ? nuovoCittadinoDTO.getCittadinoEntity().getId()
                                    : "NON ANCORA CREATO");
                }
            } catch (Exception e) {
                if (questionariAggiunti > 0)
                    questionariAggiunti--;
                log.info("-XXX- Eccezione gestita questionario: {} -XXX-", e.getMessage());
                e.printStackTrace();
                servizioElaborato.getCampiAggiuntiviCSV().setNote("Impossibile salvare i dati del questionario.");
                serviziScartati.add(servizioElaborato);
                try {
                    if (idQuestionario != null) {
                        questionarioCompilatoService.rimuoviQuestionarioById(idQuestionario);
                    }
                    if (nuovoCittadinoDTO != null && nuovoCittadinoDTO.getCittadinoEntity() != null) {
                        servizioXCittadinoRepository.deleteRelazioneByIdServizioAndIdCittadino(idServizio,
                                nuovoCittadinoDTO.getCittadinoEntity().getId());
                        if (cittadiniAggiunti > 0)
                            cittadiniAggiunti--;
                    }
                    if (nuovoCittadinoDTO != null && nuovoCittadinoDTO.isNuovoCittadino()) {
                        cittadinoService.removeCittadino(nuovoCittadinoDTO.getCittadinoEntity().getId());
                    }
                    if (nuovoAggiunto) {
                        if (serviziAggiunti > 0)
                            serviziAggiunti--;
                        servizioService.eliminaServizioForce(idServizio);
                        removeFromList(serviziAggiuntiList, idServizio);
                    }
                } catch (Exception exc) {
                    log.info("-XXX- Exception eccezione bonifica record questionario: {} -XXX-", exc.getMessage());
                    exc.printStackTrace();
                    log.info(
                            "-XXX- Eccezione bonifica record andato in errore in servizio: {} e cittadino {} -XXX-",
                            idServizio,
                            nuovoCittadinoDTO != null && nuovoCittadinoDTO.getCittadinoEntity() != null
                                    ? nuovoCittadinoDTO.getCittadinoEntity().getId()
                                    : "NON ANCORA CREATO");
                }
            }

        }
        serviziScartati.sort(Comparator.comparing(
                serviziScartatiDTO -> serviziScartatiDTO.getCampiAggiuntiviCSV().getNumeroRiga()));
        LocalTime now = LocalTime.now();
        String time = now.format(timeFormatter);
        return ElaboratoCSVResponse.builder()
                .fileContent(serviziElaboratiCsvWriter.writeCsv(serviziScartati))
                .response(buildResponseData(serviziScartati, serviziAggiunti, cittadiniAggiunti, questionariAggiunti))
                .fileName(String.format(FILE_NAME, uuid, LocalDate.now(), time))
                .build();
    }

    public void uploadFile(ElaboratoCSVResponse elaboratoCSVResponse, Long registroAttivitaId) throws IOException {
        String presignedUrl = registroAttivitaService.generateUploadPresignedUrl(registroAttivitaId,
                elaboratoCSVResponse.getFileName());
        restTemplateS3Service.uploadDocument(presignedUrl, elaboratoCSVResponse.getFileContent());
    }

    // private boolean controllaDataServizioProgettoValida(Optional<ServizioEntity> servizioOpt,
    //         ServiziElaboratiDTO servizioElaborato, Optional<ProgettoEntity> progettoEntity) {
    //     if (servizioOpt.isPresent()) {
    //         ServizioEntity servizio = servizioOpt.get();
    //         return servizio.getDataServizio().after(progettoEntity.get().getDataInizioProgetto()) &&
    //                 servizio.getDataServizio().before(progettoEntity.get().getDataFineProgetto());
    //     } else {
    //         return servizioElaborato.getServizioRequest().getDataServizio()
    //                 .after(progettoEntity.get().getDataInizioProgetto()) &&
    //                 servizioElaborato.getServizioRequest().getDataServizio()
    //                         .before(progettoEntity.get().getDataFineProgetto());
    //     }
    // }

    // private String recuperaDescrizioneDaMongo(Optional<SezioneQ3Collection>
    // optSezioneQ3Collection, int index) {
    // SezioneQ3Collection sezioneQ3Collection = optSezioneQ3Collection.get();
    // ObjectMapper objectMapper = new ObjectMapper();
    // JsonNode rootNode =
    // objectMapper.valueToTree(sezioneQ3Collection.getSezioneQ3Compilato());
    // JsonNode pathJson = rootNode.path("json");
    // JSONObject jsonObject = new JSONObject(pathJson.asText());
    // JSONArray properties = jsonObject.getJSONArray("properties");
    // JSONObject ultimoOggetto = properties.getJSONObject(index);
    // String ultimaChiave = ultimoOggetto.keys().next();
    // JSONArray ultimoValoreArray = ultimoOggetto.getJSONArray(ultimaChiave);
    // return ultimoValoreArray.getString(0);
    // }

    private String recuperaDescrizioneDaMongo(Optional<SezioneQ3Collection> optSezioneQ3Collection, int index,
            Map<String, String> map) {
        SezioneQ3Collection sezioneQ3Collection = optSezioneQ3Collection.get();
        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode rootNode = objectMapper.valueToTree(sezioneQ3Collection.getSezioneQ3Compilato());
        JsonNode pathJson = rootNode.path("json");
        JSONObject jsonObject = new JSONObject(pathJson.asText());
        JSONArray properties = jsonObject.getJSONArray("properties");
        JSONObject ultimoOggetto = properties.getJSONObject(index);
        String ultimaChiave = ultimoOggetto.keys().next();
        JSONArray ultimoValoreArray = ultimoOggetto.getJSONArray(ultimaChiave);
        if (map != null) {
            String jsonObjectArray = ultimoValoreArray.getString(0);
            for (String key : map.keySet()) {
                jsonObjectArray = jsonObjectArray.replace(key, map.get(key));
            }
            jsonObjectArray = jsonObjectArray.replace(": ", ":");
            log.info("-XXX- Stringa recuperata dall'indice {} : {} -XXX-", index, jsonObjectArray);
            return jsonObjectArray;

        } else {
            log.info("-XXX- Stringa recuperata dall'indice {} : {} -XXX-", index, ultimoValoreArray.getString(0));
            return ultimoValoreArray.getString(0);
        }
    }

    private Optional<SedeEntity> recuperaSedeDaRichiesta(String nominativoSede) {
        return sedeRepository.findSedeByNomeSedeModified(nominativoSede);
    }

    private Optional<UtenteEntity> recuperaUtenteFacilitatoreDaRichiesta(String idFacilitatore,
            String nominativoFacilitatore) {
        // String[] nomeCognome = nominativoFacilitatore.split(" ");
        // String cognome = nomeCognome[0];
        // String nome = nomeCognome[1];
        String nominativoFacilitatoreModified = nominativoFacilitatore.replace(" ", "").toUpperCase();
        Optional<UtenteEntity> optutenteEntity = utenteRepository.findByCodiceFiscale(idFacilitatore);
        if (optutenteEntity.isPresent()) {
            return optutenteEntity;
        }
        List<UtenteEntity> utenteEntities = utenteRepository
                .findByNominativoFacilitatore(nominativoFacilitatoreModified);
        if (!utenteEntities.isEmpty()) {
            return Optional.of(utenteEntities.get(0));
        }
        // List<UtenteEntity> utenteEntities =
        // utenteRepository.findByNomeAndCognome(nome, cognome);
        // if (!utenteEntities.isEmpty()) {
        // return Optional.of(utenteEntities.get(0));
        // }
        return Optional.ofNullable(null);
    }

    private ServiziElaboratiDTOResponse buildResponseData(List<ServiziElaboratiDTO> serviziScartati,
            Integer serviziAggiunti, Integer cittadiniAggiunti, Integer questionariAggiunti) {
        return ServiziElaboratiDTOResponse.builder()
                .serviziScartati(serviziScartati)
                .serviziAggiunti(serviziAggiunti)
                .cittadiniAggiunti(cittadiniAggiunti)
                .questionariAggiunti(questionariAggiunti)
                .build();
    }

    private Optional<ServizioEntity> getServizioByCriteria(ServizioRequest servizioRequest) {
        Optional<List<ServizioEntity>> servizioOpt = servizioSqlRepository
                .findAllByDataServizioAndDurataServizioAndTipologiaServizio(
                        servizioRequest.getDataServizio(),
                        servizioRequest.getDurataServizio(),
                        String.join(", ", servizioRequest.getListaTipologiaServizi()));
        if (servizioOpt.isPresent() && !servizioOpt.get().isEmpty()) {
            List<ServizioEntity> listaServizi = servizioOpt.get();
            return Optional.of(listaServizi.get(0));
        }
        return Optional.empty();
    }

    // private boolean existsByServizioAndEnteSedeProgettoFacilitatoreKey(Long idServizio,
    //         EnteSedeProgettoFacilitatoreKey enteSedeProgettoFacilitatoreKey) {
    //     return servizioSqlRepository.existsByIdAndIdEnteSedeProgettoFacilitatore(idServizio,
    //             enteSedeProgettoFacilitatoreKey);
    // }

    private ServizioEntity salvaServizio(Optional<ServizioEntity> servizioOpt, ServizioRequest servizio, String idRegistroAttivita) {
        servizio.setCodInserimento(idRegistroAttivita);
        return servizioOpt.orElseGet(() -> servizioService.creaServizio(servizio, true));
    }

    private List<ServizioEntity> getServizioByDatiControllo(ServizioRequest servizioRequest,
            EnteSedeProgettoFacilitatoreKey enteSedeProgettoFacilitatoreKey) {
        Optional<List<ServizioEntity>> servizioOpt = servizioSqlRepository
                .findAllByDataServizioAndDurataServizioAndTipologiaServizioAndIdEnteSedeProgettoFacilitatore(
                        servizioRequest.getDataServizio(),
                        servizioRequest.getDurataServizio(),
                        String.join(", ", servizioRequest.getListaTipologiaServizi()), enteSedeProgettoFacilitatoreKey);
        if (servizioOpt.isPresent() && !servizioOpt.get().isEmpty()) {
            List<ServizioEntity> listaServizi = servizioOpt.get();
            return listaServizi;
        }
        return new ArrayList<>();
    }

    private List<ServizioEntity> getServizioByDatiControlloPerSingoloCittadino(ServizioRequest servizioRequest,
            EnteSedeProgettoFacilitatoreKey enteSedeProgettoFacilitatoreKey, Long idCittadino, Long idServizio) {
                SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
                String dateString = dateFormat.format(servizioRequest.getDataServizio());
        Optional<List<ServizioEntity>> servizioOpt = servizioSqlRepository
                .findAllByDataServizioAndDurataServizioAndTipologiaServizioAndIdEnteSedeProgettoFacilitatoreAndIdCittadino(
                        dateString,
                        servizioRequest.getDurataServizio(),
                        String.join(", ", servizioRequest.getListaTipologiaServizi()), 
                        enteSedeProgettoFacilitatoreKey.getIdEnte(),
                        enteSedeProgettoFacilitatoreKey.getIdFacilitatore(),
                        enteSedeProgettoFacilitatoreKey.getIdProgetto(),
                        enteSedeProgettoFacilitatoreKey.getIdSede(),
                        idCittadino,
                        idServizio);
        if (servizioOpt.isPresent() && !servizioOpt.get().isEmpty()) {
            List<ServizioEntity> listaServizi = servizioOpt.get();
            return listaServizi;
        }
        return new ArrayList<>();
    }

    private Optional<ServizioEntity> getServizioDaListaAggiunti(List<ServiziAggiuntiDTO> serviziAggiuntiList,
            ServiziElaboratiDTO servizioElaborato) {

        for (ServiziAggiuntiDTO servizioAggiunto : serviziAggiuntiList) {
            Optional<ServizioEntity> response = Optional.ofNullable(servizioAggiunto.getServizioEntity());
            boolean isStessoServizio = true;
            if (!servizioElaborato.getServizioRequest().getDataServizio()
                    .equals(servizioAggiunto.getServiziElaboratiDTO().getServizioRequest().getDataServizio())) {
                isStessoServizio = false;
            }

            if (!servizioElaborato.getServizioRequest().getDurataServizio()
                    .equals(servizioAggiunto.getServiziElaboratiDTO().getServizioRequest().getDurataServizio())) {
                isStessoServizio = false;
            }

            if (!servizioElaborato.getServizioRequest().getListaTipologiaServizi().equals(
                    servizioAggiunto.getServiziElaboratiDTO().getServizioRequest().getListaTipologiaServizi())) {
                isStessoServizio = false;
            }

            if (!(servizioElaborato.getServizioRequest().getCfUtenteLoggato()
                    .equals(servizioAggiunto.getServiziElaboratiDTO().getServizioRequest().getCfUtenteLoggato()))) {
                isStessoServizio = false;
            }

            if (!(servizioElaborato.getServizioRequest().getIdEnteServizio()
                    .equals(servizioAggiunto.getServiziElaboratiDTO().getServizioRequest().getIdEnteServizio()))) {
                isStessoServizio = false;
            }

            if (!(servizioElaborato.getServizioRequest().getIdProgetto()
                    .equals(servizioAggiunto.getServiziElaboratiDTO().getServizioRequest().getIdProgetto()))) {
                isStessoServizio = false;
            }

            if (!(servizioElaborato.getServizioRequest().getIdSedeServizio()
                    .equals(servizioAggiunto.getServiziElaboratiDTO().getServizioRequest().getIdSedeServizio()))) {
                isStessoServizio = false;
            }

            if (!servizioElaborato.getCampiAggiuntiviCSV().getCompetenzeTrattateSecondoLivello().equals(servizioAggiunto
                    .getServiziElaboratiDTO().getCampiAggiuntiviCSV().getCompetenzeTrattateSecondoLivello())) {
                isStessoServizio = false;
            }

            if (!servizioElaborato.getCampiAggiuntiviCSV().getAmbitoServiziDigitaliTrattati().equals(servizioAggiunto
                    .getServiziElaboratiDTO().getCampiAggiuntiviCSV().getAmbitoServiziDigitaliTrattati())) {
                isStessoServizio = false;
            }

            if (!servizioElaborato.getCampiAggiuntiviCSV().getDescrizioneDettagliServizio().equals(servizioAggiunto
                    .getServiziElaboratiDTO().getCampiAggiuntiviCSV().getDescrizioneDettagliServizio())) {
                isStessoServizio = false;
            }

            if (isStessoServizio) {
                return response;
            }
        }

        return Optional.empty();
    }

    private List<ServiziAggiuntiDTO> removeFromList(List<ServiziAggiuntiDTO> lista, Long id) {
        List<ServiziAggiuntiDTO> listaresult = lista.stream()
                .filter(element -> !element.getServizioEntity().getId().equals(id)).collect(Collectors.toList());
        return listaresult;
    }

    public PolicyEnum recuperaPolicydaProgetto(Long idProgetto){
        ProgettoEntity progettoEntity = progettoService.getProgettoById(idProgetto);
        return progettoEntity.getProgramma().getPolicy();
    }


    private Boolean checkUguaglianzaServizio(ServizioEntity servizioActual,
            ServiziElaboratiDTO servizioElaborato) {

        Optional<SezioneQ3Collection> optSezioneQ3Collection = sezioneQ3Respository.findById(servizioActual.getIdTemplateCompilatoQ3());
        if (optSezioneQ3Collection.isPresent()) {
            // String descrizioneMongo = recuperaDescrizioneDaMongo(optSezioneQ3Collection);
            if (!recuperaDescrizioneDaMongo(optSezioneQ3Collection, 6, null).equalsIgnoreCase(
                    servizioElaborato.getCampiAggiuntiviCSV().getDescrizioneDettagliServizio())) {
                return false;
            }
            if (!recuperaDescrizioneDaMongo(optSezioneQ3Collection, 5, CSVMapUtil.getSE6Map())
                    .equalsIgnoreCase(servizioElaborato.getCampiAggiuntiviCSV()
                            .getAmbitoServiziDigitaliTrattati().replace(" ", ""))) {
                return false;
            }
            if (!recuperaDescrizioneDaMongo(optSezioneQ3Collection, 4, CSVMapUtil.getSE5Map())
                    .equalsIgnoreCase(servizioElaborato.getCampiAggiuntiviCSV()
                            .getCompetenzeTrattateSecondoLivello().replace(" ", ""))) {
                return false;
            }
        }

        return true;

    }

    @Transactional
    private void rollbackCaricamentoMassivo(Long idRegistroAttivita) throws Exception {

        servizioXCittadinoRepository.deleteAllByCodInserimento(idRegistroAttivita.toString());

        List<ServizioEntity> listaServizi = servizioSqlRepository.findAllByCodInserimentoWithoutSXC(idRegistroAttivita.toString());
        List<QuestionarioCompilatoEntity> listaQuestionari = questionarioCompilatoRepository.findByCodInserimento(idRegistroAttivita.toString());

        servizioService.eliminaQuestionariMongoByListaQuestionari(listaQuestionari);
        servizioService.eliminaServiziMongoByListaServizi(listaServizi);

        questionarioCompilatoRepository.deleteAllByCodInserimento(idRegistroAttivita.toString());

        servizioService.eliminaTipologiaServizioByListaServizi(listaServizi);

        servizioService.eliminaServiziByListaServizi(listaServizi);

    }
}
