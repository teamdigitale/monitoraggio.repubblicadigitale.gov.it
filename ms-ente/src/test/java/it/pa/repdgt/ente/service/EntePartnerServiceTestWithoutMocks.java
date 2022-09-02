package it.pa.repdgt.ente.service;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class EntePartnerServiceTestWithoutMocks {
	
	@Autowired
	private EntePartnerService entePartnerService;
	
	@Test
	public void getSchedaEntePartnerByIdProgettoAndIdEnteTest() {
		entePartnerService.getSchedaEntePartnerByIdProgettoAndIdEnte(256L, 1005L);
	}
}
