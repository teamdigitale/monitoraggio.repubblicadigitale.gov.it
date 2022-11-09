package it.pa.repdgt.ente.service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

import javax.transaction.Transactional;
import javax.validation.constraints.NotNull;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

import it.pa.repdgt.ente.exception.EnteSedeProgettoFacilitatoreException;
import it.pa.repdgt.ente.repository.EnteSedeProgettoFacilitatoreRepository;
import it.pa.repdgt.ente.request.EnteSedeProgettoFacilitatoreRequest;
import it.pa.repdgt.shared.annotation.LogExecutionTime;
import it.pa.repdgt.shared.annotation.LogMethod;
import it.pa.repdgt.shared.awsintegration.service.EmailService;
import it.pa.repdgt.shared.awsintegration.service.WorkDocsService;
import it.pa.repdgt.shared.constants.RuoliUtentiConstants;
import it.pa.repdgt.shared.entity.EnteSedeProgetto;
import it.pa.repdgt.shared.entity.EnteSedeProgettoFacilitatoreEntity;
import it.pa.repdgt.shared.entity.ProgettoEntity;
import it.pa.repdgt.shared.entity.RuoloEntity;
import it.pa.repdgt.shared.entity.UtenteEntity;
import it.pa.repdgt.shared.entity.key.EnteSedeProgettoFacilitatoreKey;
import it.pa.repdgt.shared.entityenum.EmailTemplateEnum;
import it.pa.repdgt.shared.entityenum.PolicyEnum;
import it.pa.repdgt.shared.entityenum.RuoloUtenteEnum;
import it.pa.repdgt.shared.entityenum.StatoEnum;
import it.pa.repdgt.shared.exception.CodiceErroreEnum;
import lombok.extern.slf4j.Slf4j;

@Service
@Validated
@Slf4j
public class EnteSedeProgettoFacilitatoreService {
	@Autowired
	private UtenteService utenteService;
	@Autowired
	private SedeService sedeService;
	@Autowired
	private ProgettoService progettoService;
	@Autowired
	@Lazy
	private EnteService enteService;
	@Autowired
	private RuoloService ruoloService;
	@Autowired
	private EnteSedeProgettoFacilitatoreRepository enteSedeProgettoFacilitatoreRepository;
	@Autowired
	@Lazy
	private EnteSedeProgettoService enteSedeProgettoService;
	@Autowired
	private EmailService emailService;
	@Autowired
	private WorkDocsService workdocsService;

	@LogMethod
	@LogExecutionTime
	public List<EnteSedeProgettoFacilitatoreEntity> getAllFacilitatoriByEnteAndSedeAndProgetto(Long idEnte, Long idSede, Long idProgetto) {
		return this.enteSedeProgettoFacilitatoreRepository.findAllFacilitatoriByEnteAndSedeAndProgetto(idEnte, idSede, idProgetto);
	}
	
