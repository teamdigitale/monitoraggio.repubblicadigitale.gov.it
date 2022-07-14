package it.pa.repdgt.shared.awsintegration.service;

import javax.validation.constraints.NotNull;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

import it.pa.repdgt.shared.entityenum.EmailTemplateEnum;
import it.pa.repdgt.shared.exception.InvioEmailException;
import lombok.extern.slf4j.Slf4j;
import software.amazon.awssdk.services.pinpoint.model.GetEmailTemplateRequest;
import software.amazon.awssdk.services.pinpoint.model.GetEmailTemplateResponse;
import software.amazon.awssdk.services.pinpoint.model.SendMessagesRequest;
import software.amazon.awssdk.services.pinpoint.model.SendMessagesResponse;

@Service
@Validated
@Slf4j
public class EmailService {
	@Autowired
	private AWSPinpointService pinpoint;
	
	public SendMessagesResponse inviaEmail(
			@NotNull final String indirizzoEmailDestinatario,
			EmailTemplateEnum emailTemplate,
			String[] args) {
		try {
			GetEmailTemplateResponse response= this.pinpoint.getClient()
					.getEmailTemplate(GetEmailTemplateRequest.builder().templateName(emailTemplate.getValueTemplate()).build());
			
			String html = "";
			switch(emailTemplate){
				case GEST_PROG:
				case GEST_PROGE_PARTNER:
				case FACILITATORE:
				case RUOLO_CUSTOM:
					html = String.format(response.emailTemplateResponse().htmlPart(), args[0], args[1]);
					break;
				case CONSENSO:
				case QUESTIONARIO_ONLINE:
					html = String.format(response.emailTemplateResponse().htmlPart(), args[0]);
					break;				
			}
			
			final SendMessagesRequest richiestaInvioEmail = this.pinpoint.creaRichiestaInvioEmail(emailTemplate.getValueTemplateSubject(), indirizzoEmailDestinatario, html);
			final SendMessagesResponse  rispostaDaRichiestaInvioEmail = this.pinpoint.getClient().sendMessages(richiestaInvioEmail);
			log.info("sendMessagesResponse = {}", rispostaDaRichiestaInvioEmail);
			return rispostaDaRichiestaInvioEmail;
		} catch (Exception exc) {
			String messaggioErrore = String.format("Errore invio email a '%s'", indirizzoEmailDestinatario);
			throw new InvioEmailException(messaggioErrore, exc);
		}
	}
}