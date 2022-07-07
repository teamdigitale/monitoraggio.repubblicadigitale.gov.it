package it.pa.repdgt.programmaprogetto.mapper;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;

import it.pa.repdgt.programmaprogetto.bean.DettaglioProgettoBean;
import it.pa.repdgt.programmaprogetto.request.ProgettoRequest;
import it.pa.repdgt.programmaprogetto.resource.ProgettiLightResourcePaginati;
import it.pa.repdgt.programmaprogetto.resource.ProgettoLightResource;
import it.pa.repdgt.programmaprogetto.service.ProgrammaService;
import it.pa.repdgt.shared.entity.ProgettoEntity;
import it.pa.repdgt.shared.entity.ProgrammaEntity;

@Component
public class ProgettoMapper {
	@Autowired
	private ProgrammaService programmaService;

	public ProgettoLightResource toLightResourcefrom(ProgettoEntity progettoEntity) {
		if(progettoEntity == null) {
			return null;
		}
		
		ProgettoLightResource progettoLightResource = new ProgettoLightResource();
		progettoLightResource.setId(progettoEntity.getId());
		progettoLightResource.setNome(progettoEntity.getNomeBreve());
		progettoLightResource.setStato(progettoEntity.getStato());
		progettoLightResource.setNomeEnteGestore(progettoEntity.getEnteGestoreProgetto() != null ? progettoEntity.getEnteGestoreProgetto().getNome() : "");
		progettoLightResource.setPolicy(progettoEntity.getProgramma().getPolicy().toString());
		
		return progettoLightResource;
	}
	
	public List<ProgettoLightResource> toLightResourceFrom(List<ProgettoEntity> progettiEntity) {
		if(progettiEntity == null) {
			return null;
		}
	
		List<ProgettoLightResource> progettiResource = progettiEntity
								.stream()
								.map(this::toLightResourcefrom)
								.collect(Collectors.toList());
		
		return progettiResource;
	}
	
