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
import it.pa.repdgt.ente.repository.ReferentiDelegatiEntePartnerDiProgettoRepository;
import it.pa.repdgt.shared.entity.ReferentiDelegatiEntePartnerDiProgettoEntity;
import it.pa.repdgt.shared.entity.key.ReferentiDelegatiEntePartnerDiProgettoKey;

@ExtendWith(MockitoExtension.class)
public class ReferentiDelegatiEntePartnerDiProgettoServiceTest {
	
	@Mock
	private ReferentiDelegatiEntePartnerDiProgettoRepository referentiDelegatiEntePartnerDiProgettoRepository;

	@Autowired
	@InjectMocks
	private ReferentiDelegatiEntePartnerDiProgettoService referentiDelegatiEntePartnerDiProgettoService;
	
	ReferentiDelegatiEntePartnerDiProgettoKey referentiDelegatiEntePartnerDiProgettoKey;
	ReferentiDelegatiEntePartnerDiProgettoEntity referentiDelegatiEntePartnerDiProgettoEntity;
	List<ReferentiDelegatiEntePartnerDiProgettoEntity> listaReferentiDelegati;
	
	@BeforeEach
	public void setUp() {
		referentiDelegatiEntePartnerDiProgettoKey = new ReferentiDelegatiEntePartnerDiProgettoKey(1L, 1L, "DSF");
		referentiDelegatiEntePartnerDiProgettoEntity = new ReferentiDelegatiEntePartnerDiProgettoEntity();
		referentiDelegatiEntePartnerDiProgettoEntity.setId(referentiDelegatiEntePartnerDiProgettoKey);
		listaReferentiDelegati = new ArrayList<>();
		listaReferentiDelegati.add(referentiDelegatiEntePartnerDiProgettoEntity);
	}
	
	@Test
	public void saveTest() {
		when(this.referentiDelegatiEntePartnerDiProgettoRepository.save(referentiDelegatiEntePartnerDiProgettoEntity)).thenReturn(referentiDelegatiEntePartnerDiProgettoEntity);
		referentiDelegatiEntePartnerDiProgettoService.save(referentiDelegatiEntePartnerDiProgettoEntity);
	}
	
	@Test
	public void getReferentiEntePartnerByIdProgettoAndIdEnteTest() {
		when(this.referentiDelegatiEntePartnerDiProgettoRepository.findNomeStatoReferentiEntePartnerByIdProgettoAndIdEnte(1L, 1L)).thenReturn(null);
		referentiDelegatiEntePartnerDiProgettoService.getReferentiEntePartnerByIdProgettoAndIdEnte(1L, 1L);
	}
	
	@Test
	public void getDelegatiEntePartnerByIdProgettoAndIdEnteTest() {
		when(this.referentiDelegatiEntePartnerDiProgettoRepository.findNomeStatoDelegatiEntePartnerByIdProgettoAndIdEnte(1L, 1L)).thenReturn(null);
		referentiDelegatiEntePartnerDiProgettoService.getDelegatiEntePartnerByIdProgettoAndIdEnte(1L, 1L);
	}
	
	@Test
	public void esisteByIdTest() {
		when(this.referentiDelegatiEntePartnerDiProgettoRepository.existsById(referentiDelegatiEntePartnerDiProgettoKey)).thenReturn(true);
		referentiDelegatiEntePartnerDiProgettoService.esisteById(referentiDelegatiEntePartnerDiProgettoKey);
	}
	
	@Test
	public void getByIdTest() {
		when(this.referentiDelegatiEntePartnerDiProgettoRepository.findById(referentiDelegatiEntePartnerDiProgettoKey)).thenReturn(Optional.of(referentiDelegatiEntePartnerDiProgettoEntity));
		referentiDelegatiEntePartnerDiProgettoService.getById(referentiDelegatiEntePartnerDiProgettoKey);
	}
	
