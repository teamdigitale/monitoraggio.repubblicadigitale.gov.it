package it.pa.repdgt.ente.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import it.pa.repdgt.shared.entity.UtenteEntity;

@Repository
public interface UtenteRepository extends JpaRepository<UtenteEntity, Long> {

	public Optional<UtenteEntity> findByCodiceFiscale(String codiceFiscale);
	
	@Query(value ="SELECT COUNT(*) "
			+ "FROM ente_sede_progetto_facilitatore espf "
			+ "WHERE espf.ID_PROGETTO = :idProgetto "
			+ "		AND espf.ID_SEDE = :idSede "
			+ "		AND espf.ID_ENTE = :idEnte ",
			nativeQuery = true)
	public int countFacilitatoriPerSedeProgettoEnte(
			@Param(value = "idProgetto") Long idProgetto,
			@Param(value = "idSede") Long idSede,
			@Param(value = "idEnte") Long idEnte
	);
	
	@Query(value = "SELECT CONCAT(utente.COGNOME,' ', utente.NOME) "
			+ "FROM utente utente "
			+ "	INNER JOIN referente_delegati_gestore_programma rdg "
			+ "		ON utente.CODICE_FISCALE = rdg.CF_UTENTE "
			+ "	INNER JOIN programma programma "
			+ "		ON rdg.ID_PROGRAMMA = programma.ID "
			+ "WHERE programma.ID = :idProgramma "
			+ "		AND rdg.CODICE_RUOLO = 'REG' ",
			nativeQuery = true)
	public List<String> findReferentiProgrammaById(@Param(value = "idProgramma") Long id);
	
	@Query(value = "SELECT CONCAT(utente.COGNOME,' ', utente.NOME) "
			+ "FROM utente utente "
			+ "	INNER JOIN referente_delegati_gestore_progetto rdgp "
			+ "		ON utente.CODICE_FISCALE = rdgp.CF_UTENTE "
			+ "	INNER JOIN progetto progetto "
			+ "		ON rdgp.ID_PROGETTO = progetto.ID "
			+ "WHERE progetto.ID = :idProgetto "
			+ "		AND rdgp.CODICE_RUOLO = 'REGP'",
			nativeQuery = true)
	public List<String> findReferentiProgettoById(@Param(value = "idProgetto") Long id);
	
	@Query(value = "SELECT DISTINCT CONCAT(utente.COGNOME,' ', utente.NOME) "
			+ "FROM utente utente "
			+ "	INNER JOIN referente_delegati_partner rdp "
			+ "		ON utente.CODICE_FISCALE = rdp.CF_UTENTE "
			+ "	INNER JOIN ente_partner ep "
			+ "		ON rdp.ID_PROGETTO = ep.ID_PROGETTO "
			+ "WHERE ep.ID_PROGETTO = :idProgetto "
			+ "		AND rdp.ID_ENTE = :idEnte "
			+ "		AND rdp.CODICE_RUOLO = 'REPP' ",
			nativeQuery = true)
	public List<String> findReferentiEntePartnerProgettoById(
			@Param(value = "idProgetto") Long idProgetto,
			@Param(value = "idEnte") Long idEnte);
}