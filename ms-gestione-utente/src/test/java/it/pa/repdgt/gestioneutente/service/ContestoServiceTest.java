package it.pa.repdgt.gestioneutente.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Date;
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

import it.pa.repdgt.gestioneutente.entity.projection.ProfiloProjection;
import it.pa.repdgt.gestioneutente.entity.projection.ProgettoEnteProjection;
import it.pa.repdgt.gestioneutente.entity.projection.ProgettoEnteSedeProjection;
import it.pa.repdgt.gestioneutente.entity.projection.ReferenteDelegatoEnteGestoreProgettoProjection;
import it.pa.repdgt.gestioneutente.exception.ContestoException;
import it.pa.repdgt.gestioneutente.exception.ResourceNotFoundException;
import it.pa.repdgt.gestioneutente.repository.ContestoRepository;
import it.pa.repdgt.gestioneutente.repository.GruppoRepository;
import it.pa.repdgt.gestioneutente.repository.PermessoRepository;
import it.pa.repdgt.gestioneutente.repository.UtenteRepository;
import it.pa.repdgt.gestioneutente.request.IntegraContestoRequest;
import it.pa.repdgt.gestioneutente.resource.RuoloResource;
import it.pa.repdgt.shared.awsintegration.service.EmailService;
import it.pa.repdgt.shared.entity.EnteEntity;
import it.pa.repdgt.shared.entity.EntePartnerEntity;
import it.pa.repdgt.shared.entity.GruppoEntity;
import it.pa.repdgt.shared.entity.PermessoEntity;
import it.pa.repdgt.shared.entity.ProgettoEntity;
import it.pa.repdgt.shared.entity.ProgrammaEntity;
import it.pa.repdgt.shared.entity.RuoloEntity;
import it.pa.repdgt.shared.entity.UtenteEntity;
import it.pa.repdgt.shared.entity.key.EntePartnerKey;
import it.pa.repdgt.shared.entityenum.StatoEnum;
import it.pa.repdgt.shared.exception.InvioEmailException;
import it.pa.repdgt.shared.exception.StoricoEnteException;
import it.pa.repdgt.shared.service.storico.StoricoService;
import lombok.AllArgsConstructor;
import lombok.Setter;
import software.amazon.awssdk.services.pinpoint.model.SendMessagesResponse;

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
	@Mock
	private StoricoService storicoService;
	@Mock
	private ProgettoService progettoService;
	@Mock
	private EntePartnerService entePartnerService;
	@Mock
	private UtenteRepository utenteRepository;
	
	@Autowired
	@InjectMocks
	ContestoService service;
	
	UtenteEntity utente;
	String codiceFiscale = "codiceFiscaleTest";
	Long idProgramma = 1L;
	Long idProgetto = 2L;
	
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
	public void verificaSceltaProfiloTest() throws Exception {
		/** TEST DTD/DSCU/CUSTOM **/
		when(this.ruoloService.getRuoliByCodiceFiscaleUtente(codiceFiscale)).thenReturn(Arrays.asList("DTD"));
		service.verificaSceltaProfilo(codiceFiscale, "DTD", idProgramma, idProgetto);
		
		when(this.ruoloService.getRuoliByCodiceFiscaleUtente(codiceFiscale)).thenReturn(Arrays.asList("ECC"));
		Assertions.assertThrows(ContestoException.class, () -> service.verificaSceltaProfilo(codiceFiscale, "DTD", idProgramma, idProgetto));
		
		/** TEST REG/DEG **/
		when(this.ruoloService.getRuoliByCodiceFiscaleUtente(codiceFiscale)).thenReturn(Arrays.asList("DEG"));
		when(contestoRepository.verificaUtenteRuoloDEGREGPerProgramma(idProgramma, codiceFiscale, "DEG")).thenReturn(0);
		Assertions.assertThrows(ContestoException.class, () -> service.verificaSceltaProfilo(codiceFiscale, "DEG", idProgramma, idProgetto));
		
		when(this.ruoloService.getRuoliByCodiceFiscaleUtente(codiceFiscale)).thenReturn(Arrays.asList("DTD", "DEG"));
		when(contestoRepository.verificaUtenteRuoloDEGREGPerProgramma(idProgramma, codiceFiscale, "DEG")).thenReturn(1);
		when(contestoRepository.findById(idProgramma)).thenReturn(Optional.empty());
		Assertions.assertThrows(ResourceNotFoundException.class, () -> service.verificaSceltaProfilo(codiceFiscale, "DEG", idProgramma, idProgetto));
		
		ProgrammaEntity programma = new ProgrammaEntity();
		programma.setId(idProgramma);
		programma.setStato(StatoEnum.NON_ATTIVO.getValue());
		EnteEntity ente = new EnteEntity();
		ente.setId(1000L);
		programma.setStatoGestoreProgramma(StatoEnum.NON_ATTIVO.getValue());
		programma.setEnteGestoreProgramma(ente);
		when(contestoRepository.findById(idProgramma)).thenReturn(Optional.of(programma));
		doNothing().when(contestoRepository).updateStatoProgrammaToAttivo(idProgramma);
		doNothing().when(contestoRepository).updateStatoGestoreProgrammaToAttivo(idProgramma);
		doNothing().when(storicoService).storicizzaEnteGestoreProgramma(programma, StatoEnum.ATTIVO.getValue());
		doNothing().when(contestoRepository).attivaREGDEG(idProgramma, codiceFiscale, "DEG");
		when(contestoRepository.getIdsProgettiAttivabili(idProgramma)).thenReturn(Collections.emptyList());
		
		service.verificaSceltaProfilo(codiceFiscale, "DEG", idProgramma, idProgetto);
		
		doThrow(new Exception()).when(storicoService).storicizzaEnteGestoreProgramma(programma, StatoEnum.ATTIVO.getValue());
		Assertions.assertThrows(Exception.class, () -> service.verificaSceltaProfilo(codiceFiscale, "DEG", idProgramma, idProgetto));
		
		doNothing().when(storicoService).storicizzaEnteGestoreProgramma(programma, StatoEnum.ATTIVO.getValue());
		service.verificaSceltaProfilo(codiceFiscale, "DEG", idProgramma, idProgetto);
		
		programma.setStato(StatoEnum.ATTIVO.getValue());
		programma.setStatoGestoreProgramma(StatoEnum.ATTIVO.getValue());
		List<Long> idsProgetti = Arrays.asList(1L,2L);
		when(contestoRepository.getIdsProgettiAttivabili(idProgramma)).thenReturn(idsProgetti);
		doNothing().when(contestoRepository).rendiProgettiAttivabili(idsProgetti);
		ReferenteGestoreProgetto referente1 = new ReferenteGestoreProgetto("a@a.gmail.com", 1L);
		ReferenteGestoreProgetto referente2 = new ReferenteGestoreProgetto("b@b.gmail.com", 2L);
		List<ReferenteDelegatoEnteGestoreProgettoProjection> referenti = Arrays.asList(referente1, referente2);
		when(this.referentiDelegatiEnteGestoreProgettoService.getEmailReferentiDelegatiEnteGestoreByIdProgetto(idsProgetti)).thenReturn(referenti);
		when(this.emailService.inviaEmail("oggetto_email", referente1.getEmail(), "Test_template")).thenReturn(SendMessagesResponse.builder().build());
		when(this.emailService.inviaEmail("oggetto_email", referente2.getEmail(), "Test_template")).thenReturn(SendMessagesResponse.builder().build());
		service.verificaSceltaProfilo(codiceFiscale, "DEG", idProgramma, idProgetto);
		
		programma.setStato(StatoEnum.TERMINATO.getValue());
		doThrow(new InvioEmailException("messaggio eccezione")).when(emailService).inviaEmail("oggetto_email", referente1.getEmail(), "Test_template");
		service.verificaSceltaProfilo(codiceFiscale, "DEG", idProgramma, idProgetto);
		
		/** TEST REGP/DEGP **/
		when(this.ruoloService.getRuoliByCodiceFiscaleUtente(codiceFiscale)).thenReturn(Arrays.asList("REGP"));
		when(contestoRepository.getProgettoProgramma(idProgetto, idProgramma)).thenReturn(0);
		Assertions.assertThrows(ContestoException.class, () -> service.verificaSceltaProfilo(codiceFiscale, "REGP", idProgramma, idProgetto));
		
		when(contestoRepository.getProgettoProgramma(idProgetto, idProgramma)).thenReturn(1);
		when(contestoRepository.verificaUtenteRuoloDEGPREGPPerProgetto(idProgetto, codiceFiscale, "REGP")).thenReturn(0);
		Assertions.assertThrows(ContestoException.class, () -> service.verificaSceltaProfilo(codiceFiscale, "REGP", idProgramma, idProgetto));
		
		when(contestoRepository.verificaUtenteRuoloDEGPREGPPerProgetto(idProgetto, codiceFiscale, "REGP")).thenReturn(1);
		doNothing().when(contestoRepository).attivaREGPDEGP(idProgetto, codiceFiscale, "REGP");

		ProgettoEnteProjImplementation progettoEnte = new ProgettoEnteProjImplementation(idProgetto, 1000L, StatoEnum.ATTIVO.getValue());
		when(contestoRepository.getProgettoEnteGestoreProgetto(idProgetto, idProgramma)).thenReturn(progettoEnte);
		service.verificaSceltaProfilo(codiceFiscale, "REGP", idProgramma, idProgetto);
		
		progettoEnte = new ProgettoEnteProjImplementation(idProgetto, 1000L, StatoEnum.NON_ATTIVO.getValue());
		when(contestoRepository.getProgettoEnteGestoreProgetto(idProgetto, idProgramma)).thenReturn(progettoEnte);
		doNothing().when(contestoRepository).updateStatoGestoreProgettoInAttivo(idProgetto);
		ProgettoEntity progetto = new ProgettoEntity();
		progetto.setId(idProgetto);
		progetto.setStato(StatoEnum.NON_ATTIVO.getValue());
		when(progettoService.getProgettoById(idProgetto)).thenReturn(progetto);
		doNothing().when(storicoService).storicizzaEnteGestoreProgetto(progetto, StatoEnum.ATTIVO.getValue());
		service.verificaSceltaProfilo(codiceFiscale, "REGP", idProgramma, idProgetto);
		
		doThrow(new StoricoEnteException("messaggio Errore")).when(storicoService).storicizzaEnteGestoreProgetto(progetto, StatoEnum.ATTIVO.getValue());
		Assertions.assertThrows(ContestoException.class, () -> service.verificaSceltaProfilo(codiceFiscale, "REGP", idProgramma, idProgetto));

		/** TEST REPP/DEPP **/
		when(this.ruoloService.getRuoliByCodiceFiscaleUtente(codiceFiscale)).thenReturn(Arrays.asList("REPP"));		
		when(contestoRepository.getProgettoProgramma(idProgetto, idProgramma)).thenReturn(1);
		
		when(contestoRepository.verificaUtenteRuoloDEPPREPPPerProgetto(idProgetto, codiceFiscale, "REPP")).thenReturn(0);
		Assertions.assertThrows(ContestoException.class, () -> service.verificaSceltaProfilo(codiceFiscale, "REPP", idProgramma, idProgetto));
		
		when(contestoRepository.verificaUtenteRuoloDEPPREPPPerProgetto(idProgetto, codiceFiscale, "REPP")).thenReturn(1);
		progettoEnte = new ProgettoEnteProjImplementation(idProgetto, 1000L, StatoEnum.ATTIVO.getValue());
		when(contestoRepository.findEntiPartnerNonTerminatiPerProgettoECodiceFiscaleReferenteDelegato(idProgetto, idProgramma, codiceFiscale, "REPP")).thenReturn(Arrays.asList(progettoEnte));
		service.verificaSceltaProfilo(codiceFiscale, "REPP", idProgramma, idProgetto);
		
		progettoEnte = new ProgettoEnteProjImplementation(idProgetto, 1000L, StatoEnum.NON_ATTIVO.getValue());
		when(contestoRepository.findEntiPartnerNonTerminatiPerProgettoECodiceFiscaleReferenteDelegato(idProgetto, idProgramma, codiceFiscale, "REPP")).thenReturn(Arrays.asList(progettoEnte));
		doNothing().when(contestoRepository).updateStatoEntePartnerProgettoToAttivo(progettoEnte.getIdProgetto(), progettoEnte.getIdEnte());
		EntePartnerEntity entePartner = new EntePartnerEntity();
		EntePartnerKey key = new EntePartnerKey();
		key.setIdEnte(1000L);
		key.setIdProgetto(idProgetto);
		entePartner.setId(key);
		entePartner.setStatoEntePartner(StatoEnum.NON_ATTIVO.getValue());	
		when(entePartnerService.findEntePartnerByIdProgettoAndIdEnte(progettoEnte.getIdEnte(), progettoEnte.getIdProgetto())).thenReturn(entePartner);
		doNothing().when(storicoService).storicizzaEntePartner(entePartner, StatoEnum.ATTIVO.getValue());
		service.verificaSceltaProfilo(codiceFiscale, "REPP", idProgramma, idProgetto);
		
		doThrow(new StoricoEnteException("messaggio Errore")).when(storicoService).storicizzaEntePartner(entePartner, StatoEnum.ATTIVO.getValue());
		Assertions.assertThrows(ContestoException.class, () -> service.verificaSceltaProfilo(codiceFiscale, "REPP", idProgramma, idProgetto));
		
		/** TEST FAC **/
		when(this.ruoloService.getRuoliByCodiceFiscaleUtente(codiceFiscale)).thenReturn(Arrays.asList("FAC"));
		ProgettoEnteSedeProjImplementation enteSedeProgetto = new ProgettoEnteSedeProjImplementation(idProgetto, idProgramma, 1005L, StatoEnum.ATTIVO.getValue());
		when(contestoRepository.findSediPerProgrammaECodiceFiscaleFacilitatoreVolontario(idProgetto, codiceFiscale, "FAC")).thenReturn(Arrays.asList(enteSedeProgetto));
		doNothing().when(contestoRepository).attivaFACVOL(enteSedeProgetto.getIdProgetto(), enteSedeProgetto.getIdEnte(), enteSedeProgetto.getIdSede(), codiceFiscale, "FAC");
		service.verificaSceltaProfilo(codiceFiscale, "FAC", idProgramma, idProgetto);
	}
	@Test
	public void integraContestoTest() throws Exception {
		IntegraContestoRequest integraContestoRequestRequest = new IntegraContestoRequest();
		integraContestoRequestRequest.setAbilitazioneConsensoTrattamentoDatiPersonali(Boolean.TRUE);
		integraContestoRequestRequest.setBio("bio");
		integraContestoRequestRequest.setCodiceFiscale("codiceFiscale");
		integraContestoRequestRequest.setCognome("cognome");
		integraContestoRequestRequest.setNome("nome");
		integraContestoRequestRequest.setEmail("email");
		integraContestoRequestRequest.setTelefono("43734987");
		UtenteEntity utenteDBFtech = new UtenteEntity();
		utenteDBFtech.setIntegrazione(Boolean.TRUE);
		utenteDBFtech.setNome(integraContestoRequestRequest.getNome());
		utenteDBFtech.setCognome(integraContestoRequestRequest.getCognome());
		utenteDBFtech.setCodiceFiscale(integraContestoRequestRequest.getCodiceFiscale());
		utenteDBFtech.setEmail(integraContestoRequestRequest.getEmail());
		utenteDBFtech.setTelefono(integraContestoRequestRequest.getTelefono());
		utenteDBFtech.setMansione(integraContestoRequestRequest.getBio());
		
		when(this.utenteService.getUtenteByCodiceFiscale("codiceFiscale")).thenReturn(utenteDBFtech);
		when(utenteService.salvaUtente(utenteDBFtech)).thenReturn(utenteDBFtech);
		service.integraContesto(integraContestoRequestRequest);
		
		integraContestoRequestRequest.setAbilitazioneConsensoTrattamentoDatiPersonali(Boolean.FALSE);
		Assertions.assertThrows(ContestoException.class, () -> service.integraContesto(integraContestoRequestRequest));
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
	
	@AllArgsConstructor
	@Setter
	public class ReferenteGestoreProgetto implements ReferenteDelegatoEnteGestoreProgettoProjection{

		private String email;
		private Long idProgetto;
		
		@Override
		public String getEmail() {
			return email;
		}

		@Override
		public Long getIdProgetto() {
			return idProgetto;
		}
		
	}
	@AllArgsConstructor
	@Setter
	public class ProgettoEnteProjImplementation implements ProgettoEnteProjection{
		private Long idProgetto;
		private Long idEnte;
		private String stato;
		
		@Override
		public Long getIdProgetto() {
			return idProgetto;
		}

		@Override
		public Long getIdEnte() {
			return idEnte;
		}

		@Override
		public String getStato() {
			return stato;
		}
		
	}
	@AllArgsConstructor
	@Setter
	public class ProgettoEnteSedeProjImplementation implements ProgettoEnteSedeProjection{
		private Long idProgetto;
		private Long idEnte;
		private Long idSede;
		private String stato;
		
		@Override
		public Long getIdProgetto() {
			return idProgetto;
		}
		
		@Override
		public Long getIdEnte() {
			return idEnte;
		}
		
		@Override
		public String getStato() {
			return stato;
		}

		@Override
		public Long getIdSede() {
			return idSede;
		}
		
	}
}
