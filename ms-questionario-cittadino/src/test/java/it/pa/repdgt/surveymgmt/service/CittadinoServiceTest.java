package it.pa.repdgt.surveymgmt.service;

import java.util.List;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.projection.ProjectionFactory;
import it.pa.repdgt.shared.entity.CittadinoEntity;
import it.pa.repdgt.shared.entity.RuoloEntity;
import it.pa.repdgt.shared.entity.SedeEntity;
import it.pa.repdgt.shared.entity.UtenteEntity;
import it.pa.repdgt.shared.restapi.param.SceltaProfiloParam;
import it.pa.repdgt.surveymgmt.mapper.CittadinoMapper;
import it.pa.repdgt.surveymgmt.mongo.repository.QuestionarioCompilatoMongoRepository;
import it.pa.repdgt.surveymgmt.param.CittadiniPaginatiParam;
import it.pa.repdgt.surveymgmt.param.FiltroListaCittadiniParam;
import it.pa.repdgt.surveymgmt.projection.CittadinoProjection;
import it.pa.repdgt.surveymgmt.projection.DettaglioServizioSchedaCittadinoProjection;
import it.pa.repdgt.surveymgmt.repository.CittadinoRepository;
import it.pa.repdgt.surveymgmt.repository.QuestionarioCompilatoRepository;
import it.pa.repdgt.surveymgmt.request.CittadinoRequest;

@ExtendWith(MockitoExtension.class)
public class CittadinoServiceTest {

	@Mock
	private CittadinoRepository cittadinoRepository;
	@Mock
	private RuoloService ruoloService;
	@Mock
	private SedeService sedeService;
	@Mock
	private EnteSedeProgettoFacilitatoreService enteSedeProgettoFacilitatoreService;
	@Mock
	private CittadinoMapper cittadinoMapper;
	@Mock
	private QuestionarioCompilatoRepository questionarioCompilatoRepository;
	@Mock
	private QuestionarioCompilatoMongoRepository questionarioCompilatoMongoRepository;

	@Autowired
	@InjectMocks
	private CittadinoService cittadinoService;

	CittadinoEntity cittadino;
	CittadiniPaginatiParam cittadiniPaginatiParam;
	RuoloEntity ruolo;
	List<RuoloEntity> listaRuoli;
	FiltroListaCittadiniParam filtro;
	SedeEntity sede1;
	List<String> listaIdsSedi;
	List<DettaglioServizioSchedaCittadinoProjection> listaDettagliCittadinoProjection;
	ProjectionFactory dettaglioSchedaCittadino;
	DettaglioServizioSchedaCittadinoProjection dettaglioSchedaCittadinoProjection;
	UtenteEntity facilitatore;
	CittadinoRequest cittadinoRequest;
	// CittadinoProjectionImplementation cittadinoProjectionImplementation;
	List<CittadinoProjection> listaCittadiniProjection;
	SceltaProfiloParam sceltaProfiloParam;

