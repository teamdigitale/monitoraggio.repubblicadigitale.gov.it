package it.pa.repdgt.programmaprogetto.service;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import it.pa.repdgt.programmaprogetto.annotation.LogExecutionTime;
import it.pa.repdgt.programmaprogetto.annotation.LogMethod;
import it.pa.repdgt.programmaprogetto.bean.DettaglioEntiPartnerBean;
import it.pa.repdgt.programmaprogetto.bean.DettaglioProgettoBean;
import it.pa.repdgt.programmaprogetto.bean.DettaglioSediBean;
import it.pa.repdgt.programmaprogetto.bean.SchedaProgettoBean;
import it.pa.repdgt.programmaprogetto.exception.ProgettoException;
import it.pa.repdgt.programmaprogetto.exception.ProgrammaException;
import it.pa.repdgt.programmaprogetto.exception.ResourceNotFoundException;
import it.pa.repdgt.programmaprogetto.mapper.ProgettoMapper;
import it.pa.repdgt.programmaprogetto.repository.ProgettoRepository;
import it.pa.repdgt.programmaprogetto.request.NuovoProgettoRequest;
import it.pa.repdgt.programmaprogetto.request.ProgettiParam;
import it.pa.repdgt.programmaprogetto.request.ProgettoFiltroRequest;
import it.pa.repdgt.programmaprogetto.resource.ProgrammaDropdownResource;
import it.pa.repdgt.shared.entity.EnteEntity;
import it.pa.repdgt.shared.entity.ProgettoEntity;
import it.pa.repdgt.shared.entity.ProgrammaEntity;
import it.pa.repdgt.shared.entity.ReferentiDelegatiEnteGestoreProgettoEntity;
import it.pa.repdgt.shared.entity.SedeEntity;
import it.pa.repdgt.shared.entity.light.ProgettoLightEntity;
import it.pa.repdgt.shared.entityenum.PolicyEnum;
import it.pa.repdgt.shared.entityenum.StatoEnum;
import it.pa.repdgt.shared.service.storico.StoricoService;

@Service
public class ProgettoService {
	@Autowired
	private EntePartnerService entePartnerService;
	@Autowired
	private EnteService enteService;
	@Autowired
	private SedeService sedeService;
	@Autowired
	private UtenteService utenteService;
	@Autowired
	private ProgrammaService programmaService;
	@Autowired
	private RuoloService ruoloService;
	@Autowired
	private StoricoService storicoService;
	@Autowired
	private ReferentiDelegatiEnteGestoreProgettoService referentiDelegatiEnteGestoreProgettoService;
	@Autowired
	private ReferentiDelegatiEntePartnerService referentiDelegatiEntePartnerService;
	@Autowired
	private EnteSedeProgettoService enteSedeProgettoService;
	@Autowired
	private ProgettoRepository progettoRepository;
	@Autowired
	private ProgettoMapper progettoMapper;
	
	@LogMethod
	@LogExecutionTime
	public List<ProgettoEntity> getAllProgetti() {
		return this.progettoRepository.findAll();
	}

	@LogMethod
	@LogExecutionTime
	public Page<ProgettoEntity> getAllProgettiPaginati(Integer currPage, Integer pageSize) {
		Pageable paginazione = PageRequest.of(currPage, pageSize);
		List<ProgettoEntity> progetti = this.progettoRepository.findAll();
		final int start = (int)paginazione.getOffset();
		final int end = Math.min((start + paginazione.getPageSize()), progetti.size());
		return new PageImpl<ProgettoEntity>(progetti.subList(start, end), paginazione, progetti.size());
	}
	
	/**
	 * @throws ResourceNotFoundException
	 */
	@LogMethod
	@LogExecutionTime
	public ProgettoEntity getProgettoById(Long idProgetto) {
		String errorMessage = String.format("Progetto con id=%s non presente", idProgetto);
		return this.progettoRepository.findById(idProgetto)
				.orElseThrow(() -> new ResourceNotFoundException(errorMessage));
	}
	
