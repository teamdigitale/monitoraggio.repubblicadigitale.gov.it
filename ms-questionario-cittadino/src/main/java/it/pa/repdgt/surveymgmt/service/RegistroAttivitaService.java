package it.pa.repdgt.surveymgmt.service;

import com.amazonaws.HttpMethod;
import it.pa.repdgt.shared.entity.RegistroAttivitaEntity;
import it.pa.repdgt.shared.entity.UtenteEntity;
import it.pa.repdgt.shared.restapi.param.SceltaProfiloParam;
import it.pa.repdgt.surveymgmt.components.S3StorageService;
import it.pa.repdgt.surveymgmt.configurations.S3PropertiesConfig;
import it.pa.repdgt.surveymgmt.repository.EnteRepository;
import it.pa.repdgt.surveymgmt.repository.ProgettoRepository;
import it.pa.repdgt.surveymgmt.repository.RegistroAttivitaRepository;
import it.pa.repdgt.surveymgmt.repository.UtenteRepository;
import lombok.NonNull;
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
    private final S3StorageService s3StorageService;
    private final S3PropertiesConfig s3PropertiesConfig;

    public RegistroAttivitaEntity saveRegistroAttivita(RegistroAttivitaEntity registroAttivitaEntity) {
        if (!enteRepository.existsById(registroAttivitaEntity.getIdEnte())
                || !progettoRepository.existsById(registroAttivitaEntity.getIdProgetto()))
            throw new IllegalArgumentException();
        String cfUtente = registroAttivitaEntity.getOperatore();
        registroAttivitaEntity.setCodiceFiscale(cfUtente);
        registroAttivitaEntity.setOperatore(getNomeCognomeOperatore(registroAttivitaEntity.getOperatore()));
        return registroAttivitaRepository.save(registroAttivitaEntity);
    }

    private String getNomeCognomeOperatore(String operatore) {
        Optional<UtenteEntity> utenteOpt = utenteRepository.findByCodiceFiscale(operatore);
        if (!utenteOpt.isPresent()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
        }
        UtenteEntity utente = utenteOpt.get();
        return utente.getNome() + " " + utente.getCognome();
    }

    public Page<RegistroAttivitaEntity> getRegistroAttivita(Integer page, Integer size,
            SceltaProfiloParam sceltaProfiloParam) {
        Sort sort = Sort.by(Sort.Direction.DESC, "dataInserimento");
        Pageable pageable = PageRequest.of(page, size, sort);
        switch (sceltaProfiloParam.getCodiceRuoloUtenteLoggato()) {
            case "FAC":
                return registroAttivitaRepository.findAllByCodiceFiscale(pageable,
                        sceltaProfiloParam.getCfUtenteLoggato());
            case "REG":
            case "REGP":
            case "REPP":
            case "DTD":
                return registroAttivitaRepository.findAllByIdEnteAndIdProgetto(pageable, sceltaProfiloParam.getIdEnte(),
                        sceltaProfiloParam.getIdProgetto());
            default:
                throw new IllegalArgumentException();
        }
    }

    public String generateDownloadPresignedUrl(Long registroAttivitaId) {
        RegistroAttivitaEntity registroAttivita = getRegistroAttivitaById(registroAttivitaId);
        String fileName = generateS3AttachmentPath(registroAttivitaId, registroAttivita.getFileName());
        return s3StorageService.generateUrl(fileName, HttpMethod.GET, s3PropertiesConfig.getBucketName());
    }

    public String generateUploadPresignedUrl(Long registroAttivitaId, String fileName) {
        String filePath = generateS3AttachmentPath(registroAttivitaId, fileName);
        return s3StorageService.save(filePath, s3PropertiesConfig.getBucketName());
    }

    private String generateS3AttachmentPath(Long registroAttivitaId, @NonNull String fileName) {
        return String.format("%d/%s", registroAttivitaId, fileName);
    }

    public void update(Long registroAttivitaId, boolean isFileUpdated) {
        if (!isFileUpdated) {
            registroAttivitaRepository.deleteById(registroAttivitaId);
            return;
        }
        RegistroAttivitaEntity registroAttivita = getRegistroAttivitaById(registroAttivitaId);
        registroAttivita.setFileUpdated(isFileUpdated);
        registroAttivitaRepository.save(registroAttivita);
    }

    private RegistroAttivitaEntity getRegistroAttivitaById(Long registroAttivitaId) {
        Optional<RegistroAttivitaEntity> registroAttivitaOptional = registroAttivitaRepository
                .findById(registroAttivitaId);
        if (!registroAttivitaOptional.isPresent()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
        return registroAttivitaOptional.get();
    }
}
