package it.pa.repdgt.ente.service;

import static org.assertj.core.api.Assertions.assertThatExceptionOfType;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;

import it.pa.repdgt.ente.exception.ResourceNotFoundException;
import it.pa.repdgt.ente.repository.UtenteRepository;
import it.pa.repdgt.shared.entity.UtenteEntity;

@ExtendWith(MockitoExtension.class)
public class UtenteServiceTest {
	
	@Mock
	private UtenteRepository utenteRepository;

	@Autowired
	@InjectMocks
	private UtenteService utenteService;
	
	UtenteEntity utenteEntity;
	List<String> listaReferenti;
	
	@BeforeEach
	public void setUp() {
		utenteEntity = new UtenteEntity();
		utenteEntity.setId(1L);
		utenteEntity.setCodiceFiscale("CFUTENTE");
		listaReferenti = new ArrayList<>();
		listaReferenti.add("referente1");
	}
	
	@Test
	public void getUtenteByCodiceFiscaleTest() {
		when(this.utenteRepository.findByCodiceFiscale(utenteEntity.getCodiceFiscale())).thenReturn(Optional.of(utenteEntity));
		utenteService.getUtenteByCodiceFiscale(utenteEntity.getCodiceFiscale());
	}
	
	@Test
	public void getUtenteByCodiceFiscaleKOTest() {
		//test KO per utente non trovato
		when(this.utenteRepository.findByCodiceFiscale(utenteEntity.getCodiceFiscale())).thenReturn(Optional.empty());
		Assertions.assertThrows(ResourceNotFoundException.class, () -> utenteService.getUtenteByCodiceFiscale(utenteEntity.getCodiceFiscale()));
		assertThatExceptionOfType(ResourceNotFoundException.class);
	}
	
	@Test
	public void updateUtenteTest() {
		when(this.utenteRepository.save(utenteEntity)).thenReturn(utenteEntity);
		utenteService.updateUtente(utenteEntity);
	}
	
	@Test
	public void countFacilitatoriPerSedeProgettoEnteTest() {
		when(this.utenteRepository.countFacilitatoriPerSedeProgettoEnte(1L, 1L, 1L)).thenReturn(1);
		utenteService.countFacilitatoriPerSedeProgettoEnte(1L, 1L, 1L);
	}
	
	@Test
	public void getReferentiProgrammaByIdTest() {
		when(this.utenteRepository.findReferentiProgrammaById(1L)).thenReturn(listaReferenti);
		utenteService.getReferentiProgrammaById(1L);
	}

	@Test
	public void getReferentiProgettoByIdTest() {
		when(this.utenteRepository.findReferentiProgettoById(1L)).thenReturn(listaReferenti);
		utenteService.getReferentiProgettoById(1L);
	}
	
	@Test
	public void getReferentiEntePartnerProgettoByIdTest() {
		when(this.utenteRepository.findReferentiEntePartnerProgettoById(1L, 1L)).thenReturn(listaReferenti);
		utenteService.getReferentiEntePartnerProgettoById(1L, 1L);
	}
	
	@Test
	public void esisteUtenteByCodiceFiscaleTest() {
		when(this.utenteRepository.findByCodiceFiscale(utenteEntity.getCodiceFiscale())).thenReturn(Optional.of(utenteEntity));
		utenteService.esisteUtenteByCodiceFiscale(utenteEntity.getCodiceFiscale());
	}
}
