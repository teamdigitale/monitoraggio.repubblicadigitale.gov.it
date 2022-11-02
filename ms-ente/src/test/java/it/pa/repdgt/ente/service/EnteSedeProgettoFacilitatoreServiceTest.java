package it.pa.repdgt.ente.service;

import static org.assertj.core.api.Assertions.assertThatExceptionOfType;
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

import it.pa.repdgt.ente.exception.EnteSedeProgettoFacilitatoreException;
import it.pa.repdgt.ente.repository.EnteSedeProgettoFacilitatoreRepository;
import it.pa.repdgt.ente.request.EnteSedeProgettoFacilitatoreRequest;
import it.pa.repdgt.shared.entity.EnteEntity;
import it.pa.repdgt.shared.entity.EnteSedeProgetto;
import it.pa.repdgt.shared.entity.EnteSedeProgettoFacilitatoreEntity;
import it.pa.repdgt.shared.entity.IntegrazioniUtenteEntity;
import it.pa.repdgt.shared.entity.ProgettoEntity;
import it.pa.repdgt.shared.entity.ProgrammaEntity;
import it.pa.repdgt.shared.entity.RuoloEntity;
import it.pa.repdgt.shared.entity.SedeEntity;
import it.pa.repdgt.shared.entity.UtenteEntity;
import it.pa.repdgt.shared.entity.key.EnteSedeProgettoFacilitatoreKey;
import it.pa.repdgt.shared.entity.key.EnteSedeProgettoKey;
import it.pa.repdgt.shared.entityenum.PolicyEnum;
import it.pa.repdgt.shared.entityenum.RuoloUtenteEnum;

@ExtendWith(MockitoExtension.class)
public class EnteSedeProgettoFacilitatoreServiceTest {
	
	@Mock
	private EnteSedeProgettoFacilitatoreRepository enteSedeProgettoFacilitatoreRepository;
	@Mock
	private UtenteService utenteService;
	@Mock
	private EnteService enteService;
	@Mock
	private SedeService sedeService;
	@Mock
	private ProgettoService progettoService;
	@Mock
	private RuoloService ruoloService;
	@Mock
	private EnteSedeProgettoService enteSedeProgettoService;

	@Autowired
	@InjectMocks
	private EnteSedeProgettoFacilitatoreService enteSedeProgettoFacilitatoreService;
	
	EnteEntity ente1;
	SedeEntity sede1;
	ProgettoEntity progetto1;
	UtenteEntity utente1;
	EnteSedeProgettoFacilitatoreKey enteSedeProgettoFacilitatoreKey;
	EnteSedeProgettoFacilitatoreEntity enteSedeProgettoFacilitatoreEntity;
	List<EnteSedeProgettoFacilitatoreEntity> listaEnteSedeProgettoFacilitatore;
	EnteSedeProgettoFacilitatoreRequest enteSedeProgettoFacilitatoreRequest;
	RuoloEntity ruoloFAC;
	RuoloEntity ruoloVOL;
	RuoloEntity ruoloDTD;
	ProgrammaEntity programma1;
	List<RuoloEntity> listaRuoli;
	EnteSedeProgettoKey enteSedeProgettoKey;
	EnteSedeProgetto enteSedeProgetto;
	
