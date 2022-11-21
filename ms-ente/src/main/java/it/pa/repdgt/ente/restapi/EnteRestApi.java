package it.pa.repdgt.ente.restapi;

import java.io.ByteArrayInputStream;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;

import org.apache.commons.csv.CSVFormat;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import it.pa.repdgt.ente.bean.DettaglioEnteBean;
import it.pa.repdgt.ente.bean.EntePartnerUploadBean;
import it.pa.repdgt.ente.bean.SchedaEnteBean;
import it.pa.repdgt.ente.bean.SchedaEnteGestoreBean;
import it.pa.repdgt.ente.bean.SchedaEnteGestoreProgettoBean;
import it.pa.repdgt.ente.bean.SchedaEntePartnerBean;
import it.pa.repdgt.ente.dto.EnteDto;
import it.pa.repdgt.ente.dto.ProgettoDto;
import it.pa.repdgt.ente.dto.ProgrammaDto;
import it.pa.repdgt.ente.exception.EnteException;
import it.pa.repdgt.ente.mapper.EnteMapper;
import it.pa.repdgt.ente.request.AggiornaEnteRequest;
import it.pa.repdgt.ente.request.NuovoEnteRequest;
import it.pa.repdgt.ente.request.ReferenteDelegatoGestoreProgettoRequest;
import it.pa.repdgt.ente.request.ReferenteDelegatoGestoreProgrammaRequest;
import it.pa.repdgt.ente.request.ReferenteDelegatoPartnerRequest;
import it.pa.repdgt.ente.resource.EnteResource;
import it.pa.repdgt.ente.resource.ListaEntiPaginatiResource;
import it.pa.repdgt.ente.restapi.param.EntiPaginatiParam;
import it.pa.repdgt.ente.service.AccessControServiceUtils;
import it.pa.repdgt.ente.service.EntePartnerService;
import it.pa.repdgt.ente.service.EnteService;
import it.pa.repdgt.ente.util.CSVUtil;
import it.pa.repdgt.shared.entity.EnteEntity;
import it.pa.repdgt.shared.exception.CodiceErroreEnum;
import it.pa.repdgt.shared.restapi.param.SceltaProfiloParam;

@RestController
@RequestMapping(path = "ente")
public class EnteRestApi {
	@Autowired
	private EnteService enteService;
	@Autowired
	private EntePartnerService entePartnerService;
	@Autowired
	private AccessControServiceUtils accessControServiceUtils;
	@Autowired
	private EnteMapper enteMapper;
	
	private static final String ERROR_MESSAGE_PERMESSO = "Errore tentavo accesso a risorsa non permesso";

	// Lista enti paginata e filtrata
	@PostMapping(path =  "/all")
	@ResponseStatus(value = HttpStatus.OK)
	public ListaEntiPaginatiResource getAllEntiPaginati(
			@RequestBody @Valid EntiPaginatiParam entiPaginatiParam,
			@RequestParam(name = "currPage", defaultValue = "0") Integer currPage,
			@RequestParam(name = "pageSize", defaultValue = "10") Integer pageSize) {
		Page<EnteDto> paginaEnti = this.enteService.getAllEntiPaginati(entiPaginatiParam, currPage, pageSize);
		return this.enteMapper.toResourcefrom(paginaEnti);
	}

	// Dettaglio anagrafica ente (ricerca per criterioRicerca)
	@GetMapping(path =  "/cerca")
	@ResponseStatus(value = HttpStatus.OK)
	public List<EnteResource> cercaEntiByCriterioRicerca(@RequestParam(name = "criterioRicerca") String criterioRicerca) {
		List<EnteEntity> enti = this.enteService.getEntiByCriterioRicerca(criterioRicerca);
		return this.enteMapper.toResourceFrom(enti);
	}

	// Lista profili per dropdown ente 
	@PostMapping(path = "/profili/dropdown")
	@ResponseStatus(value = HttpStatus.OK)
	public List<String> getAllProfiliEntiDropdown(
			@RequestBody @Valid EntiPaginatiParam entiPaginatiParam) {
		return this.enteService.getAllProfiliEntiDropdown(entiPaginatiParam);
	}

