package it.pa.repdgt.ente.mapper;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;

import it.pa.repdgt.ente.dto.EnteDto;
import it.pa.repdgt.ente.request.AggiornaEnteRequest;
import it.pa.repdgt.ente.request.NuovoEnteRequest;
import it.pa.repdgt.ente.resource.EnteResource;
import it.pa.repdgt.ente.resource.ListaEntiPaginatiResource;
import it.pa.repdgt.shared.entity.EnteEntity;

@Component
public class EnteMapper {
	
	public List<EnteResource> toResourceFrom(List<EnteEntity> enti) {
		if(enti == null ) {
			return null;
		}
		
		return enti.stream()
					.map(this::toResourceFrom)
					.collect(Collectors.toList());
	}
	
	public EnteResource  toResourceFrom(EnteEntity enteEntity) {
		if(enteEntity == null) {
			return null;
		}
		EnteResource enteResource = new EnteResource();
		enteResource.setId(enteEntity.getId());
		enteResource.setNome(enteEntity.getNome());
		enteResource.setNomeBreve(enteEntity.getNomeBreve());
		enteResource.setTipologia(enteEntity.getTipologia());
		enteResource.setPartitaIva(enteEntity.getPiva());
		enteResource.setSedeLegale(enteEntity.getSedeLegale());
		enteResource.setIndirizzoPec(enteEntity.getIndirizzoPec());
		return enteResource;
	}

	public EnteEntity toEntityFrom(NuovoEnteRequest nuovoEnteRequest) {
		if(nuovoEnteRequest == null) {
			return null;
		}
		EnteEntity ente = new EnteEntity();
		ente.setNome(nuovoEnteRequest.getNome());
		ente.setNomeBreve(nuovoEnteRequest.getNomeBreve());
		ente.setPiva(nuovoEnteRequest.getPartitaIva());
		ente.setTipologia(nuovoEnteRequest.getTipologia());
		ente.setSedeLegale(nuovoEnteRequest.getSedeLegale());
		ente.setIndirizzoPec(nuovoEnteRequest.getIndirizzoPec());
		return ente;
	}
	
	public EnteEntity toEntityFrom(AggiornaEnteRequest aggiornaEnteRequest) {
		if(aggiornaEnteRequest == null) {
			return null;
		}
		EnteEntity ente = new EnteEntity();
		ente.setId(aggiornaEnteRequest.getId());
		ente.setNome(aggiornaEnteRequest.getNome());
		ente.setNomeBreve(aggiornaEnteRequest.getNomeBreve());
		ente.setPiva(aggiornaEnteRequest.getPartitaIva());
		ente.setTipologia(aggiornaEnteRequest.getTipologia());
		ente.setSedeLegale(aggiornaEnteRequest.getSedeLegale());
		ente.setIndirizzoPec(aggiornaEnteRequest.getIndirizzoPec());
		return ente;
	}
	
	public ListaEntiPaginatiResource toResourcefrom(Page<EnteDto> paginaEnte) {
		if(paginaEnte == null) {
			return null;
		}
		
		ListaEntiPaginatiResource listaEntiPaginatiResource = new ListaEntiPaginatiResource();
		listaEntiPaginatiResource.setEnti(paginaEnte.getContent());
		listaEntiPaginatiResource.setNumeroPagine(paginaEnte.getTotalPages());
		listaEntiPaginatiResource.setNumeroTotaleElementi(paginaEnte.getTotalElements());
		return listaEntiPaginatiResource;
	}
}