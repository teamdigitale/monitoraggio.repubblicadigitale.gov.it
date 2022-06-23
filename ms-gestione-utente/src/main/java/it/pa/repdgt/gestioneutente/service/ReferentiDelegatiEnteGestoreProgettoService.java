package it.pa.repdgt.gestioneutente.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import it.pa.repdgt.gestioneutente.entity.projection.ReferenteDelegatoEnteGestoreProgettoProjection;
import it.pa.repdgt.gestioneutente.repository.ReferentiDelegatiEnteGestoreProgettoRepository;

@Service
public class ReferentiDelegatiEnteGestoreProgettoService {
	@Autowired
	private ReferentiDelegatiEnteGestoreProgettoRepository referentiDelegatiEnteGestoreProgettoRepository;
	
	public List<ReferenteDelegatoEnteGestoreProgettoProjection> getEmailReferentiDelegatiEnteGestoreByIdProgetto(List<Long> idsProgetto) {
		return this.referentiDelegatiEnteGestoreProgettoRepository.findEmailReferentiDelegatiEnteGestoreByIdsProgetti(idsProgetto);
	}
}