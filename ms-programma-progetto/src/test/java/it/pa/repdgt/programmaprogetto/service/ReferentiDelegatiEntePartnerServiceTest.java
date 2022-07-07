package it.pa.repdgt.programmaprogetto.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import it.pa.repdgt.shared.entity.ReferentiDelegatiEntePartnerDiProgettoEntity;
import it.pa.repdgt.shared.entity.key.ReferentiDelegatiEntePartnerDiProgettoKey;

@SpringBootTest
@ExtendWith(MockitoExtension.class)
public class ReferentiDelegatiEntePartnerServiceTest {

	@Autowired
	@InjectMocks
	private ReferentiDelegatiEntePartnerService referentiDelegatiEntePartnerService;
	
	ReferentiDelegatiEntePartnerDiProgettoKey referentiDelegatiEntePartnerDiProgettoKey;
	ReferentiDelegatiEntePartnerDiProgettoEntity referentiDelegatiEntePartnerDiProgettoEntity;
	
	@BeforeEach
	public void setuUp() {
		referentiDelegatiEntePartnerDiProgettoKey = new ReferentiDelegatiEntePartnerDiProgettoKey(256L, 1005L, "MZADDD89E21E123S");
		referentiDelegatiEntePartnerDiProgettoEntity = new ReferentiDelegatiEntePartnerDiProgettoEntity();
		referentiDelegatiEntePartnerDiProgettoEntity.setId(referentiDelegatiEntePartnerDiProgettoKey);
		referentiDelegatiEntePartnerDiProgettoEntity.setCodiceRuolo("REPP");
	}
	
	@Test
	public void cancellaReferentiDelegatiPartnerTest() {
		referentiDelegatiEntePartnerService.cancellaReferentiDelegatiPartner(253L);
	}
	
	@Test
	public void cancellaAssociazioneReferenteODelegatoPartnerTest() {
		referentiDelegatiEntePartnerService.cancellaAssociazioneReferenteODelegatoPartner(referentiDelegatiEntePartnerDiProgettoEntity);
	}
	
	@Test
	public void salvaReferenteODelegatoTest() {
		referentiDelegatiEntePartnerService.salvaReferenteODelegato(referentiDelegatiEntePartnerDiProgettoEntity);
	}
	
	@Test
	public void getReferentiEDelegatiEntePartnerTest() {
		referentiDelegatiEntePartnerService.getReferentiEDelegatiEntePartner(1006L, 254L);
	}
}
