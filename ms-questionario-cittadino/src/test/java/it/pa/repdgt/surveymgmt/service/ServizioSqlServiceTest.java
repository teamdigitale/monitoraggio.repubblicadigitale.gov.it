package it.pa.repdgt.surveymgmt.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatExceptionOfType;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;

import it.pa.repdgt.shared.entity.EnteSedeProgettoFacilitatoreEntity;
import it.pa.repdgt.shared.entity.ProgrammaXQuestionarioTemplateEntity;
import it.pa.repdgt.shared.entity.RuoloEntity;
import it.pa.repdgt.shared.entity.ServizioEntity;
import it.pa.repdgt.shared.entity.key.EnteSedeProgettoFacilitatoreKey;
import it.pa.repdgt.shared.entity.key.ProgrammaXQuestionarioTemplateKey;
import it.pa.repdgt.shared.entityenum.RuoloUtenteEnum;
import it.pa.repdgt.shared.restapi.param.SceltaProfiloParam;
import it.pa.repdgt.surveymgmt.exception.QuestionarioTemplateException;
import it.pa.repdgt.surveymgmt.exception.ResourceNotFoundException;
import it.pa.repdgt.surveymgmt.exception.ServizioException;
import it.pa.repdgt.surveymgmt.param.FiltroListaServiziParam;
import it.pa.repdgt.surveymgmt.param.ProfilazioneSedeParam;
import it.pa.repdgt.surveymgmt.projection.EnteProjection;
import it.pa.repdgt.surveymgmt.projection.SedeProjection;
import it.pa.repdgt.surveymgmt.repository.ServizioSqlRepository;
import it.pa.repdgt.surveymgmt.repository.TipologiaServizioRepository;
import it.pa.repdgt.surveymgmt.request.ServizioRequest;
import lombok.Setter;

@ExtendWith(MockitoExtension.class)
public class ServizioSqlServiceTest {
	
	@Mock
	private EnteSedeProgettoFacilitatoreService enteSedeProgettoFacilitatoreService;
	@Mock
	private ProgrammaXQuestionarioTemplateService programmaXQuestionarioTemplateService;
	@Mock
	private ServizioSqlRepository servizioSqlRepository;
	@Mock
	private TipologiaServizioRepository tipologiaServizioRepository;
	@Mock
	private RuoloService ruoloService;

	@Autowired
	@InjectMocks
	private ServizioSqlService servizioSqlService;
	
	ServizioEntity servizio;
	List<ServizioEntity> listaServizi;
	FiltroListaServiziParam filtroListaServizi;
	List<String> listaStati;
	List<String> listaTipologie;
	SceltaProfiloParam sceltaprofiloParam;
	ServizioRequest servizioRequest;
	ProgrammaXQuestionarioTemplateKey programmaXQuestionarioTemplateKey;
	ProgrammaXQuestionarioTemplateEntity programmaXQuestionarioTemplateEntity;
	List<ProgrammaXQuestionarioTemplateEntity> listaProgrammaXQuestionario;
	EnteSedeProgettoFacilitatoreKey enteSedeProgettoFacilitatoreKey;
	EnteSedeProgettoFacilitatoreEntity enteSedeProgettoFacilitatoreEntity;
	RuoloEntity ruolo;
	List<RuoloEntity> listaRuoli;
	ProfilazioneSedeParam profilazioneSedeParam;
	
