package it.pa.repdgt.surveymgmt.service;

import it.pa.repdgt.surveymgmt.projection.SedeProjection;
import lombok.Setter;

//@ExtendWith(MockitoExtension.class)
public class EnteSedeProgettoFacilitatoreServiceTest {

	/*
	 * @Mock
	 * private EnteSedeProgettoFacilitatoreRepository
	 * enteSedeProgettoFacilitatoreRepository;
	 * 
	 * @Autowired
	 * 
	 * @InjectMocks
	 * private EnteSedeProgettoFacilitatoreService
	 * enteSedeProgettoFacilitatoreService;
	 * 
	 * EnteSedeProgettoFacilitatoreKey enteSedeProgettoFacilitatoreKey;
	 * EnteSedeProgettoFacilitatoreEntity enteSedeProgettoFacilitatoreEntity;
	 * List<String> listaIdsSedi;
	 * SceltaProfiloParam profilazione;
	 * 
	 * @BeforeEach
	 * public void setUp() {
	 * enteSedeProgettoFacilitatoreKey = new EnteSedeProgettoFacilitatoreKey(1L, 1L,
	 * 1L, "DFGREI79N20H101L");
	 * enteSedeProgettoFacilitatoreEntity = new
	 * EnteSedeProgettoFacilitatoreEntity();
	 * enteSedeProgettoFacilitatoreEntity.setId(enteSedeProgettoFacilitatoreKey);
	 * listaIdsSedi = new ArrayList<>();
	 * listaIdsSedi.add("1");
	 * profilazione = new SceltaProfiloParam();
	 * profilazione.setCfUtenteLoggato("DFGREI79N20H101L");
	 * profilazione.setCodiceRuoloUtenteLoggato(RuoloUtenteEnum.FAC.toString());
	 * profilazione.setIdProgetto(1L);
	 * profilazione.setIdProgramma(1L);
	 * profilazione.setIdEnte(1000L);
	 * profilazione.setIdEnte(1L);
	 * }
	 * 
	 * @Test
	 * public void getByIdTest() {
	 * when(this.enteSedeProgettoFacilitatoreRepository.findById(
	 * enteSedeProgettoFacilitatoreKey)).thenReturn(Optional.of(
	 * enteSedeProgettoFacilitatoreEntity));
	 * EnteSedeProgettoFacilitatoreEntity risultato =
	 * enteSedeProgettoFacilitatoreService.getById(enteSedeProgettoFacilitatoreKey);
	 * assertThat(risultato.getId()).isEqualTo(enteSedeProgettoFacilitatoreKey);
	 * }
	 * 
	 * @Test
	 * public void getByIdKOTest() {
	 * //test KO per enteSedeProgettoFacilitatore non trovato
	 * when(this.enteSedeProgettoFacilitatoreRepository.findById(
	 * enteSedeProgettoFacilitatoreKey)).thenReturn(Optional.empty());
	 * Assertions.assertThrows(ResourceNotFoundException.class, () ->
	 * enteSedeProgettoFacilitatoreService.getById(enteSedeProgettoFacilitatoreKey))
	 * ;
	 * assertThatExceptionOfType(ResourceNotFoundException.class);
	 * }
	 * 
	 * @Test
	 * public void getIdsSediFacilitatoreByCodFiscaleAndIdProgettoAndIdEnteTest() {
	 * when(this.enteSedeProgettoFacilitatoreRepository.
	 * findIdsSediFacilitatoreByCodFiscaleAndIdProgettoAndIdEnte("DFGREI79N20H101L",
	 * 1L, 1000L)).thenReturn(listaIdsSedi);
	 * List<String> risultato = enteSedeProgettoFacilitatoreService.
	 * getIdsSediFacilitatoreByCodFiscaleAndIdProgettoAndIdEnte("DFGREI79N20H101L",
	 * 1L, 1000L);
	 * assertThat(risultato.size()).isEqualTo(listaIdsSedi.size());
	 * }
	 * 
	 * @Test
	 * public void getNomeCompletoFacilitatoreByCodiceFiscaleTest() {
	 * when(this.enteSedeProgettoFacilitatoreRepository.
	 * findNomeCompletoFacilitatoreByCodiceFiscale("DFGREI79N20H101L")).thenReturn(
	 * "NOMECOMPLETO");
	 * String risultato = enteSedeProgettoFacilitatoreService.
	 * getNomeCompletoFacilitatoreByCodiceFiscale("DFGREI79N20H101L");
	 * assertThat(risultato).isEqualTo("NOMECOMPLETO");
	 * }
	 * 
	 * @Test
	 * public void getEntiByFacilitatoreTest() {
	 * EnteProjectionImplementation enteProjectionImplementation = new
	 * EnteProjectionImplementation();
	 * enteProjectionImplementation.setId(1L);
	 * enteProjectionImplementation.setNome("NOMEENTE");
	 * enteProjectionImplementation.setNomeBreve("NOMEBREVEENTE");
	 * List<EnteProjection> listaEntiProjection = new ArrayList<>();
	 * listaEntiProjection.add(enteProjectionImplementation);
	 * when(this.enteSedeProgettoFacilitatoreRepository.
	 * findEntiByFacilitatoreAndIdProgetto("DFGREI79N20H101L",
	 * 1L)).thenReturn(listaEntiProjection);
	 * List<EnteProjection> risultato =
	 * enteSedeProgettoFacilitatoreService.getEntiByFacilitatore(profilazione);
	 * assertThat(risultato.size()).isEqualTo(listaEntiProjection.size());
	 * }
	 * 
	 * @Test
	 * public void getSediByFacilitatoreTest() {
	 * SedeProjectionImplementation sedeProjectionImplementation = new
	 * SedeProjectionImplementation();
	 * sedeProjectionImplementation.setId(1L);
	 * sedeProjectionImplementation.setNome("NOMESEDE");
	 * List<SedeProjection> listaSediProjection = new ArrayList<>();
	 * listaSediProjection.add(sedeProjectionImplementation);
	 * when(this.enteSedeProgettoFacilitatoreRepository.findSediByFacilitatore(
	 * profilazione.getCfUtenteLoggato(),
	 * profilazione.getIdEnte(),
	 * profilazione.getIdProgetto()
	 * )).thenReturn(listaSediProjection);
	 * List<SedeProjection> risultato =
	 * enteSedeProgettoFacilitatoreService.getSediByFacilitatore(profilazione);
	 * assertThat(risultato.size()).isEqualTo(listaSediProjection.size());
	 * }
	 * 
	 * @Setter
	 * public class EnteProjectionImplementation implements EnteProjection {
	 * private Long id;
	 * private String nome;
	 * private String nomeBreve;
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
	 * 
	 * @Override
	 * public String getNomeBreve() {
	 * return nomeBreve;
	 * }
	 * 
	 * }
	 */

	@Setter
	public class SedeProjectionImplementation implements SedeProjection {
		private Long id;
		private String nome;

		@Override
		public Long getId() {
			return id;
		}

		@Override
		public String getNome() {
			return nome;
		}

	}
}
