package it.pa.repdgt.programmaprogetto.service;

import java.util.Date;
import java.util.Optional;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import it.pa.repdgt.programmaprogetto.repository.ProgrammaXQuestionarioTemplateRepository;
import it.pa.repdgt.shared.entity.ProgrammaXQuestionarioTemplateEntity;
import it.pa.repdgt.shared.entity.key.ProgrammaXQuestionarioTemplateKey;
import it.pa.repdgt.shared.entityenum.StatoEnum;

@Service
public class ProgrammaXQuestionarioTemplateService {

	@Autowired
	private ProgrammaXQuestionarioTemplateRepository programmaXQuestionarioTemplateRepository;

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
	
	@Transactional(dontRollbackOn = Exception.class)
	public void terminaAssociazioneQuestionarioTemplateAProgramma(ProgrammaXQuestionarioTemplateEntity programmaXQuestionarioTemplate) {
		programmaXQuestionarioTemplate.setStato(StatoEnum.TERMINATO.getValue());
		programmaXQuestionarioTemplate.setDataOraAggiornamento(new Date());
		this.programmaXQuestionarioTemplateRepository.save(programmaXQuestionarioTemplate);
	}

	public Optional<ProgrammaXQuestionarioTemplateEntity> getAssociazioneQuestionarioTemplateAttivaByIdProgramma(Long idProgramma) {
		return this.programmaXQuestionarioTemplateRepository.getAssociazioneQuestionarioTemplateAttivaByIdProgramma(idProgramma);
	}

	public void cancellaAssociazioneQuestionarioTemplateAProgramma(Long idProgramma) {
		ProgrammaXQuestionarioTemplateEntity programmaXQuestionario = this.getAssociazioneQuestionarioTemplateAttivaByIdProgramma(idProgramma).get();
		this.programmaXQuestionarioTemplateRepository.delete(programmaXQuestionario);
	}
}
