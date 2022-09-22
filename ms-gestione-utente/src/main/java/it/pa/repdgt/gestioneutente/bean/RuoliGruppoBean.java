package it.pa.repdgt.gestioneutente.bean;

import java.io.Serializable;
import java.util.List;

import it.pa.repdgt.shared.entity.GruppoEntity;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class RuoliGruppoBean implements Serializable {
	private static final long serialVersionUID = 1L;
	
	private GruppoEntity gruppo;
	private List<String> ruoliAssociatiAlGruppo;
}