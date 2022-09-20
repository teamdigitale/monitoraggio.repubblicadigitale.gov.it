package it.pa.repdgt.opendata;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.web.client.RestTemplate;

@SpringBootTest(webEnvironment=WebEnvironment.RANDOM_PORT)
public class AppTests {
	
	@LocalServerPort
	protected int randomServerPort;
	
	@Autowired
	protected RestTemplate restTemplate;
	
	@Test
	public void contextLoads() throws Exception {
	}

}
