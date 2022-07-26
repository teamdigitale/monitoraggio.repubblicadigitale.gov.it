package it.pa.repdgt.ente.service;

import static org.assertj.core.api.Assertions.assertThatExceptionOfType;
import static org.mockito.Mockito.doAnswer;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;

import it.pa.repdgt.ente.exception.EnteException;
import it.pa.repdgt.ente.repository.EntePartnerRepository;
import it.pa.repdgt.ente.request.ReferenteDelegatoPartnerRequest;
import it.pa.repdgt.shared.entity.EnteEntity;
import it.pa.repdgt.shared.entity.EntePartnerEntity;
import it.pa.repdgt.shared.entity.ProgettoEntity;
import it.pa.repdgt.shared.entity.ReferentiDelegatiEntePartnerDiProgettoEntity;
import it.pa.repdgt.shared.entity.RuoloEntity;
import it.pa.repdgt.shared.entity.UtenteEntity;
import it.pa.repdgt.shared.entity.key.EntePartnerKey;
import it.pa.repdgt.shared.entity.key.ReferentiDelegatiEntePartnerDiProgettoKey;

@ExtendWith(MockitoExtension.class)
public class EntePartnerServiceTest {
	
	@Mock
	private ReferentiDelegatiEntePartnerDiProgettoService referentiDelegatiEntePartnerDiProgettoService;
	@Mock
	private RuoloService ruoloService;
	@Mock
	private ProgettoService progettoService;
	@Mock
	private EnteService enteService;
	@Mock
	private UtenteService utenteService;
	
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
	List<ReferentiDelegatiEntePartnerDiProgettoEntity> listaReferentiDelegati;
	UtenteEntity utente1;
	ReferenteDelegatoPartnerRequest referenteDelegatoPartnerRequest;
	List<Long> listaIdEntiPartner;
	RuoloEntity ruolo1;
	
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
		referentiDelegatiEntePartnerDiProgettoEntity.setStatoUtente("ATTIVO");
		listaReferentiDelegati = new ArrayList<>();
		listaReferentiDelegati.add(referentiDelegatiEntePartnerDiProgettoEntity);
		referenteDelegatoPartnerRequest = new ReferenteDelegatoPartnerRequest();
		referenteDelegatoPartnerRequest.setCodiceFiscaleUtente(utente1.getCodiceFiscale());
		referenteDelegatoPartnerRequest.setCodiceRuolo("DEPP");
		referenteDelegatoPartnerRequest.setIdEntePartner(ente1.getId());
		referenteDelegatoPartnerRequest.setIdProgetto(progetto1.getId());
		referenteDelegatoPartnerRequest.setMansione("mansione");
		listaIdEntiPartner = new ArrayList<>();
		listaIdEntiPartner.add(ente1.getId());
		ruolo1 = new RuoloEntity();
		ruolo1.setCodice("DEPP");
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
	public void terminaAssociazioneReferenteDelegatoEntePartnerTest() {
		when(this.referentiDelegatiEntePartnerDiProgettoService.findAltriReferentiODelegatiAttivi(progetto1.getId(), ente1.getId(), utente1.getCodiceFiscale(), "REPP")).thenReturn(listaReferentiDelegati);
		entePartnerService.terminaAssociazioneReferenteDelegatoEntePartner(referentiDelegatiEntePartnerDiProgettoEntity, "REPP");
	}
	
	@Test
	public void cancellaOTerminaAssociazioneReferenteODelegatoPartnerTest() {
		//test con stato utente ad ATTIVO
		when(this.referentiDelegatiEntePartnerDiProgettoService.getReferenteDelegatoEntePartner(referenteDelegatoPartnerRequest.getIdProgetto(), referenteDelegatoPartnerRequest.getCodiceFiscaleUtente(), referenteDelegatoPartnerRequest.getIdEntePartner(), referenteDelegatoPartnerRequest.getCodiceRuolo())).thenReturn(referentiDelegatiEntePartnerDiProgettoEntity);
		entePartnerService.cancellaOTerminaAssociazioneReferenteODelegatoPartner(referenteDelegatoPartnerRequest);
	}
	