	@BeforeEach
	public void setUp() {
		ente1 = new EnteEntity();
		ente1.setId(1L);
		sede1 = new SedeEntity();
		sede1.setId(1L);
		progetto1 = new ProgettoEntity();
		progetto1.setId(1L);
		progetto1.setStato("NON ATTIVO");
		utente1 = new UtenteEntity();
		utente1.setId(1L);
		utente1.setCodiceFiscale("ABCSDO95R32M894K");
		enteSedeProgettoFacilitatoreKey = new EnteSedeProgettoFacilitatoreKey(ente1.getId(), sede1.getId(), progetto1.getId(), utente1.getCodiceFiscale());
		enteSedeProgettoFacilitatoreEntity = new EnteSedeProgettoFacilitatoreEntity();
		enteSedeProgettoFacilitatoreEntity.setId(enteSedeProgettoFacilitatoreKey);
		enteSedeProgettoFacilitatoreEntity.setStatoUtente("ATTIVO");
		listaEnteSedeProgettoFacilitatore = new ArrayList<>();
		listaEnteSedeProgettoFacilitatore.add(enteSedeProgettoFacilitatoreEntity);
		enteSedeProgettoFacilitatoreRequest = new EnteSedeProgettoFacilitatoreRequest();
		enteSedeProgettoFacilitatoreRequest.setIdEnte(ente1.getId());
		enteSedeProgettoFacilitatoreRequest.setIdSedeFacVol(sede1.getId());
		enteSedeProgettoFacilitatoreRequest.setIdProgetto(progetto1.getId());
		enteSedeProgettoFacilitatoreRequest.setCodiceFiscaleFacVol(utente1.getCodiceFiscale());
		ruoloFAC = new RuoloEntity();
		ruoloFAC.setCodice("FAC");
		ruoloFAC.setNome("FACILITATORE");
		ruoloFAC.setPredefinito(true);
		ruoloVOL = new RuoloEntity();
		ruoloVOL.setCodice("VOL");
		ruoloVOL.setNome("VOLONTARIO");
		ruoloVOL.setPredefinito(true);
		ruoloDTD = new RuoloEntity();
		ruoloDTD.setCodice("DTD");
		ruoloDTD.setNome("DTD AMMINISTRATORE");
		ruoloDTD.setPredefinito(false);
		programma1 = new ProgrammaEntity();
		programma1.setId(1L);
		programma1.setPolicy(PolicyEnum.RFD);
		progetto1.setProgramma(programma1);
		listaRuoli = new ArrayList<>();
		listaRuoli.add(ruoloFAC);
		utente1.setRuoli(listaRuoli);
		enteSedeProgettoKey = new EnteSedeProgettoKey(ente1.getId(), sede1.getId(), progetto1.getId());
		enteSedeProgetto = new EnteSedeProgetto();
		enteSedeProgetto.setId(enteSedeProgettoKey);
		enteSedeProgetto.setStatoSede("NON ATTIVO");
	}
	
	@Test
	public void getAllFacilitatoriByEnteAndSedeAndProgettoTest() {
		when(this.enteSedeProgettoFacilitatoreRepository.findAllFacilitatoriByEnteAndSedeAndProgetto(ente1.getId(), sede1.getId(), progetto1.getId())).thenReturn(listaEnteSedeProgettoFacilitatore);
		enteSedeProgettoFacilitatoreService.getAllFacilitatoriByEnteAndSedeAndProgetto(ente1.getId(), sede1.getId(), progetto1.getId());
	}
	
	@Test
	public void associaFacilitatoreAEnteSedeProgettoTest() {
		//test con Policy programma = RFD, ruolo utente = FAC e stato progetto = NON ATTIVO
		when(this.utenteService.esisteUtenteByCodiceFiscale(enteSedeProgettoFacilitatoreRequest.getCodiceFiscaleFacVol())).thenReturn(true);
		when(this.enteService.esisteEnteById(ente1.getId())).thenReturn(true);
		when(this.sedeService.esisteSedeById(sede1.getId())).thenReturn(true);
		when(this.progettoService.esisteProgettoById(progetto1.getId())).thenReturn(true);
		when(this.progettoService.getProgettoById(progetto1.getId())).thenReturn(progetto1);
		when(this.utenteService.getUtenteByCodiceFiscale(utente1.getCodiceFiscale())).thenReturn(utente1);
		when(this.ruoloService.getRuoloByCodiceRuolo(RuoloUtenteEnum.FAC.toString())).thenReturn(ruoloFAC);
		when(this.ruoloService.getRuoloByCodiceRuolo(RuoloUtenteEnum.VOL.toString())).thenReturn(ruoloVOL);
		when(this.enteSedeProgettoFacilitatoreRepository.existsById(Mockito.any(EnteSedeProgettoFacilitatoreKey.class))).thenReturn(false);
		when(enteSedeProgettoService.getAssociazioneEnteSedeProgetto(sede1.getId(), ente1.getId(), progetto1.getId())).thenReturn(enteSedeProgetto);
		when(this.ruoloService.getRuoloByCodiceRuolo(ruoloFAC.getCodice())).thenReturn(ruoloFAC);
		when(this.utenteService.getUtenteByCodiceFiscale(utente1.getCodiceFiscale())).thenReturn(utente1);
		enteSedeProgettoFacilitatoreService.associaFacilitatoreAEnteSedeProgetto(enteSedeProgettoFacilitatoreRequest);
	}
	
