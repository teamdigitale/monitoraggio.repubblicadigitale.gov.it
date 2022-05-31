package it.pa.repdgt.ente.service;

import java.util.List;

import javax.transaction.Transactional;
import javax.validation.constraints.NotNull;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

import it.pa.repdgt.ente.entity.projection.FasciaOrariaAperturaIndirizzoSedeProjection;
import it.pa.repdgt.ente.repository.IndirizzoSedeFasciaOrariaRepository;
import it.pa.repdgt.shared.entity.IndirizzoSedeFasciaOrariaEntity;

@Service
@Validated
public class IndirizzoSedeFasciaOrariaService {
	@Autowired
	private IndirizzoSedeFasciaOrariaRepository indirizzoSedeFasciaOrariaRepository;

	public List<FasciaOrariaAperturaIndirizzoSedeProjection> getFasceOrarieByIdIndirizzoSede(@NotNull final Long idIndirizzoSede) {
		return this.indirizzoSedeFasciaOrariaRepository.findFasceOrarieByIdIndirizzoSede(idIndirizzoSede);
	}

	@Transactional(rollbackOn = Exception.class)
	public void salvaIndirizzoSedeFasciaOraria(@NotNull final IndirizzoSedeFasciaOrariaEntity indirizzoSedeFasciaOraria) {
		this.indirizzoSedeFasciaOrariaRepository.save(indirizzoSedeFasciaOraria);
	}
}