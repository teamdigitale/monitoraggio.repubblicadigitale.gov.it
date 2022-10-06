package it.pa.repdgt.surveymgmt.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import it.pa.repdgt.shared.annotation.LogExecutionTime;
import it.pa.repdgt.shared.annotation.LogMethod;
import it.pa.repdgt.shared.entity.SedeEntity;
import it.pa.repdgt.shared.exception.CodiceErroreEnum;
import it.pa.repdgt.surveymgmt.exception.ResourceNotFoundException;
import it.pa.repdgt.surveymgmt.param.CittadiniPaginatiParam;
import it.pa.repdgt.surveymgmt.param.FiltroListaCittadiniParam;
import it.pa.repdgt.surveymgmt.projection.SedeProjection;
import it.pa.repdgt.surveymgmt.repository.SedeRepository;

@Service
public class SedeService {
	@Autowired
	private SedeRepository sedeRepository;
	@Autowired
	private ServizioSqlService servizioSqlService;

	@LogMethod
	@LogExecutionTime
	public SedeEntity getById(final Long idSede) {
		final String messaggioErrore = String.format("Sede con id %s non presente", idSede);
		return this.sedeRepository.findById(idSede)
				.orElseThrow(() -> new ResourceNotFoundException(messaggioErrore, CodiceErroreEnum.C01));
	}

	@LogMethod
	@LogExecutionTime
	public List<SedeProjection> getAllSediFacilitatoreFiltrate(CittadiniPaginatiParam cittadiniPaginatiParam) {
		FiltroListaCittadiniParam filtro = cittadiniPaginatiParam.getFiltro();
		String criterioRicerca = filtro.getCriterioRicerca();
		List<String> idsSedi;
		if(filtro.getIdsSedi() == null) {
			idsSedi = this.servizioSqlService.getIdsSediFacilitatoreConServiziAndCittadiniCensitiByCodFiscaleAndIdProgetto(cittadiniPaginatiParam.getCfUtenteLoggato(), cittadiniPaginatiParam.getIdProgetto());
		} else {
			idsSedi = filtro.getIdsSedi();
		}
		
		return idsSedi.isEmpty()? new ArrayList<>(): this.sedeRepository.findAllSediFiltrate(criterioRicerca, "%" + criterioRicerca + "%", idsSedi);
	}
}