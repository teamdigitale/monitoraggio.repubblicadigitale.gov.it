package it.pa.repdgt.surveymgmt.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatExceptionOfType;
import static org.mockito.Mockito.when;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
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
import org.springframework.mock.web.MockMultipartFile;

import it.pa.repdgt.shared.awsintegration.service.EmailService;
import it.pa.repdgt.shared.entity.CittadinoEntity;
import it.pa.repdgt.shared.entity.QuestionarioCompilatoEntity;
import it.pa.repdgt.shared.entity.QuestionarioInviatoOnlineEntity;
import it.pa.repdgt.shared.entity.ServizioEntity;
import it.pa.repdgt.shared.entity.TipologiaServizioEntity;
import it.pa.repdgt.shared.entity.key.EnteSedeProgettoFacilitatoreKey;
import it.pa.repdgt.shared.entityenum.RuoloUtenteEnum;
import it.pa.repdgt.shared.entityenum.StatoQuestionarioEnum;
import it.pa.repdgt.shared.restapi.param.SceltaProfiloParam;
import it.pa.repdgt.surveymgmt.bean.CittadinoUploadBean;
import it.pa.repdgt.surveymgmt.collection.QuestionarioCompilatoCollection;
import it.pa.repdgt.surveymgmt.collection.SezioneQ3Collection;
import it.pa.repdgt.surveymgmt.exception.CittadinoException;
import it.pa.repdgt.surveymgmt.exception.QuestionarioCompilatoException;
import it.pa.repdgt.surveymgmt.exception.ServizioException;
import it.pa.repdgt.surveymgmt.mongo.repository.QuestionarioCompilatoMongoRepository;
import it.pa.repdgt.surveymgmt.mongo.repository.SezioneQ3Respository;
import it.pa.repdgt.surveymgmt.param.FiltroListaCittadiniServizioParam;
import it.pa.repdgt.surveymgmt.projection.CittadinoServizioProjection;
import it.pa.repdgt.surveymgmt.repository.CittadinoRepository;
import it.pa.repdgt.surveymgmt.repository.CittadinoServizioRepository;
import it.pa.repdgt.surveymgmt.repository.QuestionarioCompilatoRepository;
import it.pa.repdgt.surveymgmt.repository.QuestionarioInviatoOnlineRepository;
import it.pa.repdgt.surveymgmt.repository.ServizioSqlRepository;
import it.pa.repdgt.surveymgmt.repository.ServizioXCittadinoRepository;
import it.pa.repdgt.surveymgmt.request.NuovoCittadinoServizioRequest;
import lombok.Setter;
import software.amazon.awssdk.services.pinpoint.model.SendMessagesResponse;

@ExtendWith(MockitoExtension.class)
public class CittadiniServizioServiceTest {
	
	@Mock
	private UtenteService utenteService;
	@Mock
	private CittadinoService cittadinoService;
	@Mock
	private ServizioSqlService servizioSqlService;
	@Mock
	private CittadinoServizioRepository cittadinoServizioRepository;
	@Mock
	private CittadinoRepository cittadinoRepository;
	@Mock
	private ServizioXCittadinoRepository servizioXCittadinoRepository;
	@Mock
	private SezioneQ3Respository sezioneQ3Respository;
	@Mock
	private QuestionarioCompilatoMongoRepository questionarioCompilatoMongoService;
	@Mock
	private QuestionarioCompilatoRepository questionarioCompilatoSqlRepository;
	@Mock 
	private EmailService emailService;
	@Mock
	private QuestionarioInviatoOnlineRepository questionarioInviatoOnlineRepository;
	@Mock
	private ServizioSqlRepository servizioSqlRepository;
	
	@Autowired
	@InjectMocks
	private CittadiniServizioService cittadiniServizioService;
	
	SceltaProfiloParam profilazione;
	FiltroListaCittadiniServizioParam filtroListaCittadiniServizio;
	ServizioEntity servizio;
	List<String> listaStatiQuestionari;
	NuovoCittadinoServizioRequest nuovoCittadinoRequest;
	CittadinoEntity cittadino;
	SezioneQ3Collection sezioneQ3;
	QuestionarioCompilatoCollection questionarioCompilatoCollection;
	CittadinoUploadBean cittadinoUpload;
	QuestionarioCompilatoEntity questionarioCompilato;
	SendMessagesResponse message;
	String[] arrayString;
	QuestionarioInviatoOnlineEntity invioQuestionario;
	List<QuestionarioCompilatoEntity> listaQuestionariCompilati;
	List<TipologiaServizioEntity> listaTipologiaServizi;
	TipologiaServizioEntity tipologiaServizioEntity;
	MockMultipartFile file;
	byte[] data;
	InputStream stream;
	
