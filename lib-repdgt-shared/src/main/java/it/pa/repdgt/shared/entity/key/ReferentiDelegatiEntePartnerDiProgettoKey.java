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
public class ReferentiDelegatiEntePartnerDiProgettoKey implements Serializable {
	private static final long serialVersionUID = 511771208547694963L;
	
	@Column(name = "ID_PROGETTO")
	private Long idProgetto;
	
	@Column(name = "ID_ENTE")
	private Long idEnte;
	
	@Column(name = "CF_UTENTE")
	private String codFiscaleUtente;
}