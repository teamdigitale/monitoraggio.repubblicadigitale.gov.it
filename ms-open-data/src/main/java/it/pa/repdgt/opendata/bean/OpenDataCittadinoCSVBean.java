package it.pa.repdgt.opendata.bean;

import java.io.Serializable;

import it.pa.repdgt.opendata.projection.OpenDataCittadinoProjection;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class OpenDataCittadinoCSVBean implements Serializable {
	private static final long serialVersionUID = 161985068583539983L;

	private OpenDataCittadinoProjection openDataCittadinoProjection;
	private String competenzeTrattate;
	private String ambitoServizi;
}