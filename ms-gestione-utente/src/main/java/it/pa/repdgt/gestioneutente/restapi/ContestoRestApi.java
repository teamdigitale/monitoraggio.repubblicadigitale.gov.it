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

import it.pa.repdgt.gestioneutente.exception.UtenteException;
import it.pa.repdgt.gestioneutente.mapper.ContestoMapper;
import it.pa.repdgt.gestioneutente.repository.UtenteRepository;
import it.pa.repdgt.gestioneutente.request.CreaContestoRequest;
import it.pa.repdgt.gestioneutente.request.IntegraContestoRequest;
import it.pa.repdgt.gestioneutente.resource.ContestoResource;
import it.pa.repdgt.gestioneutente.service.ContestoService;
import it.pa.repdgt.shared.awsintegration.service.S3Service;
import it.pa.repdgt.shared.entity.UtenteEntity;
import it.pa.repdgt.shared.exception.CodiceErroreEnum;
import lombok.extern.slf4j.Slf4j;
import it.pa.repdgt.shared.restapi.param.SceltaProfiloParam;

@RestController
@RequestMapping(path = "/contesto")
@Slf4j
public class ContestoRestApi {
	@Autowired
	private ContestoService contestoService;
	@Autowired
	private UtenteRepository utenteRepository;
	@Autowired
	private ContestoMapper contestoMapper;
	@Autowired
	private S3Service s3Service;
	@Value("${AWS.S3.BUCKET-NAME:}")
	private String nomeDelBucketS3;
	@Value("${AWS.S3.PRESIGN_URL-EXPIRE-CONTESTO:15}")
	private String presignedUrlExpireContesto;

	// creazione contesto  
	@PostMapping
	@ResponseStatus(value = HttpStatus.OK)
	public ContestoResource creaContesto(@RequestBody CreaContestoRequest creaContestoRequest) {
		final String codiceFiscaleUtenteLoggato = creaContestoRequest.getCfUtenteLoggato();
		if(!this.utenteRepository.findByCodiceFiscale(codiceFiscaleUtenteLoggato).isPresent()) {
			String messaggioErrore = String.format("Errore creazione contesto. Utente con codiceFiscale '%s' non esiste", codiceFiscaleUtenteLoggato);
			throw new UtenteException(messaggioErrore, CodiceErroreEnum.U20);
		}

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
	
	// servizio di scelta RUOLO – PROGRAMMA 
	@ResponseStatus(value = HttpStatus.OK)
	@PostMapping(path = "/sceltaProfilo")
	public void sceltaProfilo(@RequestBody @Valid SceltaProfiloParam utenteRequest) {
		final String codiceFiscaleUtente = utenteRequest.getCfUtenteLoggato();
		final String codiceRuoloUtente = utenteRequest.getCodiceRuoloUtenteLoggato();
		final Long idProgramma = utenteRequest.getIdProgramma();
		final Long idProgetto = utenteRequest.getIdProgetto();
		
		contestoService.verificaSceltaProfilo(codiceFiscaleUtente, codiceRuoloUtente, idProgramma, idProgetto);
	}
	
	// CONFERMA INTEGRAZIONE 
	@ResponseStatus(value = HttpStatus.OK)
	@PostMapping(path = "/confermaIntegrazione")
	public void confermaIntegrazione(@RequestBody @Valid IntegraContestoRequest integraContestoRequestRequest) {
		contestoService.integraContesto(integraContestoRequestRequest);
	}
}