package it.pa.repdgt.surveymgmt.bean;

import java.io.Serializable;
import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class SchedaCittadinoBean implements Serializable {
	private static final long serialVersionUID = -2085033646748038959L;
	
	private DettaglioCittadinoBean dettaglioCittadino;
	private List<DettaglioServizioSchedaCittadinoBean> serviziCittadino;
}