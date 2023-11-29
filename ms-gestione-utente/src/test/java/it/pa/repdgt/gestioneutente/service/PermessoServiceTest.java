package it.pa.repdgt.gestioneutente.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

import java.util.Date;
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
import it.pa.repdgt.gestioneutente.repository.PermessoRepository;
import it.pa.repdgt.shared.entity.PermessoEntity;

//@ExtendWith(MockitoExtension.class)
public class PermessoServiceTest {

	@Mock
	private PermessoRepository permessoRepository;

	@Autowired
	@InjectMocks
	private PermessoService service;

	PermessoEntity p;

	@BeforeEach
	public void setUp() {
		p = new PermessoEntity();
		p.setCodice("codice");
		p.setDataOraAggiornamento(new Date());
		p.setDataOraCreazione(new Date());
		p.setDescrizione("descrizione");
		p.setId(1L);
	}

	// @Test
	public void getPermessoByIdTest() {
		when(this.permessoRepository.findById(1L)).thenReturn(Optional.of(p));
		assertThat(service.getPermessoById(1L)).isEqualTo(p);
		when(this.permessoRepository.findById(2L)).thenReturn(Optional.empty());
		Assertions.assertThrows(ResourceNotFoundException.class, () -> service.getPermessoById(2L));
	}

	// @Test
	public void saveTest() {
		when(this.permessoRepository.save(p)).thenReturn(p);
		assertThat(service.save(p)).isEqualTo(p);
	}
}
