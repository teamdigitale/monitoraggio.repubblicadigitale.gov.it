package it.pa.repdgt.ente.restapi;

import java.io.ByteArrayInputStream;
import java.util.List;

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
import it.pa.repdgt.ente.service.EntePartnerService;
import it.pa.repdgt.ente.service.EnteService;
import it.pa.repdgt.ente.util.CSVUtil;
import it.pa.repdgt.shared.entity.EnteEntity;

@RestController
@RequestMapping(path = "ente")
public class EnteRestApi {
	@Autowired
	private EnteService enteService;
	@Autowired
	private EntePartnerService entePartnerService;
	@Autowired
	private EnteMapper enteMapper;

	// TOUCH POINT - 1.4.1 - Lista enti paginata
	// TOUCH POINT - 1.4.2 - Lista enti filtrata
	@PostMapping(path =  "/all")
	@ResponseStatus(value = HttpStatus.OK)
	public ListaEntiPaginatiResource getAllEntiPaginati(
			@RequestBody @Valid EntiPaginatiParam entiPaginatiParam,
			@RequestParam(name = "currPage", defaultValue = "0") Integer currPage,
			@RequestParam(name = "pageSize", defaultValue = "10") Integer pageSize) {
		Page<EnteDto> paginaEnti = this.enteService.getAllEntiPaginati(entiPaginatiParam, currPage, pageSize);
		return this.enteMapper.toResourcefrom(paginaEnti);
	}

	// TOUCH POINT - 2.2.3  - dettaglio anagrafica ente (ricerca per PIVA)
	// TOUCH POINT - 2.2.9  - dettaglio anagrafica ente (ricerca per PIVA)
	// TOUCH POINT - 2.2.12 - dettaglio anagrafica ente (ricerca per PIVA)
	@GetMapping(path =  "/cerca/piva/{partitaIva}")
	@ResponseStatus(value = HttpStatus.OK)
	public EnteResource cercaEnteByPartitaIva(@PathVariable(value = "partitaIva") String partitaIva) {
		EnteEntity ente = this.enteService.getEnteByPartitaIva(partitaIva);
		return this.enteMapper.toResourcefrom(ente);
	}

	// TOUCH POINT - 1.4.3 -  Lista profili per dropdown ente 
	@PostMapping(path = "/profili/dropdown")
	@ResponseStatus(value = HttpStatus.OK)
	public List<String> getAllProfiliEntiDropdown(
			@RequestBody @Valid EntiPaginatiParam entiPaginatiParam) {
		return this.enteService.getAllProfiliEntiDropdown(entiPaginatiParam);
	}

	// TOUCH POINT - 1.4.4 - Lista programmi per dropdown ente
	@PostMapping(path = "/programmi/dropdown")
	@ResponseStatus(value = HttpStatus.OK)
	public List<ProgrammaDto> getAllProgrammiDropdown(
			@RequestBody @Valid EntiPaginatiParam entiPaginatiParam) {
		return this.enteService.getAllProgrammiDropdown(entiPaginatiParam);
	}

	// TOUCH POINT - 1.4.5 - Lista progetti per dropdown ente
	@PostMapping(path = "/progetti/dropdown")
	@ResponseStatus(value = HttpStatus.OK)
	public List<ProgettoDto> getAllProgettiDropdown(
			@RequestBody @Valid EntiPaginatiParam entiPaginatiParam) {
		return this.enteService.getAllProgettiDropdown(entiPaginatiParam);
	}

	// TOUCH POINT - 5.1 - Scheda Ente
	@GetMapping(path = "/{idEnte}")
	@ResponseStatus(value = HttpStatus.OK)
	public SchedaEnteBean getSchedaEnteById(
			@PathVariable(value = "idEnte") Long idEnte) {
		return this.enteService.getSchedaEnteById(idEnte);
	}

