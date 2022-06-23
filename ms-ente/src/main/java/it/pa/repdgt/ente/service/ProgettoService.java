package it.pa.repdgt.ente.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import it.pa.repdgt.ente.exception.ResourceNotFoundException;
import it.pa.repdgt.ente.repository.ProgettoRepository;
import it.pa.repdgt.shared.annotation.LogExecutionTime;
import it.pa.repdgt.shared.annotation.LogMethod;
import it.pa.repdgt.shared.entity.ProgettoEntity;
import it.pa.repdgt.shared.entity.light.ProgettoLightEntity;

@Service
public class ProgettoService {
	@Autowired
	private ProgettoRepository progettoRepository;
	
	/**
	 * @throws ResourceNotFoundException
	 * */
	@LogMethod
	@LogExecutionTime
	public ProgettoEntity getProgettoById(Long id) {
		String messaggioErrore = String.format("Progetto con id=%s non presente", String.valueOf(id));
		return this.progettoRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException(messaggioErrore));
	}
	
	public ProgettoLightEntity getProgettoLightById(Long id) {
		String messaggioErrore = String.format("Progetto con id=%s non presente", String.valueOf(id));
		return this.progettoRepository.findProgettoLightById(id)
				.orElseThrow(() -> new ResourceNotFoundException(messaggioErrore));
	}
	
	@LogMethod
	@LogExecutionTime
	public boolean esisteProgettoById(Long id) {
		return this.progettoRepository.existsById(id);
	}

	@LogMethod
	@LogExecutionTime
	public String getStatoProgettoById(Long id) {
		return this.getProgettoById(id).getStato();
	}
	
	public List<Long> getIdProgettiByIdEnte(Long idEnte) {
		return this.progettoRepository.findIdProgettiByIdEnte(idEnte);
	}

	public List<Long> getIdProgettiEntePartnerByIdEnte(Long idEnte) {
		return this.progettoRepository.findIdProgettiEntePartnerByIdEnte(idEnte);
	}

	public int countProgettiEnte(Long idEnte) {
		return this.progettoRepository.countProgettiEnte(idEnte);
	}

	public int countProgettiEntePartner(Long idEnte) {
		return this.progettoRepository.countProgettiEntePartner(idEnte);
	}

	public List<ProgettoEntity> getProgettiByIdEnte(Long idEnte) {
		return this.progettoRepository.getProgettiByIdEnte(idEnte);
	}

	public void salvaProgetto(ProgettoEntity progettoFetchDB) {
		this.progettoRepository.save(progettoFetchDB);
	}

	public void salvaOAggiornaProgetto(ProgettoEntity progettoDBFEtch) {
		this.progettoRepository.save(progettoDBFEtch);
	}
}