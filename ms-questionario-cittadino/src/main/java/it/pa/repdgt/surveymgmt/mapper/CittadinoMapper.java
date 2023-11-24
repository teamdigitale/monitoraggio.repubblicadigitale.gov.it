package it.pa.repdgt.surveymgmt.mapper;

import it.pa.repdgt.shared.repository.tipologica.FasciaDiEtaRepository;
import org.springframework.stereotype.Component;

import it.pa.repdgt.shared.entity.CittadinoEntity;
import it.pa.repdgt.surveymgmt.bean.DettaglioCittadinoBean;
import it.pa.repdgt.surveymgmt.request.CittadinoRequest;

@Component
public class CittadinoMapper {
	private final FasciaDiEtaRepository fasciaDiEtaRepository;

	public CittadinoMapper(FasciaDiEtaRepository fasciaDiEtaRepository) {
		this.fasciaDiEtaRepository = fasciaDiEtaRepository;
	}

	public DettaglioCittadinoBean toDettaglioCittadinoBeanFrom(CittadinoEntity cittadinoFetchDB) {
		DettaglioCittadinoBean dettaglioCittadino = new DettaglioCittadinoBean();

		dettaglioCittadino.setId(cittadinoFetchDB.getId());
		dettaglioCittadino.setCodiceFiscale(cittadinoFetchDB.getCodiceFiscale());
		dettaglioCittadino.setTipoDocumento(cittadinoFetchDB.getTipoDocumento());
		dettaglioCittadino.setNumeroDocumento(cittadinoFetchDB.getNumeroDocumento());
		dettaglioCittadino.setGenere(cittadinoFetchDB.getGenere());
		dettaglioCittadino.setFasciaDiEta(cittadinoFetchDB.getFasciaDiEta().getId());
		dettaglioCittadino.setTitoloStudio(cittadinoFetchDB.getTitoloDiStudio());
		dettaglioCittadino.setStatoOccupazionale(cittadinoFetchDB.getOccupazione());
		dettaglioCittadino.setCittadinanza(cittadinoFetchDB.getCittadinanza());

		return dettaglioCittadino;
	}

	public CittadinoEntity toEntityFrom(CittadinoRequest cittadinoRequest) {
		CittadinoEntity cittadinoEntity = new CittadinoEntity();

		cittadinoEntity.setCodiceFiscale(cittadinoRequest.getCodiceFiscale());
		cittadinoEntity.setFasciaDiEta(fasciaDiEtaRepository.findByFascia(cittadinoRequest.getFasciaDiEta()));
		cittadinoEntity.setTipoDocumento(cittadinoRequest.getTipoDocumento());
		cittadinoEntity.setNumeroDocumento(cittadinoRequest.getNumeroDocumento());
		cittadinoEntity.setGenere(cittadinoRequest.getGenere());
		cittadinoEntity.setTitoloDiStudio(cittadinoRequest.getTitoloStudio());
		cittadinoEntity.setOccupazione(cittadinoRequest.getStatoOccupazionale());
		cittadinoEntity.setCittadinanza(cittadinoRequest.getCittadinanza());

		return cittadinoEntity;
	}
}