	@BeforeEach
	public void setUp() throws IOException {
		profilazione = new SceltaProfiloParam();
		profilazione.setCfUtenteLoggato("CFUTENTE");
		profilazione.setCodiceRuoloUtenteLoggato(RuoloUtenteEnum.DTD.getValue());
		profilazione.setIdProgetto(1L);
		profilazione.setIdProgramma(1L);
		listaStatiQuestionari = new ArrayList<>();
		listaStatiQuestionari.add("ATTIVO");
		filtroListaCittadiniServizio = new FiltroListaCittadiniServizioParam();
		filtroListaCittadiniServizio.setCriterioRicerca("CRITERIORICERCA");
		filtroListaCittadiniServizio.setStatiQuestionario(listaStatiQuestionari);
		servizio = new ServizioEntity();
		servizio.setId(1L);
		servizio.setStato("NON ATTIVO");
		nuovoCittadinoRequest = new NuovoCittadinoServizioRequest();
		nuovoCittadinoRequest.setCodiceFiscale("CFUTENTE");
		nuovoCittadinoRequest.setNumeroDocumento("A89E32");
		nuovoCittadinoRequest.setCodiceFiscaleNonDisponibile(false);
		nuovoCittadinoRequest.setNuovoCittadino(true);
		cittadino = new CittadinoEntity();
		cittadino.setId(1L);
		cittadino.setEmail("prova@gmail.com");
		sezioneQ3 = new SezioneQ3Collection();
		sezioneQ3.setId("1");
		sezioneQ3.setMongoId("1");
		tipologiaServizioEntity = new TipologiaServizioEntity();
		tipologiaServizioEntity.setId(1L);
		tipologiaServizioEntity.setTitolo("TITOLO");
		listaTipologiaServizi = new ArrayList<>();
		listaTipologiaServizi.add(tipologiaServizioEntity);
		servizio.setIdTemplateCompilatoQ3(sezioneQ3.getId());
		servizio.setIdEnteSedeProgettoFacilitatore(new EnteSedeProgettoFacilitatoreKey(1L, 1L, 1L, "CFUTENTE"));
		servizio.setIdQuestionarioTemplateSnapshot("1");
		servizio.setListaTipologiaServizi(listaTipologiaServizi);
		questionarioCompilatoCollection = new QuestionarioCompilatoCollection();
		questionarioCompilatoCollection.setIdQuestionarioCompilato("1");
		cittadinoUpload = new CittadinoUploadBean("CFUTENTE", "NOME", "COGNOME", "NUM_DOC", "34R2F4", "", "1990", "DIPLOMA", "", "", "", "", "", "", "", "");
		questionarioCompilato = new QuestionarioCompilatoEntity();
		questionarioCompilato.setId("idQuestionario");
		questionarioCompilato.setCittadino(cittadino);
		questionarioCompilato.setStato("NON_INVIATO");
		arrayString = new String[] {cittadino.getEmail(), "TOKEN"};
		invioQuestionario = new QuestionarioInviatoOnlineEntity();
		invioQuestionario.setId(1L);
		listaQuestionariCompilati = new ArrayList<>();
		listaQuestionariCompilati.add(questionarioCompilato);
		data = new byte[] {1, 2, 3, 4};
		stream = new ByteArrayInputStream(data);
		file = new MockMultipartFile("test", stream);
	}
	
	@Test
	public void getAllCittadiniServizioByProfilazioneAndFiltroPaginatiTest() {
		Integer currPage = 0, pageSize = 10;
		when(this.utenteService.hasRuoloUtente(profilazione.getCfUtenteLoggato(), profilazione.getCodiceRuoloUtenteLoggato().toString())).thenReturn(true);
		when(this.servizioSqlRepository.findByFacilitatoreAndIdServizio(profilazione.getCfUtenteLoggato(), servizio.getId())).thenReturn(Optional.of(servizio));
		cittadiniServizioService.getAllCittadiniServizioByProfilazioneAndFiltroPaginati(servizio.getId(), profilazione, filtroListaCittadiniServizio, currPage, pageSize);
	}
	