	public ProgettoEntity toEntityFrom(ProgettoRequest nuovoProgettoRequest) {
		if(nuovoProgettoRequest == null) {
			return null;
		}
		ProgettoEntity progetto = new ProgettoEntity();
		progetto.setNome(nuovoProgettoRequest.getNome());
		progetto.setNomeBreve(nuovoProgettoRequest.getNomeBreve());
		//Numero Target Punti di Facilitazione
		progetto.setNPuntiFacilitazioneTarget1(nuovoProgettoRequest.getNPuntiFacilitazioneTarget1());
		progetto.setNPuntiFacilitazioneTarget2(nuovoProgettoRequest.getNPuntiFacilitazioneTarget2());
		progetto.setNPuntiFacilitazioneTarget3(nuovoProgettoRequest.getNPuntiFacilitazioneTarget3());
		progetto.setNPuntiFacilitazioneTarget4(nuovoProgettoRequest.getNPuntiFacilitazioneTarget4());
		progetto.setNPuntiFacilitazioneTarget5(nuovoProgettoRequest.getNPuntiFacilitazioneTarget5());
		//Date Target Punti di Facilitazione
		progetto.setNPuntiFacilitazioneDataTarget1(nuovoProgettoRequest.getNPuntiFacilitazioneDataTarget1());
		progetto.setNPuntiFacilitazioneDataTarget2(nuovoProgettoRequest.getNPuntiFacilitazioneDataTarget2());
		progetto.setNPuntiFacilitazioneDataTarget3(nuovoProgettoRequest.getNPuntiFacilitazioneDataTarget3());
		progetto.setNPuntiFacilitazioneDataTarget4(nuovoProgettoRequest.getNPuntiFacilitazioneDataTarget4());
		progetto.setNPuntiFacilitazioneDataTarget5(nuovoProgettoRequest.getNPuntiFacilitazioneDataTarget5());
		//Numero Target Utenti Unici
		progetto.setNUtentiUniciTarget1(nuovoProgettoRequest.getNUtentiUniciTarget1());
		progetto.setNUtentiUniciTarget2(nuovoProgettoRequest.getNUtentiUniciTarget2());
		progetto.setNUtentiUniciTarget3(nuovoProgettoRequest.getNUtentiUniciTarget3());
		progetto.setNUtentiUniciTarget4(nuovoProgettoRequest.getNUtentiUniciTarget4());
		progetto.setNUtentiUniciTarget5(nuovoProgettoRequest.getNUtentiUniciTarget5());
		//Date Target Utenti Unici
		progetto.setNUtentiUniciDataTarget1(nuovoProgettoRequest.getNUtentiUniciDataTarget1());
		progetto.setNUtentiUniciDataTarget2(nuovoProgettoRequest.getNUtentiUniciDataTarget2());
		progetto.setNUtentiUniciDataTarget3(nuovoProgettoRequest.getNUtentiUniciDataTarget3());
		progetto.setNUtentiUniciDataTarget4(nuovoProgettoRequest.getNUtentiUniciDataTarget4());
		progetto.setNUtentiUniciDataTarget5(nuovoProgettoRequest.getNUtentiUniciDataTarget5());
		//Numero Target Servizi
		progetto.setNServiziTarget1(nuovoProgettoRequest.getNServiziTarget1());
		progetto.setNServiziTarget2(nuovoProgettoRequest.getNServiziTarget2());
		progetto.setNServiziTarget3(nuovoProgettoRequest.getNServiziTarget3());
		progetto.setNServiziTarget4(nuovoProgettoRequest.getNServiziTarget4());
		progetto.setNServiziTarget5(nuovoProgettoRequest.getNServiziTarget5());
		//Date Target Servizi
		progetto.setNServiziDataTarget1(nuovoProgettoRequest.getNServiziDataTarget1());
		progetto.setNServiziDataTarget2(nuovoProgettoRequest.getNServiziDataTarget2());
		progetto.setNServiziDataTarget3(nuovoProgettoRequest.getNServiziDataTarget3());
		progetto.setNServiziDataTarget4(nuovoProgettoRequest.getNServiziDataTarget4());
		progetto.setNServiziDataTarget5(nuovoProgettoRequest.getNServiziDataTarget5());
		//Numero Target Facilitatori
		progetto.setNFacilitatoriTarget1(nuovoProgettoRequest.getNFacilitatoriTarget1());
		progetto.setNFacilitatoriTarget2(nuovoProgettoRequest.getNFacilitatoriTarget2());
		progetto.setNFacilitatoriTarget3(nuovoProgettoRequest.getNFacilitatoriTarget3());
		progetto.setNFacilitatoriTarget4(nuovoProgettoRequest.getNFacilitatoriTarget4());
		progetto.setNFacilitatoriTarget5(nuovoProgettoRequest.getNFacilitatoriTarget5());
		//Date Target Facilitatori
		progetto.setNFacilitatoriDataTarget1(nuovoProgettoRequest.getNFacilitatoriDataTarget1());
		progetto.setNFacilitatoriDataTarget2(nuovoProgettoRequest.getNFacilitatoriDataTarget2());
		progetto.setNFacilitatoriDataTarget3(nuovoProgettoRequest.getNFacilitatoriDataTarget3());
		progetto.setNFacilitatoriDataTarget4(nuovoProgettoRequest.getNFacilitatoriDataTarget4());
		progetto.setNFacilitatoriDataTarget5(nuovoProgettoRequest.getNFacilitatoriDataTarget5());
		return progetto;
	}

	public ProgettiLightResourcePaginati toProgettiLightResourcePaginataConContatoreFrom(Page<ProgettoEntity> paginaProgetti) {
		if(paginaProgetti == null) {
			return null;
		}
		List<ProgettoEntity> progetti = paginaProgetti.hasContent()? paginaProgetti.getContent(): Collections.emptyList();
		ProgettiLightResourcePaginati progettiLightResourcePaginata = new ProgettiLightResourcePaginati();
		progettiLightResourcePaginata.setListaProgettiLight(this.toLightResourceFrom(progetti));
		progettiLightResourcePaginata.setNumeroPagine(paginaProgetti.getTotalPages());
		return progettiLightResourcePaginata;
	}
	
