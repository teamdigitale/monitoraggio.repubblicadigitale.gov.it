package it.pa.repdgt.gestioneutente.service;

import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import it.pa.repdgt.gestioneutente.bean.DettaglioGruppiBean;
import it.pa.repdgt.gestioneutente.bean.DettaglioRuoloBean;
import it.pa.repdgt.gestioneutente.bean.SchedaRuoloBean;
import it.pa.repdgt.gestioneutente.exception.ResourceNotFoundException;
import it.pa.repdgt.gestioneutente.exception.RuoloException;
import it.pa.repdgt.gestioneutente.repository.RuoloRepository;
import it.pa.repdgt.gestioneutente.request.RuoloRequest;
import it.pa.repdgt.shared.annotation.LogExecutionTime;
import it.pa.repdgt.shared.annotation.LogMethod;
import it.pa.repdgt.shared.constants.TipologiaRuoloConstants;
import it.pa.repdgt.shared.entity.GruppoEntity;
import it.pa.repdgt.shared.entity.RuoloEntity;
import it.pa.repdgt.shared.entityenum.StatoEnum;

@Service
public class RuoloService {
	@Autowired
	private GruppoService gruppoService;
	@Autowired
	private RuoloXGruppoService ruoloXGruppoService;
	@Autowired
	private RuoloRepository ruoloRepository;
	
	@LogExecutionTime
	@LogMethod
	private List<RuoloEntity> getAllRuoli() {
		return this.ruoloRepository.findAll();
	}
	
	@LogExecutionTime
	@LogMethod
	public List<RuoloEntity> getRuoliByTipologiaRuolo(String tipologiaRuolo) {
		if(tipologiaRuolo == null) {
			return this.getAllRuoli();
		}
		
		tipologiaRuolo = tipologiaRuolo.trim().toUpperCase();
		if(!TipologiaRuoloConstants.LISTA_TIPOLOGIA_RUOLI.contains(tipologiaRuolo)) {
			throw new RuoloException("Tipologia ruolo non presente");
		}
		
		if(tipologiaRuolo.equalsIgnoreCase(TipologiaRuoloConstants.PREDEFINITO)) {
			return this.ruoloRepository.findAllRuoliPredefiniti();
		} 
		
		return this.ruoloRepository.findAllRuoliNonPredefiniti();
	}
	

	@LogExecutionTime
	@LogMethod
	public RuoloEntity getRuoloByCodiceRuolo(String codiceRuolo) {
		String messaggioErrore = String.format("Ruolo con codice = %s non trovato", codiceRuolo);
		return this.ruoloRepository.findById(codiceRuolo)
				.orElseThrow( () -> new ResourceNotFoundException(messaggioErrore));
	}
	
	public List<String> getRuoliByCodiceFiscaleUtente(String codiceFiscale) {
		return this.ruoloRepository.findRuoloByCodiceFiscaleUtente(codiceFiscale);
    }

	public List<RuoloEntity> getRuoliCompletiByCodiceFiscaleUtente(String cfUtente) {
		return this.ruoloRepository.findRuoloCompletoByCodiceFiscaleUtente(cfUtente);
	}

	public List<RuoloEntity> getRuoliByFiltroDiRicerca(String nomeRuolo) {
		if(nomeRuolo == null || nomeRuolo.trim().isEmpty()){
			return this.getAllRuoli();
		}
		return Arrays.asList( this.getRuoloByNome(nomeRuolo.trim().toUpperCase()) );
	}
	
	@LogMethod
	@LogExecutionTime
	public boolean esisteRuoloByCodice(String codiceRuolo) {
		return this.ruoloRepository.findByCodice(codiceRuolo).isPresent();
	}
	
	@LogMethod
	@LogExecutionTime
	public RuoloEntity getRuoloByNome(String nomeRuolo) {
		String messaggioErrore = String.format("Ruolo con nome = %s non trovato", nomeRuolo);
		return this.ruoloRepository.findByNomeContaining(nomeRuolo)
				.orElseThrow( () -> new ResourceNotFoundException(messaggioErrore));
	}

	@LogExecutionTime
	@LogMethod
	public boolean existsRuoloByNome(String nomeRuolo) {
		return this.ruoloRepository.findById(nomeRuolo).isPresent();
	}
	
	@LogExecutionTime
	@LogMethod
	public List<GruppoEntity> getGruppByRuolo(String codiceRuolo){
		if(!this.esisteRuoloByCodice(codiceRuolo)) {
			String messaggioErrore = String.format("Il ruolo %s non esiste", codiceRuolo);
			throw new ResourceNotFoundException(messaggioErrore);
		}
		return this.gruppoService.getGruppiByRuolo(codiceRuolo);
	}

