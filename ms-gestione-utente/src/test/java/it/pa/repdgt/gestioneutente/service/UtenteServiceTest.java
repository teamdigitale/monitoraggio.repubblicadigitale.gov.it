package it.pa.repdgt.gestioneutente.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatExceptionOfType;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.assertj.core.util.Sets;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;

import it.pa.repdgt.gestioneutente.dto.UtenteDto;
import it.pa.repdgt.gestioneutente.exception.ResourceNotFoundException;
import it.pa.repdgt.gestioneutente.exception.UtenteException;
import it.pa.repdgt.gestioneutente.repository.ReferentiDelegatiEnteGestoreProgettoRepository;
import it.pa.repdgt.gestioneutente.repository.ReferentiDelegatiEnteGestoreProgrammaRepository;
import it.pa.repdgt.gestioneutente.repository.ReferentiDelegatiEntePartnerDiProgettoRepository;
import it.pa.repdgt.gestioneutente.repository.UtenteRepository;
import it.pa.repdgt.gestioneutente.request.AggiornaUtenteRequest;
import it.pa.repdgt.gestioneutente.request.FiltroRequest;
import it.pa.repdgt.gestioneutente.request.UtenteRequest;
import it.pa.repdgt.shared.awsintegration.service.EmailService;
import it.pa.repdgt.shared.entity.RuoloEntity;
import it.pa.repdgt.shared.entity.UtenteEntity;
import it.pa.repdgt.shared.entityenum.RuoloUtenteEnum;
import it.pa.repdgt.shared.entityenum.StatoEnum;

@ExtendWith(MockitoExtension.class)
public class UtenteServiceTest {

	@Mock
	private UtenteXRuoloService utenteXRuoloService;
	@Mock
	private  EnteSedeProgettoFacilitatoreService enteSedeProgettoFacilitatoreService;
	@Mock
	private RuoloService ruoloService;
	@Mock
	private ProgrammaService programmaService;
	@Mock
	private ProgettoService progettoService;
	@Mock
	private EntePartnerService entePartnerService;
	@Mock
	private UtenteRepository utenteRepository;
	@Mock 
	private EmailService emailService;
	@Mock
	private ReferentiDelegatiEnteGestoreProgrammaRepository referentiDelegatiEnteGestoreProgrammaRepository;
	@Mock
	private ReferentiDelegatiEnteGestoreProgettoRepository referentiDelegatiEnteGestoreProgettoRepository;
	@Mock
	private ReferentiDelegatiEntePartnerDiProgettoRepository referentiDelegatiEntePartnerDiProgettoRepository;

	@Autowired
	@InjectMocks
	private UtenteService service;
	
	UtenteEntity utente;
	UtenteEntity utente2;
	List<UtenteEntity> utentiList;
	Set<UtenteEntity> utentiSet;
	UtenteRequest sceltaContesto;
	FiltroRequest filtroRicerca;
	RuoloEntity ruolo1;
	List<RuoloEntity> ruoli;
	Integer currPage;
	Integer pageSize;
	RuoloEntity ruolo;
	AggiornaUtenteRequest aggiornaUtenteRequest;
	List<String> listaCodiciRuoli;
	Set<String> setStati;
	
