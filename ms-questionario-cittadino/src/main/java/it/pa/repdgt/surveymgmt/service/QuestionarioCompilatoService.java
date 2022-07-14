package it.pa.repdgt.surveymgmt.service;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import javax.transaction.Transactional;
import javax.validation.Valid;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

import org.bson.json.JsonObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

import it.pa.repdgt.shared.awsintegration.service.EmailService;
import it.pa.repdgt.shared.entity.CittadinoEntity;
import it.pa.repdgt.shared.entity.QuestionarioCompilatoEntity;
import it.pa.repdgt.shared.entity.QuestionarioInviatoOnlineEntity;
import it.pa.repdgt.shared.entityenum.ConsensoTrattamentoDatiEnum;
import it.pa.repdgt.shared.entityenum.EmailTemplateEnum;
import it.pa.repdgt.shared.entityenum.StatoQuestionarioEnum;
import it.pa.repdgt.surveymgmt.collection.QuestionarioCompilatoCollection;
import it.pa.repdgt.surveymgmt.collection.QuestionarioCompilatoCollection.DatiIstanza;
import it.pa.repdgt.surveymgmt.exception.QuestionarioCompilatoException;
import it.pa.repdgt.surveymgmt.exception.ResourceNotFoundException;
import it.pa.repdgt.surveymgmt.mongo.repository.QuestionarioCompilatoMongoRepository;
import it.pa.repdgt.surveymgmt.repository.QuestionarioCompilatoSqlRepository;
import it.pa.repdgt.surveymgmt.repository.QuestionarioInviatoOnlineRepository;
import it.pa.repdgt.surveymgmt.request.QuestionarioCompilatoRequest;

@Service
@Validated
public class QuestionarioCompilatoService {
	@Autowired
	private CittadinoService cittadinoService;
	@Autowired
	private QuestionarioCompilatoSqlRepository questionarioCompilatoSQLRepository;
	@Autowired
	private QuestionarioCompilatoMongoRepository questionarioCompilatoMongoRepository;
	@Autowired
	private QuestionarioInviatoOnlineRepository questionarioInviatoOnlineRepository;
	@Autowired
	private EmailService emailService;
	
	public QuestionarioCompilatoCollection getQuestionarioCompilatoById(@NotBlank final String idQuestionarioCompilato) {
		final String messaggioErrore = String.format("Questionario compilato con id=%s non trovato", idQuestionarioCompilato);
		return questionarioCompilatoMongoRepository.findQuestionarioCompilatoById(idQuestionarioCompilato)
				.orElseThrow(() -> new ResourceNotFoundException(messaggioErrore));
	}
	
