package it.pa.repdgt.gestioneutente.service;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import it.pa.repdgt.gestioneutente.bean.DettaglioRuoliBean;
import it.pa.repdgt.gestioneutente.bean.DettaglioUtenteBean;
import it.pa.repdgt.gestioneutente.bean.SchedaUtenteBean;
import it.pa.repdgt.gestioneutente.dto.UtenteDto;
import it.pa.repdgt.gestioneutente.exception.ResourceNotFoundException;
import it.pa.repdgt.gestioneutente.exception.RuoloException;
import it.pa.repdgt.gestioneutente.exception.UtenteException;
import it.pa.repdgt.gestioneutente.repository.ReferentiDelegatiEnteGestoreProgettoRepository;
import it.pa.repdgt.gestioneutente.repository.ReferentiDelegatiEnteGestoreProgrammaRepository;
import it.pa.repdgt.gestioneutente.repository.ReferentiDelegatiEntePartnerDiProgettoRepository;
import it.pa.repdgt.gestioneutente.repository.UtenteRepository;
import it.pa.repdgt.gestioneutente.request.AggiornaUtenteRequest;
import it.pa.repdgt.gestioneutente.request.FiltroRequest;
import it.pa.repdgt.gestioneutente.request.UtenteRequest;
import it.pa.repdgt.shared.annotation.LogExecutionTime;
import it.pa.repdgt.shared.annotation.LogMethod;
import it.pa.repdgt.shared.awsintegration.service.EmailService;
import it.pa.repdgt.shared.entity.ProgettoEntity;
import it.pa.repdgt.shared.entity.ProgrammaEntity;
import it.pa.repdgt.shared.entity.RuoloEntity;
import it.pa.repdgt.shared.entity.UtenteEntity;
import it.pa.repdgt.shared.entity.UtenteXRuolo;
import it.pa.repdgt.shared.entityenum.EmailTemplateEnum;
import it.pa.repdgt.shared.entityenum.StatoEnum;
import it.pa.repdgt.shared.exception.CodiceErroreEnum;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class UtenteService {
	@Autowired
	private UtenteXRuoloService utenteXRuoloService;
	@Autowired
	private  EnteSedeProgettoFacilitatoreService enteSedeProgettoFacilitatoreService;
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
	@Autowired 
	private EmailService emailService;
	@Autowired
	private ReferentiDelegatiEnteGestoreProgrammaRepository referentiDelegatiEnteGestoreProgrammaRepository;
	@Autowired
	private ReferentiDelegatiEnteGestoreProgettoRepository referentiDelegatiEnteGestoreProgettoRepository;
	@Autowired
	private ReferentiDelegatiEntePartnerDiProgettoRepository referentiDelegatiEntePartnerDiProgettoRepository;

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
		List<UtenteDto> utenti = this.getUtentiByRuolo(sceltaContesto.getCodiceRuolo(), sceltaContesto.getCfUtente(), sceltaContesto.getIdProgramma(), sceltaContesto.getIdProgetto(), sceltaContesto.getFiltroRequest());
		utenti.sort((utente1, utente2) -> utente1.getId().compareTo(utente2.getId()));
		final int start = (int)paginazione.getOffset();
		final int end = Math.min((start + paginazione.getPageSize()), utenti.size());
		if(start > end) {
			throw new UtenteException("ERRORE: pagina richiesta inesistente");
		}
		return new PageImpl<UtenteDto>(utenti.subList(start, end), paginazione, utenti.size());
	}
	
	@LogMethod
	@LogExecutionTime
	public List<UtenteDto> getUtentiConRuoliAggregati(List<UtenteEntity> utenti){
		return utenti.stream()
				.map(utente -> {
					UtenteDto utenteDto = new UtenteDto();
					utenteDto.setId(utente.getId());
					utenteDto.setNome(utente.getNome() + " " + utente.getCognome());
					utenteDto.setCodiceFiscale(utente.getCodiceFiscale());
					utenteDto.setStato(utente.getStato());
					
					StringBuilder ruoliAggregati = new StringBuilder();
					utente.getRuoli()
						.stream()
						.forEach(ruolo -> {
							Integer countRuolo = 0;
							String codiceRuolo = ruolo.getCodice();
							switch (codiceRuolo) {
							case "REG":
							case "DEG":
								countRuolo = referentiDelegatiEnteGestoreProgrammaRepository.countByCfUtenteAndCodiceRuolo(utente.getCodiceFiscale(), ruolo.getCodice());
								break;
							case "REGP":
							case "DEGP":
								countRuolo = referentiDelegatiEnteGestoreProgettoRepository.countByCfUtenteAndCodiceRuolo(utente.getCodiceFiscale(), ruolo.getCodice());
								break;
							case "REPP":
							case "DEPP":
								countRuolo = referentiDelegatiEntePartnerDiProgettoRepository.countByCfUtenteAndCodiceRuolo(utente.getCodiceFiscale(), ruolo.getCodice());
								break;
							case "FAC":
							case "VOL":
								countRuolo = enteSedeProgettoFacilitatoreService.countByIdFacilitatore(utente.getCodiceFiscale(), ruolo.getCodice());
								break;
							default:
								countRuolo = 1;
								break;
							}
							for(int i = 0; i < countRuolo; i++)
								ruoliAggregati.append(ruolo.getNome()).append(", ");
						});
					
					if(ruoliAggregati.length() > 0) {
						utenteDto.setRuoli(ruoliAggregati.substring(0, ruoliAggregati.length()-2));
					} else {
						utenteDto.setRuoli("");
					}
					
					return utenteDto;
				})
				.collect(Collectors.toList());
	}
	
	@LogMethod
	@LogExecutionTime
	public List<UtenteDto> getUtentiByRuolo(String codiceRuolo, String cfUtente, Long idProgramma, Long idProgetto, FiltroRequest filtroRequest) {
		List<UtenteEntity> listaUtenti = new ArrayList<>();
		Set<UtenteEntity> utenti = new HashSet<>();

		switch (codiceRuolo) {
			case "DTD":
				utenti = this.getUtentiByFiltri(filtroRequest);
				//controllo la presenza del filtro Stato
				if(null != filtroRequest.getStati()) {
					//passare i 2 stati "ATTIVO" e "NON ATTIVO" insieme equivale ad eseguire la getAll
					//se mi viene passato uno stato, controllo qual è e filtro la lista
					if(filtroRequest.getStati().size() == 1) {
						if(StatoEnum.NON_ATTIVO.getValue().equals(filtroRequest.getStati().get(0))) {
							List<UtenteEntity> utentiNonAttivi = utenti.stream().filter(utente -> utente.getRuoli().size() == 0).collect(Collectors.toList());
							listaUtenti.addAll(utentiNonAttivi);
							break;
						} else if(StatoEnum.ATTIVO.getValue().equals(filtroRequest.getStati().get(0))){
							List<UtenteEntity> utentiAttivi = utenti.stream().filter(utente -> utente.getRuoli().size() > 0).collect(Collectors.toList());
							listaUtenti.addAll(utentiAttivi);
							break;
						}
					}
				}
				listaUtenti.addAll(utenti);
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
				listaUtenti.addAll(this.getUtentiPerReferenteDelegatoGestoreProgetti(idProgramma, idProgetto, cfUtente, filtroRequest));
				break;
			case "REPP":
			case "DEPP":
				listaUtenti.addAll(this.getUtentiPerReferenteDelegatoEntePartnerProgetti(idProgramma, idProgetto, cfUtente, filtroRequest));
				break;
			default:
				utenti = this.getUtentiByFiltri(filtroRequest);
				//controllo la presenza del filtro Stato
				if(null != filtroRequest.getStati()) {
					//passare i 2 stati "ATTIVO" e "NON ATTIVO" insieme equivale ad eseguire la getAll
					//se mi viene passato uno stato, controllo qual è e filtro la lista
					if(filtroRequest.getStati().size() == 1) {
						if(StatoEnum.NON_ATTIVO.getValue().equals(filtroRequest.getStati().get(0))) {
							List<UtenteEntity> utentiNonAttivi = utenti.stream().filter(utente -> utente.getRuoli().size() == 0).collect(Collectors.toList());
							listaUtenti.addAll(utentiNonAttivi);
							break;
						} else if(StatoEnum.ATTIVO.getValue().equals(filtroRequest.getStati().get(0))){
							List<UtenteEntity> utentiAttivi = utenti.stream().filter(utente -> utente.getRuoli().size() > 0).collect(Collectors.toList());
							listaUtenti.addAll(utentiAttivi);
							break;
						}
					}
				}
				listaUtenti.addAll(utenti);
				break;
		}
		
		return this.getUtentiConRuoliAggregati(listaUtenti);
	}

	private Set<UtenteEntity> getUtentiPerReferenteDelegatoEntePartnerProgetti(Long idProgramma, Long idProgetto,
			String cfUtente, FiltroRequest filtroRequest) {
		return this.utenteRepository.findUtentiPerReferenteDelegatoEntePartnerProgetti(
																	  idProgramma,
																	  idProgetto,
																	  cfUtente, 
																	  filtroRequest.getCriterioRicerca(),
																	   "%" + filtroRequest.getCriterioRicerca() + "%",
																	  filtroRequest.getRuoli(),
																	  filtroRequest.getStati());
	}

	private Set<UtenteEntity> getUtentiPerReferenteDelegatoGestoreProgetti(Long idProgramma, Long idProgetto,
			String cfUtente, FiltroRequest filtroRequest) {
		return this.utenteRepository.findUtentiPerReferenteDelegatoGestoreProgetti(
																	  idProgramma,
																	  idProgetto,
																	  cfUtente, 
																	  filtroRequest.getCriterioRicerca(),
																	   "%" + filtroRequest.getCriterioRicerca() + "%",
																	  filtroRequest.getRuoli(),
																	  filtroRequest.getStati());
	}

	private Set<UtenteEntity> getUtentiPerReferenteDelegatoGestoreProgramma(Long idProgramma, String cfUtente, FiltroRequest filtroRequest) {
		return this.utenteRepository.findUtentiPerReferenteDelegatoGestoreProgramma(
																	   idProgramma,
																	   cfUtente,
																	   filtroRequest.getCriterioRicerca(),
																	   "%" + filtroRequest.getCriterioRicerca() + "%",
																	   filtroRequest.getRuoli(),
																	   filtroRequest.getStati());
	}

	private Set<UtenteEntity> getUtentiPerDSCU(FiltroRequest filtroRequest) {
		return this.utenteRepository.findUtentiPerDSCU(
				filtroRequest.getCriterioRicerca(),
				"%" + filtroRequest.getCriterioRicerca() + "%",
				filtroRequest.getRuoli(),
				filtroRequest.getStati()
				);
	}

	@LogMethod
	@LogExecutionTime
	public UtenteEntity getUtenteByCodiceFiscale(String  codiceFiscaleUtente) {
		String messaggioErrore = String.format("risorsa con codice Fiscale=%s non trovata", codiceFiscaleUtente);
		return this.utenteRepository.findByCodiceFiscale(codiceFiscaleUtente)
				.orElseThrow(() -> new ResourceNotFoundException(messaggioErrore) );
	}
	
	@LogMethod
	@LogExecutionTime
	public UtenteEntity getUtenteById(Long idUtente) {
		String messaggioErrore = String.format("risorsa con id=%s non trovata", idUtente);
		return this.utenteRepository.findById(idUtente)
				.orElseThrow(() -> new ResourceNotFoundException(messaggioErrore) );
	}
	
	@LogMethod
	@LogExecutionTime
	public UtenteEntity getUtenteEagerByCodiceFiscale(String codiceFiscale) {
		return this.utenteRepository.findUtenteEagerByCodiceFiscale(codiceFiscale);
	}
	
	@LogExecutionTime
	@LogMethod
	@Transactional
	public UtenteEntity creaNuovoUtente(UtenteEntity utente, String codiceRuolo) {
//		if(isEmailDuplicata(utente.getEmail(), utente.getCodiceFiscale())) {
//			throw new UtenteException("ERRORE: non possono esistere a sistema due email per due utenti diversi");
//		}
		// Verifico se esiste sul DB un utente con stesso codice fiscale e in caso affermativo lancio eccezione
		Optional<UtenteEntity> utenteDBFetch = this.utenteRepository.findByCodiceFiscale(utente.getCodiceFiscale());
		if(utenteDBFetch.isPresent()) {
			new UtenteException(String.format("Utente con codice fiscale '%s' già esistente", utente.getCodiceFiscale()));
		}
		
		utente.setStato(StatoEnum.NON_ATTIVO.getValue());
		RuoloEntity ruolo = this.ruoloService.getRuoloByCodiceRuolo(codiceRuolo);
		utente.getRuoli().add(ruolo);
		utente.setDataOraCreazione(new Date());
		utente.setDataOraAggiornamento(utente.getDataOraCreazione());
		
		final UtenteEntity utenteSalvato = this.salvaUtente(utente);
		if(!ruolo.getPredefinito()) {
			// stacco un thread per invio email al nuovo utente censito
			new Thread(() ->{
				try {
					this.emailService.inviaEmail(utenteSalvato.getEmail(), 
							EmailTemplateEnum.RUOLO_CUSTOM, 
							new String[] { utente.getNome(), codiceRuolo});
				}catch(Exception ex) {
					log.error("Impossibile inviare la mail al nuovo utente censito con codice fiscale {}", utente.getCodiceFiscale());
					log.error("{}", ex);
				}
			}).start();
		}
		
		return utenteSalvato;
	}
	
