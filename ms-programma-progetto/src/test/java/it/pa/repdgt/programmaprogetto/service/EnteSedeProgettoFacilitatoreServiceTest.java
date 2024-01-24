package it.pa.repdgt.programmaprogetto.service;

import static org.mockito.Mockito.doAnswer;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;

import it.pa.repdgt.programmaprogetto.projection.UtenteFacilitatoreProjection;
import it.pa.repdgt.programmaprogetto.repository.EnteSedeProgettoFacilitatoreRepository;
import it.pa.repdgt.programmaprogetto.repository.RuoloRepository;
import it.pa.repdgt.shared.entity.EnteEntity;
import it.pa.repdgt.shared.entity.EnteSedeProgettoFacilitatoreEntity;
import it.pa.repdgt.shared.entity.ProgettoEntity;
import it.pa.repdgt.shared.entity.RuoloEntity;
import it.pa.repdgt.shared.entity.SedeEntity;
import it.pa.repdgt.shared.entity.UtenteEntity;
import it.pa.repdgt.shared.entity.key.EnteSedeProgettoFacilitatoreKey;
import it.pa.repdgt.shared.entity.key.UtenteXRuoloKey;

//@ExtendWith(MockitoExtension.class)
public class EnteSedeProgettoFacilitatoreServiceTest {

	@Mock
	private EnteSedeProgettoFacilitatoreRepository enteSedeProgettoFacilitatoreRepository;
	@Mock
	private RuoloRepository ruoloRepository;

	@Mock
	private RuoloService ruoloService;
	@Mock
	private UtenteService utenteService;
	@Mock
	private UtenteXRuoloService utenteXRuoloService;

	@Autowired
	@InjectMocks
	private EnteSedeProgettoFacilitatoreService enteSedeProgettoFacilitatoreService;

	SedeEntity sede1;
	EnteEntity ente1;
	ProgettoEntity progetto1;
	UtenteEntity utente1;
	List<RuoloEntity> listaRuoli;
	RuoloEntity ruolo;
	List<EnteSedeProgettoFacilitatoreEntity> listaEnteSedeProgettoFacilitatore;
	EnteSedeProgettoFacilitatoreKey enteSedeProgettoFacilitatoreKey;
	EnteSedeProgettoFacilitatoreEntity enteSedeProgettoFacilitatore;

	@BeforeEach
	public void setUp() {
		ruolo = new RuoloEntity();
		ruolo.setCodice("FAC");
		listaRuoli = new ArrayList<>();
		listaRuoli.add(ruolo);
		sede1 = new SedeEntity();
		sede1.setId(1L);
		sede1.setNome("sede1");
		ente1 = new EnteEntity();
		ente1.setId(1L);
		ente1.setNome("ente1");
		progetto1 = new ProgettoEntity();
		progetto1.setId(1L);
		progetto1.setNome("progetto 1");
		progetto1.setStato("ATTIVO");
		utente1 = new UtenteEntity();
		utente1.setId(1L);
		utente1.setCodiceFiscale("DFFRET93B32N202K");
		utente1.setRuoli(listaRuoli);
		enteSedeProgettoFacilitatoreKey = new EnteSedeProgettoFacilitatoreKey(ente1.getId(), sede1.getId(),
				progetto1.getId(), utente1.getCodiceFiscale());
		enteSedeProgettoFacilitatore = new EnteSedeProgettoFacilitatoreEntity();
		enteSedeProgettoFacilitatore.setId(enteSedeProgettoFacilitatoreKey);
		enteSedeProgettoFacilitatore.setRuoloUtente(ruolo.getCodice());
		listaEnteSedeProgettoFacilitatore = new ArrayList<>();
		listaEnteSedeProgettoFacilitatore.add(enteSedeProgettoFacilitatore);
	}