	// Lista programmi per dropdown ente
	@PostMapping(path = "/programmi/dropdown")
	@ResponseStatus(value = HttpStatus.OK)
	public List<ProgrammaDto> getAllProgrammiDropdown(
			@RequestBody @Valid EntiPaginatiParam entiPaginatiParam) {
		return this.enteService.getAllProgrammiDropdown(entiPaginatiParam);
	}

	// Lista progetti per dropdown ente
	@PostMapping(path = "/progetti/dropdown")
	@ResponseStatus(value = HttpStatus.OK)
	public List<ProgettoDto> getAllProgettiDropdown(
			@RequestBody @Valid EntiPaginatiParam entiPaginatiParam) {
		return this.enteService.getAllProgettiDropdown(entiPaginatiParam);
	}
	
	// Scheda Ente
	@PostMapping(path = "/{idEnte}")
	@ResponseStatus(value = HttpStatus.OK)
	public SchedaEnteBean getSchedaEnteByIdAndProfilo(
			@PathVariable(value = "idEnte") Long idEnte,
			@RequestBody @Valid SceltaProfiloParam sceltaProfiloParam) {
		if(!accessControServiceUtils.checkPermessoIdEnte(sceltaProfiloParam, idEnte))
			throw new EnteException(ERROR_MESSAGE_PERMESSO, CodiceErroreEnum.A02);
		return this.enteService.getSchedaEnteById(idEnte);
	}
	
	// Scheda Ente
	@GetMapping(path = "/light/{idEnte}")
	@ResponseStatus(value = HttpStatus.OK)
	public DettaglioEnteBean getSchedaEnteLight(
			@PathVariable(value = "idEnte") Long idEnte ) {
		return this.enteService.getSchedaEnteLight(idEnte);
	}
		
	// Dettaglio ente gestore di un determinato programma
	@PostMapping(path = "/gestoreProgramma/{idProgramma}")
	@ResponseStatus(value = HttpStatus.OK)
	public SchedaEnteGestoreBean getSchedaEnteGestoreProgrammaAndProfilo(
			@PathVariable(value = "idProgramma") Long idProgramma,
			@RequestBody @Valid SceltaProfiloParam sceltaProfiloParam) {
		if(!accessControServiceUtils.checkPermessoIdProgramma(sceltaProfiloParam, idProgramma))
			throw new EnteException(ERROR_MESSAGE_PERMESSO, CodiceErroreEnum.A02);
		return this.enteService.getSchedaEnteGestoreProgrammaByIdProgramma(sceltaProfiloParam.getCodiceRuoloUtenteLoggato(), idProgramma);
	}

	// Dettaglio ente gestore di un determinato progetto
	@PostMapping(path = "/gestoreProgetto/{idProgetto}")
	@ResponseStatus(value = HttpStatus.OK)
	public SchedaEnteGestoreProgettoBean getSchedaEnteGestoreProgettoBySceltaProfilo(
			@PathVariable(value = "idProgetto") Long idProgetto,
			@RequestBody @Valid EntiPaginatiParam entiPaginatiParam) {
		if(!accessControServiceUtils.checkPermessoIdProgetto(entiPaginatiParam, idProgetto))
			throw new EnteException(ERROR_MESSAGE_PERMESSO, CodiceErroreEnum.A02);
		return this.enteService.getSchedaEnteGestoreProgettoByIdProgettoAndSceltaProfilo(entiPaginatiParam.getCodiceRuoloUtenteLoggato(), idProgetto, entiPaginatiParam);
	}

