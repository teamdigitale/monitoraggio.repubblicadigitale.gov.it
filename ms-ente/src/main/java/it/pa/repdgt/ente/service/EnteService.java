package it.pa.repdgt.ente.service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import javax.transaction.Transactional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

import it.pa.repdgt.ente.bean.DettaglioEnteBean;
import it.pa.repdgt.ente.bean.DettaglioProfiliBean;
import it.pa.repdgt.ente.bean.SchedaEnteBean;
import it.pa.repdgt.ente.bean.SchedaEnteGestoreBean;
import it.pa.repdgt.ente.bean.SchedaEnteGestoreProgettoBean;
import it.pa.repdgt.ente.bean.SedeBean;
import it.pa.repdgt.ente.dto.EnteDto;
import it.pa.repdgt.ente.dto.ProgettoDto;
import it.pa.repdgt.ente.dto.ProgrammaDto;
import it.pa.repdgt.ente.entity.projection.AllEntiProjection;
import it.pa.repdgt.ente.entity.projection.EnteProjection;
import it.pa.repdgt.ente.entity.projection.UtenteProjection;
import it.pa.repdgt.ente.exception.EnteException;
import it.pa.repdgt.ente.exception.ResourceNotFoundException;
import it.pa.repdgt.ente.repository.EnteRepository;
import it.pa.repdgt.ente.request.FiltroRequest;
import it.pa.repdgt.ente.request.ReferenteDelegatoGestoreProgettoRequest;
import it.pa.repdgt.ente.request.ReferenteDelegatoGestoreProgrammaRequest;
import it.pa.repdgt.ente.restapi.param.EntiPaginatiParam;
import it.pa.repdgt.shared.annotation.LogExecutionTime;
import it.pa.repdgt.shared.annotation.LogMethod;
import it.pa.repdgt.shared.awsintegration.service.EmailService;
import it.pa.repdgt.shared.entity.EnteEntity;
import it.pa.repdgt.shared.entity.EntePartnerEntity;
import it.pa.repdgt.shared.entity.EnteSedeProgetto;
import it.pa.repdgt.shared.entity.EnteSedeProgettoFacilitatoreEntity;
import it.pa.repdgt.shared.entity.ProgettoEntity;
import it.pa.repdgt.shared.entity.ProgrammaEntity;
import it.pa.repdgt.shared.entity.ReferentiDelegatiEnteGestoreProgettoEntity;
import it.pa.repdgt.shared.entity.ReferentiDelegatiEnteGestoreProgrammaEntity;
import it.pa.repdgt.shared.entity.ReferentiDelegatiEntePartnerDiProgettoEntity;
import it.pa.repdgt.shared.entity.RuoloEntity;
import it.pa.repdgt.shared.entity.SedeEntity;
import it.pa.repdgt.shared.entity.UtenteEntity;
import it.pa.repdgt.shared.entity.UtenteXRuolo;
import it.pa.repdgt.shared.entity.key.EnteSedeProgettoFacilitatoreKey;
import it.pa.repdgt.shared.entity.key.ReferentiDelegatiEnteGestoreProgettoKey;
import it.pa.repdgt.shared.entity.key.ReferentiDelegatiEnteGestoreProgrammaKey;
import it.pa.repdgt.shared.entityenum.EmailTemplateEnum;
import it.pa.repdgt.shared.entityenum.PolicyEnum;
import it.pa.repdgt.shared.entityenum.RuoloUtenteEnum;
import it.pa.repdgt.shared.entityenum.StatoEnum;
import it.pa.repdgt.shared.exception.CodiceErroreEnum;
import it.pa.repdgt.shared.service.storico.StoricoService;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@Validated
public class EnteService {
	private static final String ID_PROGRAMMA = "ID_PROGRAMMA";
	private static final String NOME_PROGRAMMA = "NOME_PROGRAMMA";
	private static final String ID_PROGETTO = "ID_PROGETTO";
	private static final String NOME_PROGETTO = "NOME_PROGETTO";

	@Autowired
	private StoricoService storicoService;
	@Autowired
	private EnteSedeProgettoFacilitatoreService enteSedeProgettoFacilitatoreService;
	@Autowired
	private EnteSedeProgettoService enteSedeProgettoService;
	@Autowired
	private EntePartnerService entePartnerService;
	@Autowired
	private RuoloService ruoloService;
	@Autowired
	private ProgrammaService programmaService;
	@Autowired
	private ProgettoService progettoService;
	@Autowired
	private UtenteService utenteService;
	@Autowired
	private UtenteXRuoloService utenteXRuoloService;
	@Autowired
	private SedeService sedeService;
	@Autowired
	private ReferentiDelegatiEnteGestoreProgrammaService referentiDelegatiEnteGestoreProgrammaService;
	@Autowired
	private ReferentiDelegatiEnteGestoreProgettoService referentiDelegatiEnteGestoreProgettoService;
	@Autowired
	private ReferentiDelegatiEntePartnerDiProgettoService referentiDelegatiEntePartnerDiProgettoService;
	@Autowired 
	private EnteRepository enteRepository;
	@Autowired
	private EmailService emailService;
	
	/**
	 * @throws ResourceNotFoundException
	 * */
	@LogMethod
	@LogExecutionTime
	public EnteEntity getEnteById(Long idEnte) {
		String messaggioErrore = String.format("Ente con id=%s non presente", String.valueOf(idEnte));
		return this.enteRepository.findById(idEnte)
				.orElseThrow( () -> new ResourceNotFoundException(messaggioErrore, CodiceErroreEnum.C01));
	}
	
	/**
	 * @throws ResourceNotFoundException
	 * */
	@LogMethod
	@LogExecutionTime
	public EnteEntity getEnteByPartitaIva(String partitaIva) {
		String messaggioErrore = String.format("Ente con partita iva = %s non presente", partitaIva);
		return this.enteRepository.findByPartitaIva(partitaIva)
				.orElseThrow( () -> new ResourceNotFoundException(messaggioErrore, CodiceErroreEnum.C01) );
	}
	
	@LogMethod
	@LogExecutionTime
	public List<EnteEntity> getEntiByCriterioRicerca(String criterioRicerca) {
		return this.enteRepository.findByCriterioRicerca(criterioRicerca,"%"+criterioRicerca+"%");
	}
	
	@LogMethod
	@LogExecutionTime
	public Page<EnteDto> getAllEntiPaginati(
			EntiPaginatiParam entiPaginatiParam,
			Integer currPage, 
			Integer pageSize) {
		
		Pageable paginazione = PageRequest.of(currPage, pageSize);
		List<EnteDto> entiUtente = this.getAllEntiByCodiceRuoloAndIdProgramma(entiPaginatiParam);
		List<EnteDto> entiUtenteAggregati = this.aggregaEntiUguali(entiUtente);
		
		entiUtenteAggregati.sort((ente1, ente2) -> ente1.getNome().compareTo(ente2.getNome()));
		
		int start = (int) paginazione.getOffset();
		int end = Math.min((start + paginazione.getPageSize()), entiUtenteAggregati.size());
		
		if(start > end) {
			throw new EnteException("ERRORE: pagina richiesta inesistente", CodiceErroreEnum.G03);
		}
		
		return new PageImpl<EnteDto>(entiUtenteAggregati.subList(start, end), paginazione, entiUtenteAggregati.size());
	}

	@LogMethod
	@LogExecutionTime
	public List<String> getAllProfiliEntiDropdown(EntiPaginatiParam entiPaginatiParam) {
		List<String> profiliEnti = this.getAllEntiByCodiceRuoloAndIdProgramma(entiPaginatiParam)
									   .stream()
									   .map(EnteDto::getProfilo)
									   .distinct()
									   .collect(Collectors.toList());
		return profiliEnti;
	}
	
	@LogMethod
	@LogExecutionTime
	public List<ProgrammaDto> getAllProgrammiDropdown(EntiPaginatiParam entiPaginatiParam) {
		List<ProgrammaDto> programmiDropdown = this.getAllProgrammiDropdownByCodiceRuoloAndIdProgramma(entiPaginatiParam);
		return programmiDropdown;
	}
	
	@LogMethod
	@LogExecutionTime
	public List<ProgettoDto> getAllProgettiDropdown(EntiPaginatiParam entiPaginatiParam) {
		List<ProgettoDto> progettiDropdown = this.getAllProgettiDropdownByCodiceRuoloAndIdProgramma(entiPaginatiParam);
		return progettiDropdown;
	}

	@LogMethod
	@LogExecutionTime
	public List<EnteDto> getAllEntiByCodiceRuoloAndIdProgramma(EntiPaginatiParam entiPaginatiParam) {
		List<AllEntiProjection> resultSet;
		
		switch (entiPaginatiParam.getCodiceRuoloUtenteLoggato()) {
			case "DTD":
				 resultSet = this.getAllEntiFiltrati(entiPaginatiParam.getFiltroRequest());
				 break;
			case "DSCU":
				 resultSet = this.getAllEntiPerDSCUFiltrati(entiPaginatiParam.getFiltroRequest());
				 break;
			case "REG":
			case "DEG":
				resultSet = this.getAllEntiGestoreProgrammaByIdProgrammaFiltrati(entiPaginatiParam.getIdProgramma(), entiPaginatiParam.getFiltroRequest());
				break;
			case "REGP":
			case "DEGP":
				resultSet = this.getAllEntiGestoreProgetto(entiPaginatiParam);
				break;
			case "REPP":
			case "DEPP":
				resultSet = this.getAllEntiPartnerProgetto(entiPaginatiParam);
				break;
			default:
				resultSet = this.getAllEntiFiltrati(entiPaginatiParam.getFiltroRequest());
				break;
		}
		
		List<EnteDto> listaEntiDto = resultSet
			.stream()
			.map(record -> {
				EnteDto enteDto = new EnteDto();
				enteDto.setId(record.getIdEnte().toString());
				enteDto.setNome(record.getNomeEnte());
				enteDto.setTipologia(record.getTipologiaEnte());
				enteDto.setProfilo(record.getProfiloEnte());
				enteDto.setIdP(record.getIdp().toString());
				return enteDto;
		})
		.collect(Collectors.toList());
		
		return listaEntiDto;
	}
	
	@LogMethod
	@LogExecutionTime
	public List<EnteDto> aggregaEntiUguali(List<EnteDto> enti) {
		Set<EnteDto> setEntiAggregati = new HashSet<>();
		
		ArrayList<String> idEnti = new ArrayList<String>();
		for(EnteDto ente1: enti) {
			if(!idEnti.contains(ente1.getId())) {
				EnteDto res = ente1;

				for(EnteDto ente2: enti) {
					if(ente1.getId().equals(ente2.getId())) {
						if(!ente1.equals(ente2))
							res.setProfilo(res.getProfilo().concat(", ").concat(ente2.getProfilo()));
					}
				}
				idEnti.add(ente1.getId());
				setEntiAggregati.add(res);
			}	
		}

		return new ArrayList<EnteDto>(setEntiAggregati);
	}
	
