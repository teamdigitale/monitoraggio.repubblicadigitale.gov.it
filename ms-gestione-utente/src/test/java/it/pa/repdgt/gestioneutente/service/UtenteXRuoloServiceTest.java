package it.pa.repdgt.gestioneutente.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatExceptionOfType;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;

import java.util.Date;
import java.util.Optional;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;

import it.pa.repdgt.gestioneutente.exception.UtenteXRuoloException;
import it.pa.repdgt.gestioneutente.repository.UtenteXRuoloRepository;
import it.pa.repdgt.shared.entity.UtenteXRuolo;
import it.pa.repdgt.shared.entity.key.UtenteXRuoloKey;

@ExtendWith(MockitoExtension.class)
public class UtenteXRuoloServiceTest {

	@Mock
	private UtenteXRuoloRepository utenteXRuoloRepository;
	
	@Autowired
	@InjectMocks
	private UtenteXRuoloService utenteXRuoloService;
	
	UtenteXRuoloKey utenteXRuoloKey;
	UtenteXRuolo utenteXRuolo;
	
	@BeforeEach
	public void setUp() {
		utenteXRuoloKey = new UtenteXRuoloKey("RETFER89T32J273R", "DTD");
		utenteXRuolo = new UtenteXRuolo();
		utenteXRuolo.setId(utenteXRuoloKey);
		utenteXRuolo.setDataOraCreazione(new Date());
	}
	
	@Test
	public void saveTest() {
		when(this.utenteXRuoloRepository.save(utenteXRuolo)).thenReturn(utenteXRuolo);
		utenteXRuoloService.save(utenteXRuolo);
	}
	
	@Test
	public void getByIdTest() {
		when(this.utenteXRuoloRepository.findById(utenteXRuoloKey)).thenReturn(Optional.of(utenteXRuolo));
		UtenteXRuolo risultato = utenteXRuoloService.getById(utenteXRuoloKey);
		assertThat(risultato.getId()).isEqualTo(utenteXRuolo.getId());
	}
	
	@Test
	public void getByIdKOTest() {
		//test KO per utenteXRuoloEntity non trovata
		when(this.utenteXRuoloRepository.findById(utenteXRuoloKey)).thenReturn(Optional.empty());
		Assertions.assertThrows(UtenteXRuoloException.class, () -> utenteXRuoloService.getById(utenteXRuoloKey));
		assertThatExceptionOfType(UtenteXRuoloException.class);
	}
	
	@Test
	public void cancellaRuoloUtenteByIdTest() {
		doNothing().when(this.utenteXRuoloRepository).deleteById(utenteXRuoloKey);
		utenteXRuoloService.cancellaRuoloUtente(utenteXRuoloKey);
	}
	
	@Test
	public void getUtenteXRuoloByCfUtenteAndCodiceRuoloTest() {
		when(this.utenteXRuoloRepository.findUtenteXRuoloByCfUtenteAndCodiceRuolo(utenteXRuoloKey.getUtenteId(), utenteXRuoloKey.getRuoloCodice())).thenReturn(utenteXRuolo);
		UtenteXRuolo risultato = utenteXRuoloService.getUtenteXRuoloByCfUtenteAndCodiceRuolo(utenteXRuoloKey.getUtenteId(), utenteXRuoloKey.getRuoloCodice());
		assertThat(risultato.getId()).isEqualTo(utenteXRuolo.getId());
	}
	
	@Test
	public void cancellaRuoloUtenteTest() {
		doNothing().when(this.utenteXRuoloRepository).delete(utenteXRuolo);
		utenteXRuoloService.cancellaRuoloUtente(utenteXRuolo);
	}
	
	@Test
	public void countRuoliByCfUtenteTest() {
		when(this.utenteXRuoloRepository.countRuoliByCfUtente(utenteXRuoloKey.getUtenteId())).thenReturn(1);
		utenteXRuoloService.countRuoliByCfUtente(utenteXRuoloKey.getUtenteId());
	}
}
