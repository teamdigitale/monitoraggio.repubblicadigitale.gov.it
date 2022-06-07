package it.pa.repdgt.integrazione.service;

import java.util.Date;
import java.util.List;
import java.util.concurrent.TimeUnit;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import it.pa.repdgt.integrazione.repository.ProgettoRepository;
import it.pa.repdgt.integrazione.repository.UtenteRepository;
import it.pa.repdgt.shared.entity.ProgettoEntity;
import it.pa.repdgt.shared.entity.UtenteEntity;

@Service
public class ProgettoService {
	@Autowired
	private ProgettoRepository progettoRepository;
	@Autowired
	private UtenteRepository utenteRepository;

	public List<ProgettoEntity> getProgettoByStatoProgetto(final String statoProgetto) {
		return this.progettoRepository.findProgettiByStato(statoProgetto);
	}

	public Long getGiorniTrascorsiDaDataAttivabilitaProgetto(final ProgettoEntity progettoEntity) {
		if(progettoEntity.getDataOraProgettoAttivabile() == null) {
			return null;
		}
		final Long dataStatoAttivabile = progettoEntity.getDataOraProgettoAttivabile().getTime();
		final Long dataCorrente = new Date().getTime();
		final long differenza = dataCorrente - dataStatoAttivabile;
		return TimeUnit.DAYS.convert(differenza, TimeUnit.MILLISECONDS);
	}
	
	public List<UtenteEntity> getReferentiProgramma(Long idProgetto){
		return this.utenteRepository.getUtentiReferentiDelegatiEnteGestoreProgrammaByIdProgetto(idProgetto);
	}
	
	public List<UtenteEntity> getDTDs(){
		return this.utenteRepository.getUtentiDTD();
	}
}