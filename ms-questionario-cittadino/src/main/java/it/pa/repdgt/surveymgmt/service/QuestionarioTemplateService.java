package it.pa.repdgt.surveymgmt.service;

import java.util.Date;
import java.util.UUID;

import javax.validation.Valid;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

import com.mongodb.DBObject;
import com.mongodb.util.JSON;

import it.pa.repdgt.shared.entity.QuestionarioTemplateEntity;
import it.pa.repdgt.shared.entityenum.StatoQuestionarioEnum;
import it.pa.repdgt.surveymgmt.annotation.JsonString;
import it.pa.repdgt.surveymgmt.annotation.JsonStringNullable;
import it.pa.repdgt.surveymgmt.collection.QuestionarioTemplateCollection;
import it.pa.repdgt.surveymgmt.exception.QuestionarioTemplateException;
import it.pa.repdgt.surveymgmt.exception.ResourceNotFoundException;
import it.pa.repdgt.surveymgmt.mapper.QuestionarioTemplateMapper;
import it.pa.repdgt.surveymgmt.mongo.repository.QuestionarioTemplateRepository;
import it.pa.repdgt.surveymgmt.param.FiltroListaQuestionariTemplateParam;
import it.pa.repdgt.surveymgmt.param.ProfilazioneParam;
import lombok.extern.slf4j.Slf4j;

@Service
@Validated
@Slf4j
public class QuestionarioTemplateService {
	@Autowired
	private QuestionarioTemplateMapper questionarioTemplateMapper;
	@Autowired
	private QuestionarioTemplateSqlService templateQuestionarioSqlService;
	@Autowired
	private RuoloService ruoloService;
	@Autowired
	private ProgrammaXQuestionarioTemplateService programmaXQuestionarioTemplateService;
	@Autowired
	private QuestionarioTemplateRepository questionarioTemplateRepository;
	
	public Page<QuestionarioTemplateCollection> getAllQuestionariTemplateByProfilazioneAndFiltro(
			@NotNull @Valid final ProfilazioneParam profilazione,
			@NotNull @Valid final FiltroListaQuestionariTemplateParam filtroListaQuestionariTemplate,
			@NotNull final Pageable pagina ) {
		log.info("getAllQuestionariTemplateByProfilazioneAndFiltro - START");
		final String codiceFiscaleUtenteLoggato = profilazione.getCodiceFiscaleUtenteLoggato();
		final String codiceRuoloUtenteLoggato = profilazione.getCodiceRuoloUtenteLoggato().toString();
		
		// Verifico se l'utente possiede il ruolo mandato nella richiesta
		boolean hasRuoloUtente = this.ruoloService
			.getRuoliByCodiceFiscale(codiceFiscaleUtenteLoggato)
			.stream()
			.anyMatch(ruolo -> codiceRuoloUtenteLoggato.equalsIgnoreCase(ruolo.getCodice()));
		
		if(!hasRuoloUtente) {
			final String messaggioErrore = String.format("Ruolo non definito per l'utente con codice fiscale '%s'",codiceFiscaleUtenteLoggato);
			throw new QuestionarioTemplateException(messaggioErrore);
		}
		
		final String criterioRicercaQuestionarioTemplate = filtroListaQuestionariTemplate.getCriterioRicerca();
		// Recupero i questionari in base alla profilazione dell'utente loggatosi
		switch (codiceRuoloUtenteLoggato) {
			// Se: l'utente loggato si è profilato con ruolo di DTD/DSCU (ovvero dropdown scelta profilo ha scelto ruolo DTD/DSCU),
			// Allora: Recupero tutti i questionari template da mostrare nella lista dei questionari template del FE
			case "DTD":
			case "DSCU":
				if(filtroListaQuestionariTemplate.getCriterioRicerca() == null && filtroListaQuestionariTemplate.getStatoQuestionario() == null) {
					return this.questionarioTemplateRepository.findAll(pagina);
				}
				if(filtroListaQuestionariTemplate.getCriterioRicerca() != null && filtroListaQuestionariTemplate.getStatoQuestionario() == null) {
					return this.questionarioTemplateRepository.findAllPaginatiByCriterioRicerca(
							criterioRicercaQuestionarioTemplate,
							pagina
						);
				}
				if(filtroListaQuestionariTemplate.getCriterioRicerca() == null && filtroListaQuestionariTemplate.getStatoQuestionario() != null) {
					return this.questionarioTemplateRepository.findByStatoPaginati(
							filtroListaQuestionariTemplate.getStatoQuestionario().getValue(),
							pagina
						);
				}
				return this.questionarioTemplateRepository.findAllPaginatiByCriterioRicercaAndStato(
						criterioRicercaQuestionarioTemplate,
						filtroListaQuestionariTemplate.getStatoQuestionario().getValue(),
						pagina
					);
			default:
				// Se: l'utente loggato si è profilato con ruolo che diverso da DTD/DSCU (ovvero dropdown scelta profilo ha scelto ruolo REG/DEG/REGP/DEGP/ ...),
				// Allora: Recupero l'unico questionario associato al programma scelto 
				// dall'utente durante la profilazione (ovvero dropdown scelta profilo)
				final String nomeQuestionarioTemplate = this.programmaXQuestionarioTemplateService.getNomeQuestionarioTemplateByIdProgramma(profilazione.getIdProgramma());
				return this.questionarioTemplateRepository.findByNomeQuestionarioPaginati(
						nomeQuestionarioTemplate,
						pagina
					);
		}
	}

