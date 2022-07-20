package it.pa.repdgt.ente.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

import it.pa.repdgt.ente.exception.EnteException;
import it.pa.repdgt.ente.exception.ResourceNotFoundException;
import it.pa.repdgt.ente.repository.ProgettoRepository;
import it.pa.repdgt.shared.annotation.LogExecutionTime;
import it.pa.repdgt.shared.annotation.LogMethod;
import it.pa.repdgt.shared.entity.EnteEntity;
import it.pa.repdgt.shared.entity.ProgettoEntity;
import it.pa.repdgt.shared.entity.light.ProgettoLightEntity;
import it.pa.repdgt.shared.entityenum.StatoEnum;

@Service
public class ProgettoService {
	@Autowired
	@Lazy
	private EnteService enteService;
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
	
	@LogMethod
	@LogExecutionTime
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
	
	@LogMethod
	@LogExecutionTime
	public List<Long> getIdProgettiByIdEnte(Long idEnte) {
		return this.progettoRepository.findIdProgettiByIdEnte(idEnte);
	}

	@LogMethod
	@LogExecutionTime
	public List<Long> getIdProgettiEntePartnerByIdEnte(Long idEnte) {
		return this.progettoRepository.findIdProgettiEntePartnerByIdEnte(idEnte);
	}

	@LogMethod
	@LogExecutionTime
	public int countProgettiEnte(Long idEnte) {
		return this.progettoRepository.countProgettiEnte(idEnte);
	}

	@LogMethod
	@LogExecutionTime
	public int countProgettiEntePartner(Long idEnte) {
		return this.progettoRepository.countProgettiEntePartner(idEnte);
	}

	@LogMethod
	@LogExecutionTime
	public List<ProgettoEntity> getProgettiByIdEnte(Long idEnte) {
		return this.progettoRepository.getProgettiByIdEnte(idEnte);
	}

	@LogMethod
	@LogExecutionTime
	public void salvaProgetto(ProgettoEntity progettoFetchDB) {
		this.progettoRepository.save(progettoFetchDB);
	}

	@LogMethod
	@LogExecutionTime
	public void salvaOAggiornaProgetto(ProgettoEntity progettoDBFEtch) {
		this.progettoRepository.save(progettoDBFEtch);
	}
	
	/**
	 * @throws ProgettoException
	 * */
	@LogMethod
	@LogExecutionTime
	public void assegnaEnteGestoreProgetto(Long idProgetto, Long idEnteGestore) {
		ProgettoEntity progettoFetchDB = null;
		try {
			progettoFetchDB = this.getProgettoById(idProgetto);
		} catch (ResourceNotFoundException ex) {
			String errorMessage = String.format("Impossibile Assegnare gestore a progetto perchè progetto con id=%s non presente", idProgetto);
			throw new EnteException(errorMessage);		
		}
		EnteEntity enteFetchDB = null;
		try {
			enteFetchDB = this.enteService.getEnteById(idEnteGestore);
		} catch (ResourceNotFoundException ex) {
			String errorMessage = String.format("Impossibile Assegnare gestore a progetto perchè ente gestore con id=%s non presente", idEnteGestore);
			throw new EnteException(errorMessage);
		}
		progettoFetchDB.setEnteGestoreProgetto(enteFetchDB);
		progettoFetchDB.setStatoGestoreProgetto(StatoEnum.NON_ATTIVO.getValue());
		this.salvaProgetto(progettoFetchDB);
	}
}