	@BeforeEach
	public void setUp() {
		servizio = new ServizioEntity();
		servizio.setId(1L);
		listaServizi = new ArrayList<>();
		listaServizi.add(servizio);
		listaStati = new ArrayList<>();
		listaStati.add("ATTIVO");
		listaTipologie = new ArrayList<>();
		listaTipologie.add("TIPOLOGIA");
		filtroListaServizi = new FiltroListaServiziParam();
		filtroListaServizi.setCriterioRicerca("CRITERIORICERCA");
		filtroListaServizi.setStatiServizio(listaStati);
		filtroListaServizi.setTipologieServizi(listaTipologie);
		sceltaprofiloParam = new SceltaProfiloParam();
		sceltaprofiloParam.setCfUtenteLoggato("CFUTENTE");
		sceltaprofiloParam.setCodiceRuoloUtenteLoggato(RuoloUtenteEnum.DTD.toString());
		sceltaprofiloParam.setIdProgetto(1L);
		sceltaprofiloParam.setIdProgramma(1L);
		servizioRequest = new ServizioRequest();
		servizioRequest.setProfilazioneParam(sceltaprofiloParam);
		servizioRequest.setNomeServizio("NOMESERVIZIO");
		servizioRequest.setIdEnte(1L);
		servizioRequest.setIdSede(1L);
		servizioRequest.setDataServizio(new Date());
		servizioRequest.setDurataServizio("DURATASERVIZIO");
		servizioRequest.setListaTipologiaServizi(listaTipologie);
		servizioRequest.setSezioneQuestionarioCompilatoQ3("{ \"sezioneQuestionarioCompilatoQ3\": \"{ \\\"id\\\": \\\"Q3\\\", \\\"title\\\": \\\"Sezione Q3\\\", \\\"properties\\\": [ \\\"{'24': ['risposta a', 'risposta b']}\\\", \\\"{'25': ['risposta a']}\\\",  \\\"{'3.3': ['risposta d']}\\\", \\\"{'3.4': ['riposta risposta', 'risposta c']}\\\"] }\",\r\n"
				+ "  \"tipoDiServizioPrenotato\": \"Servizio AAA\"\r\n"
				+ "}");
		programmaXQuestionarioTemplateKey = new ProgrammaXQuestionarioTemplateKey(1L, "IDQUESTIONARIO");
		programmaXQuestionarioTemplateEntity = new ProgrammaXQuestionarioTemplateEntity();
		programmaXQuestionarioTemplateEntity.setProgrammaXQuestionarioTemplateKey(programmaXQuestionarioTemplateKey);
		listaProgrammaXQuestionario = new ArrayList<>();
		listaProgrammaXQuestionario.add(programmaXQuestionarioTemplateEntity);
		enteSedeProgettoFacilitatoreKey = new EnteSedeProgettoFacilitatoreKey(1L, 1L, 1L, "DFGREI79N20H101L");
		enteSedeProgettoFacilitatoreEntity = new EnteSedeProgettoFacilitatoreEntity();
		enteSedeProgettoFacilitatoreEntity.setId(enteSedeProgettoFacilitatoreKey);
		ruolo = new RuoloEntity();
		ruolo.setCodice("FAC");
		listaRuoli = new ArrayList<>();
		listaRuoli.add(ruolo);
		profilazioneSedeParam = new ProfilazioneSedeParam();
		profilazioneSedeParam.setCfUtenteLoggato("CFUTENTE");
		profilazioneSedeParam.setCodiceRuoloUtenteLoggato(RuoloUtenteEnum.FAC.toString());
		profilazioneSedeParam.setIdEnte(1L);
		profilazioneSedeParam.setIdProgetto(1L);
		profilazioneSedeParam.setIdProgramma(1L);
	}
	
	@Test
	public void getServizioByIdTest() {
		when(this.servizioSqlRepository.findById(servizio.getId())).thenReturn(Optional.of(servizio));
		ServizioEntity risultato = servizioSqlService.getServizioById(servizio.getId());
		assertThat(risultato.getId()).isEqualTo(servizio.getId());
	}
	
	@Test
	public void getServizioByIdKOTest() {
		//test KO per servizio non trovato
		when(this.servizioSqlRepository.findById(servizio.getId())).thenReturn(Optional.empty());
		Assertions.assertThrows(ResourceNotFoundException.class, () -> servizioSqlService.getServizioById(servizio.getId()));
		assertThatExceptionOfType(ResourceNotFoundException.class);
	}
	
	@Test
	public void getAllServiziByFiltroTest() {
		when(this.servizioSqlRepository.findAllServiziByFiltro(
				filtroListaServizi.getCriterioRicerca(),
				filtroListaServizi.getTipologieServizi(),
				filtroListaServizi.getStatiServizio()
			)).thenReturn(listaServizi);
		List<ServizioEntity> risultato = servizioSqlService.getAllServiziByFiltro(
				filtroListaServizi.getCriterioRicerca(),
				filtroListaServizi.getTipologieServizi(),
				filtroListaServizi.getStatiServizio());
		assertThat(risultato.size()).isEqualTo(listaServizi.size());
	}
	