	// Dettaglio ente partner di un determinato progetto
	@PostMapping (path = "/partner/{idProgetto}/{idEnte}")
	@ResponseStatus(value = HttpStatus.OK)
	public SchedaEntePartnerBean getSchedaEntePartnerBySceltaProfilo(
			@PathVariable(value = "idProgetto") Long idProgetto,
			@PathVariable(value = "idEnte") Long idEnte,
			@RequestBody @Valid EntiPaginatiParam entiPaginatiParam) {
		if(!accessControServiceUtils.checkPermessoIdProgetto(entiPaginatiParam, idProgetto) || 
				!accessControServiceUtils.checkPermessoIdEnte(entiPaginatiParam, idEnte))
			throw new EnteException(ERROR_MESSAGE_PERMESSO, CodiceErroreEnum.A02);
		return this.entePartnerService.getSchedaEntePartnerByIdProgettoAndIdEnteAndSceltaProfilo(entiPaginatiParam.getCodiceRuoloUtenteLoggato(), idProgetto, idEnte, entiPaginatiParam);
	}

	// Creazione ente 
	@PostMapping
	@ResponseStatus(value = HttpStatus.CREATED)
	public EnteEntity creaNuovoEnte(@RequestBody @Valid NuovoEnteRequest nuovoEnteRequest) {
		EnteEntity enteEntity = this.enteMapper.toEntityFrom(nuovoEnteRequest);
		return this.enteService.creaNuovoEnte(enteEntity);
	}

	// Associa referente/delegato gestore programma
	@PostMapping(path = "/associa/referenteDelegato/gestoreProgramma")
	@ResponseStatus(code = HttpStatus.OK)
	public void associaReferenteODelegatoGestoreProgramma(
			@RequestBody @Valid ReferenteDelegatoGestoreProgrammaRequest referenteDelegatoGestoreProgrammaRequest ) {
		if(!accessControServiceUtils.checkPermessoIdProgramma(referenteDelegatoGestoreProgrammaRequest, referenteDelegatoGestoreProgrammaRequest.getIdProgrammaGestore()))
			throw new EnteException(ERROR_MESSAGE_PERMESSO, CodiceErroreEnum.A02);
		this.enteService.associaReferenteODelegatoGestoreProgramma(referenteDelegatoGestoreProgrammaRequest);
	}
	
	// Cancella o termina associazione referente/delegato gestore programma
	@PostMapping(path = "/cancellaOTerminaAssociazione/referenteDelegato/gestoreProgramma")
	@ResponseStatus(code = HttpStatus.NO_CONTENT)
	public void cancellaOTerminaAssociazioneReferenteODelegatoGestoreProgramma(
			@RequestBody @Valid ReferenteDelegatoGestoreProgrammaRequest referenteDelegatoGestoreProgrammaRequest) {
		if(!accessControServiceUtils.checkPermessoIdProgramma(referenteDelegatoGestoreProgrammaRequest, referenteDelegatoGestoreProgrammaRequest.getIdProgrammaGestore()))
			throw new EnteException(ERROR_MESSAGE_PERMESSO, CodiceErroreEnum.A02);
		this.enteService.cancellaOTerminaAssociazioneReferenteODelegatoGestoreProgramma(referenteDelegatoGestoreProgrammaRequest);
	}

	// Associa referente/delegato gestore progetto
	@PostMapping(path = "/associa/referenteDelegato/gestoreProgetto")
	@ResponseStatus(code = HttpStatus.OK)
	public void associaReferenteODelegatoGestoreProgetto(
			@RequestBody @Valid ReferenteDelegatoGestoreProgettoRequest referenteDelegatoGestoreProgettoRequest ) {
		if(!accessControServiceUtils.checkPermessoIdProgetto(referenteDelegatoGestoreProgettoRequest, referenteDelegatoGestoreProgettoRequest.getIdProgettoGestore()))
			throw new EnteException(ERROR_MESSAGE_PERMESSO, CodiceErroreEnum.A02);
		this.enteService.associaReferenteODelegatoGestoreProgetto(referenteDelegatoGestoreProgettoRequest);
	}
	
