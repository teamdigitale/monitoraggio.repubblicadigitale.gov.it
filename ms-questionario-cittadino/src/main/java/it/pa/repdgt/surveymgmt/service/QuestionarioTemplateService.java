package it.pa.repdgt.surveymgmt.service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.UUID;

import javax.transaction.Transactional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

import it.pa.repdgt.shared.annotation.LogExecutionTime;
import it.pa.repdgt.shared.annotation.LogMethod;
import it.pa.repdgt.shared.constants.RuoliUtentiConstants;
import it.pa.repdgt.shared.entity.ProgrammaXQuestionarioTemplateEntity;
import it.pa.repdgt.shared.entity.QuestionarioTemplateEntity;
import it.pa.repdgt.shared.entityenum.PolicyEnum;
import it.pa.repdgt.shared.entityenum.StatoEnum;
import it.pa.repdgt.shared.exception.CodiceErroreEnum;
import it.pa.repdgt.shared.restapi.param.SceltaProfiloParam;
import it.pa.repdgt.surveymgmt.collection.QuestionarioTemplateCollection;
import it.pa.repdgt.surveymgmt.exception.QuestionarioTemplateException;
import it.pa.repdgt.surveymgmt.exception.ResourceNotFoundException;
import it.pa.repdgt.surveymgmt.exception.ServizioException;
import it.pa.repdgt.surveymgmt.mapper.QuestionarioTemplateMapper;
import it.pa.repdgt.surveymgmt.mongo.repository.QuestionarioTemplateRepository;
import it.pa.repdgt.surveymgmt.param.FiltroListaQuestionariTemplateParam;
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
	private ProgrammaXQuestionarioTemplateService programmaXQuestionarioTemplateService;
	@Autowired
	private QuestionarioTemplateRepository questionarioTemplateRepository;
	@Autowired
	private ProgrammaService programmaService;

	@LogMethod
	@LogExecutionTime
	public Long getNumeroTotaleQuestionariTemplateByFiltro(String criterioRicerca, 
			String statoQuestionario,
			@NotNull @Valid final SceltaProfiloParam profilazione) {
		String codiceRuoloUtenteLoggato = profilazione.getCodiceRuoloUtenteLoggato().toString();
		if( RuoliUtentiConstants.REGP.equalsIgnoreCase(codiceRuoloUtenteLoggato)
				|| RuoliUtentiConstants.DEGP.equalsIgnoreCase(codiceRuoloUtenteLoggato)
				|| RuoliUtentiConstants.REPP.equalsIgnoreCase(codiceRuoloUtenteLoggato)
				|| RuoliUtentiConstants.DEPP.equalsIgnoreCase(codiceRuoloUtenteLoggato)
				|| RuoliUtentiConstants.FACILITATORE.equalsIgnoreCase(codiceRuoloUtenteLoggato)
				|| RuoliUtentiConstants.VOLONTARIO.equalsIgnoreCase(codiceRuoloUtenteLoggato) ) 
				return 0L;
		else if(RuoliUtentiConstants.REG.equalsIgnoreCase(codiceRuoloUtenteLoggato)
				|| RuoliUtentiConstants.DEG.equalsIgnoreCase(codiceRuoloUtenteLoggato)
				|| RuoliUtentiConstants.DSCU.equalsIgnoreCase(codiceRuoloUtenteLoggato))
			return 1L;
		return this.questionarioTemplateSqlService.getNumeroTotaleQuestionariTemplateByFiltro(criterioRicerca, statoQuestionario);
	}

	@LogMethod
	@LogExecutionTime
	public List<QuestionarioTemplateEntity> getAllQuestionariTemplatePaginatiByProfilazioneAndFiltro(
			@NotNull @Valid final SceltaProfiloParam profilazione,
			@NotNull @Valid final FiltroListaQuestionariTemplateParam filtroListaQuestionariTemplate) {
		log.info("getAllQuestionariTemplatePaginatiByProfilazioneAndFiltro - START");

		// Recupero tutti i QuestionariTemplate in base al ruolo profilato dell'utente loggato e in base ai filtri selezionati
		return this.getAllQuestionariTemplateByProfilazioneAndFiltroConPaginazione(profilazione, filtroListaQuestionariTemplate);
		
	}

	@LogMethod
	@LogExecutionTime
	public List<QuestionarioTemplateEntity> getAllQuestionariTemplateByProfilazioneAndFiltroConPaginazione(
			@NotNull @Valid final SceltaProfiloParam profilazione,
			@NotNull @Valid final FiltroListaQuestionariTemplateParam filtroListaQuestionariTemplate) {
		final String codiceRuoloUtenteLoggato = profilazione.getCodiceRuoloUtenteLoggato().toString();

		// Recupero i questionari in base alla profilazione dell'utente loggatosi
				// Se: utente loggato si è profilato con uno dei seguenti ruoli,
				// Allora: non mostro nessun questionario
				if( RuoliUtentiConstants.REGP.equalsIgnoreCase(codiceRuoloUtenteLoggato)
					|| RuoliUtentiConstants.DEGP.equalsIgnoreCase(codiceRuoloUtenteLoggato)
					|| RuoliUtentiConstants.REPP.equalsIgnoreCase(codiceRuoloUtenteLoggato)
					|| RuoliUtentiConstants.DEPP.equalsIgnoreCase(codiceRuoloUtenteLoggato)
					|| RuoliUtentiConstants.FACILITATORE.equalsIgnoreCase(codiceRuoloUtenteLoggato)
					|| RuoliUtentiConstants.VOLONTARIO.equalsIgnoreCase(codiceRuoloUtenteLoggato) ) {
					return new ArrayList<QuestionarioTemplateEntity>(Collections.emptyList());
				}

				String criterioRicercaFiltro = null;
				if(filtroListaQuestionariTemplate.getCriterioRicerca() != null) {
					criterioRicercaFiltro = "%".concat(filtroListaQuestionariTemplate.getCriterioRicerca()).concat("%");
				}

				String statoQuestionarioFiltro = null;
				if(filtroListaQuestionariTemplate.getStatoQuestionario() != null) {
					statoQuestionarioFiltro = filtroListaQuestionariTemplate.getStatoQuestionario();
				}

				switch (codiceRuoloUtenteLoggato) {
					case RuoliUtentiConstants.DSCU:
						return this.questionarioTemplateSqlService.findQuestionariTemplatePaginatiByDefaultPolicySCDAndFiltro(
								criterioRicercaFiltro,
								statoQuestionarioFiltro,
								filtroListaQuestionariTemplate.getCurrPage(),
								filtroListaQuestionariTemplate.getPageSize()
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
								filtroListaQuestionariTemplate.getCurrPage(),
								filtroListaQuestionariTemplate.getPageSize()
							);
					default:
						// Se: l'utente loggato si è profilato con ruolo di DTD/ruolo custom
						// Allora: Recupero tutti i questionari template da mostrare nella lista dei questionari template del FE
						return this.questionarioTemplateSqlService.findAllQuestionariTemplatePaginatiByFiltro(
								criterioRicercaFiltro,
								statoQuestionarioFiltro,
								filtroListaQuestionariTemplate.getCurrPage(),
								filtroListaQuestionariTemplate.getPageSize()
							);
				}
	}
	
	@LogMethod
	@LogExecutionTime
	public List<QuestionarioTemplateEntity> getAllQuestionariTemplateByProfilazioneAndFiltroSenzaPaginazione(
			@NotNull @Valid final SceltaProfiloParam profilazione,
			@NotNull @Valid final FiltroListaQuestionariTemplateParam filtroListaQuestionariTemplate) {
		final String codiceRuoloUtenteLoggato = profilazione.getCodiceRuoloUtenteLoggato().toString();
		
		// Recupero i questionari in base alla profilazione dell'utente loggatosi
				// Se: utente loggato si è profilato con uno dei seguenti ruoli,
				// Allora: non mostro nessun questionario
				if( RuoliUtentiConstants.REGP.equalsIgnoreCase(codiceRuoloUtenteLoggato)
					|| RuoliUtentiConstants.DEGP.equalsIgnoreCase(codiceRuoloUtenteLoggato)
					|| RuoliUtentiConstants.REPP.equalsIgnoreCase(codiceRuoloUtenteLoggato)
					|| RuoliUtentiConstants.DEPP.equalsIgnoreCase(codiceRuoloUtenteLoggato)
					|| RuoliUtentiConstants.FACILITATORE.equalsIgnoreCase(codiceRuoloUtenteLoggato)
					|| RuoliUtentiConstants.VOLONTARIO.equalsIgnoreCase(codiceRuoloUtenteLoggato) ) {
					return new ArrayList<QuestionarioTemplateEntity>(Collections.emptyList());
				}

				String criterioRicercaFiltro = null;
				if(filtroListaQuestionariTemplate.getCriterioRicerca() != null) {
					criterioRicercaFiltro = "%".concat(filtroListaQuestionariTemplate.getCriterioRicerca()).concat("%");
				}
				
				String statoQuestionarioFiltro = null;
				if(filtroListaQuestionariTemplate.getStatoQuestionario() != null) {
					statoQuestionarioFiltro = filtroListaQuestionariTemplate.getStatoQuestionario();
				}

				switch (codiceRuoloUtenteLoggato) {
					case RuoliUtentiConstants.DSCU:
						return this.questionarioTemplateSqlService.findQuestionariTemplateByDefaultPolicySCDAndFiltro(
								criterioRicercaFiltro, 
								statoQuestionarioFiltro
							);
					case RuoliUtentiConstants.REG:
					case RuoliUtentiConstants.DEG:
						// Se: l'utente loggato si è profilato con ruolo che diverso da DTD/DSCU (ovvero dropdown scelta profilo ha scelto ruolo REG/DEG/REGP/DEGP/ ...),
						// Allora: Recupero l'unico questionario associato al programma scelto 
						// dall'utente durante la profilazione (ovvero dropdown scelta profilo)
						return this.questionarioTemplateSqlService.findQuestionariTemplateByIdProgrammaAndFiltro(
								profilazione.getIdProgramma(),
								criterioRicercaFiltro, 
								statoQuestionarioFiltro
							);
					default:
						// Se: l'utente loggato si è profilato con ruolo di DTD/ruolo custom
						// Allora: Recupero tutti i questionari template da mostrare nella lista dei questionari template del FE
						return this.questionarioTemplateSqlService.findAllQuestionariTemplateByFiltro(
								criterioRicercaFiltro,
								statoQuestionarioFiltro
							);
				}
	}
	
	@LogMethod
	@LogExecutionTime
	public List<String> getAllStatiDropdownByProfilazioneAndFiltro(
			@NotNull @Valid final SceltaProfiloParam profilazione,
			@NotNull @Valid final FiltroListaQuestionariTemplateParam filtroListaQuestionariTemplate) {
		log.info("getAllStatiDropdownByProfilazioneAndFiltro - START");
		final String codiceRuoloUtenteLoggato = profilazione.getCodiceRuoloUtenteLoggato().toString();

		// Recupero i questionari in base alla profilazione dell'utente loggatosi
		// Se: utente loggato si è profilato con uno dei seguenti ruoli,
		// Allora: non mostro nessun questionario
		if( RuoliUtentiConstants.REGP.equalsIgnoreCase(codiceRuoloUtenteLoggato)
			|| RuoliUtentiConstants.DEGP.equalsIgnoreCase(codiceRuoloUtenteLoggato)
			|| RuoliUtentiConstants.REPP.equalsIgnoreCase(codiceRuoloUtenteLoggato)
			|| RuoliUtentiConstants.DEPP.equalsIgnoreCase(codiceRuoloUtenteLoggato)
			|| RuoliUtentiConstants.FACILITATORE.equalsIgnoreCase(codiceRuoloUtenteLoggato)
			|| RuoliUtentiConstants.VOLONTARIO.equalsIgnoreCase(codiceRuoloUtenteLoggato) ) {
			return new ArrayList<String>(Collections.emptyList());
		}

		String criterioRicercaFiltro = null;
		if(filtroListaQuestionariTemplate.getCriterioRicerca() != null) {
			criterioRicercaFiltro = "%".concat(filtroListaQuestionariTemplate.getCriterioRicerca()).concat("%");
		}
		
		String statoQuestionarioFiltro = null;
		if(filtroListaQuestionariTemplate.getStatoQuestionario() != null) {
			statoQuestionarioFiltro = filtroListaQuestionariTemplate.getStatoQuestionario();
		}

		switch (codiceRuoloUtenteLoggato) {
			case RuoliUtentiConstants.DSCU:
				return this.questionarioTemplateSqlService.findStatiDropdownByDefaultPolicySCDAndFiltro(
						criterioRicercaFiltro, 
						statoQuestionarioFiltro
					);
			case RuoliUtentiConstants.REG:
			case RuoliUtentiConstants.DEG:
				// Se: l'utente loggato si è profilato con ruolo che diverso da DTD/DSCU (ovvero dropdown scelta profilo ha scelto ruolo REG/DEG/REGP/DEGP/ ...),
				// Allora: Recupero l'unico questionario associato al programma scelto 
				// dall'utente durante la profilazione (ovvero dropdown scelta profilo)
				return this.questionarioTemplateSqlService.findStatiDropdownByIdProgrammaAndFiltro(
						profilazione.getIdProgramma(),
						criterioRicercaFiltro, 
						statoQuestionarioFiltro
					);
			default:
				// Se: l'utente loggato si è profilato con ruolo di DTD/ruolo custom
				// Allora: Recupero tutti i questionari template da mostrare nella lista dei questionari template del FE
				return this.questionarioTemplateSqlService.findAllStatiDropdownByFiltro(
						criterioRicercaFiltro,
						statoQuestionarioFiltro
					);
		}
	}

	@LogMethod
	@LogExecutionTime
	public QuestionarioTemplateCollection getQuestionarioTemplateById(@NotNull String idQuestionarioTemplate) {
		
		final String messaggioErrore = String.format("templateQuestionario con id=%s non presente.", idQuestionarioTemplate);
		return this.questionarioTemplateRepository.findTemplateQuestionarioById(idQuestionarioTemplate)
				.orElseThrow(() -> new ResourceNotFoundException(messaggioErrore, CodiceErroreEnum.C01));
	}
	
	public boolean isAutorizzatoForGetQuestionarioTemplateById(
			@NotNull String idQuestionarioTemplate,
			SceltaProfiloParam profilazioneParam) {
		switch(profilazioneParam.getCodiceRuoloUtenteLoggato()) {
			case RuoliUtentiConstants.REG: 
			case RuoliUtentiConstants.DEG: 
			case RuoliUtentiConstants.REGP: 
			case RuoliUtentiConstants.DEGP:
			case RuoliUtentiConstants.REPP: 
			case RuoliUtentiConstants.DEPP: 
			case RuoliUtentiConstants.FACILITATORE: 
			case RuoliUtentiConstants.VOLONTARIO: 
				return this.questionarioTemplateSqlService.isQuestionarioAssociatoAProfilo(idQuestionarioTemplate, profilazioneParam.getIdProgramma()) > 0 ;
			case RuoliUtentiConstants.DSCU:
				return this.questionarioTemplateSqlService.isQuestionarioAssociatoADSCU(idQuestionarioTemplate) > 0;
			default: return true;
		}
	}

	@LogMethod
	@LogExecutionTime
	public QuestionarioTemplateCollection saveQuestionarioTemplate(QuestionarioTemplateCollection questionarioDaSalvare) {
		return this.questionarioTemplateRepository.save(questionarioDaSalvare);
	}

	@LogMethod
	@LogExecutionTime
	@Transactional(rollbackOn = Exception.class)
	public QuestionarioTemplateCollection creaNuovoQuestionarioTemplate(
			@NotNull(message = "Questionario da creare deve essere non null") 
			@Valid final QuestionarioTemplateCollection questionarioTemplateCollection) {
		final String nomeQuestionarioTemplate = questionarioTemplateCollection.getNomeQuestionarioTemplate();
		if(questionarioTemplateSqlService.getQuestionarioTemplateByNome(nomeQuestionarioTemplate).isPresent()) {
			String errorMessage = String.format("Impossibile aggiornare il questionario. Questionario con nome = %s già presente", nomeQuestionarioTemplate);
			throw new QuestionarioTemplateException(errorMessage, CodiceErroreEnum.QT02);
		}
		final String idQuestionarioTemplateDaCreare = UUID.randomUUID().toString();
		questionarioTemplateCollection.setIdQuestionarioTemplate(idQuestionarioTemplateDaCreare);
		questionarioTemplateCollection.setStato(StatoEnum.NON_ATTIVO.getValue());
		questionarioTemplateCollection.setDataOraCreazione(new Date());	
		questionarioTemplateCollection.setDataOraUltimoAggiornamento(questionarioTemplateCollection.getDataOraCreazione());
		questionarioTemplateCollection.setDefaultRFD(Boolean.FALSE);
		questionarioTemplateCollection.setDefaultSCD(Boolean.FALSE);
		
		// Allineamento questionario template su mysql
		final QuestionarioTemplateEntity questionarioTemplateEntity = this.questionarioTemplateMapper.toEntityFrom(questionarioTemplateCollection);
		this.questionarioTemplateSqlService.salvaQuestionarioTemplate(questionarioTemplateEntity);
		
		// salvo questionario template su MongoDb
		return this.questionarioTemplateRepository.save(questionarioTemplateCollection);
	}

	@LogMethod
	@LogExecutionTime
	@Transactional(rollbackOn = Exception.class)
	public QuestionarioTemplateCollection aggiornaQuestionarioTemplate(
			@NotNull(message = "id questionario template deve essere non null") String idQuestionarioTemplate,
			@NotNull @Valid final QuestionarioTemplateCollection questionarioTemplateDaAggiornare) {
		QuestionarioTemplateCollection questionarioTemplateCollectionFetchDB = null;

		// Verifico se esiste questionarioTemplate da aggiornare
		try {
			questionarioTemplateCollectionFetchDB = this.getQuestionarioTemplateById(idQuestionarioTemplate);
		} catch (ResourceNotFoundException ex) {
			final String messaggioErrore = String.format("Impossibile aggiornare il questionario. Questionario con id='%s' non esiste.", idQuestionarioTemplate);
			throw new QuestionarioTemplateException(messaggioErrore, ex, CodiceErroreEnum.QT02);
		}
		
		QuestionarioTemplateEntity questionarioTemplateEntity = null;

		// Verifico se esiste questionarioTemplate da aggiornare
		try {
			questionarioTemplateEntity = this.questionarioTemplateSqlService.getQuestionarioTemplateById(idQuestionarioTemplate);
		} catch (ResourceNotFoundException ex) {
			final String messaggioErrore = String.format("Impossibile recuperare il questionario template con id='%s' poichè inesistente su MySql", idQuestionarioTemplate);
			throw new QuestionarioTemplateException(messaggioErrore, ex, CodiceErroreEnum.QT05);
		}
		
		// Verifico se è possibile aggiornare il questionario template in base al ciclo di vita
		final String statoQuestionario = questionarioTemplateCollectionFetchDB.getStato();
		if(!this.isQuestionarioTemplateModificabileByStato(statoQuestionario)) {
			final String messaggioErrore = String.format("Impossibile aggiornare il questionario con id '%s'. Stato questionario = '%s'.",
					idQuestionarioTemplate, statoQuestionario);
			throw new QuestionarioTemplateException(messaggioErrore, CodiceErroreEnum.QT02);
		}
		
		//verifico se esiste un altro questionario con id diverso ma con lo stesso nome
		final String nomeQuestionarioTemplate = questionarioTemplateDaAggiornare.getNomeQuestionarioTemplate();
		if(questionarioTemplateSqlService.getQuestionarioTemplateByNomeAndIdDiverso(nomeQuestionarioTemplate, idQuestionarioTemplate).isPresent()) {
			String errorMessage = String.format("Impossibile aggiornare il questionario. Questionario con nome = %s già presente", nomeQuestionarioTemplate);
			throw new QuestionarioTemplateException(errorMessage, CodiceErroreEnum.QT02);
		}
		
		questionarioTemplateCollectionFetchDB.setNomeQuestionarioTemplate(questionarioTemplateDaAggiornare.getNomeQuestionarioTemplate());
		questionarioTemplateCollectionFetchDB.setDescrizioneQuestionarioTemplate(questionarioTemplateDaAggiornare.getDescrizioneQuestionarioTemplate());
		questionarioTemplateCollectionFetchDB.setSezioniQuestionarioTemplate(questionarioTemplateDaAggiornare.getSezioniQuestionarioTemplate());
		questionarioTemplateCollectionFetchDB.setDataOraUltimoAggiornamento(new Date());

		// Allineamento questionario template su mysql
		questionarioTemplateEntity.setNome(questionarioTemplateCollectionFetchDB.getNomeQuestionarioTemplate());
		questionarioTemplateEntity.setDescrizione(questionarioTemplateCollectionFetchDB.getDescrizioneQuestionarioTemplate());
		questionarioTemplateEntity.setDataOraAggiornamento(new Date());

		this.questionarioTemplateSqlService.aggiornaQuestionarioTemplate(questionarioTemplateEntity);

		return this.questionarioTemplateRepository.save(questionarioTemplateCollectionFetchDB);
	}

	@LogMethod
	@LogExecutionTime
	public boolean isQuestionarioTemplateModificabileByStato(@NotNull final String statoQuestionario) {
		return (
					StatoEnum.ATTIVO.getValue().equalsIgnoreCase(statoQuestionario)
				 ||	StatoEnum.NON_ATTIVO.getValue().equalsIgnoreCase(statoQuestionario)
			);
	}

	@LogMethod
	@LogExecutionTime
	@Transactional(rollbackOn = Exception.class)
	public void cancellaQuestionarioTemplate(@NotNull(message = "id questionario template deve essere non null") final String idQuestioanarioTemplate) {
		QuestionarioTemplateCollection questionarioTemplateMongoDaCancellare = null;
		QuestionarioTemplateEntity questionarioTemplateMysqlDaCancellare = null;

		// Verifico se esiste contemporanemaente record questionarioTemplate da cancellare :
		// -> su MongoDB 
		// -> su MySql
		// In caso negativo in almeno uno dei due db, lancio eccezione
		String messaggioErrore = null;
		try {
			questionarioTemplateMongoDaCancellare = this.getQuestionarioTemplateById(idQuestioanarioTemplate);
			questionarioTemplateMysqlDaCancellare = this.questionarioTemplateSqlService.getQuestionarioTemplateById(idQuestioanarioTemplate);
		} catch (ResourceNotFoundException ex) {
			messaggioErrore = String.format("Impossibile cancellare il questionario. Questionario con id='%s' non esiste.", idQuestioanarioTemplate);
			throw new QuestionarioTemplateException(messaggioErrore, ex, CodiceErroreEnum.QT03);
		}

		// Verifico se è possibile cancellare il questionario template
		// e in caso negativo lancio eccezione
		if(!this.isQuestionarioTemplateCancellabile(questionarioTemplateMysqlDaCancellare)) {
			messaggioErrore = String.format("Impossibile cancellare il questionario con id '%s'. "
					+ "Stato del questionario diverso da 'NON ATTIVO' oppure è un questionario di default per policy RFD o SCD", idQuestioanarioTemplate);
			throw new QuestionarioTemplateException(messaggioErrore, CodiceErroreEnum.QT03);
		}
		
		// 1. Cancellazione record di associazioni programmma_x_questioanario_template (id_programma, id_questionario_template)
		this.programmaXQuestionarioTemplateService.deleteByQuestionarioTemplate(idQuestioanarioTemplate);
		// 2. Cancellazione del questionario template su mysql
		this.questionarioTemplateSqlService.cancellaQuestionarioTemplate(idQuestioanarioTemplate);
		// 3. Cancellazione del questionario template su MongoDB
		this.questionarioTemplateRepository.deleteByIdQuestionarioTemplate(idQuestioanarioTemplate);
	}

	@LogMethod
	@LogExecutionTime
	public boolean isQuestionarioTemplateCancellabile(@NotNull final QuestionarioTemplateEntity questionarioTemplate) {
		return ( 
				     StatoEnum.NON_ATTIVO.getValue().equalsIgnoreCase(questionarioTemplate.getStato())
				  && questionarioTemplate.getDefaultRFD() == Boolean.FALSE
				  && questionarioTemplate.getDefaultSCD() == Boolean.FALSE
				);
	}

	@LogMethod
	@LogExecutionTime
	public List<QuestionarioTemplateEntity> getQuestionariTemplateByUtente(SceltaProfiloParam profilazioneParam) {
		String codiceRuolo = profilazioneParam.getCodiceRuoloUtenteLoggato().toString();

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
			case RuoliUtentiConstants.DSCU:
				return this.questionarioTemplateSqlService.getQuestionariSCD();
			case RuoliUtentiConstants.REG:
			case RuoliUtentiConstants.DEG:
				return this.questionarioTemplateSqlService.getQuestionariPerReferenteDelegatoGestoreProgramma(profilazioneParam.getIdProgramma());
			default:
				//lista questionari per DTD e ruoli non predefiniti
				return this.questionarioTemplateSqlService.getAllQuestionari();
		}
	}
	
	@LogMethod
	@LogExecutionTime
	@Transactional(rollbackOn = Exception.class)
	public void aggiornaDefaultQuestionarioTemplate(String idQuestionario, String tipoDefault) {
		QuestionarioTemplateEntity questionarioTemplate = this.questionarioTemplateSqlService.getQuestionarioTemplateById(idQuestionario);
		Optional<QuestionarioTemplateEntity> questionarioDaAggiornare;
		//se viene modificato il default_rfd del questionario
		if(PolicyEnum.RFD.toString().equalsIgnoreCase(tipoDefault)) {
			questionarioDaAggiornare = this.questionarioTemplateSqlService.getQuestionarioTemplateDefaultRFD();
			if(questionarioDaAggiornare.isPresent()) {
				updateDefaultQuestionarioCollection(questionarioDaAggiornare.get().getId(), PolicyEnum.RFD.toString(), false);
				questionarioDaAggiornare.get().setDefaultRFD(false);
				this.questionarioTemplateSqlService.salvaQuestionario(questionarioDaAggiornare.get());
			}
			updateDefaultQuestionarioCollection(questionarioTemplate.getId(), PolicyEnum.RFD.toString(), true);
			questionarioTemplate.setDefaultRFD(true);
			this.questionarioTemplateSqlService.salvaQuestionario(questionarioTemplate);
		}
		//se viene modificato il default_scd del questionario
		if(PolicyEnum.SCD.toString().equalsIgnoreCase(tipoDefault)) {
			questionarioDaAggiornare = this.questionarioTemplateSqlService.getQuestionarioTemplateDefaultSCD();
			if(questionarioDaAggiornare.isPresent()) {
				updateDefaultQuestionarioCollection(questionarioDaAggiornare.get().getId(), PolicyEnum.SCD.toString(), false);
				questionarioDaAggiornare.get().setDefaultSCD(false);
				this.questionarioTemplateSqlService.salvaQuestionario(questionarioDaAggiornare.get());
			}
			updateDefaultQuestionarioCollection(questionarioTemplate.getId(), PolicyEnum.SCD.toString(), true);
			questionarioTemplate.setDefaultSCD(true);
			this.questionarioTemplateSqlService.salvaQuestionario(questionarioTemplate);
		}
	}
	
	private void updateDefaultQuestionarioCollection(String idQuestionrioTempl, String tipoDefault, Boolean flag) {
		if(PolicyEnum.RFD.toString().equalsIgnoreCase(tipoDefault)) {
			final QuestionarioTemplateCollection questionarioTemplDaAggiornare = this.getQuestionarioTemplateById(idQuestionrioTempl);
			questionarioTemplDaAggiornare.setDefaultRFD(flag);
			this.saveQuestionarioTemplate(questionarioTemplDaAggiornare);
		}
		if(PolicyEnum.SCD.toString().equalsIgnoreCase(tipoDefault)) {
			final QuestionarioTemplateCollection questionarioTemplDaAggiornare = this.getQuestionarioTemplateById(idQuestionrioTempl);
			questionarioTemplDaAggiornare.setDefaultSCD(flag);
			this.saveQuestionarioTemplate(questionarioTemplDaAggiornare);
		}
	}

	@LogMethod
	@LogExecutionTime
	public QuestionarioTemplateCollection getQuestionarioTemplateByIdProgramma(Long idProgramma) {
		// verifico se esiste il programma
		String errorMessage = String.format("Programma con id='%s' non esiste", idProgramma);
		try {
			this.programmaService.getProgrammaById(idProgramma);
		} catch (NoSuchElementException ex) {
			throw new QuestionarioTemplateException(errorMessage, ex, CodiceErroreEnum.Q01);
		}

		List<ProgrammaXQuestionarioTemplateEntity> programmaTemplateList = this.programmaXQuestionarioTemplateService.getByIdProgramma(idProgramma);
		if(programmaTemplateList.isEmpty()) {
			errorMessage = String.format("Programma con id='%s' deve avere associato un questionarioTemplate", idProgramma);
			throw new QuestionarioTemplateException(errorMessage, CodiceErroreEnum.QT06);
		}

		// Recupero il primo soltanto perchè attualmente da specifiche si prevede che il programma abbia associato
		// un solo questionarioTemplate
		ProgrammaXQuestionarioTemplateEntity programmaTemplate = programmaTemplateList.get(0);
		String idQuestionairioTemplateAssociatoAlProgramma = programmaTemplate.getProgrammaXQuestionarioTemplateKey().getIdQuestionarioTemplate();

		// verifico se il questionarioTemplate associato al programma è presente su Mysql
		try {
			this.questionarioTemplateSqlService.getQuestionarioTemplateById(idQuestionairioTemplateAssociatoAlProgramma);
		} catch (ResourceNotFoundException ex) {
			errorMessage = String.format("QuestionarioTemplate con id=%s non presente in MySql", idQuestionairioTemplateAssociatoAlProgramma);
			throw new ServizioException(errorMessage, ex, CodiceErroreEnum.QT05);
		}

		// verifico se il questionarioTemplate associato al programma è presente su MongoDb
		QuestionarioTemplateCollection questionarioTemplateAssociatoAlProgramma = null;
		try {
			questionarioTemplateAssociatoAlProgramma = this.getQuestionarioTemplateById(idQuestionairioTemplateAssociatoAlProgramma);
		} catch (ResourceNotFoundException ex) {
			errorMessage = String.format("QuestionarioTemplate con id=%s non presente in MongoDB", idQuestionairioTemplateAssociatoAlProgramma);
			throw new ServizioException(errorMessage, ex, CodiceErroreEnum.QT04);
		}

		return questionarioTemplateAssociatoAlProgramma;
	}

	public boolean isAutorizzatoForProgramma(SceltaProfiloParam sceltaProfiloParam, Long idProgramma) {
		switch (sceltaProfiloParam.getCodiceRuoloUtenteLoggato()) {
		case "DSCU":
			if(programmaService.getProgrammaById(idProgramma).getPolicy().equals(PolicyEnum.SCD))
				return true;
			 break;
		case "REG":
		case "DEG":
		case "REGP":
		case "DEGP":
		case "REPP":
		case "DEPP":
		case "FAC":
		case "VOL":
			if(sceltaProfiloParam.getIdProgramma().equals(idProgramma))
				return true;
			break;
		default:
			return true;
		}
		return false;
	}
}