	@Transactional(rollbackOn = Exception.class)
	public void compilaQuestionario(
			@NotNull String idQuestionarioCompilato,
			@NotNull @Valid QuestionarioCompilatoRequest questionarioCompilatoRequest) {
		// Check record allineamento questionarioCompilato per (MySql, Mongo): 
		//	- questionarioCompilato su MySql (tabella questionario_compilato) 
		//	- collection questionarioTemplateIstanza su MOngoDB
		final Optional<QuestionarioCompilatoEntity> questionarioCompilatoEntity = this.questionarioCompilatoSQLRepository.findById(idQuestionarioCompilato);
		final Optional<QuestionarioCompilatoCollection> questionarioCompilatoCollection = this.questionarioCompilatoMongoRepository.findQuestionarioCompilatoById(idQuestionarioCompilato);
		if(!questionarioCompilatoEntity.isPresent()) {
			final String messaggioErrore = String.format("Questionario compilato con id=%s non presente in MySql", idQuestionarioCompilato);
			throw new QuestionarioCompilatoException(messaggioErrore);
		}
		if(!questionarioCompilatoCollection.isPresent()) {
			final String messaggioErrore = String.format("Questionario compilato con id=%s non presente in MongoDB", idQuestionarioCompilato);
			throw new QuestionarioCompilatoException(messaggioErrore);
		}
		
		// Recupero dalla request:
		// 	- dati consenso trattamento dati 
		//	- codice fiscale del cittadino che sta compilando il questionario
		String codiceFiscaleCittadino = questionarioCompilatoRequest.getConsensoTrattamentoDatiRequest().getCodiceFiscaleCittadino();
		ConsensoTrattamentoDatiEnum consensoTrattamentoDati = questionarioCompilatoRequest.getConsensoTrattamentoDatiRequest().getConsensoTrattamentoDatiEnum();
		
		// Verifico il consenso trattamento dati per il cittadino e in caso non lo abbia già dato, lo registro per la prima volta
		this.verificaEdEseguiConsensoTrattamentoDati(codiceFiscaleCittadino, consensoTrattamentoDati);

		// Aggiorno questionarioCompilato MySQl
		final QuestionarioCompilatoEntity questionarioCompilatoDBMySqlFetch = questionarioCompilatoEntity.get();
		questionarioCompilatoDBMySqlFetch.setStato(StatoQuestionarioEnum.COMPILATO.getValue());
		questionarioCompilatoDBMySqlFetch.setDataOraAggiornamento(new Date());		
		this.questionarioCompilatoSQLRepository.save(questionarioCompilatoDBMySqlFetch);
		
		// Aggiorno  questionarioCompilatoCollection: 
		//	-> cancello document questionarioCompilatoCollection 
		//	-> risalvo nuovamento lo stesso cancellato ma con in nuovi dati del questionario compilato
		final QuestionarioCompilatoCollection questionarioCompilatoDBMongoFetch = questionarioCompilatoCollection.get();
		// cancello questionarioCompilato presente su mongo
		this.questionarioCompilatoMongoRepository.deleteByIdQuestionarioTemplate(idQuestionarioCompilato);
		
		// Costruisco le sezioni del questionario compilato (Q1, Q2, Q3, Q4) che provengono dalla request per la compilazione del questionario
		final List<DatiIstanza> sezioniQuestionarioCompilato = this.creaSezioniQuestionarioFromRequest(questionarioCompilatoRequest);
		questionarioCompilatoDBMongoFetch.setSezioniQuestionarioTemplateIstanze(sezioniQuestionarioCompilato);
		questionarioCompilatoDBMongoFetch.setDataOraUltimoAggiornamento(questionarioCompilatoDBMySqlFetch.getDataOraAggiornamento());
		questionarioCompilatoDBMongoFetch.setMongoId(null);
		
		// salvo lo stesso questionarioCompilato che ho precedentemente cancellato ma con i nuovi dati all'interno delle sezioni questionario
		this.questionarioCompilatoMongoRepository.save(questionarioCompilatoDBMongoFetch);
	}

	private List<DatiIstanza> creaSezioniQuestionarioFromRequest(QuestionarioCompilatoRequest questionarioCompilatoRequest) {
		final DatiIstanza sezioneQ1 = new DatiIstanza();
		sezioneQ1.setDomandaRisposta(new JsonObject(questionarioCompilatoRequest.getSezioneQ1Questionario()));
		final DatiIstanza sezioneQ2 = new DatiIstanza();
		sezioneQ2.setDomandaRisposta(new JsonObject(questionarioCompilatoRequest.getSezioneQ2Questionario()));
		final DatiIstanza sezioneQ3 = new DatiIstanza();
		sezioneQ3.setDomandaRisposta(new JsonObject(questionarioCompilatoRequest.getSezioneQ3Questionario()));
		final DatiIstanza sezioneQ4 = new DatiIstanza();
		sezioneQ4.setDomandaRisposta(new JsonObject(questionarioCompilatoRequest.getSezioneQ4Questionario()));
		final List<DatiIstanza> sezioniQuestionarioCompilato = Arrays.asList(
			sezioneQ1,
			sezioneQ2,
			sezioneQ3,
			sezioneQ4
		);
		return sezioniQuestionarioCompilato;
	}