	// TOUCH POINT - 2.1.5 - dettaglio ente gestore di un determinato programma
	@GetMapping(path = "/{idProgramma}/gestoreProgramma")
	@ResponseStatus(value = HttpStatus.OK)
	public SchedaEnteGestoreBean getSchedaEnteGestoreProgramma(
			@PathVariable(value = "idProgramma") Long idProgramma) {
		return this.enteService.getSchedaEnteGestoreProgrammaByIdProgramma(idProgramma);
	}

	// TOUCH POINT - 3.4 - dettaglio ente gestore di un determinato progetto
	@GetMapping(path = "/{idProgetto}/gestoreProgetto")
	@ResponseStatus(value = HttpStatus.OK)
	public SchedaEnteGestoreProgettoBean getSchedaEnteGestoreProgetto(
			@PathVariable(value = "idProgetto") Long idProgetto) {
		return this.enteService.getSchedaEnteGestoreProgettoByIdProgetto(idProgetto);
	}

	@GetMapping (path = "/{idProgetto}/partner/{idEnte}")
	@ResponseStatus(value = HttpStatus.OK)
	public SchedaEntePartnerBean getSchedaEntePartner(
			@PathVariable(value = "idProgetto") Long idProgetto,
			@PathVariable(value = "idEnte") Long idEnte) {
		return this.entePartnerService.getSchedaEntePartnerByIdProgettoAndIdEnte(idProgetto, idEnte);
	}

	// TOUCH-POINT 2.2.1 - Creazione ente 
	@PostMapping
	@ResponseStatus(value = HttpStatus.CREATED)
	public void creaNuovoEnte(@RequestBody @Valid NuovoEnteRequest nuovoEnteRequest) {
		EnteEntity enteEntity = this.enteMapper.toEntityFrom(nuovoEnteRequest);
		this.enteService.creaNuovoEnte(enteEntity);
	}

	// TOUCH-POINT 2.2.14B - Associa referente/delegato gestore programma
	@PostMapping(path = "/associa/referenteDelegato/gestoreProgramma")
	@ResponseStatus(code = HttpStatus.OK)
	public void associaReferenteODelegatoGestoreProgramma(
			@RequestBody @Valid ReferenteDelegatoGestoreProgrammaRequest referenteDelegatoGestoreProgrammaRequest ) {
		this.enteService.associaReferenteODelegatoGestoreProgramma(referenteDelegatoGestoreProgrammaRequest);
	}
	
	// TOUCH-POINT 2.2.14BX - Cancella o termina associazione referente/delegato gestore programma
	@PostMapping(path = "/cancellaOTerminaAssociazione/referenteDelegato/gestoreProgramma")
	@ResponseStatus(code = HttpStatus.NO_CONTENT)
	public void cancellaOTerminaAssociazioneReferenteODelegatoGestoreProgramma(
			@RequestBody @Valid ReferenteDelegatoGestoreProgrammaRequest referenteDelegatoGestoreProgrammaRequest) {
		this.enteService.cancellaOTerminaAssociazioneReferenteODelegatoGestoreProgramma(referenteDelegatoGestoreProgrammaRequest);
	}

	// TOUCH-POINT 2.2.14C - Associa referente/delegato gestore progetto
	@PostMapping(path = "/associa/referenteDelegato/gestoreProgetto")
	@ResponseStatus(code = HttpStatus.OK)
	public void associaReferenteODelegatoGestoreProgetto(
			@RequestBody @Valid ReferenteDelegatoGestoreProgettoRequest referenteDelegatoGestoreProgettoRequest ) {
		this.enteService.associaReferenteODelegatoGestoreProgetto(referenteDelegatoGestoreProgettoRequest);
	}
	
