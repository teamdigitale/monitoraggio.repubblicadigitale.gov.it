package it.pa.repdgt.surveymgmt.service.utils;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

import javax.validation.constraints.NotNull;

import org.apache.commons.collections4.CollectionUtils;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import it.pa.repdgt.shared.annotation.LogExecutionTime;
import it.pa.repdgt.shared.annotation.LogMethod;
import it.pa.repdgt.shared.constants.RuoliUtentiConstants;
import it.pa.repdgt.shared.entity.EnteSedeProgettoFacilitatoreEntity;
import it.pa.repdgt.shared.entity.ServizioEntity;
import it.pa.repdgt.shared.entity.key.EnteSedeProgettoFacilitatoreKey;
import it.pa.repdgt.shared.entityenum.StatoEnum;
import it.pa.repdgt.shared.exception.CodiceErroreEnum;
import it.pa.repdgt.shared.restapi.param.SceltaProfiloParam;
import it.pa.repdgt.surveymgmt.collection.SezioneQ3Collection;
import it.pa.repdgt.surveymgmt.constants.NoteCSV;
import it.pa.repdgt.surveymgmt.exception.ResourceNotFoundException;
import it.pa.repdgt.surveymgmt.exception.ServizioException;
import it.pa.repdgt.surveymgmt.mapper.ServizioMapper;
import it.pa.repdgt.surveymgmt.mongo.repository.QuestionarioCompilatoMongoRepository;
import it.pa.repdgt.surveymgmt.mongo.repository.SezioneQ3Respository;
import it.pa.repdgt.surveymgmt.repository.EnteSedeProgettoFacilitatoreRepository;
import it.pa.repdgt.surveymgmt.repository.QuestionarioCompilatoRepository;
import it.pa.repdgt.surveymgmt.repository.ServizioSqlRepository;
import it.pa.repdgt.surveymgmt.repository.ServizioXCittadinoRepository;
import it.pa.repdgt.surveymgmt.repository.TipologiaServizioRepository;
import it.pa.repdgt.surveymgmt.request.ServizioRequest;
import it.pa.repdgt.surveymgmt.service.QuestionarioTemplateService;
import it.pa.repdgt.surveymgmt.service.ServizioService;
import it.pa.repdgt.surveymgmt.service.ServizioSqlService;

/**
 * Base di {@link ServizioService}: raccoglie le dipendenze iniettate e i
 * metodi helper riusati dalle operazioni principali (controlli di validita',
 * costruzione collection MongoDB, verifiche di autorizzazione/eliminabilita').
 */
public class ServizioBasicService {

	@Autowired
	protected ServizioMapper servizioMapper;
	@Autowired
	protected UtenteService utenteService;
	@Autowired
	protected SezioneQ3Respository sezioneQ3Repository;
	@Autowired
	protected ServizioSqlService servizioSQLService;
	@Autowired
	protected ProgettoService progettoService;
	@Autowired
	protected EnteService enteService;
	@Autowired
	protected SedeService sedeService;
	@Autowired
	protected QuestionarioTemplateService questionarioTemplateService;
	@Autowired
	protected QuestionarioTemplateSqlService questionarioTemplateSqlService;
	@Autowired
	protected TipologiaServizioRepository tipologiaServizioRepository;
	@Autowired
	protected ServizioXCittadinoRepository servizioXCittadinoRepository;
	@Autowired
	protected QuestionarioCompilatoRepository questionarioCompilatoRepository;
	@Autowired
	protected QuestionarioCompilatoMongoRepository questionarioCompilatoMongoRepository;
	@Autowired
	protected EnteSedeProgettoFacilitatoreRepository enteSedeProgettoFacilitatoreRepository;
	@Autowired
	protected ServizioSqlRepository servizioSqlRepository;
	@Autowired
	protected SezioneQ3Respository sezioneQ3Respository;

	protected ObjectMapper objectMapper = new ObjectMapper();

