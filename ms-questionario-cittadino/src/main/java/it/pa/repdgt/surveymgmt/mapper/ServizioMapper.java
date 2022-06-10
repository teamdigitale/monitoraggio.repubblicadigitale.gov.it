package it.pa.repdgt.surveymgmt.mapper;

import javax.validation.constraints.NotNull;

import org.bson.json.JsonObject;
import org.springframework.stereotype.Component;
import org.springframework.validation.annotation.Validated;

import it.pa.repdgt.surveymgmt.collection.SezioneQ3Collection;
import it.pa.repdgt.surveymgmt.request.ServizioRequest;

@Component
@Validated
public class ServizioMapper {

	public SezioneQ3Collection toCollectionFrom(@NotNull final ServizioRequest servizioRequest) {
		final SezioneQ3Collection sezioneQ3Collection = new SezioneQ3Collection();
		sezioneQ3Collection.setSezioneQ3Compilato(new JsonObject(servizioRequest.getQuestionarioCompilatoQ3()));
		return sezioneQ3Collection;
	}
}