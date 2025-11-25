package it.pa.repdgt.integrazione.service;

import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Base64;
import java.util.Collections;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.zendesk.client.v2.Zendesk;
import org.zendesk.client.v2.model.Attachment.Upload;
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
import it.pa.repdgt.shared.data.BasicData;
import it.pa.repdgt.shared.data.BasicFileData;
import it.pa.repdgt.shared.exception.CodiceErroreEnum;
import it.pa.repdgt.shared.exception.ZendeskException;
import it.pa.repdgt.shared.restapi.RestTemplateWrapper;
import it.pa.repdgt.shared.util.Utils;
import lombok.extern.slf4j.Slf4j;
import java.util.Map;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;
import org.springframework.core.ParameterizedTypeReference;

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

    @Value("${zendesk.customfield.programma}")
    private Long programma;

    @Value("${zendesk.idModulo}")
    private Long idModulo;

    @Value("${ZENDESK_URL}")
    private String zendeskUrl;

    @Value("${ZENDESK_USERNAME}")
    private String zendeskUsername;

    @Value("${ZENDESK_TOKEN}") 
    private String zendeskToken;
    
    @Autowired
    private AssistenzaTematicheRepository assistenzaTematicheRepository;

    @Autowired
    private Zendesk zendesk;

    @Autowired
    private RestTemplateWrapper restTemplateWrapper;

    


    public BasicData apriTicket(AperturaTicketRequest entity) throws ZendeskException {
        try {
            log.info("----- Apertura ticket con i seguenti dati: " + entity.toString() + " -----");

            Ticket ticket = new Ticket();
            // Requester (richiedente)
            Requester requester = new Requester();
            requester.setEmail(entity.getEmail());
            requester.setName(entity.getNome());
            ticket.setTicketFormId(idModulo); // ID del modulo di richiesta
            ticket.setRequester(requester);

            // Descrizione del ticket
            String descrizione = entity.getDescrizione();
            descrizione = descrizione.replace("<ins>", "<u>").replace("</ins>", "</u>");
            ticket.setDescription(descrizione);

            Comment comment = new Comment();
            comment.setHtmlBody(descrizione);

            // Stato del ticket
            ticket.setStatus(Status.NEW);
            ticket.setSubject(entity.getOggetto());

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
                case "REPP":
                    entity.setRuoloUtente("referente_ente");
                    break;
                case "REG":
                    entity.setRuoloUtente("referente_programma");
                    break;
                case "REGP":
                    entity.setRuoloUtente("referente_progetto");
                    break;
                case "DEG":
                    entity.setRuoloUtente("delegato_programma");
                    break;
                case "DEPP":
                    entity.setRuoloUtente("delegato_ente");
                    break;
                case "DEGP":   
                    entity.setRuoloUtente("delegato_progetto");
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
            customFields.add(new CustomFieldValue(programma, new String[] {entity.getNomeProgramma()})); // Programma
            ticket.setCustomFields(customFields);
            ticket.setTags(Collections.singletonList("facilita"));

            
            if (entity.getAllegati() != null && !entity.getAllegati().isEmpty()) {
                List<Upload> uploads = new ArrayList<>();

                for (AllegatoDTO allegatoBase64 : entity.getAllegati()) {
                    try {
                        
                        byte[] fileBytes = Base64.getDecoder().decode(allegatoBase64.getData());
                        String nomeFile = allegatoBase64.getName();
                        String prefixNomeFile = nomeFile.split("\\.").length > 0 ? nomeFile.split("\\.")[0] : nomeFile;
                        BasicFileData fileProcessato = Utils.processAndClean(fileBytes, nomeFile, null, Utils.DEFAULT_MAX_SIZE, Utils.ALL_ALLOWED_EXT, prefixNomeFile);

                        // Upload su Zendesk
                        Upload upload = zendesk.createUpload(fileProcessato.getNomeFile(), fileProcessato.getFile());

                        uploads.add(upload);
                    } catch (Exception e) {
                        System.err.println("Errore nell'elaborazione di un allegato: " + e.getMessage());
                        // puoi loggare o saltare in base alla policy
                    }
                }

                if (!uploads.isEmpty()) {
                    // Comment comment = new Comment();
                    List<String> tokens = new ArrayList<>();
                    for (Upload upload : uploads) {
                        tokens.add(upload.getToken());
                    }
                    comment.setUploads(tokens);
                    //ticket.setComment(comment);
                }
            }

            // Creare il ticket temporaneamente per ottenere l'ID
            ticket.setComment(comment);
            ticket = zendesk.createTicket(ticket);
            Long ticketId = ticket.getId();

            // // Reimpostare il ticket con tutti i dati necessari
            // ticket = new Ticket();
            // ticket.setId(ticketId);
            // requester = new Requester();
            // requester.setEmail(entity.getEmail());
            // requester.setName(entity.getNome());
            // ticket.setTicketFormId(idModulo);
            // ticket.setRequester(requester);
            // ticket.setDescription(descrizione);
            // Oggetto del ticket con ID
           // ticket.setSubject(entity.getOggetto());//+ " (ticket n. " + ticketId + ")");
            // // Aggiornare il ticket con tutti i dati
            // Ticket finalTicket = zendesk.updateTicket(ticket);

            // Effettuiamo chiamata REST verso servizio zendesk per aggiornare solo il subject
            String authHeader = "Basic " + Base64.getEncoder().encodeToString((zendeskUsername + "/token:" + zendeskToken).getBytes(StandardCharsets.UTF_8));
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", authHeader);
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setAccept(Arrays.asList(MediaType.APPLICATION_JSON));
            String url = zendeskUrl + "api/v2/tickets/"+ticketId.toString()+".json";
            String nuovoSubject = entity.getOggetto() + " (ticket n. " + ticketId + ")";
            String jsonBody = "{\n" +
                    "  \"ticket\": {\n" +
                    "    \"subject\": \"" + nuovoSubject+"\"\n" +
                    "  }\n" +
                    "}";
            restTemplateWrapper.httpCall(url, HttpMethod.PUT, jsonBody, headers, new ParameterizedTypeReference<Map<String, Object>>() {});



            log.info("----- Ticket creato con ID: " + ticketId.toString() + "-----");
            return new BasicData(new BigDecimal(ticketId), nuovoSubject, "Ticket creato con successo con ID: " + ticketId);
        } catch (Exception e) {
            log.error("Errore durante la creazione/aggiornamento del ticket: ", e);
            throw new ZendeskException(e.getMessage(), CodiceErroreEnum.ZD00);
        }
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
