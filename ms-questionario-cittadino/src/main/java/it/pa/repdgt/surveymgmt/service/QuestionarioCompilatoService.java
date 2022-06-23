package it.pa.repdgt.surveymgmt.service;

import java.util.Arrays;
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

import it.pa.repdgt.shared.entity.CittadinoEntity;
import it.pa.repdgt.shared.entity.QuestionarioCompilatoEntity;
import it.pa.repdgt.shared.entityenum.StatoQuestionarioEnum;
import it.pa.repdgt.surveymgmt.collection.QuestionarioCompilatoCollection;
import it.pa.repdgt.surveymgmt.collection.QuestionarioCompilatoCollection.DatiIstanza;
import it.pa.repdgt.surveymgmt.exception.QuestionarioCompilatoException;
import it.pa.repdgt.surveymgmt.exception.ResourceNotFoundException;
import it.pa.repdgt.surveymgmt.mongo.repository.QuestionarioCompilatoMongoRepository;
import it.pa.repdgt.surveymgmt.repository.QuestionarioCompilatoSqlRepository;
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
	
	public QuestionarioCompilatoCollection getQuestionarioCompilatoById(@NotBlank final String idQuestionarioCompilato) {
		final String messaggioErrore = String.format("Questionario compilato con id=%s non trovato", idQuestionarioCompilato);
		return questionarioCompilatoMongoRepository.findQuestionarioCompilatoById(idQuestionarioCompilato)
				.orElseThrow(() -> new ResourceNotFoundException(messaggioErrore));
	}
	
	@Transactional(rollbackOn = Exception.class)
	public void compilaQuestionario(
			@NotNull String idQuestionarioCompilato,
			@NotNull @Valid QuestionarioCompilatoRequest questionarioCompilatoRequest) {
		final Optional<QuestionarioCompilatoEntity> optionalQuestionarioCompilato = this.questionarioCompilatoSQLRepository.findById(idQuestionarioCompilato);
		if(!optionalQuestionarioCompilato.isPresent()) {
			final String messaggioErrore = String.format("Questionario compilato con id=%s non presente in MySql", idQuestionarioCompilato);
			throw new QuestionarioCompilatoException(messaggioErrore);
		}
		
		final QuestionarioCompilatoEntity questionarioCompilatoDBMySqlFetch = optionalQuestionarioCompilato.get();
		final CittadinoEntity cittadino = questionarioCompilatoDBMySqlFetch.getCittadino();
		this.aggiornaConsensoDatiCittadino(idQuestionarioCompilato, questionarioCompilatoRequest, cittadino);
		// aggiorna questionarioCompilato MySQl
		questionarioCompilatoDBMySqlFetch.setStato(StatoQuestionarioEnum.COMPILATO.getValue());
		questionarioCompilatoDBMySqlFetch.setDataOraAggiornamento(new Date());		
		this.questionarioCompilatoSQLRepository.save(questionarioCompilatoDBMySqlFetch);
		
		// cancello documento questionarioCompilatoCollection e lo reinserisco con in nuovi dati
		Optional<QuestionarioCompilatoCollection> optionalQuestionarioCompilatoCollection = this.questionarioCompilatoMongoRepository.findQuestionarioCompilatoById(idQuestionarioCompilato);
		if(!optionalQuestionarioCompilatoCollection.isPresent()) {
			final String messaggioErrore = String.format("Questionario compilato con id=%s non presente in MongoDB", idQuestionarioCompilato);
			throw new QuestionarioCompilatoException(messaggioErrore);
		}
		final QuestionarioCompilatoCollection questionarioCompilatoDBMongoFetch = optionalQuestionarioCompilatoCollection.get();
		this.questionarioCompilatoMongoRepository.deleteById(idQuestionarioCompilato);
		
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
		questionarioCompilatoDBMongoFetch.setSezioniQuestionarioTemplateIstanze(sezioniQuestionarioCompilato);
		questionarioCompilatoDBMongoFetch.setDataOraUltimoAggiornamento(questionarioCompilatoDBMySqlFetch.getDataOraAggiornamento());
		this.questionarioCompilatoMongoRepository.save(questionarioCompilatoDBMongoFetch);
	}

	@Transactional(rollbackOn = Exception.class)
	private void aggiornaConsensoDatiCittadino(
			@NotNull final String idQuestionarioCompilato,
			@NotNull final QuestionarioCompilatoRequest questionarioCompilatoRequest, 
			final CittadinoEntity cittadino) {
		if(questionarioCompilatoRequest.getConsensoTrattamentoDatiRequest() == null) {
			return ;
		}
		
		cittadino.setDataConferimentoConsenso(new Date());
		if(questionarioCompilatoRequest.getConsensoTrattamentoDatiRequest().isConsensoCartaceo()) {
			cittadino.setTipoConferimentoConsenso("CARTACEO");
		} else if(questionarioCompilatoRequest.getConsensoTrattamentoDatiRequest().isConsensoOTP()) {
			cittadino.setTipoConferimentoConsenso("OTP");
		} else if(questionarioCompilatoRequest.getConsensoTrattamentoDatiRequest().isConsensoOnline()) {
			cittadino.setTipoConferimentoConsenso("ONLINE");
		}
		cittadino.setDataOraAggiornamento(new Date());
		cittadinoService.salvaCittadino(cittadino);
	}

} 