	// TOUCH-POINT 2.2.14CX - Cancella o termina associazione referente/delegato gestore progetto
	@PostMapping(path = "/cancellaOTerminaAssociazione/referenteDelegato/gestoreProgetto")
	@ResponseStatus(code = HttpStatus.NO_CONTENT)
	public void cancellaOTerminaAssociazioneReferenteODelegatoGestoreProgetto(
			@RequestBody @Valid ReferenteDelegatoGestoreProgettoRequest referenteDelegatoGestoreProgettoRequest) {
		this.enteService.cancellaOTerminaAssociazioneReferenteODelegatoGestoreProgetto(referenteDelegatoGestoreProgettoRequest);
	}

	// TOUCH-POINT 2.2.14D - Associa referente/delegato partner
	@PostMapping(path = "/associa/referenteDelegato/partner")
	@ResponseStatus(code = HttpStatus.OK)
	public void associaReferenteODelegatoPartner(
			@RequestBody @Valid ReferenteDelegatoPartnerRequest referenteDelegatoPartnerRequest ) {
		this.entePartnerService.associaReferenteODelegatoPartner(referenteDelegatoPartnerRequest);
	}
	
	// TOUCH-POINT 2.2.14DX - Cancella o termina associazione referente/delegato partner
	@PostMapping(path = "/cancellaOTerminaAssociazione/referenteDelegato/partner")
	@ResponseStatus(code = HttpStatus.NO_CONTENT)
	public void cancellaOTerminaAssociazioneReferenteODelegatoPartner(
			@RequestBody @Valid ReferenteDelegatoPartnerRequest referenteDelegatoPartnerRequest ) {
		this.entePartnerService.cancellaOTerminaAssociazioneReferenteODelegatoPartner(referenteDelegatoPartnerRequest);
	}

	// TOUCH-POINT 2.2.11 - Associa Ente a progetto come entePartner
	/**
	 * Questo metodo associa un ente partner all'ente gestore di un determinato progetto
	 * 
	 * */
	@PutMapping(path = "/partner/associa/{idEntePartner}/progetto/{idProgetto}")
	@ResponseStatus(code = HttpStatus.OK)
	public void associaEntePartnerPerProgetto(
			@PathVariable(value = "idEntePartner") Long idEntePartner,
			@PathVariable(value = "idProgetto") Long idProgetto) {
		this.entePartnerService.associaEntePartnerPerProgetto(idEntePartner, idProgetto);
	}

	//TOUCH-POINT 5.3 - Update Ente
	@PutMapping(path = "/{idEnte}")
	@ResponseStatus(code = HttpStatus.OK)
	public void aggiornaEnte(
			@RequestBody @Valid AggiornaEnteRequest aggiornaEnteRequest,
			@PathVariable(value = "idEnte") Long idEnte) {
		EnteEntity enteEntity = this.enteMapper.toEntityFrom(aggiornaEnteRequest);
		this.enteService.aggiornaEnte(enteEntity, idEnte);
	}
	
	//TOUCH-POINT 2.1.5 B - Modifica Ente Gestore Programma
		@PutMapping(path = "/{idEnte}/gestore/{idProgramma}")
		@ResponseStatus(code = HttpStatus.OK)
	public void modificaEnteGestoreProgramma(
			@RequestBody @Valid AggiornaEnteRequest aggiornaEnteRequest,
			@PathVariable(value = "idEnte") Long idEnte,
			@PathVariable(value = "idProgramma")   Long idProgramma) {
		EnteEntity enteEntity = this.enteMapper.toEntityFrom(aggiornaEnteRequest);
		this.enteService.modificaEnteGestoreProgramma(enteEntity, idEnte, idProgramma);
	}
		
	//TOUCH-POINT 3.4 B - Modifica Ente Gestore Progetto
		@PutMapping(path = "/{idEnte}/gestore/{idProgetto}")
		@ResponseStatus(code = HttpStatus.OK)
	public void modificaEnteGestoreProgetto(
			@RequestBody @Valid AggiornaEnteRequest aggiornaEnteRequest,
			@PathVariable(value = "idEnte") Long idEnte,
			@PathVariable(value = "idProgetto")   Long idProgetto) {
		EnteEntity enteEntity = this.enteMapper.toEntityFrom(aggiornaEnteRequest);
		this.enteService.modificaEnteGestoreProgetto(enteEntity, idEnte, idProgetto);
	}
	
