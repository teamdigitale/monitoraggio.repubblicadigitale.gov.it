package it.pa.repdgt.ente.service;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import javax.transaction.Transactional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

import it.pa.repdgt.ente.bean.DettaglioProgettoLightBean;
import it.pa.repdgt.ente.bean.DettaglioSedeBean;
import it.pa.repdgt.ente.bean.IndirizzoSedeFasceOrarieBean;
import it.pa.repdgt.ente.bean.SchedaSedeBean;
import it.pa.repdgt.ente.entity.projection.IndirizzoSedeProjection;
import it.pa.repdgt.ente.entity.projection.UtenteProjection;
import it.pa.repdgt.ente.exception.ResourceNotFoundException;
import it.pa.repdgt.ente.exception.SedeException;
import it.pa.repdgt.ente.mapper.IndirizzoSedeMapper;
import it.pa.repdgt.ente.mapper.SedeMapper;
import it.pa.repdgt.ente.repository.EnteSedeProgettoRepository;
import it.pa.repdgt.ente.repository.SedeRepository;
import it.pa.repdgt.ente.request.NuovaSedeRequest;
import it.pa.repdgt.ente.request.NuovaSedeRequest.IndirizzoSedeRequest;
import it.pa.repdgt.shared.annotation.LogExecutionTime;
import it.pa.repdgt.shared.annotation.LogMethod;
import it.pa.repdgt.shared.entity.IndirizzoSedeEntity;
import it.pa.repdgt.shared.entity.IndirizzoSedeFasciaOrariaEntity;
import it.pa.repdgt.shared.entity.ProgettoEntity;
import it.pa.repdgt.shared.entity.SedeEntity;

@Service
@Validated
public class SedeService {
	@Autowired
	private SedeMapper sedeMapper;
	@Autowired
	private IndirizzoSedeMapper indirizzoSedeMapper;
	@Autowired
	@Lazy
	private EnteService enteService;
	@Autowired
	private ProgettoService progettoService;
	@Autowired
	private IndirizzoSedeService indirizzoSedeService;
	@Autowired
	private IndirizzoSedeFasciaOrariaService indirizzoSedeFasciaOrariaService;
	@Autowired
	private SedeRepository sedeRepository;
	@Autowired
	@Lazy
	private EnteSedeProgettoService enteSedeProgettoService;
	
	@LogMethod
	@LogExecutionTime
	public SedeEntity getSedeById(@NotNull Long idSede) {
		String errorMessage = String.format("Sede con id=%s non presente", String.valueOf(idSede));
		return this.sedeRepository.findById(idSede)
					.orElseThrow(() -> new ResourceNotFoundException(errorMessage));
	}
	
	@LogMethod
	@LogExecutionTime
	public boolean esisteSedeById(@NotNull Long sedeId) {
		return this.sedeRepository.findById(sedeId).isPresent();
	}
	
	@LogMethod
	@LogExecutionTime
	public List<SedeEntity> getSedeByNomeSedeLike(@NotNull String nomeSede) {
		return this.sedeRepository.findSedeByNomeSedeLike(nomeSede);
	}
	
	@LogMethod
	@LogExecutionTime
	public List<SedeEntity> cercaSedeByNomeSedeLike(@NotNull String nomeSede) {
		return this.getSedeByNomeSedeLike(nomeSede);
	}
	
	@LogMethod
	@LogExecutionTime
	@Transactional(rollbackOn = Exception.class)
	public SedeEntity creaNuovaSede(@NotNull final NuovaSedeRequest nuovaSedeRequest) {
		final String nomeSede = nuovaSedeRequest.getNome();
		if(this.esisteSedeByNome(nomeSede)) {
			final String messaggioErrore = String.format("Errore Creazione Sede. Sede con nome='%s' già presente", nomeSede);
			throw new SedeException(messaggioErrore);
		}
		
		final SedeEntity sede = this.sedeMapper.toEntityFrom(nuovaSedeRequest);

		// salvo la sede
		sede.setDataOraCreazione(new Date());
		sede.setDataOraAggiornamento(new Date());
		final SedeEntity sedeSalvata = this.sedeRepository.save(sede);
		
		// salvo indirizzi_sede associati alla sede salvata in precedenza
		nuovaSedeRequest
			.getIndirizziSedeFasceOrarie()
			.forEach(indirizzoSedeRequest -> {
				final IndirizzoSedeEntity indirizzoSede = this.indirizzoSedeMapper.toEntityFrom(indirizzoSedeRequest);
				indirizzoSede.setIdSede(sedeSalvata.getId());
				indirizzoSede.setDataOraCreazione(new Date());
				indirizzoSede.setDataOraAggiornamento(new Date());
				final IndirizzoSedeEntity indirizzoSedeSalvato = this.indirizzoSedeService.salvaIndirizzoSede(indirizzoSede);
				IndirizzoSedeFasciaOrariaEntity fasceOrarieDaSalvare = indirizzoSedeRequest.getFasceOrarieAperturaIndirizzoSede();
				fasceOrarieDaSalvare.setIdIndirizzoSede(indirizzoSedeSalvato.getId());
				this.indirizzoSedeFasciaOrariaService.salvaIndirizzoSedeFasciaOraria(fasceOrarieDaSalvare);
		});
		return sedeSalvata;
	}
	
