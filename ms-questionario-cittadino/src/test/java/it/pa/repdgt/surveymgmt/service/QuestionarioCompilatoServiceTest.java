package it.pa.repdgt.surveymgmt.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatExceptionOfType;
import static org.mockito.Mockito.when;

import java.text.ParseException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.bson.json.JsonObject;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;

import it.pa.repdgt.shared.awsintegration.service.EmailService;
import it.pa.repdgt.shared.entity.CittadinoEntity;
import it.pa.repdgt.shared.entity.QuestionarioCompilatoEntity;
import it.pa.repdgt.shared.entity.QuestionarioInviatoOnlineEntity;
import it.pa.repdgt.shared.entityenum.ConsensoTrattamentoDatiEnum;
import it.pa.repdgt.surveymgmt.collection.QuestionarioCompilatoCollection;
import it.pa.repdgt.surveymgmt.collection.QuestionarioCompilatoCollection.DatiIstanza;
import it.pa.repdgt.surveymgmt.exception.QuestionarioCompilatoException;
import it.pa.repdgt.surveymgmt.exception.ResourceNotFoundException;
import it.pa.repdgt.surveymgmt.mongo.repository.QuestionarioCompilatoMongoRepository;
import it.pa.repdgt.surveymgmt.repository.QuestionarioCompilatoSqlRepository;
import it.pa.repdgt.surveymgmt.repository.QuestionarioInviatoOnlineRepository;
import it.pa.repdgt.surveymgmt.request.ConsensoTrattamentoDatiRequest;
import it.pa.repdgt.surveymgmt.request.QuestionarioCompilatoAnonimoRequest;
import it.pa.repdgt.surveymgmt.request.QuestionarioCompilatoRequest;

@ExtendWith(MockitoExtension.class)
public class QuestionarioCompilatoServiceTest {

	@Mock
	private CittadinoService cittadinoService;
	@Mock
	private QuestionarioCompilatoSqlRepository questionarioCompilatoSQLRepository;
	@Mock
	private QuestionarioCompilatoMongoRepository questionarioCompilatoMongoRepository;
	@Mock
	private QuestionarioInviatoOnlineRepository questionarioInviatoOnlineRepository;
	@Mock
	private EmailService emailService;
	
	@Autowired
	@InjectMocks
	private QuestionarioCompilatoService questionarioCompilatoService;
	
	QuestionarioCompilatoCollection questionarioCompilatoCollection;
	QuestionarioCompilatoEntity questionarioCompilatoEntity;
	QuestionarioCompilatoRequest questionarioCompilatoRequest;
	ConsensoTrattamentoDatiRequest consensoTrattamentoDatiRequest;
	CittadinoEntity cittadinoEntity;
	QuestionarioCompilatoAnonimoRequest questionarioCompilatoAnonimoRequest;
	QuestionarioInviatoOnlineEntity questionarioInviatoOnlineEntity;
	DatiIstanza datiIstanza;
	List<DatiIstanza> listaDatiIstanza;
	
