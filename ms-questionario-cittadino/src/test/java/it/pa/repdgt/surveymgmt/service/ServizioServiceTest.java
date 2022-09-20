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
import java.util.UUID;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import it.pa.repdgt.shared.entity.EnteEntity;
import it.pa.repdgt.shared.entity.QuestionarioTemplateEntity;
import it.pa.repdgt.shared.entity.RuoloEntity;
import it.pa.repdgt.shared.entity.SedeEntity;
import it.pa.repdgt.shared.entity.ServizioEntity;
import it.pa.repdgt.shared.entity.TipologiaServizioEntity;
import it.pa.repdgt.shared.entity.key.EnteSedeProgettoFacilitatoreKey;
import it.pa.repdgt.shared.entityenum.RuoloUtenteEnum;
import it.pa.repdgt.shared.restapi.param.SceltaProfiloParam;
import it.pa.repdgt.shared.restapi.param.SceltaProfiloParamLight;
import it.pa.repdgt.shared.restapi.param.SceltaProfiloParamLightProgramma;
import it.pa.repdgt.surveymgmt.collection.QuestionarioTemplateCollection;
import it.pa.repdgt.surveymgmt.collection.SezioneQ3Collection;
import it.pa.repdgt.surveymgmt.exception.ResourceNotFoundException;
import it.pa.repdgt.surveymgmt.exception.ServizioException;
import it.pa.repdgt.surveymgmt.mapper.ServizioMapper;
import it.pa.repdgt.surveymgmt.mongo.repository.SezioneQ3Respository;
import it.pa.repdgt.surveymgmt.param.FiltroListaServiziParam;
import it.pa.repdgt.surveymgmt.projection.ProgettoProjection;
import it.pa.repdgt.surveymgmt.repository.TipologiaServizioRepository;
import it.pa.repdgt.surveymgmt.request.ServizioRequest;
import lombok.Setter;

@ExtendWith(MockitoExtension.class)
public class ServizioServiceTest {
	
	@Mock
	private ServizioMapper servizioMapper;
	@Mock
	private UtenteService utenteService;
	@Mock
	private SezioneQ3Respository sezioneQ3Repository;
	@Mock
	private TipologiaServizioRepository tipologiaServizioRepository;
	@Mock
	private ServizioSqlService servizioSQLService;
	@Mock
	private ProgettoService progettoService;
	@Mock
	private EnteService enteService;
	@Mock
	private SedeService sedeService;
	@Mock
	private QuestionarioTemplateService questionarioTemplateService;
	@Mock 
	private QuestionarioTemplateSqlService questionarioTemplateSqlService;

	@Autowired
	@InjectMocks
	private ServizioService servizioService;
	
	SceltaProfiloParam sceltaProfiloParam;
	SceltaProfiloParamLightProgramma sceltaProfiloParamLightProgramma;
	FiltroListaServiziParam filtroListaServizi;
	List<String> listaStati;
	List<String> listaTipologie;
	RuoloEntity ruolo;
	List<RuoloEntity> listaRuoli;
	ServizioEntity servizio;
	List<ServizioEntity> listaServizi;
	Pageable pagina;
	ServizioRequest servizioRequest;
	SezioneQ3Collection sezioneQ3Collection;
	TipologiaServizioEntity tipologiaServizioEntity;
	List<TipologiaServizioEntity> listaTipologiaServizioEntities;
	EnteSedeProgettoFacilitatoreKey enteSedeProgettoFacilitatoreKey;
	EnteEntity ente;
	SedeEntity sede;
	QuestionarioTemplateEntity questionarioTemplateEntity;
	QuestionarioTemplateCollection questionarioTemplateCollection;
	
