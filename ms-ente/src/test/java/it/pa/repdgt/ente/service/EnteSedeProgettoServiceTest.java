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
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;

import it.pa.repdgt.ente.exception.EnteSedeProgettoException;
import it.pa.repdgt.ente.exception.ResourceNotFoundException;
import it.pa.repdgt.ente.repository.EnteSedeProgettoRepository;
import it.pa.repdgt.shared.entity.EnteEntity;
import it.pa.repdgt.shared.entity.EnteSedeProgetto;
import it.pa.repdgt.shared.entity.EnteSedeProgettoFacilitatoreEntity;
import it.pa.repdgt.shared.entity.ProgettoEntity;
import it.pa.repdgt.shared.entity.SedeEntity;
import it.pa.repdgt.shared.entity.UtenteEntity;
import it.pa.repdgt.shared.entity.key.EnteSedeProgettoFacilitatoreKey;
import it.pa.repdgt.shared.entity.key.EnteSedeProgettoKey;

@ExtendWith(MockitoExtension.class)
public class EnteSedeProgettoServiceTest {
	
	@Mock
	private EnteSedeProgettoRepository enteSedeProgettoRepository;
	@Mock
	private SedeService sedeService;
	@Mock
	private EnteService enteService;
	@Mock
	private ProgettoService progettoService;
	@Mock
	private EnteSedeProgettoFacilitatoreService enteSedeProgettoFacilitatoreService;

	@Autowired
	@InjectMocks
	private EnteSedeProgettoService enteSedeProgettoService;
	
	EnteEntity ente1;
	SedeEntity sede1;
	ProgettoEntity progetto1;
	UtenteEntity utente1;
	EnteSedeProgettoKey enteSedeProgettoKey;
	EnteSedeProgetto enteSedeProgetto;
	EnteSedeProgettoFacilitatoreKey enteSedeProgettoFacilitatoreKey;
	EnteSedeProgettoFacilitatoreEntity enteSedeProgettoFacilitatoreEntity;
	List<EnteSedeProgettoFacilitatoreEntity> listaEnteSedeProgettoFacilitatore;
	List<EnteSedeProgetto> listaEnteSedeProgetto;
	
	@BeforeEach
	public void setUp() {
		ente1 = new EnteEntity();
		ente1.setId(1L);
		sede1 = new SedeEntity();
		sede1.setId(1L);
		progetto1 = new ProgettoEntity();
		progetto1.setId(1L);
		progetto1.setStato("NON ATTIVO");
		enteSedeProgettoKey = new EnteSedeProgettoKey(ente1.getId(), sede1.getId(), progetto1.getId());
		enteSedeProgetto = new EnteSedeProgetto();
		enteSedeProgetto.setId(enteSedeProgettoKey);
		enteSedeProgetto.setStatoSede("NON ATTIVO");
		utente1 = new UtenteEntity();
		utente1.setId(1L);
		utente1.setCodiceFiscale("ABCSDO95R32M894K");
		enteSedeProgettoFacilitatoreKey = new EnteSedeProgettoFacilitatoreKey(ente1.getId(), sede1.getId(), progetto1.getId(), utente1.getCodiceFiscale());
		enteSedeProgettoFacilitatoreEntity = new EnteSedeProgettoFacilitatoreEntity();
		enteSedeProgettoFacilitatoreEntity.setId(enteSedeProgettoFacilitatoreKey);
		enteSedeProgettoFacilitatoreEntity.setStatoUtente("ATTIVO");
		listaEnteSedeProgettoFacilitatore = new ArrayList<>();
		listaEnteSedeProgettoFacilitatore.add(enteSedeProgettoFacilitatoreEntity);
		listaEnteSedeProgetto = new ArrayList<>();
		listaEnteSedeProgetto.add(enteSedeProgetto);
	}
	
	
	@Test
	public void getAssociazioneEnteSedeProgettoTest() {
		when(this.enteSedeProgettoRepository.findById(Mockito.any(EnteSedeProgettoKey.class))).thenReturn(Optional.of(enteSedeProgetto));
		enteSedeProgettoService.getAssociazioneEnteSedeProgetto(sede1.getId(), ente1.getId(), progetto1.getId());
	}
	