	private List<ProgrammaDto> getAllProgrammiDropdownByCodiceRuoloAndIdProgramma(EntiPaginatiParam entiPaginatiParam) {
		List<Map<String, String>> resultSet;
		
		switch (entiPaginatiParam.getCodiceRuoloUtenteLoggato()) {
			case "DTD":
				 resultSet = this.getAllProgrammiFiltrati(entiPaginatiParam.getFiltroRequest());
				 break;
			case "DSCU":
				 resultSet = this.getAllProgrammiPerDSCUFiltrati(entiPaginatiParam.getFiltroRequest());
				 break;
			case "REG":
			case "DEG":
			case "REGP":
			case "DEGP":
			case "REPP":
			case "DEPP":
				resultSet = this.getProgrammaById(entiPaginatiParam.getIdProgramma());
				break;
			default:
				 resultSet = this.getAllProgrammiFiltrati(entiPaginatiParam.getFiltroRequest());
				break;
		}
		
		List<ProgrammaDto> listaProgrammiDto = resultSet
			.stream()
			.map(record -> {
				ProgrammaDto programmaDto = new ProgrammaDto();
				programmaDto.setId(String.valueOf(record.get(ID_PROGRAMMA)));
				programmaDto.setNome(record.get(NOME_PROGRAMMA));
				return programmaDto;
		})
		.collect(Collectors.toList());
		
		return listaProgrammiDto;
	}
	
	private List<ProgettoDto> getAllProgettiDropdownByCodiceRuoloAndIdProgramma(EntiPaginatiParam entiPaginatiParam) {
		List<Map<String, String>> resultSet;
		
		switch (entiPaginatiParam.getCodiceRuoloUtenteLoggato()) {
			case "DTD":
				 resultSet = this.getAllProgettiFiltrati(entiPaginatiParam.getFiltroRequest());
				 break;
			case "DSCU":
				 resultSet = this.getAllProgettiPerDSCUFiltrati(entiPaginatiParam.getFiltroRequest());
				 break;
			case "REG":
			case "DEG":
				 resultSet = this.getAllProgettiGestoreProgrammaByIdProgrammaFiltrati(entiPaginatiParam.getIdProgramma(), entiPaginatiParam.getFiltroRequest());
				 break;
			case "REGP":
			case "DEGP":
				 resultSet = this.getAllProgettiGestoreProgetto(entiPaginatiParam);
				 break;
			case "REPP":
			case "DEPP":
				 resultSet = this.getAllProgettiPartnerProgetto(entiPaginatiParam);
				 break;
			default:
				 resultSet = this.getAllProgettiFiltrati(entiPaginatiParam.getFiltroRequest());
				 break;
		}
		
		List<ProgettoDto> listaProgettiDto = resultSet
			.stream()
			.map(record -> {
				ProgettoDto progettoDto = new ProgettoDto();
				progettoDto.setId(String.valueOf(record.get(ID_PROGETTO)));
				progettoDto.setNome(record.get(NOME_PROGETTO));
				return progettoDto;
		})
		.collect(Collectors.toList());
		
		return listaProgettiDto;
	}
	
	@LogMethod
	@LogExecutionTime
	public List<AllEntiProjection> getAllEntiFiltrati(FiltroRequest filtro) {
		String criterioRicerca = filtro.getCriterioRicerca();
		List<String> idsProgrammi = filtro.getIdsProgrammi();
		List<String> idsProgetti =  filtro.getIdsProgetti();
		List<String> profiliEnteUpperCase = null;
		if(filtro != null && filtro.getProfili() != null){
			profiliEnteUpperCase = filtro.getProfili()
				.stream()
				.map(profilo -> profilo.toUpperCase())
				.collect(Collectors.toList());
		}
		String policy = null;
		return this.enteRepository.findAllEntiFiltrati(criterioRicerca, "%" + criterioRicerca + "%", idsProgrammi, idsProgetti, profiliEnteUpperCase, policy);
	}
	
	@LogMethod
	@LogExecutionTime
	public List<Map<String, String>> getAllProgrammiFiltrati(FiltroRequest filtro) {
		String criterioRicerca = filtro.getCriterioRicerca();
		List<String> idsProgrammi = filtro.getIdsProgrammi();
		List<String> idsProgetti =  filtro.getIdsProgetti();
		List<String> profiliEnteUpperCase = null;
		if(filtro != null && filtro.getProfili() != null){
			profiliEnteUpperCase = filtro.getProfili()
				.stream()
				.map(profilo -> profilo.toUpperCase())
				.collect(Collectors.toList());
		}
		String policy = null;
		return this.enteRepository.findAllProgrammiFiltrati(criterioRicerca, "%" + criterioRicerca + "%", idsProgrammi, idsProgetti, profiliEnteUpperCase, policy);
	}
	
	@LogMethod
	@LogExecutionTime
	public List<Map<String, String>> getAllProgettiFiltrati(FiltroRequest filtro) {
		String criterioRicerca = filtro.getCriterioRicerca();
		List<String> idsProgrammi = filtro.getIdsProgrammi();
		List<String> idsProgetti =  filtro.getIdsProgetti();
		List<String> profiliEnteUpperCase = null;
		if(filtro != null && filtro.getProfili() != null){
			profiliEnteUpperCase = filtro.getProfili()
				.stream()
				.map(profilo -> profilo.toUpperCase())
				.collect(Collectors.toList());
		}
		String policy = null;
		return this.enteRepository.findAllProgettiFiltrati(criterioRicerca, "%" + criterioRicerca + "%", idsProgrammi, idsProgetti, profiliEnteUpperCase, policy);
	}
	
	private List<AllEntiProjection> getAllEntiPerDSCUFiltrati(FiltroRequest filtro) {
		String criterioRicerca = filtro.getCriterioRicerca();
		List<String> idsProgrammi = filtro.getIdsProgrammi();
		List<String> idsProgetti = filtro.getIdsProgetti();
		List<String> profiliEnteUpperCase = null;
		if(filtro != null && filtro.getProfili() != null){
			profiliEnteUpperCase = filtro.getProfili()
				.stream()
				.map(profilo -> profilo.toUpperCase())
				.collect(Collectors.toList());
		}
		String policy = PolicyEnum.SCD.toString();
		return this.enteRepository.findAllEntiFiltrati(criterioRicerca, "%" + criterioRicerca + "%", idsProgrammi, idsProgetti, profiliEnteUpperCase, policy);
	}
	
	@LogMethod
	@LogExecutionTime
	public List<Map<String, String>> getAllProgrammiPerDSCUFiltrati(FiltroRequest filtro) {
		String criterioRicerca = filtro.getCriterioRicerca();
		List<String> idsProgrammi = filtro.getIdsProgrammi();
		List<String> idsProgetti =  filtro.getIdsProgetti();
		List<String> profiliEnteUpperCase = null;
		if(filtro != null && filtro.getProfili() != null){
			profiliEnteUpperCase = filtro.getProfili()
				.stream()
				.map(profilo -> profilo.toUpperCase())
				.collect(Collectors.toList());
		}
		String policy = PolicyEnum.SCD.toString();
		return this.enteRepository.findAllProgrammiFiltrati(criterioRicerca, "%" + criterioRicerca + "%", idsProgrammi, idsProgetti, profiliEnteUpperCase, policy);
	}
	
	@LogMethod
	@LogExecutionTime
	public List<Map<String, String>> getAllProgettiPerDSCUFiltrati(FiltroRequest filtro) {
		String criterioRicerca = filtro.getCriterioRicerca();
		List<String> idsProgrammi = filtro.getIdsProgrammi();
		List<String> idsProgetti =  filtro.getIdsProgetti();
		List<String> profiliEnteUpperCase = null;
		if(filtro != null && filtro.getProfili() != null){
			profiliEnteUpperCase = filtro.getProfili()
				.stream()
				.map(profilo -> profilo.toUpperCase())
				.collect(Collectors.toList());
		}
		String policy = PolicyEnum.SCD.toString();
		return this.enteRepository.findAllProgettiFiltrati(criterioRicerca, "%" + criterioRicerca + "%", idsProgrammi, idsProgetti, profiliEnteUpperCase, policy);
	}
	
	@LogMethod
	@LogExecutionTime
	private List<AllEntiProjection> getAllEntiGestoreProgrammaByIdProgrammaFiltrati(Long idProgramma, FiltroRequest filtro) {
		String criterioRicerca = filtro.getCriterioRicerca();
		List<String> idsProgrammi = Arrays.asList(String.valueOf(idProgramma));
		List<String> idsProgetti =  filtro.getIdsProgetti();
		List<String> profiliEnteUpperCase = null;
		if(filtro != null && filtro.getProfili() != null){
			profiliEnteUpperCase = filtro.getProfili()
				.stream()
				.map(profilo -> profilo.toUpperCase())
				.collect(Collectors.toList());
		}
		String policy = null;
		return this.enteRepository.findAllEntiFiltrati(criterioRicerca, "%" + criterioRicerca + "%", idsProgrammi, idsProgetti, profiliEnteUpperCase, policy);
	}
	
	@LogMethod
	@LogExecutionTime
	private List<Map<String, String>> getAllProgettiGestoreProgrammaByIdProgrammaFiltrati(Long idProgramma, FiltroRequest filtro) {
		String criterioRicerca = filtro.getCriterioRicerca();
		List<String> idsProgrammi = Arrays.asList(String.valueOf(idProgramma));
		List<String> idsProgetti =  filtro.getIdsProgetti();
		List<String> profiliEnteUpperCase = null;
		if(filtro != null && filtro.getProfili() != null){
			profiliEnteUpperCase = filtro.getProfili()
				.stream()
				.map(profilo -> profilo.toUpperCase())
				.collect(Collectors.toList());
		}
		String policy = null;
		return this.enteRepository.findAllProgettiFiltrati(criterioRicerca, "%" + criterioRicerca + "%", idsProgrammi, idsProgetti, profiliEnteUpperCase, policy);
	}
	
	private List<AllEntiProjection> getAllEntiGestoreProgetto(EntiPaginatiParam entiPaginatiParam) {
		String criterioRicerca =  entiPaginatiParam.getFiltroRequest() != null? entiPaginatiParam.getFiltroRequest().getCriterioRicerca(): null;
		List<String> idsProgrammi = Arrays.asList(String.valueOf(entiPaginatiParam.getIdProgramma()));
		List<String> idsProgetti =  Arrays.asList(String.valueOf(entiPaginatiParam.getIdProgetto()));
		
		List<String> profiliEnteUpperCase = null;
		if(entiPaginatiParam.getFiltroRequest() != null && entiPaginatiParam.getFiltroRequest().getProfili() != null){
			profiliEnteUpperCase = entiPaginatiParam.getFiltroRequest().getProfili()
				.stream()
				.map(profilo -> profilo.toUpperCase())
				.collect(Collectors.toList());	
		}
		String policy = null;
		return this.enteRepository.findAllEntiFiltrati(criterioRicerca, "%" + criterioRicerca + "%", idsProgrammi, idsProgetti, profiliEnteUpperCase, policy);
	}
	