	@BeforeEach
	public void setUp() {
		listaStati = new ArrayList<>();
		listaStati.add("ATTIVO");
		listaTipologie = new ArrayList<>();
		listaTipologie.add("TIPOLOGIA");
		filtroListaServizi = new FiltroListaServiziParam();
		filtroListaServizi.setCriterioRicerca("CRITERIORICERCA");
		filtroListaServizi.setStatiServizio(listaStati);
		filtroListaServizi.setTipologieServizi(listaTipologie);
		sceltaProfiloParam = new SceltaProfiloParam();
		sceltaProfiloParam.setCfUtenteLoggato("CFUTENTE");
		sceltaProfiloParam.setCodiceRuoloUtenteLoggato(RuoloUtenteEnum.DTD.toString());
		sceltaProfiloParam.setIdProgetto(1L);
		sceltaProfiloParam.setIdProgramma(1L);
		sceltaProfiloParamLightProgramma = new SceltaProfiloParamLightProgramma();
		sceltaProfiloParamLightProgramma.setIdProgetto(1L);
		sceltaProfiloParamLightProgramma.setIdProgramma(1L);
		ruolo = new RuoloEntity();
		ruolo.setCodice("FAC");
		listaRuoli = new ArrayList<>();
		listaRuoli.add(ruolo);
		servizio = new ServizioEntity();
		servizio.setId(1L);
		servizio.setTipologiaServizio(null);
		servizio.setNome("NOMESERVIZIO");
		pagina = PageRequest.of(Integer.parseInt("0"), Integer.parseInt("10"));
		servizioRequest = new ServizioRequest();
		servizioRequest.setCfUtenteLoggato("CFUTENTE");
		servizioRequest.setCodiceRuoloUtenteLoggato(RuoloUtenteEnum.DTD.toString());
		servizioRequest.setProfilazioneParam(sceltaProfiloParamLightProgramma);
		servizioRequest.setNomeServizio("NOMESERVIZIO");
		servizioRequest.setIdEnte(1L);
		servizioRequest.setIdSede(1L);
		servizioRequest.setDataServizio(new Date());
		servizioRequest.setDurataServizio("DURATASERVIZIO");
		servizioRequest.setListaTipologiaServizi(listaTipologie);
		servizioRequest.setSezioneQuestionarioCompilatoQ3("{ \"sezioneQuestionarioCompilatoQ3\": \"{ \\\"id\\\": \\\"Q3\\\", \\\"title\\\": \\\"Sezione Q3\\\", \\\"properties\\\": [ \\\"{'24': ['risposta a', 'risposta b']}\\\", \\\"{'25': ['risposta a']}\\\",  \\\"{'3.3': ['risposta d']}\\\", \\\"{'3.4': ['riposta risposta', 'risposta c']}\\\"] }\",\r\n"
				+ "  \"tipoDiServizioPrenotato\": \"Servizio AAA\"\r\n"
				+ "}");
		sezioneQ3Collection = new SezioneQ3Collection();
		sezioneQ3Collection.setId(UUID.randomUUID().toString());
		servizio.setIdTemplateCompilatoQ3(sezioneQ3Collection.getId());
		tipologiaServizioEntity = new TipologiaServizioEntity();
		tipologiaServizioEntity.setId(1L);
		tipologiaServizioEntity.setTitolo("TITOLO");
		listaTipologiaServizioEntities = new ArrayList<>();
		listaTipologiaServizioEntities.add(tipologiaServizioEntity);
		servizio.setListaTipologiaServizi(listaTipologiaServizioEntities);
		listaServizi = new ArrayList<>();
		listaServizi.add(servizio);
		servizio.setStato("ATTIVO");
		ente = new EnteEntity();
		ente.setId(1L);
		ente.setNome("NOMEENTE");
		sede = new SedeEntity();
		sede.setId(1L);
		sede.setNome("NOMESEDE");
		enteSedeProgettoFacilitatoreKey = new EnteSedeProgettoFacilitatoreKey(ente.getId(), sede.getId(), 1L, "DERIOT43R23I938I");
		servizio.setIdEnteSedeProgettoFacilitatore(enteSedeProgettoFacilitatoreKey);
		questionarioTemplateEntity = new QuestionarioTemplateEntity();
		questionarioTemplateEntity.setId("IDQUESTIONARIO");
		servizio.setIdQuestionarioTemplateSnapshot(questionarioTemplateEntity.getId());
		questionarioTemplateCollection = new QuestionarioTemplateCollection();
		questionarioTemplateCollection.setIdQuestionarioTemplate(questionarioTemplateEntity.getId());
	}
	