	@LogMethod
	@LogExecutionTime
	public boolean esisteSedeByNome(@NotNull final String nomeSede) {
		return this.sedeRepository.findSedeByNomeSede(nomeSede).isPresent();
	}
	
	@LogMethod
	@LogExecutionTime
	public boolean esisteSedeByNomeAndNotIdSede(@NotNull final String nomeSede, @NotNull final Long idSede) {
		return this.sedeRepository.findSedeByNomeSedeAndNotIdSede(nomeSede, idSede).isPresent();
	}

	@LogMethod
	@LogExecutionTime
	public List<SedeEntity> getSediEnteByIdProgettoAndIdEnte(Long idProgetto, Long idEnte) {
		return this.sedeRepository.findSediEnteByIdProgettoAndIdEnte(idProgetto, idEnte);
	}
	
	@LogMethod
	@LogExecutionTime
	public String getStatoSedeByIdProgettoAndIdSedeAndIdEnte(Long idProgetto, Long idSede, Long idEnte) {
		return this.sedeRepository.findStatoSedeByIdProgettoAndIdSedeAndIdEnte(idProgetto, idSede, idEnte);
	}

	@LogMethod
	@LogExecutionTime
	public SchedaSedeBean getSchedaSedeByIdSede(final Long idSede) {
		final SedeEntity sede = this.getSedeById(idSede);
		final List<IndirizzoSedeProjection> indirizziSede = this.indirizzoSedeService.getIndirizzoSedeByIdSede(idSede);
		
		final List<IndirizzoSedeFasceOrarieBean> indirizziSedeFasceOrarieBean = indirizziSede
				.stream()
				.map(indirizzoSede -> {
					final IndirizzoSedeFasceOrarieBean indirizzoSedeFasceOrarieBean = new IndirizzoSedeFasceOrarieBean();
					indirizzoSedeFasceOrarieBean.setIndirizzoSede(indirizzoSede);
					Optional<IndirizzoSedeFasciaOrariaEntity> fasceOrarie = this.indirizzoSedeFasciaOrariaService.getFasceOrarieByIdIndirizzoSede(indirizzoSede.getId());
					if(fasceOrarie.isPresent())
						indirizzoSedeFasceOrarieBean.setFasceOrarieAperturaIndirizzoSede(fasceOrarie.get());
					return indirizzoSedeFasceOrarieBean;
				})
				.collect(Collectors.toList());
	
		final DettaglioSedeBean dettaglioSede = this.sedeMapper.toDettaglioFrom(sede);
		dettaglioSede.setIndirizziSedeFasceOrarie(indirizziSedeFasceOrarieBean);
		final SchedaSedeBean schedaSede = new SchedaSedeBean();
		schedaSede.setDettaglioSede(dettaglioSede);
		return schedaSede;
	}
	
	@LogMethod
	@LogExecutionTime
	public SchedaSedeBean getSchedaSedeByIdProgettoAndIdEnteAndIdSede(final Long idProgetto, final Long idEnte, final Long idSede) {
		ProgettoEntity progettoFetchDB = this.progettoService.getProgettoById(idProgetto);
		final DettaglioProgettoLightBean dettaglioProgetto = this.sedeMapper.toDettaglioProgettoLightBeanFrom(progettoFetchDB);
		final SchedaSedeBean schedaSede = this.getSchedaSedeByIdSede(idSede);
		schedaSede.getDettaglioSede().setStato(enteSedeProgettoService.getAssociazioneEnteSedeProgetto(idSede, idEnte, idProgetto).getStatoSede());
		final DettaglioSedeBean dettaglioSede = schedaSede.getDettaglioSede();
		dettaglioSede.setEnteDiRiferimento(this.enteService.getEnteById(idEnte).getNome());
		
		final List<UtenteProjection> facilitatori = this.sedeRepository.findFacilitatoriSedeByIdProgettoAndIdEnteAndIdSede(idProgetto, idEnte, idSede);
		schedaSede.setDettaglioProgetto(dettaglioProgetto);
		schedaSede.setDettaglioSede(dettaglioSede);
		schedaSede.setFacilitatoriSede(facilitatori);
		return schedaSede;
	}

