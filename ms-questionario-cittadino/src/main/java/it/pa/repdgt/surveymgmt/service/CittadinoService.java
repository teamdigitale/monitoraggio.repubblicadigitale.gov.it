package it.pa.repdgt.surveymgmt.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import it.pa.repdgt.shared.entity.CittadinoEntity;
import it.pa.repdgt.shared.entityenum.RuoloUtenteEnum;
import it.pa.repdgt.surveymgmt.bean.DettaglioCittadinoBean;
import it.pa.repdgt.surveymgmt.bean.DettaglioServizioSchedaCittadinoBean;
import it.pa.repdgt.surveymgmt.bean.SchedaCittadinoBean;
import it.pa.repdgt.surveymgmt.dto.CittadinoDto;
import it.pa.repdgt.surveymgmt.dto.SedeDto;
import it.pa.repdgt.surveymgmt.exception.CittadinoException;
import it.pa.repdgt.surveymgmt.exception.ResourceNotFoundException;
import it.pa.repdgt.surveymgmt.mapper.CittadinoMapper;
import it.pa.repdgt.surveymgmt.param.CittadiniPaginatiParam;
import it.pa.repdgt.surveymgmt.param.FiltroListaCittadiniParam;
import it.pa.repdgt.surveymgmt.projection.CittadinoProjection;
import it.pa.repdgt.surveymgmt.projection.DettaglioServizioSchedaCittadinoProjection;
import it.pa.repdgt.surveymgmt.projection.SedeProjection;
import it.pa.repdgt.surveymgmt.repository.CittadinoRepository;

@Service
public class CittadinoService {
	
	@Autowired
	private CittadinoRepository cittadinoRepository;
	@Autowired
	private RuoloService ruoloService;
	@Autowired
	private SedeService sedeService;
	@Autowired
	private EnteSedeProgettoFacilitatoreService enteSedeProgettoFacilitatoreService;
	@Autowired
	private CittadinoMapper cittadinoMapper;
	
	public CittadinoEntity getCittadinoById(Long idCittadino) {
		String errorMessage = String.format("Cittadino con id=%s non presente", String.valueOf(idCittadino));
		return this.cittadinoRepository.findById(idCittadino)
				.orElseThrow( () -> new ResourceNotFoundException(errorMessage));
	}
	
	public Page<CittadinoDto> getAllCittadiniPaginati(
			CittadiniPaginatiParam cittadiniPaginatiParam,
			Integer currPage, 
			Integer pageSize) {
		String codiceRuoloUtente = cittadiniPaginatiParam.getCodiceRuoloUtenteLoggato().toString();
		
		 boolean hasRuoloUtente = this.ruoloService
			.getRuoliByCodiceFiscale(cittadiniPaginatiParam.getCodiceFiscaleUtenteLoggato())
			.stream()
			.anyMatch(ruolo -> ruolo.getCodice().equals(codiceRuoloUtente));
		
		if(!hasRuoloUtente) {
			throw new CittadinoException("ERRORE: ruolo non definito per l'utente");
		}
		
		if(!RuoloUtenteEnum.FAC.toString().equals(codiceRuoloUtente)) {
			throw new CittadinoException("ERRORE: L'utente non è un facilitatore");
		}
		
		Pageable paginazione = PageRequest.of(currPage, pageSize);
		List<CittadinoProjection> cittadiniProjection = this.getAllCittadiniFacilitatoreFiltrati(cittadiniPaginatiParam);
		List<CittadinoDto> cittadini = cittadiniProjection
				.stream()
				.map(record -> {
					CittadinoDto cittadinoDto = new CittadinoDto();
					cittadinoDto.setId(record.getId());
					cittadinoDto.setNome(record.getNome());
					cittadinoDto.setCognome(record.getCognome());
					cittadinoDto.setNumeroServizi(record.getNumeroServizi());
					cittadinoDto.setNumeroQuestionariCompilati(record.getNumeroQuestionariCompilati());
					return cittadinoDto;
			})
			.collect(Collectors.toList());
		
		cittadini.sort((cittadino1, cittadino2) -> cittadino1.getId().compareTo(cittadino2.getId()));
		
		int start = (int) paginazione.getOffset();
		int end = Math.min((start + paginazione.getPageSize()), cittadini.size());
		
		if(start > end) {
			throw new CittadinoException("ERRORE: pagina richiesta inesistente");
		}
		
		return new PageImpl<CittadinoDto>(cittadini.subList(start, end), paginazione, cittadini.size());
	}
	