	@Test
	public void getAllServiziPaginatiByProfilazioneAndFiltriTest() {
		when(this.utenteService.hasRuoloUtente(sceltaProfiloParam.getCfUtenteLoggato(), sceltaProfiloParam.getCodiceRuoloUtenteLoggato().toString())).thenReturn(true);
		when(this.servizioSQLService.getAllServiziByFiltro(
						"%" + filtroListaServizi.getCriterioRicerca() + "%",
						filtroListaServizi.getTipologieServizi(),
						filtroListaServizi.getStatiServizio()
					)).thenReturn(listaServizi);
		Page<ServizioEntity> risultato = servizioService.getAllServiziPaginatiByProfilazioneAndFiltri(sceltaProfiloParam, filtroListaServizi, pagina);
		assertThat(risultato.getContent().size()).isEqualTo(listaServizi.size());
	}
	
	@Test
	public void getAllServiziPaginatiByProfilazioneAndFiltriKOTest() {
		//test KO per ruolo non definito per l'utente
		when(this.utenteService.hasRuoloUtente(sceltaProfiloParam.getCfUtenteLoggato(), sceltaProfiloParam.getCodiceRuoloUtenteLoggato().toString())).thenReturn(false);
		Assertions.assertThrows(ServizioException.class, () -> servizioService.getAllServiziPaginatiByProfilazioneAndFiltri(sceltaProfiloParam, filtroListaServizi, pagina));
		assertThatExceptionOfType(ServizioException.class);
		
		//test KO per paginazione errata
		pagina = PageRequest.of(Integer.parseInt("11"), Integer.parseInt("10"));
		when(this.utenteService.hasRuoloUtente(sceltaProfiloParam.getCfUtenteLoggato(), sceltaProfiloParam.getCodiceRuoloUtenteLoggato().toString())).thenReturn(true);
		when(this.servizioSQLService.getAllServiziByFiltro(
						"%" + filtroListaServizi.getCriterioRicerca() + "%",
						filtroListaServizi.getTipologieServizi(),
						filtroListaServizi.getStatiServizio()
					)).thenReturn(listaServizi);
		Assertions.assertThrows(ServizioException.class, () -> servizioService.getAllServiziPaginatiByProfilazioneAndFiltri(sceltaProfiloParam, filtroListaServizi, pagina));
		assertThatExceptionOfType(ServizioException.class);
	}
	
	@Test
	public void getAllServiziByProfilazioneUtenteLoggatoAndFiltriDTDTest() {
		//test con ruoloUtenteLoggato = DTD
		when(this.utenteService.hasRuoloUtente(sceltaProfiloParam.getCfUtenteLoggato(), sceltaProfiloParam.getCodiceRuoloUtenteLoggato().toString())).thenReturn(true);
		when(this.servizioSQLService.getAllServiziByFiltro(
				"%" + filtroListaServizi.getCriterioRicerca() + "%",
				filtroListaServizi.getTipologieServizi(),
				filtroListaServizi.getStatiServizio()
			)).thenReturn(listaServizi);
		List<ServizioEntity> risultato = servizioService.getAllServiziByProfilazioneUtenteLoggatoAndFiltri(sceltaProfiloParam, filtroListaServizi);
		assertThat(risultato.size()).isEqualTo(listaServizi.size());
	}
	
	@Test
	public void getAllServiziByProfilazioneUtenteLoggatoAndFiltriDSCUTest() {
		//test con ruoloUtenteLoggato = DSCU
		sceltaProfiloParam.setCodiceRuoloUtenteLoggato(RuoloUtenteEnum.DSCU.toString());
		when(this.utenteService.hasRuoloUtente(sceltaProfiloParam.getCfUtenteLoggato(), sceltaProfiloParam.getCodiceRuoloUtenteLoggato().toString())).thenReturn(true);
		when(this.servizioSQLService.getAllServiziByPolicySCDAndFiltro(
				"%" + filtroListaServizi.getCriterioRicerca() + "%",
				filtroListaServizi.getTipologieServizi(),
				filtroListaServizi.getStatiServizio()
			)).thenReturn(listaServizi);
		List<ServizioEntity> risultato = servizioService.getAllServiziByProfilazioneUtenteLoggatoAndFiltri(sceltaProfiloParam, filtroListaServizi);
		assertThat(risultato.size()).isEqualTo(listaServizi.size());
	}
	
