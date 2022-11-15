package it.pa.repdgt.integrazione.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import it.pa.repdgt.shared.entity.UtenteEntity;

@Repository
public interface UtenteRepository extends JpaRepository<UtenteEntity, Long> {
	
	@Query(value = "SELECT u.* "
			 + " FROM progetto pr"
			 + " JOIN programma p "
			 + " ON pr.id_programma = p.id"
			 + " JOIN referente_delegati_gestore_programma rdgp"
			 + " ON p.id = rdgp.id_programma"
			 + " AND p.id_ente_gestore_programma = rdgp.id_ente"
			 + " JOIN utente u"
			 + " ON rdgp.cf_utente = u.codice_fiscale"
			 + " WHERE 1=1"
			 + "	AND pr.id = :idProgetto",
	   nativeQuery = true)
	List<UtenteEntity> getUtentiReferentiDelegatiEnteGestoreProgrammaByIdProgetto(@Param(value = "idProgetto") Long idProgramma);
	
	@Query(value = "SELECT * "
			 + " FROM utente u"
			 + " JOIN utente_x_ruolo uxr "
			 + " ON u.codice_fiscale = uxr.utente_id"
			 + " WHERE 1=1"
			 + "	AND uxr.ruolo_codice = 'DTD'",
	   nativeQuery = true)
	List<UtenteEntity> getUtentiDTD();

	
	@Query(value = "SELECT * "
			 + " FROM utente u"
			 + " WHERE 1=1"
			 + "	AND u.CODICE_FISCALE = :codiceFiscale",
			 nativeQuery = true)
	Optional<UtenteEntity> findByCodiceFiscale(
			@Param(value = "codiceFiscale") String codiceFiscale
		);
	
	@Query(value = ""
			+ "			 		SELECT * "
			+ "			      	FROM ( "
			+ "			             SELECT distinct programma.id "
			+ "			                  FROM referente_delegati_gestore_programma  rdg "
			+ "			                  	INNER JOIN programma programma"
			+ "			                      	ON rdg.ID_PROGRAMMA = programma.ID"
			+ "			                          AND rdg.id_ente = programma.id_ente_gestore_programma"
			+ "			                  WHERE rdg.CF_UTENTE = :codiceFiscale"
			+ "			                UNION  "
			+ "			  "
			+ "			              SELECT distinct programma.id "
			+ "			                  FROM referente_delegati_gestore_progetto rdgp"
			+ "			                  INNER JOIN progetto progetto"
			+ "			                      ON rdgp.ID_PROGETTO = progetto.ID "
			+ "			                      AND rdgp.id_ente = progetto.id_ente_gestore_progetto"
			+ "			                  INNER JOIN programma programma"
			+ "			                  	ON progetto.ID_PROGRAMMA = programma.ID"
			+ "			                  WHERE rdgp.CF_UTENTE = :codiceFiscale"
			+ "			  "
			+ "			                UNION  "
			+ "			  "
			+ "			              SELECT distinct progetto.id_programma"
			+ "			                  FROM referente_delegati_partner rdp"
			+ "			                  INNER JOIN ente_partner ep"
			+ "			                      ON rdp.ID_PROGETTO = ep.ID_PROGETTO"
			+ "			                  INNER JOIN progetto progetto"
			+ "			                      ON ep.ID_PROGETTO = progetto.ID"
			+ "			                  INNER JOIN programma programma"
			+ "			                      ON progetto.ID_PROGRAMMA = programma.ID"
			+ "                              where rdp.CF_UTENTE = :codiceFiscale"
			+ "			  "
			+ "			               UNION "
			+ "			  "
			+ "			               SELECT distinct p.id_programma"
			+ "							FROM ente_sede_progetto_facilitatore espf"
			+ "							INNER JOIN progetto p "
			+ "							ON espf.ID_PROGETTO = p.ID "
			+ "							AND espf.id_ente = p.id_ente_gestore_progetto"
			+ "			               WHERE espf.ID_FACILITATORE = :codiceFiscale"
			+ "			 "
			+ "			               UNION "
			+ "			 "
			+ "			               SELECT distinct p.id_programma"
			+ "			                  FROM ente_sede_progetto_facilitatore espf"
			+ "			                  INNER JOIN ente_partner ep "
			+ "			                  ON espf.ID_PROGETTO = ep.id_progetto "
			+ "			                  AND espf.id_ente = ep.id_ente"
			+ "                              INNER JOIN progetto p "
			+ "			                  ON ep.ID_PROGETTO = p.ID "
			+ "			               WHERE espf.ID_FACILITATORE = :codiceFiscale"
			+ "			 			) AS programmi_utente  ",
			nativeQuery = true)
	List<Long> getListaProgrammiUtente(
			@Param(value = "codiceFiscale") String codiceFiscale
			);
}