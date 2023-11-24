package it.pa.repdgt.surveymgmt.mapper;

import java.util.List;
import java.util.stream.Collectors;

import javax.validation.constraints.NotNull;

import org.springframework.stereotype.Component;
import org.springframework.validation.annotation.Validated;

import it.pa.repdgt.surveymgmt.projection.CittadinoServizioProjection;
import it.pa.repdgt.surveymgmt.resource.CittadinoServizioResource;

@Component
@Validated
public class CittadinoServizioMapper {

	public List<CittadinoServizioResource> toResourceFrom(
			@NotNull final List<CittadinoServizioProjection> cittadiniServizi) {
		return cittadiniServizi.stream()
				.map(this::toResourceFrom)
				.collect(Collectors.toList());
	}

	/**
	 * Mappa ServizioEntity in ServizioResource
	 * 
	 */
	public CittadinoServizioResource toResourceFrom(
			@NotNull final CittadinoServizioProjection cittadiniServizi) {
		final CittadinoServizioResource cittadinoServizioResource = new CittadinoServizioResource();
		cittadinoServizioResource.setIdCittadino(cittadiniServizi.getIdCittadino());
		cittadinoServizioResource.setCodiceFiscale(cittadiniServizi.getCodiceFiscale());
		cittadinoServizioResource.setNumeroDocumento(cittadiniServizi.getNumeroDocumento());
		cittadinoServizioResource.setIdQuestionario(cittadiniServizi.getIdQuestionario());
		cittadinoServizioResource.setStatoQuestionario(cittadiniServizi.getStatoQuestionario());
		return cittadinoServizioResource;
	}
}