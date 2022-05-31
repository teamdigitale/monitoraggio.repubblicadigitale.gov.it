package it.pa.repdgt.surveymgmt.response;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@JsonInclude(value = Include.NON_NULL)
public class Response<T extends Object> implements Serializable {
	private static final long serialVersionUID = 5064301080919977599L;

	@JsonProperty(value = "time")
	private Date timestamp = new Date();
	MultiValueMap<String, String> headers = new LinkedMultiValueMap<String, String>();
	private HttpStatus statoHttp;
	private Integer codiceStato;
	private T payload;
	@JsonProperty(value = "errori")
	private List<String> errorsMessage;
	
	public Response(Date timestamp, List<String> errorsMessage, HttpStatus statoHttp, T payload, MultiValueMap<String, String> headers) {
		this.timestamp = timestamp;
		this.headers = headers;
		this.statoHttp = statoHttp;
		this.codiceStato = statoHttp == null? null: statoHttp.value();
		this.errorsMessage = errorsMessage;
		this.payload = payload;
		this.errorsMessage = errorsMessage;
	}
	
	public Response(HttpStatus statoHttp, T payload, MultiValueMap<String, String> headers) {
		this(new Date(), null, statoHttp, payload, headers);
	}
	
	public Response(HttpStatus statoHttp, List<String> errorsMessage) {
		this(new Date(), errorsMessage, statoHttp, null, null);
	}
	
	public Response(HttpStatus statoHttp, T payload) {
		this(new Date(), null, statoHttp, payload, null);
	}
	
	public Response(HttpStatus statoHttp) {
		this(new Date(), null, statoHttp, null, null);
	}
}