package it.pa.repdgt.ente.service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import javax.transaction.Transactional;
import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import it.pa.repdgt.ente.bean.EntePartnerUploadBean;
import it.pa.repdgt.ente.bean.SchedaEntePartnerBean;
import it.pa.repdgt.ente.bean.SedeBean;
import it.pa.repdgt.ente.entity.projection.EnteProjection;
import it.pa.repdgt.ente.entity.projection.UtenteProjection;
import it.pa.repdgt.ente.exception.EnteException;
import it.pa.repdgt.ente.exception.ResourceNotFoundException;
import it.pa.repdgt.ente.repository.EntePartnerRepository;
import it.pa.repdgt.ente.request.ReferenteDelegatoPartnerRequest;
import it.pa.repdgt.ente.restapi.param.EntiPaginatiParam;
import it.pa.repdgt.ente.util.CSVUtil;
import it.pa.repdgt.shared.annotation.LogExecutionTime;
import it.pa.repdgt.shared.annotation.LogMethod;
import it.pa.repdgt.shared.awsintegration.service.EmailService;
import it.pa.repdgt.shared.entity.EnteEntity;
import it.pa.repdgt.shared.entity.EntePartnerEntity;
import it.pa.repdgt.shared.entity.ReferentiDelegatiEntePartnerDiProgettoEntity;
import it.pa.repdgt.shared.entity.RuoloEntity;
import it.pa.repdgt.shared.entity.SedeEntity;
import it.pa.repdgt.shared.entity.UtenteEntity;
import it.pa.repdgt.shared.entity.key.EntePartnerKey;
import it.pa.repdgt.shared.entity.key.EnteSedeProgettoFacilitatoreKey;
import it.pa.repdgt.shared.entity.key.ReferentiDelegatiEntePartnerDiProgettoKey;
import it.pa.repdgt.shared.entityenum.EmailTemplateEnum;
import it.pa.repdgt.shared.entityenum.RuoloUtenteEnum;
import it.pa.repdgt.shared.entityenum.StatoEnum;
import it.pa.repdgt.shared.exception.CodiceErroreEnum;
import lombok.extern.slf4j.Slf4j;

@Slf4j	
@Service
public class EntePartnerService {

	private static final String PIVA_REGX = "^[0-9]{11}$";

	@Autowired 
	private EntePartnerRepository entePartnerRepository;
	@Autowired
	private UtenteService utenteService;
	@Autowired
	private ProgettoService progettoService;
	@Autowired
	@Lazy
	private EnteService enteService;
	@Autowired
	private SedeService sedeService;
	@Autowired
	private ReferentiDelegatiEntePartnerDiProgettoService referentiDelegatiEntePartnerDiProgettoService;
	@Autowired
	private RuoloService ruoloService;
	@Autowired
	private EmailService emailService;
	@Autowired
	private EnteSedeProgettoFacilitatoreService enteSedeProgettoFacilitatoreService;

	@LogMethod
	@LogExecutionTime
	public EntePartnerEntity salvaEntePartner(EntePartnerEntity entePartner) {
		return this.entePartnerRepository.save(entePartner);
	}

	@LogMethod
	@LogExecutionTime
	public void associaEntePartnerPerProgetto(Long idEntePartner, Long idProgetto) {
		EntePartnerKey entePartnerKey = new EntePartnerKey(idProgetto, idEntePartner);
		EntePartnerEntity entePartnerEntity = new EntePartnerEntity();
		entePartnerEntity.setId(entePartnerKey);
		entePartnerEntity.setStatoEntePartner(StatoEnum.NON_ATTIVO.getValue());
		entePartnerEntity.setDataOraCreazione(new Date());
		entePartnerEntity.setDataOraAggiornamento(new Date());
		this.salvaEntePartner(entePartnerEntity);
	}

	@LogMethod
	@LogExecutionTime
	public List<Long> getEntiPartnerByProgetto(Long idProgetto){
		return this.entePartnerRepository.findEntiPartnerByProgetto(idProgetto);
	}

