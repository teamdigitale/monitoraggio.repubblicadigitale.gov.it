package it.pa.repdgt.ente.mapper;

import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;

import it.pa.repdgt.ente.dto.EnteDto;
import it.pa.repdgt.ente.request.NuovoEnteRequest;
import it.pa.repdgt.ente.resource.EnteResource;
import it.pa.repdgt.ente.resource.ListaEntiPaginatiResource;
import it.pa.repdgt.shared.entity.EnteEntity;

@Component
public class EnteMapper {
	public EnteResource  toResourcefrom(EnteEntity enteEntity) {
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
	
	public ListaEntiPaginatiResource toResourcefrom(Page<EnteDto> paginaEnte) {
		if(paginaEnte == null) {
			return null;
		}
		
		ListaEntiPaginatiResource listaEntiPaginatiResource = new ListaEntiPaginatiResource();
		listaEntiPaginatiResource.setEnti(paginaEnte.getContent());
		listaEntiPaginatiResource.setNumeroPagine(paginaEnte.getTotalPages());
		return listaEntiPaginatiResource;
	}
}