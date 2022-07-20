package it.pa.repdgt.surveymgmt.restapi;

import java.util.List;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import it.pa.repdgt.surveymgmt.bean.SchedaCittadinoBean;
import it.pa.repdgt.surveymgmt.collection.QuestionarioCompilatoCollection;
import it.pa.repdgt.surveymgmt.dto.CittadinoDto;
import it.pa.repdgt.surveymgmt.dto.SedeDto;
import it.pa.repdgt.surveymgmt.mapper.CittadinoMapper;
import it.pa.repdgt.surveymgmt.param.CittadiniPaginatiParam;
import it.pa.repdgt.surveymgmt.request.CittadinoRequest;
import it.pa.repdgt.surveymgmt.resource.CittadiniPaginatiResource;
import it.pa.repdgt.surveymgmt.service.CittadinoService;
import it.pa.repdgt.surveymgmt.service.QuestionarioCompilatoService;

@RestController
@RequestMapping(path = "/cittadino")
public class CittadinoRestApi {
	@Autowired
	private CittadinoService cittadinoService;
	@Autowired
	private QuestionarioCompilatoService questionarioCompilatoService;
	@Autowired
	private CittadinoMapper cittadinoMapper;
	
	/***
	 * Restituisce tutti i cittadini paginati 
	 * 
	 * */
	// TOUCH POINT - 7.1.1 - Lista cittadini paginata
	@PostMapping(path = "/all")
	@ResponseStatus(value = HttpStatus.OK)
	public CittadiniPaginatiResource getAllCittadini(
		@RequestParam(name = "currPage", defaultValue = "0") Integer currPage,
		@RequestParam(name = "pageSize", defaultValue = "10") Integer pageSize,
		@RequestBody @Valid final CittadiniPaginatiParam cittadiniPaginatiParam) {
		final Page<CittadinoDto> paginaCittadini = this.cittadinoService.getAllCittadiniPaginati(
				cittadiniPaginatiParam,
				currPage,
				pageSize
			);
		return new CittadiniPaginatiResource(
				paginaCittadini.getContent(), 
				paginaCittadini.getTotalPages(),
				paginaCittadini.getTotalElements()
			);
	}
	
	/***
	 * Restituisce le sedi per popolare il filtro dei cittadini 
	 * 
	 * */
	// TOUCH POINT - 7.1.2 - Lista sedi dropdown
	@PostMapping(path = "/sedi/dropdown")
	@ResponseStatus(value = HttpStatus.OK)
	public List<SedeDto> getAllSediDropdown(@RequestBody @Valid final CittadiniPaginatiParam cittadiniPaginatiParam) {
		return this.cittadinoService.getAllSediDropdown(cittadiniPaginatiParam);
	}
	
	/***
	 * Aggiorna i dati del cittadino
	 * 
	 * */
	@PutMapping(path = "/{id}")
	@ResponseStatus(value = HttpStatus.OK)
	public void aggiornaCittadino(
			@PathVariable(value = "id") Long id,
			@RequestBody @Valid final CittadinoRequest cittadinoRequest) {
		this.cittadinoService.aggiornaCittadino(id, cittadinoRequest);
	}
	
	
	/***
	 * Restituisce la scheda del cittadino 
	 * 
	 * */
	// TOUCH POINT - 7.2.1 - Scheda cittadino
	@GetMapping(path = "/{idCittadino}")
	@ResponseStatus(value = HttpStatus.OK)
	public SchedaCittadinoBean getSchedaCittadino(@PathVariable(value = "idCittadino") final Long idCittadino) {
		return this.cittadinoService.getSchedaCittadinoById(idCittadino);
	}
	
	/**
	 * Recupero del questionario compilato
	 * 
	 * */
	@GetMapping(path = "/questionarioCompilato/{idQuestionario}")
	@ResponseStatus(value = HttpStatus.OK)
	public QuestionarioCompilatoCollection getQuestionarioCompilato(
			@PathVariable(value = "idQuestionario") String idQuestionario) {
		return this.questionarioCompilatoService.getQuestionarioCompilatoById(idQuestionario);
	}
}