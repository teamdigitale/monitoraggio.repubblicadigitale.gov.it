package it.pa.repdgt.ente.mapper;

import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

import javax.validation.constraints.NotNull;

import org.springframework.stereotype.Component;
import org.springframework.validation.annotation.Validated;

import it.pa.repdgt.ente.request.NuovaSedeRequest.IndirizzoSedeRequest.IndirizzoSedeFasciaOrariaRequest;
import it.pa.repdgt.shared.entity.IndirizzoSedeFasciaOrariaEntity;

@Component
@Validated
public class IndirizzoSedeFasciaOrariaMapper {

	public IndirizzoSedeFasciaOrariaEntity toEntityFrom(@NotNull final IndirizzoSedeFasciaOrariaRequest indirizzoSedeFasciaOrariaRequest) {
		final IndirizzoSedeFasciaOrariaEntity indirizzoSedeFasciaOrariaEntity = new IndirizzoSedeFasciaOrariaEntity();
		indirizzoSedeFasciaOrariaEntity.setGiornoAperturaSede(indirizzoSedeFasciaOrariaRequest.getGiornoApertura());
		indirizzoSedeFasciaOrariaEntity.setOrarioAperuturaSede(LocalTime.parse(indirizzoSedeFasciaOrariaRequest.getOrarioApertura()));
		indirizzoSedeFasciaOrariaEntity.setOrarioChiusuraSede(LocalTime.parse(indirizzoSedeFasciaOrariaRequest.getOrarioChiusura()));
		return indirizzoSedeFasciaOrariaEntity;
	}
	
	public List<IndirizzoSedeFasciaOrariaEntity> toEntityFrom(@NotNull final List<IndirizzoSedeFasciaOrariaRequest> indirizziSedeFasceOrarieRequest) {
		return indirizziSedeFasceOrarieRequest
				.stream()
				.map(this::toEntityFrom)
				.collect(Collectors.toList());
	}
}