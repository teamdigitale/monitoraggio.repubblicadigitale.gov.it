package it.pa.repdgt.ente.service;

import java.util.Date;
import java.util.List;

import javax.transaction.Transactional;
import javax.validation.constraints.NotNull;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

import it.pa.repdgt.ente.exception.EnteSedeProgettoFacilitatoreException;
import it.pa.repdgt.ente.repository.EnteSedeProgettoFacilitatoreRepository;
import it.pa.repdgt.ente.request.EnteSedeProgettoFacilitatoreRequest;
import it.pa.repdgt.shared.constants.RuoliUtentiConstants;
import it.pa.repdgt.shared.entity.EnteSedeProgettoFacilitatoreEntity;
import it.pa.repdgt.shared.entity.RuoloEntity;
import it.pa.repdgt.shared.entity.UtenteEntity;
import it.pa.repdgt.shared.entity.key.EnteSedeProgettoFacilitatoreKey;
import it.pa.repdgt.shared.entityenum.StatoEnum;

@Service
@Validated
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

	public List<EnteSedeProgettoFacilitatoreEntity> getAllFacilitatoriByEnteAndSedeAndProgetto(Long idEnte, Long idSede, Long idProgetto) {
		return this.enteSedeProgettoFacilitatoreRepository.findAllFacilitatoriByEnteAndSedeAndProgetto(idEnte, idSede, idProgetto);
	}
	
	@Transactional(rollbackOn = Exception.class)
	public void associaFacilitatoreAEnteSedeProgetto(EnteSedeProgettoFacilitatoreRequest enteSedeProgettoFacilitatoreRequest) {
		String codiceFiscaleUtente = enteSedeProgettoFacilitatoreRequest.getCodiceFiscaleUtente();
		String tipoContratto = enteSedeProgettoFacilitatoreRequest.getTipoContratto();
		Long idSede = enteSedeProgettoFacilitatoreRequest.getIdSede();
		Long idEnte = enteSedeProgettoFacilitatoreRequest.getIdEnte();
		Long idProgetto = enteSedeProgettoFacilitatoreRequest.getIdProgetto();
		String codiceRuolo = enteSedeProgettoFacilitatoreRequest.getCodiceRuolo();
		
		// verifico se utente esiste
		boolean esisteUtente = this.utenteService.esisteUtenteByCodiceFiscale(codiceFiscaleUtente);
		if(!esisteUtente) {
			throw new EnteSedeProgettoFacilitatoreException(String.format("Impossibile associare facilitatore. Utente con codiceFiscale=%s non trovato", codiceFiscaleUtente));
		}
		
		// verifico se ente, sede e progetto esistono
		boolean esisteEnte = this.enteService.esisteEnteById(idEnte);
		boolean esisteSede = this.sedeService.esisteSedeById(idSede);
		boolean esisteProgetto = this.progettoService.esisteProgettoById(idProgetto);
		
		if(!(esisteEnte && esisteSede && esisteProgetto)) {
			String errorMessage = String.format("Impossibile associare facilitatore/volontario codiceFiscale=%s alla sede con id=% per l'ente con id=%s sul progetto con id=%s, sede e/o ente e/o progetto non esistente/i", 
					codiceFiscaleUtente, idSede, idEnte, idProgetto);
			throw new EnteSedeProgettoFacilitatoreException(errorMessage);
		}
		
		EnteSedeProgettoFacilitatoreKey id = new EnteSedeProgettoFacilitatoreKey(idEnte, idSede, idProgetto, codiceFiscaleUtente);
		EnteSedeProgettoFacilitatoreEntity enteSedeProgettoFacilitatore = new EnteSedeProgettoFacilitatoreEntity();
		enteSedeProgettoFacilitatore.setId(id);
		enteSedeProgettoFacilitatore.setRuoloUtente(codiceRuolo);
		if(this.enteSedeProgettoFacilitatoreRepository.existsById(id)) {
			String messaggioErrore = String.format("Impossibile assegnare facilitatore/volontario a ente, sede, progetto perchè l'utente con codice fiscale =%s è già facilitatore/volontario", codiceFiscaleUtente);
			throw new EnteSedeProgettoFacilitatoreException(messaggioErrore);
		}
		enteSedeProgettoFacilitatore.setDataOraCreazione(new Date());
		this.enteSedeProgettoFacilitatoreRepository.save(enteSedeProgettoFacilitatore);
		
		RuoloEntity ruolo = this.ruoloService.getRuoloByCodiceRuolo(codiceRuolo);
		UtenteEntity utenteFetch = this.utenteService.getUtenteByCodiceFiscale(codiceFiscaleUtente);
		if(utenteFetch.getTipoContratto() == null) {
			utenteFetch.setTipoContratto(tipoContratto);
			this.utenteService.updateUtente(utenteFetch);
		}
		if(!utenteFetch.getRuoli().contains(ruolo)) {
			this.ruoloService.aggiungiRuoloAUtente(codiceFiscaleUtente, codiceRuolo);
		}
	}
	
	@Transactional(rollbackOn = Exception.class)
	public void cancellaOTerminaAssociazioneFacilitatoreAEnteSedeProgetto(
			EnteSedeProgettoFacilitatoreRequest enteSedeProgettoFacilitatoreRequest) {
		String codiceFiscaleUtente = enteSedeProgettoFacilitatoreRequest.getCodiceFiscaleUtente();
		Long idSede = enteSedeProgettoFacilitatoreRequest.getIdSede();
		Long idEnte = enteSedeProgettoFacilitatoreRequest.getIdEnte();
		Long idProgetto = enteSedeProgettoFacilitatoreRequest.getIdProgetto();
		String codiceRuolo = enteSedeProgettoFacilitatoreRequest.getCodiceRuolo();
		
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
			throw new EnteSedeProgettoFacilitatoreException("Impossibile cancellare associazione facilitatore. E' l'unico facilitatore ATTIVO del progetto. Per eliminarlo procedere prima con l'associazione di un altro facilitatore al progetto.");
		}
		//quando lo stato del facilitatore è attivo dobbiamo terminarlo
		this.terminaAssociazioneFacilitatoreOVolontario(id);
	}
	
	@Transactional(rollbackOn = Exception.class)
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
		
	private void terminaAssociazioneFacilitatoreOVolontario(EnteSedeProgettoFacilitatoreKey id) {
		EnteSedeProgettoFacilitatoreEntity enteSedeProgettoFacilitatoreFetch = this.enteSedeProgettoFacilitatoreRepository.getById(id);
		enteSedeProgettoFacilitatoreFetch.setStatoUtente(StatoEnum.TERMINATO.getValue());
		enteSedeProgettoFacilitatoreFetch.setDataOraTerminazione(new Date());
		this.enteSedeProgettoFacilitatoreRepository.save(enteSedeProgettoFacilitatoreFetch);
	}

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
	
	public void cancellazioneAssociazioniEnteSedeProgettoFacilitatoreByIdEnteAndIdProgetto(Long idEnte, Long idProgetto) {
		this.enteSedeProgettoFacilitatoreRepository.cancellazioneAssociazioniEnteSedeProgettoFacilitatoreByIdEnteAndIdProgetto(idEnte, idProgetto);
	}

	public List<EnteSedeProgettoFacilitatoreEntity> getFacilitatoriByIdEnteAndIdProgetto(Long idEnte, Long idProgetto) {
		return this.enteSedeProgettoFacilitatoreRepository.getFacilitatoriByIdEnteAndIdProgetto(idEnte, idProgetto);
	}

	public int countAssociazioniFacilitatoreAndVolontario(String facilitatore, String codiceRuolo) {
		return this.enteSedeProgettoFacilitatoreRepository.countAssociazioniFacilitatoreAndVolontario(facilitatore, codiceRuolo);
	}
}