	public ProgettoLightEntity getProgettoLightById(Long idProgetto) {
		String errorMessage = String.format("Progetto con id=%s non presente", idProgetto);
		return this.progettoRepository.findProgettoLightById(idProgetto)
				.orElseThrow(() -> new ResourceNotFoundException(errorMessage));
	}
	
	public List<ProgettoEntity> getProgettiByIdProgramma(Long idProgramma) {
		return this.progettoRepository.findProgettiByIdProgramma(idProgramma);
	}
	
	public boolean esisteProgettoById(Long idProgetto) {
		return this.progettoRepository.findById(idProgetto).isPresent();
	}
	
	@LogMethod
	@LogExecutionTime
	public ProgettoEntity creaNuovoProgetto(ProgettoEntity progettoEntity) {
		progettoEntity.setStato(StatoEnum.NON_ATTIVO.getValue());
		progettoEntity.setDataOraCreazione(new Date());
		return this.salvaProgetto(progettoEntity);
	}
	
	@LogMethod
	@LogExecutionTime
	public ProgettoEntity salvaProgetto(ProgettoEntity progetto) {
		return this.progettoRepository.save(progetto);
	}
	
	/**
	 * @throws ProgettoException
	 * */
	@LogMethod
	@LogExecutionTime
	@Transactional(rollbackOn = Exception.class)
	public void cancellazioneProgetto(Long idProgetto) {
		if(!this.progettoRepository.existsById(idProgetto)) {
			String errorMessage = String.format("Impossibile cancellare Progetto con id=%s perchè non presente", idProgetto);
			throw new ProgettoException(errorMessage);
		}
		ProgettoEntity progettoFetchDB = this.progettoRepository.getById(idProgetto);
		if (!isProgettoCancellabileByStatoProgetto(progettoFetchDB.getStato())) {
			String errorMessage = String.format("Impossibile cancellare Progetto con id=%s perchè il suo stato è diverso da NON_ATTIVO", idProgetto);
			throw new ProgettoException(errorMessage);
		}
		this.referentiDelegatiEnteGestoreProgettoService.cancellaReferentiDelegatiProgetto(idProgetto);
		this.referentiDelegatiEntePartnerService.cancellaReferentiDelegatiPartner(idProgetto);
		this.entePartnerService.cancellaEntiPartner(idProgetto);
		this.enteSedeProgettoService.cancellaEnteSedeProgetto(idProgetto);
		
		this.progettoRepository.delete(progettoFetchDB);
	}
	
	/**
	 * Verifica se il progetto può essere cancellato a partire dallo stato del progetto.
	 * Restituisce true se il progetto può essere cancellato e false altrimenti.
	 * 
	 **/
	private boolean isProgettoCancellabileByStatoProgetto(String statoProgetto) {
		return StatoEnum.NON_ATTIVO.getValue().equalsIgnoreCase(statoProgetto);
	}
	
	/**
	 * @throws ProgettoException
	 * */
	@LogMethod
	@LogExecutionTime
	public ProgettoEntity assegnaProgrammaAlProgetto(Long idProgetto, Long idProgramma) {
		ProgettoEntity progettoFetchDB = null;
		try {
			progettoFetchDB = this.getProgettoById(idProgetto);
		} catch (ResourceNotFoundException ex) {
			String errorMessage = String.format("Impossibile Assegnare progetto a programma perchè progetto con id=%s non presente", idProgetto);
			throw new ProgettoException(errorMessage);		
		}
		ProgrammaEntity programmaFetchDB = null;
		try {
			programmaFetchDB = this.programmaService.getProgrammaById(idProgramma);
		} catch (ResourceNotFoundException ex) {
			String errorMessage = String.format("Impossibile Assegnare progetto a programma perchè programma con id=%s non presente", idProgramma);
			throw new ProgettoException(errorMessage);		
		}
		progettoFetchDB.setProgramma(programmaFetchDB);
		return this.salvaProgetto(progettoFetchDB);
	}
	
