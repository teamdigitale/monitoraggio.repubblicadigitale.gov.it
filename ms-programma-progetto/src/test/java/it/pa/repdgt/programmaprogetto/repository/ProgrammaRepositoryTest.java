package it.pa.repdgt.programmaprogetto.repository;

import static org.assertj.core.api.Assertions.assertThat;

import org.springframework.beans.factory.annotation.Autowired;

//@SpringBootTest
public class ProgrammaRepositoryTest {

	@Autowired
	private ProgrammaRepository repository;

	// @Test
	void findAllEagerTest() {
		assertThat(repository.findAllEager()).isNotEmpty();
	}

}
