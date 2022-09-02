package it.pa.repdgt.shared.service.storico;

import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import it.pa.repdgt.shared.entity.EntePartnerEntity;
import it.pa.repdgt.shared.entity.ProgettoEntity;
import it.pa.repdgt.shared.entity.ProgrammaEntity;
import it.pa.repdgt.shared.entity.storico.StoricoEnteGestoreProgettoEntity;
import it.pa.repdgt.shared.entity.storico.StoricoEnteGestoreProgrammaEntity;
import it.pa.repdgt.shared.entity.storico.StoricoEntePartnerEntity;
import it.pa.repdgt.shared.entityenum.StatoEnum;
import it.pa.repdgt.shared.exception.StoricoEnteException;
import it.pa.repdgt.shared.repository.storico.StoricoEnteGestoreProgettoRepository;
import it.pa.repdgt.shared.repository.storico.StoricoEnteGestoreProgrammaRepository;
import it.pa.repdgt.shared.repository.storico.StoricoEntePartnerRepository;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class StoricoService {
	@Autowired
	private StoricoEnteGestoreProgrammaRepository storicoEnteGestoreProgrammaRepository;
	@Autowired
	private StoricoEnteGestoreProgettoRepository storicoEnteGestoreProgettoRepository;
	@Autowired
	private StoricoEntePartnerRepository storicoEntePartnerRepository;

	@Transactional(rollbackFor = Exception.class)
	public void storicizzaEnteGestoreProgramma(final ProgrammaEntity programmaEntity, String stato) throws Exception {
		StoricoEnteGestoreProgrammaEntity storicoEnteGestoreProgramma = new StoricoEnteGestoreProgrammaEntity();
		Long idEnte = programmaEntity.getEnteGestoreProgramma().getId();
		Long idProgramma = programmaEntity.getId();
		if(!StatoEnum.ATTIVO.getValue().equalsIgnoreCase(stato)) {
			String messaggioErrore = String.format("ente gestore programma non presente nello storico per idEnte %s, idProgramma %s", idEnte, idProgramma);
			storicoEnteGestoreProgramma = storicoEnteGestoreProgrammaRepository.findStoricoEnteByIdProgrammaAndIdEnte(idProgramma, idEnte)
					.orElseThrow(() -> new StoricoEnteException(messaggioErrore));
			storicoEnteGestoreProgramma.setStato(StatoEnum.TERMINATO.getValue());
			storicoEnteGestoreProgramma.setDataOraTerminazione(new Date());
		}else {
			storicoEnteGestoreProgramma.setDataAttivazioneEnte(new Date());
			storicoEnteGestoreProgramma.setStato(StatoEnum.ATTIVO.getValue());
			storicoEnteGestoreProgramma.setIdProgramma(programmaEntity.getId());
			storicoEnteGestoreProgramma.setIdEnte(programmaEntity.getEnteGestoreProgramma().getId());
			storicoEnteGestoreProgramma.setDataOraCreazione(new Date());
		}
		this.storicoEnteGestoreProgrammaRepository.save(storicoEnteGestoreProgramma);
		log.info("Ente Gestore Programma storicizzato.");
	}

	@Transactional(rollbackFor = Exception.class)
	public void storicizzaEnteGestoreProgetto(final ProgettoEntity progettoEntity, String stato) throws Exception {
		StoricoEnteGestoreProgettoEntity storicoEnteGestoreProgetto = new StoricoEnteGestoreProgettoEntity();
		Long idEnte = progettoEntity.getEnteGestoreProgetto().getId();
		Long idProgramma = progettoEntity.getProgramma().getId();
		Long idProgetto = progettoEntity.getId();
		if(!StatoEnum.ATTIVO.getValue().equalsIgnoreCase(stato)) {
			String messaggioErrore = String.format("ente gestore progetto non presente nello storico per idEnte %s, idProgramma %s. idProgetto %s", idEnte, idProgramma, idProgetto);
			storicoEnteGestoreProgetto = storicoEnteGestoreProgettoRepository.findStoricoEnteByIdProgrammaAndIdEnteAndIdProgetto(idProgramma, idEnte, idProgetto)
					.orElseThrow(() -> new StoricoEnteException(messaggioErrore));
			storicoEnteGestoreProgetto.setStato(StatoEnum.TERMINATO.getValue());
			storicoEnteGestoreProgetto.setDataOraTerminazione(new Date());
		}else {
			storicoEnteGestoreProgetto.setDataAttivazioneEnte(new Date());
			storicoEnteGestoreProgetto.setStato(StatoEnum.ATTIVO.getValue());
			storicoEnteGestoreProgetto.setIdProgetto(progettoEntity.getId());
			storicoEnteGestoreProgetto.setIdEnte(progettoEntity.getEnteGestoreProgetto().getId());
			storicoEnteGestoreProgetto.setDataOraCreazione(new Date());
			storicoEnteGestoreProgetto.setIdProgramma(idProgramma);
		}
		this.storicoEnteGestoreProgettoRepository.save(storicoEnteGestoreProgetto);
		log.info("Ente Gestore Progetto storicizzato.");
	}
	
	@Transactional(rollbackFor = Exception.class)
	public void storicizzaEntePartner(final EntePartnerEntity entePartnerEntity, String stato) throws Exception {
		StoricoEntePartnerEntity storicoEntePartner = new StoricoEntePartnerEntity();
		Long idEnte = entePartnerEntity.getId().getIdEnte();
		Long idProgetto = entePartnerEntity.getId().getIdProgetto();
		Long idProgramma = storicoEntePartnerRepository.findIdProgrammaByIdProgetto(idProgetto).getIdProgramma();
		if(!StatoEnum.ATTIVO.getValue().equalsIgnoreCase(stato)) {
			String messaggioErrore = String.format("ente gestore progetto non presente nello storico per idEnte %s, idProgramma %s. idProgetto %s", idEnte, idProgramma, idProgetto);
			storicoEntePartner = storicoEntePartnerRepository.findStoricoEnteByIdProgrammaAndIdEnteAndIdProgetto(idProgramma, idEnte, idProgetto)
					.orElseThrow(() -> new StoricoEnteException(messaggioErrore));
			storicoEntePartner.setStato(StatoEnum.TERMINATO.getValue());
			storicoEntePartner.setDataOraTerminazione(new Date());
		}else {
			storicoEntePartner.setDataAttivazioneEnte(new Date());
			storicoEntePartner.setStato(StatoEnum.ATTIVO.getValue());
			storicoEntePartner.setIdProgetto(entePartnerEntity.getId().getIdProgetto());
			storicoEntePartner.setIdEnte(entePartnerEntity.getId().getIdEnte());
			storicoEntePartner.setDataOraCreazione(new Date());
			storicoEntePartner.setIdProgramma(idProgramma);
		}
		this.storicoEntePartnerRepository.save(storicoEntePartner);
		log.info("Ente Partner storicizzato.");
	}
}