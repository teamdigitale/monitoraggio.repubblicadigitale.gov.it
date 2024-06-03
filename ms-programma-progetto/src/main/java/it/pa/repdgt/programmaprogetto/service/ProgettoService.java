package it.pa.repdgt.programmaprogetto.service;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

import it.pa.repdgt.programmaprogetto.bean.DettaglioEntiPartnerBean;
import it.pa.repdgt.programmaprogetto.bean.DettaglioProgettoBean;
import it.pa.repdgt.programmaprogetto.bean.DettaglioProgrammaLightBean;
import it.pa.repdgt.programmaprogetto.bean.DettaglioSediBean;
import it.pa.repdgt.programmaprogetto.bean.SchedaProgettoBean;
import it.pa.repdgt.programmaprogetto.exception.ProgettoException;
import it.pa.repdgt.programmaprogetto.exception.ResourceNotFoundException;
import it.pa.repdgt.programmaprogetto.mapper.ProgettoMapper;
import it.pa.repdgt.programmaprogetto.repository.ProgettoRepository;
import it.pa.repdgt.programmaprogetto.request.ProgettiParam;
import it.pa.repdgt.programmaprogetto.request.ProgettoFiltroRequest;
import it.pa.repdgt.programmaprogetto.request.ProgettoRequest;
import it.pa.repdgt.programmaprogetto.resource.PaginaProgetti;
import it.pa.repdgt.programmaprogetto.resource.ProgrammaDropdownResource;
import it.pa.repdgt.shared.annotation.LogExecutionTime;
import it.pa.repdgt.shared.annotation.LogMethod;
import it.pa.repdgt.shared.awsintegration.service.EmailService;
import it.pa.repdgt.shared.entity.EnteEntity;
import it.pa.repdgt.shared.entity.ProgettoEntity;
import it.pa.repdgt.shared.entity.ProgrammaEntity;
import it.pa.repdgt.shared.entity.ReferentiDelegatiEnteGestoreProgettoEntity;
import it.pa.repdgt.shared.entity.SedeEntity;
import it.pa.repdgt.shared.entityenum.EmailTemplateEnum;
import it.pa.repdgt.shared.entityenum.PolicyEnum;
import it.pa.repdgt.shared.entityenum.RuoloUtenteEnum;
import it.pa.repdgt.shared.entityenum.StatoEnum;
import it.pa.repdgt.shared.exception.CodiceErroreEnum;
import it.pa.repdgt.shared.repository.BrokenAccessControlRepository;
import it.pa.repdgt.shared.restapi.param.SceltaProfiloParam;
import it.pa.repdgt.shared.service.storico.StoricoService;
import lombok.extern.slf4j.Slf4j;