	/**
	 * Verifica che la richiesta contenga una sola tipologia di servizio: se ne
	 * presenta piu' di una lancia ServizioException con la nota dedicata, riusata
	 * dal caricamento massivo per popolare il CSV di scarti.
	 */
	protected void checkTipologiaServizioSingola(ServizioRequest servizioRequest) {
		List<String> tipologie = servizioRequest.getListaTipologiaServizi();
		if (tipologie != null && tipologie.size() > 1) {
			throw new ServizioException(NoteCSV.NOTE_TIPO_SERVIZIO_MULTIPLO, CodiceErroreEnum.S12);
		}
	}

	/**
	 * Verifica che non esista gia' un servizio con gli stessi dati identificativi
	 * (data, durata, tipologie, sede/ente/progetto/facilitatore, nome) e medesime
	 * descrizioni nei nodi rilevanti della sezione Q3.
	 */
	protected void checkUnicitaServizio(final ServizioRequest servizioRequest) throws JSONException {
		EnteSedeProgettoFacilitatoreEntity enteSedeProgettoFacilitatore = enteSedeProgettoFacilitatoreRepository
				.existsByChiave(
						servizioRequest.getCfUtenteLoggato(),
						servizioRequest.getIdEnteServizio(),
						servizioRequest.getIdProgetto(),
						servizioRequest.getIdSedeServizio());
		if (enteSedeProgettoFacilitatore == null) {
			throw new ResourceNotFoundException(CodiceErroreEnum.C01.getDescrizioneErrore(),
					CodiceErroreEnum.C01);
		}

		List<ServizioEntity> listaServizi = getServizioByDatiControllo(servizioRequest, enteSedeProgettoFacilitatore.getId());
		if(CollectionUtils.isNotEmpty(listaServizi)){

			JSONObject rootNodeNuovoServizio = new JSONObject(servizioRequest.getSezioneQuestionarioCompilatoQ3());
			for (ServizioEntity servizioRecuperato : listaServizi) {
				Optional<SezioneQ3Collection> optSezioneQ3Collection = sezioneQ3Respository
						.findById(servizioRecuperato.getIdTemplateCompilatoQ3());
				if (optSezioneQ3Collection.isPresent()) {
					JsonNode nodeActual = objectMapper.valueToTree(optSezioneQ3Collection.get().getSezioneQ3Compilato());
					JsonNode pathJson = nodeActual.path("json");
					JSONObject jsonObjectActual = new JSONObject(pathJson.asText());
					boolean isStessoServizio = true;
					if (!recuperaDescrizioneDaJson(jsonObjectActual, 6).equals(recuperaDescrizioneDaJson(rootNodeNuovoServizio, 6))) {
						isStessoServizio = false;
					}
					if (!recuperaDescrizioneDaJson(jsonObjectActual, 5).equals(recuperaDescrizioneDaJson(rootNodeNuovoServizio, 5))) {
						isStessoServizio = false;
					}
					if (!recuperaDescrizioneDaJson(jsonObjectActual, 4).equals(recuperaDescrizioneDaJson(rootNodeNuovoServizio, 4))) {
						isStessoServizio = false;
					}
					if (isStessoServizio) {
						final String messaggioErrore = "Il servizio che vuoi creare riporta gli stessi dati di un servizio già esistente. Per creare una nuovo servizio, assicurati di differenziare almeno un’informazione, per esempio il nome o la descrizione";
						throw new ServizioException(messaggioErrore, CodiceErroreEnum.S10);
					}
				}
			}
		}
	}