//	private boolean isEmailDuplicata(String email, String codiceFiscale) {
//		return this.utenteRepository.findByEmailAndCodiceFiscaleNot(email, codiceFiscale).isPresent();
//	}

	@LogExecutionTime
	@LogMethod
	public void aggiornaUtente(AggiornaUtenteRequest aggiornaUtenteRequest, Long idUtente) {
		UtenteEntity utenteFetchDB = null;
		try {
			utenteFetchDB = this.getUtenteById(idUtente);
		} catch (ResourceNotFoundException ex) {
			String messaggioErrore = String.format("utente con id=%s non trovato", idUtente);
			throw new UtenteException(messaggioErrore, ex);
		}
		utenteFetchDB.setEmail(aggiornaUtenteRequest.getEmail());
		utenteFetchDB.setTelefono(aggiornaUtenteRequest.getTelefono());
		utenteFetchDB.setNome(aggiornaUtenteRequest.getNome());
		utenteFetchDB.setCognome(aggiornaUtenteRequest.getCognome());
		utenteFetchDB.setMansione(aggiornaUtenteRequest.getMansione());
		utenteFetchDB.setTipoContratto(aggiornaUtenteRequest.getTipoContratto());
		utenteFetchDB.setDataOraAggiornamento(new Date());
		this.utenteRepository.save(utenteFetchDB);
	}

	@LogExecutionTime
	@LogMethod
	public UtenteEntity salvaUtente(UtenteEntity utente) {
		return this.utenteRepository.save(utente);
	}

	@LogExecutionTime
	@LogMethod
	public void cancellaUtente(Long idUtente) {
		UtenteEntity utente = null;
		try {
			utente = this.getUtenteById(idUtente);
		} catch (ResourceNotFoundException ex) {
			String messaggioErrore = String.format("Impossibile cancellare un utente che non esiste");
			throw new UtenteException(messaggioErrore, ex);
		}
		if(this.utenteXRuoloService.countRuoliByCfUtente(utente.getCodiceFiscale()) > 0) {
			String errorMessage = String.format("Impossibile cancellare l'utente con codice fiscale %s poiché ha almeno un ruolo associato", utente.getCodiceFiscale());
			throw new UtenteException(errorMessage);
		}
		this.utenteRepository.delete(utente);
	}

	private Set<UtenteEntity> getUtentiByFiltri(FiltroRequest filtroRequest) {
		return this.utenteRepository.findByFilter(
				filtroRequest.getCriterioRicerca(),
				"%" + filtroRequest.getCriterioRicerca() + "%",
				filtroRequest.getRuoli()
		);
	}

	@LogMethod
	@LogExecutionTime
	@Transactional(rollbackOn = Exception.class)
	public void assegnaRuoloAUtente(Long idUtente, String codiceRuolo) {
		RuoloEntity ruolo = null;
		try {
			ruolo = this.ruoloService.getRuoloByCodiceRuolo(codiceRuolo);
		} catch (ResourceNotFoundException ex) {
			String messaggioErrore = String.format("Impossibile assegnare il ruolo con codice = %s poiché non esistente", codiceRuolo);
			throw new UtenteException(messaggioErrore, ex);
		}
		UtenteEntity utente = null;
		try {
			utente = this.getUtenteById(idUtente);
		} catch (ResourceNotFoundException ex) {
			String messaggioErrore = String.format("Impossibile assegnare il ruolo con codice = %s poiché l'utente con id = %s non esiste", codiceRuolo, idUtente);
			throw new UtenteException(messaggioErrore, ex);
		}
		if(utente.getRuoli().contains(ruolo)) {
			String messaggioErrore = String.format("L'utente con id = %s ha già il ruolo con codice = %s assegnato", idUtente, codiceRuolo);
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
	
	@LogMethod
	@LogExecutionTime
	public List<String> getAllStatiDropdown(UtenteRequest sceltaContesto) {
		if(this.ruoloService.getRuoliByCodiceFiscaleUtente(sceltaContesto.getCfUtente()).stream().filter(codiceRuolo -> codiceRuolo.equals(sceltaContesto.getCodiceRuolo())).count() == 0) {
			throw new UtenteException("ERRORE: ruolo non definito per l'utente");
		}
		return this.getAllStatiByRuoloAndcfUtente(sceltaContesto.getCodiceRuolo(),sceltaContesto.getCfUtente(), sceltaContesto.getIdProgramma(), sceltaContesto.getIdProgetto(), sceltaContesto.getFiltroRequest());
	}

	private List<String> getAllStatiByRuoloAndcfUtente(String codiceRuolo, String cfUtente, Long idProgramma, Long idProgetto,
			FiltroRequest filtroRequest) {
		List<String> stati = new ArrayList<>();
		Set<UtenteEntity> utenti = new HashSet<>();
		
		switch (codiceRuolo) {
		case "DTD":
			utenti = this.getUtentiByFiltri(filtroRequest);
			//controllo la presenza del filtro Stato
			if(null != filtroRequest.getStati()) {
				//passare i 2 stati "ATTIVO" e "NON ATTIVO" insieme equivale ad eseguire la getAll
				//se mi viene passato uno stato, controllo qual è e filtro la lista
				if(filtroRequest.getStati().size() == 1) {
					if(StatoEnum.NON_ATTIVO.getValue().equals(filtroRequest.getStati().get(0))) {
						Set<UtenteEntity> utentiNonAttivi = utenti.stream().filter(utente -> utente.getRuoli().size() == 0).collect(Collectors.toSet());
						stati.addAll(this.getStatiByUtenti(utentiNonAttivi));
						return stati;
					} else if(StatoEnum.ATTIVO.getValue().equals(filtroRequest.getStati().get(0))) {
						Set<UtenteEntity> utentiAttivi = utenti.stream().filter(utente -> utente.getRuoli().size() > 0).collect(Collectors.toSet());
						stati.addAll(this.getStatiByUtenti(utentiAttivi));
						return stati;
					}
				}
			}
			stati.addAll(this.getStatiByUtenti(utenti));
			return stati;
		case "DSCU":
			stati.addAll(this.getStatiPerDSCU(filtroRequest));
			return stati;
		case "REG":
		case "DEG":
			return this.getStatiPerReferenteDelegatoGestoreProgramma(idProgramma, cfUtente, filtroRequest);
		case "REGP":
		case "DEGP":
			stati.addAll(this.getStatiPerReferenteDelegatoGestoreProgetti(idProgramma, idProgetto, cfUtente, filtroRequest));
			return stati;
		case "REPP":
		case "DEPP":
			stati.addAll(this.getStatiPerReferenteDelegatoEntePartnerProgetti(idProgramma, idProgetto, cfUtente, filtroRequest));
			return stati;
		default:
			utenti = this.getUtentiByFiltri(filtroRequest);
			//controllo la presenza del filtro Stato
			if(null != filtroRequest.getStati()) {
				//passare i 2 stati "ATTIVO" e "NON ATTIVO" insieme equivale ad eseguire la getAll
				//se mi viene passato uno stato, controllo qual è e filtro la lista
				if(filtroRequest.getStati().size() == 1) {
					if(StatoEnum.NON_ATTIVO.getValue().equals(filtroRequest.getStati().get(0))) {
						Set<UtenteEntity> utentiNonAttivi = utenti.stream().filter(utente -> utente.getRuoli().size() == 0).collect(Collectors.toSet());
						stati.addAll(this.getStatiByUtenti(utentiNonAttivi));
						return stati;
					} else if(StatoEnum.ATTIVO.getValue().equals(filtroRequest.getStati().get(0))) {
						Set<UtenteEntity> utentiAttivi = utenti.stream().filter(utente -> utente.getRuoli().size() > 0).collect(Collectors.toSet());
						stati.addAll(this.getStatiByUtenti(utentiAttivi));
						return stati;
					}
				}
			} 
			stati.addAll(this.getStatiByUtenti(utenti));
			return stati;
		}
	}

	private Set<String> getStatiByUtenti(Set<UtenteEntity> utenti) {
		Set<String> stati = new HashSet<>(); 
		utenti.stream().forEach(utente -> {
			stati.add(utente.getRuoli().size() > 0 ? StatoEnum.ATTIVO.getValue() : StatoEnum.NON_ATTIVO.getValue());
		});
		return stati;
	}

	private List<String> getStatiPerReferenteDelegatoEntePartnerProgetti(Long idProgramma, Long idProgetto,
			String cfUtente, FiltroRequest filtroRequest) {
		return this.utenteRepository.findStatiPerReferenteDelegatoEntePartnerProgetti(
				idProgramma,
				idProgetto,
				cfUtente,
				filtroRequest.getCriterioRicerca(),
				"%" + filtroRequest.getCriterioRicerca() + "%",
				filtroRequest.getRuoli(),
				filtroRequest.getStati()
				);
	}

	private List<String> getStatiPerReferenteDelegatoGestoreProgetti(Long idProgramma, Long idProgetto, String cfUtente, FiltroRequest filtroRequest) {
		return this.utenteRepository.findStatiPerReferenteDelegatoGestoreProgetti(
				idProgramma,
				idProgetto,
				cfUtente,
				filtroRequest.getCriterioRicerca(),
				"%" + filtroRequest.getCriterioRicerca() + "%",
				filtroRequest.getRuoli(),
				filtroRequest.getStati()
				);
	}

	private List<String> getStatiPerReferenteDelegatoGestoreProgramma(Long idProgramma, String cfUtente, FiltroRequest filtroRequest) {
		return this.utenteRepository.findStatiPerReferenteDelegatoGestoreProgramma(
				idProgramma,
				cfUtente,
				filtroRequest.getCriterioRicerca(),
				"%" + filtroRequest.getCriterioRicerca() + "%",
				filtroRequest.getRuoli(),
				filtroRequest.getStati()
				);
	}

	private List<String> getStatiPerDSCU(FiltroRequest filtroRequest) {
		return this.utenteRepository.findStatiByPolicy(
				filtroRequest.getCriterioRicerca(),
				"%" + filtroRequest.getCriterioRicerca() + "%",
				filtroRequest.getRuoli(),
				filtroRequest.getStati()
				);
	}

	@LogMethod
	@LogExecutionTime
	public List<String> getAllRuoliDropdown(UtenteRequest sceltaContesto) {
		if(this.ruoloService.getRuoliByCodiceFiscaleUtente(sceltaContesto.getCfUtente()).stream().filter(codiceRuolo -> codiceRuolo.equals(sceltaContesto.getCodiceRuolo())).count() == 0) {
			throw new UtenteException("ERRORE: ruolo non definito per l'utente");
		}
		return this.getAllRuoliByRuoloAndcfUtente(sceltaContesto.getCodiceRuolo(),sceltaContesto.getCfUtente(), sceltaContesto.getIdProgramma(), sceltaContesto.getIdProgetto(), sceltaContesto.getFiltroRequest());
	}

	private List<String> getAllRuoliByRuoloAndcfUtente(String codiceRuolo, String cfUtente, Long idProgramma, Long idProgetto,
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
			stati.addAll(this.getRuoliPerReferenteDelegatoGestoreProgetti(idProgramma, idProgetto, cfUtente, filtroRequest));
			return stati;
		case "REPP":
		case "DEPP":
			stati.addAll(this.getRuoliPerReferenteDelegatoEntePartnerProgetti(idProgramma, idProgetto, cfUtente, filtroRequest));
			return stati;
		default:
			stati.addAll(this.getAllRuoli(filtroRequest));
		}
		return stati;
	}

	private List<String> getRuoliPerReferenteDelegatoEntePartnerProgetti(Long idProgramma, Long idProgetto,
			String cfUtente, FiltroRequest filtroRequest) {
		return this.utenteRepository.findRuoliPerReferenteDelegatoEntePartnerProgetti(
				idProgramma,
				idProgetto,
				cfUtente,
				filtroRequest.getCriterioRicerca(),
				"%" + filtroRequest.getCriterioRicerca() + "%",
				filtroRequest.getRuoli(),
				filtroRequest.getStati()
		);
	}

	private List<String> getRuoliPerReferenteDelegatoGestoreProgetti(Long idProgramma, Long idProgetto, String cfUtente,
			 FiltroRequest filtroRequest) {
		return this.utenteRepository.findRuoliPerReferenteDelegatoGestoreProgetti(
				idProgramma,
				idProgetto,
				cfUtente,
				filtroRequest.getCriterioRicerca(),
				"%" + filtroRequest.getCriterioRicerca() + "%",
				filtroRequest.getRuoli(),
				filtroRequest.getStati()
		);
	}

	private List<String> getRuoliPerReferenteDelegatoGestoreProgramma(Long idProgramma, String cfUtente,
			FiltroRequest filtroRequest) {
		return this.utenteRepository.findRuoliPerReferenteDelegatoGestoreProgramma(
				idProgramma,
				cfUtente,
				filtroRequest.getCriterioRicerca(),
				"%" + filtroRequest.getCriterioRicerca() + "%",
				filtroRequest.getRuoli(),
				filtroRequest.getStati()
		);
	}

	private List<String> getRuoliPerDSCU(FiltroRequest filtroRequest) {
		return this.utenteRepository.findRuoliPerDSCU(
				filtroRequest.getCriterioRicerca(),
				"%" + filtroRequest.getCriterioRicerca() + "%", 
				filtroRequest.getRuoli(),
				filtroRequest.getStati()
				);
	}

	private List<String> getAllRuoli(FiltroRequest filtroRequest) {
		return this.utenteRepository.findAllRuoli(
				filtroRequest.getCriterioRicerca(),
				"%" + filtroRequest.getCriterioRicerca() + "%",
				filtroRequest.getRuoli(),
				filtroRequest.getStati()
				);
	}

	@LogMethod
	@LogExecutionTime
	public SchedaUtenteBean getSchedaUtenteByIdUtente(Long idUtente) {
		UtenteEntity utenteFetchDB = this.getUtenteById(idUtente);
		
		String cfUtente = utenteFetchDB.getCodiceFiscale();
		
		DettaglioUtenteBean dettaglioUtente = new DettaglioUtenteBean();
		dettaglioUtente.setId(utenteFetchDB.getId());
		dettaglioUtente.setNome(utenteFetchDB.getNome());
		dettaglioUtente.setCognome(utenteFetchDB.getCognome());
		dettaglioUtente.setCodiceFiscale(cfUtente);
		dettaglioUtente.setEmail(utenteFetchDB.getEmail());
		dettaglioUtente.setTelefono(utenteFetchDB.getTelefono());
		dettaglioUtente.setStato(utenteFetchDB.getStato());
		dettaglioUtente.setTipoContratto(utenteFetchDB.getTipoContratto());
		dettaglioUtente.setMansione(utenteFetchDB.getMansione());
		
		
		List<RuoloEntity> listaRuoliUtente = this.ruoloService.getRuoliCompletiByCodiceFiscaleUtente(cfUtente);
		
		Map<RuoloEntity,List<Long>> mappaProgrammiProgettiUtente = new HashMap<>();
		
		listaRuoliUtente.stream()
						.forEach(ruolo -> {
							switch (ruolo.getCodice()) {
							case "REG":
							case "DEG":
								mappaProgrammiProgettiUtente.put(ruolo, this.programmaService.getDistinctIdProgrammiByRuoloUtente(cfUtente, ruolo.getCodice()));
								break;
							case "REGP":
							case "DEGP":
								mappaProgrammiProgettiUtente.put(ruolo, this.progettoService.getDistinctIdProgettiByRuoloUtente(cfUtente, ruolo.getCodice()));
								break;
							case "REPP":
							case "DEPP":
								mappaProgrammiProgettiUtente.put(ruolo, this.entePartnerService.getIdProgettiEntePartnerByRuoloUtente(cfUtente, ruolo.getCodice()));
								break;
							case "FAC":
							case "VOL":
								mappaProgrammiProgettiUtente.put(ruolo, this.enteSedeProgettoFacilitatoreService.getIdProgettiFacilitatoreVolontario(cfUtente, ruolo.getCodice()));
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
											dettaglioRuolo.setCodiceRuolo(ruolo.getCodice());
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
													dettaglioRuolo.setCodiceRuolo(ruolo.getCodice());
													dettaglioRuolo.setRuolo(ruolo.getNome());
													dettaglioRuolo.setStatoP(programmaFetchDB.getStato());
													List<String> listaRecRefProg = referentiDelegatiEnteGestoreProgrammaRepository
															.findStatoByCfUtente(cfUtente, programmaFetchDB.getId(), ruolo.getCodice());
													dettaglioRuolo.setStato(listaRecRefProg.size() > 1 
															? listaRecRefProg
																	.stream()
																	.filter(el -> !"TERMINATO".equalsIgnoreCase(el))
																	.findFirst()
																	.orElse("TERMINATO")
															: listaRecRefProg.get(0));
													listaDettaglioRuoli.add(dettaglioRuolo);
													break;
												case "REGP":
												case "DEGP":
													ProgettoEntity progettoXEgpFetchDB = this.progettoService.getProgettoById(id);
													dettaglioRuolo.setId(id);
													dettaglioRuolo.setNome(progettoXEgpFetchDB.getNome());
													dettaglioRuolo.setCodiceRuolo(ruolo.getCodice());
													dettaglioRuolo.setRuolo(ruolo.getNome());
													dettaglioRuolo.setStatoP(progettoXEgpFetchDB.getStato());
													List<String> listaRecRefProgt = referentiDelegatiEnteGestoreProgettoRepository
															.findStatoByCfUtente(cfUtente, progettoXEgpFetchDB.getId(), ruolo.getCodice());
													dettaglioRuolo.setStato(listaRecRefProgt.size() > 1 
															? listaRecRefProgt
																	.stream()
																	.filter(el -> !"TERMINATO".equalsIgnoreCase(el))
																	.findFirst()
																	.orElse("TERMINATO")
															: listaRecRefProgt.get(0));
													listaDettaglioRuoli.add(dettaglioRuolo);
													break;
												case "REPP":
												case "DEPP":
													ProgettoEntity progettoXEppFetchDB = this.progettoService.getProgettoById(id);
													dettaglioRuolo.setId(id);
													dettaglioRuolo.setNome(progettoXEppFetchDB.getNome());
													dettaglioRuolo.setCodiceRuolo(ruolo.getCodice());
													dettaglioRuolo.setRuolo(ruolo.getNome());
													dettaglioRuolo.setStatoP(progettoXEppFetchDB.getStato());
													List<String> listaRecRefPart = referentiDelegatiEntePartnerDiProgettoRepository
															.findStatoByCfUtente(cfUtente, progettoXEppFetchDB.getId(), ruolo.getCodice());
													dettaglioRuolo.setStato(listaRecRefPart.size() > 1 
															? listaRecRefPart
																	.stream()
																	.filter(el -> !"TERMINATO".equalsIgnoreCase(el))
																	.findFirst()
																	.orElse("TERMINATO")
															: listaRecRefPart.get(0));
													listaDettaglioRuoli.add(dettaglioRuolo);
													break;
												case "FAC":
												case "VOL":
													ProgettoEntity progettoXFacFetchDB = this.progettoService.getProgettoById(id);
													dettaglioRuolo.setId(id);
													dettaglioRuolo.setNome(progettoXFacFetchDB.getNome());
													dettaglioRuolo.setCodiceRuolo(ruolo.getCodice());
													dettaglioRuolo.setRuolo(ruolo.getNome());
													dettaglioRuolo.setStatoP(progettoXFacFetchDB.getStato());
													List<String> listaRecRefFacVol = this.enteSedeProgettoFacilitatoreService
															.getDistinctStatoByIdProgettoIdFacilitatoreVolontario(cfUtente, ruolo.getCodice(), progettoXFacFetchDB.getId());
													dettaglioRuolo.setStato(listaRecRefFacVol.size() > 1 
															? listaRecRefFacVol
																	.stream()
																	.filter(el -> !"TERMINATO".equalsIgnoreCase(el))
																	.findFirst()
																	.orElse("TERMINATO")
															: listaRecRefFacVol.get(0));
													listaDettaglioRuoli.add(dettaglioRuolo);
													break;
												default:
													dettaglioRuolo.setNome(ruolo.getNome());
													dettaglioRuolo.setCodiceRuolo(ruolo.getCodice());
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

	@LogMethod
	@LogExecutionTime
	public List<UtenteEntity> getUtenteByCriterioRicerca(String criterioRicerca) {
		return this.utenteRepository.findUtenteByCriterioRicerca(
				criterioRicerca,
				"%" + criterioRicerca + "%"
		);
	}

	@LogMethod
	@LogExecutionTime
	public void cancellaRuoloDaUtente(Long idUtente, String codiceRuolo) {
		if(this.ruoloService.getRuoloByCodiceRuolo(codiceRuolo) == null) {
			String errorMessage = String.format("Il codice ruolo %s inserito non corrisponde a nessun ruolo esistente", codiceRuolo);
			throw new RuoloException(errorMessage);
		}
		UtenteEntity utente = this.getUtenteById(idUtente);
		if(utente == null ) {
			String errorMessage = String.format("L'utente con id %s non esiste", idUtente);
			throw new UtenteException(errorMessage);
		}
		RuoloEntity ruolo = this.ruoloService.getRuoloByCodiceRuolo(codiceRuolo);
		if(!utente.getRuoli().contains(ruolo)) {
			String errorMessage = String.format("Impossibile cancellare un ruolo non associato all'utente");
			throw new RuoloException(errorMessage);
		}
		if(ruolo.getPredefinito() == false) {
			UtenteXRuolo utenteRuolo = this.utenteXRuoloService.getUtenteXRuoloByCfUtenteAndCodiceRuolo(utente.getCodiceFiscale(), codiceRuolo);
			this.utenteXRuoloService.cancellaRuoloUtente(utenteRuolo);
			return;
		}
		if(codiceRuolo.equals("DTD") || codiceRuolo.equals("DSCU")) {
			UtenteXRuolo utenteRuolo = this.utenteXRuoloService.getUtenteXRuoloByCfUtenteAndCodiceRuolo(utente.getCodiceFiscale(), codiceRuolo);
			this.utenteXRuoloService.cancellaRuoloUtente(utenteRuolo);
			return;
		}
		String errorMessage = String.format("Impossibile cancellare un ruolo predefinito all'infuori di DTD e DSCU");
		throw new RuoloException(errorMessage);
	}
}