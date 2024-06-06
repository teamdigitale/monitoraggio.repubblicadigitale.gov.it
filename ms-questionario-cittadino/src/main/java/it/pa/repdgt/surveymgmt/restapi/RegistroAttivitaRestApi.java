package it.pa.repdgt.surveymgmt.restapi;

import it.pa.repdgt.shared.entity.RegistroAttivitaEntity;
import it.pa.repdgt.shared.restapi.param.SceltaProfiloParam;
import it.pa.repdgt.surveymgmt.service.RegistroAttivitaService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import javax.validation.Valid;

@RestController
@RequiredArgsConstructor
@RequestMapping(path = "/registroAttivita")
public class RegistroAttivitaRestApi {

    private final RegistroAttivitaService registroAttivitaService;

    @PostMapping()
    public RegistroAttivitaEntity saveRegistroAttivita(
            @RequestBody @Valid RegistroAttivitaEntity registroAttivitaEntity) {
        try {
            return registroAttivitaService.saveRegistroAttivita(registroAttivitaEntity);
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Sede non trovata");
        }
    }

    @PostMapping(path = "/search")
    public Page<RegistroAttivitaEntity> getRegistroAttivita(
            @RequestParam(name = "page", defaultValue = "0") Integer page,
            @RequestParam(name = "size", defaultValue = "10") Integer size,
            @RequestBody @Valid SceltaProfiloParam sceltaProfiloParam) {
        try {
            return registroAttivitaService.getRegistroAttivita(page, size, sceltaProfiloParam);
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED,
                    "Non hai i permessi per accedere a questa pagina");
        }
    }

    @PutMapping(value = "{registroAttivitaId}/generateDownloadPu", produces = "text/plain")
    public String generateAttachmentDownloadPU(
            @PathVariable Long registroAttivitaId) {
        return registroAttivitaService.generateDownloadPresignedUrl(registroAttivitaId);
    }

    @PutMapping(value = "{registroAttivitaId}/generateUploadPu", produces = "text/plain")
    public String generateAttachmentUploadPU(
            @PathVariable Long registroAttivitaId,
            @RequestParam String fileName) {
        return registroAttivitaService.generateUploadPresignedUrl(registroAttivitaId, fileName);
    }

    @PatchMapping("{registroAttivitaId}")
    public ResponseEntity<Void> updateRegistroAttivita(@PathVariable Long registroAttivitaId,
            @RequestBody boolean isFileUpdated) {
        registroAttivitaService.update(registroAttivitaId, isFileUpdated);
        return ResponseEntity.ok().build();
    }
}
