package it.pa.repdgt.ente.service;

import java.util.List;

import javax.transaction.Transactional;
import javax.validation.constraints.NotNull;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

import it.pa.repdgt.ente.entity.projection.IndirizzoSedeProjection;
import it.pa.repdgt.ente.repository.IndirizzoSedeRepository;
import it.pa.repdgt.shared.annotation.LogExecutionTime;
import it.pa.repdgt.shared.annotation.LogMethod;
import it.pa.repdgt.shared.entity.IndirizzoSedeEntity;

@Service
@Validated
public class IndirizzoSedeService {
	@Autowired
	private IndirizzoSedeRepository indirizzoSedeRepository;

	@LogMethod
	@LogExecutionTime
	public List<IndirizzoSedeProjection> getIndirizzoSedeByIdSede(@NotNull final Long idSede) {
		return this.indirizzoSedeRepository.findIndirizzoSedeByIdSede(idSede);
	}

	@LogMethod
	@LogExecutionTime
	@Transactional(rollbackOn = Exception.class)
	public IndirizzoSedeEntity salvaIndirizzoSede(@NotNull final IndirizzoSedeEntity indirizzoSede) {
		return this.indirizzoSedeRepository.save(indirizzoSede);
	}

	@LogMethod
	@LogExecutionTime
	public IndirizzoSedeEntity getIndirizzoSedeById(@NotNull Long id) {
		return this.indirizzoSedeRepository.findById(id).get();
	}

	@LogMethod
	@LogExecutionTime
	@Transactional(rollbackOn = Exception.class)
	public void cancellaIndirizzoSedeById(@NotNull Long id) {
		this.indirizzoSedeRepository.deleteById(id);
	}
}