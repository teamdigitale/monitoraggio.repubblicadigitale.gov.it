package it.pa.repdgt.surveymgmt.service;

import java.util.List;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

import it.pa.repdgt.shared.annotation.LogExecutionTime;
import it.pa.repdgt.shared.annotation.LogMethod;
import it.pa.repdgt.shared.entity.RuoloEntity;
import it.pa.repdgt.shared.entity.UtenteEntity;
import it.pa.repdgt.shared.entityenum.RuoloUtenteEnum;
import it.pa.repdgt.shared.exception.CodiceErroreEnum;
import it.pa.repdgt.surveymgmt.exception.ResourceNotFoundException;
import it.pa.repdgt.surveymgmt.repository.UtenteRepository;

@Service
@Validated
public class UtenteService {
	@Autowired
	private RuoloService ruoloService;
	@Autowired
	private UtenteRepository utenteRepository;
	
	@LogMethod
	@LogExecutionTime
	public UtenteEntity getUtenteByCodiceFiscale(@NotNull final String codiceFiscaleUtente) {
		final String messaggioErrore = String.format("Utente con codice fiscale '%s' non presente.", codiceFiscaleUtente);
		return this.utenteRepository.findByCodiceFiscale(codiceFiscaleUtente)
				.orElseThrow(() -> new ResourceNotFoundException(messaggioErrore, CodiceErroreEnum.C01) );
	}

	@LogMethod
	@LogExecutionTime
	public boolean isUtenteFacilitatore(@NotBlank final String codiceFiscaleUtente, @NotBlank final String codiceRuolo) {
		return ( this.hasRuoloUtente(codiceFiscaleUtente, codiceRuolo)
				&& 
				RuoloUtenteEnum.FAC.toString().equalsIgnoreCase(codiceRuolo) ||  RuoloUtenteEnum.VOL.toString().equalsIgnoreCase(codiceRuolo));
	}
	
	@LogMethod
	@LogExecutionTime
	public boolean hasRuoloUtente(@NotBlank final String codiceFiscaleUtente, @NotBlank final String codiceRuolo) {
		final List<RuoloEntity> ruoliUtente = this.ruoloService.getRuoliByCodiceFiscale(codiceFiscaleUtente);
		return ruoliUtente
					.stream()
					.anyMatch(ruoloUtente -> ruoloUtente.getCodice().equalsIgnoreCase(codiceRuolo));
	}
}