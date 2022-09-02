package it.pa.repdgt.surveymgmt.restapi;

import java.text.ParseException;
import java.util.Collections;
import java.util.List;

import javax.validation.Valid;
import javax.validation.constraints.Pattern;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import it.pa.repdgt.shared.exception.CodiceErroreEnum;
import it.pa.repdgt.surveymgmt.bean.CittadinoServizioBean;
import it.pa.repdgt.surveymgmt.bean.CittadinoUploadBean;
import it.pa.repdgt.surveymgmt.bean.QuestionarioCompilatoBean;
import it.pa.repdgt.surveymgmt.collection.QuestionarioCompilatoCollection;
import it.pa.repdgt.surveymgmt.exception.ServizioException;
import it.pa.repdgt.surveymgmt.mapper.CittadinoServizioMapper;
import it.pa.repdgt.surveymgmt.mapper.GetCittadinoServizioMapper;
import it.pa.repdgt.surveymgmt.param.FiltroListaCittadiniServizioParam;
import it.pa.repdgt.surveymgmt.param.ProfilazioneParam;
import it.pa.repdgt.surveymgmt.projection.GetCittadinoProjection;
import it.pa.repdgt.surveymgmt.request.GetCittadiniRequest;
import it.pa.repdgt.surveymgmt.request.NuovoCittadinoServizioRequest;
import it.pa.repdgt.surveymgmt.request.QuestionarioCompilatoAnonimoRequest;
import it.pa.repdgt.surveymgmt.request.QuestionarioCompilatoRequest;
import it.pa.repdgt.surveymgmt.resource.CittadiniServizioPaginatiResource;
import it.pa.repdgt.surveymgmt.resource.CittadinoResource;
import it.pa.repdgt.surveymgmt.resource.CittadinoServizioResource;
import it.pa.repdgt.surveymgmt.resource.GetCittadinoResource;
import it.pa.repdgt.surveymgmt.service.CittadiniServizioService;
import it.pa.repdgt.surveymgmt.service.QuestionarioCompilatoService;
import it.pa.repdgt.surveymgmt.util.CSVServizioUtil;

@RestController
@RequestMapping(path = "servizio/cittadino")
public class ServizioCittadinoRestApi {
	@Autowired
	private CittadinoServizioMapper cittadinoServizioMapper;
	@Autowired
	private CittadiniServizioService cittadiniServizioService;
	@Autowired
	private GetCittadinoServizioMapper getCittadinoServizioMapper;
	@Autowired
	private QuestionarioCompilatoService questionarioCompilatoService;

	@PostMapping(path = "/all/{idServizio}")	
	@ResponseStatus(value = HttpStatus.OK)
	public CittadiniServizioPaginatiResource getAllCittadiniServizio(
			@RequestBody @Valid final ProfilazioneParam profilazioneParam,
			@PathVariable(name = "idServizio", required = true) final Long idServizio,
			@RequestParam(name = "criterioRicerca", required = false) final String criterioRicercaFiltro,
			@RequestParam(name = "statiQuestionario", required = false) final List<String> statiQuestionarioFiltro,
			@RequestParam(name = "currPage", defaultValue = "0")  @Pattern(regexp = "[0-9]+") final String currPage,
			@RequestParam(name = "pageSize", defaultValue = "10") @Pattern(regexp = "[0-9]+") final String pageSize) {
		final FiltroListaCittadiniServizioParam filtroListaCittadiniServizioParam = new FiltroListaCittadiniServizioParam();
		filtroListaCittadiniServizioParam.setCriterioRicerca(criterioRicercaFiltro);
		filtroListaCittadiniServizioParam.setStatiQuestionario(statiQuestionarioFiltro);
		
		CittadinoServizioBean cittadinoServiziBean = this.cittadiniServizioService.getAllCittadiniServizioByProfilazioneAndFiltroPaginati(
				idServizio,
				profilazioneParam, 
				filtroListaCittadiniServizioParam,
				Integer.parseInt(currPage),
				Integer.parseInt(pageSize)
			);
		
		final int totaleElementi = this.cittadiniServizioService.countCittadiniServizioByFiltro(idServizio, filtroListaCittadiniServizioParam);
		final int numeroPagine = (int) (totaleElementi / Integer.parseInt(pageSize));
		
		final List<CittadinoServizioResource> cittadinoServizioResource = this.cittadinoServizioMapper.toResourceFrom(cittadinoServiziBean.getListaCittadiniServizio());
		final CittadiniServizioPaginatiResource cittadiniServizioPaginatiResource = new CittadiniServizioPaginatiResource();
		cittadiniServizioPaginatiResource.setCittadiniServizioResource(cittadinoServizioResource);
		cittadiniServizioPaginatiResource.setNumeroPagine(totaleElementi % Integer.parseInt(pageSize) > 0 ? numeroPagine+1 : numeroPagine);
		cittadiniServizioPaginatiResource.setNumeroCittadini(cittadinoServiziBean.getNumCittadini());
		cittadiniServizioPaginatiResource.setNumeroQuestionariCompilati(cittadinoServiziBean.getNumQuestionariCompilati());
		return cittadiniServizioPaginatiResource;
	}
	
