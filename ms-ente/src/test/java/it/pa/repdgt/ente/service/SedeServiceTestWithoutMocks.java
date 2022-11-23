package it.pa.repdgt.ente.service;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class SedeServiceTestWithoutMocks {

	@Autowired
	private SedeService sedeService;
	
	@Test
	public void getSchedaSedeByIdSedeTest() {
		sedeService.getSchedaSedeByIdSede(1L);
	}
	
	@Test
	public void getSchedaSedeByIdProgettoAndIdEnteAndIdSedeTest() {
		sedeService.getSchedaSedeByIdProgettoAndIdEnteAndIdSede(256L, 1005L, 1L, "DTD");
	}
}