	@BeforeEach
	public void setUp() {
		cittadinoEntity = new CittadinoEntity();
		cittadinoEntity.setCodiceFiscale("CODICEFISCALECITTADINO");
		cittadinoEntity.setId(1L);
		cittadinoEntity.setNumeroDocumento("AE87D77D");
		cittadinoEntity.setTipoConferimentoConsenso("TIPOCONFERIMENTO");
		datiIstanza = new DatiIstanza();
		datiIstanza.setDomandaRisposta(new JsonObject("{ \"Q1\" : \"domanda\" }"));
		listaDatiIstanza = new ArrayList<>();
		listaDatiIstanza.add(datiIstanza);
		questionarioCompilatoCollection = new QuestionarioCompilatoCollection();
		questionarioCompilatoCollection.setIdQuestionarioCompilato("IDQUESTIONARIO");
		questionarioCompilatoCollection.setMongoId("IDQUESTIONARIO");
		questionarioCompilatoCollection.setSezioniQuestionarioTemplateIstanze(listaDatiIstanza);
		questionarioCompilatoEntity = new QuestionarioCompilatoEntity();
		questionarioCompilatoEntity.setId("ID");
		questionarioCompilatoEntity.setIdEnte(1L);
		questionarioCompilatoEntity.setIdFacilitatore("IDFACILITATORE");
		questionarioCompilatoEntity.setIdProgetto(1L);
		questionarioCompilatoEntity.setIdProgetto(1L);
		questionarioCompilatoEntity.setIdQuestionarioTemplate("IDQUESTIONARIO");
		questionarioCompilatoEntity.setIdSede(1L);
		questionarioCompilatoEntity.setIdServizio(1L);
		questionarioCompilatoEntity.setCittadino(cittadinoEntity);
		consensoTrattamentoDatiRequest = new ConsensoTrattamentoDatiRequest();
		consensoTrattamentoDatiRequest.setCodiceFiscaleCittadino("CODICEFISCALECITTADINO");
		consensoTrattamentoDatiRequest.setNumeroDocumentoCittadino("AE87D77D");
		consensoTrattamentoDatiRequest.setConsensoTrattamentoDatiEnum(ConsensoTrattamentoDatiEnum.CARTACEO);
		questionarioCompilatoRequest = new QuestionarioCompilatoRequest();
		questionarioCompilatoRequest.setAnnoDiNascitaDaAggiornare("1990");
		questionarioCompilatoRequest.setCategoriaFragiliDaAggiornare("FRAGILI");
		questionarioCompilatoRequest.setCittadinanzaDaAggiornare("ITALIANA");
		questionarioCompilatoRequest.setCodiceFiscaleDaAggiornare("FERDSO67D09A232E");
		questionarioCompilatoRequest.setCognomeDaAggiornare("COGNOME");
		questionarioCompilatoRequest.setComuneDiDomicilioDaAggiornare("ROMA");
		questionarioCompilatoRequest.setConsensoTrattamentoDatiRequest(consensoTrattamentoDatiRequest);
		questionarioCompilatoRequest.setEmailDaAggiornare("PROVA@PROVA.IT");
		questionarioCompilatoRequest.setGenereDaAggiornare("FEMMINA");
		questionarioCompilatoRequest.setNomeDaAggiornare("NOME");
		questionarioCompilatoRequest.setNumeroDiCellulareDaAggiornare("33417632808");
		questionarioCompilatoRequest.setNumeroDocumentoDaAggiornare("AG52E87T");
		questionarioCompilatoRequest.setOccupazioneDaAggiornare("DIPENDENTE");
		questionarioCompilatoRequest.setPrefissoTelefonoDaAggiornare("+39");
		questionarioCompilatoRequest.setSezioneQ1Questionario("{ \"sezioneQuestionarioCompilatoQ1\": \"{ \\\"id\\\": \\\"Q1\\\", \\\"title\\\": \\\"Sezione Q1\\\", \\\"properties\\\": [ \\\"{'24': ['risposta a', 'risposta b']}\\\", \\\"{'25': ['risposta a']}\\\",  \\\"{'3.3': ['risposta d']}\\\", \\\"{'3.4': ['riposta risposta', 'risposta c']}\\\"] }\",\r\n"
				+ "\r\n"
				+ "  \"tipoDiServizioPrenotato\": \"Servizio AAA\"\r\n"
				+ "\r\n"
				+ "}");
		questionarioCompilatoRequest.setSezioneQ2Questionario("{ \"sezioneQuestionarioCompilatoQ2\": \"{ \\\"id\\\": \\\"Q2\\\", \\\"title\\\": \\\"Sezione Q2\\\", \\\"properties\\\": [ \\\"{'24': ['risposta a', 'risposta b']}\\\", \\\"{'25': ['risposta a']}\\\",  \\\"{'3.3': ['risposta d']}\\\", \\\"{'3.4': ['riposta risposta', 'risposta c']}\\\"] }\",\r\n"
				+ "\r\n"
				+ "  \"tipoDiServizioPrenotato\": \"Servizio AAA\"\r\n"
				+ "\r\n"
				+ "}");
		questionarioCompilatoRequest.setSezioneQ3Questionario("{ \"sezioneQuestionarioCompilatoQ3\": \"{ \\\"id\\\": \\\"Q3\\\", \\\"title\\\": \\\"Sezione Q3\\\", \\\"properties\\\": [ \\\"{'24': ['risposta a', 'risposta b']}\\\", \\\"{'25': ['risposta a']}\\\",  \\\"{'3.3': ['risposta d']}\\\", \\\"{'3.4': ['riposta risposta', 'risposta c']}\\\"] }\",\r\n"
				+ "\r\n"
				+ "  \"tipoDiServizioPrenotato\": \"Servizio AAA\"\r\n"
				+ "\r\n"
				+ "}");
		questionarioCompilatoRequest.setSezioneQ4Questionario("{ \"sezioneQuestionarioCompilatoQ4\": \"{ \\\"id\\\": \\\"Q4\\\", \\\"title\\\": \\\"Sezione Q4\\\", \\\"properties\\\": [ \\\"{'24': ['risposta a', 'risposta b']}\\\", \\\"{'25': ['risposta a']}\\\",  \\\"{'3.3': ['risposta d']}\\\", \\\"{'3.4': ['riposta risposta', 'risposta c']}\\\"] }\",\r\n"
				+ "\r\n"
				+ "  \"tipoDiServizioPrenotato\": \"Servizio AAA\"\r\n"
				+ "\r\n"
				+ "}");
		questionarioCompilatoRequest.setTelefonoDaAggiornare("0746907845");
		questionarioCompilatoRequest.setTipoDocumentoDaAggiornare("CARTAIDENTITA");
		questionarioCompilatoRequest.setTitoloDiStudioDaAggiornare("LAUREA");
		questionarioCompilatoAnonimoRequest = new QuestionarioCompilatoAnonimoRequest();
		questionarioCompilatoAnonimoRequest.setSezioneQ4Questionario("{ \"sezioneQuestionarioCompilatoQ4\": \"{ \\\"id\\\": \\\"Q4\\\", \\\"title\\\": \\\"Sezione Q4\\\", \\\"properties\\\": [ \\\"{'24': ['risposta a', 'risposta b']}\\\", \\\"{'25': ['risposta a']}\\\",  \\\"{'3.3': ['risposta d']}\\\", \\\"{'3.4': ['riposta risposta', 'risposta c']}\\\"] }\",\r\n"
				+ "\r\n"
				+ "  \"tipoDiServizioPrenotato\": \"Servizio AAA\"\r\n"
				+ "\r\n"
				+ "}");
		questionarioInviatoOnlineEntity = new QuestionarioInviatoOnlineEntity();
		questionarioInviatoOnlineEntity.setCodiceFiscale("CODICEFISCALECITTADINO");
		questionarioInviatoOnlineEntity.setDataOraCreazione(new Date());
		questionarioInviatoOnlineEntity.setEmail("PROVA@PROVA.IT");
		questionarioInviatoOnlineEntity.setId(1L);
		questionarioInviatoOnlineEntity.setIdQuestionarioCompilato("IDQUESTIONARIO");
		questionarioInviatoOnlineEntity.setNumDocumento("AE87D77D");
		questionarioInviatoOnlineEntity.setToken("TOKEN");
	}
	
