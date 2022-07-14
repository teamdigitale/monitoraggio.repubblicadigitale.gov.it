package it.pa.repdgt.ente.service;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import javax.transaction.Transactional;
import javax.validation.constraints.NotNull;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

import it.pa.repdgt.ente.bean.DettaglioSedeBean;
import it.pa.repdgt.ente.bean.IndirizzoSedeFasceOrarieBean;
import it.pa.repdgt.ente.bean.SchedaSedeBean;
import it.pa.repdgt.ente.entity.projection.IndirizzoSedeProjection;
import it.pa.repdgt.ente.entity.projection.UtenteProjection;
import it.pa.repdgt.ente.exception.ResourceNotFoundException;
import it.pa.repdgt.ente.exception.SedeException;
import it.pa.repdgt.ente.mapper.IndirizzoSedeFasciaOrariaMapper;
import it.pa.repdgt.ente.mapper.IndirizzoSedeMapper;
import it.pa.repdgt.ente.mapper.SedeMapper;
import it.pa.repdgt.ente.repository.SedeRepository;
import it.pa.repdgt.ente.request.NuovaSedeRequest;
import it.pa.repdgt.shared.entity.IndirizzoSedeEntity;
import it.pa.repdgt.shared.entity.IndirizzoSedeFasciaOrariaEntity;
import it.pa.repdgt.shared.entity.SedeEntity;

@Service
@Validated
public class SedeService {
	@Autowired
	private SedeMapper sedeMapper;
	@Autowired
	private IndirizzoSedeMapper indirizzoSedeMapper;
	@Autowired
	private IndirizzoSedeFasciaOrariaMapper indirizzoSedeFasciaOrariaMapper;
	@Autowired
	@Lazy
	private EnteService enteService;
	@Autowired
	private IndirizzoSedeService indirizzoSedeService;
	@Autowired
	private IndirizzoSedeFasciaOrariaService indirizzoSedeFasciaOrariaService;
	@Autowired
	private SedeRepository sedeRepository;
	
	public SedeEntity getSedeById(@NotNull Long idSede) {
		String errorMessage = String.format("Sede con id=%s non presente", String.valueOf(idSede));
		return this.sedeRepository.findById(idSede)
					.orElseThrow(() -> new ResourceNotFoundException(errorMessage));
	}
	
	public boolean esisteSedeById(@NotNull Long sedeId) {
		return this.sedeRepository.findById(sedeId).isPresent();
	}
	
	public List<SedeEntity> getSedeByNomeSedeLike(@NotNull String nomeSede) {
		return this.sedeRepository.findSedeByNomeSedeLike(nomeSede);
	}
	
	public List<SedeEntity> cercaSedeByNomeSedeLike(@NotNull String nomeSede) {
		return this.getSedeByNomeSedeLike(nomeSede);
	}
	
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
			.getIndirizziSede()
			.forEach(indirizzoSedeRequest -> {
				final IndirizzoSedeEntity indirizzoSede = this.indirizzoSedeMapper.toEntityFrom(indirizzoSedeRequest);
				indirizzoSede.setIdSede(sedeSalvata.getId());
				indirizzoSede.setDataOraCreazione(new Date());
				indirizzoSede.setDataOraAggiornamento(new Date());
				final IndirizzoSedeEntity indirizzoSedeSalvato = this.indirizzoSedeService.salvaIndirizzoSede(indirizzoSede);
				
				final List<IndirizzoSedeFasciaOrariaEntity> indirizziSedeFasceOrarie = this.indirizzoSedeFasciaOrariaMapper.toEntityFrom(indirizzoSedeRequest.getFasceOrarie());

				// salvo fasce_orarie indirizzo_sede associati all' indirizzo_sede salvato in precedenza
				indirizziSedeFasceOrarie.forEach(indirizzoSedeFasciaOraria -> {
					indirizzoSedeFasciaOraria.setIdIndirizzoSede(indirizzoSedeSalvato.getId());
					indirizzoSedeFasciaOraria.setDataOraCreazione(new Date());
					indirizzoSedeFasciaOraria.setDataOraAggiornamento(new Date());
					this.indirizzoSedeFasciaOrariaService.salvaIndirizzoSedeFasciaOraria(indirizzoSedeFasciaOraria);
				});
		});
		return sedeSalvata;
	}
	
	public boolean esisteSedeByNome(@NotNull final String nomeSede) {
		return this.sedeRepository.findSedeByNomeSede(nomeSede).isPresent();
	}

	public List<SedeEntity> getSediEnteByIdProgettoAndIdEnte(Long idProgetto, Long idEnte) {
		return this.sedeRepository.findSediEnteByIdProgettoAndIdEnte(idProgetto, idEnte);
	}
	
	public String getStatoSedeByIdProgettoAndIdSedeAndIdEnte(Long idProgetto, Long idSede, Long idEnte) {
		return this.sedeRepository.findStatoSedeByIdProgettoAndIdSedeAndIdEnte(idProgetto, idSede, idEnte);
	}

	public SchedaSedeBean getSchedaSedeByIdSede(final Long idSede) {
		final SedeEntity sede = this.getSedeById(idSede);
		final List<IndirizzoSedeProjection> indirizziSede = this.indirizzoSedeService.getIndirizzoSedeByIdSede(idSede);
		
		final List<IndirizzoSedeFasceOrarieBean> indirizziSedeFasceOrarieBean = indirizziSede
				.stream()
				.map(indirizzoSede -> {
					final IndirizzoSedeFasceOrarieBean indirizzoSedeFasceOrarieBean = new IndirizzoSedeFasceOrarieBean();
					indirizzoSedeFasceOrarieBean.setIndirizzoSede(indirizzoSede);
					indirizzoSedeFasceOrarieBean.setFasceOrarieAperturaIndirizzoSede(this.indirizzoSedeFasciaOrariaService.getFasceOrarieByIdIndirizzoSede(indirizzoSede.getId()));
					return indirizzoSedeFasceOrarieBean;
				})
				.collect(Collectors.toList());
	
		final DettaglioSedeBean dettaglioSede = this.sedeMapper.toDettaglioFrom(sede);
		dettaglioSede.setIndirizziSedeFasceOrarie(indirizziSedeFasceOrarieBean);
		final SchedaSedeBean schedaSede = new SchedaSedeBean();
		schedaSede.setDettaglioSede(dettaglioSede);
		return schedaSede;
	}
	
	public SchedaSedeBean getSchedaSedeByIdProgettoAndIdEnteAndIdSede(final Long idProgetto, final Long idEnte, final Long idSede) {
		final SchedaSedeBean schedaSede = this.getSchedaSedeByIdSede(idSede);
		final DettaglioSedeBean dettaglioSede = schedaSede.getDettaglioSede();
		dettaglioSede.setEnteDiRiferimento(this.enteService.getEnteById(idEnte).getNome());
		
		final List<UtenteProjection> facilitatori = this.sedeRepository.findFacilitatoriSedeByIdProgettoAndIdEnteAndIdSede(idProgetto, idEnte, idSede);
		schedaSede.setDettaglioSede(dettaglioSede);
		schedaSede.setFacilitatoriSede(facilitatori);
		return schedaSede;
	}
}