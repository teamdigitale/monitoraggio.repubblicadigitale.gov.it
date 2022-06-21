package it.pa.repdgt.programmaprogetto.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import it.pa.repdgt.shared.entity.ReferentiDelegatiEnteGestoreProgrammaEntity;
import it.pa.repdgt.shared.entity.key.ReferentiDelegatiEnteGestoreProgrammaKey;

@Repository
public interface ReferentiDelegatiEnteGestoreProgrammaRepository extends JpaRepository<ReferentiDelegatiEnteGestoreProgrammaEntity, ReferentiDelegatiEnteGestoreProgrammaKey> {
	
	@Query(value = ""
			 + " SELECT * "
			 + " FROM "
			 + "	referente_delegati_gestore_programma "
			 + " WHERE 1=1"
			 + "	AND ID_PROGRAMMA = :idProgramma",
	   nativeQuery = true)
	List<ReferentiDelegatiEnteGestoreProgrammaEntity> getReferentiDelegatiEnteGestoreProgrammaByIdProgramma(@Param(value = "idProgramma") Long idProgramma);
	
	@Query(value = " "
			+ " SELECT * "
			+ " FROM "
			+ " referente_delegati_gestore_programma "
			+ " WHERE 1=1 "
			+ " AND "
			+ " ID_PROGRAMMA != :idProgramma "
			+ " AND "
			+ " CODICE_RUOLO = :codiceRuolo "
			+ " AND "
			+ " CF_UTENTE = :codiceFiscaleUtente",
			nativeQuery = true)
	List<ReferentiDelegatiEnteGestoreProgrammaEntity> findAltreAssociazioni(Long idProgramma,
			String codiceFiscaleUtente, String codiceRuolo);

	@Query(value ="SELECT * "
			+ "FROM referente_delegati_gestore_programma rdg "
			+ "WHERE rdg.ID_PROGRAMMA = :idProgramma "
			+ "		AND rdg.STATO_UTENTE != 'TERMINATO' ", 
			nativeQuery = true)
	List<ReferentiDelegatiEnteGestoreProgrammaEntity> findReferentiEDelegatiProgramma(@Param(value = "idProgramma") Long idProgramma);
}