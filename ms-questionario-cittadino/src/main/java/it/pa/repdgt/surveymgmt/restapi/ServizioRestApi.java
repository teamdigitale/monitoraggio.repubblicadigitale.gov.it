package it.pa.repdgt.surveymgmt.restapi;

import java.io.ByteArrayInputStream;
import java.util.List;

import javax.validation.Valid;
import javax.validation.constraints.Pattern;

import org.apache.commons.csv.CSVFormat;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import it.pa.repdgt.shared.entity.ServizioEntity;
import it.pa.repdgt.surveymgmt.bean.SchedaDettaglioServizioBean;
import it.pa.repdgt.surveymgmt.mapper.ServizioMapper;
import it.pa.repdgt.surveymgmt.param.FiltroListaServiziParam;
import it.pa.repdgt.surveymgmt.param.ProfilazioneParam;
import it.pa.repdgt.surveymgmt.projection.EnteProjection;
import it.pa.repdgt.surveymgmt.projection.SedeProjection;
import it.pa.repdgt.surveymgmt.request.ServizioRequest;
import it.pa.repdgt.surveymgmt.resource.ServiziPaginatiResource;
import it.pa.repdgt.surveymgmt.resource.ServizioResource;
import it.pa.repdgt.surveymgmt.service.ServizioService;
import it.pa.repdgt.surveymgmt.service.ServizioSqlService;
import it.pa.repdgt.surveymgmt.util.CSVServizioUtil;

@RestController
@RequestMapping(path = "servizio")
@Validated
public class ServizioRestApi {
	@Autowired
	private ServizioMapper servizioMapper;
	@Autowired
	private ServizioService servizioService;
	@Autowired
	private ServizioSqlService servizioSqlService;

	/***
	 * Restituisce L'elenco dei Servizi paginati,
	 * in base ai filtri richiesti e alla profilazione dell'utente loggatosi. 
	 * 
	 * */
	// TOUCH POINT - 9.1.1
	@PostMapping(path = "/all")	
	@ResponseStatus(value = HttpStatus.OK)
	public ServiziPaginatiResource getAllServiziPaginatiByProfilaRzioneUtenteLoggatoAndFiltri(
			@RequestBody @Valid final ProfilazioneParam profilazioneParam,
			@RequestParam(name = "criterioRicerca", required = false) final String criterioRicercaFiltro,
			@RequestParam(name = "tipologiaServizio", required = false) final List<String> tipologieServiziFiltro,
			@RequestParam(name = "stato",       required = false)  final List<String> statiFiltro,
			@RequestParam(name = "currPage", defaultValue = "0")  final String currPage,
			@RequestParam(name = "pageSize", defaultValue = "10") final String pageSize) {
		final FiltroListaServiziParam filtroListaServiziParam = new FiltroListaServiziParam(
				criterioRicercaFiltro,
				tipologieServiziFiltro, 
				statiFiltro
			);
		final Pageable pagina = PageRequest.of(Integer.parseInt(currPage), Integer.parseInt(pageSize));
		final Page<ServizioEntity> paginaServizio = this.servizioService.getAllServiziPaginatiByProfilazioneAndFiltri(
				profilazioneParam, 
				filtroListaServiziParam, 
				pagina
			);
		final List<ServizioResource> serviziResource = this.servizioMapper.toResourceFrom(paginaServizio.getContent());
		return new ServiziPaginatiResource(serviziResource, paginaServizio.getTotalPages(), paginaServizio.getTotalElements());
	}
	
	/***
	 * Recupera i dati da mostrare nella scheda dettaglio servizio a partire dall'id del servizio
	 * 
	 * */
	// TOUCH POINT - 9.1.8
	@GetMapping(path = "{id}/schedaDettaglio")
	@ResponseStatus(value = HttpStatus.OK)
	public SchedaDettaglioServizioBean getSchedaDettaglioServizioById(@PathVariable(value = "id") final Long idServizio) {
		return this.servizioService.getSchedaDettaglioServizio(idServizio);
	}
	
	/***
	 * Creazione di un nuovo servizio
	 * 
	 * */
	// TOUCH POINT - 9.1.3
	@PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
	@ResponseStatus(value = HttpStatus.CREATED)
	public void creaServizio(@RequestBody @Valid final ServizioRequest servizioRequest) {
		this.servizioService.creaServizio(servizioRequest);
	}
	
