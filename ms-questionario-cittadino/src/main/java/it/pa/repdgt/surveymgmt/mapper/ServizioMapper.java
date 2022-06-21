package it.pa.repdgt.surveymgmt.mapper;

import java.text.SimpleDateFormat;
import java.util.List;
import java.util.stream.Collectors;

import javax.validation.constraints.NotNull;

import org.bson.json.JsonObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.validation.annotation.Validated;

import it.pa.repdgt.shared.entity.ServizioEntity;
import it.pa.repdgt.shared.entity.UtenteEntity;
import it.pa.repdgt.surveymgmt.collection.SezioneQ3Collection;
import it.pa.repdgt.surveymgmt.request.ServizioRequest;
import it.pa.repdgt.surveymgmt.resource.ServizioResource;
import it.pa.repdgt.surveymgmt.service.UtenteService;

@Component
@Validated
public class ServizioMapper {
	private static final String FORMATO_DATA_PATTERN = "dd-MM-yyyy";
	private static final SimpleDateFormat simpleDateFormat = new SimpleDateFormat(FORMATO_DATA_PATTERN);

	@Autowired
	private UtenteService utenteService;
	
	/**
	 * Mappa ServizioRequest in SezioneQ3Collection
	 * 
	 * */
	public SezioneQ3Collection toCollectionFrom(@NotNull final ServizioRequest servizioRequest) {
		final SezioneQ3Collection sezioneQ3Collection = new SezioneQ3Collection();
		sezioneQ3Collection.setSezioneQ3Compilato(new JsonObject(servizioRequest.getSezioneQuestionarioCompilatoQ3()));
		return sezioneQ3Collection;
	}

	/**
	 * Mappa List<ServizioEntity> in List<ServizioResource>
	 * 
	 * */
	public List<ServizioResource> toResourceFrom(@NotNull final List<ServizioEntity> serviziEntity) {
		return serviziEntity.stream()
				  .map(this::toResourceFrom)
				  .collect(Collectors.toList());
	}
	
	/**
	 * Mappa ServizioEntity in ServizioResource
	 * 
	 * */
	public ServizioResource toResourceFrom(
			@NotNull final ServizioEntity servizioEntity) {
		final ServizioResource servizioResource = new ServizioResource();
		servizioResource.setId(String.valueOf(servizioEntity.getId()));
		servizioResource.setNomeServizio(servizioEntity.getNome());
		servizioResource.setTipologiaServizio(servizioEntity.getTipologiaServizio());
		if(servizioEntity.getDataServizio() != null ) {
			servizioResource.setDataServizio(simpleDateFormat.format(servizioEntity.getDataServizio()));
		} 
		final String codiceFiscaleFacilitatore = servizioEntity.getIdEnteSedeProgettoFacilitatore().getIdFacilitatore();
		final UtenteEntity facilitatore = this.utenteService.getUtenteByCodiceFiscale(codiceFiscaleFacilitatore);
		final String nominativoFacilitatore = String.format("%s %s", facilitatore.getNome(), facilitatore.getCognome());
		servizioResource.setNominativoFacilitatore(nominativoFacilitatore);
		
		servizioResource.setStato(servizioEntity.getStato());
		return servizioResource;
	}
	
}