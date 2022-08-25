package it.pa.repdgt.programmaprogetto.resource;

import java.util.List;

import it.pa.repdgt.shared.entity.ProgettoEntity;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class PaginaProgetti {

	private List<ProgettoEntity> paginaProgetti;
	private long totalElements;
	private int totalPages;
}
