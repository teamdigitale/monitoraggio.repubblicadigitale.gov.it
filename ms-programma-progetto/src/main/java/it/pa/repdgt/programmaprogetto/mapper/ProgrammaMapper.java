package it.pa.repdgt.programmaprogetto.mapper;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;

import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;
import org.springframework.validation.annotation.Validated;

import it.pa.repdgt.programmaprogetto.bean.DettaglioProgrammaBean;
import it.pa.repdgt.programmaprogetto.request.ProgrammaRequest;
import it.pa.repdgt.programmaprogetto.resource.ProgrammaDropdownResource;
import it.pa.repdgt.programmaprogetto.resource.ProgrammaLightResource;
import it.pa.repdgt.programmaprogetto.resource.ProgrammiLightResourcePaginata;
import it.pa.repdgt.shared.entity.ProgrammaEntity;

@Component
@Validated
public class ProgrammaMapper {

	public ProgrammaLightResource toLightResourceFrom(ProgrammaEntity programmaEntity) {
		if(programmaEntity == null) {
			return null;
		}
		
		ProgrammaLightResource programmaLightResource  = new ProgrammaLightResource();
		programmaLightResource.setId(programmaEntity.getId());
		programmaLightResource.setNome(programmaEntity.getNomeBreve());
		programmaLightResource.setNomeBreve(programmaEntity.getNomeBreve());
		programmaLightResource.setStato(programmaEntity.getStato());
		programmaLightResource.setPolicy(programmaEntity.getPolicy());
		programmaLightResource.setNomeEnteGestore(programmaEntity.getEnteGestoreProgramma() != null ? programmaEntity.getEnteGestoreProgramma().getNome() : "");
		return programmaLightResource;
	}
	
	public List<ProgrammaLightResource> toLightResourceFrom(List<ProgrammaEntity> programmiEntity) {
		if(programmiEntity == null) {
			return null;
		}
	
		List<ProgrammaLightResource> programmiLightResource = programmiEntity
													.stream()
													.map(this::toLightResourceFrom)
													.collect(Collectors.toList());
		return programmiLightResource;
	}
	
