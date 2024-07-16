package it.pa.repdgt.shared.entity;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

import javax.persistence.*;

import it.pa.repdgt.shared.entity.tipologica.FasciaDiEtaEntity;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

@Entity
@Table(name = "cittadino")
@Setter
@Getter
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class CittadinoEntity implements Serializable {
	private static final long serialVersionUID = -3997184755252624867L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "ID")
	@EqualsAndHashCode.Include
	private Long id;

	@Column(name = "CODICE_FISCALE")
	private String codiceFiscale;

	@Column(name = "TIPO_DOCUMENTO")
	private String tipoDocumento;

	@Column(name = "NUM_DOCUMENTO", unique = true)
	private String numeroDocumento;

	@Column(name = "GENERE")
	private String genere;

	@OneToOne
	@JoinColumn(name = "FASCIA_DI_ETA_ID")
	private FasciaDiEtaEntity fasciaDiEta;

	@Column(name = "TITOLO_DI_STUDIO")
	private String titoloDiStudio;

	@Column(name = "OCCUPAZIONE")
	private String occupazione;

	@Column(name = "CITTADINANZA")
	private String cittadinanza;

	@Temporal(value = TemporalType.TIMESTAMP)
	@CreatedDate
	@Column(name = "DATA_ORA_CREAZIONE")
	private Date dataOraCreazione;

	@Temporal(value = TemporalType.TIMESTAMP)
	@LastModifiedDate
	@Column(name = "DATA_ORA_AGGIORNAMENTO")
	private Date dataOraAggiornamento;

	@OneToMany(mappedBy = "cittadino", cascade = CascadeType.ALL)
	private List<QuestionarioCompilatoEntity> questionarioCompilato;

	@Column(name = "PROVINCIA_DI_DOMICILIO")
	private String provinciaDiDomicilio;
}