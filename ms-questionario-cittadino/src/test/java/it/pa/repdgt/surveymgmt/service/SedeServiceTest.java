package it.pa.repdgt.surveymgmt.service;

import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
public class SedeServiceTest {

	/*
	 * @Mock
	 * private EnteSedeProgettoFacilitatoreService
	 * enteSedeProgettoFacilitatoreService;
	 * 
	 * @Mock
	 * private ServizioSqlService servizioSqlService;
	 * 
	 * @Mock
	 * private SedeRepository sedeRepository;
	 * 
	 * @Autowired
	 * 
	 * @InjectMocks
	 * private SedeService sedeService;
	 * 
	 * SedeEntity sede;
	 * CittadiniPaginatiParam cittadiniPaginatiParam;
	 * FiltroListaCittadiniParam filtro;
	 * List<String> listaIdsSedi;
	 * 
	 * @BeforeEach
	 * public void setUp() {
	 * sede = new SedeEntity();
	 * sede.setId(1L);
	 * listaIdsSedi = new ArrayList<>();
	 * listaIdsSedi.add(sede.getId().toString());
	 * filtro = new FiltroListaCittadiniParam();
	 * filtro.setCriterioRicerca("CRITERIORICERCA");
	 * filtro.setIdsSedi(listaIdsSedi);
	 * cittadiniPaginatiParam = new CittadiniPaginatiParam();
	 * cittadiniPaginatiParam.setCfUtenteLoggato("CFUTENTE");
	 * cittadiniPaginatiParam.setCodiceRuoloUtenteLoggato(RuoloUtenteEnum.FAC.
	 * toString());
	 * cittadiniPaginatiParam.setIdProgetto(1L);
	 * cittadiniPaginatiParam.setIdProgramma(1L);
	 * cittadiniPaginatiParam.setIdEnte(1000L);
	 * cittadiniPaginatiParam.setFiltro(filtro);
	 * }
	 * 
	 * @Test
	 * public void getByIdTest() {
	 * when(this.sedeRepository.findById(sede.getId())).thenReturn(Optional.of(sede)
	 * );
	 * SedeEntity risultato = sedeService.getById(sede.getId());
	 * assertThat(risultato.getId()).isEqualTo(sede.getId());
	 * }
	 * 
	 * @Test
	 * public void getByIdKOTest() {
	 * //test KO per sede non trovata
	 * when(this.sedeRepository.findById(sede.getId())).thenReturn(Optional.empty())
	 * ;
	 * Assertions.assertThrows(ResourceNotFoundException.class, () ->
	 * sedeService.getById(sede.getId()));
	 * assertThatExceptionOfType(ResourceNotFoundException.class);
	 * }
	 * 
	 * @Test
	 * public void getAllSediFacilitatoreFiltrateTest() {
	 * //test con filtro.getIdsSedi != null
	 * SedeProjectionImplementation sedeProjectionImplementation = new
	 * SedeProjectionImplementation();
	 * sedeProjectionImplementation.setId(sede.getId());
	 * List<SedeProjection> listaSediProjection = new ArrayList<>();
	 * listaSediProjection.add(sedeProjectionImplementation);
	 * when(this.sedeRepository.findAllSediFiltrate(filtro.getCriterioRicerca(), "%"
	 * + filtro.getCriterioRicerca() + "%",
	 * filtro.getIdsSedi())).thenReturn(listaSediProjection);
	 * List<SedeProjection> risultato =
	 * sedeService.getAllSediFacilitatoreFiltrate(cittadiniPaginatiParam);
	 * assertThat(risultato.size()).isEqualTo(listaSediProjection.size());
	 * 
	 * //test con filtro.getIdsSedi == null
	 * filtro.setIdsSedi(null);
	 * when(this.servizioSqlService.
	 * getIdsSediFacilitatoreConServiziAndCittadiniCensitiByCodFiscaleAndIdProgettoAndIdEnte
	 * (cittadiniPaginatiParam.getCfUtenteLoggato(),
	 * cittadiniPaginatiParam.getIdProgetto(),
	 * cittadiniPaginatiParam.getIdEnte())).thenReturn(listaIdsSedi);
	 * when(this.sedeRepository.findAllSediFiltrate(filtro.getCriterioRicerca(), "%"
	 * + filtro.getCriterioRicerca() + "%",
	 * listaIdsSedi)).thenReturn(listaSediProjection);
	 * List<SedeProjection> risultato2 =
	 * sedeService.getAllSediFacilitatoreFiltrate(cittadiniPaginatiParam);
	 * assertThat(risultato2.size()).isEqualTo(listaSediProjection.size());
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
