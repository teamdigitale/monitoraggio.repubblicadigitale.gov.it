package it.pa.repdgt.programmaprogetto.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import it.pa.repdgt.shared.entity.UtenteEntity;

public interface UtenteRepository extends JpaRepository<UtenteEntity, String> {

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
	
	public Optional<UtenteEntity> findByCodiceFiscale(String codiceFiscale);
}