	@LogMethod
	@LogExecutionTime
	@Transactional(rollbackOn = Exception.class)
	public void associaFacilitatoreAEnteSedeProgetto(EnteSedeProgettoFacilitatoreRequest enteSedeProgettoFacilitatoreRequest) {
		String codiceFiscaleUtente = enteSedeProgettoFacilitatoreRequest.getCodiceFiscaleFacVol();
		String tipoContratto = enteSedeProgettoFacilitatoreRequest.getTipoContratto();
		Long idSede = enteSedeProgettoFacilitatoreRequest.getIdSedeFacVol();
		Long idEnte = enteSedeProgettoFacilitatoreRequest.getIdEnteFacVol();
		Long idProgetto = enteSedeProgettoFacilitatoreRequest.getIdProgettoFacVol();
		String codiceRuolo;
		
		// verifico se utente esiste
		boolean esisteUtente = this.utenteService.esisteUtenteByCodiceFiscale(codiceFiscaleUtente);
		if(!esisteUtente) {
			throw new EnteSedeProgettoFacilitatoreException(
					String.format("Impossibile associare facilitatore. Utente con codiceFiscale=%s non trovato", codiceFiscaleUtente),
					CodiceErroreEnum.EN07);
		}
		
		// verifico se ente, sede e progetto esistono
		boolean esisteEnte = this.enteService.esisteEnteById(idEnte);
		boolean esisteSede = this.sedeService.esisteSedeById(idSede);
		boolean esisteProgetto = this.progettoService.esisteProgettoById(idProgetto);
		
		if(!(esisteEnte && esisteSede && esisteProgetto)) {
			String errorMessage = String.format("Impossibile associare facilitatore/volontario codiceFiscale=%s alla sede con id=%s per l'ente con id=%s sul progetto con id=%s, sede e/o ente e/o progetto non esistente/i", 
					codiceFiscaleUtente, idSede, idEnte, idProgetto);
			throw new EnteSedeProgettoFacilitatoreException(errorMessage, CodiceErroreEnum.EN07);
		}
		
		final ProgettoEntity progettoDBFEtch = this.progettoService.getProgettoById(idProgetto);
		
		final UtenteEntity utenteDBFetch = this.utenteService.getUtenteByCodiceFiscale(codiceFiscaleUtente);
		final RuoloEntity ruoloFacilitatore = this.ruoloService.getRuoloByCodiceRuolo(RuoloUtenteEnum.FAC.toString());
		final RuoloEntity ruoloVolontario = this.ruoloService.getRuoloByCodiceRuolo(RuoloUtenteEnum.VOL.toString());
		
		if(PolicyEnum.RFD.getValue().equals(progettoDBFEtch.getProgramma().getPolicy().getValue())) {
			if(utenteDBFetch.getRuoli().contains(ruoloVolontario)) {
				String errorMessage = String.format("Impossibile associare facilitatore con codiceFiscale=%s alla sede con id=%s per l'ente con id=%s sul progetto con id=%s, l'utente è già un volontario",
						codiceFiscaleUtente, idSede, idEnte, idProgetto);
				throw new EnteSedeProgettoFacilitatoreException(errorMessage, CodiceErroreEnum.EN07);
			}
			codiceRuolo = RuoloUtenteEnum.FAC.toString();
		} else {
			if(utenteDBFetch.getRuoli().contains(ruoloFacilitatore)) {
				String errorMessage = String.format("Impossibile associare volontario con codiceFiscale=%s alla sede con id=%s per l'ente con id=%s sul progetto con id=%s, l'utente è già un facilitatore",
						codiceFiscaleUtente, idSede, idEnte, idProgetto);
				throw new EnteSedeProgettoFacilitatoreException(errorMessage, CodiceErroreEnum.EN07);
			}
			codiceRuolo = RuoloUtenteEnum.VOL.toString();
		}
		
		EnteSedeProgettoFacilitatoreKey id = new EnteSedeProgettoFacilitatoreKey(idEnte, idSede, idProgetto, codiceFiscaleUtente);
		EnteSedeProgettoFacilitatoreEntity enteSedeProgettoFacilitatore = new EnteSedeProgettoFacilitatoreEntity();
		enteSedeProgettoFacilitatore.setId(id);
		enteSedeProgettoFacilitatore.setStatoUtente(StatoEnum.NON_ATTIVO.getValue());
		enteSedeProgettoFacilitatore.setRuoloUtente(codiceRuolo);
		if(this.enteSedeProgettoFacilitatoreRepository.existsById(id)) {
			String messaggioErrore = String.format("Impossibile assegnare facilitatore/volontario a ente, sede, progetto perchè l'utente con codice fiscale =%s è già facilitatore/volontario", codiceFiscaleUtente);
			throw new EnteSedeProgettoFacilitatoreException(messaggioErrore, CodiceErroreEnum.EN07);
		}
		enteSedeProgettoFacilitatore.setDataOraCreazione(new Date());
		enteSedeProgettoFacilitatore.setDataOraAggiornamento(new Date());
		this.enteSedeProgettoFacilitatoreRepository.save(enteSedeProgettoFacilitatore);
		
		EnteSedeProgetto enteSedeProgetto = enteSedeProgettoService.getAssociazioneEnteSedeProgetto(idSede, idEnte, idProgetto);
		if(StatoEnum.NON_ATTIVO.getValue().equalsIgnoreCase(enteSedeProgetto.getStatoSede())) {
			enteSedeProgetto.setStatoSede(StatoEnum.ATTIVO.getValue());
			enteSedeProgetto.setDataAttivazioneSede(new Date());
			enteSedeProgetto.setDataOraAggiornamento(new Date());
			enteSedeProgettoService.salvaEnteSedeProgetto(enteSedeProgetto);
		}
		
		// controllo se progetto con id progetto è NON ATTIVO --> passa ad attivabile 
		// perchè e' stato associato il primo facilitatore a quel progetto per quell'ente su quella sede
		if(progettoDBFEtch.getStato().equalsIgnoreCase(StatoEnum.NON_ATTIVO.getValue())) {
			// aggiornare lo stato del progetto da NON ATTIVO a ATTIVABILE
			progettoDBFEtch.setStato(StatoEnum.ATTIVABILE.getValue());
			progettoDBFEtch.setDataOraAggiornamento(new Date());
			progettoDBFEtch.setDataOraProgettoAttivabile(new Date());
			this.progettoService.salvaOAggiornaProgetto(progettoDBFEtch);
		}
		
		RuoloEntity ruolo = this.ruoloService.getRuoloByCodiceRuolo(codiceRuolo);
		UtenteEntity utenteFetch = this.utenteService.getUtenteByCodiceFiscale(codiceFiscaleUtente);
		if(utenteFetch.getTipoContratto() == null) {
			utenteFetch.setTipoContratto(tipoContratto);
			this.utenteService.updateUtente(utenteFetch);
		}
		if(!utenteFetch.getRuoli().contains(ruolo)) {
			this.ruoloService.aggiungiRuoloAUtente(codiceFiscaleUtente, codiceRuolo);
		}
		
		if(StatoEnum.ATTIVO.getValue().equalsIgnoreCase(progettoDBFEtch.getStato())) {
			//STACCO UN THREAD E INVIO EMAIL WELCOME KIT AL FACILITATORE SSE IL PROGETTO E' ATTIVO
			new Thread(() ->{
				try {
					this.emailService.inviaEmail(utenteFetch.getEmail(), 
							EmailTemplateEnum.FACILITATORE, 
							new String[] { utenteFetch.getNome(), RuoloUtenteEnum.valueOf(codiceRuolo).getValue() });
				} catch (Exception ex) {
					log.error("Impossibile inviare la mail al facilitatore del progetto con id={}.", idProgetto);
					log.error("{}", ex);
				}
			}).start();
		}
	}
	
