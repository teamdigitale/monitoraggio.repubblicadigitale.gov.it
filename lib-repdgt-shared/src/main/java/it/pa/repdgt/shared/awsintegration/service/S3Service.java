package it.pa.repdgt.shared.awsintegration.service;

import java.io.File;
import java.io.FileNotFoundException;
import java.time.Duration;

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
import software.amazon.awssdk.services.s3.model.S3Exception;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest;
import software.amazon.awssdk.services.s3.presigner.model.PresignedGetObjectRequest;

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
			log.info("Upload file: '{}' su AmazonS3 avvenuto con successo.", fileToUploadName);
		} catch (Exception ex) {
			String messaggioErrore = String.format("Errore upload del file su AmazonS3 per il file con nome '%s'.", fileToUploadName);
			log.error(messaggioErrore);
			log.error("ex={}", ex);
			throw new RuntimeException(messaggioErrore);
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
			log.info("Download file: '{}' da Amazon S3 avvenuto con successo.", fileNameToDownload);
		} catch (Exception ex) {
			String messaggioErrore = String.format("Errore download del file su AmazonS3 per il file con nome '%s'."
					+ " Verifica che il nome del file da scaricare sia correto e riprova.", fileNameToDownload);
			log.error(messaggioErrore);
			log.error("ex={}", ex);
			throw new RuntimeException(messaggioErrore);
		}
		
		return response;
	}
	
	public String getPresignedUrl(String nomeFile, String bucketName) {
		S3Presigner presigner = S3Presigner.builder()
                .region(Region.EU_CENTRAL_1)
                .credentialsProvider(StaticCredentialsProvider.create(AwsBasicCredentials.create(this.accessKey, this.secretKey)))
                .build();
		return getPresignedUrl(presigner, bucketName, nomeFile);
	}
	
	public String getPresignedUrl(S3Presigner presigner, String bucketName, String keyName ) {
		String url = "";
        try {
            GetObjectRequest getObjectRequest =
                    GetObjectRequest.builder()
                            .bucket(bucketName)
                            .key(keyName)
                            .build();

            GetObjectPresignRequest getObjectPresignRequest =  GetObjectPresignRequest.builder()
                            .signatureDuration(Duration.ofMinutes(10))
                            .getObjectRequest(getObjectRequest)
                             .build();

            // Generate the presigned request
            PresignedGetObjectRequest presignedGetObjectRequest =
                    presigner.presignGetObject(getObjectPresignRequest);

            // Log the presigned URL
            url = presignedGetObjectRequest.url().toString();

            

        } catch (S3Exception e) {
            e.getStackTrace();
        }
        return url;
    }
}