	/**
	 * @throws ProgettoException
	 * */
	@LogMethod
	@LogExecutionTime
	public ProgettoEntity assegnaEnteGestoreProgetto(Long idProgetto, Long idEnteGestore) {
		ProgettoEntity progettoFetchDB = null;
		try {
			progettoFetchDB = this.getProgettoById(idProgetto);
		} catch (ResourceNotFoundException ex) {
			String errorMessage = String.format("Impossibile Assegnare gestore a progetto perchè progetto con id=%s non presente", idProgetto);
			throw new ProgettoException(errorMessage);		
		}
		EnteEntity enteFetchDB = null;
		try {
			enteFetchDB = this.enteService.getEnteById(idEnteGestore);
		} catch (ResourceNotFoundException ex) {
			String errorMessage = String.format("Impossibile Assegnare gestore a progetto perchè ente gestore con id=%s non presente", idEnteGestore);
			throw new ProgettoException(errorMessage);
		}
		progettoFetchDB.setEnteGestoreProgetto(enteFetchDB);
		progettoFetchDB.setStatoGestoreProgetto(StatoEnum.NON_ATTIVO.getValue());
		return this.salvaProgetto(progettoFetchDB);
	}

	/**
	 * @throws ProgettoException
	 * */
	@LogMethod
	@LogExecutionTime
	public ProgettoEntity aggiornaProgetto(NuovoProgettoRequest progettoRequest, Long idProgetto) {
		if(!this.progettoRepository.existsById(idProgetto)) {
			String errorMessage = String.format("Impossibile aggiornare il progetto. Progetto con id=%s non presente", idProgetto);
			throw new ProgettoException(errorMessage);
		}
		
		ProgettoEntity progettoFetch = this.getProgettoById(idProgetto);
		if (!isProgettoAggiornabileByStatoProgetto(progettoFetch.getStato())) {
			String errorMessage = String.format("Impossibile aggiornare Progetto con id=%s perchè il suo stato è diverso da NON_ATTIVO, ATTIVABILE o ATTIVO", idProgetto);
			throw new ProgettoException(errorMessage);
		}
		this.progettoMapper.toEntityFrom(progettoRequest, progettoFetch);
		progettoFetch.setDataOraAggiornamento(new Date());
		return this.progettoRepository.save(progettoFetch);
	}
	
	/**
	 * Verifica se il progetto può essere aggiornato a partire dallo stato del progetto.
	 * Restituisce true se il progetto può essere cancellato e false altrimenti.
	 * 
	 **/
	private boolean isProgettoAggiornabileByStatoProgetto(String statoProgetto) {
		return (
				StatoEnum.NON_ATTIVO.getValue().equalsIgnoreCase(statoProgetto)
			 ||	StatoEnum.ATTIVABILE.getValue().equalsIgnoreCase(statoProgetto)
			 || StatoEnum.ATTIVO.getValue().equalsIgnoreCase(statoProgetto)  
		);
	}

	public Page<ProgettoEntity> getAllProgettiPaginati(ProgettiParam sceltaContesto,
			Integer currPage, Integer pageSize, ProgettoFiltroRequest filtroRequest) {
		if(this.ruoloService.getCodiceRuoliByCodiceFiscaleUtente(sceltaContesto.getCfUtente()).stream().filter(codiceRuolo -> codiceRuolo.equals(sceltaContesto.getCodiceRuolo())).count() == 0) {
			throw new ProgettoException("ERRORE: ruolo non definito per l'utente");
		}
		Pageable paginazione = PageRequest.of(currPage, pageSize);
		List<ProgettoEntity> progettiUtente = this.getProgettiByRuolo(sceltaContesto.getCodiceRuolo(), sceltaContesto.getCfUtente(), sceltaContesto.getIdProgramma(), filtroRequest);
		progettiUtente.sort((progetto1, progetto2) -> progetto1.getId().compareTo(progetto2.getId()));
		int start = (int) paginazione.getOffset();
		int end = Math.min((start + paginazione.getPageSize()), progettiUtente.size());
		if(start > end) {
			throw new ProgettoException("ERRORE: pagina richiesta inesistente");
		}
		return new PageImpl<ProgettoEntity>(progettiUtente.subList(start, end), paginazione, progettiUtente.size());
	}