	@Transactional(rollbackOn = Exception.class)
	@LogMethod
	@LogExecutionTime
	public void cancellaOTerminaAssociazioneFacilitatoreAEnteSedeProgetto(
			EnteSedeProgettoFacilitatoreRequest enteSedeProgettoFacilitatoreRequest) {
		String codiceFiscaleUtente = enteSedeProgettoFacilitatoreRequest.getCodiceFiscaleFacVol();
		Long idSede = enteSedeProgettoFacilitatoreRequest.getIdSedeFacVol();
		Long idEnte = enteSedeProgettoFacilitatoreRequest.getIdEnteFacVol();
		Long idProgetto = enteSedeProgettoFacilitatoreRequest.getIdProgettoFacVol();
		String codiceRuolo;
		
		final ProgettoEntity progettoDBFEtch = this.progettoService.getProgettoById(idProgetto);
		
		if(PolicyEnum.RFD.getValue().equals(progettoDBFEtch.getProgramma().getPolicy().getValue())) {
			codiceRuolo = "FAC";
		} else {
			codiceRuolo = "VOL";
		}
		
		EnteSedeProgettoFacilitatoreKey id = new EnteSedeProgettoFacilitatoreKey(idEnte, idSede, idProgetto, codiceFiscaleUtente);
		if(this.enteSedeProgettoFacilitatoreRepository.findById(id).get().getStatoUtente().equals(StatoEnum.NON_ATTIVO.getValue())) {
			this.cancellaAssociazioneFacilitatore(idEnte, idSede, idProgetto, codiceFiscaleUtente, codiceRuolo);
			return;
		}
		
		/*Verifico se il Facilitatore al quale voglio cancellare l'associazione
		 * è l'unico facilitatore del progetto. Se sì lancio eccezione
		 */
		boolean isUnicoFacilitatore = this.enteSedeProgettoFacilitatoreRepository.findAltriFacilitatoriAttivi(codiceFiscaleUtente, idProgetto, codiceRuolo).isEmpty();
		
		if(RuoliUtentiConstants.FACILITATORE.equals(codiceRuolo) && isUnicoFacilitatore) {
			throw new EnteSedeProgettoFacilitatoreException(
					"Impossibile cancellare associazione facilitatore. E' l'unico facilitatore ATTIVO del progetto. "
					+ "Per eliminarlo procedere prima con l'associazione di un altro facilitatore al progetto.",
					CodiceErroreEnum.EN08);
		}
		if(RuoliUtentiConstants.VOLONTARIO.equals(codiceRuolo) && isUnicoFacilitatore) {
			throw new EnteSedeProgettoFacilitatoreException("Impossibile cancellare associazione volontario. E' l'unico volontario ATTIVO del progetto. "
					+ "Per eliminarlo procedere prima con l'associazione di un altro volontario al progetto.",
					CodiceErroreEnum.EN08);
		}
		//quando lo stato del facilitatore è attivo dobbiamo terminarlo
		this.terminaAssociazioneFacilitatoreOVolontario(id);
	}
	
