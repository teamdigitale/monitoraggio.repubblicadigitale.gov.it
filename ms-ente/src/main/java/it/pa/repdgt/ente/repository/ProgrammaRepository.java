package it.pa.repdgt.ente.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import it.pa.repdgt.shared.entity.ProgrammaEntity;

@Repository
public interface ProgrammaRepository extends JpaRepository<ProgrammaEntity, Long> {

	@Query(value = "SELECT programma.ID "
			+ "FROM programma programma "
			+ "WHERE programma.ID_ENTE_GESTORE_PROGRAMMA = :idEnte ", 
			nativeQuery = true)
	public List<Long> findIdProgrammiByIdEnte(@Param(value = "idEnte") Long idEnte);

	@Query(value = "SELECT COUNT(*) "
			+ "FROM programma programma "
			+ "WHERE programma.ID_ENTE_GESTORE_PROGRAMMA = :idEnte", 
			nativeQuery = true)
	public int countProgrammiEnte(@Param(value = "idEnte") Long idEnte);

	@Query(value = "SELECT programma.ID_ENTE_GESTORE_PROGRAMMA "
			+ "FROM programma programma "
			+ "WHERE programma.ID = :idProgramma ",
			nativeQuery = true)
	public Long findIdEnteGestoreProgramma(@Param(value = "idProgramma") Long idProgramma);

	@Query(value = "SELECT * "
			+ "FROM programma programma "
			+ "WHERE programma.ID_ENTE_GESTORE_PROGRAMMA = :idEnte ",
			nativeQuery = true)
	public List<ProgrammaEntity> findProgrammiByIdEnte(@Param(value = "idEnte") Long idEnte);
}