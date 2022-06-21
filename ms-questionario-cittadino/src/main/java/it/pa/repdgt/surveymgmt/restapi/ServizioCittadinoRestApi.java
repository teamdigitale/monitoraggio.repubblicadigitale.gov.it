package it.pa.repdgt.surveymgmt.restapi;

import java.util.Collections;
import java.util.List;

import javax.validation.Valid;
import javax.validation.constraints.Pattern;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
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

import io.swagger.annotations.ApiParam;
import it.pa.repdgt.surveymgmt.bean.CittadinoServizioBean;
import it.pa.repdgt.surveymgmt.bean.CittadinoUploadBean;
import it.pa.repdgt.surveymgmt.exception.ServizioException;
import it.pa.repdgt.surveymgmt.mapper.CittadinoServizioMapper;
import it.pa.repdgt.surveymgmt.mapper.GetCittadinoServizioMapper;
import it.pa.repdgt.surveymgmt.param.FiltroListaCittadiniServizioParam;
import it.pa.repdgt.surveymgmt.param.ProfilazioneParam;
import it.pa.repdgt.surveymgmt.projection.GetCittadinoProjection;
import it.pa.repdgt.surveymgmt.request.NuovoCittadinoServizioRequest;
import it.pa.repdgt.surveymgmt.resource.CittadiniServizioPaginatiResource;
import it.pa.repdgt.surveymgmt.resource.CittadinoServizioResource;
import it.pa.repdgt.surveymgmt.resource.GetCittadinoResource;
import it.pa.repdgt.surveymgmt.service.CittadiniServizioService;
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

	@PostMapping(path = "/all/{idServizio}")	
	@ResponseStatus(value = HttpStatus.OK)
	public CittadiniServizioPaginatiResource getAllCittadiniServizio(
			@RequestBody @Valid final ProfilazioneParam profilazioneParam,
			@PathVariable(name = "idServizio", required = true) final Long idServizio,
			@RequestParam(name = "criterioRicerca", required = false) final String criterioRicercaFiltro,
			@RequestParam(name = "statiQuestionario", required = false) final List<String> statiQuestionarioFiltro,
			@RequestParam(name = "currPage", defaultValue = "0")  @Pattern(regexp = "[0-9]+") final String currPage,
			@RequestParam(name = "pageSize", defaultValue = "10") @Pattern(regexp = "[0-9]+") final String pageSize) {
		final Pageable pagina = PageRequest.of(Integer.parseInt(currPage), Integer.parseInt(pageSize));
		final FiltroListaCittadiniServizioParam filtroListaCittadiniServizioParam = new FiltroListaCittadiniServizioParam();
		filtroListaCittadiniServizioParam.setCriterioRicerca(criterioRicercaFiltro);
		filtroListaCittadiniServizioParam.setStatiQuestionario(statiQuestionarioFiltro);
		
		CittadinoServizioBean cittadinoServiziBean = this.cittadiniServizioService.getAllCittadiniServizioByProfilazioneAndFiltroPaginati(
				idServizio,
				profilazioneParam, 
				filtroListaCittadiniServizioParam, 
				pagina
			);
		
		final List<CittadinoServizioResource> cittadinoServizioResource = this.cittadinoServizioMapper.toResourceFrom(cittadinoServiziBean.getListaCittadiniServizio().getContent());
		final CittadiniServizioPaginatiResource cittadiniServizioPaginatiResource = new CittadiniServizioPaginatiResource();
		cittadiniServizioPaginatiResource.setCittadiniServizioResource(cittadinoServizioResource);
		cittadiniServizioPaginatiResource.setNumeroPagine(cittadinoServiziBean.getListaCittadiniServizio().getTotalPages());
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
	
	@GetMapping
	@ResponseStatus(value = HttpStatus.OK)
	private List<GetCittadinoResource> getCittadini(
		@RequestParam(name = "criterioRicerca", required = true) final String criterioRicerca,
		@ApiParam(allowEmptyValue = false, allowableValues = "CF, NUM_DOC", name = "tipoDocumento", required = true)
		@RequestParam(name = "tipoDocumento", required = true) final String tipoDocumento) {
		final List<GetCittadinoProjection> cittadini = this.cittadiniServizioService.getAllCittadiniByCodFiscOrNumDoc(
				tipoDocumento, 
				criterioRicerca
			);
		
		return this.getCittadinoServizioMapper.toResourceFrom(cittadini);
	}
	
	@PostMapping(path="/{idServizio}")
	@ResponseStatus(value = HttpStatus.CREATED)
	private void creaNuovoCittadinoServizio(
		@PathVariable(name = "idServizio") final Long idServizio,
		@RequestBody @Valid final NuovoCittadinoServizioRequest nuovoCittadino) {
		this.cittadiniServizioService.creaNuovoCittadino(
				idServizio,
				nuovoCittadino
			);
	}
	
	// TOUCH POINT - 9.2.5
	@PostMapping(path = "{idServizio}/listaCittadini/upload", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
	@ResponseStatus(value = HttpStatus.OK)
	public List<CittadinoUploadBean> caricaListaCittadini(
			@RequestPart MultipartFile file,
			@PathVariable(value = "idServizio") Long idServizio) {
		if (file == null || !CSVServizioUtil.hasCSVFormat(file)) {
			throw new ServizioException("il file non è valido"); 
		}
		return this.cittadiniServizioService.caricaCittadiniSuServizio(file, idServizio);
	}
}