	@Transactional(rollbackOn = Exception.class)
	public void aggiornaSede(Long idSede, @Valid NuovaSedeRequest nuovaSedeRequest) {
		if(!this.sedeRepository.existsById(idSede)) {
			String errorMessage = String.format("La Sede con id = %s non esiste", idSede);
			throw new SedeException(errorMessage);
		}
		if(this.esisteSedeByNomeAndNotIdSede(nuovaSedeRequest.getNome(), idSede)) {
			final String messaggioErrore = String.format("Errore Creazione Sede. Sede con nome='%s' già presente", nuovaSedeRequest.getNome());
			throw new SedeException(messaggioErrore);
		}
		//aggiorno la sede
		SedeEntity sedeFetchDB = this.getSedeById(idSede);
		this.sedeMapper.toEntityFrom(nuovaSedeRequest, sedeFetchDB);
		sedeFetchDB.setDataOraAggiornamento(new Date());
		this.sedeRepository.save(sedeFetchDB);
		
		//aggiorno indirizzi della sede
		List<IndirizzoSedeRequest> listaIndirizzi = nuovaSedeRequest.getIndirizziSedeFasceOrarie();
		listaIndirizzi.stream()
					  .forEach(indirizzoRequest -> {
						  //se il campo "cancellato" è a TRUE, cancelliamo l'indirizzo dalla sede
						  if(indirizzoRequest.getCancellato() == true) {
							  this.cancellaFasceOrarieByIdIndirizzo(indirizzoRequest.getId());
							  this.indirizzoSedeService.cancellaIndirizzoSedeById(indirizzoRequest.getId());
						  } else if(indirizzoRequest.getId() == null) {
							  //se l'ID dell'indirizzo è null, allora aggiungiamo l'indirizzo alla sede
							  IndirizzoSedeEntity indirizzoSedeEntity = this.indirizzoSedeMapper.toEntityFrom(indirizzoRequest);
							  indirizzoSedeEntity.setIdSede(idSede);
							  indirizzoSedeEntity.setDataOraCreazione(new Date());
							  indirizzoSedeEntity.setDataOraAggiornamento(new Date());
							  indirizzoSedeEntity =this.indirizzoSedeService.salvaIndirizzoSede(indirizzoSedeEntity);
							  this.assegnaFasceOrarie(indirizzoRequest, indirizzoSedeEntity);
						  	 } else {
						  	   //se l'ID dell'indirizzo è diverso da null, allora aggiorniamo l'indirizzo
						  	   IndirizzoSedeEntity indirizzoSedeEntity = this.indirizzoSedeMapper.toEntityFrom(indirizzoRequest);
						  	   indirizzoSedeEntity.setIdSede(idSede);
						  	   indirizzoSedeEntity.setId(indirizzoRequest.getId());
						  	   indirizzoSedeEntity.setDataOraAggiornamento(new Date());
						  	   indirizzoSedeEntity.setDataOraCreazione(this.indirizzoSedeService.getIndirizzoSedeById(indirizzoRequest.getId()).getDataOraCreazione());
						  	   this.indirizzoSedeService.salvaIndirizzoSede(indirizzoSedeEntity);
						  	   this.aggiornaFasceOrarie(indirizzoRequest, indirizzoSedeEntity);
						  	 }
					   });
	}

	private void assegnaFasceOrarie(IndirizzoSedeRequest indirizzoRequest, IndirizzoSedeEntity indirizzoSedeEntity) {
		IndirizzoSedeFasciaOrariaEntity fasciaOraria = indirizzoRequest.getFasceOrarieAperturaIndirizzoSede();
		fasciaOraria.setIdIndirizzoSede(indirizzoSedeEntity.getId());
		this.indirizzoSedeFasciaOrariaService.salvaIndirizzoSedeFasciaOraria(fasciaOraria);
	}

	private void aggiornaFasceOrarie(IndirizzoSedeRequest indirizzoRequest, IndirizzoSedeEntity indirizzoSedeEntity) {
		IndirizzoSedeFasciaOrariaEntity fasciaOraria = indirizzoRequest.getFasceOrarieAperturaIndirizzoSede();
		Optional<IndirizzoSedeFasciaOrariaEntity> fasceOrarieDaAggiornare = this.indirizzoSedeFasciaOrariaService.getFasceOrarieByIdIndirizzoSede(indirizzoSedeEntity.getId());
		if(fasceOrarieDaAggiornare.isPresent()) {
			fasciaOraria.setId(fasceOrarieDaAggiornare.get().getId());
		}
		fasciaOraria.setIdIndirizzoSede(indirizzoRequest.getId());		
		this.indirizzoSedeFasciaOrariaService.salvaIndirizzoSedeFasciaOraria(fasciaOraria);
	}

	@Transactional(rollbackOn = Exception.class)
	private void cancellaFasceOrarieByIdIndirizzo(Long id) {
		Optional<IndirizzoSedeFasciaOrariaEntity> listaFasceOrarieEntity = this.indirizzoSedeFasciaOrariaService.getFasceOrarieEntityByIdIndirizzoSede(id);
		if(listaFasceOrarieEntity.isPresent())
			this.indirizzoSedeFasciaOrariaService.cancellaFasciaOraria(listaFasceOrarieEntity.get());
	}
}