package it.pa.repdgt.shared.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import it.pa.repdgt.shared.entity.PermessoEntity;

@Repository(value = "permessoRepositoryFiltro")
public interface PermessoRepository extends JpaRepository<PermessoEntity, Long>{

	@Query(value = " SELECT "
				 + "	 p.codice "
				 + " FROM "
				 + "	utente_x_ruolo uxr  "
				 + "	inner join ruolo_x_gruppo rxg "
				 + "	on uxr.ruolo_codice = rxg.ruolo_codice "
				 + "	inner join gruppo_x_permesso gxp "
				 + "	on rxg.gruppo_codice = gxp.gruppo_codice "
				 + "	inner join permesso p "
				 + "	on  p.id = gxp.permesso_id "
				 + " WHERE 1=1 "
				 + "   AND uxr.UTENTE_ID = :codiceFiscale "
				 + "   AND uxr.RUOLO_CODICE = :codiceRuolo",
			nativeQuery = true)
	List<String> findCodiciPermessoByCodiceFiscaleUtenteAndCodiceRuoloUtente(
			@Param(value = "codiceFiscale") String codiceFiscale,
			@Param(value = "codiceRuolo") String codiceRuolo
		);
}