package it.pa.repdgt.programmaprogetto.restapi;

import java.io.ByteArrayInputStream;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.List;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;

import org.apache.commons.csv.CSVFormat;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
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
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import it.pa.repdgt.programmaprogetto.bean.SchedaProgettoBean;
import it.pa.repdgt.programmaprogetto.mapper.ProgettoMapper;
import it.pa.repdgt.programmaprogetto.request.ProgettiParam;
import it.pa.repdgt.programmaprogetto.request.ProgettoFiltroRequest;
import it.pa.repdgt.programmaprogetto.request.ProgettoRequest;
import it.pa.repdgt.programmaprogetto.request.TerminaRequest;
import it.pa.repdgt.programmaprogetto.resource.CreaProgettoResource;
import it.pa.repdgt.programmaprogetto.resource.PaginaProgetti;
import it.pa.repdgt.programmaprogetto.resource.ProgettiLightResourcePaginati;
import it.pa.repdgt.programmaprogetto.resource.ProgrammaDropdownResource;
import it.pa.repdgt.programmaprogetto.service.ProgettoService;
import it.pa.repdgt.programmaprogetto.util.CSVProgettoUtil;
import it.pa.repdgt.shared.entity.ProgettoEntity;
import it.pa.repdgt.shared.restapi.param.SceltaProfiloParam;

@RestController
@RequestMapping(path = "/progetto")
public class ProgettoRestApi {
	@Autowired
	private ProgettoService progettoService;
	@Autowired
	private ProgettoMapper progettoMapper;
	
	// 3.1 - lista progetti paginata 
	@PostMapping(path = "/all")
	@ResponseStatus(value = HttpStatus.OK)
	public ProgettiLightResourcePaginati getAllProgettiPaginatiByRuolo(
			@RequestBody @Valid @NotNull(message = "Deve essere non null") ProgettiParam sceltaContestoParam,
			@RequestParam(name = "currPage", required = false, defaultValue = "0")  Integer currPage,
			@RequestParam(name = "pageSize", required = false, defaultValue = "10") Integer pageSize) {
		PaginaProgetti paginaProgetti = this.progettoService.getAllProgettiPaginati(sceltaContestoParam, currPage, pageSize, sceltaContestoParam.getFiltroRequest());
		ProgettiLightResourcePaginati listaPaginataProgettiResource = this.progettoMapper.toProgettiLightResourcePaginataConContatoreFrom(paginaProgetti);
		return listaPaginataProgettiResource;
	}
	
	// 3.2 - lista programmi per dropdown 
	@PostMapping(path = "/programmi/dropdown")
	@ResponseStatus(value = HttpStatus.OK)
	public List<ProgrammaDropdownResource> getAllProgrammiDropdownPerProgetti(
			@RequestBody @Valid @NotNull(message = "Deve essere non null") ProgettiParam sceltaContesto) {
		List<ProgrammaDropdownResource> programmiLightDropdown = this.progettoService.getAllProgrammiDropdownPerProgetti(sceltaContesto);
		return programmiLightDropdown;
	}
	
	// 3.3 - Lista policy per dropdown in elenco progetti
	@PostMapping(path = "/policies/programmi/dropdown")
	@ResponseStatus(value = HttpStatus.OK)
	public List<String> getAllPoliciesDropdownByRuolo(
			@RequestBody @Valid @NotNull(message = "Deve essere non null") ProgettiParam sceltaContestoParam) {
		List<String> policiesDropdown = this.progettoService.getAllPoliciesDropdownPerProgetti(sceltaContestoParam);
		return policiesDropdown;
	}
	
	// 3.4 - Lista Stati Progetto per dropdown
	@PostMapping(path = "/stati/dropdown")
	@ResponseStatus(value = HttpStatus.OK)
	public List<String> getAllStatiDropdownByRuolo(
			@RequestBody @Valid @NotNull(message = "Deve essere non null") ProgettiParam sceltaContestoParam) {
		List<String> statiDropdown = this.progettoService.getAllStatiDropdown(sceltaContestoParam, sceltaContestoParam.getFiltroRequest());
		return statiDropdown;
	}
	
	// Scheda Progetto
	@GetMapping(path = "/{idProgetto}")
	@ResponseStatus(value = HttpStatus.OK)
	public SchedaProgettoBean getSchedaProgettoById(@PathVariable(value = "idProgetto") Long idProgetto) {
		 return this.progettoService.getSchedaProgettoById(idProgetto);
	}
	
