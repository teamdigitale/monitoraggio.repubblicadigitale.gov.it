package it.pa.repdgt.gestioneutente.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatExceptionOfType;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mock.web.MockMultipartFile;

import it.pa.repdgt.gestioneutente.dto.UtenteDto;
import it.pa.repdgt.gestioneutente.entity.projection.ProgettoEnteProjection;
import it.pa.repdgt.gestioneutente.exception.ResourceNotFoundException;
import it.pa.repdgt.gestioneutente.exception.RuoloException;
import it.pa.repdgt.gestioneutente.exception.UtenteException;
import it.pa.repdgt.gestioneutente.repository.EnteRepository;
import it.pa.repdgt.gestioneutente.repository.ReferentiDelegatiEnteGestoreProgettoRepository;
import it.pa.repdgt.gestioneutente.repository.ReferentiDelegatiEnteGestoreProgrammaRepository;
import it.pa.repdgt.gestioneutente.repository.ReferentiDelegatiEntePartnerDiProgettoRepository;
import it.pa.repdgt.gestioneutente.repository.UtenteRepository;
import it.pa.repdgt.gestioneutente.request.AggiornaUtenteRequest;
import it.pa.repdgt.gestioneutente.request.FiltroRequest;
import it.pa.repdgt.gestioneutente.request.UtenteRequest;
import it.pa.repdgt.shared.awsintegration.service.EmailService;
import it.pa.repdgt.shared.awsintegration.service.S3Service;
import it.pa.repdgt.shared.entity.EnteEntity;
import it.pa.repdgt.shared.entity.EntePartnerEntity;
import it.pa.repdgt.shared.entity.ProgettoEntity;
import it.pa.repdgt.shared.entity.ProgrammaEntity;
import it.pa.repdgt.shared.entity.RuoloEntity;
import it.pa.repdgt.shared.entity.UtenteEntity;
import it.pa.repdgt.shared.entity.UtenteXRuolo;
import it.pa.repdgt.shared.entity.key.EntePartnerKey;
import it.pa.repdgt.shared.entity.key.UtenteXRuoloKey;
import it.pa.repdgt.shared.entityenum.PolicyEnum;
import it.pa.repdgt.shared.entityenum.RuoloUtenteEnum;
import it.pa.repdgt.shared.entityenum.StatoEnum;
import lombok.Setter;

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
	private EnteRepository enteRepository;
	@Mock 
	private EmailService emailService;
	@Mock
	private S3Service s3Service;
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
	ProgrammaEntity programma;
	ProgettoEntity progetto;
	List<String> listaStati;
	List<Long> listaIds;
	UtenteXRuoloKey utenteXRuoloKey;
	UtenteXRuolo utenteXRuolo;
	MockMultipartFile file;
	byte[] data;
	InputStream stream;
	EnteEntity enteEntity;

	@BeforeEach
	public void setUp() throws IOException {
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
		ruolo1.setPredefinito(false);
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
		sceltaContesto.setCfUtenteLoggato("CODICE_FISCALE");
		sceltaContesto.setCodiceRuoloUtenteLoggato(RuoloUtenteEnum.DTD.getValue());
		sceltaContesto.setIdProgramma(1L);
		sceltaContesto.setIdProgetto(1L);
		sceltaContesto.setIdEnte(1000L);
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
		

		enteEntity = new EnteEntity();
		enteEntity.setId(1L);
		enteEntity.setNome("provaEnte");
		enteEntity.setNomeBreve("provaEnte");

		programma = new ProgrammaEntity();
		programma.setId(1L);
		programma.setNome("NOMEPROGRAMMA");
		programma.setStato("ATTIVO");
		programma.setPolicy(PolicyEnum.SCD);
		programma.setEnteGestoreProgramma(enteEntity);

		progetto = new ProgettoEntity();
		progetto.setId(1L);
		progetto.setNome("NOMEPROGETTO");
		progetto.setStato("ATTIVO");
		progetto.setProgramma(programma);
		progetto.setEnteGestoreProgetto(enteEntity);

		listaStati = new ArrayList<>();
		listaStati.add("ATTIVO");
		listaStati.add("TERMINATO");

		listaIds = new ArrayList<>();
		listaIds.add(1L);

		utenteXRuoloKey = new UtenteXRuoloKey(utente.getCodiceFiscale(), ruolo.getCodice());
		utenteXRuolo = new UtenteXRuolo();
		utenteXRuolo.setId(utenteXRuoloKey);

		data = new byte[] {1, 2, 3, 4};
		stream = new ByteArrayInputStream(data);
		file = new MockMultipartFile("test", "test", "jpg", stream);
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
				filtroRequest.getStati(),
				currPage*pageSize,
				pageSize
				)).thenReturn(new HashSet<UtenteEntity>());
		assertThat(service.getUtentiPaginatiByRuolo(RuoloUtenteEnum.DSCU.toString(), "CODICE_FISCALE", 1L, 1L, 1L, filtroRequest, currPage, pageSize)).isNotNull();
		when(this.utenteRepository.findUtentiPerReferenteDelegatoGestoreProgramma(
				   1L,
				   "CODICE_FISCALE",
				   filtroRequest.getCriterioRicerca(),
				   "%" + filtroRequest.getCriterioRicerca() + "%",
				   filtroRequest.getRuoli(),
					filtroRequest.getStati(),
				   currPage*pageSize,
				   pageSize)).thenReturn(new HashSet<UtenteEntity>());
		assertThat(service.getUtentiPaginatiByRuolo(RuoloUtenteEnum.REG.toString(), "CODICE_FISCALE", 1L, 1L, 1L, filtroRequest, currPage, pageSize)).isNotNull();
		when(this.utenteRepository.findUtentiPerReferenteDelegatoGestoreProgetti(
				  1L,
				  "CODICE_FISCALE", 
				  filtroRequest.getCriterioRicerca(),
				   "%" + filtroRequest.getCriterioRicerca() + "%",
				  filtroRequest.getRuoli(),
				  filtroRequest.getStati(),
				  currPage*pageSize,
				   pageSize)).thenReturn(new HashSet<UtenteEntity>());
		assertThat(service.getUtentiPaginatiByRuolo(RuoloUtenteEnum.DEGP.toString(), "CODICE_FISCALE", 1L, 1L, 1L, filtroRequest, currPage, pageSize)).isNotNull();
		when(this.utenteRepository.findUtentiPerReferenteDelegatoEntePartnerProgetti(
				  1L,
				  1L,
				  "CODICE_FISCALE",
				  filtroRequest.getCriterioRicerca(),
				   "%" + filtroRequest.getCriterioRicerca() + "%",
				  filtroRequest.getRuoli(),
					filtroRequest.getStati(),
				  currPage*pageSize,
				  pageSize)).thenReturn(new HashSet<UtenteEntity>());
		assertThat(service.getUtentiPaginatiByRuolo(RuoloUtenteEnum.DEPP.toString(), "CODICE_FISCALE", 1L, 1L, 1L, filtroRequest, currPage, pageSize)).isNotNull();
		when(this.utenteRepository.findUtentiByFiltri(
				filtroRicerca.getCriterioRicerca(),
				"%" + filtroRicerca.getCriterioRicerca() + "%",
				filtroRicerca.getRuoli(),
				filtroRicerca.getStati(),
				currPage*pageSize,
				pageSize
				
		)).thenReturn(new HashSet<UtenteEntity>());
		assertThat(service.getUtentiPaginatiByRuolo("RUOLO_CUSTOM", "CODICE_FISCALE", 1L, 1L, 1L, filtroRicerca, currPage, pageSize)).isNotNull();
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
		when(this.utenteRepository.findUtenteByCodiceFiscaleAndIdDiverso(aggiornaUtenteRequest.getCodiceFiscale(), utente.getId())).thenReturn(Optional.empty());
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
	public void aggiornaUtenteKOTest2() {
		//test KO per codice fiscale già presente
		when(this.utenteRepository.findById(utente.getId())).thenReturn(Optional.of(utente));
		when(this.utenteRepository.findUtenteByCodiceFiscaleAndIdDiverso(aggiornaUtenteRequest.getCodiceFiscale(), utente.getId())).thenReturn(Optional.of(utente));
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
		when(this.utenteRepository.findStatiByFilter(
				filtroRicerca.getCriterioRicerca(),
				"%" + filtroRicerca.getCriterioRicerca() + "%",
				filtroRicerca.getRuoli(),
				filtroRicerca.getStati()
		)).thenReturn(new HashSet<String>());
		service.getAllStatiDropdown(sceltaContesto);
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
		List<String> risultato = service.getAllStatiByRuoloAndcfUtente(sceltaContesto.getCodiceRuoloUtenteLoggato(), sceltaContesto.getCfUtenteLoggato(), sceltaContesto.getIdProgramma(), sceltaContesto.getIdProgetto(), filtroRicerca);
		assertThat(risultato.size()).isEqualTo(setStati.size());
	}
	
	@Test
	public void getAllStatiByRuoloAndcfUtenteTestConRuoliPrefediniti() {
		//test con ruoloUtenteLoggato = DSCU/REG/DEG/REGP/DEGP/REPP/DEPP
		sceltaContesto.setCodiceRuoloUtenteLoggato("DSCU");
		List<String> risultato = service.getAllStatiByRuoloAndcfUtente(sceltaContesto.getCodiceRuoloUtenteLoggato(), sceltaContesto.getCfUtenteLoggato(), sceltaContesto.getIdProgramma(), sceltaContesto.getIdProgetto(), filtroRicerca);
		assertThat(risultato.size()).isEqualTo(1);
	}
	
	@Test
	public void getAllStatiByRuoloAndcfUtenteTestConRuoliNonPrefediniti() {
		//test con ruoloUtenteLoggato = ruolo non predefinito
		sceltaContesto.setCodiceRuoloUtenteLoggato("RUOLONONPREDEFINITO");
		when(this.utenteRepository.findStatiByFilter(
				filtroRicerca.getCriterioRicerca(),
				"%" + filtroRicerca.getCriterioRicerca() + "%",
				filtroRicerca.getRuoli(),
				filtroRicerca.getStati()
		)).thenReturn(setStati);
		List<String> risultato = service.getAllStatiByRuoloAndcfUtente(sceltaContesto.getCodiceRuoloUtenteLoggato(), sceltaContesto.getCfUtenteLoggato(), sceltaContesto.getIdProgramma(), sceltaContesto.getIdProgetto(), filtroRicerca);
		assertThat(risultato.size()).isEqualTo(setStati.size());
	}
	
	@Test
	public void getAllRuoliDropdownTest() {
		when(this.ruoloService.getRuoliByCodiceFiscaleUtente(sceltaContesto.getCfUtenteLoggato())).thenReturn(listaCodiciRuoli);
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
		when(this.ruoloService.getRuoliByCodiceFiscaleUtente(sceltaContesto.getCfUtenteLoggato())).thenReturn(new ArrayList<>());
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
		List<String> risultato = service.getAllRuoliByRuoloAndcfUtente(sceltaContesto.getCodiceRuoloUtenteLoggato(), sceltaContesto.getCfUtenteLoggato(), sceltaContesto.getIdProgramma(), sceltaContesto.getIdProgetto(), filtroRicerca);
		assertThat(risultato.size()).isEqualTo(listaCodiciRuoli.size());
	}
	
	@Test
	public void getAllRuoliByRuoloAndcfUtenteDSCUTest() {
		//test con ruoloUtenteLoggato = DSCU
		sceltaContesto.setCodiceRuoloUtenteLoggato("DSCU");
		when(this.utenteRepository.findRuoliPerDSCU(
				filtroRicerca.getCriterioRicerca(),
				"%" + filtroRicerca.getCriterioRicerca() + "%",
				filtroRicerca.getRuoli(),
				filtroRicerca.getStati()
				)).thenReturn(listaCodiciRuoli);
		List<String> risultato = service.getAllRuoliByRuoloAndcfUtente(sceltaContesto.getCodiceRuoloUtenteLoggato(), sceltaContesto.getCfUtenteLoggato(), sceltaContesto.getIdProgramma(), sceltaContesto.getIdProgetto(), filtroRicerca);
		assertThat(risultato.size()).isEqualTo(listaCodiciRuoli.size());
	}
	
	@Test
	public void getAllRuoliByRuoloAndcfUtenteREGTest() {
		//test con ruoloUtenteLoggato = REG/DEG
		sceltaContesto.setCodiceRuoloUtenteLoggato("REG");
		when(this.utenteRepository.findRuoliPerReferenteDelegatoGestoreProgramma(
				sceltaContesto.getIdProgramma(),
				sceltaContesto.getCfUtenteLoggato(),
				filtroRicerca.getCriterioRicerca(),
				"%" + filtroRicerca.getCriterioRicerca() + "%",
				filtroRicerca.getRuoli(),
				filtroRicerca.getStati()
				)).thenReturn(listaCodiciRuoli);
		List<String> risultato = service.getAllRuoliByRuoloAndcfUtente(sceltaContesto.getCodiceRuoloUtenteLoggato(), sceltaContesto.getCfUtenteLoggato(), sceltaContesto.getIdProgramma(), sceltaContesto.getIdProgetto(), filtroRicerca);
		assertThat(risultato.size()).isEqualTo(listaCodiciRuoli.size());
	}
	
	@Test
	public void getAllRuoliByRuoloAndcfUtenteREGPTest() {
		//test con ruoloUtenteLoggato = REGP/DEGP
		sceltaContesto.setCodiceRuoloUtenteLoggato("REGP");
		when(this.utenteRepository.findRuoliPerReferenteDelegatoGestoreProgetti(
				sceltaContesto.getIdProgetto(),
				sceltaContesto.getCfUtenteLoggato(),
				filtroRicerca.getCriterioRicerca(),
				"%" + filtroRicerca.getCriterioRicerca() + "%",
				filtroRicerca.getRuoli(),
				filtroRicerca.getStati()
				)).thenReturn(listaCodiciRuoli);
		List<String> risultato = service.getAllRuoliByRuoloAndcfUtente(sceltaContesto.getCodiceRuoloUtenteLoggato(), sceltaContesto.getCfUtenteLoggato(), sceltaContesto.getIdProgramma(), sceltaContesto.getIdProgetto(), filtroRicerca);
		assertThat(risultato.size()).isEqualTo(listaCodiciRuoli.size());
	}
	
	@Test
	public void getAllRuoliByRuoloAndcfUtenteREPPTest() {
		//test con ruoloUtenteLoggato = REPP/DEPP
		sceltaContesto.setCodiceRuoloUtenteLoggato("REPP");
		when(this.utenteRepository.findRuoliPerReferenteDelegatoEntePartnerProgetti(
				sceltaContesto.getIdProgetto(),
				sceltaContesto.getCfUtenteLoggato(),
				filtroRicerca.getCriterioRicerca(),
				"%" + filtroRicerca.getCriterioRicerca() + "%",
				filtroRicerca.getRuoli(),
				filtroRicerca.getStati()
				)).thenReturn(listaCodiciRuoli);
		List<String> risultato = service.getAllRuoliByRuoloAndcfUtente(sceltaContesto.getCodiceRuoloUtenteLoggato(), sceltaContesto.getCfUtenteLoggato(), sceltaContesto.getIdProgramma(), sceltaContesto.getIdProgetto(), filtroRicerca);
		assertThat(risultato.size()).isEqualTo(listaCodiciRuoli.size());
	}
	
	@Test
	public void getAllRuoliByRuoloAndcfUtenteTestRuoloNonPredefinito() {
		//test con ruoloUtenteLoggato = ruolo non predefinito
		sceltaContesto.setCodiceRuoloUtenteLoggato("RUOLONONPREDEFINITO");
		when(this.utenteRepository.findAllRuoli(
				filtroRicerca.getCriterioRicerca(),
				"%" + filtroRicerca.getCriterioRicerca() + "%",
				filtroRicerca.getRuoli(),
				filtroRicerca.getStati()
				)).thenReturn(listaCodiciRuoli);
		List<String> risultato = service.getAllRuoliByRuoloAndcfUtente(sceltaContesto.getCodiceRuoloUtenteLoggato(), sceltaContesto.getCfUtenteLoggato(), sceltaContesto.getIdProgramma(), sceltaContesto.getIdProgetto(), filtroRicerca);
		assertThat(risultato.size()).isEqualTo(listaCodiciRuoli.size());
	}

	@Test
	public void getSchedaUtenteByIdUtenteDTDTest() {
		//test con utente avente ruolo DTD/DSCU
		when(this.utenteRepository.findById(utente.getId())).thenReturn(Optional.of(utente));
		when(this.ruoloService.getRuoliCompletiByCodiceFiscaleUtente(utente.getCodiceFiscale())).thenReturn(ruoli);
		service.getSchedaUtenteByIdUtente(utente.getId(), sceltaContesto);
	}

	@Test
	public void getSchedaUtenteByIdUtenteREGTest() {
		//test con utente avente ruolo REG/DEG
		ruolo1 = new RuoloEntity();
		ruolo1.setCodice(RuoloUtenteEnum.REG.toString());
		ruolo1.setNome(RuoloUtenteEnum.REG.getValue());
		ruoli = new ArrayList<>();
		ruoli.add(ruolo1);
		when(this.utenteRepository.findById(utente.getId())).thenReturn(Optional.of(utente));
		when(this.ruoloService.getRuoliCompletiByCodiceFiscaleUtente(utente.getCodiceFiscale())).thenReturn(ruoli);
		when(this.programmaService.getDistinctIdProgrammiByRuoloUtente(sceltaContesto.getCfUtenteLoggato(), ruolo1.getCodice())).thenReturn(listaIds);
		when(this.programmaService.getProgrammaById(programma.getId())).thenReturn(programma);
		when(referentiDelegatiEnteGestoreProgrammaRepository.findStatoByCfUtente(sceltaContesto.getCfUtenteLoggato(), programma.getId(), ruolo1.getCodice())).thenReturn(listaStati);
		service.getSchedaUtenteByIdUtente(utente.getId(), sceltaContesto);
	}

	@Test
	public void getSchedaUtenteByIdUtenteREGPTest() {
		//test con utente avente ruolo REGP/DEGP
		ruolo1 = new RuoloEntity();
		ruolo1.setCodice(RuoloUtenteEnum.REGP.toString());
		ruolo1.setNome(RuoloUtenteEnum.REGP.getValue());
		ruoli = new ArrayList<>();
		ruoli.add(ruolo1);
		when(this.utenteRepository.findById(utente.getId())).thenReturn(Optional.of(utente));
		when(this.ruoloService.getRuoliCompletiByCodiceFiscaleUtente(utente.getCodiceFiscale())).thenReturn(ruoli);
		when(this.progettoService.getDistinctIdProgettiByRuoloUtente(sceltaContesto.getCfUtenteLoggato(), ruolo1.getCodice())).thenReturn(listaIds);
		when(this.progettoService.getProgettoById(progetto.getId())).thenReturn(progetto);
		when(referentiDelegatiEnteGestoreProgettoRepository.findStatoByCfUtente(sceltaContesto.getCfUtenteLoggato(), progetto.getId(), ruolo1.getCodice())).thenReturn(listaStati);
		service.getSchedaUtenteByIdUtente(utente.getId(), sceltaContesto);
	}

	@Test
	public void getSchedaUtenteByIdUtenteREPPTest() {
		//test con utente avente ruolo REPP/DEPP
		ruolo1 = new RuoloEntity();
		ruolo1.setCodice(RuoloUtenteEnum.REPP.toString());
		ruolo1.setNome(RuoloUtenteEnum.REPP.getValue());
		ruoli = new ArrayList<>();
		ruoli.add(ruolo1);
		EntePartnerKey entePartnerKey = new EntePartnerKey(progetto.getId(), 1L);
		EntePartnerEntity entePartnerEntity = new EntePartnerEntity();
		entePartnerEntity.setId(entePartnerKey);
		List<EntePartnerEntity> listaEntiPartner = new ArrayList<>();
		listaEntiPartner.add(entePartnerEntity);
		when(this.utenteRepository.findById(utente.getId())).thenReturn(Optional.of(utente));
		when(this.ruoloService.getRuoliCompletiByCodiceFiscaleUtente(utente.getCodiceFiscale())).thenReturn(ruoli);
		when(this.entePartnerService.getIdProgettiEntePartnerByRuoloUtente(sceltaContesto.getCfUtenteLoggato(), ruolo1.getCodice())).thenReturn(listaEntiPartner);
		when(this.progettoService.getProgettoById(progetto.getId())).thenReturn(progetto);
		when(this.enteRepository.findById(1L)).thenReturn(Optional.of(enteEntity));
		when(referentiDelegatiEntePartnerDiProgettoRepository.findStatoByCfUtente(sceltaContesto.getCfUtenteLoggato(), progetto.getId(), ruolo1.getCodice())).thenReturn(listaStati);
		service.getSchedaUtenteByIdUtente(utente.getId(), sceltaContesto);
	}

	@Test
	public void getSchedaUtenteByIdUtenteFACTest() {
		//test con utente avente ruolo FAC/VOL
		ruolo1 = new RuoloEntity();
		ruolo1.setCodice(RuoloUtenteEnum.FAC.toString());
		ruolo1.setNome(RuoloUtenteEnum.FAC.getValue());
		ruoli = new ArrayList<>();
		ruoli.add(ruolo1);
		ProgettoEnteProjectionImplementation progettoEnteProjectionImplementation = new ProgettoEnteProjectionImplementation();
		progettoEnteProjectionImplementation.setIdProgetto(1L);
		progettoEnteProjectionImplementation.setIdEnte(1L);
		progettoEnteProjectionImplementation.setStato("ATTIVO");
		List<ProgettoEnteProjection> listaProgettoEnte = new ArrayList<>();
		listaProgettoEnte.add(progettoEnteProjectionImplementation);
		when(this.utenteRepository.findById(utente.getId())).thenReturn(Optional.of(utente));
		when(this.ruoloService.getRuoliCompletiByCodiceFiscaleUtente(utente.getCodiceFiscale())).thenReturn(ruoli);
		when(this.enteSedeProgettoFacilitatoreService.getIdProgettiFacilitatoreVolontarioPerEntePartner(sceltaContesto.getCfUtenteLoggato(), ruolo1.getCodice())).thenReturn(listaProgettoEnte);
		when(this.enteSedeProgettoFacilitatoreService.getIdProgettiFacilitatoreVolontarioPerGestore(sceltaContesto.getCfUtenteLoggato(), ruolo1.getCodice())).thenReturn(listaProgettoEnte);
		when(this.progettoService.getProgettoById(progetto.getId())).thenReturn(progetto);
		when(this.enteRepository.findById(1L)).thenReturn(Optional.of(enteEntity));
		when(this.enteSedeProgettoFacilitatoreService.getDistinctStatoByIdProgettoIdFacilitatoreVolontario(sceltaContesto.getCfUtenteLoggato(), ruolo1.getCodice(),  progetto.getId())).thenReturn(listaStati);
		service.getSchedaUtenteByIdUtente(utente.getId(), sceltaContesto);
	}

	@Test
	public void isProgettoAssociatoAUtenteLoggatoTest() {
		//test con condizioni IF non rispettate
		sceltaContesto.setCodiceRuoloUtenteLoggato("REGP");
		sceltaContesto.setIdProgetto(2L);
		sceltaContesto.setIdEnte(2L);
		boolean risultato = service.isProgettoAndEnteAssociatoAUtenteLoggato(sceltaContesto, progetto, null);
		assertThat(risultato).isEqualTo(false);
	}

	@Test
	public void isProgettoAssociatoAUtenteLoggatoDTDTest() {
		//test con ruoloUtenteLoggato = DTD/ruolo custom
		boolean risultato = service.isProgettoAndEnteAssociatoAUtenteLoggato(sceltaContesto, progetto, null);
		assertThat(risultato).isEqualTo(true);
	}

	@Test
	public void isProgettoAssociatoAUtenteLoggatoDSCUTest() {
		//test con ruoloUtenteLoggato = DSCU con policy programma = SCD
		sceltaContesto.setCodiceRuoloUtenteLoggato("DSCU");
		boolean risultato = service.isProgettoAndEnteAssociatoAUtenteLoggato(sceltaContesto, progetto, null);
		assertThat(risultato).isEqualTo(true);
	}

	@Test
	public void isProgettoAssociatoAUtenteLoggatoDSCUTest2() {
		//test con ruoloUtenteLoggato = DSCU con policy programma = RFD
		sceltaContesto.setCodiceRuoloUtenteLoggato("DSCU");
		programma.setPolicy(PolicyEnum.RFD);
		boolean risultato = service.isProgettoAndEnteAssociatoAUtenteLoggato(sceltaContesto, progetto, null);
		assertThat(risultato).isEqualTo(false);
	}

	@Test
	public void isProgettoAssociatoAUtenteLoggatoREGTest() {
		//test con ruoloUtenteLoggato = REG
		sceltaContesto.setCodiceRuoloUtenteLoggato("REG");
		boolean risultato = service.isProgettoAndEnteAssociatoAUtenteLoggato(sceltaContesto, progetto, null);
		assertThat(risultato).isEqualTo(true);
	}

	@Test
	public void isProgettoAssociatoAUtenteLoggatoREGPTest() {
		//test con ruoloUtenteLoggato = REGP
		sceltaContesto.setCodiceRuoloUtenteLoggato("REGP");
		boolean risultato = service.isProgettoAndEnteAssociatoAUtenteLoggato(sceltaContesto, progetto, null);
		assertThat(risultato).isEqualTo(true);
	}
	
	@Test
	public void isProgettoAssociatoAUtenteLoggatoREPPOrFACTest() {
		//test con ruoloUtenteLoggato = REPP
		sceltaContesto.setCodiceRuoloUtenteLoggato("REPP");
		sceltaContesto.setIdProgetto(1L);
		sceltaContesto.setIdEnte(1000L);
		boolean risultato = service.isProgettoAndEnteAssociatoAUtenteLoggato(sceltaContesto, progetto, 1000L);
		assertThat(risultato).isEqualTo(true);
	}

	@Test
	public void getUtenteByCriterioRicercaTest() {
		when(this.utenteRepository.findUtenteByCriterioRicerca(
				filtroRicerca.getCriterioRicerca(),
				"%" + filtroRicerca.getCriterioRicerca() + "%"
		)).thenReturn(utentiList);
		List<UtenteEntity> risultato = service.getUtenteByCriterioRicerca(filtroRicerca.getCriterioRicerca());
		assertThat(risultato.size()).isEqualTo(utentiList.size());
	}

	@Test
	public void cancellaRuoloDaUtenteTest() {
		ruoli = new ArrayList<>();
		ruoli.add(ruolo);
		utente.setRuoli(ruoli);
		when(this.ruoloService.getRuoloByCodiceRuolo("REG")).thenReturn(ruolo);
		when(this.utenteRepository.findById(utente.getId())).thenReturn(Optional.of(utente));
		when(this.ruoloService.getRuoloByCodiceRuolo(ruolo.getCodice())).thenReturn(ruolo);
		when(this.utenteXRuoloService.getUtenteXRuoloByCfUtenteAndCodiceRuolo(utente.getCodiceFiscale(), ruolo.getCodice())).thenReturn(utenteXRuolo);
		doNothing().when(this.utenteXRuoloService).cancellaRuoloUtente(utenteXRuolo);
		service.cancellaRuoloDaUtente(utente.getId(), ruolo.getCodice());
	}

	@Test
	public void cancellaRuoloDaUtenteDTDTest() {
		//test con codiceRuolo da eliminare = DSCU/DTD
		ruolo.setCodice("DSCU");
		ruolo.setPredefinito(true);
		utenteXRuoloKey = new UtenteXRuoloKey(utente.getCodiceFiscale(), ruolo.getCodice());
		utenteXRuolo = new UtenteXRuolo();
		utenteXRuolo.setId(utenteXRuoloKey);
		ruoli = new ArrayList<>();
		ruoli.add(ruolo);
		utente.setRuoli(ruoli);
		when(this.ruoloService.getRuoloByCodiceRuolo("DSCU")).thenReturn(ruolo);
		when(this.utenteRepository.findById(utente.getId())).thenReturn(Optional.of(utente));
		when(this.ruoloService.getRuoloByCodiceRuolo(ruolo.getCodice())).thenReturn(ruolo);
		when(this.utenteXRuoloService.getUtenteXRuoloByCfUtenteAndCodiceRuolo(utente.getCodiceFiscale(), ruolo.getCodice())).thenReturn(utenteXRuolo);
		doNothing().when(this.utenteXRuoloService).cancellaRuoloUtente(utenteXRuolo);
		service.cancellaRuoloDaUtente(utente.getId(), ruolo.getCodice());
	}

	@Test
	public void cancellaRuoloDaUtenteKOTest() {
		//test KO per ruolo inesistente
		Assertions.assertThrows(RuoloException.class, () -> service.cancellaRuoloDaUtente(utente.getId(), "RUOLOINESISTENTE"));
		assertThatExceptionOfType(RuoloException.class);
	}

	@Test
	public void cancellaRuoloDaUtenteKOTest2() {
		//test KO impossibile cancellare un ruolo non associato ad un utente
		when(this.ruoloService.getRuoloByCodiceRuolo("DSCU")).thenReturn(ruolo);
		when(this.utenteRepository.findById(utente.getId())).thenReturn(Optional.of(utente));
		Assertions.assertThrows(RuoloException.class, () -> service.cancellaRuoloDaUtente(utente.getId(), "DSCU"));
		assertThatExceptionOfType(RuoloException.class);
	}

	@Test
	public void cancellaRuoloDaUtenteKOTest3() {
		//test KO impossibile un ruolo predefinito
		ruolo.setCodice("REG");
		ruolo.setPredefinito(true);
		ruoli = new ArrayList<>();
		ruoli.add(ruolo);
		utente.setRuoli(ruoli);
		when(this.ruoloService.getRuoloByCodiceRuolo(ruolo.getCodice())).thenReturn(ruolo);
		when(this.utenteRepository.findById(utente.getId())).thenReturn(Optional.of(utente));
		when(this.ruoloService.getRuoloByCodiceRuolo(ruolo.getCodice())).thenReturn(ruolo);
		Assertions.assertThrows(RuoloException.class, () -> service.cancellaRuoloDaUtente(utente.getId(), ruolo.getCodice()));
		assertThatExceptionOfType(RuoloException.class);
	}

	@Test
	public void countUtentiTrovatiTest() {
		when( this.utenteRepository.countUtentiTrovati(
				filtroRicerca.getCriterioRicerca(),
				"%" + filtroRicerca.getCriterioRicerca() + "%",
				filtroRicerca.getRuoli(),
				filtroRicerca.getStati())).thenReturn(1);
		service.countUtentiTrovati(sceltaContesto);
	}

	@Test
	public void countUtentiTrovatiByRuoloDTDTest() {
		//test con ruolo DTD
		when(this.utenteRepository.countUtentiTrovati(
				filtroRicerca.getCriterioRicerca(),
				"%" + filtroRicerca.getCriterioRicerca() + "%",
				filtroRicerca.getRuoli(),
				filtroRicerca.getStati())).thenReturn(1);
		service.countUtentiTrovatiByRuolo(sceltaContesto.getCodiceRuoloUtenteLoggato(), sceltaContesto.getCfUtenteLoggato(), sceltaContesto.getIdProgramma(), sceltaContesto.getIdProgetto(), sceltaContesto.getIdEnte(), sceltaContesto.getFiltroRequest());
	}

	@Test
	public void countUtentiTrovatiByRuoloDSCUTest() {
		//test con ruolo DSCU
		sceltaContesto.setCodiceRuoloUtenteLoggato("DSCU");
		when(this.utenteRepository.countUtentiTrovatiPerDSCU(
				filtroRicerca.getCriterioRicerca(),
				"%" + filtroRicerca.getCriterioRicerca() + "%",
				filtroRicerca.getRuoli(),
				filtroRicerca.getStati())).thenReturn(1);
		service.countUtentiTrovatiByRuolo(sceltaContesto.getCodiceRuoloUtenteLoggato(), sceltaContesto.getCfUtenteLoggato(), sceltaContesto.getIdProgramma(), sceltaContesto.getIdProgetto(), sceltaContesto.getIdEnte(), sceltaContesto.getFiltroRequest());
	}

	@Test
	public void countUtentiTrovatiByRuoloREGTest() {
		//test con ruolo REG/DEG
		sceltaContesto.setCodiceRuoloUtenteLoggato("REG");
		when(this.utenteRepository.countUtentiTrovatiPerReferenteDelegatoGestoreProgramma(
				sceltaContesto.getIdProgramma(),
				sceltaContesto.getCfUtenteLoggato(),
				filtroRicerca.getCriterioRicerca(),
				"%" + filtroRicerca.getCriterioRicerca() + "%",
				filtroRicerca.getRuoli(),
				filtroRicerca.getStati())).thenReturn(1);
		service.countUtentiTrovatiByRuolo(sceltaContesto.getCodiceRuoloUtenteLoggato(), sceltaContesto.getCfUtenteLoggato(), sceltaContesto.getIdProgramma(), sceltaContesto.getIdProgetto(), sceltaContesto.getIdEnte(), sceltaContesto.getFiltroRequest());
	}

	@Test
	public void countUtentiTrovatiByRuoloREGPTest() {
		//test con ruolo REGP/DEGP
		sceltaContesto.setCodiceRuoloUtenteLoggato("REGP");
		when(this.utenteRepository.countUtentiTrovatiPerReferenteDelegatoGestoreProgetti(
				sceltaContesto.getIdProgetto(),
				sceltaContesto.getCfUtenteLoggato(),
				filtroRicerca.getCriterioRicerca(),
				"%" + filtroRicerca.getCriterioRicerca() + "%",
				filtroRicerca.getRuoli(),
				filtroRicerca.getStati())).thenReturn(1);
		service.countUtentiTrovatiByRuolo(sceltaContesto.getCodiceRuoloUtenteLoggato(), sceltaContesto.getCfUtenteLoggato(), sceltaContesto.getIdProgramma(), sceltaContesto.getIdProgetto(), sceltaContesto.getIdEnte(), sceltaContesto.getFiltroRequest());
	}

	@Test
	public void countUtentiTrovatiByRuoloREPPTest() {
		//test con ruolo REPP/DEPP
		sceltaContesto.setCodiceRuoloUtenteLoggato("REPP");
		when(this.utenteRepository.countUtentiTrovatiPerReferenteDelegatoEntePartnerProgetti(
				sceltaContesto.getIdProgetto(),
				sceltaContesto.getIdEnte(),
				sceltaContesto.getCfUtenteLoggato(),
				filtroRicerca.getCriterioRicerca(),
				"%" + filtroRicerca.getCriterioRicerca() + "%",
				filtroRicerca.getRuoli(),
				filtroRicerca.getStati())).thenReturn(1);
		service.countUtentiTrovatiByRuolo(sceltaContesto.getCodiceRuoloUtenteLoggato(), sceltaContesto.getCfUtenteLoggato(), sceltaContesto.getIdProgramma(), sceltaContesto.getIdProgetto(), sceltaContesto.getIdEnte(), sceltaContesto.getFiltroRequest());
	}

	@Test
	public void countUtentiTrovatiByRuoloNonPredefinitoTest() {
		//test con ruolo non predefinito
		sceltaContesto.setCodiceRuoloUtenteLoggato("RUOLONONPREDEFINITO");
		when(this.utenteRepository.countUtentiTrovati(
				filtroRicerca.getCriterioRicerca(),
				"%" + filtroRicerca.getCriterioRicerca() + "%",
				filtroRicerca.getRuoli(),
				filtroRicerca.getStati())).thenReturn(1);
		service.countUtentiTrovatiByRuolo(sceltaContesto.getCodiceRuoloUtenteLoggato(), sceltaContesto.getCfUtenteLoggato(), sceltaContesto.getIdProgramma(), sceltaContesto.getIdProgetto(), sceltaContesto.getIdEnte(), sceltaContesto.getFiltroRequest());
	}

	@Test
	public void getUtentiPerDownloadDTDTest() {
		//test con ruolo = DTD
		when(this.utenteRepository.findUtentiByFiltriPerDownload(
				filtroRicerca.getCriterioRicerca(),
				"%" + filtroRicerca.getCriterioRicerca() + "%",
				filtroRicerca.getRuoli(),
				filtroRicerca.getStati())).thenReturn(utentiSet);
		List<UtenteDto> risultato = service.getUtentiPerDownload(sceltaContesto.getCodiceRuoloUtenteLoggato(), sceltaContesto.getCfUtenteLoggato(), sceltaContesto.getIdProgramma(), sceltaContesto.getIdProgetto(), sceltaContesto.getIdEnte(), sceltaContesto.getFiltroRequest());
		assertThat(risultato.size()).isEqualTo(utentiSet.size());
	}

	@Test
	public void getUtentiPerDownloadDSCUTest() {
		//test con ruolo = DSCU
		sceltaContesto.setCodiceRuoloUtenteLoggato("DSCU");
		when(this.utenteRepository.findUtentiPerDSCUPerDownload(
				filtroRicerca.getCriterioRicerca(),
				"%" + filtroRicerca.getCriterioRicerca() + "%",
				filtroRicerca.getRuoli())).thenReturn(utentiSet);
		List<UtenteDto> risultato = service.getUtentiPerDownload(sceltaContesto.getCodiceRuoloUtenteLoggato(), sceltaContesto.getCfUtenteLoggato(), sceltaContesto.getIdProgramma(), sceltaContesto.getIdProgetto(), sceltaContesto.getIdEnte(), sceltaContesto.getFiltroRequest());
		assertThat(risultato.size()).isEqualTo(utentiSet.size());
	}

	@Test
	public void getUtentiPerDownloadREGTest() {
		//test con ruolo = REG/DEG
		sceltaContesto.setCodiceRuoloUtenteLoggato("REG");
		when(this.utenteRepository.findUtentiPerReferenteDelegatoGestoreProgrammaPerDownload(
				sceltaContesto.getIdProgramma(),
				sceltaContesto.getCfUtenteLoggato(),
				filtroRicerca.getCriterioRicerca(),
				"%" + filtroRicerca.getCriterioRicerca() + "%",
				filtroRicerca.getRuoli())).thenReturn(utentiSet);
		List<UtenteDto> risultato = service.getUtentiPerDownload(sceltaContesto.getCodiceRuoloUtenteLoggato(), sceltaContesto.getCfUtenteLoggato(), sceltaContesto.getIdProgramma(), sceltaContesto.getIdProgetto(), sceltaContesto.getIdEnte(), sceltaContesto.getFiltroRequest());
		assertThat(risultato.size()).isEqualTo(utentiSet.size());
	}

	@Test
	public void getUtentiPerDownloadREGPTest() {
		//test con ruolo = REGP/DEGP
		sceltaContesto.setCodiceRuoloUtenteLoggato("REGP");
		when(this.utenteRepository.findUtentiPerReferenteDelegatoGestoreProgettiPerDownload(
				sceltaContesto.getIdProgramma(),
				sceltaContesto.getIdProgetto(),
				sceltaContesto.getCfUtenteLoggato(),
				filtroRicerca.getCriterioRicerca(),
				"%" + filtroRicerca.getCriterioRicerca() + "%",
				filtroRicerca.getRuoli())).thenReturn(utentiSet);
		List<UtenteDto> risultato = service.getUtentiPerDownload(sceltaContesto.getCodiceRuoloUtenteLoggato(), sceltaContesto.getCfUtenteLoggato(), sceltaContesto.getIdProgramma(), sceltaContesto.getIdProgetto(), sceltaContesto.getIdEnte(), sceltaContesto.getFiltroRequest());
		assertThat(risultato.size()).isEqualTo(utentiSet.size());
	}

	@Test
	public void getUtentiPerDownloadREPPTest() {
		//test con ruolo = REPP/DEPP
		sceltaContesto.setCodiceRuoloUtenteLoggato("REPP");
		when(this.utenteRepository.findUtentiPerReferenteDelegatoEntePartnerProgettiPerDownload(
				sceltaContesto.getIdProgramma(),
				sceltaContesto.getIdProgetto(),
				sceltaContesto.getIdEnte(),
				sceltaContesto.getCfUtenteLoggato(),
				filtroRicerca.getCriterioRicerca(),
				"%" + filtroRicerca.getCriterioRicerca() + "%",
				filtroRicerca.getRuoli())).thenReturn(utentiSet);
		List<UtenteDto> risultato = service.getUtentiPerDownload(sceltaContesto.getCodiceRuoloUtenteLoggato(), sceltaContesto.getCfUtenteLoggato(), sceltaContesto.getIdProgramma(), sceltaContesto.getIdProgetto(), sceltaContesto.getIdEnte(), sceltaContesto.getFiltroRequest());
		assertThat(risultato.size()).isEqualTo(utentiSet.size());
	}

	@Test
	public void getUtentiPerDownloadTestConRuoloNonPredefinito() {
		//test con ruolo non predefinito
		sceltaContesto.setCodiceRuoloUtenteLoggato("RUOLONONPREDEFINITO");
		when(this.utenteRepository.findUtentiByFiltriPerDownload(
				filtroRicerca.getCriterioRicerca(),
				"%" + filtroRicerca.getCriterioRicerca() + "%",
				filtroRicerca.getRuoli(),
				filtroRicerca.getStati())).thenReturn(utentiSet);
		List<UtenteDto> risultato = service.getUtentiPerDownload(sceltaContesto.getCodiceRuoloUtenteLoggato(), sceltaContesto.getCfUtenteLoggato(), sceltaContesto.getIdProgramma(), sceltaContesto.getIdProgetto(), sceltaContesto.getIdEnte(), sceltaContesto.getFiltroRequest());
		assertThat(risultato.size()).isEqualTo(utentiSet.size());
	}

	@Test
	public void uploadImmagineProfiloUtenteTest() throws IOException {
		when(this.utenteRepository.findById(utente.getId())).thenReturn(Optional.of(utente));
		service.uploadImmagineProfiloUtente(utente.getId(), utente.getCodiceFiscale(), file);
	}

	@Test
	public void downloadImmagineProfiloUtenteKOTest() {
		//test KO per errore upload immagine profilo
		Assertions.assertThrows(UtenteException.class, () -> service.downloadImmagineProfiloUtente("NOMEFILE"));
		assertThatExceptionOfType(UtenteException.class);
	}
	
	@Setter
	public class ProgettoEnteProjectionImplementation implements ProgettoEnteProjection {

		private Long idProgetto;
		private Long idEnte;
		private String stato;
		
		@Override
		public Long getIdProgetto() {
			return idProgetto;
		}

		@Override
		public Long getIdEnte() {
			return idEnte;
		}

		@Override
		public String getStato() {
			return stato;
		}
		
	}
}
