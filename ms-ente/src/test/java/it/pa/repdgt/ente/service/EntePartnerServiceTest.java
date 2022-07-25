package it.pa.repdgt.ente.service;

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

import it.pa.repdgt.ente.repository.EntePartnerRepository;
import it.pa.repdgt.shared.entity.EnteEntity;
import it.pa.repdgt.shared.entity.EntePartnerEntity;
import it.pa.repdgt.shared.entity.ProgettoEntity;
import it.pa.repdgt.shared.entity.ReferentiDelegatiEntePartnerDiProgettoEntity;
import it.pa.repdgt.shared.entity.UtenteEntity;
import it.pa.repdgt.shared.entity.key.EntePartnerKey;
import it.pa.repdgt.shared.entity.key.ReferentiDelegatiEntePartnerDiProgettoKey;

@ExtendWith(MockitoExtension.class)
public class EntePartnerServiceTest {
	
	@Mock
	private ReferentiDelegatiEntePartnerDiProgettoService referentiDelegatiEntePartnerDiProgettoService;
	
	@Mock
	private EntePartnerRepository entePartnerRepository;
	
	@Autowired
	@InjectMocks
	private EntePartnerService entePartnerService;
	
	EntePartnerKey entePartnerKey;
	EntePartnerEntity entePartnerEntity;
	ProgettoEntity progetto1;
	EnteEntity ente1;
	ReferentiDelegatiEntePartnerDiProgettoKey referentiDelegatiEntePartnerDiProgettoKey;
	ReferentiDelegatiEntePartnerDiProgettoEntity referentiDelegatiEntePartnerDiProgettoEntity;
	UtenteEntity utente1;
	
	@BeforeEach
	public void setUp() {
		progetto1 = new ProgettoEntity();
		progetto1.setId(1L);
		ente1 = new EnteEntity();
		ente1.setId(1L);
		entePartnerKey = new EntePartnerKey(progetto1.getId(), ente1.getId());
		entePartnerEntity = new EntePartnerEntity();
		entePartnerEntity.setId(entePartnerKey);
		utente1 = new UtenteEntity();
		utente1.setId(1L);
		utente1.setCodiceFiscale("FHGSFN92G10I989L");
		referentiDelegatiEntePartnerDiProgettoKey = new ReferentiDelegatiEntePartnerDiProgettoKey(progetto1.getId(), ente1.getId(), utente1.getCodiceFiscale());
		referentiDelegatiEntePartnerDiProgettoEntity = new ReferentiDelegatiEntePartnerDiProgettoEntity();
		referentiDelegatiEntePartnerDiProgettoEntity.setId(referentiDelegatiEntePartnerDiProgettoKey);
	}
	
	@Test
	public void salvaEntePartnerTest() {
		when(this.entePartnerRepository.save(entePartnerEntity)).thenReturn(entePartnerEntity);
		entePartnerService.salvaEntePartner(entePartnerEntity);
	}
	
	@Test
	public void associaEntePartnerPerProgettoTest() {
		entePartnerService.associaEntePartnerPerProgetto(ente1.getId(), progetto1.getId());
	}
	
	@Test
	public void getEntiPartnerByProgettoTest() {
		List<Long> listaIdEntiPartner = new ArrayList<>();
		listaIdEntiPartner.add(ente1.getId());
		when(this.entePartnerRepository.findEntiPartnerByProgetto(progetto1.getId())).thenReturn(listaIdEntiPartner);
		entePartnerService.getEntiPartnerByProgetto(progetto1.getId());
	}
	
	@Test
	public void terminaACascataAssociazioneReferenteDelegatoEntePartnerTest() {
		entePartnerService.terminaACascataAssociazioneReferenteDelegatoEntePartner(referentiDelegatiEntePartnerDiProgettoEntity, "REPP");
	}
}
