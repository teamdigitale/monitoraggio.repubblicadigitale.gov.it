package it.pa.repdgt.gestioneutente.restapi;

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

import it.pa.repdgt.gestioneutente.bean.SchedaUtenteBean;
import it.pa.repdgt.gestioneutente.dto.UtenteDto;
import it.pa.repdgt.gestioneutente.mapper.UtenteMapper;
import it.pa.repdgt.gestioneutente.request.NuovoUtenteRequest;
import it.pa.repdgt.gestioneutente.request.UtenteRequest;
import it.pa.repdgt.gestioneutente.resource.UtentiLightResourcePaginata;
import it.pa.repdgt.gestioneutente.service.UtenteService;
import it.pa.repdgt.gestioneutente.util.CSVUtil;
import it.pa.repdgt.shared.entity.UtenteEntity;
import it.pa.repdgt.shared.entity.light.UtenteLightEntity;

@RestController
@RequestMapping(path = "/utente")
public class UtenteRestApi {
	@Autowired
	private UtenteService utenteService;
	@Autowired
	private UtenteMapper utenteMapper;
	
	// TOUCH POINT - 1.3.1 - Lista utenti paginata
	// TOUCH POINT - 1.3.2 - Lista utenti filtrata
	@PostMapping(path = "/all")
	@ResponseStatus(value = HttpStatus.OK)
	public UtentiLightResourcePaginata getAllUtentiPaginati(
			@RequestBody @Valid UtenteRequest sceltaContesto,
			@RequestParam(name = "currPage", defaultValue = "0") Integer currPage,
			@RequestParam(name = "pageSize", defaultValue = "10") Integer pageSize) {
		Page<UtenteDto> utenti = this.utenteService.getAllUtentiPaginati(sceltaContesto,currPage, pageSize);
		UtentiLightResourcePaginata listaPaginataUtentiResource = this.utenteMapper.toUtentiLightResourcePaginataFrom(utenti);
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
	public void creaNuovoUtente(@RequestBody @Valid NuovoUtenteRequest nuovoUtenteRequest) {
		UtenteEntity utenteEntity = this.utenteMapper.toUtenteEntityFrom(nuovoUtenteRequest);
		this.utenteService.creaNuovoUtente(utenteEntity, nuovoUtenteRequest.getRuolo());
	}
	
	// TOUCH POINT - 1.3.3 - Update Utente
	@PutMapping(path = "/{idUtente}")
	@ResponseStatus(value = HttpStatus.OK)
	public void aggiornaUtente(
			@PathVariable(value = "idUtente") Long idUtente,
			@RequestBody @Valid NuovoUtenteRequest nuovoUtenteRequest) {
		this.utenteService.aggiornaUtente(nuovoUtenteRequest, idUtente);
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
	@GetMapping(path = "/{cfUtente}")
	@ResponseStatus(value = HttpStatus.OK)
	public SchedaUtenteBean getSchedaUtenteByCodiceFiscale(@PathVariable(value = "cfUtente") String cfUtente) {
		return this.utenteService.getSchedaUtenteByCodiceFiscale(cfUtente);
	}
	
	// TOUCH POINT - 4.4 - Associa Ruolo ad Utente
	@GetMapping(path = "/{codiceFiscale}/assegnaRuolo/{codiceRuolo}")
	@ResponseStatus(value = HttpStatus.OK)
	public void assegnaRuoloAUtente(
			@PathVariable(value = "codiceFiscale") String codiceFiscale, 
			@PathVariable(value = "codiceRuolo") String codiceRuolo) {
		this.utenteService.assegnaRuoloAUtente(codiceFiscale, codiceRuolo);
	}
	
	// TOUCH POINT - 4.5 - Cancella Ruolo da Utente
	@DeleteMapping(path = "/{codiceFiscale}/cancellaruolo/{codiceRuolo}")
	@ResponseStatus(value = HttpStatus.NO_CONTENT)
	public void cancellaRuoloDaUtente(
			@PathVariable(value = "codiceFiscale") String codiceFiscale, 
			@PathVariable(value = "codiceRuolo") String codiceRuolo) {
		this.utenteService.cancellaRuoloDaUtente(codiceFiscale, codiceRuolo);
	}

	// TOUCH POINT - 1.3.4 -  Delete Utente
	@DeleteMapping(path = "/{cfUtente}")
	@ResponseStatus(value = HttpStatus.NO_CONTENT)
	public void cancellaUtente(@PathVariable String cfUtente) {
		this.utenteService.cancellaUtente(cfUtente);
	}
	
	// TOUCH-POINT 1.3.8 - Scarica lista utenti in formato csv
	@PostMapping(path = "/download")
	public ResponseEntity<InputStreamResource> downloadListaCSVUtenti(@RequestBody @Valid UtenteRequest sceltaContesto) {
		List<UtenteDto> listaUtentiDto = this.utenteService.getUtentiByRuolo(sceltaContesto.getCodiceRuolo(), sceltaContesto.getCfUtente(), sceltaContesto.getIdProgramma(), sceltaContesto.getIdProgetto(), sceltaContesto.getFiltroRequest());
		ByteArrayInputStream byteArrayInputStream = CSVUtil.exportCSVUtenti(listaUtentiDto, CSVFormat.DEFAULT);
		InputStreamResource fileCSV = new InputStreamResource(byteArrayInputStream);
		
		return ResponseEntity.ok()
				.header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=utenti.csv")
				.contentType(MediaType.parseMediaType("application/csv"))
				.body(fileCSV);
	}
}