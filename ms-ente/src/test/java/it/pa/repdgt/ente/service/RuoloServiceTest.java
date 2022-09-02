package it.pa.repdgt.ente.service;

import static org.assertj.core.api.Assertions.assertThatExceptionOfType;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;

import it.pa.repdgt.ente.exception.RuoloException;
import it.pa.repdgt.ente.repository.RuoloRepository;
import it.pa.repdgt.shared.entity.RuoloEntity;
import it.pa.repdgt.shared.entity.UtenteEntity;

@ExtendWith(MockitoExtension.class)
public class RuoloServiceTest {
	
	@Mock
	private UtenteService utenteService;
	@Mock
	private UtenteXRuoloService utenteXRuoloService;
	@Mock
	private RuoloRepository ruoloRepository;

	@Autowired
	@InjectMocks
	private RuoloService ruoloService;
	
	RuoloEntity ruoloEntity;
	List<RuoloEntity> listaRuoli;
	UtenteEntity utenteEntity;
	
	@BeforeEach
	public void setUp() {
		ruoloEntity = new RuoloEntity();
		ruoloEntity.setCodice("REG");
		listaRuoli = new ArrayList<>();
		listaRuoli.add(ruoloEntity);
		utenteEntity = new UtenteEntity();
		utenteEntity.setId(1L);
		utenteEntity.setCodiceFiscale("CFUTENTE");
	}
	
	@Test
	public void getRuoliByCodiceFiscaleTest() {
		when(this.ruoloRepository.findRuoliByCodiceFiscale("CODICEFISCALE")).thenReturn(listaRuoli);
		ruoloService.getRuoliByCodiceFiscale("CODICEFISCALE");
	}
	
	@Test
	public void getRuoloByCodiceRuoloTest() {
		when(this.ruoloRepository.findByCodice(ruoloEntity.getCodice())).thenReturn(ruoloEntity);
		ruoloService.getRuoloByCodiceRuolo(ruoloEntity.getCodice());
	}
	
	@Test
	public void aggiungiRuoloAUtenteTest() {
		when(this.utenteService.esisteUtenteByCodiceFiscale(utenteEntity.getCodiceFiscale())).thenReturn(true);
		when(this.ruoloRepository.existsById(ruoloEntity.getCodice())).thenReturn(true);
		ruoloService.aggiungiRuoloAUtente(utenteEntity.getCodiceFiscale(), ruoloEntity.getCodice());
	}
	
	@Test
	public void aggiungiRuoloAUtenteKOTest() {
		//test KO per utente non esistente
		when(this.utenteService.esisteUtenteByCodiceFiscale(utenteEntity.getCodiceFiscale())).thenReturn(false);
		Assertions.assertThrows(RuoloException.class, () -> ruoloService.aggiungiRuoloAUtente(utenteEntity.getCodiceFiscale(), ruoloEntity.getCodice()));
		assertThatExceptionOfType(RuoloException.class);
		
		//test KO per ruolo non esistente
		when(this.utenteService.esisteUtenteByCodiceFiscale(utenteEntity.getCodiceFiscale())).thenReturn(true);
		when(this.ruoloRepository.existsById(ruoloEntity.getCodice())).thenReturn(false);
		Assertions.assertThrows(RuoloException.class, () -> ruoloService.aggiungiRuoloAUtente(utenteEntity.getCodiceFiscale(), ruoloEntity.getCodice()));
		assertThatExceptionOfType(RuoloException.class);
	}
	
	@Test
	public void cancellaRuoloUtenteTest() {
		when(this.utenteService.esisteUtenteByCodiceFiscale(utenteEntity.getCodiceFiscale())).thenReturn(true);
		when(this.ruoloRepository.existsById(ruoloEntity.getCodice())).thenReturn(true);
		ruoloService.cancellaRuoloUtente(utenteEntity.getCodiceFiscale(), ruoloEntity.getCodice());
	}
	
	@Test
	public void cancellaRuoloUtenteKOTest() {
		//test KO per utente non esistente
		when(this.utenteService.esisteUtenteByCodiceFiscale(utenteEntity.getCodiceFiscale())).thenReturn(false);
		Assertions.assertThrows(RuoloException.class, () -> ruoloService.cancellaRuoloUtente(utenteEntity.getCodiceFiscale(), ruoloEntity.getCodice()));
		assertThatExceptionOfType(RuoloException.class);
		
		//test KO per ruolo non esistente
		when(this.utenteService.esisteUtenteByCodiceFiscale(utenteEntity.getCodiceFiscale())).thenReturn(true);
		when(this.ruoloRepository.existsById(ruoloEntity.getCodice())).thenReturn(false);
		Assertions.assertThrows(RuoloException.class, () -> ruoloService.cancellaRuoloUtente(utenteEntity.getCodiceFiscale(), ruoloEntity.getCodice()));
		assertThatExceptionOfType(RuoloException.class);
	}
}
