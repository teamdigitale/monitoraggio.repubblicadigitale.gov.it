package it.pa.repdgt.surveymgmt.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import it.pa.repdgt.shared.entity.VMonitoraggioCaricamentiEntity;
import it.pa.repdgt.surveymgmt.dto.MonitoraggioCaricamentiDTO;
import it.pa.repdgt.surveymgmt.repository.VMonitoraggioCaricamentiRepository;
import it.pa.repdgt.surveymgmt.request.MonitoraggioCaricamentiRequest;
import org.springframework.data.domain.Sort;

@Service
public class VMonitoraggioCaricamentiService {
    
    @Autowired
    private VMonitoraggioCaricamentiRepository vMonitoraggioCaricamentiRepository;

    public MonitoraggioCaricamentiDTO findAllByFilters(MonitoraggioCaricamentiRequest request) {
        
        Pageable paginazione = createPageable(request.getCurrPage(),request.getPageSize(), request.getOrderBy(), request.getDirection());
        Page<VMonitoraggioCaricamentiEntity> resultPaginate = this.vMonitoraggioCaricamentiRepository.findAllPaginate(request.getIntervento(), request.getIdProgetto(),
        request.getIdProgramma(), request.getIdEnti(), request.getDataInizio(), request.getDataFine(), paginazione);

        List<VMonitoraggioCaricamentiEntity> result = this.vMonitoraggioCaricamentiRepository.findAll(request.getIntervento(), request.getIdProgetto(),
        request.getIdProgramma(), request.getIdEnti(), request.getDataInizio(), request.getDataFine());
        
        MonitoraggioCaricamentiDTO monitoraggioCaricamentiDTO = new MonitoraggioCaricamentiDTO();
        monitoraggioCaricamentiDTO.setMonitoraggioCaricamentiEntity(resultPaginate.getContent());
        monitoraggioCaricamentiDTO.setNumeroEnti(result.stream().map(VMonitoraggioCaricamentiEntity::getIdEnte).distinct().count());
        monitoraggioCaricamentiDTO.setNumeroCaricamenti(result.stream().mapToLong(VMonitoraggioCaricamentiEntity::getNumCaricamenti).sum());
        monitoraggioCaricamentiDTO.setServiziCaricati(result.stream().mapToLong(VMonitoraggioCaricamentiEntity::getServiziAggiunti).sum());
        monitoraggioCaricamentiDTO.setCittadiniCaricati(result.stream().mapToLong(VMonitoraggioCaricamentiEntity::getCittadiniAssociati).sum());
        monitoraggioCaricamentiDTO.setNumeroPagine(resultPaginate.getTotalPages());
        monitoraggioCaricamentiDTO.setNumeroTotaleElementi(resultPaginate.getTotalElements());
        
        return monitoraggioCaricamentiDTO;
    }

    private Pageable createPageable(int page, int pageSize, String sort, String sortOrder) {
        Sort.Direction direction = Sort.Direction.fromString(sortOrder);
        return PageRequest.of(page, pageSize, Sort.by(direction, sort));
    }
}
