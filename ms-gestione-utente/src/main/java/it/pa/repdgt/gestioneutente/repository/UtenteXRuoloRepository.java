package it.pa.repdgt.gestioneutente.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import it.pa.repdgt.shared.entity.UtenteXRuolo;
import it.pa.repdgt.shared.entity.key.UtenteXRuoloKey;

@Repository
public interface UtenteXRuoloRepository extends JpaRepository<UtenteXRuolo, UtenteXRuoloKey> {

	@Query(value = "SELECT uxr.CANCELLATO "
			+ " FROM "
			+ " utente_x_ruolo uxr "
			+ " WHERE 1=1 "
			+ " AND "
			+ " RUOLO_CODICE = :codiceRuolo "
			+ " AND "
			+ " UTENTE_ID = :codiceFiscaleUtente",
			nativeQuery = true)
	public String isUtenteXRuoloCancellato(@Param(value = "codiceFiscaleUtente")String codiceFiscaleUtente, 
			@Param(value = "codiceRuolo")String codiceRuolo);

	@Query(value = "SELECT * "
			+ "FROM utente_x_ruolo uxr "
			+ "WHERE uxr.UTENTE_ID = :codFiscaleUtente "
			+ "		AND uxr.RUOLO_CODICE = :codiceRuolo ", 
			nativeQuery = true)
	public UtenteXRuolo findUtenteXRuoloByCfUtenteAndCodiceRuolo(@Param(value = "codFiscaleUtente")String codFiscaleUtente, 
			@Param(value = "codiceRuolo")String codiceRuolo);
	
	@Query(value = "SELECT * "
			+ "FROM utente_x_ruolo uxr "
			+ "WHERE uxr.UTENTE_ID = :codFiscaleUtente ",
			nativeQuery = true)
	public List<UtenteXRuolo> findListUtenteXRuoloByCfUtenteAndCodiceRuolo(@Param(value = "codFiscaleUtente")String codFiscaleUtente);

	@Query(value = "SELECT COUNT(*) "
			+ "FROM utente_x_ruolo uxr "
			+ "WHERE uxr.UTENTE_ID = :cfUtente ", 
			nativeQuery = true)
	public int countRuoliByCfUtente(@Param(value = "cfUtente")String cfUtente);
	
}
