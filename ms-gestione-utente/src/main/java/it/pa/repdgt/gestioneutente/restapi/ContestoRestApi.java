package it.pa.repdgt.gestioneutente.restapi;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import it.pa.repdgt.gestioneutente.mapper.ContestoMapper;
import it.pa.repdgt.gestioneutente.request.CreaContestoRequest;
import it.pa.repdgt.gestioneutente.request.IntegraContestoRequest;
import it.pa.repdgt.gestioneutente.request.ProfilazioneRequest;
import it.pa.repdgt.gestioneutente.resource.ContestoResource;
import it.pa.repdgt.gestioneutente.service.ContestoService;
import it.pa.repdgt.shared.entity.UtenteEntity;

@RestController
@RequestMapping(path = "/contesto")
public class ContestoRestApi {
	@Autowired
	private ContestoService contestoService;
	@Autowired
	private ContestoMapper contestoMapper;

	// TOUCH POINT - 0.1.1 - creazione contesto  
	@PostMapping
	@ResponseStatus(value = HttpStatus.OK)
	public ContestoResource creaContesto(@RequestBody CreaContestoRequest creaContestoRequest) {
		UtenteEntity utenteFetched = contestoService.creaContesto(creaContestoRequest.getCodiceFiscale());
		ContestoResource contesto = contestoMapper.toContestoFromUtenteEntity(utenteFetched);
		if(utenteFetched.getIntegrazione()) {
			contesto.setRuoli(contestoService.getGruppiPermessi(contesto.getRuoli()));
			contesto.setProfili(contestoService.getProfili(utenteFetched.getCodiceFiscale()));
		}
		return contesto;
	}
	
	// TOUCH POINT - 0.1.2 - servizio di scelta RUOLO – PROGRAMMA 
	@ResponseStatus(value = HttpStatus.OK)
	@PostMapping(path = "/sceltaProfilo")
	public void sceltaProfilo(@RequestBody @Valid ProfilazioneRequest utenteRequest) {
		final String codiceFiscaleUtente = utenteRequest.getCfUtente();
		final String codiceRuoloUtente = utenteRequest.getCodiceRuolo();
		final Long idProgramma = utenteRequest.getIdProgramma();
		final Long idProgetto = utenteRequest.getIdProgetto();
		
		contestoService.verificaSceltaProfilo(codiceFiscaleUtente, codiceRuoloUtente, idProgramma, idProgetto);
	}
	
	// TOUCH POINT - 0.1.3 - CONFERMA INTEGRAZIONE 
	@ResponseStatus(value = HttpStatus.OK)
	@PostMapping(path = "/confermaIntegrazione")
	public void confermaIntegrazione(@RequestBody @Valid IntegraContestoRequest integraContestoRequestRequest) {
		contestoService.integraContesto(integraContestoRequestRequest);
	}
}