	@Test
	public void getAllServiziByPolicySCDAndFiltroTest() {
		when(this.servizioSqlRepository.findAllServiziByPolicySCDAndFiltro(
				filtroListaServizi.getCriterioRicerca(),
				filtroListaServizi.getTipologieServizi(),
				filtroListaServizi.getStatiServizio()
			)).thenReturn(listaServizi);
		List<ServizioEntity> risultato = servizioSqlService.getAllServiziByPolicySCDAndFiltro(
				filtroListaServizi.getCriterioRicerca(),
				filtroListaServizi.getTipologieServizi(),
				filtroListaServizi.getStatiServizio());
		assertThat(risultato.size()).isEqualTo(listaServizi.size());
	}
	
	@Test
	public void getAllServiziByFacilitatoreOVolontarioAndFiltroTest() {
		when(this.servizioSqlRepository.findAllServiziByFacilitatoreOVolontarioAndFiltro(
				filtroListaServizi.getCriterioRicerca(),
				Arrays.asList(sceltaprofiloParam.getIdProgramma().toString()),
				Arrays.asList(sceltaprofiloParam.getIdProgetto().toString()),
				filtroListaServizi.getTipologieServizi(),
				filtroListaServizi.getStatiServizio(),
				sceltaprofiloParam.getCfUtenteLoggato()
			)).thenReturn(listaServizi);
		List<ServizioEntity> risultato = servizioSqlService.getAllServiziByFacilitatoreOVolontarioAndFiltro(
				filtroListaServizi.getCriterioRicerca(),
				Arrays.asList(sceltaprofiloParam.getIdProgramma().toString()),
				Arrays.asList(sceltaprofiloParam.getIdProgetto().toString()),
				filtroListaServizi.getTipologieServizi(),
				filtroListaServizi.getStatiServizio(),
				sceltaprofiloParam.getCfUtenteLoggato());
		assertThat(risultato.size()).isEqualTo(listaServizi.size());
	}
	
	@Test
	public void getAllServiziByReferenteODelegatoGestoreProgrammaAndFiltroTest() {
		when(this.servizioSqlRepository.findAllServiziByReferenteODelegatoGestoreProgrammaAndFiltro(
				filtroListaServizi.getCriterioRicerca(),
				Arrays.asList(sceltaprofiloParam.getIdProgramma().toString()),
				filtroListaServizi.getTipologieServizi(),
				filtroListaServizi.getStatiServizio()
			)).thenReturn(listaServizi);
		List<ServizioEntity> risultato = servizioSqlService.getAllServiziByReferenteODelegatoGestoreProgrammaAndFiltro(
				filtroListaServizi.getCriterioRicerca(),
				Arrays.asList(sceltaprofiloParam.getIdProgramma().toString()),
				filtroListaServizi.getTipologieServizi(),
				filtroListaServizi.getStatiServizio());
		assertThat(risultato.size()).isEqualTo(listaServizi.size());
	}
	
	@Test
	public void getAllServiziByReferenteODelegatoGestoreProgettoAndFiltroTest() {
		when(this.servizioSqlRepository.findAllServiziByReferenteODelegatoGestoreProgettoAndFiltro(
				filtroListaServizi.getCriterioRicerca(),
				Arrays.asList(sceltaprofiloParam.getIdProgramma().toString()),
				Arrays.asList(sceltaprofiloParam.getIdProgetto().toString()),
				filtroListaServizi.getTipologieServizi(),
				filtroListaServizi.getStatiServizio()
			)).thenReturn(listaServizi);
		List<ServizioEntity> risultato = servizioSqlService.getAllServiziByReferenteODelegatoGestoreProgettoAndFiltro(
				filtroListaServizi.getCriterioRicerca(),
				Arrays.asList(sceltaprofiloParam.getIdProgramma().toString()),
				Arrays.asList(sceltaprofiloParam.getIdProgetto().toString()),
				filtroListaServizi.getTipologieServizi(),
				filtroListaServizi.getStatiServizio());
		assertThat(risultato.size()).isEqualTo(listaServizi.size());
	}
	