	@BeforeEach
	public void setUp() {
		utente = new UtenteEntity();
		utente.setAbilitazioneConsensoTrammentoDati(true);
		utente.setCodiceFiscale("CODICE_FISCALE");
		utente.setNome("NOME_UTENTE");
		utente.setCognome("COGNOME_UTENTE");
		utente.setDataOraAbilitazioneConsensoDati(new Date());
		utente.setDataOraAggiornamento(new Date());
		utente.setDataOraCreazione(new Date());
		utente.setEmail("EMAIL_UTENTE@mail.com");
		utente.setId(2L);
		utente.setEmail("prova@test.it");
		utente.setIntegrazione(true);
		utente.setMansione("mansione");
		utente2 = new UtenteEntity();
		utente2.setAbilitazioneConsensoTrammentoDati(true);
		utente2.setCodiceFiscale("CODICE_FISCALE_2");
		utente2.setNome("NOME_utente2");
		utente2.setCognome("COGNOME_utente2");
		utente2.setDataOraAbilitazioneConsensoDati(new Date());
		utente2.setDataOraAggiornamento(new Date());
		utente2.setDataOraCreazione(new Date());
		utente2.setEmail("EMAIL_utente2@mail.com");
		utente2.setId(1L);
		utente2.setIntegrazione(true);
		utente2.setMansione("mansione");
		ruoli = new ArrayList<RuoloEntity>();
		ruolo1 = new RuoloEntity();
		ruolo1.setCodice(RuoloUtenteEnum.DTD.toString());
		ruoli.add(ruolo1);
		utente.setRuoli(ruoli);
		utente.setStato(StatoEnum.ATTIVO.getValue());
		utente.setTelefono("534636575");
		utente.setTipoContratto("TIPO_CONTRATTO");
		
		utentiList = new ArrayList<>();
		utentiList.add(utente);
		
		utentiSet = new HashSet<UtenteEntity>();
		utentiSet.add(utente);
		utentiSet.add(utente2);
		
		sceltaContesto = new UtenteRequest();
		sceltaContesto.setCfUtente("CODICE_FISCALE");
		sceltaContesto.setCodiceRuolo(RuoloUtenteEnum.DTD.getValue());
		filtroRicerca = new FiltroRequest();
		filtroRicerca.setCriterioRicerca("provaRicerca");
		sceltaContesto.setFiltroRequest(filtroRicerca);
		
		currPage = Integer.valueOf(0);
		pageSize = Integer.valueOf(8);
		
		ruolo = new RuoloEntity();
		ruolo.setCodice("REG");
		ruolo.setPredefinito(false);
		
		aggiornaUtenteRequest = new AggiornaUtenteRequest();
		aggiornaUtenteRequest.setNome("NOME");
		aggiornaUtenteRequest.setCognome("COGNOME");
		aggiornaUtenteRequest.setEmail("prova@test.id");
		aggiornaUtenteRequest.setMansione("MANSIONE");
		aggiornaUtenteRequest.setTelefono("3349873200");
		aggiornaUtenteRequest.setTipoContratto("CONTRATTO");
		
		listaCodiciRuoli = new ArrayList<>();
		listaCodiciRuoli.add("DTD");
		
		setStati = new HashSet<>();
		setStati.add("ATTIVO");
	}
	
	@Test
	public void getAllUtentiTest() {
		when(this.utenteRepository.findAll()).thenReturn(utentiList);
		assertThat(service.getAllUtenti().size()).isEqualTo(1);
	}
	
	@Test
	public void getAllUtentiPaginatiTest() {
		List<String> listaRuoli = new ArrayList<String>();
		listaRuoli.add("DTD");
		when(this.ruoloService.getRuoliByCodiceFiscaleUtente("CODICE_FISCALE")).thenReturn(listaRuoli);
		when(this.utenteRepository.findUtentiByFiltri(
				filtroRicerca.getCriterioRicerca(),
				"%" + filtroRicerca.getCriterioRicerca() + "%",
				filtroRicerca.getRuoli(),
				filtroRicerca.getStati(),
				currPage*pageSize,
				pageSize
				
		)).thenReturn(utentiSet);
		List<UtenteDto> utentiAll = service.getAllUtentiPaginati(sceltaContesto, currPage, pageSize);
		assertThat(utentiAll.size()).isEqualTo(utentiSet.size());
	}
	
	@Test
	public void getAllUtentiPaginatiKOTest() {
		//test KO per ruolo non definito per l'utente
		when(this.ruoloService.getRuoliByCodiceFiscaleUtente("CODICE_FISCALE")).thenReturn(new ArrayList<>());
		Assertions.assertThrows(UtenteException.class, () -> service.getAllUtentiPaginati(sceltaContesto, currPage, pageSize));
		assertThatExceptionOfType(UtenteException.class);
	}
	