	//il seguente metodo presenta delle projection (interfacce) non può essere utilizzato da metodi esterni
	@Deprecated
	public SchedaEntePartnerBean getSchedaEntePartnerByIdProgettoAndIdEnte(Long idProgetto, Long idEnte) {
		SchedaEntePartnerBean schedaEntePartner = new SchedaEntePartnerBean();
		EnteProjection ente = this.entePartnerRepository.findEntePartnerByIdProgettoAndIdEnte(idProgetto, idEnte);		
		List<UtenteProjection> referenti = this.referentiDelegatiEntePartnerDiProgettoService.getReferentiEntePartnerByIdProgettoAndIdEnte(idProgetto, idEnte);
		List<UtenteProjection> delegati = this.referentiDelegatiEntePartnerDiProgettoService.getDelegatiEntePartnerByIdProgettoAndIdEnte(idProgetto, idEnte);
		List<SedeEntity> sedi = this.sedeService.getSediEnteByIdProgettoAndIdEnte(idProgetto, idEnte);
		List<SedeBean> sediPartner = sedi
				.stream()
				.map(sede -> {
					SedeBean sedePartner = new SedeBean();
					sedePartner.setId(sede.getId());
					sedePartner.setNome(sede.getNome());
					sedePartner.setServiziErogati(sede.getServiziErogati());
					sedePartner.setNrFacilitatori(this.utenteService.countFacilitatoriPerSedeProgettoEnte(idProgetto, sede.getId(), idEnte));
					sedePartner.setStato(this.sedeService.getStatoSedeByIdProgettoAndIdSedeAndIdEnte(idProgetto, sede.getId(), idEnte));
					return sedePartner;
				}).collect(Collectors.toList());

		schedaEntePartner.setEnte(ente);
		schedaEntePartner.setReferentiEntePartner(referenti);
		schedaEntePartner.setDelegatiEntePartner(delegati);
		schedaEntePartner.setSediEntePartner(sediPartner);
		return schedaEntePartner;
	}

	public SchedaEntePartnerBean getSchedaEntePartnerByIdProgettoAndIdEnteAndSceltaProfilo(Long idProgetto, Long idEnte, EntiPaginatiParam entiPaginatiParam) {
		SchedaEntePartnerBean schedaEntePartner = new SchedaEntePartnerBean();
		EnteProjection ente = this.entePartnerRepository.findEntePartnerByIdProgettoAndIdEnte(idProgetto, idEnte);
		if(ente == null) {
			String messaggioErrore = String.format("ente partner non presente per idEnte %s, idProgetto %s", idEnte, idProgetto);
			throw new EnteException(messaggioErrore, CodiceErroreEnum.EN24);
		}
		List<UtenteProjection> referenti = this.referentiDelegatiEntePartnerDiProgettoService.getReferentiEntePartnerByIdProgettoAndIdEnte(idProgetto, idEnte);
		List<UtenteProjection> delegati = this.referentiDelegatiEntePartnerDiProgettoService.getDelegatiEntePartnerByIdProgettoAndIdEnte(idProgetto, idEnte);
		List<SedeEntity> sedi = this.sedeService.getSediEnteByIdProgettoAndIdEnte(idProgetto, idEnte);
		List<SedeBean> sediPartner = sedi
				.stream()
				.map(sede -> {
					SedeBean sedePartner = new SedeBean();
					sedePartner.setId(sede.getId());
					sedePartner.setNome(sede.getNome());
					sedePartner.setServiziErogati(sede.getServiziErogati());
					sedePartner.setNrFacilitatori(this.utenteService.countFacilitatoriPerSedeProgettoEnte(idProgetto, sede.getId(), idEnte));
					sedePartner.setStato(this.sedeService.getStatoSedeByIdProgettoAndIdSedeAndIdEnte(idProgetto, sede.getId(), idEnte));


					List<String> facilitatoreVolontario = Arrays.asList(RuoloUtenteEnum.FAC.toString(), RuoloUtenteEnum.VOL.toString());
					if(facilitatoreVolontario.contains(entiPaginatiParam.getCodiceRuoloUtenteLoggato().toString())) {
						String cfUtenteLoggato = entiPaginatiParam.getCfUtenteLoggato();
						EnteSedeProgettoFacilitatoreKey id = new EnteSedeProgettoFacilitatoreKey(idEnte, sede.getId(), idProgetto, cfUtenteLoggato);
						boolean isSedeAsssociataAUtente = this.enteSedeProgettoFacilitatoreService.getEnteSedeProgettoFacilitatoreById(id).isPresent();
						sedePartner.setAssociatoAUtente(isSedeAsssociataAUtente);
					} else {
						sedePartner.setAssociatoAUtente(Boolean.TRUE);
					}

					return sedePartner;
				}).collect(Collectors.toList());

		schedaEntePartner.setEnte(ente);
		schedaEntePartner.setReferentiEntePartner(referenti);
		schedaEntePartner.setDelegatiEntePartner(delegati);
		schedaEntePartner.setSediEntePartner(sediPartner);
		return schedaEntePartner;
	}



