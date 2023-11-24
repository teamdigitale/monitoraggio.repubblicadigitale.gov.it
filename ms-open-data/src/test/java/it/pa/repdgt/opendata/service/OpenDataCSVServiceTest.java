package it.pa.repdgt.opendata.service;

import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.bson.json.JsonObject;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;

import it.pa.repdgt.opendata.mongo.collection.SezioneQ3Collection;
import it.pa.repdgt.opendata.mongo.repository.SezioneQ3Repository;
import it.pa.repdgt.opendata.projection.OpenDataCittadinoProjection;
import it.pa.repdgt.opendata.repository.CittadinoRepository;
import lombok.Setter;

//@ExtendWith(MockitoExtension.class)
public class OpenDataCSVServiceTest {

	/*
	 * @Mock
	 * private CittadinoRepository cittadinoRepository;
	 * 
	 * @Mock
	 * private SezioneQ3Repository sezioneQ3Repository;
	 * 
	 * @Autowired
	 * 
	 * @InjectMocks
	 * private OpenDataCSVService openDataCSVService;
	 * 
	 * OpenDataCittadinoProjectionImplementation
	 * openDataCittadinoProjectionImplementation;
	 * List<OpenDataCittadinoProjection> listaOpenData;
	 * SezioneQ3Collection sezioneQ3Collection;
	 * JsonObject jsonObject;
	 * 
	 * @BeforeEach
	 * public void setUp() {
	 * jsonObject = new
	 * JsonObject("{ \"properties\": [ \"{'24': ['risposta a', 'risposta b']}\" ] }"
	 * );
	 * sezioneQ3Collection = new SezioneQ3Collection();
	 * sezioneQ3Collection.setId(UUID.randomUUID().toString());
	 * sezioneQ3Collection.setSezioneQ3Compilato(jsonObject);
	 * openDataCittadinoProjectionImplementation = new
	 * OpenDataCittadinoProjectionImplementation();
	 * openDataCittadinoProjectionImplementation.setIdTemplateQ3Compilato(
	 * sezioneQ3Collection.getId());
	 * listaOpenData = new ArrayList<>();
	 * listaOpenData.add(openDataCittadinoProjectionImplementation);
	 * }
	 * 
	 * // @Test
	 * public void getAllOpenDataCittadinoTest() {
	 * //test con jsonObject contenente 24
	 * when(this.cittadinoRepository.findAllCittadinoServizioSede()).thenReturn(
	 * listaOpenData);
	 * when(this.sezioneQ3Repository.findById(
	 * openDataCittadinoProjectionImplementation.getIdTemplateQ3Compilato())).
	 * thenReturn(Optional.of(sezioneQ3Collection));
	 * openDataCSVService.getAllOpenDataCittadino();
	 * }
	 * 
	 * // @Test
	 * public void getAllOpenDataCittadinoTest2() {
	 * // test con jsonObject contenente 25
	 * jsonObject = new
	 * JsonObject("{ \"properties\": [ \"{'25': ['risposta a', 'risposta b']}\" ] }"
	 * );
	 * sezioneQ3Collection.setSezioneQ3Compilato(jsonObject);
	 * when(this.cittadinoRepository.findAllCittadinoServizioSede()).thenReturn(
	 * listaOpenData);
	 * when(this.sezioneQ3Repository.findById(
	 * openDataCittadinoProjectionImplementation.getIdTemplateQ3Compilato()))
	 * .thenReturn(Optional.of(sezioneQ3Collection));
	 * openDataCSVService.getAllOpenDataCittadino();
	 * }
	 * 
	 * @Setter
	 * public class OpenDataCittadinoProjectionImplementation implements
	 * OpenDataCittadinoProjection {
	 * private String genere;
	 * private String titoloDiStudio;
	 * private String occupazione;
	 * private String policy;
	 * private String servizioId;
	 * private String tipologiaServizio;
	 * private String nomeServizio;
	 * private String IdTemplateQ3Compilato;
	 * private String sedeId;
	 * private String nomeSede;
	 * private String comuneSede;
	 * private String provinciaSede;
	 * private String regioneSede;
	 * private String capSede;
	 * private String idProgramma;
	 * private String idProgetto;
	 * private String dataFruizioneServizio;
	 * 
	 * @Override
	 * public String getGenere() {
	 * return genere;
	 * }
	 * 
	 * @Override
	 * public String getTitoloDiStudio() {
	 * return titoloDiStudio;
	 * }
	 * 
	 * @Override
	 * public String getOccupazione() {
	 * return occupazione;
	 * }
	 * 
	 * @Override
	 * public String getPolicy() {
	 * return policy;
	 * }
	 * 
	 * @Override
	 * public String getServizioId() {
	 * return servizioId;
	 * }
	 * 
	 * @Override
	 * public String getTipologiaServizio() {
	 * return tipologiaServizio;
	 * }
	 * 
	 * @Override
	 * public String getNomeServizio() {
	 * return nomeServizio;
	 * }
	 * 
	 * @Override
	 * public String getIdTemplateQ3Compilato() {
	 * return IdTemplateQ3Compilato;
	 * }
	 * 
	 * @Override
	 * public String getSedeId() {
	 * return sedeId;
	 * }
	 * 
	 * @Override
	 * public String getNomeSede() {
	 * return nomeSede;
	 * }
	 * 
	 * @Override
	 * public String getComuneSede() {
	 * return comuneSede;
	 * }
	 * 
	 * @Override
	 * public String getProvinciaSede() {
	 * return provinciaSede;
	 * }
	 * 
	 * @Override
	 * public String getRegioneSede() {
	 * return regioneSede;
	 * }
	 * 
	 * @Override
	 * public String getCapSede() {
	 * return capSede;
	 * }
	 * 
	 * @Override
	 * public String getIdProgramma() {
	 * return idProgramma;
	 * }
	 * 
	 * @Override
	 * public String getIdProgetto() {
	 * return idProgetto;
	 * }
	 * 
	 * @Override
	 * public String getDataFruizioneServizio() {
	 * return dataFruizioneServizio;
	 * }
	 * }
	 */
}
