package it.pa.repdgt.gestioneutente.service;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import javax.transaction.Transactional;
import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import it.pa.repdgt.gestioneutente.bean.DettaglioRuoliBean;
import it.pa.repdgt.gestioneutente.bean.DettaglioUtenteBean;
import it.pa.repdgt.gestioneutente.bean.SchedaUtenteBean;
import it.pa.repdgt.gestioneutente.bean.SchedaUtenteBeanLight;
import it.pa.repdgt.gestioneutente.dto.UtenteDto;
import it.pa.repdgt.gestioneutente.entity.projection.ProgettoEnteProjection;
import it.pa.repdgt.gestioneutente.exception.ResourceNotFoundException;
import it.pa.repdgt.gestioneutente.exception.RuoloException;
import it.pa.repdgt.gestioneutente.exception.UtenteException;
import it.pa.repdgt.gestioneutente.repository.EnteRepository;
import it.pa.repdgt.gestioneutente.repository.EnteSedeProgettoFacilitatoreRepository;
import it.pa.repdgt.gestioneutente.repository.ReferentiDelegatiEnteGestoreProgettoRepository;
import it.pa.repdgt.gestioneutente.repository.ReferentiDelegatiEnteGestoreProgrammaRepository;
import it.pa.repdgt.gestioneutente.repository.ReferentiDelegatiEntePartnerDiProgettoRepository;
import it.pa.repdgt.gestioneutente.repository.UtenteRepository;
import it.pa.repdgt.gestioneutente.repository.UtenteXRuoloRepository;
import it.pa.repdgt.gestioneutente.request.AggiornaUtenteRequest;
import it.pa.repdgt.gestioneutente.request.FiltroRequest;
import it.pa.repdgt.gestioneutente.request.UtenteRequest;
import it.pa.repdgt.gestioneutente.resource.ListaUtentiResource;
import it.pa.repdgt.gestioneutente.resource.UtenteImmagineResource;
import it.pa.repdgt.shared.annotation.LogExecutionTime;
import it.pa.repdgt.shared.annotation.LogMethod;
import it.pa.repdgt.shared.awsintegration.service.EmailService;
import it.pa.repdgt.shared.awsintegration.service.S3Service;
import it.pa.repdgt.shared.constants.RuoliUtentiConstants;
import it.pa.repdgt.shared.entity.EnteEntity;
import it.pa.repdgt.shared.entity.EntePartnerEntity;
import it.pa.repdgt.shared.entity.EnteSedeProgettoFacilitatoreEntity;
import it.pa.repdgt.shared.entity.IntegrazioniUtenteEntity;
import it.pa.repdgt.shared.entity.ProgettoEntity;
import it.pa.repdgt.shared.entity.ProgrammaEntity;
import it.pa.repdgt.shared.entity.ReferentiDelegatiEnteGestoreProgettoEntity;
import it.pa.repdgt.shared.entity.ReferentiDelegatiEnteGestoreProgrammaEntity;
import it.pa.repdgt.shared.entity.ReferentiDelegatiEntePartnerDiProgettoEntity;
import it.pa.repdgt.shared.entity.RuoloEntity;
import it.pa.repdgt.shared.entity.UtenteEntity;
import it.pa.repdgt.shared.entity.UtenteXRuolo;
import it.pa.repdgt.shared.entity.key.EnteSedeProgettoFacilitatoreKey;
import it.pa.repdgt.shared.entity.key.ReferentiDelegatiEnteGestoreProgettoKey;
import it.pa.repdgt.shared.entity.key.ReferentiDelegatiEnteGestoreProgrammaKey;
import it.pa.repdgt.shared.entity.key.ReferentiDelegatiEntePartnerDiProgettoKey;
import it.pa.repdgt.shared.entity.key.UtenteXRuoloKey;
import it.pa.repdgt.shared.entityenum.EmailTemplateEnum;
import it.pa.repdgt.shared.entityenum.PolicyEnum;
import it.pa.repdgt.shared.entityenum.StatoEnum;
import it.pa.repdgt.shared.exception.CodiceErroreEnum;
import it.pa.repdgt.shared.restapi.param.SceltaProfiloParam;
import it.pa.repdgt.shared.util.Utils;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class UtenteService {
	@Autowired
	private UtenteXRuoloService utenteXRuoloService;
	@Autowired
	private UtenteXRuoloRepository utenteXRuoloRepository;
	@Autowired
	private  EnteSedeProgettoFacilitatoreService enteSedeProgettoFacilitatoreService;
	@Autowired
	private EnteSedeProgettoFacilitatoreRepository enteSedeProgettoFacilitatoreRepository;
	@Autowired
	private RuoloService ruoloService;
	@Autowired
	private ProgrammaService programmaService;
	@Autowired
	private ProgettoService progettoService;
	@Autowired
	private EntePartnerService entePartnerService;
	@Autowired
	private UtenteRepository utenteRepository;
	@Autowired
	private EnteRepository enteRepository;
	@Autowired 
	private EmailService emailService;
	@Autowired
	private ReferentiDelegatiEnteGestoreProgrammaRepository referentiDelegatiEnteGestoreProgrammaRepository;
	@Autowired
	private ReferentiDelegatiEnteGestoreProgettoRepository referentiDelegatiEnteGestoreProgettoRepository;
	@Autowired
	private ReferentiDelegatiEntePartnerDiProgettoRepository referentiDelegatiEntePartnerDiProgettoRepository;
	@Autowired
	private S3Service s3Service;

	@Value("${AWS.S3.BUCKET-NAME:}")
	private String nomeDelBucketS3;
	@Value("${AWS.S3.PRESIGN_URL-EXPIRE-SCHEDAUTENTE:15}")
	private String presignedUrlExpireSchedaUtente;
	@Value("${AWS.S3.PRESIGN_URL-EXPIRE-CONTESTO:15}")
	private String presignedUrlExpireContesto;
	private static final String PREFIX_FILE_IMG_PROFILO = "immagineProfilo-";

	@LogExecutionTime
	@LogMethod
	public List<UtenteEntity> getAllUtenti() {
		return this.utenteRepository.findAll();
	}

	@LogMethod
	@LogExecutionTime
	public List<UtenteDto> getAllUtentiPaginati(UtenteRequest sceltaContesto, Integer currPage, Integer pageSize) {
		return this.getUtentiPaginatiByRuolo(sceltaContesto.getCodiceRuoloUtenteLoggato(), sceltaContesto.getCfUtenteLoggato(), sceltaContesto.getIdProgramma(), sceltaContesto.getIdProgetto(), sceltaContesto.getIdEnte(), sceltaContesto.getFiltroRequest(),currPage, pageSize);
	}

	@LogMethod
	@LogExecutionTime
	public List<UtenteDto> getUtentiConRuoliAggregati(List<UtenteEntity> utenti){
		return utenti.stream()
				.map(utente -> {
					UtenteDto utenteDto = new UtenteDto();
					utenteDto.setId(utente.getId());
					utenteDto.setNome(utente.getCognome() + " " + utente.getNome());
					utenteDto.setCodiceFiscale(utente.getCodiceFiscale());
					utenteDto.setStato(utente.getStato());

					StringBuilder ruoliAggregati = new StringBuilder();
					utente.getRuoli()
					.stream()
					.forEach(ruolo -> {
						Integer countRuolo = 0;
						String codiceRuolo = ruolo.getCodice();
						switch (codiceRuolo) {
						case "REG":
						case "DEG":
							countRuolo = referentiDelegatiEnteGestoreProgrammaRepository.countByCfUtenteAndCodiceRuolo(utente.getCodiceFiscale(), ruolo.getCodice());
							break;
						case "REGP":
						case "DEGP":
							countRuolo = referentiDelegatiEnteGestoreProgettoRepository.countByCfUtenteAndCodiceRuolo(utente.getCodiceFiscale(), ruolo.getCodice());
							break;
						case "REPP":
						case "DEPP":
							countRuolo = referentiDelegatiEntePartnerDiProgettoRepository.countByCfUtenteAndCodiceRuolo(utente.getCodiceFiscale(), ruolo.getCodice());
							break;
						case "FAC":
						case "VOL":
							countRuolo = enteSedeProgettoFacilitatoreService.countByIdFacilitatore(utente.getCodiceFiscale(), ruolo.getCodice());
							break;
						default:
							countRuolo = 1;
							break;
						}
						for(int i = 0; i < countRuolo; i++)
							ruoliAggregati.append(ruolo.getNome()).append(", ");
					});

					if(ruoliAggregati.length() > 0) {
						utenteDto.setRuoli(ruoliAggregati.substring(0, ruoliAggregati.length()-2));
					} else {
						utenteDto.setRuoli("");
					}

					return utenteDto;
				})
				.collect(Collectors.toList());
	}

	@LogMethod
	@LogExecutionTime
	public List<UtenteDto> getUtentiPaginatiByRuolo(String codiceRuolo, String cfUtente, Long idProgramma, Long idProgetto, Long idEnte, FiltroRequest filtroRequest, Integer currPage, Integer pageSize) {
		List<UtenteEntity> listaUtenti = new ArrayList<>();
		Set<UtenteEntity> utenti = new HashSet<>();

		switch (codiceRuolo) {
		case "DTD":
			utenti = this.getUtentiByFiltri(filtroRequest, currPage, pageSize);
			listaUtenti.addAll(utenti);
			break;
		case "DSCU":
			listaUtenti.addAll(this.getUtentiPerDSCU(filtroRequest, currPage, pageSize));
			break;
		case "REG":
		case "DEG":
			listaUtenti.addAll(this.getUtentiPerReferenteDelegatoGestoreProgramma(idProgramma, cfUtente, filtroRequest, currPage, pageSize));
			break;
		case "REGP":
		case "DEGP":
			listaUtenti.addAll(this.getUtentiPerReferenteDelegatoGestoreProgetti(idProgetto, cfUtente, filtroRequest, currPage, pageSize));
			break;
		case "REPP":
		case "DEPP":
			listaUtenti.addAll(this.getUtentiPerReferenteDelegatoEntePartnerProgetti(idProgetto, idEnte, cfUtente, filtroRequest, currPage, pageSize));
			break;
		case "FAC":
		case "VOL":
			break;
		default:
			utenti = this.getUtentiByFiltri(filtroRequest, currPage, pageSize);
			listaUtenti.addAll(utenti);
			break;
		}
		return this.getUtentiConRuoliAggregati(listaUtenti);
	}

	private Set<UtenteEntity> getUtentiPerReferenteDelegatoEntePartnerProgetti(Long idProgetto, Long idEnte,
			String cfUtente, FiltroRequest filtroRequest, Integer currPage, Integer pageSize) {
		return this.utenteRepository.findUtentiPerReferenteDelegatoEntePartnerProgetti(
				idProgetto,
				idEnte,
				cfUtente, 
				filtroRequest.getCriterioRicerca(),
				"%" + filtroRequest.getCriterioRicerca() + "%",
				filtroRequest.getRuoli(),
				filtroRequest.getStati(),
				currPage*pageSize,
				pageSize);
	}

	private Set<UtenteEntity> getUtentiPerReferenteDelegatoGestoreProgetti(Long idProgetto,
			String cfUtente, FiltroRequest filtroRequest, Integer currPage, Integer pageSize) {
		//nel caso di REGP/DEGP non viene applicato il filtro degli stati perché si presume che possa vedere tutti gli utenti legati almeno ad un ruolo,
		//quindi sono sempre attivi
		return this.utenteRepository.findUtentiPerReferenteDelegatoGestoreProgetti(
				idProgetto,
				cfUtente, 
				filtroRequest.getCriterioRicerca(),
				"%" + filtroRequest.getCriterioRicerca() + "%",
				filtroRequest.getRuoli(),
				filtroRequest.getStati(),
				currPage*pageSize,
				pageSize);
	}

	private Set<UtenteEntity> getUtentiPerReferenteDelegatoGestoreProgramma(Long idProgramma, String cfUtente, FiltroRequest filtroRequest, Integer currPage, Integer pageSize) {
		//nel caso di REG/DEG non viene applicato il filtro degli stati perché si presume che possa vedere tutti gli utenti legati almeno ad un ruolo,
		//quindi sono sempre attivi
		return this.utenteRepository.findUtentiPerReferenteDelegatoGestoreProgramma(
				idProgramma,
				cfUtente,
				filtroRequest.getCriterioRicerca(),
				"%" + filtroRequest.getCriterioRicerca() + "%",
				filtroRequest.getRuoli(),
				filtroRequest.getStati(),
				currPage*pageSize,
				pageSize);
	}

	private Set<UtenteEntity> getUtentiPerDSCU(FiltroRequest filtroRequest, Integer currPage, Integer pageSize) {
		//nel caso di DSCU non viene applicato il filtro degli stati perché si presume che il DSCU possa vedere tutti gli utenti legati almeno ad un ruolo,
		//quindi sono sempre attivi
		return this.utenteRepository.findUtentiPerDSCU(
				filtroRequest.getCriterioRicerca(),
				"%" + filtroRequest.getCriterioRicerca() + "%",
				filtroRequest.getRuoli(),
				filtroRequest.getStati(),
				currPage*pageSize,
				pageSize
				);
	}

	@LogMethod
	@LogExecutionTime
	public UtenteEntity getUtenteByCodiceFiscale(String  codiceFiscaleUtente) {
		String messaggioErrore = String.format("risorsa con codice Fiscale=%s non trovata", codiceFiscaleUtente);
		return this.utenteRepository.findByCodiceFiscale(codiceFiscaleUtente)
				.orElseThrow(() -> new ResourceNotFoundException(messaggioErrore, CodiceErroreEnum.C01) );
	}

	@LogMethod
	@LogExecutionTime
	public UtenteEntity getUtenteById(Long idUtente) {
		String messaggioErrore = String.format("risorsa con id=%s non trovata", idUtente);
		return this.utenteRepository.findById(idUtente)
				.orElseThrow(() -> new ResourceNotFoundException(messaggioErrore, CodiceErroreEnum.C01) );
	}

	@LogMethod
	@LogExecutionTime
	public UtenteEntity getUtenteEagerByCodiceFiscale(String codiceFiscale) {
		return this.utenteRepository.findUtenteEagerByCodiceFiscale(codiceFiscale);
	}

	@LogExecutionTime
	@LogMethod
	@Transactional
	public UtenteEntity creaNuovoUtente(UtenteEntity utente, String codiceRuolo) {
		if(isEmailDuplicata(utente.getEmail(), utente.getCodiceFiscale())) {
			throw new UtenteException("ERRORE: non possono esistere a sistema due email per due utenti diversi", CodiceErroreEnum.U21);
		}
		// Verifico se esiste sul DB un utente con stesso codice fiscale e in caso affermativo lancio eccezione
		Optional<UtenteEntity> utenteDBFetch = this.utenteRepository.findByCodiceFiscale(utente.getCodiceFiscale());
		if(utenteDBFetch.isPresent()) {
			throw new UtenteException(String.format("Utente con codice fiscale '%s' già esistente", utente.getCodiceFiscale()), CodiceErroreEnum.U01);
		}

		utente.setStato(StatoEnum.NON_ATTIVO.getValue());
		RuoloEntity ruolo = this.ruoloService.getRuoloByCodiceRuolo(codiceRuolo);
		utente.getRuoli().add(ruolo);
		utente.setDataOraCreazione(new Date());
		utente.setDataOraAggiornamento(utente.getDataOraCreazione());
		utente.setNome(Utils.toCamelCase(utente.getNome()));
		utente.setCognome(utente.getCognome().toUpperCase());

		IntegrazioniUtenteEntity integrazione = new IntegrazioniUtenteEntity();
		integrazione.setUtente(utente);
		integrazione.setDataOraAggiornamento(new Date());
		integrazione.setDataOraCreazione(new Date());
		integrazione.setUtenteRegistratoInRocketChat(false);
		integrazione.setUtenteRegistratoInWorkdocs(false);

		utente.setIntegrazioneUtente(integrazione);

		final UtenteEntity utenteSalvato = this.salvaUtente(utente);
		if(!ruolo.getPredefinito()) {
			// stacco un thread per invio email al nuovo utente censito
			new Thread(() ->{
				try {
					this.emailService.inviaEmail(utenteSalvato.getEmail(),
							EmailTemplateEnum.RUOLO_CUSTOM,
							new String[] { utente.getNome(), codiceRuolo});
				}catch(Exception ex) {
					log.error("Impossibile inviare la mail al nuovo utente censito con codice fiscale {}", utente.getCodiceFiscale());
					log.error("{}", ex);
				}
			}).start();
		}

		return utenteSalvato;
	}

	private boolean isEmailDuplicata(String email, String codiceFiscale) {
		return this.utenteRepository.findByEmailAndCodiceFiscaleNot(email, codiceFiscale).isPresent();
	}

	private boolean isEmailDuplicataPerId(String email, Long id) {
		return this.utenteRepository.findByEmailAndIdNot(email, id).isPresent();
	}

	@Transactional
	@LogExecutionTime
	@LogMethod
	public void aggiornaUtente(AggiornaUtenteRequest aggiornaUtenteRequest, Long idUtente) {
		UtenteEntity utenteFetchDB = null;
		try {
			utenteFetchDB = this.getUtenteById(idUtente);
		} catch (ResourceNotFoundException ex) {
			String messaggioErrore = String.format("utente con id=%s non trovato", idUtente);
			throw new UtenteException(messaggioErrore, ex, CodiceErroreEnum.U11);
		}
		if(isEmailDuplicataPerId(aggiornaUtenteRequest.getEmail(),idUtente)) {
			throw new UtenteException("ERRORE: non possono esistere a sistema due email per due utenti diversi", CodiceErroreEnum.U21);
		}
		
		if(!utenteFetchDB.getCodiceFiscale().equals(aggiornaUtenteRequest.getCodiceFiscale())) {
			
			String codiceFiscaleCorrente = utenteFetchDB.getCodiceFiscale();
			String codiceFiscaleDaAggiornare = aggiornaUtenteRequest.getCodiceFiscale();
			
			if(this.utenteRepository.findUtenteByCodiceFiscaleAndIdDiverso(codiceFiscaleDaAggiornare, idUtente).isPresent()) {
				String messaggioErrore = String.format("utente con codice fiscale=%s già presente", aggiornaUtenteRequest.getCodiceFiscale());
				throw new UtenteException(messaggioErrore, CodiceErroreEnum.U01);
			}
			//se è stato modificato il CF potenzialmente devo aggiornarlo in tutte le tabelle in cui è presente come FK
			List<UtenteXRuolo> ruoliUtente = utenteXRuoloService.getListUtenteXRuoloByCfUtenteAndCodiceRuolo(codiceFiscaleCorrente);
			List<UtenteXRuolo> ruoliUtenteUpd = new ArrayList<UtenteXRuolo>();
			for(UtenteXRuolo utenteXruolo: ruoliUtente) {				
				utenteXRuoloRepository.delete(utenteXruolo);
				utenteXRuoloRepository.flush();
				
				UtenteXRuolo utenteXruoloUpd = new UtenteXRuolo();
				utenteXruoloUpd.setDataOraAggiornamento(utenteXruolo.getDataOraAggiornamento());
				utenteXruoloUpd.setDataOraCreazione(utenteXruolo.getDataOraCreazione());
				utenteXruoloUpd.setId(new UtenteXRuoloKey(codiceFiscaleDaAggiornare, utenteXruolo.getId().getRuoloCodice()));
				
				ruoliUtenteUpd.add(utenteXruoloUpd);
			}
			
			List<ReferentiDelegatiEnteGestoreProgrammaEntity> refDegGestProgramma = referentiDelegatiEnteGestoreProgrammaRepository.findByCodFiscaleUtente(codiceFiscaleCorrente);
			List<ReferentiDelegatiEnteGestoreProgrammaEntity> refDegGestProgrammaUpd = new ArrayList<ReferentiDelegatiEnteGestoreProgrammaEntity>();
			for(ReferentiDelegatiEnteGestoreProgrammaEntity refDegGestProgrammaRec: refDegGestProgramma) {				
				referentiDelegatiEnteGestoreProgrammaRepository.delete(refDegGestProgrammaRec);
				referentiDelegatiEnteGestoreProgrammaRepository.flush();
				
				ReferentiDelegatiEnteGestoreProgrammaEntity refDegGestProgrammaRecUpd = new ReferentiDelegatiEnteGestoreProgrammaEntity();
				refDegGestProgrammaRecUpd.setCodiceRuolo(refDegGestProgrammaRec.getCodiceRuolo());
				refDegGestProgrammaRecUpd.setDataOraAggiornamento(refDegGestProgrammaRec.getDataOraAggiornamento());
				refDegGestProgrammaRecUpd.setDataOraAttivazione(refDegGestProgrammaRec.getDataOraAttivazione());
				refDegGestProgrammaRecUpd.setDataOraCreazione(refDegGestProgrammaRec.getDataOraCreazione());
				refDegGestProgrammaRecUpd.setDataOraTerminazione(refDegGestProgrammaRec.getDataOraTerminazione());
				refDegGestProgrammaRecUpd.setId(new ReferentiDelegatiEnteGestoreProgrammaKey(refDegGestProgrammaRec.getId().getIdProgramma(), 
						codiceFiscaleDaAggiornare, 
						refDegGestProgrammaRec.getId().getIdEnte()));
				refDegGestProgrammaRecUpd.setStatoUtente(refDegGestProgrammaRec.getStatoUtente());
				
				refDegGestProgrammaUpd.add(refDegGestProgrammaRecUpd);
			}
			
			List<ReferentiDelegatiEnteGestoreProgettoEntity> refDegGestProgetto = referentiDelegatiEnteGestoreProgettoRepository.findByCodFiscaleUtente(codiceFiscaleCorrente);
			List<ReferentiDelegatiEnteGestoreProgettoEntity> refDegGestProgettoUpd = new ArrayList<ReferentiDelegatiEnteGestoreProgettoEntity>();
			for(ReferentiDelegatiEnteGestoreProgettoEntity refDegGestProgettoRec: refDegGestProgetto) {				
				referentiDelegatiEnteGestoreProgettoRepository.delete(refDegGestProgettoRec);
				referentiDelegatiEnteGestoreProgettoRepository.flush();
				
				ReferentiDelegatiEnteGestoreProgettoEntity refDegGestProgettoRecUpd = new ReferentiDelegatiEnteGestoreProgettoEntity();
				refDegGestProgettoRecUpd.setCodiceRuolo(refDegGestProgettoRec.getCodiceRuolo());
				refDegGestProgettoRecUpd.setDataOraAggiornamento(refDegGestProgettoRec.getDataOraAggiornamento());
				refDegGestProgettoRecUpd.setDataOraAttivazione(refDegGestProgettoRec.getDataOraAttivazione());
				refDegGestProgettoRecUpd.setDataOraCreazione(refDegGestProgettoRec.getDataOraCreazione());
				refDegGestProgettoRecUpd.setDataOraTerminazione(refDegGestProgettoRec.getDataOraTerminazione());
				refDegGestProgettoRecUpd.setId(new ReferentiDelegatiEnteGestoreProgettoKey(refDegGestProgettoRec.getId().getIdProgetto(), 
						codiceFiscaleDaAggiornare, 
						refDegGestProgettoRec.getId().getIdEnte()));
				refDegGestProgettoRecUpd.setStatoUtente(refDegGestProgettoRec.getStatoUtente());
				
				refDegGestProgettoUpd.add(refDegGestProgettoRecUpd);
			}
			
			List<ReferentiDelegatiEntePartnerDiProgettoEntity> refDegPartner = referentiDelegatiEntePartnerDiProgettoRepository.findByCodFiscaleUtente(codiceFiscaleCorrente);
			List<ReferentiDelegatiEntePartnerDiProgettoEntity> refDegPartnerUpd = new ArrayList<ReferentiDelegatiEntePartnerDiProgettoEntity>();

			for(ReferentiDelegatiEntePartnerDiProgettoEntity refDegPartnerRec: refDegPartner) {				
				referentiDelegatiEntePartnerDiProgettoRepository.delete(refDegPartnerRec);
				referentiDelegatiEntePartnerDiProgettoRepository.flush();
				
				ReferentiDelegatiEntePartnerDiProgettoEntity refDegPartnerRecUpd = new ReferentiDelegatiEntePartnerDiProgettoEntity();
				refDegPartnerRecUpd.setCodiceRuolo(refDegPartnerRec.getCodiceRuolo());
				refDegPartnerRecUpd.setDataOraAggiornamento(refDegPartnerRec.getDataOraAggiornamento());
				refDegPartnerRecUpd.setDataOraAttivazione(refDegPartnerRec.getDataOraAttivazione());
				refDegPartnerRecUpd.setDataOraCreazione(refDegPartnerRec.getDataOraCreazione());
				refDegPartnerRecUpd.setDataOraTerminazione(refDegPartnerRec.getDataOraTerminazione());
				refDegPartnerRecUpd.setId(new ReferentiDelegatiEntePartnerDiProgettoKey(refDegPartnerRec.getId().getIdProgetto(), 
						refDegPartnerRec.getId().getIdEnte(),
						codiceFiscaleDaAggiornare 
						));
				refDegPartnerRecUpd.setStatoUtente(refDegPartnerRec.getStatoUtente());
				
				refDegPartnerUpd.add(refDegPartnerRecUpd);
			}
			
			List<EnteSedeProgettoFacilitatoreEntity> eSpfList = enteSedeProgettoFacilitatoreService.findRuoloFacVolPerUtente(codiceFiscaleCorrente);
			List<EnteSedeProgettoFacilitatoreEntity> eSpfListUpd = new ArrayList<EnteSedeProgettoFacilitatoreEntity>();
			for(EnteSedeProgettoFacilitatoreEntity eSpfListRec: eSpfList) {				
				enteSedeProgettoFacilitatoreRepository.delete(eSpfListRec);
				enteSedeProgettoFacilitatoreRepository.flush();

				EnteSedeProgettoFacilitatoreEntity eSpfListRecUpd = new EnteSedeProgettoFacilitatoreEntity();
				eSpfListRecUpd.setDataOraAggiornamento(eSpfListRec.getDataOraAggiornamento());
				eSpfListRecUpd.setDataOraAttivazione(eSpfListRec.getDataOraAttivazione());
				eSpfListRecUpd.setDataOraCreazione(eSpfListRec.getDataOraCreazione());
				eSpfListRecUpd.setDataOraTerminazione(eSpfListRec.getDataOraTerminazione());
				eSpfListRecUpd.setId(new EnteSedeProgettoFacilitatoreKey(eSpfListRec.getId().getIdEnte(), 
						eSpfListRec.getId().getIdSede(), 
						eSpfListRec.getId().getIdProgetto(), 
						codiceFiscaleDaAggiornare));
				eSpfListRecUpd.setRuoloUtente(eSpfListRec.getRuoloUtente());
				eSpfListRecUpd.setStatoUtente(eSpfListRec.getStatoUtente());
				
				eSpfListUpd.add(eSpfListRecUpd);
			}
			
			aggiornaUtente(aggiornaUtenteRequest, utenteFetchDB);
			utenteXRuoloService.saveAll(ruoliUtenteUpd);
			referentiDelegatiEnteGestoreProgrammaRepository.saveAllAndFlush(refDegGestProgrammaUpd);
			referentiDelegatiEnteGestoreProgettoRepository.saveAllAndFlush(refDegGestProgettoUpd);
			referentiDelegatiEntePartnerDiProgettoRepository.saveAllAndFlush(refDegPartnerUpd);
			enteSedeProgettoFacilitatoreService.saveAll(eSpfListUpd);
		}else {
			aggiornaUtente(aggiornaUtenteRequest, utenteFetchDB);			
		}
	}

	private void aggiornaUtente(AggiornaUtenteRequest aggiornaUtenteRequest, UtenteEntity utenteFetchDB) {
		utenteFetchDB.setEmail(aggiornaUtenteRequest.getEmail());
		utenteFetchDB.setCodiceFiscale(aggiornaUtenteRequest.getCodiceFiscale());
		utenteFetchDB.setTelefono(aggiornaUtenteRequest.getTelefono());
		utenteFetchDB.setNome(Utils.toCamelCase(aggiornaUtenteRequest.getNome()));
		utenteFetchDB.setCognome(aggiornaUtenteRequest.getCognome().toUpperCase());
		utenteFetchDB.setMansione(aggiornaUtenteRequest.getMansione());
		utenteFetchDB.setTipoContratto(aggiornaUtenteRequest.getTipoContratto());
		utenteFetchDB.setDataOraAggiornamento(new Date());
		this.utenteRepository.saveAndFlush(utenteFetchDB);
	}

	@LogExecutionTime
	@LogMethod
	public UtenteEntity salvaUtente(UtenteEntity utente) {
		return this.utenteRepository.save(utente);
	}

	@LogExecutionTime
	@LogMethod
	public void cancellaUtente(Long idUtente) {
		UtenteEntity utente = null;
		try {
			utente = this.getUtenteById(idUtente);
		} catch (ResourceNotFoundException ex) {
			String messaggioErrore = String.format("Impossibile cancellare un utente che non esiste");
			throw new UtenteException(messaggioErrore, ex, CodiceErroreEnum.U12);
		}
		if(this.utenteXRuoloService.countRuoliByCfUtente(utente.getCodiceFiscale()) > 0) {
			String errorMessage = String.format("Impossibile cancellare l'utente con codice fiscale %s poiché ha almeno un ruolo associato", utente.getCodiceFiscale());
			throw new UtenteException(errorMessage, CodiceErroreEnum.U13);
		}
		this.utenteRepository.delete(utente);
	}

	private Set<UtenteEntity> getUtentiByFiltri(FiltroRequest filtroRequest, Integer currPage, Integer pageSize) {
		return this.utenteRepository.findUtentiByFiltri(
				filtroRequest.getCriterioRicerca(),
				"%" + filtroRequest.getCriterioRicerca() + "%",
				filtroRequest.getRuoli(),
				filtroRequest.getStati(),
				currPage*pageSize,
				pageSize
				);
	}

	public Set<String> getStatoUtentiByFiltri(FiltroRequest filtroRequest) {
		return this.utenteRepository.findStatiByFilter(
				filtroRequest.getCriterioRicerca(),
				"%" + filtroRequest.getCriterioRicerca() + "%",
				filtroRequest.getRuoli(),
				filtroRequest.getStati()
				);
	}

	@LogMethod
	@LogExecutionTime
	@Transactional(rollbackOn = Exception.class)
	public void assegnaRuoloAUtente(Long idUtente, String codiceRuolo) {
		RuoloEntity ruolo = null;
		try {
			ruolo = this.ruoloService.getRuoloByCodiceRuolo(codiceRuolo);
		} catch (ResourceNotFoundException ex) {
			String messaggioErrore = String.format("Impossibile assegnare il ruolo con codice = %s poiché non esistente", codiceRuolo);
			throw new UtenteException(messaggioErrore, ex, CodiceErroreEnum.U14);
		}
		UtenteEntity utente = null;
		try {
			utente = this.getUtenteById(idUtente);
		} catch (ResourceNotFoundException ex) {
			String messaggioErrore = String.format("Impossibile assegnare il ruolo con codice = %s poiché l'utente con id = %s non esiste", codiceRuolo, idUtente);
			throw new UtenteException(messaggioErrore, ex, CodiceErroreEnum.U15);
		}
		if(utente.getRuoli().contains(ruolo)) {
			String messaggioErrore = String.format("L'utente con id = %s ha già il ruolo con codice = %s assegnato", idUtente, codiceRuolo);
			throw new UtenteException(messaggioErrore, CodiceErroreEnum.U16);
		}
		if(codiceRuolo.equals("DTD") || codiceRuolo.equals("DSCU")) {
			ruolo.setStato(StatoEnum.ATTIVO.getValue());
			utente.getRuoli().add(ruolo);
			this.salvaUtente(utente);
			return;
		}
		if(ruolo.getPredefinito() == false) {
			ruolo.setStato(StatoEnum.ATTIVO.getValue());
			utente.getRuoli().add(ruolo);
			this.salvaUtente(utente);
			return;
		}
		String errorMessage = String.format("Impossibile assegnare un ruolo predefinito all'infuori di DTD e DSCU");
		throw new UtenteException(errorMessage, CodiceErroreEnum.R13);
	}

	@LogMethod
	@LogExecutionTime
	public List<String> getAllStatiDropdown(UtenteRequest sceltaContesto) {
		return this.getAllStatiByRuoloAndcfUtente(sceltaContesto.getCodiceRuoloUtenteLoggato(),sceltaContesto.getCfUtenteLoggato(), 
				sceltaContesto.getIdProgramma(), sceltaContesto.getIdProgetto(), sceltaContesto.getIdEnte(), sceltaContesto.getFiltroRequest());
	}

	public List<String> getAllStatiByRuoloAndcfUtente(String codiceRuolo, String cfUtente, Long idProgramma, Long idProgetto,
			Long idEnte, FiltroRequest filtroRequest) {
		List<String> stati = new ArrayList<>();

		switch (codiceRuolo) {
		case "DTD":
			stati.addAll(this.getStatoUtentiByFiltri(filtroRequest));
			break;
		case "DSCU":
			stati.addAll(this.getStatiiPerDSCU(filtroRequest));
		case "REG":
		case "DEG":
			stati.addAll(this.getStatiPerReferenteDelegatoGestoreProgramma(idProgramma, cfUtente, filtroRequest));
			break;
		case "REGP":
		case "DEGP":
			stati.addAll(this.getStatiPerReferenteDelegatoGestoreProgetti(idProgetto, cfUtente, filtroRequest));
			break;
		case "REPP":
		case "DEPP":
			stati.addAll(this.getStatiPerReferenteDelegatoEntePartnerProgetti(idProgetto, idEnte, cfUtente, filtroRequest));
			break;
		case "FAC":
		case "VOL":
			break;
		default:
			stati.addAll(this.getStatoUtentiByFiltri(filtroRequest));
			break;
		}
		return stati;
	}

	@LogMethod
	@LogExecutionTime
	public List<String> getAllRuoliDropdown(UtenteRequest sceltaContesto) {
		if(this.ruoloService.getRuoliByCodiceFiscaleUtente(sceltaContesto.getCfUtenteLoggato()).stream().filter(codiceRuolo -> codiceRuolo.equals(sceltaContesto.getCodiceRuoloUtenteLoggato())).count() == 0) {
			throw new UtenteException("ERRORE: ruolo non definito per l'utente", CodiceErroreEnum.U06);
		}
		return this.getAllRuoliByRuoloAndcfUtente(sceltaContesto.getCodiceRuoloUtenteLoggato(),sceltaContesto.getCfUtenteLoggato(), 
				sceltaContesto.getIdProgramma(), sceltaContesto.getIdProgetto(), sceltaContesto.getIdEnte(), sceltaContesto.getFiltroRequest());
	}

	public List<String> getAllRuoliByRuoloAndcfUtente(String codiceRuolo, String cfUtente, Long idProgramma, Long idProgetto, Long idEnte,
			FiltroRequest filtroRequest) {
		List<String> stati = new ArrayList<>();

		switch (codiceRuolo) {
		case "DTD":
			stati.addAll(this.getAllRuoli(filtroRequest));
			stati.removeAll(Collections.singleton(null));
			return stati;
		case "DSCU":
			stati.addAll(this.getRuoliPerDSCU(filtroRequest));
			return stati;
		case "REG":
		case "DEG":
			return this.getRuoliPerReferenteDelegatoGestoreProgramma(idProgramma, cfUtente, filtroRequest);
		case "REGP":
		case "DEGP":
			stati.addAll(this.getRuoliPerReferenteDelegatoGestoreProgetti(idProgetto, cfUtente, filtroRequest));
			return stati;
		case "REPP":
		case "DEPP":
			stati.addAll(this.getRuoliPerReferenteDelegatoEntePartnerProgetti(idProgetto, idEnte, cfUtente, filtroRequest));
			return stati;
		case "FAC":
		case "VOL":
			stati.addAll(this.getRuoliPerReferenteDelegatoEntePartnerProgetti(idProgetto, idEnte, cfUtente, filtroRequest));
			return stati;
		default:
			stati.addAll(this.getAllRuoli(filtroRequest));
			stati.removeAll(Collections.singleton(null));
		}
		return stati;
	}

	private List<String> getRuoliPerReferenteDelegatoEntePartnerProgetti(Long idProgetto, Long idEnte,
			String cfUtente, FiltroRequest filtroRequest) {
		return this.utenteRepository.findRuoliPerReferenteDelegatoEntePartnerProgetti(
				idProgetto,
				idEnte,
				cfUtente,
				filtroRequest.getCriterioRicerca(),
				"%" + filtroRequest.getCriterioRicerca() + "%",
				filtroRequest.getRuoli(),
				filtroRequest.getStati()
				);
	}
	
	private List<String> getStatiPerReferenteDelegatoEntePartnerProgetti(Long idProgetto, Long idEnte,
			String cfUtente, FiltroRequest filtroRequest) {
		return this.utenteRepository.findStatiPerReferenteDelegatoEntePartnerProgetti(
				idProgetto,
				idEnte,
				cfUtente,
				filtroRequest.getCriterioRicerca(),
				"%" + filtroRequest.getCriterioRicerca() + "%",
				filtroRequest.getRuoli(),
				filtroRequest.getStati()
				);
	}

	private List<String> getRuoliPerReferenteDelegatoGestoreProgetti(Long idProgetto, String cfUtente,
			FiltroRequest filtroRequest) {
		return this.utenteRepository.findRuoliPerReferenteDelegatoGestoreProgetti(
				idProgetto,
				cfUtente,
				filtroRequest.getCriterioRicerca(),
				"%" + filtroRequest.getCriterioRicerca() + "%",
				filtroRequest.getRuoli(),
				filtroRequest.getStati()
				);
	}
	
	private List<String> getStatiPerReferenteDelegatoGestoreProgetti(Long idProgetto, String cfUtente,
			FiltroRequest filtroRequest) {
		return this.utenteRepository.findStatiPerReferenteDelegatoGestoreProgetti(
				idProgetto,
				cfUtente,
				filtroRequest.getCriterioRicerca(),
				"%" + filtroRequest.getCriterioRicerca() + "%",
				filtroRequest.getRuoli(),
				filtroRequest.getStati()
				);
	}

	private List<String> getRuoliPerReferenteDelegatoGestoreProgramma(Long idProgramma, String cfUtente,
			FiltroRequest filtroRequest) {
		return this.utenteRepository.findRuoliPerReferenteDelegatoGestoreProgramma(
				idProgramma,
				cfUtente,
				filtroRequest.getCriterioRicerca(),
				"%" + filtroRequest.getCriterioRicerca() + "%",
				filtroRequest.getRuoli(),
				filtroRequest.getStati()
				);
	}
	
	private List<String> getStatiPerReferenteDelegatoGestoreProgramma(Long idProgramma, String cfUtente,
			FiltroRequest filtroRequest) {
		return this.utenteRepository.findStatiiPerReferenteDelegatoGestoreProgramma(
				idProgramma,
				cfUtente,
				filtroRequest.getCriterioRicerca(),
				"%" + filtroRequest.getCriterioRicerca() + "%",
				filtroRequest.getRuoli(),
				filtroRequest.getStati()
				);
	}

	private List<String> getRuoliPerDSCU(FiltroRequest filtroRequest) {
		return this.utenteRepository.findRuoliPerDSCU(
				filtroRequest.getCriterioRicerca(),
				"%" + filtroRequest.getCriterioRicerca() + "%", 
				filtroRequest.getRuoli(),
				filtroRequest.getStati()
				);
	}
	
	private List<String> getStatiiPerDSCU(FiltroRequest filtroRequest) {
		return this.utenteRepository.findStatiPerDSCU(
				filtroRequest.getCriterioRicerca(),
				"%" + filtroRequest.getCriterioRicerca() + "%", 
				filtroRequest.getRuoli(),
				filtroRequest.getStati()
				);
	}

	private List<String> getAllRuoli(FiltroRequest filtroRequest) {
		return this.utenteRepository.findAllRuoli(
				filtroRequest.getCriterioRicerca(),
				"%" + filtroRequest.getCriterioRicerca() + "%",
				filtroRequest.getRuoli(),
				filtroRequest.getStati()
				);
	}

	@LogMethod
	@LogExecutionTime
	public SchedaUtenteBeanLight getSchedaUtenteByIdUtenteLight(Long idUtente) {
		UtenteEntity utenteFetchDB = this.getUtenteById(idUtente);

		String cfUtente = utenteFetchDB.getCodiceFiscale();

		DettaglioUtenteBean dettaglioUtente = new DettaglioUtenteBean();
		dettaglioUtente.setId(utenteFetchDB.getId());
		dettaglioUtente.setNome(utenteFetchDB.getNome());
		dettaglioUtente.setCognome(utenteFetchDB.getCognome());
		dettaglioUtente.setCodiceFiscale(cfUtente);
		dettaglioUtente.setEmail(utenteFetchDB.getEmail());
		dettaglioUtente.setTelefono(utenteFetchDB.getTelefono());
		dettaglioUtente.setStato(utenteFetchDB.getStato());
		dettaglioUtente.setTipoContratto(utenteFetchDB.getTipoContratto());
		dettaglioUtente.setMansione(utenteFetchDB.getMansione());

		SchedaUtenteBeanLight schedaUtente = new SchedaUtenteBeanLight();
		schedaUtente.setDettaglioUtente(dettaglioUtente);
		return schedaUtente;
	}

	public boolean isAutorizzatoForGetSchedaUtenteByIdUtente(final Long idUtente, final SceltaProfiloParam sceltaProfilo) {
		switch(sceltaProfilo.getCodiceRuoloUtenteLoggato()) {

		case "REG": 
		case "DEG": 
			return this.utenteRepository.isUtenteAssociatoProgrammaAndEnte(idUtente, sceltaProfilo.getIdProgramma(), sceltaProfilo.getIdEnte()) > 0;
		case "REGP": 
		case "DEGP":
			return this.utenteRepository.isUtenteAssociatoProgrammaAndProgetto(idUtente, sceltaProfilo.getIdProgetto()) > 0;
		case "REPP": 
		case "DEPP": 
			return this.utenteRepository.isUtenteAssociatoREPP(idUtente, sceltaProfilo.getIdProgetto(), sceltaProfilo.getIdEnte()) > 0;
		case "FAC": 
		case "VOL": 
			//i FAC/VOL possono vedere solo se stessi
			return this.utenteRepository.findById(idUtente).get().getCodiceFiscale().equals(sceltaProfilo.getCfUtenteLoggato());
			//return this.utenteRepository.isUtenteAssociatoFAC(idUtente, sceltaProfilo.getIdProgetto(), sceltaProfilo.getIdEnte(), sceltaProfilo.getCfUtenteLoggato()) > 0;
			// DTD, DSCU, RUOLI_CUSTOM
		case "DSCU": 
			String codiceFiscale = utenteRepository.findById(idUtente).get().getCodiceFiscale();
			//nel caso di DSCU torna true o se l'utente vede la propria scheda utente oppure la scheda di un utente che partecipa ad un programma SCD
			return codiceFiscale.equals(sceltaProfilo.getCfUtenteLoggato()) || utenteRepository.isUtenteConRelazioneProgrammaSCD(codiceFiscale) > 0;
		default: return true;
		}
	}

	@LogMethod
	@LogExecutionTime
	public SchedaUtenteBean getSchedaUtenteByIdUtente(Long idUtente, SceltaProfiloParam sceltaProfilo) {
		UtenteEntity utenteFetchDB = this.getUtenteById(idUtente);

		String cfUtente = utenteFetchDB.getCodiceFiscale();

		DettaglioUtenteBean dettaglioUtente = new DettaglioUtenteBean();
		dettaglioUtente.setId(utenteFetchDB.getId());
		dettaglioUtente.setNome(utenteFetchDB.getNome());
		dettaglioUtente.setCognome(utenteFetchDB.getCognome());
		dettaglioUtente.setCodiceFiscale(cfUtente);
		dettaglioUtente.setEmail(utenteFetchDB.getEmail());
		dettaglioUtente.setTelefono(utenteFetchDB.getTelefono());
		dettaglioUtente.setStato(utenteFetchDB.getStato());
		dettaglioUtente.setTipoContratto(utenteFetchDB.getTipoContratto());
		dettaglioUtente.setMansione(utenteFetchDB.getMansione());


		List<RuoloEntity> listaRuoliUtente = this.ruoloService.getRuoliCompletiByCodiceFiscaleUtente(cfUtente);

		Map<RuoloEntity,Object> mappaProgrammiProgettiUtente = new HashMap<>();

		listaRuoliUtente.stream()
		.forEach(ruolo -> {
			switch (ruolo.getCodice()) {
			case "REG":
			case "DEG":
				List<Long> listaIdsProgrammiDistinct = this.programmaService.getDistinctIdProgrammiByRuoloUtente(cfUtente, ruolo.getCodice());
				if(listaIdsProgrammiDistinct.size() > 0 )
					mappaProgrammiProgettiUtente.put(ruolo, listaIdsProgrammiDistinct);
				break;
			case "REGP":
			case "DEGP":
				List<Long> listaIdsProgettiDistinct = this.progettoService.getDistinctIdProgettiByRuoloUtente(cfUtente, ruolo.getCodice());
				if(listaIdsProgettiDistinct.size() > 0 )
					mappaProgrammiProgettiUtente.put(ruolo, listaIdsProgettiDistinct);
				break;
			case "REPP":
			case "DEPP":
				mappaProgrammiProgettiUtente.put(ruolo, this.entePartnerService.getIdProgettiEntePartnerByRuoloUtente(cfUtente, ruolo.getCodice()));
				break;
			case "FAC":
			case "VOL":
				List<ProgettoEnteProjection> entiProgetto = new ArrayList<>();
				entiProgetto.addAll(this.enteSedeProgettoFacilitatoreService.getIdProgettiFacilitatoreVolontarioPerGestore(cfUtente, ruolo.getCodice()));
				entiProgetto.addAll(this.enteSedeProgettoFacilitatoreService.getIdProgettiFacilitatoreVolontarioPerEntePartner(cfUtente, ruolo.getCodice()));
				if(entiProgetto.size() > 0)
					mappaProgrammiProgettiUtente.put(ruolo, entiProgetto);
				break;
			default:
				mappaProgrammiProgettiUtente.put(ruolo, new ArrayList<Long>());
				break;
			}
		});

		List<DettaglioRuoliBean> listaDettaglioRuoli = new ArrayList<>();
		mappaProgrammiProgettiUtente.keySet()
		.stream()
		.forEach(ruolo -> {
			if(((List) mappaProgrammiProgettiUtente.get(ruolo)).isEmpty()) {
				DettaglioRuoliBean dettaglioRuolo = new DettaglioRuoliBean();
				dettaglioRuolo.setNome(ruolo.getNome());
				dettaglioRuolo.setCodiceRuolo(ruolo.getCodice());
				listaDettaglioRuoli.add(dettaglioRuolo);
			}

			switch(ruolo.getCodice()) {
			case "REG":
			case "DEG":{
				List<Long> listaIds = (List<Long>) mappaProgrammiProgettiUtente.get(ruolo);
				listaIds
				.stream()
				.forEach(id -> {
					DettaglioRuoliBean dettaglioRuolo = new DettaglioRuoliBean();
					ProgrammaEntity programmaFetchDB = this.programmaService.getProgrammaById(id);
					dettaglioRuolo.setId(id);
					dettaglioRuolo.setNome(programmaFetchDB.getNomeBreve());
					dettaglioRuolo.setCodiceRuolo(ruolo.getCodice());
					dettaglioRuolo.setRuolo(ruolo.getNome());
					dettaglioRuolo.setStatoP(programmaFetchDB.getStato());
					dettaglioRuolo.setIdEnte(programmaFetchDB.getEnteGestoreProgramma().getId());
					dettaglioRuolo.setNomeEnte(programmaFetchDB.getEnteGestoreProgramma().getNome());
					dettaglioRuolo.setNomeBreveEnte(programmaFetchDB.getEnteGestoreProgramma().getNomeBreve());
					List<String> listaRecRefProg = referentiDelegatiEnteGestoreProgrammaRepository
							.findStatoByCfUtente(cfUtente, programmaFetchDB.getId(), ruolo.getCodice());
					dettaglioRuolo.setStato(listaRecRefProg.size() > 1
							? listaRecRefProg
									.stream()
									.filter(el -> !"TERMINATO".equalsIgnoreCase(el))
									.findFirst()
									.orElse("TERMINATO")
									: listaRecRefProg.get(0));
					List<String> listaRuoli = Arrays.asList(RuoliUtentiConstants.REG,
							RuoliUtentiConstants.DEG,
							RuoliUtentiConstants.REGP,
							RuoliUtentiConstants.DEGP,
							RuoliUtentiConstants.REPP,
							RuoliUtentiConstants.DEPP,
							RuoliUtentiConstants.FACILITATORE,
							RuoliUtentiConstants.VOLONTARIO);
					if(listaRuoli.contains(sceltaProfilo.getCodiceRuoloUtenteLoggato())){
						if(sceltaProfilo.getIdProgramma().equals(id)) {
							dettaglioRuolo.setAssociatoAUtente(true);
						}
					}else if(RuoliUtentiConstants.DSCU.equals(sceltaProfilo.getCodiceRuoloUtenteLoggato())) {
						if(PolicyEnum.SCD.equals(programmaFetchDB.getPolicy())){
							dettaglioRuolo.setAssociatoAUtente(true);
						}else {
							dettaglioRuolo.setAssociatoAUtente(false);
						}
					}else{
						dettaglioRuolo.setAssociatoAUtente(true);
					}


					listaDettaglioRuoli.add(dettaglioRuolo);
				});
				break;
			}
			case "REGP":
			case "DEGP":{
				List<Long> listaIds = (List<Long>) mappaProgrammiProgettiUtente.get(ruolo);
				listaIds
				.stream()
				.forEach(id -> {
					DettaglioRuoliBean dettaglioRuolo = new DettaglioRuoliBean();
					ProgettoEntity progettoXEgpFetchDB = this.progettoService.getProgettoById(id);
					dettaglioRuolo.setId(id);
					dettaglioRuolo.setNome(progettoXEgpFetchDB.getNomeBreve());
					dettaglioRuolo.setCodiceRuolo(ruolo.getCodice());
					dettaglioRuolo.setRuolo(ruolo.getNome());
					dettaglioRuolo.setStatoP(progettoXEgpFetchDB.getStato());
					dettaglioRuolo.setIdEnte(progettoXEgpFetchDB.getEnteGestoreProgetto().getId());
					dettaglioRuolo.setNomeEnte(progettoXEgpFetchDB.getEnteGestoreProgetto().getNome());
					dettaglioRuolo.setNomeBreveEnte(progettoXEgpFetchDB.getEnteGestoreProgetto().getNomeBreve());
					List<String> listaRecRefProgt = referentiDelegatiEnteGestoreProgettoRepository
							.findStatoByCfUtente(cfUtente, progettoXEgpFetchDB.getId(), ruolo.getCodice());
					dettaglioRuolo.setStato(listaRecRefProgt.size() > 1
							? listaRecRefProgt
									.stream()
									.filter(el -> !"TERMINATO".equalsIgnoreCase(el))
									.findFirst()
									.orElse("TERMINATO")
									: listaRecRefProgt.get(0));
					dettaglioRuolo.setAssociatoAUtente(isProgettoAndEnteAssociatoAUtenteLoggato(sceltaProfilo, progettoXEgpFetchDB, progettoXEgpFetchDB.getEnteGestoreProgetto().getId()));
					listaDettaglioRuoli.add(dettaglioRuolo);
				});
				break;
			}
			case "REPP":
			case "DEPP":{
				List<EntePartnerEntity> listaEntiPartner = (List<EntePartnerEntity>) mappaProgrammiProgettiUtente.get(ruolo);
				listaEntiPartner
				.stream()
				.forEach(entePartner -> {
					DettaglioRuoliBean dettaglioRuolo = new DettaglioRuoliBean();
					ProgettoEntity progettoXEppFetchDB = this.progettoService.getProgettoById(entePartner.getId().getIdProgetto());
					dettaglioRuolo.setId(entePartner.getId().getIdProgetto());
					dettaglioRuolo.setIdEnte(entePartner.getId().getIdEnte());
					dettaglioRuolo.setNome(progettoXEppFetchDB.getNomeBreve());
					dettaglioRuolo.setCodiceRuolo(ruolo.getCodice());
					dettaglioRuolo.setRuolo(ruolo.getNome());
					dettaglioRuolo.setStatoP(progettoXEppFetchDB.getStato());
					EnteEntity ente = enteRepository.findById(entePartner.getId().getIdEnte()).get();
					dettaglioRuolo.setNomeEnte(ente.getNome());
					dettaglioRuolo.setNomeBreveEnte(ente.getNomeBreve());
					List<String> listaRecRefPart = referentiDelegatiEntePartnerDiProgettoRepository
							.findStatoByCfUtente(cfUtente, progettoXEppFetchDB.getId(), ruolo.getCodice());
					dettaglioRuolo.setStato(listaRecRefPart.size() > 1
							? listaRecRefPart
									.stream()
									.filter(el -> !"TERMINATO".equalsIgnoreCase(el))
									.findFirst()
									.orElse("TERMINATO")
									: listaRecRefPart.get(0));
					dettaglioRuolo.setAssociatoAUtente(isProgettoAndEnteAssociatoAUtenteLoggato(sceltaProfilo, progettoXEppFetchDB, entePartner.getId().getIdEnte()));
					listaDettaglioRuoli.add(dettaglioRuolo);
				});
				break;
			}
			case "FAC":
			case "VOL":{
				List<ProgettoEnteProjection> listaEntiSedeProgettoFac = (List<ProgettoEnteProjection>) mappaProgrammiProgettiUtente.get(ruolo);
				listaEntiSedeProgettoFac
				.stream()
				.forEach(enteSedeProgetoFac-> {
					DettaglioRuoliBean dettaglioRuolo = new DettaglioRuoliBean();
					ProgettoEntity progettoXFacFetchDB = this.progettoService.getProgettoById(enteSedeProgetoFac.getIdProgetto());
					dettaglioRuolo.setId(enteSedeProgetoFac.getIdProgetto());
					dettaglioRuolo.setIdEnte(enteSedeProgetoFac.getIdEnte());
					dettaglioRuolo.setNome(progettoXFacFetchDB.getNomeBreve());
					dettaglioRuolo.setCodiceRuolo(ruolo.getCodice());
					dettaglioRuolo.setRuolo(ruolo.getNome());
					dettaglioRuolo.setStatoP(progettoXFacFetchDB.getStato());
					EnteEntity ente = enteRepository.findById(enteSedeProgetoFac.getIdEnte()).get();
					dettaglioRuolo.setNomeEnte(ente.getNome());
					dettaglioRuolo.setNomeBreveEnte(ente.getNomeBreve());
					List<String> listaRecRefFacVol = this.enteSedeProgettoFacilitatoreService
							.getDistinctStatoByIdProgettoIdFacilitatoreVolontario(cfUtente, ruolo.getCodice(), progettoXFacFetchDB.getId());
					dettaglioRuolo.setStato(listaRecRefFacVol.size() > 1
							? listaRecRefFacVol
									.stream()
									.filter(el -> !"TERMINATO".equalsIgnoreCase(el))
									.findFirst()
									.orElse("TERMINATO")
									: listaRecRefFacVol.get(0));
					dettaglioRuolo.setAssociatoAUtente(isProgettoAndEnteAssociatoAUtenteLoggato(sceltaProfilo, progettoXFacFetchDB, enteSedeProgetoFac.getIdEnte()));
					listaDettaglioRuoli.add(dettaglioRuolo);
				});
				break;
			}
			default:
				List<Long> listaIds = (List<Long>) mappaProgrammiProgettiUtente.get(ruolo);
				listaIds
				.stream()
				.forEach(id -> {
					DettaglioRuoliBean dettaglioRuolo = new DettaglioRuoliBean();
					dettaglioRuolo.setNome(ruolo.getNome());
					dettaglioRuolo.setCodiceRuolo(ruolo.getCodice());
					listaDettaglioRuoli.add(dettaglioRuolo);
				});
				break;

			}
		});

		SchedaUtenteBean schedaUtente = new SchedaUtenteBean();
		schedaUtente.setDettaglioUtente(dettaglioUtente);
		schedaUtente.setDettaglioRuolo(listaDettaglioRuoli);
		try {
			schedaUtente.setImmagineProfilo(this.s3Service.getPresignedUrl(utenteFetchDB.getImmagineProfilo(), this.nomeDelBucketS3, Long.parseLong(this.presignedUrlExpireSchedaUtente)));
		} catch (Exception e) {
			log.error("Errore getting file da AWS S3 per file={}", utenteFetchDB.getImmagineProfilo());
		}
		return schedaUtente;
	}

	@LogMethod
	@LogExecutionTime
	public boolean isProgettoAndEnteAssociatoAUtenteLoggato(SceltaProfiloParam sceltaProfilo, ProgettoEntity progetto, Long idEnte) {
		List<String> listaRuoli = Arrays.asList(
				RuoliUtentiConstants.REPP,
				RuoliUtentiConstants.DEPP,
				RuoliUtentiConstants.FACILITATORE,
				RuoliUtentiConstants.VOLONTARIO);

		List<String> listaRuoliGestProgetto = Arrays.asList(
				RuoliUtentiConstants.REGP,
				RuoliUtentiConstants.DEGP);

		List<String> listaRuoliGestProgramma = Arrays.asList(
				RuoliUtentiConstants.REG,
				RuoliUtentiConstants.DEG);


		if(listaRuoli.contains(sceltaProfilo.getCodiceRuoloUtenteLoggato())){
			if(sceltaProfilo.getIdProgetto().equals(progetto.getId()) &&
					sceltaProfilo.getIdEnte().equals(idEnte)) {
				return true;
			}
		}else if(listaRuoliGestProgetto.contains(sceltaProfilo.getCodiceRuoloUtenteLoggato())){
			if(sceltaProfilo.getIdProgetto().equals(progetto.getId())) {
				return true;
			}
		}else if(listaRuoliGestProgramma.contains(sceltaProfilo.getCodiceRuoloUtenteLoggato())) {
			if(sceltaProfilo.getIdProgramma().equals(progetto.getProgramma().getId())) {
				return true;
			}
		}else if(RuoliUtentiConstants.DSCU.equals(sceltaProfilo.getCodiceRuoloUtenteLoggato())) {
			if(progetto.getProgramma().getPolicy().equals(PolicyEnum.SCD)) {
				return true;
			} else {
				return false;
			}
		} else {
			// CASO DTD, RUOLO_CUSTOM
			return true;
		}
		return false;
	}

	@LogMethod
	@LogExecutionTime
	public List<UtenteEntity> getUtenteByCriterioRicerca(String criterioRicerca) {
		return this.utenteRepository.findUtenteByCriterioRicerca(
				criterioRicerca
				);
	}

	@LogMethod
	@LogExecutionTime
	public void cancellaRuoloDaUtente(Long idUtente, String codiceRuolo) {
		if(this.ruoloService.getRuoloByCodiceRuolo(codiceRuolo) == null) {
			String errorMessage = String.format("Il codice ruolo %s inserito non corrisponde a nessun ruolo esistente", codiceRuolo);
			throw new RuoloException(errorMessage, CodiceErroreEnum.R14);
		}
		UtenteEntity utente = this.getUtenteById(idUtente);
		if(utente == null ) {
			String errorMessage = String.format("L'utente con id %s non esiste", idUtente);
			throw new UtenteException(errorMessage, CodiceErroreEnum.U11);
		}
		RuoloEntity ruolo = this.ruoloService.getRuoloByCodiceRuolo(codiceRuolo);
		if(!utente.getRuoli().contains(ruolo)) {
			String errorMessage = String.format("Impossibile cancellare un ruolo non associato all'utente");
			throw new RuoloException(errorMessage, CodiceErroreEnum.R15);
		}
		if(ruolo.getPredefinito() == false) {
			UtenteXRuolo utenteRuolo = this.utenteXRuoloService.getUtenteXRuoloByCfUtenteAndCodiceRuolo(utente.getCodiceFiscale(), codiceRuolo);
			this.utenteXRuoloService.cancellaRuoloUtente(utenteRuolo);
			return;
		}
		if(codiceRuolo.equals("DTD") || codiceRuolo.equals("DSCU")) {
			UtenteXRuolo utenteRuolo = this.utenteXRuoloService.getUtenteXRuoloByCfUtenteAndCodiceRuolo(utente.getCodiceFiscale(), codiceRuolo);
			this.utenteXRuoloService.cancellaRuoloUtente(utenteRuolo);
			return;
		}
		String errorMessage = String.format("Impossibile cancellare un ruolo predefinito all'infuori di DTD e DSCU");
		throw new RuoloException(errorMessage, CodiceErroreEnum.R13);
	}

	public int countUtentiTrovati(@Valid UtenteRequest sceltaContesto) {
		return this.countUtentiTrovatiByRuolo(sceltaContesto.getCodiceRuoloUtenteLoggato(), sceltaContesto.getCfUtenteLoggato(), sceltaContesto.getIdProgramma(), sceltaContesto.getIdProgetto(), sceltaContesto.getIdEnte(), sceltaContesto.getFiltroRequest());
	}

	public int countUtentiTrovatiByRuolo(String codiceRuolo, String cfUtente, Long idProgramma, Long idProgetto, Long idEnte,
			FiltroRequest filtroRequest) {
		int numeroUtentiTrovati = 0;

		switch (codiceRuolo) {
		case "DTD":
			numeroUtentiTrovati = this.countUtentiTrovati(filtroRequest);
			break;
		case "DSCU":
			numeroUtentiTrovati = this.countUtentiPerDSCU(filtroRequest);
			break;
		case "REG":
		case "DEG":
			numeroUtentiTrovati = this.countUtentiPerReferenteDelegatoGestoreProgramma(idProgramma, cfUtente, filtroRequest);
			break;
		case "REGP":
		case "DEGP":
			numeroUtentiTrovati = this.countUtentiPerReferenteDelegatoGestoreProgetti(idProgetto, cfUtente, filtroRequest);
			break;
		case "REPP":
		case "DEPP":
			numeroUtentiTrovati = this.countUtentiPerReferenteDelegatoEntePartnerProgetti(idProgetto, idEnte, cfUtente, filtroRequest);
			break;
		default:
			numeroUtentiTrovati = this.countUtentiTrovati(filtroRequest);
			break;
		}

		return numeroUtentiTrovati;
	}

	private int countUtentiPerReferenteDelegatoEntePartnerProgetti(Long idProgetto, Long idEnte, String cfUtente,
			FiltroRequest filtroRequest) {
		return this.utenteRepository.countUtentiTrovatiPerReferenteDelegatoEntePartnerProgetti(
				idProgetto,
				idEnte,
				cfUtente,
				filtroRequest.getCriterioRicerca(),
				"%" + filtroRequest.getCriterioRicerca() + "%",
				filtroRequest.getRuoli(),
				filtroRequest.getStati()
				);
	}

	private int countUtentiPerReferenteDelegatoGestoreProgetti(Long idProgetto, String cfUtente,
			FiltroRequest filtroRequest) {
		return this.utenteRepository.countUtentiTrovatiPerReferenteDelegatoGestoreProgetti(
				idProgetto,
				cfUtente,
				filtroRequest.getCriterioRicerca(),
				"%" + filtroRequest.getCriterioRicerca() + "%",
				filtroRequest.getRuoli(),
				filtroRequest.getStati()
				);
	}

	private int countUtentiPerReferenteDelegatoGestoreProgramma(Long idProgramma, String cfUtente,
			FiltroRequest filtroRequest) {
		return this.utenteRepository.countUtentiTrovatiPerReferenteDelegatoGestoreProgramma(
				idProgramma,
				cfUtente,
				filtroRequest.getCriterioRicerca(),
				"%" + filtroRequest.getCriterioRicerca() + "%",
				filtroRequest.getRuoli(),
				filtroRequest.getStati()
				);
	}

	private int countUtentiPerDSCU(FiltroRequest filtroRequest) {
		return this.utenteRepository.countUtentiTrovatiPerDSCU(
				filtroRequest.getCriterioRicerca(),
				"%" + filtroRequest.getCriterioRicerca() + "%",
				filtroRequest.getRuoli(),
				filtroRequest.getStati()
				);
	}

	private int countUtentiTrovati(FiltroRequest filtroRequest) {
		return this.utenteRepository.countUtentiTrovati(
				filtroRequest.getCriterioRicerca(),
				"%" + filtroRequest.getCriterioRicerca() + "%",
				filtroRequest.getRuoli(),
				filtroRequest.getStati());
	}

	public List<UtenteDto> getUtentiPerDownload(String codiceRuolo, String cfUtente, Long idProgramma, Long idProgetto, Long idEnte,
			FiltroRequest filtroRequest) {
		List<UtenteEntity> listaUtenti = new ArrayList<>();
		Set<UtenteEntity> utenti = new HashSet<>();

		switch (codiceRuolo) {
		case "DTD":
			utenti = this.getUtentiByFiltriPerDownload(filtroRequest);
			listaUtenti.addAll(utenti);
			break;
		case "DSCU":
			listaUtenti.addAll(this.getUtentiPerDSCUPerDownload(filtroRequest));
			break;
		case "REG":
		case "DEG":
			listaUtenti.addAll(this.getUtentiPerReferenteDelegatoGestoreProgrammaPerDownload(idProgramma, cfUtente, filtroRequest));
			break;
		case "REGP":
		case "DEGP":
			listaUtenti.addAll(this.getUtentiPerReferenteDelegatoGestoreProgettiPerDownload(idProgramma, idProgetto, cfUtente, filtroRequest));
			break;
		case "REPP":
		case "DEPP":
			listaUtenti.addAll(this.getUtentiPerReferenteDelegatoEntePartnerProgettiPerDownload(idProgramma, idProgetto, idEnte, cfUtente, filtroRequest));
			break;
		default:
			utenti = this.getUtentiByFiltriPerDownload(filtroRequest);
			listaUtenti.addAll(utenti);
			break;	
		}

		return this.getUtentiConRuoliAggregati(listaUtenti);
	}

	private Set<UtenteEntity> getUtentiPerReferenteDelegatoEntePartnerProgettiPerDownload(
			Long idProgramma, Long idProgetto, Long idEnte, String cfUtente, FiltroRequest filtroRequest) {
		return this.utenteRepository.findUtentiPerReferenteDelegatoEntePartnerProgettiPerDownload(
				idProgramma,
				idProgetto,
				idEnte,
				cfUtente,
				filtroRequest.getCriterioRicerca(),
				"%" + filtroRequest.getCriterioRicerca() + "%",
				filtroRequest.getRuoli()
				);
	}

	private Set<UtenteEntity> getUtentiPerReferenteDelegatoGestoreProgettiPerDownload(Long idProgramma,
			Long idProgetto, String cfUtente, FiltroRequest filtroRequest) {
		return this.utenteRepository.findUtentiPerReferenteDelegatoGestoreProgettiPerDownload(
				idProgramma,
				idProgetto,
				cfUtente,
				filtroRequest.getCriterioRicerca(),
				"%" + filtroRequest.getCriterioRicerca() + "%",
				filtroRequest.getRuoli());
	}

	private Set<UtenteEntity> getUtentiPerReferenteDelegatoGestoreProgrammaPerDownload(
			Long idProgramma, String cfUtente, FiltroRequest filtroRequest) {
		return this.utenteRepository.findUtentiPerReferenteDelegatoGestoreProgrammaPerDownload(
				idProgramma,
				cfUtente,
				filtroRequest.getCriterioRicerca(),
				"%" + filtroRequest.getCriterioRicerca() + "%",
				filtroRequest.getRuoli());
	}

	private Set<UtenteEntity> getUtentiPerDSCUPerDownload(FiltroRequest filtroRequest) {
		return this.utenteRepository.findUtentiPerDSCUPerDownload(
				filtroRequest.getCriterioRicerca(),
				"%" + filtroRequest.getCriterioRicerca() + "%",
				filtroRequest.getRuoli());
	}

	private Set<UtenteEntity> getUtentiByFiltriPerDownload(FiltroRequest filtroRequest) {
		return this.utenteRepository.findUtentiByFiltriPerDownload(
				filtroRequest.getCriterioRicerca(),
				"%" + filtroRequest.getCriterioRicerca() + "%",
				filtroRequest.getRuoli(),
				filtroRequest.getStati());
	}

	@LogExecutionTime
	@LogMethod
	@Transactional
	public String uploadImmagineProfiloUtente(Long idUtente, String codiceFiscaleUtenteLoggato, MultipartFile multipartifile) throws IOException {
		UtenteEntity utenteFetchDb = getUtenteById(idUtente);
		if(utenteFetchDb == null) {
			throw new UtenteException("Utente non esistente", CodiceErroreEnum.C01);
		}
		if(!utenteFetchDb.getCodiceFiscale().equalsIgnoreCase(codiceFiscaleUtenteLoggato)) {
			throw new UtenteException("Errore permesso accesso alla risorsa", CodiceErroreEnum.A02);
		}

		List<String> IMAGE_TYPES_ALLOWED = Arrays.asList("jpg", "jpeg", "png", "image/jpg", "image/jpeg", "image/png");
		if (multipartifile == null) {
			utenteFetchDb.setImmagineProfilo(null);
			salvaUtente(utenteFetchDb);
			return null;
		}else {
			if(!IMAGE_TYPES_ALLOWED.contains(multipartifile.getContentType().toLowerCase()))  {
				throw new UtenteException("il file non è valido", CodiceErroreEnum.U22); 
			}


			InputStream initialStream = multipartifile.getInputStream();
			byte[] buffer = new byte[initialStream.available()];
			initialStream.read(buffer);
			String[] fileNameSplitted = multipartifile.getOriginalFilename().split("\\.");
			
			if(fileNameSplitted != null && fileNameSplitted.length > 2) {
				throw new UtenteException("Nome file upload deve avere solo una estensione", CodiceErroreEnum.U22);
			}
			
			String fileExtension = fileNameSplitted[fileNameSplitted.length - 1];
			String nomeFileDb = PREFIX_FILE_IMG_PROFILO + idUtente + "." + fileExtension;
			File targetFile = new File(nomeFileDb);
			try (OutputStream outStream = new FileOutputStream(targetFile)) {
				outStream.write(buffer);
			}
			try {
				this.s3Service.uploadFile(nomeDelBucketS3, targetFile);
				utenteFetchDb.setImmagineProfilo(nomeFileDb);
				salvaUtente(utenteFetchDb);
			}catch(Exception e) {
				throw e;
			}finally {
				targetFile.delete();
			}
			return nomeFileDb;
		}
	}

	@LogExecutionTime
	@LogMethod
	@Transactional
	public String downloadImmagineProfiloUtente(String nomeFile) {
		String presignedUrlImmagineProfiloUtente = null;
		try {
			presignedUrlImmagineProfiloUtente = this.s3Service.getPresignedUrl(nomeFile, this.nomeDelBucketS3, Long.parseLong(this.presignedUrlExpireContesto));
		} catch (Exception ex) {
			throw new UtenteException("Errore download immagine profilo utente", ex, CodiceErroreEnum.U17);
		}
		return presignedUrlImmagineProfiloUtente;
	}

	@LogExecutionTime
	@LogMethod
	public List<UtenteImmagineResource> getListaUtentiByIdUtenti(ListaUtentiResource idsUtenti, Boolean richiediImmagine) {
		List<UtenteImmagineResource> listaUtenti = new ArrayList<>();
		List<UtenteEntity> listaUtentiEntity = this.utenteRepository.findListaUtentiByIdUtenti(idsUtenti.getIdsUtenti());
		listaUtentiEntity.stream().forEach(utenteFetched -> {
			UtenteImmagineResource utente = new UtenteImmagineResource();
			utente.setNome(utenteFetched.getNome());
			utente.setCognome(utenteFetched.getCognome());
			utente.setId(utenteFetched.getId());
			if(richiediImmagine) {
				if(utenteFetched.getImmagineProfilo() != null) {
					utente.setImmagineProfilo(this.s3Service.getPresignedUrl(utenteFetched.getImmagineProfilo(), this.nomeDelBucketS3, Long.parseLong(this.presignedUrlExpireContesto)));
				}
			}
			listaUtenti.add(utente);
		});
		return listaUtenti;
	}
}