	@Test
	public void getUtentiConRuoliAggregatiTest() {
		RuoloEntity ruolo2 = new RuoloEntity();
		ruolo2.setCodice(RuoloUtenteEnum.REG.toString());
		ruoli.add(ruolo2);
		RuoloEntity ruolo3 = new RuoloEntity();
		ruolo3.setCodice(RuoloUtenteEnum.REGP.toString());
		ruoli.add(ruolo3);
		RuoloEntity ruolo4 = new RuoloEntity();
		ruolo4.setCodice(RuoloUtenteEnum.REPP.toString());
		ruoli.add(ruolo4);
		RuoloEntity ruolo5 = new RuoloEntity();
		ruolo5.setCodice(RuoloUtenteEnum.FAC.toString());
		ruoli.add(ruolo5);
		utente.setRuoli(ruoli);
		utentiList = new ArrayList<UtenteEntity>();
		utentiList.add(utente);
		when(referentiDelegatiEnteGestoreProgrammaRepository.countByCfUtenteAndCodiceRuolo(utente.getCodiceFiscale(), "REG")).thenReturn(1);
		assertThat(service.getUtentiConRuoliAggregati(utentiList).get(0).getCodiceFiscale()).isEqualTo("CODICE_FISCALE");
	}
	
	@Test
	public void getUtentiByRuoloTest() {
		RuoloEntity ruolo2 = new RuoloEntity();
		ruolo2.setCodice(RuoloUtenteEnum.REG.toString());
		ruoli.add(ruolo2);
		RuoloEntity ruolo3 = new RuoloEntity();
		ruolo3.setCodice(RuoloUtenteEnum.REGP.toString());
		ruoli.add(ruolo3);
		RuoloEntity ruolo4 = new RuoloEntity();
		ruolo4.setCodice(RuoloUtenteEnum.REPP.toString());
		ruoli.add(ruolo4);
		RuoloEntity ruolo5 = new RuoloEntity();
		ruolo5.setCodice(RuoloUtenteEnum.FAC.toString());
		ruoli.add(ruolo5);
		utente.setRuoli(ruoli);
		utentiList = new ArrayList<UtenteEntity>();
		utentiList.add(utente);
		when(referentiDelegatiEnteGestoreProgrammaRepository.countByCfUtenteAndCodiceRuolo(utente.getCodiceFiscale(), "REG")).thenReturn(1);
		assertThat(service.getUtentiConRuoliAggregati(utentiList).get(0).getCodiceFiscale()).isEqualTo("CODICE_FISCALE");
	}
	
