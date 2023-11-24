package it.pa.repdgt.surveymgmt.service;

import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
public class ProgettoServiceTest {

	/*
	 * @Mock
	 * private ProgettoRepository progettoRepository;
	 * 
	 * @Autowired
	 * 
	 * @InjectMocks
	 * private ProgettoService progettoService;
	 * 
	 * ProgettoEntity progetto;
	 * 
	 * @BeforeEach
	 * public void setUp() {
	 * progetto = new ProgettoEntity();
	 * progetto.setId(1L);
	 * }
	 * 
	 * @Test
	 * public void getProgettoByIdTest() {
	 * when(this.progettoRepository.findById(progetto.getId())).thenReturn(Optional.
	 * of(progetto));
	 * ProgettoEntity risultato = progettoService.getProgettoById(progetto.getId());
	 * assertThat(risultato.getId()).isEqualTo(progetto.getId());
	 * }
	 * 
	 * @Test
	 * public void getProgettoByIdKOTest() {
	 * //test KO per progetto non trovato
	 * when(this.progettoRepository.findById(progetto.getId())).thenReturn(Optional.
	 * empty());
	 * Assertions.assertThrows(ResourceNotFoundException.class, () ->
	 * progettoService.getProgettoById(progetto.getId()));
	 * assertThatExceptionOfType(ResourceNotFoundException.class);
	 * }
	 * 
	 * @Test
	 * public void getProgettiByServizioTest() {
	 * ProgettoProjectionImplementation progettoProjectionImplementation = new
	 * ProgettoProjectionImplementation();
	 * progettoProjectionImplementation.setId(1L);
	 * progettoProjectionImplementation.setNomeBreve("NOMEBREVEPROGETTO");
	 * progettoProjectionImplementation.setStato("ATTIVO");
	 * List<ProgettoProjection> listaProgettiProjection = new ArrayList<>();
	 * listaProgettiProjection.add(progettoProjectionImplementation);
	 * when(this.progettoRepository.findProgettiByServizio(1L)).thenReturn(
	 * listaProgettiProjection);
	 * List<ProgettoProjection> risultato =
	 * progettoService.getProgettiByServizio(1L);
	 * assertThat(risultato.size()).isEqualTo(listaProgettiProjection.size());
	 * }
	 * 
	 * @Setter
	 * public class ProgettoProjectionImplementation implements ProgettoProjection {
	 * private Long id;
	 * private String nomeBreve;
	 * private String stato;
	 * 
	 * @Override
	 * public Long getId() {
	 * return id;
	 * }
	 * 
	 * @Override
	 * public String getNomeBreve() {
	 * return nomeBreve;
	 * }
	 * 
	 * @Override
	 * public String getStato() {
	 * return stato;
	 * }
	 * 
	 * }
	 */
}
