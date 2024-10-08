package it.pa.repdgt.shared.entity;

import java.io.Serializable;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "v_monitoraggio_caricamenti")
@Setter
@Getter
public class VMonitoraggioCaricamentiEntity implements Serializable{

    @Id
    private String id;

    @Column(name = "id_programma", nullable = false)
    private Long idProgramma;

    @Column(name = "intervento")
    private String intervento;

    @Column(name = "nome_programma", nullable = false)
    private String nomeProgramma;

    @Column(name = "id_progetto", nullable = false)
    private Long idProgetto;

    @Column(name = "nome_progetto",  nullable = false)
    private String nomeProgetto;

    @Column(name = "id_ente", nullable = false)
    private Long idEnte;

    @Column(name = "nome_ente")
    private String nomeEnte;

    @Column(name = "data_caricamenti")
    @Temporal(TemporalType.DATE)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd", timezone = "Europe/Rome")
    private Date dataCaricamenti;

    @Column(name = "num_caricamenti", nullable = false)
    private Long numCaricamenti;

    @Column(name = "servizi_aggiunti")
    private Long serviziAggiunti;

    @Column(name = "cittadini_associati")
    private Long cittadiniAssociati;
    
}