	@Test
	public void getAllServiziByReferenteODelegatoEntePartnerAndFiltroTest() {
		when(this.servizioSqlRepository.findAllServiziByReferenteODelegatoEntePartnerAndFiltro(
				filtroListaServizi.getCriterioRicerca(),
				Arrays.asList(sceltaprofiloParam.getIdProgramma().toString()),
				Arrays.asList(sceltaprofiloParam.getIdProgetto().toString()),
				filtroListaServizi.getTipologieServizi(),
				filtroListaServizi.getStatiServizio()
			)).thenReturn(listaServizi);
		List<ServizioEntity> risultato = servizioSqlService.getAllServiziByReferenteODelegatoEntePartnerAndFiltro(
				filtroListaServizi.getCriterioRicerca(),
				Arrays.asList(sceltaprofiloParam.getIdProgramma().toString()),
				Arrays.asList(sceltaprofiloParam.getIdProgetto().toString()),
				filtroListaServizi.getTipologieServizi(),
				filtroListaServizi.getStatiServizio());
		assertThat(risultato.size()).isEqualTo(listaServizi.size());
	}
	
	@Test
	public void salvaServizioTest() {
		when(this.programmaXQuestionarioTemplateService.getByIdProgramma(sceltaprofiloParam.getIdProgramma())).thenReturn(listaProgrammaXQuestionario);
		when(this.enteSedeProgettoFacilitatoreService.getById(Mockito.any(EnteSedeProgettoFacilitatoreKey.class))).thenReturn(enteSedeProgettoFacilitatoreEntity);
		when(this.servizioSqlRepository.save(Mockito.any(ServizioEntity.class))).thenReturn(servizio);
		ServizioEntity risultato = servizioSqlService.salvaServizio(servizioRequest, servizioRequest.getSezioneQuestionarioCompilatoQ3());
		assertThat(risultato.getId()).isEqualTo(servizio.getId());
	}
	
	@Test
	public void creaServizioTest() {
		when(this.programmaXQuestionarioTemplateService.getByIdProgramma(sceltaprofiloParam.getIdProgramma())).thenReturn(listaProgrammaXQuestionario);
		when(this.enteSedeProgettoFacilitatoreService.getById(Mockito.any(EnteSedeProgettoFacilitatoreKey.class))).thenReturn(enteSedeProgettoFacilitatoreEntity);
		ServizioEntity risultato = servizioSqlService.creaServizio(servizioRequest, servizioRequest.getSezioneQuestionarioCompilatoQ3());
		assertThat(risultato.getNome()).isEqualTo(servizioRequest.getNomeServizio());
	}
	
	@Test
	public void creaServizioKOTest() {
		//test KO per questionario non associato al programma
		when(this.programmaXQuestionarioTemplateService.getByIdProgramma(sceltaprofiloParam.getIdProgramma())).thenReturn(new ArrayList<>());
		Assertions.assertThrows(ServizioException.class, () -> servizioSqlService.creaServizio(servizioRequest, servizioRequest.getSezioneQuestionarioCompilatoQ3()));
		assertThatExceptionOfType(ServizioException.class);
	}
	
	@Test
	public void aggiornaServizioTest() {
		when(this.servizioSqlRepository.findById(servizio.getId())).thenReturn(Optional.of(servizio));
		doNothing().when(this.tipologiaServizioRepository).deleteByIdServizio(servizio.getId());
		when(this.servizioSqlRepository.save(Mockito.any(ServizioEntity.class))).thenReturn(servizio);
		ServizioEntity risultato = servizioSqlService.aggiornaServizio(servizio.getId(), servizioRequest);
		assertThat(risultato.getId()).isEqualTo(servizio.getId());
	}
	
