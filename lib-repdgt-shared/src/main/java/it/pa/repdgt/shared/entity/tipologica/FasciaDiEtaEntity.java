package it.pa.repdgt.shared.entity.tipologica;

import lombok.Data;

import javax.persistence.*;
import java.io.Serializable;

@Table(name = "fascia_di_eta")
@Entity
@Data
public class FasciaDiEtaEntity implements Serializable {
    private static final long serialVersionUID = -4297165385252554097L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private Long id;

    @Column(name = "FASCIA")
    private String fascia;
}