	@Test
	public void getQuestionarioCompilatoByIdTest() {
		when(questionarioCompilatoMongoRepository.findQuestionarioCompilatoById(questionarioCompilatoCollection.getIdQuestionarioCompilato())).thenReturn(Optional.of(questionarioCompilatoCollection));
		QuestionarioCompilatoCollection risultato = questionarioCompilatoService.getQuestionarioCompilatoById(questionarioCompilatoCollection.getIdQuestionarioCompilato());
		assertThat(risultato.getIdQuestionarioCompilato()).isEqualTo(questionarioCompilatoCollection.getIdQuestionarioCompilato());
	}
	
	@Test
	public void getQuestionarioCompilatoByIdKOTest() {
		//test KO per questionarioCollection non trovato
		when(questionarioCompilatoMongoRepository.findQuestionarioCompilatoById(questionarioCompilatoCollection.getIdQuestionarioCompilato())).thenReturn(Optional.empty());
		Assertions.assertThrows(ResourceNotFoundException.class, () -> questionarioCompilatoService.getQuestionarioCompilatoById(questionarioCompilatoCollection.getIdQuestionarioCompilato()));
		assertThatExceptionOfType(ResourceNotFoundException.class);
	}
	
	@Test
	public void compilaQuestionarioTest() {
		when(this.questionarioCompilatoSQLRepository.findById(questionarioCompilatoCollection.getIdQuestionarioCompilato())).thenReturn(Optional.of(questionarioCompilatoEntity));
		when(this.questionarioCompilatoMongoRepository.findQuestionarioCompilatoById(questionarioCompilatoCollection.getIdQuestionarioCompilato())).thenReturn(Optional.of(questionarioCompilatoCollection));
		when(this.cittadinoService.getByCodiceFiscaleOrNumeroDocumento(cittadinoEntity.getCodiceFiscale(), cittadinoEntity.getNumeroDocumento())).thenReturn(Optional.of(cittadinoEntity));
		questionarioCompilatoService.compilaQuestionario(questionarioCompilatoCollection.getIdQuestionarioCompilato(), questionarioCompilatoRequest);
	}
	