	public ProgrammaEntity toEntityFrom(
			@NotNull(message = "Non posso convertire una request null in entity") 
			@Valid ProgrammaRequest nuovoProgrammaRequest) {
		ProgrammaEntity programma = new ProgrammaEntity();
		programma.setNome(nuovoProgrammaRequest.getNome());
		programma.setNomeBreve(nuovoProgrammaRequest.getNomeBreve());
		programma.setPolicy(nuovoProgrammaRequest.getPolicy());
		programma.setDataInizioProgramma(nuovoProgrammaRequest.getDataInizio());
		programma.setDataFineProgramma(nuovoProgrammaRequest.getDataFine());
		programma.setBando(nuovoProgrammaRequest.getBando());
		programma.setCup(nuovoProgrammaRequest.getCup());
		//Numero Target Punti di Facilitazione
		programma.setNPuntiFacilitazioneTarget1(nuovoProgrammaRequest.getNPuntiFacilitazioneTarget1());
		programma.setNPuntiFacilitazioneTarget2(nuovoProgrammaRequest.getNPuntiFacilitazioneTarget2());
		programma.setNPuntiFacilitazioneTarget3(nuovoProgrammaRequest.getNPuntiFacilitazioneTarget3());
		programma.setNPuntiFacilitazioneTarget4(nuovoProgrammaRequest.getNPuntiFacilitazioneTarget4());
		programma.setNPuntiFacilitazioneTarget5(nuovoProgrammaRequest.getNPuntiFacilitazioneTarget5());
		//Date Target Punti di Facilitazione
		programma.setNPuntiFacilitazioneDataTarget1(nuovoProgrammaRequest.getNPuntiFacilitazioneDataTarget1());
		programma.setNPuntiFacilitazioneDataTarget2(nuovoProgrammaRequest.getNPuntiFacilitazioneDataTarget2());
		programma.setNPuntiFacilitazioneDataTarget3(nuovoProgrammaRequest.getNPuntiFacilitazioneDataTarget3());
		programma.setNPuntiFacilitazioneDataTarget4(nuovoProgrammaRequest.getNPuntiFacilitazioneDataTarget4());
		programma.setNPuntiFacilitazioneDataTarget5(nuovoProgrammaRequest.getNPuntiFacilitazioneDataTarget5());
		//Numero Target Utenti Unici
		programma.setNUtentiUniciTarget1(nuovoProgrammaRequest.getNUtentiUniciTarget1());
		programma.setNUtentiUniciTarget2(nuovoProgrammaRequest.getNUtentiUniciTarget2());
		programma.setNUtentiUniciTarget3(nuovoProgrammaRequest.getNUtentiUniciTarget3());
		programma.setNUtentiUniciTarget4(nuovoProgrammaRequest.getNUtentiUniciTarget4());
		programma.setNUtentiUniciTarget5(nuovoProgrammaRequest.getNUtentiUniciTarget5());
		//Date Target Utenti Unici
		programma.setNUtentiUniciDataTarget1(nuovoProgrammaRequest.getNUtentiUniciDataTarget1());
		programma.setNUtentiUniciDataTarget2(nuovoProgrammaRequest.getNUtentiUniciDataTarget2());
		programma.setNUtentiUniciDataTarget3(nuovoProgrammaRequest.getNUtentiUniciDataTarget3());
		programma.setNUtentiUniciDataTarget4(nuovoProgrammaRequest.getNUtentiUniciDataTarget4());
		programma.setNUtentiUniciDataTarget5(nuovoProgrammaRequest.getNUtentiUniciDataTarget5());
		//Numero Target Servizi
		programma.setNServiziTarget1(nuovoProgrammaRequest.getNServiziTarget1());
		programma.setNServiziTarget2(nuovoProgrammaRequest.getNServiziTarget2());
		programma.setNServiziTarget3(nuovoProgrammaRequest.getNServiziTarget3());
		programma.setNServiziTarget4(nuovoProgrammaRequest.getNServiziTarget4());
		programma.setNServiziTarget5(nuovoProgrammaRequest.getNServiziTarget5());
		//Date Target Servizi
		programma.setNServiziDataTarget1(nuovoProgrammaRequest.getNServiziDataTarget1());
		programma.setNServiziDataTarget2(nuovoProgrammaRequest.getNServiziDataTarget2());
		programma.setNServiziDataTarget3(nuovoProgrammaRequest.getNServiziDataTarget3());
		programma.setNServiziDataTarget4(nuovoProgrammaRequest.getNServiziDataTarget4());
		programma.setNServiziDataTarget5(nuovoProgrammaRequest.getNServiziDataTarget5());
		//Numero Target Facilitatori
		programma.setNFacilitatoriTarget1(nuovoProgrammaRequest.getNFacilitatoriTarget1());
		programma.setNFacilitatoriTarget2(nuovoProgrammaRequest.getNFacilitatoriTarget2());
		programma.setNFacilitatoriTarget3(nuovoProgrammaRequest.getNFacilitatoriTarget3());
		programma.setNFacilitatoriTarget4(nuovoProgrammaRequest.getNFacilitatoriTarget4());
		programma.setNFacilitatoriTarget5(nuovoProgrammaRequest.getNFacilitatoriTarget5());
		//Date Target Facilitatori
		programma.setNFacilitatoriDataTarget1(nuovoProgrammaRequest.getNFacilitatoriDataTarget1());
		programma.setNFacilitatoriDataTarget2(nuovoProgrammaRequest.getNFacilitatoriDataTarget2());
		programma.setNFacilitatoriDataTarget3(nuovoProgrammaRequest.getNFacilitatoriDataTarget3());
		programma.setNFacilitatoriDataTarget4(nuovoProgrammaRequest.getNFacilitatoriDataTarget4());
		programma.setNFacilitatoriDataTarget5(nuovoProgrammaRequest.getNFacilitatoriDataTarget5());
		return programma;
	}
	
	public ProgrammiLightResourcePaginata toProgrammiLightResourcePaginataFrom(Page<ProgrammaEntity> paginaProgrammi) {
		if(paginaProgrammi == null) {
			return null;
		}
		List<ProgrammaEntity> programmi = paginaProgrammi.hasContent()? paginaProgrammi.getContent(): Collections.emptyList();
		ProgrammiLightResourcePaginata programmiLightResourcePaginata = new ProgrammiLightResourcePaginata();
		programmiLightResourcePaginata.setListaProgrammiLight(this.toLightResourceFrom(programmi));
		programmiLightResourcePaginata.setNumeroPagine(paginaProgrammi.getTotalPages());
		return programmiLightResourcePaginata;
	}