	@Test
	public void getAllCittadiniServizioByProfilazioneAndFiltroPaginatiKOTest() {
		//test KO per Ruolo non definito per l'utente
		final Integer currPage = 0, pageSize = 10;
		when(this.utenteService.hasRuoloUtente(profilazione.getCfUtenteLoggato(), profilazione.getCodiceRuoloUtenteLoggato().toString())).thenReturn(false);
		Assertions.assertThrows(ServizioException.class, () -> cittadiniServizioService.getAllCittadiniServizioByProfilazioneAndFiltroPaginati(servizio.getId(), profilazione, filtroListaCittadiniServizio, currPage, pageSize));
		assertThatExceptionOfType(ServizioException.class);
		
		//test KO per Servizio non accessibile per l'utente
		when(this.utenteService.hasRuoloUtente(profilazione.getCfUtenteLoggato(), profilazione.getCodiceRuoloUtenteLoggato().toString())).thenReturn(true);
		when(this.servizioSqlRepository.findByFacilitatoreAndIdServizio(profilazione.getCfUtenteLoggato(), servizio.getId())).thenReturn(Optional.empty());
		Assertions.assertThrows(ServizioException.class, () -> cittadiniServizioService.getAllCittadiniServizioByProfilazioneAndFiltroPaginati(servizio.getId(), profilazione, filtroListaCittadiniServizio, currPage, pageSize));
		assertThatExceptionOfType(ServizioException.class);
		
//		//test KO per pagina richiesta inesistente
//		final Integer currPage2 = 3, pageSize2 = 1;
//		when(this.utenteService.hasRuoloUtente(profilazione.getCodiceFiscaleUtenteLoggato(), profilazione.getCodiceRuoloUtenteLoggato().toString())).thenReturn(true);
//		when(this.servizioSqlRepository.findByFacilitatoreAndIdServizio(profilazione.getCodiceFiscaleUtenteLoggato(), servizio.getId())).thenReturn(Optional.of(servizio));
//		Assertions.assertThrows(ServizioException.class, () -> cittadiniServizioService.getAllCittadiniServizioByProfilazioneAndFiltroPaginati(servizio.getId(), profilazione, filtroListaCittadiniServizio, currPage2, pageSize2));
//		assertThatExceptionOfType(ServizioException.class);
	}
	
	@Test
	public void getAllStatiQuestionarioCittadinoServizioDropdownTest() {
		//test con filtroListaCittadiniServizio.getStatiQuestionario() != empty
		cittadiniServizioService.getAllStatiQuestionarioCittadinoServizioDropdown(servizio.getId(), filtroListaCittadiniServizio);
		
		//test con filtroListaCittadiniServizio.getStatiQuestionario() = empty
		filtroListaCittadiniServizio.setStatiQuestionario(new ArrayList<>());
		cittadiniServizioService.getAllStatiQuestionarioCittadinoServizioDropdown(servizio.getId(), filtroListaCittadiniServizio);
	}
	
	@Test
	public void getAllCittadiniByCodFiscOrNumDocTest() {
		//test passandogli il CF
		cittadiniServizioService.getAllCittadiniByCodFiscOrNumDoc("CF", "CRITERIORICERCA");
		
		//test passandogli il NUM_DOC
		cittadiniServizioService.getAllCittadiniByCodFiscOrNumDoc("NUM_DOC", "CRITERIORICERCA");
	}
	
	@Test
	public void creaNuovoCittadinoTest() {
		when(this.cittadinoService.getCittadinoByCodiceFiscaleOrNumeroDocumento(
				nuovoCittadinoRequest.getCodiceFiscaleNonDisponibile(),
				nuovoCittadinoRequest.getCodiceFiscale(),
				nuovoCittadinoRequest.getNumeroDocumento()
			)).thenReturn(Optional.empty());
		when(cittadinoRepository.save(Mockito.any(CittadinoEntity.class))).thenReturn(cittadino);
		when(servizioSqlService.getServizioById(servizio.getId())).thenReturn(servizio);
		when(sezioneQ3Respository.findById(servizio.getIdTemplateCompilatoQ3())).thenReturn(Optional.of(sezioneQ3));
		cittadiniServizioService.creaNuovoCittadino(servizio.getId(), nuovoCittadinoRequest);
	}
		
	@Test
	public void creaNuovoCittadinoKOTest() {
		//test KO per cittadino già esistente
		when(this.cittadinoService.getCittadinoByCodiceFiscaleOrNumeroDocumento(
				nuovoCittadinoRequest.getCodiceFiscaleNonDisponibile(),
				nuovoCittadinoRequest.getCodiceFiscale(),
				nuovoCittadinoRequest.getNumeroDocumento()
			)).thenReturn(Optional.of(cittadino));
		Assertions.assertThrows(CittadinoException.class, () -> cittadiniServizioService.creaNuovoCittadino(servizio.getId(), nuovoCittadinoRequest));
		assertThatExceptionOfType(CittadinoException.class);
	}
	
