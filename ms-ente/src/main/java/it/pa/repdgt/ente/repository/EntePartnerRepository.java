package it.pa.repdgt.ente.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import it.pa.repdgt.ente.entity.projection.EnteProjection;
import it.pa.repdgt.shared.entity.EntePartnerEntity;

@Repository
public interface EntePartnerRepository extends JpaRepository<EntePartnerEntity, Long> { 
	
	@Query(value = "SELECT ID_ENTE "
			+ "FROM ente_partner ep "
			+ "INNER JOIN progetto p "
			+ "ON ep.ID_PROGETTO = p.ID "
			+ "WHERE "
			+ "   p.ID = :idProgetto", nativeQuery = true)
	public List<Long> findEntiPartnerByProgetto(
			@Param(value = "idProgetto") Long idProgetto);
	
	@Query(value = " SELECT "
			 + " 	 ente.ID as id "
			 + "	,ente.NOME as nome "
			 + "	,ente.NOME_BREVE as nomeBreve "
			 + "	,ente.PARTITA_IVA as partitaIva"
			 + "	,ente.TIPOLOGIA as tipologia "
			 + "	,ente.SEDE_LEGALE as sedeLegale "
			 + "	,ente.INDIRIZZO_PEC as indirizzoPec "
			 + "	,'Ente Partner' as profilo "
			 + " FROM "
			 + "	ente ente "
			 + "	INNER JOIN ente_partner ep "
			 + "	ON ep.ID_ENTE = ente.ID"
			 + " WHERE "
			 + " ep.ID_PROGETTO = :idProgetto"
			 + " AND "
			 + " ep.ID_ENTE = :idEnte", 
	  nativeQuery = true)
	public EnteProjection findEntePartnerByIdProgettoAndIdEnte(
			@Param("idProgetto") Long idProgetto,
			@Param("idEnte") Long idEnte);

	@Query(value = "SELECT * "
			+ "FROM ente_partner ep "
			+ "WHERE ep.ID_ENTE = :idEnte "
			+ "		AND ep.ID_PROGETTO = :idProgetto ", 
			nativeQuery = true)
	public EntePartnerEntity findEntePartnerByIdEnteAndIdProgetto(
			@Param("idEnte") Long idEnte,
			@Param("idProgetto") Long idProgetto);
}