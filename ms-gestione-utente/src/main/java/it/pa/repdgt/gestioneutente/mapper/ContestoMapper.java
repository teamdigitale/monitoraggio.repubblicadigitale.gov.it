package it.pa.repdgt.gestioneutente.mapper;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import it.pa.repdgt.gestioneutente.resource.ContestoResource;
import it.pa.repdgt.gestioneutente.resource.RuoloResource;
import it.pa.repdgt.shared.entity.UtenteEntity;

@Component
public class ContestoMapper {
	
	public ContestoResource toContestoFromUtenteEntity(UtenteEntity utente) {
		if(utente == null) {
			return null;
		}
		ContestoResource contestoResource = new ContestoResource();
		contestoResource.setCodiceFiscale(utente.getCodiceFiscale());
		contestoResource.setNome(utente.getNome());
		contestoResource.setCognome(utente.getCognome());
		contestoResource.setNumeroCellulare(utente.getTelefono());
		contestoResource.setEmail(utente.getEmail());
		contestoResource.setStato(utente.getStato());
		contestoResource.setIntegrazione(utente.getIntegrazione());
		contestoResource.setBio(utente.getMansione());
		contestoResource.setTipoContratto(utente.getTipoContratto());
		
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
		return contestoResource;
	}
}