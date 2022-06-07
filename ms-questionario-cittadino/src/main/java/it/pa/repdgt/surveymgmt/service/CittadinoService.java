package it.pa.repdgt.surveymgmt.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import it.pa.repdgt.surveymgmt.repository.CittadinoRepository;

@Service
public class CittadinoService {
	
	@Autowired
	private CittadinoRepository cittadinoRepository;

}
