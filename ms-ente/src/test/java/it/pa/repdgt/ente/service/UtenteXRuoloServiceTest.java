package it.pa.repdgt.ente.service;

import static org.assertj.core.api.Assertions.assertThatExceptionOfType;
import static org.mockito.Mockito.doAnswer;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;

import it.pa.repdgt.ente.exception.UtenteXRuoloException;
import it.pa.repdgt.ente.repository.UtenteXRuoloRepository;
import it.pa.repdgt.shared.entity.UtenteXRuolo;
import it.pa.repdgt.shared.entity.key.UtenteXRuoloKey;

@ExtendWith(MockitoExtension.class)
public class UtenteXRuoloServiceTest {
	
	@Mock
	private UtenteXRuoloRepository utenteXRuoloRepository;

	@Autowired
	@InjectMocks
	private UtenteXRuoloService utenteXRuoloService;
	
	UtenteXRuolo utenteXRuolo;
	UtenteXRuoloKey utenteXRuoloKey;
	
	@BeforeEach
	public void SetUp() {
		utenteXRuoloKey = new UtenteXRuoloKey("CFUTENTE", "REG");
		utenteXRuolo = new UtenteXRuolo();
		utenteXRuolo.setId(utenteXRuoloKey);
	}
	
	@Test
	public void saveTest() {
		when(this.utenteXRuoloRepository.save(utenteXRuolo)).thenReturn(utenteXRuolo);
		utenteXRuoloService.save(utenteXRuolo);
	}
	
	@Test
	public void getByIdTest() {
		when(this.utenteXRuoloRepository.findById(utenteXRuoloKey)).thenReturn(Optional.of(utenteXRuolo));
		when(this.utenteXRuoloRepository.findById(utenteXRuoloKey)).thenReturn(Optional.of(utenteXRuolo));
		utenteXRuoloService.getById(utenteXRuoloKey);
	}
	
	@Test
	public void getByIdKOTest() {
		//test KO per utenteXRuolo non trovato
		when(this.utenteXRuoloRepository.findById(utenteXRuoloKey)).thenReturn(Optional.empty());
		Assertions.assertThrows(UtenteXRuoloException.class, () -> utenteXRuoloService.getById(utenteXRuoloKey));
		assertThatExceptionOfType(UtenteXRuoloException.class);
	}
	
	@Test
	public void existsByIdTest() {
		when(this.utenteXRuoloRepository.findById(utenteXRuoloKey)).thenReturn(Optional.of(utenteXRuolo));
		utenteXRuoloService.existsById(utenteXRuoloKey);
	}
	
	@Test
	public void cancellaRuoloUtenteTest() {
		doAnswer(invocation -> {
			return null;
		}).when(this.utenteXRuoloRepository).deleteById(utenteXRuoloKey);
		utenteXRuoloService.cancellaRuoloUtente(utenteXRuoloKey);
	}
	
	@Test
	public void getUtenteXRuoloByCfUtenteAndCodiceRuoloTest() {
		when(this.utenteXRuoloRepository.findUtenteXRuoloByCfUtenteAndCodiceRuolo(utenteXRuolo.getId().getUtenteId(), utenteXRuolo.getId().getRuoloCodice())).thenReturn(utenteXRuolo);
		utenteXRuoloService.getUtenteXRuoloByCfUtenteAndCodiceRuolo(utenteXRuolo.getId().getUtenteId(), utenteXRuolo.getId().getRuoloCodice());
	}
	
	@Test
	public void cancellaRuoloUtenteEntityTest() {
		doAnswer(invocation -> {
			return null;
		}).when(this.utenteXRuoloRepository).delete(utenteXRuolo);
		utenteXRuoloService.cancellaRuoloUtente(utenteXRuolo);
	}
}
