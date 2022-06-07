package it.pa.repdgt.programmaprogetto.repository;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class ProgrammaRepositoryTest{
	
	@Autowired
	private ProgrammaRepository repository;
	
	@Test
	void findAllEagerTest(){
		assertThat(repository.findAllEager()).isNotEmpty();
	}

}