	// Cancella o termina associazione referente/delegato gestore progetto
	@PostMapping(path = "/cancellaOTerminaAssociazione/referenteDelegato/gestoreProgetto")
	@ResponseStatus(code = HttpStatus.NO_CONTENT)
	public void cancellaOTerminaAssociazioneReferenteODelegatoGestoreProgetto(
			@RequestBody @Valid ReferenteDelegatoGestoreProgettoRequest referenteDelegatoGestoreProgettoRequest) {
		if(!accessControServiceUtils.checkPermessoIdProgetto(referenteDelegatoGestoreProgettoRequest, referenteDelegatoGestoreProgettoRequest.getIdProgettoGestore()))
			throw new EnteException(ERROR_MESSAGE_PERMESSO, CodiceErroreEnum.A02);
		this.enteService.cancellaOTerminaAssociazioneReferenteODelegatoGestoreProgetto(referenteDelegatoGestoreProgettoRequest);
	}

	// Associa referente/delegato partner
	@PostMapping(path = "/associa/referenteDelegato/partner")
	@ResponseStatus(code = HttpStatus.OK)
	public void associaReferenteODelegatoPartner(
			@RequestBody @Valid ReferenteDelegatoPartnerRequest referenteDelegatoPartnerRequest ) {
		if(!accessControServiceUtils.checkPermessoIdProgetto(referenteDelegatoPartnerRequest, referenteDelegatoPartnerRequest.getIdProgettoDelPartner()))
			throw new EnteException(ERROR_MESSAGE_PERMESSO, CodiceErroreEnum.A02);
		this.entePartnerService.associaReferenteODelegatoPartner(referenteDelegatoPartnerRequest);
	}
	
	// Cancella o termina associazione referente/delegato partner
	@PostMapping(path = "/cancellaOTerminaAssociazione/referenteDelegato/partner")
	@ResponseStatus(code = HttpStatus.NO_CONTENT)
	public void cancellaOTerminaAssociazioneReferenteODelegatoPartner(
			@RequestBody @Valid ReferenteDelegatoPartnerRequest referenteDelegatoPartnerRequest ) {
		if(!accessControServiceUtils.checkPermessoIdProgetto(referenteDelegatoPartnerRequest, referenteDelegatoPartnerRequest.getIdProgettoDelPartner()))
			throw new EnteException(ERROR_MESSAGE_PERMESSO, CodiceErroreEnum.A02);
		this.entePartnerService.cancellaOTerminaAssociazioneReferenteODelegatoPartner(referenteDelegatoPartnerRequest);
	}

	// Associa Ente a progetto come entePartner
	@PutMapping(path = "/partner/associa/{idEntePartner}/progetto/{idProgetto}")
	@ResponseStatus(code = HttpStatus.OK)
	public void associaEntePartnerPerProgetto(
			@PathVariable(value = "idEntePartner") Long idEntePartner,
			@PathVariable(value = "idProgetto") Long idProgetto,
			@RequestBody SceltaProfiloParam sceltaProfilo) {
		if(!accessControServiceUtils.checkPermessoIdProgetto(sceltaProfilo, idProgetto))
			throw new EnteException(ERROR_MESSAGE_PERMESSO, CodiceErroreEnum.A02);
		this.entePartnerService.associaEntePartnerPerProgetto(idEntePartner, idProgetto);
	}

	// Update Ente
	@PutMapping(path = "/{idEnte}")
	@ResponseStatus(code = HttpStatus.OK)
	public void aggiornaEnte(
			@RequestBody @Valid AggiornaEnteRequest aggiornaEnteRequest,
			@PathVariable(value = "idEnte") Long idEnte) {
//		if(!accessControServiceUtils.checkPermessoIdEnte(aggiornaEnteRequest, idEnte))
//			throw new EnteException(ERROR_MESSAGE_PERMESSO, CodiceErroreEnum.A02);
		EnteEntity enteEntity = this.enteMapper.toEntityFrom(aggiornaEnteRequest);
		this.enteService.aggiornaEnte(enteEntity, idEnte);
	}
	
