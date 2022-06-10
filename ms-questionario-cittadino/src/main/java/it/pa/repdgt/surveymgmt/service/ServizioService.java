package it.pa.repdgt.surveymgmt.service;

import java.util.Date;
import java.util.UUID;

import javax.transaction.Transactional;
import javax.validation.constraints.NotNull;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

import it.pa.repdgt.shared.entity.ServizioEntity;
import it.pa.repdgt.surveymgmt.collection.SezioneQ3Collection;
import it.pa.repdgt.surveymgmt.exception.ServizioException;
import it.pa.repdgt.surveymgmt.mapper.ServizioMapper;
import it.pa.repdgt.surveymgmt.mongo.repository.SezioneQ3Respository;
import it.pa.repdgt.surveymgmt.request.ServizioRequest;

@Service
@Validated
public class ServizioService {
	@Autowired
	private ServizioMapper servizioMapper;
	@Autowired
	private UtenteService utenteService;
	@Autowired
	private SezioneQ3Respository sezioneQ3Repository;
	@Autowired
	private ServizioSqlService servizioSQLService;
	
	@Transactional(rollbackOn = Exception.class)
	public ServizioEntity creaServizio(
			@NotNull final ServizioRequest servizioRequest) {
		final String codiceFiscaletenteLoggato = servizioRequest.getProfilazioneParam().getCodiceFiscaleUtenteLoggato();
		final String ruoloUtenteLoggato = servizioRequest.getProfilazioneParam().getCodiceRuoloUtenteLoggato().toString();
		
		if( ! this.utenteService.isUtenteFacilitatore(codiceFiscaletenteLoggato, ruoloUtenteLoggato) ) {
			final String messaggioErrore = String.format("Impossibile creare servizio. Utente con codice fiscale '%s' non ha ruolo FACILITATORE", codiceFiscaletenteLoggato);
			throw new ServizioException(messaggioErrore);
		}
		
		// creo SezioneQ3Mongo
		final SezioneQ3Collection sezioneQ3Compilato = this.creaSezioneQ3(servizioRequest);
		
		// salvo servizio su MySql
		ServizioEntity servizioCreato = this.servizioSQLService.salvaServizio(servizioRequest, sezioneQ3Compilato.getId());
		
		// salvo SezioneQ3Compilato su MongoDB
		this.sezioneQ3Repository.save(sezioneQ3Compilato);
		
		return servizioCreato;
	}
	
	public SezioneQ3Collection creaSezioneQ3(@NotNull final ServizioRequest servizioRequest) {
		final SezioneQ3Collection sezioneQ3Collection = this.servizioMapper.toCollectionFrom(servizioRequest);
		sezioneQ3Collection.setId(UUID.randomUUID().toString());
		sezioneQ3Collection.setDataOraCreazione(new Date());
		sezioneQ3Collection.setDataOraUltimoAggiornamento(sezioneQ3Collection.getDataOraCreazione());
		return sezioneQ3Collection;
	}
	
	
}