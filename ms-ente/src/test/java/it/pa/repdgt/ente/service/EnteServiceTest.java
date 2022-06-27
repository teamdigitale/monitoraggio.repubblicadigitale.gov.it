package it.pa.repdgt.ente.service;

import static org.assertj.core.api.Assertions.assertThatExceptionOfType;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;

import it.pa.repdgt.ente.dto.EnteDto;
import it.pa.repdgt.ente.exception.EnteException;
import it.pa.repdgt.ente.exception.ResourceNotFoundException;
import it.pa.repdgt.ente.repository.EntePartnerRepository;
import it.pa.repdgt.ente.repository.EnteRepository;
import it.pa.repdgt.ente.repository.ProgrammaRepository;
import it.pa.repdgt.ente.request.FiltroRequest;
import it.pa.repdgt.ente.restapi.param.EntiPaginatiParam;
import it.pa.repdgt.shared.entity.EnteEntity;
import it.pa.repdgt.shared.entity.EntePartnerEntity;
import it.pa.repdgt.shared.entity.EnteSedeProgetto;
import it.pa.repdgt.shared.entity.EnteSedeProgettoFacilitatoreEntity;
import it.pa.repdgt.shared.entity.ProgettoEntity;
import it.pa.repdgt.shared.entity.ProgrammaEntity;
import it.pa.repdgt.shared.entity.ReferentiDelegatiEnteGestoreProgettoEntity;
import it.pa.repdgt.shared.entity.ReferentiDelegatiEnteGestoreProgrammaEntity;
import it.pa.repdgt.shared.entity.ReferentiDelegatiEntePartnerDiProgettoEntity;
import it.pa.repdgt.shared.entity.RuoloEntity;
import it.pa.repdgt.shared.entity.UtenteEntity;
import it.pa.repdgt.shared.entity.UtenteXRuolo;
import it.pa.repdgt.shared.entity.key.EntePartnerKey;
import it.pa.repdgt.shared.entity.key.EnteSedeProgettoFacilitatoreKey;
import it.pa.repdgt.shared.entity.key.EnteSedeProgettoKey;
import it.pa.repdgt.shared.entity.key.ReferentiDelegatiEnteGestoreProgettoKey;
import it.pa.repdgt.shared.entity.key.ReferentiDelegatiEnteGestoreProgrammaKey;
import it.pa.repdgt.shared.entity.key.ReferentiDelegatiEntePartnerDiProgettoKey;
import it.pa.repdgt.shared.entity.key.UtenteXRuoloKey;
import it.pa.repdgt.shared.entityenum.PolicyEnum;
import it.pa.repdgt.shared.entityenum.RuoloUtenteEnum;
import it.pa.repdgt.shared.entityenum.StatoEnum;
import it.pa.repdgt.shared.service.storico.StoricoService;

@ExtendWith(MockitoExtension.class)
public class EnteServiceTest {
	
	@Mock
	private RuoloService ruoloService;
	@Mock
	private UtenteXRuoloService utenteXRuoloService;
	@Mock
	private ProgrammaService programmaService;
	@Mock
	private ProgettoService progettoService;
	@Mock
	private EntePartnerService entePartnerService;
	@Mock
	private ReferentiDelegatiEnteGestoreProgrammaService referentiDelegatiEnteGestoreProgrammaService;
	@Mock
	private ReferentiDelegatiEnteGestoreProgettoService referentiDelegatiEnteGestoreProgettoService;
	@Mock
	private ReferentiDelegatiEntePartnerDiProgettoService referentiDelegatiEntePartnerDiProgettoService;
	@Mock
	private EnteSedeProgettoService enteSedeProgettoService;
	@Mock
	private EnteSedeProgettoFacilitatoreService enteSedeProgettoFacilitatoreService;
	@Mock
	private StoricoService storicoService;
	@Mock
	private EnteRepository enteRepository;
	@Mock
	private EntePartnerRepository entePartnerRepository;
	@Mock
	private ProgrammaRepository programmaRepository;
	
	@Autowired
	@InjectMocks
	private EnteService enteService;
	
