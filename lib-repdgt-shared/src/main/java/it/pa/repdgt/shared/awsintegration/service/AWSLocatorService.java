package it.pa.repdgt.shared.awsintegration.service;

import java.util.Arrays;

import javax.validation.constraints.NotNull;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Service;

import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.location.AmazonLocation;
import com.amazonaws.services.location.AmazonLocationClient;
import com.amazonaws.services.location.model.SearchPlaceIndexForTextRequest;

@Service
@Scope("singleton")
public class AWSLocatorService {
	@Value(value = "${aws.app-id}")
	private String appId;
	@Value(value = "${aws.location.access-key}")
	private String accessKey;
	@Value(value = "${aws.location.secret-key}")
	private String secretKey;
	
	public AmazonLocation getClient() { 
		final BasicAWSCredentials awsCredentials = new BasicAWSCredentials(this.accessKey, this.secretKey);
		return AmazonLocationClient.builder()
				.withCredentials(new AWSStaticCredentialsProvider(awsCredentials))
				.withRegion(Regions.EU_CENTRAL_1)
				.build();
	}

	public SearchPlaceIndexForTextRequest createSearchPlaceIndexForTestRequest(@NotNull String testoIndirizzo) {
	    final SearchPlaceIndexForTextRequest searchPlaceIndexForTextRequests = new SearchPlaceIndexForTextRequest();
//		searchPlaceIndexForTextRequests.setBiasPosition(null);
//		searchPlaceIndexForTextRequests.setFilterBBox(null);
		searchPlaceIndexForTextRequests.setIndexName("testIndex");
		searchPlaceIndexForTextRequests.setFilterCountries(Arrays.asList("ITA"));
		searchPlaceIndexForTextRequests.setLanguage("it-IT");
		searchPlaceIndexForTextRequests.setMaxResults(7);
		searchPlaceIndexForTextRequests.setText(testoIndirizzo);
		return searchPlaceIndexForTextRequests;
	}
}