	@Test
	public void getUtentiPaginatiByRuolo() {
		FiltroRequest filtroRequest = new FiltroRequest();
		filtroRequest.setCriterioRicerca("criterioRicerca");
		when(this.utenteRepository.findUtentiPerDSCU(
				filtroRequest.getCriterioRicerca(),
				"%" + filtroRequest.getCriterioRicerca() + "%",
				filtroRequest.getRuoli(),
				currPage*pageSize,
				pageSize
				)).thenReturn(new HashSet<UtenteEntity>());
		assertThat(service.getUtentiPaginatiByRuolo(RuoloUtenteEnum.DSCU.toString(), "CODICE_FISCALE", 1L, 1L, filtroRequest, currPage, pageSize)).isNotNull();
		when(this.utenteRepository.findUtentiPerReferenteDelegatoGestoreProgramma(
				   1L,
				   "CODICE_FISCALE",
				   filtroRequest.getCriterioRicerca(),
				   "%" + filtroRequest.getCriterioRicerca() + "%",
				   filtroRequest.getRuoli(),
				   currPage*pageSize,
				   pageSize)).thenReturn(new HashSet<UtenteEntity>());
		assertThat(service.getUtentiPaginatiByRuolo(RuoloUtenteEnum.REG.toString(), "CODICE_FISCALE", 1L, 1L, filtroRequest, currPage, pageSize)).isNotNull();
		when(this.utenteRepository.findUtentiPerReferenteDelegatoGestoreProgetti(
				  1L,
				  1L,
				  "CODICE_FISCALE", 
				  filtroRequest.getCriterioRicerca(),
				   "%" + filtroRequest.getCriterioRicerca() + "%",
				  filtroRequest.getRuoli(),
				  currPage*pageSize,
				   pageSize)).thenReturn(new HashSet<UtenteEntity>());
		assertThat(service.getUtentiPaginatiByRuolo(RuoloUtenteEnum.DEGP.toString(), "CODICE_FISCALE", 1L, 1L, filtroRequest, currPage, pageSize)).isNotNull();
		when(this.utenteRepository.findUtentiPerReferenteDelegatoEntePartnerProgetti(
				  1L,
				  1L,
				  "CODICE_FISCALE",
				  filtroRequest.getCriterioRicerca(),
				   "%" + filtroRequest.getCriterioRicerca() + "%",
				  filtroRequest.getRuoli(),
				  currPage*pageSize,
				  pageSize)).thenReturn(new HashSet<UtenteEntity>());
		assertThat(service.getUtentiPaginatiByRuolo(RuoloUtenteEnum.DEPP.toString(), "CODICE_FISCALE", 1L, 1L, filtroRequest, currPage, pageSize)).isNotNull();
		when(this.utenteRepository.findUtentiByFiltri(
				filtroRicerca.getCriterioRicerca(),
				"%" + filtroRicerca.getCriterioRicerca() + "%",
				filtroRicerca.getRuoli(),
				filtroRicerca.getStati(),
				currPage*pageSize,
				pageSize
				
		)).thenReturn(new HashSet<UtenteEntity>());
		assertThat(service.getUtentiPaginatiByRuolo("RUOLO_CUSTOM", "CODICE_FISCALE", 1L, 1L, filtroRicerca, currPage, pageSize)).isNotNull();
	}
	
	@Test
	public void getUtenteByCodiceFiscaleTest() {
		when(this.utenteRepository.findByCodiceFiscale(utente.getCodiceFiscale())).thenReturn(Optional.of(utente));
		UtenteEntity risultato = service.getUtenteByCodiceFiscale(utente.getCodiceFiscale());
		assertThat(risultato.getId()).isEqualTo(utente.getId());
	}
	
	@Test
	public void getUtenteByCodiceFiscaleKOTest() {
		//test KO per utente non trovato
		when(this.utenteRepository.findByCodiceFiscale(utente.getCodiceFiscale())).thenReturn(Optional.empty());
		Assertions.assertThrows(ResourceNotFoundException.class, () -> service.getUtenteByCodiceFiscale(utente.getCodiceFiscale()));
		assertThatExceptionOfType(ResourceNotFoundException.class);
	}
	
	@Test
	public void getUtenteByIdTest() {
		when(this.utenteRepository.findById(utente.getId())).thenReturn(Optional.of(utente));
		UtenteEntity risultato = service.getUtenteById(utente.getId());
		assertThat(risultato.getId()).isEqualTo(utente.getId());
	}
	
	@Test
	public void getUtenteByIdKOTest() {
		//test KO per utente non trovato
		when(this.utenteRepository.findById(utente.getId())).thenReturn(Optional.empty());
		Assertions.assertThrows(ResourceNotFoundException.class, () -> service.getUtenteById(utente.getId()));
		assertThatExceptionOfType(ResourceNotFoundException.class);
	}
	
	@Test
	public void getUtenteEagerByCodiceFiscaleTest() {
		when(this.utenteRepository.findUtenteEagerByCodiceFiscale(utente.getCodiceFiscale())).thenReturn(utente);
		UtenteEntity risultato = service.getUtenteEagerByCodiceFiscale(utente.getCodiceFiscale());
		assertThat(risultato.getId()).isEqualTo(utente.getId());
	}
	
	@Test
	public void creaNuovoUtenteTest() {
		when(this.utenteRepository.findByCodiceFiscale(utente.getCodiceFiscale())).thenReturn(Optional.empty());
		when(this.ruoloService.getRuoloByCodiceRuolo("REG")).thenReturn(ruolo);
		when(this.utenteRepository.save(utente)).thenReturn(utente);
		service.creaNuovoUtente(utente, "REG");
	}
	
