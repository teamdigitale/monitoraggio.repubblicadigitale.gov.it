package it.pa.repdgt.gestioneutente.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import it.pa.repdgt.gestioneutente.annotation.LogExecutionTime;
import it.pa.repdgt.gestioneutente.annotation.LogMethod;
import it.pa.repdgt.gestioneutente.bean.DettaglioRuoliBean;
import it.pa.repdgt.gestioneutente.bean.DettaglioUtenteBean;
import it.pa.repdgt.gestioneutente.bean.SchedaUtenteBean;
import it.pa.repdgt.gestioneutente.dto.UtenteDto;
import it.pa.repdgt.gestioneutente.exception.ResourceNotFoundException;
import it.pa.repdgt.gestioneutente.exception.RuoloException;
import it.pa.repdgt.gestioneutente.exception.UtenteException;
import it.pa.repdgt.gestioneutente.repository.UtenteRepository;
import it.pa.repdgt.gestioneutente.request.FiltroRequest;
import it.pa.repdgt.gestioneutente.request.NuovoUtenteRequest;
import it.pa.repdgt.gestioneutente.request.UtenteRequest;
import it.pa.repdgt.shared.entity.ProgettoEntity;
import it.pa.repdgt.shared.entity.ProgrammaEntity;
import it.pa.repdgt.shared.entity.RuoloEntity;
import it.pa.repdgt.shared.entity.UtenteEntity;
import it.pa.repdgt.shared.entity.UtenteXRuolo;
import it.pa.repdgt.shared.entityenum.StatoEnum;

@Service
public class UtenteService {
	@Autowired
	private UtenteXRuoloService utenteXRuoloService;
	@Autowired
	private RuoloService ruoloService;
	@Autowired
	private ProgrammaService programmaService;
	@Autowired
	private ProgettoService progettoService;
	@Autowired
	private EntePartnerService entePartnerService;
	@Autowired
	private UtenteRepository utenteRepository;

	@LogExecutionTime
	@LogMethod
	public List<UtenteEntity> getAllUtenti() {
		return this.utenteRepository.findAll();
	}
	
	@LogMethod
	@LogExecutionTime
	public Page<UtenteDto> getAllUtentiPaginati(UtenteRequest sceltaContesto, Integer currPage, Integer pageSize) {
		if(this.ruoloService.getRuoliByCodiceFiscaleUtente(sceltaContesto.getCfUtente()).stream().filter(codiceRuolo -> codiceRuolo.equals(sceltaContesto.getCodiceRuolo())).count() == 0) {
			throw new UtenteException("ERRORE: ruolo non definito per l'utente");
		}
		Pageable paginazione = PageRequest.of(currPage, pageSize);
		List<UtenteDto> utenti = this.getUtentiByRuolo(sceltaContesto.getCodiceRuolo(), sceltaContesto.getCfUtente(), sceltaContesto.getIdProgramma(), sceltaContesto.getFiltroRequest());
		utenti.sort((utente1, utente2) -> utente1.getId().compareTo(utente2.getId()));
		final int start = (int)paginazione.getOffset();
		final int end = Math.min((start + paginazione.getPageSize()), utenti.size());
		if(start > end) {
			throw new UtenteException("ERRORE: pagina richiesta inesistente");
		}
		return new PageImpl<UtenteDto>(utenti.subList(start, end), paginazione, utenti.size());
	}
	
	public List<UtenteDto> getUtentiConRuoliAggregati(List<UtenteEntity> utenti){
		return utenti.stream()
				.map(utente -> {
					UtenteDto utenteDto = new UtenteDto();
					utenteDto.setId(utente.getId().toString());
					utenteDto.setNome(utente.getNome() + " " + utente.getCognome());
					utenteDto.setStato(utente.getStato());
					
					StringBuilder ruoliAggregati = new StringBuilder();
					utente.getRuoli()
						.stream()
						.forEach(ruolo -> {
							ruoliAggregati.append(ruolo.getNome()).append(", ");
						});
					
					if(ruoliAggregati.length() > 0) {
						utenteDto.setRuoli(ruoliAggregati.substring(0, ruoliAggregati.length()-2));
					}
					
					return utenteDto;
				})
				.collect(Collectors.toList());
	}
	
