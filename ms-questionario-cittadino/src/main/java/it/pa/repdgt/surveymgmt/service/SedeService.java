package it.pa.repdgt.surveymgmt.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import it.pa.repdgt.shared.entity.SedeEntity;
import it.pa.repdgt.surveymgmt.exception.ResourceNotFoundException;
import it.pa.repdgt.surveymgmt.param.CittadiniPaginatiParam;
import it.pa.repdgt.surveymgmt.param.FiltroListaCittadiniParam;
import it.pa.repdgt.surveymgmt.projection.SedeProjection;
import it.pa.repdgt.surveymgmt.repository.SedeRepository;

@Service
public class SedeService {
	@Autowired
	private EnteSedeProgettoFacilitatoreService enteSedeProgettoFacilitatoreService;
	@Autowired
	private SedeRepository sedeRepository;

	public SedeEntity getById(final Long idSede) {
		final String messaggioErrore = String.format("Sede con id %s non presente", idSede);
		return this.sedeRepository.findById(idSede)
				.orElseThrow(() -> new ResourceNotFoundException(messaggioErrore));
	}

	public List<SedeProjection> getAllSediFacilitatoreFiltrate(CittadiniPaginatiParam cittadiniPaginatiParam) {
		FiltroListaCittadiniParam filtro = cittadiniPaginatiParam.getFiltro();
		String criterioRicerca = filtro.getCriterioRicerca();
		List<String> idsSedi;
		if(filtro.getIdsSedi() == null) {
			idsSedi = this.enteSedeProgettoFacilitatoreService.getIdsSediFacilitatoreByCodFiscaleAndIdProgetto(cittadiniPaginatiParam.getCodiceFiscaleUtenteLoggato(), cittadiniPaginatiParam.getIdProgetto());
		} else {
			idsSedi = filtro.getIdsSedi();
		}
		
		return this.sedeRepository.findAllSediFiltrate(criterioRicerca, "%" + criterioRicerca + "%", idsSedi);
	}
}