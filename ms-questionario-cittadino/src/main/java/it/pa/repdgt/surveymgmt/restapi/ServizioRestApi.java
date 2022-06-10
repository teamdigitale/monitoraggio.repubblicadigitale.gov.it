package it.pa.repdgt.surveymgmt.restapi;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import it.pa.repdgt.surveymgmt.request.ServizioRequest;
import it.pa.repdgt.surveymgmt.service.ServizioService;

@RestController
@RequestMapping(path = "servizio")
@Validated
public class ServizioRestApi {
	@Autowired
	private ServizioService servizioService;

	/***
	 * Creazione di un nuovo servizio
	 * 
	 * */
	@PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
	@ResponseStatus(value = HttpStatus.CREATED)
	public void creaServizio(
			@RequestBody @Valid final ServizioRequest servizioRequest) {
		this.servizioService.creaServizio(servizioRequest);
	}
}