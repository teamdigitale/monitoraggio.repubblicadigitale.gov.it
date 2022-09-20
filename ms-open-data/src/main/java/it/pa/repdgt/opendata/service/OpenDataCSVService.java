package it.pa.repdgt.opendata.service;

import java.util.Iterator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.bson.json.JsonObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import it.pa.repdgt.opendata.bean.OpenDataCittadinoCSVBean;
import it.pa.repdgt.opendata.mongo.collection.SezioneQ3Collection;
import it.pa.repdgt.opendata.mongo.repository.SezioneQ3Repository;
import it.pa.repdgt.opendata.repository.CittadinoRepository;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class OpenDataCSVService {
	@Autowired
	private CittadinoRepository cittadinoRepository;
	@Autowired
	private SezioneQ3Repository sezioneQ3Repository;

	public List<OpenDataCittadinoCSVBean> getAllOpenDataCittadino() {
		List<OpenDataCittadinoCSVBean> openDataCittadinoList =  this.cittadinoRepository
			.findAllCittadinoServizioSede()
			.stream()
			.map(openDataCittadino -> {
				OpenDataCittadinoCSVBean openDataCittadinoCSVBean = new OpenDataCittadinoCSVBean();
				openDataCittadinoCSVBean.setOpenDataCittadinoProjection(openDataCittadino);
				
				ObjectMapper mapper = new ObjectMapper();
				mapper.configure(JsonParser.Feature.ALLOW_SINGLE_QUOTES, true);
				Optional<SezioneQ3Collection> sezioneQ3 = this.sezioneQ3Repository.findById(openDataCittadino.getIdTemplateQ3Compilato());
				if(sezioneQ3.isPresent()) {
					JsonObject sezioneQ3Compilato = (JsonObject) (sezioneQ3.get().getSezioneQ3Compilato());
					log.info("sezioneQ3={}", sezioneQ3Compilato.getJson());
					try {
						JsonNode sezioneQ3CompilatoNode = mapper.readTree(sezioneQ3Compilato.getJson());
						JsonNode propertiesNode = sezioneQ3CompilatoNode.get("properties");
						Iterator<JsonNode> it = propertiesNode.elements();
						while(it.hasNext()) {
							JsonNode domandaRisposta = (JsonNode) it.next();
							if(domandaRisposta.toString().contains("24")) {
								String risposta = domandaRisposta.toString().split(":")[1].replace("[", "").replace("]", "").replace("'", "").replace("}", "").replace("\"", "");
								openDataCittadinoCSVBean.setCompetenzeTrattate(risposta);
							}
							if(domandaRisposta.toString().contains("25")) {
								String risposta = domandaRisposta.toString().split(":")[1].replace("[", "").replace("]", "").replace("'", "").replace("}", "").replace("\"", "");
								openDataCittadinoCSVBean.setAmbitoServizi(risposta);
							}
						}
					} catch (JsonProcessingException ex) {
						log.error("{}", ex);
						throw new RuntimeException("errore nella creazione del csv open data cittadini", ex);
					}
				}
				return openDataCittadinoCSVBean;
			})
			.collect(Collectors.toList());
			
		return openDataCittadinoList;
	}
	
	public class SezioneQ3Compilato{
		
	}

}