	/**
	 * Recupera tutti i progetti filtrati in base al filtro passato che sono associati all'utente che ha quel ruolo associato a quel particolare progetto
	 *
	 * @param codiceRuolo - il ruolo scelto dall'utente in fase di login
	 * @return List<ProgettoEntity> progetti - la lista dei progetti associati all'utente
	 */
	@LogMethod
	@LogExecutionTime
	public List<ProgettoEntity> getProgettiByRuolo(String codiceRuolo, String cfUtente, Long idProgramma, ProgettoFiltroRequest filtroRequest) {
		List<ProgettoEntity> progettiUtente = new ArrayList<>();
		switch (codiceRuolo) {
			case "DTD":
				return this.getAllProgetti(filtroRequest);
			case "DSCU":
				return this.getProgettiPerDSCU(filtroRequest);
			case "REG":
			case "DEG":
				return this.getProgettiPerReferenteDelegatoGestoreProgramma(idProgramma, filtroRequest);
			case "REGP":
			case "DEGP":
				progettiUtente.addAll(this.getProgettiPerReferenteDelegatoGestoreProgetti(idProgramma, cfUtente, codiceRuolo, filtroRequest));
				return progettiUtente;
			case "REPP":
			case "DEPP":
				progettiUtente.addAll(this.getProgettiPerReferenteDelegatoEntePartnerProgetti(idProgramma, cfUtente, codiceRuolo, filtroRequest));
				return progettiUtente;
			default:
				return this.getAllProgetti(filtroRequest);
		}
	}

	private List<ProgettoEntity> getProgettiPerReferenteDelegatoEntePartnerProgetti(Long idProgramma, String cfUtente, String codiceRuolo, ProgettoFiltroRequest filtroRequest) {
		return this.progettoRepository.findProgettiPerReferenteDelegatoEntePartnerProgetti(idProgramma, cfUtente, codiceRuolo,
																				  filtroRequest.getCriterioRicerca(),
																				  "%" + filtroRequest.getCriterioRicerca() + "%",
																				  filtroRequest.getPolicies(),
																				  filtroRequest.getIdsProgrammi(),
																				  filtroRequest.getStati());
	}

	private List<ProgettoEntity> getProgettiPerReferenteDelegatoGestoreProgramma(Long idProgramma, ProgettoFiltroRequest filtroRequest) {
		return this.progettoRepository.findProgettiPerReferenteDelegatoGestoreProgramma(
																	   idProgramma,
																	   filtroRequest.getCriterioRicerca(),
																	   "%" + filtroRequest.getCriterioRicerca() + "%",
																	   filtroRequest.getPolicies(),
																	   filtroRequest.getIdsProgrammi(),
																	   filtroRequest.getStati());
	}
	
	/**
	 * @throws ResourceNotFoundException
	 * */
	@LogMethod
	@LogExecutionTime
	public List<ProgettoEntity> getProgettiPerReferenteDelegatoGestoreProgetti(Long idProgramma, String cfUtente, String codiceRuolo, ProgettoFiltroRequest filtroRequest) {
		return this.progettoRepository.findProgettiPerReferenteDelegatoGestoreProgetti(idProgramma, cfUtente, codiceRuolo,
																				  filtroRequest.getCriterioRicerca(),
																				  "%" + filtroRequest.getCriterioRicerca() + "%",
																				  filtroRequest.getPolicies(),
																				  filtroRequest.getIdsProgrammi(),
																				  filtroRequest.getStati());
	}

	private List<ProgettoEntity> getProgettiPerDSCU(ProgettoFiltroRequest filtroRequest) {
		return this.progettoRepository.findByPolicy(
				PolicyEnum.SCD.toString(),
				filtroRequest.getCriterioRicerca(),
				"%" + filtroRequest.getCriterioRicerca() + "%",
				filtroRequest.getIdsProgrammi(),
				filtroRequest.getStati()
				);
	}

