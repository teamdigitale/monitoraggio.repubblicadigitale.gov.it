package it.pa.repdgt.integrazione.restapi;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import it.pa.repdgt.integrazione.request.InviaOTPRequest;
import it.pa.repdgt.integrazione.request.VerificaValidazioneOTPRequest;
import it.pa.repdgt.shared.awsintegration.service.OTPService;

@RestController
@RequestMapping(path = "/otp")
public class OTPRestApi {
	@Autowired
	private OTPService otpService;
	
	@PostMapping(path = "/invia")
	@ResponseStatus(value = HttpStatus.OK)
	public void inviaOTP(
		 @RequestBody final InviaOTPRequest inviaOTPRequest) {
		 this.otpService.inviaOTP(inviaOTPRequest.getNumeroTelefonoDestinatarioOTP());
	}
	
	@PostMapping(path = "/valida")
	@ResponseStatus(value = HttpStatus.OK)
	public void verificaValidazioneOTP(
			@RequestBody final VerificaValidazioneOTPRequest verificaValidazioneOTPRequest) {
		this.otpService.verificaOTP(
				verificaValidazioneOTPRequest.getNumeroTelefonoDestinatarioOTP(),
				verificaValidazioneOTPRequest.getCodiceOTP()
		   );
	}
}