	private List<Map<String, String>> getAllProgettiGestoreProgetto(EntiPaginatiParam entiPaginatiParam) {
		String criterioRicerca =  entiPaginatiParam.getFiltroRequest() != null? entiPaginatiParam.getFiltroRequest().getCriterioRicerca(): null;
		List<String> idsProgrammi = Arrays.asList(String.valueOf(entiPaginatiParam.getIdProgramma()));
		List<String> idsProgetti =  Arrays.asList(String.valueOf(entiPaginatiParam.getIdProgetto()));
		
		List<String> profiliEnteUpperCase = null;
		if(entiPaginatiParam.getFiltroRequest() != null && entiPaginatiParam.getFiltroRequest().getProfili() != null){
			profiliEnteUpperCase = entiPaginatiParam.getFiltroRequest().getProfili()
				.stream()
				.map(profilo -> profilo.toUpperCase())
				.collect(Collectors.toList());	
		}
		String policy = null;
		return this.enteRepository.findAllProgettiFiltrati(criterioRicerca, "%" + criterioRicerca + "%", idsProgrammi, idsProgetti, profiliEnteUpperCase, policy);
	}
	
	private List<AllEntiProjection> getAllEntiPartnerProgetto(EntiPaginatiParam entiPaginatiParam) {
		String criterioRicerca =  entiPaginatiParam.getFiltroRequest() != null? entiPaginatiParam.getFiltroRequest().getCriterioRicerca(): null;
		List<String> idsProgrammi = Arrays.asList(String.valueOf(entiPaginatiParam.getIdProgramma()));
		List<String> idsProgetti =  Arrays.asList(String.valueOf(entiPaginatiParam.getIdProgetto()));
		
		List<String> profiliEnteUpperCase = null;
		if(entiPaginatiParam.getFiltroRequest() != null && entiPaginatiParam.getFiltroRequest().getProfili() != null){
			profiliEnteUpperCase = entiPaginatiParam.getFiltroRequest().getProfili()
				.stream()
				.map(profilo -> profilo.toUpperCase())
				.collect(Collectors.toList());	
		}
		String policy = null;
		return this.enteRepository.findAllEntiFiltrati(criterioRicerca, "%" + criterioRicerca + "%", idsProgrammi, idsProgetti, profiliEnteUpperCase, policy);
	}
	
	private List<Map<String, String>> getAllProgettiPartnerProgetto(EntiPaginatiParam entiPaginatiParam) {
		String criterioRicerca =  entiPaginatiParam.getFiltroRequest() != null? entiPaginatiParam.getFiltroRequest().getCriterioRicerca(): null;
		List<String> idsProgrammi = Arrays.asList(String.valueOf(entiPaginatiParam.getIdProgramma()));
		List<String> idsProgetti =  new ArrayList<>();
		
		idsProgetti.add(entiPaginatiParam.getIdProgetto().toString());
		
		List<String> profiliEnteUpperCase = null;
		if(entiPaginatiParam.getFiltroRequest() != null && entiPaginatiParam.getFiltroRequest().getProfili() != null){
			profiliEnteUpperCase = entiPaginatiParam.getFiltroRequest().getProfili()
				.stream()
				.map(profilo -> profilo.toUpperCase())
				.collect(Collectors.toList());	
		}
		String policy = null;
		return this.enteRepository.findAllProgettiFiltrati(criterioRicerca, "%" + criterioRicerca + "%", idsProgrammi, idsProgetti, profiliEnteUpperCase, policy);
	}
	
	private List<Map<String, String>> getProgrammaById(Long idProgramma) {
		return this.enteRepository.findProgrammaById(idProgramma);
	}

	@LogMethod
	@LogExecutionTime
	public boolean esisteEnteById(Long idEnte) {
		return this.enteRepository.findById(idEnte).isPresent();
	}
	
	@LogMethod
	@LogExecutionTime
	public boolean esisteEnteByPartitaIva(String partitaIva) {
		return this.enteRepository.findByPartitaIva(partitaIva).isPresent();
	}
	
	@LogMethod
	@LogExecutionTime
	public boolean esisteEnteByNome(String nome) {
		return this.enteRepository.findByNome(nome).isPresent();
	}
	
	@LogMethod
	@LogExecutionTime
	public boolean esisteEnteByNomeNotEqual(String nome, Long idEnte) {
		return this.enteRepository.findByNomeAndIdNot(nome, idEnte).isPresent();
	}

	/**
	 * @throws Exception 
	 * @throws EnteException
	 * */
	@LogMethod
	@LogExecutionTime
	@Transactional(rollbackOn = Exception.class)
	public EnteEntity creaNuovoEnte(@NotNull EnteEntity enteEntity) {
		if(this.esisteEnteByPartitaIva(enteEntity.getPiva())) {
			String messaggioErrore = String.format("Ente con partita iva = '%s' già presente", enteEntity.getPiva());
			throw new EnteException(messaggioErrore, CodiceErroreEnum.EN10);
		}
		if(this.esisteEnteByNome(enteEntity.getNome())) {
			String messaggioErrore = String.format("Ente con nome = '%s' già presente", enteEntity.getNome());
			throw new EnteException(messaggioErrore, CodiceErroreEnum.EN25);
		}
		enteEntity.setDataOraCreazione(new Date());
		enteEntity.setDataOraAggiornamento(new Date());
		return this.enteRepository.save(enteEntity);
	}
	
	/**
	 * Associa Utente Referente o utente delegato all'ente gestore di programma
	 * */
	@LogMethod
	@LogExecutionTime
	@Transactional(rollbackOn = Exception.class)
    public void associaReferenteODelegatoGestoreProgramma(ReferenteDelegatoGestoreProgrammaRequest referenteDelegatoGestoreProgrammaRequest) {
		Long idProgramma = referenteDelegatoGestoreProgrammaRequest.getIdProgrammaGestore();
		String codiceFiscaleUtente = referenteDelegatoGestoreProgrammaRequest.getCfReferenteDelegato();
		String codiceRuolo  = referenteDelegatoGestoreProgrammaRequest.getCodiceRuoloRefDeg().toUpperCase();
		Long idEnte = referenteDelegatoGestoreProgrammaRequest.getIdEnteGestore();
		
		if(!this.programmaService.esisteProgrammaById(idProgramma)) {
			String messaggioErrore = String.format("Impossibile assegnare referente/delegato ente gestore di programma per programma con id=%s poiché non esistente", idProgramma);
			throw new EnteException(messaggioErrore, CodiceErroreEnum.EN11);
		}
		
		UtenteEntity utenteFetch;
		try {
			utenteFetch = this.utenteService.getUtenteByCodiceFiscale(codiceFiscaleUtente);
		} catch (ResourceNotFoundException ex) {
			String messaggioErrore = String.format("Impossibile assegnare referente/delegato ente gestore di programma perche l'utente con codice fiscale=%s poiché non esiste", codiceFiscaleUtente);
			throw new EnteException(messaggioErrore, ex, CodiceErroreEnum.EN11);
		}
		if(!this.esisteEnteById(idEnte)) {
			String messaggioErrore = String.format("Impossibile assegnare referente/delegato ente gestore di programma all'ente con id=%s poiché non esistente", idEnte);
			throw new EnteException(messaggioErrore, CodiceErroreEnum.EN11);
		}
		if(!this.programmaService.getIdEnteGestoreProgramma(idProgramma).equals(idEnte)) {
			String messaggioErrore = String.format("Impossibile assegnare referente/delegato id ente non è gestore di programma per programma con id=%s", idProgramma);
			throw new EnteException(messaggioErrore, CodiceErroreEnum.EN11);
		}
		
		if(!(RuoloUtenteEnum.REG.toString().equals(codiceRuolo) || RuoloUtenteEnum.DEG.toString().equals(codiceRuolo))) {
			String messaggioErrore = String.format("Impossibile assegnare referente/delegato ente gestore di programma all'ente con id=%s, codice ruolo errato: usare 'REG' o 'DEG'", idEnte);
			throw new EnteException(messaggioErrore, CodiceErroreEnum.EN11);
		}
		
		if(utenteFetch.getMansione() == null) {
			utenteFetch.setMansione(referenteDelegatoGestoreProgrammaRequest.getMansione());
			this.utenteService.updateUtente(utenteFetch);
		}

		ReferentiDelegatiEnteGestoreProgrammaKey id =  new ReferentiDelegatiEnteGestoreProgrammaKey(idProgramma, codiceFiscaleUtente, idEnte);
		ReferentiDelegatiEnteGestoreProgrammaEntity referentiDelegatiEnteGestoreProgramma = new ReferentiDelegatiEnteGestoreProgrammaEntity();
		referentiDelegatiEnteGestoreProgramma.setId(id);
		referentiDelegatiEnteGestoreProgramma.setCodiceRuolo(codiceRuolo);
		referentiDelegatiEnteGestoreProgramma.setStatoUtente(StatoEnum.NON_ATTIVO.getValue());
		referentiDelegatiEnteGestoreProgramma.setDataOraCreazione(new Date());
		referentiDelegatiEnteGestoreProgramma.setDataOraAggiornamento(new Date());
		
		//Controllo se l'associazione già esiste
		if(this.referentiDelegatiEnteGestoreProgrammaService.esisteById(id)) {
			String messaggioErrore = String.format("Impossibile assegnare referente/delegato a ente gestore di programma perchè l'utente con codice fiscale =%s è già referente/delegato", codiceFiscaleUtente);
			throw new EnteException(messaggioErrore, CodiceErroreEnum.EN11);
		}
		
		//Se l'associazione non esiste la creo
		this.referentiDelegatiEnteGestoreProgrammaService.save(referentiDelegatiEnteGestoreProgramma);			
		
		//Se l'associazione tra utente e ruolo non esiste la creo
		RuoloEntity ruolo = this.ruoloService.getRuoloByCodiceRuolo(codiceRuolo);
		if(!utenteFetch.getRuoli().contains(ruolo)) {
			this.ruoloService.aggiungiRuoloAUtente(codiceFiscaleUtente, codiceRuolo);
		}
		
		//stacco un thread per invio email welcome al referente/delegato
		new Thread(() -> {
			try {
				this.emailService.inviaEmail(utenteFetch.getEmail(),
						EmailTemplateEnum.GEST_PROG,
						new String[] { utenteFetch.getNome(), RuoloUtenteEnum.valueOf(codiceRuolo).getValue() });
			} catch (Exception ex) {
				log.error("Impossibile inviare la mail ai Referente/Delegato dell'ente gestore programma per programma con id={}.", idProgramma);
				log.error("{}", ex);
			}
		}).start();
	}
	
