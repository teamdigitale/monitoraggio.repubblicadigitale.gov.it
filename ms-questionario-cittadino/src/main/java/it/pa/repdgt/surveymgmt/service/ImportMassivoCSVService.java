package it.pa.repdgt.surveymgmt.service;

import it.pa.repdgt.shared.entity.*;
import it.pa.repdgt.shared.exception.CodiceErroreEnum;
import it.pa.repdgt.surveymgmt.components.ServiziElaboratiCsvWriter;
import it.pa.repdgt.surveymgmt.constants.NoteCSV;
import it.pa.repdgt.surveymgmt.dto.ServiziElaboratiDTO;
import it.pa.repdgt.surveymgmt.dto.ServiziElaboratiDTOResponse;
import it.pa.repdgt.surveymgmt.exception.CittadinoException;
import it.pa.repdgt.surveymgmt.exception.QuestionarioCompilatoException;
import it.pa.repdgt.surveymgmt.exception.ResourceNotFoundException;
import it.pa.repdgt.surveymgmt.exception.ServizioException;
import it.pa.repdgt.surveymgmt.model.ElaboratoCSVRequest;
import it.pa.repdgt.surveymgmt.model.ElaboratoCSVResponse;
import it.pa.repdgt.surveymgmt.repository.*;
import it.pa.repdgt.surveymgmt.request.QuestionarioCompilatoRequest;
import it.pa.repdgt.surveymgmt.request.ServizioRequest;
import it.pa.repdgt.surveymgmt.restapi.ServizioCittadinoRestApi;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.IncorrectResultSizeDataAccessException;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class ImportMassivoCSVService {
    private final ProgettoRepository progettoRepository;
    private final ProgrammaRepository programmaRepository;
    private final SedeRepository sedeRepository;
    private final UtenteRepository utenteRepository;
    private final ServiziElaboratiCsvWriter serviziElaboratiCsvWriter;
    private final ServizioService servizioService;
    private final CittadiniServizioService cittadiniServizioService;
    private final ServizioCittadinoRestApi servizioCittadinoRestApi;
    private final ServizioSqlRepository servizioSqlRepository;
    private final EnteSedeProgettoFacilitatoreRepository enteSedeProgettoFacilitatoreRepository;
    private static final String FILE_NAME = "%s_righe_scartate_%s_%s.csv";

    private String uuid = UUID.randomUUID().toString().replaceAll("-", "");

    private LocalTime now = LocalTime.now();

    private DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH-mm", Locale.ITALIAN);

    private String time = now.format(timeFormatter);

    @Transactional
    public ElaboratoCSVResponse process(ElaboratoCSVRequest csvRequest) {
        List<ServiziElaboratiDTO> serviziValidati = csvRequest.getServiziValidati();
        List<ServiziElaboratiDTO> serviziScartati = csvRequest.getServiziScartati();
        return buildResponse(serviziValidati, serviziScartati);
    }

    private ElaboratoCSVResponse buildResponse(List<ServiziElaboratiDTO> serviziValidati,
            List<ServiziElaboratiDTO> serviziScartati) {
        Long idServizio;
        Integer serviziAggiunti = 0;
        Integer cittadiniAggiunti = 0;
        Integer questionariAggiunti = 0;
        String idQuestionario;
        for (ServiziElaboratiDTO servizioElaborato : serviziValidati) {
            Optional<ServizioEntity> servizioOpt = getServizioByCriteria(servizioElaborato.getServizioRequest());
            try {
                if (!servizioOpt.isPresent()) {
                    serviziAggiunti++;
                }
                Optional<UtenteEntity> utenteFacilitatoreDellaRichiesta = recuperaUtenteFacilitatoreDaRichiesta(
                        servizioElaborato.getCampiAggiuntiviCSV().getIdFacilitatore(),
                        servizioElaborato.getCampiAggiuntiviCSV().getNominativoFacilitatore());
                if (!utenteFacilitatoreDellaRichiesta.isPresent()) {
                    throw new ResourceNotFoundException(NoteCSV.NOTE_FACILITATORE_NON_PRESENTE, CodiceErroreEnum.C01);
                }
                Optional<SedeEntity> optSedeRecuperata = recuperaSedeDaRichiesta(
                        servizioElaborato.getServizioRequest().getIdSedeServizio(),
                        servizioElaborato.getCampiAggiuntiviCSV().getNominativoSede());
                if (!optSedeRecuperata.isPresent()) {
                    throw new ResourceNotFoundException(NoteCSV.NOTE_SEDE_NON_PRESENTE, CodiceErroreEnum.C01);
                }
                SedeEntity sedeRecuperata = optSedeRecuperata.get();
                UtenteEntity utenteRecuperato = utenteFacilitatoreDellaRichiesta.get();
                ServizioRequest servizioRequest = servizioElaborato.getServizioRequest();
                servizioRequest.setCfUtenteLoggato(utenteRecuperato.getCodiceFiscale());
                servizioRequest.setIdSedeServizio(sedeRecuperata.getId());
                EnteSedeProgettoFacilitatoreEntity enteSedeProgettoFacilitatore = enteSedeProgettoFacilitatoreRepository
                        .existsByChiave(servizioRequest.getCfUtenteLoggato(),
                                servizioRequest.getIdEnteServizio(),
                                servizioRequest.getIdProgetto(),
                                servizioRequest.getIdSedeServizio());
                if (enteSedeProgettoFacilitatore == null) {
                    throw new ResourceNotFoundException(NoteCSV.NOTE_UTENTE_SEDE_NON_ASSOCIATI_AL_PROGETTO,
                            CodiceErroreEnum.C01);
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
                Optional<ProgettoEntity> progettoEntity = progettoRepository.findById(servizioRequest.getIdProgetto());
                if (progettoEntity.isPresent()) {
                    questionarioCompilatoRequest.setIdProgramma(progettoEntity.get().getProgramma().getId());
                } else {
                    throw new ResourceNotFoundException(NoteCSV.NOTE_PROGETTO_NON_PRESENTE, CodiceErroreEnum.C01);
                }
                servizioElaborato.setQuestionarioCompilatoRequest(questionarioCompilatoRequest);
                ServizioEntity servizioEntity = salvaServizio(servizioOpt, servizioElaborato.getServizioRequest());
                idServizio = servizioEntity.getId();
            } catch (ResourceNotFoundException ex) {
                if (serviziAggiunti > 0)
                    serviziAggiunti--;
                servizioElaborato.getCampiAggiuntiviCSV().setNote(ex.getMessage());
                serviziScartati.add(servizioElaborato);
                continue;
            } catch (RuntimeException e) {
                if (serviziAggiunti > 0)
                    serviziAggiunti--;
                servizioElaborato.getCampiAggiuntiviCSV().setNote(e.getMessage());
                serviziScartati.add(servizioElaborato);
                continue;
            }
            try {
                cittadiniAggiunti++;
                CittadinoEntity cittadinoEntity = cittadiniServizioService.creaNuovoCittadinoImportCsv(idServizio,
                        servizioElaborato.getNuovoCittadinoServizioRequest());
                idQuestionario = cittadinoEntity.getQuestionarioCompilato().get(0).getId();
            } catch (CittadinoException | ServizioException e) {
                if (cittadiniAggiunti > 0)
                    cittadiniAggiunti--;
                servizioElaborato.getCampiAggiuntiviCSV().setNote(e.getCodiceErroreEnum().getDescrizioneErrore());
                serviziScartati.add(servizioElaborato);
                continue;
            } catch (IncorrectResultSizeDataAccessException incorrectException) {
                if (cittadiniAggiunti > 0)
                    cittadiniAggiunti--;
                servizioElaborato.getCampiAggiuntiviCSV().setNote(NoteCSV.NOTE_CITTADINO_PRESENTE);
                serviziScartati.add(servizioElaborato);
                continue;
            } catch (RuntimeException e) {
                if (cittadiniAggiunti > 0)
                    cittadiniAggiunti--;
                servizioElaborato.getCampiAggiuntiviCSV().setNote(NoteCSV.NOTE_CITTADINO);
                serviziScartati.add(servizioElaborato);
                continue;
            }
            try {
                questionariAggiunti++;
                servizioCittadinoRestApi.compilaQuestionario(idQuestionario,
                        servizioElaborato.getQuestionarioCompilatoRequest());
            } catch (CittadinoException | ServizioException | QuestionarioCompilatoException e) {
                if (questionariAggiunti > 0)
                    questionariAggiunti--;
                servizioElaborato.getCampiAggiuntiviCSV().setNote(e.getCodiceErroreEnum().getDescrizioneErrore());
                serviziScartati.add(servizioElaborato);
            } catch (RuntimeException e) {
                if (questionariAggiunti > 0)
                    questionariAggiunti--;
                servizioElaborato.getCampiAggiuntiviCSV().setNote(NoteCSV.NOTE_QUESTIONARIO);
                serviziScartati.add(servizioElaborato);
            }
        }
        return ElaboratoCSVResponse.builder()
                .fileContent(Base64.getEncoder()
                        .encodeToString(serviziElaboratiCsvWriter.writeCsv(serviziScartati).getBytes()))
                .response(buildResponseData(serviziScartati, serviziAggiunti, cittadiniAggiunti, questionariAggiunti))
                .fileName(String.format(FILE_NAME, uuid, LocalDate.now(), time))
                .build();
    }

    private Optional<SedeEntity> recuperaSedeDaRichiesta(Long idSedeServizio, String nominativoSede) {
        if ((idSedeServizio != null && nominativoSede == null) || (idSedeServizio == null && nominativoSede != null)) {
            return sedeRepository.findByIdOrNomeIgnoreCase(idSedeServizio, nominativoSede);
        } else {
            return sedeRepository.findByIdAndNomeIgnoreCase(idSedeServizio, nominativoSede);
        }
    }

    private Optional<UtenteEntity> recuperaUtenteFacilitatoreDaRichiesta(String idFacilitatore,
            String nominativoFacilitatore) {
        String[] nomeCognome = nominativoFacilitatore.split(" ");
        String cognome = nomeCognome[0];
        String nome = nomeCognome[1];
        Optional<UtenteEntity> optutenteEntity = utenteRepository.findByCodiceFiscale(idFacilitatore);
        if (optutenteEntity.isPresent()) {
            return optutenteEntity;
        }
        List<UtenteEntity> utenteEntities = utenteRepository.findByNomeAndCognome(nome, cognome);
        if (!utenteEntities.isEmpty()) {
            return Optional.of(utenteEntities.get(0));
        }
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

    private ServizioEntity salvaServizio(Optional<ServizioEntity> servizioOpt, ServizioRequest servizio) {
        return servizioOpt.orElseGet(() -> servizioService.creaServizio(servizio));
    }

}