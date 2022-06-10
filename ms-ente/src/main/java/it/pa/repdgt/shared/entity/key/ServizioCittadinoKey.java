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
public class ServizioCittadinoKey implements Serializable {
	private static final long serialVersionUID = 5768231077510471159L;
	
	@Column(name = "ID_CITTADINO")
	private Long idCittadino;
	
	@Column(name = "ID_SERVIZIO")
	private Long idServizio;
}