	EntiPaginatiParam entiPaginatiParam;
	EnteEntity ente1;
	EnteDto enteDto1;
	List<EnteDto> listaEntiDto;
	Optional<EnteEntity> enteOptional; 
	ProgrammaEntity programma1;
	ProgettoEntity progetto1;
	EntePartnerKey entePartnerKey1;
	EntePartnerEntity entePartner1;
	RuoloEntity ruolo1;
	RuoloEntity ruolo2;
	List<RuoloEntity> listaRuoli;
	UtenteEntity utente1;
	UtenteXRuoloKey utenteRuolo1Key;
	UtenteXRuolo utenteRuolo1;
	UtenteXRuoloKey utenteRuolo2Key;
	UtenteXRuolo utenteRuolo2;
	ReferentiDelegatiEnteGestoreProgrammaKey referentiDelegatiEnteGestoreProgrammaKey;
	ReferentiDelegatiEnteGestoreProgrammaKey referentiDelegatiEnteGestoreProgrammaKey2;
	ReferentiDelegatiEnteGestoreProgrammaEntity referentiDelegatiEnteGestoreProgrammaEntity;
	ReferentiDelegatiEnteGestoreProgrammaEntity referentiDelegatiEnteGestoreProgrammaEntity2;
	List<ReferentiDelegatiEnteGestoreProgrammaEntity> listaReferentiDelegatiEnteGestoreProgramma;
	ReferentiDelegatiEnteGestoreProgettoKey referentiDelegatiEnteGestoreProgettoKey;
	ReferentiDelegatiEnteGestoreProgettoKey referentiDelegatiEnteGestoreProgettoKey2;
	ReferentiDelegatiEnteGestoreProgettoEntity referentiDelegatiEnteGestoreProgettoEntity;
	ReferentiDelegatiEnteGestoreProgettoEntity referentiDelegatiEnteGestoreProgettoEntity2;
	List<ReferentiDelegatiEnteGestoreProgettoEntity> listaReferentiDelegatiEnteGestoreProgetto;
	ReferentiDelegatiEntePartnerDiProgettoKey referentiDelegatiEntePartnerDiProgettoKey;
	ReferentiDelegatiEntePartnerDiProgettoEntity referentiDelegatiEntePartnerDiProgettoEntity;
	List<ReferentiDelegatiEntePartnerDiProgettoEntity> listaReferentiDelegatiEntePartnerDiProgetto;
	EnteSedeProgettoFacilitatoreKey enteSedeProgettoFacilitatoreKey;
	EnteSedeProgettoFacilitatoreEntity enteSedeProgettoFacilitatoreEntity;
	List<EnteSedeProgettoFacilitatoreEntity> listaEnteSedeProgettoFacilitatore;
	EnteSedeProgettoKey enteSedeProgettoKey;
	EnteSedeProgetto enteSedeProgetto;
	EnteSedeProgettoKey enteSedeProgettoKey2;
	EnteSedeProgetto enteSedeProgetto2;
	List<EnteSedeProgetto> listaEnteSedeProgetto;
	Page<EnteDto> pagina;
	FiltroRequest filtro;
	List<String> idsProgrammi;
	List<String> idsProgetti;
	List<String> profili;
	List<Map<String, String>> resultSet;
	List<EnteDto> entiDto;
	Integer currPage;
	Integer pageSize;