	@Test
	public void findAltriReferentiODelegatiAttiviTest() {
		when(this.referentiDelegatiEntePartnerDiProgettoRepository.findAltriReferentiODelegatiAttivi(1L, 1L, "DSF", "REPP")).thenReturn(listaReferentiDelegati);
		referentiDelegatiEntePartnerDiProgettoService.findAltriReferentiODelegatiAttivi(1L, 1L, "DSF", "REPP");
	}
	
	@Test
	public void findAltreAssociazioniTest() {
		when(this.referentiDelegatiEntePartnerDiProgettoRepository.findAltreAssociazioni(1L, 1L, "DSF", "REPP")).thenReturn(listaReferentiDelegati);
		referentiDelegatiEntePartnerDiProgettoService.findAltreAssociazioni(1L, 1L, "DSF", "REPP");
	}
	
	@Test
	public void cancellaAssociazioneReferenteDelegatoGestoreProgettoTest() {
		doAnswer(invocation -> {
			return null;
		}).when(this.referentiDelegatiEntePartnerDiProgettoRepository).deleteById(referentiDelegatiEntePartnerDiProgettoKey);
		referentiDelegatiEntePartnerDiProgettoService.cancellaAssociazioneReferenteDelegatoGestoreProgetto(referentiDelegatiEntePartnerDiProgettoKey);
	}
	
	@Test
	public void cancellaAssociazioneReferenteDelegatoEntePartnerPerProgettoTest() {
		doAnswer(invocation -> {
			return null;
		}).when(this.referentiDelegatiEntePartnerDiProgettoRepository).cancellaAssociazioneReferenteDelegatoEntePartnerPerProgetto(1L, 1L);
		referentiDelegatiEntePartnerDiProgettoService.cancellaAssociazioneReferenteDelegatoEntePartnerPerProgetto(1L, 1L);
	}
	
	@Test
	public void getReferentiDelegatiEntePartnerTest() {
		when(this.referentiDelegatiEntePartnerDiProgettoRepository.findReferentiDelegatiEntePartner(1L, 1L)).thenReturn(listaReferentiDelegati);
		referentiDelegatiEntePartnerDiProgettoService.getReferentiDelegatiEntePartner(1L, 1L);
	}
	
	@Test
	public void countAssociazioniReferenteDelegatiTest() {
		when(this.referentiDelegatiEntePartnerDiProgettoRepository.countAssociazioniReferenteDelegati("DSF", "REPP")).thenReturn(1);
		referentiDelegatiEntePartnerDiProgettoService.countAssociazioniReferenteDelegati("DSF", "REPP");
	}
	
	@Test
	public void getReferenteDelegatoEntePartnerTest() {
		when(this.referentiDelegatiEntePartnerDiProgettoRepository.findReferenteDelegatoEntePartner(1L, "DSF", 1L, "REPP")).thenReturn(Optional.of(referentiDelegatiEntePartnerDiProgettoEntity));
		referentiDelegatiEntePartnerDiProgettoService.getReferenteDelegatoEntePartner(1L, "DSF", 1L, "REPP");
	}
	
	@Test
	public void getReferenteDelegatoEntePartnerKOTest() {
		//test KO per referente/delegato non trovato
		when(this.referentiDelegatiEntePartnerDiProgettoRepository.findReferenteDelegatoEntePartner(1L, "DSF", 1L, "REPP")).thenReturn(Optional.empty());
		Assertions.assertThrows(ResourceNotFoundException.class, () -> 	referentiDelegatiEntePartnerDiProgettoService.getReferenteDelegatoEntePartner(1L, "DSF", 1L, "REPP"));
		assertThatExceptionOfType(ResourceNotFoundException.class);
	}
	
	@Test
	public void getReferentiAndDelegatiByIdProgettoAndIdEnteTest() {
		when(this.referentiDelegatiEntePartnerDiProgettoRepository.findReferentiAndDelegatiByIdProgettoAndIdEnte(1L, 1L)).thenReturn(listaReferentiDelegati);
		referentiDelegatiEntePartnerDiProgettoService.getReferentiAndDelegatiByIdProgettoAndIdEnte(1L, 1L);
	}
}
