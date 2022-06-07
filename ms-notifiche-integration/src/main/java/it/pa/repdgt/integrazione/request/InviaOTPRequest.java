package it.pa.repdgt.integrazione.request;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class InviaOTPRequest implements Serializable {
	private static final long serialVersionUID = 6494523370636956854L;

	@JsonProperty(value = "numeroTelefonoDestinatarioOTP")
	private String numeroTelefonoDestinatarioOTP;
}