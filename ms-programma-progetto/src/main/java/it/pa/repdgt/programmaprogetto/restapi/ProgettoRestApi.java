package it.pa.repdgt.programmaprogetto.restapi;

import java.io.ByteArrayInputStream;
import java.util.List;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;

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
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import it.pa.repdgt.programmaprogetto.bean.SchedaProgettoBean;
import it.pa.repdgt.programmaprogetto.mapper.ProgettoMapper;
import it.pa.repdgt.programmaprogetto.request.NuovoProgettoRequest;
import it.pa.repdgt.programmaprogetto.request.ProgettiParam;
import it.pa.repdgt.programmaprogetto.request.ProgettoFiltroRequest;
import it.pa.repdgt.programmaprogetto.resource.ProgettiLightResourcePaginati;
import it.pa.repdgt.programmaprogetto.resource.ProgrammaDropdownResource;
import it.pa.repdgt.programmaprogetto.service.ProgettoService;
import it.pa.repdgt.programmaprogetto.util.CSVProgettoUtil;
import it.pa.repdgt.shared.entity.ProgettoEntity;

@RestController
@RequestMapping(path = "/progetto")
public class ProgettoRestApi {
	@Autowired
	private ProgettoService progettoService;
	@Autowired
	private ProgettoMapper progettoMapper;
	
	// TOUCH POINT - 1.2.1 - 1.2.2 - lista progetti paginata 
	@PostMapping(path = "/all")
	@ResponseStatus(value = HttpStatus.OK)
	public ProgettiLightResourcePaginati getAllProgettiPaginatiByRuolo(
			@RequestBody @Valid @NotNull ProgettiParam sceltaContesto,
			@RequestParam(name = "currPage", defaultValue = "0") Integer currPage,
			@RequestParam(name = "pageSize", defaultValue = "10") Integer pageSize) {
		Page<ProgettoEntity> paginaProgetti = this.progettoService.getAllProgettiPaginati(sceltaContesto, currPage, pageSize, sceltaContesto.getFiltroRequest());
		ProgettiLightResourcePaginati listaPaginataProgettiResource = this.progettoMapper.toProgettiLightResourcePaginataConContatoreFrom(paginaProgetti);
		return listaPaginataProgettiResource;
	}
	
	// TOUCH POINT - 1.2.6 - lista programmi per dropdown 
	@PostMapping(path = "/programmi/dropdown")
	@ResponseStatus(value = HttpStatus.OK)
	public List<ProgrammaDropdownResource> getAllProgrammiDropdownPerProgetti(
			@RequestBody @Valid @NotNull ProgettiParam sceltaContesto) {
		List<ProgrammaDropdownResource> programmiLightDropdown = this.progettoService.getAllProgrammiDropdownPerProgetti(sceltaContesto);
		return programmiLightDropdown;
	}
	
	// TOUCH POINT - 1.2.5 - Lista policy per dropdown in elenco progetti
	@PostMapping(path = "/policies/programmi/dropdown")
	@ResponseStatus(value = HttpStatus.OK)
	public List<String> getAllPoliciesDropdownByRuolo(
			@RequestBody @Valid @NotNull ProgettiParam sceltaContesto) {
		List<String> policiesDropdown = this.progettoService.getAllPoliciesDropdownPerProgetti(sceltaContesto);
		return policiesDropdown;
	}
	
	// TOUCH POINT - 1.2.7 - Lista Stati Progetto per dropdown
	@PostMapping(path = "/stati/dropdown")
	@ResponseStatus(value = HttpStatus.OK)
	public List<String> getAllStatiDropdownByRuolo(
			@RequestBody @Valid @NotNull ProgettiParam sceltaContesto) {
		List<String> statiDropdown = this.progettoService.getAllStatiDropdown(sceltaContesto, sceltaContesto.getFiltroRequest());
		return statiDropdown;
	}
	
	// TOUCH POINT - 3.1 - Scheda Progetto
	@GetMapping(path = "/{idProgetto}")
	@ResponseStatus(value = HttpStatus.OK)
	public SchedaProgettoBean getSchedaProgettoById(@PathVariable(value = "idProgetto") Long idProgetto) {
		 return this.progettoService.getSchedaProgettoById(idProgetto);
	}
	
	// TOUCH POINT - 2.2.6 -  CRUD Crea Progetto + Assegnazione progetto a programma
	@PostMapping(path = "/{idProgramma}")
	@ResponseStatus(value = HttpStatus.CREATED)
	public void creaNuovoProgetto(@RequestBody @Valid NuovoProgettoRequest nuovoProgettoRequest,
								  @PathVariable(value = "idProgramma") Long idProgramma) {
		ProgettoEntity progettoEntity = this.progettoMapper.toEntityFrom(nuovoProgettoRequest, idProgramma);
		this.progettoService.creaNuovoProgetto(progettoEntity);
	}
	
	// TOUCH-POINT 1.2.3 - 3.3 - Update Progetto
	@PutMapping(path = "/{idProgetto}")
	@ResponseStatus(value = HttpStatus.OK)
	public void aggiornaProgetto(@PathVariable(value = "idProgetto") Long idProgetto,
												  @RequestBody @Valid NuovoProgettoRequest progettoRequest) {
		this.progettoService.aggiornaProgetto(progettoRequest, idProgetto);
	}

	@PutMapping(path = "/{idProgetto}/assegna/enteGestore/{idEnteGestore}")
	@ResponseStatus(value = HttpStatus.OK)
	public void assegnaGestoreAlProgetto(
			@PathVariable(value = "idProgetto")    Long idProg, 
			@PathVariable(value = "idEnteGestore") Long idEnteGest) {
		this.progettoService.assegnaEnteGestoreProgetto(idProg, idEnteGest);
	}
	
	/**
	 * Api di Assegnazione del programma al progetto
	 * 
	 * @param String idProgetto  - id del progetto su cui assegnare il programma
	 * @param String idProgarmma - id del programma da assegnare al progetto
	 * */
	@PutMapping(path = "/{idProgetto}/assegna/programma/{idProgramma}")
	@ResponseStatus(code = HttpStatus.OK)
	public void assegnaProgrammaAlProgetto(
			@PathVariable(value = "idProgetto")  Long idProgetto,
			@PathVariable(value = "idProgramma") Long idProgramma) {
		this.progettoService.assegnaProgrammaAlProgetto(idProgetto, idProgramma);
	}
	
	// TOUCH-POINT 1.2.4 - Delete Progetto
	@DeleteMapping("/{idProgetto}")
	@ResponseStatus(value = HttpStatus.NO_CONTENT)
	public void cancellazioneProgetto(@PathVariable(value = "idProgetto") Long id){
		this.progettoService.cancellazioneProgetto(id);
	}
	
	// TOUCH-POINT 1.2.8 - Scarica lista progetti in formato csv
	@PostMapping(path = "/download")
	public ResponseEntity<InputStreamResource> downloadListaCSVProgetti(@RequestBody @Valid @NotNull ProgettiParam sceltaContesto) {
		String codiceRuolo = sceltaContesto.getCodiceRuolo();
		String codiceFiscaleUtente = sceltaContesto.getCfUtente();
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
	
	@PutMapping(path = "/termina/{idProgetto}")
	@ResponseStatus(value = HttpStatus.OK)
	public void terminaProgetto(
			@PathVariable(value = "idProgetto") Long idProgetto) {
		this.progettoService.terminaProgetto(idProgetto);
	}
}