package it.pa.repdgt.programmaprogetto.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import it.pa.repdgt.shared.entity.ReferentiDelegatiEnteGestoreProgrammaEntity;
import it.pa.repdgt.shared.entity.key.ReferentiDelegatiEnteGestoreProgrammaKey;

@SpringBootTest
@ExtendWith(MockitoExtension.class)
public class ReferentiDelegatiEnteGestoreProgrammaServiceTest {
	
	@Autowired
	@InjectMocks
	private ReferentiDelegatiEnteGestoreProgrammaService referentiDelegatiEnteGestoreProgrammaService;
	
	ReferentiDelegatiEnteGestoreProgrammaKey referentiDelegatiEnteGestoreProgrammaKey;
	ReferentiDelegatiEnteGestoreProgrammaEntity referentiDelegatiEnteGestoreProgrammaEntity;
	
	@BeforeEach
	public void setUp() {
		referentiDelegatiEnteGestoreProgrammaKey = new ReferentiDelegatiEnteGestoreProgrammaKey(101L, "SMTPAL67R31F111X", 1004L);
		referentiDelegatiEnteGestoreProgrammaEntity = new ReferentiDelegatiEnteGestoreProgrammaEntity();
		referentiDelegatiEnteGestoreProgrammaEntity.setId(referentiDelegatiEnteGestoreProgrammaKey);
		referentiDelegatiEnteGestoreProgrammaEntity.setCodiceRuolo("REG");
	}
	
	@Test
	public void cancellaReferentiDelegatiProgrammaTest() {
		referentiDelegatiEnteGestoreProgrammaService.cancellaReferentiDelegatiProgramma(103L);
	}
	
	@Test
	public void cancellaAssociazioneReferenteODelegatoGestoreProgrammaTest() {
		referentiDelegatiEnteGestoreProgrammaService.cancellaAssociazioneReferenteODelegatoGestoreProgramma(referentiDelegatiEnteGestoreProgrammaEntity);
	}
	
	@Test
	public void getReferentiEDelegatiProgrammaTest() {
		referentiDelegatiEnteGestoreProgrammaService.getReferentiEDelegatiProgramma(101L);
	}
	
	@Test
	public void cancellaOTerminaAssociazioneReferenteDelegatoProgrammaTest() {
		//test con stato utente ad ATTIVO
		referentiDelegatiEnteGestoreProgrammaEntity.setStatoUtente("ATTIVO");
		referentiDelegatiEnteGestoreProgrammaService.cancellaOTerminaAssociazioneReferenteDelegatoProgramma(referentiDelegatiEnteGestoreProgrammaEntity);
	}
	
	@Test
	public void cancellaOTerminaAssociazioneReferenteDelegatoProgrammaTest2() {
		//test con stato utente a NON ATTIVO
		referentiDelegatiEnteGestoreProgrammaKey = new ReferentiDelegatiEnteGestoreProgrammaKey(102L, "UTENTE2", 1004L);
		referentiDelegatiEnteGestoreProgrammaEntity = new ReferentiDelegatiEnteGestoreProgrammaEntity();
		referentiDelegatiEnteGestoreProgrammaEntity.setId(referentiDelegatiEnteGestoreProgrammaKey);
		referentiDelegatiEnteGestoreProgrammaEntity.setCodiceRuolo("REG");
		referentiDelegatiEnteGestoreProgrammaEntity.setStatoUtente("NON ATTIVO");
		referentiDelegatiEnteGestoreProgrammaService.cancellaOTerminaAssociazioneReferenteDelegatoProgramma(referentiDelegatiEnteGestoreProgrammaEntity);
	}
}
