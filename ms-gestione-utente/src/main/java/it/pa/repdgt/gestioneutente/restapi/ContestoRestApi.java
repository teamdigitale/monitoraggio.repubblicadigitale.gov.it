package it.pa.repdgt.gestioneutente.restapi;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import it.pa.repdgt.gestioneutente.mapper.ContestoMapper;
import it.pa.repdgt.gestioneutente.request.CreaContestoRequest;
import it.pa.repdgt.gestioneutente.request.IntegraContestoRequest;
import it.pa.repdgt.gestioneutente.resource.ContestoResource;
import it.pa.repdgt.gestioneutente.service.ContestoService;
import it.pa.repdgt.shared.awsintegration.service.S3Service;
import it.pa.repdgt.shared.entity.UtenteEntity;
import lombok.extern.slf4j.Slf4j;
import it.pa.repdgt.shared.restapi.param.SceltaProfiloParam;

@RestController
@RequestMapping(path = "/contesto")
@Slf4j
public class ContestoRestApi {
	@Autowired
	private ContestoService contestoService;
	@Autowired
	private ContestoMapper contestoMapper;
	@Autowired
	private S3Service s3Service;
	@Value("${AWS.S3.BUCKET-NAME:}")
	private String nomeDelBucketS3;
	@Value("${AWS.S3.PRESIGN_URL-EXPIRE-CONTESTO:15}")
	private String presignedUrlExpireContesto;

	// TOUCH POINT - 0.1.1 - creazione contesto  
	@PostMapping
	@ResponseStatus(value = HttpStatus.OK)
	public ContestoResource creaContesto(@RequestBody CreaContestoRequest creaContestoRequest) {
		UtenteEntity utenteFetched = contestoService.creaContesto(creaContestoRequest.getCfUtenteLoggato());
		ContestoResource contesto = contestoMapper.toContestoFromUtenteEntity(utenteFetched);
		try{ 
			contesto.setImmagineProfilo(this.s3Service.getPresignedUrl(utenteFetched.getImmagineProfilo(), this.nomeDelBucketS3, Long.parseLong(this.presignedUrlExpireContesto)));
		}catch(Exception e) {
			log.error("Errore getting presignedUrl AWS S3 per file='{}' su bucket", utenteFetched.getImmagineProfilo());
		}
		if(utenteFetched.getIntegrazione()) {
			contesto.setRuoli(contestoService.getGruppiPermessi(contesto.getRuoli()));
			contesto.setProfili(contestoService.getProfili(utenteFetched.getCodiceFiscale()));
		}
		return contesto;
	}
	
	// TOUCH POINT - 0.1.2 - servizio di scelta RUOLO – PROGRAMMA 
	@ResponseStatus(value = HttpStatus.OK)
	@PostMapping(path = "/sceltaProfilo")
	public void sceltaProfilo(@RequestBody @Valid SceltaProfiloParam utenteRequest) {
		final String codiceFiscaleUtente = utenteRequest.getCfUtenteLoggato();
		final String codiceRuoloUtente = utenteRequest.getCodiceRuoloUtenteLoggato();
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