	/**
	 * Assegna Utente Referente o utente delegato all'ente partner
	 * */
	@LogMethod
	@LogExecutionTime
	@Transactional(rollbackOn = Exception.class)
	public void associaReferenteODelegatoPartner(ReferenteDelegatoPartnerRequest referenteDelegatoPartnerRequest) {
		Long idProgetto = referenteDelegatoPartnerRequest.getIdProgettoDelPartner();
		Long idEntePartner = referenteDelegatoPartnerRequest.getIdEntePartner();
		String codiceFiscaleUtente = referenteDelegatoPartnerRequest.getCfReferenteDelegato();
		String codiceRuolo = referenteDelegatoPartnerRequest.getCodiceRuoloRefDeg().toUpperCase();

		if(!this.progettoService.esisteProgettoById(idProgetto)) {
			String messaggioErrore = String.format("Impossibile assegnare referente/delegato ente partner per progetto con id=%s non esistente", idProgetto);
			throw new EnteException(messaggioErrore, CodiceErroreEnum.EN04);
		}

		if(!this.enteService.esisteEnteById(idEntePartner)) {
			String messaggioErrore = String.format("Impossibile assegnare referente/delegato ente partner per ente con id=%s non esistente", idEntePartner);
			throw new EnteException(messaggioErrore, CodiceErroreEnum.EN04);
		}
		if(this.getEntiPartnerByProgetto(idProgetto).isEmpty()) {
			String messaggioErrore = String.format("ERRORE: l'ente con id = %s non è associato al progetto con id = %s", idEntePartner, idProgetto);
			throw new EnteException(messaggioErrore, CodiceErroreEnum.EN04);
		}

		UtenteEntity utenteFetch;
		try {
			utenteFetch = this.utenteService.getUtenteByCodiceFiscale(codiceFiscaleUtente);
		} catch (ResourceNotFoundException ex) {
			String messaggioErrore = String.format("Impossibile assegnare referente/delegato ente partner perche l'utente con codice fiscale=%s non esiste", codiceFiscaleUtente);
			throw new EnteException(messaggioErrore, ex, CodiceErroreEnum.EN04);
		}

		if(!(RuoloUtenteEnum.REPP.toString().equals(codiceRuolo) || RuoloUtenteEnum.DEPP.toString().equals(codiceRuolo))) {
			String messaggioErrore = String.format("Impossibile assegnare referente/delegato ente partner di progetto all'ente con id=%s, codice ruolo errato: usare 'REPP' o 'DEPP'", idEntePartner);
			throw new EnteException(messaggioErrore, CodiceErroreEnum.EN04);
		}

		if(utenteFetch.getMansione() == null) {
			utenteFetch.setMansione(referenteDelegatoPartnerRequest.getMansione());
			this.utenteService.updateUtente(utenteFetch);
		}

		ReferentiDelegatiEntePartnerDiProgettoKey id =  new ReferentiDelegatiEntePartnerDiProgettoKey(idProgetto, idEntePartner, codiceFiscaleUtente);
		ReferentiDelegatiEntePartnerDiProgettoEntity referentiDelegatiEntePartnerDiProgetto = new ReferentiDelegatiEntePartnerDiProgettoEntity();
		referentiDelegatiEntePartnerDiProgetto.setId(id);
		referentiDelegatiEntePartnerDiProgetto.setCodiceRuolo(codiceRuolo);
		referentiDelegatiEntePartnerDiProgetto.setStatoUtente(StatoEnum.NON_ATTIVO.getValue());
		referentiDelegatiEntePartnerDiProgetto.setDataOraCreazione(new Date());
		referentiDelegatiEntePartnerDiProgetto.setDataOraAggiornamento(new Date());

		//Controllo se l'associazione già esiste
		if(this.referentiDelegatiEntePartnerDiProgettoService.esisteById(id)) {
			String messaggioErrore = String.format("Impossibile assegnare referente/delegato a ente partner perche l'utente con codice fiscale=%s è già referente/delegato", codiceFiscaleUtente);
			throw new EnteException(messaggioErrore, CodiceErroreEnum.EN04);
		}

		//Se l'associazione non esiste la creo
		this.referentiDelegatiEntePartnerDiProgettoService.save(referentiDelegatiEntePartnerDiProgetto);			

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
				log.error("Impossibile inviare la mail ai Referente/Delegato dell'ente partner con id {} per progetto con id={}.", idEntePartner, idProgetto);
				log.error("{}", ex);
			}
		}).start();
	}

	/**
	 * Cancella associazione Utente Referente o utente delegato all'ente partner
	 * */
	@LogMethod
	@LogExecutionTime
	public void cancellaAssociazioneReferenteODelegatoPartner(ReferentiDelegatiEntePartnerDiProgettoEntity referenteDelegatoEntePartnerDiProgettoEntity, String codiceRuolo) {
		Long idProgetto = referenteDelegatoEntePartnerDiProgettoEntity.getId().getIdProgetto();
		String codiceFiscaleUtente = referenteDelegatoEntePartnerDiProgettoEntity.getId().getCodFiscaleUtente();
		Long idEntePartner = referenteDelegatoEntePartnerDiProgettoEntity.getId().getIdEnte();
		ReferentiDelegatiEntePartnerDiProgettoKey id =  new ReferentiDelegatiEntePartnerDiProgettoKey(idProgetto ,idEntePartner, codiceFiscaleUtente);

		this.referentiDelegatiEntePartnerDiProgettoService.cancellaAssociazioneReferenteDelegatoGestoreProgetto(id);

		//Controllo se l'utente è REPP o DEPP(a seconda del codiceRuolo che mi viene passato) su altri partner oltre a questo
		boolean unicaAssociazione = this.referentiDelegatiEntePartnerDiProgettoService.findAltreAssociazioni(idProgetto, idEntePartner, codiceFiscaleUtente, codiceRuolo).isEmpty();

		/*Se la condizione sopra è vera allora insieme all'associazione del referente al partner
		 * imposterò a cancellato anche l'associazione dell'utente al ruolo
		 */
		if(unicaAssociazione) {
			this.ruoloService.cancellaRuoloUtente(codiceFiscaleUtente, codiceRuolo);
		}	
	}

	@LogMethod
	@LogExecutionTime
	public void cancellaAssociazioneEntePartnerPerProgetto(EntePartnerEntity entePartnerProgetto) {
		this.entePartnerRepository.delete(entePartnerProgetto);
	}

	@LogMethod
	@LogExecutionTime
	public EntePartnerEntity getEntePartnerByIdEnteAndIdProgetto(Long idEnte, Long idProgetto) {
		return this.entePartnerRepository.findEntePartnerByIdEnteAndIdProgetto(idEnte, idProgetto);
	}

	@LogMethod
	@LogExecutionTime
	@Transactional(rollbackOn = Exception.class)
	public List<EntePartnerUploadBean> caricaEntiPartner(MultipartFile fileEntiPartner, Long idProgetto) {
		List<EntePartnerUploadBean> esiti = new ArrayList<>();
		try {
			//estraggo gli enti dal file csv
			List<EntePartnerUploadBean> enti = CSVUtil.csvToEnti(fileEntiPartner.getInputStream());
			for(EntePartnerUploadBean ente: enti) {
				String nome = ente.getNome();
				String nomeBreve = ente.getNomeBreve();
				String tipologia = ente.getTipologiaEnte();
				String piva = ente.getPiva();
				//verifico validità campo tipologiaEnte
				if((nome != null && !(nome.trim()).equals("")) &&
						(nomeBreve != null && !(nomeBreve.trim()).equals("")) &&
						(tipologia != null && !(tipologia.trim()).equals("")) &&
						(piva != null && !(piva.trim()).equals(""))
						) {
					if(!this.enteService.esisteEnteByNome(nome)) {

						Pattern pattern = Pattern.compile(PIVA_REGX);
						Matcher matcher = pattern.matcher(ente.getPiva());
						if(matcher.find()) {
							if(Arrays.asList("Ente pubblico", "Ente del terzo settore", "Ente privato")
									.contains(ente.getTipologiaEnte())) {
								//per ogni record verifico se esiste l'entita Ente
								//se esiste aggiungo nuova entita Ente + associazione ente - progetto in EntePartner
								if(!enteService.esisteEnteByPartitaIva(ente.getPiva())) {
									EnteEntity nuovoEnte = new EnteEntity();
									nuovoEnte.setNome(ente.getNome());
									nuovoEnte.setNomeBreve(ente.getNomeBreve());
									nuovoEnte.setPiva(ente.getPiva());
									nuovoEnte.setSedeLegale(ente.getSedeLegale());
									nuovoEnte.setTipologia(ente.getTipologiaEnte());
									nuovoEnte.setIndirizzoPec(ente.getPec());
									Long idEnte = enteService.creaNuovoEnte(nuovoEnte).getId();

									associaEntePartnerPerProgetto(idEnte, idProgetto);

									ente.setEsito("UPLOAD OK");
								}else {
									//se esiste gia l'entita ente devo verificare se esista gia l'associazione entePartner
									Long idEnte = enteService.getEnteByPartitaIva(ente.getPiva()).getId();
									//se esiste --> KO
									if(this.entePartnerRepository.findEntePartnerByIdProgettoAndIdEnte(idProgetto, idEnte) != null) {
										ente.setEsito("KO - Ente già in elenco");
									}else {
										//altrimenti aggiungo associazione EntePartner
										associaEntePartnerPerProgetto(idEnte, idProgetto);

										ente.setEsito("UPLOAD OK");
									}
								}

							}else {
								ente.setEsito("KO - Tipologia ente non conforme");
							}
						}else {
							ente.setEsito("KO - CF/PIVA è una sequenza di 11 numeri");
						}
					}else {
						ente.setEsito("KO - Nome ente già in uso");
					}
				}else {
					ente.setEsito("KO - Nome, Nome Breve, Tipologia ente e CF/PIVA sono campi obbligatori");
				}
				esiti.add(ente);
			}
		} catch (Exception e) {
			throw new EnteException("Impossibile effettuare upload lista enti partner", e, CodiceErroreEnum.EN05);
		}
		return esiti;
	}

	@LogMethod
	@LogExecutionTime
	public void cancellaOTerminaAssociazioneReferenteODelegatoPartner(
			@Valid ReferenteDelegatoPartnerRequest referenteDelegatoPartnerRequest) {
		Long idProgetto = referenteDelegatoPartnerRequest.getIdProgettoDelPartner();
		String codiceFiscaleUtente = referenteDelegatoPartnerRequest.getCfReferenteDelegato();
		Long idEnte = referenteDelegatoPartnerRequest.getIdEntePartner();
		String codiceRuolo = referenteDelegatoPartnerRequest.getCodiceRuoloRefDeg().toUpperCase();
		ReferentiDelegatiEntePartnerDiProgettoEntity referenteDelegatoEntePartnerDiProgettoEntity = this.referentiDelegatiEntePartnerDiProgettoService.getReferenteDelegatoEntePartner(idProgetto, codiceFiscaleUtente, idEnte, codiceRuolo);
		if(StatoEnum.ATTIVO.getValue().equals(referenteDelegatoEntePartnerDiProgettoEntity.getStatoUtente())) {
			this.terminaAssociazioneReferenteDelegatoEntePartner(referenteDelegatoEntePartnerDiProgettoEntity, codiceRuolo);
		}
		if(StatoEnum.NON_ATTIVO.getValue().equals(referenteDelegatoEntePartnerDiProgettoEntity.getStatoUtente())) {
			this.cancellaAssociazioneReferenteODelegatoPartner(referenteDelegatoEntePartnerDiProgettoEntity, codiceRuolo);
		}
	}

	@LogMethod
	@LogExecutionTime
	public void terminaAssociazioneReferenteDelegatoEntePartner(
			ReferentiDelegatiEntePartnerDiProgettoEntity referenteDelegatoEntePartnerDiProgettoEntity, String codiceRuolo) {
		Long idProgetto = referenteDelegatoEntePartnerDiProgettoEntity.getId().getIdProgetto();
		String codiceFiscaleUtente = referenteDelegatoEntePartnerDiProgettoEntity.getId().getCodFiscaleUtente();
		Long idEnte = referenteDelegatoEntePartnerDiProgettoEntity.getId().getIdEnte();
		//Controllo se sul partner qualcun altro ha lo stesso ruolo dell'utente
		boolean unicoReferenteODelegato = this.referentiDelegatiEntePartnerDiProgettoService.findAltriReferentiODelegatiAttivi(idProgetto, idEnte, codiceFiscaleUtente, codiceRuolo).isEmpty();

		//Se l'utente è REPP(referente) e non ci sono altri REPP(referenti) oltre a lui lancio eccezione.
		if (codiceRuolo.equalsIgnoreCase("REPP") && unicoReferenteODelegato) {
			throw new EnteException(
					"Impossibile cancellare associazione referente. E' l'unico referente ATTIVO del partner. "
							+ "Per eliminarlo procedere prima con l'associazione di un altro referente al partner.",
							CodiceErroreEnum.EN06);
		}
		referenteDelegatoEntePartnerDiProgettoEntity.setStatoUtente(StatoEnum.TERMINATO.getValue());
		referenteDelegatoEntePartnerDiProgettoEntity.setDataOraAggiornamento(new Date());
		this.referentiDelegatiEntePartnerDiProgettoService.save(referenteDelegatoEntePartnerDiProgettoEntity);
	}

	@LogMethod
	@LogExecutionTime
	public void terminaACascataAssociazioneReferenteDelegatoEntePartner(
			ReferentiDelegatiEntePartnerDiProgettoEntity referenteDelegatoEntePartnerDiProgettoEntity, String codiceRuolo) {
		referenteDelegatoEntePartnerDiProgettoEntity.setStatoUtente(StatoEnum.TERMINATO.getValue());
		referenteDelegatoEntePartnerDiProgettoEntity.setDataOraAggiornamento(new Date());
		this.referentiDelegatiEntePartnerDiProgettoService.save(referenteDelegatoEntePartnerDiProgettoEntity);
	}

}