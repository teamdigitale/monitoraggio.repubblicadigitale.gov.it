package it.pa.repdgt.ente.request;

import java.io.Serializable;
import java.util.List;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class NuovaSedeRequest implements Serializable {
	private static final long serialVersionUID = -6558474798604955684L;

	@NotBlank
	@JsonProperty(value = "nome")
	private String nome;
	
	@NotNull
	@JsonProperty(value = "serviziErogati")
	private String serviziErogati;

	@NotNull
	@JsonProperty(value = "itinere")
	private Boolean isItinere;

	@NotEmpty
	private List<IndirizzoSedeRequest> indirizziSede;
	
	@Setter
	@Getter
	public static class IndirizzoSedeRequest implements Serializable {
		private static final long serialVersionUID = 7726108288229913713L;
		
		@NotBlank
		@JsonProperty(value = "via")
		private String via;
		
		@NotBlank
		@JsonProperty(value = "civico")
		private String civico;
		
		@NotBlank
		@JsonProperty(value = "comune")
		private String comune;
		
		@NotBlank
		@JsonProperty(value = "provincia")
		private String provincia;
		
		@NotBlank
		@JsonProperty(value = "cap")
		private String cap;

		@NotBlank
		@JsonProperty(value = "nazione")
		private String nazione;
		
		private List<IndirizzoSedeFasciaOrariaRequest> fasceOrarie;
		
		@Setter
		@Getter
		public static class IndirizzoSedeFasciaOrariaRequest implements Serializable {
			private static final long serialVersionUID = 6241754202776108632L;
			
			@NotBlank
			@JsonProperty(value = "giornoApertura")
			private String giornoApertura;
			
			@NotNull
			@JsonProperty(value = "orarioApertura")
			@Pattern(regexp = "[0-9]{2}:[0-9]{2}")
			private String orarioApertura;
			
			@NotNull
			@JsonProperty(value = "orarioChisura")
			@Pattern(regexp = "[0-9]{2}:[0-9]{2}")
			private String orarioChiusura;
		}
	}
}