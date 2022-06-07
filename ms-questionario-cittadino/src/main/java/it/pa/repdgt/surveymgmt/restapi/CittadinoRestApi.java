package it.pa.repdgt.surveymgmt.restapi;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import it.pa.repdgt.surveymgmt.service.CittadinoService;

@RestController
@RequestMapping(path = "/cittadino")
public class CittadinoRestApi {
	
	@Autowired
	private CittadinoService cittadinoService;

}
