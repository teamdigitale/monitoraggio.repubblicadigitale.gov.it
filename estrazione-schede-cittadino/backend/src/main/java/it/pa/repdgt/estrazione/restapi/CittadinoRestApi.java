package it.pa.repdgt.estrazione.restapi;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import it.pa.repdgt.estrazione.dto.PrimoServizioCittadinoDTO;
import it.pa.repdgt.estrazione.dto.RicercaCittadiniDTO;
import it.pa.repdgt.estrazione.request.RicercaCittadinoRequest;
import it.pa.repdgt.estrazione.service.RicercaCittadinoService;

@RestController
@RequestMapping(path = "/cittadino")
public class CittadinoRestApi {

	@Autowired
	private RicercaCittadinoService ricercaCittadinoService;

	@PostMapping("/ricerca")
	public ResponseEntity<List<PrimoServizioCittadinoDTO>> ricercaSingola(
			@RequestBody RicercaCittadinoRequest request) {
		return new ResponseEntity<>(
				ricercaCittadinoService.ricercaSingola(request.getCriterioRicerca()),
				HttpStatus.OK);
	}

	@PostMapping("/ricerca-multipla")
	public ResponseEntity<RicercaCittadiniDTO> ricercaMultipla(
			@RequestBody RicercaCittadinoRequest request) {
		return new ResponseEntity<>(
				ricercaCittadinoService.ricercaMultipla(request.getCriterioRicercaMultipla()),
				HttpStatus.OK);
	}
}
