package it.pa.repdgt.integrazione.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.zendesk.client.v2.Zendesk;
import org.zendesk.client.v2.model.CustomFieldValue;
import org.zendesk.client.v2.model.Status;
import org.zendesk.client.v2.model.Ticket;
import org.zendesk.client.v2.model.Ticket.Requester;

import it.pa.repdgt.integrazione.dto.AreaTematicaDTO;
import it.pa.repdgt.integrazione.entity.AssistenzaTematicheEntity;
import it.pa.repdgt.integrazione.repository.AssistenzaTematicheRepository;
import it.pa.repdgt.integrazione.request.AperturaTicketRequest;

@Service
public class AssistenzaService {
    
    @Autowired
    private AssistenzaTematicheRepository assistenzaTematicheRepository;

    @Autowired
    private Zendesk zendesk;

    public Boolean apriTicket(AperturaTicketRequest entity) {
        // Zendesk zd = new Zendesk.Builder("URL ZENDESK")
        //         .setUsername("email account zendesk /token")              //valori da inserire in file properties
        //         .setToken("token")
        //         .build();

        Ticket ticket = new Ticket();
        // Requester (richiedente)
        Requester requester = new Requester();
        requester.setEmail(entity.getEmail());
        requester.setName(entity.getNome());
        ticket.setRequester(requester);

        // Oggetto del ticket
        ticket.setSubject(entity.getOggetto());

        // Descrizione del ticket
        ticket.setDescription(entity.getDescrizione());

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
                entity.setRuoloUtente("Referente");
                break;
            case "DEG":
                entity.setRuoloUtente("Delegato");
                break;
            default:
                break;
        }

       // Custom fields(id dell'account di prova)
        List<CustomFieldValue> customFields = new ArrayList<>();
        customFields.add(new CustomFieldValue(27165897882130L, new String[] {entity.getAreaTematica()})); // Area tematica Facilita
        // customFields.add(new CustomFieldValue(27165780105618L, new String[] {})); // Assegnatario
        customFields.add(new CustomFieldValue(27165940260882L, new String[] {entity.getCodiceFiscale()})); // Codice fiscale
        // customFields.add(new CustomFieldValue(27165717838738L, new String[] {entity.getDescrizione()})); // Descrizione
        customFields.add(new CustomFieldValue(27165900361362L, new String[] {entity.getIdEnte() + " - " + entity.getNomeEnte()})); // Ente
        // customFields.add(new CustomFieldValue(27165717841170L, new String[] {"", ""})); // Gruppo
        customFields.add(new CustomFieldValue(27165948277266L, new String[] {entity.getPolicy()})); // Intervento
        customFields.add(new CustomFieldValue(27165949507474L, new String[] {entity.getNome()})); // Nominativo
        // customFields.add(new CustomFieldValue(27165717838610L, new String[] {entity.getOggetto()})); // Oggetto
        // customFields.add(new CustomFieldValue(27165780103954L, new String[] {"", ""})); // Priorità
        customFields.add(new CustomFieldValue(27165951464210L, new String[] {entity.getIdProgetto() + " - " + entity.getNomeProgetto()})); // Progetto
        customFields.add(new CustomFieldValue(27165968787090L, new String[] {entity.getRuoloUtente()})); // Ruolo Utente
        customFields.add(new CustomFieldValue(27165985958418L, new String[] {entity.getAltraAreaTematica()})); // Tematica altro
        ticket.setCustomFields(customFields);
        
        // Creazione ticket
        Ticket createdTicket = zendesk.createTicket(ticket);

        System.out.println("Ticket creato con ID: " + createdTicket.getId());

        // zd.close();
        return createdTicket != null; 
    }


    public List<AreaTematicaDTO> getAreeTematiche() {
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