	@Test
	public void compilaQuestionarioKOTest() {
		//test KO per questionarioCompilatoEntity non presente
		when(this.questionarioCompilatoSQLRepository.findById(questionarioCompilatoCollection.getIdQuestionarioCompilato())).thenReturn(Optional.empty());
		when(this.questionarioCompilatoMongoRepository.findQuestionarioCompilatoById(questionarioCompilatoCollection.getIdQuestionarioCompilato())).thenReturn(Optional.of(questionarioCompilatoCollection));
		Assertions.assertThrows(QuestionarioCompilatoException.class, () -> questionarioCompilatoService.compilaQuestionario(questionarioCompilatoCollection.getIdQuestionarioCompilato(), questionarioCompilatoRequest));
		assertThatExceptionOfType(QuestionarioCompilatoException.class);
		
		//test KO per questionarioCompilatoCollection non presente
		when(this.questionarioCompilatoSQLRepository.findById(questionarioCompilatoCollection.getIdQuestionarioCompilato())).thenReturn(Optional.of(questionarioCompilatoEntity));
		when(this.questionarioCompilatoMongoRepository.findQuestionarioCompilatoById(questionarioCompilatoCollection.getIdQuestionarioCompilato())).thenReturn(Optional.empty());
		Assertions.assertThrows(QuestionarioCompilatoException.class, () -> questionarioCompilatoService.compilaQuestionario(questionarioCompilatoCollection.getIdQuestionarioCompilato(), questionarioCompilatoRequest));
		assertThatExceptionOfType(QuestionarioCompilatoException.class);
	}
	
	@Test
	public void compilaQuestionarioPerAnonimoTest() {
		when(this.questionarioCompilatoSQLRepository.findById(questionarioCompilatoCollection.getIdQuestionarioCompilato())).thenReturn(Optional.of(questionarioCompilatoEntity));
		when(this.questionarioCompilatoMongoRepository.findQuestionarioCompilatoById(questionarioCompilatoCollection.getIdQuestionarioCompilato())).thenReturn(Optional.of(questionarioCompilatoCollection));
		when(this.questionarioInviatoOnlineRepository.findByIdQuestionarioCompilatoAndToken(questionarioCompilatoCollection.getIdQuestionarioCompilato(), questionarioInviatoOnlineEntity.getToken())).thenReturn(Optional.of(questionarioInviatoOnlineEntity));
		when(this.cittadinoService.getConsensoByCodiceFiscaleCittadinoOrNumeroDocumento(cittadinoEntity.getCodiceFiscale(), cittadinoEntity.getNumeroDocumento())).thenReturn("TRUE");
		questionarioCompilatoService.compilaQuestionarioPerAnonimo(questionarioCompilatoCollection.getIdQuestionarioCompilato(), questionarioCompilatoAnonimoRequest, questionarioInviatoOnlineEntity.getToken());
	}
	
