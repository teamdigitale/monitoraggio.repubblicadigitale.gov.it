package it.pa.repdgt.gestioneutente.service;

import java.util.Date;
import java.util.List;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import it.pa.repdgt.gestioneutente.exception.ResourceNotFoundException;
import it.pa.repdgt.gestioneutente.exception.RuoloXGruppoException;
import it.pa.repdgt.gestioneutente.repository.RuoloXGruppoRepository;
import it.pa.repdgt.shared.annotation.LogExecutionTime;
import it.pa.repdgt.shared.annotation.LogMethod;
import it.pa.repdgt.shared.entity.RuoloXGruppo;
import it.pa.repdgt.shared.entity.key.RuoloXGruppoKey;
import it.pa.repdgt.shared.exception.CodiceErroreEnum;

@Service
public class RuoloXGruppoService {
	@Autowired
	private GruppoService gruppoService;
	@Autowired
	private RuoloXGruppoRepository ruoloXGruppoRepository;
	
	@LogMethod
	@LogExecutionTime
	public RuoloXGruppo getAssociazioneRuoloXGruppo(String codiceRuolo, String codiceGruppo) {
		RuoloXGruppoKey id = new RuoloXGruppoKey(codiceRuolo, codiceGruppo);
		String messaggioErrore = String.format("Il gruppo con codice=%s non associato al ruolo con codice=%s", codiceRuolo, codiceGruppo);
		return this.ruoloXGruppoRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException(messaggioErrore, CodiceErroreEnum.C01));
	}
	
	@LogMethod
	@LogExecutionTime
	public List<String> getCodiceRuoliByCodiceGruppo(String codiceGruppo) {
		return this.ruoloXGruppoRepository.findByCodiceGruppo(codiceGruppo);
	}
	
	@LogMethod
	@LogExecutionTime
	@Transactional(rollbackOn = Exception.class)
	public void salvaNuovaAssociazioneInRuoloXGruppo(String codiceRuolo, String codiceGruppo) {
		RuoloXGruppoKey id = new RuoloXGruppoKey(codiceRuolo, codiceGruppo);
		RuoloXGruppo ruoloXGruppo = new RuoloXGruppo();
		ruoloXGruppo.setId(id);
		ruoloXGruppo.setDataOraCreazione(new Date());
		ruoloXGruppoRepository.save(ruoloXGruppo);
	}

	@LogMethod
	@LogExecutionTime
	@Transactional(rollbackOn = Exception.class)
	public void salvaAssociazioniInRuoloXGruppo(String codiceRuolo, List<String> codiciGruppi) {
		if(codiceRuolo == null || codiciGruppi == null) {
			String messaggioErrore = String.format("Impossibile creare associazione tra: ruolo con codiceRuolo='%s' e gruppi=[%s] al.", codiciGruppi, codiceRuolo);
			throw new RuoloXGruppoException(messaggioErrore, CodiceErroreEnum.RG01);
		}
		if(this.gruppoService.existsAllGruppiByCodiciGruppi(codiciGruppi)) {
			codiciGruppi.forEach(codiceGruppo -> this.salvaNuovaAssociazioneInRuoloXGruppo(codiceRuolo, codiceGruppo));
		}
	}

	@LogMethod
	@LogExecutionTime
	@Transactional(rollbackOn = Exception.class)
	public void aggiornaAssociazioniRuoloGruppo(String codiceRuolo, List<String> codiciGruppi) {
		if(codiceRuolo == null || codiciGruppi == null) {
			String messaggioErrore = String.format("Impossibile aggiornare associazione tra: ruolo con codiceRuolo='%s' e gruppi=[%s].", codiciGruppi, codiceRuolo);
			throw new RuoloXGruppoException(messaggioErrore, CodiceErroreEnum.RG02);
		}
		if(this.gruppoService.existsAllGruppiByCodiciGruppi(codiciGruppi)) {
			this.cancellaAssociazioniInRuoloXGruppoByCodiceRuolo(codiceRuolo);
			this.salvaAssociazioniInRuoloXGruppo(codiceRuolo, codiciGruppi);
		}
	}
	

	@LogMethod
	@LogExecutionTime
	@Transactional(rollbackOn = Exception.class)
	public void cancellaAssociazioniInRuoloXGruppoByCodiceRuolo(String codiceRuolo) {
		this.ruoloXGruppoRepository.deleteAllRuoloXGruppoByCodiceRuolo(codiceRuolo);
	}
}