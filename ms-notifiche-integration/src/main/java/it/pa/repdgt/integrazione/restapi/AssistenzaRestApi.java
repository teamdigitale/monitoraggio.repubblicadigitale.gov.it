package it.pa.repdgt.integrazione.restapi;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.databind.ObjectMapper;

import it.pa.repdgt.integrazione.dto.AreaTematicaDTO;
import it.pa.repdgt.integrazione.request.AperturaTicketRequest;
import it.pa.repdgt.integrazione.request.AperturaTicketRequestZipped;
import it.pa.repdgt.integrazione.service.AssistenzaService;
import it.pa.repdgt.shared.data.BasicData;
import it.pa.repdgt.shared.exception.ZendeskException;
import it.pa.repdgt.shared.util.Utils;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping(path = "/assistenza")
public class AssistenzaRestApi {

    @Autowired
    private AssistenzaService assistenzaService;

    @Autowired
    private Utils utils;

    @Autowired
    private ObjectMapper objectMapper;

    @PostMapping("/apriTicket")
    public BasicData apriTicket(@RequestBody AperturaTicketRequestZipped inputData) throws ZendeskException, IOException {
        String inputDataString = utils.decompressGzip(inputData.getFileData());
        AperturaTicketRequest entity = objectMapper.readValue(inputDataString, AperturaTicketRequest.class);
        return assistenzaService.apriTicket(entity);
    }

    @PostMapping("/tematiche")
    public List<AreaTematicaDTO> getAreeTematiche() {
        return assistenzaService.getAreeTematiche();
    }
    
}
