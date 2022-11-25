package it.pa.repdgt.shared.awsintegration.service;

import javax.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

import lombok.extern.slf4j.Slf4j;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.workdocs.WorkDocsClient;
import software.amazon.awssdk.services.workdocs.model.ActivateUserRequest;
import software.amazon.awssdk.services.workdocs.model.ActivateUserResponse;
import software.amazon.awssdk.services.workdocs.model.CreateUserRequest;
import software.amazon.awssdk.services.workdocs.model.CreateUserResponse;
import software.amazon.awssdk.services.workdocs.model.DeactivateUserRequest;
import software.amazon.awssdk.services.workdocs.model.DeactivateUserResponse;
import software.amazon.awssdk.services.workdocs.model.StorageRuleType;
import software.amazon.awssdk.services.workdocs.model.StorageType;

@Service
@Scope("singleton")
@Validated
@Slf4j
public class WorkDocsService {
	@Value(value = "${aws.workdocs.access-key:access-key}")
	private String accessKey;
	@Value(value = "${aws.workdocs.secret-key:secret-key}")
	private String secretKey;
	@Value(value = "${aws.workdocs.organization-id:org-id}")
	private String organizationId;
	
	private static WorkDocsClient workdocsInstanceClient = null;
	
	public WorkDocsClient getClient() {
		if(workdocsInstanceClient != null) {
			return workdocsInstanceClient;
		}
		return WorkDocsClient.builder()
				.credentialsProvider(
						StaticCredentialsProvider.create(AwsBasicCredentials.create(this.accessKey, this.secretKey)))
				.region(Region.EU_WEST_1).build();
	}
	
	@PostConstruct
	private void init() {
		workdocsInstanceClient = this.getClient();
	}
	
	public CreateUserResponse creaWorkDocsUser(final String username, final String email, final String password) {
		final StorageRuleType storageRuleType = StorageRuleType.builder()
																.storageType(StorageType.QUOTA)
																.storageAllocatedInBytes(new Long(1073741824))
																.build();
		
		CreateUserResponse createUserResponse = null;
		 try {
			final CreateUserRequest createUserRequest = CreateUserRequest.builder()
																	.organizationId(this.organizationId)
																	.username(username)
																	.password(password)
																	.emailAddress(email)
																	.givenName(username)
																	.storageRule(storageRuleType)
																	.surname(username)
																	.build();
			
			 log.info("creazione utente workDocs in corso...");
			 createUserResponse = workdocsInstanceClient.createUser(createUserRequest);
			 log.info("status createUserWorkDocs ==> {}", createUserResponse.sdkHttpResponse().isSuccessful()? "OK": "KO");
			 log.info("user_id-workdocs = {}", createUserResponse.user().id());
		 } catch (Exception e) {
			throw new RuntimeException("Errore nella creazione utente workDocs");
		 }
		 return createUserResponse;
	}

	public ActivateUserResponse attivaWorkDocsUser(final String workDocsUserId) {
		final ActivateUserRequest activateUserRequest = ActivateUserRequest.builder()
																.userId(workDocsUserId)
																.build();
		ActivateUserResponse activeteUserResponse = null;
		try {
			log.info("Attivazione utente workDocs per utente con idUtenteWorkDocs={} in corso...", workDocsUserId);
			activeteUserResponse = workdocsInstanceClient.activateUser(activateUserRequest);
			log.info("status activateUserWorkDocs per utente con idUtenteWorkDocs={} ==> {}", workDocsUserId, activeteUserResponse.sdkHttpResponse().isSuccessful()?"OK": "KO");
		} catch (Exception e) {
			throw new RuntimeException("Errore nell'attivazione utente workDocs per utenteIdWorkDocs=" + workDocsUserId, e);
		}
		return activeteUserResponse;
	}
	
	public DeactivateUserResponse disattivaWorkDocsUser(final String workDocsUserId) {
		final DeactivateUserRequest deactivateUserRequest = DeactivateUserRequest.builder()
																.userId(workDocsUserId)
																.build();
		DeactivateUserResponse deactiveteUserResponse = null;
		try {
			log.info("Disattivazione utente workDocs per utente con idUtenteWorkDocs={} in corso...", workDocsUserId);
			deactiveteUserResponse = workdocsInstanceClient.deactivateUser(deactivateUserRequest);
			log.info("status deactivateUserWorkDocs per utente con idUtenteWorkDocs={} ==> {}", workDocsUserId, deactiveteUserResponse.sdkHttpResponse().isSuccessful()?"OK": "KO");
		} catch (Exception e) {
			throw new RuntimeException("Errore nella disattivazione utente workDocs per utenteIdWorkDocs=" + workDocsUserId, e);
		}
		return deactiveteUserResponse;
	}
}