	/**
	 * Cancella associazione Utente Referente o utente delegato all'ente gestore di programma
	 * */
	@LogMethod
	@LogExecutionTime
	@Transactional(rollbackOn = Exception.class)
    public void cancellaAssociazioneReferenteODelegatoGestoreProgramma(ReferentiDelegatiEnteGestoreProgrammaEntity referentiDelegatiEnteGestoreProgrammaEntity, String codiceRuolo) {
		Long idProgramma = referentiDelegatiEnteGestoreProgrammaEntity.getId().getIdProgramma();
		String codiceFiscaleUtente = referentiDelegatiEnteGestoreProgrammaEntity.getId().getCodFiscaleUtente();
		Long idEnte = referentiDelegatiEnteGestoreProgrammaEntity.getId().getIdEnte();
		ReferentiDelegatiEnteGestoreProgrammaKey id =  new ReferentiDelegatiEnteGestoreProgrammaKey(idProgramma, codiceFiscaleUtente, idEnte);
		
		this.referentiDelegatiEnteGestoreProgrammaService.cancellaAssociazioneReferenteDelegatoGestoreProgramma(id);
		
		//Controllo se l'utente è REG o DEG(a seconda del codiceRuolo che mi viene passato) su altri gestori programma oltre a questo
		boolean unicaAssociazione = this.referentiDelegatiEnteGestoreProgrammaService.findAltreAssociazioni(idProgramma, codiceFiscaleUtente, codiceRuolo).isEmpty();
		
		/*Se la condizione sopra è vera allora insieme all'associazione del referente al gestore programma 
		 * cancellerò l'associazione dell'utente al ruolo
		 */
		if(unicaAssociazione) {
			this.ruoloService.cancellaRuoloUtente(codiceFiscaleUtente, codiceRuolo);
		}
	}
	
	/**
	 * Assegna Utente Referente o utente delegato all'ente gestore di progetto
	 * */
	@LogMethod
	@LogExecutionTime
	@Transactional(rollbackOn = Exception.class)
    public void associaReferenteODelegatoGestoreProgetto(ReferenteDelegatoGestoreProgettoRequest referenteDelegatoGestoreProgettoRequest) {
		Long idProgetto = referenteDelegatoGestoreProgettoRequest.getIdProgettoGestore();
		String codiceFiscaleUtente = referenteDelegatoGestoreProgettoRequest.getCfReferenteDelegato();
		String codiceRuolo = referenteDelegatoGestoreProgettoRequest.getCodiceRuoloRefDeg().toUpperCase();
		Long idEnte = referenteDelegatoGestoreProgettoRequest.getIdEnteGestore();
		
		if(!this.progettoService.esisteProgettoById(idProgetto)) {
			String messaggioErrore = String.format("Impossibile assegnare referente/delegato ente gestore di progetto per progetto con id=%s non esistente", idProgetto);
			throw new EnteException(messaggioErrore, CodiceErroreEnum.EN12);
		}
		
		UtenteEntity utenteFetch;
		try {
			utenteFetch = this.utenteService.getUtenteByCodiceFiscale(codiceFiscaleUtente);
		} catch (ResourceNotFoundException ex) {
			String messaggioErrore = String.format("Impossibile assegnare referente/delegato ente gestore di progetto perche l'utente con codice fiscale=%s non esiste", codiceFiscaleUtente);
			throw new EnteException(messaggioErrore, ex, CodiceErroreEnum.EN12);
		}
		
		if(!(RuoloUtenteEnum.REGP.toString().equals(codiceRuolo) || RuoloUtenteEnum.DEGP.toString().equals(codiceRuolo))) {
			String messaggioErrore = String.format("Impossibile assegnare referente/delegato ente gestore di progetto all'ente con id=%s, codice ruolo errato: usare 'REGP' o 'DEGP'", idEnte);
			throw new EnteException(messaggioErrore, CodiceErroreEnum.EN12);
		}
		
		if(utenteFetch.getMansione() == null) {
			utenteFetch.setMansione(referenteDelegatoGestoreProgettoRequest.getMansione());
			this.utenteService.updateUtente(utenteFetch);
		}

		ReferentiDelegatiEnteGestoreProgettoKey id =  new ReferentiDelegatiEnteGestoreProgettoKey(idProgetto, codiceFiscaleUtente, idEnte);
		ReferentiDelegatiEnteGestoreProgettoEntity referentiDelegatiEnteGestoreProgetto = new ReferentiDelegatiEnteGestoreProgettoEntity();
		referentiDelegatiEnteGestoreProgetto.setId(id);
		referentiDelegatiEnteGestoreProgetto.setCodiceRuolo(codiceRuolo);
		referentiDelegatiEnteGestoreProgetto.setStatoUtente(StatoEnum.NON_ATTIVO.getValue());
		referentiDelegatiEnteGestoreProgetto.setDataOraCreazione(new Date());
		referentiDelegatiEnteGestoreProgetto.setDataOraAggiornamento(new Date());
		
		//Controllo se l'associazione già esiste
		if(this.referentiDelegatiEnteGestoreProgettoService.esisteById(id)) {
			String messaggioErrore = String.format("Impossibile assegnare referente/delegato a ente gestore di progetto perchè l'utente con codice fiscale = %s è già referente/delegato", codiceFiscaleUtente);
			throw new EnteException(messaggioErrore, CodiceErroreEnum.EN12);
		}
		
		//Se l'associazione non esiste la creo
		this.referentiDelegatiEnteGestoreProgettoService.save(referentiDelegatiEnteGestoreProgetto);
		
		//Se l'associazione tra utente e ruolo non esiste la creo
		RuoloEntity ruolo = this.ruoloService.getRuoloByCodiceRuolo(codiceRuolo);
		if(!utenteFetch.getRuoli().contains(ruolo)) {
			this.ruoloService.aggiungiRuoloAUtente(codiceFiscaleUtente, codiceRuolo);	
		}
		
		//stacco un thread per invio email welcome al referente/delegato
		new Thread(() -> {
			try {
				this.emailService.inviaEmail(utenteFetch.getEmail(),
						EmailTemplateEnum.GEST_PROGE_PARTNER,
						new String[] { utenteFetch.getNome(), RuoloUtenteEnum.valueOf(codiceRuolo).getValue() });
			} catch (Exception ex) {
				log.error("Impossibile inviare la mail ai Referente/Delegato dell'ente gestore progetto per progetto con id={}.", idProgetto);
				log.error("{}", ex);
			}
		}).start();
	}
	
	/**
	 * Cancella associazione Utente Referente o utente delegato all'ente gestore di progetto
	 * */
	@LogMethod
	@LogExecutionTime
	@Transactional(rollbackOn = Exception.class)
    public void cancellaAssociazioneReferenteODelegatoGestoreProgetto(ReferentiDelegatiEnteGestoreProgettoEntity referentiDelegatiEnteGestoreProgettoEntity, String codiceRuolo) {
		Long idProgetto = referentiDelegatiEnteGestoreProgettoEntity.getId().getIdProgetto();
		String codiceFiscaleUtente = referentiDelegatiEnteGestoreProgettoEntity.getId().getCodFiscaleUtente();
		Long idEnte = referentiDelegatiEnteGestoreProgettoEntity.getId().getIdEnte();
		ReferentiDelegatiEnteGestoreProgettoKey id =  new ReferentiDelegatiEnteGestoreProgettoKey(idProgetto, codiceFiscaleUtente, idEnte);
		
		this.referentiDelegatiEnteGestoreProgettoService.cancellaAssociazioneReferenteDelegatoGestoreProgetto(id);
		
		//Controllo se l'utente è REGP o DEGP(a seconda del codiceRuolo che mi viene passato) su altri gestori progetto oltre a questo
		boolean unicaAssociazione = this.referentiDelegatiEnteGestoreProgettoService.findAltreAssociazioni(idProgetto, codiceFiscaleUtente, codiceRuolo).isEmpty();
		
		/*Se la condizione sopra è vera allora insieme all'associazione del referente al gestore progetto
		 * imposterò a cancellato anche l'associazione dell'utente al ruolo
		 */
		if(unicaAssociazione) {
			this.ruoloService.cancellaRuoloUtente(codiceFiscaleUtente, codiceRuolo);
		}
	}
	
	@LogMethod
	@LogExecutionTime
	public SchedaEnteGestoreBean getSchedaEnteGestoreProgrammaByIdProgramma(String codiceRuolo, Long idProgramma) {
		String errorMessage = String.format("Non esiste nessun ente gestore per programma con id=%s", idProgramma);
		SchedaEnteGestoreBean schedaEnteGestoreProgramma = new SchedaEnteGestoreBean();
		EnteProjection ente = this.enteRepository.findEnteGestoreProgrammaByIdProgramma(idProgramma)
				.orElseThrow(() -> new EnteException(errorMessage, CodiceErroreEnum.C01));
		
		List<UtenteProjection> referenti = this.referentiDelegatiEnteGestoreProgrammaService.getReferentiEnteGestoreByIdProgrammaAndIdEnte(codiceRuolo, idProgramma, ente.getId());
		List<UtenteProjection> delegati = this.referentiDelegatiEnteGestoreProgrammaService.getDelegatiEnteGestoreByIdProgrammaAndIdEnte(codiceRuolo, idProgramma, ente.getId());
		
		schedaEnteGestoreProgramma.setEnte(ente);
		schedaEnteGestoreProgramma.setReferentiEnteGestore(referenti);
		schedaEnteGestoreProgramma.setDelegatiEnteGestore(delegati);
		return schedaEnteGestoreProgramma;
	}
	
	@LogMethod
	@LogExecutionTime
	public SchedaEnteGestoreProgettoBean getSchedaEnteGestoreProgettoByIdProgettoAndSceltaProfilo(String codiceRuolo, Long idProgetto, EntiPaginatiParam entiPaginatiParam) {
		String errorMessage = String.format("Non esiste nessun ente gestore per progetto con id=%s", idProgetto);
		SchedaEnteGestoreProgettoBean schedaEnteGestoreProgetto = new SchedaEnteGestoreProgettoBean();
		EnteProjection ente = this.enteRepository.findEnteGestoreProgettoByIdProgetto(idProgetto)
				.orElseThrow(() -> new EnteException(errorMessage, CodiceErroreEnum.C01));

		List<UtenteProjection> referenti = this.referentiDelegatiEnteGestoreProgettoService.getReferentiEnteGestoreByIdProgettoAndIdEnte(codiceRuolo, idProgetto, ente.getId());
		List<UtenteProjection> delegati = this.referentiDelegatiEnteGestoreProgettoService.getDelegatiEnteGestoreByIdProgettoAndIdEnte(codiceRuolo, idProgetto, ente.getId());
		List<SedeEntity> sedi = this.sedeService.getSediEnteByIdProgettoAndIdEnte(idProgetto, ente.getId());
		List<SedeBean> sediGestoreProgetto = sedi
									.stream()
									.map(sede -> {
										SedeBean sedeGestoreProgetto = new SedeBean();
										sedeGestoreProgetto.setId(sede.getId());
										sedeGestoreProgetto.setNome(sede.getNome());
										sedeGestoreProgetto.setServiziErogati(sede.getServiziErogati());
										sedeGestoreProgetto.setNrFacilitatori(this.utenteService.countFacilitatoriPerSedeProgettoEnte(idProgetto, sede.getId(), ente.getId()));
										sedeGestoreProgetto.setStato(this.sedeService.getStatoSedeByIdProgettoAndIdSedeAndIdEnte(idProgetto, sede.getId(), ente.getId()));

										List<String> facilitatoriVolontari = Arrays.asList(RuoloUtenteEnum.FAC.toString(), RuoloUtenteEnum.VOL.toString());
										if(facilitatoriVolontari.contains(entiPaginatiParam.getCodiceRuoloUtenteLoggato().toString())) {
											String cfUtenteLoggato = entiPaginatiParam.getCfUtenteLoggato();
											EnteSedeProgettoFacilitatoreKey id = new EnteSedeProgettoFacilitatoreKey(ente.getId(), sede.getId(), idProgetto, cfUtenteLoggato);
											boolean isSedeAssociatoAUtente = this.enteSedeProgettoFacilitatoreService.getEnteSedeProgettoFacilitatoreById(id).isPresent();
											sedeGestoreProgetto.setAssociatoAUtente(isSedeAssociatoAUtente);
										} else {
											sedeGestoreProgetto.setAssociatoAUtente(Boolean.TRUE);
										}

										return sedeGestoreProgetto;
									}).collect(Collectors.toList());

		schedaEnteGestoreProgetto.setEnte(ente);
		schedaEnteGestoreProgetto.setReferentiEnteGestoreProgetto(referenti);
		schedaEnteGestoreProgetto.setDelegatiEnteGestoreProgetto(delegati);
		schedaEnteGestoreProgetto.setSediEnteGestoreProgetto(sediGestoreProgetto);
		return schedaEnteGestoreProgetto;
	}

