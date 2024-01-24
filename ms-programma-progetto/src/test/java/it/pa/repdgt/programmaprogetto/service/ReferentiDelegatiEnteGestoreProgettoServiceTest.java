package it.pa.repdgt.programmaprogetto.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import it.pa.repdgt.programmaprogetto.repository.ReferentiDelegatiEnteGestoreProgettoRepository;
import it.pa.repdgt.shared.entity.EnteEntity;
import it.pa.repdgt.shared.entity.ProgettoEntity;
import it.pa.repdgt.shared.entity.ReferentiDelegatiEnteGestoreProgettoEntity;
import it.pa.repdgt.shared.entity.UtenteEntity;
import it.pa.repdgt.shared.entity.key.ReferentiDelegatiEnteGestoreProgettoKey;

//@SpringBootTest
//@ExtendWith(MockitoExtension.class)
public class ReferentiDelegatiEnteGestoreProgettoServiceTest {

	@Mock
	private ReferentiDelegatiEnteGestoreProgettoRepository referentiDelegatiEnteGestoreProgettoRepository;
	@Mock
	private RuoloService ruoloService;
	@Mock
	private ProgettoService progettoService;

	@Autowired
	@InjectMocks
	private ReferentiDelegatiEnteGestoreProgettoService referentiDelegatiEnteGestoreProgettoService;

	ProgettoEntity progetto1;
	ReferentiDelegatiEnteGestoreProgettoKey referentiDelegatiEnteGestoreProgettoKey;
	ReferentiDelegatiEnteGestoreProgettoEntity referentiDelegatiEnteGestoreProgettoEntity;
	UtenteEntity utente1;
	EnteEntity ente1;

	@BeforeEach
	public void setUp() {
		progetto1 = new ProgettoEntity();
		progetto1.setId(256L);
		progetto1.setNome("progetto1");
		utente1 = new UtenteEntity();
		utente1.setId(1L);
		utente1.setCodiceFiscale("XTAAAA54E91E123Z");
		ente1 = new EnteEntity();
		ente1.setId(1004L);
		referentiDelegatiEnteGestoreProgettoKey = new ReferentiDelegatiEnteGestoreProgettoKey(progetto1.getId(),
				utente1.getCodiceFiscale(), ente1.getId());
		referentiDelegatiEnteGestoreProgettoEntity = new ReferentiDelegatiEnteGestoreProgettoEntity();
		referentiDelegatiEnteGestoreProgettoEntity.setId(referentiDelegatiEnteGestoreProgettoKey);
		referentiDelegatiEnteGestoreProgettoEntity.setCodiceRuolo("DEGP");
		referentiDelegatiEnteGestoreProgettoEntity.setStatoUtente("ATTIVO");
	}

	// @Test
	public void cancellaReferentiDelegatiProgettoTest() {
		referentiDelegatiEnteGestoreProgettoService.cancellaReferentiDelegatiProgetto(256L);
	}

	// @Test
	public void cancellaAssociazioneReferenteODelegatoGestoreProgettoTest2() {
		referentiDelegatiEnteGestoreProgettoKey = new ReferentiDelegatiEnteGestoreProgettoKey(254L, "UTENTE2",
				ente1.getId());
		referentiDelegatiEnteGestoreProgettoEntity = new ReferentiDelegatiEnteGestoreProgettoEntity();
		referentiDelegatiEnteGestoreProgettoEntity.setId(referentiDelegatiEnteGestoreProgettoKey);
		referentiDelegatiEnteGestoreProgettoEntity.setCodiceRuolo("REGP");
		referentiDelegatiEnteGestoreProgettoService
				.cancellaAssociazioneReferenteODelegatoGestoreProgetto(referentiDelegatiEnteGestoreProgettoEntity);
	}

	// @Test
	public void getReferentiEDelegatiProgettoTest() {
		referentiDelegatiEnteGestoreProgettoService.getReferentiEDelegatiProgetto(progetto1.getId());
	}

	// @Test
	public void cancellaOTerminaAssociazioneReferenteDelegatoProgettoTest() {
		// test con stato utente ad ATTIVO
		referentiDelegatiEnteGestoreProgettoService
				.cancellaOTerminaAssociazioneReferenteDelegatoProgetto(referentiDelegatiEnteGestoreProgettoEntity);
	}

	// @Test
	public void cancellaOTerminaAssociazioneReferenteDelegatoProgettoTest2() {
		// test con stato utente ad NON ATTIVO
		referentiDelegatiEnteGestoreProgettoEntity.setStatoUtente("NON ATTIVO");
		referentiDelegatiEnteGestoreProgettoService
				.cancellaOTerminaAssociazioneReferenteDelegatoProgetto(referentiDelegatiEnteGestoreProgettoEntity);
	}
}