	public List<UtenteDto> getUtentiByRuolo(String codiceRuolo, String cfUtente, Long idProgramma, FiltroRequest filtroRequest) {
		List<UtenteEntity> listaUtenti = new ArrayList<>();

		switch (codiceRuolo) {
			case "DTD":
				listaUtenti.addAll(this.getUtentiByFiltri(filtroRequest));
				break;
			case "DSCU":
				listaUtenti.addAll(this.getUtentiPerDSCU(filtroRequest));
				break;
			case "REG":
			case "DEG":
				listaUtenti.addAll(this.getUtentiPerReferenteDelegatoGestoreProgramma(idProgramma, cfUtente, filtroRequest));
				break;
			case "REGP":
			case "DEGP":
				listaUtenti.addAll(this.getUtentiPerReferenteDelegatoGestoreProgetti(idProgramma, cfUtente, codiceRuolo, filtroRequest));
				break;
			case "REPP":
			case "DEPP":
				listaUtenti.addAll(this.getUtentiPerReferenteDelegatoEntePartnerProgetti(idProgramma, cfUtente, codiceRuolo, filtroRequest));
				break;
			default:
				listaUtenti.addAll(this.getUtentiByFiltri(filtroRequest));
				break;
		}
		
		return this.getUtentiConRuoliAggregati(listaUtenti);
	}

	private Set<UtenteEntity> getUtentiPerReferenteDelegatoEntePartnerProgetti(Long idProgramma,
			String cfUtente, String codiceRuolo, FiltroRequest filtroRequest) {
		return this.utenteRepository.findUtentiPerReferenteDelegatoEntePartnerProgetti(
																	  idProgramma, 
																	  cfUtente, 
																	  codiceRuolo,
																	  filtroRequest.getCriterioRicerca(),
																	   "%" + filtroRequest.getCriterioRicerca() + "%",
																	  filtroRequest.getRuolo(),
																	  filtroRequest.getStato());
	}

	private Set<UtenteEntity> getUtentiPerReferenteDelegatoGestoreProgetti(Long idProgramma,
			String cfUtente, String codiceRuolo, FiltroRequest filtroRequest) {
		return this.utenteRepository.findUtentiPerReferenteDelegatoGestoreProgetti(
																	  idProgramma, 
																	  cfUtente, 
																	  codiceRuolo,
																	  filtroRequest.getCriterioRicerca(),
																	   "%" + filtroRequest.getCriterioRicerca() + "%",
																	  filtroRequest.getRuolo(),
																	  filtroRequest.getStato());
	}

	private Set<UtenteEntity> getUtentiPerReferenteDelegatoGestoreProgramma(Long idProgramma, String cfUtente, FiltroRequest filtroRequest) {
		return this.utenteRepository.findUtentiPerReferenteDelegatoGestoreProgramma(
																	   idProgramma,
																	   cfUtente,
																	   filtroRequest.getCriterioRicerca(),
																	   "%" + filtroRequest.getCriterioRicerca() + "%",
																	   filtroRequest.getRuolo(),
																	   filtroRequest.getStato());
	}

	private Set<UtenteEntity> getUtentiPerDSCU(FiltroRequest filtroRequest) {
		return this.utenteRepository.findUtentiPerDSCU(
				filtroRequest.getCriterioRicerca(),
				"%" + filtroRequest.getCriterioRicerca() + "%",
				filtroRequest.getRuolo(),
				filtroRequest.getStato()
				);
	}

	public UtenteEntity getUtenteByCodiceFiscale(String  codiceFiscaleUtente) {
		String messaggioErrore = String.format("risorsa con codice Fiscale=%s non trovata", codiceFiscaleUtente);
		return this.utenteRepository.findByCodiceFiscale(codiceFiscaleUtente).orElseThrow(() -> new ResourceNotFoundException(messaggioErrore) );
	}
	
