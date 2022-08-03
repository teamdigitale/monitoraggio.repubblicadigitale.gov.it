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
import it.pa.repdgt.ente.repository.ReferentiDelegatiEnteGestoreProgrammaRepository;
import it.pa.repdgt.shared.entity.ReferentiDelegatiEnteGestoreProgrammaEntity;
import it.pa.repdgt.shared.entity.key.ReferentiDelegatiEnteGestoreProgrammaKey;

@ExtendWith(MockitoExtension.class)
public class ReferentiDelegatiEnteGestoreProgrammaServiceTest {
	
	@Mock
	private ReferentiDelegatiEnteGestoreProgrammaRepository referentiDelegatiEnteGestoreProgrammaRepository;
	
	@Autowired
    @InjectMocks
    private ReferentiDelegatiEnteGestoreProgrammaService referentiDelegatiEnteGestoreProgrammaService;
	
	ReferentiDelegatiEnteGestoreProgrammaKey referentiDelegatiEnteGestoreProgrammaKey;
	ReferentiDelegatiEnteGestoreProgrammaEntity referentiDelegatiEnteGestoreProgrammaEntity;
	List<ReferentiDelegatiEnteGestoreProgrammaEntity> listaReferentiDelegati;
	
	@BeforeEach
	public void setUp() {
		referentiDelegatiEnteGestoreProgrammaKey = new ReferentiDelegatiEnteGestoreProgrammaKey(1L, "EFF", 1L);
		referentiDelegatiEnteGestoreProgrammaEntity = new ReferentiDelegatiEnteGestoreProgrammaEntity();
		referentiDelegatiEnteGestoreProgrammaEntity.setId(referentiDelegatiEnteGestoreProgrammaKey);
		listaReferentiDelegati = new ArrayList<>();
		listaReferentiDelegati.add(referentiDelegatiEnteGestoreProgrammaEntity);
	}
	
	@Test
	public void saveTest() {
		when(this.referentiDelegatiEnteGestoreProgrammaRepository.save(referentiDelegatiEnteGestoreProgrammaEntity)).thenReturn(referentiDelegatiEnteGestoreProgrammaEntity);
		referentiDelegatiEnteGestoreProgrammaService.save(referentiDelegatiEnteGestoreProgrammaEntity);
	}
	
	@Test
	public void getReferentiEnteGestoreByIdProgrammaAndIdEnteTest() {
		when(this.referentiDelegatiEnteGestoreProgrammaRepository.findNomeStatoReferentiEnteGestoreByIdProgrammaAndIdEnte(1L, 1L)).thenReturn(null);
		referentiDelegatiEnteGestoreProgrammaService.getReferentiEnteGestoreByIdProgrammaAndIdEnte(1L, 1L);
	}
	
	@Test
	public void getDelegatiEnteGestoreByIdProgrammaAndIdEnteTest() {
		when(this.referentiDelegatiEnteGestoreProgrammaRepository.findNomeStatoDelegatiEnteGestoreByIdProgrammaAndIdEnte(1L, 1L)).thenReturn(null);
		referentiDelegatiEnteGestoreProgrammaService.getDelegatiEnteGestoreByIdProgrammaAndIdEnte(1L, 1L);
	}
	
	@Test
	public void cancellaAssociazioneReferenteDelegatoGestoreProgrammaTest() {
		doAnswer(invocation -> {
			return null;
		}).when(this.referentiDelegatiEnteGestoreProgrammaRepository).deleteById(referentiDelegatiEnteGestoreProgrammaKey);
		referentiDelegatiEnteGestoreProgrammaService.cancellaAssociazioneReferenteDelegatoGestoreProgramma(referentiDelegatiEnteGestoreProgrammaKey);
	}
	
	@Test
	public void esisteByIdTest() {
		when(this.referentiDelegatiEnteGestoreProgrammaRepository.existsById(referentiDelegatiEnteGestoreProgrammaKey)).thenReturn(true);
		referentiDelegatiEnteGestoreProgrammaService.esisteById(referentiDelegatiEnteGestoreProgrammaKey);
	}
	
	@Test
	public void findAltriReferentiODelegatiAttiviTest() {
		when(this.referentiDelegatiEnteGestoreProgrammaRepository.findAltriReferentiODelegatiAttivi(1L, "EFF", 1L, "REG")).thenReturn(listaReferentiDelegati);
		referentiDelegatiEnteGestoreProgrammaService.findAltriReferentiODelegatiAttivi(1L, "EFF", 1L, "REG");
	}
	
	@Test
	public void findAltreAssociazioniTest() {
		when(this.referentiDelegatiEnteGestoreProgrammaRepository.findAltreAssociazioni(1L, "EFF", "REG")).thenReturn(listaReferentiDelegati);
		referentiDelegatiEnteGestoreProgrammaService.findAltreAssociazioni(1L, "EFF", "REG");
	}
	
	@Test
	public void getByIdTest() {
		when(this.referentiDelegatiEnteGestoreProgrammaRepository.findById(referentiDelegatiEnteGestoreProgrammaKey)).thenReturn(Optional.of(referentiDelegatiEnteGestoreProgrammaEntity));
		referentiDelegatiEnteGestoreProgrammaService.getById(referentiDelegatiEnteGestoreProgrammaKey);
	}
	
	@Test
	public void getReferentiAndDelegatiByIdProgrammaAndIdEnteTest() {
		when(this.referentiDelegatiEnteGestoreProgrammaRepository.findReferentiAndDelegatiByIdProgrammaAndIdEnte(1L, 1L)).thenReturn(listaReferentiDelegati);
		referentiDelegatiEnteGestoreProgrammaService.getReferentiAndDelegatiByIdProgrammaAndIdEnte(1L, 1L);
	}
	
	@Test
	public void cancellaAssociazioneTest() {
		doAnswer(invocation -> {
			return null;
		}).when(this.referentiDelegatiEnteGestoreProgrammaRepository).delete(referentiDelegatiEnteGestoreProgrammaEntity);
		referentiDelegatiEnteGestoreProgrammaService.cancellaAssociazione(referentiDelegatiEnteGestoreProgrammaEntity);
	}
	
	@Test
	public void countAssociazioniReferenteDelegatoTest() {
		when(this.referentiDelegatiEnteGestoreProgrammaRepository.countAssociazioniReferenteDelegato("EFF", "REG")).thenReturn(1);
		referentiDelegatiEnteGestoreProgrammaService.countAssociazioniReferenteDelegato("EFF", "REG");
	}
	
	@Test
	public void getReferenteDelegatiEnteGestoreProgrammaTest() {
		when(this.referentiDelegatiEnteGestoreProgrammaRepository.findReferenteDelegatiEnteGestoreProgramma(1L, "EFF", 1L, "REG")).thenReturn(Optional.of(referentiDelegatiEnteGestoreProgrammaEntity));
		referentiDelegatiEnteGestoreProgrammaService.getReferenteDelegatiEnteGestoreProgramma(1L, "EFF", 1L, "REG");
	}
	
	@Test
	public void getReferenteDelegatiEnteGestoreProgrammaKOTest() {
		//test KO per referente/delegato non trovato
		when(this.referentiDelegatiEnteGestoreProgrammaRepository.findReferenteDelegatiEnteGestoreProgramma(1L, "EFF", 1L, "REG")).thenReturn(Optional.empty());
		Assertions.assertThrows(ResourceNotFoundException.class, () -> 	referentiDelegatiEnteGestoreProgrammaService.getReferenteDelegatiEnteGestoreProgramma(1L, "EFF", 1L, "REG"));
		assertThatExceptionOfType(ResourceNotFoundException.class);
	}
}
