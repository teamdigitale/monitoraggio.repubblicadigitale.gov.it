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
import org.springframework.data.domain.Page;
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

import it.pa.repdgt.programmaprogetto.bean.SchedaProgrammaBean;
import it.pa.repdgt.programmaprogetto.mapper.ProgrammaMapper;
import it.pa.repdgt.programmaprogetto.request.FiltroRequest;
import it.pa.repdgt.programmaprogetto.request.ProgrammaRequest;
import it.pa.repdgt.programmaprogetto.request.ProgrammiParam;
import it.pa.repdgt.programmaprogetto.request.TerminaRequest;
import it.pa.repdgt.programmaprogetto.resource.ProgrammiLightResourcePaginata;
import it.pa.repdgt.programmaprogetto.service.ProgrammaService;
import it.pa.repdgt.programmaprogetto.util.CSVProgrammaUtil;
import it.pa.repdgt.shared.entity.ProgrammaEntity;

@RestController
@RequestMapping(path = "/programma")
@Validated
public class ProgrammaRestApi {
	@Autowired
	private ProgrammaService programmaService;
	@Autowired
	private ProgrammaMapper programmaMapper;
	
	// TOUCH POINT - 1.1.1 - Lista programmi paginata e filtrata per ruolo utente  
	// TOUCH POINT - 1.1.2 - Lista programmi filtrata  
	@PostMapping(path = "/all")
	@ResponseStatus(value = HttpStatus.OK)
	public ProgrammiLightResourcePaginata getAllProgrammiPaginatiByRuolo(
			@RequestBody @Valid @NotNull ProgrammiParam sceltaContesto,
			@RequestParam(name = "currPage", required = false, defaultValue = "0")  Integer currPage,
			@RequestParam(name = "pageSize", required = false, defaultValue = "10") Integer pageSize) {
		Page<ProgrammaEntity> paginaProgrammi = this.programmaService.getAllProgrammiPaginati(sceltaContesto, currPage, pageSize, sceltaContesto.getFiltroRequest());
		ProgrammiLightResourcePaginata listaPaginataProgrammiResource = this.programmaMapper.toProgrammiLightResourcePaginataFrom(paginaProgrammi);
		return listaPaginataProgrammiResource;
	}
	
	// TOUCH POINT - 1.1.5 - Lista policy per dropdown in elenco programmi
	// TOUCH POINT - 1.2.5 - Lista policy per dropdown in elenco progetti
	@PostMapping(path = "/policies/dropdown")
	@ResponseStatus(value = HttpStatus.OK)
	public List<String> getAllPoliciesDropdownByRuolo(
			@RequestBody @Valid @NotNull(message = "Deve essere non null") ProgrammiParam sceltaContesto) {
		List<String> policiesDropdown = this.programmaService.getAllPoliciesDropdown(sceltaContesto, sceltaContesto.getFiltroRequest());
		return policiesDropdown;
	}
	
	// TOUCH POINT - 1.1.6 -  Lista Stati Programma per dropdown
	@PostMapping(path = "/stati/dropdown")
	@ResponseStatus(value = HttpStatus.OK)
	public List<String> getAllStatiDropdownByRuolo(
			@RequestBody @Valid @NotNull(message = "Deve essere non null") ProgrammiParam sceltaContesto) {
		List<String> statiDropdown = this.programmaService.getAllStatiDropdown(sceltaContesto, sceltaContesto.getFiltroRequest());
		return statiDropdown;
	}
	
	// TOUCH POINT - 2.1.1 - scheda programma
	@GetMapping(path = "/{idProgramma}")
	@ResponseStatus(value = HttpStatus.OK)
//	@ApiParam(allowEmptyValue = false, allowableValues = "U,D", name = "tipoOperazione", required = true)
	public SchedaProgrammaBean getSchedaProgrammaById(@PathVariable(value = "idProgramma") Long idProgramma) {
		 return this.programmaService.getSchedaProgrammaById(idProgramma);
	}
	
