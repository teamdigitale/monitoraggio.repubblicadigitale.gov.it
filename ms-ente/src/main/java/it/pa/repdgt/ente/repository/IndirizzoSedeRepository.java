package it.pa.repdgt.ente.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import it.pa.repdgt.ente.entity.projection.IndirizzoSedeProjection;
import it.pa.repdgt.shared.entity.IndirizzoSedeEntity;

@Repository
public interface IndirizzoSedeRepository extends JpaRepository<IndirizzoSedeEntity, Long> {
	@Query(value = ""
				 + " SELECT "
				 + "	 ind_sede.ID   		as id "
				 + "	,ind_sede.SEDE_ID   as sedeId "
				 + "	,ind_sede.VIA 		as via "
				 + "	,ind_sede.CIVICO 	as civico "
				 + "	,ind_sede.COMUNE 	as comune "
				 + "	,ind_sede.PROVINCIA as provincia "
				 + "	,ind_sede.REGIONE   as regione "
				 + "	,ind_sede.CAP 		as cap "
				 + "	,ind_sede.NAZIONE 	as nazione"
				 + " FROM "
				 + "	indirizzo_sede ind_sede"
				 + " WHERE 1=1 "
				 + "	AND ind_sede.SEDE_ID = :idSede", 
		   nativeQuery = true)
	List<IndirizzoSedeProjection> findIndirizzoSedeByIdSede(@Param(value = "idSede") Long idSede); 
}