package it.pa.repdgt.programmaprogetto.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatExceptionOfType;
import static org.mockito.Mockito.doAnswer;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
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

import it.pa.repdgt.programmaprogetto.exception.ProgrammaException;
import it.pa.repdgt.programmaprogetto.exception.ResourceNotFoundException;
import it.pa.repdgt.programmaprogetto.repository.EnteRepository;
import it.pa.repdgt.programmaprogetto.repository.ReferentiDelegatiEntePartnerRepository;
import it.pa.repdgt.shared.entity.EnteEntity;
import it.pa.repdgt.shared.entity.EntePartnerEntity;
import it.pa.repdgt.shared.entity.ProgettoEntity;
import it.pa.repdgt.shared.entity.ProgrammaEntity;
import it.pa.repdgt.shared.entity.ReferentiDelegatiEntePartnerDiProgettoEntity;
import it.pa.repdgt.shared.entity.SedeEntity;
import it.pa.repdgt.shared.entity.UtenteEntity;
import it.pa.repdgt.shared.entity.key.EntePartnerKey;
import it.pa.repdgt.shared.entity.key.ReferentiDelegatiEntePartnerDiProgettoKey;
import it.pa.repdgt.shared.repository.storico.StoricoEntePartnerRepository;
import it.pa.repdgt.shared.service.storico.StoricoService;

@ExtendWith(MockitoExtension.class)
public class EnteServiceTest {
	
	@Mock
	private EnteRepository enteRepository;
	@Mock
	private StoricoEntePartnerRepository storicoEntePartnerRepository;
	@Mock
	private ReferentiDelegatiEntePartnerRepository referentiDelegatiEntePartnerRepository;
	@Mock
	private EntePartnerService entePartnerService;
	@Mock
	private StoricoService storicoService;
	@Mock
	private ReferentiDelegatiEntePartnerService referentiDelegatiEntePartnerService;
	
	@Autowired
	@InjectMocks
	private EnteService enteService;
	
	ProgettoEntity progetto1;
	EnteEntity ente1;
	SedeEntity sede1;
	EntePartnerKey entePartnerKey;
	EntePartnerEntity entePartner;
	UtenteEntity utente1;
	
	@BeforeEach
	public void setUp() {
		progetto1 = new ProgettoEntity();
		progetto1.setId(1L);
		progetto1.setNome("progetto1");
		ente1 = new EnteEntity();
		ente1.setId(1L);
		ente1.setNome("ente1");
		sede1 = new SedeEntity();
		sede1.setId(1L);
		sede1.setNome("sede1");
		entePartnerKey = new EntePartnerKey(progetto1.getId(), ente1.getId());
		entePartner = new EntePartnerEntity();
		entePartner.setId(entePartnerKey);
		entePartner.setStatoEntePartner("ATTIVO");
		utente1 = new UtenteEntity();
		utente1.setId(1L);
		utente1.setCodiceFiscale("DSAFER78M11F202F");
	}
	
	@Test
	public void getEnteByIdTest() {
		when(enteRepository.findById(ente1.getId())).thenReturn(Optional.of(ente1));
		enteService.getEnteById(ente1.getId());
		verify(enteRepository, times(1)).findById(ente1.getId());
	}
	
	@Test
	public void getEnteByIdKOTest() {
		//test KO per ente non presente
		when(enteRepository.findById(ente1.getId())).thenReturn(Optional.empty());
		Assertions.assertThrows(ResourceNotFoundException.class, () -> enteService.getEnteById(ente1.getId()));
		assertThatExceptionOfType(ResourceNotFoundException.class);
		verify(enteRepository, times(1)).findById(ente1.getId());
	}
	
	@Test
	public void esisteEnteByIdTest() {
		when(enteRepository.findById(ente1.getId())).thenReturn(Optional.of(ente1));
		enteService.esisteEnteById(ente1.getId());
		verify(enteRepository, times(1)).findById(ente1.getId());
	}
	
	@Test
	public void getRuoloEnteByIdProgettoAndIdSedeAndIdEnteTest() {
		when(enteRepository.findRuoloEnteByIdProgettoAndIdSedeAndIdEnte(progetto1.getId(), sede1.getId(), ente1.getId())).thenReturn("Ente Gestore di Programma");
		enteService.getRuoloEnteByIdProgettoAndIdSedeAndIdEnte(progetto1.getId(), sede1.getId(), ente1.getId());
		verify(enteRepository, times(1)).findRuoloEnteByIdProgettoAndIdSedeAndIdEnte(progetto1.getId(), sede1.getId(), ente1.getId());
	}
	
	@Test
	public void getIdEnteByIdProgettoAndIdSedeTest() {
		List<Long> idsEnti = new ArrayList<>();
		idsEnti.add(ente1.getId());
		when(enteRepository.findIdEnteByIdProgettoAndIdSede(progetto1.getId(), sede1.getId())).thenReturn(idsEnti);
		enteService.getIdEnteByIdProgettoAndIdSede(progetto1.getId(), sede1.getId());
		verify(enteRepository, times(1)).findIdEnteByIdProgettoAndIdSede(progetto1.getId(), sede1.getId());
	}
	