	@Test
	public void creaNuovoUtenteKOTest() {
		//test KO per utente già presente
		when(this.utenteRepository.findByCodiceFiscale(utente.getCodiceFiscale())).thenReturn(Optional.of(utente));
		Assertions.assertThrows(UtenteException.class, () -> service.creaNuovoUtente(utente, "REG"));
		assertThatExceptionOfType(UtenteException.class);
	}
	
	@Test
	public void aggiornaUtenteTest() {
		when(this.utenteRepository.findById(utente.getId())).thenReturn(Optional.of(utente));
		service.aggiornaUtente(aggiornaUtenteRequest, utente.getId());
	}
	
	@Test
	public void aggiornaUtenteKOTest() {
		//test KO per utente non trovato
		when(this.utenteRepository.findById(utente.getId())).thenReturn(Optional.empty());
		Assertions.assertThrows(UtenteException.class, () -> service.aggiornaUtente(aggiornaUtenteRequest, utente.getId()));
		assertThatExceptionOfType(UtenteException.class);
	}
	
	@Test
	public void salvaUtenteTest() {
		when(this.utenteRepository.save(utente)).thenReturn(utente);
		UtenteEntity risultato = service.salvaUtente(utente);
		assertThat(risultato.getId()).isEqualTo(utente.getId());
	}
	
	@Test
	public void cancellaUtenteTest() {
		when(this.utenteRepository.findById(utente.getId())).thenReturn(Optional.of(utente));
		when(this.utenteXRuoloService.countRuoliByCfUtente(utente.getCodiceFiscale())).thenReturn(0);
		doNothing().when(this.utenteRepository).delete(utente);
		service.cancellaUtente(utente.getId());
	}
	
	@Test
	public void cancellaUtenteKOTest() {
		//test KO per utente non trovato
		when(this.utenteRepository.findById(utente.getId())).thenReturn(Optional.empty());
		Assertions.assertThrows(UtenteException.class, () -> service.cancellaUtente(utente.getId()));
		assertThatExceptionOfType(UtenteException.class);
		
		//test KO per utente con ruoli ancora associati
		when(this.utenteRepository.findById(utente.getId())).thenReturn(Optional.of(utente));
		when(this.utenteXRuoloService.countRuoliByCfUtente(utente.getCodiceFiscale())).thenReturn(1);
		Assertions.assertThrows(UtenteException.class, () -> service.cancellaUtente(utente.getId()));
		assertThatExceptionOfType(UtenteException.class);
	}
	
	@Test
	public void getStatoUtentiByFiltriTest() {
		when(this.utenteRepository.findStatiByFilter(
				filtroRicerca.getCriterioRicerca(),
				"%" + filtroRicerca.getCriterioRicerca() + "%",
				filtroRicerca.getRuoli(),
				filtroRicerca.getStati()
		)).thenReturn(new HashSet<String>());
		service.getStatoUtentiByFiltri(filtroRicerca);
	}
	
	@Test
	public void assegnaRuoloAUtenteTest() {
		when(this.ruoloService.getRuoloByCodiceRuolo(ruolo.getCodice())).thenReturn(ruolo);
		when(this.utenteRepository.findById(utente.getId())).thenReturn(Optional.of(utente));
		service.assegnaRuoloAUtente(utente.getId(), ruolo.getCodice());
	}
	
	@Test
	public void assegnaRuoloAUtenteTest2() {
		RuoloEntity ruoloDSCU = new RuoloEntity();
		ruoloDSCU.setCodice("DSCU");
		when(this.ruoloService.getRuoloByCodiceRuolo("DSCU")).thenReturn(ruoloDSCU);
		when(this.utenteRepository.findById(utente.getId())).thenReturn(Optional.of(utente));
		service.assegnaRuoloAUtente(utente.getId(), "DSCU");
	}
	
	@Test
	public void assegnaRuoloAUtenteKOTest() {
		//test KO per ruolo inesistente
		when(this.ruoloService.getRuoloByCodiceRuolo(ruolo.getCodice())).thenThrow(ResourceNotFoundException.class);
		Assertions.assertThrows(UtenteException.class, () -> service.assegnaRuoloAUtente(utente.getId(), ruolo.getCodice()));
		assertThatExceptionOfType(UtenteException.class);
	}
	
