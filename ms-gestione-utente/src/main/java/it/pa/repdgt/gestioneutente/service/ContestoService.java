package it.pa.repdgt.gestioneutente.service;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import it.pa.repdgt.gestioneutente.entity.projection.ProfiloProjection;
import it.pa.repdgt.gestioneutente.entity.projection.ProgettoEnteProjection;
import it.pa.repdgt.gestioneutente.entity.projection.ProgettoEnteSedeProjection;
import it.pa.repdgt.gestioneutente.exception.ContestoException;
import it.pa.repdgt.gestioneutente.exception.ResourceNotFoundException;
import it.pa.repdgt.gestioneutente.repository.ContestoRepository;
import it.pa.repdgt.gestioneutente.repository.GruppoRepository;
import it.pa.repdgt.gestioneutente.request.IntegraContestoRequest;
import it.pa.repdgt.gestioneutente.resource.RuoloProgrammaResource;
import it.pa.repdgt.gestioneutente.resource.RuoloResource;
import it.pa.repdgt.shared.annotation.LogExecutionTime;
import it.pa.repdgt.shared.annotation.LogMethod;
import it.pa.repdgt.shared.constants.RuoliUtentiConstants;
import it.pa.repdgt.shared.entity.GruppoEntity;
import it.pa.repdgt.shared.entity.ProgrammaEntity;
import it.pa.repdgt.shared.entity.RuoloEntity;
import it.pa.repdgt.shared.entity.UtenteEntity;
import it.pa.repdgt.shared.entityenum.StatoEnum;
import it.pa.repdgt.shared.exception.CodiceErroreEnum;
import it.pa.repdgt.shared.service.storico.StoricoService;

@Service
public class ContestoService implements RuoliUtentiConstants{
	@Autowired
	private UtenteService utenteService;
	@Autowired
	private ContestoRepository contestoRepository;
	@Autowired
	private GruppoRepository gruppoRepository;
	@Autowired
	private StoricoService storicoService;
	@Autowired
	private ProgettoService progettoService;
	@Autowired
	private EntePartnerService entePartnerService;

	@LogMethod
	@LogExecutionTime
	public UtenteEntity creaContesto(final String codiceFiscale) {
		return this.utenteService.getUtenteEagerByCodiceFiscale(codiceFiscale);
	}
	
	@LogMethod
	@LogExecutionTime
	public List<RuoloProgrammaResource> getProfili(String codiceFiscale) {
		// RUOLO - Programma X
		UtenteEntity utenteFetch = this.utenteService.getUtenteEagerByCodiceFiscale(codiceFiscale);
		List<RuoloEntity> ruoliUtente = utenteFetch.getRuoli();
		List<RuoloProgrammaResource> profili = new ArrayList<>();
		for(RuoloEntity ruolo: ruoliUtente) {
			String codiceRuolo = ruolo.getCodice();
			String descrizioneRuolo = null;
			switch (codiceRuolo) {
				case REG:
				case DEG:
					descrizioneRuolo = codiceRuolo.equalsIgnoreCase(RuoliUtentiConstants.REG)? "REFERENTE": "DELEGATO";
					for( ProfiloProjection profilo : this.contestoRepository.findProgrammiREGDEG(codiceFiscale, codiceRuolo)) {
						profili.add(new RuoloProgrammaResource(ruolo.getCodice(), descrizioneRuolo, ruolo.getNome(), profilo.getIdProgramma(), profilo.getNomeProgramma(), profilo.getNomeEnte()));
					}
					break;
				case REGP:
				case DEGP:
					descrizioneRuolo = codiceRuolo.equalsIgnoreCase(RuoliUtentiConstants.REGP)? "REFERENTE": "DELEGATO";
					for( ProfiloProjection profilo : this.contestoRepository.findProgrammiProgettiREGPDEGP(codiceFiscale, codiceRuolo)) {
						profili.add(new RuoloProgrammaResource(ruolo.getCodice(), descrizioneRuolo, ruolo.getNome(), profilo.getIdProgramma(), profilo.getNomeProgramma(), profilo.getIdProgetto(), profilo.getNomeBreveProgetto(), profilo.getNomeEnte()));
					}
					break;
				case REPP:
				case DEPP:
					descrizioneRuolo = codiceRuolo.equalsIgnoreCase(RuoliUtentiConstants.REPP)? "REFERENTE": "DELEGATO";
					for( ProfiloProjection profilo : this.contestoRepository.findProgrammiProgettiREPPDEPP(codiceFiscale, codiceRuolo)) {
						profili.add(new RuoloProgrammaResource(ruolo.getCodice(), descrizioneRuolo, ruolo.getNome(), profilo.getIdProgramma(), profilo.getNomeProgramma(), profilo.getIdProgetto(), profilo.getNomeBreveProgetto(), profilo.getNomeEnte()));
					}
					break;
				case FACILITATORE:
				case VOLONTARIO:
					//List<Long> listaProgettiPerFacilitatore = espfRepository.findDistinctProgettiByIdFacilitatoreNonTerminato(codiceFiscale, "FAC");
					for( ProfiloProjection profilo : this.contestoRepository.findProgrammiProgettiFacVol(codiceFiscale, codiceRuolo)) {
						profili.add(new RuoloProgrammaResource(ruolo.getCodice(), ruolo.getNome(), ruolo.getNome(), profilo.getIdProgramma(), profilo.getNomeProgramma(), profilo.getIdProgetto(), profilo.getNomeBreveProgetto(), profilo.getNomeEnte()));
					}
					break;
				default:
					//PROFILI PER DTD/DSCU/RUOLI CUSTOM
					profili.add(new RuoloProgrammaResource(ruolo.getCodice(), ruolo.getNome()));
				}
		}
		
		return profili;
	}