	// @Test
	public void cancellaAssociazioneFacilitatoreOVolontarioAEnteSedeProgettoTest() {
		when(enteSedeProgettoFacilitatoreRepository.findAltreAssociazioni(progetto1.getId(), utente1.getCodiceFiscale(),
				ruolo.getCodice())).thenReturn(new ArrayList<>());
		when(utenteService.esisteUtenteByCodiceFiscale(utente1.getCodiceFiscale())).thenReturn(true);
		when(ruoloRepository.existsById(ruolo.getCodice())).thenReturn(true);
		doAnswer(invocation -> {
			this.utenteService.esisteUtenteByCodiceFiscale(utente1.getCodiceFiscale());
			this.ruoloRepository.existsById(ruolo.getCodice());
			UtenteXRuoloKey id = new UtenteXRuoloKey(utente1.getCodiceFiscale(), ruolo.getCodice());
			this.utenteXRuoloService.cancellaRuoloUtente(id);
			return null;
		}).when(ruoloService).cancellaRuoloUtente(utente1.getCodiceFiscale(), ruolo.getCodice());
		enteSedeProgettoFacilitatoreService.cancellaAssociazioneFacilitatoreOVolontarioAEnteSedeProgetto(
				utente1.getCodiceFiscale(), sede1.getId(), ente1.getId(), progetto1.getId(), ruolo.getCodice());
		verify(ruoloService, times(1)).cancellaRuoloUtente(utente1.getCodiceFiscale(), ruolo.getCodice());
	}

	// @Test
	public void cancellaAssociazioniFacilitatoriOVolontariAEnteSedeProgettoTest() {
		when(enteSedeProgettoFacilitatoreRepository.findAllFacilitatoriEVolontariBySedeAndEnteAndProgetto(sede1.getId(),
				ente1.getId(), progetto1.getId())).thenReturn(listaEnteSedeProgettoFacilitatore);
		when(enteSedeProgettoFacilitatoreRepository.findAltreAssociazioni(progetto1.getId(), utente1.getCodiceFiscale(),
				ruolo.getCodice())).thenReturn(new ArrayList<>());
		when(utenteService.esisteUtenteByCodiceFiscale(utente1.getCodiceFiscale())).thenReturn(true);
		when(ruoloRepository.existsById(ruolo.getCodice())).thenReturn(true);
		doAnswer(invocation -> {
			this.utenteService.esisteUtenteByCodiceFiscale(utente1.getCodiceFiscale());
			this.ruoloRepository.existsById(ruolo.getCodice());
			UtenteXRuoloKey id = new UtenteXRuoloKey(utente1.getCodiceFiscale(), ruolo.getCodice());
			this.utenteXRuoloService.cancellaRuoloUtente(id);
			return null;
		}).when(ruoloService).cancellaRuoloUtente(utente1.getCodiceFiscale(), ruolo.getCodice());
		enteSedeProgettoFacilitatoreService.cancellaAssociazioniFacilitatoriOVolontariAEnteSedeProgetto(sede1.getId(),
				ente1.getId(), progetto1.getId());
		verify(ruoloService, times(1)).cancellaRuoloUtente(utente1.getCodiceFiscale(), ruolo.getCodice());
	}

	// @Test
	public void getAllFacilitatoriEVolontariBySedeAndEnteAndProgettoTest() {
		when(enteSedeProgettoFacilitatoreRepository.findAllFacilitatoriEVolontariBySedeAndEnteAndProgetto(sede1.getId(),
				ente1.getId(), progetto1.getId())).thenReturn(listaEnteSedeProgettoFacilitatore);
		enteSedeProgettoFacilitatoreService.getAllFacilitatoriEVolontariBySedeAndEnteAndProgetto(sede1.getId(),
				ente1.getId(), progetto1.getId());
		verify(enteSedeProgettoFacilitatoreRepository, times(1))
				.findAllFacilitatoriEVolontariBySedeAndEnteAndProgetto(sede1.getId(), ente1.getId(), progetto1.getId());
	}

