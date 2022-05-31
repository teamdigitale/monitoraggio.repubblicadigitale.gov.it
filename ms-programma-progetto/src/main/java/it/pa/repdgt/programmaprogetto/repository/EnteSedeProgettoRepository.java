package it.pa.repdgt.programmaprogetto.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import it.pa.repdgt.shared.entity.EnteSedeProgetto;
import it.pa.repdgt.shared.entity.key.EnteSedeProgettoKey;

public interface EnteSedeProgettoRepository extends JpaRepository<EnteSedeProgetto, EnteSedeProgettoKey> {

	@Query(value = "SELECT * "
			+ " FROM "
			+ " ente_sede_progetto "
			+ " WHERE 1=1 "
			+ " AND "
			+ " ID_PROGETTO = :idProgetto ",
			nativeQuery = true)
	public List<EnteSedeProgetto> getEnteSedeProgettoByIdProgetto(Long idProgetto);
}
