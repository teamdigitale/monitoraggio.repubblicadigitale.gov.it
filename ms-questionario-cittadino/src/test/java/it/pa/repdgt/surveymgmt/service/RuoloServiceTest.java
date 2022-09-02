package it.pa.repdgt.surveymgmt.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;

import it.pa.repdgt.shared.entity.RuoloEntity;
import it.pa.repdgt.surveymgmt.repository.RuoloRepository;

@ExtendWith(MockitoExtension.class)
public class RuoloServiceTest {

	@Mock
	private RuoloRepository ruoloRepository;
	
	@Autowired
	@InjectMocks
	private RuoloService ruoloService;
	
	RuoloEntity ruolo;
	List<RuoloEntity> listaRuoli;
	
	@BeforeEach
	public void setUp() {
		ruolo = new RuoloEntity();
		ruolo.setCodice("RUOLO");
		listaRuoli = new ArrayList<>();
		listaRuoli.add(ruolo);
	}
	
	@Test
	public void getRuoliByCodiceFiscaleTest() {
		when(this.ruoloRepository.findRuoliByCodiceFiscale("CODICEFISCALE")).thenReturn(listaRuoli);
		List<RuoloEntity> risultato = ruoloService.getRuoliByCodiceFiscale("CODICEFISCALE");
		assertThat(risultato.size()).isEqualTo(listaRuoli.size());
	}
}
