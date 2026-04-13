package it.pa.repdgt.surveymgmt.mapper;

import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Component;

import it.pa.repdgt.shared.entity.VPrimoServizioCittadinoEntity;
import it.pa.repdgt.surveymgmt.dto.PrimoServizioCittadinoDTO;

@Component
public class PrimoServizioCittadinoMapper {

    public PrimoServizioCittadinoDTO toDTO(VPrimoServizioCittadinoEntity entity) {
        PrimoServizioCittadinoDTO dto = new PrimoServizioCittadinoDTO();
        BeanUtils.copyProperties(entity, dto);
        return dto;
    }

}