	@LogMethod
	@LogExecutionTime
	public SchedaEnteBean getSchedaEnteById(Long idEnte) {
		String errorMessage = String.format("Non esiste nessun ente con id = %s ", idEnte);
		EnteEntity ente = this.enteRepository.findById(idEnte).orElseThrow(() -> new EnteException(errorMessage, CodiceErroreEnum.C01));
		
		DettaglioEnteBean dettaglioEnte = new DettaglioEnteBean();
		dettaglioEnte.setId(idEnte);
		dettaglioEnte.setNome(ente.getNome());
		dettaglioEnte.setNomeBreve(ente.getNomeBreve());
		dettaglioEnte.setPiva(ente.getPiva());
		dettaglioEnte.setSedeLegale(ente.getSedeLegale());
		dettaglioEnte.setTipologia(ente.getTipologia());
		dettaglioEnte.setIndirizzoPec(ente.getIndirizzoPec());
		
		Map<String,List<Long>> mappaRuoliProgrammiProgettiEnte = new HashMap<>();
		
		List<String> listaProfiliEnte = this.getProfiliEnteByIdEnte(idEnte);
		
		listaProfiliEnte.stream()
						.forEach(profilo -> {
							switch (profilo) {
							case "Ente Gestore di Programma":
								mappaRuoliProgrammiProgettiEnte.put(profilo, this.programmaService.getIdProgrammiByIdEnte(idEnte));
								break;
							case "Ente Gestore di Progetto":
								mappaRuoliProgrammiProgettiEnte.put(profilo, this.progettoService.getIdProgettiByIdEnte(idEnte));
								break;
							case "Ente Partner":
								mappaRuoliProgrammiProgettiEnte.put(profilo, this.progettoService.getIdProgettiEntePartnerByIdEnte(idEnte));
								break;
							default:
								break;
							}
						});
		
		List<DettaglioProfiliBean> dettaglioProfili = new ArrayList<>();
		
		mappaRuoliProgrammiProgettiEnte.keySet()
					.stream()
					.forEach(profilo -> {
						List<Long> listaIds = mappaRuoliProgrammiProgettiEnte.get(profilo);
								listaIds.stream()
										.forEach(id -> {
											DettaglioProfiliBean dettaglioProfilo = new DettaglioProfiliBean();
											switch (profilo) {
											case "Ente Gestore di Programma":
												ProgrammaEntity programma = this.programmaService.getProgrammaById(id);
												dettaglioProfilo.setId(id);
												dettaglioProfilo.setTipoEntita("Programma");
												dettaglioProfilo.setNome(programma.getNomeBreve());
												dettaglioProfilo.setProfilo(profilo);
												dettaglioProfilo.setStato(programma.getStato());
												dettaglioProfilo.setReferenti(this.utenteService.getReferentiProgrammaById(id, idEnte));
												dettaglioProfili.add(dettaglioProfilo);
												break;
											case "Ente Gestore di Progetto":
												//Progetto di cui sono gestore
												ProgettoEntity progetto = this.progettoService.getProgettoById(id);
												dettaglioProfilo.setId(id);
												dettaglioProfilo.setTipoEntita("Progetto");
												dettaglioProfilo.setNome(progetto.getNomeBreve());
												dettaglioProfilo.setProfilo(profilo);
												dettaglioProfilo.setStato(progetto.getStato());
												dettaglioProfilo.setReferenti(this.utenteService.getReferentiProgettoById(id, idEnte));
												dettaglioProfili.add(dettaglioProfilo);
												break;
											case "Ente Partner":
												//Progetto di cui sono ente partner
												ProgettoEntity progettoEntePartner = this.progettoService.getProgettoById(id);
												dettaglioProfilo.setId(id);
												dettaglioProfilo.setTipoEntita("Progetto");
												dettaglioProfilo.setNome(progettoEntePartner.getNomeBreve());
												dettaglioProfilo.setProfilo(profilo);
												dettaglioProfilo.setStato(progettoEntePartner.getStato());
												dettaglioProfilo.setReferenti(this.utenteService.getReferentiEntePartnerProgettoById(id, idEnte));
												dettaglioProfili.add(dettaglioProfilo);
												break;
											}
										});
					});
						
		SchedaEnteBean schedaEnte = new SchedaEnteBean();
		schedaEnte.setDettagliEnte(dettaglioEnte);
		schedaEnte.setDettagliProfili(dettaglioProfili);
		return schedaEnte;
	}

	private List<String> getProfiliEnteByIdEnte(Long idEnte) {
		List<String> listaProfiliEnte = new ArrayList<>();
		
		if(this.programmaService.countProgrammiEnte(idEnte) > 0) {
			listaProfiliEnte.add("Ente Gestore di Programma");
		}
		if(this.progettoService.countProgettiEnte(idEnte) > 0) {
			listaProfiliEnte.add("Ente Gestore di Progetto");
		}
		if(this.progettoService.countProgettiEntePartner(idEnte) > 0) {
			listaProfiliEnte.add("Ente Partner");
		}
		return listaProfiliEnte;
	}

	@LogMethod
	@LogExecutionTime
	public void aggiornaEnte(EnteEntity enteEntity, Long idEnte) {
		if (!this.enteRepository.existsById(idEnte)) {
			String errorMessage = String.format("Impossibile aggiornare l'ente con id=%s. Ente non presente", idEnte);
			throw new EnteException(errorMessage, CodiceErroreEnum.EN13);
		}
		final String partitaIva = enteEntity.getPiva();
		if (this.enteRepository.findByPartitaIvaAndIdDiverso(partitaIva, idEnte).isPresent()) {
			String errorMessage = String.format("Impossibile aggiornare l'ente con codice fiscale=%s. Ente con codice fiscale inserito già presente", partitaIva);
			throw new EnteException(errorMessage, CodiceErroreEnum.EN14);
		}
		EnteEntity enteFetchDB = this.getEnteById(idEnte);
		enteEntity.setDataOraCreazione(enteFetchDB.getDataOraCreazione());
		enteEntity.setDataOraAggiornamento(new Date());
		this.enteRepository.save(enteEntity);
	}
	
	@LogMethod
	@LogExecutionTime
	@Transactional(rollbackOn = Exception.class)
	public void modificaEnteGestoreProgramma(EnteEntity enteModificato, Long idEnte, Long idProgramma) {
		EnteEntity enteFetchDB = this.getEnteById(idEnte);
		Optional<EnteEntity> optionalEnte = this.enteRepository.findByPartitaIva(enteModificato.getPiva());
		ProgrammaEntity programmaFetchDB = this.programmaService.getProgrammaById(idProgramma);
		
		if(enteModificato.getId().equals(idEnte)) {
			if(this.esisteEnteByNomeNotEqual(enteModificato.getNome(), idEnte)) {
				String messaggioErrore = String.format("Ente con nome = '%s' già presente", enteModificato.getNome());
				throw new EnteException(messaggioErrore, CodiceErroreEnum.EN25);
			}
			enteModificato.setDataOraCreazione(enteFetchDB.getDataOraCreazione());
			enteModificato.setDataOraAggiornamento(new Date());
			if(!optionalEnte.isPresent()) {
				this.enteRepository.save(enteModificato);
			} else if (optionalEnte.get().getPiva().equals(enteFetchDB.getPiva())) {
				this.enteRepository.save(enteModificato);
			} else {
				String errorMessage = "E' già presente un ente con questa Partita IVA, usare la funzione di ricerca";
				throw new EnteException(errorMessage, CodiceErroreEnum.EN14);
			}
		} else {
			if(!optionalEnte.isPresent()) {
				if(this.esisteEnteByNomeNotEqual(enteModificato.getNome(), idEnte)) {
					String messaggioErrore = String.format("Ente con nome = '%s' già presente", enteModificato.getNome());
					throw new EnteException(messaggioErrore, CodiceErroreEnum.EN25);
				}
			}
			// nuova associazione
			if(!optionalEnte.isPresent() || optionalEnte.get().getId().equals(enteModificato.getId())) {
				EnteEntity enteModificatoFetchDB = this.getEnteById(enteModificato.getId());
				enteModificato.setDataOraCreazione(enteModificatoFetchDB.getDataOraCreazione());
				enteModificato.setDataOraAggiornamento(new Date());
				this.enteRepository.save(enteModificato);
				if(StatoEnum.NON_ATTIVO.getValue().equals(programmaFetchDB.getStatoGestoreProgramma())) {
					this.cancellaGestoreProgramma(idEnte, idProgramma);
				} else {
					this.terminaGestoreProgramma(idEnte, idProgramma);
				}
				this.programmaService.assegnaEnteGestoreProgramma(idProgramma, enteModificato.getId());
			} else {
				String errorMessage = "E' già presente un ente con questa Partita IVA, usare la funzione di ricerca";
				throw new EnteException(errorMessage, CodiceErroreEnum.EN14);
			}
		}
	}
	
