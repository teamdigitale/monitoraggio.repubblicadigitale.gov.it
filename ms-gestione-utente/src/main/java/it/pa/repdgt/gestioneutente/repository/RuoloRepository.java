package it.pa.repdgt.gestioneutente.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import it.pa.repdgt.shared.entity.RuoloEntity;

@Repository
public interface RuoloRepository extends JpaRepository<RuoloEntity, String> {

	List<RuoloEntity> findByNomeContaining(String nome);

	List<RuoloEntity> findByNomeAndCodiceNot(String nome, String codice);

	Optional<RuoloEntity> findByCodice(String codiceRuolo);
	
	@Query(value = " SELECT "
				 + "	uxr.RUOLO_CODICE "
				 + " FROM "
				 + "	utente_x_ruolo uxr "
				 + " WHERE 1=1 "
				 + "   AND uxr.UTENTE_ID = :codiceFiscale",
			nativeQuery = true)
	List<String> findRuoloByCodiceFiscaleUtente(@Param(value = "codiceFiscale") String codiceFiscale);

	@Query(value = "SELECT "
				 + "	ruolo "
				 + " FROM "
				 + "	RuoloEntity ruolo"
				 + " WHERE "
				 + "	ruolo.predefinito = true")
	List<RuoloEntity> findAllRuoliPredefiniti();
	
	@Query(value = "SELECT "
				 + "	ruolo "
				 + " FROM "
				 + "	RuoloEntity ruolo"
				 + " WHERE "
				 + "	ruolo.predefinito = false")
	List<RuoloEntity> findAllRuoliNonPredefiniti();

	@Query(value = "SELECT * "
			+ "FROM ruolo ruolo "
			+ "	INNER JOIN utente_x_ruolo uxr "
			+ "		ON uxr.RUOLO_CODICE = ruolo.CODICE "
			+ "WHERE uxr.UTENTE_ID = :cfUtente ",
			nativeQuery = true)
	List<RuoloEntity> findRuoloCompletoByCodiceFiscaleUtente(@Param(value = "cfUtente") String cfUtente);

	@Query(value = "SELECT COUNT(*) "
			+ "FROM utente_x_ruolo uxr "
			+ "WHERE uxr.RUOLO_CODICE = :codiceRuolo ", 
			nativeQuery = true)
	int countUtentiPerRuolo(@Param(value = "codiceRuolo") String codiceRuolo);

	@Query(value = "SELECT * "
			+ "	FROM ruolo r "
			+ "	WHERE r.codice = UPPER ( :nomeRuolo ) "
			+ "		OR r.nome = UPPER ( :nomeRuolo ) ", 
			nativeQuery = true)
	Optional<RuoloEntity> findByNomeOrCodice(@Param(value = "nomeRuolo") String nomeRuolo);
}