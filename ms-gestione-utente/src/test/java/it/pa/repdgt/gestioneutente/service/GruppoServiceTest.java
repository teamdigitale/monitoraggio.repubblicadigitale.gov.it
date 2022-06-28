package it.pa.repdgt.gestioneutente.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
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

import it.pa.repdgt.gestioneutente.exception.ResourceNotFoundException;
import it.pa.repdgt.gestioneutente.repository.GruppoRepository;
import it.pa.repdgt.shared.entity.GruppoEntity;

@ExtendWith(MockitoExtension.class)
public class GruppoServiceTest {

	@Mock
	private GruppoRepository gruppoRepository;

	@Autowired
	@InjectMocks
	private GruppoService service;
	
	List<String> codiciGruppi = new ArrayList<String>();
	List<String> codiciGruppiNull = null;
	List<GruppoEntity> gruppi = new ArrayList<GruppoEntity>();
	GruppoEntity gruppo = new GruppoEntity();
	
	@BeforeEach
	public void setUp() {
		codiciGruppi = new ArrayList<String>();
		codiciGruppi.add("ABC");
		gruppo.setCodice("ABC");
		gruppi = new ArrayList<GruppoEntity>();
		gruppi.add(gruppo);
	}

	@Test
	public void getGruppoByCodiceTest() {
		when(this.gruppoRepository.findByCodice("codiceGruppo")).thenReturn(Optional.of(new GruppoEntity()));
		assertThat(service.getGruppoByCodice("codiceGruppo")).isNotNull();

		when(this.gruppoRepository.findByCodice("codiceGruppo")).thenReturn(Optional.empty());
		Assertions.assertThrows(ResourceNotFoundException.class, () -> service.getGruppoByCodice("codiceGruppo"));
	}

	@Test
	public void getGruppiByCodiciGruppiTest() {
		when(this.gruppoRepository.findAllById(codiciGruppi)).thenReturn(gruppi);
		assertThat(service.getGruppiByCodiciGruppi(codiciGruppi).size()).isEqualTo(1);
	}

	@Test
	public void getGruppiByRuoloTest() {
		when(this.gruppoRepository.findGruppiByRuolo("codiceRuolo")).thenReturn(gruppi);
		assertThat(service.getGruppiByRuolo("codiceRuolo").size()).isEqualTo(1);
	}
	
	@Test
	public void existsAllGruppiByCodiciGruppi() {
		assertThat(service.existsAllGruppiByCodiciGruppi(codiciGruppiNull)).isEqualTo(Boolean.FALSE);
		when(this.gruppoRepository.findByCodice("ABC")).thenReturn(Optional.of(gruppo));
		assertThat(service.existsAllGruppiByCodiciGruppi(codiciGruppi)).isEqualTo(Boolean.TRUE);

		when(this.gruppoRepository.findByCodice("ABC")).thenReturn(Optional.empty());
		assertThat(service.existsAllGruppiByCodiciGruppi(codiciGruppi)).isEqualTo(Boolean.FALSE);
	}
}
