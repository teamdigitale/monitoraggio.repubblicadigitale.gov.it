package it.pa.repdgt.shared.entity.tipologica;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Table;
import javax.persistence.Id;

import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "tipologia_ubicazione_punto")
@Setter
@Getter
public class TipologiaUbicazioneSedeEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "ID")
	private Long id;

    @Column(name = "DESCRIZIONE")
	private String descrizione;

    @Column(name = "SELEZIONABILE_SI_NO")
	private Boolean selezionabileSiNo;
    
}
