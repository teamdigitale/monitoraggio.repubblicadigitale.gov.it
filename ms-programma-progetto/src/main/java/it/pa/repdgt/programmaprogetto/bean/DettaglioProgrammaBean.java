package it.pa.repdgt.programmaprogetto.bean;

import java.util.Date;

import com.fasterxml.jackson.annotation.JsonRootName;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@JsonRootName(value = "DettaglioProgramma")
public class DettaglioProgrammaBean {
	private String nome;
	private String nomeBreve;
	private Date dataInizio;
	private Date dataFine;
	private String bando;
	private String cup;
	private String stato;
	private String policy;
	
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