	@Transactional(rollbackOn = Exception.class)
	@LogMethod
	@LogExecutionTime
	public void cancellaOTerminaAssociazioneFacilitatoreOVolontarioAEnteSedeProgetto(
			EnteSedeProgettoFacilitatoreEntity enteSedeProgettoFacilitatore) {
		
		EnteSedeProgettoFacilitatoreKey id = enteSedeProgettoFacilitatore.getId();
		//quando lo stato del facilitatore è attivo dobbiamo terminarlo
		if(this.enteSedeProgettoFacilitatoreRepository.findById(id).get().getStatoUtente().equals(StatoEnum.ATTIVO.getValue())) {
			this.terminaAssociazioneFacilitatoreOVolontario(id);
		}
		if(this.enteSedeProgettoFacilitatoreRepository.findById(id).get().getStatoUtente().equals(StatoEnum.NON_ATTIVO.getValue())) {
			this.cancellaAssociazioneFacilitatore(
					enteSedeProgettoFacilitatore.getId().getIdEnte(),
					enteSedeProgettoFacilitatore.getId().getIdSede(),
					enteSedeProgettoFacilitatore.getId().getIdProgetto(),
					enteSedeProgettoFacilitatore.getId().getIdFacilitatore(),
					enteSedeProgettoFacilitatore.getRuoloUtente()
					);
		}
	}
		

	@LogMethod
	@LogExecutionTime
	@Transactional(rollbackOn = Exception.class)
	public void terminaAssociazioneFacilitatoreOVolontario(EnteSedeProgettoFacilitatoreKey id) {
		EnteSedeProgettoFacilitatoreEntity enteSedeProgettoFacilitatoreFetch = this.enteSedeProgettoFacilitatoreRepository.findById(id).get();
		enteSedeProgettoFacilitatoreFetch.setStatoUtente(StatoEnum.TERMINATO.getValue());
		enteSedeProgettoFacilitatoreFetch.setDataOraTerminazione(new Date());
		this.enteSedeProgettoFacilitatoreRepository.save(enteSedeProgettoFacilitatoreFetch);
		
		final String codiceFiscaleUtenteFacilitaore = id.getIdFacilitatore();
		final UtenteEntity utenteDBFetch = this.utenteService.getUtenteByCodiceFiscale(codiceFiscaleUtenteFacilitaore);
		
		String idUtenteWorkdocs = utenteDBFetch.getIntegrazioneUtente().getIdUtenteWorkdocs();
		if(utenteDBFetch.getRuoli().size() == 1 && idUtenteWorkdocs != null) {
			try {
				new Thread(() -> {
					this.workdocsService.disattivaWorkDocsUser(idUtenteWorkdocs);
				}).start();
			} catch (Exception ex) {
				log.error("Errore disattivazione utente workdocs ", ex);
			}
		}
	}