	@Test
	public void getAllServiziByProfilazioneUtenteLoggatoAndFiltriREGTest() {
		//test con ruoloUtenteLoggato = REG
		sceltaProfiloParam.setCodiceRuoloUtenteLoggato(RuoloUtenteEnum.REG.toString());
		when(this.utenteService.hasRuoloUtente(sceltaProfiloParam.getCfUtenteLoggato(), sceltaProfiloParam.getCodiceRuoloUtenteLoggato().toString())).thenReturn(true);
		when(this.servizioSQLService.getAllServiziByReferenteODelegatoGestoreProgrammaAndFiltro(
				"%" + filtroListaServizi.getCriterioRicerca() + "%",
				Arrays.asList( sceltaProfiloParam.getIdProgramma().toString() ),
				filtroListaServizi.getTipologieServizi(),
				filtroListaServizi.getStatiServizio()
			)).thenReturn(listaServizi);
		List<ServizioEntity> risultato = servizioService.getAllServiziByProfilazioneUtenteLoggatoAndFiltri(sceltaProfiloParam, filtroListaServizi);
		assertThat(risultato.size()).isEqualTo(listaServizi.size());
	}
	
	@Test
	public void getAllServiziByProfilazioneUtenteLoggatoAndFiltriREGPTest() {
		//test con ruoloUtenteLoggato = REGP/DEGP
		sceltaProfiloParam.setCodiceRuoloUtenteLoggato(RuoloUtenteEnum.REGP.toString());
		when(this.utenteService.hasRuoloUtente(sceltaProfiloParam.getCfUtenteLoggato(), sceltaProfiloParam.getCodiceRuoloUtenteLoggato().toString())).thenReturn(true);
		when(this.servizioSQLService.getAllServiziByReferenteODelegatoGestoreProgettoAndFiltro(
				"%" + filtroListaServizi.getCriterioRicerca() + "%",
				Arrays.asList( sceltaProfiloParam.getIdProgramma().toString() ),
				Arrays.asList( sceltaProfiloParam.getIdProgetto().toString() ),
				filtroListaServizi.getTipologieServizi(),
				filtroListaServizi.getStatiServizio()
			)).thenReturn(listaServizi);
		List<ServizioEntity> risultato = servizioService.getAllServiziByProfilazioneUtenteLoggatoAndFiltri(sceltaProfiloParam, filtroListaServizi);
		assertThat(risultato.size()).isEqualTo(listaServizi.size());
	}
	
	@Test
	public void getAllServiziByProfilazioneUtenteLoggatoAndFiltriREPPTest() {
		//test con ruoloUtenteLoggato = REPP/DEPP
		sceltaProfiloParam.setCodiceRuoloUtenteLoggato(RuoloUtenteEnum.REPP.toString());
		when(this.utenteService.hasRuoloUtente(sceltaProfiloParam.getCfUtenteLoggato(), sceltaProfiloParam.getCodiceRuoloUtenteLoggato().toString())).thenReturn(true);
		when(this.servizioSQLService.getAllServiziByReferenteODelegatoEntePartnerAndFiltro(
				"%" + filtroListaServizi.getCriterioRicerca() + "%",
				Arrays.asList( sceltaProfiloParam.getIdProgramma().toString() ),
				Arrays.asList( sceltaProfiloParam.getIdProgetto().toString() ),
				filtroListaServizi.getTipologieServizi(),
				filtroListaServizi.getStatiServizio()
			)).thenReturn(listaServizi);
		List<ServizioEntity> risultato = servizioService.getAllServiziByProfilazioneUtenteLoggatoAndFiltri(sceltaProfiloParam, filtroListaServizi);
		assertThat(risultato.size()).isEqualTo(listaServizi.size());
	}
	