	// Modifica Ente Gestore Programma
		@PutMapping(path = "/{idEnte}/gestoreProgramma/{idProgramma}")
		@ResponseStatus(code = HttpStatus.OK)
	public void modificaEnteGestoreProgramma(
			@RequestBody @Valid AggiornaEnteRequest aggiornaEnteRequest,
			@PathVariable(value = "idEnte") Long idEnte,
			@PathVariable(value = "idProgramma")   Long idProgramma) {
			if(!accessControServiceUtils.checkPermessoIdProgramma(aggiornaEnteRequest, idProgramma))
				throw new EnteException(ERROR_MESSAGE_PERMESSO, CodiceErroreEnum.A02);
		EnteEntity enteEntity = this.enteMapper.toEntityFrom(aggiornaEnteRequest);
		this.enteService.modificaEnteGestoreProgramma(enteEntity, idEnte, idProgramma);
	}
		
	// Modifica Ente Gestore Progetto
		@PutMapping(path = "/{idEnte}/gestoreProgetto/{idProgetto}")
		@ResponseStatus(code = HttpStatus.OK)
	public void modificaEnteGestoreProgetto(
			@RequestBody @Valid AggiornaEnteRequest aggiornaEnteRequest,
			@PathVariable(value = "idEnte") Long idEnte,
			@PathVariable(value = "idProgetto")   Long idProgetto) {
		if(!accessControServiceUtils.checkPermessoIdProgetto(aggiornaEnteRequest, idProgetto))
				throw new EnteException(ERROR_MESSAGE_PERMESSO, CodiceErroreEnum.A02);
		EnteEntity enteEntity = this.enteMapper.toEntityFrom(aggiornaEnteRequest);
		this.enteService.modificaEnteGestoreProgetto(enteEntity, idEnte, idProgetto);
	}
	
	// Elimina gestore programma 
	@DeleteMapping(path = "/{idEnte}/cancellagestoreprogramma/{idProgramma}")
	@ResponseStatus(code = HttpStatus.NO_CONTENT)
	public void cancellaGestoreProgramma(
			@PathVariable(value = "idEnte") Long idEnte,
			@PathVariable(value = "idProgramma") Long idProgramma,
			@RequestBody SceltaProfiloParam sceltaProfilo) {
		if(!accessControServiceUtils.checkPermessoIdProgramma(sceltaProfilo, idProgramma))
			throw new EnteException(ERROR_MESSAGE_PERMESSO, CodiceErroreEnum.A02);
		this.enteService.cancellaGestoreProgramma(idEnte,idProgramma);
	}
	
	// Termina gestore programma 
	@PutMapping(path = "/{idEnte}/terminagestoreprogramma/{idProgramma}")
	@ResponseStatus(code = HttpStatus.OK)
	public void terminaGestoreProgramma(
			@PathVariable(value = "idEnte") Long idEnte,
			@PathVariable(value = "idProgramma") Long idProgramma,
			@RequestBody SceltaProfiloParam sceltaProfilo) {
		if(!accessControServiceUtils.checkPermessoIdProgramma(sceltaProfilo, idProgramma))
			throw new EnteException(ERROR_MESSAGE_PERMESSO, CodiceErroreEnum.A02);
		this.enteService.terminaGestoreProgramma(idEnte,idProgramma);
	}
	
	// Elimina gestore progetto 
	@DeleteMapping(path = "/{idEnte}/cancellagestoreprogetto/{idProgetto}")
	@ResponseStatus(code = HttpStatus.NO_CONTENT)
	public void cancellaGestoreProgetto(
			@PathVariable(value = "idEnte") Long idEnte,
			@PathVariable(value = "idProgetto") Long idProgetto,
			@RequestBody SceltaProfiloParam sceltaProfilo) {
		if(!accessControServiceUtils.checkPermessoIdProgetto(sceltaProfilo, idProgetto))
			throw new EnteException(ERROR_MESSAGE_PERMESSO, CodiceErroreEnum.A02);
		this.enteService.cancellaGestoreProgetto(idEnte, idProgetto);
	}
	
