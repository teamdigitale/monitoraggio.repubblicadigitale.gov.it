package it.pa.repdgt.programmaprogetto.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import it.pa.repdgt.shared.entity.ReferentiDelegatiEnteGestoreProgettoEntity;
import it.pa.repdgt.shared.entity.key.ReferentiDelegatiEnteGestoreProgettoKey;

@Repository
public interface ReferentiDelegatiEnteGestoreProgettoRepository extends JpaRepository<ReferentiDelegatiEnteGestoreProgettoEntity, ReferentiDelegatiEnteGestoreProgettoKey> {
	
	@Query(value = ""
			 + " SELECT * "
			 + " FROM "
			 + "	referente_delegati_gestore_progetto "
			 + " WHERE 1=1"
			 + "	AND ID_PROGETTO = :idProgetto",
	   nativeQuery = true)
	List<ReferentiDelegatiEnteGestoreProgettoEntity> getReferentiDelegatiEnteGestoreProgettoByIdProgetto(@Param(value = "idProgetto") Long idProgetto);
	
	@Query(value = " "
			+ " SELECT * "
			+ " FROM "
			+ " referente_delegati_gestore_progetto "
			+ " WHERE 1=1 "
			+ " AND "
			+ " ID_PROGETTO != :idProgetto "
			+ " AND "
			+ " CODICE_RUOLO = :codiceRuolo "
			+ " AND "
			+ " CF_UTENTE = :codiceFiscaleUtente",
			nativeQuery = true)
	List<ReferentiDelegatiEnteGestoreProgettoEntity> findAltreAssociazioni(Long idProgetto,
			String codiceFiscaleUtente, String codiceRuolo);

	@Query(value = "SELECT * "
			+ "FROM referente_delegati_gestore_progetto rdgp "
			+ "WHERE rdgp.ID_PROGETTO = :idProgetto "
			+ "		AND rdgp.STATO_UTENTE != 'TERMINATO' ", 
			nativeQuery = true)
	List<ReferentiDelegatiEnteGestoreProgettoEntity> findReferentiEDelegatiProgetto(@Param(value = "idProgetto") Long idProgetto);
}