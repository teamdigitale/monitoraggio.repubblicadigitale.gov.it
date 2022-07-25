package it.pa.repdgt.opendata.repository;

import java.util.Date;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import it.pa.repdgt.opendata.projection.OpenDataCittadinoProjection;
import it.pa.repdgt.shared.entity.CittadinoEntity;

@Repository
public interface CittadinoRepository extends JpaRepository<CittadinoEntity, Long> {

	@Query(value = " "
				+  " SELECT DISTINCT"
				+  "	     cit.GENERE as genere                   " 
				+  " 		,cit.TITOLO_DI_STUDIO as titoloDiStudio "
				+  " 		,cit.ANNO_DI_NASCITA as annoDiNascita   "
				+  " 		,cit.OCCUPAZIONE as occupazione         "
				+  " 		,prog.POLICY as policy                  "
				+  " 		,ser.ID as servizioId                   "
				+  " 		,ser.NOME as nome                       "
				+  " 		,ser.TIPOLOGIA_SERVIZIO as tipologiaServizio           "
				+  " 		,ser.ID_TEMPLATE_Q3_COMPILATO as idTemplateQ3Compilato "
				+  " 		,sed.ID as sedeId               "
				+  " 		,sed.NOME as nomeSede           "
				+  " 		,sed.COMUNE as comuneSede       "
				+  " 		,sed.PROVINCIA as provinciaSede "
				+  " 		,sed.REGIONE as regioneSede     "
				+  " 		,sed.CAP as capSede             "
				+  " 		,prog.codice as idProgramma     "
				+  " 		,proget.id as idProgetto        "
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
	
	@Transactional
	@Modifying
	@Query(value = "UPDATE count_download_file"
			+ "     set count = count + 1,"
			+ "		last_download = :currentDate "
			+ "     where nome_file = :nomeFile"
	   ,nativeQuery = true)
	void updateCountDownload(@Param(value = "nomeFile")String nomeFile,
			@Param(value = "currentDate")Date currentDate);
	
	@Query(value = "SELECT count"
			+ "     FROM count_download_file"
			+ "     where nome_file = :nomeFile"
			,nativeQuery = true)
	Long getCountDownload(@Param(value = "nomeFile")String nomeFile); 
}