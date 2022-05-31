package it.pa.repdgt.gestioneutente.service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import it.pa.repdgt.gestioneutente.entity.projection.ProgettoEnteProjection;
import it.pa.repdgt.gestioneutente.entity.projection.ProgettoEnteSedeProjection;
import it.pa.repdgt.gestioneutente.exception.ContestoException;
import it.pa.repdgt.gestioneutente.exception.ResourceNotFoundException;
import it.pa.repdgt.gestioneutente.repository.ContestoRepository;
import it.pa.repdgt.gestioneutente.repository.EnteSedeProgettoFacilitatoreRepository;
import it.pa.repdgt.gestioneutente.repository.GruppoRepository;
import it.pa.repdgt.gestioneutente.repository.PermessoRepository;
import it.pa.repdgt.gestioneutente.request.IntegraContestoRequest;
import it.pa.repdgt.gestioneutente.resource.GruppoPermessiResource;
import it.pa.repdgt.gestioneutente.resource.RuoloProgrammaResource;
import it.pa.repdgt.gestioneutente.resource.RuoloResource;
import it.pa.repdgt.shared.constants.RuoliUtentiConstants;
import it.pa.repdgt.shared.entity.GruppoEntity;
import it.pa.repdgt.shared.entity.ProgrammaEntity;
import it.pa.repdgt.shared.entity.RuoloEntity;
import it.pa.repdgt.shared.entity.UtenteEntity;
import it.pa.repdgt.shared.entityenum.StatoEnum;

@Service
public class ContestoService implements RuoliUtentiConstants{
	@Autowired
	private UtenteService utenteService;
	@Autowired
	private ContestoRepository contestoRepository;
	@Autowired
	private EnteSedeProgettoFacilitatoreRepository espfRepository;
	@Autowired
	private GruppoRepository gruppoRepository;
	@Autowired
	private PermessoRepository permessoRepository;
	@Autowired
	private RuoloService ruoloService;

