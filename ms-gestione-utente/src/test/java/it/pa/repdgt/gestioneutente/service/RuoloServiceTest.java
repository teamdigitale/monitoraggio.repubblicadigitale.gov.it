package it.pa.repdgt.gestioneutente.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;

import it.pa.repdgt.gestioneutente.bean.DettaglioRuoloBean;
import it.pa.repdgt.gestioneutente.exception.ResourceNotFoundException;
import it.pa.repdgt.gestioneutente.exception.RuoloException;
import it.pa.repdgt.gestioneutente.repository.RuoloRepository;
import it.pa.repdgt.gestioneutente.request.RuoloRequest;
import it.pa.repdgt.shared.entity.GruppoEntity;
import it.pa.repdgt.shared.entity.RuoloEntity;
import it.pa.repdgt.shared.entityenum.StatoEnum;

//@ExtendWith(MockitoExtension.class)
public class RuoloServiceTest {

	@Mock
	private GruppoService gruppoService;
	@Mock
	private RuoloXGruppoService ruoloXGruppoService;
	@Mock
	private RuoloRepository ruoloRepository;

	@Autowired
	@InjectMocks
	private RuoloService service;

	public static final String PREDEFINITO = "P";
	public static final String NON_PREDEFINITO = "NP";

	RuoloEntity ruolo;
	List<RuoloEntity> ruoli;
	List<GruppoEntity> gruppi;
	GruppoEntity gruppo;
	RuoloRequest nuovoRuoloRequest;
	List<String> gruppiString;

	@BeforeEach
	public void setUp() {
		ruolo = new RuoloEntity();
		ruolo.setCodice("codice");
		ruolo.setNome("nome");
		ruolo.setPredefinito(true);
		ruolo.setStato(StatoEnum.ATTIVO.getValue());
		ruoli = new ArrayList<RuoloEntity>();
		ruoli.add(ruolo);
		gruppi = new ArrayList<GruppoEntity>();
		gruppo = new GruppoEntity();
		gruppo.setCodice("codiceGruppo");
		gruppo.setDescrizione("descrizione");
		gruppi.add(gruppo);
		nuovoRuoloRequest = new RuoloRequest();
		nuovoRuoloRequest.setNomeRuolo("nomeRuolo");
		gruppiString = new ArrayList<>();
		gruppiString.add("codiceGruppo");
		nuovoRuoloRequest.setCodiciGruppi(gruppiString);
	}

	// @Test
	public void getRuoliByTipologiaRuoloTest() {
		when(this.ruoloRepository.findAll()).thenReturn(new ArrayList<RuoloEntity>());
		assertThat(service.getRuoliByTipologiaRuolo(null)).isNotNull();
		
		Assertions.assertThrows(RuoloException.class, () -> service.getRuoliByTipologiaRuolo("tipoNonEsistente"));
		
		when(this.ruoloRepository.findAllRuoliPredefiniti()).thenReturn(new ArrayList<RuoloEntity>());
		assertThat(service.getRuoliByTipologiaRuolo(PREDEFINITO)).isNotNull();
		
		when(this.ruoloRepository.findAllRuoliNonPredefiniti()).thenReturn(new ArrayList<RuoloEntity>());
		assertThat(service.getRuoliByTipologiaRuolo(NON_PREDEFINITO)).isNotNull();
	}

	// @Test
	public void getRuoloByCodiceRuoloTest() {
		when(this.ruoloRepository.findById("codiceRuolo")).thenReturn(Optional.of(new RuoloEntity()));
		assertThat(service.getRuoloByCodiceRuolo("codiceRuolo")).isNotNull();
		
		when(this.ruoloRepository.findById("codiceRuolo1")).thenReturn(Optional.empty());
		Assertions.assertThrows(ResourceNotFoundException.class, () -> service.getRuoloByCodiceRuolo("codiceRuolo1"));
	}

	// @Test
	public void getRuoliByCodiceFiscaleUtenteTest() {
		List<String> ruoli = new ArrayList<String>();
		ruoli.add("ruolo1");
		when(this.ruoloRepository.findRuoloByCodiceFiscaleUtente("codiceFiscale")).thenReturn(ruoli);
		assertThat(service.getRuoliByCodiceFiscaleUtente("codiceFiscale").get(0)).isEqualTo("ruolo1");
	}

	// @Test
	public void getRuoliCompletiByCodiceFiscaleUtenteTest() {
		when(this.ruoloRepository.findRuoloCompletoByCodiceFiscaleUtente("codiceFiscale")).thenReturn(ruoli);
		assertThat(service.getRuoliCompletiByCodiceFiscaleUtente("codiceFiscale").get(0).getCodice()).isEqualTo("codice");
	}

	// @Test
	public void getRuoliByFiltroDiRicercaTest() {
		when(this.ruoloRepository.findAll()).thenReturn(ruoli);
		assertThat(service.getRuoliByFiltroDiRicerca(null).get(0).getCodice()).isEqualTo("codice");
		
		when(this.ruoloRepository.findAll()).thenReturn(ruoli);
		assertThat(service.getRuoliByFiltroDiRicerca("").get(0).getCodice()).isEqualTo("codice");

		when(this.ruoloRepository.findByNomeContaining("NOME")).thenReturn(Arrays.asList(ruolo));
		assertThat(service.getRuoliByFiltroDiRicerca("nome").get(0).getNome()).isEqualTo("nome");
		
		when(this.ruoloRepository.findByNomeContaining("NOME1")).thenReturn(null);
		assertThat(service.getRuoliByFiltroDiRicerca("NOME1")).isNullOrEmpty();
	}