	@LogMethod
	@LogExecutionTime
	public List<RuoloResource> getGruppiPermessi(List<RuoloResource> ruoli) {
		List<RuoloResource> ruoliResult = new ArrayList<>();
		for(RuoloResource ruolo : ruoli) {
			//per ogni ruolo recupero la lista dei gruppi associati
			List<GruppoEntity> gruppiPerRuolo = gruppoRepository.findGruppiByRuolo(ruolo.getCodiceRuolo());
			Set<String> permessiList = new HashSet<>();
			for(GruppoEntity gruppo : gruppiPerRuolo) {
				List<String> codiciPermessi = gruppo.getPermessi()
						.stream()
						.map(permesso -> permesso.getCodice())
						.collect(Collectors.toList());
				permessiList.addAll(codiciPermessi);
			}
			ruolo.setPermessi(permessiList);
			ruoliResult.add(ruolo);
		}

		return ruoliResult;
	}


	@LogMethod
	@LogExecutionTime
	@Transactional(rollbackFor = Exception.class)
	public void verificaSceltaProfilo(String codiceFiscaleUtente, String codiceRuoloUtente, Long idProgramma, Long idProgetto){
		switch (codiceRuoloUtente.toUpperCase()) {
			case REG:
			case DEG:		
				if(contestoRepository.verificaUtenteRuoloDEGREGPerProgramma(idProgramma, codiceFiscaleUtente, codiceRuoloUtente) == 0) {
					throw new ContestoException("ERRORE: ruolo non definito per l'utente per il programma scelto", CodiceErroreEnum.C04);
				}
				//se sono REG/DEG verifico se il programma su cui mi trovo è NON ATTIVO --> passo ad ATTIVO il programma e stato_ente_gestore_programma
				//se PROGETTO-SEDE-FACILITATORE associato porto ad attivabile anche il progetto
				String errorMessage = String.format("Programma con id = %s non presente", String.valueOf(idProgramma));
				ProgrammaEntity programma = contestoRepository.findById(idProgramma).
						orElseThrow(() -> {
							return new ResourceNotFoundException(errorMessage, CodiceErroreEnum.C01);
						});
				
				if(StatoEnum.NON_ATTIVO.getValue().equalsIgnoreCase(programma.getStato())) {
					contestoRepository.updateStatoProgrammaToAttivo(idProgramma);
				}
				if(StatoEnum.NON_ATTIVO.getValue().equalsIgnoreCase(programma.getStatoGestoreProgramma())) {
					contestoRepository.updateStatoGestoreProgrammaToAttivo(idProgramma);
					try {
						storicoService.storicizzaEnteGestoreProgramma(programma, StatoEnum.ATTIVO.getValue());
					} catch (Exception ex) {
						throw new ContestoException("ERRORE: Impossibile storicizzare ente", ex, CodiceErroreEnum.C02);
					}
				}
				if(!StatoEnum.TERMINATO.getValue().equalsIgnoreCase(programma.getStato())) {
					contestoRepository.attivaREGDEG(idProgramma, codiceFiscaleUtente, codiceRuoloUtente);
				}
						
				List<Long> idsProgetti = contestoRepository.getIdsProgettiAttivabili(idProgramma);
				if(!idsProgetti.isEmpty()) {
					contestoRepository.rendiProgettiAttivabili(idsProgetti);
				}
				break;
			case REGP:
			case DEGP:
				getProgettoProgramma(idProgetto, idProgramma);
				
				if(contestoRepository.verificaUtenteRuoloDEGPREGPPerProgetto(idProgetto, codiceFiscaleUtente, codiceRuoloUtente) == 0) {
					throw new ContestoException("ERRORE: ruolo non definito per l'utente per il progetto scelto", CodiceErroreEnum.C03);
				}
				//se sono REGP/DEGP se STATO_ENTE_GESTORE_PROGETTO è NON ATTIVO --> STATO A ATTIVO
				//trovo progetto e verifico se STATO_GESTORE_PROGETTO è = NON ATTIVO
				//aggiorno lo stato dell'ente gestore progetto ad ATTIVO
				ProgettoEnteProjection progetto = contestoRepository.getProgettoEnteGestoreProgetto(idProgetto, idProgramma);
				
				if(StatoEnum.NON_ATTIVO.getValue().equals(progetto.getStato())) {
					contestoRepository.updateStatoGestoreProgettoInAttivo(idProgetto);
					try {
						storicoService.storicizzaEnteGestoreProgetto(progettoService.getProgettoById(idProgetto), StatoEnum.ATTIVO.getValue());
					} catch (Exception ex) {
						throw new ContestoException("ERRORE: Impossibile storicizzare ente", ex, CodiceErroreEnum.C01);
					}
				}
				contestoRepository.attivaREGPDEGP(idProgetto, codiceFiscaleUtente, codiceRuoloUtente);
				break;
			case REPP:
			case DEPP:
				getProgettoProgramma(idProgetto, idProgramma);
				
				if(contestoRepository.verificaUtenteRuoloDEPPREPPPerProgetto(idProgetto, codiceFiscaleUtente, codiceRuoloUtente) == 0) {
					throw new ContestoException("ERRORE: ruolo non definito per l'utente per il progetto scelto", CodiceErroreEnum.C05);
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
						} catch (Exception ex) {
							throw new ContestoException("ERRORE: Impossibile storicizzare ente", ex, CodiceErroreEnum.C02);
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
			throw new ContestoException("ERRORE: non esiste la combinazione progetto-programma a sistema", CodiceErroreEnum.C06);
		}
	}

	@LogMethod
	@LogExecutionTime
	public void integraContesto(@Valid IntegraContestoRequest integraContestoRequestRequest) {
		UtenteEntity utenteDBFtech = this.utenteService.getUtenteByCodiceFiscale(integraContestoRequestRequest.getCfUtenteLoggato());
		utenteDBFtech.setIntegrazione(Boolean.TRUE);
		utenteDBFtech.setEmail(integraContestoRequestRequest.getEmail());
		utenteDBFtech.setTelefono(integraContestoRequestRequest.getTelefono());
		utenteDBFtech.setMansione(integraContestoRequestRequest.getBio());
		utenteDBFtech.setTipoContratto(integraContestoRequestRequest.getTipoContratto());
		
		if(integraContestoRequestRequest.getAbilitazioneConsensoTrattamentoDatiPersonali() != Boolean.TRUE) {
			final String messaggioErrore = "Impossibile richiedere integrazione dati senza"
					+ " prima abilitare il consenso al trattamento dati personale.";
			throw new ContestoException(messaggioErrore, CodiceErroreEnum.C07);
		}
		
		utenteDBFtech.setAbilitazioneConsensoTrammentoDati(Boolean.TRUE);
		utenteDBFtech.setDataOraAbilitazioneConsensoDati(new Date());
		utenteDBFtech.setDataOraAggiornamento(new Date());
		utenteDBFtech.setStato(StatoEnum.ATTIVO.getValue());
		try {
			this.utenteService.salvaUtente(utenteDBFtech);
		}catch(Exception e) {
			throw new ContestoException("ERRORE - integrazione: " + e.getMessage(), e);
		}
	}
}