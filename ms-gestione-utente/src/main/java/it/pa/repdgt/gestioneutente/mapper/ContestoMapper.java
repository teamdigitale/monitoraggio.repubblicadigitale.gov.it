package it.pa.repdgt.gestioneutente.mapper;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import it.pa.repdgt.gestioneutente.resource.ContestoResource;
import it.pa.repdgt.gestioneutente.resource.RuoloResource;
import it.pa.repdgt.shared.constants.RuoliUtentiConstants;
import it.pa.repdgt.shared.entity.UtenteEntity;

@Component
public class ContestoMapper {
	
	public ContestoResource toContestoFromUtenteEntity(UtenteEntity utente) {
		if(utente == null) {
			return null;
		}
		ContestoResource contestoResource = new ContestoResource();
		contestoResource.setId(utente.getId());
		contestoResource.setCodiceFiscale(utente.getCodiceFiscale());
		contestoResource.setNome(utente.getNome());
		contestoResource.setCognome(utente.getCognome());
		contestoResource.setNumeroCellulare(utente.getTelefono());
		contestoResource.setEmail(utente.getEmail());
		contestoResource.setStato(utente.getStato());
		contestoResource.setIntegrazione(utente.getIntegrazione());
		contestoResource.setBio(utente.getMansione());
		contestoResource.setTipoContratto(utente.getTipoContratto());
		contestoResource.setUtenteRegistratoInWorkdocs(
				utente.getIntegrazioneUtente() ==null || utente.getIntegrazioneUtente().getIdUtenteWorkdocs() == null? Boolean.FALSE: utente.getIntegrazioneUtente().getUtenteRegistratoInWorkdocs()
			);
		
		List<RuoloResource> ruoliResource = utente.getRuoli()
				.stream()
				.map(ruolo -> {
					RuoloResource ruoloResource = new RuoloResource();
					ruoloResource.setCodiceRuolo(ruolo.getCodice());
					ruoloResource.setNomeRuolo(ruolo.getNome());
					
					return ruoloResource;
				})
				.collect(Collectors.toList());
		
		contestoResource.setRuoli(ruoliResource);
		
		boolean contestoContieneRuoloFacOVol = ruoliResource
			.stream()
			.anyMatch(ruoloResource -> { 
				return (
						RuoliUtentiConstants.FACILITATORE.equalsIgnoreCase(ruoloResource.getCodiceRuolo()) 
						|| RuoliUtentiConstants.VOLONTARIO.equalsIgnoreCase(ruoloResource.getCodiceRuolo())
					);
			});
		if(contestoContieneRuoloFacOVol) {
			contestoResource.setMostraTipoContratto(Boolean.TRUE);
		}
		
		boolean contestoContieneRuoliReferentiODelegati = ruoliResource
				.stream()
				.anyMatch(ruoloResource -> { 
					return (
							   RuoliUtentiConstants.REG.equalsIgnoreCase(ruoloResource.getCodiceRuolo()) 
							|| RuoliUtentiConstants.DEG.equalsIgnoreCase(ruoloResource.getCodiceRuolo())
							|| RuoliUtentiConstants.DEG.equalsIgnoreCase(ruoloResource.getCodiceRuolo())
							|| RuoliUtentiConstants.REGP.equalsIgnoreCase(ruoloResource.getCodiceRuolo())
							|| RuoliUtentiConstants.DEGP.equalsIgnoreCase(ruoloResource.getCodiceRuolo())
							|| RuoliUtentiConstants.REPP.equalsIgnoreCase(ruoloResource.getCodiceRuolo())
							|| RuoliUtentiConstants.DEPP.equalsIgnoreCase(ruoloResource.getCodiceRuolo())
						);
				});
		if(contestoContieneRuoliReferentiODelegati) {
			contestoResource.setMostraBio(Boolean.TRUE);
		}
		
		return contestoResource;
	}
}