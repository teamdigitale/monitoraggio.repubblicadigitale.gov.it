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

import it.pa.repdgt.integrazione.repository.IntegrazioniUtenteRepository;
import it.pa.repdgt.integrazione.request.WorkDocsUserRequest;
import it.pa.repdgt.shared.awsintegration.service.WorkDocsService;
import it.pa.repdgt.shared.entity.IntegrazioniUtenteEntity;
import software.amazon.awssdk.services.workdocs.model.ActivateUserResponse;
import software.amazon.awssdk.services.workdocs.model.CreateUserResponse;

@RestController
@RequestMapping(path = "/integrazione/workdocs/")
public class WorkdocsRestApi {
	@Autowired
	private WorkDocsService workDocsService;
	
	@Autowired
	private IntegrazioniUtenteRepository integrazioniUtenteRepository;
	
	@PostMapping(path = "/crea-attiva-utente")
	@ResponseStatus(value = HttpStatus.OK)
	@Transactional(rollbackOn = Exception.class)
	public void creaUtenteWD(
			@RequestBody final WorkDocsUserRequest workDocsUser) {
		final Long idUtente = workDocsUser.getIdUtente();
		final Optional<IntegrazioniUtenteEntity> integrazioneUtente = this.integrazioniUtenteRepository.findByUserId(idUtente);
		
		// Se utente non registrato in workdocs
		if(!integrazioneUtente.isPresent() 
			  || integrazioneUtente.get().getUtenteRegistratoInWorkdocs() == Boolean.FALSE 
			  || integrazioneUtente.get().getIdUtenteWorkdocs() == null) {
			// creo utenza workdocs
			final CreateUserResponse createUserResponse  = this.workDocsService.creaWorkDocsUser(workDocsUser.getUsername(), workDocsUser.getEmail(), workDocsUser.getPassword());
			if(	!createUserResponse.sdkHttpResponse().isSuccessful() ) {
				String errorMessage  = String.format("Errore creazione utente Workdocs. Response workDocs-createUser.statusCode: %s", createUserResponse.sdkHttpResponse().statusCode());
				throw new RuntimeException(errorMessage);
			} 
			
			final String workDocsUserId = createUserResponse.user().id();
			// attivo utenza workdocs
			ActivateUserResponse attivaUserResponse = this.workDocsService.attivaWorkDocsUser(workDocsUserId);
			if(	!attivaUserResponse.sdkHttpResponse().isSuccessful() ) {
				String errorMessage  = String.format("Errore attivazione utente Workdocs (workDocsUserId=%s). Response workDocs-createUser.statusCode: %s", 
						createUserResponse.sdkHttpResponse().statusCode(), 
						workDocsUserId);
				throw new RuntimeException(errorMessage);
			} 
			
			// salvo record integrazioneUtente con utenteRegistratoWorkdocs = TRUE e l'id dell'utenza workdocs
			IntegrazioniUtenteEntity integrazioniUtenteDBFetch = this.integrazioniUtenteRepository.findByUserId(idUtente)
					.orElseThrow(() -> new RuntimeException("Record in tabella IntegrazioniUtente non presente per utente con id=" + idUtente));
			integrazioniUtenteDBFetch.setIdUtenteWorkdocs(workDocsUserId);
			integrazioniUtenteDBFetch.setUtenteRegistratoInWorkdocs(Boolean.TRUE);
			integrazioniUtenteDBFetch.setDataOraAggiornamento(new Date());
			this.integrazioniUtenteRepository.save(integrazioniUtenteDBFetch);
			return ;
		} 
	} 
}