	@Test
	public void creaNuovoCittadinoKOTest2() {
		//test KO per cittadino già esistente sul servizio
		nuovoCittadinoRequest.setNuovoCittadino(false);
		when(this.cittadinoService.getCittadinoByCodiceFiscaleOrNumeroDocumento(
				nuovoCittadinoRequest.getCodiceFiscaleNonDisponibile(),
				nuovoCittadinoRequest.getCodiceFiscale(),
				nuovoCittadinoRequest.getNumeroDocumento()
			)).thenReturn(Optional.of(cittadino));
		when(this.servizioXCittadinoRepository.findCittadinoByIdServizioAndIdCittadino(servizio.getId(), cittadino.getId())).thenReturn(1);
		Assertions.assertThrows(CittadinoException.class, () -> cittadiniServizioService.creaNuovoCittadino(servizio.getId(), nuovoCittadinoRequest));
		assertThatExceptionOfType(CittadinoException.class);
	}
	
	@Test
	public void esisteCittadinoByIdServizioAndIdCittadinoTest() {
		when(this.servizioXCittadinoRepository.findCittadinoByIdServizioAndIdCittadino(servizio.getId(), cittadino.getId())).thenReturn(1);
		cittadiniServizioService.esisteCittadinoByIdServizioAndIdCittadino(servizio.getId(), cittadino.getId());
	}
	
	@Test
	public void associaCittadinoAServizioTest() {
		cittadiniServizioService.associaCittadinoAServizio(servizio.getId(), cittadino);
	}
	
//	@Test
//	public void creaQuestionarioNonInviatoTest() {
//		when(sezioneQ3Respository.findById(servizio.getIdTemplateCompilatoQ3())).thenReturn(Optional.of(sezioneQ3));
//		cittadiniServizioService.creaQuestionarioNonInviato(servizio, cittadino);
//	}
	
	@Test
	public void creoQuestionarioCompilatoCollectionTest() {
		when(sezioneQ3Respository.findById(servizio.getIdTemplateCompilatoQ3())).thenReturn(Optional.of(sezioneQ3));
		cittadiniServizioService.creoQuestionarioCompilatoCollection(cittadino, servizio);
	}

	@Test
	public void creoQuestionarioCompilatoCollectionKOTest() {
		//test KO per templateQ3 non associato al servizio
		when(sezioneQ3Respository.findById(servizio.getIdTemplateCompilatoQ3())).thenReturn(Optional.empty());
		Assertions.assertThrows(QuestionarioCompilatoException.class, () -> cittadiniServizioService.creoQuestionarioCompilatoCollection(cittadino, servizio));
		assertThatExceptionOfType(QuestionarioCompilatoException.class);
	}
	
	@Test
	public void creaSezioneQuestionarioQ1ByCittadinoTest() {
		cittadiniServizioService.creaSezioneQuestionarioQ1ByCittadino(cittadino);
	}
	
	@Test
	public void creaSezioneQuestionarioQ2ByCittadinoTest() {
		//test con servizio esistente
		when(servizioSqlService.getPrimoServizioByIdCittadino(servizio.getId(), cittadino.getId())).thenReturn(Optional.of(servizio));
		cittadiniServizioService.creaSezioneQuestionarioQ2ByCittadino(cittadino.getId(), servizio.getId());
	}
	
//	@Test
//	public void creaSezioneQuestionarioQ2ByCittadinoTest2() {
//		//test con servizio inesistente
//		when(servizioSqlService.getPrimoServizioByIdCittadino(servizio.getId(), cittadino.getId())).thenReturn(Optional.empty());
//		cittadiniServizioService.creaSezioneQuestionarioQ2ByCittadino(cittadino.getId(), servizio.getId());
//	}
	
	@Test
	public void salvaQuestionarioCompilatoSqlTest() {
		cittadiniServizioService.salvaQuestionarioCompilatoSql(cittadino, servizio, questionarioCompilatoCollection);
	}
	
//	@Test
//	public void inserisciCittadinoTest() {
//		when(cittadinoRepository.save(cittadino)).thenReturn(cittadino);
//		when(servizioSqlService.getServizioById(servizio.getId())).thenReturn(servizio);
//		when(sezioneQ3Respository.findById(servizio.getIdTemplateCompilatoQ3())).thenReturn(Optional.of(sezioneQ3));
//		cittadiniServizioService.inserisciCittadino(cittadino, servizio.getId());
//	}
	
	@Test
	public void popolaCittadinoTest() {
		cittadiniServizioService.popolaCittadino(cittadino, cittadinoUpload);
	}
	
