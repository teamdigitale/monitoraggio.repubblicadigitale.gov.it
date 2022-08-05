package it.pa.repdgt.gestioneutente.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.assertj.core.util.Arrays;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;

import it.pa.repdgt.gestioneutente.dto.UtenteDto;
import it.pa.repdgt.gestioneutente.exception.UtenteException;
import it.pa.repdgt.gestioneutente.repository.ReferentiDelegatiEnteGestoreProgettoRepository;
import it.pa.repdgt.gestioneutente.repository.ReferentiDelegatiEnteGestoreProgrammaRepository;
import it.pa.repdgt.gestioneutente.repository.ReferentiDelegatiEntePartnerDiProgettoRepository;
import it.pa.repdgt.gestioneutente.repository.UtenteRepository;
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
	List<RuoloEntity> ruoli;
	
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
		RuoloEntity ruolo1 = new RuoloEntity();
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
		when(this.utenteRepository.findByFilter(
				filtroRicerca.getCriterioRicerca(),
				"%" + filtroRicerca.getCriterioRicerca() + "%",
				filtroRicerca.getRuoli()
		)).thenReturn(utentiSet);
		Page<UtenteDto> utentiAll = service.getAllUtentiPaginati(sceltaContesto, 0, 8);
		assertThat(utentiAll.getNumberOfElements()).isEqualTo(2);
		
		Assertions.assertThrows(UtenteException.class, () -> service.getAllUtentiPaginati(sceltaContesto, 10, 8));
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
}
