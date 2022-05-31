package it.pa.repdgt.surveymgmt.mapper;

import java.util.List;
import java.util.stream.Collectors;

import javax.validation.constraints.NotNull;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.validation.annotation.Validated;

import it.pa.repdgt.surveymgmt.model.IstanzaQuestionario;
import it.pa.repdgt.surveymgmt.resource.DataInstanceTemplateResource;
import it.pa.repdgt.surveymgmt.resource.DataInstancesTempleteResource;

@Component
@Validated
public class DataInstanceTemplateListMapper {
//	@Autowired
//	private DataInstanceTemplateMapper dataInstanceMapper;
//	
//	public DataInstancesTempleteResource toResourceFrom(@NotNull List<IstanzaQuestionario> dataInstanceTemplateList) {
//		List<DataInstanceTemplateResource> dataInstanceTemplResourceList = dataInstanceTemplateList
//																					.stream()
//																					.map(dataInstanceMapper::toResourceFrom)
//																					.collect(Collectors.toList());
//		
//		DataInstancesTempleteResource dataInstancesTemplateResource = new DataInstancesTempleteResource();
//		dataInstancesTemplateResource.setDataInstanceTemplateResourceList(dataInstanceTemplResourceList);
//		return dataInstancesTemplateResource;
//	}
}