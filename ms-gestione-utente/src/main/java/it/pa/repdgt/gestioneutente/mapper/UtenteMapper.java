package it.pa.repdgt.gestioneutente.mapper;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import javax.validation.Valid;

import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;

import it.pa.repdgt.gestioneutente.dto.UtenteDto;
import it.pa.repdgt.gestioneutente.request.NuovoUtenteRequest;
import it.pa.repdgt.gestioneutente.resource.UtentiLightResourcePaginata;
import it.pa.repdgt.shared.entity.UtenteEntity;
import it.pa.repdgt.shared.entity.light.UtenteLightEntity;

@Component
public class UtenteMapper {

	public UtentiLightResourcePaginata toUtentiLightResourcePaginataFrom(Page<UtenteDto> paginaUtenti) {
		if(paginaUtenti == null) {
			return null;
		}
		List<UtenteDto> utenti = paginaUtenti.hasContent()? paginaUtenti.getContent(): Collections.emptyList();
		UtentiLightResourcePaginata utentiLightResourcePaginata = new UtentiLightResourcePaginata();
		utentiLightResourcePaginata.setListaUtenti(utenti);
		utentiLightResourcePaginata.setNumeroPagine(paginaUtenti.getTotalPages());
		utentiLightResourcePaginata.setNumeroTotaleElementi(paginaUtenti.getTotalElements());
		return utentiLightResourcePaginata;
	}
	
	public UtenteEntity toUtenteEntityFrom(@Valid NuovoUtenteRequest nuovoUtenteRequest) {
		UtenteEntity utente = new UtenteEntity();
		utente.setCodiceFiscale(nuovoUtenteRequest.getCodiceFiscale());
		utente.setNome(nuovoUtenteRequest.getNome());
		utente.setCognome(nuovoUtenteRequest.getCognome());
		utente.setEmail(nuovoUtenteRequest.getEmail());
		utente.setTelefono(nuovoUtenteRequest.getTelefono());
		utente.setTipoContratto(nuovoUtenteRequest.getTipoContratto());
		utente.setMansione(nuovoUtenteRequest.getMansione());
		utente.setIntegrazione(Boolean.FALSE);
		
		return utente;
	}

	public List<UtenteLightEntity> toUtenteLightEntityFrom(List<UtenteEntity> utentiCercati) {
		List<UtenteLightEntity> listaUtenti = utentiCercati
											  .stream()
											  .map(this::toUtenteLightEntityFrom)
											  .collect(Collectors.toList());
		return listaUtenti;	
	}
	
	public UtenteLightEntity toUtenteLightEntityFrom(UtenteEntity utenteCercato) {
		UtenteLightEntity utente = new UtenteLightEntity();
		utente.setId(utenteCercato.getId());
		utente.setNome(utenteCercato.getNome());
		utente.setCognome(utenteCercato.getCognome());
		utente.setCodiceFiscale(utenteCercato.getCodiceFiscale());
		utente.setTelefono(utenteCercato.getTelefono());
		utente.setEmail(utenteCercato.getEmail());
		utente.setMansione(utenteCercato.getMansione());
		utente.setTipoContratto(utenteCercato.getTipoContratto());
		return utente;
	}
}
