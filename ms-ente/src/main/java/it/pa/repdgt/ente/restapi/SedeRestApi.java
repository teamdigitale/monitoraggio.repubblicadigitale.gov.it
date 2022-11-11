package it.pa.repdgt.ente.restapi;

import java.util.List;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import it.pa.repdgt.ente.bean.SchedaSedeBean;
import it.pa.repdgt.ente.exception.EnteException;
import it.pa.repdgt.ente.mapper.SedeMapper;
import it.pa.repdgt.ente.request.EnteSedeProgettoFacilitatoreRequest;
import it.pa.repdgt.ente.request.NuovaSedeRequest;
import it.pa.repdgt.ente.resource.CreaSedeResource;
import it.pa.repdgt.ente.resource.SedeResource;
import it.pa.repdgt.ente.service.AccessControServiceUtils;
import it.pa.repdgt.ente.service.EnteSedeProgettoFacilitatoreService;
import it.pa.repdgt.ente.service.EnteSedeProgettoService;
import it.pa.repdgt.ente.service.SedeService;
import it.pa.repdgt.shared.entity.SedeEntity;
import it.pa.repdgt.shared.exception.CodiceErroreEnum;
import it.pa.repdgt.shared.restapi.param.SceltaProfiloParam;

@RestController
@RequestMapping(path = "/sede")
public class SedeRestApi {
	@Autowired
	private SedeMapper sedeMapper;
	@Autowired
	private SedeService sedeService;
	@Autowired
	private EnteSedeProgettoService enteSedeProgettoService;
	@Autowired
	private EnteSedeProgettoFacilitatoreService enteSedeProgettoFacilitatoreService;
	@Autowired
	private AccessControServiceUtils accessControServiceUtils;
	private static final String ERROR_MESSAGE_PERMESSO = "Errore tentavo accesso a risorsa non permesso";
	
	// Cerca sede (ricerca per nome della sede)
	@GetMapping(path = "cerca/{nomeSede}")
	@ResponseStatus(value = HttpStatus.OK)
	public List<SedeResource> cercaSedeByNomeSede(
			@PathVariable(value = "nomeSede") final String nomeSede) {
		final List<SedeEntity> sedi = this.sedeService.cercaSedeByNomeSedeLike(nomeSede.trim().toUpperCase());
		return this.sedeMapper.toResourceFrom(sedi);
	}
	
	// Dati relativi alla sede (indirizzi e fasce orarie)
	@PostMapping(path = "/light/{idSede}")
	@ResponseStatus(value = HttpStatus.OK)
	public SchedaSedeBean getSchedaAnagraficaSedeAndSceltaProfilo (
			@PathVariable(value = "idSede") final Long idSede,
			@RequestBody SceltaProfiloParam sceltaProfiloParam) {
		return this.sedeService.getSchedaSedeByIdSede(idSede);
	}
	
	// Crea sede
	@PostMapping
	@ResponseStatus(value = HttpStatus.CREATED)
	public CreaSedeResource creaNuovaSede(@RequestBody @Valid NuovaSedeRequest nuovaSedeRequest) {
		return new CreaSedeResource(this.sedeService.creaNuovaSede(nuovaSedeRequest).getId());
	}
	
	// Aggiorna sede
	@PutMapping(path = "/aggiorna/{idSede}")
	@ResponseStatus(value = HttpStatus.OK)
	public void aggiornaSede(@PathVariable(value = "idSede") Long idSede,
			@RequestBody @Valid NuovaSedeRequest nuovaSedeRequest) {
//		if(!accessControServiceUtils.checkPermessoIdSede(nuovaSedeRequest, idSede))
//			throw new EnteException(ERROR_MESSAGE_PERMESSO, CodiceErroreEnum.A02);
		this.sedeService.aggiornaSede(idSede, nuovaSedeRequest);
	}
	
