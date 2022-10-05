package it.pa.repdgt.surveymgmt.service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

import javax.validation.constraints.NotNull;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.annotation.Validated;

import it.pa.repdgt.shared.annotation.LogExecutionTime;
import it.pa.repdgt.shared.annotation.LogMethod;
import it.pa.repdgt.shared.entity.ProgrammaEntity;
import it.pa.repdgt.shared.entity.QuestionarioTemplateEntity;
import it.pa.repdgt.shared.entityenum.PolicyEnum;
import it.pa.repdgt.shared.exception.CodiceErroreEnum;
import it.pa.repdgt.surveymgmt.collection.QuestionarioTemplateCollection;
import it.pa.repdgt.surveymgmt.exception.QuestionarioTemplateException;
import it.pa.repdgt.surveymgmt.exception.ResourceNotFoundException;
import it.pa.repdgt.surveymgmt.repository.QuestionarioTemplateSqlRepository;

@Service
@Validated
public class QuestionarioTemplateSqlService {
	@Autowired
	private ProgrammaService programmaService;
	@Autowired
	private QuestionarioTemplateSqlRepository templateQuestionarioSqlRepository;
	
	@LogMethod
	@LogExecutionTime
	public Long getNumeroTotaleQuestionariTemplateByFiltro(String criterioRicerca, String statoQuestionario) {
		return this.templateQuestionarioSqlRepository.countQuestionarioTemplateByFiltro(criterioRicerca, statoQuestionario);
	}
	
	@LogMethod
	@LogExecutionTime
	public List<QuestionarioTemplateEntity> getQuestionariTemplateByIdProgetto(
			@NotNull final Long idProgetto) {
		return this.templateQuestionarioSqlRepository.findQuestionarioTemplateByIdProgetto(idProgetto);
	}
	
	@LogMethod
	@LogExecutionTime
	@Transactional(rollbackFor = Exception.class)
	public QuestionarioTemplateEntity salvaQuestionarioTemplate(
			@NotNull final QuestionarioTemplateEntity questionarioTemplateEntity) {
		// Verifico se esiste già il Questioanario template
		final String idQuestionarioTemplate = questionarioTemplateEntity.getId();
		if(this.templateQuestionarioSqlRepository.existsById(idQuestionarioTemplate)) {
			final String messaggioErrore = String.format("Impossibile salvare il questionario. Questionario con id='%s' già presente", idQuestionarioTemplate);
			throw new QuestionarioTemplateException(messaggioErrore, CodiceErroreEnum.QT07);
		}
		questionarioTemplateEntity.setDataOraCreazione(new Date());
		return this.templateQuestionarioSqlRepository.save(questionarioTemplateEntity);
	}

	@LogMethod
	@LogExecutionTime
	@Transactional(rollbackFor = Exception.class)
	public QuestionarioTemplateEntity aggiornaQuestionarioTemplate(
			@NotNull final QuestionarioTemplateEntity questionarioTemplateEntity) {
		final String idQuestionarioTemplate = questionarioTemplateEntity.getId();
		final Optional<QuestionarioTemplateEntity> questionarioDBFetch = this.templateQuestionarioSqlRepository.findById(idQuestionarioTemplate);

		//  Verifico se esiste il questionarioTemplate
		if(!questionarioDBFetch.isPresent()) {
			final String messaggioErrore = String.format("Impossibile aggiornare il questionario. Questionario con id='%s' non presente", idQuestionarioTemplate);
			throw new QuestionarioTemplateException(messaggioErrore, CodiceErroreEnum.QT02);
		}
		
		questionarioTemplateEntity.setDataOraAggiornamento(new Date());
		return this.templateQuestionarioSqlRepository.save(questionarioTemplateEntity);
	}
	
	@LogMethod
	@LogExecutionTime
	public List<QuestionarioTemplateEntity> findAllQuestionariTemplatePaginatiByFiltro(
			final String criterioRicerca,
			final String statoQuestionario,
			@NotNull final Integer currPage,
			@NotNull final Integer pageSize) {
		return this.templateQuestionarioSqlRepository.findAllByFiltro(
				criterioRicerca, 
				statoQuestionario,
				currPage*pageSize,
				pageSize
			);
	}
	
	@LogMethod
	@LogExecutionTime
	public List<QuestionarioTemplateEntity> findAllQuestionariTemplateByFiltro(
			final String criterioRicerca,
			final String statoQuestionario) {
		return this.templateQuestionarioSqlRepository.findAllByFiltro(
				criterioRicerca, 
				statoQuestionario
			);
	}
	
	@LogMethod
	@LogExecutionTime
	public List<String> findAllStatiDropdownByFiltro(
			final String criterioRicerca,
			final String statoQuestionario) {
		return this.templateQuestionarioSqlRepository.findAllStatiDropdownByFiltro(criterioRicerca, statoQuestionario);
	}

	@LogMethod
	@LogExecutionTime
	public List<QuestionarioTemplateEntity> findQuestionariTemplatePaginatiByIdProgrammaAndFiltro(
			@NotNull final Long idProgramma,
			final String criterioRicerca, 
			final String statoQuestionario,
			@NotNull final Integer currPage,
			@NotNull final Integer pageSize) {
		return this.templateQuestionarioSqlRepository.findQuestionariTemplateByIdProgrammaAndFiltro(
				idProgramma, 
				criterioRicerca, 
				statoQuestionario,
				currPage*pageSize,
				pageSize
			);
	}
	
