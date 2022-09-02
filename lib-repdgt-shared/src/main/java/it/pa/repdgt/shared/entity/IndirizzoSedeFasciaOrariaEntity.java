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
@Table(name = "indirizzo_sede_fascia_oraria")
@Setter
@Getter
public class IndirizzoSedeFasciaOrariaEntity implements Serializable {
	private static final long serialVersionUID = -4335386214547725888L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "ID")
	private Long id;

	@Column(name = "INDIRIZZO_SEDE_ID")
	private Long idIndirizzoSede;
	
	@Column(name = "LUN_ORARIO_APERTURA_1", nullable = false)
	private String lunOrarioAperutura1;
	@Column(name = "LUN_ORARIO_CHIUSURA_1", nullable = false)
	private String lunOrarioChiusura1;
	@Column(name = "LUN_ORARIO_APERTURA_2", nullable = false)
	private String lunOrarioAperutura2;
	@Column(name = "LUN_ORARIO_CHIUSURA_2", nullable = false)
	private String lunOrarioChiusura2;
	
	@Column(name = "MAR_ORARIO_APERTURA_1", nullable = false)
	private String marOrarioAperutura1;
	@Column(name = "MAR_ORARIO_CHIUSURA_1", nullable = false)
	private String marOrarioChiusura1;
	@Column(name = "MAR_ORARIO_APERTURA_2", nullable = false)
	private String marOrarioAperutura2;
	@Column(name = "MAR_ORARIO_CHIUSURA_2", nullable = false)
	private String marOrarioChiusura2;
	
	@Column(name = "MER_ORARIO_APERTURA_1", nullable = false)
	private String merOrarioAperutura1;
	@Column(name = "MER_ORARIO_CHIUSURA_1", nullable = false)
	private String merOrarioChiusura1;
	@Column(name = "MER_ORARIO_APERTURA_2", nullable = false)
	private String merOrarioAperutura2;
	@Column(name = "MER_ORARIO_CHIUSURA_2", nullable = false)
	private String merOrarioChiusura2;
	
	@Column(name = "GIO_ORARIO_APERTURA_1", nullable = false)
	private String gioOrarioAperutura1;
	@Column(name = "GIO_ORARIO_CHIUSURA_1", nullable = false)
	private String gioOrarioChiusura1;
	@Column(name = "GIO_ORARIO_APERTURA_2", nullable = false)
	private String gioOrarioAperutura2;
	@Column(name = "GIO_ORARIO_CHIUSURA_2", nullable = false)
	private String gioOrarioChiusura2;
	
	@Column(name = "VEN_ORARIO_APERTURA_1", nullable = false)
	private String venOrarioAperutura1;
	@Column(name = "VEN_ORARIO_CHIUSURA_1", nullable = false)
	private String venOrarioChiusura1;
	@Column(name = "VEN_ORARIO_APERTURA_2", nullable = false)
	private String venOrarioAperutura2;
	@Column(name = "VEN_ORARIO_CHIUSURA_2", nullable = false)
	private String venOrarioChiusura2;
	
	@Column(name = "SAB_ORARIO_APERTURA_1", nullable = false)
	private String sabOrarioAperutura1;	
	@Column(name = "SAB_ORARIO_CHIUSURA_1", nullable = false)
	private String sabOrarioChiusura1;	
	@Column(name = "SAB_ORARIO_APERTURA_2", nullable = false)
	private String sabOrarioAperutura2;	
	@Column(name = "SAB_ORARIO_CHIUSURA_2", nullable = false)
	private String sabOrarioChiusura2;
	
	@Column(name = "DOM_ORARIO_APERTURA_1", nullable = false)
	private String domOrarioAperutura1;
	@Column(name = "DOM_ORARIO_CHIUSURA_1", nullable = false)
	private String domOrarioChiusura1;
	@Column(name = "DOM_ORARIO_APERTURA_2", nullable = false)
	private String domOrarioAperutura2;
	@Column(name = "DOM_ORARIO_CHIUSURA_2", nullable = false)
	private String domOrarioChiusura2;

	@Temporal(value = TemporalType.TIMESTAMP)
	@Column(name = "DATA_ORA_CREAZIONE", nullable = false)
	private Date dataOraCreazione;

	@Temporal(value = TemporalType.TIMESTAMP)
	@Column(name = "DATA_ORA_AGGIORNAMENTO", nullable = true)
	private Date dataOraAggiornamento;
}