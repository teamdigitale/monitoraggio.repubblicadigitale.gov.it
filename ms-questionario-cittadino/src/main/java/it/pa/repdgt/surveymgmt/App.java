package it.pa.repdgt.surveymgmt;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.web.client.RestTemplate;

import lombok.extern.slf4j.Slf4j;

@SpringBootApplication
@EnableJpaRepositories(basePackages = "it.pa.repdgt")
@ComponentScan(basePackages = { "it.pa.repdgt" })
@EntityScan(basePackages = { "it.pa.repdgt" })
@Slf4j
public class App {

	public static void main(String[] args) {
		/* ConfigurableApplicationContext springBootApp = */ SpringApplication.run(App.class, args);
		log.info("***** APPLICATION START *****");
	}
	
	@Bean
	public RestTemplate restTemplate() {
		return new RestTemplate();
	}
}