	private List<ProgettoEntity> getAllProgetti(ProgettoFiltroRequest filtroRequest) {
		return this.progettoRepository.findAll(
				filtroRequest.getCriterioRicerca(),
				"%" + filtroRequest.getCriterioRicerca() + "%",
				filtroRequest.getPolicies(),
				filtroRequest.getIdsProgrammi(),
				filtroRequest.getStati()
				);
	}

	@LogMethod
	@LogExecutionTime
	public List<String> getAllStatiDropdown(ProgettiParam sceltaContesto,
			ProgettoFiltroRequest filtroRequest) {
		if(this.ruoloService.getCodiceRuoliByCodiceFiscaleUtente(sceltaContesto.getCfUtente()).stream().filter(codiceRuolo -> codiceRuolo.equals(sceltaContesto.getCodiceRuolo())).count() == 0) {
			throw new ProgrammaException("ERRORE: ruolo non definito per l'utente");
		}
		return this.getAllStatiByRuoloAndIdProgetto(sceltaContesto.getCodiceRuolo(),sceltaContesto.getCfUtente(), sceltaContesto.getIdProgramma(), filtroRequest);
	}
	
	@LogMethod
	@LogExecutionTime
	public List<String> getAllStatiByRuoloAndIdProgetto(String codiceRuolo, String cfUtente, Long idProgramma, ProgettoFiltroRequest filtroRequest) {
		List<String> stati = new ArrayList<>();
		switch (codiceRuolo) {
			case "DTD":
				return this.getAllStati(filtroRequest);
			case "DSCU":
				List<String> result = this.getStatiPerDSCU(filtroRequest);
				stati.addAll(result);
				return stati;
			case "REG":
			case "DEG":
				return this.getStatiPerReferenteDelegatoGestoreProgramma(idProgramma, filtroRequest);
			case "REGP":
			case "DEGP":
				stati.addAll(this.getStatiPerReferenteDelegatoGestoreProgetti(idProgramma, cfUtente, codiceRuolo, filtroRequest));
				return stati;
			case "REPP":
			case "DEPP":
				stati.addAll(this.getStatiPerReferenteDelegatoEntePartnerProgetti(idProgramma, cfUtente, codiceRuolo, filtroRequest));
				return stati;
			default:
				return this.getAllStati(filtroRequest);
		}
	}
	
	private Collection<? extends String> getStatiPerReferenteDelegatoEntePartnerProgetti(Long idProgramma, String cfUtente, String codiceRuolo, ProgettoFiltroRequest filtroRequest) {
		return this.progettoRepository.findStatiPerReferenteDelegatoEntePartnerProgetti(idProgramma, cfUtente, codiceRuolo,
																				  filtroRequest.getCriterioRicerca(),
																				  "%" + filtroRequest.getCriterioRicerca() + "%",
																				  filtroRequest.getPolicies(),
																				  filtroRequest.getIdsProgrammi(),
																				  filtroRequest.getStati());
	}

	private List<String> getStatiPerReferenteDelegatoGestoreProgetti(Long idProgramma, String cfUtente, String codiceRuolo, ProgettoFiltroRequest filtroRequest) {
		return this.progettoRepository.findStatiPerReferenteDelegatoGestoreProgetti(idProgramma, cfUtente, codiceRuolo,
																				  filtroRequest.getCriterioRicerca(),
																				  "%" + filtroRequest.getCriterioRicerca() + "%",
																				  filtroRequest.getPolicies(),
																				  filtroRequest.getIdsProgrammi(),
																				  filtroRequest.getStati());
	}

