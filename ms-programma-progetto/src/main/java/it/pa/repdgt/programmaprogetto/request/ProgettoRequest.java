package it.pa.repdgt.programmaprogetto.request;

import java.io.Serializable;
import java.util.Date;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class ProgettoRequest implements Serializable {
	private static final long serialVersionUID = 3778729425460145918L;

	@NotBlank(message = "Deve essere non null e non blank")
	@JsonProperty(value = "nome", required = true)
	private String nome;

	@NotBlank(message = "Deve essere non null e non blank")
	@JsonProperty(value = "nomeBreve", required = true)
	private String nomeBreve;
	
	@JsonProperty(value = "cup", required = true)
	@NotBlank(message = "Deve essere non null e non blank")
	private String cup;
	
	@NotNull(message = "Deve essere non null")
	@JsonProperty(value = "dataInizioProgetto", required = true)
	private Date dataInizioProgetto;
	
	@NotNull(message = "Deve essere non null")
	@JsonProperty(value = "dataFineProgetto", required = true)
	private Date dataFineProgetto;
	
	//Numero Target Punti di Facilitazione
	private Integer nPuntiFacilitazioneTarget1;
	private Integer nPuntiFacilitazioneTarget2;
	private Integer nPuntiFacilitazioneTarget3;
	private Integer nPuntiFacilitazioneTarget4;
	private Integer nPuntiFacilitazioneTarget5;
	
	//Date Target Punti di Facilitazione
	private Date nPuntiFacilitazioneDataTarget1;
	private Date nPuntiFacilitazioneDataTarget2;
	private Date nPuntiFacilitazioneDataTarget3;
	private Date nPuntiFacilitazioneDataTarget4;
	private Date nPuntiFacilitazioneDataTarget5;
	
	//Numero Target Utenti Unici
	private Integer nUtentiUniciTarget1;
	private Integer nUtentiUniciTarget2;
	private Integer nUtentiUniciTarget3;
	private Integer nUtentiUniciTarget4;
	private Integer nUtentiUniciTarget5;
	
	//Date Target Utenti Unici
	private Date nUtentiUniciDataTarget1;
	private Date nUtentiUniciDataTarget2;
	private Date nUtentiUniciDataTarget3;
	private Date nUtentiUniciDataTarget4;
	private Date nUtentiUniciDataTarget5;
	
	//Numero Target Servizi
	private Integer nServiziTarget1;
	private Integer nServiziTarget2;
	private Integer nServiziTarget3;
	private Integer nServiziTarget4;
	private Integer nServiziTarget5;
	
	//Date Target Servizi
	private Date nServiziDataTarget1;
	private Date nServiziDataTarget2;
	private Date nServiziDataTarget3;
	private Date nServiziDataTarget4;
	private Date nServiziDataTarget5;
	
	//Numero Target Facilitatori
	private Integer nFacilitatoriTarget1;
	private Integer nFacilitatoriTarget2;
	private Integer nFacilitatoriTarget3;
	private Integer nFacilitatoriTarget4;
	private Integer nFacilitatoriTarget5;
	
	//Date Target Facilitatori
	private Date nFacilitatoriDataTarget1;
	private Date nFacilitatoriDataTarget2;
	private Date nFacilitatoriDataTarget3;
	private Date nFacilitatoriDataTarget4;
	private Date nFacilitatoriDataTarget5;
}