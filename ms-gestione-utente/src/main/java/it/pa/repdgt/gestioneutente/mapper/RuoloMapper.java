package it.pa.repdgt.gestioneutente.mapper;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import it.pa.repdgt.gestioneutente.resource.RuoloLightResource;
import it.pa.repdgt.shared.entity.RuoloEntity;

@Component
public class RuoloMapper {
	
	public List<RuoloLightResource> toLightResourceFrom(List<RuoloEntity> ruoliEntity) {
		if(ruoliEntity == null) {
			return null;
		}
	
		return ruoliEntity
					.stream()
					.map(this::toLightResourceFrom)
					.collect(Collectors.toList());
	}
	
	public RuoloLightResource toLightResourceFrom(RuoloEntity ruoloEntity) {
		if(ruoloEntity == null) {
			return null;
		}
		
		RuoloLightResource ruoloLightResource  = new RuoloLightResource();
		ruoloLightResource.setCodiceRuolo(ruoloEntity.getCodice());
		ruoloLightResource.setNomeRuolo(ruoloEntity.getNome());
		return ruoloLightResource;
	}
}