	@LogMethod
	@LogExecutionTime
	public List<QuestionarioTemplateEntity> findQuestionariTemplateByIdProgrammaAndFiltro(
			@NotNull final Long idProgramma,
			final String criterioRicerca, 
			final String statoQuestionario ) {
		return this.templateQuestionarioSqlRepository.findQuestionariTemplateByIdProgrammaAndFiltro(
				idProgramma, 
				criterioRicerca,
				statoQuestionario
			);
	}
	
	@LogMethod
	@LogExecutionTime
	public List<String> findStatiDropdownByIdProgrammaAndFiltro(
			@NotNull final Long idProgramma,
			final String criterioRicerca, 
			final String statoQuestionario) {
		return this.templateQuestionarioSqlRepository.findStatiDropdownByIdProgrammaAndFiltro(idProgramma, criterioRicerca, statoQuestionario);
	}

	@LogMethod
	@LogExecutionTime
	public List<QuestionarioTemplateEntity> getAllQuestionari() {
		return this.templateQuestionarioSqlRepository.findAll();
	}

	@LogMethod
	@LogExecutionTime
	public List<QuestionarioTemplateEntity> getQuestionariSCD() {
		return this.templateQuestionarioSqlRepository.findQuestionariSCD();
	}

	@LogMethod
	@LogExecutionTime
	public List<QuestionarioTemplateEntity> getQuestionariPerReferenteDelegatoGestoreProgramma(Long idProgramma) {
		ProgrammaEntity programma = this.programmaService.getProgrammaById(idProgramma);
		PolicyEnum policy = programma.getPolicy();

		if(policy.equals(PolicyEnum.RFD)) {
			return this.templateQuestionarioSqlRepository.findQuestionariRFD();
		}
		return this.templateQuestionarioSqlRepository.findQuestionariSCD();
	}

	@LogMethod
	@LogExecutionTime
	public List<QuestionarioTemplateEntity> findQuestionariTemplatePaginatiByDefaultPolicySCDAndFiltro(
			String criterioRicerca,
			String statoQuestionario,
			@NotNull Integer currPage,
			@NotNull Integer pageSize) {
		return this.templateQuestionarioSqlRepository.findQuestionariTemplateByDefaultPolicySCDAndFiltro(
				criterioRicerca, 
				statoQuestionario,
				currPage*pageSize,
				pageSize
			);
	}
	
	@LogMethod
	@LogExecutionTime
	public List<QuestionarioTemplateEntity> findQuestionariTemplateByDefaultPolicySCDAndFiltro(
			String criterioRicerca,
			String statoQuestionario ) {
		return this.templateQuestionarioSqlRepository.findQuestionariTemplateByDefaultPolicySCDAndFiltro(
				criterioRicerca, 
				statoQuestionario
			);
	}
	
	@LogMethod
	@LogExecutionTime
	public List<String> findStatiDropdownByDefaultPolicySCDAndFiltro(
			String criterioRicerca,
			String statoQuestionario) {
		return this.templateQuestionarioSqlRepository.findStatiDropdownByDefaultPolicySCDAndFiltro(criterioRicerca, statoQuestionario);
	}
	
	@LogMethod
	@LogExecutionTime
	@Transactional(rollbackFor = Exception.class)
	public void cancellaQuestionarioTemplate(
			@NotNull final String questionarioTemplateId) {
		this.templateQuestionarioSqlRepository.deleteById(questionarioTemplateId);
	}

	@LogMethod
	@LogExecutionTime
	public Optional<QuestionarioTemplateEntity> getQuestionarioTemplateDefaultRFD() {
		return this.templateQuestionarioSqlRepository.findQuestionarioTemplateDefaultRFD();
	}

	@LogMethod
	@LogExecutionTime
	public Optional<QuestionarioTemplateEntity> getQuestionarioTemplateDefaultSCD() {
		return this.templateQuestionarioSqlRepository.findQuestionarioTemplateDefaultSCD();
	}

	@LogMethod
	@LogExecutionTime
	public void salvaQuestionario(QuestionarioTemplateEntity questionarioTemplateEntity) {
		this.templateQuestionarioSqlRepository.save(questionarioTemplateEntity);
	}

	@LogMethod
	@LogExecutionTime
	public QuestionarioTemplateEntity getQuestionarioTemplateById(String idQuestionarioTemplate) {
		final String messaggioErrore = String.format("Questionario template con id='%s' non presente", idQuestionarioTemplate);
		return this.templateQuestionarioSqlRepository.findById(idQuestionarioTemplate)
					.orElseThrow(() -> new ResourceNotFoundException(messaggioErrore, CodiceErroreEnum.C01));
	}
	
	public Optional<QuestionarioTemplateCollection> getQuestionarioTemplateByNome(String nomeQuestionarioTemplate) {
		return this.templateQuestionarioSqlRepository.findByNome(nomeQuestionarioTemplate);
	}

	public Optional<QuestionarioTemplateCollection> getQuestionarioTemplateByNomeAndIdDiverso(
		String nomeQuestionarioTemplate, String idQuestionarioTemplate) {
		return this.templateQuestionarioSqlRepository.findQuestionarioTemplateByNomeAndIdDiverso(nomeQuestionarioTemplate, idQuestionarioTemplate);
	}
}