	// TOUCH POINT - 1.1.7 - Creazione nuovo proramma
	@PostMapping
	@ResponseStatus(value = HttpStatus.CREATED)
	public void creaNuovoProgramma(@RequestBody @Valid ProgrammaRequest nuovoProgrammaRequest) {
		ProgrammaEntity programmaEntity = this.programmaMapper.toEntityFrom(nuovoProgrammaRequest);
		this.programmaService.creaNuovoProgramma(programmaEntity);
	}
	
	// TOUCH POINT - 1.1.3 - Aggiornamento programma esistente
	@PutMapping(path = "/{idProgramma}")
	@ResponseStatus(value = HttpStatus.OK)
	public void aggiornaProgramma(
			@PathVariable(value = "idProgramma") final Long idProgramma,
			@RequestBody @Valid final ProgrammaRequest programmaRequest) {
		this.programmaService.aggiornaProgramma(programmaRequest, idProgramma);
	}
	
	// TOUCH POINT - 2.2.2 - associa Ente a programma come Gestore Programma 
	@PutMapping(path = "/{idProgramma}/assegna/entegestore/{idEnteGestore}")
	@ResponseStatus(value = HttpStatus.OK)
	public void assegnaEnteGestoreProgrammaAlProgramma(
			@PathVariable(value = "idProgramma")   Long idProgramma, 
			@PathVariable(value = "idEnteGestore") Long idEnteGestore) {
		this.programmaService.assegnaEnteGestoreProgramma(idProgramma, idEnteGestore);
	}
	
	// TOUCH POINT - 2.2.5 - associa questionario template a programma
	@PutMapping(path = "/{idProgramma}/aggiungi/{idQuestionario}")
	@ResponseStatus(value = HttpStatus.OK)
	public void associaQuestionarioTemplateAProgramma(
			@PathVariable(value = "idProgramma")    Long idProgramma, 
			@PathVariable(value = "idQuestionario") String idQuestionario) {
		this.programmaService.associaQuestionarioTemplateAProgramma(idProgramma, idQuestionario);
	}
	
	// TOUCH POINT - 1.1.9 - termina Programma 
	@PutMapping(path = "termina/{idProgramma}")
	@ResponseStatus(value = HttpStatus.OK)
	public void terminaProgramma(
			@PathVariable(value = "idProgramma") Long idProgramma, 
			@RequestBody TerminaRequest terminaRequest) throws ParseException {
		SimpleDateFormat sdf= new SimpleDateFormat("dd-MM-yyyy");
		this.programmaService.terminaProgramma(idProgramma, sdf.parse(terminaRequest.getDataTerminazione()));
	}
	
	// TOUCH POINT - 1.1.4 - Cancellazione Programma
	@DeleteMapping(path = "/{idProgramma}")
	@ResponseStatus(value = HttpStatus.NO_CONTENT)
	public void cancellazioneProgramma(@PathVariable(value = "idProgramma") Long idProgramma) {
		this.programmaService.cancellazioneProgramma(idProgramma);
	}
	
	// TOUCH-POINT 1.1.8 - Scarica lista programmi in formato csv
	@PostMapping(path = "/download")
	public ResponseEntity<InputStreamResource> downloadListaCSVProgrammi(@RequestBody @Valid ProgrammiParam programmiParam) {
		String codiceRuolo = programmiParam.getCodiceRuolo();
		Long idProgramma = programmiParam.getIdProgramma();
		FiltroRequest filtro = programmiParam.getFiltroRequest();
		
		List<ProgrammaEntity> listaEntiDto = this.programmaService.getAllProgrammiByRuoloAndIdProgramma(codiceRuolo, idProgramma, filtro);
		ByteArrayInputStream byteArrayInputStream = CSVProgrammaUtil.exportCSVProgrammi(listaEntiDto, CSVFormat.DEFAULT);
		InputStreamResource fileCSV = new InputStreamResource(byteArrayInputStream);
		
		return ResponseEntity.ok()
				.header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=programmi.csv")
				.contentType(MediaType.parseMediaType("application/csv"))
				.body(fileCSV);
	}
}