	/**
	 * Recupera i servizi che condividono con la richiesta data, durata, tipologie
	 * e nome, all'interno dello stesso ente-sede-progetto-facilitatore.
	 */
	protected List<ServizioEntity> getServizioByDatiControllo(ServizioRequest servizioRequest,
			EnteSedeProgettoFacilitatoreKey enteSedeProgettoFacilitatoreKey) {
		Optional<List<ServizioEntity>> servizioOpt = servizioSqlRepository
				.findAllByDataServizioAndDurataServizioAndTipologiaServizioAndIdEnteSedeProgettoFacilitatoreAndNome(
						servizioRequest.getDataServizio(),
						servizioRequest.getDurataServizio(),
						String.join(", ", servizioRequest.getListaTipologiaServizi()), enteSedeProgettoFacilitatoreKey,
						servizioRequest.getNomeServizio());
		if (servizioOpt.isPresent() && !servizioOpt.get().isEmpty()) {
			List<ServizioEntity> listaServizi = servizioOpt.get();
			return listaServizi;
		}
		return new ArrayList<>();
	}

	/**
	 * Estrae l'insieme delle descrizioni testuali presenti nell'oggetto JSON
	 * all'indice indicato di "properties", trattandolo come array di stringhe.
	 */
	protected Set<String> recuperaDescrizioneDaJson(JSONObject jsonObject, int index) {

		JSONArray properties = jsonObject.getJSONArray("properties");
		JSONObject ultimoOggetto = properties.getJSONObject(index);
		String ultimaChiave = ultimoOggetto.keys().next();
		JSONArray ultimoValoreArray = ultimoOggetto.getJSONArray(ultimaChiave);
		Set<String> result = IntStream.range(0, ultimoValoreArray.length())
				.mapToObj(ultimoValoreArray::getString)
				.collect(Collectors.toSet());
		return result;

	}

	/**
	 * Costruisce la SezioneQ3Collection da persistere su MongoDB a partire dalla
	 * richiesta, valorizzando id (UUID) e timestamp di creazione/aggiornamento.
	 */
	@LogMethod
	@LogExecutionTime
	public SezioneQ3Collection creaSezioneQ3(@NotNull final ServizioRequest servizioRequest) {
		final SezioneQ3Collection sezioneQ3Collection = this.servizioMapper.toCollectionFrom(servizioRequest);
		sezioneQ3Collection.setId(UUID.randomUUID().toString());
		sezioneQ3Collection.setDataOraCreazione(new Date());
		sezioneQ3Collection.setDataOraUltimoAggiornamento(sezioneQ3Collection.getDataOraCreazione());
		return sezioneQ3Collection;
	}

	/**
	 * Determina se l'utente profilato puo' accedere al dettaglio o eliminare il
	 * servizio indicato, in base al ruolo (REGP/DEGP, REPP/DEPP, facilitatore/
	 * volontario). Per gli altri ruoli ritorna false.
	 */
	public boolean isAutorizzatoForGetSchedaDettaglioServizioAndEliminaServizio(@NotNull Long idServizio,
			SceltaProfiloParam profilazioneParam) {
		switch (profilazioneParam.getCodiceRuoloUtenteLoggato()) {
			case RuoliUtentiConstants.REGP:
			case RuoliUtentiConstants.DEGP:
				return this.servizioSQLService.isServizioAssociatoARegpDegp(idServizio,
						profilazioneParam.getIdProgetto()) > 0;
			case RuoliUtentiConstants.REPP:
			case RuoliUtentiConstants.DEPP:
				return this.servizioSQLService.isServizioAssociatoAReppDepp(idServizio,
						profilazioneParam.getIdProgetto(), profilazioneParam.getIdEnte()) > 0;
			case RuoliUtentiConstants.FACILITATORE:
			case RuoliUtentiConstants.VOLONTARIO:
				return this.servizioSQLService.isServizioAssociatoAUtenteProgettoEnte(idServizio,
						profilazioneParam.getIdProgetto(), profilazioneParam.getIdEnte(),
						profilazioneParam.getCfUtenteLoggato()) > 0;
			default:
				return false;
		}
	}

	/**
	 * Un servizio puo' essere eliminato solo se nello stato NON_ATTIVO.
	 */
	@LogMethod
	@LogExecutionTime
	public boolean isServizioEliminabile(@NotNull final String statoServizio) {
		return StatoEnum.NON_ATTIVO.getValue().equalsIgnoreCase(statoServizio);
	}
}