	// 3.5 - Scheda Progetto
	@PostMapping(path = "/{idProgetto}")
	@ResponseStatus(value = HttpStatus.OK)
	public SchedaProgettoBean getSchedaProgettoByIdByProfilo(
			@PathVariable(value = "idProgetto") Long idProgetto,
			@RequestBody SceltaProfiloParam sceltaProfiloParam) {
		return this.progettoService.getSchedaProgettoByIdAndSceltaProfilo(idProgetto, sceltaProfiloParam);
	}
	
	// 3.6 -  CRUD Crea Progetto + Assegnazione progetto a programma
	@PostMapping
	@ResponseStatus(value = HttpStatus.CREATED)
	public CreaProgettoResource creaNuovoProgetto(@RequestBody @Valid ProgettoRequest nuovoProgettoRequest,
			@RequestParam(value = "idProgramma") Long idProgramma) {
		ProgettoEntity progettoEntity = this.progettoMapper.toEntityFrom(nuovoProgettoRequest, idProgramma);
		return new CreaProgettoResource(this.progettoService.creaNuovoProgetto(progettoEntity).getId());
	}
	
	// 3.7 - Update Progetto
	@PutMapping(path = "/{idProgetto}")
	@ResponseStatus(value = HttpStatus.OK)
	public void aggiornaProgetto(@PathVariable(value = "idProgetto") Long idProgetto,
								 @RequestBody @Valid ProgettoRequest progettoRequest) {
		this.progettoService.aggiornaProgetto(progettoRequest, idProgetto);
	}

	// 3.8 - Associa Ente a Progetto come Gestore Progetto
	@PutMapping(path = "/{idProgetto}/assegna/enteGestore/{idEnteGestore}")
	@ResponseStatus(value = HttpStatus.OK)
	public void assegnaGestoreAlProgetto(
			@PathVariable(value = "idProgetto")    Long idProg, 
			@PathVariable(value = "idEnteGestore") Long idEnteGest) {
		this.progettoService.assegnaEnteGestoreProgetto(idProg, idEnteGest);
	}
	
	// 3.9 - Termina Progetto
	@PutMapping(path = "/termina/{idProgetto}")
	@ResponseStatus(value = HttpStatus.OK)
	public void terminaProgetto(
			@PathVariable(value = "idProgetto") Long idProgetto, 
			@RequestBody TerminaRequest terminaRequest) throws ParseException {
		SimpleDateFormat sdf= new SimpleDateFormat("dd-MM-yyyy");
		this.progettoService.terminaProgetto(idProgetto, sdf.parse(terminaRequest.getDataTerminazione()));
	}
	
	// 3.10 - Delete Progetto
	@DeleteMapping("/{idProgetto}")
	@ResponseStatus(value = HttpStatus.NO_CONTENT)
	public void cancellazioneProgetto(@PathVariable(value = "idProgetto") Long id){
		this.progettoService.cancellazioneProgetto(id);
	}
	
	// 3.11 - Attiva Progetto
	@PutMapping(path = "/attiva/{idProgetto}")
	@ResponseStatus(value = HttpStatus.OK)
	public void attivaProgetto(
			@PathVariable(value = "idProgetto") Long idProgetto) {
		this.progettoService.attivaProgetto(idProgetto);
	}
	
	// 3.12 - Scarica lista progetti in formato csv
	@PostMapping(path = "/download")
	public ResponseEntity<InputStreamResource> downloadListaCSVProgetti(
			@RequestBody @Valid @NotNull(message = "Deve essere non null") ProgettiParam sceltaContesto) {
		String codiceRuolo = sceltaContesto.getCodiceRuoloUtenteLoggato();
		String codiceFiscaleUtente = sceltaContesto.getCfUtenteLoggato();
		Long idProgramma = sceltaContesto.getIdProgramma();
		Long idProgetto = sceltaContesto.getIdProgetto();
		ProgettoFiltroRequest filtro = sceltaContesto.getFiltroRequest();
		
		List<ProgettoEntity> listaProgetti = this.progettoService.getProgettiByRuolo(codiceRuolo, codiceFiscaleUtente, idProgramma, idProgetto, filtro);
		ByteArrayInputStream byteArrayInputStream = CSVProgettoUtil.exportCSVProgetti(listaProgetti, CSVFormat.DEFAULT);
		InputStreamResource fileCSV = new InputStreamResource(byteArrayInputStream);
		
		return ResponseEntity.ok()
				.header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=progetti.csv")
				.contentType(MediaType.parseMediaType("application/csv"))
				.body(fileCSV);
	}
}