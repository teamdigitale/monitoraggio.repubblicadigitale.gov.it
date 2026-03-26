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
@Table(name = "vw_primo_servizio_cittadino")
@Setter
@Getter
public class VPrimoServizioCittadinoEntity implements Serializable {

    @Id
    @Column(name = "id_cittadino")
    private Long idCittadino;

    @Column(name = "codice_fiscale")
    private String codiceFiscale;

    @Column(name = "genere")
    private String genere;

    @Column(name = "fascia")
    private String fascia;

    @Column(name = "titolo_di_studio")
    private String titoloDiStudio;

    @Column(name = "occupazione")
    private String occupazione;

    @Column(name = "cittadinanza")
    private String cittadinanza;

    @Column(name = "id_servizio")
    private Long idServizio;

    @Column(name = "regione_provincia")
    private String regioneProvincia;

    @Column(name = "nome_gestore")
    private String nomeGestore;

    @Column(name = "cup")
    private String cup;

    @Column(name = "nome_servizio")
    private String nomeServizio;

    @Column(name = "nome_punto_facilitazione")
    private String nomePuntoFacilitazione;

    @Column(name = "indirizzo_punto_facilitazione")
    private String indirizzoPuntoFacilitazione;

    @Column(name = "nome_facilitatore")
    private String nomeFacilitatore;

    @Column(name = "data_servizio")
    @Temporal(TemporalType.DATE)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd", timezone = "Europe/Rome")
    private Date dataServizio;

    @Column(name = "tipologia_servizio")
    private String tipologiaServizio;

}
