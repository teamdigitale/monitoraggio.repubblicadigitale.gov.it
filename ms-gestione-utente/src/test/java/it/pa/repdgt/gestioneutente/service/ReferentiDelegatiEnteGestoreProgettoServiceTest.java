package it.pa.repdgt.gestioneutente.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;

import it.pa.repdgt.gestioneutente.entity.projection.ReferenteDelegatoEnteGestoreProgettoProjection;
import it.pa.repdgt.gestioneutente.repository.ReferentiDelegatiEnteGestoreProgettoRepository;
import lombok.Setter;

//@ExtendWith(MockitoExtension.class)
public class ReferentiDelegatiEnteGestoreProgettoServiceTest {

	@Mock
	private ReferentiDelegatiEnteGestoreProgettoRepository referentiDelegatiEnteGestoreProgettoRepository;

	@Autowired
	@InjectMocks
	private ReferentiDelegatiEnteGestoreProgettoService service;

	// @Test
	public void getIdProgettiByRuoloUtenteTest() {
		List<Long> idsProgetto = new ArrayList<Long>();
		idsProgetto.add(1L);
		idsProgetto.add(2L);

		List<ReferenteDelegatoEnteGestoreProgettoProjection> referenti = new ArrayList<ReferenteDelegatoEnteGestoreProgettoProjection>();
		referenti.add(new ReferenteDelegatoEnteGestoreProgetto());
		when(this.referentiDelegatiEnteGestoreProgettoRepository
				.findEmailReferentiDelegatiEnteGestoreByIdsProgetti(idsProgetto)).thenReturn(referenti);
		assertThat(service.getEmailReferentiDelegatiEnteGestoreByIdProgetto(idsProgetto)).isNotNull();
	}

	@Setter
	class ReferenteDelegatoEnteGestoreProgetto implements ReferenteDelegatoEnteGestoreProgettoProjection {

		private String nome;
		private String email;
		private String codiceRuolo;
		private Long idProgetto;

		@Override
		public String getNome() {
			return nome;
		}

		@Override
		public String getEmail() {
			return email;
		}

		@Override
		public String getCodiceRuolo() {
			return codiceRuolo;
		}

		@Override
		public Long getIdProgetto() {
			return idProgetto;
		}

	}
}