	/*
	 * @BeforeEach
	 * public void setUp() {
	 * cittadino = new CittadinoEntity();
	 * cittadino.setId(1L);
	 * cittadino.setEmail("prova@gmail.com");
	 * cittadino.setCodiceFiscale("CFCITTADINO");
	 * cittadino.setNumeroDocumento("A4DE22T");
	 * listaIdsSedi = new ArrayList<>();
	 * sede1 = new SedeEntity();
	 * sede1.setId(1L);
	 * listaIdsSedi.add(sede1.getId().toString());
	 * filtro = new FiltroListaCittadiniParam();
	 * filtro.setCriterioRicerca("CRITERIORICERCA");
	 * filtro.setIdsSedi(listaIdsSedi);
	 * facilitatore = new UtenteEntity();
	 * facilitatore.setNome("facilitatore1");
	 * facilitatore.setCodiceFiscale("CFFACILITATORE");
	 * facilitatore.setId(1L);
	 * sceltaProfiloParam = new SceltaProfiloParam();
	 * sceltaProfiloParam.setCfUtenteLoggato(facilitatore.getCodiceFiscale());
	 * sceltaProfiloParam.setCodiceRuoloUtenteLoggato(RuoloUtenteEnum.FAC.toString()
	 * );
	 * sceltaProfiloParam.setIdProgetto(1L);
	 * sceltaProfiloParam.setIdProgramma(1L);
	 * sceltaProfiloParam.setIdEnte(1000L);
	 * cittadiniPaginatiParam = new CittadiniPaginatiParam();
	 * cittadiniPaginatiParam.setCfUtenteLoggato("CFUTENTE");
	 * cittadiniPaginatiParam.setCodiceRuoloUtenteLoggato(RuoloUtenteEnum.FAC.
	 * toString());
	 * cittadiniPaginatiParam.setIdProgetto(1L);
	 * cittadiniPaginatiParam.setIdProgramma(1L);
	 * cittadiniPaginatiParam.setIdEnte(1000L);
	 * cittadiniPaginatiParam.setFiltro(filtro);
	 * ruolo = new RuoloEntity();
	 * ruolo.setCodice("FAC");
	 * listaRuoli = new ArrayList<>();
	 * listaRuoli.add(ruolo);
	 * listaDettagliCittadinoProjection = new ArrayList<>();
	 * dettaglioSchedaCittadino = new SpelAwareProxyProjectionFactory();
	 * dettaglioSchedaCittadinoProjection =
	 * dettaglioSchedaCittadino.createProjection(
	 * DettaglioServizioSchedaCittadinoProjection.class);
	 * cittadinoRequest = new CittadinoRequest();
	 * cittadinoRequest.setCodiceFiscale("CFCITTADINO");
	 * cittadinoRequest.setNome("NOMECITTADINO");
	 * cittadinoRequest.setCognome("COGNOMECITTADINO");
	 * cittadinoRequest.setTipoDocumento("CF");
	 * cittadinoRequest.setNumeroDocumento("E23K099D");
	 * cittadinoRequest.setGenere("GENERE");
	 * cittadinoRequest.setAnnoNascita(1990);
	 * cittadinoRequest.setTitoloStudio("DIPLOMA");
	 * cittadinoRequest.setStatoOccupazionale("DIPENDENTE");
	 * cittadinoRequest.setCittadinanza("ITALIANA");
	 * cittadinoRequest.setComuneDomicilio("ROMA");
	 * cittadinoRequest.setCategoriaFragili("NO");
	 * cittadinoRequest.setEmail("PROVA@PROVA.IT");
	 * cittadinoRequest.setPrefisso("+39");
	 * cittadinoRequest.setNumeroCellulare("3207895672");
	 * cittadinoRequest.setTelefono("0722896754");
	 * cittadinoRequest.
	 * setQuestionarioQ1("{ \"sezioneQuestionarioCompilatoQ1\": \"{ \\\"id\\\": \\\"Q1\\\", \\\"title\\\": \\\"Sezione Q1\\\", \\\"properties\\\": [ \\\"{'24': ['risposta a', 'risposta b']}\\\", \\\"{'25': ['risposta a']}\\\",  \\\"{'3.3': ['risposta d']}\\\", \\\"{'3.4': ['riposta risposta', 'risposta c']}\\\"] }\",\r\n"
	 * + "\r\n"
	 * + "  \"tipoDiServizioPrenotato\": \"Servizio AAA\"\r\n"
	 * + "\r\n"
	 * + "}");
	 * cittadinoProjectionImplementation = new CittadinoProjectionImplementation();
	 * cittadinoProjectionImplementation.setId(1L);
	 * cittadinoProjectionImplementation.setCodiceFiscale("FACILITATORE1");
	 * cittadinoProjectionImplementation.setNumeroServizi(2L);
	 * cittadinoProjectionImplementation.setNumeroQuestionariCompilati(2L);
	 * listaCittadiniProjection = new ArrayList<>();
	 * listaCittadiniProjection.add(cittadinoProjectionImplementation);
	 * }
	 * 
	 * @Test
	 * public void getCittadinoByIdTest() {
	 * when(this.cittadinoRepository.findById(cittadino.getId())).thenReturn(
	 * Optional.of(cittadino));
	 * CittadinoEntity cittadinoRisultato =
	 * cittadinoService.getCittadinoById(cittadino.getId());
	 * assertThat(cittadinoRisultato.getId()).isEqualTo(cittadino.getId());
	 * }
	 * 
	 * @Test
	 * public void getCittadinoByIdKOTest() {
	 * //test KO per cittadino non trovato
	 * when(this.cittadinoRepository.findById(cittadino.getId())).thenReturn(
	 * Optional.empty());
	 * Assertions.assertThrows(ResourceNotFoundException.class, () ->
	 * cittadinoService.getCittadinoById(cittadino.getId()));
	 * assertThatExceptionOfType(ResourceNotFoundException.class);
	 * }
	 * 
	 * @Test
	 * public void getAllCittadiniPaginatiTest() {
	 * CittadinoProjectionImplementation cittadinoProjectionImplementation = new
	 * CittadinoProjectionImplementation();
	 * cittadinoProjectionImplementation.setId(1L);
	 * cittadinoProjectionImplementation.setCodiceFiscale("FACILITATORE1");
	 * cittadinoProjectionImplementation.setNumeroServizi(2L);
	 * cittadinoProjectionImplementation.setNumeroQuestionariCompilati(2L);
	 * List<CittadinoProjection> listaCittadiniProjection = new ArrayList<>();
	 * listaCittadiniProjection.add(cittadinoProjectionImplementation);
	 * when(this.cittadinoRepository.findAllCittadiniPaginatiByFiltro(filtro.
	 * getCriterioRicerca(),
	 * "%" + filtro.getCriterioRicerca() + "%",
	 * filtro.getIdsSedi(),
	 * cittadiniPaginatiParam.getCfUtenteLoggato(),
	 * 0*10, 10
	 * )).thenReturn(listaCittadiniProjection);
	 * cittadinoService.getAllCittadiniPaginati(cittadiniPaginatiParam, 0, 10);
	 * }
	 * 
	 * @Test
	 * public void getAllCittadiniPaginatiKOTest() {
	 * //test KO per utente non facilitatore
	 * cittadiniPaginatiParam.setCodiceRuoloUtenteLoggato(RuoloUtenteEnum.DTD.
	 * toString());
	 * Assertions.assertThrows(CittadinoException.class, () ->
	 * cittadinoService.getAllCittadiniPaginati(cittadiniPaginatiParam, 0, 10));
	 * assertThatExceptionOfType(CittadinoException.class);
	 * }
	 * 
	 * @Test
	 * public void getDettaglioServiziSchedaCittadinoTest() {
	 * when(this.cittadinoRepository.findDettaglioServiziSchedaCittadino(cittadino.
	 * getId())).thenReturn(listaDettagliCittadinoProjection);
	 * List<DettaglioServizioSchedaCittadinoProjection> dettaglioCittadino =
	 * cittadinoService.getDettaglioServiziSchedaCittadino(cittadino.getId());
	 * assertThat(dettaglioCittadino.size()).isEqualTo(
	 * listaDettagliCittadinoProjection.size());
	 * }
	 * 
	 * @Test
	 * public void getNumeroTotaleCittadiniFacilitatoreByFiltroTest() {
	 * //test con filtro.getIdsSedi() != null
	 * when(this.cittadinoRepository.findAllCittadiniByFiltro(filtro.
	 * getCriterioRicerca(), "%" + filtro.getCriterioRicerca() + "%",
	 * filtro.getIdsSedi(),
	 * cittadiniPaginatiParam.getCfUtenteLoggato())).thenReturn(
	 * listaCittadiniProjection);
	 * Integer numeroTotaleCittadini =
	 * cittadinoService.getNumeroTotaleCittadiniFacilitatoreByFiltro(
	 * cittadiniPaginatiParam);
	 * assertThat(numeroTotaleCittadini).isEqualTo(listaCittadiniProjection.size());
	 * }
	 * 
	 * @Test
	 * public void getNumeroTotaleCittadiniFacilitatoreByFiltroTest2() {
	 * //test con filtro.getIdsSedi() = null
	 * filtro.setIdsSedi(null);
	 * when(this.enteSedeProgettoFacilitatoreService.
	 * getIdsSediFacilitatoreByCodFiscaleAndIdProgettoAndIdEnte(
	 * cittadiniPaginatiParam.getCfUtenteLoggato(),
	 * cittadiniPaginatiParam.getIdProgetto(),
	 * cittadiniPaginatiParam.getIdEnte())).thenReturn(listaIdsSedi);
	 * cittadinoService.getNumeroTotaleCittadiniFacilitatoreByFiltro(
	 * cittadiniPaginatiParam);
	 * }
	 * 
	 * @Test
	 * public void getAllCittadiniFacilitatoreByFiltroTest() {
	 * //test con filtro.getIdsSedi() != null
	 * when(this.cittadinoRepository.findAllCittadiniByFiltro(filtro.
	 * getCriterioRicerca(), "%" + filtro.getCriterioRicerca() + "%",
	 * filtro.getIdsSedi(),
	 * cittadiniPaginatiParam.getCfUtenteLoggato())).thenReturn(
	 * listaCittadiniProjection);
	 * List<CittadinoProjection> listaCittadini =
	 * cittadinoService.getAllCittadiniFacilitatoreByFiltro(cittadiniPaginatiParam);
	 * assertThat(listaCittadini.size()).isEqualTo(listaCittadiniProjection.size());
	 * }
	 * 
	 * @Test
	 * public void getAllCittadiniFacilitatoreByFiltroTest2() {
	 * //test con filtro.getIdsSedi() = null
	 * filtro.setIdsSedi(null);
	 * when(this.enteSedeProgettoFacilitatoreService.
	 * getIdsSediFacilitatoreByCodFiscaleAndIdProgettoAndIdEnte(
	 * cittadiniPaginatiParam.getCfUtenteLoggato(),
	 * cittadiniPaginatiParam.getIdProgetto(),
	 * cittadiniPaginatiParam.getIdEnte())).thenReturn(listaIdsSedi);
	 * when(this.cittadinoRepository.findAllCittadiniByFiltro(
	 * filtro.getCriterioRicerca(),
	 * "%" + filtro.getCriterioRicerca() + "%",
	 * listaIdsSedi,
	 * cittadiniPaginatiParam.getCfUtenteLoggato()
	 * )).thenReturn(listaCittadiniProjection);
	 * List<CittadinoProjection> listaCittadini =
	 * cittadinoService.getAllCittadiniFacilitatoreByFiltro(cittadiniPaginatiParam);
	 * assertThat(listaCittadini.size()).isEqualTo(listaCittadiniProjection.size());
	 * }
	 * 
	 * @Test
	 * public void getAllCittadiniFacilitatorePaginatiByFiltroTest() {
	 * //test con filtro.getIdsSedi() != null
	 * when(this.cittadinoRepository.findAllCittadiniPaginatiByFiltro(
	 * filtro.getCriterioRicerca(),
	 * "%" + filtro.getCriterioRicerca() + "%",
	 * filtro.getIdsSedi(),
	 * cittadiniPaginatiParam.getCfUtenteLoggato(),
	 * 0*10, 10
	 * )).thenReturn(listaCittadiniProjection);
	 * cittadinoService.getAllCittadiniFacilitatorePaginatiByFiltro(
	 * cittadiniPaginatiParam, 0, 10);
	 * }
	 * 
	 * @Test
	 * public void getAllCittadiniFacilitatorePaginatiByFiltroTest2() {
	 * //test con filtro.getIdsSedi() = null
	 * filtro.setIdsSedi(null);
	 * when(this.enteSedeProgettoFacilitatoreService.
	 * getIdsSediFacilitatoreByCodFiscaleAndIdProgettoAndIdEnte(
	 * cittadiniPaginatiParam.getCfUtenteLoggato(),
	 * cittadiniPaginatiParam.getIdProgetto(),
	 * cittadiniPaginatiParam.getIdEnte())).thenReturn(listaIdsSedi);
	 * when(this.cittadinoRepository.findAllCittadiniPaginatiByFiltro(
	 * filtro.getCriterioRicerca(),
	 * "%" + filtro.getCriterioRicerca() + "%",
	 * listaIdsSedi,
	 * cittadiniPaginatiParam.getCfUtenteLoggato(),
	 * 0*10, 10
	 * )).thenReturn(listaCittadiniProjection);
	 * cittadinoService.getAllCittadiniFacilitatorePaginatiByFiltro(
	 * cittadiniPaginatiParam, 0, 10);
	 * }
	 * 
	 * @Test
	 * public void getAllSediDropdownTest() {
	 * SedeProjectionImplementation sedeProjectionImplementation = new
	 * SedeProjectionImplementation();
	 * sedeProjectionImplementation.setId(1L);
	 * sedeProjectionImplementation.setNome("NOMESEDE");
	 * List<SedeProjection> listaSediProjection = new ArrayList<>();
	 * listaSediProjection.add(sedeProjectionImplementation);
	 * when(this.sedeService.getAllSediFacilitatoreFiltrate(cittadiniPaginatiParam))
	 * .thenReturn(listaSediProjection);
	 * List<SedeDto> listaSedi =
	 * cittadinoService.getAllSediDropdown(cittadiniPaginatiParam);
	 * assertThat(listaSedi.size()).isEqualTo(listaSediProjection.size());
	 * }
	 * 
	 * @Test
	 * public void getAllSediDropdownKOTest() {
	 * //test KO per utente non facilitatore o volontario
	 * cittadiniPaginatiParam.setCodiceRuoloUtenteLoggato(RuoloUtenteEnum.DTD.
	 * toString());
	 * Assertions.assertThrows(CittadinoException.class, () ->
	 * cittadinoService.getAllSediDropdown(cittadiniPaginatiParam));
	 * assertThatExceptionOfType(CittadinoException.class);
	 * }
	 * 
	 * @Test
	 * public void isAssociatoAUtenteTest() {
	 * //test per codice fiscale utente loggato = codice fiscale facilitatore (con
	 * ruolo FAC)
	 * sceltaProfiloParam.setCodiceRuoloUtenteLoggato(RuoloUtenteEnum.FAC.toString()
	 * );
	 * Boolean risultato = cittadinoService.isAssociatoAUtente(sceltaProfiloParam,
	 * facilitatore.getCodiceFiscale(), 1L, 1000L);
	 * assertThat(risultato).isEqualTo(true);
	 * 
	 * //test per codice fiscale utente loggato != codice fiscale facilitatore (con
	 * ruolo FAC)
	 * Boolean risultato2 = cittadinoService.isAssociatoAUtente(sceltaProfiloParam,
	 * "CFPROVA", 1L, 1000L);
	 * assertThat(risultato2).isEqualTo(false);
	 * 
	 * //test per codice fiscale utente loggato = codice fiscale facilitatore (con
	 * ruolo VOL)
	 * sceltaProfiloParam.setCodiceRuoloUtenteLoggato(RuoloUtenteEnum.VOL.toString()
	 * );
	 * Boolean risultato3 = cittadinoService.isAssociatoAUtente(sceltaProfiloParam,
	 * facilitatore.getCodiceFiscale(), 1L, 1000L);
	 * assertThat(risultato3).isEqualTo(true);
	 * 
	 * //test per codice fiscale utente loggato != codice fiscale facilitatore (con
	 * ruolo VOL)
	 * sceltaProfiloParam.setCodiceRuoloUtenteLoggato(RuoloUtenteEnum.VOL.toString()
	 * );
	 * Boolean risultato4 = cittadinoService.isAssociatoAUtente(sceltaProfiloParam,
	 * "CFPROVA", 1L, 1000L);
	 * assertThat(risultato4).isEqualTo(false);
	 * 
	 * //test per ruolo utente loggato != FAC & VOL
	 * sceltaProfiloParam.setCodiceRuoloUtenteLoggato(RuoloUtenteEnum.REG.toString()
	 * );
	 * Boolean risultato5 = cittadinoService.isAssociatoAUtente(sceltaProfiloParam,
	 * facilitatore.getCodiceFiscale(), 1L, null);
	 * assertThat(risultato5).isEqualTo(true);
	 * }
	 * 
	 * @Test
	 * public void getCittadinoByCodiceFiscaleOrNumeroDocumentoTest() {
	 * //test per trovare il cittadino tramite numero documento
	 * when(cittadinoRepository.findByNumeroDocumento(cittadino.getNumeroDocumento()
	 * )).thenReturn(Optional.of(cittadino));
	 * Optional<CittadinoEntity> cittadinoTrovato =
	 * cittadinoService.getCittadinoByCodiceFiscaleOrNumeroDocumento(true, null,
	 * cittadino.getNumeroDocumento());
	 * assertThat(cittadinoTrovato.get().getNumeroDocumento()).isEqualTo(cittadino.
	 * getNumeroDocumento());
	 * 
	 * //test per trovare il cittadino tramite codice fiscale
	 * when(cittadinoRepository.findByCodiceFiscale(cittadino.getCodiceFiscale())).
	 * thenReturn(Optional.of(cittadino));
	 * Optional<CittadinoEntity> cittadinoTrovato2 =
	 * cittadinoService.getCittadinoByCodiceFiscaleOrNumeroDocumento(false,
	 * cittadino.getCodiceFiscale(), null);
	 * assertThat(cittadinoTrovato2.get().getCodiceFiscale()).isEqualTo(cittadino.
	 * getCodiceFiscale());
	 * }
	 * 
	 * @Test
	 * public void getCittadinoByCodiceFiscaleOrNumeroDocumentoKOTest() {
	 * //test KO per codice fiscale o numero documento assenti
	 * Assertions.assertThrows(CittadinoException.class, () ->
	 * cittadinoService.getCittadinoByCodiceFiscaleOrNumeroDocumento(false, null,
	 * null));
	 * assertThatExceptionOfType(CittadinoException.class);
	 * }
	 * 
	 * @Test
	 * public void getByCodiceFiscaleOrNumeroDocumentoTest() {
	 * when(this.cittadinoRepository.findByCodiceFiscaleOrNumeroDocumento(cittadino.
	 * getCodiceFiscale(), null)).thenReturn(Optional.of(cittadino));
	 * Optional<CittadinoEntity> cittadinoTrovato =
	 * cittadinoService.getByCodiceFiscaleOrNumeroDocumento(cittadino.
	 * getCodiceFiscale(), null);
	 * assertThat(cittadinoTrovato.get().getCodiceFiscale()).isEqualTo(cittadino.
	 * getCodiceFiscale());
	 * }
	 * 
	 * @Test
	 * public void salvaCittadinoTest() {
	 * when(this.cittadinoRepository.save(cittadino)).thenReturn(cittadino);
	 * cittadinoService.salvaCittadino(cittadino);
	 * }
	 * 
	 * @Test
	 * public void getConsensoByCodiceFiscaleCittadinoOrNumeroDocumento1() {
	 * when(this.cittadinoRepository.findConsensoByCodiceFiscaleCittadino(cittadino.
	 * getCodiceFiscale())).thenReturn("ONLINE");
	 * cittadinoService.getConsensoByCodiceFiscaleCittadinoOrNumeroDocumento(
	 * cittadino.getCodiceFiscale(), null);
	 * }
	 * 
	 * @Test
	 * public void getConsensoByCodiceFiscaleCittadinoOrNumeroDocumento2() {
	 * when(this.cittadinoRepository.findConsensoByNumDocumentoCittadino(cittadino.
	 * getNumeroDocumento())).thenReturn("ONLINE");
	 * cittadinoService.getConsensoByCodiceFiscaleCittadinoOrNumeroDocumento(null,
	 * cittadino.getNumeroDocumento());
	 * }
	 * 
	 * @Test
	 * public void getConsensoByCodiceFiscaleCittadinoOrNumeroDocumento3() {
	 * String consenso =
	 * cittadinoService.getConsensoByCodiceFiscaleCittadinoOrNumeroDocumento(null,
	 * null);
	 * assertNull(consenso);
	 * }
	 * 
	 * @Test
	 * public void getSchedaCittadinoByIdTest() {
	 * DettaglioCittadinoBean dettaglioCittadinoBean = new DettaglioCittadinoBean();
	 * dettaglioCittadinoBean.setNome(cittadino.getNome());
	 * dettaglioCittadinoBean.setCodiceFiscale(cittadino.getCodiceFiscale());
	 * DettaglioServizioSchedaCittadinoProjectionImplementation dettaglioCittadino =
	 * new DettaglioServizioSchedaCittadinoProjectionImplementation();
	 * dettaglioCittadino.setCodiceFiscaleFacilitatore(facilitatore.getCodiceFiscale
	 * ());
	 * dettaglioCittadino.setIdProgetto(1L);
	 * dettaglioCittadino.setIdQuestionarioCompilato("1L");
	 * dettaglioCittadino.setIdServizio(1L);
	 * dettaglioCittadino.setNomeServizio("NOMESERVIZIO");
	 * dettaglioCittadino.setStatoQuestionarioCompilato("ATTIVO");
	 * List<DettaglioServizioSchedaCittadinoProjection> listaDettaglioCittadino =
	 * new ArrayList<>();
	 * listaDettaglioCittadino.add(dettaglioCittadino);
	 * when(this.cittadinoRepository.findById(cittadino.getId())).thenReturn(
	 * Optional.of(cittadino));
	 * when(this.cittadinoMapper.toDettaglioCittadinoBeanFrom(cittadino)).thenReturn
	 * (dettaglioCittadinoBean);
	 * when(this.cittadinoRepository.findDettaglioServiziSchedaCittadino(cittadino.
	 * getId())).thenReturn(listaDettaglioCittadino);
	 * when(this.enteSedeProgettoFacilitatoreService.
	 * getNomeCompletoFacilitatoreByCodiceFiscale(dettaglioCittadino.
	 * getCodiceFiscaleFacilitatore())).thenReturn(facilitatore.getNome());
	 * SchedaCittadinoBean cittadinoTrovato =
	 * cittadinoService.getSchedaCittadinoById(cittadino.getId(),
	 * sceltaProfiloParam);
	 * assertThat(cittadinoTrovato.getDettaglioCittadino().getCodiceFiscale()).
	 * isEqualTo(cittadino.getCodiceFiscale());
	 * }
	 * 
	 * @Test
	 * public void aggiornaCittadinoTest() {
	 * QuestionarioCompilatoEntity questionarioCompilatoEntity = new
	 * QuestionarioCompilatoEntity();
	 * questionarioCompilatoEntity.setId("1");
	 * List<QuestionarioCompilatoEntity> listaQuestionariCompilati = new
	 * ArrayList<>();
	 * listaQuestionariCompilati.add(questionarioCompilatoEntity);
	 * QuestionarioCompilatoCollection questionarioCompilatoCollection = new
	 * QuestionarioCompilatoCollection();
	 * questionarioCompilatoCollection.setIdQuestionarioCompilato("1");
	 * when(this.cittadinoRepository.findById(cittadino.getId())).thenReturn(
	 * Optional.of(cittadino));
	 * when(this.cittadinoMapper.toEntityFrom(cittadinoRequest)).thenReturn(
	 * cittadino);
	 * when(this.cittadinoRepository.save(cittadino)).thenReturn(cittadino);
	 * when(this.questionarioCompilatoRepository.
	 * findQuestionariCompilatiByCittadinoAndStatoNonCompilato(1L)).thenReturn(
	 * listaQuestionariCompilati);
	 * when(this.questionarioCompilatoMongoRepository.findQuestionarioCompilatoById(
	 * questionarioCompilatoEntity.getId())).thenReturn(Optional.of(
	 * questionarioCompilatoCollection));
	 * doNothing().when(this.questionarioCompilatoMongoRepository).
	 * deleteByIdQuestionarioTemplate(questionarioCompilatoCollection.
	 * getIdQuestionarioCompilato());
	 * when(this.questionarioCompilatoMongoRepository.save(Mockito.any(
	 * QuestionarioCompilatoCollection.class))).thenReturn(
	 * questionarioCompilatoCollection);
	 * cittadinoService.aggiornaCittadino(1L, cittadinoRequest);
	 * }
	 * 
	 * @Test
	 * public void aggiornaCittadinoKOTest() {
	 * //test KO per cittadino non trovato
	 * when(this.cittadinoRepository.findById(cittadino.getId())).thenReturn(
	 * Optional.empty());
	 * Assertions.assertThrows(CittadinoException.class, () ->
	 * cittadinoService.aggiornaCittadino(1L, cittadinoRequest));
	 * assertThatExceptionOfType(CittadinoException.class);
	 * 
	 * //test KO per questionario compilato non trovato
	 * QuestionarioCompilatoEntity questionarioCompilatoEntity = new
	 * QuestionarioCompilatoEntity();
	 * questionarioCompilatoEntity.setId("1");
	 * List<QuestionarioCompilatoEntity> listaQuestionariCompilati = new
	 * ArrayList<>();
	 * listaQuestionariCompilati.add(questionarioCompilatoEntity);
	 * QuestionarioCompilatoCollection questionarioCompilatoCollection = new
	 * QuestionarioCompilatoCollection();
	 * questionarioCompilatoCollection.setIdQuestionarioCompilato("1");
	 * when(this.cittadinoRepository.findById(cittadino.getId())).thenReturn(
	 * Optional.of(cittadino));
	 * when(this.cittadinoMapper.toEntityFrom(cittadinoRequest)).thenReturn(
	 * cittadino);
	 * when(this.cittadinoRepository.save(cittadino)).thenReturn(cittadino);
	 * when(this.questionarioCompilatoRepository.
	 * findQuestionariCompilatiByCittadinoAndStatoNonCompilato(1L)).thenReturn(
	 * listaQuestionariCompilati);
	 * when(this.questionarioCompilatoMongoRepository.findQuestionarioCompilatoById(
	 * questionarioCompilatoEntity.getId())).thenReturn(Optional.empty());
	 * Assertions.assertThrows(QuestionarioCompilatoException.class, () ->
	 * cittadinoService.aggiornaCittadino(1L, cittadinoRequest));
	 * assertThatExceptionOfType(QuestionarioCompilatoException.class);
	 * }
	 * 
	 * @Setter
	 * public class DettaglioServizioSchedaCittadinoProjectionImplementation
	 * implements DettaglioServizioSchedaCittadinoProjection {
	 * 
	 * private Long idServizio;
	 * private Long idEnte;
	 * private String nomeServizio;
	 * private Long idProgetto;
	 * private String codiceFiscaleFacilitatore;
	 * private String idQuestionarioCompilato;
	 * private String statoQuestionarioCompilato;
	 * private String nomeSede;
	 * 
	 * @Override
	 * public Long getIdServizio() {
	 * return idServizio;
	 * }
	 * 
	 * @Override
	 * public Long getIdEnte() {
	 * return idEnte;
	 * }
	 * 
	 * @Override
	 * public String getNomeServizio() {
	 * return nomeServizio;
	 * }
	 * 
	 * @Override
	 * public Long getIdProgetto() {
	 * return idProgetto;
	 * }
	 * 
	 * @Override
	 * public String getCodiceFiscaleFacilitatore() {
	 * return codiceFiscaleFacilitatore;
	 * }
	 * 
	 * @Override
	 * public String getIdQuestionarioCompilato() {
	 * return idQuestionarioCompilato;
	 * }
	 * 
	 * @Override
	 * public String getStatoQuestionarioCompilato() {
	 * return statoQuestionarioCompilato;
	 * }
	 * 
	 * @Override
	 * public String getNomeSede() {
	 * return nomeSede;
	 * }
	 * }
	 * 
	 * @Setter
	 * public class CittadinoProjectionImplementation implements CittadinoProjection
	 * {
	 * private Long id;
	 * private String codiceFiscale;
	 * private Long numeroServizi;
	 * private Long numeroQuestionariCompilati;
	 * 
	 * @Override
	 * public Long getId() {
	 * return id;
	 * }
	 * 
	 * @Override
	 * public String getCodiceFiscale() {
	 * return codiceFiscale;
	 * }
	 * 
	 * @Override
	 * public Long getNumeroServizi() {
	 * return numeroServizi;
	 * }
	 * 
	 * @Override
	 * public Long getNumeroQuestionariCompilati() {
	 * return numeroQuestionariCompilati;
	 * }
	 * }
	 * 
	 * @Setter
	 * public class SedeProjectionImplementation implements SedeProjection {
	 * private Long id;
	 * private String nome;
	 * 
	 * @Override
	 * public Long getId() {
	 * return id;
	 * }
	 * 
	 * @Override
	 * public String getNome() {
	 * return nome;
	 * }
	 * }
	 */
}