	// Associazione sede, ente, progetto
	@PostMapping(path = "/associa/ente/{idEnte}/sede/{idSede}/progetto/{idProgetto}/ruoloEnte/{ruoloEnte}")
	@ResponseStatus(value = HttpStatus.OK)
	public void associaEnteSedeProgettoBySceltaProfilo(
			@PathVariable(value = "idEnte") 	Long idEnte,
			@PathVariable(value = "idSede") 	Long idSede,
			@PathVariable(value = "idProgetto") Long idProgetto,
			@PathVariable(value = "ruoloEnte") 	String ruoloEnte,
			@RequestBody SceltaProfiloParam sceltaProfiloParam) {
		if(!accessControServiceUtils.checkPermessoIdProgetto(sceltaProfiloParam, idProgetto) ||
				!accessControServiceUtils.checkPermessoIdEnte(sceltaProfiloParam, idEnte))
			throw new EnteException(ERROR_MESSAGE_PERMESSO, CodiceErroreEnum.A02);
		this.enteSedeProgettoService.associaEnteSedeProgetto(idSede, idEnte, ruoloEnte, idProgetto);
	}
	
	// Cancellazione o terminazione associazione sede, ente, progetto a seconda dello stato della sede
	@ResponseStatus(value = HttpStatus.NO_CONTENT)
	@DeleteMapping(path = "/cancellaOTerminaAssociazione/ente/{idEnte}/sede/{idSede}/progetto/{idProgetto}")
	public void cancellaOTerminaAssociazioneEnteSedeProgetto(
			@PathVariable(value = "idEnte") 	Long idEnte,
			@PathVariable(value = "idSede") 	Long idSede,
			@PathVariable(value = "idProgetto") Long idProgetto,
			@RequestBody SceltaProfiloParam sceltaProfiloParam) {
		if(!accessControServiceUtils.checkPermessoIdProgetto(sceltaProfiloParam, idProgetto) ||
				!accessControServiceUtils.checkPermessoIdEnte(sceltaProfiloParam, idEnte) ||
					!accessControServiceUtils.checkPermessoIdSede(sceltaProfiloParam, idSede))
			throw new EnteException(ERROR_MESSAGE_PERMESSO, CodiceErroreEnum.A02);
		this.enteSedeProgettoService.cancellaOTerminaAssociazioneEnteSedeProgetto(idEnte, idSede, idProgetto);
	}
	
	// Associa facilitatore a ente, sede, progetto
	@PostMapping(path = "/associa/facilitatore")
	@ResponseStatus(value = HttpStatus.OK)
	public void associaFacilitatoreAEnteSedeProgetto (
			@RequestBody @Valid final EnteSedeProgettoFacilitatoreRequest enteSedeProgettoFacilitatoreRequest) {
		this.enteSedeProgettoFacilitatoreService.associaFacilitatoreAEnteSedeProgetto(enteSedeProgettoFacilitatoreRequest);
	}
	
	// Cancellazione o terminazione Associazione facilitatore a ente, sede, progetto a seconda dello stato del facilitatore
	@PostMapping(path = "cancellaOTerminaAssociazione/facilitatore")
	@ResponseStatus(value = HttpStatus.NO_CONTENT)
	public void cancellaOTerminaAssociazioneFacilitatoreAEnteSedeProgetto (
			@RequestBody @Valid final EnteSedeProgettoFacilitatoreRequest enteSedeProgettoFacilitatoreRequest) {
		this.enteSedeProgettoFacilitatoreService.cancellaOTerminaAssociazioneFacilitatoreAEnteSedeProgetto(enteSedeProgettoFacilitatoreRequest);
	}
	
	// Dettaglio sede
	@PostMapping(path = "/{idProgetto}/{idEnte}/{idSede}")
	@ResponseStatus(value = HttpStatus.OK)
	public SchedaSedeBean getSchedaSedeBysceltaProfilo (
			@PathVariable(value = "idProgetto") Long idProgetto,
			@PathVariable(value = "idEnte") 	Long idEnte,
			@PathVariable(value = "idSede") 	Long idSede,
			@RequestBody final SceltaProfiloParam sceltaProfiloParam) {
		if(!accessControServiceUtils.checkPermessoIdSede(sceltaProfiloParam, idSede)) {
			throw new EnteException(ERROR_MESSAGE_PERMESSO, CodiceErroreEnum.A02);
		}
		return this.sedeService.getSchedaSedeByIdProgettoAndIdEnteAndIdSede(idProgetto, idEnte, idSede);
	}
}