	@LogMethod
	@LogExecutionTime
	@Transactional(rollbackOn = Exception.class)
	public void modificaEnteGestoreProgetto(EnteEntity enteModificato, Long idEnte, Long idProgetto) {
		EnteEntity enteFetchDB = this.getEnteById(idEnte);
		Optional<EnteEntity> optionalEnte = this.enteRepository.findByPartitaIva(enteModificato.getPiva());
		ProgettoEntity progettoFetchDB = this.progettoService.getProgettoById(idProgetto);
		if(enteModificato.getId().equals(idEnte)) {
			if(this.esisteEnteByNomeNotEqual(enteModificato.getNome(), idEnte)) {
				String messaggioErrore = String.format("Ente con nome = '%s' già presente", enteModificato.getNome());
				throw new EnteException(messaggioErrore, CodiceErroreEnum.EN25);
			}
			enteModificato.setDataOraCreazione(enteFetchDB.getDataOraCreazione());
			enteModificato.setDataOraAggiornamento(new Date());
			if(!optionalEnte.isPresent()) {
				this.enteRepository.save(enteModificato);
			} else if (optionalEnte.get().getPiva().equals(enteFetchDB.getPiva())) {
				this.enteRepository.save(enteModificato);
			} else {
				String errorMessage = "E' già presente un ente con questa Partita IVA, usare la funzione di ricerca";
				throw new EnteException(errorMessage, CodiceErroreEnum.EN15);
			}
		} else {
			if(!optionalEnte.isPresent()) {
				if(this.esisteEnteByNomeNotEqual(enteModificato.getNome(), idEnte)) {
					String messaggioErrore = String.format("Ente con nome = '%s' già presente", enteModificato.getNome());
					throw new EnteException(messaggioErrore, CodiceErroreEnum.EN25);
				}
			}
			if(!optionalEnte.isPresent() || optionalEnte.get().getId().equals(enteModificato.getId())) {
				EnteEntity enteModificatoFetchDB = this.getEnteById(enteModificato.getId());
				enteModificato.setDataOraCreazione(enteModificatoFetchDB.getDataOraCreazione());
				enteModificato.setDataOraAggiornamento(new Date());
				this.enteRepository.save(enteModificato);
				if(StatoEnum.NON_ATTIVO.getValue().equals(progettoFetchDB.getStatoGestoreProgetto())) {
					this.cancellaGestoreProgetto(idEnte, idProgetto);
				} else {
					this.terminaGestoreProgetto(idEnte, idProgetto);
				}
				this.progettoService.assegnaEnteGestoreProgetto(idProgetto, enteModificato.getId());
			} else {
				String errorMessage = "E' già presente un ente con questa Partita IVA, usare la funzione di ricerca";
				throw new EnteException(errorMessage, CodiceErroreEnum.EN15);
			}
		}
	}

	@LogMethod
	@LogExecutionTime
	@Transactional(rollbackOn = Exception.class)
	public void cancellaEntePartnerPerProgetto(Long idEnte, Long idProgetto) {
		if(!this.esisteEnteById(idEnte)) {
			String errorMessage = String.format("L'ente con id=%s non esiste", idEnte);
			throw new EnteException(errorMessage, CodiceErroreEnum.EN16);
		}
		//controllo se esiste l'associazione tra progetto e ente partner
		if(this.entePartnerService.getEntePartnerByIdEnteAndIdProgetto(idEnte, idProgetto) == null) {
			String errorMessage = String.format("L'ente con id=%s non è ente partner del progetto con id=%s", idEnte, idProgetto);
			throw new EnteException(errorMessage, CodiceErroreEnum.EN16);
		}
		//prendo l'associazione tra progetto e ente partner
		EntePartnerEntity entePartnerProgetto = this.entePartnerService.getEntePartnerByIdEnteAndIdProgetto(idEnte, idProgetto);
		//controllo se lo stato dell'ente partner è diverso da NON ATTIVO
		if(!entePartnerProgetto.getStatoEntePartner().equals(StatoEnum.NON_ATTIVO.getValue())) {
			String errorMessage = String.format("Imposibile cancellare l'ente con id=%s poiché risulta essere attivo su questo progetto", idEnte);
			throw new EnteException(errorMessage, CodiceErroreEnum.EN16);
		}
		//prendo referenti e delegati per l'ente partner di quel progetto
		List<ReferentiDelegatiEntePartnerDiProgettoEntity> listaReferentiDelegatiEntePartner = this.referentiDelegatiEntePartnerDiProgettoService.getReferentiDelegatiEntePartner(idEnte, idProgetto);
		//elimino i referenti e i delegati per quell'associazione
		this.referentiDelegatiEntePartnerDiProgettoService.cancellaAssociazioneReferenteDelegatoEntePartnerPerProgetto(idEnte, idProgetto);
		
		//controllo se i referenti e i delegati dell'associazione appena eliminata siano referenti o delegati su altri progetti, così non fosse elimino i ruoli di REPP/DEPP da tali utenti
		listaReferentiDelegatiEntePartner.stream()
							  .forEach(utente -> {
								  //conto per quanti enti questi utenti sono referenti o delegati, qualora fossero 0, elimino quel ruolo dall' utente interessato
								  if(this.referentiDelegatiEntePartnerDiProgettoService.countAssociazioniReferenteDelegati(utente.getId().getCodFiscaleUtente(), utente.getCodiceRuolo()) == 0) {
									  UtenteXRuolo utenteRuolo = this.utenteXRuoloService.getUtenteXRuoloByCfUtenteAndCodiceRuolo(utente.getId().getCodFiscaleUtente(), utente.getCodiceRuolo());
									  this.utenteXRuoloService.cancellaRuoloUtente(utenteRuolo);
								  };
							  });
		//elimino l'associazione tra progetto e ente partner
		this.entePartnerService.cancellaAssociazioneEntePartnerPerProgetto(entePartnerProgetto);
		//prendo facilitatori e volontari su quell'ente per quel progetto
		List<EnteSedeProgettoFacilitatoreEntity> listaFacilitatori = this.enteSedeProgettoFacilitatoreService.getFacilitatoriByIdEnteAndIdProgetto(idEnte, idProgetto);
		//elimino l'associazione tra ente partner, sede, progetto e facilitatori
		this.enteSedeProgettoFacilitatoreService.cancellazioneAssociazioniEnteSedeProgettoFacilitatoreByIdEnteAndIdProgetto(idEnte, idProgetto);
		
		//controllo se i facilitatori e i volontari dell'associazione appena eliminata siano facilitatori o volontari su altri progetti, così non fosse elimino i ruoli di FAC/VOL da tali utenti
		listaFacilitatori.stream()
						 .forEach(utente -> {
							 if(this.enteSedeProgettoFacilitatoreService.countAssociazioniFacilitatoreAndVolontario(utente.getId().getIdFacilitatore(), utente.getRuoloUtente()) == 0) {
								 UtenteXRuolo utenteRuolo = this.utenteXRuoloService.getUtenteXRuoloByCfUtenteAndCodiceRuolo(utente.getId().getIdFacilitatore(), utente.getRuoloUtente() );
								  this.utenteXRuoloService.cancellaRuoloUtente(utenteRuolo);
							 }
						 });
		//elimino l'associazione tra ente partner, sede e progetto
		this.enteSedeProgettoService.cancellazioneAssociazioniEnteSedeProgettoByIdEnteAndIdProgetto(idEnte, idProgetto);
	}

	@LogMethod
	@LogExecutionTime
	public void cancellaGestoreProgramma(Long idEnte, Long idProgramma) {
		if(!this.esisteEnteById(idEnte)) {
			String errorMessage = String.format("L'ente con id=%s non esiste", idEnte);
			throw new EnteException(errorMessage, CodiceErroreEnum.EN17);
		}
		ProgrammaEntity programma = this.programmaService.getProgrammaById(idProgramma);
		if(programma.getEnteGestoreProgramma() == null || !programma.getEnteGestoreProgramma().getId().equals(idEnte)) {
			String errorMessage = String.format("L'ente con id=%s non è il gestore di programma", idEnte);
			throw new EnteException(errorMessage, CodiceErroreEnum.EN17);
		}
		//controllo se lo stato dell'ente gestore di programma è diverso da NON ATTIVO
		if(!programma.getStatoGestoreProgramma().equals(StatoEnum.NON_ATTIVO.getValue())) {
			String errorMessage = String.format("Impossibile cancellare l'ente gestore di programma poiché lo stato dell'ente risulta attivo per questo programma");
			throw new EnteException(errorMessage, CodiceErroreEnum.EN17);
		}
		
		ProgrammaEntity programmaFetchDB = this.programmaService.getProgrammaById(idProgramma);
		programmaFetchDB.setEnteGestoreProgramma(null);
		programmaFetchDB.setStatoGestoreProgramma(null);
		this.programmaService.salvaProgramma(programmaFetchDB);
		//prendo la lista dei referenti e delegati  su quel programma
		List<ReferentiDelegatiEnteGestoreProgrammaEntity> listaReferentiDelegatiProgramma = this.referentiDelegatiEnteGestoreProgrammaService.getReferentiAndDelegatiByIdProgrammaAndIdEnte(idProgramma, idEnte);
		//elimino i referenti e delegati dalla tabella REFERENTE_DELEGATI_GESTORE_PROGRAMMA 
		listaReferentiDelegatiProgramma.stream()
										  .forEach(utente -> {
											  this.referentiDelegatiEnteGestoreProgrammaService.cancellaAssociazione(utente);
										  });
		listaReferentiDelegatiProgramma.stream()
					  .forEach(utente -> {  //controllo se i referenti e i delegati siano referenti e delegati in altri programmi, così non fosse elimino i ruoli di REG/DEG da tali utenti
						  if(this.referentiDelegatiEnteGestoreProgrammaService.countAssociazioniReferenteDelegato(utente.getId().getCodFiscaleUtente(), utente.getCodiceRuolo()) == 0 ) {
							  UtenteXRuolo utenteRuolo = this.utenteXRuoloService.getUtenteXRuoloByCfUtenteAndCodiceRuolo(utente.getId().getCodFiscaleUtente(), utente.getCodiceRuolo());
							  this.utenteXRuoloService.cancellaRuoloUtente(utenteRuolo);
						  }
					  });
	}
	
