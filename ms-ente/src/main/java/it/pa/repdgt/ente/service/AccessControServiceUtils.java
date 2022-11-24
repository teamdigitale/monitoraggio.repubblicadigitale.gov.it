package it.pa.repdgt.ente.service;

import java.util.List;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import it.pa.repdgt.ente.restapi.param.EntiPaginatiParam;
import it.pa.repdgt.shared.entity.ProgettoEntity;
import it.pa.repdgt.shared.entityenum.PolicyEnum;
import it.pa.repdgt.shared.restapi.param.SceltaProfiloParam;

@Service
public class AccessControServiceUtils {
	
	@Autowired
	private ProgettoService progettoService;
	@Autowired
	private ProgrammaService programmaService;
	@Autowired
	private EnteSedeProgettoService enteSedeProgettoService;

	public boolean checkPermessoIdEnte(@Valid SceltaProfiloParam sceltaProfiloParam, Long idEnte) {
		switch (sceltaProfiloParam.getCodiceRuoloUtenteLoggato()) {
		case "DSCU":
			if(programmaService.getCountEnteByPolicy(idEnte) > 0)
				return true;
			 break;
		case "REG":
		case "DEG":
			if(programmaService.getCountEnteByIdProgramma(idEnte, sceltaProfiloParam.getIdProgramma()) > 0)
				return true;
			break;
		case "REGP":
		case "DEGP":
			if(progettoService.getCountEnteByIdProgetto(idEnte, sceltaProfiloParam.getIdProgetto()) > 0)
				return true;
			break;
		case "REPP":
		case "DEPP":
		case "FAC":
		case "VOL":
			if(sceltaProfiloParam.getIdEnte().equals(idEnte))
				return true;
			break;
		default:
			return true;
		}
		return false;
	}

	public boolean checkPermessoIdProgramma(@Valid SceltaProfiloParam sceltaProfiloParam, Long idProgramma) {
		switch (sceltaProfiloParam.getCodiceRuoloUtenteLoggato()) {
		case "DSCU":
			if(programmaService.getProgrammaById(idProgramma).getPolicy().equals(PolicyEnum.SCD))
				return true;
			 break;
		case "REG":
		case "DEG":
		case "REGP":
		case "DEGP":
		case "REPP":
		case "DEPP":
		case "FAC":
		case "VOL":
			if(sceltaProfiloParam.getIdProgramma().equals(idProgramma))
				return true;
			break;
		default:
			return true;
		}
		return false;
	}

	public boolean checkPermessoIdProgetto(@Valid SceltaProfiloParam sceltaProfiloParam, Long idProgetto) {
		switch (sceltaProfiloParam.getCodiceRuoloUtenteLoggato()) {
		case "DSCU":
			if(progettoService.getProgettoById(idProgetto).getProgramma().getPolicy().equals(PolicyEnum.SCD))
				return true;
			 break;
		case "REG":
		case "DEG":
			List<ProgettoEntity> progettiDelMioProgramma = progettoService.getProgettoByIdProgramma(sceltaProfiloParam.getIdProgramma());
			for(ProgettoEntity progetto: progettiDelMioProgramma){
				if(progetto.getId().equals(idProgetto))
					return true;
			}
			break;
		case "REGP":
		case "DEGP":
		case "REPP":
		case "DEPP":
		case "FAC":
		case "VOL":
			if(sceltaProfiloParam.getIdProgetto().equals(idProgetto))
				return true;
			break;
		default:
			return true;
		}
		return false;
	}
	
	public boolean checkPermessoIdSede(@Valid SceltaProfiloParam sceltaProfiloParam, Long idSede) {
		switch (sceltaProfiloParam.getCodiceRuoloUtenteLoggato()) {
		case "DSCU":
			if(enteSedeProgettoService.getCountSediByPolicy(idSede) > 0)
				return true;
			 break;
		case "REG":
		case "DEG":
			if(enteSedeProgettoService.getCountSediByIdProgramma(idSede, sceltaProfiloParam.getIdProgramma()) > 0)
				return true;
			break;
		case "REGP":
		case "DEGP":
		case "REPP":
		case "DEPP":
			if(enteSedeProgettoService.getCountSediByIdProgetto(idSede, sceltaProfiloParam.getIdProgetto()) > 0)
				return true;
			break;
		case "FAC":
		case "VOL":
			if(enteSedeProgettoService.getCountSediByIdProgettoAndEnteAndFacilitatore(idSede, sceltaProfiloParam.getIdProgetto(), sceltaProfiloParam.getIdEnte(), sceltaProfiloParam.getCfUtenteLoggato()) > 0)
				return true;
			break;
		default:
			return true;
		}
		return false;
	}
}