	@PostMapping(path = "/stati/dropdown/{idServizio}")
	@ResponseStatus(value = HttpStatus.OK)
	private List<String> getAllStatiDropdown(
		@PathVariable(name = "idServizio") final Long idServizio,
		@RequestParam(name = "criterioRicerca",   required = false) final String criterioRicercaFiltro,
		@RequestParam(name = "statiQuestionario", required = false) final List<String> statiQuestionarioFiltro,
		@RequestBody @Valid final ProfilazioneParam profilazioneParam) {
		final FiltroListaCittadiniServizioParam filtroListaCittadiniServizioParam = new FiltroListaCittadiniServizioParam();
		filtroListaCittadiniServizioParam.setCriterioRicerca(criterioRicercaFiltro);
		filtroListaCittadiniServizioParam.setStatiQuestionario(statiQuestionarioFiltro == null ? Collections.emptyList() : statiQuestionarioFiltro);
		return this.cittadiniServizioService.getAllStatiQuestionarioCittadinoServizioDropdown(
				idServizio,
				profilazioneParam, 
				filtroListaCittadiniServizioParam
			);
	}
	
	@PostMapping
	@ResponseStatus(value = HttpStatus.OK)
	private List<GetCittadinoResource> getCittadini(
			@RequestBody @Valid GetCittadiniRequest request){
		
		final List<GetCittadinoProjection> cittadini = this.cittadiniServizioService.getAllCittadiniByCodFiscOrNumDoc(
				request.getTipoDocumento(), 
				request.getCriterioRicerca()
			);
		
		return this.getCittadinoServizioMapper.toResourceFrom(cittadini);
	}
	
	@PostMapping(path="/{idServizio}")
	@ResponseStatus(value = HttpStatus.CREATED)
	private CittadinoResource creaNuovoCittadinoServizio(
		@PathVariable(name = "idServizio") final Long idServizio,
		@RequestBody @Valid final NuovoCittadinoServizioRequest nuovoCittadino) {
		return new CittadinoResource(this.cittadiniServizioService.creaNuovoCittadino(idServizio, nuovoCittadino).getId());
	}
	