	// test in cui non esistono altre associazioni di quell'utente con quel ruolo
	// quindi la chiamata a
	// ruoloService.cancellaRuoloUtente(utente1.getCodiceFiscale(),
	// ruolo.getCodice()) verrà eseguita
	// @Test
	public void cancellaAssociazioneFacilitatoreOVolontarioTest() {
		when(enteSedeProgettoFacilitatoreRepository.findAltreAssociazioni(progetto1.getId(), utente1.getCodiceFiscale(),
				ruolo.getCodice())).thenReturn(new ArrayList<>());
		when(utenteService.esisteUtenteByCodiceFiscale(utente1.getCodiceFiscale())).thenReturn(true);
		when(ruoloRepository.existsById(ruolo.getCodice())).thenReturn(true);
		doAnswer(invocation -> {
			this.utenteService.esisteUtenteByCodiceFiscale(utente1.getCodiceFiscale());
			this.ruoloRepository.existsById(ruolo.getCodice());
			UtenteXRuoloKey id = new UtenteXRuoloKey(utente1.getCodiceFiscale(), ruolo.getCodice());
			this.utenteXRuoloService.cancellaRuoloUtente(id);
			return null;
		}).when(ruoloService).cancellaRuoloUtente(utente1.getCodiceFiscale(), ruolo.getCodice());
		enteSedeProgettoFacilitatoreService.cancellaAssociazioneFacilitatoreOVolontario(sede1.getId(), ente1.getId(),
				progetto1.getId(), utente1.getCodiceFiscale(), ruolo.getCodice());
		verify(ruoloService, times(1)).cancellaRuoloUtente(utente1.getCodiceFiscale(), ruolo.getCodice());
	}

	// test in cui esistono altre associazioni di quell'utente con quel ruolo
	// quindi la chiamata a
	// ruoloService.cancellaRuoloUtente(utente1.getCodiceFiscale(),
	// ruolo.getCodice()) non verrà eseguita
	// @Test
	public void cancellaAssociazioneFacilitatoreOVolontarioTest2() {
		when(enteSedeProgettoFacilitatoreRepository.findAltreAssociazioni(progetto1.getId(), utente1.getCodiceFiscale(),
				ruolo.getCodice())).thenReturn(listaEnteSedeProgettoFacilitatore);
		enteSedeProgettoFacilitatoreService.cancellaAssociazioneFacilitatoreOVolontario(sede1.getId(), ente1.getId(),
				progetto1.getId(), utente1.getCodiceFiscale(), ruolo.getCodice());
		verify(ruoloService, times(0)).cancellaRuoloUtente(utente1.getCodiceFiscale(), ruolo.getCodice());
	}

	// @Test
	public void salvaEnteSedeProgettoFacilitatoreTest() {
		when(enteSedeProgettoFacilitatoreRepository.save(enteSedeProgettoFacilitatore))
				.thenReturn(enteSedeProgettoFacilitatore);
		enteSedeProgettoFacilitatoreService.salvaEnteSedeProgettoFacilitatore(enteSedeProgettoFacilitatore);
		verify(enteSedeProgettoFacilitatoreRepository, times(1)).save(enteSedeProgettoFacilitatore);
	}

	// @Test
	public void getAllEmailFacilitatoriEVolontariByProgetto() {
		List<UtenteFacilitatoreProjection> listaEmail = new ArrayList<>();
		when(enteSedeProgettoFacilitatoreRepository.findAllEmailFacilitatoriEVolontariByProgetto(progetto1.getId()))
				.thenReturn(listaEmail);
		enteSedeProgettoFacilitatoreService.getAllEmailFacilitatoriEVolontariByProgetto(progetto1.getId());
		verify(enteSedeProgettoFacilitatoreRepository, times(1))
				.findAllEmailFacilitatoriEVolontariByProgetto(progetto1.getId());
	}
}