	@LogExecutionTime
	@LogMethod
	public void creaNuovoRuolo(RuoloRequest nuovoRuoloRequest) {
		String nomeRuolo = nuovoRuoloRequest.getNomeRuolo();
		String messaggioErrore = String.format("Ruolo con nome = %s già presente", nomeRuolo);
		if(this.existsRuoloByNome(nomeRuolo)) {
			throw new RuntimeException(messaggioErrore);
		}
		RuoloEntity nuovoRuolo = new RuoloEntity();
		nuovoRuolo.setCodice(nomeRuolo);
		nuovoRuolo.setNome(nomeRuolo);
		nuovoRuolo.setPredefinito(false);
		nuovoRuolo.setStato(StatoEnum.NON_ATTIVO.getValue());
		nuovoRuolo.setModificabile(true);
		nuovoRuolo.setDataOraCreazione(new Date());
		nuovoRuolo.setDataOraAggiornamento(nuovoRuolo.getDataOraCreazione());
		this.aggiungiGruppiAlRuolo(nuovoRuoloRequest.getCodiciGruppi(), nuovoRuolo);
		this.ruoloRepository.save(nuovoRuolo);
	}
	
	public void aggiungiGruppiAlRuolo(List<String> codiciGruppi, RuoloEntity ruolo) {
		List<GruppoEntity> gruppi = this.gruppoService.getGruppiByCodiciGruppi(codiciGruppi);
		if(gruppi != null) {
			gruppi.forEach(ruolo::aggiungiGruppo);
		}
	}
	
	@Transactional(rollbackOn = Exception.class)
	public void aggiornaRuoloNonPredefinito(String codiceRuolo, RuoloRequest ruoloRequest) {
		RuoloEntity ruoloFetch = this.getRuoloByCodiceRuolo(codiceRuolo);
		// se ruolo è un ruolo predefinito, allora non è possibile aggiornalo ==> errore
		if(ruoloFetch.getPredefinito() == Boolean.TRUE) {
			String messaggioErrore = String.format("Impossibile aggiornare ruolo predefinito con codice ruolo = %s", codiceRuolo);
			throw new RuoloException(messaggioErrore);
		}
		ruoloFetch.setNome(ruoloRequest.getNomeRuolo());
		ruoloFetch.setDataOraAggiornamento(new Date());
		List<String> codiciGruppi = ruoloRequest.getCodiciGruppi();
		this.ruoloRepository.save(ruoloFetch);
		this.ruoloXGruppoService.aggiornaAssociazioniRuoloGruppo(codiceRuolo, codiciGruppi);
	}

	@Transactional(rollbackOn = Exception.class)
	public void cancellazioneRuolo(String codiceRuolo) {
		if(codiceRuolo.equals("DTD") || codiceRuolo.equals("DSCU")) {
			String errorMessage = String.format("Impossibile cancellare i ruoli di DTD e DSCU");
			throw new RuoloException(errorMessage);
		}
		RuoloEntity ruoloFetch = this.getRuoloByCodiceRuolo(codiceRuolo);
		if(ruoloFetch.getPredefinito() == true) {
			String errorMessage = String.format("Impossibile cancellare i ruoli predefiniti");
			throw new RuoloException(errorMessage);
		}
		if(this.countUtentiPerRuolo(codiceRuolo) > 0) {
			String errorMessage = String.format("Impossibile cancellare i ruoli associati agli utenti");
			throw new RuoloException(errorMessage);
		}
		this.ruoloRepository.delete(ruoloFetch);
	}

	private int countUtentiPerRuolo(String codiceRuolo) {
		return this.ruoloRepository.countUtentiPerRuolo(codiceRuolo);
	}

	public SchedaRuoloBean getSchedaRuoloByCodiceRuolo(String codiceRuolo) {
		RuoloEntity ruoloFetchDB = this.getRuoloByCodiceRuolo(codiceRuolo);
		
		DettaglioRuoloBean dettaglioRuolo = new DettaglioRuoloBean();
		dettaglioRuolo.setNome(ruoloFetchDB.getNome());
		dettaglioRuolo.setStato(ruoloFetchDB.getStato());
		dettaglioRuolo.setTipologia(ruoloFetchDB.getPredefinito() ? "P" : "NP");
		dettaglioRuolo.setModificabile(ruoloFetchDB.getModificabile());

		List<GruppoEntity> listaGruppiPerRuolo = this.gruppoService.getGruppiByRuolo(codiceRuolo);
		List<DettaglioGruppiBean> listaDettaglioGruppi = listaGruppiPerRuolo.stream()
															   .map(gruppo -> {
																   DettaglioGruppiBean dettaglioGruppo = new DettaglioGruppiBean();
																   dettaglioGruppo.setCodice(gruppo.getCodice());
																   dettaglioGruppo.setDescrizione(gruppo.getDescrizione());
																   return dettaglioGruppo;
															   })
															   .collect(Collectors.toList());
		SchedaRuoloBean schedaRuolo = new SchedaRuoloBean();
		schedaRuolo.setDettaglioRuolo(dettaglioRuolo);
		schedaRuolo.setDettaglioGruppi(listaDettaglioGruppi);
		return schedaRuolo;
	}
}