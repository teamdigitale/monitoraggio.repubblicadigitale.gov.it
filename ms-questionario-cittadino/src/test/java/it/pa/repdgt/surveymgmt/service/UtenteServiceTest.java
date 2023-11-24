package it.pa.repdgt.surveymgmt.service;

import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
public class UtenteServiceTest {

	/*
	 * @Mock
	 * private RuoloService ruoloService;
	 * 
	 * @Mock
	 * private UtenteRepository utenteRepository;
	 * 
	 * @Autowired
	 * 
	 * @InjectMocks
	 * private UtenteService utenteService;
	 * 
	 * UtenteEntity utente;
	 * RuoloEntity ruolo;
	 * List<RuoloEntity> listaRuoli;
	 * 
	 * @BeforeEach
	 * public void setUp() {
	 * utente = new UtenteEntity();
	 * utente.setId(1L);
	 * utente.setCodiceFiscale("CODICEFISCALE");
	 * ruolo = new RuoloEntity();
	 * ruolo.setCodice("FAC");
	 * listaRuoli = new ArrayList<>();
	 * listaRuoli.add(ruolo);
	 * utente.setRuoli(listaRuoli);
	 * }
	 * 
	 * @Test
	 * public void getUtenteByCodiceFiscaleTest() {
	 * when(this.utenteRepository.findByCodiceFiscale(utente.getCodiceFiscale())).
	 * thenReturn(Optional.of(utente));
	 * UtenteEntity risultato =
	 * utenteService.getUtenteByCodiceFiscale(utente.getCodiceFiscale());
	 * assertThat(risultato.getCodiceFiscale()).isEqualTo(utente.getCodiceFiscale())
	 * ;
	 * }
	 * 
	 * @Test
	 * public void getUtenteByCodiceFiscaleKOTest() {
	 * //test KO per utente non trovato
	 * when(this.utenteRepository.findByCodiceFiscale(utente.getCodiceFiscale())).
	 * thenReturn(Optional.empty());
	 * Assertions.assertThrows(ResourceNotFoundException.class, () ->
	 * utenteService.getUtenteByCodiceFiscale(utente.getCodiceFiscale()));
	 * assertThatExceptionOfType(ResourceNotFoundException.class);
	 * }
	 * 
	 * @Test
	 * public void isUtenteFacilitatoreTest() {
	 * //test per utente facilitatore
	 * when(this.ruoloService.getRuoliByCodiceFiscale(utente.getCodiceFiscale())).
	 * thenReturn(listaRuoli);
	 * boolean risultato =
	 * utenteService.isUtenteFacilitatore(utente.getCodiceFiscale(), "FAC");
	 * assertThat(risultato).isEqualTo(true);
	 * 
	 * //test per utente non facilitatore
	 * when(this.ruoloService.getRuoliByCodiceFiscale(utente.getCodiceFiscale())).
	 * thenReturn(listaRuoli);
	 * boolean risultato2 =
	 * utenteService.isUtenteFacilitatore(utente.getCodiceFiscale(), "REG");
	 * assertThat(risultato2).isEqualTo(false);
	 * }
	 * 
	 * @Test
	 * public void hasRuoloUtenteTest() {
	 * when(this.ruoloService.getRuoliByCodiceFiscale(utente.getCodiceFiscale())).
	 * thenReturn(listaRuoli);
	 * boolean risultato = utenteService.hasRuoloUtente(utente.getCodiceFiscale(),
	 * "FAC");
	 * assertThat(risultato).isEqualTo(true);
	 * }
	 */
}
