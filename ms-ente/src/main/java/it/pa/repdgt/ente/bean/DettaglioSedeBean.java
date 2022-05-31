package it.pa.repdgt.ente.bean;

import java.io.Serializable;
import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DettaglioSedeBean implements Serializable {
	private static final long serialVersionUID = -7620047209558649870L;
	
	private Long id;
	private String nome;
	private String serviziErogati;
	private String enteDiRiferimento;
	private Boolean itinere;
	private List<IndirizzoSedeFasceOrarieBean> indirizziSedeFasceOrarie;
}