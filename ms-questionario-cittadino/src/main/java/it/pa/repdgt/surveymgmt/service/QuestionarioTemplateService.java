package it.pa.repdgt.surveymgmt.service;

import java.util.Collections;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;

import javax.transaction.Transactional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

import it.pa.repdgt.shared.constants.RuoliUtentiConstants;
import it.pa.repdgt.shared.entity.QuestionarioTemplateEntity;
import it.pa.repdgt.shared.entityenum.StatoEnum;
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
	private QuestionarioTemplateSqlService questionarioTemplateSqlService;
	@Autowired
	private RuoloService ruoloService;
	@Autowired
	private QuestionarioTemplateRepository questionarioTemplateRepository;

	public Page<QuestionarioTemplateEntity> getAllQuestionariTemplateByProfilazioneAndFiltro(
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
		
		// Recupero i questionari in base alla profilazione dell'utente loggatosi
		// Se: utente loggato si è profilato con uno dei seguenti ruoli,
		// Allora: non mostro nessun questionario
		if( RuoliUtentiConstants.REGP.equalsIgnoreCase(codiceRuoloUtenteLoggato)
			|| RuoliUtentiConstants.DEGP.equalsIgnoreCase(codiceRuoloUtenteLoggato)
			|| RuoliUtentiConstants.REPP.equalsIgnoreCase(codiceRuoloUtenteLoggato)
			|| RuoliUtentiConstants.DEPP.equalsIgnoreCase(codiceRuoloUtenteLoggato)
			|| RuoliUtentiConstants.FACILITATORE.equalsIgnoreCase(codiceRuoloUtenteLoggato)
			|| RuoliUtentiConstants.VOLONTARIO.equalsIgnoreCase(codiceRuoloUtenteLoggato) ) {
			return new PageImpl<QuestionarioTemplateEntity>(Collections.emptyList());
		}

		String criterioRicercaFiltro = null;
		if(filtroListaQuestionariTemplate.getCriterioRicerca() != null) {
			criterioRicercaFiltro = "%".concat(filtroListaQuestionariTemplate.getCriterioRicerca()).concat("%");
		}
		
		String statoQuestionarioFiltro = null;
		if(filtroListaQuestionariTemplate.getStatoQuestionario() != null) {
			statoQuestionarioFiltro = filtroListaQuestionariTemplate.getStatoQuestionario().getValue();
		}

		switch (codiceRuoloUtenteLoggato) {
			case RuoliUtentiConstants.DSCU:
				return this.questionarioTemplateSqlService.findQuestionariTemplatePaginatiByDefaultPolicySCDAndFiltro(
						criterioRicercaFiltro, 
						statoQuestionarioFiltro,
						pagina
					);
			case RuoliUtentiConstants.REG:
			case RuoliUtentiConstants.DEG:
				// Se: l'utente loggato si è profilato con ruolo che diverso da DTD/DSCU (ovvero dropdown scelta profilo ha scelto ruolo REG/DEG/REGP/DEGP/ ...),
				// Allora: Recupero l'unico questionario associato al programma scelto 
				// dall'utente durante la profilazione (ovvero dropdown scelta profilo)
				return this.questionarioTemplateSqlService.findQuestionariTemplatePaginatiByIdProgrammaAndFiltro(
						profilazione.getIdProgramma(),
						criterioRicercaFiltro, 
						statoQuestionarioFiltro,
						pagina
					);
			default:
				// Se: l'utente loggato si è profilato con ruolo di DTD/ruolo custom
				// Allora: Recupero tutti i questionari template da mostrare nella lista dei questionari template del FE
				return this.questionarioTemplateSqlService.findAllQuestionariTemplatePaginatiByFiltro(
						criterioRicercaFiltro,
						statoQuestionarioFiltro,
						pagina
					);
		}
	}

	public QuestionarioTemplateCollection getQuestionarioTemplateById(@NotNull String idQuestionarioTemplate) {
		log.info("getById - id={} START", idQuestionarioTemplate);
		final String messaggioErrore = String.format("templateQuestionario con id=%s non presente.", idQuestionarioTemplate);
		return this.questionarioTemplateRepository.findTemplateQuestionarioById(idQuestionarioTemplate)
				.orElseThrow(() -> new ResourceNotFoundException(messaggioErrore));
	}

	@Transactional(rollbackOn = Exception.class)
	public QuestionarioTemplateCollection creaNuovoQuestionarioTemplate(
			@NotNull(message = "Questionario da creare deve essere non null") 
			@Valid final QuestionarioTemplateCollection questionarioTemplateCollection) {
		log.info("creaNuovoQuestionarioTemplate - START");
		final String idQuestionarioTemplateDaCreare = UUID.randomUUID().toString();
		questionarioTemplateCollection.setIdQuestionarioTemplate(idQuestionarioTemplateDaCreare);
		questionarioTemplateCollection.setStato(StatoEnum.NON_ATTIVO.getValue());
		questionarioTemplateCollection.setDataOraCreazione(new Date());	
		questionarioTemplateCollection.setDataOraUltimoAggiornamento(questionarioTemplateCollection.getDataOraCreazione());
		
		// Allineamento questionario template su mysql
		final QuestionarioTemplateEntity questionarioTemplateEntity = this.questionarioTemplateMapper.toEntityFrom(questionarioTemplateCollection);
		this.questionarioTemplateSqlService.salvaQuestionarioTemplate(questionarioTemplateEntity);
		
		// salvo questionario template su MongoDb
		return this.questionarioTemplateRepository.save(questionarioTemplateCollection);
	}

	@Transactional(rollbackOn = Exception.class)
	public QuestionarioTemplateCollection aggiornaQuestionarioTemplate(
			@NotNull(message = "id questionario template deve essere non null") String idQuestionarioTemplate,
			@NotNull @Valid final QuestionarioTemplateCollection questionarioTemplateDaAggiornare) {
		log.info("aggiornaQuestionarioTemplate - START");
		QuestionarioTemplateCollection questionarioTemplateFetchDB = null;

		// Verifico se esiste questionarioTemplate da aggiornare
		try {
			questionarioTemplateFetchDB = this.getQuestionarioTemplateById(idQuestionarioTemplate);
		} catch (ResourceNotFoundException ex) {
			final String messaggioErrore = String.format("Impossibile aggiornare il questionario. Questionario con id='%s' non esiste.", idQuestionarioTemplate);
			throw new QuestionarioTemplateException(messaggioErrore, ex);
		}
		
		// Verifico se è possibile aggiornare il questionario template in base al ciclo di vita
		final String statoQuestionario = questionarioTemplateFetchDB.getStato();
		if(!this.isQuestionarioTemplateModificabileByStato(statoQuestionario)) {
			final String messaggioErrore = String.format("Impossibile aggiornare il questionario con id '%s'. Stato questionario = '%s'.",
					idQuestionarioTemplate, statoQuestionario);
			throw new QuestionarioTemplateException(messaggioErrore);
		}

		questionarioTemplateDaAggiornare.setMongoId(questionarioTemplateFetchDB.getMongoId());
		questionarioTemplateDaAggiornare.setIdQuestionarioTemplate(questionarioTemplateFetchDB.getIdQuestionarioTemplate());
		questionarioTemplateDaAggiornare.setStato(questionarioTemplateFetchDB.getStato());
		questionarioTemplateDaAggiornare.setDataOraCreazione(questionarioTemplateFetchDB.getDataOraCreazione());
		questionarioTemplateDaAggiornare.setDataOraUltimoAggiornamento(new Date());

		// Allineamento questionario template su mysql
		final QuestionarioTemplateEntity questionarioTemplateEntity = this.questionarioTemplateMapper.toEntityFrom(questionarioTemplateDaAggiornare);
		this.questionarioTemplateSqlService.aggiornaQuestionarioTemplate(questionarioTemplateEntity);

		// Aggiornamento questionario template su MongoDB:
		// 	-> 1. Cancellazione questionario template su MongoDb 
		//  -> 2. Inserimento stesso questionario template ma con i dati aggiornati
		this.questionarioTemplateRepository.deleteByIdQuestionarioTemplate(idQuestionarioTemplate);
		return this.questionarioTemplateRepository.save(questionarioTemplateDaAggiornare);
	}

	public boolean isQuestionarioTemplateModificabileByStato(@NotNull final String statoQuestionario) {
		return (
					StatoEnum.ATTIVO.getValue().equalsIgnoreCase(statoQuestionario)
				 ||	StatoEnum.NON_ATTIVO.getValue().equalsIgnoreCase(statoQuestionario)
			);
	}

	public void cancellaQuestionarioTemplate(
			@NotNull(message = "id questionario template deve essere non null") final String idQuestioanarioTemplate) {
		QuestionarioTemplateCollection questionarioTemplateDaCancellare = null;

		// Verifico se esiste questionarioTemplate da cancellare
		try {
			questionarioTemplateDaCancellare = this.getQuestionarioTemplateById(idQuestioanarioTemplate);
		} catch (ResourceNotFoundException ex) {
			final String messaggioErrore = String.format("Impossibile aggiornare il questionario. Questionario con id='%s' non esiste.", idQuestioanarioTemplate);
			throw new QuestionarioTemplateException(messaggioErrore, ex);
		}

		final String statoQuestionario = questionarioTemplateDaCancellare.getStato();
		// Verifico se è possibile cancellare il questionario template in base al ciclo di vita
		if(!this.isQuestionarioTemplateCancellabileByStato(statoQuestionario)) {
			final String messaggioErrore = String.format("Impossibile cancellare il questionario con id '%s'. Stato questionario = '%s'.",
					idQuestioanarioTemplate, statoQuestionario);
			throw new QuestionarioTemplateException(messaggioErrore);
		}
		// Allineamento questionario template su mysql
		final QuestionarioTemplateEntity questionarioTemplateEntity = this.questionarioTemplateMapper.toEntityFrom(questionarioTemplateDaCancellare);
		this.questionarioTemplateSqlService.cancellaQuestionarioTemplate(questionarioTemplateEntity);

		// Cancellazione questionario template su MongoDB
		this.questionarioTemplateRepository.deleteByIdQuestionarioTemplate(idQuestioanarioTemplate);
	}

	public boolean isQuestionarioTemplateCancellabileByStato(@NotNull final String statoQuestionario) {
		return StatoEnum.NON_ATTIVO.getValue().equalsIgnoreCase(statoQuestionario);
	}

	public List<QuestionarioTemplateEntity> getQuestionariTemplateByUtente(ProfilazioneParam profilazioneParam) {
		String codiceFiscaleUtente = profilazioneParam.getCodiceFiscaleUtenteLoggato();
		String codiceRuolo = profilazioneParam.getCodiceRuoloUtenteLoggato().toString();
		// Verifico se l'utente possiede il ruolo mandato nella richiesta
		boolean hasRuoloUtente = this.ruoloService
			.getRuoliByCodiceFiscale(codiceFiscaleUtente)
			.stream()
			.anyMatch(ruolo -> codiceRuolo.equalsIgnoreCase(ruolo.getCodice()));

		if(!hasRuoloUtente) {
			final String messaggioErrore = String.format("Ruolo non definito per l'utente con codice fiscale '%s'", codiceFiscaleUtente);
			throw new QuestionarioTemplateException(messaggioErrore);
		}
		
		// Recupero i questionari in base alla profilazione dell'utente loggatosi
		// Se: utente loggato si è profilato con uno dei seguenti ruoli,
		// Allora: non mostro nessun questionario
		if( RuoliUtentiConstants.REGP.equalsIgnoreCase(codiceRuolo)
			|| RuoliUtentiConstants.DEGP.equalsIgnoreCase(codiceRuolo)
			|| RuoliUtentiConstants.REPP.equalsIgnoreCase(codiceRuolo)
			|| RuoliUtentiConstants.DEPP.equalsIgnoreCase(codiceRuolo)
			|| RuoliUtentiConstants.FACILITATORE.equalsIgnoreCase(codiceRuolo)
			|| RuoliUtentiConstants.VOLONTARIO.equalsIgnoreCase(codiceRuolo) ) {
			return new ArrayList<>();
		}

		switch(codiceRuolo) {
			case "DSCU":
				return this.questionarioTemplateSqlService.getQuestionariSCD();
			case "REG":
			case "DEG":
				return this.questionarioTemplateSqlService.getQuestionariPerReferenteDelegatoGestoreProgramma(profilazioneParam.getIdProgramma());
			default:
				return this.questionarioTemplateSqlService.getAllQuestionari();
		}
	}
}