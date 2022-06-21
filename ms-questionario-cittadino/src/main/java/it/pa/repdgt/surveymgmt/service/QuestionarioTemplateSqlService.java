package it.pa.repdgt.surveymgmt.service;

import java.util.List;
import java.util.Optional;

import javax.validation.constraints.NotNull;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.annotation.Validated;

import it.pa.repdgt.shared.entity.ProgrammaEntity;
import it.pa.repdgt.shared.entity.QuestionarioTemplateEntity;
import it.pa.repdgt.shared.entityenum.PolicyEnum;
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
	
	public List<QuestionarioTemplateEntity> getQuestionariTemplateByIdProgetto(
			@NotNull final Long idProgetto) {
		return this.templateQuestionarioSqlRepository.findQuestionarioTemplateByIdProgetto(idProgetto);
	}
	
	@Transactional(rollbackFor = Exception.class)
	public QuestionarioTemplateEntity salvaQuestionarioTemplate(
			@NotNull final QuestionarioTemplateEntity questionarioTemplateEntity) {
		// Verifico se esiste già il Questioanario template
		final String idQuestionarioTemplate = questionarioTemplateEntity.getId();
		if(this.templateQuestionarioSqlRepository.existsById(idQuestionarioTemplate)) {
			final String messaggioErrore = String.format("Impossibile salvare il questionario. Questionario con id='%s' già presente", idQuestionarioTemplate);
			throw new QuestionarioTemplateException(messaggioErrore);
		}
		return this.templateQuestionarioSqlRepository.save(questionarioTemplateEntity);
	}

	@Transactional(rollbackFor = Exception.class)
	public QuestionarioTemplateEntity aggiornaQuestionarioTemplate(
			@NotNull final QuestionarioTemplateEntity questionarioTemplateEntity) {
		final String idQuestionarioTemplate = questionarioTemplateEntity.getId();
		final Optional<QuestionarioTemplateEntity> questionarioDBFetch = this.templateQuestionarioSqlRepository.findById(idQuestionarioTemplate);

		//  Verifico se esiste il questionarioTemplate
		if(!questionarioDBFetch.isPresent()) {
			final String messaggioErrore = String.format("Impossibile aggiornare il questionario. Questionario con id='%s' non presente", idQuestionarioTemplate);
			throw new QuestionarioTemplateException(messaggioErrore);
		}
		return this.templateQuestionarioSqlRepository.save(questionarioTemplateEntity);
	}

	public List<QuestionarioTemplateEntity> findAllQuestionariTemplateByFiltro(
			final String criterioRicerca,
			final String statoQuestionario) {
		return this.templateQuestionarioSqlRepository.findAllByFiltro(criterioRicerca, statoQuestionario);
	}
	
	public List<String> findAllStatiDropdownByFiltro(
			final String criterioRicerca,
			final String statoQuestionario) {
		return this.templateQuestionarioSqlRepository.findAllStatiDropdownByFiltro(criterioRicerca, statoQuestionario);
	}

	public List<QuestionarioTemplateEntity> findQuestionariTemplateByIdProgrammaAndFiltro(
			@NotNull final Long idProgramma,
			final String criterioRicerca, 
			final String statoQuestionario) {
		return this.templateQuestionarioSqlRepository.findQuestionariTemplateByIdProgrammaAndFiltro(idProgramma, criterioRicerca, statoQuestionario);
	}
	
	public List<String> findStatiDropdownByIdProgrammaAndFiltro(
			@NotNull final Long idProgramma,
			final String criterioRicerca, 
			final String statoQuestionario) {
		return this.templateQuestionarioSqlRepository.findStatiDropdownByIdProgrammaAndFiltro(idProgramma, criterioRicerca, statoQuestionario);
	}

	public List<QuestionarioTemplateEntity> getAllQuestionari() {
		return this.templateQuestionarioSqlRepository.findAll();
	}

	public List<QuestionarioTemplateEntity> getQuestionariSCD() {
		return this.templateQuestionarioSqlRepository.findQuestionariSCD();
	}

	public List<QuestionarioTemplateEntity> getQuestionariPerReferenteDelegatoGestoreProgramma(Long idProgramma) {
		ProgrammaEntity programma = this.programmaService.getProgrammaById(idProgramma);
		PolicyEnum policy = programma.getPolicy();

		if(policy.equals(PolicyEnum.RFD)) {
			return this.templateQuestionarioSqlRepository.findQuestionariRFD();
		}
		return this.templateQuestionarioSqlRepository.findQuestionariSCD();
	}

	public List<QuestionarioTemplateEntity> findQuestionariTemplateByDefaultPolicySCDAndFiltro(
			String criterioRicerca,
			String statoQuestionario) {
		return this.templateQuestionarioSqlRepository.findQuestionariTemplateByDefaultPolicySCDAndFiltro(criterioRicerca, statoQuestionario);
	}
	
	public List<String> findStatiDropdownByDefaultPolicySCDAndFiltro(
			String criterioRicerca,
			String statoQuestionario) {
		return this.templateQuestionarioSqlRepository.findStatiDropdownByDefaultPolicySCDAndFiltro(criterioRicerca, statoQuestionario);
	}

	@Transactional(rollbackFor = Exception.class)
	public void cancellaQuestionarioTemplate(
			@NotNull final QuestionarioTemplateEntity questionarioTemplateEntity) {
		final String idQuestionarioTemplate = questionarioTemplateEntity.getId();
		final Optional<QuestionarioTemplateEntity> questionarioDBFetch = this.templateQuestionarioSqlRepository.findById(idQuestionarioTemplate);

		//  Verifico se esiste il questionarioTemplate 
		if(!questionarioDBFetch.isPresent()) {
			final String messaggioErrore = String.format("Impossibile cancellare il questionario. Questionario con id='%s' non presente", idQuestionarioTemplate);
			throw new QuestionarioTemplateException(messaggioErrore);
		}
		this.templateQuestionarioSqlRepository.delete(questionarioTemplateEntity);
	}

	public Optional<QuestionarioTemplateEntity> getQuestionarioTemplateDefaultRFD() {
		return this.templateQuestionarioSqlRepository.findQuestionarioTemplateDefaultRFD();
	}

	public Optional<QuestionarioTemplateEntity> getQuestionarioTemplateDefaultSCD() {
		return this.templateQuestionarioSqlRepository.findQuestionarioTemplateDefaultSCD();
	}

	public void salvaQuestionario(QuestionarioTemplateEntity questionarioTemplateEntity) {
		this.templateQuestionarioSqlRepository.save(questionarioTemplateEntity);
	}

	public QuestionarioTemplateEntity getQuestionarioTemplateById(String idQuestionarioTemplate) {
		final String messaggioErrore = String.format("Questionario template con id='%s' non presente", idQuestionarioTemplate);
		return this.templateQuestionarioSqlRepository.findById(idQuestionarioTemplate)
					.orElseThrow(() -> new ResourceNotFoundException(messaggioErrore));
	}
}