	@LogMethod
	@LogExecutionTime
	@Transactional(rollbackOn = Exception.class)
	public void cancellaAssociazioniFacilitatoriOVolontariAEnteSedeProgetto(
			@NotNull Long idSede, 
			@NotNull Long idEnte, 
			@NotNull Long idProgetto) {
		
		List<EnteSedeProgettoFacilitatoreEntity> facilitatoriEVolontari = this.getAllFacilitatoriByEnteAndSedeAndProgetto(idEnte, idSede, idProgetto);
		
		facilitatoriEVolontari.stream().forEach(facilitatoreOVolontario -> {
			this.cancellaAssociazioneFacilitatore(
					facilitatoreOVolontario.getId().getIdEnte(),
					facilitatoreOVolontario.getId().getIdSede(),
					facilitatoreOVolontario.getId().getIdProgetto(),
					facilitatoreOVolontario.getId().getIdFacilitatore(),
					facilitatoreOVolontario.getRuoloUtente());
		});
	}

	@LogMethod
	@LogExecutionTime
	@Transactional(rollbackOn = Exception.class)
	public void cancellaAssociazioneFacilitatore(Long idEnte, Long idSede, Long idProgetto, String codiceFiscaleUtente, String codiceRuolo) {
		EnteSedeProgettoFacilitatoreKey id = new EnteSedeProgettoFacilitatoreKey(idEnte, idSede, idProgetto, codiceFiscaleUtente);
		this.enteSedeProgettoFacilitatoreRepository.deleteById(id);	
		
		//Controllo se l'utente è FAC o VOL(a seconda del codiceRuolo che mi viene passato) su altri gestori progetto oltre a questo
		boolean unicaAssociazione = this.enteSedeProgettoFacilitatoreRepository.findAltreAssociazioni(idProgetto, codiceFiscaleUtente, codiceRuolo).isEmpty();
		
		/*Se la condizione sopra è vera allora insieme all'associazione del referente al gestore progetto
		 * imposterò a cancellato anche l'associazione dell'utente al ruolo
		 */
		if(unicaAssociazione) {
			this.ruoloService.cancellaRuoloUtente(codiceFiscaleUtente, codiceRuolo);
		}
	}
	
	@LogMethod
	@LogExecutionTime
	public void cancellazioneAssociazioniEnteSedeProgettoFacilitatoreByIdEnteAndIdProgetto(Long idEnte, Long idProgetto) {
		this.enteSedeProgettoFacilitatoreRepository.cancellazioneAssociazioniEnteSedeProgettoFacilitatoreByIdEnteAndIdProgetto(idEnte, idProgetto);
	}

	@LogMethod
	@LogExecutionTime
	public List<EnteSedeProgettoFacilitatoreEntity> getFacilitatoriByIdEnteAndIdProgetto(Long idEnte, Long idProgetto) {
		return this.enteSedeProgettoFacilitatoreRepository.getFacilitatoriByIdEnteAndIdProgetto(idEnte, idProgetto);
	}

	@LogMethod
	@LogExecutionTime
	public int countAssociazioniFacilitatoreAndVolontario(String facilitatore, String codiceRuolo) {
		return this.enteSedeProgettoFacilitatoreRepository.countAssociazioniFacilitatoreAndVolontario(facilitatore, codiceRuolo);
	}

	@LogMethod
	@LogExecutionTime
	public Optional<EnteSedeProgettoFacilitatoreEntity> getEnteSedeProgettoFacilitatoreById(EnteSedeProgettoFacilitatoreKey id) {
		return this.enteSedeProgettoFacilitatoreRepository.findById(id);
	}
}