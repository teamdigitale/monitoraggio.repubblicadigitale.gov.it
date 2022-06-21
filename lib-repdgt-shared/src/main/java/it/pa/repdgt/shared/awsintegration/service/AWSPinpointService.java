package it.pa.repdgt.shared.awsintegration.service;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Service;

import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.pinpoint.PinpointClient;
import software.amazon.awssdk.services.pinpoint.model.AddressConfiguration;
import software.amazon.awssdk.services.pinpoint.model.ChannelType;
import software.amazon.awssdk.services.pinpoint.model.DirectMessageConfiguration;
import software.amazon.awssdk.services.pinpoint.model.EmailMessage;
import software.amazon.awssdk.services.pinpoint.model.MessageRequest;
import software.amazon.awssdk.services.pinpoint.model.SendMessagesRequest;
import software.amazon.awssdk.services.pinpoint.model.SendOTPMessageRequestParameters;
import software.amazon.awssdk.services.pinpoint.model.SendOtpMessageRequest;
import software.amazon.awssdk.services.pinpoint.model.SimpleEmail;
import software.amazon.awssdk.services.pinpoint.model.SimpleEmailPart;
import software.amazon.awssdk.services.pinpoint.model.VerifyOTPMessageRequestParameters;
import software.amazon.awssdk.services.pinpoint.model.VerifyOtpMessageRequest;

@Service
@Scope("singleton")
public class AWSPinpointService {
	private static final String INDIRIZZO_EMAIL_MITTENTE = "RepDigDev@mitd.technology";
	private static final String REFERENCE_ID_REQ_RESP = "RepDGDevOTP";
	private static final String CHARSET_EMAIL = "UTF-8";
	
	@Value(value = "${aws.app-id:}")
	private String appId;
	@Value(value = "${aws.pinpoint.access-key:}")
	private String accessKey;
	@Value(value = "${aws.pinpoint.secret-key:}")
	private String secretKey;

	public PinpointClient getClient() {
		return PinpointClient.builder()
				.credentialsProvider(
						StaticCredentialsProvider.create(AwsBasicCredentials.create(this.accessKey, this.secretKey)))
				.region(Region.EU_CENTRAL_1).build();
	}

	public SendOtpMessageRequest creaRichiestaPerInvioOTP(final String numeroDestinatario) {
		final SendOTPMessageRequestParameters sendOTPMessageRequestParameters = SendOTPMessageRequestParameters
				.builder().brandName("Repubblica Digitale").channel("SMS").destinationIdentity(numeroDestinatario)
				.language("it-IT").originationIdentity(REFERENCE_ID_REQ_RESP).referenceId(REFERENCE_ID_REQ_RESP)
				.codeLength(6).validityPeriod(15).build();

		return SendOtpMessageRequest.builder().applicationId(this.appId)
				.sendOTPMessageRequestParameters(sendOTPMessageRequestParameters).build();
	}

	public VerifyOtpMessageRequest creaRichiestaPerVerificaOTP(final String otpDaValidare,
			final String numeroDestinatario) {
		final VerifyOTPMessageRequestParameters verifyOTPMessageRequestParameters = VerifyOTPMessageRequestParameters
				.builder().otp(otpDaValidare).destinationIdentity(numeroDestinatario).referenceId(REFERENCE_ID_REQ_RESP)
				.build();

		return VerifyOtpMessageRequest.builder().applicationId(this.appId)
				.verifyOTPMessageRequestParameters(verifyOTPMessageRequestParameters).build();
	}

	public SendMessagesRequest creaRichiestaInvioEmail(
			final String subject, 
			final String toAddress, 
			final String htmlBody) {
		final SimpleEmailPart email = SimpleEmailPart.builder()
										.data(htmlBody)
										.charset(CHARSET_EMAIL)
										.build();

		final SimpleEmailPart oggetto = SimpleEmailPart.builder()
										 .data(subject)
										 .charset(CHARSET_EMAIL)
										 .build();

		final EmailMessage emailMessage = EmailMessage.builder()
											.body(htmlBody)
											.fromAddress(INDIRIZZO_EMAIL_MITTENTE)
											.simpleEmail(SimpleEmail.builder()
													.htmlPart(email)
													.subject(oggetto)
													.build()
											).build();

		final Map<String, AddressConfiguration> addressMap = new HashMap<>();
		final AddressConfiguration configuration = AddressConfiguration.builder()
													.channelType(ChannelType.EMAIL)
													.build();
		addressMap.put(toAddress, configuration);

		final MessageRequest messageRequest = MessageRequest.builder()
												.addresses(addressMap)
												.messageConfiguration(
														DirectMessageConfiguration.builder()
														.emailMessage(emailMessage)
														.build()
												).build();

		return SendMessagesRequest.builder()
									.applicationId(this.appId)
									.messageRequest(messageRequest).build();
	}
}