	/***
	 * Modifica di un servizio a partire dall suo id
	 * 
	 * */
	// TOUCH POINT - 9.1.4
	@PutMapping(path = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
	@ResponseStatus(value = HttpStatus.OK)
	public void aggiornaServizioById(
			@PathVariable(value = "id") final Long idServizio,
			@RequestBody @Valid final ServizioRequest servizioDaAggiornareRequest) {
		this.servizioService.aggiornaServizio(idServizio, servizioDaAggiornareRequest);
	}
	
	/**
	 * Recupera tutte le 'tipolgie servizio' da mostrare nella dropdown dei filtri per i servizi
	 * 
	 * */
	@PostMapping(path = "/tipologiaServizio/dropdown")
	@ResponseStatus(value = HttpStatus.OK)
	public List<String> getAllTipologiaServizioFiltroDropdown(
		@RequestParam(name = "criterioRicerca", required = false) final String criterioRicercaFiltro,
		@RequestParam(name = "stato",           required = false) final List<String> statiFiltro,
		@RequestBody @Valid final ProfilazioneParam profilazioneParam) {
		final FiltroListaServiziParam filtroFiltroListaServiziParam = new FiltroListaServiziParam();
		filtroFiltroListaServiziParam.setCriterioRicerca(criterioRicercaFiltro);
		filtroFiltroListaServiziParam.setStatiServizio(statiFiltro);
		return this.servizioService.getAllTipologiaServizioFiltroDropdown(
				profilazioneParam,
				filtroFiltroListaServiziParam
			);
	}
	
	/**
	 * Recupera gli stati servizio da mostrare nella dropdown dei filtri per i servizi
	 * 
	 * */
	// TOUCH POINT - 9.1.2
	@PostMapping(path = "/stati/dropdown")
	@ResponseStatus(value = HttpStatus.OK)
	public List<String> getAllStatiFiltroDropdown(
		@RequestParam(name = "criterioRicerca",   required = false) final String criterioRicercaFiltro,
		@RequestParam(name = "tipologiaServizio", required = false) final List<String> tipologieServiziFiltro,
		@RequestBody @Valid final ProfilazioneParam profilazioneParam) {
		final FiltroListaServiziParam filtroFiltroListaServiziParam = new FiltroListaServiziParam();
		filtroFiltroListaServiziParam.setCriterioRicerca(criterioRicercaFiltro);
		filtroFiltroListaServiziParam.setTipologieServizi(tipologieServiziFiltro);
		return this.servizioService.getAllStatiServizioFiltroDropdown(
				profilazioneParam,
				filtroFiltroListaServiziParam
			);
	}
	
	/**
	 * Recupera gli enti per popolare dropdown selezione ente servizio
	 * 
	 * */
	// TOUCH POINT - 9.1.6
	@PostMapping(path = "/facilitatore/enti/dropdown")
	@ResponseStatus(value = HttpStatus.OK)
	public List<EnteProjection> getEntiByFacilitatore(@RequestBody @Valid final ProfilazioneParam profilazioneParam) {
		return this.servizioSqlService.getEntiByFacilitatore(profilazioneParam);
	}
	
	/**
	 * Recupera tutte le sedi per popolare dropdown selezione sede servizio
	 * 
	 * */
	// TOUCH POINT - 9.1.7
	@PostMapping(path = "/facilitatore/sedi/dropdown")
	@ResponseStatus(value = HttpStatus.OK)
	public List<SedeProjection> getSediByFacilitatore(@RequestBody @Valid final ProfilazioneParam profilazioneParam) {
		return this.servizioSqlService.getSediByFacilitatore(profilazioneParam);
	}
	
	/**
	 * Scarica lista elenco Servizi,
	 * in base ai filtri richiesti e alla profilazione dell'utente loggatosi
	 * 
	 * */
	// TOUCH POINT - 9.1.9
	@PostMapping(path = "/download")
	@ResponseStatus(value = HttpStatus.OK)
	public ResponseEntity<InputStreamResource> downloadCSVSElencoServizi(
			@RequestParam(name = "criterioRicerca",   required = false) final String criterioRicercaFiltro,
			@RequestParam(name = "tipologiaServizio", required = false) final List<String> tipologieServiziFiltro,
			@RequestParam(name = "stato",             required = false) final List<String> statiFiltro,
			@RequestBody @Valid final ProfilazioneParam profilazioneParam) {
		final FiltroListaServiziParam filtroListaServiziParam = new FiltroListaServiziParam(
				criterioRicercaFiltro,
				tipologieServiziFiltro,
				statiFiltro
			);
		final List<ServizioEntity> serviziEntity = this.servizioService.getAllServiziByProfilazioneUtenteLoggatoAndFiltri(
				profilazioneParam, 
				filtroListaServiziParam
			);
		final List<ServizioResource> serviziResource = this.servizioMapper.toResourceFrom(serviziEntity);
		final ByteArrayInputStream byteArrayInputStream = CSVServizioUtil.exportCSVServizi(serviziResource, CSVFormat.DEFAULT);
		final InputStreamResource fileCSVCreato = new InputStreamResource(byteArrayInputStream);
		return ResponseEntity.ok()
				.header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=elenco-servizi.csv")
				.contentType(MediaType.parseMediaType("application/csv"))
				.body(fileCSVCreato);
	}
	
	/***
	 * Eliminazione di un servizio a partire dall suo id
	 * 
	 * */
	// TOUCH POINT - 9.1.5
	@DeleteMapping(path = "/{id}")
	@ResponseStatus(value = HttpStatus.NO_CONTENT)
	public void eliminaServizioById(@PathVariable(value = "id") final Long idServizio) {
		this.servizioService.eliminaServizio(idServizio);
	}
} 