	public UtenteEntity getUtenteEagerByCodiceFiscale(String codiceFiscale) {
		return this.utenteRepository.findUtenteEagerByCodiceFiscale(codiceFiscale);
	}
	
	@LogExecutionTime
	@LogMethod
	public void creaNuovoUtente(UtenteEntity utente, String codiceRuolo) {
		utente.setStato(StatoEnum.ATTIVO.getValue());
		RuoloEntity ruolo = this.ruoloService.getRuoloByCodiceRuolo(codiceRuolo);
		utente.getRuoli().add(ruolo);
		this.salvaUtente(utente);
	}
	
	@LogExecutionTime
	@LogMethod
	public void aggiornaUtente(NuovoUtenteRequest nuovoUtenteRequest, Long idUtente) {
		UtenteEntity utenteFetchDB = null;
		try {
			utenteFetchDB = this.getUtenteById(idUtente);
		} catch (ResourceNotFoundException ex) {
			String messaggioErrore = String.format("utente con codice fiscale=%s non trovato", idUtente);
			throw new UtenteException(messaggioErrore, ex);
		}
		utenteFetchDB.setCodiceFiscale(nuovoUtenteRequest.getCodiceFiscale());
		utenteFetchDB.setNome(nuovoUtenteRequest.getNome());
		utenteFetchDB.setCognome(nuovoUtenteRequest.getCognome());
		utenteFetchDB.setEmail(nuovoUtenteRequest.getEmail());
		utenteFetchDB.setTelefono(nuovoUtenteRequest.getTelefono());
		utenteFetchDB.setMansione(nuovoUtenteRequest.getMansione());
		utenteFetchDB.setTipoContratto(nuovoUtenteRequest.getTipoContratto());
		this.utenteRepository.save(utenteFetchDB);
	}
	
	private UtenteEntity getUtenteById(Long idUtente) {
		String messaggioErrore = String.format("risorsa con id=%s non trovata", idUtente);
		return this.utenteRepository.findById(idUtente).orElseThrow(() -> new ResourceNotFoundException(messaggioErrore));
	}

	@LogExecutionTime
	@LogMethod
	public UtenteEntity salvaUtente(UtenteEntity utente) {
		return this.utenteRepository.save(utente);
	}

	@LogExecutionTime
	@LogMethod
	public void cancellaUtente(String cfUtente) {
		UtenteEntity utente = null;
		try {
			utente = this.getUtenteByCodiceFiscale(cfUtente);
		} catch (ResourceNotFoundException ex) {
			String messaggioErrore = String.format("Impossibile cancellare un utente che non esiste");
			throw new UtenteException(messaggioErrore, ex);
		}
		if(this.utenteXRuoloService.countRuoliByCfUtente(cfUtente) > 0) {
			String errorMessage = String.format("Impossibile cancellare l'utente con codice fiscale %s poiché ha almeno un ruolo associato", cfUtente);
			throw new UtenteException(errorMessage);
		}
		this.utenteRepository.delete(utente);
	}

	private Set<UtenteEntity> getUtentiByFiltri(FiltroRequest filtroRequest) {
		return this.utenteRepository.findByFilter(
				filtroRequest.getCriterioRicerca(),
				"%" + filtroRequest.getCriterioRicerca() + "%",
				filtroRequest.getRuolo(),
				filtroRequest.getStato()
			);
	}

