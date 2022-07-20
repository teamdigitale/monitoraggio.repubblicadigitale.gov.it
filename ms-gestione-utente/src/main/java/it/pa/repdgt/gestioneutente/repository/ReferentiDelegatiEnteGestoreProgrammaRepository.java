package it.pa.repdgt.gestioneutente.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import it.pa.repdgt.shared.entity.ReferentiDelegatiEnteGestoreProgrammaEntity;
import it.pa.repdgt.shared.entity.key.ReferentiDelegatiEnteGestoreProgrammaKey;

@Repository
public interface ReferentiDelegatiEnteGestoreProgrammaRepository extends JpaRepository<ReferentiDelegatiEnteGestoreProgrammaEntity, ReferentiDelegatiEnteGestoreProgrammaKey> {
	
	@Query(value = "SELECT stato_utente "
			+ "FROM referente_delegati_gestore_programma rdg "
			+ "WHERE rdg.CF_UTENTE = :cfUtente "
			+ "AND rdg.id_programma = :idProgramma "
			+ "AND rdg.codice_ruolo = :codiceRuolo", 
			nativeQuery = true)
	public List<String> findStatoByCfUtente(
			String cfUtente, 
			Long idProgramma, 
			String codiceRuolo);
}