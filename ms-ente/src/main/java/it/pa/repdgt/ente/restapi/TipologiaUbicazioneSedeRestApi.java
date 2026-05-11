package it.pa.repdgt.ente.restapi;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import it.pa.repdgt.ente.resource.TipologiaUbicazioneSedeResource;
import it.pa.repdgt.ente.service.TipologiaUbicazioneSedeService;

@RestController
@RequestMapping(path = "/tipologia-ubicazione-sede")
public class TipologiaUbicazioneSedeRestApi {

	@Autowired
	private TipologiaUbicazioneSedeService tipologiaUbicazioneSedeService;

	@GetMapping
	@ResponseStatus(value = HttpStatus.OK)
	public List<TipologiaUbicazioneSedeResource> getTipologie() {
		return this.tipologiaUbicazioneSedeService.getTipologieSelezionabili();
	}
}