	@Test
	public void getAllServiziByProfilazioneUtenteLoggatoAndFiltriFACTest() {
		//test con ruoloUtenteLoggato = FAC/VOL
		sceltaProfiloParam.setCodiceRuoloUtenteLoggato(RuoloUtenteEnum.FAC.toString());
		when(this.utenteService.hasRuoloUtente(sceltaProfiloParam.getCfUtenteLoggato(), sceltaProfiloParam.getCodiceRuoloUtenteLoggato().toString())).thenReturn(true);
		when(this.servizioSQLService.getAllServiziByFacilitatoreOVolontarioAndFiltro(
				"%" + filtroListaServizi.getCriterioRicerca() + "%",
				Arrays.asList( sceltaProfiloParam.getIdProgramma().toString() ),
				Arrays.asList( sceltaProfiloParam.getIdProgetto().toString() ),
				filtroListaServizi.getTipologieServizi(),
				filtroListaServizi.getStatiServizio(),
				sceltaProfiloParam.getCfUtenteLoggato()
			)).thenReturn(listaServizi);
		List<ServizioEntity> risultato = servizioService.getAllServiziByProfilazioneUtenteLoggatoAndFiltri(sceltaProfiloParam, filtroListaServizi);
		assertThat(risultato.size()).isEqualTo(listaServizi.size());
	}
	
	@Test
	public void getAllServiziByProfilazioneUtenteLoggatoAndFiltriKOTest() {
		//test KO per ruolo non definito per l'utente
		when(this.utenteService.hasRuoloUtente(sceltaProfiloParam.getCfUtenteLoggato(), sceltaProfiloParam.getCodiceRuoloUtenteLoggato().toString())).thenReturn(false);
		Assertions.assertThrows(ServizioException.class, () -> servizioService.getAllServiziByProfilazioneUtenteLoggatoAndFiltri(sceltaProfiloParam, filtroListaServizi));
		assertThatExceptionOfType(ServizioException.class);
	}
	
	@Test
	public void creaServizioTest() {
		when(this.servizioSQLService.getServizioByNome(servizioRequest.getNomeServizio())).thenReturn(Optional.empty());
		when(this.utenteService.isUtenteFacilitatore(sceltaProfiloParam.getCfUtenteLoggato(), sceltaProfiloParam.getCodiceRuoloUtenteLoggato().toString())).thenReturn(true);
		when(this.servizioMapper.toCollectionFrom(servizioRequest)).thenReturn(sezioneQ3Collection);
		servizioService.creaServizio(servizioRequest);
	}
	
	@Test
	public void creaServizioKOTest() {
		//test KO per servizio già presente
		when(this.servizioSQLService.getServizioByNome(servizioRequest.getNomeServizio())).thenReturn(Optional.of(servizio));
		Assertions.assertThrows(ServizioException.class, () -> servizioService.creaServizio(servizioRequest));
		assertThatExceptionOfType(ServizioException.class);
		
		//test KO per ruoloUtenteLoggato != FAC
		when(this.servizioSQLService.getServizioByNome(servizioRequest.getNomeServizio())).thenReturn(Optional.empty());
		when(this.utenteService.isUtenteFacilitatore(sceltaProfiloParam.getCfUtenteLoggato(), sceltaProfiloParam.getCodiceRuoloUtenteLoggato().toString())).thenReturn(false);
		Assertions.assertThrows(ServizioException.class, () -> servizioService.creaServizio(servizioRequest));
		assertThatExceptionOfType(ServizioException.class);
	}
	
	@Test
	public void creaSezioneQ3Test() {
		when(this.servizioMapper.toCollectionFrom(servizioRequest)).thenReturn(sezioneQ3Collection);
		servizioService.creaSezioneQ3(servizioRequest);
	}
	
	@Test
	public void aggiornaServizioTest() {
		when(this.utenteService.isUtenteFacilitatore(sceltaProfiloParam.getCfUtenteLoggato(), sceltaProfiloParam.getCodiceRuoloUtenteLoggato().toString())).thenReturn(true);
		when(this.servizioSQLService.aggiornaServizio(servizio.getId(), servizioRequest)).thenReturn(servizio);
		when(this.sezioneQ3Repository.findById(sezioneQ3Collection.getId())).thenReturn(Optional.of(sezioneQ3Collection));
		when(this.servizioMapper.toCollectionFrom(servizioRequest)).thenReturn(sezioneQ3Collection);
		servizioService.aggiornaServizio(servizio.getId(), servizioRequest);
	}
	