	// @Test
	public void esisteRuoloByCodiceTest() {
		when(this.ruoloRepository.findByCodice("codiceRuolo")).thenReturn(Optional.of(ruolo));
		assertThat(service.esisteRuoloByCodice("codiceRuolo")).isEqualTo(Boolean.TRUE);
		
		when(this.ruoloRepository.findByCodice("codiceRuolo1")).thenReturn(Optional.empty());
		assertThat(service.esisteRuoloByCodice("codiceRuolo1")).isEqualTo(Boolean.FALSE);
	}

	// @Test
	public void existsRuoloByNomeTest() {
		when(this.ruoloRepository.findByNomeOrCodice("nomeRuolo")).thenReturn(Optional.of(ruolo));
		assertThat(service.existsRuoloByNomeOrCodice("nomeRuolo")).isEqualTo(Boolean.TRUE);
		
		when(this.ruoloRepository.findByNomeOrCodice("nomeRuolo1")).thenReturn(Optional.empty());
		assertThat(service.existsRuoloByNomeOrCodice("nomeRuolo1")).isEqualTo(Boolean.FALSE);
	}

	// @Test
	public void getGruppByRuoloTest() {
		
		when(this.ruoloRepository.findByCodice("codiceRuolo")).thenReturn(Optional.of(ruolo));
		
		when(this.gruppoService.getGruppiByRuolo("codiceRuolo")).thenReturn(gruppi);
		assertThat(service.getGruppByRuolo("codiceRuolo").get(0).getCodice()).isEqualTo("codiceGruppo");
		
		when(this.ruoloRepository.findByCodice("codiceRuolo1")).thenReturn(Optional.empty());
		Assertions.assertThrows(ResourceNotFoundException.class, () -> service.getGruppByRuolo("codiceRuolo1"));
	}

	// @Test
	public void creaNuovoRuoloTest() {
		when(this.ruoloRepository.findByNomeOrCodice("nomeRuolo")).thenReturn(Optional.of(ruolo));
		Assertions.assertThrows(RuntimeException.class, () -> service.creaNuovoRuolo(nuovoRuoloRequest));
		
		nuovoRuoloRequest.setNomeRuolo("nomeRuolo1");
		when(this.ruoloRepository.findByNomeOrCodice("nomeRuolo1")).thenReturn(Optional.empty());
		when(this.gruppoService.getGruppiByCodiciGruppi(gruppiString)).thenReturn(gruppi);
		service.creaNuovoRuolo(nuovoRuoloRequest);
		
		when(this.gruppoService.getGruppiByCodiciGruppi(gruppiString)).thenReturn(null);
		service.creaNuovoRuolo(nuovoRuoloRequest);
	}

	// @Test
	public void aggiornaRuoloNonPredefinitoTest() {
		when(this.ruoloRepository.findById("codice")).thenReturn(Optional.of(ruolo));
		RuoloRequest ruoloRequest = nuovoRuoloRequest;
		Assertions.assertThrows(RuoloException.class, () -> service.aggiornaRuoloNonPredefinito("codice", ruoloRequest));
		
		ruolo.setPredefinito(false);
		when(this.ruoloRepository.save(ruolo)).thenReturn(ruolo);
		doNothing().when(this.ruoloXGruppoService).aggiornaAssociazioniRuoloGruppo(ruolo.getCodice(), ruoloRequest.getCodiciGruppi());
		service.aggiornaRuoloNonPredefinito("codice", ruoloRequest);

	}

	// @Test
	public void cancellazioneRuoloTest() {
		Assertions.assertThrows(RuoloException.class, () -> service.cancellazioneRuolo("DTD"));
		Assertions.assertThrows(RuoloException.class, () -> service.cancellazioneRuolo("DSCU"));

		when(this.ruoloRepository.findById("codice")).thenReturn(Optional.of(ruolo));
		Assertions.assertThrows(RuoloException.class, () -> service.cancellazioneRuolo("codice"));

		ruolo.setPredefinito(false);
		when(this.ruoloRepository.findById("codice")).thenReturn(Optional.of(ruolo));
		when(this.ruoloRepository.countUtentiPerRuolo("codice")).thenReturn(1);
		Assertions.assertThrows(RuoloException.class, () -> service.cancellazioneRuolo("codice"));

		when(this.ruoloRepository.countUtentiPerRuolo("codice")).thenReturn(0);
		doNothing().when(this.ruoloRepository).delete(ruolo);
		service.cancellazioneRuolo("codice");
	}

	// @Test
	public void getSchedaRuoloByCodiceRuoloTest() {
		when(this.ruoloRepository.findById("codice")).thenReturn(Optional.of(ruolo));
		when(this.gruppoService.getGruppiByRuolo("codice")).thenReturn(gruppi);
		DettaglioRuoloBean dettaglioRuolo = new DettaglioRuoloBean();
		dettaglioRuolo.setNome(ruolo.getNome());
		dettaglioRuolo.setStato(ruolo.getStato());
		
		assertThat(service.getSchedaRuoloByCodiceRuolo("codice").getDettaglioRuolo().getNome()).isEqualTo(ruolo.getNome());
	}
}