@Slf4j
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
	@Lazy
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
	private EnteSedeProgettoFacilitatoreService enteSedeProgettoFacilitatoreService;
	@Autowired
	private EmailService emailService;
	@Autowired
	private ProgettoRepository progettoRepository;
	@Autowired
	private ProgettoMapper progettoMapper;
	@Autowired
	private BrokenAccessControlRepository brokenAccessControlRepository;

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

	@LogMethod
	@LogExecutionTime
	public List<ProgettoEntity> getProgettiByIdProgramma(Long idProgramma) {
		return this.progettoRepository.findProgettiByIdProgramma(idProgramma);
	}

	@LogMethod
	@LogExecutionTime
	public ProgettoEntity creaNuovoProgetto(ProgettoEntity progettoEntity) {
		if(progettoEntity.getDataInizioProgetto().after(progettoEntity.getDataFineProgetto())) {
			String errorMessage = String.format("Impossibile creare il progetto. La data di fine non può essere antecedente alla data di inizio");
			throw new ProgettoException(errorMessage, CodiceErroreEnum.PR01);
		}
		progettoEntity.setStato(StatoEnum.NON_ATTIVO.getValue());
		progettoEntity.setDataOraCreazione(new Date());
		progettoEntity.setDataOraAggiornamento(progettoEntity.getDataOraCreazione());
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
			throw new ProgettoException(errorMessage, CodiceErroreEnum.PR02);
		}
		ProgettoEntity progettoFetchDB = this.getProgettoById(idProgetto);
		if (!isProgettoCancellabileByStatoProgetto(progettoFetchDB.getStato())) {
			String errorMessage = String.format("Impossibile cancellare Progetto con id=%s perchè il suo stato è diverso da NON_ATTIVO", idProgetto);
			throw new ProgettoException(errorMessage, CodiceErroreEnum.PR02);
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
			throw new ProgettoException(errorMessage, CodiceErroreEnum.PR06);
		}
		ProgrammaEntity programmaFetchDB = null;
		try {
			programmaFetchDB = this.programmaService.getProgrammaById(idProgramma);
		} catch (ResourceNotFoundException ex) {
			String errorMessage = String.format("Impossibile Assegnare progetto a programma perchè programma con id=%s non presente", idProgramma);
			throw new ProgettoException(errorMessage, CodiceErroreEnum.PR06);
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
			throw new ProgettoException(errorMessage, CodiceErroreEnum.PR05);
		}
		EnteEntity enteFetchDB = null;
		try {
			enteFetchDB = this.enteService.getEnteById(idEnteGestore);
		} catch (ResourceNotFoundException ex) {
			String errorMessage = String.format("Impossibile Assegnare gestore a progetto perchè ente gestore con id=%s non presente", idEnteGestore);
			throw new ProgettoException(errorMessage, CodiceErroreEnum.PR05);
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
	public ProgettoEntity aggiornaProgetto(ProgettoRequest progettoRequest, Long idProgetto) {
		if(!this.progettoRepository.existsById(idProgetto)) {
			String errorMessage = String.format("Impossibile aggiornare il progetto. Progetto con id=%s non presente", idProgetto);
			throw new ProgettoException(errorMessage, CodiceErroreEnum.PR04);
		}

		ProgettoEntity progettoFetch = this.getProgettoById(idProgetto);
		if (!isProgettoAggiornabileByStatoProgetto(progettoFetch.getStato())) {
			String errorMessage = String.format("Impossibile aggiornare Progetto con id=%s perchè il suo stato è diverso da NON_ATTIVO, ATTIVABILE o ATTIVO", idProgetto);
			throw new ProgettoException(errorMessage, CodiceErroreEnum.PR04);
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
	@LogMethod
	@LogExecutionTime
	public boolean isProgettoAggiornabileByStatoProgetto(String statoProgetto) {
		return (
				StatoEnum.NON_ATTIVO.getValue().equalsIgnoreCase(statoProgetto)
				||	StatoEnum.ATTIVABILE.getValue().equalsIgnoreCase(statoProgetto)
				|| StatoEnum.ATTIVO.getValue().equalsIgnoreCase(statoProgetto)
				);
	}

	@LogMethod
	@LogExecutionTime
	public PaginaProgetti getAllProgettiPaginati(ProgettiParam sceltaContesto,
			Integer currPage, Integer pageSize, ProgettoFiltroRequest filtroRequest) {
		return this.getProgettiByRuoloPaginati(sceltaContesto.getCodiceRuoloUtenteLoggato(), sceltaContesto.getCfUtenteLoggato(), sceltaContesto.getIdProgramma(), sceltaContesto.getIdProgetto(), filtroRequest, currPage, pageSize);
	}

	/**
	 * Recupera tutti i progetti filtrati in base al filtro passato che sono associati all'utente che ha quel ruolo associato a quel particolare progetto
	 *
	 * @param codiceRuolo - il ruolo scelto dall'utente in fase di login
	 * @return List<ProgettoEntity> progetti - la lista dei progetti associati all'utente
	 */
	@LogMethod
	@LogExecutionTime
	public List<ProgettoEntity> getProgettiByRuolo(String codiceRuolo, String cfUtente, Long idProgramma, Long idProgetto, ProgettoFiltroRequest filtroRequest) {
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
			case "REPP":
			case "DEPP":
			case "FAC":
			case "VOL":
				progettiUtente.add(this.getProgettoById(idProgetto));
				return progettiUtente;
			default:
				return this.getAllProgetti(filtroRequest);
		}
	}

	/**
	 * Recupera tutti i progetti filtrati e paginati in base al filtro passato che sono associati all'utente che ha quel ruolo associato a quel particolare progetto
	 *
	 * @param codiceRuolo - il ruolo scelto dall'utente in fase di login
	 * @return List<ProgettoEntity> progetti - la lista dei progetti associati all'utente
	 */
	@LogMethod
	@LogExecutionTime
	public PaginaProgetti getProgettiByRuoloPaginati(String codiceRuolo, String cfUtente, Long idProgramma, Long idProgetto, ProgettoFiltroRequest filtroRequest, Integer currPage, Integer pageSize) {
		PaginaProgetti paginaProgetti = new PaginaProgetti();
		Long numeroElementi = 0L;
		switch (codiceRuolo) {
		case "DTD":
			paginaProgetti.setPaginaProgetti(getAllProgettiPaginati(filtroRequest, currPage, pageSize));
			numeroElementi = getCountAllProgetti(filtroRequest);
			break;
		case "DSCU":
			paginaProgetti.setPaginaProgetti(this.getProgettiPerDSCUPaginati(filtroRequest, currPage, pageSize));
			numeroElementi = getCountProgettiPerDSCU(filtroRequest);
			break;
		case "REG":
		case "DEG":
			paginaProgetti.setPaginaProgetti(this.getProgettiPerReferenteDelegatoGestoreProgrammaPaginati(idProgramma, filtroRequest, currPage, pageSize));
			numeroElementi = getCountProgettiPerReferenteDelegatoGestoreProgramma(idProgramma, filtroRequest);
			break;
		case "REGP":
		case "DEGP":
		case "REPP":
		case "DEPP":
		case "FAC":
		case "VOL":
			paginaProgetti.setPaginaProgetti(Arrays.asList(this.getProgettoById(idProgetto)));
			numeroElementi = 1L;
			break;
		default:
			paginaProgetti.setPaginaProgetti(getAllProgettiPaginati(filtroRequest, currPage, pageSize));
			numeroElementi = getCountAllProgetti(filtroRequest);
			break;
		}
		paginaProgetti.setTotalElements(numeroElementi);
		Integer pagine = (int) (numeroElementi/pageSize);
		paginaProgetti.setTotalPages(numeroElementi%pageSize > 0 ? pagine + 1 : pagine);

		if(paginaProgetti.getTotalElements() > 0 && currPage >= paginaProgetti.getTotalPages()) {
			throw new ProgettoException("Errore Pagina richiesta non esistente", CodiceErroreEnum.G03);
		}

		return paginaProgetti;
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

	private Long getCountProgettiPerReferenteDelegatoGestoreProgramma(Long idProgramma, ProgettoFiltroRequest filtroRequest) {
		return this.progettoRepository.countProgettiPerReferenteDelegatoGestoreProgramma(
				idProgramma,
				filtroRequest.getCriterioRicerca(),
				"%" + filtroRequest.getCriterioRicerca() + "%",
				filtroRequest.getPolicies(),
				filtroRequest.getIdsProgrammi(),
				filtroRequest.getStati());
	}

	private List<ProgettoEntity> getProgettiPerReferenteDelegatoGestoreProgrammaPaginati(Long idProgramma, ProgettoFiltroRequest filtroRequest, Integer currPage, Integer pageSize) {
		return this.progettoRepository.findProgettiPerReferenteDelegatoGestoreProgrammaPaginati(
				idProgramma,
				filtroRequest.getCriterioRicerca(),
				"%" + filtroRequest.getCriterioRicerca() + "%",
				filtroRequest.getPolicies(),
				filtroRequest.getIdsProgrammi(),
				filtroRequest.getStati(),
				currPage*pageSize,
				pageSize);
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

	private Long getCountProgettiPerDSCU(ProgettoFiltroRequest filtroRequest) {
		return this.progettoRepository.countByPolicy(
				PolicyEnum.SCD.toString(),
				filtroRequest.getCriterioRicerca(),
				"%" + filtroRequest.getCriterioRicerca() + "%",
				filtroRequest.getIdsProgrammi(),
				filtroRequest.getStati()
				);
	}

	private List<ProgettoEntity> getProgettiPerDSCUPaginati(ProgettoFiltroRequest filtroRequest, Integer currPage, Integer pageSize) {
		return this.progettoRepository.findByPolicyPaginati(
				PolicyEnum.SCD.toString(),
				filtroRequest.getCriterioRicerca(),
				"%" + filtroRequest.getCriterioRicerca() + "%",
				filtroRequest.getIdsProgrammi(),
				filtroRequest.getStati(),
				currPage*pageSize,
				pageSize
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

	private List<ProgettoEntity> getAllProgettiPaginati(ProgettoFiltroRequest filtroRequest, Integer currPage, Integer pageSize) {
		return this.progettoRepository.findAllPaginati(
				filtroRequest.getCriterioRicerca(),
				"%" + filtroRequest.getCriterioRicerca() + "%",
				filtroRequest.getPolicies(),
				filtroRequest.getIdsProgrammi(),
				filtroRequest.getStati(),
				currPage*pageSize,
				pageSize
				);
	}

	private Long getCountAllProgetti(ProgettoFiltroRequest filtroRequest) {
		return this.progettoRepository.countAll(
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
		return this.getAllStatiByRuoloAndIdProgramma(sceltaContesto.getCodiceRuoloUtenteLoggato(),sceltaContesto.getCfUtenteLoggato(), sceltaContesto.getIdProgramma(), sceltaContesto.getIdProgetto(), filtroRequest);
	}

	@LogMethod
	@LogExecutionTime
	public List<String> getAllStatiByRuoloAndIdProgramma(String codiceRuolo, String cfUtente, Long idProgramma, Long idProgetto, ProgettoFiltroRequest filtroRequest) {
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
			stati.add(this.getProgettoById(idProgetto).getStato());
			return stati;
		case "REPP":
		case "DEPP":
			stati.add(this.getProgettoById(idProgetto).getStato());
			return stati;
		default:
			return this.getAllStati(filtroRequest);
		}
	}

	@LogMethod
	@LogExecutionTime
	public List<String> getStatiPerReferenteDelegatoGestoreProgramma(Long idProgramma, ProgettoFiltroRequest filtroRequest) {
		return this.progettoRepository.findStatiPerReferenteDelegatoGestoreProgramma(idProgramma,
				filtroRequest.getCriterioRicerca(),
				"%" + filtroRequest.getCriterioRicerca() + "%",
				filtroRequest.getPolicies(),
				filtroRequest.getIdsProgrammi(),
				filtroRequest.getStati());
	}

	@LogMethod
	@LogExecutionTime
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

	@LogMethod
	@LogExecutionTime
	public List<ProgrammaDropdownResource> getAllProgrammiDropdownPerProgetti(ProgettiParam sceltaContesto) {
		return this.programmaService.getAllProgrammiDropdownPerProgetti(sceltaContesto, sceltaContesto.getFiltroRequest());
	}

	@LogMethod
	@LogExecutionTime
	public List<String> getAllPoliciesDropdownPerProgetti(ProgettiParam sceltaContesto) {
		return this.programmaService.getAllPoliciesDropdownPerProgetti(sceltaContesto, sceltaContesto.getFiltroRequest());
	}

	@LogMethod
	@LogExecutionTime
	public SchedaProgettoBean getSchedaProgettoById(Long idProgetto) {
		ProgettoEntity progettoFetchDB = this.getProgettoById(idProgetto);
		ProgrammaEntity programmaFetchDB = progettoFetchDB.getProgramma();

		DettaglioProgrammaLightBean dettaglioProgramma = this.progettoMapper.toDettaglioProgrammaLightBeanFrom(programmaFetchDB);

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
						EnteEntity enteDiRiferimento = this.enteService.getEnteById(idEnte);
						dettaglioSede.setIdenteDiRiferimento(enteDiRiferimento.getId());
						dettaglioSede.setEnteDiRiferimento(enteDiRiferimento.getNome());
						dettaglioSede.setStato(this.sedeService.getStatoSedeByIdProgettoAndIdSedeAndIdEnte(idProgetto, sede.getId(), idEnte));
						return dettaglioSede;
					})
					.collect(Collectors.toList());
			listaDettaglioSedi.addAll(listaDettaglioSediParziale);
		});

		SchedaProgettoBean schedaProgetto = new SchedaProgettoBean();
		schedaProgetto.setDettaglioProgramma(dettaglioProgramma);
		schedaProgetto.setDettaglioProgetto(dettaglioProgetto);
		schedaProgetto.setEntiPartner(listaEntiPartner);
		schedaProgetto.setSedi(listaDettaglioSedi);
		schedaProgetto.setIdEnteGestoreProgetto(progettoFetchDB.getEnteGestoreProgetto() != null ? progettoFetchDB.getEnteGestoreProgetto().getId() : null );
		return schedaProgetto;
	}

	@LogMethod
	@LogExecutionTime
	public SchedaProgettoBean getSchedaProgettoByIdAndSceltaProfilo(Long idProgetto, SceltaProfiloParam sceltaProfilo) {
		ProgettoEntity progettoFetchDB = this.getProgettoById(idProgetto);
		ProgrammaEntity programmaFetchDB = progettoFetchDB.getProgramma();

		DettaglioProgrammaLightBean dettaglioProgramma = this.progettoMapper.toDettaglioProgrammaLightBeanFrom(programmaFetchDB);

		DettaglioProgettoBean dettaglioProgetto = this.progettoMapper.toDettaglioProgettoBeanFrom(progettoFetchDB);
		dettaglioProgetto.setId(idProgetto);

		String codiceRuoloUtenteLoggato = sceltaProfilo.getCodiceRuoloUtenteLoggato();
		String cfUtenteLoggato = sceltaProfilo.getCfUtenteLoggato();
		Long idEnteProfilazione = sceltaProfilo.getIdEnte();
		
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
					switch(codiceRuoloUtenteLoggato) {
						case "REPP":
							List<String> referentiEntePartner = this.entePartnerService.getCodiceFiscaleReferentiODelegatiEntePartnerProgetto(idProgetto, idEnte, RuoloUtenteEnum.REPP.toString());
							dettaglioEntePartner.setAssociatoAUtente(idEnte.equals(idEnteProfilazione) && referentiEntePartner.contains(cfUtenteLoggato));
							break;
						case "DEPP":
							List<String> delegatiEntePartner = this.entePartnerService.getCodiceFiscaleReferentiODelegatiEntePartnerProgetto(idProgetto, idEnte, RuoloUtenteEnum.DEPP.toString());
							dettaglioEntePartner.setAssociatoAUtente(idEnte.equals(idEnteProfilazione) && delegatiEntePartner.contains(cfUtenteLoggato));
							break;
						case "FAC":
						case "VOL":
							boolean isEnteAssociatoAFacOVol = this.enteSedeProgettoFacilitatoreService.isEnteAssociatoAFacVol(idEnte, idProgetto, cfUtenteLoggato);
							dettaglioEntePartner.setAssociatoAUtente(idEnte.equals(idEnteProfilazione) && isEnteAssociatoAFacOVol);
							break;
						default:
							dettaglioEntePartner.setAssociatoAUtente(true);
							break;
					}
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
						EnteEntity enteDiRiferimento = this.enteService.getEnteById(idEnte);
						dettaglioSede.setIdenteDiRiferimento(enteDiRiferimento.getId());
						dettaglioSede.setEnteDiRiferimento(enteDiRiferimento.getNome());
						dettaglioSede.setStato(this.sedeService.getStatoSedeByIdProgettoAndIdSedeAndIdEnte(idProgetto, sede.getId(), idEnte));
						switch(codiceRuoloUtenteLoggato) {
						case "REPP":
							List<String> referentiEntePartner = this.entePartnerService.getCodiceFiscaleReferentiODelegatiEntePartnerProgetto(idProgetto, idEnte, RuoloUtenteEnum.REPP.toString());
							dettaglioSede.setAssociatoAUtente(idEnte.equals(idEnteProfilazione) && referentiEntePartner.contains(cfUtenteLoggato));
							break;
						case "DEPP":
							List<String> delegatiEntePartner = this.entePartnerService.getCodiceFiscaleReferentiODelegatiEntePartnerProgetto(idProgetto, idEnte, RuoloUtenteEnum.DEPP.toString());
							dettaglioSede.setAssociatoAUtente(idEnte.equals(idEnteProfilazione) && delegatiEntePartner.contains(cfUtenteLoggato));
							break;
						case "FAC":
						case "VOL":
							boolean isSedeAssociataAFacOVol = this.enteSedeProgettoFacilitatoreService.getById(idEnte, sede.getId(), idProgetto, cfUtenteLoggato).isPresent();
							dettaglioSede.setAssociatoAUtente(idEnte.equals(idEnteProfilazione) && isSedeAssociataAFacOVol);
							break;
						default:
							dettaglioSede.setAssociatoAUtente(true);
							break;
					}
						return dettaglioSede;
					})
					.collect(Collectors.toList());
			listaDettaglioSedi.addAll(listaDettaglioSediParziale);
		});

		SchedaProgettoBean schedaProgetto = new SchedaProgettoBean();
		schedaProgetto.setDettaglioProgramma(dettaglioProgramma);
		schedaProgetto.setDettaglioProgetto(dettaglioProgetto);
		schedaProgetto.setEntiPartner(listaEntiPartner);
		schedaProgetto.setSedi(listaDettaglioSedi);
		schedaProgetto.setIdEnteGestoreProgetto(progettoFetchDB.getEnteGestoreProgetto() != null ? progettoFetchDB.getEnteGestoreProgetto().getId() : null );
		schedaProgetto.getDettaglioProgetto().setNomeEnte(progettoFetchDB.getEnteGestoreProgetto() != null ? progettoFetchDB.getEnteGestoreProgetto().getNome() : null );
		return schedaProgetto;
	}

	@LogMethod
	@LogExecutionTime
	@Transactional(rollbackOn = Exception.class)
	public void terminaProgetto(Long idProgetto, Date dataTerminazione) throws ParseException {
		SimpleDateFormat sdf = new SimpleDateFormat("dd-MM-yyyy");
		Calendar c = Calendar.getInstance();
		c.setTime(sdf.parse(sdf.format(new Date())));
		Date currentDate = c.getTime();
		if(dataTerminazione.after(currentDate)) {
			final String errorMessage = String.format("la data terminazione non può essere nel futuro");
			throw new ProgettoException(errorMessage, CodiceErroreEnum.PR03);
		}
		ProgettoEntity progettoDBFetch = this.getProgettoById(idProgetto);
		if(!isProgettoTerminabileByStatoProgetto(progettoDBFetch.getStato())) {
			String errorMessage = String.format("Impossibile terminare il progetto con id=%s perchè stato diverso da 'ATTIVABILE' o 'ATTIVO'", idProgetto);
			throw new ProgettoException(errorMessage, CodiceErroreEnum.PR03);
		}
		//prendo la lista di referenti e delegati
		List<ReferentiDelegatiEnteGestoreProgettoEntity> referentiEDelegatiProgetto = this.referentiDelegatiEnteGestoreProgettoService.getReferentiEDelegatiProgetto(idProgetto);
		//se sono ATTIVI li termino, se sono NON ATTIVI li cancello
		referentiEDelegatiProgetto.forEach(this.referentiDelegatiEnteGestoreProgettoService::cancellaOTerminaAssociazioneReferenteDelegatoProgetto);
		progettoDBFetch.setStato(StatoEnum.TERMINATO.getValue());
		if(StatoEnum.ATTIVO.getValue().equals(progettoDBFetch.getStatoGestoreProgetto())) {	
			try {
				this.storicoService.storicizzaEnteGestoreProgetto(progettoDBFetch, StatoEnum.TERMINATO.getValue());
				progettoDBFetch.setStatoGestoreProgetto(StatoEnum.TERMINATO.getValue());
			} catch (Exception e) {
				throw new ProgettoException("Impossibile Storicizzare Ente", e, CodiceErroreEnum.C02);
			}
		} else if(StatoEnum.NON_ATTIVO.getValue().equals(progettoDBFetch.getStatoGestoreProgetto())) {
			progettoDBFetch.setEnteGestoreProgetto(null);
			progettoDBFetch.setStatoGestoreProgetto(null);
		}
		this.enteService.terminaEntiPartner(idProgetto);
		this.enteSedeProgettoService.cancellaOTerminaEnteSedeProgetto(idProgetto);
		progettoDBFetch.setDataOraTerminazione(dataTerminazione);
		this.salvaProgetto(progettoDBFetch);
	}

	/**
	 * Verifica se il progetto può essere terminato a partire dallo stato del progetto.
	 * Restituisce true se il progetto può essere terminato e false altrimenti.
	 * 
	 **/
	private boolean isProgettoTerminabileByStatoProgetto(String statoProgetto) {
		return (    
				StatoEnum.ATTIVABILE.getValue().equalsIgnoreCase(statoProgetto)
				|| StatoEnum.ATTIVO.getValue().equalsIgnoreCase(statoProgetto)
				);
	}

	@LogMethod
	@LogExecutionTime
	public void cancellaOTerminaProgetto (ProgettoEntity progetto, Date dataTerminazione) throws ParseException {
		if(StatoEnum.NON_ATTIVO.getValue().equalsIgnoreCase(progetto.getStato())) {
			this.cancellazioneProgetto(progetto.getId());
		}
		if(StatoEnum.ATTIVABILE.getValue().equalsIgnoreCase(progetto.getStato()) || StatoEnum.ATTIVO.getValue().equalsIgnoreCase(progetto.getStato())) {
			this.terminaProgetto(progetto.getId(), dataTerminazione);
		}
	}

	@LogMethod
	@LogExecutionTime
	@Transactional(rollbackOn = Exception.class)
	public void attivaProgetto(Long idProgetto) {
		ProgettoEntity progetto = this.getProgettoById(idProgetto);
		if(!StatoEnum.ATTIVABILE.getValue().equalsIgnoreCase(progetto.getStato())) {
			String errorMessage = String.format("Impossibile attivare il progetto con id %s --> stato progetto = %s", progetto.getId(), progetto.getStato());
			throw new ProgettoException(errorMessage, CodiceErroreEnum.PR07);
		}
		progetto.setStato(StatoEnum.ATTIVO.getValue());
		progetto.setDataOraAttivazione(new Date());
		progetto.setDataOraAggiornamento(new Date());
		progettoRepository.save(progetto);

		// stacco un thread e invio email ai facilitatori/volontari di quel progetto
		new Thread(() -> {
			this.enteSedeProgettoFacilitatoreService
			.getAllEmailFacilitatoriEVolontariByProgetto(idProgetto)
			.forEach(utenteFetch -> {
				try {
					this.emailService.inviaEmail(utenteFetch.getEmail(),
							EmailTemplateEnum.GEST_PROGE_PARTNER,
							new String[] { utenteFetch.getNome(), RuoloUtenteEnum.valueOf(utenteFetch.getCodiceRuolo()).getValue() });
				} catch (Exception ex) {
					log.error("Impossibile inviare la mail ai Referente/Delegato dell'ente gestore progetto per progetto con id={}.", idProgetto);
					log.error("{}", ex);
				}
			});
		}).start();
	}
	
	@LogMethod
	@LogExecutionTime
	public List<ProgettoEntity> getProgettoByIdProgramma(Long idProgramma) {
		return this.brokenAccessControlRepository.findByIdProgramma(idProgramma);
	}
	
	public int getCountEnteByIdProgetto(Long idEnte, Long idProgetto) {
		return brokenAccessControlRepository.getEnteByIdProgetto(idEnte, idProgetto);
	}
}