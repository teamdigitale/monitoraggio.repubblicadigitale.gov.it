package it.pa.repdgt.ente.request;

import java.io.Serializable;
import java.util.List;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;

import com.fasterxml.jackson.annotation.JsonProperty;

import it.pa.repdgt.shared.entity.IndirizzoSedeFasciaOrariaEntity;
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
	private List<IndirizzoSedeRequest> indirizziSedeFasceOrarie;
	
	@Setter
	@Getter
	public static class IndirizzoSedeRequest implements Serializable {
		private static final long serialVersionUID = 7726108288229913713L;
		
		@JsonProperty(value = "id")
		private Long id;
		
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
		@JsonProperty(value = "regione")
		private String regione;

		@NotBlank
		@JsonProperty(value = "nazione")
		private String nazione;
		
		private IndirizzoSedeFasciaOrariaEntity fasceOrarieAperturaIndirizzoSede;
		
		@JsonProperty(value = "cancellato", defaultValue = "false")
		private Boolean cancellato = false;

	}
}