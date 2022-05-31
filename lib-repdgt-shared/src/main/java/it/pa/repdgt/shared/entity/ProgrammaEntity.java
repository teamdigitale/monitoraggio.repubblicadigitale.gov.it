package it.pa.repdgt.shared.entity;

import java.io.Serializable;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import com.fasterxml.jackson.annotation.JsonIgnore;

import it.pa.repdgt.shared.entityenum.PolicyEnum;
import lombok.Getter;
import lombok.Setter;

@Entity
@Setter
@Getter
@Table(name = "programma")
public class ProgrammaEntity implements Serializable {
	private static final long serialVersionUID = -1134246828726660200L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "ID")
	private Long id;
	
	@Column(name = "CODICE", unique = true)
	private String codice;

	@Column(name = "NOME", nullable = false)
	private String nome;
	
	@Column(name = "NOME_BREVE", nullable = false)
	private String nomeBreve;

	/**
	 * L'Ente Gestore di questo (this) Programma
	 * 
	 * */
	@JsonIgnore
	@OneToOne(fetch = FetchType.EAGER, targetEntity = EnteEntity.class)
	@JoinColumn(name = "ID_ENTE_GESTORE_PROGRAMMA", referencedColumnName = "ID")
	private EnteEntity enteGestoreProgramma;
	
	@Column(name = "STATO_GESTORE_PROGRAMMA")
	private String statoGestoreProgramma;

	@Column(name = "POLICY")
	@Enumerated(value = EnumType.STRING)
	private PolicyEnum policy;
	
	@Column(name = "DATA_INIZIO_PROGRAMMA")
	private Date dataInizioProgramma;
	
	@Column(name = "DATA_FINE_PROGRAMMA")
	private Date dataFineProgramma;
	
	@Column(name = "DATA_ORA_ATTIVAZIONE_PROGRAMMA")
	private Date dataOraAttivazioneProgramma;

	@Column(name = "DATA_ORA_TERMINAZIONE_PROGRAMMA")
	private Date dataOraTerminazioneProgramma;

	@Column(name = "STATO")
	private String stato;
	
	@Temporal(value = TemporalType.TIMESTAMP)
	@Column(name = "DATA_ORA_CREAZIONE")
	private Date dataOraCreazione;

	@Temporal(value = TemporalType.TIMESTAMP)
	@Column(name = "DATA_ORA_AGGIORNAMENTO")
	private Date dataOraAggiornamento;
	
	//Numero Target Punti di Facilitazione
		@Column(name = "n_punti_facilitazione_target1")
		private Integer nPuntiFacilitazioneTarget1;
		
		@Column(name = "n_punti_facilitazione_target2")
		private Integer nPuntiFacilitazioneTarget2;
		
		@Column(name = "n_punti_facilitazione_target3")
		private Integer nPuntiFacilitazioneTarget3;
		
		@Column(name = "n_punti_facilitazione_target4")
		private Integer nPuntiFacilitazioneTarget4;
		
		@Column(name = "n_punti_facilitazione_target5")
		private Integer nPuntiFacilitazioneTarget5;
		
		//Date Target Punti di Facilitazione
		@Column(name = "n_punti_facilitazione_data_target1")
		private Date nPuntiFacilitazioneDataTarget1;
		
		@Column(name = "n_punti_facilitazione_data_target2")
		private Date nPuntiFacilitazioneDataTarget2;
		
		@Column(name = "n_punti_facilitazione_data_target3")
		private Date nPuntiFacilitazioneDataTarget3;
		
		@Column(name = "n_punti_facilitazione_data_target4")
		private Date nPuntiFacilitazioneDataTarget4;
		
		@Column(name = "n_punti_facilitazione_data_target5")
		private Date nPuntiFacilitazioneDataTarget5;
		
		//Numero Target Utenti Unici
		@Column(name = "n_utenti_unici_target1")
		private Integer nUtentiUniciTarget1;
		
		@Column(name = "n_utenti_unici_target2")
		private Integer nUtentiUniciTarget2;
		
		@Column(name = "n_utenti_unici_target3")
		private Integer nUtentiUniciTarget3;
		
		@Column(name = "n_utenti_unici_target4")
		private Integer nUtentiUniciTarget4;
		
		@Column(name = "n_utenti_unici_target5")
		private Integer nUtentiUniciTarget5;
		
		//Date Target Utenti Unici
		@Column(name = "n_utenti_unici_data_target1")
		private Date nUtentiUniciDataTarget1;
		
		@Column(name = "n_utenti_unici_data_target2")
		private Date nUtentiUniciDataTarget2;
		
		@Column(name = "n_utenti_unici_data_target3")
		private Date nUtentiUniciDataTarget3;
		
		@Column(name = "n_utenti_unici_data_target4")
		private Date nUtentiUniciDataTarget4;
		
		@Column(name = "n_utenti_unici_data_target5")
		private Date nUtentiUniciDataTarget5;
		
		//Numero Target Servizi
		@Column(name = "n_servizi_target1")
		private Integer nServiziTarget1;
		
		@Column(name = "n_servizi_target2")
		private Integer nServiziTarget2;
		
		@Column(name = "n_servizi_target3")
		private Integer nServiziTarget3;
		
		@Column(name = "n_servizi_target4")
		private Integer nServiziTarget4;
		
		@Column(name = "n_servizi_target5")
		private Integer nServiziTarget5;
		
		//Date Target Servizi
		@Column(name = "n_servizi_data_target1")
		private Date nServiziDataTarget1;
		
		@Column(name = "n_servizi_data_target2")
		private Date nServiziDataTarget2;
		
		@Column(name = "n_servizi_data_target3")
		private Date nServiziDataTarget3;
		
		@Column(name = "n_servizi_data_target4")
		private Date nServiziDataTarget4;
		
		@Column(name = "n_servizi_data_target5")
		private Date nServiziDataTarget5;
		
		//Numero Target Facilitatori
		@Column(name = "n_facilitatori_target1")
		private Integer nFacilitatoriTarget1;
		
		@Column(name = "n_facilitatori_target2")
		private Integer nFacilitatoriTarget2;
		
		@Column(name = "n_facilitatori_target3")
		private Integer nFacilitatoriTarget3;
		
		@Column(name = "n_facilitatori_target4")
		private Integer nFacilitatoriTarget4;
		
		@Column(name = "n_facilitatori_target5")
		private Integer nFacilitatoriTarget5;
		
		//Date Target Facilitatori
		@Column(name = "n_facilitatori_data_target1")
		private Date nFacilitatoriDataTarget1;
		
		@Column(name = "n_facilitatori_data_target2")
		private Date nFacilitatoriDataTarget2;
		
		@Column(name = "n_facilitatori_data_target3")
		private Date nFacilitatoriDataTarget3;
		
		@Column(name = "n_facilitatori_data_target4")
		private Date nFacilitatoriDataTarget4;
		
		@Column(name = "n_facilitatori_data_target5")
		private Date nFacilitatoriDataTarget5;
}