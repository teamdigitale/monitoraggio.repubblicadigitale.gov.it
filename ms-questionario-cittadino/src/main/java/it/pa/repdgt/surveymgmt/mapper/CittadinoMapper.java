package it.pa.repdgt.surveymgmt.mapper;

import org.springframework.stereotype.Component;

import it.pa.repdgt.shared.entity.CittadinoEntity;
import it.pa.repdgt.surveymgmt.bean.DettaglioCittadinoBean;

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
}