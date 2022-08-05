package it.pa.repdgt.shared.entity;

import java.io.Serializable;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "questionario_inviato_online")
@Setter
@Getter
public class QuestionarioInviatoOnlineEntity implements Serializable { 
	private static final long serialVersionUID = -3997184755252624867L;
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "ID")
	private Long id;
	
	@Column(name = "CODICE_FISCALE", nullable = true)
	private String codiceFiscale;
	
	@Column(name = "NUM_DOCUMENTO", nullable = true)
	private String numDocumento;
	
	@Column(name = "ID_QUESTIONARIO_COMPILATO", nullable = false, unique = true)
	private String idQuestionarioCompilato;
	
	@Column(name = "EMAIL", nullable = false, unique = true)
	private String email;
	
	@Column(name = "TOKEN", nullable = false, unique = true)
	private String token;
	
	@Temporal(TemporalType.TIMESTAMP)
	@Column(name = "DATA_ORA_CREAZIONE", nullable = true)
	private Date dataOraCreazione;
}