	//TOUCH-POINT 5.2A - Elimina gestore programma 
	@DeleteMapping(path = "/{idEnte}/cancellagestoreprogramma/{idProgramma}")
	@ResponseStatus(code = HttpStatus.NO_CONTENT)
	public void cancellaGestoreProgramma(
			@PathVariable(value = "idEnte") Long idEnte,
			@PathVariable(value = "idProgramma") Long idProgramma) {
		this.enteService.cancellaGestoreProgramma(idEnte,idProgramma);
	}
	
	//TOUCH-POINT 5.2AX - Termina gestore programma 
	@PutMapping(path = "/{idEnte}/terminagestoreprogramma/{idProgramma}")
	@ResponseStatus(code = HttpStatus.OK)
	public void terminaGestoreProgramma(
			@PathVariable(value = "idEnte") Long idEnte,
			@PathVariable(value = "idProgramma") Long idProgramma) {
		this.enteService.terminaGestoreProgramma(idEnte,idProgramma);
	}
	
	//TOUCH-POINT 5.2B - Elimina gestore progetto 
	@DeleteMapping(path = "/{idEnte}/cancellagestoreprogetto/{idProgetto}")
	@ResponseStatus(code = HttpStatus.NO_CONTENT)
	public void cancellaGestoreProgetto(
			@PathVariable(value = "idEnte") Long idEnte,
			@PathVariable(value = "idProgetto") Long idProgetto) {
		this.enteService.cancellaGestoreProgetto(idEnte, idProgetto);
	}
	
	//TOUCH-POINT 5.2BX - Termina gestore progetto 
	@PutMapping(path = "/{idEnte}/terminagestoreprogetto/{idProgetto}")
	@ResponseStatus(code = HttpStatus.OK)
	public void terminaGestoreProgetto(
			@PathVariable(value = "idEnte") Long idEnte,
			@PathVariable(value = "idProgetto") Long idProgetto) throws Exception {
		this.enteService.terminaGestoreProgetto(idEnte, idProgetto);
	}

	//TOUCH-POINT 5.2C - Elimina ente partner da progetto
	//TOUCH-POINT 2.2.11 A - Elimina ente partner da progetto
	@DeleteMapping(path = "/{idEnte}/cancellaentepartner/{idProgetto}")
	@ResponseStatus(code = HttpStatus.NO_CONTENT)
	public void cancellaEntePartnerPerProgetto(
			@PathVariable(value = "idEnte") Long idEnte,
			@PathVariable(value = "idProgetto") Long idProgetto) {
		this.enteService.cancellaEntePartnerPerProgetto(idEnte,idProgetto);
	}
	
	//TOUCH-POINT 5.2CX - Termina ente partner da progetto
	@PutMapping(path = "/{idEnte}/terminaentepartner/{idProgetto}")
	@ResponseStatus(code = HttpStatus.OK)
	public void terminaEntePartnerPerProgetto(
			@PathVariable(value = "idEnte") Long idEnte,
			@PathVariable(value = "idProgetto") Long idProgetto) {
		this.enteService.terminaEntePartnerPerProgetto(idEnte,idProgetto);
	}

	// TOUCH-POINT 1.4.6 - Scarica lista enti in formato csv
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

	@PostMapping(path = "/partner/upload/{idProgetto}", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
	public List<EntePartnerUploadBean> uploadFileEntiPartner(
			@RequestPart MultipartFile file,
			@PathVariable(value = "idProgetto") Long idProgetto) {
		if (file == null || !CSVUtil.hasCSVFormat(file)) {
			throw new EnteException("il file non è valido"); 
		}
		return this.entePartnerService.caricaEntiPartner(file, idProgetto);
	}
}