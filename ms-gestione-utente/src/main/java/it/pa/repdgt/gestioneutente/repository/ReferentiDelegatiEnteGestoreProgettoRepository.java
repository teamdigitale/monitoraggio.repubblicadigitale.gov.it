package it.pa.repdgt.gestioneutente.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import it.pa.repdgt.gestioneutente.entity.projection.ReferenteDelegatoEnteGestoreProgettoProjection;
import it.pa.repdgt.shared.entity.ReferentiDelegatiEnteGestoreProgettoEntity;
import it.pa.repdgt.shared.entity.ReferentiDelegatiEnteGestoreProgrammaEntity;
import it.pa.repdgt.shared.entity.key.ReferentiDelegatiEnteGestoreProgettoKey;

@Repository
public interface ReferentiDelegatiEnteGestoreProgettoRepository extends JpaRepository<ReferentiDelegatiEnteGestoreProgettoEntity, ReferentiDelegatiEnteGestoreProgettoKey> {
	
	@Query(value = " "
			+ " SELECT         				       "
			+ "		u.email as email,"
			+ "     u.nome as nome,"
			+ "     rdgp.CODICE_RUOLO as codiceRuolo              "
			+ "		rdgp.id_progetto as idProgetto "
			+ "  FROM                              "
			+ "		referente_delegati_gestore_progetto rdgp "
			+ "     INNER JOIN utente u                      "
			+ "		ON u.CODICE_FISCALE = rdgp.CF_UTENTE     "
			+ " WHERE 1=1 "
			+ "		AND rdgp.ID_PROGETTO IN ( :idsProgetto ) ", 
			nativeQuery = true)
	List<ReferenteDelegatoEnteGestoreProgettoProjection> findEmailReferentiDelegatiEnteGestoreByIdsProgetti(
			@Param(value = "idsProgetto") List<Long> idsProgetto
		);
	
	@Query(value = "SELECT stato_utente "
			+ "FROM referente_delegati_gestore_progetto rdg "
			+ "WHERE rdg.CF_UTENTE = :cfUtente "
			+ "AND rdg.id_progetto = :idProgetto "
			+ "AND rdg.codice_ruolo = :codiceRuolo", 
			nativeQuery = true)
	public List<String> findStatoByCfUtente(
			String cfUtente, 
			Long idProgetto, 
			String codiceRuolo);
	
	@Query(value = "select count(*) "
			+ "FROM referente_delegati_gestore_progetto rdg "
			+ "INNER JOIN progetto p "
			+ "ON rdg.id_progetto = p.id "
			+ "AND rdg.id_ente = p.id_ente_gestore_progetto "
			+ "WHERE rdg.CF_UTENTE = :cfUtente "
			+ "AND rdg.codice_ruolo = :codiceRuolo", 
			nativeQuery = true)
	public Integer countByCfUtenteAndCodiceRuolo(
			String cfUtente, 
			String codiceRuolo);
	
	@Query(value = "select * "
			+ "FROM referente_delegati_gestore_progetto rdg "
			+ "WHERE rdg.CF_UTENTE = :cfUtente ", 
			nativeQuery = true)
	public List<ReferentiDelegatiEnteGestoreProgettoEntity> findByCodFiscaleUtente(String cfUtente);
}