package it.pa.repdgt.ente.mapper;

import javax.validation.constraints.NotNull;

import org.springframework.stereotype.Component;

import it.pa.repdgt.ente.request.NuovaSedeRequest.IndirizzoSedeRequest;
import it.pa.repdgt.shared.entity.IndirizzoSedeEntity;

@Component
public class IndirizzoSedeMapper {

	public IndirizzoSedeEntity toEntityFrom(@NotNull final IndirizzoSedeRequest indirizzoSedeRequest) {
		final IndirizzoSedeEntity indirizzoSedeEntity = new IndirizzoSedeEntity();
		indirizzoSedeEntity.setVia(indirizzoSedeRequest.getVia());
		indirizzoSedeEntity.setCivico(indirizzoSedeRequest.getCivico());
		indirizzoSedeEntity.setComune(indirizzoSedeRequest.getComune());
		indirizzoSedeEntity.setProvincia(indirizzoSedeRequest.getProvincia());
		indirizzoSedeEntity.setCap(indirizzoSedeRequest.getCap());
		indirizzoSedeEntity.setNazione(indirizzoSedeRequest.getNazione());
		return indirizzoSedeEntity;
	}
}