	@BeforeEach
	public void setup() {
		
		ruolo1 = new RuoloEntity();
		ruolo1.setCodice("DTD");
		ruolo2 = new RuoloEntity();
		ruolo2.setCodice("FAC");
		ente1 = new EnteEntity();
		ente1.setId(1L);
		ente1.setNome("ente1");
		enteDto1 = new EnteDto();
		enteDto1.setNome("ente1");
		enteOptional = Optional.of(ente1);
		listaEntiDto = new ArrayList<>();
		listaEntiDto.add(enteDto1);
		programma1 = new ProgrammaEntity();
		programma1.setNome("programma1");
		programma1.setId(1L);
		programma1.setStato("ATTIVO");
		programma1.setPolicy(PolicyEnum.RFD);
		progetto1 = new ProgettoEntity();
		progetto1.setNome("progetto1");
		progetto1.setId(1L);
		progetto1.setStato("ATTIVO");
		entePartnerKey1 = new EntePartnerKey(progetto1.getId(), ente1.getId());
		entePartner1 = new EntePartnerEntity();
		entePartner1.setId(entePartnerKey1);
		listaRuoli = new ArrayList<>();
		listaRuoli.add(ruolo1);
		utente1 = new UtenteEntity();
		utente1.setId(1L);
		utente1.setCodiceFiscale("ABCABC12A12A123A");
		utente1.setRuoli(listaRuoli);
		utenteRuolo1Key = new UtenteXRuoloKey(utente1.getCodiceFiscale(), ruolo1.getCodice());
		utenteRuolo1 = new UtenteXRuolo();
		utenteRuolo1.setId(utenteRuolo1Key);
		utenteRuolo2Key = new UtenteXRuoloKey(utente1.getCodiceFiscale(), ruolo2.getCodice());
		utenteRuolo2 = new UtenteXRuolo();
		utenteRuolo2.setId(utenteRuolo2Key);
		referentiDelegatiEnteGestoreProgrammaKey = new ReferentiDelegatiEnteGestoreProgrammaKey(programma1.getId(), utente1.getCodiceFiscale(), ente1.getId());
		referentiDelegatiEnteGestoreProgrammaEntity = new ReferentiDelegatiEnteGestoreProgrammaEntity();
		referentiDelegatiEnteGestoreProgrammaEntity.setId(referentiDelegatiEnteGestoreProgrammaKey);
		referentiDelegatiEnteGestoreProgrammaEntity.setCodiceRuolo(RuoloUtenteEnum.REG.toString());
		referentiDelegatiEnteGestoreProgrammaKey2 = new ReferentiDelegatiEnteGestoreProgrammaKey(programma1.getId(), utente1.getCodiceFiscale(), ente1.getId());
		referentiDelegatiEnteGestoreProgrammaEntity2 = new ReferentiDelegatiEnteGestoreProgrammaEntity();
		referentiDelegatiEnteGestoreProgrammaEntity2.setId(referentiDelegatiEnteGestoreProgrammaKey2);
		referentiDelegatiEnteGestoreProgrammaEntity2.setCodiceRuolo(RuoloUtenteEnum.REG.toString());
		listaReferentiDelegatiEnteGestoreProgramma = new ArrayList<>();
		listaReferentiDelegatiEnteGestoreProgramma.add(referentiDelegatiEnteGestoreProgrammaEntity);
		listaReferentiDelegatiEnteGestoreProgramma.add(referentiDelegatiEnteGestoreProgrammaEntity2);
		referentiDelegatiEnteGestoreProgettoKey = new ReferentiDelegatiEnteGestoreProgettoKey(progetto1.getId(), utente1.getCodiceFiscale(), ente1.getId());
		referentiDelegatiEnteGestoreProgettoEntity = new ReferentiDelegatiEnteGestoreProgettoEntity();
		referentiDelegatiEnteGestoreProgettoEntity.setId(referentiDelegatiEnteGestoreProgettoKey);
		referentiDelegatiEnteGestoreProgettoEntity.setCodiceRuolo(RuoloUtenteEnum.REGP.toString());
		referentiDelegatiEnteGestoreProgettoKey2 = new ReferentiDelegatiEnteGestoreProgettoKey(progetto1.getId(), utente1.getCodiceFiscale(), ente1.getId());
		referentiDelegatiEnteGestoreProgettoEntity2 = new ReferentiDelegatiEnteGestoreProgettoEntity();
		referentiDelegatiEnteGestoreProgettoEntity2.setId(referentiDelegatiEnteGestoreProgettoKey2);
		referentiDelegatiEnteGestoreProgettoEntity2.setCodiceRuolo(RuoloUtenteEnum.REGP.toString());
		listaReferentiDelegatiEnteGestoreProgetto = new ArrayList<>();
		listaReferentiDelegatiEnteGestoreProgetto.add(referentiDelegatiEnteGestoreProgettoEntity);
		listaReferentiDelegatiEnteGestoreProgetto.add(referentiDelegatiEnteGestoreProgettoEntity2);
		referentiDelegatiEntePartnerDiProgettoKey = new ReferentiDelegatiEntePartnerDiProgettoKey(progetto1.getId(), ente1.getId(), utente1.getCodiceFiscale());
		referentiDelegatiEntePartnerDiProgettoEntity = new ReferentiDelegatiEntePartnerDiProgettoEntity();
		referentiDelegatiEntePartnerDiProgettoEntity.setId(referentiDelegatiEntePartnerDiProgettoKey);
		referentiDelegatiEntePartnerDiProgettoEntity.setCodiceRuolo(RuoloUtenteEnum.REPP.toString());
		listaReferentiDelegatiEntePartnerDiProgetto = new ArrayList<>();
		listaReferentiDelegatiEntePartnerDiProgetto.add(referentiDelegatiEntePartnerDiProgettoEntity);
		enteSedeProgettoFacilitatoreKey = new EnteSedeProgettoFacilitatoreKey(ente1.getId(), 1L, progetto1.getId(), utente1.getCodiceFiscale());
		enteSedeProgettoFacilitatoreEntity = new EnteSedeProgettoFacilitatoreEntity();
		enteSedeProgettoFacilitatoreEntity.setId(enteSedeProgettoFacilitatoreKey);
		enteSedeProgettoFacilitatoreEntity.setRuoloUtente(RuoloUtenteEnum.FAC.toString());
		listaEnteSedeProgettoFacilitatore = new ArrayList<>();
		listaEnteSedeProgettoFacilitatore.add(enteSedeProgettoFacilitatoreEntity);
		enteSedeProgettoKey = new EnteSedeProgettoKey(ente1.getId(), 1L, progetto1.getId());
		enteSedeProgetto = new EnteSedeProgetto();
		enteSedeProgetto.setId(enteSedeProgettoKey);
		enteSedeProgettoKey2 = new EnteSedeProgettoKey(ente1.getId(), 1L, progetto1.getId());
		enteSedeProgetto2 = new EnteSedeProgetto();
		enteSedeProgetto2.setId(enteSedeProgettoKey2);
		listaEnteSedeProgetto = new ArrayList<>();
		listaEnteSedeProgetto.add(enteSedeProgetto);
		listaEnteSedeProgetto.add(enteSedeProgetto2);
		pagina = new PageImpl<>(listaEntiDto);
		idsProgrammi = new ArrayList<>();
		idsProgrammi.add("104");
		idsProgetti = new ArrayList<>();
		idsProgetti.add("256");
		profili = new ArrayList<>();
		profili.add("Ente Gestore di Programma");
		filtro = new FiltroRequest();
		filtro.setCriterioRicerca("Ente");
		filtro.setIdsProgrammi(idsProgrammi);
		filtro.setIdsProgetti(idsProgetti);
		filtro.setProfili(profili);
		entiPaginatiParam = new EntiPaginatiParam();
		entiPaginatiParam.setCfUtente("UIHPLW87R49F205X");
		entiPaginatiParam.setCodiceRuolo(RuoloUtenteEnum.DTD);
		entiPaginatiParam.setFiltroRequest(filtro);
		currPage = 0;
		pageSize = 10;
		resultSet = new ArrayList<>();
		entiDto = new ArrayList<>();
	}
	
//	@Test
//	public void getAllEntiPaginatiDTDTest() {
//		when(ruoloService.getRuoliByCodiceFiscale(entiPaginatiParam.getCfUtente())).thenReturn(listaRuoli);
//		when(enteService.getAllEntiByCodiceRuoloAndIdProgramma(entiPaginatiParam)).thenReturn(listaEntiDto);
//		Page<EnteDto> paginaEntiDto = this.enteService.getAllEntiPaginati(entiPaginatiParam, currPage, pageSize);
//		assertThat(listaEntiDto.size()).isEqualTo(1);
//		assertThat(paginaEntiDto.getTotalElements()).isEqualTo(pagina.getTotalElements());
//		verify(enteRepository, times(1)).findAllEntiFiltrati(filtro.getCriterioRicerca(),
//				"%"+filtro.getCriterioRicerca()+"%",
//				filtro.getIdsProgrammi(),
//				filtro.getIdsProgetti(),
//				filtro.getProfili(),
//				null);
//	}
	
