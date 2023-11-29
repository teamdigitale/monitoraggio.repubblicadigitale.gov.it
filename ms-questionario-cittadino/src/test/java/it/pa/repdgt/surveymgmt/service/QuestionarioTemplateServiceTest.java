package it.pa.repdgt.surveymgmt.service;

import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
public class QuestionarioTemplateServiceTest {

	/*
	 * @Mock
	 * private QuestionarioTemplateMapper questionarioTemplateMapper;
	 * 
	 * @Mock
	 * private QuestionarioTemplateSqlService questionarioTemplateSqlService;
	 * 
	 * @Mock
	 * private ProgrammaXQuestionarioTemplateService
	 * programmaXQuestionarioTemplateService;
	 * 
	 * @Mock
	 * private RuoloService ruoloService;
	 * 
	 * @Mock
	 * private QuestionarioTemplateRepository questionarioTemplateRepository;
	 * 
	 * @Mock
	 * private ProgrammaService programmaService;
	 * 
	 * @Autowired
	 * 
	 * @InjectMocks
	 * private QuestionarioTemplateService questionarioTemplateService;
	 * 
	 * SceltaProfiloParam sceltaProfilazione;
	 * FiltroListaQuestionariTemplateParam filtroListaQuestionariTemplate;
	 * List<RuoloEntity> listaRuoli;
	 * RuoloEntity ruolo;
	 * QuestionarioTemplateEntity questionarioTemplateEntity;
	 * QuestionarioTemplateCollection questionarioTemplateCollection;
	 * List<QuestionarioTemplateEntity> listaQuestionari;
	 * List<String> listaStati;
	 * ProgrammaEntity programma;
	 * ProgrammaXQuestionarioTemplateKey programmaXQuestionarioTemplateKey;
	 * ProgrammaXQuestionarioTemplateEntity programmaXQuestionarioTemplateEntity;
	 * List<ProgrammaXQuestionarioTemplateEntity> listaProgrammaXQuestionario;
	 * 
	 * @BeforeEach
	 * public void setUp() {
	 * sceltaProfilazione = new SceltaProfiloParam();
	 * sceltaProfilazione.setCfUtenteLoggato("CFUTENTE");
	 * sceltaProfilazione.setCodiceRuoloUtenteLoggato(RuoloUtenteEnum.DTD.toString()
	 * );
	 * sceltaProfilazione.setIdProgetto(1L);
	 * sceltaProfilazione.setIdProgramma(1L);
	 * filtroListaQuestionariTemplate = new FiltroListaQuestionariTemplateParam();
	 * filtroListaQuestionariTemplate.setCriterioRicerca("CRITERIORICERCA");
	 * filtroListaQuestionariTemplate.setCurrPage(0);
	 * filtroListaQuestionariTemplate.setPageSize(10);
	 * filtroListaQuestionariTemplate.setStatoQuestionario("ATTIVO");
	 * ruolo = new RuoloEntity();
	 * ruolo.setCodice("DTD");
	 * listaRuoli = new ArrayList<>();
	 * listaRuoli.add(ruolo);
	 * questionarioTemplateEntity = new QuestionarioTemplateEntity();
	 * questionarioTemplateEntity.setId("IDQUESTIONARIO");
	 * listaQuestionari = new ArrayList<>();
	 * listaQuestionari.add(questionarioTemplateEntity);
	 * listaStati = new ArrayList<>();
	 * listaStati.add("ATTIVO");
	 * listaStati.add("NON ATTIVO");
	 * questionarioTemplateCollection = new QuestionarioTemplateCollection();
	 * questionarioTemplateCollection.setIdQuestionarioTemplate("IDQUESTIONARIO");
	 * questionarioTemplateCollection.setStato("ATTIVO");
	 * programma = new ProgrammaEntity();
	 * programma.setId(1L);
	 * programmaXQuestionarioTemplateKey = new ProgrammaXQuestionarioTemplateKey(1L,
	 * "IDQUESTIONARIO");
	 * programmaXQuestionarioTemplateEntity = new
	 * ProgrammaXQuestionarioTemplateEntity();
	 * programmaXQuestionarioTemplateEntity.setProgrammaXQuestionarioTemplateKey(
	 * programmaXQuestionarioTemplateKey);
	 * listaProgrammaXQuestionario = new ArrayList<>();
	 * listaProgrammaXQuestionario.add(programmaXQuestionarioTemplateEntity);
	 * }
	 * 
	 * @Test
	 * public void getNumeroTotaleQuestionariTemplateByFiltroTest() {
	 * when(this.questionarioTemplateSqlService.
	 * getNumeroTotaleQuestionariTemplateByFiltro("CRITERIORICERCA",
	 * "ATTIVO")).thenReturn(1L);
	 * Long risultato =
	 * questionarioTemplateService.getNumeroTotaleQuestionariTemplateByFiltro(
	 * "CRITERIORICERCA", "ATTIVO", sceltaProfilazione);
	 * assertThat(risultato).isEqualTo(1L);
	 * }
	 * 
	 * @Test
	 * public void getAllQuestionariTemplatePaginatiByProfilazioneAndFiltroDTDTest()
	 * {
	 * //test con ruoloUtenteLoggato = DTD
	 * when(this.questionarioTemplateSqlService.
	 * findAllQuestionariTemplatePaginatiByFiltro(
	 * "%" + filtroListaQuestionariTemplate.getCriterioRicerca() + "%",
	 * filtroListaQuestionariTemplate.getStatoQuestionario(),
	 * filtroListaQuestionariTemplate.getCurrPage(),
	 * filtroListaQuestionariTemplate.getPageSize()
	 * )).thenReturn(listaQuestionari);
	 * List<QuestionarioTemplateEntity> risultato = questionarioTemplateService.
	 * getAllQuestionariTemplatePaginatiByProfilazioneAndFiltro(sceltaProfilazione,
	 * filtroListaQuestionariTemplate);
	 * assertThat(risultato.size()).isEqualTo(listaQuestionari.size());
	 * }
	 * 
	 * @Test
	 * public void
	 * getAllQuestionariTemplatePaginatiByProfilazioneAndFiltroDSCUTest() {
	 * //test con ruoloUtenteLoggato = DSCU
	 * ruolo.setCodice("DSCU");
	 * listaRuoli = new ArrayList<>();
	 * listaRuoli.add(ruolo);
	 * sceltaProfilazione.setCodiceRuoloUtenteLoggato(RuoloUtenteEnum.DSCU.toString(
	 * ));
	 * when(this.questionarioTemplateSqlService.
	 * findQuestionariTemplatePaginatiByDefaultPolicySCDAndFiltro(
	 * "%" + filtroListaQuestionariTemplate.getCriterioRicerca() + "%",
	 * filtroListaQuestionariTemplate.getStatoQuestionario(),
	 * filtroListaQuestionariTemplate.getCurrPage(),
	 * filtroListaQuestionariTemplate.getPageSize()
	 * )).thenReturn(listaQuestionari);
	 * List<QuestionarioTemplateEntity> risultato = questionarioTemplateService.
	 * getAllQuestionariTemplatePaginatiByProfilazioneAndFiltro(sceltaProfilazione,
	 * filtroListaQuestionariTemplate);
	 * assertThat(risultato.size()).isEqualTo(listaQuestionari.size());
	 * }
	 * 
	 * @Test
	 * public void getAllQuestionariTemplatePaginatiByProfilazioneAndFiltroREGTest()
	 * {
	 * //test con ruoloUtenteLoggato = REG/DEG
	 * ruolo.setCodice("REG");
	 * listaRuoli = new ArrayList<>();
	 * listaRuoli.add(ruolo);
	 * sceltaProfilazione.setCodiceRuoloUtenteLoggato(RuoloUtenteEnum.REG.toString()
	 * );
	 * when(this.questionarioTemplateSqlService.
	 * findQuestionariTemplatePaginatiByIdProgrammaAndFiltro(
	 * sceltaProfilazione.getIdProgramma(),
	 * "%" + filtroListaQuestionariTemplate.getCriterioRicerca() + "%",
	 * filtroListaQuestionariTemplate.getStatoQuestionario(),
	 * filtroListaQuestionariTemplate.getCurrPage(),
	 * filtroListaQuestionariTemplate.getPageSize()
	 * )).thenReturn(listaQuestionari);
	 * List<QuestionarioTemplateEntity> risultato = questionarioTemplateService.
	 * getAllQuestionariTemplatePaginatiByProfilazioneAndFiltro(sceltaProfilazione,
	 * filtroListaQuestionariTemplate);
	 * assertThat(risultato.size()).isEqualTo(listaQuestionari.size());
	 * }
	 * 
	 * @Test
	 * public void
	 * getAllQuestionariTemplatePaginatiByProfilazioneAndFiltroConRuoliNonAutorizzatiTest
	 * () {
	 * //test con ruoloUtenteLoggato = REGP/DEGP/REPP/DEPP/FAC/VOL
	 * //ruoli che non devono visualizzare i questionari
	 * ruolo.setCodice("REGP");
	 * listaRuoli = new ArrayList<>();
	 * listaRuoli.add(ruolo);
	 * sceltaProfilazione.setCodiceRuoloUtenteLoggato(RuoloUtenteEnum.REGP.toString(
	 * ));
	 * List<QuestionarioTemplateEntity> risultato = questionarioTemplateService.
	 * getAllQuestionariTemplatePaginatiByProfilazioneAndFiltro(sceltaProfilazione,
	 * filtroListaQuestionariTemplate);
	 * assertThat(risultato.size()).isEqualTo(0);
	 * }
	 * 
	 * @Test
	 * public void
	 * getAllQuestionariTemplateByProfilazioneAndFiltroConPaginazioneDTDTest() {
	 * //test con ruoloUtenteLoggato = DTD
	 * when(this.questionarioTemplateSqlService.
	 * findAllQuestionariTemplatePaginatiByFiltro(
	 * "%" + filtroListaQuestionariTemplate.getCriterioRicerca() + "%",
	 * filtroListaQuestionariTemplate.getStatoQuestionario(),
	 * filtroListaQuestionariTemplate.getCurrPage(),
	 * filtroListaQuestionariTemplate.getPageSize()
	 * )).thenReturn(listaQuestionari);
	 * List<QuestionarioTemplateEntity> risultato = questionarioTemplateService.
	 * getAllQuestionariTemplateByProfilazioneAndFiltroConPaginazione(
	 * sceltaProfilazione, filtroListaQuestionariTemplate);
	 * assertThat(risultato.size()).isEqualTo(listaQuestionari.size());
	 * }
	 * 
	 * @Test
	 * public void
	 * getAllQuestionariTemplateByProfilazioneAndFiltroConPaginazioneDSCUTest() {
	 * //test con ruoloUtenteLoggato = DSCU
	 * ruolo.setCodice("DSCU");
	 * listaRuoli = new ArrayList<>();
	 * listaRuoli.add(ruolo);
	 * sceltaProfilazione.setCodiceRuoloUtenteLoggato(RuoloUtenteEnum.DSCU.toString(
	 * ));
	 * when(this.questionarioTemplateSqlService.
	 * findQuestionariTemplatePaginatiByDefaultPolicySCDAndFiltro(
	 * "%" + filtroListaQuestionariTemplate.getCriterioRicerca() + "%",
	 * filtroListaQuestionariTemplate.getStatoQuestionario(),
	 * filtroListaQuestionariTemplate.getCurrPage(),
	 * filtroListaQuestionariTemplate.getPageSize()
	 * )).thenReturn(listaQuestionari);
	 * List<QuestionarioTemplateEntity> risultato = questionarioTemplateService.
	 * getAllQuestionariTemplateByProfilazioneAndFiltroConPaginazione(
	 * sceltaProfilazione, filtroListaQuestionariTemplate);
	 * assertThat(risultato.size()).isEqualTo(listaQuestionari.size());
	 * }
	 * 
	 * @Test
	 * public void
	 * getAllQuestionariTemplateByProfilazioneAndFiltroConPaginazioneREGTest() {
	 * //test con ruoloUtenteLoggato = REG/DEG
	 * ruolo.setCodice("REG");
	 * listaRuoli = new ArrayList<>();
	 * listaRuoli.add(ruolo);
	 * sceltaProfilazione.setCodiceRuoloUtenteLoggato(RuoloUtenteEnum.REG.toString()
	 * );
	 * when(this.questionarioTemplateSqlService.
	 * findQuestionariTemplatePaginatiByIdProgrammaAndFiltro(
	 * sceltaProfilazione.getIdProgramma(),
	 * "%" + filtroListaQuestionariTemplate.getCriterioRicerca() + "%",
	 * filtroListaQuestionariTemplate.getStatoQuestionario(),
	 * filtroListaQuestionariTemplate.getCurrPage(),
	 * filtroListaQuestionariTemplate.getPageSize()
	 * )).thenReturn(listaQuestionari);
	 * List<QuestionarioTemplateEntity> risultato = questionarioTemplateService.
	 * getAllQuestionariTemplateByProfilazioneAndFiltroConPaginazione(
	 * sceltaProfilazione, filtroListaQuestionariTemplate);
	 * assertThat(risultato.size()).isEqualTo(listaQuestionari.size());
	 * }
	 * 
	 * @Test
	 * public void
	 * getAllQuestionariTemplateByProfilazioneAndFiltroConPaginazioneConRuoliNonAutorizzatiTest
	 * () {
	 * //test con ruoloUtenteLoggato = REGP/DEGP/REPP/DEPP/FAC/VOL
	 * //ruoli che non devono visualizzare i questionari
	 * ruolo.setCodice("REGP");
	 * listaRuoli = new ArrayList<>();
	 * listaRuoli.add(ruolo);
	 * sceltaProfilazione.setCodiceRuoloUtenteLoggato(RuoloUtenteEnum.REGP.toString(
	 * ));
	 * List<QuestionarioTemplateEntity> risultato = questionarioTemplateService.
	 * getAllQuestionariTemplateByProfilazioneAndFiltroConPaginazione(
	 * sceltaProfilazione, filtroListaQuestionariTemplate);
	 * assertThat(risultato.size()).isEqualTo(0);
	 * }
	 * 
	 * @Test
	 * public void
	 * getAllQuestionariTemplateByProfilazioneAndFiltroSenzaPaginazioneDTDTest() {
	 * //test con ruoloUtenteLoggato = DTD
	 * when(this.questionarioTemplateSqlService.findAllQuestionariTemplateByFiltro(
	 * "%" + filtroListaQuestionariTemplate.getCriterioRicerca() + "%",
	 * filtroListaQuestionariTemplate.getStatoQuestionario()
	 * )).thenReturn(listaQuestionari);
	 * List<QuestionarioTemplateEntity> risultato = questionarioTemplateService.
	 * getAllQuestionariTemplateByProfilazioneAndFiltroSenzaPaginazione(
	 * sceltaProfilazione, filtroListaQuestionariTemplate);
	 * assertThat(risultato.size()).isEqualTo(listaQuestionari.size());
	 * }
	 * 
	 * @Test
	 * public void
	 * getAllQuestionariTemplateByProfilazioneAndFiltroSenzaPaginazioneDSCUTest() {
	 * //test con ruoloUtenteLoggato = DSCU
	 * ruolo.setCodice("DSCU");
	 * listaRuoli = new ArrayList<>();
	 * listaRuoli.add(ruolo);
	 * sceltaProfilazione.setCodiceRuoloUtenteLoggato(RuoloUtenteEnum.DSCU.toString(
	 * ));
	 * when(this.questionarioTemplateSqlService.
	 * findQuestionariTemplateByDefaultPolicySCDAndFiltro(
	 * "%" + filtroListaQuestionariTemplate.getCriterioRicerca() + "%",
	 * filtroListaQuestionariTemplate.getStatoQuestionario()
	 * )).thenReturn(listaQuestionari);
	 * List<QuestionarioTemplateEntity> risultato = questionarioTemplateService.
	 * getAllQuestionariTemplateByProfilazioneAndFiltroSenzaPaginazione(
	 * sceltaProfilazione, filtroListaQuestionariTemplate);
	 * assertThat(risultato.size()).isEqualTo(listaQuestionari.size());
	 * }
	 * 
	 * @Test
	 * public void
	 * getAllQuestionariTemplateByProfilazioneAndFiltroSenzaPaginazioneREGTest() {
	 * //test con ruoloUtenteLoggato = REG/DEG
	 * ruolo.setCodice("REG");
	 * listaRuoli = new ArrayList<>();
	 * listaRuoli.add(ruolo);
	 * sceltaProfilazione.setCodiceRuoloUtenteLoggato(RuoloUtenteEnum.REG.toString()
	 * );
	 * when(this.questionarioTemplateSqlService.
	 * findQuestionariTemplateByIdProgrammaAndFiltro(
	 * sceltaProfilazione.getIdProgramma(),
	 * "%" + filtroListaQuestionariTemplate.getCriterioRicerca() + "%",
	 * filtroListaQuestionariTemplate.getStatoQuestionario()
	 * )).thenReturn(listaQuestionari);
	 * List<QuestionarioTemplateEntity> risultato = questionarioTemplateService.
	 * getAllQuestionariTemplateByProfilazioneAndFiltroSenzaPaginazione(
	 * sceltaProfilazione, filtroListaQuestionariTemplate);
	 * assertThat(risultato.size()).isEqualTo(listaQuestionari.size());
	 * }
	 * 
	 * @Test
	 * public void
	 * getAllQuestionariTemplateByProfilazioneAndFiltroSenzaPaginazioneConRuoliNonAutorizzatiTest
	 * () {
	 * //test con ruoloUtenteLoggato = REGP/DEGP/REPP/DEPP/FAC/VOL
	 * //ruoli che non devono visualizzare i questionari
	 * ruolo.setCodice("REGP");
	 * listaRuoli = new ArrayList<>();
	 * listaRuoli.add(ruolo);
	 * sceltaProfilazione.setCodiceRuoloUtenteLoggato(RuoloUtenteEnum.REGP.toString(
	 * ));
	 * List<QuestionarioTemplateEntity> risultato = questionarioTemplateService.
	 * getAllQuestionariTemplateByProfilazioneAndFiltroSenzaPaginazione(
	 * sceltaProfilazione, filtroListaQuestionariTemplate);
	 * assertThat(risultato.size()).isEqualTo(0);
	 * }
	 * 
	 * @Test
	 * public void getAllStatiDropdownByProfilazioneAndFiltroDTDTest() {
	 * //test con ruoloUtenteLoggato = DTD
	 * when(this.questionarioTemplateSqlService.findAllStatiDropdownByFiltro(
	 * "%" + filtroListaQuestionariTemplate.getCriterioRicerca() + "%",
	 * filtroListaQuestionariTemplate.getStatoQuestionario()
	 * )).thenReturn(listaStati);
	 * List<String> risultato =
	 * questionarioTemplateService.getAllStatiDropdownByProfilazioneAndFiltro(
	 * sceltaProfilazione, filtroListaQuestionariTemplate);
	 * assertThat(risultato.size()).isEqualTo(listaStati.size());
	 * }
	 * 
	 * @Test
	 * public void getAllStatiDropdownByProfilazioneAndFiltroDSCUTest() {
	 * //test con ruoloUtenteLoggato = DSCU
	 * ruolo.setCodice("DSCU");
	 * listaRuoli = new ArrayList<>();
	 * listaRuoli.add(ruolo);
	 * sceltaProfilazione.setCodiceRuoloUtenteLoggato(RuoloUtenteEnum.DSCU.toString(
	 * ));
	 * when(this.questionarioTemplateSqlService.
	 * findStatiDropdownByDefaultPolicySCDAndFiltro(
	 * "%" + filtroListaQuestionariTemplate.getCriterioRicerca() + "%",
	 * filtroListaQuestionariTemplate.getStatoQuestionario()
	 * )).thenReturn(listaStati);
	 * List<String> risultato =
	 * questionarioTemplateService.getAllStatiDropdownByProfilazioneAndFiltro(
	 * sceltaProfilazione, filtroListaQuestionariTemplate);
	 * assertThat(risultato.size()).isEqualTo(listaStati.size());
	 * }
	 * 
	 * @Test
	 * public void getAllStatiDropdownByProfilazioneAndFiltroREGTest() {
	 * //test con ruoloUtenteLoggato = REG/DEG
	 * ruolo.setCodice("REG");
	 * listaRuoli = new ArrayList<>();
	 * listaRuoli.add(ruolo);
	 * sceltaProfilazione.setCodiceRuoloUtenteLoggato(RuoloUtenteEnum.REG.toString()
	 * );
	 * when(this.questionarioTemplateSqlService.
	 * findStatiDropdownByIdProgrammaAndFiltro(
	 * sceltaProfilazione.getIdProgramma(),
	 * "%" + filtroListaQuestionariTemplate.getCriterioRicerca() + "%",
	 * filtroListaQuestionariTemplate.getStatoQuestionario()
	 * )).thenReturn(listaStati);
	 * List<String> risultato =
	 * questionarioTemplateService.getAllStatiDropdownByProfilazioneAndFiltro(
	 * sceltaProfilazione, filtroListaQuestionariTemplate);
	 * assertThat(risultato.size()).isEqualTo(listaStati.size());
	 * }
	 * 
	 * @Test
	 * public void
	 * getAllStatiDropdownByProfilazioneAndFiltroConRuoliNonAutorizzatiTest() {
	 * //test con ruoloUtenteLoggato = REGP/DEGP/REPP/DEPP/FAC/VOL
	 * //ruoli che non devono visualizzare i questionari
	 * ruolo.setCodice("REGP");
	 * listaRuoli = new ArrayList<>();
	 * listaRuoli.add(ruolo);
	 * sceltaProfilazione.setCodiceRuoloUtenteLoggato(RuoloUtenteEnum.REGP.toString(
	 * ));
	 * List<String> risultato =
	 * questionarioTemplateService.getAllStatiDropdownByProfilazioneAndFiltro(
	 * sceltaProfilazione, filtroListaQuestionariTemplate);
	 * assertThat(risultato.size()).isEqualTo(0);
	 * }
	 * 
	 * @Test
	 * public void getQuestionarioTemplateByIdTest() {
	 * when(this.questionarioTemplateRepository.findTemplateQuestionarioById(
	 * questionarioTemplateCollection.getIdQuestionarioTemplate())).thenReturn(
	 * Optional.of(questionarioTemplateCollection));
	 * QuestionarioTemplateCollection risultato =
	 * questionarioTemplateService.getQuestionarioTemplateById(
	 * questionarioTemplateCollection.getIdQuestionarioTemplate());
	 * assertThat(risultato.getIdQuestionarioTemplate()).isEqualTo(
	 * questionarioTemplateCollection.getIdQuestionarioTemplate());
	 * }
	 * 
	 * @Test
	 * public void getQuestionarioTemplateByIdKOTest() {
	 * //test KO per questionario non trovato
	 * when(this.questionarioTemplateRepository.findTemplateQuestionarioById(
	 * questionarioTemplateCollection.getIdQuestionarioTemplate())).thenReturn(
	 * Optional.empty());
	 * Assertions.assertThrows(ResourceNotFoundException.class, () ->
	 * questionarioTemplateService.getQuestionarioTemplateById(
	 * questionarioTemplateCollection.getIdQuestionarioTemplate()));
	 * assertThatExceptionOfType(ResourceNotFoundException.class);
	 * }
	 * 
	 * @Test
	 * public void creaNuovoQuestionarioTemplateTest() {
	 * when(this.questionarioTemplateMapper.toEntityFrom(
	 * questionarioTemplateCollection)).thenReturn(questionarioTemplateEntity);
	 * questionarioTemplateService.creaNuovoQuestionarioTemplate(
	 * questionarioTemplateCollection);
	 * }
	 * 
	 * @Test
	 * public void aggiornaQuestionarioTemplateTest() {
	 * when(this.questionarioTemplateRepository.findTemplateQuestionarioById(
	 * questionarioTemplateCollection.getIdQuestionarioTemplate())).thenReturn(
	 * Optional.of(questionarioTemplateCollection));
	 * when(this.questionarioTemplateSqlService.getQuestionarioTemplateById(
	 * questionarioTemplateCollection.getIdQuestionarioTemplate())).thenReturn(
	 * questionarioTemplateEntity);
	 * questionarioTemplateService.aggiornaQuestionarioTemplate(
	 * questionarioTemplateCollection.getIdQuestionarioTemplate(),
	 * questionarioTemplateCollection);
	 * }
	 * 
	 * @Test
	 * public void aggiornaQuestionarioTemplateKOTest() {
	 * //test KO per questionario non trovato
	 * when(this.questionarioTemplateRepository.findTemplateQuestionarioById(
	 * questionarioTemplateCollection.getIdQuestionarioTemplate())).thenReturn(
	 * Optional.empty());
	 * Assertions.assertThrows(QuestionarioTemplateException.class, () ->
	 * questionarioTemplateService.aggiornaQuestionarioTemplate(
	 * questionarioTemplateCollection.getIdQuestionarioTemplate(),
	 * questionarioTemplateCollection));
	 * assertThatExceptionOfType(QuestionarioTemplateException.class);
	 * 
	 * //test KO per questionario non aggiornabile
	 * questionarioTemplateCollection.setStato("QUESTIONARIONONMODIFICABILE");
	 * when(this.questionarioTemplateRepository.findTemplateQuestionarioById(
	 * questionarioTemplateCollection.getIdQuestionarioTemplate())).thenReturn(
	 * Optional.of(questionarioTemplateCollection));
	 * Assertions.assertThrows(QuestionarioTemplateException.class, () ->
	 * questionarioTemplateService.aggiornaQuestionarioTemplate(
	 * questionarioTemplateCollection.getIdQuestionarioTemplate(),
	 * questionarioTemplateCollection));
	 * assertThatExceptionOfType(QuestionarioTemplateException.class);
	 * }
	 * 
	 * @Test
	 * public void cancellaQuestionarioTemplateTest() {
	 * questionarioTemplateEntity.setStato("NON ATTIVO");
	 * questionarioTemplateEntity.setDefaultRFD(false);
	 * questionarioTemplateEntity.setDefaultSCD(false);
	 * when(this.questionarioTemplateRepository.findTemplateQuestionarioById(
	 * questionarioTemplateCollection.getIdQuestionarioTemplate())).thenReturn(
	 * Optional.of(questionarioTemplateCollection));
	 * when(this.questionarioTemplateSqlService.getQuestionarioTemplateById(
	 * questionarioTemplateCollection.getIdQuestionarioTemplate())).thenReturn(
	 * questionarioTemplateEntity);
	 * doNothing().when(this.programmaXQuestionarioTemplateService).
	 * deleteByQuestionarioTemplate(questionarioTemplateCollection.
	 * getIdQuestionarioTemplate());
	 * doNothing().when(this.questionarioTemplateSqlService).
	 * cancellaQuestionarioTemplate(questionarioTemplateCollection.
	 * getIdQuestionarioTemplate());
	 * doNothing().when(this.questionarioTemplateRepository).
	 * deleteByIdQuestionarioTemplate(questionarioTemplateCollection.
	 * getIdQuestionarioTemplate());
	 * questionarioTemplateService.cancellaQuestionarioTemplate(
	 * questionarioTemplateCollection.getIdQuestionarioTemplate());
	 * }
	 * 
	 * @Test
	 * public void cancellaQuestionarioTemplateKOTest() {
	 * //test KO per questionario non trovato
	 * when(this.questionarioTemplateRepository.findTemplateQuestionarioById(
	 * questionarioTemplateCollection.getIdQuestionarioTemplate())).thenReturn(
	 * Optional.empty());
	 * Assertions.assertThrows(QuestionarioTemplateException.class, () ->
	 * questionarioTemplateService.cancellaQuestionarioTemplate(
	 * questionarioTemplateCollection.getIdQuestionarioTemplate()));
	 * assertThatExceptionOfType(QuestionarioTemplateException.class);
	 * 
	 * //test KO per questionario non cancellabile
	 * questionarioTemplateEntity.setDefaultRFD(true);
	 * when(this.questionarioTemplateRepository.findTemplateQuestionarioById(
	 * questionarioTemplateCollection.getIdQuestionarioTemplate())).thenReturn(
	 * Optional.of(questionarioTemplateCollection));
	 * when(this.questionarioTemplateSqlService.getQuestionarioTemplateById(
	 * questionarioTemplateCollection.getIdQuestionarioTemplate())).thenReturn(
	 * questionarioTemplateEntity);
	 * Assertions.assertThrows(QuestionarioTemplateException.class, () ->
	 * questionarioTemplateService.cancellaQuestionarioTemplate(
	 * questionarioTemplateCollection.getIdQuestionarioTemplate()));
	 * assertThatExceptionOfType(QuestionarioTemplateException.class);
	 * }
	 * 
	 * @Test
	 * public void getQuestionariTemplateByUtenteDTDTest() {
	 * //test con ruoloUtenteLoggato = DTD
	 * when(this.questionarioTemplateSqlService.getAllQuestionari()).thenReturn(
	 * listaQuestionari);
	 * List<QuestionarioTemplateEntity> risultato =
	 * questionarioTemplateService.getQuestionariTemplateByUtente(sceltaProfilazione
	 * );
	 * assertThat(risultato.size()).isEqualTo(listaQuestionari.size());
	 * }
	 * 
	 * @Test
	 * public void getQuestionariTemplateByUtenteDSCUTest() {
	 * //test con ruoloUtenteLoggato = DSCU
	 * ruolo.setCodice("DSCU");
	 * listaRuoli = new ArrayList<>();
	 * listaRuoli.add(ruolo);
	 * sceltaProfilazione.setCodiceRuoloUtenteLoggato(RuoloUtenteEnum.DSCU.toString(
	 * ));
	 * when(this.questionarioTemplateSqlService.getQuestionariSCD()).thenReturn(
	 * listaQuestionari);
	 * List<QuestionarioTemplateEntity> risultato =
	 * questionarioTemplateService.getQuestionariTemplateByUtente(sceltaProfilazione
	 * );
	 * assertThat(risultato.size()).isEqualTo(listaQuestionari.size());
	 * }
	 * 
	 * @Test
	 * public void getQuestionariTemplateByUtenteREGTest() {
	 * //test con ruoloUtenteLoggato = REG
	 * ruolo.setCodice("REG");
	 * listaRuoli = new ArrayList<>();
	 * listaRuoli.add(ruolo);
	 * sceltaProfilazione.setCodiceRuoloUtenteLoggato(RuoloUtenteEnum.REG.toString()
	 * );
	 * when(this.questionarioTemplateSqlService.
	 * getQuestionariPerReferenteDelegatoGestoreProgramma(sceltaProfilazione.
	 * getIdProgramma())).thenReturn(listaQuestionari);
	 * List<QuestionarioTemplateEntity> risultato =
	 * questionarioTemplateService.getQuestionariTemplateByUtente(sceltaProfilazione
	 * );
	 * assertThat(risultato.size()).isEqualTo(listaQuestionari.size());
	 * }
	 * 
	 * @Test
	 * public void getQuestionariTemplateByUtenteREGPTest() {
	 * //test con ruoloUtenteLoggato = REGP/DEGP/REPP/DEPP/FAC/VOL
	 * ruolo.setCodice("REGP");
	 * listaRuoli = new ArrayList<>();
	 * listaRuoli.add(ruolo);
	 * sceltaProfilazione.setCodiceRuoloUtenteLoggato(RuoloUtenteEnum.REGP.toString(
	 * ));
	 * List<QuestionarioTemplateEntity> risultato =
	 * questionarioTemplateService.getQuestionariTemplateByUtente(sceltaProfilazione
	 * );
	 * assertThat(risultato.size()).isEqualTo(0);
	 * }
	 * 
	 * @Test
	 * public void aggiornaDefaultQuestionarioTemplateTest() {
	 * //test passando RFD come parametro del metodo
	 * when(this.questionarioTemplateSqlService.getQuestionarioTemplateById(
	 * questionarioTemplateCollection.getIdQuestionarioTemplate())).thenReturn(
	 * questionarioTemplateEntity);
	 * when(this.questionarioTemplateSqlService.getQuestionarioTemplateDefaultRFD())
	 * .thenReturn(Optional.of(questionarioTemplateEntity));
	 * when(this.questionarioTemplateRepository.findTemplateQuestionarioById(
	 * questionarioTemplateEntity.getId())).thenReturn(Optional.of(
	 * questionarioTemplateCollection));
	 * when(this.questionarioTemplateRepository.save(questionarioTemplateCollection)
	 * ).thenReturn(questionarioTemplateCollection);
	 * questionarioTemplateService.aggiornaDefaultQuestionarioTemplate(
	 * questionarioTemplateEntity.getId(), "RFD");
	 * 
	 * //test passando SCD come parametro del metodo
	 * when(this.questionarioTemplateSqlService.getQuestionarioTemplateById(
	 * questionarioTemplateCollection.getIdQuestionarioTemplate())).thenReturn(
	 * questionarioTemplateEntity);
	 * when(this.questionarioTemplateSqlService.getQuestionarioTemplateDefaultSCD())
	 * .thenReturn(Optional.of(questionarioTemplateEntity));
	 * when(this.questionarioTemplateRepository.findTemplateQuestionarioById(
	 * questionarioTemplateEntity.getId())).thenReturn(Optional.of(
	 * questionarioTemplateCollection));
	 * when(this.questionarioTemplateRepository.save(questionarioTemplateCollection)
	 * ).thenReturn(questionarioTemplateCollection);
	 * questionarioTemplateService.aggiornaDefaultQuestionarioTemplate(
	 * questionarioTemplateEntity.getId(), "SCD");
	 * }
	 * 
	 * @Test
	 * public void getQuestionarioTemplateByIdProgrammaTest() {
	 * when(this.programmaService.getProgrammaById(programma.getId())).thenReturn(
	 * programma);
	 * when(this.programmaXQuestionarioTemplateService.getByIdProgramma(programma.
	 * getId())).thenReturn(listaProgrammaXQuestionario);
	 * when(this.questionarioTemplateSqlService.getQuestionarioTemplateById(
	 * programmaXQuestionarioTemplateEntity.getProgrammaXQuestionarioTemplateKey().
	 * getIdQuestionarioTemplate())).thenReturn(questionarioTemplateEntity);
	 * when(this.questionarioTemplateRepository.findTemplateQuestionarioById(
	 * questionarioTemplateCollection.getIdQuestionarioTemplate())).thenReturn(
	 * Optional.of(questionarioTemplateCollection));
	 * questionarioTemplateService.getQuestionarioTemplateByIdProgramma(programma.
	 * getId());
	 * }
	 * 
	 * @Test
	 * public void getQuestionarioTemplateByIdProgrammaKOTest() {
	 * //test KO per programma non trovato
	 * when(this.programmaService.getProgrammaById(programma.getId())).thenThrow(
	 * NoSuchElementException.class);
	 * Assertions.assertThrows(QuestionarioTemplateException.class, () ->
	 * questionarioTemplateService.getQuestionarioTemplateByIdProgramma(programma.
	 * getId()));
	 * assertThatExceptionOfType(QuestionarioTemplateException.class);
	 * }
	 * 
	 * @Test
	 * public void getQuestionarioTemplateByIdProgrammaKOTest2() {
	 * //test KO per questionario non associato al programma
	 * when(this.programmaService.getProgrammaById(programma.getId())).thenReturn(
	 * programma);
	 * when(this.programmaXQuestionarioTemplateService.getByIdProgramma(programma.
	 * getId())).thenReturn(new ArrayList<>());
	 * Assertions.assertThrows(QuestionarioTemplateException.class, () ->
	 * questionarioTemplateService.getQuestionarioTemplateByIdProgramma(programma.
	 * getId()));
	 * assertThatExceptionOfType(QuestionarioTemplateException.class);
	 * }
	 * 
	 * @Test
	 * public void getQuestionarioTemplateByIdProgrammaKOTest3() {
	 * //test KO per questionario associato al programma non presente in MySql
	 * when(this.programmaService.getProgrammaById(programma.getId())).thenReturn(
	 * programma);
	 * when(this.programmaXQuestionarioTemplateService.getByIdProgramma(programma.
	 * getId())).thenReturn(listaProgrammaXQuestionario);
	 * when(this.questionarioTemplateSqlService.getQuestionarioTemplateById(
	 * programmaXQuestionarioTemplateEntity.getProgrammaXQuestionarioTemplateKey().
	 * getIdQuestionarioTemplate())).thenThrow(ResourceNotFoundException.class);
	 * Assertions.assertThrows(ServizioException.class, () ->
	 * questionarioTemplateService.getQuestionarioTemplateByIdProgramma(programma.
	 * getId()));
	 * assertThatExceptionOfType(ServizioException.class);
	 * }
	 * 
	 * @Test
	 * public void getQuestionarioTemplateByIdProgrammaKOTest4() {
	 * //test KO per questionario associato al programma non presente in MongoDB
	 * when(this.programmaService.getProgrammaById(programma.getId())).thenReturn(
	 * programma);
	 * when(this.programmaXQuestionarioTemplateService.getByIdProgramma(programma.
	 * getId())).thenReturn(listaProgrammaXQuestionario);
	 * when(this.questionarioTemplateSqlService.getQuestionarioTemplateById(
	 * programmaXQuestionarioTemplateEntity.getProgrammaXQuestionarioTemplateKey().
	 * getIdQuestionarioTemplate())).thenReturn(questionarioTemplateEntity);
	 * when(this.questionarioTemplateRepository.findTemplateQuestionarioById(
	 * questionarioTemplateCollection.getIdQuestionarioTemplate())).thenThrow(
	 * ResourceNotFoundException.class);
	 * Assertions.assertThrows(ServizioException.class, () ->
	 * questionarioTemplateService.getQuestionarioTemplateByIdProgramma(programma.
	 * getId()));
	 * assertThatExceptionOfType(ServizioException.class);
	 * }
	 */
}
