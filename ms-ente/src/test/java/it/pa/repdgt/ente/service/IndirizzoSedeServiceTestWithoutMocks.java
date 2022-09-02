package it.pa.repdgt.ente.service;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class IndirizzoSedeServiceTestWithoutMocks {

	@Autowired
	private IndirizzoSedeService indirizzoSedeService;
	
	@Test
	public void getIndirizzoSedeByIdSedeTest() {
		indirizzoSedeService.getIndirizzoSedeByIdSede(1L);
	}
}