	@Test
	public void getEnteByPartitaIvaTest() {
		String partitaIva = "AAAAAAA11";
		when(enteRepository.findByPartitaIva(partitaIva)).thenReturn(enteOptional);
		enteService.getEnteByPartitaIva(partitaIva);
		verify(enteRepository, times(1)).findByPartitaIva(partitaIva);
	}
	
	@Test
	public void getEnteByPartitaIvaKOTest() {
		String partitaIva = "AAAAAAA11";
		enteOptional = Optional.empty();
		when(enteRepository.findByPartitaIva(partitaIva)).thenReturn(enteOptional);
		Assertions.assertThrows(ResourceNotFoundException.class, () -> enteService.getEnteByPartitaIva(partitaIva));
		assertThatExceptionOfType(ResourceNotFoundException.class);
	}
	
	@Test
	public void creaNuovoEnteTest() {
		String partitaIva = "AAAAAAA11";
		ente1.setPiva(partitaIva);
		enteOptional = Optional.empty();
		when(enteRepository.findByPartitaIva(partitaIva)).thenReturn(enteOptional);
		enteService.creaNuovoEnte(ente1);
		verify(enteRepository, times(1)).save(ente1);
	}
	
	@Test
	public void creaNuovoEnteKOTest() {
		String partitaIva = "AAAAAAA11";
		ente1.setPiva(partitaIva);
		when(enteRepository.findByPartitaIva(partitaIva)).thenReturn(enteOptional);
		Assertions.assertThrows(EnteException.class, () -> enteService.creaNuovoEnte(ente1));
		assertThatExceptionOfType(EnteException.class);
		verify(enteRepository, times(0)).save(ente1);
	}
	
	@Test
	public void aggiornaEnteTest() {
		when(enteRepository.existsById(ente1.getId())).thenReturn(true);
		when(enteRepository.findById(ente1.getId())).thenReturn(enteOptional);
		enteService.aggiornaEnte(ente1, ente1.getId());
		verify(enteRepository, times(1)).save(ente1);
	}
	
	@Test
	public void aggiornaEnteKOTest() {
		when(enteRepository.existsById(ente1.getId())).thenReturn(false);
		Assertions.assertThrows(EnteException.class, () -> enteService.aggiornaEnte(ente1, ente1.getId()));
		assertThatExceptionOfType(EnteException.class);
		verify(enteRepository, times(0)).save(ente1);
	}