	// Termina gestore progetto 
	@PutMapping(path = "/{idEnte}/terminagestoreprogetto/{idProgetto}")
	@ResponseStatus(code = HttpStatus.OK)
	public void terminaGestoreProgetto(
			@PathVariable(value = "idEnte") Long idEnte,
			@PathVariable(value = "idProgetto") Long idProgetto,
			@RequestBody SceltaProfiloParam sceltaProfilo
			) throws Exception {
		if(!accessControServiceUtils.checkPermessoIdProgetto(sceltaProfilo, idProgetto))
			throw new EnteException(ERROR_MESSAGE_PERMESSO, CodiceErroreEnum.A02);
		this.enteService.terminaGestoreProgetto(idEnte, idProgetto);
	}

	// Elimina ente partner da progetto
	@DeleteMapping(path = "/{idEnte}/cancellaentepartner/{idProgetto}")
	@ResponseStatus(code = HttpStatus.NO_CONTENT)
	public void cancellaEntePartnerPerProgetto(
			@PathVariable(value = "idEnte") Long idEnte,
			@PathVariable(value = "idProgetto") Long idProgetto,
			@RequestBody SceltaProfiloParam sceltaProfilo) {
		if(!accessControServiceUtils.checkPermessoIdProgetto(sceltaProfilo, idProgetto))
			throw new EnteException(ERROR_MESSAGE_PERMESSO, CodiceErroreEnum.A02);
		this.enteService.cancellaEntePartnerPerProgetto(idEnte,idProgetto);
	}
	
	// Termina ente partner da progetto
	@PutMapping(path = "/{idEnte}/terminaentepartner/{idProgetto}")
	@ResponseStatus(code = HttpStatus.OK)
	public void terminaEntePartnerPerProgetto(
			@PathVariable(value = "idEnte") Long idEnte,
			@PathVariable(value = "idProgetto") Long idProgetto,
			@RequestBody SceltaProfiloParam sceltaProfilo) {
		if(!accessControServiceUtils.checkPermessoIdProgetto(sceltaProfilo, idProgetto))
			throw new EnteException(ERROR_MESSAGE_PERMESSO, CodiceErroreEnum.A02);
		this.enteService.terminaEntePartnerPerProgetto(idEnte,idProgetto);
	}

	// Scarica lista enti in formato csv
	@PostMapping(path = "/download")
	public ResponseEntity<InputStreamResource> downloadListaCSVEnti(@RequestBody @Valid EntiPaginatiParam entiPaginatiParam) {
		List<EnteDto> listaEntiDto = this.enteService.getAllEntiByCodiceRuoloAndIdProgramma(entiPaginatiParam);
		List<EnteDto> listaEntiDtoAggregati = this.enteService.aggregaEntiUguali(listaEntiDto);
		ByteArrayInputStream byteArrayInputStream = CSVUtil.exportCSVEnti(listaEntiDtoAggregati, CSVFormat.DEFAULT);
		InputStreamResource fileCSV = new InputStreamResource(byteArrayInputStream);

		return ResponseEntity.ok()
				.header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=enti.csv")
				.contentType(MediaType.parseMediaType("application/csv"))
				.body(fileCSV);
	}

	// Upload caricamento lista enti partner a progetto
	@PostMapping(path = "/partner/upload/{idPr}", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
	public List<EntePartnerUploadBean> uploadFileEntiPartner(
			@RequestPart MultipartFile file,
			@PathVariable(value = "idPr") Long idProgetto,
			@ModelAttribute SceltaProfiloParam sceltaProfilo,
			HttpServletRequest request
			) {
		sceltaProfilo.setCfUtenteLoggato(request.getAttribute("cfUtenteLoggato").toString());
		sceltaProfilo.setCodiceRuoloUtenteLoggato(request.getAttribute("codiceRuoloUtenteLoggato").toString());
		if(!accessControServiceUtils.checkPermessoIdProgetto(sceltaProfilo, idProgetto))
			throw new EnteException(ERROR_MESSAGE_PERMESSO, CodiceErroreEnum.A02);
		if (file == null || !CSVUtil.hasCSVFormat(file)) {
			throw new EnteException("il file non è valido", CodiceErroreEnum.EN02); 
		}
		return this.entePartnerService.caricaEntiPartner(file, idProgetto);
	}
}