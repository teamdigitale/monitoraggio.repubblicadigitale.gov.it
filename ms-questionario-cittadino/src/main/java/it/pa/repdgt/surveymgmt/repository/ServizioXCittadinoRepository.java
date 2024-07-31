package it.pa.repdgt.surveymgmt.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import it.pa.repdgt.shared.entity.ServizioXCittadinoEntity;

@Repository
public interface ServizioXCittadinoRepository extends JpaRepository<ServizioXCittadinoEntity, String> {

	@Query(value = " "
			+ " SELECT "
			+ "	COUNT(*)"
			+ " FROM "
			+ "	servizio_x_cittadino sxc "
			+ " WHERE 1=1 "
			+ "	AND sxc.ID_SERVIZIO  = :idServizio  "
			+ " 	AND sxc.ID_CITTADINO = :idCittadino "
			+ " ", nativeQuery = true)
	int findCittadinoByIdServizioAndIdCittadino(
			@Param(value = "idServizio") Long idServizio,
			@Param(value = "idCittadino") Long idCittadino);

	@Query(value = " " +
			" SELECT \n" + 
			" COUNT(*)\n" + 
			" FROM \n" + 
			" servizio_x_cittadino sxc \n" + 
			" JOIN cittadino c ON c.id = sxc.id_cittadino\n" + 
			" WHERE 1=1\n" + 
			" AND sxc.ID_SERVIZIO  = :idServizio  \n" + 
			" AND c.codice_fiscale = :codiceFiscale \n"
			+ " ", nativeQuery = true)
	int findCittadinoByIdServizioAndCodiceFiscale(
			@Param(value = "idServizio") Long idServizio,
			@Param(value = "codiceFiscale") String codiceFiscale);

	@Query(value = " "
			+ " SELECT "
			+ "	* "
			+ " FROM "
			+ "	servizio_x_cittadino sxc "
			+ " WHERE 1=1 "
			+ "	AND sxc.ID_SERVIZIO  = :idServizio  "
			+ " AND sxc.ID_CITTADINO = :idCittadino "
			+ " ORDER BY sxc.data_ora_creazione asc "
			+ " ", nativeQuery = true)
	List<ServizioXCittadinoEntity> findListCittadinoByIdServizioAndIdCittadino(
			@Param(value = "idServizio") Long idServizio,
			@Param(value = "idCittadino") Long idCittadino);

	@Modifying
	@Query(value = " "
			+ " DELETE FROM "
			+ "    servizio_x_cittadino "
			+ " WHERE "
			+ "    ID_SERVIZIO  = :idServizio "
			+ "    AND ID_CITTADINO = :idCittadino ", nativeQuery = true)
	void deleteRelazioneByIdServizioAndIdCittadino(
			@Param(value = "idServizio") Long idServizio,
			@Param(value = "idCittadino") Long idCittadino);

	@Query(value = "SELECT sxc FROM ServizioXCittadinoEntity sxc WHERE sxc.id.idServizio = :idServizio")
	List<ServizioXCittadinoEntity> findByIdServizioJPA(@Param("idServizio") Long idServizio);

	@Modifying
	@Query(value = "DELETE FROM ServizioXCittadinoEntity sxc WHERE sxc.id.idServizio = :idServizio")
	void deleteByIdServizioJPA(@Param("idServizio") Long idServizio);
}