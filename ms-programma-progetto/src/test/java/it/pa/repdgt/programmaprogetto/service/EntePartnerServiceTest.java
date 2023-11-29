package it.pa.repdgt.programmaprogetto.service;

import static org.assertj.core.api.Assertions.assertThat;
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

import it.pa.repdgt.programmaprogetto.repository.EntePartnerRepository;
import it.pa.repdgt.shared.entity.EnteEntity;
import it.pa.repdgt.shared.entity.EntePartnerEntity;
import it.pa.repdgt.shared.entity.ProgettoEntity;
import it.pa.repdgt.shared.entity.ReferentiDelegatiEntePartnerDiProgettoEntity;
import it.pa.repdgt.shared.entity.UtenteEntity;
import it.pa.repdgt.shared.entity.key.EntePartnerKey;

//@ExtendWith(MockitoExtension.class)
public class EntePartnerServiceTest {

	@Mock
	private EntePartnerRepository entePartnerRepository;
	@Mock
	private ReferentiDelegatiEntePartnerService referentiDelegatiEntePartnerService;

	@Autowired
	@InjectMocks
	private EntePartnerService entePartnerService;

	ProgettoEntity progetto1;
	List<Long> idsEnti;
	EnteEntity ente1;
	UtenteEntity utente1;
	List<String> listaUtenti;

	@BeforeEach
	public void setUp() {
		progetto1 = new ProgettoEntity();
		progetto1.setId(1L);
		progetto1.setNome("progetto 1");
		progetto1.setStato("ATTIVO");
		ente1 = new EnteEntity();
		ente1.setId(1L);
		ente1.setNome("ente1");
		idsEnti = new ArrayList<>();
		idsEnti.add(ente1.getId());
		utente1 = new UtenteEntity();
		utente1.setNome("Mario");
		listaUtenti = new ArrayList<>();
		listaUtenti.add(utente1.getNome());
	}

	// @Test
	public void getIdEntiPartnerByProgettoTest() {
		when(entePartnerRepository.findIdEntiPartnerByProgetto(progetto1.getId())).thenReturn(idsEnti);
		entePartnerService.getIdEntiPartnerByProgetto(progetto1.getId());
		assertThat(idsEnti.size()).isEqualTo(1);
		verify(entePartnerRepository, times(1)).findIdEntiPartnerByProgetto(progetto1.getId());
	}

	// @Test
	public void getReferentiEntePartnerProgettoTest() {
		when(entePartnerRepository.findReferentiEntePartnerProgetto(progetto1.getId(), ente1.getId())).thenReturn(listaUtenti);
		entePartnerService.getReferentiEntePartnerProgetto(progetto1.getId(), ente1.getId());
		assertThat(listaUtenti.size()).isEqualTo(1);
		verify(entePartnerRepository, times(1)).findReferentiEntePartnerProgetto(progetto1.getId(), ente1.getId());
	}

	// @Test
	public void getStatoEntePartnerTest() {
		when(entePartnerRepository.findStatoEntePartner(progetto1.getId(), ente1.getId())).thenReturn("ATTIVO");
		entePartnerService.getStatoEntePartner(progetto1.getId(), ente1.getId());
		verify(entePartnerRepository, times(1)).findStatoEntePartner(progetto1.getId(), ente1.getId());
	}

	// @Test
	public void cancellaEntiPartnerTest() {
		entePartnerService.cancellaEntiPartner(progetto1.getId());
		verify(entePartnerRepository, times(1)).cancellaEntiPartner(progetto1.getId());
	}

	// @Test
	public void getEntiPartnerByProgettoTest() {
		EntePartnerKey entePartnerKey = new EntePartnerKey(progetto1.getId(), ente1.getId());
		EntePartnerEntity entePartner = new EntePartnerEntity();
		entePartner.setId(entePartnerKey);
		List<EntePartnerEntity> listaEntiPartner = new ArrayList<>();
		listaEntiPartner.add(entePartner);
		when(entePartnerRepository.findEntiPartnerByProgetto(progetto1.getId())).thenReturn(listaEntiPartner);
		entePartnerService.getEntiPartnerByProgetto(progetto1.getId());
		assertThat(listaEntiPartner.size()).isEqualTo(1);
		verify(entePartnerRepository, times(1)).findEntiPartnerByProgetto(progetto1.getId());
	}

	// @Test
	public void cancellaEntePartnerTest() {
		EntePartnerKey entePartnerKey = new EntePartnerKey(progetto1.getId(), ente1.getId());
		EntePartnerEntity entePartner = new EntePartnerEntity();
		entePartner.setId(entePartnerKey);
		List<ReferentiDelegatiEntePartnerDiProgettoEntity> referentiDelegatiPartnerTest = new ArrayList<>();
		when(referentiDelegatiEntePartnerService.getReferentiEDelegatiEntePartner(ente1.getId(), progetto1.getId()))
				.thenReturn(referentiDelegatiPartnerTest);
		entePartnerService.cancellaEntePartner(entePartner);
		verify(entePartnerRepository, times(1)).delete(entePartner);
	}

	// @Test
	public void salvaEntePartner() {
		EntePartnerKey entePartnerKey = new EntePartnerKey(progetto1.getId(), ente1.getId());
		EntePartnerEntity entePartner = new EntePartnerEntity();
		entePartner.setId(entePartnerKey);
		entePartnerService.salvaEntePartner(entePartner);
		verify(entePartnerRepository, times(1)).save(entePartner);
	}
}
