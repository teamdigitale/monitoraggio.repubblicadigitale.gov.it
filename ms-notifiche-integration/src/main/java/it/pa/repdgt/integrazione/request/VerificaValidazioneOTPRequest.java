package it.pa.repdgt.integrazione.request;

import java.io.Serializable;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class VerificaValidazioneOTPRequest implements Serializable {
	private static final long serialVersionUID = 7858839310126830453L;
	
	@JsonProperty(value = "codiceOTP")
	@Size(
		message = "codice OTP deve avere un numero di caratteri compreso tra 5 e 8",
		min = 5,
		max = 8
	)
	@NotBlank(message = "codice OTP deve essere non blank")
	private String codiceOTP;

	@JsonProperty(value = "numeroTelefonoDestinatarioOTP")
	@Size(
		message = "numero destinatario codice OTP deve avere almeno 10 cifre",
		min = 10
	)
	@NotBlank(message = "numero destinatario OTP deve essere non blank")
	private String numeroTelefonoDestinatarioOTP;
}