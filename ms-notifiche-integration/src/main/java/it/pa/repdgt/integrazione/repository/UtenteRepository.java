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
}