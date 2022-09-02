package it.pa.repdgt.programmaprogetto.service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import it.pa.repdgt.programmaprogetto.repository.ProgrammaXQuestionarioTemplateRepository;
import it.pa.repdgt.shared.annotation.LogExecutionTime;
import it.pa.repdgt.shared.annotation.LogMethod;
import it.pa.repdgt.shared.entity.ProgrammaXQuestionarioTemplateEntity;
import it.pa.repdgt.shared.entity.key.ProgrammaXQuestionarioTemplateKey;
import it.pa.repdgt.shared.entityenum.StatoEnum;

@Service
public class ProgrammaXQuestionarioTemplateService {

	@Autowired
	private ProgrammaXQuestionarioTemplateRepository programmaXQuestionarioTemplateRepository;

	@LogMethod
	@LogExecutionTime
	@Transactional(dontRollbackOn = Exception.class)
	public void associaQuestionarioTemplateAProgramma(Long idProgramma, String idQuestionario) {
		ProgrammaXQuestionarioTemplateKey id = new ProgrammaXQuestionarioTemplateKey(idProgramma, idQuestionario);
		
		Optional<ProgrammaXQuestionarioTemplateEntity> associazioneGiaEsistente = this.programmaXQuestionarioTemplateRepository.findById(id);
		
		if(associazioneGiaEsistente.isPresent() && StatoEnum.TERMINATO.getValue().equals(associazioneGiaEsistente.get().getStato())) {
			associazioneGiaEsistente.get().setStato(StatoEnum.ATTIVO.getValue());
			associazioneGiaEsistente.get().setDataOraAggiornamento(new Date());
			this.programmaXQuestionarioTemplateRepository.save(associazioneGiaEsistente.get());
			return;
		}
		ProgrammaXQuestionarioTemplateEntity programmaXQuestionarioTemplate = new ProgrammaXQuestionarioTemplateEntity();
		programmaXQuestionarioTemplate.setProgrammaXQuestionarioTemplateKey(id);
		programmaXQuestionarioTemplate.setDataOraCreazione(new Date());
		programmaXQuestionarioTemplate.setStato(StatoEnum.ATTIVO.getValue());
		this.programmaXQuestionarioTemplateRepository.save(programmaXQuestionarioTemplate);
	}
	
	@LogMethod
	@LogExecutionTime
	@Transactional(dontRollbackOn = Exception.class)
	public void terminaAssociazioneQuestionarioTemplateAProgramma(ProgrammaXQuestionarioTemplateEntity programmaXQuestionarioTemplate) {
		programmaXQuestionarioTemplate.setStato(StatoEnum.TERMINATO.getValue());
		programmaXQuestionarioTemplate.setDataOraAggiornamento(new Date());
		this.programmaXQuestionarioTemplateRepository.save(programmaXQuestionarioTemplate);
	}

	@LogMethod
	@LogExecutionTime
	public List<ProgrammaXQuestionarioTemplateEntity> getAssociazioneQuestionarioTemplateByIdProgramma(Long idProgramma) {
		return this.programmaXQuestionarioTemplateRepository.getAssociazioneQuestionarioTemplateByIdProgramma(idProgramma);
	}

	@LogMethod
	@LogExecutionTime
	public void cancellaAssociazioneQuestionarioTemplateAProgramma(Long idProgramma) {
		List<ProgrammaXQuestionarioTemplateEntity> programmaXQuestionarioList = this.getAssociazioneQuestionarioTemplateByIdProgramma(idProgramma);
		programmaXQuestionarioList.forEach(this.programmaXQuestionarioTemplateRepository::delete);
	}
}
