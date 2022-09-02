package it.pa.repdgt.gestioneutente.restapi;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import it.pa.repdgt.gestioneutente.service.GruppoService;
import it.pa.repdgt.shared.entity.GruppoEntity;

@RestController
@RequestMapping(path = "/gruppo")
public class GruppoRestApi {
	@Autowired
	private GruppoService gruppoService;
	
	@GetMapping(path = "/all")
	public List<GruppoEntity> getAllGruppi() {
		return this.gruppoService.getAllGruppi();
	}
}