	@Transactional(rollbackOn = Exception.class)
	private void verificaEdEseguiConsensoTrattamentoDati(String codiceFiscaleCittadino, ConsensoTrattamentoDatiEnum consensoTrattamentoDatiEnum) {
		// Se cittadino non ha mai dato il consenso, allora devo eseguire operazioni per la registrazione del consenso dati
		if(!this.consensoCittadinoGiàDatoByCodiceFiscaleCittadino(codiceFiscaleCittadino)) {
			CittadinoEntity cittadinoDBFetch = this.cittadinoService.getByCodiceFiscaleOrNumeroDocumento(codiceFiscaleCittadino, null).get();
			Date dateNow = new Date();
			switch(consensoTrattamentoDatiEnum) {
				case CARTACEO:
					cittadinoDBFetch.setTipoConferimentoConsenso(ConsensoTrattamentoDatiEnum.CARTACEO.toString());
					break;
				case ONLINE:
					cittadinoDBFetch.setTipoConferimentoConsenso(ConsensoTrattamentoDatiEnum.ONLINE.toString());
					break;
				case EMAIL:
					// solo in caso di consenso email,
					// oltre a salvare il consenso sulla tabella cittadino, 
					// occorre inviare email al cittadino
					String[] argsTemplate = {  cittadinoDBFetch.getNome() };
					this.emailService.inviaEmail(cittadinoDBFetch.getEmail(), EmailTemplateEnum.CONSENSO, argsTemplate);
					cittadinoDBFetch.setTipoConferimentoConsenso(ConsensoTrattamentoDatiEnum.EMAIL.toString());
					break;
				default:
					throw new UnsupportedOperationException("Consenso Trattamento specificato non valido");
				}
			
			cittadinoDBFetch.setDataOraAggiornamento(dateNow);
			cittadinoDBFetch.setDataConferimentoConsenso(dateNow);
			
			// Aggiorno cittadino con il tipo consenso dato in fase di compilazione del questioanario
			this.cittadinoService.salvaCittadino(cittadinoDBFetch);
		}
	}

	private boolean consensoCittadinoGiàDatoByCodiceFiscaleCittadino(String codiceFiscaleCittadino) {
		return this.cittadinoService.getConsensoByCodiceFiscaleCittadino(codiceFiscaleCittadino) != null;
	}

	@Transactional(rollbackOn = Exception.class)
	public void compilaQuestionarioAnonimo(
			@NotNull String idQuestionarioCompilato,
			@NotNull @Valid QuestionarioCompilatoRequest questionarioCompilatoRequest,
			@NotNull String token) throws ParseException {
		verificaTokenQuestionario(idQuestionarioCompilato, token);
		compilaQuestionario(idQuestionarioCompilato, questionarioCompilatoRequest);
	}

	public QuestionarioCompilatoCollection getQuestionarioCompilatoByIdAnonimo(String idQuestionario, String token) throws ParseException {
		verificaTokenQuestionario(idQuestionario, token);
		return getQuestionarioCompilatoById(idQuestionario);		
	}

	public void verificaTokenQuestionario(String idQuestionario, String token) throws ParseException {
		QuestionarioInviatoOnlineEntity tokenQuestionario = questionarioInviatoOnlineRepository.
				findByIdQuestionarioCompilatoAndToken(idQuestionario, token)
				.orElseThrow(() -> new ResourceNotFoundException(String.format("token non valido per idQuestionario %s", idQuestionario)) );

		if(isTokenExpired(tokenQuestionario)) {
			throw new QuestionarioCompilatoException(String.format("token scaduto per idQuestionario %s", idQuestionario)); 
		}
	}
	
	/*
	 * verifica se sono passati più di 3 giorni dalla creazione del token passato in input
	 */
	public boolean isTokenExpired(QuestionarioInviatoOnlineEntity tokenQuestionario) throws ParseException {
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
		Calendar c = Calendar.getInstance();
		c.setTime(sdf.parse(sdf.format(new Date())));
        Date currentDate = c.getTime();
        c.setTime(tokenQuestionario.getDataOraCreazione());
        c.add(Calendar.DAY_OF_MONTH, 3);
		return currentDate.after(c.getTime());
	}

} 