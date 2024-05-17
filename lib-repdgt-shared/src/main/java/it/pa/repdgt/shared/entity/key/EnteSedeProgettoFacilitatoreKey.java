package it.pa.repdgt.shared.entity.key;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Embeddable;

import lombok.*;

@Embeddable
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
public class EnteSedeProgettoFacilitatoreKey implements Serializable {
	private static final long serialVersionUID = -2038226148572575312L;

	@Column(name = "ID_ENTE")
	private Long idEnte;

	@Column(name = "ID_SEDE")
	private Long idSede;

	@Column(name = "ID_PROGETTO")
	private Long idProgetto;

	@Column(name = "ID_FACILITATORE")
	private String idFacilitatore;
}