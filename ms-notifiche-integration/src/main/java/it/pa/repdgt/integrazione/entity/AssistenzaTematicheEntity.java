package it.pa.repdgt.integrazione.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;


import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "zendesk_area_tematica")
@Setter
@Getter
public class AssistenzaTematicheEntity {

    @Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "ID")
	private Long id;
	
	@Column(name = "TAG", nullable = false)
	private String tag;

	@Column(name = "DESCRIZIONE", nullable = false)
	private String descrizione;
}
