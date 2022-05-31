package it.pa.repdgt.ente.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import it.pa.repdgt.shared.entity.ProgettoEntity;
import it.pa.repdgt.shared.entity.light.ProgettoLightEntity;

@Repository
public interface ProgettoRepository extends JpaRepository<ProgettoEntity, Long> {
	
	@Query(value = "SELECT p "
				 + "FROM ProgettoLightEntity p "
				 + "WHERE p.id = :theId")
	public Optional<ProgettoLightEntity> findProgettoLightById(@Param(value="theId") Long id);
	
	
	@Query(value = "SELECT *"
				+ " FROM "
				+ "		progetto progetto"
				+ " INNER JOIN programma programma "
				+ "		ON programma.ID = progetto.ID_PROGRAMMA"
				+ " WHERE 	1=1"
				+ " 	AND	 ( :nomeProgetto IS NULL  			OR   progetto.NOME LIKE %:nomeProgetto% )"
				+ " 	AND  ( COALESCE(:policies) IS NULL  	OR  programma.POLICY IN (:policies) )"
				+ " 	AND  ( COALESCE(:stati) IS NULL  		OR  programma.STATO IN (:stati) )"
				+ " 	AND  ( COALESCE(:idsProgrammi) IS NULL  OR  progetto.ID_PROGRAMMA IN (:idsProgrammi) )", 
			nativeQuery = true)
	public List<ProgettoEntity> findByFilter(
			@Param(value = "nomeProgetto") String nomeProgetto, 
			@Param(value = "policies") List<String> policy,
			@Param(value = "stati")  List<String> stati,
			@Param(value = "idsProgrammi") List<String> idsProgrammi
		);
	
	@Query(value = "SELECT * "
				 + "FROM progetto p "
				 + "WHERE p.STATO != 'NON ATTIVO'", 
		   nativeQuery = true)
	public List<ProgettoEntity> findAll();

	@Query(value = "SELECT progetto.ID "
			+ "FROM progetto progetto "
			+ "WHERE progetto.ID_ENTE_GESTORE_PROGETTO = :idEnte ", 
			nativeQuery = true)
	public List<Long> findIdProgettiByIdEnte(@Param(value ="idEnte") Long idEnte);

	@Query(value = "SELECT utente.NOME, utente.COGNOME "
			+ "FROM UTENTE utente "
			+ "	INNER JOIN referente_delegati_gestore_progetto rdgp "
			+ "		ON utente.CODICE_FISCALE = rdgp.CF_UTENTE "
			+ "	INNER JOIN PROGETTO progetto "
			+ "		ON rdgp.ID_PROGETTO = progetto.ID "
			+ "WHERE progetto.ID = :idProgetto "
			+ "		AND rdgp.CODICE_RUOLO = 'REGP'",
			nativeQuery = true)
	public List<String> findReferentiProgettoById(@Param(value = "idProgetto") Long id);
	

	@Query(value = "SELECT progetto.ID "
			+ "FROM ente_partner ep "
			+ "	INNER JOIN progetto progetto "
			+ "		ON ep.ID_PROGETTO = progetto.ID "
			+ "WHERE ep.ID_ENTE = :idEnte ",
			nativeQuery = true)
	public List<Long> findIdProgettiEntePartnerByIdEnte(@Param(value = "idEnte") Long idEnte);

	@Query(value = "SELECT COUNT(*) "
			+ "FROM progetto progetto "
			+ "WHERE progetto.ID_ENTE_GESTORE_PROGETTO = :idEnte", 
			nativeQuery = true)
	public int countProgettiEnte(@Param(value = "idEnte") Long idEnte);

	@Query(value = "SELECT COUNT(*) "
			+ "FROM ente_partner ep "
			+ "WHERE ep.ID_ENTE = :idEnte", 
			nativeQuery = true)
	public int countProgettiEntePartner(@Param(value = "idEnte") Long idEnte);

	@Query(value = "SELECT * "
			+ "FROM progetto progetto "
			+ "WHERE progetto.ID_ENTE_GESTORE_PROGETTO = :idEnte ",
			nativeQuery = true)
	public List<ProgettoEntity> getProgettiByIdEnte(@Param(value = "idEnte") Long idEnte);
}