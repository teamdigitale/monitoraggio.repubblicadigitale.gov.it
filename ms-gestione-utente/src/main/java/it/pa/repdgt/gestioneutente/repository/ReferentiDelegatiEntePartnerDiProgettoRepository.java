package it.pa.repdgt.gestioneutente.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import it.pa.repdgt.shared.entity.ReferentiDelegatiEnteGestoreProgettoEntity;
import it.pa.repdgt.shared.entity.ReferentiDelegatiEntePartnerDiProgettoEntity;
import it.pa.repdgt.shared.entity.key.ReferentiDelegatiEntePartnerDiProgettoKey;

@Repository
public interface ReferentiDelegatiEntePartnerDiProgettoRepository extends JpaRepository<ReferentiDelegatiEntePartnerDiProgettoEntity, ReferentiDelegatiEntePartnerDiProgettoKey> {
	@Query(value = "SELECT stato_utente "
			+ "FROM referente_delegati_partner rdg "
			+ "WHERE rdg.CF_UTENTE = :cfUtente "
			+ "AND rdg.id_progetto = :idProgetto "
			+ "AND rdg.codice_ruolo = :codiceRuolo", 
			nativeQuery = true)
	public List<String> findStatoByCfUtente(
			String cfUtente, 
			Long idProgetto, 
			String codiceRuolo);
	
	@Query(value = "select count(*) "
			+ "FROM referente_delegati_partner rdg "
			+ "WHERE rdg.CF_UTENTE = :cfUtente "
			+ "AND rdg.codice_ruolo = :codiceRuolo", 
			nativeQuery = true)
	public Integer countByCfUtenteAndCodiceRuolo(
			String cfUtente, 
			String codiceRuolo);
	
	@Query(value = "select * "
			+ "FROM referente_delegati_partner rdg "
			+ "WHERE rdg.CF_UTENTE = :cfUtente ", 
			nativeQuery = true)
	public List<ReferentiDelegatiEntePartnerDiProgettoEntity> findByCodFiscaleUtente(String cfUtente);
}