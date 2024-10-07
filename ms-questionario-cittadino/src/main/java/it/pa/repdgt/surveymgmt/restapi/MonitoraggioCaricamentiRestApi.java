package it.pa.repdgt.surveymgmt.restapi;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import it.pa.repdgt.surveymgmt.dto.MonitoraggioCaricamentiDTO;
import it.pa.repdgt.surveymgmt.request.MonitoraggioCaricamentiRequest;
import it.pa.repdgt.surveymgmt.service.VMonitoraggioCaricamentiService;


@RestController
@RequestMapping(path = "/monitoraggiocaricamenti")
public class MonitoraggioCaricamentiRestApi {

    @Autowired
    private VMonitoraggioCaricamentiService vMonitoraggioCaricamentiService;

    @PostMapping(path = "/all")
    public MonitoraggioCaricamentiDTO getAll(@Valid @RequestBody MonitoraggioCaricamentiRequest request) {
        return this.vMonitoraggioCaricamentiService.findAllByFilters(request);
    }
    
}