	@Test
	public void getAssociazioneEnteSedeProgettoKOTest() {
		//test KO per enteSedeProgetto entity non trovato
		when(this.enteSedeProgettoRepository.findById(Mockito.any(EnteSedeProgettoKey.class))).thenReturn(Optional.empty());
		Assertions.assertThrows(ResourceNotFoundException.class, () -> enteSedeProgettoService.getAssociazioneEnteSedeProgetto(sede1.getId(), ente1.getId(), progetto1.getId()));
		assertThatExceptionOfType(ResourceNotFoundException.class);
	}
	
	@Test
	public void associaEnteSedeProgettoTest() {
		when(this.sedeService.getSedeById(sede1.getId())).thenReturn(sede1);
		when(this.enteService.getEnteById(ente1.getId())).thenReturn(ente1);
		when(this.progettoService.getProgettoById(progetto1.getId())).thenReturn(progetto1);
		enteSedeProgettoService.associaEnteSedeProgetto(sede1.getId(), ente1.getId(), "Gestore di Progetto", progetto1.getId());
	}
	
	@Test
	public void associaEnteSedeProgettoKOTest() {
		//test KO per ente, sede o progetto inesistente
		when(this.sedeService.getSedeById(sede1.getId())).thenReturn(sede1);
		when(this.enteService.getEnteById(ente1.getId())).thenReturn(ente1);
		when(this.progettoService.getProgettoById(progetto1.getId())).thenThrow(ResourceNotFoundException.class);
		Assertions.assertThrows(EnteSedeProgettoException.class, () -> enteSedeProgettoService.associaEnteSedeProgetto(sede1.getId(), ente1.getId(), "Gestore di Progetto", progetto1.getId()));
		assertThatExceptionOfType(ResourceNotFoundException.class);
	}
	
	@Test
	public void cancellaOTerminaAssociazioneEnteSedeProgettoTest() {
		//test con stato sede = NON ATTIVO
		when(this.enteSedeProgettoRepository.findById(Mockito.any(EnteSedeProgettoKey.class))).thenReturn(Optional.of(enteSedeProgetto));
		when(this.enteSedeProgettoRepository.existsById(Mockito.any(EnteSedeProgettoKey.class))).thenReturn(true);
		doAnswer(invocation -> {
			return null;
		}).when(this.enteSedeProgettoFacilitatoreService).cancellaAssociazioniFacilitatoriOVolontariAEnteSedeProgetto(sede1.getId(), ente1.getId(), progetto1.getId());
		enteSedeProgettoService.cancellaOTerminaAssociazioneEnteSedeProgetto(ente1.getId(), sede1.getId(), progetto1.getId());
	}
	
	@Test
	public void cancellaOTerminaAssociazioneEnteSedeProgettoTest2() {
		//test con ente, sede e progetto disassociabili e stato sede = ATTIVO
		enteSedeProgetto.setStatoSede("ATTIVO");
		when(this.enteSedeProgettoRepository.findById(Mockito.any(EnteSedeProgettoKey.class))).thenReturn(Optional.of(enteSedeProgetto));
		when(this.progettoService.getStatoProgettoById(progetto1.getId())).thenReturn("NON ATTIVO");
		when(this.enteSedeProgettoRepository.existsById(Mockito.any(EnteSedeProgettoKey.class))).thenReturn(true);
		enteSedeProgettoService.cancellaOTerminaAssociazioneEnteSedeProgetto(ente1.getId(), sede1.getId(), progetto1.getId());
	}
	
	@Test
	public void cancellaOTerminaAssociazioneEnteSedeProgettoKOTest() {
		enteSedeProgetto.setStatoSede("ATTIVO");
		when(this.enteSedeProgettoRepository.findById(Mockito.any(EnteSedeProgettoKey.class))).thenReturn(Optional.of(enteSedeProgetto));
		when(this.progettoService.getStatoProgettoById(progetto1.getId())).thenReturn("ATTIVO");
		Assertions.assertThrows(EnteSedeProgettoException.class, () -> enteSedeProgettoService.cancellaOTerminaAssociazioneEnteSedeProgetto(ente1.getId(), sede1.getId(), progetto1.getId()));
		assertThatExceptionOfType(ResourceNotFoundException.class);
	}
	