	@Test
	public void compilaQuestionarioPerAnonimoKOTest() {
		//test KO per questionarioCompilato SQL non presente
		when(this.questionarioCompilatoSQLRepository.findById(questionarioCompilatoCollection.getIdQuestionarioCompilato())).thenReturn(Optional.empty());
		when(this.questionarioCompilatoMongoRepository.findQuestionarioCompilatoById(questionarioCompilatoCollection.getIdQuestionarioCompilato())).thenReturn(Optional.of(questionarioCompilatoCollection));
		Assertions.assertThrows(QuestionarioCompilatoException.class, () -> questionarioCompilatoService.compilaQuestionarioPerAnonimo(questionarioCompilatoCollection.getIdQuestionarioCompilato(), questionarioCompilatoAnonimoRequest, questionarioInviatoOnlineEntity.getToken()));
		assertThatExceptionOfType(QuestionarioCompilatoException.class);
		
		//test KO per questionarioCompilato MongoDB non presente
		when(this.questionarioCompilatoSQLRepository.findById(questionarioCompilatoCollection.getIdQuestionarioCompilato())).thenReturn(Optional.of(questionarioCompilatoEntity));
		when(this.questionarioCompilatoMongoRepository.findQuestionarioCompilatoById(questionarioCompilatoCollection.getIdQuestionarioCompilato())).thenReturn(Optional.empty());
		Assertions.assertThrows(QuestionarioCompilatoException.class, () -> questionarioCompilatoService.compilaQuestionarioPerAnonimo(questionarioCompilatoCollection.getIdQuestionarioCompilato(), questionarioCompilatoAnonimoRequest, questionarioInviatoOnlineEntity.getToken()));
		assertThatExceptionOfType(QuestionarioCompilatoException.class);
	}
	
	@Test
	public void creaSezioniQuestionarioFromRequestTest() {
		List<DatiIstanza> risultato = questionarioCompilatoService.creaSezioniQuestionarioFromRequest(questionarioCompilatoRequest);
		assertThat(risultato.size()).isEqualTo(4);
	}
	
	@Test
	public void verificaEseguiESalvaConsensoTrattamentoDatiPerAnonimoTest() {
		//test per consensoCittadino già dato
		when(this.cittadinoService.getConsensoByCodiceFiscaleCittadinoOrNumeroDocumento(cittadinoEntity.getCodiceFiscale(), cittadinoEntity.getNumeroDocumento())).thenReturn("TRUE");
		questionarioCompilatoService.verificaEseguiESalvaConsensoTrattamentoDatiPerAnonimo(cittadinoEntity.getCodiceFiscale(), cittadinoEntity.getNumeroDocumento(), ConsensoTrattamentoDatiEnum.CARTACEO, datiIstanza);
	}
	
