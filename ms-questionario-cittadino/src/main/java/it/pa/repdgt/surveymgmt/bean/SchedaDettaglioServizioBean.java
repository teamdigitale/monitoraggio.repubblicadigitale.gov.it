package it.pa.repdgt.surveymgmt.bean;

import java.io.Serializable;
import java.util.List;

import it.pa.repdgt.surveymgmt.projection.ProgettoProjection;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class SchedaDettaglioServizioBean implements Serializable {
	private static final long serialVersionUID = -3467618494108578993L;
	
	private DettaglioServizioBean dettaglioServizio;
	private List<ProgettoProjection> progettiAssociatiAlServizio;
}