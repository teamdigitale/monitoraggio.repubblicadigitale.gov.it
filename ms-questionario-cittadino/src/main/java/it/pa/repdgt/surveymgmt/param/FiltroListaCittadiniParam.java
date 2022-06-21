package it.pa.repdgt.surveymgmt.param;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class FiltroListaCittadiniParam {
	private String criterioRicerca;
	private List<String> idsSedi;
}