	@Test
	public void verificaEseguiESalvaConsensoTrattamentoDatiPerAnonimoTest2() {
		//test per consensoCittadino non dato e ConsensoTrattamentoDatiEnum == CARTACEO
		when(this.cittadinoService.getConsensoByCodiceFiscaleCittadinoOrNumeroDocumento(cittadinoEntity.getCodiceFiscale(), cittadinoEntity.getNumeroDocumento())).thenReturn(null);
		when(this.cittadinoService.getByCodiceFiscaleOrNumeroDocumento(cittadinoEntity.getCodiceFiscale(), cittadinoEntity.getNumeroDocumento())).thenReturn(Optional.of(cittadinoEntity));
		questionarioCompilatoService.verificaEseguiESalvaConsensoTrattamentoDatiPerAnonimo(cittadinoEntity.getCodiceFiscale(), cittadinoEntity.getNumeroDocumento(), ConsensoTrattamentoDatiEnum.CARTACEO, datiIstanza);
		
		//test per consensoCittadino non dato e ConsensoTrattamentoDatiEnum == ONLINE
		when(this.cittadinoService.getConsensoByCodiceFiscaleCittadinoOrNumeroDocumento(cittadinoEntity.getCodiceFiscale(), cittadinoEntity.getNumeroDocumento())).thenReturn(null);
		when(this.cittadinoService.getByCodiceFiscaleOrNumeroDocumento(cittadinoEntity.getCodiceFiscale(), cittadinoEntity.getNumeroDocumento())).thenReturn(Optional.of(cittadinoEntity));
		questionarioCompilatoService.verificaEseguiESalvaConsensoTrattamentoDatiPerAnonimo(cittadinoEntity.getCodiceFiscale(), cittadinoEntity.getNumeroDocumento(), ConsensoTrattamentoDatiEnum.ONLINE, datiIstanza);
		
		//test per consensoCittadino non dato e ConsensoTrattamentoDatiEnum == EMAIL
		when(this.cittadinoService.getConsensoByCodiceFiscaleCittadinoOrNumeroDocumento(cittadinoEntity.getCodiceFiscale(), cittadinoEntity.getNumeroDocumento())).thenReturn(null);
		when(this.cittadinoService.getByCodiceFiscaleOrNumeroDocumento(cittadinoEntity.getCodiceFiscale(), cittadinoEntity.getNumeroDocumento())).thenReturn(Optional.of(cittadinoEntity));
		questionarioCompilatoService.verificaEseguiESalvaConsensoTrattamentoDatiPerAnonimo(cittadinoEntity.getCodiceFiscale(), cittadinoEntity.getNumeroDocumento(), ConsensoTrattamentoDatiEnum.EMAIL, datiIstanza);
	}
	
	@Test
	public void verificaEseguiESalvaConsensoTrattamentoDatiTest() {
		//test per consensoCittadino già dato
		when(this.cittadinoService.getConsensoByCodiceFiscaleCittadinoOrNumeroDocumento(cittadinoEntity.getCodiceFiscale(), cittadinoEntity.getNumeroDocumento())).thenReturn("TRUE");
		questionarioCompilatoService.verificaEseguiESalvaConsensoTrattamentoDati(cittadinoEntity.getCodiceFiscale(), cittadinoEntity.getNumeroDocumento(), ConsensoTrattamentoDatiEnum.CARTACEO);
	}
	
	@Test
	public void verificaEseguiESalvaConsensoTrattamentoDatiTest2() {
		//test per consensoCittadino non dato e ConsensoTrattamentoDatiEnum == CARTACEO
		when(this.cittadinoService.getConsensoByCodiceFiscaleCittadinoOrNumeroDocumento(cittadinoEntity.getCodiceFiscale(), cittadinoEntity.getNumeroDocumento())).thenReturn(null);
		when(this.cittadinoService.getByCodiceFiscaleOrNumeroDocumento(cittadinoEntity.getCodiceFiscale(), cittadinoEntity.getNumeroDocumento())).thenReturn(Optional.of(cittadinoEntity));
		questionarioCompilatoService.verificaEseguiESalvaConsensoTrattamentoDati(cittadinoEntity.getCodiceFiscale(), cittadinoEntity.getNumeroDocumento(), ConsensoTrattamentoDatiEnum.CARTACEO);
		
		//test per consensoCittadino non dato e ConsensoTrattamentoDatiEnum == ONLINE
		when(this.cittadinoService.getConsensoByCodiceFiscaleCittadinoOrNumeroDocumento(cittadinoEntity.getCodiceFiscale(), cittadinoEntity.getNumeroDocumento())).thenReturn(null);
		when(this.cittadinoService.getByCodiceFiscaleOrNumeroDocumento(cittadinoEntity.getCodiceFiscale(), cittadinoEntity.getNumeroDocumento())).thenReturn(Optional.of(cittadinoEntity));
		questionarioCompilatoService.verificaEseguiESalvaConsensoTrattamentoDati(cittadinoEntity.getCodiceFiscale(), cittadinoEntity.getNumeroDocumento(), ConsensoTrattamentoDatiEnum.ONLINE);
		
		//test per consensoCittadino non dato e ConsensoTrattamentoDatiEnum == EMAIL
		when(this.cittadinoService.getConsensoByCodiceFiscaleCittadinoOrNumeroDocumento(cittadinoEntity.getCodiceFiscale(), cittadinoEntity.getNumeroDocumento())).thenReturn(null);
		when(this.cittadinoService.getByCodiceFiscaleOrNumeroDocumento(cittadinoEntity.getCodiceFiscale(), cittadinoEntity.getNumeroDocumento())).thenReturn(Optional.of(cittadinoEntity));
		questionarioCompilatoService.verificaEseguiESalvaConsensoTrattamentoDati(cittadinoEntity.getCodiceFiscale(), cittadinoEntity.getNumeroDocumento(), ConsensoTrattamentoDatiEnum.EMAIL);
	}
	
