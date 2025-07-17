package it.pa.repdgt.integrazione.restapi;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import it.pa.repdgt.integrazione.dto.AreaTematicaDTO;
import it.pa.repdgt.integrazione.request.AperturaTicketRequest;
import it.pa.repdgt.integrazione.service.AssistenzaService;
import it.pa.repdgt.shared.data.BasicData;
import it.pa.repdgt.shared.exception.ZendeskException;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping(path = "/assistenza")
public class AssistenzaRestApi {

    @Autowired
    private AssistenzaService assistenzaService;

    @PostMapping("/apriTicket")
    public BasicData apriTicket(@RequestBody AperturaTicketRequest entity) throws ZendeskException {
        return assistenzaService.apriTicket(entity);
    }

    @PostMapping("/tematiche")
    public List<AreaTematicaDTO> getAreeTematiche() {
        return assistenzaService.getAreeTematiche();
    }
    
}