	@Transactional(rollbackOn = Exception.class)
	public void assegnaRuoloAUtente(String codiceFiscaleUtente, String codiceRuolo) {
		RuoloEntity ruolo = null;
		try {
			ruolo = this.ruoloService.getRuoloByCodiceRuolo(codiceRuolo);
		} catch (ResourceNotFoundException ex) {
			String messaggioErrore = String.format("Impossibile assegnare il ruolo con codice = %s poiché non esistente", codiceRuolo);
			throw new UtenteException(messaggioErrore, ex);
		}
		UtenteEntity utente = null;
		try {
			utente = this.getUtenteByCodiceFiscale(codiceFiscaleUtente);
		} catch (ResourceNotFoundException ex) {
			String messaggioErrore = String.format("Impossibile assegnare il ruolo con codice = %s poiché l'utente con codice fiscale = %s non esiste", codiceRuolo, codiceFiscaleUtente);
			throw new UtenteException(messaggioErrore, ex);
		}
		if(utente.getRuoli().contains(ruolo)) {
			String messaggioErrore = String.format("L'utente con codice fiscale = %s ha già il ruolo con codice = %s assegnato", codiceFiscaleUtente, codiceRuolo);
			throw new UtenteException(messaggioErrore);
		}
		if(codiceRuolo.equals("DTD") || codiceRuolo.equals("DSCU")) {
			ruolo.setStato(StatoEnum.ATTIVO.getValue());
			utente.getRuoli().add(ruolo);
			this.salvaUtente(utente);
			return;
		}
		if(ruolo.getPredefinito() == false) {
			ruolo.setStato(StatoEnum.ATTIVO.getValue());
			utente.getRuoli().add(ruolo);
			this.salvaUtente(utente);
			return;
		}
		String errorMessage = String.format("Impossibile assegnare un ruolo predefinito all'infuori di DTD e DSCU");
		throw new UtenteException(errorMessage);
	}

	public List<String> getAllStatiDropdown(UtenteRequest sceltaContesto) {
		if(this.ruoloService.getRuoliByCodiceFiscaleUtente(sceltaContesto.getCfUtente()).stream().filter(codiceRuolo -> codiceRuolo.equals(sceltaContesto.getCodiceRuolo())).count() == 0) {
			throw new UtenteException("ERRORE: ruolo non definito per l'utente");
		}
		return this.getAllStatiByRuoloAndcfUtente(sceltaContesto.getCodiceRuolo(),sceltaContesto.getCfUtente(), sceltaContesto.getIdProgramma(), sceltaContesto.getFiltroRequest());
	}

	private List<String> getAllStatiByRuoloAndcfUtente(String codiceRuolo, String cfUtente, Long idProgramma,
			FiltroRequest filtroRequest) {
		List<String> stati = new ArrayList<>();
		
		switch (codiceRuolo) {
		case "DTD":
			return this.getAllStati(filtroRequest);
		case "DSCU":
			stati.addAll(this.getStatiPerDSCU(filtroRequest));
			return stati;
		case "REG":
		case "DEG":
			return this.getStatiPerReferenteDelegatoGestoreProgramma(idProgramma, cfUtente, filtroRequest);
		case "REGP":
		case "DEGP":
			stati.addAll(this.getStatiPerReferenteDelegatoGestoreProgetti(idProgramma, cfUtente, codiceRuolo, filtroRequest));
			return stati;
		case "REPP":
		case "DEPP":
			stati.addAll(this.getStatiPerReferenteDelegatoEntePartnerProgetti(idProgramma, cfUtente, codiceRuolo, filtroRequest));
			return stati;
		default:
			stati.addAll(this.getAllStati(filtroRequest));
		}
		return stati;
	}

	private List<String> getStatiPerReferenteDelegatoEntePartnerProgetti(Long idProgramma,
			String cfUtente, String codiceRuolo, FiltroRequest filtroRequest) {
		return this.utenteRepository.findStatiPerReferenteDelegatoEntePartnerProgetti(
				idProgramma,
				cfUtente,
				codiceRuolo,
				filtroRequest.getCriterioRicerca(),
				"%" + filtroRequest.getCriterioRicerca() + "%",
				filtroRequest.getRuolo(),
				filtroRequest.getStato()
				);
	}

