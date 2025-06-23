package it.pa.repdgt.integrazione.service;

import java.util.ArrayList;
import java.util.Base64;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.zendesk.client.v2.Zendesk;
import org.zendesk.client.v2.model.Attachment;
import org.zendesk.client.v2.model.Comment;
import org.zendesk.client.v2.model.CustomFieldValue;
import org.zendesk.client.v2.model.Status;
import org.zendesk.client.v2.model.Ticket;
import org.zendesk.client.v2.model.Ticket.Requester;

import it.pa.repdgt.integrazione.dto.AllegatoDTO;
import it.pa.repdgt.integrazione.dto.AreaTematicaDTO;
import it.pa.repdgt.integrazione.entity.AssistenzaTematicheEntity;
import it.pa.repdgt.integrazione.repository.AssistenzaTematicheRepository;
import it.pa.repdgt.integrazione.request.AperturaTicketRequest;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class AssistenzaService {

    @Value("${zendesk.customfield.areatematica}")
    private Long areaTematica;

    @Value("${zendesk.customfield.codicefiscale}")
    private Long codiceFiscale;

    @Value("${zendesk.customfield.ente}")
    private Long ente;

    @Value("${zendesk.customfield.policy}")
    private Long policy;

    @Value("${zendesk.customfield.nome}")
    private Long nome;

    @Value("${zendesk.customfield.progetto}")
    private Long progetto;

    @Value("${zendesk.customfield.ruoloutente}")
    private Long ruoloUtente;

    @Value("${zendesk.customfield.altraareatematica}")
    private Long altraAreaTematica;

    @Value("${zendesk.idModulo}")
    private Long idModulo;
    
    @Autowired
    private AssistenzaTematicheRepository assistenzaTematicheRepository;

    @Autowired
    private Zendesk zendesk;

    public Boolean apriTicket(AperturaTicketRequest entity) {

        log.info("----- Apertura ticket con i seguenti dati: " + entity.toString() + " -----");

        Ticket ticket = new Ticket();
        // Requester (richiedente)
        Requester requester = new Requester();
        requester.setEmail(entity.getEmail());
        requester.setName(entity.getNome());
        ticket.setTicketFormId(idModulo); // ID del modulo di richiesta
        ticket.setRequester(requester);

        // Oggetto del ticket
        ticket.setSubject(entity.getOggetto());

        // Descrizione del ticket
        String descrizionePulita = entity.getDescrizione().replaceAll("<[^>]*>", "");
        ticket.setDescription(descrizionePulita);

        // Stato del ticket
        ticket.setStatus(Status.NEW);

        if(entity.getPolicy().equals("RFD")){
            entity.setPolicy("rsfd");
        }else if(entity.getPolicy().equals("SCD")){
            entity.setPolicy("scd");
        }

        switch(entity.getRuoloUtente()) {
            case "FAC":
                entity.setRuoloUtente("facilitatore");
                break;
            case "VOL":
                entity.setRuoloUtente("volontario");
                break;
            case "REF":
            case "REPP":
            case "REG":
            case "REGP":
                entity.setRuoloUtente("Referente");
                break;
            case "DEG":
            case "DEPP":
            case "DEGP":
            case "DSCU":
                entity.setRuoloUtente("Delegato");
                break;
            default:
                break;
        }

       // Custom fields(id dell'account di prova)
        List<CustomFieldValue> customFields = new ArrayList<>();
        customFields.add(new CustomFieldValue(areaTematica, new String[] {entity.getAreaTematica()})); // Area tematica Facilita
        customFields.add(new CustomFieldValue(codiceFiscale, new String[] {entity.getCodiceFiscale()})); // Codice fiscale
        customFields.add(new CustomFieldValue(ente, new String[] {entity.getIdEnte() + " - " + entity.getNomeEnte()})); // Ente
        customFields.add(new CustomFieldValue(policy, new String[] {entity.getPolicy()})); // Intervento
        customFields.add(new CustomFieldValue(nome, new String[] {entity.getNome()})); // Nominativo
        if(entity.getIdProgetto() != null || entity.getNomeProgetto() != null) {    //controllo per evitare di aggiungere un campo null
            String idProgetto = entity.getIdProgetto() != null ? entity.getIdProgetto() : "";
            String nomeProgetto = entity.getNomeProgetto() != null ? entity.getNomeProgetto() : "";
            if(!idProgetto.isEmpty() || !nomeProgetto.isEmpty()) {
            customFields.add(new CustomFieldValue(progetto, new String[] {idProgetto + " - " + nomeProgetto})); // Progetto
            }
        }
        customFields.add(new CustomFieldValue(ruoloUtente, new String[] {entity.getRuoloUtente()})); // Ruolo Utente
        customFields.add(new CustomFieldValue(altraAreaTematica, new String[] {entity.getAltraAreaTematica()})); // Tematica altro
        ticket.setCustomFields(customFields);
        
        if (entity.getAllegati() != null && !entity.getAllegati().isEmpty()) {
            List<Attachment.Upload> uploads = new ArrayList<>();

            for (AllegatoDTO allegatoBase64 : entity.getAllegati()) {
                try {
                    byte[] fileBytes = Base64.getDecoder().decode(allegatoBase64.getData());

                    String nomeFile = allegatoBase64.getName();

                    // Upload su Zendesk
                    Attachment.Upload upload = zendesk.createUpload(nomeFile, fileBytes);

                    uploads.add(upload);
                } catch (Exception e) {
                    System.err.println("Errore nell'elaborazione di un allegato: " + e.getMessage());
                    // puoi loggare o saltare in base alla policy
                }
            }

            if (!uploads.isEmpty()) {
                Comment comment = new Comment();
                List<String> tokens = new ArrayList<>();
                for (Attachment.Upload upload : uploads) {
                    tokens.add(upload.getToken());
                }
                comment.setUploads(tokens);
                ticket.setComment(comment);
            }
        }

        

        // Creazione ticket
        Ticket createdTicket = zendesk.createTicket(ticket);

        log.info("----- Ticket creato con ID: " + createdTicket.getId() + "-----");
        // zd.close();
        return createdTicket != null; 
    }


    public List<AreaTematicaDTO> getAreeTematiche() {

        log.info("----- Recupero delle aree tematiche disponibili -----");

        List<AssistenzaTematicheEntity> listaTematiche = assistenzaTematicheRepository.findAll();

        List<AreaTematicaDTO> listaDTO = new ArrayList<>();
        for (AssistenzaTematicheEntity entity : listaTematiche) {
            AreaTematicaDTO dto = new AreaTematicaDTO();
            dto.setId(entity.getId());
            dto.setTag(entity.getTag());
            dto.setDescrizione(entity.getDescrizione());
            listaDTO.add(dto);
        }
        return listaDTO;
    }
}
