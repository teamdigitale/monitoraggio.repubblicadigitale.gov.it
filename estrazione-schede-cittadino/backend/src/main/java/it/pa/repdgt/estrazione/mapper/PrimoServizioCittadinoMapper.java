package it.pa.repdgt.estrazione.mapper;

import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Component;

import it.pa.repdgt.estrazione.dto.PrimoServizioCittadinoDTO;
import it.pa.repdgt.estrazione.entity.VPrimoServizioCittadinoEntity;

@Component
public class PrimoServizioCittadinoMapper {

	public PrimoServizioCittadinoDTO toDTO(VPrimoServizioCittadinoEntity entity) {
		PrimoServizioCittadinoDTO dto = new PrimoServizioCittadinoDTO();
		BeanUtils.copyProperties(entity, dto);
		return dto;
	}

}
