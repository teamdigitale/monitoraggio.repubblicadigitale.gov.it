package it.pa.repdgt.opendata.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import it.pa.repdgt.opendata.projection.OpenDataCittadinoProjection;
import it.pa.repdgt.shared.entity.CittadinoEntity;

@Repository
public interface CittadinoRepository extends JpaRepository<CittadinoEntity, Long> {

	@Query(value = " "
				+  " SELECT "
				+  "	     cit.GENERE as genere                   " 
				+  " 		,cit.TITOLO_DI_STUDIO as titoloDiStudio "
				+  " 		,cit.ANNO_DI_NASCITA as annoDiNascita   "
				+  " 		,cit.OCCUPAZIONE as occupazione         "
				+  " 		,prog.POLICY as policy                  "
				+  " 		,ser.ID as servizioId                           "
				+  " 		,ser.NOME as nome                       "
				+  " 		,ser.TIPOLOGIA_SERVIZIO as tipologiaServizio "
				+  " 		,ser.ID_TEMPLATE_Q3_COMPILATO as idTemplateQ3Compilato "
				+  " 		,sed.ID as sedeId     "
				+  " 		,sed.NOME as nomeSede "
				+  " 		,sed.COMUNE as comuneSede       "
				+  " 		,sed.PROVINCIA as provinciaSede "
				+  " 		,sed.REGIONE as regioneSede     "
				+  " 		,sed.CAP as capSede             "
				+  " FROM    "
				+  "	cittadino cit "
				+  "	INNER JOIN servizio_x_cittadino sxc "
				+  "	ON cit.ID = sxc.ID_CITTADINO        "
				+  "	INNER JOIN servizio ser             "
				+  "	ON ser.ID = sxc.ID_SERVIZIO         "
				+  "	INNER JOIN sede sed                 "
				+  "	ON sed.ID = ser.ID_SEDE             "
				+  "   	INNER JOIN progetto proget          "
				+  "	ON proget.ID = ser.ID_PROGETTO      "
				+  "    INNER JOIN programma prog           "
				+  " 	ON prog.ID = proget.ID_PROGRAMMA   "
		   ,nativeQuery = true)
	List<OpenDataCittadinoProjection> findAllCittadinoServizioSede(); 
}