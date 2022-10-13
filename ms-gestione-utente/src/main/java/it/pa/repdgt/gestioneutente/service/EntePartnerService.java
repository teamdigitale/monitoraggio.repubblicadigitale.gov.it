package it.pa.repdgt.gestioneutente.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import it.pa.repdgt.gestioneutente.exception.UtenteException;
import it.pa.repdgt.gestioneutente.repository.EntePartnerRepository;
import it.pa.repdgt.shared.annotation.LogExecutionTime;
import it.pa.repdgt.shared.annotation.LogMethod;
import it.pa.repdgt.shared.entity.EntePartnerEntity;
import it.pa.repdgt.shared.entity.key.EntePartnerKey;
import it.pa.repdgt.shared.exception.CodiceErroreEnum;

@Service
public class EntePartnerService {
	@Autowired
	private EntePartnerRepository entePartnerRepository;

	@LogMethod
	@LogExecutionTime
	public List<EntePartnerEntity> getIdProgettiEntePartnerByRuoloUtente(String cfUtente, String ruolo) {
		return this.entePartnerRepository.findIdProgettiEntePartnerByRuoloUtente(cfUtente, ruolo);
	}
	
	@LogMethod
	@LogExecutionTime
	public EntePartnerEntity findEntePartnerByIdProgettoAndIdEnte(Long idEnte, Long idProgetto) {
		String messaggioErrore = String.format("ente partner non presente per idEnte %s, idProgetto %s", idEnte, idProgetto);
		return this.entePartnerRepository.findById(new EntePartnerKey(idProgetto, idEnte))
				.orElseThrow(() -> new UtenteException(messaggioErrore, CodiceErroreEnum.EN24));
	}
}