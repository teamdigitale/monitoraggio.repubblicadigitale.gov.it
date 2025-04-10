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
@Setter
@Getter
@Table(name = "configurazione_minorenni")
public class ConfigurazioneMinorenniEntity implements Serializable{
    
    @Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id")
	private Long id;

    @Column(name = "id_programma", nullable = false)
    private Long idProgramma;

    @Column(name = "intervento")
    private String intervento;

    @Temporal(value = TemporalType.TIMESTAMP)
    @Column(name = "data_abilitazione")
    private Date dataAbilitazione;

    @Temporal(value = TemporalType.TIMESTAMP)
    @Column(name = "data_decorrenza")
    private Date dataDecorrenza;

    @Temporal(value = TemporalType.TIMESTAMP)
    @Column(name = "create_timestamp")
    private Date createTimestamp;

    @Column(name = "create_user")
    private String createUser;

    @Temporal(value = TemporalType.TIMESTAMP)
    @Column(name = "update_timestamp")
    private Date updateTimestamp;

    @Column(name = "update_user")
    private String updateUser;
    
}