	private List<String> getStatiPerReferenteDelegatoGestoreProgramma(Long idProgramma, ProgettoFiltroRequest filtroRequest) {
		return this.progettoRepository.findStatiPerReferenteDelegatoGestoreProgramma(idProgramma,
																	   filtroRequest.getCriterioRicerca(),
																	   "%" + filtroRequest.getCriterioRicerca() + "%",
																	   filtroRequest.getPolicies(),
																	   filtroRequest.getIdsProgrammi(),
																	   filtroRequest.getStati());
	}

//	private String getStatoProgettoByProgettoId(Long idProgetto, ProgettoFiltroRequest filtroRequest) {
//		return this.progettoRepository.findStatoById(
//				idProgetto,
//				filtroRequest.getNome(),
//				filtroRequest.getIdsProgrammi(),
//				filtroRequest.getPolicies(),
//				filtroRequest.getStati())
//				.orElseThrow(() -> new ResourceNotFoundException(KeyMessageConstants.RES_ID_NOT_FOUND,
//						new Object[]{idProgetto}));
//	}

	public List<String> getAllStati(ProgettoFiltroRequest filtroRequest) {
		return this.progettoRepository.findAllStati(
			    filtroRequest.getCriterioRicerca(),
			    "%" + filtroRequest.getCriterioRicerca() + "%",
				filtroRequest.getPolicies(),
				filtroRequest.getIdsProgrammi(),
				filtroRequest.getStati()
				);
	}
	
	private List<String> getStatiPerDSCU(ProgettoFiltroRequest filtroRequest) {
		return this.progettoRepository.findStatiByPolicy(
				PolicyEnum.SCD.toString(),
				filtroRequest.getCriterioRicerca(),
			    "%" + filtroRequest.getCriterioRicerca() + "%",
				filtroRequest.getIdsProgrammi(),
				filtroRequest.getStati()
				);
	}

	public List<ProgrammaDropdownResource> getAllProgrammiDropdownPerProgetti(ProgettiParam sceltaContesto) {
		return this.programmaService.getAllProgrammiDropdownPerProgetti(sceltaContesto, sceltaContesto.getFiltroRequest());
	}
	
	public List<String> getAllPoliciesDropdownPerProgetti(ProgettiParam sceltaContesto) {
		return this.programmaService.getAllPoliciesDropdownPerProgetti(sceltaContesto, sceltaContesto.getFiltroRequest());
	}

