package it.pa.repdgt.surveymgmt.service;

import it.pa.repdgt.shared.entity.RegistroAttivitaEntity;
import it.pa.repdgt.shared.entity.UtenteEntity;
import it.pa.repdgt.shared.restapi.param.SceltaProfiloParam;
import it.pa.repdgt.surveymgmt.repository.EnteRepository;
import it.pa.repdgt.surveymgmt.repository.ProgettoRepository;
import it.pa.repdgt.surveymgmt.repository.RegistroAttivitaRepository;
import it.pa.repdgt.surveymgmt.repository.UtenteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class RegistroAttivitaService {


    private final EnteRepository enteRepository;
    private final ProgettoRepository progettoRepository;
    private final RegistroAttivitaRepository registroAttivitaRepository;
    private final UtenteRepository utenteRepository;


    public RegistroAttivitaEntity saveRegistroAttivita(RegistroAttivitaEntity registroAttivitaEntity) {
        if (!enteRepository.existsById(registroAttivitaEntity.getIdEnte()) || !progettoRepository.existsById(registroAttivitaEntity.getIdProgetto()))
            throw new IllegalArgumentException();
        String cfUtente = registroAttivitaEntity.getOperatore();
        registroAttivitaEntity.setCodiceFiscale(cfUtente);
        registroAttivitaEntity.setOperatore(getNomeCognomeOperatore(registroAttivitaEntity.getOperatore()));
        return registroAttivitaRepository.save(registroAttivitaEntity);
    }

    private String getNomeCognomeOperatore(String operatore) {
        Optional<UtenteEntity> utenteOpt = utenteRepository.findByCodiceFiscale(operatore);
        if(!utenteOpt.isPresent()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
        }
        UtenteEntity utente = utenteOpt.get();
        return utente.getNome()+" "+utente.getCognome();
    }


    public Page<RegistroAttivitaEntity> getRegistroAttivita(Integer page, Integer size, SceltaProfiloParam sceltaProfiloParam) {
        Sort sort = Sort.by(Sort.Direction.DESC, "dataInserimento");
        Pageable pageable = PageRequest.of(page, size, sort);
        switch (sceltaProfiloParam.getCodiceRuoloUtenteLoggato()) {
            case "FAC":
                return registroAttivitaRepository.findAllByCodiceFiscale(pageable, sceltaProfiloParam.getCfUtenteLoggato());
            case "REG":
            case "REGP":
            case "REPP":
            case "DTD":
                return registroAttivitaRepository.findAllByIdEnteAndIdProgetto(pageable, sceltaProfiloParam.getIdEnte(), sceltaProfiloParam.getIdProgetto());
            default :
                throw new IllegalArgumentException();
        }
    }


}
