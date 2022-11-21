package it.pa.repdgt.integrazione.request;

import java.io.Serializable;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonRootName;

import it.pa.repdgt.shared.restapi.param.SceltaProfiloParamLight;
import it.pa.repdgt.shared.restapi.param.SceltaProfiloParamLightProgramma;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@JsonRootName(value = "RichiestaDrupal")
public class ForwardRichiestDrupalParam extends SceltaProfiloParamLight implements Serializable {
	private static final long serialVersionUID = 5516563764543550705L;
	
	private SceltaProfiloParamLightProgramma profilo;
	
	// metodo HTTP da richiamare verso API DRUPAL
	@NotBlank(message = "metodo richiesta http deve essere non blank")
	@JsonProperty(value = "metodoHttp")
	private String metodoRichiestaHttp;
	
	// url da richiamare
	@JsonProperty(value = "url")
	@NotBlank(message = "url deve essere non null")
	private String urlRichiesta;

	// corpo richiesta HTTP da bypassare verso API DRUPAL se la chiamata verso DRUPAL e' in POST
	@JsonProperty(value = "body")
	private String bodyRichiestaHttp;
	
	@JsonProperty(value = "isUploadFile")
	private Boolean isUploadFile;
	
	@JsonProperty(value = "filenameToUpload")
	private String filenameToUpload;
	
	@JsonProperty(value = "fileBase64ToUpload")
	private String fileBase64ToUpload;
	
	@JsonProperty(value = "type")
	private String type;
}