	@Test
	public void terminaEntiPartnerTest() throws Exception {
		//test con stato entePartner ad ATTIVO
		List<EntePartnerEntity> listaEntiPartner = new ArrayList<>();
		listaEntiPartner.add(entePartner);
		ProgrammaEntity programma1 = new ProgrammaEntity();
		programma1.setId(1L);
		progetto1.setProgramma(programma1);
		when(entePartnerService.getEntiPartnerByProgetto(progetto1.getId())).thenReturn(listaEntiPartner);
		enteService.terminaEntiPartner(progetto1.getId());
		verify(entePartnerService, times(1)).getEntiPartnerByProgetto(progetto1.getId());
	}
	
	@Test
	public void terminaEntiPartnerTest2() {
		//test con stato entePartner ad NON ATTIVO
		entePartner.setStatoEntePartner("NON ATTIVO");
		List<EntePartnerEntity> listaEntiPartner = new ArrayList<>();
		listaEntiPartner.add(entePartner);
		when(entePartnerService.getEntiPartnerByProgetto(progetto1.getId())).thenReturn(listaEntiPartner);
		enteService.terminaEntiPartner(progetto1.getId());
		verify(entePartnerService, times(1)).getEntiPartnerByProgetto(progetto1.getId());
	}
	
	@Test
	public void terminaEntiPartnerKOTest() throws Exception {
		//test KO con stato "ATTIVO" passato come parametro al metodo storicizzaEntePartner
		List<EntePartnerEntity> listaEntiPartner = new ArrayList<>();
		listaEntiPartner.add(entePartner);
		ProgrammaEntity programma1 = new ProgrammaEntity();
		programma1.setId(1L);
		progetto1.setProgramma(programma1);
		when(entePartnerService.getEntiPartnerByProgetto(progetto1.getId())).thenReturn(listaEntiPartner);
		//lasciato così poiché sufficiente per far si che il metodo lanci l'eccezione
		doAnswer(invocation -> {
			return null;
		}).when(storicoService).storicizzaEntePartner(entePartner, "ATTIVO");
		Assertions.assertThrows(ProgrammaException.class, () -> enteService.terminaEntiPartner(progetto1.getId()));
		assertThatExceptionOfType(ProgrammaException.class);
		verify(entePartnerService, times(0)).getReferentiEDelegatiEntePartner(entePartner.getId().getIdEnte(), entePartner.getId().getIdProgetto());
	}
	
	
	@Test
	public void terminaEntePartnerTest() {
		//test con stato referentiDelegatiEntity ad ATTIVO
		ReferentiDelegatiEntePartnerDiProgettoKey delegatiEntePartnerDiProgettoKey = new ReferentiDelegatiEntePartnerDiProgettoKey(progetto1.getId(), ente1.getId(), utente1.getCodiceFiscale());
		ReferentiDelegatiEntePartnerDiProgettoEntity referentiDelegatiEntity = new ReferentiDelegatiEntePartnerDiProgettoEntity();
		referentiDelegatiEntity.setId(delegatiEntePartnerDiProgettoKey);
		referentiDelegatiEntity.setStatoUtente("ATTIVO");
		List<ReferentiDelegatiEntePartnerDiProgettoEntity> referentiEDelegati = new ArrayList<>();
		referentiEDelegati.add(referentiDelegatiEntity);
		when(entePartnerService.getReferentiEDelegatiEntePartner(ente1.getId(), progetto1.getId())).thenReturn(referentiEDelegati);
		when(referentiDelegatiEntePartnerRepository.save(referentiDelegatiEntity)).thenReturn(referentiDelegatiEntity);
		doAnswer(invocation -> {
			referentiDelegatiEntePartnerRepository.save(referentiDelegatiEntity);
			return null;
		}).when(referentiDelegatiEntePartnerService).salvaReferenteODelegato(referentiDelegatiEntity);
		enteService.terminaEntePartner(entePartner);
		assertThat(entePartner.getStatoEntePartner()).isEqualTo("TERMINATO");
		verify(entePartnerService, times(1)).salvaEntePartner(entePartner);
	}
	
	@Test
	public void terminaEntePartnerTest2() {
		//test con stato referentiDelegatiEntity ad NON ATTIVO
		ReferentiDelegatiEntePartnerDiProgettoKey delegatiEntePartnerDiProgettoKey = new ReferentiDelegatiEntePartnerDiProgettoKey(progetto1.getId(), ente1.getId(), utente1.getCodiceFiscale());
		ReferentiDelegatiEntePartnerDiProgettoEntity referentiDelegatiEntity = new ReferentiDelegatiEntePartnerDiProgettoEntity();
		referentiDelegatiEntity.setId(delegatiEntePartnerDiProgettoKey);
		referentiDelegatiEntity.setStatoUtente("NON ATTIVO");
		List<ReferentiDelegatiEntePartnerDiProgettoEntity> referentiEDelegati = new ArrayList<>();
		referentiEDelegati.add(referentiDelegatiEntity);
		when(entePartnerService.getReferentiEDelegatiEntePartner(ente1.getId(), progetto1.getId())).thenReturn(referentiEDelegati);
		enteService.terminaEntePartner(entePartner);
		assertThat(entePartner.getStatoEntePartner()).isEqualTo("TERMINATO");
		verify(entePartnerService, times(1)).salvaEntePartner(entePartner);
	}
}
