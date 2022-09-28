package it.pa.repdgt.surveymgmt.mapper;

import org.springframework.stereotype.Component;

import it.pa.repdgt.shared.entity.CittadinoEntity;
import it.pa.repdgt.shared.util.Utils;
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
		dettaglioCittadino.setAnnoNascita(cittadinoFetchDB.getAnnoDiNascita());
		dettaglioCittadino.setTitoloStudio(cittadinoFetchDB.getTitoloDiStudio());
		dettaglioCittadino.setStatoOccupazionale(cittadinoFetchDB.getOccupazione());
		dettaglioCittadino.setCittadinanza(cittadinoFetchDB.getCittadinanza());
		dettaglioCittadino.setComuneDomicilio(cittadinoFetchDB.getComuneDiDomicilio());
		dettaglioCittadino.setCategoriaFragili(cittadinoFetchDB.getCategoriaFragili());
		dettaglioCittadino.setEmail(cittadinoFetchDB.getEmail());
		dettaglioCittadino.setPrefisso(cittadinoFetchDB.getPrefissoTelefono());
		dettaglioCittadino.setNumeroCellulare(cittadinoFetchDB.getNumeroDiCellulare());
		dettaglioCittadino.setTelefono(cittadinoFetchDB.getTelefono());
		dettaglioCittadino.setTipoConferimentoConsenso(cittadinoFetchDB.getTipoConferimentoConsenso());
		dettaglioCittadino.setDataConferimentoConsenso(cittadinoFetchDB.getDataConferimentoConsenso());
		
		return dettaglioCittadino;
	}
	
	public CittadinoEntity toEntityFrom(CittadinoRequest cittadinoRequest) {
		CittadinoEntity cittadinoEntity = new CittadinoEntity();
		
		cittadinoEntity.setCodiceFiscale(cittadinoRequest.getCodiceFiscale());
		cittadinoEntity.setNome(Utils.toCamelCase(cittadinoRequest.getNome()));
		cittadinoEntity.setCognome(cittadinoRequest.getCognome().toUpperCase());
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