	public ProgettoEntity toEntityFrom(@Valid ProgettoRequest nuovoProgettoRequest, Long idProgramma) {
		if(nuovoProgettoRequest == null) {
			return null;
		}
		ProgettoEntity progetto = new ProgettoEntity();
		progetto.setNome(nuovoProgettoRequest.getNome());		
		progetto.setNomeBreve(nuovoProgettoRequest.getNomeBreve());
		progetto.setCup(nuovoProgettoRequest.getCup());
		progetto.setDataInizioProgetto(nuovoProgettoRequest.getDataInizio());
		progetto.setDataFineProgetto(nuovoProgettoRequest.getDataFineProgetto());
		//Numero Target Punti di Facilitazione
		progetto.setNPuntiFacilitazioneTarget1(nuovoProgettoRequest.getNPuntiFacilitazioneTarget1());
		progetto.setNPuntiFacilitazioneTarget2(nuovoProgettoRequest.getNPuntiFacilitazioneTarget2());
		progetto.setNPuntiFacilitazioneTarget3(nuovoProgettoRequest.getNPuntiFacilitazioneTarget3());
		progetto.setNPuntiFacilitazioneTarget4(nuovoProgettoRequest.getNPuntiFacilitazioneTarget4());
		progetto.setNPuntiFacilitazioneTarget5(nuovoProgettoRequest.getNPuntiFacilitazioneTarget5());
		//Date Target Punti di Facilitazione
		progetto.setNPuntiFacilitazioneDataTarget1(nuovoProgettoRequest.getNPuntiFacilitazioneDataTarget1());
		progetto.setNPuntiFacilitazioneDataTarget2(nuovoProgettoRequest.getNPuntiFacilitazioneDataTarget2());
		progetto.setNPuntiFacilitazioneDataTarget3(nuovoProgettoRequest.getNPuntiFacilitazioneDataTarget3());
		progetto.setNPuntiFacilitazioneDataTarget4(nuovoProgettoRequest.getNPuntiFacilitazioneDataTarget4());
		progetto.setNPuntiFacilitazioneDataTarget5(nuovoProgettoRequest.getNPuntiFacilitazioneDataTarget5());
		//Numero Target Utenti Unici
		progetto.setNUtentiUniciTarget1(nuovoProgettoRequest.getNUtentiUniciTarget1());
		progetto.setNUtentiUniciTarget2(nuovoProgettoRequest.getNUtentiUniciTarget2());
		progetto.setNUtentiUniciTarget3(nuovoProgettoRequest.getNUtentiUniciTarget3());
		progetto.setNUtentiUniciTarget4(nuovoProgettoRequest.getNUtentiUniciTarget4());
		progetto.setNUtentiUniciTarget5(nuovoProgettoRequest.getNUtentiUniciTarget5());
		//Date Target Utenti Unici
		progetto.setNUtentiUniciDataTarget1(nuovoProgettoRequest.getNUtentiUniciDataTarget1());
		progetto.setNUtentiUniciDataTarget2(nuovoProgettoRequest.getNUtentiUniciDataTarget2());
		progetto.setNUtentiUniciDataTarget3(nuovoProgettoRequest.getNUtentiUniciDataTarget3());
		progetto.setNUtentiUniciDataTarget4(nuovoProgettoRequest.getNUtentiUniciDataTarget4());
		progetto.setNUtentiUniciDataTarget5(nuovoProgettoRequest.getNUtentiUniciDataTarget5());
		//Numero Target Servizi
		progetto.setNServiziTarget1(nuovoProgettoRequest.getNServiziTarget1());
		progetto.setNServiziTarget2(nuovoProgettoRequest.getNServiziTarget2());
		progetto.setNServiziTarget3(nuovoProgettoRequest.getNServiziTarget3());
		progetto.setNServiziTarget4(nuovoProgettoRequest.getNServiziTarget4());
		progetto.setNServiziTarget5(nuovoProgettoRequest.getNServiziTarget5());
		//Date Target Servizi
		progetto.setNServiziDataTarget1(nuovoProgettoRequest.getNServiziDataTarget1());
		progetto.setNServiziDataTarget2(nuovoProgettoRequest.getNServiziDataTarget2());
		progetto.setNServiziDataTarget3(nuovoProgettoRequest.getNServiziDataTarget3());
		progetto.setNServiziDataTarget4(nuovoProgettoRequest.getNServiziDataTarget4());
		progetto.setNServiziDataTarget5(nuovoProgettoRequest.getNServiziDataTarget5());
		//Numero Target Facilitatori
		progetto.setNFacilitatoriTarget1(nuovoProgettoRequest.getNFacilitatoriTarget1());
		progetto.setNFacilitatoriTarget2(nuovoProgettoRequest.getNFacilitatoriTarget2());
		progetto.setNFacilitatoriTarget3(nuovoProgettoRequest.getNFacilitatoriTarget3());
		progetto.setNFacilitatoriTarget4(nuovoProgettoRequest.getNFacilitatoriTarget4());
		progetto.setNFacilitatoriTarget5(nuovoProgettoRequest.getNFacilitatoriTarget5());
		//Date Target Facilitatori
		progetto.setNFacilitatoriDataTarget1(nuovoProgettoRequest.getNFacilitatoriDataTarget1());
		progetto.setNFacilitatoriDataTarget2(nuovoProgettoRequest.getNFacilitatoriDataTarget2());
		progetto.setNFacilitatoriDataTarget3(nuovoProgettoRequest.getNFacilitatoriDataTarget3());
		progetto.setNFacilitatoriDataTarget4(nuovoProgettoRequest.getNFacilitatoriDataTarget4());
		progetto.setNFacilitatoriDataTarget5(nuovoProgettoRequest.getNFacilitatoriDataTarget5());
		ProgrammaEntity programma = this.programmaService.getProgrammaById(idProgramma);
		progetto.setProgramma(programma);
		return progetto;
	}