	private List<CittadinoProjection> getAllCittadiniFacilitatoreFiltrati( CittadiniPaginatiParam cittadiniPaginatiParam) {
		FiltroListaCittadiniParam filtro = cittadiniPaginatiParam.getFiltro();
		String criterioRicerca = filtro.getCriterioRicerca();
		List<String> idsSedi;
		if(filtro.getIdsSedi() == null) {
			idsSedi = this.enteSedeProgettoFacilitatoreService.getIdsSediFacilitatoreByCodFiscaleAndIdProgetto(cittadiniPaginatiParam.getCodiceFiscaleUtenteLoggato(), cittadiniPaginatiParam.getIdProgetto());
		} else {
			idsSedi = filtro.getIdsSedi();
		}
		
		return this.cittadinoRepository.findAllCittadiniFiltrati(criterioRicerca, "%" + criterioRicerca + "%", idsSedi);
	}

	public List<SedeDto> getAllSediDropdown(@Valid CittadiniPaginatiParam cittadiniPaginatiParam) {
		String codiceRuoloUtente = cittadiniPaginatiParam.getCodiceRuoloUtenteLoggato().toString();
		
		 boolean hasRuoloUtente = this.ruoloService
			.getRuoliByCodiceFiscale(cittadiniPaginatiParam.getCodiceFiscaleUtenteLoggato())
			.stream()
			.anyMatch(ruolo -> ruolo.getCodice().equals(codiceRuoloUtente));
		
		if(!hasRuoloUtente) {
			throw new CittadinoException("ERRORE: ruolo non definito per l'utente");
		}
		
		if(!RuoloUtenteEnum.FAC.toString().equals(codiceRuoloUtente)) {
			throw new CittadinoException("ERRORE: L'utente non è un facilitatore");
		}
		
		List<SedeProjection> listaSediProjection = this.sedeService.getAllSediFacilitatoreFiltrate(cittadiniPaginatiParam);
		List<SedeDto> listaSediDto = listaSediProjection
				.stream()
				.map(record -> {
					SedeDto sedeDto = new SedeDto();
					sedeDto.setId(record.getId());
					sedeDto.setNome(record.getNome());
					return sedeDto;
			})
			.collect(Collectors.toList());
			
			return listaSediDto;
	}

	public SchedaCittadinoBean getSchedaCittadinoById(Long idCittadino) {
		CittadinoEntity cittadinoFetchDB = this.getCittadinoById(idCittadino);
		
		DettaglioCittadinoBean dettaglioCittadino = this.cittadinoMapper.toDettaglioCittadinoBeanFrom(cittadinoFetchDB);
		List<DettaglioServizioSchedaCittadinoProjection> serviziProjection = this.getDettaglioServiziSchedaCittadino(idCittadino);
		List<DettaglioServizioSchedaCittadinoBean> serviziBean = serviziProjection.stream().map(record -> {
			DettaglioServizioSchedaCittadinoBean dettaglioServizioSchedaCittadino = new DettaglioServizioSchedaCittadinoBean();
			dettaglioServizioSchedaCittadino.setIdServizio(record.getIdServizio());
			dettaglioServizioSchedaCittadino.setNomeServizio(record.getNomeServizio());
			String nomeCompletoFacilitatore = this.enteSedeProgettoFacilitatoreService.getNomeCompletoFacilitatoreByCodiceFiscale(record.getCodiceFiscaleFacilitatore());
			dettaglioServizioSchedaCittadino.setNomeCompletoFacilitatore(nomeCompletoFacilitatore);
			dettaglioServizioSchedaCittadino.setIdQuestionarioCompilato(record.getIdQuestionarioCompilato());
			dettaglioServizioSchedaCittadino.setStatoQuestionario(record.getStatoQuestionarioCompilato());
			return dettaglioServizioSchedaCittadino;
		}).collect(Collectors.toList());
		
		SchedaCittadinoBean schedaCittadino = new SchedaCittadinoBean();
		schedaCittadino.setDettaglioCittadino(dettaglioCittadino);
		schedaCittadino.setServiziCittadino(serviziBean);
		return schedaCittadino;
	}

	private List<DettaglioServizioSchedaCittadinoProjection> getDettaglioServiziSchedaCittadino(Long idCittadino) {
		return this.cittadinoRepository.findDettaglioServiziSchedaCittadino(idCittadino);
	}
	
	public Optional<CittadinoEntity> getCittadinoByCodiceFiscaleOrNumeroDocumento(
			final Boolean isCodiceFiscaleNonDisponibile,
			final String codiceFiscale, 
			final String numeroDocumento) {
		if(isCodiceFiscaleNonDisponibile == null || isCodiceFiscaleNonDisponibile) {
			return cittadinoRepository.findByNumeroDocumento(numeroDocumento);
		}
		return cittadinoRepository.findByCodiceFiscale(codiceFiscale);
	}

	public Optional<CittadinoEntity> getByCodiceFiscaleOrNumeroDocumento(
			final String codiceFiscale, 
			final String numeroDocumento ) {
		return this.cittadinoRepository.findByCodiceFiscaleOrNumeroDocumento(codiceFiscale, numeroDocumento);
	}

	public void salvaCittadino(CittadinoEntity cittadino) {
		this.cittadinoRepository.save(cittadino);
	}
}