	@Test
	public void compilaQuestionarioAnonimoTest() throws ParseException {
		when(questionarioInviatoOnlineRepository.findByIdQuestionarioCompilatoAndToken(questionarioInviatoOnlineEntity.getIdQuestionarioCompilato(), questionarioInviatoOnlineEntity.getToken())).thenReturn(Optional.of(questionarioInviatoOnlineEntity));
		when(this.questionarioCompilatoSQLRepository.findById(questionarioCompilatoCollection.getIdQuestionarioCompilato())).thenReturn(Optional.of(questionarioCompilatoEntity));
		when(this.questionarioCompilatoMongoRepository.findQuestionarioCompilatoById(questionarioCompilatoCollection.getIdQuestionarioCompilato())).thenReturn(Optional.of(questionarioCompilatoCollection));
		when(this.questionarioInviatoOnlineRepository.findByIdQuestionarioCompilatoAndToken(questionarioCompilatoCollection.getIdQuestionarioCompilato(), questionarioInviatoOnlineEntity.getToken())).thenReturn(Optional.of(questionarioInviatoOnlineEntity));
		when(this.cittadinoService.getConsensoByCodiceFiscaleCittadinoOrNumeroDocumento(cittadinoEntity.getCodiceFiscale(), cittadinoEntity.getNumeroDocumento())).thenReturn("TRUE");
		questionarioCompilatoService.compilaQuestionarioAnonimo(questionarioInviatoOnlineEntity.getIdQuestionarioCompilato(), questionarioCompilatoAnonimoRequest, questionarioInviatoOnlineEntity.getToken());
	}
	
	@Test
	public void getQuestionarioCompilatoByIdAnonimoTest() throws ParseException {
		when(questionarioInviatoOnlineRepository.findByIdQuestionarioCompilatoAndToken(questionarioInviatoOnlineEntity.getIdQuestionarioCompilato(), questionarioInviatoOnlineEntity.getToken())).thenReturn(Optional.of(questionarioInviatoOnlineEntity));
		when(this.questionarioCompilatoSQLRepository.findById(questionarioInviatoOnlineEntity.getIdQuestionarioCompilato())).thenReturn(Optional.of(questionarioCompilatoEntity));
		questionarioCompilatoService.getQuestionarioCompilatoByIdAnonimo(questionarioInviatoOnlineEntity.getIdQuestionarioCompilato(), questionarioInviatoOnlineEntity.getToken());
	}
	
	@Test
	public void verificaTokenQuestionarioTest() throws ParseException {
		when(questionarioInviatoOnlineRepository.findByIdQuestionarioCompilatoAndToken(questionarioInviatoOnlineEntity.getIdQuestionarioCompilato(), questionarioInviatoOnlineEntity.getToken())).thenReturn(Optional.of(questionarioInviatoOnlineEntity));
		questionarioCompilatoService.verificaTokenQuestionario(questionarioInviatoOnlineEntity.getIdQuestionarioCompilato(), questionarioInviatoOnlineEntity.getToken());
	}

	@Test
	public void isTokenExpiredTest() throws ParseException {
		boolean risultato = questionarioCompilatoService.isTokenExpired(questionarioInviatoOnlineEntity);
		assertThat(risultato).isEqualTo(false);
	}
}