	@LogMethod
	@LogExecutionTime
	@Transactional(rollbackOn = Exception.class)
	public void cancellaGestoreProgetto(Long idEnte, Long idProgetto) {
		if(!this.esisteEnteById(idEnte)) {
			String errorMessage = String.format("L'ente con id=%s non esiste", idEnte);
			throw new EnteException(errorMessage, CodiceErroreEnum.EN18);
		}
		ProgettoEntity progetto = this.progettoService.getProgettoById(idProgetto);
		if(progetto.getEnteGestoreProgetto() == null || !progetto.getEnteGestoreProgetto().getId().equals(idEnte)) {
			String errorMessage = String.format("L'ente con id=%s non è il gestore di progetto", idEnte);
			throw new EnteException(errorMessage, CodiceErroreEnum.EN18);
		}
		//controllo se lo stato dell'ente gestore di progetto è diverso da NON ATTIVO
		if(!this.progettoService.getProgettoById(idProgetto).getStatoGestoreProgetto().equals(StatoEnum.NON_ATTIVO.getValue())) {
			String errorMessage = String.format("Impossibile cancellare l'ente gestore di progetto poiché lo stato dell'ente risulta diverso da non attivo per questo progetto");
			throw new EnteException(errorMessage, CodiceErroreEnum.EN18);
		}
		
		ProgettoEntity progettoFetchDB = this.progettoService.getProgettoById(idProgetto);
		progettoFetchDB.setEnteGestoreProgetto(null);
		progettoFetchDB.setStatoGestoreProgetto(null);
		this.progettoService.salvaProgetto(progettoFetchDB);
		//prendo la lista dei referenti e delegati su quel progetto 
		List<ReferentiDelegatiEnteGestoreProgettoEntity> listaReferentiDelegatiPerProgetto = this.referentiDelegatiEnteGestoreProgettoService.getReferentiAndDelegatiPerProgettoAndIdEnte(idProgetto, idEnte);
		//elimino i referenti e delegati dalla tabella REFERENTE_DELEGATI_GESTORE_PROGETTO 
		listaReferentiDelegatiPerProgetto.stream()
										 .forEach(utente -> {
											 this.referentiDelegatiEnteGestoreProgettoService.cancellaAssociazione(utente);
										 });
		listaReferentiDelegatiPerProgetto.stream()
					  .forEach(utente -> {  //controllo se i referenti e i delegati siano referenti e delegati in altri progetti, così non fosse elimino i ruoli di REGP/DEGP da tali utenti
						  if(this.referentiDelegatiEnteGestoreProgettoService.countAssociazioniReferenteDelegato(utente.getId().getCodFiscaleUtente(), utente.getCodiceRuolo()) == 0) {
							  UtenteXRuolo utenteRuolo = this.utenteXRuoloService.getUtenteXRuoloByCfUtenteAndCodiceRuolo(utente.getId().getCodFiscaleUtente(), utente.getCodiceRuolo());
							  this.utenteXRuoloService.cancellaRuoloUtente(utenteRuolo);
						  }
					  });
		//prendo facilitatori e volontari su quell'ente per quel progetto
		List<EnteSedeProgettoFacilitatoreEntity> listaFacilitatori = this.enteSedeProgettoFacilitatoreService.getFacilitatoriByIdEnteAndIdProgetto(idEnte, idProgetto);
		//elimino l'associazione tra ente partner, sede, progetto e facilitatori
		this.enteSedeProgettoFacilitatoreService.cancellazioneAssociazioniEnteSedeProgettoFacilitatoreByIdEnteAndIdProgetto(idEnte, idProgetto);
		
		//controllo se i facilitatori e i volontari dell'associazione appena eliminata siano facilitatori o volontari su altri progetti, così non fosse elimino i ruoli di FAC/VOL da tali utenti
		listaFacilitatori.stream()
						 .forEach(utente -> {
							 if(this.enteSedeProgettoFacilitatoreService.countAssociazioniFacilitatoreAndVolontario(utente.getId().getIdFacilitatore(), utente.getRuoloUtente()) == 0) {
								 UtenteXRuolo utenteRuolo = this.utenteXRuoloService.getUtenteXRuoloByCfUtenteAndCodiceRuolo(utente.getId().getIdFacilitatore(), utente.getRuoloUtente() );
								  this.utenteXRuoloService.cancellaRuoloUtente(utenteRuolo);
							 }
						 });
		//elimino l'associazione tra ente partner, sede e progetto
		this.enteSedeProgettoService.cancellazioneAssociazioniEnteSedeProgettoByIdEnteAndIdProgetto(idEnte, idProgetto);
	}
	
	@LogMethod
	@LogExecutionTime
	@Transactional(rollbackOn = Exception.class)
	public void terminaGestoreProgramma(Long idEnte, Long idProgramma){
		if(!this.esisteEnteById(idEnte)) {
			String errorMessage = String.format("L'ente con id=%s non esiste", idEnte);
			throw new EnteException(errorMessage, CodiceErroreEnum.EN19);
		}
		ProgrammaEntity programma = this.programmaService.getProgrammaById(idProgramma);
		if(programma.getEnteGestoreProgramma() == null || !programma.getEnteGestoreProgramma().getId().equals(idEnte)) {
			String errorMessage = String.format("L'ente con id=%s non è il gestore di programma", idEnte);
			throw new EnteException(errorMessage, CodiceErroreEnum.EN17);
		}
		//controllo se lo stato dell'ente gestore di programma è diverso da ATTIVO
		if(!this.programmaService.getProgrammaById(idProgramma).getStatoGestoreProgramma().equals(StatoEnum.ATTIVO.getValue())) {
			String errorMessage = String.format("Impossibile terminare l'ente gestore di programma poiché lo stato dell'ente risulta non attivo o terminato per questo programma");
			throw new EnteException(errorMessage, CodiceErroreEnum.EN19);
		}
		ProgrammaEntity programmaFetchDB = this.programmaService.getProgrammaById(idProgramma);
		List<ReferentiDelegatiEnteGestoreProgrammaEntity> referentiEDelegatiEnte = this.referentiDelegatiEnteGestoreProgrammaService.getReferentiAndDelegatiByIdProgrammaAndIdEnte(idProgramma, idEnte);
		referentiEDelegatiEnte.stream()
							  .forEach(referenteODelegato -> {
								  if(referenteODelegato.getStatoUtente().equals("ATTIVO")) {
										this.terminaACascataAssociazioneReferenteDelegatoGestoreProgramma(referenteODelegato, referenteODelegato.getCodiceRuolo());
								  }
								  if(referenteODelegato.getStatoUtente().equals("NON ATTIVO")) {
										this.cancellaAssociazioneReferenteODelegatoGestoreProgramma(referenteODelegato, referenteODelegato.getCodiceRuolo());
								  }
		});
		try {
			this.storicoService.storicizzaEnteGestoreProgramma(programmaFetchDB, StatoEnum.TERMINATO.getValue());
		} catch (Exception e) {
			throw new EnteException("Impossibile Storicizzare Ente", CodiceErroreEnum.C02);
		}
		programmaFetchDB.setEnteGestoreProgramma(null);
		programmaFetchDB.setStatoGestoreProgramma(null);
		this.programmaService.salvaProgramma(programmaFetchDB);
	}

	@LogMethod
	@LogExecutionTime
	@Transactional(rollbackOn = Exception.class)
	public void terminaGestoreProgetto(Long idEnte, Long idProgetto) {
		if(!this.esisteEnteById(idEnte)) {
			String errorMessage = String.format("L'ente con id=%s non esiste", idEnte);
			throw new EnteException(errorMessage, CodiceErroreEnum.EN20);
		}
		ProgettoEntity progetto = this.progettoService.getProgettoById(idProgetto);
		if(progetto.getEnteGestoreProgetto() == null || !progetto.getEnteGestoreProgetto().getId().equals(idEnte)) {
			String errorMessage = String.format("L'ente con id=%s non è il gestore di progetto", idEnte);
			throw new EnteException(errorMessage, CodiceErroreEnum.EN18);
		}
		//controllo se lo stato dell'ente gestore di progetto è diverso da ATTIVO
		if(!this.progettoService.getProgettoById(idProgetto).getStatoGestoreProgetto().equals(StatoEnum.ATTIVO.getValue())) {
			String errorMessage = String.format("Impossibile terminare l'ente gestore di progetto poiché lo stato dell'ente risulta non attivo o terminato per questo progetto");
			throw new EnteException(errorMessage, CodiceErroreEnum.EN20);
		}
		ProgettoEntity progettoFetchDB = this.progettoService.getProgettoById(idProgetto);
		List<ReferentiDelegatiEnteGestoreProgettoEntity> referentiEDelegatiEnte = this.referentiDelegatiEnteGestoreProgettoService.getReferentiAndDelegatiByIdProgettoAndIdEnte(idProgetto, idEnte);
		referentiEDelegatiEnte.stream()
							  .forEach(referenteODelegato -> {
								  if(StatoEnum.ATTIVO.getValue().equalsIgnoreCase(referenteODelegato.getStatoUtente())) {
										this.terminaACascataAssociazioneReferenteDelegatoGestoreProgetto(referenteODelegato);
								  }
								  if(StatoEnum.NON_ATTIVO.getValue().equalsIgnoreCase(referenteODelegato.getStatoUtente())) {
										this.cancellaAssociazioneReferenteODelegatoGestoreProgetto(referenteODelegato, referenteODelegato.getCodiceRuolo());
								  }
		});
		try {
			this.storicoService.storicizzaEnteGestoreProgetto(progettoFetchDB, StatoEnum.TERMINATO.getValue());
		} catch (Exception e) {
			throw new EnteException("Impossibile Storicizzare Ente", CodiceErroreEnum.C02);
		}
		progettoFetchDB.setEnteGestoreProgetto(null);
		progettoFetchDB.setStatoGestoreProgetto(null);
		this.progettoService.salvaProgetto(progettoFetchDB);
		//prendo le sedi del progetto per quell'ente
		List<EnteSedeProgetto> listaSediPerProgettoAndEnte = this.enteSedeProgettoService.getSediPerProgettoAndEnte(idEnte, idProgetto);
		listaSediPerProgettoAndEnte.stream()
								   .forEach(sede -> { //imposto lo stato della sede per quel progetto ed ente a TERMINATO
									   if(sede.getStatoSede().equals(StatoEnum.ATTIVO.getValue())) {
										   this.enteSedeProgettoService.terminaAssociazioneEnteSedeProgetto(idEnte, sede.getId().getIdSede(), idProgetto);
									   }
									   if(sede.getStatoSede().equals(StatoEnum.NON_ATTIVO.getValue())) {
										   this.enteSedeProgettoService.cancellazioneAssociazioneEnteSedeProgetto(idEnte, sede.getId().getIdSede(), idProgetto);
									   }
								   });
	}

