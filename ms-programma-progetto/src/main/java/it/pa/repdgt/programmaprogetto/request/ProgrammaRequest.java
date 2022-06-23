package it.pa.repdgt.programmaprogetto.request;

import java.io.Serializable;
import java.util.Date;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.annotation.JsonProperty;

import it.pa.repdgt.shared.entityenum.PolicyEnum;
import lombok.Getter;
import lombok.Setter;

/**
 * Classe che mappa i dati di richiesta per:
 * 	- CREAZIONE di un proggramma
 *  - AGGIORNAMENTO di un programma
 *
 **/
@Setter
@Getter
public class ProgrammaRequest implements Serializable {
	private static final long serialVersionUID = 3778729425460145918L;
	
	// 'Nome Programma' della scheda Informazioni Generali del programma
	@NotBlank(message = "Deve essere non null e non blank")
	@JsonProperty(value = "nome", required = true)
	private String nome;
	
	// 'Nome breve' della scheda Informazioni Generali del programma
	@NotBlank(message = "DEVE ESSERE NON NULL E NON BLANK")
	@JsonProperty(value = "nomeBreve", required = true)
	private String nomeBreve;
	
	// 'Policy' della scheda Informazioni Generali del Programma
	@JsonProperty(value = "policy", required = true)
	@NotNull(message = "Deve essere non null e uno tra i seguenti valori: {RFD, SCD}")
	private PolicyEnum policy;
	
	// 'Data Inizio' della scheda Informazioni Generali del Programma
	@JsonProperty(value = "dataInizioProgramma", required = true)
	@NotNull(message = "Deve essere non null")
	private Date dataInizioProgramma;
	
	// 'Data Fine' della scheda Informazioni Generali del Programma
	@JsonProperty(value = "dataFineProgramma", required = true)
	@NotNull(message = "Deve essere non null")
	private Date dataFineProgramma;
	
	// 'Bando' della scheda Informazioni Generali del Programma
	@JsonProperty(value = "bando", required = false)
	private String bando;
	
	// 'CUP' della scheda Informazioni Generali del Programma
	@JsonProperty(value = "cup")
	@NotBlank(message = "Deve essere non null e non blank")
	private String cup;
	
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