	public QuestionarioTemplateCollection getQuestionarioTemplateById(@NotNull String idQuestionarioTemplate) {
		log.info("getById - id={} START", idQuestionarioTemplate);
		String messaggioErrore = String.format("templateQuestionario con id=%s non presente.", idQuestionarioTemplate);
		return this.questionarioTemplateRepository.findTemplateQuestionarioById(idQuestionarioTemplate)
				.orElseThrow(() -> new ResourceNotFoundException(messaggioErrore));
	}
	
	public boolean esisteQuestionarioTemplateByNome(final String nomeQuestionario) {
		return this.questionarioTemplateRepository.findTemplateQuestionarioByNome(nomeQuestionario)
				.isPresent();
	}

	public QuestionarioTemplateCollection creaNuovoQuestionarioTemplate(
			@NotNull(message = "Questionario da creare deve essere non null") 
			@Valid final QuestionarioTemplateCollection questionarioTemplateCollection,
			@NotNull(message = "Stato questionario da creare deve essere non null") final StatoQuestionarioEnum statoQuestionario) {
		log.info("creaNuovoQuestionarioTemplate - START");
		final String nomeQuestionario = questionarioTemplateCollection.getNomeQuestionarioTemplate();
		// Verifico se esiste già esiste un questionario con il nome di quello che voglio creare
		if(this.esisteQuestionarioTemplateByNome(nomeQuestionario)) {
			final String messaggioErrore = String.format("Impossibile creare il questionario. Questionario con nome='%s' già presente.", nomeQuestionario);
			throw new QuestionarioTemplateException(messaggioErrore);
		}
		questionarioTemplateCollection.setStato(statoQuestionario.getValue());
		// salvo questionario template su MongoDb
		final QuestionarioTemplateCollection questionarioTemplateCreato = this.salvaQuestionarioTemplate(questionarioTemplateCollection);
		// trasformo questionarioTemplateCollection in questionarioTemplateEntity 
		final QuestionarioTemplateEntity questionarioTemplateEntity = this.questionarioTemplateMapper.toEntityFrom(questionarioTemplateCollection);
		// salvo questionario template su mySql
		this.templateQuestionarioSqlService.salvaQuestionarioTemplate(questionarioTemplateEntity);

		return questionarioTemplateCreato;
	}

	public QuestionarioTemplateCollection salvaQuestionarioTemplate(
			@NotNull(message = "Deve essere non null") 
			@Valid QuestionarioTemplateCollection questionarioTemplateCollection) {
		// setto id random per il questionario
		questionarioTemplateCollection.setIdQuestionarioTemplate(UUID.randomUUID().toString());
		// setto la data di creazione del questionario con la data corrente
		questionarioTemplateCollection.setDataOraCreazione(new Date());	
		// setto la data di ultimo aggiornamento del questionario uguale alla data di creazione del questionario
		questionarioTemplateCollection.setDataOraUltimoAggiornamento(questionarioTemplateCollection.getDataOraCreazione());
		
		// Per ogni sezione del questioanrio setto id random per sezione i-esima
		questionarioTemplateCollection
			.getSezioniQuestionarioTemplate()
			.forEach(sezioneQuestionarioTemplate -> sezioneQuestionarioTemplate.setId(UUID.randomUUID().toString()));
		
		return this.questionarioTemplateRepository.save(questionarioTemplateCollection);
	}
	
	public void duplicaQuestionarioTemplate(
			@NotNull(message = "id Questionario template deve essere non null") String questionatioTemplateId) {
		QuestionarioTemplateCollection questionarioFetch = null;
		
		// Verifico che il questionario da duplicare esista.
		// Se: esiste, Allora: lo recupero e lo risalvo mettendo un id diverso
		try {
			questionarioFetch = this.getQuestionarioTemplateById(questionatioTemplateId);
		} catch (ResourceNotFoundException ex) {
			final String errorMessage = String.format("Impossibile duplicare questionario con id=%s perchè non presente.", questionatioTemplateId);
			throw new QuestionarioTemplateException(errorMessage, ex);
		}
		
		questionarioFetch.setMongoId(null);
		this.salvaQuestionarioTemplate(questionarioFetch);
	}

	// TODO
	public QuestionarioTemplateCollection aggiornaQuestionarioTemplate(
			@NotNull String idQuestionarioTemplate, 
			@NotBlank @JsonString String schemaQuestionarioTemplate, 
			@JsonStringNullable String uiSchemaQuestionarioTemplate) {
		log.info("updateTemplate - START");
		log.debug("\nschema={}", schemaQuestionarioTemplate);
		DBObject schemaObject = (DBObject) JSON.parse(schemaQuestionarioTemplate);
//	    QuestionarioTemplateCollection templateQuestionarioDBFetch = this.getQuestionarioTemplateByIdQuestionarioTemplate(idQuestionarioTemplate);
//	    templateQuestionarioDBFetch.setSchema(schemaObject);
//		if(uiSchemaQuestionarioTemplate != null) {
//			log.debug("\nuiSchema={}", uiSchemaQuestionarioTemplate);
//			DBObject uiSchemaObject = (DBObject) JSON.parse(uiSchemaQuestionarioTemplate);
//			templateQuestionarioDBFetch.setUIschema(uiSchemaObject);
//		}
//		return this.templateQuestionarioRepository.save(templateQuestionarioDBFetch);
		return null;
	}
}