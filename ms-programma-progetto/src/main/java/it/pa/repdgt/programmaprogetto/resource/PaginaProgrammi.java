package it.pa.repdgt.programmaprogetto.resource;

import java.util.List;

import it.pa.repdgt.shared.entity.ProgrammaEntity;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class PaginaProgrammi {
	private List<ProgrammaEntity> paginaProgrammi;
	private long totalElements;
	private int totalPages;
}