	@Test
	public void cancellaOTerminaAssociazioneReferenteODelegatoPartnerTest2() {
		//test con stato utente a NON ATTIVO
		referentiDelegatiEntePartnerDiProgettoEntity.setStatoUtente("NON ATTIVO");
		when(this.referentiDelegatiEntePartnerDiProgettoService.getReferenteDelegatoEntePartner(referenteDelegatoPartnerRequest.getIdProgetto(), referenteDelegatoPartnerRequest.getCodiceFiscaleUtente(), referenteDelegatoPartnerRequest.getIdEntePartner(), referenteDelegatoPartnerRequest.getCodiceRuolo())).thenReturn(referentiDelegatiEntePartnerDiProgettoEntity);
		doAnswer(invocation -> {
			return null;
		}).when(this.ruoloService).cancellaRuoloUtente(referenteDelegatoPartnerRequest.getCodiceFiscaleUtente(), referenteDelegatoPartnerRequest.getCodiceRuolo());
		entePartnerService.cancellaOTerminaAssociazioneReferenteODelegatoPartner(referenteDelegatoPartnerRequest);
	}
	
	@Test
	public void terminaAssociazioneReferenteDelegatoEntePartnerKOTest() {
		//test KO per l'impossibilità di cancellare l'associazione poiché l'unico referente ATTIVO dell'ente
		when(this.referentiDelegatiEntePartnerDiProgettoService.findAltriReferentiODelegatiAttivi(progetto1.getId(), ente1.getId(), utente1.getCodiceFiscale(), "REPP")).thenReturn(new ArrayList<>());
		Assertions.assertThrows(EnteException.class, () -> entePartnerService.terminaAssociazioneReferenteDelegatoEntePartner(referentiDelegatiEntePartnerDiProgettoEntity, "REPP"));
		assertThatExceptionOfType(EnteException.class);
	}
	
	@Test
	public void terminaACascataAssociazioneReferenteDelegatoEntePartnerTest() {
		entePartnerService.terminaACascataAssociazioneReferenteDelegatoEntePartner(referentiDelegatiEntePartnerDiProgettoEntity, "REPP");
	}
	
	@Test
	public void cancellaAssociazioneEntePartnerPerProgettoTest() {
		doAnswer(invocation -> {
			return null;
		}).when(this.entePartnerRepository).delete(entePartnerEntity);
		entePartnerService.cancellaAssociazioneEntePartnerPerProgetto(entePartnerEntity);
		verify(this.entePartnerRepository, times(1)).delete(entePartnerEntity);
	}
	
	@Test
	public void getEntePartnerByIdEnteAndIdProgettoTest() {
		when(this.entePartnerRepository.findEntePartnerByIdEnteAndIdProgetto(ente1.getId(), progetto1.getId())).thenReturn(entePartnerEntity);
		entePartnerService.getEntePartnerByIdEnteAndIdProgetto(ente1.getId(), progetto1.getId());
		verify(this.entePartnerRepository, times(1)).findEntePartnerByIdEnteAndIdProgetto(ente1.getId(), progetto1.getId());
	}
	
	@Test
	public void associaReferenteODelegatoPartnerTest() {
		when(this.progettoService.esisteProgettoById(referenteDelegatoPartnerRequest.getIdProgetto())).thenReturn(true);
		when(this.enteService.esisteEnteById(referenteDelegatoPartnerRequest.getIdEntePartner())).thenReturn(true);
		when(this.entePartnerRepository.findEntiPartnerByProgetto(progetto1.getId())).thenReturn(listaIdEntiPartner);
		when(this.utenteService.getUtenteByCodiceFiscale(utente1.getCodiceFiscale())).thenReturn(utente1);
		when(this.referentiDelegatiEntePartnerDiProgettoService.esisteById(Mockito.any(ReferentiDelegatiEntePartnerDiProgettoKey.class))).thenReturn(false);
		when(this.ruoloService.getRuoloByCodiceRuolo(referenteDelegatoPartnerRequest.getCodiceRuolo())).thenReturn(ruolo1);
		entePartnerService.associaReferenteODelegatoPartner(referenteDelegatoPartnerRequest);
	}
}
