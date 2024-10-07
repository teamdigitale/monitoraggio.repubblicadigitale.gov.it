package it.pa.repdgt.surveymgmt.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import it.pa.repdgt.shared.entity.VMonitoraggioCaricamentiEntity;
import it.pa.repdgt.surveymgmt.dto.MonitoraggioCaricamentiDTO;
import it.pa.repdgt.surveymgmt.repository.VMonitoraggioCaricamentiRepository;
import it.pa.repdgt.surveymgmt.request.MonitoraggioCaricamentiRequest;

@Service
public class VMonitoraggioCaricamentiService {
    
    @Autowired
    private VMonitoraggioCaricamentiRepository vMonitoraggioCaricamentiRepository;

    public MonitoraggioCaricamentiDTO findAllByFilters(MonitoraggioCaricamentiRequest request) {
        
        List<VMonitoraggioCaricamentiEntity> result = this.vMonitoraggioCaricamentiRepository.findAll(request.getIntervento(), request.getIdProgetto(),
        request.getIdProgramma(), request.getIdEnti(), request.getDataInizio(), request.getDataFine());
        
        MonitoraggioCaricamentiDTO monitoraggioCaricamentiDTO = new MonitoraggioCaricamentiDTO();
        monitoraggioCaricamentiDTO.setMonitoraggioCaricamentiEntity(result);
        monitoraggioCaricamentiDTO.setNumeroEnti(result.stream().map(VMonitoraggioCaricamentiEntity::getIdEnte).distinct().count());
        monitoraggioCaricamentiDTO.setNumeroCaricamenti(result.stream().mapToLong(VMonitoraggioCaricamentiEntity::getNumCaricamenti).sum());
        monitoraggioCaricamentiDTO.setServiziCaricati(result.stream().mapToLong(VMonitoraggioCaricamentiEntity::getServiziAggiunti).sum());
        monitoraggioCaricamentiDTO.setCittadiniCaricati(result.stream().mapToLong(VMonitoraggioCaricamentiEntity::getCittadiniAssociati).sum());
        
        
        return monitoraggioCaricamentiDTO;
    }
}