	@Test
	public void associaFacilitatoreAEnteSedeProgettoTest2() {
		//test con Policy programma = SCD, ruolo utente != VOL e != FAC e stato progetto = ATTIVO
		programma1.setPolicy(PolicyEnum.SCD);
		listaRuoli = new ArrayList<>();
		listaRuoli.add(ruoloDTD);
		utente1.setRuoli(listaRuoli);
		progetto1.setStato("ATTIVO");
		utente1.setTipoContratto("VOLONTARIATO");
		when(this.utenteService.esisteUtenteByCodiceFiscale(enteSedeProgettoFacilitatoreRequest.getCodiceFiscaleFacVol())).thenReturn(true);
		when(this.enteService.esisteEnteById(ente1.getId())).thenReturn(true);
		when(this.sedeService.esisteSedeById(sede1.getId())).thenReturn(true);
		when(this.progettoService.esisteProgettoById(progetto1.getId())).thenReturn(true);
		when(this.progettoService.getProgettoById(progetto1.getId())).thenReturn(progetto1);
		when(this.utenteService.getUtenteByCodiceFiscale(utente1.getCodiceFiscale())).thenReturn(utente1);
		when(this.ruoloService.getRuoloByCodiceRuolo(RuoloUtenteEnum.FAC.toString())).thenReturn(ruoloFAC);
		when(this.ruoloService.getRuoloByCodiceRuolo(RuoloUtenteEnum.VOL.toString())).thenReturn(ruoloVOL);
		when(this.enteSedeProgettoFacilitatoreRepository.existsById(Mockito.any(EnteSedeProgettoFacilitatoreKey.class))).thenReturn(false);
		when(enteSedeProgettoService.getAssociazioneEnteSedeProgetto(sede1.getId(), ente1.getId(), progetto1.getId())).thenReturn(enteSedeProgetto);
		when(this.ruoloService.getRuoloByCodiceRuolo(ruoloVOL.getCodice())).thenReturn(ruoloVOL);
		when(this.utenteService.getUtenteByCodiceFiscale(utente1.getCodiceFiscale())).thenReturn(utente1);
		enteSedeProgettoFacilitatoreService.associaFacilitatoreAEnteSedeProgetto(enteSedeProgettoFacilitatoreRequest);
	}
	
	@Test
	public void associaFacilitatoreAEnteSedeProgettoKOTest() {
		//test KO per utente inesistente
		when(this.utenteService.esisteUtenteByCodiceFiscale(utente1.getCodiceFiscale())).thenReturn(false);
		Assertions.assertThrows(EnteSedeProgettoFacilitatoreException.class, () -> enteSedeProgettoFacilitatoreService.associaFacilitatoreAEnteSedeProgetto(enteSedeProgettoFacilitatoreRequest));
		assertThatExceptionOfType(EnteSedeProgettoFacilitatoreException.class);
		
		//test KO per ente o sede o progetto inestistente
		when(this.utenteService.esisteUtenteByCodiceFiscale(utente1.getCodiceFiscale())).thenReturn(true);
		when(this.enteService.esisteEnteById(ente1.getId())).thenReturn(true);
		when(this.sedeService.esisteSedeById(sede1.getId())).thenReturn(true);
		when(this.progettoService.esisteProgettoById(progetto1.getId())).thenReturn(false);
		Assertions.assertThrows(EnteSedeProgettoFacilitatoreException.class, () -> enteSedeProgettoFacilitatoreService.associaFacilitatoreAEnteSedeProgetto(enteSedeProgettoFacilitatoreRequest));
		assertThatExceptionOfType(EnteSedeProgettoFacilitatoreException.class);
		
		//test KO per policy programma = RFD e ruolo Utente = VOL
		listaRuoli = new ArrayList<>();
		listaRuoli.add(ruoloVOL);
		utente1.setRuoli(listaRuoli);
		when(this.utenteService.esisteUtenteByCodiceFiscale(enteSedeProgettoFacilitatoreRequest.getCodiceFiscaleFacVol())).thenReturn(true);
		when(this.enteService.esisteEnteById(ente1.getId())).thenReturn(true);
		when(this.sedeService.esisteSedeById(sede1.getId())).thenReturn(true);
		when(this.progettoService.esisteProgettoById(progetto1.getId())).thenReturn(true);
		when(this.progettoService.getProgettoById(progetto1.getId())).thenReturn(progetto1);
		when(this.utenteService.getUtenteByCodiceFiscale(utente1.getCodiceFiscale())).thenReturn(utente1);
		when(this.ruoloService.getRuoloByCodiceRuolo(RuoloUtenteEnum.FAC.toString())).thenReturn(ruoloFAC);
		when(this.ruoloService.getRuoloByCodiceRuolo(RuoloUtenteEnum.VOL.toString())).thenReturn(ruoloVOL);
		Assertions.assertThrows(EnteSedeProgettoFacilitatoreException.class, () -> enteSedeProgettoFacilitatoreService.associaFacilitatoreAEnteSedeProgetto(enteSedeProgettoFacilitatoreRequest));
		assertThatExceptionOfType(EnteSedeProgettoFacilitatoreException.class);
		
		//test KO per policy programma = SCD e ruolo utente = FAC
		listaRuoli = new ArrayList<>();
		listaRuoli.add(ruoloFAC);
		utente1.setRuoli(listaRuoli);
		programma1.setPolicy(PolicyEnum.SCD);
		when(this.utenteService.esisteUtenteByCodiceFiscale(enteSedeProgettoFacilitatoreRequest.getCodiceFiscaleFacVol())).thenReturn(true);
		when(this.enteService.esisteEnteById(ente1.getId())).thenReturn(true);
		when(this.sedeService.esisteSedeById(sede1.getId())).thenReturn(true);
		when(this.progettoService.esisteProgettoById(progetto1.getId())).thenReturn(true);
		when(this.progettoService.getProgettoById(progetto1.getId())).thenReturn(progetto1);
		when(this.utenteService.getUtenteByCodiceFiscale(utente1.getCodiceFiscale())).thenReturn(utente1);
		when(this.ruoloService.getRuoloByCodiceRuolo(RuoloUtenteEnum.FAC.toString())).thenReturn(ruoloFAC);
		when(this.ruoloService.getRuoloByCodiceRuolo(RuoloUtenteEnum.VOL.toString())).thenReturn(ruoloVOL);
		Assertions.assertThrows(EnteSedeProgettoFacilitatoreException.class, () -> enteSedeProgettoFacilitatoreService.associaFacilitatoreAEnteSedeProgetto(enteSedeProgettoFacilitatoreRequest));
		assertThatExceptionOfType(EnteSedeProgettoFacilitatoreException.class);
	}
	