	@Test
	public void aggiornaServizioKOTest() {
		//test KO per utente non facilitatore
		when(this.utenteService.isUtenteFacilitatore(sceltaProfiloParam.getCfUtenteLoggato(), sceltaProfiloParam.getCodiceRuoloUtenteLoggato().toString())).thenReturn(false);
		Assertions.assertThrows(ServizioException.class, () -> servizioService.aggiornaServizio(servizio.getId(), servizioRequest));
		assertThatExceptionOfType(ServizioException.class);
		
		//test KO per sezioneQ3Compilato non presente
		when(this.utenteService.isUtenteFacilitatore(sceltaProfiloParam.getCfUtenteLoggato(), sceltaProfiloParam.getCodiceRuoloUtenteLoggato().toString())).thenReturn(true);
		when(this.servizioSQLService.aggiornaServizio(servizio.getId(), servizioRequest)).thenReturn(servizio);
		when(this.sezioneQ3Repository.findById(sezioneQ3Collection.getId())).thenReturn(Optional.empty());
		Assertions.assertThrows(ResourceNotFoundException.class, () -> servizioService.aggiornaServizio(servizio.getId(), servizioRequest));
		assertThatExceptionOfType(ResourceNotFoundException.class);
	}
	
	@Test
	public void getAllTipologiaServizioFiltroDropdownTest() {
		when(this.utenteService.hasRuoloUtente(sceltaProfiloParam.getCfUtenteLoggato(), sceltaProfiloParam.getCodiceRuoloUtenteLoggato().toString())).thenReturn(true);
		when(this.servizioSQLService.getAllServiziByFiltro(
				"%" + filtroListaServizi.getCriterioRicerca() + "%",
				filtroListaServizi.getTipologieServizi(),
				filtroListaServizi.getStatiServizio()
			)).thenReturn(listaServizi);
		List<String> risultato = servizioService.getAllTipologiaServizioFiltroDropdown(sceltaProfiloParam, filtroListaServizi);
		assertThat(risultato.size()).isEqualTo(listaTipologie.size());
	}
	
	@Test
	public void getAllStatiServizioFiltroDropdownTest() {
		when(this.utenteService.hasRuoloUtente(sceltaProfiloParam.getCfUtenteLoggato(), sceltaProfiloParam.getCodiceRuoloUtenteLoggato().toString())).thenReturn(true);
		when(this.servizioSQLService.getAllServiziByFiltro(
				"%" + filtroListaServizi.getCriterioRicerca() + "%",
				filtroListaServizi.getTipologieServizi(),
				filtroListaServizi.getStatiServizio()
			)).thenReturn(listaServizi);
		List<String> risultato = servizioService.getAllStatiServizioFiltroDropdown(sceltaProfiloParam, filtroListaServizi);
		assertThat(risultato.size()).isEqualTo(listaTipologie.size());
	}
	
	@Test
	public void getSchedaDettaglioServizioTest() {
		ProgettoProjectionImplementation progettoProjectionImplementation = new ProgettoProjectionImplementation();
		progettoProjectionImplementation.setId(1L);
		List<ProgettoProjection> listaProgettiIProjections = new ArrayList<>();
		listaProgettiIProjections.add(progettoProjectionImplementation);
		when(this.servizioSQLService.getServizioById(servizio.getId())).thenReturn(servizio);
		when(this.enteService.getById(servizio.getIdEnteSedeProgettoFacilitatore().getIdEnte())).thenReturn(ente);
		when(this.sedeService.getById(servizio.getIdEnteSedeProgettoFacilitatore().getIdSede())).thenReturn(sede);
		when(this.servizioSQLService.getNominativoFacilitatoreByIdFacilitatoreAndIdServizio("DERIOT43R23I938I", servizio.getId())).thenReturn("NOMECOMPLETO");
		when(this.questionarioTemplateSqlService.getQuestionarioTemplateById(servizio.getIdQuestionarioTemplateSnapshot())).thenReturn(questionarioTemplateEntity);
		when(questionarioTemplateService.getQuestionarioTemplateById(servizio.getIdQuestionarioTemplateSnapshot())).thenReturn(questionarioTemplateCollection);
		when(this.sezioneQ3Repository.findById(servizio.getIdTemplateCompilatoQ3())).thenReturn(Optional.of(sezioneQ3Collection));
		when(this.progettoService.getProgettiByServizio(servizio.getId())).thenReturn(listaProgettiIProjections);
		servizioService.getSchedaDettaglioServizio(servizio.getId());
	}
	
