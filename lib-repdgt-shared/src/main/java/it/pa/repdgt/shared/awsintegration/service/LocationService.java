package it.pa.repdgt.shared.awsintegration.service;

import javax.validation.constraints.NotNull;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

import com.amazonaws.services.location.model.SearchPlaceIndexForTextRequest;
import com.amazonaws.services.location.model.SearchPlaceIndexForTextResult;

import it.pa.repdgt.shared.exception.RecuperoCoordinateException;
import lombok.extern.slf4j.Slf4j;

@Service
@Validated
@Slf4j
public class LocationService {
	@Autowired
	private AWSLocatorService locatorService;
	
	public SearchPlaceIndexForTextResult getCoordinateByTestoIndirizzo(@NotNull final String testoIndirizzo) {
		try {
			SearchPlaceIndexForTextRequest searchPlaceIndexForTextRequest = this.locatorService.createSearchPlaceIndexForTestRequest(testoIndirizzo);
			SearchPlaceIndexForTextResult searchPlaceIndexForTextResult = this.locatorService.getClient().searchPlaceIndexForText(searchPlaceIndexForTextRequest);
			log.info("searchPlaceIndexForTextResult = {}", searchPlaceIndexForTextResult);
			return searchPlaceIndexForTextResult;
		} catch (Exception exc) {
			String messaggioErrore = String.format("Errore recupero coordinate per indirizo='%s'", testoIndirizzo);
			throw new RecuperoCoordinateException(messaggioErrore, exc);
		}
	}
}