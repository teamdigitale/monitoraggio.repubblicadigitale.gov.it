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
public class UtenteXRuoloKey implements Serializable {
	private static final long serialVersionUID = -2038226148572575312L;

	@Column(name = "UTENTE_ID")
	private String utenteId;
	@Column(name = "RUOLO_CODICE")
	private String ruoloCodice;
}