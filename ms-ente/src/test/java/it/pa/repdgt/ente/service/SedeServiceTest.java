package it.pa.repdgt.ente.service;

import static org.assertj.core.api.Assertions.assertThatExceptionOfType;
import static org.mockito.Mockito.doAnswer;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;

import it.pa.repdgt.ente.exception.ResourceNotFoundException;
import it.pa.repdgt.ente.exception.SedeException;
import it.pa.repdgt.ente.mapper.IndirizzoSedeMapper;
import it.pa.repdgt.ente.mapper.SedeMapper;
import it.pa.repdgt.ente.repository.IndirizzoSedeFasciaOrariaRepository;
import it.pa.repdgt.ente.repository.SedeRepository;
import it.pa.repdgt.ente.request.NuovaSedeRequest;
import it.pa.repdgt.ente.request.NuovaSedeRequest.IndirizzoSedeRequest;
import it.pa.repdgt.shared.entity.EnteEntity;
import it.pa.repdgt.shared.entity.IndirizzoSedeEntity;
import it.pa.repdgt.shared.entity.IndirizzoSedeFasciaOrariaEntity;
import it.pa.repdgt.shared.entity.ProgettoEntity;
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
	private EnteSedeProgettoService enteSedeProgettoService;
	@Mock
	private ProgettoService progettoService;
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
	ProgettoEntity progetto1;
	EnteEntity ente1;
	
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
		indirizzoSedeEntity.setDataOraCreazione(new Date());
		progetto1 = new ProgettoEntity();
		progetto1.setId(1L);
		ente1 = new EnteEntity();
		ente1.setId(1L);
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
	
	@Test
	public void creaNuovaSedeKOTest() {
		when(this.sedeRepository.findSedeByNomeSede(nuovaSedeRequest.getNome())).thenReturn(Optional.of(sede1));
		Assertions.assertThrows(SedeException.class, () -> 	sedeService.creaNuovaSede(nuovaSedeRequest));
		assertThatExceptionOfType(SedeException.class);
	}
	
	@Test
	public void aggiornaSedeTest() {
		//test con ID indirizzo diverso da null, quindi va in aggiornamento
		when(this.sedeRepository.existsById(sede1.getId())).thenReturn(true);
		when(this.sedeRepository.findById(sede1.getId())).thenReturn(Optional.of(sede1));
		when(this.indirizzoSedeMapper.toEntityFrom(indirizzoSedeRequest)).thenReturn(indirizzoSedeEntity);
		when(this.indirizzoSedeService.getIndirizzoSedeById(indirizzoSedeRequest.getId())).thenReturn(indirizzoSedeEntity);
		sedeService.aggiornaSede(sede1.getId(), nuovaSedeRequest);
	}
	
	@Test
	public void aggiornaSedeTest2() {
		//test con ID indirizzo a null, quindi va in creazione
		indirizzoSedeRequest.setId(null);
		when(this.sedeRepository.existsById(sede1.getId())).thenReturn(true);
		when(this.sedeRepository.findById(sede1.getId())).thenReturn(Optional.of(sede1));
		when(this.indirizzoSedeMapper.toEntityFrom(indirizzoSedeRequest)).thenReturn(indirizzoSedeEntity);
		when(this.indirizzoSedeService.salvaIndirizzoSede(indirizzoSedeEntity)).thenReturn(indirizzoSedeEntity);
		sedeService.aggiornaSede(sede1.getId(), nuovaSedeRequest);
	}
	
	@Test
	public void aggiornaSedeTest3() {
		//test con campo "cancellato" a TRUE, quindi va in elimina l'indirizzo
		indirizzoSedeRequest.setCancellato(true);
		when(this.sedeRepository.existsById(sede1.getId())).thenReturn(true);
		when(this.sedeRepository.findById(sede1.getId())).thenReturn(Optional.of(sede1));
		sedeService.aggiornaSede(sede1.getId(), nuovaSedeRequest);
	}
	
	@Test
	public void aggiornaSedeKOTest() {
		//test KO per Sede inesistente
		when(this.sedeRepository.existsById(sede1.getId())).thenReturn(false);
		Assertions.assertThrows(SedeException.class, () -> 	sedeService.aggiornaSede(sede1.getId(), nuovaSedeRequest));
		assertThatExceptionOfType(SedeException.class);
		
		//test KO per Nome Sede già presente
		when(this.sedeRepository.existsById(sede1.getId())).thenReturn(true);
		when(this.sedeRepository.findSedeByNomeSedeAndNotIdSede(nuovaSedeRequest.getNome(), sede1.getId())).thenReturn(Optional.of(sede1));
		Assertions.assertThrows(SedeException.class, () -> 	sedeService.aggiornaSede(sede1.getId(), nuovaSedeRequest));
		assertThatExceptionOfType(SedeException.class);
	}
	
	@Test
	public void esisteSedeByIdTest() {
		when(this.sedeRepository.findById(sede1.getId())).thenReturn(Optional.of(sede1));
		sedeService.esisteSedeById(sede1.getId());
	}
	
	@Test
	public void getSediEnteByIdProgettoAndIdEnteTest() {
		when(this.sedeRepository.findSediEnteByIdProgettoAndIdEnte(progetto1.getId(), ente1.getId())).thenReturn(listaSedi);
		sedeService.getSediEnteByIdProgettoAndIdEnte(progetto1.getId(), ente1.getId());
	}
	
	@Test
	public void getStatoSedeByIdProgettoAndIdSedeAndIdEnteTest() {
		when(this.sedeRepository.findStatoSedeByIdProgettoAndIdSedeAndIdEnte(progetto1.getId(), sede1.getId(), ente1.getId())).thenReturn("ATTIVO");
		sedeService.getStatoSedeByIdProgettoAndIdSedeAndIdEnte(progetto1.getId(), sede1.getId(), ente1.getId());
	}
	
	@Test
	public void aggiornaFasceOrarieTest() {
		when(this.indirizzoSedeFasciaOrariaService.getFasceOrarieByIdIndirizzoSede(indirizzoSedeEntity.getId())).thenReturn(Optional.of(indirizzoSedeFasciaOraria));
		sedeService.aggiornaFasceOrarie(indirizzoSedeRequest, indirizzoSedeEntity);
		}
	
	@Test
	public void cancellaFasceOrarieByIdIndirizzoTest() {
		when(this.indirizzoSedeFasciaOrariaService.getFasceOrarieEntityByIdIndirizzoSede(indirizzoSedeRequest.getId())).thenReturn(Optional.of(indirizzoSedeFasciaOraria));
		sedeService.cancellaFasceOrarieByIdIndirizzo(indirizzoSedeRequest.getId());
	}
	
	@Test
	public void getSedeByIdKOTest() {
		when(this.sedeRepository.findById(sede1.getId())).thenReturn(Optional.empty());
		Assertions.assertThrows(ResourceNotFoundException.class, () -> 	sedeService.getSedeById(sede1.getId()));
		assertThatExceptionOfType(ResourceNotFoundException.class);
	}
}
