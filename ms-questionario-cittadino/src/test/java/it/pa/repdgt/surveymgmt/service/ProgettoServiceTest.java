package it.pa.repdgt.surveymgmt.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatExceptionOfType;
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

import it.pa.repdgt.shared.entity.ProgettoEntity;
import it.pa.repdgt.surveymgmt.exception.ResourceNotFoundException;
import it.pa.repdgt.surveymgmt.projection.ProgettoProjection;
import it.pa.repdgt.surveymgmt.repository.ProgettoRepository;
import lombok.Setter;

@ExtendWith(MockitoExtension.class)
public class ProgettoServiceTest {
	
	@Mock
	private ProgettoRepository progettoRepository;

	@Autowired
	@InjectMocks
	private ProgettoService progettoService;
	
	ProgettoEntity progetto;
	
	@BeforeEach
	public void setUp() {
		progetto = new ProgettoEntity();
		progetto.setId(1L);
	}
	
	@Test
	public void getProgettoByIdTest() {
		when(this.progettoRepository.findById(progetto.getId())).thenReturn(Optional.of(progetto));
		ProgettoEntity risultato = progettoService.getProgettoById(progetto.getId());
		assertThat(risultato.getId()).isEqualTo(progetto.getId());
	}
	
	@Test
	public void getProgettoByIdKOTest() {
		//test KO per progetto non trovato
		when(this.progettoRepository.findById(progetto.getId())).thenReturn(Optional.empty());
		Assertions.assertThrows(ResourceNotFoundException.class, () -> progettoService.getProgettoById(progetto.getId()));
		assertThatExceptionOfType(ResourceNotFoundException.class);
	}
	
	@Test
	public void getProgettiByServizioTest() {
		ProgettoProjectionImplementation progettoProjectionImplementation = new ProgettoProjectionImplementation();
		progettoProjectionImplementation.setId(1L);
		progettoProjectionImplementation.setNomeBreve("NOMEBREVEPROGETTO");
		progettoProjectionImplementation.setStato("ATTIVO");
		List<ProgettoProjection> listaProgettiProjection = new ArrayList<>();
		listaProgettiProjection.add(progettoProjectionImplementation);
		when(this.progettoRepository.findProgettiByServizio(1L)).thenReturn(listaProgettiProjection);
		List<ProgettoProjection> risultato = progettoService.getProgettiByServizio(1L);
		assertThat(risultato.size()).isEqualTo(listaProgettiProjection.size());
	}
	
	@Setter
	public class ProgettoProjectionImplementation implements ProgettoProjection {
		private Long id;
		private String nomeBreve;
		private String stato;
		
		@Override
		public Long getId() {
			return id;
		}

		@Override
		public String getNomeBreve() {
			return nomeBreve;
		}

		@Override
		public String getStato() {
			return stato;
		}
		
	}
}