	@Test
	public void getEntiByFacilitatoreTest() {
		sceltaprofiloParam.setCodiceRuoloUtenteLoggato(RuoloUtenteEnum.FAC.toString());
		EnteProjectionImplementation enteProjectionImplementation = new EnteProjectionImplementation();
		enteProjectionImplementation.setId(1L);
		enteProjectionImplementation.setNome("NOMEENTE");
		enteProjectionImplementation.setNomeBreve("ENTE");
		List<EnteProjection> listaEntiProjection = new ArrayList<>();
		listaEntiProjection.add(enteProjectionImplementation);
		when(this.ruoloService.getRuoliByCodiceFiscale(sceltaprofiloParam.getCfUtenteLoggato())).thenReturn(listaRuoli);
		when(this.enteSedeProgettoFacilitatoreService.getEntiByFacilitatore(sceltaprofiloParam)).thenReturn(listaEntiProjection);
		List<EnteProjection> risultato = servizioSqlService.getEntiByFacilitatore(sceltaprofiloParam);
		assertThat(risultato.size()).isEqualTo(listaEntiProjection.size());
	}
	
	@Test
	public void getEntiByFacilitatoreKOTest() {
		//test KO per ruolo non definito per l'utente o ruolo != FAC o VOL
		sceltaprofiloParam.setCodiceRuoloUtenteLoggato(RuoloUtenteEnum.DTD.toString());
		when(this.ruoloService.getRuoliByCodiceFiscale(sceltaprofiloParam.getCfUtenteLoggato())).thenReturn(listaRuoli);
		Assertions.assertThrows(QuestionarioTemplateException.class, () -> servizioSqlService.getEntiByFacilitatore(sceltaprofiloParam));
		assertThatExceptionOfType(QuestionarioTemplateException.class);
	}
	
	@Test
	public void getSediByFacilitatoreTest() {
		SedeProjectionImplementation sedeProjectionImplementation = new SedeProjectionImplementation();
		sedeProjectionImplementation.setId(1L);
		sedeProjectionImplementation.setNome("NOMESEDE");
		List<SedeProjection> listaSediProjection = new ArrayList<>();
		listaSediProjection.add(sedeProjectionImplementation);
		when(this.ruoloService.getRuoliByCodiceFiscale(sceltaprofiloParam.getCfUtenteLoggato())).thenReturn(listaRuoli);
		when(this.enteSedeProgettoFacilitatoreService.getSediByFacilitatore(profilazioneSedeParam)).thenReturn(listaSediProjection);
		List<SedeProjection> risultato = servizioSqlService.getSediByFacilitatore(profilazioneSedeParam);
		assertThat(risultato.size()).isEqualTo(listaSediProjection.size());
	}
	
	@Test
	public void getSediByFacilitatoreKOTest() {
		//test KO per ruolo non definito per l'utente o ruolo != FAC o VOL
		profilazioneSedeParam.setCodiceRuoloUtenteLoggato(RuoloUtenteEnum.DTD.toString());
		when(this.ruoloService.getRuoliByCodiceFiscale(sceltaprofiloParam.getCfUtenteLoggato())).thenReturn(listaRuoli);
		Assertions.assertThrows(QuestionarioTemplateException.class, () -> servizioSqlService.getSediByFacilitatore(profilazioneSedeParam));
		assertThatExceptionOfType(QuestionarioTemplateException.class);
	}
	
	@Test
	public void cancellaServivioTest() {
		doNothing().when(this.servizioSqlRepository).delete(servizio);
		servizioSqlService.cancellaServivio(servizio);
	}
	
	@Test
	public void getPrimoServizioByIdCittadino() {
		when(this.servizioSqlRepository.findServizioByCittadinoNotEqual(servizio.getId(), 1L)).thenReturn(Optional.of(servizio));
		servizioSqlService.getPrimoServizioByIdCittadino(servizio.getId(), 1L);
	}
	
	@Test
	public void getNominativoFacilitatoreByIdFacilitatoreAndIdServizioTest() {
		when(this.servizioSqlRepository.findNominativoFacilitatoreByIdFacilitatoreAndIdServizio("FERSDA89R32G975R", servizio.getId())).thenReturn("NOMEFACILITATORE");
		servizioSqlService.getNominativoFacilitatoreByIdFacilitatoreAndIdServizio("FERSDA89R32G975R", servizio.getId());
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
