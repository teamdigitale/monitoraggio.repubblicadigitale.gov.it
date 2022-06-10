package it.pa.repdgt.surveymgmt.service;

import java.util.Date;
import java.util.List;

import javax.transaction.Transactional;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

import it.pa.repdgt.shared.entity.EnteSedeProgettoFacilitatoreEntity;
import it.pa.repdgt.shared.entity.ProgrammaXQuestionarioTemplateEntity;
import it.pa.repdgt.shared.entity.ServizioEntity;
import it.pa.repdgt.shared.entity.key.EnteSedeProgettoFacilitatoreKey;
import it.pa.repdgt.shared.entityenum.StatoEnum;
import it.pa.repdgt.surveymgmt.exception.ServizioException;
import it.pa.repdgt.surveymgmt.param.ProfilazioneParam;
import it.pa.repdgt.surveymgmt.repository.ServizioSqlRepository;
import it.pa.repdgt.surveymgmt.request.ServizioRequest;

@Service
@Validated
public class ServizioSqlService {
	@Autowired
	private EnteSedeProgettoFacilitatoreService enteSedeProgettoFaciltatoreService;
	@Autowired
	private ServizioSqlRepository servizioSqlRepository;
	
	@Autowired
	private ProgrammaXQuestionarioTemplateService programmaXQuestionarioTemplateService;
	
	public boolean esisteServizioByNome(String nomeServizio) {
		return this.servizioSqlRepository.findServizioByNome(nomeServizio).isPresent();
	}
	
	@Transactional(rollbackOn = Exception.class)
	public ServizioEntity salvaServizio(
			@NotNull final ServizioRequest servizioRequest,
			@NotBlank final String idSezioneQ3Compilato ) {
		final ServizioEntity servizioEntity = this.creaServizio(servizioRequest, idSezioneQ3Compilato);
		return this.servizioSqlRepository.save(servizioEntity);
	}
	
	public ServizioEntity creaServizio(
			@NotNull final ServizioRequest servizioRequest,
			@NotNull final String idSezioneQ3Compilato) {
		final ProfilazioneParam profilazioneParam = servizioRequest.getProfilazioneParam();
		final Long idProgramma = profilazioneParam.getIdProgramma();
		
		// Recupero id template questionario associato al programma
		final List<ProgrammaXQuestionarioTemplateEntity> listaProgrammaXQuestionario = this.programmaXQuestionarioTemplateService.getByIdProgramma(idProgramma);
		if( listaProgrammaXQuestionario.isEmpty() ) {
			final String messaggioErrore = String.format("Impossibile creare servizio. Nessun questionario template associato al programma con id '%s'", idProgramma);
			throw new ServizioException(messaggioErrore);
		}
		final String idQuestinarioTemplate = listaProgrammaXQuestionario
																	.get(0)
																	.getProgrammaXQuestionarioTemplateKey()
																	.getIdQuestionarioTemplate();
		
		// Recupero ESP_FACILITATORE
		final EnteSedeProgettoFacilitatoreKey idEnteSedeProgettoFacilitatore = new EnteSedeProgettoFacilitatoreKey();
		idEnteSedeProgettoFacilitatore.setIdEnte(servizioRequest.getIdEnte());
		idEnteSedeProgettoFacilitatore.setIdSede(servizioRequest.getIdSede());
		idEnteSedeProgettoFacilitatore.setIdProgetto(profilazioneParam.getIdProgetto());
		idEnteSedeProgettoFacilitatore.setIdFacilitatore(profilazioneParam.getCodiceFiscaleUtenteLoggato());
		final EnteSedeProgettoFacilitatoreEntity enteSedeProgettoFacilitatore = this.enteSedeProgettoFaciltatoreService.getById(idEnteSedeProgettoFacilitatore);
		
		final ServizioEntity servizioEntity = new ServizioEntity();
		servizioEntity.setNome(servizioRequest.getNomeServizio());
		servizioEntity.setIdQuestionarioTemplateSnapshot(idQuestinarioTemplate);
		servizioEntity.setIdEnteSedeProgettoFacilitatore(enteSedeProgettoFacilitatore.getId());
		servizioEntity.setIdTemplateCompilatoQ3(idSezioneQ3Compilato);
		servizioEntity.setDataOraCreazione(new Date());
		servizioEntity.setDataOraAggiornamento(servizioEntity.getDataOraCreazione());
		servizioEntity.setStato(StatoEnum.NON_ATTIVO.getValue());
		return servizioEntity;
	}
}