	public ProgettoEntity toEntityFrom(ProgettoRequest progettoRequest, ProgettoEntity progettoFetch) {
		progettoFetch.setNome(progettoRequest.getNome());
		progettoFetch.setNomeBreve(progettoRequest.getNomeBreve());
		progettoFetch.setCup(progettoRequest.getCup());
		progettoFetch.setDataInizioProgetto(progettoRequest.getDataInizio());
		progettoFetch.setDataFineProgetto(progettoRequest.getDataFineProgetto());
		//Numero Target Punti di Facilitazione
		progettoFetch.setNPuntiFacilitazioneTarget1(progettoRequest.getNPuntiFacilitazioneTarget1());
		progettoFetch.setNPuntiFacilitazioneTarget2(progettoRequest.getNPuntiFacilitazioneTarget2());
		progettoFetch.setNPuntiFacilitazioneTarget3(progettoRequest.getNPuntiFacilitazioneTarget3());
		progettoFetch.setNPuntiFacilitazioneTarget4(progettoRequest.getNPuntiFacilitazioneTarget4());
		progettoFetch.setNPuntiFacilitazioneTarget5(progettoRequest.getNPuntiFacilitazioneTarget5());
		//Date Target Punti di Facilitazione
		progettoFetch.setNPuntiFacilitazioneDataTarget1(progettoRequest.getNPuntiFacilitazioneDataTarget1());
		progettoFetch.setNPuntiFacilitazioneDataTarget2(progettoRequest.getNPuntiFacilitazioneDataTarget2());
		progettoFetch.setNPuntiFacilitazioneDataTarget3(progettoRequest.getNPuntiFacilitazioneDataTarget3());
		progettoFetch.setNPuntiFacilitazioneDataTarget4(progettoRequest.getNPuntiFacilitazioneDataTarget4());
		progettoFetch.setNPuntiFacilitazioneDataTarget5(progettoRequest.getNPuntiFacilitazioneDataTarget5());
		//Numero Target Utenti Unici
		progettoFetch.setNUtentiUniciTarget1(progettoRequest.getNUtentiUniciTarget1());
		progettoFetch.setNUtentiUniciTarget2(progettoRequest.getNUtentiUniciTarget2());
		progettoFetch.setNUtentiUniciTarget3(progettoRequest.getNUtentiUniciTarget3());
		progettoFetch.setNUtentiUniciTarget4(progettoRequest.getNUtentiUniciTarget4());
		progettoFetch.setNUtentiUniciTarget5(progettoRequest.getNUtentiUniciTarget5());
		//Date Target Utenti Unici
		progettoFetch.setNUtentiUniciDataTarget1(progettoRequest.getNUtentiUniciDataTarget1());
		progettoFetch.setNUtentiUniciDataTarget2(progettoRequest.getNUtentiUniciDataTarget2());
		progettoFetch.setNUtentiUniciDataTarget3(progettoRequest.getNUtentiUniciDataTarget3());
		progettoFetch.setNUtentiUniciDataTarget4(progettoRequest.getNUtentiUniciDataTarget4());
		progettoFetch.setNUtentiUniciDataTarget5(progettoRequest.getNUtentiUniciDataTarget5());
		//Numero Target Servizi
		progettoFetch.setNServiziTarget1(progettoRequest.getNServiziTarget1());
		progettoFetch.setNServiziTarget2(progettoRequest.getNServiziTarget2());
		progettoFetch.setNServiziTarget3(progettoRequest.getNServiziTarget3());
		progettoFetch.setNServiziTarget4(progettoRequest.getNServiziTarget4());
		progettoFetch.setNServiziTarget5(progettoRequest.getNServiziTarget5());
		//Date Target Servizi
		progettoFetch.setNServiziDataTarget1(progettoRequest.getNServiziDataTarget1());
		progettoFetch.setNServiziDataTarget2(progettoRequest.getNServiziDataTarget2());
		progettoFetch.setNServiziDataTarget3(progettoRequest.getNServiziDataTarget3());
		progettoFetch.setNServiziDataTarget4(progettoRequest.getNServiziDataTarget4());
		progettoFetch.setNServiziDataTarget5(progettoRequest.getNServiziDataTarget5());
		//Numero Target Facilitatori
		progettoFetch.setNFacilitatoriTarget1(progettoRequest.getNFacilitatoriTarget1());
		progettoFetch.setNFacilitatoriTarget2(progettoRequest.getNFacilitatoriTarget2());
		progettoFetch.setNFacilitatoriTarget3(progettoRequest.getNFacilitatoriTarget3());
		progettoFetch.setNFacilitatoriTarget4(progettoRequest.getNFacilitatoriTarget4());
		progettoFetch.setNFacilitatoriTarget5(progettoRequest.getNFacilitatoriTarget5());
		//Date Target Facilitatori
		progettoFetch.setNFacilitatoriDataTarget1(progettoRequest.getNFacilitatoriDataTarget1());
		progettoFetch.setNFacilitatoriDataTarget2(progettoRequest.getNFacilitatoriDataTarget2());
		progettoFetch.setNFacilitatoriDataTarget3(progettoRequest.getNFacilitatoriDataTarget3());
		progettoFetch.setNFacilitatoriDataTarget4(progettoRequest.getNFacilitatoriDataTarget4());
		progettoFetch.setNFacilitatoriDataTarget5(progettoRequest.getNFacilitatoriDataTarget5());
		return progettoFetch;
	}

