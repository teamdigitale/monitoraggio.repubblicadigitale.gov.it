package it.pa.repdgt.gestioneutente.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import it.pa.repdgt.gestioneutente.entity.projection.ReferenteDelegatoEnteGestoreProgettoProjection;
import it.pa.repdgt.gestioneutente.repository.ReferentiDelegatiEnteGestoreProgettoRepository;
import it.pa.repdgt.shared.annotation.LogExecutionTime;
import it.pa.repdgt.shared.annotation.LogMethod;

@Service
public class ReferentiDelegatiEnteGestoreProgettoService {
	@Autowired
	private ReferentiDelegatiEnteGestoreProgettoRepository referentiDelegatiEnteGestoreProgettoRepository;
	
	@LogMethod
	@LogExecutionTime
	public List<ReferenteDelegatoEnteGestoreProgettoProjection> getEmailReferentiDelegatiEnteGestoreByIdProgetto(List<Long> idsProgetto) {
		return this.referentiDelegatiEnteGestoreProgettoRepository.findEmailReferentiDelegatiEnteGestoreByIdsProgetti(idsProgetto);
	}
}