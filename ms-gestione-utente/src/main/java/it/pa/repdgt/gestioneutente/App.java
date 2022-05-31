package it.pa.repdgt.gestioneutente;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.EnableAspectJAutoProxy;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

import lombok.extern.slf4j.Slf4j;

@SpringBootApplication
@EnableAspectJAutoProxy
@EnableJpaRepositories(basePackages = "it.pa.repdgt")
@ComponentScan(basePackages = {"it.pa.repdgt"})
@EntityScan(basePackages = {"it.pa.repdgt"})
@Slf4j
public class App implements CommandLineRunner {
	
	public static void main(String[] args) {
		/*ConfigurableApplicationContext springBootApp =*/ SpringApplication.run(App.class, args);
		log.info("***** APPLICATION START *****");
	}
	
	@Override
	public void run(String... args) throws Exception {
	}
}