	public DettaglioProgettoBean toDettaglioProgettoBeanFrom(ProgettoEntity progettoFetchDB) {
		
		DettaglioProgettoBean dettaglioProgetto = new DettaglioProgettoBean();
		
		dettaglioProgetto.setNome(progettoFetchDB.getNome());
		dettaglioProgetto.setNomeBreve(progettoFetchDB.getNomeBreve());
		dettaglioProgetto.setCup(progettoFetchDB.getCup());
		dettaglioProgetto.setDataInizio(progettoFetchDB.getDataInizioProgetto());
		dettaglioProgetto.setDataFine(progettoFetchDB.getDataFineProgetto());
		dettaglioProgetto.setStato(progettoFetchDB.getStato());
		//Numero Target Punti di Facilitazione
		dettaglioProgetto.setNPuntiFacilitazioneTarget1(progettoFetchDB.getNPuntiFacilitazioneTarget1());
		dettaglioProgetto.setNPuntiFacilitazioneTarget2(progettoFetchDB.getNPuntiFacilitazioneTarget2());
		dettaglioProgetto.setNPuntiFacilitazioneTarget3(progettoFetchDB.getNPuntiFacilitazioneTarget3());
		dettaglioProgetto.setNPuntiFacilitazioneTarget4(progettoFetchDB.getNPuntiFacilitazioneTarget4());
		dettaglioProgetto.setNPuntiFacilitazioneTarget5(progettoFetchDB.getNPuntiFacilitazioneTarget5());
		//Date Target Punti di Facilitazione
		dettaglioProgetto.setNPuntiFacilitazioneDataTarget1(progettoFetchDB.getNPuntiFacilitazioneDataTarget1());
		dettaglioProgetto.setNPuntiFacilitazioneDataTarget2(progettoFetchDB.getNPuntiFacilitazioneDataTarget2());
		dettaglioProgetto.setNPuntiFacilitazioneDataTarget3(progettoFetchDB.getNPuntiFacilitazioneDataTarget3());
		dettaglioProgetto.setNPuntiFacilitazioneDataTarget4(progettoFetchDB.getNPuntiFacilitazioneDataTarget4());
		dettaglioProgetto.setNPuntiFacilitazioneDataTarget5(progettoFetchDB.getNPuntiFacilitazioneDataTarget5());
		//Numero Target Utenti Unici
		dettaglioProgetto.setNUtentiUniciTarget1(progettoFetchDB.getNUtentiUniciTarget1());
		dettaglioProgetto.setNUtentiUniciTarget2(progettoFetchDB.getNUtentiUniciTarget2());
		dettaglioProgetto.setNUtentiUniciTarget3(progettoFetchDB.getNUtentiUniciTarget3());
		dettaglioProgetto.setNUtentiUniciTarget4(progettoFetchDB.getNUtentiUniciTarget4());
		dettaglioProgetto.setNUtentiUniciTarget5(progettoFetchDB.getNUtentiUniciTarget5());
		//Date Target Utenti Unici
		dettaglioProgetto.setNUtentiUniciDataTarget1(progettoFetchDB.getNUtentiUniciDataTarget1());
		dettaglioProgetto.setNUtentiUniciDataTarget2(progettoFetchDB.getNUtentiUniciDataTarget2());
		dettaglioProgetto.setNUtentiUniciDataTarget3(progettoFetchDB.getNUtentiUniciDataTarget3());
		dettaglioProgetto.setNUtentiUniciDataTarget4(progettoFetchDB.getNUtentiUniciDataTarget4());
		dettaglioProgetto.setNUtentiUniciDataTarget5(progettoFetchDB.getNUtentiUniciDataTarget5());
		//Numero Target Servizi
		dettaglioProgetto.setNServiziTarget1(progettoFetchDB.getNServiziTarget1());
		dettaglioProgetto.setNServiziTarget2(progettoFetchDB.getNServiziTarget2());
		dettaglioProgetto.setNServiziTarget3(progettoFetchDB.getNServiziTarget3());
		dettaglioProgetto.setNServiziTarget4(progettoFetchDB.getNServiziTarget4());
		dettaglioProgetto.setNServiziTarget5(progettoFetchDB.getNServiziTarget5());
		//Date Target Servizi
		dettaglioProgetto.setNServiziDataTarget1(progettoFetchDB.getNServiziDataTarget1());
		dettaglioProgetto.setNServiziDataTarget2(progettoFetchDB.getNServiziDataTarget2());
		dettaglioProgetto.setNServiziDataTarget3(progettoFetchDB.getNServiziDataTarget3());
		dettaglioProgetto.setNServiziDataTarget4(progettoFetchDB.getNServiziDataTarget4());
		dettaglioProgetto.setNServiziDataTarget5(progettoFetchDB.getNServiziDataTarget5());
		//Numero Target Facilitatori
		dettaglioProgetto.setNFacilitatoriTarget1(progettoFetchDB.getNFacilitatoriTarget1());
		dettaglioProgetto.setNFacilitatoriTarget2(progettoFetchDB.getNFacilitatoriTarget2());
		dettaglioProgetto.setNFacilitatoriTarget3(progettoFetchDB.getNFacilitatoriTarget3());
		dettaglioProgetto.setNFacilitatoriTarget4(progettoFetchDB.getNFacilitatoriTarget4());
		dettaglioProgetto.setNFacilitatoriTarget5(progettoFetchDB.getNFacilitatoriTarget5());
		//Date Target Facilitatori
		dettaglioProgetto.setNFacilitatoriDataTarget1(progettoFetchDB.getNFacilitatoriDataTarget1());
		dettaglioProgetto.setNFacilitatoriDataTarget2(progettoFetchDB.getNFacilitatoriDataTarget2());
		dettaglioProgetto.setNFacilitatoriDataTarget3(progettoFetchDB.getNFacilitatoriDataTarget3());
		dettaglioProgetto.setNFacilitatoriDataTarget4(progettoFetchDB.getNFacilitatoriDataTarget4());
		dettaglioProgetto.setNFacilitatoriDataTarget5(progettoFetchDB.getNFacilitatoriDataTarget5());
		
		return dettaglioProgetto;
	}
}