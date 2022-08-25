package it.pa.repdgt.gestioneutente.restapi;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.List;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;

import org.apache.commons.csv.CSVFormat;
import org.apache.tomcat.util.codec.binary.Base64;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
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
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import it.pa.repdgt.gestioneutente.bean.SchedaUtenteBean;
import it.pa.repdgt.gestioneutente.dto.UtenteDto;
import it.pa.repdgt.gestioneutente.mapper.UtenteMapper;
import it.pa.repdgt.gestioneutente.request.AggiornaUtenteRequest;
import it.pa.repdgt.gestioneutente.request.NuovoUtenteRequest;
import it.pa.repdgt.gestioneutente.request.ProfilazioneRequest;
import it.pa.repdgt.gestioneutente.request.UtenteRequest;
import it.pa.repdgt.gestioneutente.resource.UtenteResource;
import it.pa.repdgt.gestioneutente.resource.UtentiLightResourcePaginata;
import it.pa.repdgt.gestioneutente.service.UtenteService;
import it.pa.repdgt.gestioneutente.util.CSVUtil;
import it.pa.repdgt.shared.awsintegration.service.S3Service;
import it.pa.repdgt.shared.entity.UtenteEntity;
import it.pa.repdgt.shared.entity.light.UtenteLightEntity;

@RestController
@RequestMapping(path = "/utente")
public class UtenteRestApi {
	@Autowired
	private UtenteService utenteService;
	@Autowired
	private UtenteMapper utenteMapper;
	@Autowired
	private S3Service s3Service;
	
	@Value("${AWS.S3.BUCKET-NAME:}")
	private String nomeDelBucketS3;
	
	private static final String SUFFIX_FILE_IMG_PROFILO = "immagineProfilo-";
	
	// TOUCH POINT - 1.3.1 - Lista utenti paginata
	// TOUCH POINT - 1.3.2 - Lista utenti filtrata
	@PostMapping(path = "/all")
	@ResponseStatus(value = HttpStatus.OK)
	public UtentiLightResourcePaginata getAllUtentiPaginati(
			@RequestBody @Valid UtenteRequest sceltaContesto,
			@RequestParam(name = "currPage", required = false, defaultValue = "0")  Integer currPage,
			@RequestParam(name = "pageSize", required = false, defaultValue = "10") Integer pageSize) {
		List<UtenteDto> utenti = this.utenteService.getAllUtentiPaginati(sceltaContesto, currPage, pageSize);
		UtentiLightResourcePaginata listaPaginataUtentiResource = this.utenteMapper.toUtentiLightResourcePaginataFrom(utenti);
		
		int numeroUtentiTrovati = this.utenteService.countUtentiTrovati(sceltaContesto);
		listaPaginataUtentiResource.setNumeroTotaleElementi(numeroUtentiTrovati);
		listaPaginataUtentiResource.setNumeroPagine(numeroUtentiTrovati % pageSize > 0 ? (numeroUtentiTrovati / pageSize) + 1 : (numeroUtentiTrovati / pageSize));
		
		return listaPaginataUtentiResource;
	}
	
	// TOUCH POINT 2.2.14F - Cerca Utente
	@GetMapping(path = "/cerca/{criterioRicerca}")
	@ResponseStatus(value = HttpStatus.OK)
	public List<UtenteLightEntity> getUtenteByCriterioRicerca(@PathVariable(value = "criterioRicerca") String criterioRicerca) {
		List<UtenteEntity> utentiCercati = this.utenteService.getUtenteByCriterioRicerca(criterioRicerca);
		return this.utenteMapper.toUtenteLightEntityFrom(utentiCercati);
	}
	
	// TOUCH POINT - 1.3.7 -  CRUD Crea Utente
	@PostMapping
	@ResponseStatus(value = HttpStatus.CREATED)
	public UtenteResource creaNuovoUtente(@RequestBody @Valid NuovoUtenteRequest nuovoUtenteRequest) {
		UtenteEntity utenteEntity = this.utenteMapper.toUtenteEntityFrom(nuovoUtenteRequest);
		return new UtenteResource(this.utenteService.creaNuovoUtente(utenteEntity, nuovoUtenteRequest.getRuolo()).getId());
	}
	
	// TOUCH POINT - 1.3.3 - Update Utente
	@PutMapping(path = "/{idUtente}")
	@ResponseStatus(value = HttpStatus.OK)
	public void aggiornaUtente(
			@PathVariable(value = "idUtente") Long idUtente,
			@RequestBody @Valid AggiornaUtenteRequest aggiornaUtenteRequest) {
		this.utenteService.aggiornaUtente(aggiornaUtenteRequest, idUtente);
	}
	
	// TOUCH POINT - 1.3.6 -  Lista Stati Utenti Dropdown
	@PostMapping(path = "/stati/dropdown")
	@ResponseStatus(value = HttpStatus.OK)
	public List<String> getAllStatiDropdown(
			@RequestBody @Valid @NotNull UtenteRequest sceltaContesto) {
		List<String> statiDropdown = this.utenteService.getAllStatiDropdown(sceltaContesto);
		return statiDropdown;
	}
	