	@Test
	public void assegnaRuoloAUtenteKOTest2() {
		//test KO per utente inesistente
		when(this.ruoloService.getRuoloByCodiceRuolo(ruolo.getCodice())).thenReturn(ruolo);
		when(this.utenteRepository.findById(utente.getId())).thenReturn(Optional.empty());
		Assertions.assertThrows(UtenteException.class, () -> service.assegnaRuoloAUtente(utente.getId(), ruolo.getCodice()));
		assertThatExceptionOfType(UtenteException.class);
	}
	
	@Test
	public void assegnaRuoloAUtenteKOTest3() {
		//test KO per ruolo già associato ad utente
		when(this.ruoloService.getRuoloByCodiceRuolo(ruolo1.getCodice())).thenReturn(ruolo1);
		when(this.utenteRepository.findById(utente.getId())).thenReturn(Optional.of(utente));
		Assertions.assertThrows(UtenteException.class, () -> service.assegnaRuoloAUtente(utente.getId(), ruolo1.getCodice()));
		assertThatExceptionOfType(UtenteException.class);
	}
	
	@Test
	public void assegnaRuoloAUtenteKOTest4() {
		//test KO per l'impossibilità di assegnare un ruolo predefinito
		ruolo.setCodice("REG");
		ruolo.setPredefinito(true);
		when(this.ruoloService.getRuoloByCodiceRuolo(ruolo.getCodice())).thenReturn(ruolo);
		when(this.utenteRepository.findById(utente.getId())).thenReturn(Optional.of(utente));
		Assertions.assertThrows(UtenteException.class, () -> service.assegnaRuoloAUtente(utente.getId(), ruolo.getCodice()));
		assertThatExceptionOfType(UtenteException.class);
	}
	
	@Test
	public void getAllStatiDropdownTest() {
		when(this.ruoloService.getRuoliByCodiceFiscaleUtente(sceltaContesto.getCfUtente())).thenReturn(listaCodiciRuoli);
		when(this.utenteRepository.findStatiByFilter(
				filtroRicerca.getCriterioRicerca(),
				"%" + filtroRicerca.getCriterioRicerca() + "%",
				filtroRicerca.getRuoli(),
				filtroRicerca.getStati()
		)).thenReturn(new HashSet<String>());
		service.getAllStatiDropdown(sceltaContesto);
	}
	
	@Test
	public void getAllStatiDropdownKOTest() {
		//test KO per ruolo non definito per l'utente
		when(this.ruoloService.getRuoliByCodiceFiscaleUtente(sceltaContesto.getCfUtente())).thenReturn(new ArrayList<>());
		Assertions.assertThrows(UtenteException.class, () -> service.getAllStatiDropdown(sceltaContesto));
		assertThatExceptionOfType(UtenteException.class);
	}
	
	@Test
	public void getAllStatiByRuoloAndcfUtenteDTDTest() {
		//test con ruoloUtenteLoggato = DTD
		when(this.utenteRepository.findStatiByFilter(
				filtroRicerca.getCriterioRicerca(),
				"%" + filtroRicerca.getCriterioRicerca() + "%",
				filtroRicerca.getRuoli(),
				filtroRicerca.getStati()
		)).thenReturn(setStati);
		List<String> risultato = service.getAllStatiByRuoloAndcfUtente(sceltaContesto.getCodiceRuolo(), sceltaContesto.getCfUtente(), sceltaContesto.getIdProgramma(), sceltaContesto.getIdProgetto(), filtroRicerca);
		assertThat(risultato.size()).isEqualTo(setStati.size());
	}
	
