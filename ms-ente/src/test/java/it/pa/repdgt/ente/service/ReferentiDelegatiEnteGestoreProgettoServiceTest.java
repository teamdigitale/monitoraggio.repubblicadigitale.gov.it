package it.pa.repdgt.ente.service;

import static org.assertj.core.api.Assertions.assertThatExceptionOfType;
import static org.mockito.Mockito.doAnswer;
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
import it.pa.repdgt.ente.repository.ReferentiDelegatiEnteGestoreProgettoRepository;
import it.pa.repdgt.shared.entity.ReferentiDelegatiEnteGestoreProgettoEntity;
import it.pa.repdgt.shared.entity.key.ReferentiDelegatiEnteGestoreProgettoKey;

@ExtendWith(MockitoExtension.class)
public class ReferentiDelegatiEnteGestoreProgettoServiceTest {

	@Mock
	private ReferentiDelegatiEnteGestoreProgettoRepository referentiDelegatiEnteGestoreProgettoRepository;
	
	@Autowired
	@InjectMocks
	private ReferentiDelegatiEnteGestoreProgettoService referentiDelegatiEnteGestoreProgettoService;
	
	ReferentiDelegatiEnteGestoreProgettoKey referentiDelegatiEnteGestoreProgettoKey;
	ReferentiDelegatiEnteGestoreProgettoEntity referentiDelegatiEnteGestoreProgettoEntity;
	List<ReferentiDelegatiEnteGestoreProgettoEntity> listaReferentiDelegati;
	List<String> listaEmail;
	
	@BeforeEach
	public void setUp() {
		referentiDelegatiEnteGestoreProgettoKey = new ReferentiDelegatiEnteGestoreProgettoKey(1L, "DSF", 1L);
		referentiDelegatiEnteGestoreProgettoEntity = new ReferentiDelegatiEnteGestoreProgettoEntity();
		referentiDelegatiEnteGestoreProgettoEntity.setId(referentiDelegatiEnteGestoreProgettoKey);
		listaReferentiDelegati = new ArrayList<>();
		listaReferentiDelegati.add(referentiDelegatiEnteGestoreProgettoEntity);
		listaEmail = new ArrayList<>();
		listaEmail.add("Email");
	}
	
	@Test
	public void saveTest() {
		when(this.referentiDelegatiEnteGestoreProgettoRepository.save(referentiDelegatiEnteGestoreProgettoEntity)).thenReturn(referentiDelegatiEnteGestoreProgettoEntity);
		referentiDelegatiEnteGestoreProgettoService.save(referentiDelegatiEnteGestoreProgettoEntity);
	}
	
	@Test
	public void getReferentiEnteGestoreByIdProgettoAndIdEnteTest() {
		when(this.referentiDelegatiEnteGestoreProgettoRepository.findNomeStatoReferentiEnteGestoreByIdProgettoAndIdEnte(1L, 1L)).thenReturn(null);
		referentiDelegatiEnteGestoreProgettoService.getReferentiEnteGestoreByIdProgettoAndIdEnte(1L, 1L);
	}
	
	@Test
	public void getDelegatiEnteGestoreByIdProgettoAndIdEnteTest() {
		when(this.referentiDelegatiEnteGestoreProgettoRepository.findNomeStatoDelegatiEnteGestoreByIdProgettoAndIdEnte(1L, 1L)).thenReturn(null);
		referentiDelegatiEnteGestoreProgettoService.getDelegatiEnteGestoreByIdProgettoAndIdEnte(1L, 1L);
	}
	
	@Test
	public void esisteByIdTest() {
		when(this.referentiDelegatiEnteGestoreProgettoRepository.existsById(referentiDelegatiEnteGestoreProgettoKey)).thenReturn(true);
		referentiDelegatiEnteGestoreProgettoService.esisteById(referentiDelegatiEnteGestoreProgettoKey);
	}
	
	@Test
	public void getByIdTest() {
		when(this.referentiDelegatiEnteGestoreProgettoRepository.findById(referentiDelegatiEnteGestoreProgettoKey)).thenReturn(Optional.of(referentiDelegatiEnteGestoreProgettoEntity));
		referentiDelegatiEnteGestoreProgettoService.getById(referentiDelegatiEnteGestoreProgettoKey);
	}
	
