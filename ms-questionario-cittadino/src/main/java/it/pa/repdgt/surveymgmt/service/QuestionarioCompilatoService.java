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

import it.pa.repdgt.shared.repository.tipologica.FasciaDiEtaRepository;
import org.bson.json.JsonObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

import it.pa.repdgt.shared.annotation.LogExecutionTime;
import it.pa.repdgt.shared.annotation.LogMethod;
import it.pa.repdgt.shared.awsintegration.service.EmailService;
import it.pa.repdgt.shared.entity.CittadinoEntity;
import it.pa.repdgt.shared.entity.QuestionarioCompilatoEntity;
import it.pa.repdgt.shared.entity.QuestionarioInviatoOnlineEntity;
import it.pa.repdgt.shared.entityenum.StatoQuestionarioEnum;
import it.pa.repdgt.shared.exception.CodiceErroreEnum;
import it.pa.repdgt.surveymgmt.bean.QuestionarioCompilatoBean;
import it.pa.repdgt.surveymgmt.collection.QuestionarioCompilatoCollection;
import it.pa.repdgt.surveymgmt.collection.QuestionarioCompilatoCollection.DatiIstanza;
import it.pa.repdgt.surveymgmt.exception.CittadinoException;
import it.pa.repdgt.surveymgmt.exception.QuestionarioCompilatoException;
import it.pa.repdgt.surveymgmt.exception.ResourceNotFoundException;
import it.pa.repdgt.surveymgmt.exception.ServizioException;
import it.pa.repdgt.surveymgmt.mongo.repository.QuestionarioCompilatoMongoRepository;
import it.pa.repdgt.surveymgmt.repository.QuestionarioCompilatoSqlRepository;
import it.pa.repdgt.surveymgmt.repository.QuestionarioInviatoOnlineRepository;
import it.pa.repdgt.surveymgmt.request.QuestionarioCompilatoAnonimoRequest;
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
	@Autowired
	private QuestionarioTemplateService questionarioTemplateService;
	@Autowired
	private FasciaDiEtaRepository fasciaDiEtaRepository;

	@LogMethod
	@LogExecutionTime
	public QuestionarioCompilatoCollection getQuestionarioCompilatoById(
			@NotBlank final String idQuestionarioCompilato) {
		final String messaggioErrore = String.format("Questionario compilato con id=%s non trovato",
				idQuestionarioCompilato);
		return questionarioCompilatoMongoRepository.findQuestionarioCompilatoById(idQuestionarioCompilato)
				.orElseThrow(() -> new ResourceNotFoundException(messaggioErrore, CodiceErroreEnum.C01));
	}

	@LogMethod
	@LogExecutionTime
	@Transactional(rollbackOn = Exception.class)
	public void compilaQuestionario(
			@NotNull String idQuestionarioCompilato,
			@NotNull @Valid QuestionarioCompilatoRequest questionarioCompilatoRequest) {
		// Check record allineamento questionarioCompilato per (MySql, Mongo):
		// - questionarioCompilato su MySql (tabella questionario_compilato)
		// - collection questionarioTemplateIstanza su MOngoDB
		final Optional<QuestionarioCompilatoEntity> questionarioCompilatoEntity = this.questionarioCompilatoSQLRepository
				.findById(idQuestionarioCompilato);
		final Optional<QuestionarioCompilatoCollection> questionarioCompilatoCollection = this.questionarioCompilatoMongoRepository
				.findQuestionarioCompilatoById(idQuestionarioCompilato);
		if (!questionarioCompilatoEntity.isPresent()) {
			final String messaggioErrore = String.format("Questionario compilato con id=%s non presente in MySql",
					idQuestionarioCompilato);
			throw new QuestionarioCompilatoException(messaggioErrore, CodiceErroreEnum.QC01);
		}
		if (!questionarioCompilatoCollection.isPresent()) {
			final String messaggioErrore = String.format("Questionario compilato con id=%s non presente in MongoDB",
					idQuestionarioCompilato);
			throw new QuestionarioCompilatoException(messaggioErrore, CodiceErroreEnum.QC02);
		}

		if (questionarioCompilatoEntity.get().getStato().equals(StatoQuestionarioEnum.COMPILATO.getValue()))
			throw new ServizioException("Il questionario risulta già compilato", CodiceErroreEnum.Q02);

		if (!cittadinoService.getCittadinoPerCfOrNumDoc(questionarioCompilatoRequest.getCodiceFiscaleDaAggiornare(),
				questionarioCompilatoRequest.getNumeroDocumentoDaAggiornare(),
				questionarioCompilatoEntity.get().getCittadino().getId()).isEmpty()) {
			String errorMessage = String.format(
					"Impossibile aggiornare il cittadino. Cittadino con codice fiscale o numero documento già esistente");
			throw new CittadinoException(errorMessage, CodiceErroreEnum.U07);
		}

		// Recupero dalla request:
		// - dati consenso trattamento dati
		// - codice fiscale del cittadino che sta compilando il questionario
		// - numero documento del cittadino che sta compilando il questionario
		String codiceFiscaleCittadino = questionarioCompilatoRequest.getConsensoTrattamentoDatiRequest()
				.getCodiceFiscaleCittadino();
		String numeroDocumentoCittadino = questionarioCompilatoRequest.getConsensoTrattamentoDatiRequest()
				.getNumeroDocumentoCittadino();

		// Verifico il consenso trattamento dati per il cittadino e in caso non lo abbia
		// già dato,
		// lo registro per la prima volta. Ovvero salvo l'informazione sulla tabella
		// Cittadino
		this.verificaEseguiESalvaConsensoTrattamentoDati(codiceFiscaleCittadino, numeroDocumentoCittadino);

		// Recupero il cittadino e lo aggiorno i nuovi dati provenienti dalla request
		Optional<CittadinoEntity> optionalCittadinoDBFetch = this.cittadinoService
				.getByCodiceFiscaleOrNumeroDocumento(codiceFiscaleCittadino, numeroDocumentoCittadino);
		optionalCittadinoDBFetch.ifPresent(cittadino -> {
			cittadino.setDataOraAggiornamento(new Date());
			this.cittadinoService.salvaCittadino(cittadino);
		});

		// Aggiorno questionarioCompilato MySQl
		final QuestionarioCompilatoEntity questionarioCompilatoDBMySqlFetch = questionarioCompilatoEntity.get();
		questionarioCompilatoDBMySqlFetch.setStato(StatoQuestionarioEnum.COMPILATO.getValue());
		questionarioCompilatoDBMySqlFetch.setDataOraAggiornamento(new Date());
		this.questionarioCompilatoSQLRepository.save(questionarioCompilatoDBMySqlFetch);

		final QuestionarioCompilatoCollection questionarioCompilatoDBMongoFetch = questionarioCompilatoCollection.get();

		// Costruisco le sezioni del questionario compilato (Q1, Q2, Q3, Q4) che
		// provengono dalla request per la compilazione del questionario
		final List<DatiIstanza> sezioniQuestionarioCompilato = this
				.creaSezioniQuestionarioFromRequest(questionarioCompilatoRequest);
		questionarioCompilatoDBMongoFetch.setSezioniQuestionarioTemplateIstanze(sezioniQuestionarioCompilato);
		questionarioCompilatoDBMongoFetch
				.setDataOraUltimoAggiornamento(questionarioCompilatoDBMySqlFetch.getDataOraAggiornamento());

		// Aggiorno questionarioCompilatoCollection
		this.questionarioCompilatoMongoRepository.save(questionarioCompilatoDBMongoFetch);
	}

	@LogMethod
	@LogExecutionTime
	@Transactional(rollbackOn = Exception.class)
	public void compilaQuestionarioPerAnonimo(
			@NotNull String idQuestionarioCompilato,
			@NotNull @Valid QuestionarioCompilatoAnonimoRequest questionarioCompilatoAnonimoRequest,
			QuestionarioCompilatoEntity questionarioCompilatoEntity,
			QuestionarioCompilatoCollection questionarioCompilatoCollection,
			@NotBlank String token) {

		QuestionarioInviatoOnlineEntity questionarioInviato = this.questionarioInviatoOnlineRepository
				.findByIdQuestionarioCompilatoAndToken(idQuestionarioCompilato, token).get();

		final QuestionarioCompilatoCollection questionarioCompilatoDBMongoFetch = questionarioCompilatoCollection;
		// Recupero le sezioni del questionario compilato salvate
		List<DatiIstanza> datiIstanza = questionarioCompilatoDBMongoFetch.getSezioniQuestionarioTemplateIstanze();
		DatiIstanza q1 = datiIstanza.stream().filter(sezione -> ((JsonObject) sezione.getDomandaRisposta()).toString()
				.contains("anagraphic-citizen-section")).findFirst().get();
		// Verifico il consenso trattamento dati per il cittadino e in caso non lo abbia
		// già dato,
		// lo registro per la prima volta. Ovvero salvo l'informazione sulla tabella
		// Cittadino
		this.verificaEseguiESalvaConsensoTrattamentoDatiPerAnonimo(questionarioInviato.getCodiceFiscale(),
				questionarioInviato.getNumDocumento(), q1);
		// Aggiorno questionarioCompilato MySQl
		final QuestionarioCompilatoEntity questionarioCompilatoDBMySqlFetch = questionarioCompilatoEntity;
		questionarioCompilatoDBMySqlFetch.setStato(StatoQuestionarioEnum.COMPILATO.getValue());
		questionarioCompilatoDBMySqlFetch.setDataOraAggiornamento(new Date());
		this.questionarioCompilatoSQLRepository.save(questionarioCompilatoDBMySqlFetch);

		final DatiIstanza sezioneQ4 = new DatiIstanza();
		sezioneQ4.setDomandaRisposta(new JsonObject(questionarioCompilatoAnonimoRequest.getSezioneQ4Questionario()));
		datiIstanza.add(sezioneQ4);
		questionarioCompilatoDBMongoFetch
				.setDataOraUltimoAggiornamento(questionarioCompilatoDBMySqlFetch.getDataOraAggiornamento());
		questionarioCompilatoDBMongoFetch.setSezioniQuestionarioTemplateIstanze(datiIstanza);
		// Aggiorno questionarioCompilatoCollection
		this.questionarioCompilatoMongoRepository.save(questionarioCompilatoDBMongoFetch);
	}

	public List<DatiIstanza> creaSezioniQuestionarioFromRequest(
			QuestionarioCompilatoRequest questionarioCompilatoRequest) {
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
				sezioneQ4);
		return sezioniQuestionarioCompilato;
	}

	@LogMethod
	@LogExecutionTime
	@Transactional(rollbackOn = Exception.class)
	public void verificaEseguiESalvaConsensoTrattamentoDatiPerAnonimo(String codiceFiscaleCittadino,
			String numeroDocumento, DatiIstanza q1) {
		String q1Text = ((JsonObject) q1.getDomandaRisposta()).toString();
		// Se cittadino non ha mai dato il consenso, allora devo eseguire operazioni per
		// la registrazione del consenso dati
		if (!this.consensoCittadinoGiaDatoByCodiceFiscaleCittadino(codiceFiscaleCittadino, numeroDocumento)) {
			CittadinoEntity cittadinoDBFetch = this.cittadinoService
					.getByCodiceFiscaleOrNumeroDocumento(codiceFiscaleCittadino, numeroDocumento).get();
			Date dateNow = new Date();
			SimpleDateFormat sdf = new SimpleDateFormat("dd-MM-yyyy");
			q1Text = q1Text.replace("$dataConsenso", sdf.format(dateNow));
			q1.setDomandaRisposta(new JsonObject(q1Text));
			cittadinoDBFetch.setDataOraAggiornamento(dateNow);

			// Aggiorno cittadino con il tipo consenso dato in fase di compilazione del
			// questioanario
			this.cittadinoService.salvaCittadino(cittadinoDBFetch);
		}
	}

	@LogMethod
	@LogExecutionTime
	@Transactional(rollbackOn = Exception.class)
	public void verificaEseguiESalvaConsensoTrattamentoDati(String codiceFiscaleCittadino, String numeroDocumento) {
		// Se cittadino non ha mai dato il consenso, allora devo eseguire operazioni per
		// la registrazione del consenso dati
		if (!this.consensoCittadinoGiaDatoByCodiceFiscaleCittadino(codiceFiscaleCittadino, numeroDocumento)) {
			CittadinoEntity cittadinoDBFetch = this.cittadinoService
					.getByCodiceFiscaleOrNumeroDocumento(codiceFiscaleCittadino, numeroDocumento).get();
			Date dateNow = new Date();

			cittadinoDBFetch.setDataOraAggiornamento(dateNow);

			// Aggiorno cittadino con il tipo consenso dato in fase di compilazione del
			// questioanario
			this.cittadinoService.salvaCittadino(cittadinoDBFetch);
		}
	}

	private boolean consensoCittadinoGiaDatoByCodiceFiscaleCittadino(String codiceFiscaleCittadino,
			String numeroDocumento) {
		return this.cittadinoService.getConsensoByCodiceFiscaleCittadinoOrNumeroDocumento(codiceFiscaleCittadino,
				numeroDocumento) != null;
	}

	@LogMethod
	@LogExecutionTime
	@Transactional(rollbackOn = Exception.class)
	public void compilaQuestionarioAnonimo(
			@NotNull String idQuestionarioCompilato,
			@NotNull @Valid QuestionarioCompilatoAnonimoRequest questionarioCompilatoAnonimoRequest,
			@NotNull String token) throws ParseException {

		// Check record allineamento questionarioCompilato per (MySql, Mongo):
		// - questionarioCompilato su MySql (tabella questionario_compilato)
		// - collection questionarioTemplateIstanza su MOngoDB
		final Optional<QuestionarioCompilatoEntity> questionarioCompilatoEntity = this.questionarioCompilatoSQLRepository
				.findById(idQuestionarioCompilato);
		final Optional<QuestionarioCompilatoCollection> questionarioCompilatoCollection = this.questionarioCompilatoMongoRepository
				.findQuestionarioCompilatoById(idQuestionarioCompilato);
		if (!questionarioCompilatoEntity.isPresent()) {
			final String messaggioErrore = String.format("Questionario compilato con id=%s non presente in MySql",
					idQuestionarioCompilato);
			throw new QuestionarioCompilatoException(messaggioErrore, CodiceErroreEnum.QC01);
		}
		if (!questionarioCompilatoCollection.isPresent()) {
			final String messaggioErrore = String.format("Questionario compilato con id=%s non presente in MongoDB",
					idQuestionarioCompilato);
			throw new QuestionarioCompilatoException(messaggioErrore, CodiceErroreEnum.QC02);
		}

		QuestionarioCompilatoEntity questionarioCompilato = questionarioCompilatoEntity.get();

		if (questionarioCompilato.getStato().equals(StatoQuestionarioEnum.COMPILATO.getValue()))
			throw new ServizioException("Il questionario risulta già compilato", CodiceErroreEnum.Q02);

		verificaTokenQuestionario(idQuestionarioCompilato, token);
		compilaQuestionarioPerAnonimo(idQuestionarioCompilato, questionarioCompilatoAnonimoRequest,
				questionarioCompilato, questionarioCompilatoCollection.get(), token);
	}

	@LogMethod
	@LogExecutionTime
	public QuestionarioCompilatoBean getQuestionarioCompilatoByIdAnonimo(String idQuestionarioCompilato, String token)
			throws ParseException {
		final QuestionarioCompilatoBean questionarioCompilatoBean = new QuestionarioCompilatoBean();

		Optional<QuestionarioCompilatoEntity> questionarioCompilatoOptional = this.questionarioCompilatoSQLRepository
				.findById(idQuestionarioCompilato);
		if (!questionarioCompilatoOptional.isPresent())
			throw new ServizioException("Errore impossibile recuperare il questionario poichè inesistente su MySql",
					CodiceErroreEnum.QT05);

		QuestionarioCompilatoEntity questionarioCompilato = questionarioCompilatoOptional.get();

		if (questionarioCompilato.getStato().equals(StatoQuestionarioEnum.COMPILATO.getValue()))
			throw new ServizioException("Il questionario risulta già compilato", CodiceErroreEnum.Q02);

		verificaTokenQuestionario(idQuestionarioCompilato, token);

		CittadinoEntity cittadinoAssociatoAlQuestionarioCompilato = questionarioCompilato.getCittadino();

		boolean isAbilitatoTrattamentoDati = true;
		questionarioCompilatoBean.setAbilitatoConsensoTrattatamentoDatiCittadino(isAbilitatoTrattamentoDati);

		String idQuestionarioTemplate = questionarioCompilato.getIdQuestionarioTemplate();

		// verifico se il questionarioTemplatquestionarioTemplateAssociatoAlProgrammae
		// associato al programma è presente su MongoDb

		String errorMessage = null;
		try {
			questionarioCompilatoBean.setQuestionarioTemplate(
					this.questionarioTemplateService.getQuestionarioTemplateById(idQuestionarioTemplate));
		} catch (ResourceNotFoundException ex) {
			errorMessage = String.format("QuestionarioTemplate con id=%s non presente in MongoDB",
					idQuestionarioTemplate);
			throw new ServizioException(errorMessage, ex, CodiceErroreEnum.QT04);
		}
		return questionarioCompilatoBean;
	}

	public void verificaTokenQuestionario(String idQuestionario, String token) throws ParseException {
		QuestionarioInviatoOnlineEntity tokenQuestionario = questionarioInviatoOnlineRepository
				.findByIdQuestionarioCompilatoAndToken(idQuestionario, token)
				.orElseThrow(() -> new QuestionarioCompilatoException(
						String.format("token non valido per idQuestionario %s", idQuestionario), CodiceErroreEnum.T01));

		if (isTokenExpired(tokenQuestionario)) {
			throw new QuestionarioCompilatoException(
					String.format("token scaduto per idQuestionario %s", idQuestionario), CodiceErroreEnum.T02);
		}
	}

	/*
	 * verifica se sono passati più di 3 giorni dalla creazione del token passato in
	 * input
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