	// TOUCH POINT - 9.2.5
	@PostMapping(path = "{idServizio}/listaCittadini/upload", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
	@ResponseStatus(value = HttpStatus.OK)
	public List<CittadinoUploadBean> caricaListaCittadini(
			@RequestPart MultipartFile file,
			@PathVariable(value = "idServizio") Long idServizio) {
		if (file == null || !CSVServizioUtil.hasCSVFormat(file)) {
			throw new ServizioException("il file non è valido", CodiceErroreEnum.S01); 
		}
		return this.cittadiniServizioService.caricaCittadiniSuServizio(file, idServizio);
	}
	
	/**
	 * invio questionario al cittadino per compilazione
	 * 
	 * */
	// TOUCH POINT 9.2.9
	@PostMapping(path = "/questionarioCompilato/invia")
	@ResponseStatus(value = HttpStatus.OK)
	public void inviaQuestionario(
			@RequestParam(value = "idQuestionario") String idQuestionario,
			@RequestParam(value = "idCittadino") Long idCittadino ) {
		this.cittadiniServizioService.inviaQuestionario(idQuestionario, idCittadino);
	}
	/**
	 * invio questionario a tutti i cittadini associati al servizio con quel particolare id
	 * e per cui ancora non è stato inviato il questionario
	 * 
	 * */
	// TOUCH POINT 9.2.9
	@PostMapping(path = "servizio/{idServizio}/questionarioCompilato/inviaATutti")
	@ResponseStatus(value = HttpStatus.OK)
	public void inviaQuestionarioATuttiCittadiniNonAncoraInviatoByServizio(@PathVariable(value = "idServizio") Long idServizio) {
		this.cittadiniServizioService.inviaQuestionarioATuttiCittadiniNonAncoraInviatoByServizio(idServizio);
	}
	
	/**
	 * Recupero del questionario compilato per compilazione anonima
	 * @throws ParseException 
	 * 
	 * */
	// TOUCH POINT 9.2.6
	@GetMapping(path = "/questionarioCompilato/{idQuestionario}/anonimo")
	@ResponseStatus(value = HttpStatus.OK)
	public QuestionarioCompilatoBean getQuestionarioCompilatoAnonimo(
		@PathVariable(value = "idQuestionario") String idQuestionario,
		@RequestParam(value = "t") String t) throws ParseException {
		return this.questionarioCompilatoService.getQuestionarioCompilatoByIdAnonimo(idQuestionario, t);
	}
	
	/**
	 * Compilazione del questionario 
	 * 
	 * */
	// TOUCH POINT 9.2.7 
	@PostMapping(path = "/questionarioCompilato/{idQuestionario}/compila")
	@ResponseStatus(value = HttpStatus.OK)
	public void compilaQuestionario(
			@PathVariable(value = "idQuestionario") String idQuestionario,
			@Valid @RequestBody QuestionarioCompilatoRequest questionarioCompilatoRequest) {
		this.questionarioCompilatoService.compilaQuestionario(idQuestionario, questionarioCompilatoRequest);
	}
	
	/**
	 * 
	 * compilazione questionario in forma anonima da parte del cittadino
	 * @throws ParseException 
	 */
	// TOUCH POINT 9.2.8
	@PostMapping(path = "/questionarioCompilato/{idQuestionario}/compila/anonimo")
	@ResponseStatus(value = HttpStatus.OK)
	public void compilaQuestionarioAnonimo(
			@PathVariable(value = "idQuestionario") String idQuestionario,
			@Valid @RequestBody QuestionarioCompilatoAnonimoRequest questionarioCompilatoAnonimoRequest,
			@RequestParam(value = "t") String t) throws ParseException {
		this.questionarioCompilatoService.compilaQuestionarioAnonimo(idQuestionario, questionarioCompilatoAnonimoRequest, t);
	}
	
	
	/***
	 * Restituisce il questionario compilato con specifico id persistito su mongoDB
	 * 
	 * */
	@GetMapping(path = "questionarioCompilato/compilato/{idQuestionarioCompilato}",  produces = MediaType.APPLICATION_JSON_VALUE)
	@ResponseStatus(value = HttpStatus.OK)
	public QuestionarioCompilatoCollection getQuestioanarioCompilatoById(
			@PathVariable(value = "idQuestionarioCompilato") final String questionarioCompilatoId) {
		return this.questionarioCompilatoService.getQuestionarioCompilatoById(questionarioCompilatoId);
	}
}