	@Test
	public void cancellaGestoreProgrammaTest() {
		programma1.setStatoGestoreProgramma(StatoEnum.NON_ATTIVO.getValue());
		when(enteRepository.findById(ente1.getId())).thenReturn(enteOptional);
		when(programmaService.getProgrammaById(programma1.getId())).thenReturn(programma1);
		when(referentiDelegatiEnteGestoreProgrammaService.getReferentiAndDelegatiByIdProgrammaAndIdEnte(programma1.getId(), ente1.getId())).thenReturn(listaReferentiDelegatiEnteGestoreProgramma);
		when(referentiDelegatiEnteGestoreProgrammaService.countAssociazioniReferenteDelegato(referentiDelegatiEnteGestoreProgrammaEntity.getId().getCodFiscaleUtente(), referentiDelegatiEnteGestoreProgrammaEntity.getCodiceRuolo())).thenReturn(0);
		when(utenteXRuoloService.getUtenteXRuoloByCfUtenteAndCodiceRuolo(referentiDelegatiEnteGestoreProgrammaEntity.getId().getCodFiscaleUtente(), referentiDelegatiEnteGestoreProgrammaEntity.getCodiceRuolo())).thenReturn(utenteRuolo1);
		enteService.cancellaGestoreProgramma(ente1.getId(), programma1.getId());
		verify(programmaService, times(1)).salvaProgramma(programma1);
	}
	
	@Test
	public void cancellaGestoreProgrammaTest2() {
		programma1.setStatoGestoreProgramma(StatoEnum.NON_ATTIVO.getValue());
		when(enteRepository.findById(ente1.getId())).thenReturn(enteOptional);
		when(programmaService.getProgrammaById(programma1.getId())).thenReturn(programma1);
		when(referentiDelegatiEnteGestoreProgrammaService.getReferentiAndDelegatiByIdProgrammaAndIdEnte(programma1.getId(), ente1.getId())).thenReturn(listaReferentiDelegatiEnteGestoreProgramma);
		when(referentiDelegatiEnteGestoreProgrammaService.countAssociazioniReferenteDelegato(referentiDelegatiEnteGestoreProgrammaEntity.getId().getCodFiscaleUtente(), referentiDelegatiEnteGestoreProgrammaEntity.getCodiceRuolo())).thenReturn(1);
		enteService.cancellaGestoreProgramma(ente1.getId(), programma1.getId());
		verify(programmaService, times(1)).salvaProgramma(programma1);
	}
	
	@Test
	public void cancellaGestoreProgrammaKOTest() {
		//test KO per ente non esistente
		enteOptional = Optional.empty();
		programma1.setStatoGestoreProgramma(StatoEnum.NON_ATTIVO.getValue());
		when(enteRepository.findById(ente1.getId())).thenReturn(enteOptional);
		Assertions.assertThrows(EnteException.class, () -> enteService.cancellaGestoreProgramma(ente1.getId(), programma1.getId()));
		assertThatExceptionOfType(EnteException.class);
		verify(programmaService, times(0)).salvaProgramma(programma1);
		
		//test KO per stato ente diverso da "NON ATTIVO"
		enteOptional = Optional.of(ente1);
		programma1.setStatoGestoreProgramma(StatoEnum.ATTIVO.getValue());
		when(enteRepository.findById(ente1.getId())).thenReturn(enteOptional);
		when(programmaService.getProgrammaById(programma1.getId())).thenReturn(programma1);
		Assertions.assertThrows(EnteException.class, () -> enteService.cancellaGestoreProgramma(ente1.getId(), programma1.getId()));
		assertThatExceptionOfType(EnteException.class);
		verify(programmaService, times(0)).salvaProgramma(programma1);
	}
	
	@Test
	public void cancellaGestoreProgettoTest() {
		progetto1.setStatoGestoreProgetto(StatoEnum.NON_ATTIVO.getValue());
		when(enteRepository.findById(ente1.getId())).thenReturn(enteOptional);
		when(progettoService.getProgettoById(progetto1.getId())).thenReturn(progetto1);
		when(referentiDelegatiEnteGestoreProgettoService.getReferentiAndDelegatiPerProgetto(progetto1.getId())).thenReturn(listaReferentiDelegatiEnteGestoreProgetto);
		when(referentiDelegatiEnteGestoreProgettoService.countAssociazioniReferenteDelegato(referentiDelegatiEnteGestoreProgettoEntity.getId().getCodFiscaleUtente(), referentiDelegatiEnteGestoreProgettoEntity.getCodiceRuolo())).thenReturn(0);
		when(utenteXRuoloService.getUtenteXRuoloByCfUtenteAndCodiceRuolo(referentiDelegatiEnteGestoreProgettoEntity.getId().getCodFiscaleUtente(), referentiDelegatiEnteGestoreProgettoEntity.getCodiceRuolo())).thenReturn(utenteRuolo1);
		when(enteSedeProgettoFacilitatoreService.getFacilitatoriByIdEnteAndIdProgetto(ente1.getId(), progetto1.getId())).thenReturn(listaEnteSedeProgettoFacilitatore);
		when(enteSedeProgettoFacilitatoreService.countAssociazioniFacilitatoreAndVolontario(enteSedeProgettoFacilitatoreEntity.getId().getIdFacilitatore(), enteSedeProgettoFacilitatoreEntity.getRuoloUtente())).thenReturn(0);
		when(utenteXRuoloService.getUtenteXRuoloByCfUtenteAndCodiceRuolo(enteSedeProgettoFacilitatoreEntity.getId().getIdFacilitatore(), enteSedeProgettoFacilitatoreEntity.getRuoloUtente())).thenReturn(utenteRuolo2);
		enteService.cancellaGestoreProgetto(ente1.getId(), progetto1.getId());
		verify(progettoService, times(1)).salvaProgetto(progetto1);
	}
	