	private List<String> getStatiPerReferenteDelegatoGestoreProgetti(Long idProgramma, String cfUtente,
			String codiceRuolo, FiltroRequest filtroRequest) {
		return this.utenteRepository.findStatiPerReferenteDelegatoGestoreProgetti(
				idProgramma,
				cfUtente,
				codiceRuolo,
				filtroRequest.getCriterioRicerca(),
				"%" + filtroRequest.getCriterioRicerca() + "%",
				filtroRequest.getRuolo(),
				filtroRequest.getStato()
				);
	}

	private List<String> getStatiPerReferenteDelegatoGestoreProgramma(Long idProgramma, String cfUtente, FiltroRequest filtroRequest) {
		return this.utenteRepository.findStatiPerReferenteDelegatoGestoreProgramma(
				idProgramma,
				cfUtente,
				filtroRequest.getCriterioRicerca(),
				"%" + filtroRequest.getCriterioRicerca() + "%",
				filtroRequest.getRuolo(),
				filtroRequest.getStato()
				);
	}

	private List<String> getStatiPerDSCU(FiltroRequest filtroRequest) {
		return this.utenteRepository.findStatiByPolicy(
				filtroRequest.getCriterioRicerca(),
				"%" + filtroRequest.getCriterioRicerca() + "%",
				filtroRequest.getRuolo(),
				filtroRequest.getStato()
				);
	}

	private List<String> getAllStati(FiltroRequest filtroRequest) {
		return this.utenteRepository.findAllStati(
				filtroRequest.getCriterioRicerca(),
				"%" + filtroRequest.getCriterioRicerca() + "%",
				filtroRequest.getRuolo(),
				filtroRequest.getStato()
				);
	}

	public List<String> getAllRuoliDropdown(UtenteRequest sceltaContesto) {
		if(this.ruoloService.getRuoliByCodiceFiscaleUtente(sceltaContesto.getCfUtente()).stream().filter(codiceRuolo -> codiceRuolo.equals(sceltaContesto.getCodiceRuolo())).count() == 0) {
			throw new UtenteException("ERRORE: ruolo non definito per l'utente");
		}
		return this.getAllRuoliByRuoloAndcfUtente(sceltaContesto.getCodiceRuolo(),sceltaContesto.getCfUtente(), sceltaContesto.getIdProgramma(), sceltaContesto.getFiltroRequest());
	}

	private List<String> getAllRuoliByRuoloAndcfUtente(String codiceRuolo, String cfUtente, Long idProgramma,
			FiltroRequest filtroRequest) {
		List<String> stati = new ArrayList<>();
		
		switch (codiceRuolo) {
		case "DTD":
			return this.getAllRuoli(filtroRequest);
		case "DSCU":
			stati.addAll(this.getRuoliPerDSCU(filtroRequest));
			return stati;
		case "REG":
		case "DEG":
			return this.getRuoliPerReferenteDelegatoGestoreProgramma(idProgramma, cfUtente, filtroRequest);
		case "REGP":
		case "DEGP":
			stati.addAll(this.getRuoliPerReferenteDelegatoGestoreProgetti(idProgramma, cfUtente, codiceRuolo, filtroRequest));
			return stati;
		case "REPP":
		case "DEPP":
			stati.addAll(this.getRuoliPerReferenteDelegatoEntePartnerProgetti(idProgramma, cfUtente, codiceRuolo, filtroRequest));
			return stati;
		default:
			stati.addAll(this.getAllRuoli(filtroRequest));
		}
		return stati;
	}

	private List<String> getRuoliPerReferenteDelegatoEntePartnerProgetti(Long idProgramma,
			String cfUtente, String codiceRuolo, FiltroRequest filtroRequest) {
		return this.utenteRepository.findRuoliPerReferenteDelegatoEntePartnerProgetti(
				idProgramma,
				cfUtente,
				codiceRuolo,
				filtroRequest.getCriterioRicerca(),
				"%" + filtroRequest.getCriterioRicerca() + "%",
				filtroRequest.getRuolo(),
				filtroRequest.getStato()
		);
	}

