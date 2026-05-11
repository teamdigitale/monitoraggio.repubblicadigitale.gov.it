package it.pa.repdgt.ente.mapper;

import javax.validation.constraints.NotNull;

import org.springframework.stereotype.Component;

import it.pa.repdgt.ente.request.NuovaSedeRequest.IndirizzoSedeRequest;
import it.pa.repdgt.ente.util.RegioneUtil;
import it.pa.repdgt.shared.entity.IndirizzoSedeEntity;
import it.pa.repdgt.shared.entity.tipologica.TipologiaUbicazioneSedeEntity;

@Component
public class IndirizzoSedeMapper {

	public IndirizzoSedeEntity toEntityFrom(@NotNull IndirizzoSedeRequest indirizzoSedeRequest) {
		IndirizzoSedeEntity indirizzoSedeEntity = new IndirizzoSedeEntity();
		this.applyFields(indirizzoSedeEntity, indirizzoSedeRequest);
		return indirizzoSedeEntity;
	}

	public void updateEntityFrom(@NotNull IndirizzoSedeEntity indirizzoSedeEntity,
			@NotNull IndirizzoSedeRequest indirizzoSedeRequest) {
		this.applyFields(indirizzoSedeEntity, indirizzoSedeRequest);
	}

	private void applyFields(IndirizzoSedeEntity indirizzoSedeEntity,
			IndirizzoSedeRequest indirizzoSedeRequest) {
		indirizzoSedeEntity.setVia(indirizzoSedeRequest.getVia());
		indirizzoSedeEntity.setCivico(indirizzoSedeRequest.getCivico());
		indirizzoSedeEntity.setComune(indirizzoSedeRequest.getComune());
		indirizzoSedeEntity.setProvincia(indirizzoSedeRequest.getProvincia());
		indirizzoSedeEntity.setRegione(RegioneUtil.getIndirizzoSede(indirizzoSedeRequest.getRegione()));
		indirizzoSedeEntity.setCap(indirizzoSedeRequest.getCap());
		indirizzoSedeEntity.setNazione(indirizzoSedeRequest.getNazione());
		indirizzoSedeEntity.setTipologiaUbicazione(toTipologiaUbicazioneRef(indirizzoSedeRequest.getTipologiaUbicazione()));
	}

	private TipologiaUbicazioneSedeEntity toTipologiaUbicazioneRef(Long idTipologia) {
		if (idTipologia == null) {
			return null;
		}
		TipologiaUbicazioneSedeEntity ref = new TipologiaUbicazioneSedeEntity();
		ref.setId(idTipologia);
		return ref;
	}
}
