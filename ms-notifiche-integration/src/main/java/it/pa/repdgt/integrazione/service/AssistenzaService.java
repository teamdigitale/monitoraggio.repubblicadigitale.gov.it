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

    public Boolean apriTicket(AperturaTicketRequest entity) {
        Zendesk zd = new Zendesk.Builder("URL ZENDESK")
                .setUsername("email account zendesk /token")              //valori da inserire in file properties
                .setToken("token")
                .build();

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

       // Custom fields(modificare dopo aver ricevuto i campi personalizzati con relativi id)
        List<CustomFieldValue> customFields = new ArrayList<>();
        customFields.add(new CustomFieldValue(12345678901234L, new String[] {"", ""})); 
        ticket.setCustomFields(customFields);
        ticket.setTags(java.util.Arrays.asList("tag1", "tag2"));
        
        // Creazione ticket
        Ticket createdTicket = zd.createTicket(ticket);

        System.out.println("Ticket creato con ID: " + createdTicket.getId());

        // Internal note (commento privato)
        // Comment internalNote = new Comment("Questa è una nota privata (interna).");
        // internalNote.setPublic(false);

        // // Crea un ticket con ID e il commento privato da aggiungere
        // Ticket ticketUpdate = new Ticket();
        // ticketUpdate.setId(createdTicket.getId());
        // ticketUpdate.setComment(internalNote);
        // Ticket updatedTicket = zd.updateTicket(ticketUpdate);

        zd.close();
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
