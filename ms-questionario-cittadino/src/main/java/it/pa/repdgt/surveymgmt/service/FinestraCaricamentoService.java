package it.pa.repdgt.surveymgmt.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import it.pa.repdgt.shared.entity.FinestraCaricamentoEntity;
import it.pa.repdgt.shared.exception.CodiceErroreEnum;
import it.pa.repdgt.shared.repository.FinestraCaricamentoRepository;
import it.pa.repdgt.surveymgmt.exception.FinestraCaricamentoException;

@Service
public class FinestraCaricamentoService {

	private static final Integer ID_FINESTRA_CARICAMENTO = 1;

	@Autowired
	private FinestraCaricamentoRepository finestraCaricamentoRepository;

	/**
	 * Restituisce la riga di configurazione della finestra di caricamento massivo
	 * (id=1, unica per istanza). Se assente lancia FinestraCaricamentoException
	 * con codice CM02, che il gestore globale serializza in una 500 contenente
	 * l'errorCode usato dal FE per pescare il messaggio da errors.json.
	 */
	public FinestraCaricamentoEntity getFinestraCaricamento() {
		return this.finestraCaricamentoRepository.findById(ID_FINESTRA_CARICAMENTO)
				.orElseThrow(() -> new FinestraCaricamentoException(CodiceErroreEnum.CM02));
	}
}
