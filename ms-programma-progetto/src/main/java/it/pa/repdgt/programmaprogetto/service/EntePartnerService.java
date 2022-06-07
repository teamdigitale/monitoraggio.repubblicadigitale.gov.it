package it.pa.repdgt.programmaprogetto.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import it.pa.repdgt.programmaprogetto.repository.EntePartnerRepository;
import it.pa.repdgt.shared.annotation.LogExecutionTime;
import it.pa.repdgt.shared.annotation.LogMethod;
import it.pa.repdgt.shared.entity.EntePartnerEntity;
import it.pa.repdgt.shared.entity.ReferentiDelegatiEntePartnerDiProgettoEntity;

@Service
public class EntePartnerService {
	
	@Autowired
	private ReferentiDelegatiEntePartnerService referentiDelegatiEntePartnerService;
	
	@Autowired 
	private EntePartnerRepository entePartnerRepository;

	@LogMethod
	@LogExecutionTime
	public List<Long> getIdEntiPartnerByProgetto(Long idProgetto){
		return this.entePartnerRepository.findIdEntiPartnerByProgetto(idProgetto);
	}

	@LogMethod
	@LogExecutionTime
	public List<String> getReferentiEntePartnerProgetto(Long idProgetto, Long idEnte) {
		return this.entePartnerRepository.findReferentiEntePartnerProgetto(idProgetto, idEnte);
	}
	
	@LogMethod
	@LogExecutionTime
	public String getStatoEntePartner(Long idProgetto, Long idEnte) {
		return this.entePartnerRepository.findStatoEntePartner(idProgetto, idEnte);
	}

	public void cancellaEntiPartner(Long idProgetto) {
		this.entePartnerRepository.cancellaEntiPartner(idProgetto);
	}

	public List<EntePartnerEntity> getEntiPartnerByProgetto(Long idProgetto) {
		return this.entePartnerRepository.findEntiPartnerByProgetto(idProgetto);
	}

	public void cancellaEntePartner(EntePartnerEntity entePartner) {
		List<ReferentiDelegatiEntePartnerDiProgettoEntity> referentiEDelegati = this.getReferentiEDelegatiEntePartner(entePartner.getId().getIdEnte(), entePartner.getId().getIdProgetto());
		referentiEDelegati.stream()
						  .forEach(this.referentiDelegatiEntePartnerService::cancellaAssociazioneReferenteODelegatoPartner);
		this.entePartnerRepository.delete(entePartner);
	}

	public void salvaEntePartner(EntePartnerEntity entePartnerEntity) {
		this.entePartnerRepository.save(entePartnerEntity);
	}

	public List<ReferentiDelegatiEntePartnerDiProgettoEntity> getReferentiEDelegatiEntePartner(Long idEnte,
			Long idProgetto) {
		return this.referentiDelegatiEntePartnerService.getReferentiEDelegatiEntePartner(idEnte, idProgetto);
	}
}