	@Test
	public void cancellaGestoreProgettoTest2() {
		progetto1.setStatoGestoreProgetto(StatoEnum.NON_ATTIVO.getValue());
		when(enteRepository.findById(ente1.getId())).thenReturn(enteOptional);
		when(progettoService.getProgettoById(progetto1.getId())).thenReturn(progetto1);
		when(referentiDelegatiEnteGestoreProgettoService.getReferentiAndDelegatiPerProgetto(progetto1.getId())).thenReturn(listaReferentiDelegatiEnteGestoreProgetto);
		when(referentiDelegatiEnteGestoreProgettoService.countAssociazioniReferenteDelegato(referentiDelegatiEnteGestoreProgettoEntity.getId().getCodFiscaleUtente(), referentiDelegatiEnteGestoreProgettoEntity.getCodiceRuolo())).thenReturn(1);
		when(enteSedeProgettoFacilitatoreService.getFacilitatoriByIdEnteAndIdProgetto(ente1.getId(), progetto1.getId())).thenReturn(listaEnteSedeProgettoFacilitatore);
		when(enteSedeProgettoFacilitatoreService.countAssociazioniFacilitatoreAndVolontario(enteSedeProgettoFacilitatoreEntity.getId().getIdFacilitatore(), enteSedeProgettoFacilitatoreEntity.getRuoloUtente())).thenReturn(1);
		enteService.cancellaGestoreProgetto(ente1.getId(), progetto1.getId());
		verify(progettoService, times(1)).salvaProgetto(progetto1);
	}
	
	@Test
	public void cancellaGestoreProgettoKOTest() {
		//test KO per ente non esistente
		enteOptional = Optional.empty();
		when(enteRepository.findById(ente1.getId())).thenReturn(enteOptional);
		Assertions.assertThrows(EnteException.class, () -> enteService.cancellaGestoreProgetto(ente1.getId(), progetto1.getId()));
		assertThatExceptionOfType(EnteException.class);
		verify(progettoService, times(0)).salvaProgetto(progetto1);
		
		//test KO per stato ente diverso da "NON ATTIVO"
		enteOptional = Optional.of(ente1);
		progetto1.setStatoGestoreProgetto(StatoEnum.ATTIVO.getValue());
		when(enteRepository.findById(ente1.getId())).thenReturn(enteOptional);
		when(progettoService.getProgettoById(progetto1.getId())).thenReturn(progetto1);
		Assertions.assertThrows(EnteException.class, () -> enteService.cancellaGestoreProgetto(ente1.getId(), progetto1.getId()));
		assertThatExceptionOfType(EnteException.class);
		verify(progettoService, times(0)).salvaProgetto(progetto1);
	}
	