	@Test
	public void terminaAssociazioneEnteSedeProgettoTest() {
		when(this.enteSedeProgettoRepository.existsById(Mockito.any(EnteSedeProgettoKey.class))).thenReturn(true);
		when(this.enteSedeProgettoFacilitatoreService.getAllFacilitatoriByEnteAndSedeAndProgetto(ente1.getId(), sede1.getId(), progetto1.getId())).thenReturn(listaEnteSedeProgettoFacilitatore);
		when(this.enteSedeProgettoRepository.findById(Mockito.any(EnteSedeProgettoKey.class))).thenReturn(Optional.of(enteSedeProgetto));
		enteSedeProgettoService.terminaAssociazioneEnteSedeProgetto(ente1.getId(), sede1.getId(), progetto1.getId());
	}
	
	@Test
	public void terminaAssociazioneEnteSedeProgettoKOTest() {
		//test KO per enteSedeProgetto inesistente
		when(this.enteSedeProgettoRepository.existsById(Mockito.any(EnteSedeProgettoKey.class))).thenReturn(false);
		Assertions.assertThrows(EnteSedeProgettoException.class, () -> 	enteSedeProgettoService.terminaAssociazioneEnteSedeProgetto(ente1.getId(), sede1.getId(), progetto1.getId()));
		assertThatExceptionOfType(ResourceNotFoundException.class);
	}
	
	@Test
	public void cancellazioneAssociazioneEnteSedeProgettoTest() {
		when(this.enteSedeProgettoRepository.existsById(Mockito.any(EnteSedeProgettoKey.class))).thenReturn(true);
		when(this.enteSedeProgettoRepository.findById(Mockito.any(EnteSedeProgettoKey.class))).thenReturn(Optional.of(enteSedeProgetto));
		enteSedeProgettoService.cancellazioneAssociazioneEnteSedeProgetto(ente1.getId(), sede1.getId(), progetto1.getId());
	}
	
	@Test
	public void cancellazioneAssociazioneEnteSedeProgettoKOTest() {
		//test KO per enteSedeProgettoKey inesistente
		when(this.enteSedeProgettoRepository.existsById(Mockito.any(EnteSedeProgettoKey.class))).thenReturn(false);
		Assertions.assertThrows(EnteSedeProgettoException.class, () -> 	enteSedeProgettoService.cancellazioneAssociazioneEnteSedeProgetto(ente1.getId(), sede1.getId(), progetto1.getId()));
		assertThatExceptionOfType(ResourceNotFoundException.class);
	}
	
	@Test
	public void cancellazioneAssociazioniEnteSedeProgettoByIdEnteAndIdProgettoTest() {
		doAnswer(invocation -> {
			return null;
		}).when(this.enteSedeProgettoRepository).cancellazioneAssociazioniEnteSedeProgettoByIdEnteAndIdProgetto(ente1.getId(), progetto1.getId());
		enteSedeProgettoService.cancellazioneAssociazioniEnteSedeProgettoByIdEnteAndIdProgetto(ente1.getId(), progetto1.getId());
	}
	
	@Test
	public void getSediPerProgettoAndEnteTest() {
		when(this.enteSedeProgettoRepository.findSediPerProgettoAndEnte(ente1.getId(), progetto1.getId())).thenReturn(listaEnteSedeProgetto);
		enteSedeProgettoService.getSediPerProgettoAndEnte(ente1.getId(), progetto1.getId());
	}
	
	@Test
	public void salvaEnteSedeProgettoTest() {
		when(this.enteSedeProgettoRepository.save(enteSedeProgetto)).thenReturn(enteSedeProgetto);
		enteSedeProgettoService.salvaEnteSedeProgetto(enteSedeProgetto);
	}
}