	@Test
	public void getSchedaDettaglioServizioKOTest() {
		//test KO per questionarioTemplate associato al servizio non presente su Mysql
		when(this.servizioSQLService.getServizioById(servizio.getId())).thenReturn(servizio);
		when(this.enteService.getById(servizio.getIdEnteSedeProgettoFacilitatore().getIdEnte())).thenReturn(ente);
		when(this.sedeService.getById(servizio.getIdEnteSedeProgettoFacilitatore().getIdSede())).thenReturn(sede);
		when(this.servizioSQLService.getNominativoFacilitatoreByIdFacilitatoreAndIdServizio("DERIOT43R23I938I", servizio.getId())).thenReturn("NOMECOMPLETO");
		when(this.questionarioTemplateSqlService.getQuestionarioTemplateById(servizio.getIdQuestionarioTemplateSnapshot())).thenThrow(ResourceNotFoundException.class);
		Assertions.assertThrows(ServizioException.class, () -> servizioService.getSchedaDettaglioServizio(servizio.getId()));
		assertThatExceptionOfType(ServizioException.class);
	}
	
	@Test
	public void getSchedaDettaglioServizioKOTest2() {
		//test KO per questionarioTemplate associato al servizio non presente su MongoDB
		when(this.servizioSQLService.getServizioById(servizio.getId())).thenReturn(servizio);
		when(this.enteService.getById(servizio.getIdEnteSedeProgettoFacilitatore().getIdEnte())).thenReturn(ente);
		when(this.sedeService.getById(servizio.getIdEnteSedeProgettoFacilitatore().getIdSede())).thenReturn(sede);
		when(this.servizioSQLService.getNominativoFacilitatoreByIdFacilitatoreAndIdServizio("DERIOT43R23I938I", servizio.getId())).thenReturn("NOMECOMPLETO");
		when(this.questionarioTemplateSqlService.getQuestionarioTemplateById(servizio.getIdQuestionarioTemplateSnapshot())).thenReturn(questionarioTemplateEntity);
		when(questionarioTemplateService.getQuestionarioTemplateById(servizio.getIdQuestionarioTemplateSnapshot())).thenThrow(ResourceNotFoundException.class);
		Assertions.assertThrows(ServizioException.class, () -> servizioService.getSchedaDettaglioServizio(servizio.getId()));
		assertThatExceptionOfType(ServizioException.class);
	}
	
	@Test
	public void eliminaServizioTest() {
		servizio.setStato("NON ATTIVO");
		when(this.servizioSQLService.getServizioById(servizio.getId())).thenReturn(servizio);
		doNothing().when(this.servizioSQLService).cancellaServivio(servizio);
		doNothing().when(this.sezioneQ3Repository).deleteByIdSezioneQ3(servizio.getIdTemplateCompilatoQ3());
		servizioService.eliminaServizio(servizio.getId());
	}
	
	@Test
	public void eliminaServizioKOTest() {
		//test KO per servizio non cancellabile
		when(this.servizioSQLService.getServizioById(servizio.getId())).thenReturn(servizio);
		Assertions.assertThrows(ServizioException.class, () -> servizioService.eliminaServizio(servizio.getId()));
		assertThatExceptionOfType(ServizioException.class);
	}
	
	@Setter
	public class ProgettoProjectionImplementation implements ProgettoProjection {
		private Long id;
		private String nomeBreve;
		private String stato;
		
		@Override
		public Long getId() {
			return id;
		}

		@Override
		public String getNomeBreve() {
			return nomeBreve;
		}

		@Override
		public String getStato() {
			return stato;
		}
		
	}
}
