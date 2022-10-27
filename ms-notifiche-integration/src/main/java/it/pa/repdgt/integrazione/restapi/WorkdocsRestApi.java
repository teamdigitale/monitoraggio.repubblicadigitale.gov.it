package it.pa.repdgt.integrazione.restapi;

import java.util.Date;
import java.util.Optional;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import it.pa.repdgt.integrazione.exception.WorkdocsException;
import it.pa.repdgt.integrazione.repository.IntegrazioniUtenteRepository;
import it.pa.repdgt.integrazione.repository.UtenteRepository;
import it.pa.repdgt.integrazione.request.WorkDocsUserRequest;
import it.pa.repdgt.shared.awsintegration.service.WorkDocsService;
import it.pa.repdgt.shared.entity.IntegrazioniUtenteEntity;
import it.pa.repdgt.shared.entity.UtenteEntity;
import it.pa.repdgt.shared.exception.CodiceErroreEnum;
import software.amazon.awssdk.services.workdocs.model.ActivateUserResponse;
import software.amazon.awssdk.services.workdocs.model.CreateUserResponse;

@RestController
@RequestMapping(path = "/integrazione/workdocs/")
public class WorkdocsRestApi {
	@Autowired
	private WorkDocsService workDocsService;
	@Autowired
	private UtenteRepository utenteRepository;
	
	@Autowired
	private IntegrazioniUtenteRepository integrazioniUtenteRepository;
	
	@PostMapping(path = "/crea-attiva-utente")
	@ResponseStatus(value = HttpStatus.OK)
	@Transactional(rollbackOn = Exception.class)
	public void creaUtenteWD(
			@RequestBody final WorkDocsUserRequest workDocsUser) {
		final Optional<UtenteEntity> optionalUtenteDbFEtch = this.utenteRepository.findByCodiceFiscale(workDocsUser.getCfUtenteLoggato());
		String emailUtente = optionalUtenteDbFEtch.get().getEmail();
		final CreateUserResponse createUserResponse  = this.workDocsService.creaWorkDocsUser(emailUtente, emailUtente, workDocsUser.getPassword());
		if(	!createUserResponse.sdkHttpResponse().isSuccessful() ) {
			String errorMessage  = String.format("Errore creazione utente Workdocs. Response workDocs-createUser.statusCode: %s", createUserResponse.sdkHttpResponse().statusCode());
			throw new WorkdocsException(errorMessage, CodiceErroreEnum.WD01);
		} 
		
		final String workDocsUserId = createUserResponse.user().id();
		ActivateUserResponse attivaUserResponse = this.workDocsService.attivaWorkDocsUser(workDocsUserId);
		if(	!attivaUserResponse.sdkHttpResponse().isSuccessful() ) {
			String errorMessage  = String.format("Errore attivazione utente Workdocs (workDocsUserId=%s). Response workDocs-createUser.statusCode: %s", 
					createUserResponse.sdkHttpResponse().statusCode(), 
					workDocsUserId);
			throw new WorkdocsException(errorMessage, CodiceErroreEnum.WD02);
		} 
		
		final Long idUtente = workDocsUser.getIdUtente();
		IntegrazioniUtenteEntity integrazioniUtenteDBFetch = this.integrazioniUtenteRepository.findByUserId(idUtente)
				.orElseThrow(() -> new WorkdocsException("Record in tabella IntegrazioniUtente non presente per utente con id=" + idUtente, CodiceErroreEnum.C01));
		integrazioniUtenteDBFetch.setIdUtenteWorkdocs(workDocsUserId);
		integrazioniUtenteDBFetch.setUtenteRegistratoInWorkdocs(Boolean.TRUE);
		integrazioniUtenteDBFetch.setDataOraAggiornamento(new Date());
		this.integrazioniUtenteRepository.save(integrazioniUtenteDBFetch);
	} 
}