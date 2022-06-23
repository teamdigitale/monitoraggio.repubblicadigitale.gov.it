package it.pa.repdgt.gestioneutente.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;

import it.pa.repdgt.gestioneutente.entity.projection.ProfiloProjection;
import it.pa.repdgt.gestioneutente.repository.ContestoRepository;
import it.pa.repdgt.gestioneutente.repository.GruppoRepository;
import it.pa.repdgt.gestioneutente.repository.PermessoRepository;
import it.pa.repdgt.gestioneutente.resource.RuoloResource;
import it.pa.repdgt.shared.awsintegration.service.EmailService;
import it.pa.repdgt.shared.entity.GruppoEntity;
import it.pa.repdgt.shared.entity.PermessoEntity;
import it.pa.repdgt.shared.entity.RuoloEntity;
import it.pa.repdgt.shared.entity.UtenteEntity;
import lombok.Setter;

@ExtendWith(MockitoExtension.class)
public class ContestoServiceTest {

	@Mock
	private UtenteService utenteService;
	@Mock
	private ContestoRepository contestoRepository;
	@Mock
	private GruppoRepository gruppoRepository;
	@Mock
	private PermessoRepository permessoRepository;
	@Mock
	private RuoloService ruoloService;
	@Mock 
	private ReferentiDelegatiEnteGestoreProgettoService referentiDelegatiEnteGestoreProgettoService;
	@Mock 
	private EmailService emailService;
	
	@Autowired
	@InjectMocks
	ContestoService service;
	
	UtenteEntity utente;
	String codiceFiscale = "codiceFiscaleTest";
	
	@BeforeEach
	public void setUp() {
		utente = new UtenteEntity();
		utente.setCodiceFiscale(codiceFiscale);
		utente.setCognome("");
		utente.setEmail("a@a.com");
		utente.setNome("");
		utente.setTelefono("4554535");
		utente.setStato("ATTIVO");
		utente.setIntegrazione(true);
		
	}
	
	@Setter
	public class ProfiloProjectionImplementation implements ProfiloProjection{

		private String idProgramma;
		private String nomeProgramma;
		private String idProgetto;
		private String nomeEnte;
		
		@Override
		public String getIdProgramma() {
			return idProgramma;
		}

		@Override
		public String getNomeProgramma() {
			return nomeProgramma;
		}

		@Override
		public String getIdProgetto() {
			return idProgetto;
		}

		@Override
		public String getNomeEnte() {
			return nomeEnte;
		}
	}
	
	@Test
	public void creaContestoTest() {
		when(this.utenteService.getUtenteEagerByCodiceFiscale(codiceFiscale)).thenReturn(utente);
		assertThat(service.creaContesto(codiceFiscale)).isEqualTo(utente);
	}
	
	@Test
	public void getProfiliTest() {
		when(this.utenteService.getUtenteEagerByCodiceFiscale(codiceFiscale)).thenReturn(utente);
		List<ProfiloProjection> listaProfili = new ArrayList<ProfiloProjection>();
		ProfiloProjectionImplementation implProj = new ProfiloProjectionImplementation();
		implProj.setIdProgetto("idProgetto");
		implProj.setIdProgramma("idProgramma");
		implProj.setNomeEnte("nomeEnte");
		implProj.setNomeProgramma("nomeProgramma");
		listaProfili.add(implProj);
		when(this.contestoRepository.findProgrammiREGDEG(codiceFiscale, "REG")).thenReturn(listaProfili);
		List<RuoloEntity> ruoli = new ArrayList<>();
		//TEST per ruolo REG/DEG
		RuoloEntity ruoloReg = new RuoloEntity();
		
		ruoloReg.setCodice("REG");
		ruoloReg.setNome("");
		
		ruoli.add(ruoloReg);
		
		utente.setRuoli(ruoli);
		assertThat(service.getProfili(codiceFiscale).get(0).getIdProgramma()).isEqualTo("idProgramma");
		ruoli = new ArrayList<>();
		//TEST per ruolo DTD/DSCU o custom
		RuoloEntity ruoloDTD = new RuoloEntity();
		ruoloDTD.setCodice("DTD");
		ruoloDTD.setNome("");
		
		ruoli.add(ruoloDTD);
		utente.setRuoli(ruoli);
		assertThat(service.getProfili(codiceFiscale).get(0).getIdProgramma()).isNull();
		
		ruoli = new ArrayList<>();
		RuoloEntity ruolo = new RuoloEntity();
		//TEST per tutti gli altri ruoli
		ruolo.setCodice("REGP");
		ruolo.setNome("");
		
		ruoli.add(ruolo);
		
		ruolo = new RuoloEntity();
		ruolo.setCodice("REPP");
		ruolo.setNome("");
		
		ruoli.add(ruolo);
		
		ruolo = new RuoloEntity();
		ruolo.setCodice("FAC");
		ruolo.setNome("");
		
		ruoli.add(ruolo);
		utente.setRuoli(ruoli);
		
		implProj = new ProfiloProjectionImplementation();
		implProj.setIdProgetto("idProgetto");
		implProj.setIdProgramma("idProgramma");
		implProj.setNomeEnte("nomeEnte");
		implProj.setNomeProgramma("nomeProgramma");
		listaProfili.add(implProj);
		when(this.contestoRepository.findProgrammiProgettiREGPDEGP(codiceFiscale, "REGP")).thenReturn(listaProfili);
		when(this.contestoRepository.findProgrammiProgettiREPPDEPP(codiceFiscale, "REPP")).thenReturn(listaProfili);
		when(this.contestoRepository.findProgrammiProgettiFacVol(codiceFiscale, "FAC")).thenReturn(listaProfili);
		
		assertThat(service.getProfili(codiceFiscale).get(0).getIdProgetto()).isEqualTo("idProgetto");
	}
	
	@Test
	public void getGruppiPermessiTest() {
		List<RuoloResource> ruoli = new ArrayList<>();
		RuoloResource ruoloResource = new RuoloResource();
		ruoloResource.setCodiceRuolo("DTD");
		ruoloResource.setNomeRuolo("DTD");
		ruoli.add(ruoloResource);
		
		List<GruppoEntity> gruppiPerRuolo = new ArrayList<>();
		GruppoEntity gruppo =new GruppoEntity();
		gruppo.setCodice("codiceGruppo");
		gruppo.setDataOraAggiornamento(new Date());
		gruppo.setDataOraCreazione(new Date());
		gruppo.setDescrizione("gruppoTest");
		PermessoEntity permesso = new PermessoEntity();
		permesso.setCodice("codicePermesso");
		permesso.setDataOraAggiornamento(new Date());
		permesso.setDataOraCreazione(new Date());
		permesso.setDescrizione("permessoTest");
		permesso.setId(1L);
		List<PermessoEntity> permessi = gruppo.getPermessi();
		permessi.add(permesso);
		gruppo.setPermessi(permessi);
		gruppiPerRuolo.add(gruppo);
		when(permessoRepository.findPermessiByGruppo("codiceGruppo")).thenReturn(permessi);
		when(gruppoRepository.findGruppiByRuolo("DTD")).thenReturn(gruppiPerRuolo);
		assertThat(service.getGruppiPermessi(ruoli).get(0).getCodiceRuolo()).isEqualTo("DTD");

		
	}
	@Test
	public void verificaSceltaProfiloTest() {
		
	}
	@Test
	public void getProgettoProgrammaTest() {
		
	}
	@Test
	public void integraContestoTest() {
		
	}
}