	@Test
	public void cancellaEntePartnerPerProgettoTest() {
		entePartner1.setStatoEntePartner(StatoEnum.NON_ATTIVO.getValue());
		when(enteRepository.findById(ente1.getId())).thenReturn(enteOptional);
		when(entePartnerService.getEntePartnerByIdEnteAndIdProgetto(ente1.getId(), progetto1.getId())).thenReturn(entePartner1);
		when(referentiDelegatiEntePartnerDiProgettoService.getReferentiDelegatiEntePartner(ente1.getId(), progetto1.getId())).thenReturn(listaReferentiDelegatiEntePartnerDiProgetto);
		when(referentiDelegatiEntePartnerDiProgettoService.countAssociazioniReferenteDelegati(referentiDelegatiEntePartnerDiProgettoEntity.getId().getCodFiscaleUtente(), referentiDelegatiEntePartnerDiProgettoEntity.getCodiceRuolo())).thenReturn(0);
		when(utenteXRuoloService.getUtenteXRuoloByCfUtenteAndCodiceRuolo(referentiDelegatiEntePartnerDiProgettoEntity.getId().getCodFiscaleUtente(), referentiDelegatiEntePartnerDiProgettoEntity.getCodiceRuolo())).thenReturn(utenteRuolo1);
		when(enteSedeProgettoFacilitatoreService.getFacilitatoriByIdEnteAndIdProgetto(ente1.getId(), progetto1.getId())).thenReturn(listaEnteSedeProgettoFacilitatore);
		when(enteSedeProgettoFacilitatoreService.countAssociazioniFacilitatoreAndVolontario(enteSedeProgettoFacilitatoreEntity.getId().getIdFacilitatore(), enteSedeProgettoFacilitatoreEntity.getRuoloUtente())).thenReturn(0);
		when(utenteXRuoloService.getUtenteXRuoloByCfUtenteAndCodiceRuolo(enteSedeProgettoFacilitatoreEntity.getId().getIdFacilitatore(), enteSedeProgettoFacilitatoreEntity.getRuoloUtente())).thenReturn(utenteRuolo2);
		enteService.cancellaEntePartnerPerProgetto(ente1.getId(), progetto1.getId());
		verify(entePartnerService, times(1)).cancellaAssociazioneEntePartnerPerProgetto(entePartner1);
	}
	
	@Test
	public void cancellaEntePartnerPerProgettoTest2() {
		entePartner1.setStatoEntePartner(StatoEnum.NON_ATTIVO.getValue());
		when(enteRepository.findById(ente1.getId())).thenReturn(enteOptional);
		when(entePartnerService.getEntePartnerByIdEnteAndIdProgetto(ente1.getId(), progetto1.getId())).thenReturn(entePartner1);
		when(referentiDelegatiEntePartnerDiProgettoService.getReferentiDelegatiEntePartner(ente1.getId(), progetto1.getId())).thenReturn(listaReferentiDelegatiEntePartnerDiProgetto);
		when(referentiDelegatiEntePartnerDiProgettoService.countAssociazioniReferenteDelegati(referentiDelegatiEntePartnerDiProgettoEntity.getId().getCodFiscaleUtente(), referentiDelegatiEntePartnerDiProgettoEntity.getCodiceRuolo())).thenReturn(1);
		when(enteSedeProgettoFacilitatoreService.getFacilitatoriByIdEnteAndIdProgetto(ente1.getId(), progetto1.getId())).thenReturn(listaEnteSedeProgettoFacilitatore);
		when(enteSedeProgettoFacilitatoreService.countAssociazioniFacilitatoreAndVolontario(enteSedeProgettoFacilitatoreEntity.getId().getIdFacilitatore(), enteSedeProgettoFacilitatoreEntity.getRuoloUtente())).thenReturn(1);
		enteService.cancellaEntePartnerPerProgetto(ente1.getId(), progetto1.getId());
		verify(entePartnerService, times(1)).cancellaAssociazioneEntePartnerPerProgetto(entePartner1);
	}
	
	@Test
	public void cancellaEntePartnerPerProgettoKOTest() {
				//test KO per ente non esistente
				enteOptional = Optional.empty();
				when(enteRepository.findById(ente1.getId())).thenReturn(enteOptional);
				Assertions.assertThrows(EnteException.class, () -> enteService.cancellaEntePartnerPerProgetto(ente1.getId(), progetto1.getId()));
				assertThatExceptionOfType(EnteException.class);
				verify(entePartnerService, times(0)).cancellaAssociazioneEntePartnerPerProgetto(entePartner1);
				
				//test KO per ente non partner
				enteOptional = Optional.of(ente1);
				when(enteRepository.findById(ente1.getId())).thenReturn(enteOptional);
				when(entePartnerService.getEntePartnerByIdEnteAndIdProgetto(ente1.getId(), progetto1.getId())).thenReturn(null);
				Assertions.assertThrows(EnteException.class, () -> enteService.cancellaEntePartnerPerProgetto(ente1.getId(), progetto1.getId()));
				assertThatExceptionOfType(EnteException.class);
				verify(entePartnerService, times(0)).cancellaAssociazioneEntePartnerPerProgetto(entePartner1);
				
				//test KO per stato ente diverso da "NON ATTIVO"
				entePartner1.setStatoEntePartner(StatoEnum.ATTIVO.getValue());
				when(enteRepository.findById(ente1.getId())).thenReturn(enteOptional);
				when(entePartnerService.getEntePartnerByIdEnteAndIdProgetto(ente1.getId(), progetto1.getId())).thenReturn(entePartner1);
				Assertions.assertThrows(EnteException.class, () -> enteService.cancellaEntePartnerPerProgetto(ente1.getId(), progetto1.getId()));
				assertThatExceptionOfType(EnteException.class);
				verify(entePartnerService, times(0)).cancellaAssociazioneEntePartnerPerProgetto(entePartner1);
	}
	