	private List<String> getRuoliPerReferenteDelegatoGestoreProgetti(Long idProgramma, String cfUtente,
			String codiceRuolo, FiltroRequest filtroRequest) {
		return this.utenteRepository.findRuoliPerReferenteDelegatoGestoreProgetti(
				idProgramma,
				cfUtente,
				codiceRuolo,
				filtroRequest.getCriterioRicerca(),
				"%" + filtroRequest.getCriterioRicerca() + "%",
				filtroRequest.getRuolo(),
				filtroRequest.getStato()
		);
	}

	private List<String> getRuoliPerReferenteDelegatoGestoreProgramma(Long idProgramma, String cfUtente,
			FiltroRequest filtroRequest) {
		return this.utenteRepository.findRuoliPerReferenteDelegatoGestoreProgramma(
				idProgramma,
				cfUtente,
				filtroRequest.getCriterioRicerca(),
				"%" + filtroRequest.getCriterioRicerca() + "%",
				filtroRequest.getRuolo(),
				filtroRequest.getStato()
		);
	}

	private List<String> getRuoliPerDSCU(FiltroRequest filtroRequest) {
		return this.utenteRepository.findRuoliPerDSCU(
				filtroRequest.getCriterioRicerca(),
				"%" + filtroRequest.getCriterioRicerca() + "%", 
				filtroRequest.getRuolo(),
				filtroRequest.getStato()
				);
	}

	private List<String> getAllRuoli(FiltroRequest filtroRequest) {
		return this.utenteRepository.findAllRuoli(
				filtroRequest.getCriterioRicerca(),
				"%" + filtroRequest.getCriterioRicerca() + "%",
				filtroRequest.getRuolo(),
				filtroRequest.getStato()
				);
	}

	public SchedaUtenteBean getSchedaUtenteByCodiceFiscale(String cfUtente) {
		UtenteEntity utenteFetchDB = this.getUtenteByCodiceFiscale(cfUtente);
		
		DettaglioUtenteBean dettaglioUtente = new DettaglioUtenteBean();
		dettaglioUtente.setId(utenteFetchDB.getId());
		dettaglioUtente.setNome(utenteFetchDB.getNome());
		dettaglioUtente.setCognome(utenteFetchDB.getCognome());
		dettaglioUtente.setCodiceFiscale(cfUtente);
		dettaglioUtente.setEmail(utenteFetchDB.getEmail());
		dettaglioUtente.setTelefono(utenteFetchDB.getTelefono());
		dettaglioUtente.setStato(utenteFetchDB.getStato());
		
		
		List<RuoloEntity> listaRuoliUtente = this.ruoloService.getRuoliCompletiByCodiceFiscaleUtente(cfUtente);
		
		Map<RuoloEntity,List<Long>> mappaProgrammiProgettiUtente = new HashMap<>();
		
		listaRuoliUtente.stream()
						.forEach(ruolo -> {
							switch (ruolo.getCodice()) {
							case "REG":
							case "DEG":
								mappaProgrammiProgettiUtente.put(ruolo, this.programmaService.getIdProgrammiByRuoloUtente(cfUtente, ruolo.getCodice()));
								break;
							case "REGP":
							case "DEGP":
								mappaProgrammiProgettiUtente.put(ruolo, this.progettoService.getIdProgettiByRuoloUtente(cfUtente, ruolo.getCodice()));
								break;
							case "REPP":
							case "DEPP":
								mappaProgrammiProgettiUtente.put(ruolo, this.entePartnerService.getIdProgettiEntePartnerByRuoloUtente(cfUtente, ruolo.getCodice()));
								break;
							default:
								mappaProgrammiProgettiUtente.put(ruolo, new ArrayList<Long>());
								break;
							}
						});
		
		List<DettaglioRuoliBean> listaDettaglioRuoli = new ArrayList<>();
		mappaProgrammiProgettiUtente.keySet()
									.stream()
									.forEach(ruolo -> {
										if(mappaProgrammiProgettiUtente.get(ruolo).isEmpty()) {
											DettaglioRuoliBean dettaglioRuolo = new DettaglioRuoliBean();
											dettaglioRuolo.setNome(ruolo.getNome());
											listaDettaglioRuoli.add(dettaglioRuolo);
										}
										List<Long> listaIds = mappaProgrammiProgettiUtente.get(ruolo);
										listaIds
											.stream()
											.forEach(id -> {
												DettaglioRuoliBean dettaglioRuolo = new DettaglioRuoliBean();
												switch (ruolo.getCodice()) {
												case "REG":
												case "DEG":
													ProgrammaEntity programmaFetchDB = this.programmaService.getProgrammaById(id);
													dettaglioRuolo.setId(id);
													dettaglioRuolo.setNome(programmaFetchDB.getNome());
													dettaglioRuolo.setRuolo(ruolo.getNome());
													dettaglioRuolo.setStato(programmaFetchDB.getStato());
													listaDettaglioRuoli.add(dettaglioRuolo);
													break;
												case "REGP":
												case "DEGP":
												case "REPP":
												case "DEPP":
													ProgettoEntity progettoFetchDB = this.progettoService.getProgettoById(id);
													dettaglioRuolo.setId(id);
													dettaglioRuolo.setNome(progettoFetchDB.getNome());
													dettaglioRuolo.setRuolo(ruolo.getNome());
													dettaglioRuolo.setStato(progettoFetchDB.getStato());
													listaDettaglioRuoli.add(dettaglioRuolo);
													break;
												default:
													dettaglioRuolo.setNome(ruolo.getNome());
													listaDettaglioRuoli.add(dettaglioRuolo);
													break;
												}
											});
									});
									
		SchedaUtenteBean schedaUtente = new SchedaUtenteBean();
		schedaUtente.setDettaglioUtente(dettaglioUtente);
		schedaUtente.setDettaglioRuolo(listaDettaglioRuoli);
		return schedaUtente;
	}

