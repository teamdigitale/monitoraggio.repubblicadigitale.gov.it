package it.pa.repdgt.programmaprogetto.service;

import java.util.Date;
import java.util.List;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import it.pa.repdgt.programmaprogetto.exception.ProgrammaException;
import it.pa.repdgt.programmaprogetto.exception.ResourceNotFoundException;
import it.pa.repdgt.programmaprogetto.repository.EnteRepository;
import it.pa.repdgt.shared.annotation.LogExecutionTime;
import it.pa.repdgt.shared.annotation.LogMethod;
import it.pa.repdgt.shared.entity.EnteEntity;
import it.pa.repdgt.shared.entity.EntePartnerEntity;
import it.pa.repdgt.shared.entity.ReferentiDelegatiEntePartnerDiProgettoEntity;
import it.pa.repdgt.shared.entityenum.StatoEnum;
import it.pa.repdgt.shared.service.storico.StoricoService;

@Service
public class EnteService {
	@Autowired
	private StoricoService storicoService;
	@Autowired
	private EntePartnerService entePartnerService;
	@Autowired
	private ReferentiDelegatiEntePartnerService referentiDelegatiEntePartnerService;
	@Autowired
	private EnteRepository enteRepository;

	/**
	 * @throws ResourceNotFoundException
	 * */
	@LogMethod
	@LogExecutionTime
	public EnteEntity getEnteById(Long idEnte) {
		String errorMessage = String.format("Ente con id=%s non presente", idEnte);
		return this.enteRepository.findById(idEnte)
				.orElseThrow( () -> new ResourceNotFoundException(errorMessage) );
	}
	
	@LogMethod
	@LogExecutionTime
	public boolean esisteEnteById(Long idEnte) {
		return this.enteRepository.findById(idEnte).isPresent();
	}

	public String getRuoloEnteByIdProgettoAndIdSedeAndIdEnte(Long idProgetto, Long idSede, Long idEnte) {
		return this.enteRepository.findRuoloEnteByIdProgettoAndIdSedeAndIdEnte(idProgetto, idSede, idEnte);
	}
	
	public List<Long> getIdEnteByIdProgettoAndIdSede(Long idProgetto, Long idSede) {
		return this.enteRepository.findIdEnteByIdProgettoAndIdSede(idProgetto, idSede);
	}
	
	@Transactional(rollbackOn = Exception.class)
	public void terminaEntiPartner(Long idProgetto) {
		List<EntePartnerEntity> entiPartner = this.entePartnerService.getEntiPartnerByProgetto(idProgetto);
		entiPartner.stream()
				   .forEach(ente -> {
					   if(ente.getStatoEntePartner().equals(StatoEnum.ATTIVO.getValue())) {
						   try {
							this.storicoService.storicizzaEntePartner(ente, StatoEnum.TERMINATO.getValue());
						} catch (Exception e) {
							throw new ProgrammaException("Impossibile Storicizzare Ente");
						}
						   this.terminaEntePartner(ente);
					   }
					   if(ente.getStatoEntePartner().equals(StatoEnum.NON_ATTIVO.getValue())) {
						   this.entePartnerService.cancellaEntePartner(ente);
					   }
				   });
	}
	
	@Transactional(rollbackOn = Exception.class)
	public void terminaEntePartner(EntePartnerEntity entePartner) {
		List<ReferentiDelegatiEntePartnerDiProgettoEntity> referentiEDelegati = this.entePartnerService.getReferentiEDelegatiEntePartner(entePartner.getId().getIdEnte(), entePartner.getId().getIdProgetto());
		referentiEDelegati.stream()
						  .forEach(utente -> {
							  if(utente.getStatoUtente().equals(StatoEnum.ATTIVO.getValue())) {
								  utente.setStatoUtente(StatoEnum.TERMINATO.getValue());
								  utente.setDataOraTerminazione(new Date());
								  this.referentiDelegatiEntePartnerService.salvaReferenteODelegato(utente);
							  }
							  if(utente.getStatoUtente().equals(StatoEnum.NON_ATTIVO.getValue())) {
								  this.referentiDelegatiEntePartnerService.cancellaAssociazioneReferenteODelegatoPartner(utente);
							  }
						  });
		entePartner.setStatoEntePartner(StatoEnum.TERMINATO.getValue());
		entePartner.setTerminatoSingolarmente(Boolean.FALSE);
		this.entePartnerService.salvaEntePartner(entePartner);
	}
}