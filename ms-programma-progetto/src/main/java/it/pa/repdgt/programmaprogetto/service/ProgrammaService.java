package it.pa.repdgt.programmaprogetto.service;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import it.pa.repdgt.programmaprogetto.bean.DettaglioProgrammaBean;
import it.pa.repdgt.programmaprogetto.bean.SchedaProgrammaBean;
import it.pa.repdgt.programmaprogetto.exception.ProgrammaException;
import it.pa.repdgt.programmaprogetto.exception.ResourceNotFoundException;
import it.pa.repdgt.programmaprogetto.mapper.ProgrammaMapper;
import it.pa.repdgt.programmaprogetto.repository.ProgrammaRepository;
import it.pa.repdgt.programmaprogetto.request.FiltroRequest;
import it.pa.repdgt.programmaprogetto.request.ProgettiParam;
import it.pa.repdgt.programmaprogetto.request.ProgettoFiltroRequest;
import it.pa.repdgt.programmaprogetto.request.ProgrammaRequest;
import it.pa.repdgt.programmaprogetto.request.ProgrammiParam;
import it.pa.repdgt.programmaprogetto.request.SceltaProfiloParam;
import it.pa.repdgt.programmaprogetto.resource.ProgrammaDropdownResource;
import it.pa.repdgt.shared.annotation.LogExecutionTime;
import it.pa.repdgt.shared.annotation.LogMethod;
import it.pa.repdgt.shared.entity.EnteEntity;
import it.pa.repdgt.shared.entity.ProgettoEntity;
import it.pa.repdgt.shared.entity.ProgrammaEntity;
import it.pa.repdgt.shared.entity.ProgrammaXQuestionarioTemplateEntity;
import it.pa.repdgt.shared.entity.QuestionarioTemplateEntity;
import it.pa.repdgt.shared.entity.ReferentiDelegatiEnteGestoreProgrammaEntity;
import it.pa.repdgt.shared.entity.light.ProgettoLightEntity;
import it.pa.repdgt.shared.entity.light.QuestionarioTemplateLightEntity;
import it.pa.repdgt.shared.entityenum.PolicyEnum;
import it.pa.repdgt.shared.entityenum.RuoloUtenteEnum;
import it.pa.repdgt.shared.entityenum.StatoEnum;
import it.pa.repdgt.shared.exception.CodiceErroreEnum;
import it.pa.repdgt.shared.service.storico.StoricoService;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class ProgrammaService {
	@Autowired
	private ProgrammaRepository programmaRepository;
	@Autowired
	@Lazy
	private ProgettoService progettoService;
	@Autowired
	private EnteService enteService;
	@Autowired
	private RuoloService ruoloService;
	@Autowired
	private StoricoService storicoService;
	@Autowired
	private ReferentiDelegatiEnteGestoreProgrammaService referentiDelegatiEnteGestoreProgrammaService;
	@Autowired
	private QuestionarioTemplateSqlService questionarioTemplateSqlService;
	@Autowired
	private ProgrammaXQuestionarioTemplateService programmaXQuestionarioTemplateService;
	@Autowired
	private ProgrammaMapper programmaMapper;

	@LogMethod
	@LogExecutionTime
	public List<ProgrammaEntity> getAllProgrammi() {
		return this.programmaRepository.findAll();
	}

	@LogMethod
	@LogExecutionTime
	public List<ProgrammaEntity> getAllProgrammi(FiltroRequest filtroRequest) {
		return this.programmaRepository.findAll(
				filtroRequest.getCriterioRicerca(),
				"%" + filtroRequest.getCriterioRicerca() + "%",
				filtroRequest.getPolicies(),
				filtroRequest.getStati()
				);
	}

	@LogMethod
	@LogExecutionTime
	public List<ProgrammaEntity> getAllProgrammi(ProgettoFiltroRequest filtroRequest) {
		return this.programmaRepository.findAllByProgettoFiltro(
				filtroRequest.getCriterioRicerca(),
				"%" + filtroRequest.getCriterioRicerca() + "%",
				filtroRequest.getPolicies(),
				filtroRequest.getStati(),
				filtroRequest.getIdsProgrammi()
				);
	}

	@LogMethod
	@LogExecutionTime
	public Page<ProgrammaEntity> getAllProgrammiPaginati(ProgrammiParam sceltaContesto, Integer currPage, Integer pageSize, FiltroRequest filtroRequest) {
		if(this.ruoloService.getCodiceRuoliByCodiceFiscaleUtente(sceltaContesto.getCfUtente()).stream().filter(codiceRuolo -> codiceRuolo.equals(sceltaContesto.getCodiceRuolo())).count() == 0) {
			throw new ProgrammaException("ERRORE: ruolo non definito per l'utente", CodiceErroreEnum.U06);
		}
		Pageable paginazione = PageRequest.of(currPage, pageSize);
		List<ProgrammaEntity> programmiUtente = this.getAllProgrammiByRuoloAndIdProgramma(sceltaContesto.getCodiceRuolo(), sceltaContesto.getIdProgramma(), filtroRequest);
		programmiUtente.sort((programma1, programma2) -> programma1.getId().compareTo(programma2.getId()));
		int start = (int) paginazione.getOffset();
		int end = Math.min((start + paginazione.getPageSize()), programmiUtente.size());
		if(start > end) {
			throw new ProgrammaException("ERRORE: pagina richiesta inesistente", CodiceErroreEnum.G03);
		}
		return new PageImpl<ProgrammaEntity>(programmiUtente.subList(start, end), paginazione, programmiUtente.size());
	}

	@LogMethod
	@LogExecutionTime
	public List<String> getAllStatiDropdown(ProgrammiParam sceltaContesto, FiltroRequest filtroRequest) {
		if(this.ruoloService.getCodiceRuoliByCodiceFiscaleUtente(sceltaContesto.getCfUtente()).stream().filter(codiceRuolo -> codiceRuolo.equals(sceltaContesto.getCodiceRuolo())).count() == 0) {
			throw new ProgrammaException("ERRORE: ruolo non definito per l'utente", CodiceErroreEnum.U06);
		}
		return this.getAllStatiByRuoloAndIdProgramma(sceltaContesto.getCodiceRuolo(), sceltaContesto.getIdProgramma(), filtroRequest);
	}

	@LogMethod
	@LogExecutionTime
	public List<String> getAllPoliciesDropdown(ProgrammiParam sceltaContesto, FiltroRequest filtroRequest) {
		if(this.ruoloService.getCodiceRuoliByCodiceFiscaleUtente(sceltaContesto.getCfUtente()).stream().filter(codiceRuolo -> codiceRuolo.equals(sceltaContesto.getCodiceRuolo())).count() == 0) {
			throw new ProgrammaException("ERRORE: ruolo non definito per l'utente", CodiceErroreEnum.U06);
		}
		return this.getAllPoliciesByRuoloAndIdProgramma(sceltaContesto.getCodiceRuolo(), sceltaContesto.getIdProgramma(), filtroRequest);
	}

	@LogMethod
	@LogExecutionTime
	public List<String> getAllPoliciesDropdownPerProgetti(ProgettiParam sceltaContesto, ProgettoFiltroRequest filtroRequest) {
		if(this.ruoloService.getCodiceRuoliByCodiceFiscaleUtente(sceltaContesto.getCfUtente()).stream().filter(codiceRuolo -> codiceRuolo.equals(sceltaContesto.getCodiceRuolo())).count() == 0) {
			throw new ProgrammaException("ERRORE: ruolo non definito per l'utente", CodiceErroreEnum.U06);
		}
		return this.getAllPoliciesByRuoloAndIdProgramma(sceltaContesto.getCodiceRuolo(), sceltaContesto.getIdProgramma(), filtroRequest);
	}

	@LogMethod
	@LogExecutionTime
	public List<ProgrammaDropdownResource> getAllProgrammiDropdownPerProgetti(ProgettiParam sceltaContesto, ProgettoFiltroRequest filtroRequest){
		if(this.ruoloService.getCodiceRuoliByCodiceFiscaleUtente(sceltaContesto.getCfUtente()).stream().filter(codiceRuolo -> codiceRuolo.equals(sceltaContesto.getCodiceRuolo())).count() == 0) {
			throw new ProgrammaException("ERRORE: ruolo non definito per l'utente", CodiceErroreEnum.U06);
		}
		List<ProgrammaEntity> programmiDropdown = this.getAllProgrammiDropdownByRuoloAndIdProgramma(sceltaContesto.getCodiceRuolo(), sceltaContesto.getIdProgramma(), filtroRequest);
		return this.programmaMapper.toLightDropdownResourceFrom(programmiDropdown);
	}

	/**
	 * Recupera tutti i programmi filtrati in base al filtro passato che sono associati all'utente che ha quel ruolo associato a quel particolare programma
	 *
	 * @param codiceRuolo - il ruolo scelto dall'utente in fase di login
	 * @return List<ProgrammaEntity> programmi - la lista dei programmi associati all'utente
	 */
	@LogMethod
	@LogExecutionTime
	public List<ProgrammaEntity> getAllProgrammiByRuoloAndIdProgramma(String codiceRuolo, Long idProgramma, FiltroRequest filtroRequest) {
		switch (codiceRuolo) {
		case "DTD":
			return this.getAllProgrammi(filtroRequest);
		case "DSCU":
			return this.getProgrammiPerDSCU(filtroRequest);
		case "REG":
		case "REGP":
		case "REPP":
		case "DEG":
		case "DEGP":
		case "DEPP":
			return Arrays.asList( 
					this.getProgrammaById(idProgramma)
					);
		default:
			return this.getAllProgrammi(filtroRequest);
		}
	}

	@LogMethod
	@LogExecutionTime
	public List<String> getAllStatiByRuoloAndIdProgramma(String codiceRuolo, Long idProgramma, FiltroRequest filtroRequest) {
		List<String> stati = new ArrayList<>();
		switch (codiceRuolo) {
		case "DTD":
			return this.getAllStati(filtroRequest);
		case "DSCU":
			Set<String> result = this.getStatiPerDSCU(filtroRequest);
			stati.addAll(result);
			return stati;
		case "REG":
		case "REGP":
		case "REPP":
		case "DEG":
		case "DEGP":
		case "DEPP":
			stati.add(this.getStatoProgrammaByProgrammaId(idProgramma));
			return stati;
		default:
			return this.getAllStati(filtroRequest);
		}
	}

	@LogMethod
	@LogExecutionTime
	public List<String> getAllPoliciesByRuoloAndIdProgramma(String codiceRuolo, Long idProgramma, FiltroRequest filtroRequest) {
		List<String> policies = new ArrayList<>();
		switch (codiceRuolo) {
		case "DTD":
			return this.getAllPolicies(filtroRequest);
		case "DSCU":
			Set<String> result = this.getPoliciesPerDSCU();
			policies.addAll(result);
			return policies;
		case "REG":
		case "REGP":
		case "REPP":
		case "DEG":
		case "DEGP":
		case "DEPP":
			policies.add(this.getPolicyProgrammaByProgrammaId(idProgramma));
			return policies;
		default:
			return this.getAllPolicies(filtroRequest);
		}
	}

	@LogMethod
	@LogExecutionTime
	public List<String> getAllPoliciesByRuoloAndIdProgramma(String codiceRuolo, Long idProgramma, ProgettoFiltroRequest filtroRequest) {
		List<String> policies = new ArrayList<>();
		switch (codiceRuolo) {
		case "DTD":
			return this.getAllPolicies(filtroRequest);
		case "DSCU":
			Set<String> result = this.getPoliciesPerDSCU();
			policies.addAll(result);
			return policies;
		case "REG":
		case "REGP":
		case "REPP":
		case "DEG":
		case "DEGP":
		case "DEPP":
			policies.add(this.getPolicyProgrammaByProgrammaId(idProgramma));
			return policies;
		default:
			return this.getAllPolicies(filtroRequest);
		}
	}

	@LogMethod
	@LogExecutionTime
	public List<ProgrammaEntity> getAllProgrammiDropdownByRuoloAndIdProgramma(String codiceRuolo, Long idProgramma,
			ProgettoFiltroRequest filtroRequest) {
		switch (codiceRuolo) {
		case "DTD":
			return this.getAllProgrammi(filtroRequest);
		case "DSCU":
			return this.getProgrammiPerDSCU(filtroRequest);
		case "REG":
		case "REGP":
		case "REPP":
		case "DEG":
		case "DEGP":
		case "DEPP":
			return Arrays.asList( 
					this.getProgrammaById(idProgramma)
					);
		default:
			return this.getAllProgrammi(filtroRequest);
		}
	}

	@LogMethod
	@LogExecutionTime
	public String getStatoProgrammaByProgrammaId(Long idProgramma) {
		String errorMessage = String.format("Stato programma non presente");
		return this.programmaRepository.findStatoById(idProgramma)
				.orElseThrow(() -> new ResourceNotFoundException(errorMessage));
	}

	@LogMethod
	@LogExecutionTime
	public String getPolicyProgrammaByProgrammaId(Long idProgramma) {
		String errorMessage = String.format("Policy programma non presente");
		return this.programmaRepository.findPolicyById(idProgramma)
				.orElseThrow(() -> new ResourceNotFoundException(errorMessage));
	}

	@LogMethod
	@LogExecutionTime
	public List<ProgrammaEntity> getProgrammiPerDSCU(FiltroRequest filtroRequest) {
		return this.programmaRepository.findProgrammiByPolicy(
				PolicyEnum.SCD.toString(),
				filtroRequest.getCriterioRicerca(),
				"%" + filtroRequest.getCriterioRicerca() + "%",
				filtroRequest.getStati()
				);
	}

	@LogMethod
	@LogExecutionTime
	public List<ProgrammaEntity> getProgrammiPerDSCU(ProgettoFiltroRequest filtroRequest) {
		return this.programmaRepository.findByPolicy(
				PolicyEnum.SCD.toString(),
				filtroRequest.getCriterioRicerca(),
				"%" + filtroRequest.getCriterioRicerca() + "%",
				filtroRequest.getStati(),
				filtroRequest.getIdsProgrammi()
				);
	}

	@LogMethod
	@LogExecutionTime
	public List<String> getAllStati(FiltroRequest filtroRequest) {
		return this.programmaRepository.findAllStati(
				filtroRequest.getCriterioRicerca(),
				"%" + filtroRequest.getCriterioRicerca() + "%",
				filtroRequest.getPolicies(),
				filtroRequest.getStati()
				);
	}

	@LogMethod
	@LogExecutionTime
	public Set<String> getStatiPerDSCU(FiltroRequest filtroRequest) {
		return this.programmaRepository.findStatiByPolicy(
				PolicyEnum.SCD.toString(),
				filtroRequest.getCriterioRicerca(),
				"%" + filtroRequest.getCriterioRicerca() + "%",
				filtroRequest.getStati()
				);
	}

	@LogMethod
	@LogExecutionTime
	public List<String> getAllPolicies(FiltroRequest filtroRequest) {
		return this.programmaRepository.findAllPolicies(
				filtroRequest.getCriterioRicerca(),
				"%" + filtroRequest.getCriterioRicerca() + "%",
				filtroRequest.getPolicies(),
				filtroRequest.getStati());
	}

	@LogMethod
	@LogExecutionTime
	public List<String> getAllPolicies(ProgettoFiltroRequest filtroRequest) {
		return this.programmaRepository.findAllPoliciesByProgettoFiltro(
				filtroRequest.getCriterioRicerca(),
				"%" + filtroRequest.getCriterioRicerca() + "%",
				filtroRequest.getPolicies(),
				filtroRequest.getStati(),
				filtroRequest.getIdsProgrammi()
				);
	}

	@LogMethod
	@LogExecutionTime
	public Set<String> getPoliciesPerDSCU() {
		return this.programmaRepository.findPoliciesPerDSCU(PolicyEnum.SCD.toString());
	}

	/**
	 * @throws ResourceNotFoundException
	 */
	@LogMethod
	@LogExecutionTime
	public ProgrammaEntity getProgrammaEagerById(Long idProgramma) {
		String errorMessage = String.format("Programma con id=%s non presente", String.valueOf(idProgramma));
		return this.programmaRepository.findById(idProgramma)
				.orElseThrow(() -> new ResourceNotFoundException(errorMessage));
	}

	/**
	 * @throws ResourceNotFoundException
	 */
	@LogMethod
	@LogExecutionTime
	public ProgrammaEntity getProgrammaById(Long idProgramma) {
		String errorMessage = String.format("Programma con id=%s non presente", String.valueOf(idProgramma));
		return this.programmaRepository.findById(idProgramma)
				.orElseThrow(() -> new ResourceNotFoundException(errorMessage));
	}

	public boolean existsProgrammaByNome(String nomeProgramma) {
		return this.programmaRepository.findByNome(nomeProgramma).isPresent();
	}

	/**
	 * @throws ProgrammaException
	 */
	@LogMethod
	@LogExecutionTime
	@Transactional(rollbackOn = Exception.class)
	public ProgrammaEntity creaNuovoProgramma(ProgrammaEntity programma) {
		if(this.programmaRepository.findProgrammaByCodice(programma.getCodice()).isPresent()) {
			String errorMessage = String.format("Errore creazione programma. Programma con codice='%s' già presente.", programma.getCodice());
			throw new ProgrammaException(errorMessage, CodiceErroreEnum.P01);
		}
		if (programma.getDataInizioProgramma().after(programma.getDataFineProgramma())) {
			String errorMessage = String.format("Errore creazione programma. Data inizio programma deve essere antecedenta alla data fine programma");
			throw new ProgrammaException(errorMessage, CodiceErroreEnum.P01);
		}
		programma.setStato(StatoEnum.NON_ATTIVO.getValue());
		programma.setDataOraCreazione(new Date());
		programma.setDataOraAggiornamento(programma.getDataOraCreazione());
		QuestionarioTemplateEntity questionarioTemplate = this.questionarioTemplateSqlService.getQuestionarioTemplateByPolicy(programma.getPolicy().getValue());
		if(questionarioTemplate == null) {
			throw new ProgrammaException("Impossibile creare programma. Questionario template di default inesistente", CodiceErroreEnum.P02);
		}
		this.salvaProgramma(programma);
		this.associaQuestionarioTemplateAProgramma(programma.getId(), questionarioTemplate.getId());
		return programma;
	}

	@LogMethod
	@LogExecutionTime
	public ProgrammaEntity salvaProgramma(ProgrammaEntity programma) {
		return this.programmaRepository.save(programma);
	}

	/**
	 * @throws ProgrammaException
	 */
	@LogMethod
	@LogExecutionTime
	@Transactional(rollbackOn = Exception.class)
	public void cancellazioneProgramma(final Long idProgramma) {
		if (!this.programmaRepository.existsById(idProgramma)) {
			final String errorMessage = String.format("Impossibile cancellare Programma con id=%s perchè non presente", idProgramma);
			throw new ProgrammaException(errorMessage, CodiceErroreEnum.P04);
		}
		final ProgrammaEntity programmaFetch = this.getProgrammaEagerById(idProgramma);
		String statoProgramma = programmaFetch.getStato();
		if (!isProgrammmaCancellabileByStatoProgramma(statoProgramma)) {
			final String errorMessage = String.format("Impossibile cancellare Programma con id=%s perchè stato diverso da 'NON ATTIVO'.", idProgramma);
			throw new ProgrammaException(errorMessage, CodiceErroreEnum.P04);
		}
		final List<ProgettoEntity> progettiAssociatiAlProgramma = this.progettoService.getProgettiByIdProgramma(idProgramma);
		progettiAssociatiAlProgramma.forEach(progetto -> {
			this.progettoService.cancellazioneProgetto(progetto.getId());
		});
		this.referentiDelegatiEnteGestoreProgrammaService.cancellaReferentiDelegatiProgramma(idProgramma);
		// TODO da cancellare record nella tabella molti a molti tra le tabelle: TEMPLATE_QUESTIONARIO_PROGRAMMA e ADDENDUM (la TEMPLATE_QUESTIONARIO_PROGRAMMA_ADDENDUM)
		this.programmaXQuestionarioTemplateService.cancellaAssociazioneQuestionarioTemplateAProgramma(idProgramma);
		this.programmaRepository.delete(programmaFetch);
	}

	/**
	 * Verifica se il programma può essere cancellabile a partire dallo stato del programma.
	 * Restituisce true se il programma può essere cancellato e false altrimenti.
	 * 
	 **/
	private boolean isProgrammmaCancellabileByStatoProgramma(final String statoProgramma) {
		return StatoEnum.NON_ATTIVO.getValue().equalsIgnoreCase(statoProgramma);
	}

	/**
	 * @throws ProgrammaException
	 */
	@LogMethod
	@LogExecutionTime
	@Transactional(rollbackOn = Exception.class)
	public ProgrammaEntity assegnaEnteGestoreProgramma(Long idProgramma, Long idEnteGestore) {
		ProgrammaEntity programmaFetchDB = null;
		try {
			programmaFetchDB = this.getProgrammaById(idProgramma);
		} catch (ResourceNotFoundException ex) {
			String errorMessage = String.format("Impossibile assegnare Programma con id=%s all'ente gestore con id=%s. Programma non presente", idProgramma, idEnteGestore);
			throw new ProgrammaException(errorMessage, CodiceErroreEnum.P05);
		}
		EnteEntity enteFetchDB = null;
		try {
			enteFetchDB = this.enteService.getEnteById(idEnteGestore);
		} catch (ResourceNotFoundException ex) {
			String errorMessage = String.format("Impossibile assegnare Programma con id=%s all'ente gestore con id=%s. Ente non presente", idProgramma, idEnteGestore);
			throw new ProgrammaException(errorMessage, CodiceErroreEnum.P05);
		}
		programmaFetchDB.setEnteGestoreProgramma(enteFetchDB);
		programmaFetchDB.setStatoGestoreProgramma(StatoEnum.NON_ATTIVO.getValue());
		return this.salvaProgramma(programmaFetchDB);
	}

	/**
	 * @throws ProgrammaException
	 */
	@LogMethod
	@LogExecutionTime
	@Transactional(rollbackOn = Exception.class)
	public ProgrammaEntity aggiornaProgramma(final ProgrammaRequest programmaRequest, final Long idProgramma) {
		if (!this.programmaRepository.existsById(idProgramma)) {
			final String errorMessage = String.format("Impossibile aggiornare il Programma con id=%s. Programma non presente", idProgramma);
			throw new ProgrammaException(errorMessage, CodiceErroreEnum.P06);
		}
		final ProgrammaEntity programmaFetch = this.getProgrammaById(idProgramma);
		if(this.programmaRepository.countProgrammiByCodice(programmaRequest.getCodice(), programmaFetch.getId()) > 0) {
			final String errorMessage = String.format("Impossibile aggiornare il Programma con id=%s. Codice già in uso", idProgramma);
			throw new ProgrammaException(errorMessage, CodiceErroreEnum.P06);
		}
		final String statoProgramma = programmaFetch.getStato();
		if(!isProgrammmaAggiornabileByStatoProgramma(statoProgramma)) {
			final String errorMessage = String.format("Impossibile aggiornare Programma con id=%s perchè stato=%s.", idProgramma, statoProgramma);
			throw new ProgrammaException(errorMessage, CodiceErroreEnum.P06);
		}
		this.programmaMapper.toEntityFrom(programmaRequest, programmaFetch);
		programmaFetch.setDataOraAggiornamento(new Date());

		return this.programmaRepository.save(programmaFetch);
	}

	/**
	 * Verifica se il programma può essere aggiornato a partire dallo stato del programma.
	 * Restituisce true se il programma può essere aggiornato e false altrimenti.
	 * 
	 **/
	@LogMethod
	@LogExecutionTime
	public boolean isProgrammmaAggiornabileByStatoProgramma(final String statoProgramma) {
		return (    
				StatoEnum.NON_ATTIVO.getValue().equalsIgnoreCase(statoProgramma)
				|| StatoEnum.ATTIVO.getValue().equalsIgnoreCase(statoProgramma)  
				);
	}

	@LogMethod
	@LogExecutionTime
	public SchedaProgrammaBean getSchedaProgrammaById(Long idProgramma) {
		ProgrammaEntity programmaFetchDB = this.getProgrammaById(idProgramma);

		DettaglioProgrammaBean dettaglioProgramma = this.programmaMapper.toDettaglioProgrammaBeanFrom(programmaFetchDB);

		List<ProgettoEntity> progetti = progettoService.getProgettiByIdProgramma(idProgramma);
		// mapping da Progetti a ProgettiLight
		List<ProgettoLightEntity> progettiLight = progetti.stream().map(progetto -> {
			ProgettoLightEntity progettoLight = new ProgettoLightEntity();
			progettoLight.setId(progetto.getId());
			progettoLight.setNome(progetto.getNome());
			progettoLight.setStato(progetto.getStato());
			return progettoLight;
		})
				.collect(Collectors.toList());

		List<QuestionarioTemplateEntity> questionari = this.questionarioTemplateSqlService.getQuestionariByIdProgramma(idProgramma);
		List<QuestionarioTemplateLightEntity> questionariLight = questionari.stream().map(questionario -> {
			QuestionarioTemplateLightEntity questionarioLight = new QuestionarioTemplateLightEntity();
			questionarioLight.setId(questionario.getId());
			questionarioLight.setNome(questionario.getNome());
			questionarioLight.setStato(questionario.getStato());
			return questionarioLight;
		})
				.collect(Collectors.toList());

		SchedaProgrammaBean schedaProgramma = new SchedaProgrammaBean();
		schedaProgramma.setDettaglioProgramma(dettaglioProgramma);
		schedaProgramma.setIdEnteGestoreProgramma(programmaFetchDB.getEnteGestoreProgramma() != null ? programmaFetchDB.getEnteGestoreProgramma().getId() : null );
		schedaProgramma.setProgetti(progettiLight);
		schedaProgramma.setQuestionari(questionariLight);

		return schedaProgramma;
	}

	@LogMethod
	@LogExecutionTime
	public SchedaProgrammaBean getSchedaProgrammaByIdAndSceltaProfilo(Long idProgramma, SceltaProfiloParam sceltaProfilo) {
		ProgrammaEntity programmaFetchDB = this.getProgrammaById(idProgramma);

		DettaglioProgrammaBean dettaglioProgramma = this.programmaMapper.toDettaglioProgrammaBeanFrom(programmaFetchDB);

		List<ProgettoEntity> progetti = progettoService.getProgettiByIdProgramma(idProgramma);
		// mapping da Progetti a ProgettiLight
		List<ProgettoLightEntity> progettiLight = progetti.stream().map(progetto -> {
			ProgettoLightEntity progettoLight = new ProgettoLightEntity();
			progettoLight.setId(progetto.getId());
			progettoLight.setNome(progetto.getNome());
			progettoLight.setStato(progetto.getStato());
			switch(sceltaProfilo.getCodiceRuolo()) {
			case "REGP":
			case "DEGP":
			case "REPP":
			case "DEPP":
				progettoLight.setAssociatoAUtente(sceltaProfilo.getIdProgetto().equals(progetto.getId()));
				break;
			default:
				progettoLight.setAssociatoAUtente(true);
				break;
			}
			return progettoLight;
		})
				.collect(Collectors.toList());

		List<QuestionarioTemplateEntity> questionari = this.questionarioTemplateSqlService.getQuestionariByIdProgramma(idProgramma);
		List<QuestionarioTemplateLightEntity> questionariLight = questionari.stream().map(questionario -> {
			QuestionarioTemplateLightEntity questionarioLight = new QuestionarioTemplateLightEntity();
			questionarioLight.setId(questionario.getId());
			questionarioLight.setNome(questionario.getNome());
			questionarioLight.setStato(questionario.getStato());
			return questionarioLight;
		})
				.collect(Collectors.toList());

		SchedaProgrammaBean schedaProgramma = new SchedaProgrammaBean();
		schedaProgramma.setDettaglioProgramma(dettaglioProgramma);
		schedaProgramma.setIdEnteGestoreProgramma(programmaFetchDB.getEnteGestoreProgramma() != null ? programmaFetchDB.getEnteGestoreProgramma().getId() : null );
		schedaProgramma.setProgetti(progettiLight);
		schedaProgramma.setQuestionari(questionariLight);

		return schedaProgramma;
	}

	@LogMethod
	@LogExecutionTime
	@Transactional(rollbackOn = Exception.class)
	public void terminaProgramma(Long idProgramma, Date dataTerminazione) throws ParseException {
		SimpleDateFormat sdf = new SimpleDateFormat("dd-MM-yyyy");
		Calendar c = Calendar.getInstance();
		c.setTime(sdf.parse(sdf.format(new Date())));
		Date currentDate = c.getTime();
		if(dataTerminazione.after(currentDate)) {
			final String errorMessage = String.format("la data terminazione non può essere nel futuro");
			throw new ProgrammaException(errorMessage, CodiceErroreEnum.P03);
		}
		if (!this.programmaRepository.existsById(idProgramma)) {
			final String errorMessage = String.format("Impossibile terminare il Programma con id=%s. Programma non presente", idProgramma);
			throw new ProgrammaException(errorMessage, CodiceErroreEnum.P03);
		}
		final ProgrammaEntity programmaFetch = this.getProgrammaById(idProgramma);
		final String statoProgramma = programmaFetch.getStato();
		if (!isProgrammmaTerminabileByStatoProgramma(statoProgramma)) {
			final String errorMessage = String.format("Impossibile terminare Programma con id=%s perchè stato=%s.", idProgramma, statoProgramma);
			throw new ProgrammaException(errorMessage, CodiceErroreEnum.P03);
		}
		final List<ProgettoEntity> progettiAssociatiAlProgramma = this.progettoService.getProgettiByIdProgramma(idProgramma);
		progettiAssociatiAlProgramma.forEach(progetto -> {
			try {
				this.progettoService.cancellaOTerminaProgetto(progetto, dataTerminazione);
			} catch (ParseException e) {
				log.error("{}", e);
			}
		});
		//prendo la lista dei referenti e delegati dell'ente gestore di programma
		List<ReferentiDelegatiEnteGestoreProgrammaEntity> referentiEDelegati = this.referentiDelegatiEnteGestoreProgrammaService.getReferentiEDelegatiProgramma(idProgramma);
		referentiEDelegati.stream()
		.forEach(this.referentiDelegatiEnteGestoreProgrammaService::cancellaOTerminaAssociazioneReferenteDelegatoProgramma);
		programmaFetch.setStato(StatoEnum.TERMINATO.getValue());
		try {
			this.storicoService.storicizzaEnteGestoreProgramma(programmaFetch, StatoEnum.TERMINATO.getValue());
		} catch (Exception e) {
			throw new ProgrammaException("Impossibile Storicizzare Ente", CodiceErroreEnum.C02);
		}
		programmaFetch.setStatoGestoreProgramma(StatoEnum.TERMINATO.getValue());
		programmaFetch.setDataOraTerminazioneProgramma(dataTerminazione);
		this.salvaProgramma(programmaFetch);
	}

	/**
	 * Verifica se il programma può essere terminato a partire dallo stato del programma.
	 * Restituisce true se il programma può essere terminato e false altrimenti.
	 * 
	 **/
	private boolean isProgrammmaTerminabileByStatoProgramma(final String statoProgramma) {
		return StatoEnum.ATTIVO.getValue().equalsIgnoreCase(statoProgramma);
	}

	@LogMethod
	@LogExecutionTime
	@Transactional(rollbackOn = Exception.class)
	public void associaQuestionarioTemplateAProgramma(Long idProgramma, String idQuestionario) {
		if (!this.programmaRepository.existsById(idProgramma)) {
			final String errorMessage = String.format("Impossibile associare il questionario al Programma con id=%s. Programma non presente", idProgramma);
			throw new ProgrammaException(errorMessage, CodiceErroreEnum.P07);
		}
		if(!this.questionarioTemplateSqlService.esisteQuestionarioById(idQuestionario)) {
			final String errorMessage = String.format("Impossibile associare il questionario con id=%s al Programma. Questionario non presente", idQuestionario);
			throw new ProgrammaException(errorMessage, CodiceErroreEnum.P07);
		}

		QuestionarioTemplateEntity questionarioTemplate = this.questionarioTemplateSqlService.getQuestionarioTemplateById(idQuestionario);
		List<ProgrammaXQuestionarioTemplateEntity> associazioniQuestionarioTemplate = this.programmaXQuestionarioTemplateService.getAssociazioneQuestionarioTemplateByIdProgramma(idProgramma);

		associazioniQuestionarioTemplate.forEach(associazioneQuestionarioTemplate -> {
			if(StatoEnum.ATTIVO.toString().equalsIgnoreCase(associazioneQuestionarioTemplate.getStato())){
				this.programmaXQuestionarioTemplateService.terminaAssociazioneQuestionarioTemplateAProgramma(associazioneQuestionarioTemplate);
			}
		});

		this.programmaXQuestionarioTemplateService.associaQuestionarioTemplateAProgramma(idProgramma, idQuestionario);

		questionarioTemplate.setStato(StatoEnum.ATTIVO.getValue());
		this.questionarioTemplateSqlService.salvaQuestionarioTemplate(questionarioTemplate);
	}
}