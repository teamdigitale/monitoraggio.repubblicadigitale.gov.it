package it.pa.repdgt.gestioneutente.service;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import it.pa.repdgt.gestioneutente.exception.UtenteException;
import it.pa.repdgt.gestioneutente.repository.EntePartnerRepository;

@SpringBootTest
@ExtendWith(MockitoExtension.class)
public class EntePartnerServiceTest {
	@Mock
	private EntePartnerRepository entePartnerRepository;
	
	@InjectMocks
	@Autowired
	EntePartnerService service;
	
	
	@Test
	public void getIdProgettiEntePartnerByRuoloUtenteTest(){
		assertThat(service.getIdProgettiEntePartnerByRuoloUtente("cfUtente", "ruolo")).isNotNull();
	}
	
	@Test
	public void findEntePartnerTest() {
		assertThat(service.findEntePartnerByIdProgettoAndIdEnte(1005L, 256L)).isNotNull();
		
		Assertions.assertThrows(UtenteException.class, () -> service.findEntePartnerByIdProgettoAndIdEnte(1000L, 1L));
	}
}
