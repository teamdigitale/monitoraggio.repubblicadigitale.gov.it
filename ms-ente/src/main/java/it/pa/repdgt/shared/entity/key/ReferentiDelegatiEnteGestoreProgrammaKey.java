package it.pa.repdgt.shared.entity.key;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Embeddable;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Embeddable
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class ReferentiDelegatiEnteGestoreProgrammaKey implements Serializable {
	private static final long serialVersionUID = 9079607167812252918L;

	@Column(name = "ID_PROGRAMMA")
	private Long idProgramma;
	
	@Column(name = "CF_UTENTE")
	private String codFiscaleUtente;
	
	@Column(name = "ID_ENTE")
	private Long idEnte;
}