	public List<ProgrammaDropdownResource> toLightDropdownResourceFrom(List<ProgrammaEntity> programmiEntity) {
		if(programmiEntity == null) {
			return null;
		}
	
		List<ProgrammaDropdownResource> programmiLightDropdownResource = programmiEntity
										.stream()
										.map(programmaEntity -> {
											ProgrammaDropdownResource programmaLightDropdownResource = new ProgrammaDropdownResource();
											programmaLightDropdownResource.setId(programmaEntity.getId());
											programmaLightDropdownResource.setNome(programmaEntity.getNome());
											return programmaLightDropdownResource;
										})
										.collect(Collectors.toList());
				
		return programmiLightDropdownResource;
	}

	public ProgrammaEntity toEntityFrom(ProgrammaRequest programmaRequest, ProgrammaEntity programmaFetch) {
		programmaFetch.setNome(programmaRequest.getNome());
		programmaFetch.setNomeBreve(programmaRequest.getNomeBreve());
		programmaFetch.setPolicy(programmaRequest.getPolicy());
		programmaFetch.setDataInizioProgramma(programmaRequest.getDataInizio());
		programmaFetch.setDataFineProgramma(programmaRequest.getDataFine());
		programmaFetch.setBando(programmaRequest.getBando());
		programmaFetch.setCup(programmaRequest.getCup());
		//Numero Target Punti di Facilitazione
		programmaFetch.setNPuntiFacilitazioneTarget1(programmaRequest.getNPuntiFacilitazioneTarget1());
		programmaFetch.setNPuntiFacilitazioneTarget2(programmaRequest.getNPuntiFacilitazioneTarget2());
		programmaFetch.setNPuntiFacilitazioneTarget3(programmaRequest.getNPuntiFacilitazioneTarget3());
		programmaFetch.setNPuntiFacilitazioneTarget4(programmaRequest.getNPuntiFacilitazioneTarget4());
		programmaFetch.setNPuntiFacilitazioneTarget5(programmaRequest.getNPuntiFacilitazioneTarget5());
		//Date Target Punti di Facilitazione
		programmaFetch.setNPuntiFacilitazioneDataTarget1(programmaRequest.getNPuntiFacilitazioneDataTarget1());
		programmaFetch.setNPuntiFacilitazioneDataTarget2(programmaRequest.getNPuntiFacilitazioneDataTarget2());
		programmaFetch.setNPuntiFacilitazioneDataTarget3(programmaRequest.getNPuntiFacilitazioneDataTarget3());
		programmaFetch.setNPuntiFacilitazioneDataTarget4(programmaRequest.getNPuntiFacilitazioneDataTarget4());
		programmaFetch.setNPuntiFacilitazioneDataTarget5(programmaRequest.getNPuntiFacilitazioneDataTarget5());
		//Numero Target Utenti Unici
		programmaFetch.setNUtentiUniciTarget1(programmaRequest.getNUtentiUniciTarget1());
		programmaFetch.setNUtentiUniciTarget2(programmaRequest.getNUtentiUniciTarget2());
		programmaFetch.setNUtentiUniciTarget3(programmaRequest.getNUtentiUniciTarget3());
		programmaFetch.setNUtentiUniciTarget4(programmaRequest.getNUtentiUniciTarget4());
		programmaFetch.setNUtentiUniciTarget5(programmaRequest.getNUtentiUniciTarget5());
		//Date Target Utenti Unici
		programmaFetch.setNUtentiUniciDataTarget1(programmaRequest.getNUtentiUniciDataTarget1());
		programmaFetch.setNUtentiUniciDataTarget2(programmaRequest.getNUtentiUniciDataTarget2());
		programmaFetch.setNUtentiUniciDataTarget3(programmaRequest.getNUtentiUniciDataTarget3());
		programmaFetch.setNUtentiUniciDataTarget4(programmaRequest.getNUtentiUniciDataTarget4());
		programmaFetch.setNUtentiUniciDataTarget5(programmaRequest.getNUtentiUniciDataTarget5());
		//Numero Target Servizi
		programmaFetch.setNServiziTarget1(programmaRequest.getNServiziTarget1());
		programmaFetch.setNServiziTarget2(programmaRequest.getNServiziTarget2());
		programmaFetch.setNServiziTarget3(programmaRequest.getNServiziTarget3());
		programmaFetch.setNServiziTarget4(programmaRequest.getNServiziTarget4());
		programmaFetch.setNServiziTarget5(programmaRequest.getNServiziTarget5());
		//Date Target Servizi
		programmaFetch.setNServiziDataTarget1(programmaRequest.getNServiziDataTarget1());
		programmaFetch.setNServiziDataTarget2(programmaRequest.getNServiziDataTarget2());
		programmaFetch.setNServiziDataTarget3(programmaRequest.getNServiziDataTarget3());
		programmaFetch.setNServiziDataTarget4(programmaRequest.getNServiziDataTarget4());
		programmaFetch.setNServiziDataTarget5(programmaRequest.getNServiziDataTarget5());
		//Numero Target Facilitatori
		programmaFetch.setNFacilitatoriTarget1(programmaRequest.getNFacilitatoriTarget1());
		programmaFetch.setNFacilitatoriTarget2(programmaRequest.getNFacilitatoriTarget2());
		programmaFetch.setNFacilitatoriTarget3(programmaRequest.getNFacilitatoriTarget3());
		programmaFetch.setNFacilitatoriTarget4(programmaRequest.getNFacilitatoriTarget4());
		programmaFetch.setNFacilitatoriTarget5(programmaRequest.getNFacilitatoriTarget5());
		//Date Target Facilitatori
		programmaFetch.setNFacilitatoriDataTarget1(programmaRequest.getNFacilitatoriDataTarget1());
		programmaFetch.setNFacilitatoriDataTarget2(programmaRequest.getNFacilitatoriDataTarget2());
		programmaFetch.setNFacilitatoriDataTarget3(programmaRequest.getNFacilitatoriDataTarget3());
		programmaFetch.setNFacilitatoriDataTarget4(programmaRequest.getNFacilitatoriDataTarget4());
		programmaFetch.setNFacilitatoriDataTarget5(programmaRequest.getNFacilitatoriDataTarget5());
		return programmaFetch;
	}