	@Test
	public void associaFacilitatoreAEnteSedeProgettoKOTest2() {
		//test KO per associazione ente, sede, progetto, facilitatore già esistente
		when(this.utenteService.esisteUtenteByCodiceFiscale(enteSedeProgettoFacilitatoreRequest.getCodiceFiscaleFacVol())).thenReturn(true);
		when(this.enteService.esisteEnteById(ente1.getId())).thenReturn(true);
		when(this.sedeService.esisteSedeById(sede1.getId())).thenReturn(true);
		when(this.progettoService.esisteProgettoById(progetto1.getId())).thenReturn(true);
		when(this.progettoService.getProgettoById(progetto1.getId())).thenReturn(progetto1);
		when(this.utenteService.getUtenteByCodiceFiscale(utente1.getCodiceFiscale())).thenReturn(utente1);
		when(this.ruoloService.getRuoloByCodiceRuolo(RuoloUtenteEnum.FAC.toString())).thenReturn(ruoloFAC);
		when(this.ruoloService.getRuoloByCodiceRuolo(RuoloUtenteEnum.VOL.toString())).thenReturn(ruoloVOL);
		when(this.enteSedeProgettoFacilitatoreRepository.existsById(Mockito.any(EnteSedeProgettoFacilitatoreKey.class))).thenReturn(true);
		Assertions.assertThrows(EnteSedeProgettoFacilitatoreException.class, () -> enteSedeProgettoFacilitatoreService.associaFacilitatoreAEnteSedeProgetto(enteSedeProgettoFacilitatoreRequest));
		assertThatExceptionOfType(EnteSedeProgettoFacilitatoreException.class);
	}
	
