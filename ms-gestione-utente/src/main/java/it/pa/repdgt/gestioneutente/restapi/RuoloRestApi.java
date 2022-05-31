package it.pa.repdgt.gestioneutente.restapi;

import java.util.List;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import it.pa.repdgt.gestioneutente.bean.SchedaRuoloBean;
import it.pa.repdgt.gestioneutente.mapper.RuoloMapper;
import it.pa.repdgt.gestioneutente.request.RuoloRequest;
import it.pa.repdgt.gestioneutente.resource.RuoloLightResource;
import it.pa.repdgt.gestioneutente.service.RuoloService;
import it.pa.repdgt.gestioneutente.service.UtenteService;
import it.pa.repdgt.shared.constants.TipologiaRuoloConstants;
import it.pa.repdgt.shared.entity.RuoloEntity;
import it.pa.repdgt.shared.entity.UtenteEntity;

@RestController
@RequestMapping(path = "/ruolo")
public class RuoloRestApi {
	@Autowired
	private UtenteService utenteService;
	@Autowired
	private RuoloService ruoloService;
	@Autowired
	private RuoloMapper ruoloMapper;
	
	// TOUCH POINT - 1.3.7 B 
	@GetMapping
	@ResponseStatus(value = HttpStatus.OK)
	public List<RuoloLightResource>  getAllRuoliByTipologia(
			@RequestParam(
				required = false, 
				defaultValue = TipologiaRuoloConstants.PREDEFINITO
			) String tipologiaRuoli) {
		List<RuoloEntity> listaRuoli = this.ruoloService.getRuoliByTipologiaRuolo(tipologiaRuoli);
		return this.ruoloMapper.toLightResourceFrom(listaRuoli);
	}
	
	// TOUCH POINT - 8.1.1 - lista ruoli filtrata per nome ruolo 
	/**
	 * Ritorna la lista di tutti i ruoli se il filtro di ricerca nome del ruolo non viene passato,
	 * altrimenti riitorna il ruolo ricercato tramite il suo nome.
	 * */
	@GetMapping(path = "/all")
	@ResponseStatus(value = HttpStatus.OK)
	public List<RuoloLightResource>  getRuoliByFiltroNomeRuolo(
			@RequestParam(required = false) String filtroNomeRuolo) {
		List<RuoloEntity> listaRuoli = this.ruoloService.getRuoliByFiltroDiRicerca(filtroNomeRuolo);
		return this.ruoloMapper.toLightResourceFrom(listaRuoli);
	}
	
	@PostMapping
	@ResponseStatus(value = HttpStatus.CREATED)
	public void creaNuovoRuolo(@RequestBody @Valid RuoloRequest nuovoRuoloRequest) {
		this.ruoloService.creaNuovoRuolo(nuovoRuoloRequest);
	}
	
	@GetMapping(path = "/{codiceFiscale}/ruoli")
	public List<RuoloLightResource> getRuoliByCodiceFiscaleUtente(@PathVariable("codiceFiscale") String codiceFiscale) {
		UtenteEntity utente = this.utenteService.getUtenteByCodiceFiscale(codiceFiscale);
		return this.ruoloMapper.toLightResourceFrom(utente.getRuoli());
	}
	
	// TOUCH POINT - 8.1.4 - Scheda ruolo
	// TOUCH POINT - 8.2.1 - Scheda ruolo
	@GetMapping(path = "/{codiceRuolo}")
	@ResponseStatus(value = HttpStatus.OK)
	public SchedaRuoloBean getSchedaRuolo(@PathVariable(value = "codiceRuolo") String codiceRuolo) {
		return this.ruoloService.getSchedaRuoloByCodiceRuolo(codiceRuolo);
	}
	
	// TOUCH POINT - 8.1.2 - update ruolo
	// TOUCH POINT - 8.2.2 - update ruolo
	@PutMapping(path = "/{codiceRuolo}")
	@ResponseStatus(value = HttpStatus.OK)
	public void aggiornaRuolo(@PathVariable(value = "codiceRuolo") String codiceRuolo,
			@RequestBody @Valid RuoloRequest aggiornaRuoloRequest) {
		this.ruoloService.aggiornaRuoloNonPredefinito(codiceRuolo, aggiornaRuoloRequest);
	}
	
	@DeleteMapping(path = "/{codiceRuolo}")
	@ResponseStatus(value = HttpStatus.NO_CONTENT)
	public void cancellazioneRuolo(@PathVariable(value = "codiceRuolo") String codiceRuolo) {
		this.ruoloService.cancellazioneRuolo(codiceRuolo);
	}
}