package it.pa.repdgt.integrazione.restapi;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import it.pa.repdgt.integrazione.request.RocketChatAutenticaORegistraRequest;
import it.pa.repdgt.integrazione.service.RocketChatService;

@RestController
@RequestMapping(path = "/rocket-chat/")
@Validated
public class RocketChatRestApi {
	@Autowired
	private RocketChatService rocketChatService;
	
	@PostMapping(path = "/auth/iframe/utente/{idUtente}")
	@ResponseStatus(value = HttpStatus.OK)
	public Map<String, String> autenticazioneUtentePerIFrame(
			@PathVariable(value = "idUtente") Long idUtenteDaAutenticare,
			@RequestBody RocketChatAutenticaORegistraRequest autenticaORegistraRequest) {
		Map<String, String> rocketChatResponseMap = this.rocketChatService.autenticaUtentePerIFrame(idUtenteDaAutenticare, autenticaORegistraRequest);
		return rocketChatResponseMap;
	} 
	
}