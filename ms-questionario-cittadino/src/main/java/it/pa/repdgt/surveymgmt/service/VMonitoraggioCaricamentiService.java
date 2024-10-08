package it.pa.repdgt.surveymgmt.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
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
        
        Pageable paginazione = PageRequest.of(request.getCurrPage(), request.getPageSize());
        Page<VMonitoraggioCaricamentiEntity> result = this.vMonitoraggioCaricamentiRepository.findAll(request.getIntervento(), request.getIdProgetto(),
        request.getIdProgramma(), request.getIdEnti(), request.getDataInizio(), request.getDataFine(), paginazione);
        
        MonitoraggioCaricamentiDTO monitoraggioCaricamentiDTO = new MonitoraggioCaricamentiDTO();
        monitoraggioCaricamentiDTO.setMonitoraggioCaricamentiEntity(result.getContent());
        monitoraggioCaricamentiDTO.setNumeroEnti(result.stream().map(VMonitoraggioCaricamentiEntity::getIdEnte).distinct().count());
        monitoraggioCaricamentiDTO.setNumeroCaricamenti(result.stream().mapToLong(VMonitoraggioCaricamentiEntity::getNumCaricamenti).sum());
        monitoraggioCaricamentiDTO.setServiziCaricati(result.stream().mapToLong(VMonitoraggioCaricamentiEntity::getServiziAggiunti).sum());
        monitoraggioCaricamentiDTO.setCittadiniCaricati(result.stream().mapToLong(VMonitoraggioCaricamentiEntity::getCittadiniAssociati).sum());
        monitoraggioCaricamentiDTO.setNumeroPagine(result.getTotalPages());
        monitoraggioCaricamentiDTO.setNumeroTotaleElementi(result.getTotalElements());
        
        return monitoraggioCaricamentiDTO;
    }
}