	@Test
	public void getAllStatiByRuoloAndcfUtenteTestConRuoliPrefediniti() {
		//test con ruoloUtenteLoggato = DSCU/REG/DEG/REGP/DEGP/REPP/DEPP
		sceltaContesto.setCodiceRuolo("DSCU");
		List<String> risultato = service.getAllStatiByRuoloAndcfUtente(sceltaContesto.getCodiceRuolo(), sceltaContesto.getCfUtente(), sceltaContesto.getIdProgramma(), sceltaContesto.getIdProgetto(), filtroRicerca);
		assertThat(risultato.size()).isEqualTo(1);
	}
	
	@Test
	public void getAllStatiByRuoloAndcfUtenteTestConRuoliNonPrefediniti() {
		//test con ruoloUtenteLoggato = ruolo non predefinito
		sceltaContesto.setCodiceRuolo("RUOLONONPREDEFINITO");
		when(this.utenteRepository.findStatiByFilter(
				filtroRicerca.getCriterioRicerca(),
				"%" + filtroRicerca.getCriterioRicerca() + "%",
				filtroRicerca.getRuoli(),
				filtroRicerca.getStati()
		)).thenReturn(setStati);
		List<String> risultato = service.getAllStatiByRuoloAndcfUtente(sceltaContesto.getCodiceRuolo(), sceltaContesto.getCfUtente(), sceltaContesto.getIdProgramma(), sceltaContesto.getIdProgetto(), filtroRicerca);
		assertThat(risultato.size()).isEqualTo(setStati.size());
	}
	
	@Test
	public void getAllRuoliDropdownTest() {
		when(this.ruoloService.getRuoliByCodiceFiscaleUtente(sceltaContesto.getCfUtente())).thenReturn(listaCodiciRuoli);
		when(this.utenteRepository.findAllRuoli(
				filtroRicerca.getCriterioRicerca(),
				"%" + filtroRicerca.getCriterioRicerca() + "%",
				filtroRicerca.getRuoli(),
				filtroRicerca.getStati()
				)).thenReturn(listaCodiciRuoli);
		List<String> risultato = service.getAllRuoliDropdown(sceltaContesto);
		assertThat(risultato.size()).isEqualTo(listaCodiciRuoli.size());
	}
	
	@Test
	public void getAllRuoliDropdownKOTest() {
		//test KO per ruolo non definito per l'utente
		when(this.ruoloService.getRuoliByCodiceFiscaleUtente(sceltaContesto.getCfUtente())).thenReturn(new ArrayList<>());
		Assertions.assertThrows(UtenteException.class, () -> service.getAllRuoliDropdown(sceltaContesto));
		assertThatExceptionOfType(UtenteException.class);
	}
	
	@Test
	public void getAllRuoliByRuoloAndcfUtenteDTDTest() {
		//test con ruoloUtenteLoggato = DTD
		when(this.utenteRepository.findAllRuoli(
				filtroRicerca.getCriterioRicerca(),
				"%" + filtroRicerca.getCriterioRicerca() + "%",
				filtroRicerca.getRuoli(),
				filtroRicerca.getStati()
				)).thenReturn(listaCodiciRuoli);
		List<String> risultato = service.getAllRuoliByRuoloAndcfUtente(sceltaContesto.getCodiceRuolo(), sceltaContesto.getCfUtente(), sceltaContesto.getIdProgramma(), sceltaContesto.getIdProgetto(), filtroRicerca);
		assertThat(risultato.size()).isEqualTo(listaCodiciRuoli.size());
	}
	
	@Test
	public void getAllRuoliByRuoloAndcfUtenteDSCUTest() {
		//test con ruoloUtenteLoggato = DSCU
		sceltaContesto.setCodiceRuolo("DSCU");
		when(this.utenteRepository.findRuoliPerDSCU(
				filtroRicerca.getCriterioRicerca(),
				"%" + filtroRicerca.getCriterioRicerca() + "%",
				filtroRicerca.getRuoli()
				)).thenReturn(listaCodiciRuoli);
		List<String> risultato = service.getAllRuoliByRuoloAndcfUtente(sceltaContesto.getCodiceRuolo(), sceltaContesto.getCfUtente(), sceltaContesto.getIdProgramma(), sceltaContesto.getIdProgetto(), filtroRicerca);
		assertThat(risultato.size()).isEqualTo(listaCodiciRuoli.size());
	}
	
