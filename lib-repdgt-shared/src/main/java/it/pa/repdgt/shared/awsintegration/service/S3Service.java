package it.pa.repdgt.shared.awsintegration.service;

import java.io.File;
import java.io.FileNotFoundException;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

import lombok.extern.slf4j.Slf4j;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.core.ResponseBytes;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectResponse;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

@Service
@Scope("singleton")
@Validated
@Slf4j
public class S3Service {
	@Value(value = "${aws.app-id:}")
	private String appId;
	@Value(value = "${aws.s3.access-key:}")
	private String accessKey;
	@Value(value = "${aws.s3.secret-key:}")
	private String secretKey;
	
	public S3Client getClient() {
		return S3Client.builder()
				.credentialsProvider(
						StaticCredentialsProvider.create(AwsBasicCredentials.create(this.accessKey, this.secretKey)))
				.region(Region.EU_CENTRAL_1).build();
		
	}
	
	public void uploadFile(@NotBlank final String nomeBucket, @NotNull final File fileToUpload) throws FileNotFoundException {
		final String fileToUploadName = fileToUpload.getName();
		final PutObjectRequest putObjectRequest = PutObjectRequest.builder()
			.bucket(nomeBucket)
			.key(fileToUploadName)
			.build();
		
		if(!fileToUpload.exists()) {
			log.error("Il file con nome: '{}' non e' stato trovato. Verifica che il path e il nome del file siano corretti.", fileToUploadName);
			String errorMessage =  String.format("Il seguente file '%s' non esiste.", fileToUploadName);
			throw new FileNotFoundException(errorMessage);
		}
		
		try {
			log.info("Uploading file con nome '{}' su AmazonS3...", fileToUploadName);
			this.getClient().putObject(putObjectRequest, fileToUpload.toPath());
			log.info("Uploading file su AmazonS3 riuscito.");
		} catch (Exception ex) {
			log.error("Errore upload del file su AmazonS3 per il file con nome '{}'. ex={}", fileToUploadName, ex);
		}
	}
	
	
	public ResponseBytes<GetObjectResponse> downloadFile(@NotBlank final String nomeBucket, String fileNameToDownload) throws FileNotFoundException {
		final GetObjectRequest getObjectRequest = GetObjectRequest.builder()
			.bucket(nomeBucket)
			.key(fileNameToDownload)
			.build();
		
		ResponseBytes<GetObjectResponse> response = null;
		try {
			log.info("Downloading file con nome '{}' su AmazonS3...", fileNameToDownload);
			response  = this.getClient().getObjectAsBytes(getObjectRequest);
			log.info("Downloading file Amazon S3 avvenuto con successo");
		} catch (Exception ex) {
			log.error("Errore upload del file su AmazonS3 per il file con nome '{}'. ex={}", fileNameToDownload, ex);
		}
		
		return response;
	}
}