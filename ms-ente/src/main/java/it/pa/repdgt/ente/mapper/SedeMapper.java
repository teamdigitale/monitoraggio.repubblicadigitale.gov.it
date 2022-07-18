package it.pa.repdgt.ente.mapper;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import it.pa.repdgt.ente.bean.DettaglioProgettoLightBean;
import it.pa.repdgt.ente.bean.DettaglioSedeBean;
import it.pa.repdgt.ente.request.NuovaSedeRequest;
import it.pa.repdgt.ente.request.NuovaSedeRequest.IndirizzoSedeRequest;
import it.pa.repdgt.ente.resource.SedeResource;
import it.pa.repdgt.shared.entity.ProgettoEntity;
import it.pa.repdgt.shared.entity.SedeEntity;

@Component
public class SedeMapper {

	public SedeEntity toEntityFrom(NuovaSedeRequest nuovaSedeRequest) {
		SedeEntity sedeEntity = new SedeEntity();
		sedeEntity.setNome(nuovaSedeRequest.getNome());
		sedeEntity.setServiziErogati(nuovaSedeRequest.getServiziErogati());
		sedeEntity.setItinere(nuovaSedeRequest.getIsItinere());
		
		if(nuovaSedeRequest.getIndirizziSede() == null || nuovaSedeRequest.getIndirizziSede().isEmpty() ) {
			return sedeEntity;
		}
		
		final IndirizzoSedeRequest primoIndirizzoSede = nuovaSedeRequest.getIndirizziSede().get(0);
		sedeEntity.setVia(primoIndirizzoSede.getVia());
		sedeEntity.setCivico(primoIndirizzoSede.getCivico());
		sedeEntity.setComune(primoIndirizzoSede.getComune());
		sedeEntity.setProvincia(primoIndirizzoSede.getProvincia());
		sedeEntity.setCap(primoIndirizzoSede.getCap());
		sedeEntity.setRegione(primoIndirizzoSede.getRegione());
		sedeEntity.setNazione(primoIndirizzoSede.getNazione());
		return sedeEntity;
	}

	public DettaglioSedeBean toDettaglioFrom(SedeEntity sedeFetch) {
		DettaglioSedeBean dettaglioSede = new DettaglioSedeBean();
		dettaglioSede.setId(sedeFetch.getId());
		dettaglioSede.setNome(sedeFetch.getNome());
		dettaglioSede.setServiziErogati(sedeFetch.getServiziErogati());
		dettaglioSede.setItinere(sedeFetch.getItinere());
		return dettaglioSede;
	}
	
	public SedeResource toResourceFrom(SedeEntity sedeEntity) {
		if(sedeEntity == null) {
			return null;
		}
		SedeResource sedeResource = new SedeResource();
		sedeResource.setId(sedeEntity.getId());
		sedeResource.setNome(sedeEntity.getNome());
		// TODO aggiungere eventuali altri campi ....
		return sedeResource;
	}
	
	public List<SedeResource> toResourceFrom(final List<SedeEntity> sediEntity) {
		if(sediEntity == null ) {
			return null;
		}
		
		return sediEntity
					.stream()
					.map(this::toResourceFrom)
					.collect(Collectors.toList());
	}

	public DettaglioProgettoLightBean toDettaglioProgettoLightBeanFrom(ProgettoEntity progettoFetchDB) {
		DettaglioProgettoLightBean dettaglioProgetto = new DettaglioProgettoLightBean();
		dettaglioProgetto.setId(progettoFetchDB.getId());
		dettaglioProgetto.setNomeBreve(progettoFetchDB.getNomeBreve());
		return dettaglioProgetto;
	}
}