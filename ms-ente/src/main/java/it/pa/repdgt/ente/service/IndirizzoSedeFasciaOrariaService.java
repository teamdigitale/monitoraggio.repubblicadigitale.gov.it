package it.pa.repdgt.ente.service;

import java.util.Optional;

import javax.transaction.Transactional;
import javax.validation.constraints.NotNull;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

import it.pa.repdgt.ente.repository.IndirizzoSedeFasciaOrariaRepository;
import it.pa.repdgt.shared.annotation.LogExecutionTime;
import it.pa.repdgt.shared.annotation.LogMethod;
import it.pa.repdgt.shared.entity.IndirizzoSedeFasciaOrariaEntity;

@Service
@Validated
public class IndirizzoSedeFasciaOrariaService {
	@Autowired
	private IndirizzoSedeFasciaOrariaRepository indirizzoSedeFasciaOrariaRepository;

	@LogMethod
	@LogExecutionTime
	public Optional<IndirizzoSedeFasciaOrariaEntity> getFasceOrarieByIdIndirizzoSede(@NotNull final Long idIndirizzoSede) {
		return this.indirizzoSedeFasciaOrariaRepository.findByIdIndirizzoSede(idIndirizzoSede);
	}

	@LogMethod
	@LogExecutionTime
	@Transactional(rollbackOn = Exception.class)
	public void salvaIndirizzoSedeFasciaOraria(@NotNull final IndirizzoSedeFasciaOrariaEntity indirizzoSedeFasciaOraria) {
		this.indirizzoSedeFasciaOrariaRepository.save(indirizzoSedeFasciaOraria);
	}

	@LogMethod
	@LogExecutionTime
	public Optional<IndirizzoSedeFasciaOrariaEntity> getFasceOrarieEntityByIdIndirizzoSede(Long idIndirizzoSede) {
		return this.indirizzoSedeFasciaOrariaRepository.findByIdIndirizzoSede(idIndirizzoSede);
	}

	@LogMethod
	@LogExecutionTime
	@Transactional(rollbackOn = Exception.class)
	public void cancellaFasciaOraria(IndirizzoSedeFasciaOrariaEntity fasciaOraria) {
		this.indirizzoSedeFasciaOrariaRepository.delete(fasciaOraria);
	}

	@LogMethod
	@LogExecutionTime
	public IndirizzoSedeFasciaOrariaEntity getFasciaOrariaById(Long id) {
		return this.indirizzoSedeFasciaOrariaRepository.findById(id).get();
	}
}