	@Test
	public void findAltriReferentiODelegatiAttiviTest() {
		when(this.referentiDelegatiEnteGestoreProgettoRepository.findAltriReferentiODelegatiAttivi(1L, "DSF", 1L, "REGP")).thenReturn(listaReferentiDelegati);
		referentiDelegatiEnteGestoreProgettoService.findAltriReferentiODelegatiAttivi(1L, "DSF", 1L, "REGP");
	}
	
	@Test
	public void findAltreAssociazioniTest() {
		when(this.referentiDelegatiEnteGestoreProgettoRepository.findAltreAssociazioni(1L, "DSF", "REGP")).thenReturn(listaReferentiDelegati);
		referentiDelegatiEnteGestoreProgettoService.findAltreAssociazioni(1L, "DSF", "REGP");
	}
	
	@Test
	public void cancellaAssociazioneReferenteDelegatoGestoreProgettoTest() {
		doAnswer(invocation -> {
			return null;
		}).when(this.referentiDelegatiEnteGestoreProgettoRepository).deleteById(referentiDelegatiEnteGestoreProgettoKey);
		referentiDelegatiEnteGestoreProgettoService.cancellaAssociazioneReferenteDelegatoGestoreProgetto(referentiDelegatiEnteGestoreProgettoKey);
	}
	
	@Test
	public void getReferentiAndDelegatiPerProgettoTest() {
		when(this.referentiDelegatiEnteGestoreProgettoRepository.findReferentieDelegatiPerProgetto(1L)).thenReturn(listaReferentiDelegati);
		referentiDelegatiEnteGestoreProgettoService.getReferentiAndDelegatiPerProgetto(1L);
	}
	
	@Test
	public void getEmailReferentiAndDelegatiPerProgettoTest() {
		when(this.referentiDelegatiEnteGestoreProgettoRepository.findEmailReferentieDelegatiPerProgetto(1L)).thenReturn(listaEmail);
		referentiDelegatiEnteGestoreProgettoService.getEmailReferentiAndDelegatiPerProgetto(1L);
	}
	
	@Test
	public void cancellaAssociazioneTest() {
		doAnswer(invocation -> {
			return null;
		}).when(this.referentiDelegatiEnteGestoreProgettoRepository).delete(referentiDelegatiEnteGestoreProgettoEntity);
		referentiDelegatiEnteGestoreProgettoService.cancellaAssociazione(referentiDelegatiEnteGestoreProgettoEntity);
	}
	
	@Test
	public void countAssociazioniReferenteDelegatoTest() {
		when(this.referentiDelegatiEnteGestoreProgettoRepository.countAssociazioniReferenteDelegato("DSF", "REGP")).thenReturn(1);
		referentiDelegatiEnteGestoreProgettoService.countAssociazioniReferenteDelegato("DSF", "REGP");
	}
	
	@Test
	public void getReferenteDelegatiEnteGestoreProgettoTest() {
		when(this.referentiDelegatiEnteGestoreProgettoRepository.findReferenteDelegatiEnteGestoreProgetto(1L, "DSF", 1L, "REGP")).thenReturn(Optional.of(referentiDelegatiEnteGestoreProgettoEntity));
		referentiDelegatiEnteGestoreProgettoService.getReferenteDelegatiEnteGestoreProgetto(1L, "DSF", 1L, "REGP");
	}
	
	@Test
	public void getReferenteDelegatiEnteGestoreProgettoKOTest() {
		//test KO per referenti/delegati non trovati
		when(this.referentiDelegatiEnteGestoreProgettoRepository.findReferenteDelegatiEnteGestoreProgetto(1L, "DSF", 1L, "REGP")).thenReturn(Optional.empty());
		Assertions.assertThrows(ResourceNotFoundException.class, () -> 	referentiDelegatiEnteGestoreProgettoService.getReferenteDelegatiEnteGestoreProgetto(1L, "DSF", 1L, "REGP"));
		assertThatExceptionOfType(ResourceNotFoundException.class);
	}
	
	@Test
	public void getReferentiAndDelegatiByIdProgettoAndIdEnteTest() {
		when(this.referentiDelegatiEnteGestoreProgettoRepository.findReferentiAndDelegatiByIdProgettoAndIdEnte(1L, 1L)).thenReturn(listaReferentiDelegati);
		referentiDelegatiEnteGestoreProgettoService.getReferentiAndDelegatiByIdProgettoAndIdEnte(1L, 1L);
	}
}
