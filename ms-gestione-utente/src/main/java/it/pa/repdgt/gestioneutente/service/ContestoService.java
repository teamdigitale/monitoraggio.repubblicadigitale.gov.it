package it.pa.repdgt.gestioneutente.service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import it.pa.repdgt.gestioneutente.entity.projection.ProfiloProjection;
import it.pa.repdgt.gestioneutente.entity.projection.ProgettoEnteProjection;
import it.pa.repdgt.gestioneutente.entity.projection.ProgettoEnteSedeProjection;
import it.pa.repdgt.gestioneutente.entity.projection.ReferenteDelegatoEnteGestoreProgettoProjection;
import it.pa.repdgt.gestioneutente.exception.ContestoException;
import it.pa.repdgt.gestioneutente.exception.ResourceNotFoundException;
import it.pa.repdgt.gestioneutente.repository.ContestoRepository;
import it.pa.repdgt.gestioneutente.repository.GruppoRepository;
import it.pa.repdgt.gestioneutente.repository.PermessoRepository;
import it.pa.repdgt.gestioneutente.request.IntegraContestoRequest;
import it.pa.repdgt.gestioneutente.resource.GruppoPermessiResource;
import it.pa.repdgt.gestioneutente.resource.RuoloProgrammaResource;
import it.pa.repdgt.gestioneutente.resource.RuoloResource;
import it.pa.repdgt.shared.awsintegration.service.EmailService;
import it.pa.repdgt.shared.constants.RuoliUtentiConstants;
import it.pa.repdgt.shared.entity.GruppoEntity;
import it.pa.repdgt.shared.entity.ProgrammaEntity;
import it.pa.repdgt.shared.entity.RuoloEntity;
import it.pa.repdgt.shared.entity.UtenteEntity;
import it.pa.repdgt.shared.entityenum.StatoEnum;
import it.pa.repdgt.shared.service.storico.StoricoService;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class ContestoService implements RuoliUtentiConstants{
	@Autowired
	private UtenteService utenteService;
	@Autowired
	private ContestoRepository contestoRepository;
	@Autowired
	private GruppoRepository gruppoRepository;
	@Autowired
	private PermessoRepository permessoRepository;
	@Autowired
	private RuoloService ruoloService;
	@Autowired 
	private ReferentiDelegatiEnteGestoreProgettoService referentiDelegatiEnteGestoreProgettoService;
	@Autowired 
	private EmailService emailService;
	@Autowired
	private StoricoService storicoService;
	@Autowired
	private ProgettoService progettoService;
	@Autowired
	private EntePartnerService entePartnerService;

	public UtenteEntity creaContesto(final String codiceFiscale) {
		return this.utenteService.getUtenteEagerByCodiceFiscale(codiceFiscale);
	}
	
	
	public List<RuoloProgrammaResource> getProfili(String codiceFiscale) {
		// RUOLO - Programma X
		UtenteEntity utenteFetch = this.utenteService.getUtenteEagerByCodiceFiscale(codiceFiscale);
		List<RuoloEntity> ruoliUtente = utenteFetch.getRuoli();
		List<RuoloProgrammaResource> profili = new ArrayList<>();
		for(RuoloEntity ruolo: ruoliUtente) {
			String codiceRuolo = ruolo.getCodice();
			switch (codiceRuolo) {
			case REG:
			case DEG:
				for( ProfiloProjection profilo : this.contestoRepository.findProgrammiREGDEG(codiceFiscale, codiceRuolo)) {
					profili.add(new RuoloProgrammaResource(ruolo.getCodice(), ruolo.getNome(), profilo.getIdProgramma(), profilo.getNomeProgramma(), profilo.getNomeEnte()));
				}
				break;
			case REGP:
			case DEGP:
				for( ProfiloProjection profilo : this.contestoRepository.findProgrammiProgettiREGPDEGP(codiceFiscale, codiceRuolo)) {
					profili.add(new RuoloProgrammaResource(ruolo.getCodice(), ruolo.getNome(), profilo.getIdProgramma(), profilo.getNomeProgramma(), profilo.getIdProgetto(), profilo.getNomeEnte()));
				}
				break;
			case REPP:
			case DEPP:
				for( ProfiloProjection profilo : this.contestoRepository.findProgrammiProgettiREPPDEPP(codiceFiscale, codiceRuolo)) {
					profili.add(new RuoloProgrammaResource(ruolo.getCodice(), ruolo.getNome(), profilo.getIdProgramma(), profilo.getNomeProgramma(), profilo.getIdProgetto(), profilo.getNomeEnte()));
				}
				break;
			case FACILITATORE:
			case VOLONTARIO:
				//List<Long> listaProgettiPerFacilitatore = espfRepository.findDistinctProgettiByIdFacilitatoreNonTerminato(codiceFiscale, "FAC");
				for( ProfiloProjection profilo : this.contestoRepository.findProgrammiProgettiFacVol(codiceFiscale, codiceRuolo)) {
					profili.add(new RuoloProgrammaResource(ruolo.getCodice(), ruolo.getNome(), profilo.getIdProgramma(), profilo.getNomeProgramma(), profilo.getIdProgetto(), profilo.getNomeEnte()));
				}
				break;
			default:
				//PROFILI PER DTD/DSCU/RUOLI CUSTOM
				profili.add(new RuoloProgrammaResource(ruolo.getCodice(), ruolo.getNome()));
			}
		}
		
		return profili;
	}


	public List<RuoloResource> getGruppiPermessi(List<RuoloResource> ruoli) {
		List<RuoloResource> ruoliResult = new ArrayList<>();
		for(RuoloResource ruolo : ruoli) {
			//per ogni ruolo recupero la lista dei gruppi associati
			List<GruppoEntity> gruppiPerRuolo = gruppoRepository.findGruppiByRuolo(ruolo.getCodiceRuolo());
			List<GruppoPermessiResource> gruppiPermessiList = new ArrayList<>();
			for(GruppoEntity gruppo : gruppiPerRuolo) {
				//per ogni gruppo associato al ruolo in input creo la lista di elementi codiceGruppo - ListaCodicePermessi
				GruppoPermessiResource gruppoPermessiresource = new GruppoPermessiResource();
				gruppoPermessiresource.setCodiceGruppo(gruppo.getCodice());
				gruppoPermessiresource.setCodicePermesso( permessoRepository.findPermessiByGruppo(gruppo.getCodice())
						.stream()
						.map(permesso -> { 
							String codicePermesso = permesso.getCodice().toString();
							return codicePermesso;
						}).collect(Collectors.toList())
				);
				gruppiPermessiList.add(gruppoPermessiresource);
			}
			ruolo.setGruppiPermessi(gruppiPermessiList);
			ruoliResult.add(ruolo);
		}

		return ruoliResult;
	}


	@Transactional(rollbackFor = Exception.class)
	public void verificaSceltaProfilo(String codiceFiscaleUtente, String codiceRuoloUtente, Long idProgramma, Long idProgetto){
		//Verifico se il ruolo è valido per quell'utente avente quel codice fiscale
		boolean hasRuoloUtente = this.ruoloService
				.getRuoliByCodiceFiscaleUtente(codiceFiscaleUtente)
				.stream()
				.anyMatch(codiceRuolo -> codiceRuolo.equalsIgnoreCase(codiceRuoloUtente));
		
		if(!hasRuoloUtente) {
			throw new ContestoException("ERRORE: ruolo non definito per l'utente");
		}
		
		switch (codiceRuoloUtente.toUpperCase()) {
			case REG:
			case DEG:		
				if(contestoRepository.verificaUtenteRuoloDEGREGPerProgramma(idProgramma, codiceFiscaleUtente, codiceRuoloUtente) == 0) {
					throw new ContestoException("ERRORE: ruolo non definito per l'utente per il programma scelto");
				}
				//se sono REG/DEG verifico se il programma su cui mi trovo è NON ATTIVO --> passo ad ATTIVO il programma e stato_ente_gestore_programma
				//se PROGETTO-SEDE-FACILITATORE associato porto ad attivabile anche il progetto
				String errorMessage = String.format("Programma con id = %s non presente", String.valueOf(idProgramma));
				ProgrammaEntity programma = contestoRepository.findById(idProgramma).
						orElseThrow(() -> {
							return new ResourceNotFoundException(errorMessage);
						});
				
				if(StatoEnum.NON_ATTIVO.getValue().equalsIgnoreCase(programma.getStato())) {
					contestoRepository.updateStatoProgrammaToAttivo(idProgramma);
				}
				if(StatoEnum.NON_ATTIVO.getValue().equalsIgnoreCase(programma.getStatoGestoreProgramma())) {
					contestoRepository.updateStatoGestoreProgrammaToAttivo(idProgramma);
					try {
						storicoService.storicizzaEnteGestoreProgramma(programma, StatoEnum.ATTIVO.getValue());
					} catch (Exception e) {
						throw new ContestoException("ERRORE: Impossibile storicizzare ente");
					}
				}
				if(!StatoEnum.TERMINATO.getValue().equalsIgnoreCase(programma.getStato())) {
					contestoRepository.attivaREGDEG(idProgramma, codiceFiscaleUtente, codiceRuoloUtente);
				}
						
				List<Long> idsProgetti = contestoRepository.getIdsProgettiAttivabili(idProgramma);
				if(!idsProgetti.isEmpty()) {
					contestoRepository.rendiProgettiAttivabili(idsProgetti);
				}
				// Recupero referenti/delegati ente gestore progetti resi attivabili in prcedenza 
				final List<ReferenteDelegatoEnteGestoreProgettoProjection> referentiODelegatiEnteGestoreProgetti = this.referentiDelegatiEnteGestoreProgettoService
						.getEmailReferentiDelegatiEnteGestoreByIdProgetto(idsProgetti);
				// Invio email a referenti/delegati ente gestore progetti
				referentiODelegatiEnteGestoreProgetti.forEach(referenteDelegatoEnteGestoreProgetto -> {
					try {
						this.emailService.inviaEmail("oggetto_email", referenteDelegatoEnteGestoreProgetto.getEmail(), "Test_template");
					}catch(Exception ex) {
						log.error("Impossibile inviare la mail ai Referente/Delegato dell'ente gestore progetto per progetto con id={}.", referenteDelegatoEnteGestoreProgetto.getIdProgetto());
						log.error("{}", ex);
					}
				});
				break;
			case REGP:
			case DEGP:
				getProgettoProgramma(idProgetto, idProgramma);
				
				if(contestoRepository.verificaUtenteRuoloDEGPREGPPerProgetto(idProgetto, codiceFiscaleUtente, codiceRuoloUtente) == 0) {
					throw new ContestoException("ERRORE: ruolo non definito per l'utente per il progetto scelto");
				}
				//se sono REGP/DEGP se STATO_ENTE_GESTORE_PROGETTO è NON ATTIVO --> STATO A ATTIVO
				//trovo progetto e verifico se STATO_GESTORE_PROGETTO è = NON ATTIVO
				//aggiorno lo stato dell'ente gestore progetto ad ATTIVO
				ProgettoEnteProjection progetto = contestoRepository.getProgettoEnteGestoreProgetto(idProgetto, idProgramma);
				
				if(StatoEnum.NON_ATTIVO.getValue().equals(progetto.getStato())) {
					contestoRepository.updateStatoGestoreProgettoInAttivo(idProgetto);
					try {
						storicoService.storicizzaEnteGestoreProgetto(progettoService.getProgettoById(idProgetto), StatoEnum.ATTIVO.getValue());
					} catch (Exception e) {
						throw new ContestoException("ERRORE: Impossibile storicizzare ente");
					}
				}
				contestoRepository.attivaREGPDEGP(idProgetto, codiceFiscaleUtente, codiceRuoloUtente);
				break;
			case REPP:
			case DEPP:
				getProgettoProgramma(idProgetto, idProgramma);
				
				if(contestoRepository.verificaUtenteRuoloDEPPREPPPerProgetto(idProgetto, codiceFiscaleUtente, codiceRuoloUtente) == 0) {
					throw new ContestoException("ERRORE: ruolo non definito per l'utente per il progetto scelto");
				}
				//se sono REPP/DEPP se STATO_ENTE_PARTNER è NON ATTIVO --> STATO A ATTIVO
				//trovo le coppie progetto - ente all'interno del progetto idProgetto in cui l'utente è REPP o DEPP
				List<ProgettoEnteProjection> listaProgettoEnte = contestoRepository.findEntiPartnerNonTerminatiPerProgettoECodiceFiscaleReferenteDelegato(idProgetto, idProgramma, codiceFiscaleUtente, codiceRuoloUtente);
				//aggiorno lo stato dell'ente PARTNER ad ATTIVO
				listaProgettoEnte.forEach(progettoEnte -> {
					//solo per le coppie progetto - ente partner in stato non attivo le porto in attivo
					if(StatoEnum.NON_ATTIVO.getValue().equals(progettoEnte.getStato())) {
						contestoRepository.updateStatoEntePartnerProgettoToAttivo(progettoEnte.getIdProgetto(), progettoEnte.getIdEnte());
						try {
							storicoService.storicizzaEntePartner(entePartnerService.findEntePartnerByIdProgettoAndIdEnte(progettoEnte.getIdEnte(), progettoEnte.getIdProgetto()), StatoEnum.ATTIVO.getValue());
						} catch (Exception e) {
							throw new ContestoException("ERRORE: Impossibile storicizzare ente");
						}
					}
					//a prescindere porto ad ATTIVO lo stato dell'utente come REPP/DEPP per quel progetto ente partner all'interno del programma che ho scelto
					contestoRepository.attivaREPPDEPP(progettoEnte.getIdProgetto(), progettoEnte.getIdEnte(), codiceFiscaleUtente, codiceRuoloUtente);
					});
				break;
			case FACILITATORE:
			case VOLONTARIO:
				getProgettoProgramma(idProgetto, idProgramma);
				List<ProgettoEnteSedeProjection> listaProgettoEnteSede = contestoRepository.findSediPerProgrammaECodiceFiscaleFacilitatoreVolontario(idProgetto, codiceFiscaleUtente, codiceRuoloUtente);
				listaProgettoEnteSede.forEach(progettoEnteSede -> {
					//ATTIVO FACILITATORE per ente sede progetto su cui è associato
					contestoRepository.attivaFACVOL(progettoEnteSede.getIdProgetto(), progettoEnteSede.getIdEnte(), progettoEnteSede.getIdSede(), codiceFiscaleUtente, codiceRuoloUtente);
				});
				break;
			//se sono DTD/DSCU o ruolo custom non faccio niente
			default:
				break;
		}		
	}
	
	private void getProgettoProgramma(Long idProgetto, Long idProgramma) {
		if(contestoRepository.getProgettoProgramma(idProgetto, idProgramma) == 0){
			throw new ContestoException("ERRORE: non esiste la combinazione progetto-programma a sistema");
		}
	}

	public void integraContesto(@Valid IntegraContestoRequest integraContestoRequestRequest) {
		UtenteEntity utenteDBFtech = this.utenteService.getUtenteByCodiceFiscale(integraContestoRequestRequest.getCodiceFiscale());
		utenteDBFtech.setIntegrazione(Boolean.TRUE);
		utenteDBFtech.setNome(integraContestoRequestRequest.getNome());
		utenteDBFtech.setCognome(integraContestoRequestRequest.getCognome());
		utenteDBFtech.setCodiceFiscale(integraContestoRequestRequest.getCodiceFiscale());
		utenteDBFtech.setEmail(integraContestoRequestRequest.getEmail());
		utenteDBFtech.setTelefono(integraContestoRequestRequest.getTelefono());
		utenteDBFtech.setMansione(integraContestoRequestRequest.getBio());
		
		if(integraContestoRequestRequest.getAbilitazioneConsensoTrattamentoDatiPersonali() != Boolean.TRUE) {
			final String messaggioErrore = "Impossibile richiedere integrazione dati senza"
					+ " prima abilitare il consenso al trattamento dati personale.";
			throw new ContestoException(messaggioErrore);
		}
		
		utenteDBFtech.setAbilitazioneConsensoTrammentoDati(Boolean.TRUE);
		utenteDBFtech.setDataOraAbilitazioneConsensoDati(new Date());
		utenteDBFtech.setDataOraAggiornamento(new Date());
		try {
			this.utenteService.salvaUtente(utenteDBFtech);
		}catch(Exception e) {
			throw new ContestoException("ERRORE - integrazione: " + e.getMessage(), e);
		}
	}
}