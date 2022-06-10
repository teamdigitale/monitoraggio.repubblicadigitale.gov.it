package it.pa.repdgt.surveymgmt.service;

import java.util.List;

import javax.validation.constraints.NotBlank;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

import it.pa.repdgt.shared.entity.RuoloEntity;
import it.pa.repdgt.shared.entityenum.RuoloUtenteEnum;

@Service
@Validated
public class UtenteService {
	@Autowired
	private RuoloService ruoloService;
	
	public boolean hasRuoloUtente(@NotBlank final String codiceFiscaleUtente, @NotBlank final String codiceRuolo) {
		final List<RuoloEntity> ruoliUtente = this.ruoloService.getRuoliByCodiceFiscale(codiceFiscaleUtente);
		return ruoliUtente
					.stream()
					.anyMatch(ruoloUtente -> ruoloUtente.getCodice().equalsIgnoreCase(codiceRuolo));
	}
	
	public boolean isUtenteFacilitatore(final String codiceFiscaleUtente, final String codiceRuolo) {
		return ( this.hasRuoloUtente(codiceFiscaleUtente, codiceRuolo)
					&& 
				RuoloUtenteEnum.FAC.toString().equalsIgnoreCase(codiceRuolo) );
	}
}