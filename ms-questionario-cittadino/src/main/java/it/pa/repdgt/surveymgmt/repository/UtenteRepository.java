package it.pa.repdgt.surveymgmt.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import it.pa.repdgt.shared.entity.UtenteEntity;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface UtenteRepository extends JpaRepository<UtenteEntity, String> {

	@Query(value = ""
			+ " SELECT * "
			+ " FROM utente u "
			+ " WHERE 1=1 "
			+ " 	AND u.CODICE_FISCALE = :idFacilitatore "
			+ " 	OR ( UPPER(u.NOME) LIKE CONCAT('%', :nome, '%') "
			+ " 	AND UPPER(u.COGNOME) LIKE CONCAT('%', :cognome, '%') )", nativeQuery = true)
	Optional<UtenteEntity> findByCodiceFiscaleIgnoreCaseOrNomeIgnoreCaseAndCognomeIgnoreCase(
			@Param("idFacilitatore") String idFacilitatore,
			@Param("nome") String nome,
			@Param("cognome") String cognome);

	List<UtenteEntity> findByNomeAndCognome(String nome, String cognome);

	@Query(value = ""
			+ " SELECT * "
			+ " FROM utente u "
			+ " WHERE REPLACE(CONCAT(u.COGNOME, u.NOME), ' ', '') = :csvNominativoFacilitatore", nativeQuery = true)
	List<UtenteEntity> findByNominativoFacilitatore(@Param("csvNominativoFacilitatore") String csvNominativoFacilitatore);

	Optional<UtenteEntity> findByCodiceFiscale(String codiceFiscale);
}