	public SchedaProgettoBean getSchedaProgettoById(Long idProgetto) {
		ProgettoEntity progettoFetchDB = this.progettoRepository.getById(idProgetto);
		
		DettaglioProgettoBean dettaglioProgetto = this.progettoMapper.toDettaglioProgettoBeanFrom(progettoFetchDB);
		dettaglioProgetto.setId(idProgetto);
		
		List<Long> listaIdEntiPartner = this.entePartnerService.getIdEntiPartnerByProgetto(idProgetto);
		List<DettaglioEntiPartnerBean> listaEntiPartner = listaIdEntiPartner
									 .stream()
									 .map(idEnte -> {
										 EnteEntity enteFetchDB = this.enteService.getEnteById(idEnte);
										 DettaglioEntiPartnerBean dettaglioEntePartner = new DettaglioEntiPartnerBean();
										 dettaglioEntePartner.setId(idEnte);
										 dettaglioEntePartner.setNome(enteFetchDB.getNome());
										 dettaglioEntePartner.setReferenti(this.entePartnerService.getReferentiEntePartnerProgetto(idProgetto, idEnte));
										 dettaglioEntePartner.setStato(this.entePartnerService.getStatoEntePartner(idProgetto, idEnte));
										 return dettaglioEntePartner;
									 })
									 .collect(Collectors.toList());
		
		List<SedeEntity> listaSediProgetto = this.sedeService.getSediByIdProgetto(idProgetto);
		
		Map<SedeEntity, List<Long>> mappaSediProgettoEnte = new HashMap<>();
		
		listaSediProgetto.forEach(sedeProgetto -> {
			mappaSediProgettoEnte.put(sedeProgetto, this.enteService.getIdEnteByIdProgettoAndIdSede(idProgetto, sedeProgetto.getId()));
		});
		
		List<DettaglioSediBean> listaDettaglioSedi = new ArrayList<>();
		mappaSediProgettoEnte.keySet()
			.stream()
			.forEach(sede -> {
				List<Long> listaIdEnti = mappaSediProgettoEnte.get(sede);
				List<DettaglioSediBean> listaDettaglioSediParziale = listaIdEnti
						.stream()
						.map(idEnte -> {
							DettaglioSediBean dettaglioSede = new DettaglioSediBean();
							dettaglioSede.setId(sede.getId());
						    dettaglioSede.setNome(sede.getNome());
						    dettaglioSede.setRuoloEnte(this.enteService.getRuoloEnteByIdProgettoAndIdSedeAndIdEnte(idProgetto, sede.getId(), idEnte));
						    dettaglioSede.setNrFacilitatori(this.utenteService.countFacilitatoriPerSedeProgettoEnte(idProgetto, sede.getId(), idEnte));
						    dettaglioSede.setServiziErogati(sede.getServiziErogati());
						    dettaglioSede.setEnteDiRiferimento(this.enteService.getEnteById(idEnte).getNome());
						    dettaglioSede.setStato(this.sedeService.getStatoSedeByIdProgettoAndIdSedeAndIdEnte(idProgetto, sede.getId(), idEnte));
						    return dettaglioSede;
				})
				.collect(Collectors.toList());
				listaDettaglioSedi.addAll(listaDettaglioSediParziale);
			});
		
		SchedaProgettoBean schedaProgetto = new SchedaProgettoBean();
		schedaProgetto.setDettaglioProgetto(dettaglioProgetto);
		schedaProgetto.setEntiPartner(listaEntiPartner);
		schedaProgetto.setSedi(listaDettaglioSedi);
		schedaProgetto.setIdEnteGestoreProgetto(progettoFetchDB.getEnteGestoreProgetto().getId());
		return schedaProgetto;
	}

	@Transactional(rollbackOn = Exception.class)
	public void terminaProgetto(Long idProgetto) {
		ProgettoEntity progettoDBFetch = this.getProgettoById(idProgetto);
		if(!isProgettoTerminabileByStatoProgetto(progettoDBFetch.getStato())) {
			String errorMessage = String.format("Impossibile terminare il progetto con id=%s perchè stato diverso da 'ATTIVABILE' o 'ATTIVO'", idProgetto);
			throw new ProgettoException(errorMessage);
		}
		//prendo la lista di referenti e delegati
		List<ReferentiDelegatiEnteGestoreProgettoEntity> referentiEDelegatiProgetto = this.referentiDelegatiEnteGestoreProgettoService.getReferentiEDelegatiProgetto(idProgetto);
		//se sono ATTIVI li termino, se sono NON ATTIVI li cancello
		referentiEDelegatiProgetto.forEach(this.referentiDelegatiEnteGestoreProgettoService::cancellaOTerminaAssociazioneReferenteDelegatoProgetto);
		progettoDBFetch.setStato(StatoEnum.TERMINATO.getValue());
		this.storicoService.storicizzaEnteGestoreProgetto(progettoDBFetch);
		this.enteService.terminaEntiPartner(idProgetto);
		this.enteSedeProgettoService.cancellaOTerminaEnteSedeProgetto(idProgetto);
		progettoDBFetch.setStatoGestoreProgetto(StatoEnum.TERMINATO.getValue());
		progettoDBFetch.setDataOraTerminazione(new Date());
		this.salvaProgetto(progettoDBFetch);
	}
	
	/**
	 * Verifica se il progetto può essere terminato a partire dallo stato del progetto.
	 * Restituisce true se il progetto può essere cancellato e false altrimenti.
	 * 
	 **/
	private boolean isProgettoTerminabileByStatoProgetto(String statoProgetto) {
		return (    
				StatoEnum.ATTIVABILE.getValue().equalsIgnoreCase(statoProgetto)
			 || StatoEnum.ATTIVO.getValue().equalsIgnoreCase(statoProgetto)  
		);
	}
}