	public DettaglioProgrammaBean toDettaglioProgrammaBeanFrom(ProgrammaEntity programmaFetchDB) {
		DettaglioProgrammaBean dettaglioProgramma = new DettaglioProgrammaBean();
		
		dettaglioProgramma.setNome(programmaFetchDB.getNome());
		dettaglioProgramma.setNomeBreve(programmaFetchDB.getNomeBreve());
		dettaglioProgramma.setDataInizio(programmaFetchDB.getDataInizioProgramma());
		dettaglioProgramma.setDataFine(programmaFetchDB.getDataFineProgramma());
		dettaglioProgramma.setBando(programmaFetchDB.getBando());
		dettaglioProgramma.setCup(programmaFetchDB.getCup());
		dettaglioProgramma.setStato(programmaFetchDB.getStato());
		dettaglioProgramma.setPolicy(programmaFetchDB.getPolicy().toString());
		//Numero Target Punti di Facilitazione
		dettaglioProgramma.setNPuntiFacilitazioneTarget1(programmaFetchDB.getNPuntiFacilitazioneTarget1());
		dettaglioProgramma.setNPuntiFacilitazioneTarget2(programmaFetchDB.getNPuntiFacilitazioneTarget2());
		dettaglioProgramma.setNPuntiFacilitazioneTarget3(programmaFetchDB.getNPuntiFacilitazioneTarget3());
		dettaglioProgramma.setNPuntiFacilitazioneTarget4(programmaFetchDB.getNPuntiFacilitazioneTarget4());
		dettaglioProgramma.setNPuntiFacilitazioneTarget5(programmaFetchDB.getNPuntiFacilitazioneTarget5());
		//Date Target Punti di Facilitazione
		dettaglioProgramma.setNPuntiFacilitazioneDataTarget1(programmaFetchDB.getNPuntiFacilitazioneDataTarget1());
		dettaglioProgramma.setNPuntiFacilitazioneDataTarget2(programmaFetchDB.getNPuntiFacilitazioneDataTarget2());
		dettaglioProgramma.setNPuntiFacilitazioneDataTarget3(programmaFetchDB.getNPuntiFacilitazioneDataTarget3());
		dettaglioProgramma.setNPuntiFacilitazioneDataTarget4(programmaFetchDB.getNPuntiFacilitazioneDataTarget4());
		dettaglioProgramma.setNPuntiFacilitazioneDataTarget5(programmaFetchDB.getNPuntiFacilitazioneDataTarget5());
		//Numero Target Utenti Unici
		dettaglioProgramma.setNUtentiUniciTarget1(programmaFetchDB.getNUtentiUniciTarget1());
		dettaglioProgramma.setNUtentiUniciTarget2(programmaFetchDB.getNUtentiUniciTarget2());
		dettaglioProgramma.setNUtentiUniciTarget3(programmaFetchDB.getNUtentiUniciTarget3());
		dettaglioProgramma.setNUtentiUniciTarget4(programmaFetchDB.getNUtentiUniciTarget4());
		dettaglioProgramma.setNUtentiUniciTarget5(programmaFetchDB.getNUtentiUniciTarget5());
		//Date Target Utenti Unici
		dettaglioProgramma.setNUtentiUniciDataTarget1(programmaFetchDB.getNUtentiUniciDataTarget1());
		dettaglioProgramma.setNUtentiUniciDataTarget2(programmaFetchDB.getNUtentiUniciDataTarget2());
		dettaglioProgramma.setNUtentiUniciDataTarget3(programmaFetchDB.getNUtentiUniciDataTarget3());
		dettaglioProgramma.setNUtentiUniciDataTarget4(programmaFetchDB.getNUtentiUniciDataTarget4());
		dettaglioProgramma.setNUtentiUniciDataTarget5(programmaFetchDB.getNUtentiUniciDataTarget5());
		//Numero Target Servizi
		dettaglioProgramma.setNServiziTarget1(programmaFetchDB.getNServiziTarget1());
		dettaglioProgramma.setNServiziTarget2(programmaFetchDB.getNServiziTarget2());
		dettaglioProgramma.setNServiziTarget3(programmaFetchDB.getNServiziTarget3());
		dettaglioProgramma.setNServiziTarget4(programmaFetchDB.getNServiziTarget4());
		dettaglioProgramma.setNServiziTarget5(programmaFetchDB.getNServiziTarget5());
		//Date Target Servizi
		dettaglioProgramma.setNServiziDataTarget1(programmaFetchDB.getNServiziDataTarget1());
		dettaglioProgramma.setNServiziDataTarget2(programmaFetchDB.getNServiziDataTarget2());
		dettaglioProgramma.setNServiziDataTarget3(programmaFetchDB.getNServiziDataTarget3());
		dettaglioProgramma.setNServiziDataTarget4(programmaFetchDB.getNServiziDataTarget4());
		dettaglioProgramma.setNServiziDataTarget5(programmaFetchDB.getNServiziDataTarget5());
		//Numero Target Facilitatori
		dettaglioProgramma.setNFacilitatoriTarget1(programmaFetchDB.getNFacilitatoriTarget1());
		dettaglioProgramma.setNFacilitatoriTarget2(programmaFetchDB.getNFacilitatoriTarget2());
		dettaglioProgramma.setNFacilitatoriTarget3(programmaFetchDB.getNFacilitatoriTarget3());
		dettaglioProgramma.setNFacilitatoriTarget4(programmaFetchDB.getNFacilitatoriTarget4());
		dettaglioProgramma.setNFacilitatoriTarget5(programmaFetchDB.getNFacilitatoriTarget5());
		//Date Target Facilitatori
		dettaglioProgramma.setNFacilitatoriDataTarget1(programmaFetchDB.getNFacilitatoriDataTarget1());
		dettaglioProgramma.setNFacilitatoriDataTarget2(programmaFetchDB.getNFacilitatoriDataTarget2());
		dettaglioProgramma.setNFacilitatoriDataTarget3(programmaFetchDB.getNFacilitatoriDataTarget3());
		dettaglioProgramma.setNFacilitatoriDataTarget4(programmaFetchDB.getNFacilitatoriDataTarget4());
		dettaglioProgramma.setNFacilitatoriDataTarget5(programmaFetchDB.getNFacilitatoriDataTarget5());
		
		return dettaglioProgramma;
	}
}