	public UtenteEntity creaContesto(final String codiceFiscale) {
		return this.utenteService.getUtenteEagerByCodiceFiscale(codiceFiscale);
	}
	
	
	public List<RuoloProgrammaResource> getProfili(String codiceFiscale) {
		// RUOLO - Programma X
		UtenteEntity utenteFetch = this.utenteService.getUtenteEagerByCodiceFiscale(codiceFiscale);
		List<RuoloEntity> ruoliUtente = utenteFetch.getRuoli();
		List<RuoloProgrammaResource> profili = new ArrayList<>();
		for(RuoloEntity ruolo: ruoliUtente) {
			switch (ruolo.getCodice()) {
			case DTD:
				profili.add(new RuoloProgrammaResource(ruolo.getCodice(), ruolo.getNome()));
				break;
			case DSCU:
				profili.add(new RuoloProgrammaResource(ruolo.getCodice(), ruolo.getNome()));
				break;
			case REG:
				for( ProgrammaEntity programma : this.contestoRepository.findProgrammiREG(codiceFiscale)) {
					profili.add(new RuoloProgrammaResource(ruolo.getCodice(), ruolo.getNome(), programma.getId().toString(), programma.getNome(), programma.getEnteGestoreProgramma().getNome()));
				}
				break;
			case REGP:
				for( ProgrammaEntity programma : this.contestoRepository.findProgrammiREGP(codiceFiscale)) {
					profili.add(new RuoloProgrammaResource(ruolo.getCodice(), ruolo.getNome(), programma.getId().toString(), programma.getNome(), ""));
				}
				break;
			case REPP:
				for( ProgrammaEntity programma : this.contestoRepository.findProgrammiREPP(codiceFiscale)) {
					profili.add(new RuoloProgrammaResource(ruolo.getCodice(), ruolo.getNome(), programma.getId().toString(), programma.getNome(), ""));
				}
				break;
			case DEG:
				for( ProgrammaEntity programma : this.contestoRepository.findProgrammiDEG(codiceFiscale)) {
					profili.add(new RuoloProgrammaResource(ruolo.getCodice(), ruolo.getNome(), programma.getId().toString(), programma.getNome(), programma.getEnteGestoreProgramma().getNome()));
				}
				break;
			case DEGP:
				for( ProgrammaEntity programma : this.contestoRepository.findProgrammiDEGP(codiceFiscale)) {
					profili.add(new RuoloProgrammaResource(ruolo.getCodice(), ruolo.getNome(), programma.getId().toString(), programma.getNome(), ""));
				}
				break;
			case DEPP:
				for( ProgrammaEntity programma : this.contestoRepository.findProgrammiDEPP(codiceFiscale)) {
					profili.add(new RuoloProgrammaResource(ruolo.getCodice(), ruolo.getNome(), programma.getId().toString(), programma.getNome(), ""));
				}
				break;
			case FACILITATORE:
				List<Long> listaProgettiPerFacilitatore = espfRepository.findDistinctProgettiByIdFacilitatoreNonTerminato(codiceFiscale, "FAC");
				for( ProgrammaEntity programma : this.contestoRepository.findProgrammiFacVol(listaProgettiPerFacilitatore)) {
					profili.add(new RuoloProgrammaResource(ruolo.getCodice(), ruolo.getNome(), programma.getId().toString(), programma.getNome(), ""));
				}
				break;
			case VOLONTARIO:
				List<Long> listaProgettiPerVolontario = espfRepository.findDistinctProgettiByIdFacilitatoreNonTerminato(codiceFiscale, "VOL");
				for( ProgrammaEntity programma : this.contestoRepository.findProgrammiFacVol(listaProgettiPerVolontario)) {
					profili.add(new RuoloProgrammaResource(ruolo.getCodice(), ruolo.getNome(), programma.getId().toString(), programma.getNome(), ""));
				}
				break;
			default:
				break;
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
	public void verificaSceltaProfilo(String codiceFiscaleUtente, String codiceRuoloUtente, Long idProgramma){
		//Verifico se il ruolo è valido per quell'utente avente quel codice fiscale
		boolean hasRuoloUtente = this.ruoloService
				.getRuoliByCodiceFiscaleUtente(codiceFiscaleUtente)
				.stream()
				.anyMatch(codiceRuolo -> codiceRuolo.equalsIgnoreCase(codiceRuoloUtente));
		
		if(!hasRuoloUtente) {
			throw new ContestoException("ERRORE: ruolo non definito per l'utente");
		}
		switch (codiceRuoloUtente) {
			case REG:
			case DEG:
				//se sono REG/DEG verifico se il programma su cui mi trovo è NON ATTIVO --> passo ad ATTIVO il programma e stato_ente_gestore_programma
				//se PROGETTO-SEDE-FACILITATORE associato porto ad attivabile anche il progetto
				String errorMessage = String.format("Programma con id = %s non presente", String.valueOf(idProgramma));
				ProgrammaEntity programma = contestoRepository.findById(idProgramma).
						orElseThrow(() -> {
							return new ResourceNotFoundException(errorMessage);
						});
				
				if(StatoEnum.NON_ATTIVO.getValue().equalsIgnoreCase(programma.getStato())) {
					contestoRepository.updateStatoProgrammaToAttivo(idProgramma);
					if(StatoEnum.NON_ATTIVO.getValue().equalsIgnoreCase(programma.getStatoGestoreProgramma()))
						contestoRepository.updateStatoGestoreProgrammaToAttivo(idProgramma);
					List<Long> idsProgetti = contestoRepository.getIdsProgettiAttivabili(idProgramma);
					if(!idsProgetti.isEmpty())
						contestoRepository.rendiProgettiAttivabili(idsProgetti);
					//TODO: aggiungere logica creazione notifica se progetto passa ad ATTIVABILE
				}
				contestoRepository.attivaREGDEG(idProgramma, codiceFiscaleUtente, codiceRuoloUtente);
				break;
			case REGP:
			case DEGP:
				//se sono REGP/DEGP se STATO_ENTE_GESTORE_PROGETTO è NON ATTIVO --> STATO A ATTIVO
				//trovo progetto/i all'interno del programma idProgramma in cui l'utente è REGP o DEGP
				//aggiorno lo stato dell'ente gestore progetto ad ATTIVO
				List<Long> idsProgetti = contestoRepository.getIdsProgettiPerAttivareGestoreProgettoInAttivo(idProgramma, codiceFiscaleUtente, codiceRuoloUtente);
				if(!idsProgetti.isEmpty())
					contestoRepository.updateStatoGestoreProgettoInAttivo(idsProgetti);
				contestoRepository.attivaREGPDEGP(idProgramma, codiceFiscaleUtente, codiceRuoloUtente);
				break;
			case REPP:
			case DEPP:
				//se sono REPP/DEPP se STATO_ENTE_PARTNER è NON ATTIVO --> STATO A ATTIVO
				//trovo le coppie progetto - ente all'interno del programma idProgramma in cui l'utente è REPP o DEPP
				List<ProgettoEnteProjection> listaProgettoEnte = contestoRepository.findEntiPartnerNonAttiviPerProgrammaECodiceFiscaleReferenteDelegato(idProgramma, codiceFiscaleUtente, codiceRuoloUtente);
				//aggiorno lo stato dell'ente PARTNER ad ATTIVO
				listaProgettoEnte.forEach(progettoEnte -> {
					//solo per le coppie progetto - ente partner in stato non attivo le porto in attivo
					if(StatoEnum.NON_ATTIVO.getValue().equals(progettoEnte.getStato()))
						contestoRepository.updateStatoEntePartnerProgettoToAttivo(progettoEnte.getIdProgetto(), progettoEnte.getIdEnte());
					//a prescindere porto ad ATTIVO lo stato dell'utente come REPP/DEPP per quel progetto ente partner all'interno del programma che ho scelto
					contestoRepository.attivaREPPDEPP(progettoEnte.getIdProgetto(), progettoEnte.getIdEnte(), codiceFiscaleUtente, codiceRuoloUtente);
					});
				break;
			case FACILITATORE:
			case VOLONTARIO:
				//se sono FACILITATORE/VOL e la sede/i a cui sono associato per quel programma ha stato "NON ATTIVA" --> aggiorno stato = ATTIVO
				//trovo tutte le sedi per programma - progetto - ente - facilitatore
				List<ProgettoEnteSedeProjection> listaProgettoEnteSede = contestoRepository.findSediPerProgrammaECodiceFiscaleFacilitatoreVolontario(idProgramma, codiceFiscaleUtente, codiceRuoloUtente);
				//aggiorno le sedi in attivo
				listaProgettoEnteSede.forEach(progettoEnteSede -> {
					if(StatoEnum.NON_ATTIVO.getValue().equals(progettoEnteSede.getStato()))
						contestoRepository.updateStatoSedeProgettoToAttivo(progettoEnteSede.getIdProgetto(), progettoEnteSede.getIdEnte(), progettoEnteSede.getIdSede());
					contestoRepository.attivaFACVOL(progettoEnteSede.getIdProgetto(), progettoEnteSede.getIdEnte(), progettoEnteSede.getIdSede(), codiceFiscaleUtente, codiceRuoloUtente);
				});
				break;
	
			//se sono DTD/DSCU o ruolo custom non faccio niente
			default:
				break;
		}		
	}


	public void integraContesto(@Valid IntegraContestoRequest integraContestoRequestRequest) {
		UtenteEntity utente = this.utenteService.getUtenteByCodiceFiscale(integraContestoRequestRequest.getCodiceFiscale());
		utente.setIntegrazione(true);
		utente.setNome(integraContestoRequestRequest.getNome());
		utente.setCognome(integraContestoRequestRequest.getCognome());
		utente.setEmail(integraContestoRequestRequest.getEmail());
		utente.setTelefono(integraContestoRequestRequest.getNumeroCellulare());
		utente.setDataOraAggiornamento(new Date());
		try {
			this.utenteService.salvaUtente(utente);
		}catch(Exception e) {
			throw new ContestoException("ERRORE - integrazione: " + e.getMessage(), e);
		}
	}
}