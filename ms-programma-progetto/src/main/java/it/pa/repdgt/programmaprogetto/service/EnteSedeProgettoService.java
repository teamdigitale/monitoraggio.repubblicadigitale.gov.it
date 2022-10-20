package it.pa.repdgt.programmaprogetto.service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import it.pa.repdgt.programmaprogetto.repository.EnteSedeProgettoRepository;
import it.pa.repdgt.programmaprogetto.repository.UtenteRepository;
import it.pa.repdgt.shared.annotation.LogExecutionTime;
import it.pa.repdgt.shared.annotation.LogMethod;
import it.pa.repdgt.shared.awsintegration.service.WorkDocsService;
import it.pa.repdgt.shared.entity.EnteSedeProgetto;
import it.pa.repdgt.shared.entity.EnteSedeProgettoFacilitatoreEntity;
import it.pa.repdgt.shared.entity.UtenteEntity;
import it.pa.repdgt.shared.entity.key.EnteSedeProgettoKey;
import it.pa.repdgt.shared.entityenum.StatoEnum;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class EnteSedeProgettoService {
	@Autowired
	private EnteSedeProgettoFacilitatoreService enteSedeProgettoFacilitatoreService;
	@Autowired
	private EnteSedeProgettoRepository enteSedeProgettoRepository;
	@Autowired
	private UtenteRepository utenteRepository;
	@Autowired
	private WorkDocsService workDocsService;
	
	@LogMethod
	@LogExecutionTime
	public void cancellaEnteSedeProgetto(Long idProgetto) {
		List<EnteSedeProgetto> enteSedeProgetto = this.enteSedeProgettoRepository.getEnteSedeProgettoByIdProgetto(idProgetto);
		
		enteSedeProgetto.stream().forEach(this::cancellazioneAssociazioneEnteSedeProgetto);
	}
	
	@LogMethod
	@LogExecutionTime
	@Transactional(rollbackOn = Exception.class)
	public void cancellazioneAssociazioneEnteSedeProgetto(EnteSedeProgetto enteSedeProgetto) {
		Long idSede = enteSedeProgetto.getId().getIdSede();
		Long idEnte = enteSedeProgetto.getId().getIdEnte();
		Long idProgetto = enteSedeProgetto.getId().getIdProgetto();

		this.enteSedeProgettoFacilitatoreService.cancellaAssociazioniFacilitatoriOVolontariAEnteSedeProgetto(idSede, idEnte, idProgetto);

		EnteSedeProgetto enteSedeProgettoDBFetch = this.getAssociazioneEnteSedeProgetto(idSede, idEnte, idProgetto);
		this.enteSedeProgettoRepository.delete(enteSedeProgettoDBFetch);
	}
	
	@LogMethod
	@LogExecutionTime
	public EnteSedeProgetto getAssociazioneEnteSedeProgetto(Long idSede, Long idEnte, Long idProgetto) {
		EnteSedeProgettoKey id = new EnteSedeProgettoKey(idEnte, idSede, idProgetto);
		return this.enteSedeProgettoRepository.findById(id).get();
	}

	@LogMethod
	@LogExecutionTime
	@Transactional(rollbackOn = Exception.class)
	public void cancellaOTerminaEnteSedeProgetto(Long idProgetto) {
		List<EnteSedeProgetto> enteSedeProgetto = this.enteSedeProgettoRepository.getEnteSedeProgettoByIdProgetto(idProgetto);
		
		enteSedeProgetto.stream().forEach(sede -> {
						if(StatoEnum.ATTIVO.getValue().equals(sede.getStatoSede())) {
							this.terminazioneAssociazioneEnteSedeProgetto(sede);
						}
						if(StatoEnum.NON_ATTIVO.getValue().equals(sede.getStatoSede())) {
							this.cancellazioneAssociazioneEnteSedeProgetto(sede);
						}
					});
	}
	
	@LogMethod
	@LogExecutionTime
	@Transactional(rollbackOn = Exception.class)
	public void terminazioneAssociazioneEnteSedeProgetto(EnteSedeProgetto enteSedeProgetto) {
		Long idSede = enteSedeProgetto.getId().getIdSede();
		Long idEnte = enteSedeProgetto.getId().getIdEnte();
		Long idProgetto = enteSedeProgetto.getId().getIdProgetto();
		
		List<EnteSedeProgettoFacilitatoreEntity> facilitatori = this.enteSedeProgettoFacilitatoreService.getAllFacilitatoriEVolontariBySedeAndEnteAndProgetto(idSede, idEnte, idProgetto);
		facilitatori.stream()
					.forEach(utente -> {
						if(StatoEnum.ATTIVO.getValue().equals(utente.getStatoUtente())) {
							utente.setStatoUtente(StatoEnum.TERMINATO.getValue());
							utente.setDataOraTerminazione(new Date());
							this.enteSedeProgettoFacilitatoreService.salvaEnteSedeProgettoFacilitatore(utente);
							
							final String codFiscaleUtente = utente.getId().getIdFacilitatore();
							final UtenteEntity utenteEntity = this.utenteRepository.findByCodiceFiscale(codFiscaleUtente).get();
							if(utenteEntity.getIntegrazioneUtente().getIdUtenteWorkdocs() != null) {
								try {
									new Thread(() -> {
										this.workDocsService.disattivaWorkDocsUser(utenteEntity.getIntegrazioneUtente().getIdUtenteWorkdocs());
									}).start();
								} catch (Exception ex) {
									log.error("Errore disattivazione utente workdocs ", ex);
								}
							}
						}
						if(StatoEnum.NON_ATTIVO.getValue().equals(utente.getStatoUtente())) {
							this.enteSedeProgettoFacilitatoreService.cancellaAssociazioneFacilitatoreOVolontario(idEnte, idSede, idProgetto, utente.getId().getIdFacilitatore(), utente.getRuoloUtente());
						}
					});
		
		EnteSedeProgetto enteSedeProgettoDBFetch = this.getAssociazioneEnteSedeProgetto(idSede, idEnte, idProgetto);
		enteSedeProgettoDBFetch.setStatoSede(StatoEnum.TERMINATO.getValue());
		enteSedeProgettoDBFetch.setDataTerminazioneSede(new Date());
		this.enteSedeProgettoRepository.save(enteSedeProgettoDBFetch);
	}
}