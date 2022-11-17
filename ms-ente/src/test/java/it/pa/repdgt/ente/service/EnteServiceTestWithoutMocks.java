package it.pa.repdgt.ente.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
@ExtendWith(MockitoExtension.class)
public class EnteServiceTestWithoutMocks {

	@Autowired
	private EnteService enteService;
	
	@Test
	public void getSchedaEnteGestoreProgrammaByIdProgrammaTest() {
		enteService.getSchedaEnteGestoreProgrammaByIdProgramma("DTD", 102L);
	}
	
}