	public List<UtenteEntity> getUtenteByCriterioRicerca(String criterioRicerca) {
		return this.utenteRepository.findUtenteByCriterioRicerca(
				criterioRicerca,
				"%" + criterioRicerca + "%"
		);
	}

	public void cancellaRuoloDaUtente(String codiceFiscale, String codiceRuolo) {
		if(this.ruoloService.getRuoloByCodiceRuolo(codiceRuolo) == null) {
			String errorMessage = String.format("Il codice ruolo %s inserito non corrisponde a nessun ruolo esistente", codiceRuolo);
			throw new RuoloException(errorMessage);
		}
		if(this.getUtenteByCodiceFiscale(codiceFiscale) == null ) {
			String errorMessage = String.format("L'utente con codice fiscale %s non esiste", codiceFiscale);
			throw new UtenteException(errorMessage);
		}
		RuoloEntity ruolo = this.ruoloService.getRuoloByCodiceRuolo(codiceRuolo);
		if(!this.getUtenteByCodiceFiscale(codiceFiscale).getRuoli().contains(ruolo)) {
			String errorMessage = String.format("Impossibile cancellare un ruolo non associato all'utente");
			throw new RuoloException(errorMessage);
		}
		if(ruolo.getPredefinito() == false) {
			UtenteXRuolo utenteRuolo = this.utenteXRuoloService.getUtenteXRuoloByCfUtenteAndCodiceRuolo(codiceFiscale, codiceRuolo);
			this.utenteXRuoloService.cancellaRuoloUtente(utenteRuolo);
			return;
		}
		if(codiceRuolo.equals("DTD") || codiceRuolo.equals("DSCU")) {
			UtenteXRuolo utenteRuolo = this.utenteXRuoloService.getUtenteXRuoloByCfUtenteAndCodiceRuolo(codiceFiscale, codiceRuolo);
			this.utenteXRuoloService.cancellaRuoloUtente(utenteRuolo);
			return;
		}
		String errorMessage = String.format("Impossibile cancellare un ruolo predefinito all'infuori di DTD e DSCU");
		throw new RuoloException(errorMessage);
	}
}