	@Test
	public void terminaGestoreProgrammaTest() {
		programma1.setStatoGestoreProgramma(StatoEnum.ATTIVO.getValue());
		referentiDelegatiEnteGestoreProgrammaEntity.setStatoUtente(StatoEnum.ATTIVO.getValue());
		referentiDelegatiEnteGestoreProgrammaEntity2.setStatoUtente(StatoEnum.NON_ATTIVO.getValue());
		when(enteRepository.findById(ente1.getId())).thenReturn(enteOptional);
		when(programmaService.getProgrammaById(programma1.getId())).thenReturn(programma1);
		when(referentiDelegatiEnteGestoreProgrammaService.getReferentiAndDelegatiByIdProgrammaAndIdEnte(programma1.getId(), ente1.getId())).thenReturn(listaReferentiDelegatiEnteGestoreProgramma);
		enteService.terminaGestoreProgramma(ente1.getId(), programma1.getId());
		verify(programmaService, times(1)).salvaProgramma(programma1);
	}
	
	@Test
	public void terminaGestoreProgrammaKOTest() {
		//test KO per ente non esistente
				enteOptional = Optional.empty();
				programma1.setStatoGestoreProgramma(StatoEnum.ATTIVO.getValue());
				when(enteRepository.findById(ente1.getId())).thenReturn(enteOptional);
				Assertions.assertThrows(EnteException.class, () -> enteService.terminaGestoreProgramma(ente1.getId(), programma1.getId()));
				assertThatExceptionOfType(EnteException.class);
				verify(programmaService, times(0)).salvaProgramma(programma1);
				
				//test KO per stato ente diverso da "ATTIVO"
				enteOptional = Optional.of(ente1);
				programma1.setStatoGestoreProgramma(StatoEnum.NON_ATTIVO.getValue());
				when(enteRepository.findById(ente1.getId())).thenReturn(enteOptional);
				when(programmaService.getProgrammaById(programma1.getId())).thenReturn(programma1);
				Assertions.assertThrows(EnteException.class, () -> enteService.terminaGestoreProgramma(ente1.getId(), programma1.getId()));
				assertThatExceptionOfType(EnteException.class);
				verify(programmaService, times(0)).salvaProgramma(programma1);
	}
	
	@Test
	public void terminaGestoreProgettoTest() {
		progetto1.setStatoGestoreProgetto(StatoEnum.ATTIVO.getValue());
		referentiDelegatiEnteGestoreProgettoEntity.setStatoUtente(StatoEnum.ATTIVO.getValue());
		referentiDelegatiEnteGestoreProgettoEntity2.setStatoUtente(StatoEnum.NON_ATTIVO.getValue());
		enteSedeProgetto.setStatoSede(StatoEnum.ATTIVO.getValue());
		enteSedeProgetto2.setStatoSede(StatoEnum.NON_ATTIVO.getValue());
		when(enteRepository.findById(ente1.getId())).thenReturn(enteOptional);
		when(progettoService.getProgettoById(progetto1.getId())).thenReturn(progetto1);
		when(referentiDelegatiEnteGestoreProgettoService.getReferentiAndDelegatiByIdProgettoAndIdEnte(progetto1.getId(), ente1.getId())).thenReturn(listaReferentiDelegatiEnteGestoreProgetto);
		when(enteSedeProgettoService.getSediPerProgettoAndEnte(ente1.getId(), progetto1.getId())).thenReturn(listaEnteSedeProgetto);
		enteService.terminaGestoreProgetto(ente1.getId(), progetto1.getId());
		verify(progettoService, times(1)).salvaProgetto(progetto1);
	}
	
	@Test
	public void TerminaGestoreProgettoKOTest() {
		//test KO per ente non esistente
		enteOptional = Optional.empty();
		when(enteRepository.findById(ente1.getId())).thenReturn(enteOptional);
		Assertions.assertThrows(EnteException.class, () -> enteService.terminaGestoreProgetto(ente1.getId(), progetto1.getId()));
		assertThatExceptionOfType(EnteException.class);
		verify(progettoService, times(0)).salvaProgetto(progetto1);
		
		//test KO per stato ente diverso da "ATTIVO"
		enteOptional = Optional.of(ente1);
		progetto1.setStatoGestoreProgetto(StatoEnum.NON_ATTIVO.getValue());
		when(enteRepository.findById(ente1.getId())).thenReturn(enteOptional);
		when(progettoService.getProgettoById(progetto1.getId())).thenReturn(progetto1);
		Assertions.assertThrows(EnteException.class, () -> enteService.terminaGestoreProgetto(ente1.getId(), progetto1.getId()));
		assertThatExceptionOfType(EnteException.class);
		verify(progettoService, times(0)).salvaProgetto(progetto1);
	}
}