	@Test
	public void esisteCodFiscaleODocumentoTest() {
		//test con codice fiscale
		cittadiniServizioService.esisteCodFiscaleODocumento(cittadinoUpload);
		
		//test con numero documento
		cittadinoUpload.setCodiceFiscale(null);
		cittadiniServizioService.esisteCodFiscaleODocumento(cittadinoUpload);
	}
	
	@Test
	public void inviaQuestionarioTest() {
		when(questionarioCompilatoSqlRepository.findById(questionarioCompilato.getId())).thenReturn(Optional.of(questionarioCompilato));
		cittadiniServizioService.inviaQuestionario(questionarioCompilato.getId(), cittadino.getId());
		questionarioCompilato.setStato("COMPILATO");
		Assertions.assertThrows(ServizioException.class, () -> cittadiniServizioService.inviaQuestionario(questionarioCompilato.getId(), 2L));
	}
	
	@Test
	public void inviaQuestionarioKOTest() {
		//test KO per coppia cittadino - id questionario inesistente
		when(questionarioCompilatoSqlRepository.findById(questionarioCompilato.getId())).thenReturn(Optional.of(questionarioCompilato));
		Assertions.assertThrows(ServizioException.class, () -> cittadiniServizioService.inviaQuestionario(questionarioCompilato.getId(), 2L));
		assertThatExceptionOfType(ServizioException.class);
	}
	
	@Test
	public void inviaLinkAnonimoAndAggiornaStatoQuestionarioCompilatoTest() {
		cittadiniServizioService.inviaLinkAnonimoAndAggiornaStatoQuestionarioCompilato(questionarioCompilato.getId(), questionarioCompilato, cittadino);
	}
	
	@Test
	public void inviaLinkAnonimoTest() {
		cittadiniServizioService.inviaLinkAnonimo(cittadino, questionarioCompilato.getId());
	}
	
	@Test
	public void generaTokenTest() {
		when(questionarioInviatoOnlineRepository.findByIdQuestionarioCompilatoAndCodiceFiscale(questionarioCompilato.getId(), cittadino.getCodiceFiscale())).thenReturn(Optional.of(invioQuestionario));
		cittadiniServizioService.generaToken(cittadino, questionarioCompilato.getId());
	}
	
	@Test
	public void inviaQuestionarioATuttiCittadiniNonAncoraInviatoByServizioTest() {
		when(this.questionarioCompilatoSqlRepository.findByIdServizioAndStato(servizio.getId(), StatoQuestionarioEnum.NON_INVIATO.toString())).thenReturn(listaQuestionariCompilati);
		cittadiniServizioService.inviaQuestionarioATuttiCittadiniNonAncoraInviatoByServizio(servizio.getId());
	}
	
//	@Test
//	public void caricaCittadiniSuServizioTest() {
//		when(this.servizioSqlService.getServizioById(servizio.getId())).thenReturn(servizio);
//		cittadiniServizioService.caricaCittadiniSuServizio(file, servizio.getId());
//	}

	@Test
	public void countCittadiniServizioByFiltroTest() {
		CittadinoServizioProjectionImplementation cittadinoServizioProjectionImplementation = new CittadinoServizioProjectionImplementation();
		List<CittadinoServizioProjection> listaCittadiniProjection = new ArrayList<>();
		listaCittadiniProjection.add(cittadinoServizioProjectionImplementation);
		when(cittadinoServizioRepository.findAllCittadiniServizioByFiltro(
				servizio.getId(),
				filtroListaCittadiniServizio.getCriterioRicerca(),
				"%" + filtroListaCittadiniServizio.getCriterioRicerca() + "%",
				filtroListaCittadiniServizio.getStatiQuestionario()
			)).thenReturn(listaCittadiniProjection);
		Integer risultato = cittadiniServizioService.countCittadiniServizioByFiltro(servizio.getId(), filtroListaCittadiniServizio);
		assertThat(risultato).isEqualTo(listaCittadiniProjection.size());
	}

	@Setter
	public class CittadinoServizioProjectionImplementation implements CittadinoServizioProjection {
		private Long idCittadino;
		private String nome;
		private String cognome;
		private String codiceFiscale;
		private String numeroDocumento;
		private String idQuestionario;
		private String statoQuestionario;

		@Override
		public Long getIdCittadino() {
			return idCittadino;
		}

		@Override
		public String getNome() {
			return nome;
		}

		@Override
		public String getCognome() {
			return cognome;
		}

		@Override
		public String getCodiceFiscale() {
			return codiceFiscale;
		}

		@Override
		public String getNumeroDocumento() {
			return numeroDocumento;
		}

		@Override
		public String getIdQuestionario() {
			return idQuestionario;
		}

		@Override
		public String getStatoQuestionario() {
			return statoQuestionario;
		}

	}
}
