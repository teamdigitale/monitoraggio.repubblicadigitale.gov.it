package it.pa.repdgt.ente.service;

import static org.mockito.Mockito.doAnswer;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;

import it.pa.repdgt.ente.mapper.IndirizzoSedeMapper;
import it.pa.repdgt.ente.mapper.SedeMapper;
import it.pa.repdgt.ente.repository.IndirizzoSedeFasciaOrariaRepository;
import it.pa.repdgt.ente.repository.SedeRepository;
import it.pa.repdgt.ente.request.NuovaSedeRequest;
import it.pa.repdgt.ente.request.NuovaSedeRequest.IndirizzoSedeRequest;
import it.pa.repdgt.shared.entity.IndirizzoSedeEntity;
import it.pa.repdgt.shared.entity.IndirizzoSedeFasciaOrariaEntity;
import it.pa.repdgt.shared.entity.SedeEntity;

@ExtendWith(MockitoExtension.class)
public class SedeServiceTest {
	
	@Mock
	private SedeRepository sedeRepository;
	@Mock
	private IndirizzoSedeFasciaOrariaRepository indirizzoSedeFasciaOrariaRepository;
	@Mock
	private IndirizzoSedeService indirizzoSedeService;
	@Mock
	private IndirizzoSedeFasciaOrariaService indirizzoSedeFasciaOrariaService;
	@Mock
	private SedeMapper sedeMapper;
	@Mock
	private IndirizzoSedeMapper indirizzoSedeMapper;

	@Autowired
	@InjectMocks
	private SedeService sedeService;
	
	SedeEntity sede1;
	List<SedeEntity> listaSedi;
	NuovaSedeRequest nuovaSedeRequest;
	IndirizzoSedeFasciaOrariaEntity indirizzoSedeFasciaOraria;
	IndirizzoSedeRequest indirizzoSedeRequest;
	List<IndirizzoSedeRequest> listaIndirizzi;
	IndirizzoSedeEntity indirizzoSedeEntity;
	
	@BeforeEach
	public void setUp() {
		sede1 = new SedeEntity();
		sede1.setId(1L);
		sede1.setNome("sede1");
		listaSedi = new ArrayList<>();
		listaSedi.add(sede1);
		nuovaSedeRequest = new NuovaSedeRequest();
		nuovaSedeRequest.setNome("sedeRequest");
		nuovaSedeRequest.setIsItinere(true);
		nuovaSedeRequest.setServiziErogati("facilitazione");
		indirizzoSedeRequest = new IndirizzoSedeRequest();
		indirizzoSedeRequest.setId(1L);
		indirizzoSedeFasciaOraria = new IndirizzoSedeFasciaOrariaEntity();
		indirizzoSedeFasciaOraria.setId(1L);
		indirizzoSedeFasciaOraria.setDomOrarioAperutura1("07:00");
		indirizzoSedeFasciaOraria.setDomOrarioChiusura1("13:00");
		indirizzoSedeFasciaOraria.setIdIndirizzoSede(indirizzoSedeRequest.getId());
		indirizzoSedeRequest.setFasceOrarieAperturaIndirizzoSede(indirizzoSedeFasciaOraria);
		listaIndirizzi = new ArrayList<>();
		listaIndirizzi.add(indirizzoSedeRequest);
		nuovaSedeRequest.setIndirizziSedeFasceOrarie(listaIndirizzi);
		indirizzoSedeEntity = new IndirizzoSedeEntity();
		indirizzoSedeEntity.setId(1L);
	}
	
	@Test
	public void cercaSedeByNomeSedeLikeTest() {
		when(this.sedeRepository.findSedeByNomeSedeLike(sede1.getNome())).thenReturn(listaSedi);
		sedeService.cercaSedeByNomeSedeLike(sede1.getNome());
	}
	
	@Test
	public void creaNuovaSedeTest() {
		when(this.sedeRepository.findSedeByNomeSede(nuovaSedeRequest.getNome())).thenReturn(Optional.empty());
		when(this.sedeMapper.toEntityFrom(nuovaSedeRequest)).thenReturn(sede1);
		when(this.sedeRepository.save(sede1)).thenReturn(sede1);
		when(this.indirizzoSedeMapper.toEntityFrom(indirizzoSedeRequest)).thenReturn(indirizzoSedeEntity);
		when(this.indirizzoSedeService.salvaIndirizzoSede(indirizzoSedeEntity)).thenReturn(indirizzoSedeEntity);
		doAnswer(invocation -> {
			return null;
		}).when(this.indirizzoSedeFasciaOrariaService).salvaIndirizzoSedeFasciaOraria(indirizzoSedeFasciaOraria);
		sedeService.creaNuovaSede(nuovaSedeRequest);
	}
}