	@Test
	public void getAllRuoliByRuoloAndcfUtenteREGTest() {
		//test con ruoloUtenteLoggato = REG/DEG
		sceltaContesto.setCodiceRuolo("REG");
		when(this.utenteRepository.findRuoliPerReferenteDelegatoGestoreProgramma(
				sceltaContesto.getIdProgramma(),
				sceltaContesto.getCfUtente(),
				filtroRicerca.getCriterioRicerca(),
				"%" + filtroRicerca.getCriterioRicerca() + "%",
				filtroRicerca.getRuoli()
				)).thenReturn(listaCodiciRuoli);
		List<String> risultato = service.getAllRuoliByRuoloAndcfUtente(sceltaContesto.getCodiceRuolo(), sceltaContesto.getCfUtente(), sceltaContesto.getIdProgramma(), sceltaContesto.getIdProgetto(), filtroRicerca);
		assertThat(risultato.size()).isEqualTo(listaCodiciRuoli.size());
	}
	
	@Test
	public void getAllRuoliByRuoloAndcfUtenteREGPTest() {
		//test con ruoloUtenteLoggato = REGP/DEGP
		sceltaContesto.setCodiceRuolo("REGP");
		when(this.utenteRepository.findRuoliPerReferenteDelegatoGestoreProgetti(
				sceltaContesto.getIdProgramma(),
				sceltaContesto.getIdProgetto(),
				sceltaContesto.getCfUtente(),
				filtroRicerca.getCriterioRicerca(),
				"%" + filtroRicerca.getCriterioRicerca() + "%",
				filtroRicerca.getRuoli()
				)).thenReturn(listaCodiciRuoli);
		List<String> risultato = service.getAllRuoliByRuoloAndcfUtente(sceltaContesto.getCodiceRuolo(), sceltaContesto.getCfUtente(), sceltaContesto.getIdProgramma(), sceltaContesto.getIdProgetto(), filtroRicerca);
		assertThat(risultato.size()).isEqualTo(listaCodiciRuoli.size());
	}
	
	@Test
	public void getAllRuoliByRuoloAndcfUtenteREPPTest() {
		//test con ruoloUtenteLoggato = REPP/DEPP
		sceltaContesto.setCodiceRuolo("REPP");
		when(this.utenteRepository.findRuoliPerReferenteDelegatoEntePartnerProgetti(
				sceltaContesto.getIdProgramma(),
				sceltaContesto.getIdProgetto(),
				sceltaContesto.getCfUtente(),
				filtroRicerca.getCriterioRicerca(),
				"%" + filtroRicerca.getCriterioRicerca() + "%",
				filtroRicerca.getRuoli()
				)).thenReturn(listaCodiciRuoli);
		List<String> risultato = service.getAllRuoliByRuoloAndcfUtente(sceltaContesto.getCodiceRuolo(), sceltaContesto.getCfUtente(), sceltaContesto.getIdProgramma(), sceltaContesto.getIdProgetto(), filtroRicerca);
		assertThat(risultato.size()).isEqualTo(listaCodiciRuoli.size());
	}
	
	@Test
	public void getAllRuoliByRuoloAndcfUtenteTestRuoloNonPredefinito() {
		//test con ruoloUtenteLoggato = ruolo non predefinito
		sceltaContesto.setCodiceRuolo("RUOLONONPREDEFINITO");
		when(this.utenteRepository.findAllRuoli(
				filtroRicerca.getCriterioRicerca(),
				"%" + filtroRicerca.getCriterioRicerca() + "%",
				filtroRicerca.getRuoli(),
				filtroRicerca.getStati()
				)).thenReturn(listaCodiciRuoli);
		List<String> risultato = service.getAllRuoliByRuoloAndcfUtente(sceltaContesto.getCodiceRuolo(), sceltaContesto.getCfUtente(), sceltaContesto.getIdProgramma(), sceltaContesto.getIdProgetto(), filtroRicerca);
		assertThat(risultato.size()).isEqualTo(listaCodiciRuoli.size());
	}
}
