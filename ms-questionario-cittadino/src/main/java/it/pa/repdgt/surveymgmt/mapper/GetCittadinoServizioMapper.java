package it.pa.repdgt.surveymgmt.mapper;

import java.util.List;
import java.util.stream.Collectors;

import javax.validation.constraints.NotNull;

import org.springframework.stereotype.Component;
import org.springframework.validation.annotation.Validated;

import it.pa.repdgt.surveymgmt.projection.GetCittadinoProjection;
import it.pa.repdgt.surveymgmt.resource.GetCittadinoResource;

@Component
@Validated
public class GetCittadinoServizioMapper {

	public List<GetCittadinoResource> toResourceFrom(@NotNull final List<GetCittadinoProjection> getCittadini) {
		return getCittadini.stream()
				.map(this::toResourceFrom)
				.collect(Collectors.toList());
	}

	public GetCittadinoResource toResourceFrom(
			@NotNull final GetCittadinoProjection getCittadino) {
		final GetCittadinoResource getCittadinoResource = new GetCittadinoResource();
		getCittadinoResource.setIdCittadino(getCittadino.getId());
		getCittadinoResource.setCodiceFiscale(getCittadino.getCodiceFiscale());
		getCittadinoResource.setCittadinanza(getCittadino.getCittadinanza());
		getCittadinoResource.setGenere(getCittadino.getGenere());
		getCittadinoResource.setTitoloStudio(getCittadino.getTitoloStudio());
		getCittadinoResource.setFasciaDiEta(getCittadino.getFasciaDiEta());
		getCittadinoResource.setStatoOccupazionale(getCittadino.getStatoOccupazionale());
		getCittadinoResource.setProvinciaDiDomicilio(getCittadino.getProvinciaDiDomicilio());
		return getCittadinoResource;
	}
}