	@Test
	public void cancellaOTerminaAssociazioneFacilitatoreAEnteSedeProgettoTest() {
		//test con policy programma = RFD e stato utente = ATTIVO
		IntegrazioniUtenteEntity integrazioneUtente = new IntegrazioniUtenteEntity();
		integrazioneUtente.setId(1L);
		utente1.setIntegrazioneUtente(integrazioneUtente);
		when(this.progettoService.getProgettoById(progetto1.getId())).thenReturn(progetto1);
		when(this.enteSedeProgettoFacilitatoreRepository.findById(Mockito.any(EnteSedeProgettoFacilitatoreKey.class))).thenReturn(Optional.of(enteSedeProgettoFacilitatoreEntity));
		when(this.enteSedeProgettoFacilitatoreRepository.findAltriFacilitatoriAttivi(enteSedeProgettoFacilitatoreRequest.getCodiceFiscaleFacVol(), enteSedeProgettoFacilitatoreRequest.getIdProgetto(), ruoloFAC.getCodice())).thenReturn(listaEnteSedeProgettoFacilitatore);
		when(this.utenteService.getUtenteByCodiceFiscale(enteSedeProgettoFacilitatoreRequest.getCodiceFiscaleFacVol())).thenReturn(utente1);
		enteSedeProgettoFacilitatoreService.cancellaOTerminaAssociazioneFacilitatoreAEnteSedeProgetto(enteSedeProgettoFacilitatoreRequest);
	}
	
	@Test
	public void cancellaOTerminaAssociazioneFacilitatoreAEnteSedeProgettoTest2() {
		//test con policy programma = SCD e stato utente = NON ATTIVO
		programma1.setPolicy(PolicyEnum.SCD);
		enteSedeProgettoFacilitatoreEntity.setStatoUtente("NON ATTIVO");
		when(this.progettoService.getProgettoById(progetto1.getId())).thenReturn(progetto1);
		when(this.enteSedeProgettoFacilitatoreRepository.findById(Mockito.any(EnteSedeProgettoFacilitatoreKey.class))).thenReturn(Optional.of(enteSedeProgettoFacilitatoreEntity));
		enteSedeProgettoFacilitatoreService.cancellaOTerminaAssociazioneFacilitatoreAEnteSedeProgetto(enteSedeProgettoFacilitatoreRequest);
	}
	
	@Test
	public void cancellaOTerminaAssociazioneFacilitatoreAEnteSedeProgettoKOTest() {
		//test KO per unico facilitatore
		when(this.progettoService.getProgettoById(progetto1.getId())).thenReturn(progetto1);
		when(this.enteSedeProgettoFacilitatoreRepository.findById(Mockito.any(EnteSedeProgettoFacilitatoreKey.class))).thenReturn(Optional.of(enteSedeProgettoFacilitatoreEntity));
		when(this.enteSedeProgettoFacilitatoreRepository.findAltriFacilitatoriAttivi(enteSedeProgettoFacilitatoreRequest.getCodiceFiscaleFacVol(), enteSedeProgettoFacilitatoreRequest.getIdProgetto(), ruoloFAC.getCodice())).thenReturn(new ArrayList<>());
		Assertions.assertThrows(EnteSedeProgettoFacilitatoreException.class, () -> enteSedeProgettoFacilitatoreService.cancellaOTerminaAssociazioneFacilitatoreAEnteSedeProgetto(enteSedeProgettoFacilitatoreRequest));
		assertThatExceptionOfType(EnteSedeProgettoFacilitatoreException.class);
		
		//test KO per unico volontario
		programma1.setPolicy(PolicyEnum.SCD);
		when(this.progettoService.getProgettoById(progetto1.getId())).thenReturn(progetto1);
		when(this.enteSedeProgettoFacilitatoreRepository.findById(Mockito.any(EnteSedeProgettoFacilitatoreKey.class))).thenReturn(Optional.of(enteSedeProgettoFacilitatoreEntity));
		when(this.enteSedeProgettoFacilitatoreRepository.findAltriFacilitatoriAttivi(enteSedeProgettoFacilitatoreRequest.getCodiceFiscaleFacVol(), enteSedeProgettoFacilitatoreRequest.getIdProgetto(), ruoloVOL.getCodice())).thenReturn(new ArrayList<>());
		Assertions.assertThrows(EnteSedeProgettoFacilitatoreException.class, () -> enteSedeProgettoFacilitatoreService.cancellaOTerminaAssociazioneFacilitatoreAEnteSedeProgetto(enteSedeProgettoFacilitatoreRequest));
		assertThatExceptionOfType(EnteSedeProgettoFacilitatoreException.class);
	}
	
