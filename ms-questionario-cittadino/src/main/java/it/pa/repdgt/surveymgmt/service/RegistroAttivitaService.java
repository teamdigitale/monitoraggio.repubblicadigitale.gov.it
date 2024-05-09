package it.pa.repdgt.surveymgmt.service;

import it.pa.repdgt.shared.entity.RegistroAttivitaEntity;
import it.pa.repdgt.shared.restapi.param.SceltaProfiloParam;
import it.pa.repdgt.surveymgmt.repository.EnteRepository;
import it.pa.repdgt.surveymgmt.repository.ProgettoRepository;
import it.pa.repdgt.surveymgmt.repository.RegistroAttivitaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RegistroAttivitaService {

    private final EnteRepository enteRepository;
    private final ProgettoRepository progettoRepository;
    private final RegistroAttivitaRepository registroAttivitaRepository;

    public RegistroAttivitaEntity saveRegistroAttivita(RegistroAttivitaEntity registroAttivitaEntity) {
        if (!enteRepository.existsById(registroAttivitaEntity.getIdEnte())
                || !progettoRepository.existsById(registroAttivitaEntity.getIdProgetto()))
            throw new IllegalArgumentException();
        return registroAttivitaRepository.save(registroAttivitaEntity);
    }

    public Page<RegistroAttivitaEntity> getRegistroAttivita(Integer page, Integer size,
            SceltaProfiloParam sceltaProfiloParam) {
        Sort sort = Sort.by(Sort.Direction.DESC, "dataInserimento");
        Pageable pageable = PageRequest.of(page, size, sort);
        switch (sceltaProfiloParam.getCodiceRuoloUtenteLoggato()) {
            case "DTD":
                return registroAttivitaRepository.findAll(pageable);
            case "FAC":
                return registroAttivitaRepository.findAllByOperatore(pageable, sceltaProfiloParam.getCfUtenteLoggato());
            case "REG":
            case "REGP":
            case "REPP":
                return registroAttivitaRepository.findAllByIdEnteAndIdProgetto(pageable, sceltaProfiloParam.getIdEnte(),
                        sceltaProfiloParam.getIdProgetto());
            default:
                throw new IllegalArgumentException();
        }
    }

}
