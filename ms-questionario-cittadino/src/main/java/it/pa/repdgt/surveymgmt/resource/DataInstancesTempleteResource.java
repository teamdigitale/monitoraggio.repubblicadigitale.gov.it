package it.pa.repdgt.surveymgmt.resource;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Setter
@Getter
@NoArgsConstructor
@ToString
public class DataInstancesTempleteResource implements Serializable {
	private static final long serialVersionUID = -187585057326782327L;

	private List<DataInstanceTemplateResource> dataInstanceTemplateResourceList = new ArrayList<>();
}