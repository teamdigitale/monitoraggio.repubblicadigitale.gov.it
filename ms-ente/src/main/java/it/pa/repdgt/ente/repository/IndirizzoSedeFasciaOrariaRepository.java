package it.pa.repdgt.ente.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import it.pa.repdgt.ente.entity.projection.FasciaOrariaAperturaIndirizzoSedeProjection;
import it.pa.repdgt.shared.entity.IndirizzoSedeFasciaOrariaEntity;

@Repository
public interface IndirizzoSedeFasciaOrariaRepository extends JpaRepository<IndirizzoSedeFasciaOrariaEntity, Long> {
	@Query(value = ""
				 + " SELECT "
				 + "     ind_sede_fasce_orarie.ID  as id "
				 + "    ,ind_sede_fasce_orarie.INDIRIZZO_SEDE_ID  as idIndirizzoSede "
				 + "    ,ind_sede_fasce_orarie.GIORNO_APERTURA    as giornoAperturaSede "
				 + "	,ind_sede_fasce_orarie.ORARIO_APERTURA    as orarioAperturaSede "
				 + "    ,ind_sede_fasce_orarie.ORARIO_CHIUSURA    as orarioChiusuraSede "
				 + " FROM "
				 + "	indirizzo_sede_fascia_oraria ind_sede_fasce_orarie"
				 + " WHERE 1=1 "
				 + "	AND ind_sede_fasce_orarie.INDIRIZZO_SEDE_ID = :idIndirizzoSede", 
		   nativeQuery = true)
	List<FasciaOrariaAperturaIndirizzoSedeProjection> findFasceOrarieByIdIndirizzoSede(@Param(value = "idIndirizzoSede") Long idIndirizzoSede); 
}