	// TOUCH POINT - 1.3.5 -  Lista Ruoli Utenti Dropdown
	@PostMapping(path = "/ruoli/dropdown")
	@ResponseStatus(value = HttpStatus.OK)
	public List<String> getAllRuoliDropdown(
			@RequestBody @Valid UtenteRequest sceltaContesto) {
		List<String> ruoliDropdown = this.utenteService.getAllRuoliDropdown(sceltaContesto);
		return ruoliDropdown;
	}
	
	// TOUCH POINT - 4.1 - Scheda Utente
	@GetMapping(path = "/{idUtente}")
	@ResponseStatus(value = HttpStatus.OK)
	public SchedaUtenteBean getSchedaUtenteByIdUtente(@PathVariable(value = "idUtente") Long idUtente) {
		return this.utenteService.getSchedaUtenteByIdUtente(idUtente);
	}
	
	// TOUCH POINT - 4.1 - Scheda Utente
	@PostMapping(path = "/{idUtente}")
	@ResponseStatus(value = HttpStatus.OK)
	public SchedaUtenteBean getSchedaUtenteByIdUtente(@PathVariable(value = "idUtente") Long idUtente,
			@RequestBody ProfilazioneRequest sceltaProfilo) {
		return this.utenteService.getSchedaUtenteByIdUtente(idUtente, sceltaProfilo);
	}
	
	// TOUCH POINT - 4.4 - Associa Ruolo ad Utente
	@PutMapping(path = "/{idUtente}/assegnaRuolo/{codiceRuolo}")
	@ResponseStatus(value = HttpStatus.OK)
	public void assegnaRuoloAUtente(
			@PathVariable(value = "idUtente") Long idUtente, 
			@PathVariable(value = "codiceRuolo") String codiceRuolo) {
		this.utenteService.assegnaRuoloAUtente(idUtente, codiceRuolo);
	}
	
	// TOUCH POINT - 4.5 - Cancella Ruolo da Utente
	@DeleteMapping(path = "/{idUtente}/cancellaRuolo/{codiceRuolo}")
	@ResponseStatus(value = HttpStatus.NO_CONTENT)
	public void cancellaRuoloDaUtente(
			@PathVariable(value = "idUtente") Long idUtente, 
			@PathVariable(value = "codiceRuolo") String codiceRuolo) {
		this.utenteService.cancellaRuoloDaUtente(idUtente, codiceRuolo);
	}

	// TOUCH POINT - 1.3.4 -  Delete Utente
	@DeleteMapping(path = "/{idUtente}")
	@ResponseStatus(value = HttpStatus.NO_CONTENT)
	public void cancellaUtente(@PathVariable(value = "idUtente") Long idUtente) {
		this.utenteService.cancellaUtente(idUtente);
	}
	
	// TOUCH-POINT 1.3.8 - Scarica lista utenti in formato csv
	@PostMapping(path = "/download")
	public ResponseEntity<InputStreamResource> downloadListaCSVUtenti(@RequestBody @Valid UtenteRequest sceltaContesto) {
		List<UtenteDto> listaUtentiDto = this.utenteService.getUtentiPerDownload(sceltaContesto.getCodiceRuolo(), sceltaContesto.getCfUtente(), sceltaContesto.getIdProgramma(), sceltaContesto.getIdProgetto(), sceltaContesto.getFiltroRequest());
		ByteArrayInputStream byteArrayInputStream = CSVUtil.exportCSVUtenti(listaUtentiDto, CSVFormat.DEFAULT);
		InputStreamResource fileCSV = new InputStreamResource(byteArrayInputStream);
		
		return ResponseEntity.ok()
				.header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=utenti.csv")
				.contentType(MediaType.parseMediaType("application/csv"))
				.body(fileCSV);
	}
	
	@PostMapping(path = "/upload/immagineProfilo/{idUtente}", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
	public void uploadImmagineProfiloUtente(
			@PathVariable(value = "idUtente") Long idUtente,
			@RequestPart MultipartFile multipartifile) throws IOException {
		this.utenteService.getUtenteById(idUtente);
		InputStream initialStream = multipartifile.getInputStream();
		byte[] buffer = new byte[initialStream.available()];
		initialStream.read(buffer);

		File targetFile = new File(SUFFIX_FILE_IMG_PROFILO + idUtente);
		try (OutputStream outStream = new FileOutputStream(targetFile)) {
		    outStream.write(buffer);
		}
		try {
			this.s3Service.uploadFile(nomeDelBucketS3, targetFile);
		}catch(Exception e) {
			throw e;
		}finally {
			targetFile.delete();
		}
	}
	
	@GetMapping(path = "/download/immagineProfilo/{nomeFile}")
	public String downloadImmagineProfiloUtente(
			@PathVariable(value = "nomeFile") final String nomeFile) throws IOException {
		byte[] bytes = this.s3Service.downloadFile(this.nomeDelBucketS3, nomeFile).asByteArray();
		return Base64.encodeBase64String(bytes);
	}
}