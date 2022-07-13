package it.pa.repdgt.surveymgmt.mapper;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.validation.constraints.Email;

import org.springframework.stereotype.Component;

import it.pa.repdgt.shared.entity.CittadinoEntity;
import it.pa.repdgt.surveymgmt.bean.DettaglioCittadinoBean;
import it.pa.repdgt.surveymgmt.request.CittadinoRequest;

@Component
public class CittadinoMapper {

	public DettaglioCittadinoBean toDettaglioCittadinoBeanFrom(CittadinoEntity cittadinoFetchDB) {
		DettaglioCittadinoBean dettaglioCittadino = new DettaglioCittadinoBean();
		
		dettaglioCittadino.setNome(cittadinoFetchDB.getNome());
		dettaglioCittadino.setCognome(cittadinoFetchDB.getCognome());
		dettaglioCittadino.setCodiceFiscale(cittadinoFetchDB.getCodiceFiscale());
		dettaglioCittadino.setTipoDocumento(cittadinoFetchDB.getTipoDocumento());
		dettaglioCittadino.setNumeroDocumento(cittadinoFetchDB.getNumeroDocumento());
		dettaglioCittadino.setGenere(cittadinoFetchDB.getGenere());
		dettaglioCittadino.setAnnoDiNascita(cittadinoFetchDB.getAnnoDiNascita());
		dettaglioCittadino.setTitoloDiStudio(cittadinoFetchDB.getTitoloDiStudio());
		dettaglioCittadino.setOccupazione(cittadinoFetchDB.getOccupazione());
		dettaglioCittadino.setCittadinanza(cittadinoFetchDB.getCittadinanza());
		dettaglioCittadino.setComuneDiDomicilio(cittadinoFetchDB.getComuneDiDomicilio());
		dettaglioCittadino.setCategoriaFragili(cittadinoFetchDB.getCategoriaFragili());
		dettaglioCittadino.setEmail(cittadinoFetchDB.getEmail());
		dettaglioCittadino.setPrefissoTelefono(cittadinoFetchDB.getPrefissoTelefono());
		dettaglioCittadino.setNumeroDiCellulare(cittadinoFetchDB.getNumeroDiCellulare());
		dettaglioCittadino.setTelefono(cittadinoFetchDB.getTelefono());
		dettaglioCittadino.setTipoConferimentoConsenso(cittadinoFetchDB.getTipoConferimentoConsenso());
		dettaglioCittadino.setDataConferimentoConsenso(cittadinoFetchDB.getDataConferimentoConsenso());
		
		return dettaglioCittadino;
	}
	
	public CittadinoEntity toEntityFrom(CittadinoRequest cittadinoRequest) {
		CittadinoEntity cittadinoEntity = new CittadinoEntity();
		
		cittadinoEntity.setCodiceFiscale(cittadinoRequest.getCodiceFiscale());
		cittadinoEntity.setNome(cittadinoRequest.getNome());
		cittadinoEntity.setCognome(cittadinoRequest.getCognome());
		cittadinoEntity.setTipoDocumento(cittadinoRequest.getTipoDocumento());
		cittadinoEntity.setNumeroDocumento(cittadinoRequest.getNumeroDocumento());
		cittadinoEntity.setGenere(cittadinoRequest.getGenere());
		cittadinoEntity.setAnnoDiNascita(cittadinoRequest.getAnnoNascita());
		cittadinoEntity.setTitoloDiStudio(cittadinoRequest.getTitoloStudio());
		cittadinoEntity.setOccupazione(cittadinoRequest.getStatoOccupazionale());
		cittadinoEntity.setCittadinanza(cittadinoRequest.getCittadinanza());
		cittadinoEntity.setComuneDiDomicilio(cittadinoRequest.getComuneDomicilio());
		cittadinoEntity.setCategoriaFragili(cittadinoRequest.getCategoriaFragili());
		cittadinoEntity.setEmail(cittadinoRequest.getEmail());
		cittadinoEntity.setPrefissoTelefono(cittadinoRequest.getPrefisso());
		cittadinoEntity.setNumeroDiCellulare(cittadinoRequest.getNumeroCellulare());
		cittadinoEntity.setTelefono(cittadinoRequest.getTelefono());
		
		return cittadinoEntity;
	}
}