	@Test
	public void cancellaOTerminaAssociazioneFacilitatoreOVolontarioAEnteSedeProgettoTest() {
		//test con stato utente = ATTIVO
		IntegrazioniUtenteEntity integrazioneUtente = new IntegrazioniUtenteEntity();
		integrazioneUtente.setId(1L);
		utente1.setIntegrazioneUtente(integrazioneUtente);
		when(this.enteSedeProgettoFacilitatoreRepository.findById(enteSedeProgettoFacilitatoreKey)).thenReturn(Optional.of(enteSedeProgettoFacilitatoreEntity));
		when(this.utenteService.getUtenteByCodiceFiscale(enteSedeProgettoFacilitatoreRequest.getCodiceFiscaleFacVol())).thenReturn(utente1);
		enteSedeProgettoFacilitatoreService.cancellaOTerminaAssociazioneFacilitatoreOVolontarioAEnteSedeProgetto(enteSedeProgettoFacilitatoreEntity);
	}
	
	@Test
	public void cancellaOTerminaAssociazioneFacilitatoreOVolontarioAEnteSedeProgettoTest2() {
		//test con stato utente = NON ATTIVO
		enteSedeProgettoFacilitatoreEntity.setStatoUtente("NON ATTIVO");
		when(this.enteSedeProgettoFacilitatoreRepository.findById(enteSedeProgettoFacilitatoreKey)).thenReturn(Optional.of(enteSedeProgettoFacilitatoreEntity));
		enteSedeProgettoFacilitatoreService.cancellaOTerminaAssociazioneFacilitatoreOVolontarioAEnteSedeProgetto(enteSedeProgettoFacilitatoreEntity);
	}
	
	@Test
	public void terminaAssociazioneFacilitatoreOVolontarioTest() {
		IntegrazioniUtenteEntity integrazioneUtente = new IntegrazioniUtenteEntity();
		integrazioneUtente.setId(1L);
		utente1.setIntegrazioneUtente(integrazioneUtente);
		when(this.enteSedeProgettoFacilitatoreRepository.findById(enteSedeProgettoFacilitatoreKey)).thenReturn(Optional.of(enteSedeProgettoFacilitatoreEntity));
		when(this.utenteService.getUtenteByCodiceFiscale(enteSedeProgettoFacilitatoreRequest.getCodiceFiscaleFacVol())).thenReturn(utente1);
		enteSedeProgettoFacilitatoreService.terminaAssociazioneFacilitatoreOVolontario(enteSedeProgettoFacilitatoreKey);
	}
	
	@Test
	public void cancellaAssociazioniFacilitatoriOVolontariAEnteSedeProgettoTest() {
		when(this.enteSedeProgettoFacilitatoreRepository.findAllFacilitatoriByEnteAndSedeAndProgetto(ente1.getId(), sede1.getId(), progetto1.getId())).thenReturn(listaEnteSedeProgettoFacilitatore);
		enteSedeProgettoFacilitatoreService.cancellaAssociazioniFacilitatoriOVolontariAEnteSedeProgetto(sede1.getId(), ente1.getId(), progetto1.getId());
	}
	
	@Test
	public void cancellaAssociazioneFacilitatoreTest() {
		enteSedeProgettoFacilitatoreService.cancellaAssociazioneFacilitatore(ente1.getId(), sede1.getId(), progetto1.getId(), utente1.getCodiceFiscale(), ruoloFAC.getCodice());
	}
	
	@Test
	public void cancellazioneAssociazioniEnteSedeProgettoFacilitatoreByIdEnteAndIdProgettoTest() {
		enteSedeProgettoFacilitatoreService.cancellazioneAssociazioniEnteSedeProgettoFacilitatoreByIdEnteAndIdProgetto(ente1.getId(), progetto1.getId());
	}
	
	@Test
	public void getFacilitatoriByIdEnteAndIdProgettoTest() {
		when(this.enteSedeProgettoFacilitatoreRepository.getFacilitatoriByIdEnteAndIdProgetto(ente1.getId(), progetto1.getId())).thenReturn(listaEnteSedeProgettoFacilitatore);
		enteSedeProgettoFacilitatoreService.getFacilitatoriByIdEnteAndIdProgetto(ente1.getId(), progetto1.getId());
	}
	
	@Test
	public void countAssociazioniFacilitatoreAndVolontarioTest() {
		when(this.enteSedeProgettoFacilitatoreRepository.countAssociazioniFacilitatoreAndVolontario(utente1.getCodiceFiscale(), ruoloFAC.getCodice())).thenReturn(1);
		enteSedeProgettoFacilitatoreService.countAssociazioniFacilitatoreAndVolontario(utente1.getCodiceFiscale(), ruoloFAC.getCodice());
	}
}
