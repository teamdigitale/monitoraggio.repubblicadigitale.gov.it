package it.pa.repdgt.surveymgmt.restapi;

import java.io.ByteArrayInputStream;
import java.util.List;

import javax.validation.Valid;

import org.apache.commons.csv.CSVFormat;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import it.pa.repdgt.shared.exception.CodiceErroreEnum;
import it.pa.repdgt.shared.restapi.param.SceltaProfiloParam;
import it.pa.repdgt.surveymgmt.bean.SchedaCittadinoBean;
import it.pa.repdgt.surveymgmt.dto.CittadinoDto;
import it.pa.repdgt.surveymgmt.dto.SedeDto;
import it.pa.repdgt.surveymgmt.exception.CittadinoException;
import it.pa.repdgt.surveymgmt.param.CittadiniPaginatiParam;
import it.pa.repdgt.surveymgmt.projection.CittadinoProjection;
import it.pa.repdgt.surveymgmt.request.CittadinoRequest;
import it.pa.repdgt.surveymgmt.resource.CittadiniPaginatiResource;
import it.pa.repdgt.surveymgmt.service.CittadinoService;
import it.pa.repdgt.surveymgmt.util.CSVCittadiniUtil;

@RestController
@RequestMapping(path = "/cittadino")
public class CittadinoRestApi {
	@Autowired
	private CittadinoService cittadinoService;
	
	/***
	 * Restituisce tutti i cittadini paginati 
	 * 
	 * */
	// Lista cittadini paginata
	@PostMapping(path = "/all")
	@ResponseStatus(value = HttpStatus.OK)
	public CittadiniPaginatiResource getAllCittadini(
		@RequestParam(name = "currPage", defaultValue = "0")  Integer currPage,
		@RequestParam(name = "pageSize", defaultValue = "10") Integer pageSize,
		@RequestBody @Valid final CittadiniPaginatiParam cittadiniPaginatiParam) {
		final List<CittadinoDto> cittadiniList = this.cittadinoService.getAllCittadiniPaginati(
				cittadiniPaginatiParam,
				currPage,
				pageSize
			);
		
		final Integer totaleElementi = this.cittadinoService.getNumeroTotaleCittadiniFacilitatoreByFiltro(cittadiniPaginatiParam);
		final int numeroPagine = (int) (totaleElementi /pageSize);

		return new CittadiniPaginatiResource(
				cittadiniList, 
				totaleElementi % pageSize > 0 ? numeroPagine+1 : numeroPagine,
				Long.valueOf(totaleElementi)
			);
	}
	
	/***
	 * Restituisce le sedi per popolare il filtro dei cittadini 
	 * 
	 * */
	// Lista sedi dropdown
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
		if(!this.cittadinoService.isAutorizzato(id, cittadinoRequest)) {
			throw new CittadinoException("Errore tentativo accesso a risorsa non permesso", CodiceErroreEnum.A02);
		}
		this.cittadinoService.aggiornaCittadino(id, cittadinoRequest);
	}
	
	
	/***
	 * Restituisce la scheda del cittadino 
	 * 
	 * */
	// Scheda cittadino
	@PostMapping(path = "/{idCittadino}")
	@ResponseStatus(value = HttpStatus.OK)
	public SchedaCittadinoBean getSchedaCittadino(@PathVariable(value = "idCittadino") final Long idCittadino,
			@RequestBody @Valid final SceltaProfiloParam profilazioneParam) {
		if(!this.cittadinoService.isAutorizzato(idCittadino, profilazioneParam)) {
			throw new CittadinoException("Errore tentativo accesso a risorsa non permesso", CodiceErroreEnum.A02);
		}
		return this.cittadinoService.getSchedaCittadinoById(idCittadino, profilazioneParam);
	}
	
	/**
	 *  Download lista cittadini
	 */
	@PostMapping(path = "/download")
	public ResponseEntity<InputStreamResource> downloadListaCSVCittadini(@RequestBody @Valid CittadiniPaginatiParam cittadiniPaginatiParam) {
		List<CittadinoProjection> cittadiniProjection = this.cittadinoService.getAllCittadiniFacilitatoreByFiltro(cittadiniPaginatiParam);
		ByteArrayInputStream byteArrayInputStream = CSVCittadiniUtil.exportCSVCittadini(cittadiniProjection, CSVFormat.DEFAULT);
		InputStreamResource fileCSV = new InputStreamResource(byteArrayInputStream);
		
		return ResponseEntity.ok()
				.header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=cittadini.csv")
				.contentType(MediaType.parseMediaType("application/csv"))
				.body(fileCSV);
	}
}