	@LogMethod
	@LogExecutionTime
	@Transactional(rollbackOn = Exception.class)
	public void terminaEntePartnerPerProgetto(Long idEnte, Long idProgetto) {
		if(!this.esisteEnteById(idEnte)) {
			String errorMessage = String.format("L'ente con id=%s non esiste", idEnte);
			throw new EnteException(errorMessage, CodiceErroreEnum.EN21);
		}
		//controllo se esiste l'associazione tra progetto e ente partner
		if(this.entePartnerService.getEntePartnerByIdEnteAndIdProgetto(idEnte, idProgetto) == null) {
			String errorMessage = String.format("L'ente con id=%s non è ente partner del progetto con id=%s", idEnte, idProgetto);
			throw new EnteException(errorMessage, CodiceErroreEnum.EN21);
		}
		//prendo l'associazione tra progetto e ente partner
		EntePartnerEntity entePartnerProgetto = this.entePartnerService.getEntePartnerByIdEnteAndIdProgetto(idEnte, idProgetto);
		//controllo se lo stato dell'ente partner è diverso da ATTIVO
		if(!entePartnerProgetto.getStatoEntePartner().equals(StatoEnum.ATTIVO.getValue())) {
			String errorMessage = String.format("Imposibile terminare l'ente partner con id=%s poiché risulta essere non attivo o terminato su questo progetto", idEnte);
			throw new EnteException(errorMessage, CodiceErroreEnum.EN21);
		}
		//prendo le sedi del progetto per quell'ente
		List<EnteSedeProgetto> listaSediPerProgettoAndEnte = this.enteSedeProgettoService.getSediPerProgettoAndEnte(idEnte, idProgetto);
		listaSediPerProgettoAndEnte.stream()
								   .forEach(sede -> { //imposto lo stato della sede per quel progetto ed ente a TERMINATO
									   if(sede.getStatoSede().equals(StatoEnum.ATTIVO.getValue())) {
										   this.enteSedeProgettoService.terminaAssociazioneEnteSedeProgetto(idEnte, sede.getId().getIdSede(), idProgetto);
									   }
									   if(sede.getStatoSede().equals(StatoEnum.NON_ATTIVO.getValue())) {
										   this.enteSedeProgettoService.cancellazioneAssociazioneEnteSedeProgetto(idEnte, sede.getId().getIdSede(), idProgetto);
									   }
								   });
		List<ReferentiDelegatiEntePartnerDiProgettoEntity> referentiEDelegatiEnte = this.referentiDelegatiEntePartnerDiProgettoService.getReferentiAndDelegatiByIdProgettoAndIdEnte(idProgetto, idEnte);
		referentiEDelegatiEnte.stream()
							  .forEach(referenteODelegato -> {
								  if(referenteODelegato.getStatoUtente().equals(StatoEnum.ATTIVO.getValue())) {
										this.entePartnerService.terminaACascataAssociazioneReferenteDelegatoEntePartner(referenteODelegato, referenteODelegato.getCodiceRuolo());
									}
									if(referenteODelegato.getStatoUtente().equals(StatoEnum.NON_ATTIVO.getValue())) {
										this.entePartnerService.cancellaAssociazioneReferenteODelegatoPartner(referenteODelegato, referenteODelegato.getCodiceRuolo());
									}
		});
		try {
			this.storicoService.storicizzaEntePartner(entePartnerProgetto, StatoEnum.TERMINATO.getValue());
		} catch (Exception e) {
			throw new EnteException("Impossibile Storicizzare Ente", CodiceErroreEnum.C02);
		}
		entePartnerProgetto.setStatoEntePartner(StatoEnum.TERMINATO.getValue());
		entePartnerProgetto.setTerminatoSingolarmente(Boolean.TRUE);
		this.entePartnerService.salvaEntePartner(entePartnerProgetto);
	}

	@LogMethod
	@LogExecutionTime
	@Transactional(rollbackOn = Exception.class)
	public void cancellaOTerminaAssociazioneReferenteODelegatoGestoreProgramma(
			@Valid ReferenteDelegatoGestoreProgrammaRequest referenteDelegatoGestoreProgrammaRequest) {
		Long idProgramma = referenteDelegatoGestoreProgrammaRequest.getIdProgrammaGestore();
		String codiceFiscaleUtente = referenteDelegatoGestoreProgrammaRequest.getCfReferenteDelegato();
		Long idEnte = referenteDelegatoGestoreProgrammaRequest.getIdEnteGestore();
		String codiceRuolo = referenteDelegatoGestoreProgrammaRequest.getCodiceRuoloRefDeg();
		ReferentiDelegatiEnteGestoreProgrammaEntity referentiDelegatiEnteGestoreProgrammaEntity = this.referentiDelegatiEnteGestoreProgrammaService.getReferenteDelegatiEnteGestoreProgramma(idProgramma, codiceFiscaleUtente, idEnte, codiceRuolo);
		if(StatoEnum.ATTIVO.getValue().equals(referentiDelegatiEnteGestoreProgrammaEntity.getStatoUtente())) {
			this.terminaAssociazioneReferenteDelegatoGestoreProgramma(referentiDelegatiEnteGestoreProgrammaEntity, codiceRuolo);
		}
		if(StatoEnum.NON_ATTIVO.getValue().equals(referentiDelegatiEnteGestoreProgrammaEntity.getStatoUtente())) {
			this.cancellaAssociazioneReferenteODelegatoGestoreProgramma(referentiDelegatiEnteGestoreProgrammaEntity, codiceRuolo);
		}
	}

	@LogMethod
	@LogExecutionTime
	public void terminaAssociazioneReferenteDelegatoGestoreProgramma(
			ReferentiDelegatiEnteGestoreProgrammaEntity referentiDelegatiEnteGestoreProgrammaEntity,
			String codiceRuolo) {
		Long idProgramma = referentiDelegatiEnteGestoreProgrammaEntity.getId().getIdProgramma();
		String codiceFiscaleUtente = referentiDelegatiEnteGestoreProgrammaEntity.getId().getCodFiscaleUtente();
		Long idEnte = referentiDelegatiEnteGestoreProgrammaEntity.getId().getIdEnte();
		
		//Controllo se sul gestore programma qualcun altro ha lo stesso ruolo dell'utente
		boolean unicoReferenteODelegato = this.referentiDelegatiEnteGestoreProgrammaService.findAltriReferentiODelegatiAttivi(idProgramma, codiceFiscaleUtente, idEnte, codiceRuolo).isEmpty();
		
		//Se l'utente è REG(referente) e non ci sono altri REG(referenti) oltre a lui lancio eccezione.
		if (codiceRuolo.equalsIgnoreCase(RuoloUtenteEnum.REG.toString()) && unicoReferenteODelegato) {
			throw new EnteException("Impossibile terminare associazione referente. E' l'unico referente ATTIVO del gestore programma."
					+ " Per terminarlo procedere prima con l'associazione di un altro referente al gestore programma.", CodiceErroreEnum.EN22);
		}
		referentiDelegatiEnteGestoreProgrammaEntity.setStatoUtente(StatoEnum.TERMINATO.getValue());
		referentiDelegatiEnteGestoreProgrammaEntity.setDataOraAggiornamento(new Date());
		this.referentiDelegatiEnteGestoreProgrammaService.save(referentiDelegatiEnteGestoreProgrammaEntity);
	}
	
	private void terminaACascataAssociazioneReferenteDelegatoGestoreProgramma(
			ReferentiDelegatiEnteGestoreProgrammaEntity referentiDelegatiEnteGestoreProgrammaEntity,
			String codiceRuolo) {
		
		referentiDelegatiEnteGestoreProgrammaEntity.setStatoUtente(StatoEnum.TERMINATO.getValue());
		referentiDelegatiEnteGestoreProgrammaEntity.setDataOraAggiornamento(new Date());
		this.referentiDelegatiEnteGestoreProgrammaService.save(referentiDelegatiEnteGestoreProgrammaEntity);
	}

	@LogMethod
	@LogExecutionTime
	@Transactional(rollbackOn = Exception.class)
	public void cancellaOTerminaAssociazioneReferenteODelegatoGestoreProgetto(
			@Valid ReferenteDelegatoGestoreProgettoRequest referenteDelegatoGestoreProgettoRequest) {
		Long idProgetto = referenteDelegatoGestoreProgettoRequest.getIdProgettoGestore();
		String codiceFiscaleUtente = referenteDelegatoGestoreProgettoRequest.getCfReferenteDelegato();
		Long idEnte = referenteDelegatoGestoreProgettoRequest.getIdEnteGestore();
		String codiceRuolo = referenteDelegatoGestoreProgettoRequest.getCodiceRuoloRefDeg();
		ReferentiDelegatiEnteGestoreProgettoEntity referentiDelegatiEnteGestoreProgettoEntity = this.referentiDelegatiEnteGestoreProgettoService.getReferenteDelegatiEnteGestoreProgetto(idProgetto, codiceFiscaleUtente, idEnte, codiceRuolo);
		if(StatoEnum.ATTIVO.getValue().equals(referentiDelegatiEnteGestoreProgettoEntity.getStatoUtente())) {
			this.terminaAssociazioneReferenteDelegatoGestoreProgetto(referentiDelegatiEnteGestoreProgettoEntity, codiceRuolo);
		}
		if(StatoEnum.NON_ATTIVO.getValue().equals(referentiDelegatiEnteGestoreProgettoEntity.getStatoUtente())) {
			this.cancellaAssociazioneReferenteODelegatoGestoreProgetto(referentiDelegatiEnteGestoreProgettoEntity, codiceRuolo);
		}
	}

	@LogMethod
	@LogExecutionTime
	public void terminaAssociazioneReferenteDelegatoGestoreProgetto(
			ReferentiDelegatiEnteGestoreProgettoEntity referentiDelegatiEnteGestoreProgettoEntity, String codiceRuolo) {
		Long idProgetto = referentiDelegatiEnteGestoreProgettoEntity.getId().getIdProgetto();
		String codiceFiscaleUtente = referentiDelegatiEnteGestoreProgettoEntity.getId().getCodFiscaleUtente();
		Long idEnte = referentiDelegatiEnteGestoreProgettoEntity.getId().getIdEnte();
		
		//Controllo se sul gestore progetto qualcun altro ha lo stesso ruolo dell'utente
		boolean unicoReferenteODelegato = this.referentiDelegatiEnteGestoreProgettoService.findAltriReferentiODelegatiAttivi(idProgetto, codiceFiscaleUtente, idEnte, codiceRuolo).isEmpty();
		
		//Se l'utente è REGP(referente) e non ci sono altri REGP(referenti) oltre a lui lancio eccezione.
		if (codiceRuolo.equalsIgnoreCase("REGP") && unicoReferenteODelegato) {
			throw new EnteException("Impossibile cancellare associazione referente. E' l'unico referente ATTIVO del gestore progetto. "
					+ "Per eliminarlo procedere prima con l'associazione di un altro referente al gestore progetto.", CodiceErroreEnum.EN23);
		 }
		referentiDelegatiEnteGestoreProgettoEntity.setStatoUtente(StatoEnum.TERMINATO.getValue());
		referentiDelegatiEnteGestoreProgettoEntity.setDataOraAggiornamento(new Date());
		this.referentiDelegatiEnteGestoreProgettoService.save(referentiDelegatiEnteGestoreProgettoEntity);
	}
	
	private void terminaACascataAssociazioneReferenteDelegatoGestoreProgetto(
			ReferentiDelegatiEnteGestoreProgettoEntity referentiDelegatiEnteGestoreProgettoEntity) {
		referentiDelegatiEnteGestoreProgettoEntity.setStatoUtente(StatoEnum.TERMINATO.getValue());
		referentiDelegatiEnteGestoreProgettoEntity.setDataOraAggiornamento(new Date());
		this.referentiDelegatiEnteGestoreProgettoService.save(referentiDelegatiEnteGestoreProgettoEntity);
	}

	public DettaglioEnteBean getSchedaEnteLight(Long idEnte) {
		String errorMessage = String.format("Non esiste nessun ente con id = %s ", idEnte);
		EnteEntity ente = this.enteRepository.findById(idEnte).orElseThrow(() -> new EnteException(errorMessage, CodiceErroreEnum.C01));
		
		DettaglioEnteBean dettaglioEnte = new DettaglioEnteBean();
		dettaglioEnte.setId(idEnte);
		dettaglioEnte.setNome(ente.getNome());
		dettaglioEnte.setNomeBreve(ente.getNomeBreve());
		dettaglioEnte.setPiva(ente.getPiva());
		dettaglioEnte.setSedeLegale(ente.getSedeLegale());
		dettaglioEnte.setTipologia(ente.getTipologia());
		dettaglioEnte.setIndirizzoPec(ente.getIndirizzoPec());
		return dettaglioEnte;
	}	
}