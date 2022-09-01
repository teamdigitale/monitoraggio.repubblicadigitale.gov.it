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

import it.pa.repdgt.shared.entity.EnteSedeProgettoFacilitatoreEntity;
import it.pa.repdgt.shared.entity.key.EnteSedeProgettoFacilitatoreKey;
import it.pa.repdgt.shared.entityenum.RuoloUtenteEnum;
import it.pa.repdgt.surveymgmt.exception.ResourceNotFoundException;
import it.pa.repdgt.surveymgmt.param.ProfilazioneSedeParam;
import it.pa.repdgt.surveymgmt.projection.EnteProjection;
import it.pa.repdgt.surveymgmt.projection.SedeProjection;
import it.pa.repdgt.surveymgmt.repository.EnteSedeProgettoFacilitatoreRepository;
import lombok.Setter;

@ExtendWith(MockitoExtension.class)
public class EnteSedeProgettoFacilitatoreServiceTest {
	
	@Mock
	private EnteSedeProgettoFacilitatoreRepository enteSedeProgettoFacilitatoreRepository;
	
	@Autowired
	@InjectMocks
	private EnteSedeProgettoFacilitatoreService enteSedeProgettoFacilitatoreService;
	
	EnteSedeProgettoFacilitatoreKey enteSedeProgettoFacilitatoreKey;
	EnteSedeProgettoFacilitatoreEntity enteSedeProgettoFacilitatoreEntity;
	List<String> listaIdsSedi;
	ProfilazioneSedeParam profilazione;
	
	@BeforeEach
	public void setUp() {
		enteSedeProgettoFacilitatoreKey = new EnteSedeProgettoFacilitatoreKey(1L, 1L, 1L, "DFGREI79N20H101L");
		enteSedeProgettoFacilitatoreEntity = new EnteSedeProgettoFacilitatoreEntity();
		enteSedeProgettoFacilitatoreEntity.setId(enteSedeProgettoFacilitatoreKey);
		listaIdsSedi = new ArrayList<>();
		listaIdsSedi.add("1");
		profilazione = new ProfilazioneSedeParam();
		profilazione.setCodiceFiscaleUtenteLoggato("DFGREI79N20H101L");
		profilazione.setCodiceRuoloUtenteLoggato(RuoloUtenteEnum.FAC);
		profilazione.setIdProgetto(1L);
		profilazione.setIdProgramma(1L);
		profilazione.setIdEnte(1L);
	}
	
	@Test
	public void getByIdTest() {
		when(this.enteSedeProgettoFacilitatoreRepository.findById(enteSedeProgettoFacilitatoreKey)).thenReturn(Optional.of(enteSedeProgettoFacilitatoreEntity));
		EnteSedeProgettoFacilitatoreEntity risultato = enteSedeProgettoFacilitatoreService.getById(enteSedeProgettoFacilitatoreKey);
		assertThat(risultato.getId()).isEqualTo(enteSedeProgettoFacilitatoreKey);
	}
	
	@Test
	public void getByIdKOTest() {
		//test KO per enteSedeProgettoFacilitatore non trovato
		when(this.enteSedeProgettoFacilitatoreRepository.findById(enteSedeProgettoFacilitatoreKey)).thenReturn(Optional.empty());
		Assertions.assertThrows(ResourceNotFoundException.class, () -> enteSedeProgettoFacilitatoreService.getById(enteSedeProgettoFacilitatoreKey));
		assertThatExceptionOfType(ResourceNotFoundException.class);
	}
	
	@Test
	public void getIdsSediFacilitatoreByCodFiscaleAndIdProgettoTest() {
		when(this.enteSedeProgettoFacilitatoreRepository.findIdsSediFacilitatoreByCodFiscaleAndIdProgetto("DFGREI79N20H101L", 1L)).thenReturn(listaIdsSedi);
		List<String> risultato = enteSedeProgettoFacilitatoreService.getIdsSediFacilitatoreByCodFiscaleAndIdProgetto("DFGREI79N20H101L", 1L);
		assertThat(risultato.size()).isEqualTo(listaIdsSedi.size());
	}
	
	@Test
	public void getNomeCompletoFacilitatoreByCodiceFiscaleTest() {
		when(this.enteSedeProgettoFacilitatoreRepository.findNomeCompletoFacilitatoreByCodiceFiscale("DFGREI79N20H101L")).thenReturn("NOMECOMPLETO");
		String risultato = enteSedeProgettoFacilitatoreService.getNomeCompletoFacilitatoreByCodiceFiscale("DFGREI79N20H101L");
		assertThat(risultato).isEqualTo("NOMECOMPLETO");
	}
	
	@Test
	public void getEntiByFacilitatoreTest() {
		EnteProjectionImplementation enteProjectionImplementation = new EnteProjectionImplementation();
		enteProjectionImplementation.setId(1L);
		enteProjectionImplementation.setNome("NOMEENTE");
		enteProjectionImplementation.setNomeBreve("NOMEBREVEENTE");
		List<EnteProjection> listaEntiProjection = new ArrayList<>();
		listaEntiProjection.add(enteProjectionImplementation);
		when(this.enteSedeProgettoFacilitatoreRepository.findEntiByFacilitatoreAndIdProgetto("DFGREI79N20H101L", 1L)).thenReturn(listaEntiProjection);
		List<EnteProjection> risultato = enteSedeProgettoFacilitatoreService.getEntiByFacilitatore(profilazione);
		assertThat(risultato.size()).isEqualTo(listaEntiProjection.size());
	}
	
	@Test
	public void getSediByFacilitatoreTest() {
		SedeProjectionImplementation sedeProjectionImplementation = new SedeProjectionImplementation();
		sedeProjectionImplementation.setId(1L);
		sedeProjectionImplementation.setNome("NOMESEDE");
		List<SedeProjection> listaSediProjection = new ArrayList<>();
		listaSediProjection.add(sedeProjectionImplementation);
		when(this.enteSedeProgettoFacilitatoreRepository.findSediByFacilitatore(
				profilazione.getCodiceFiscaleUtenteLoggato(),
				profilazione.getIdEnte(),
				profilazione.getIdProgetto()
			)).thenReturn(listaSediProjection);
		List<SedeProjection> risultato = enteSedeProgettoFacilitatoreService.getSediByFacilitatore(profilazione);
		assertThat(risultato.size()).isEqualTo(listaSediProjection.size());
	}
	
	@Setter
	public class EnteProjectionImplementation implements EnteProjection {
		private Long id;
		private String nome;
		private String nomeBreve;

		@Override
		public Long getId() {
			return id;
		}

		@Override
		public String getNome() {
			return nome;
		}

		@Override
		public String getNomeBreve() {
			return nomeBreve;
		}
		
	}
	
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
