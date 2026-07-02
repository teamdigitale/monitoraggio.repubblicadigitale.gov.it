import { useState } from 'react';
import { ricercaSingola } from '../api';
import type { PrimoServizioCittadino } from '../types';
import { generaSchedaSingola } from '../pdf/generate';
import { schedaCittadinoFields, schedaCittadinoTitle } from '../pdf/fieldsConfig';

const HEADER_PDF = '/header_pdf_cittadino.jpg';

export default function RicercaSingola() {
  const [criterio, setCriterio] = useState('');
  const [risultati, setRisultati] = useState<PrimoServizioCittadino[]>([]);
  const [cercato, setCercato] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errore, setErrore] = useState('');

  const cerca = async () => {
    const valore = criterio.trim();
    if (!valore) return;
    setLoading(true);
    setErrore('');
    try {
      const data = await ricercaSingola(valore);
      setRisultati(data);
      setCercato(true);
    } catch (e) {
      setRisultati([]);
      setCercato(true);
      setErrore('Errore durante la ricerca. Verifica che il backend sia raggiungibile.');
    } finally {
      setLoading(false);
    }
  };

  const scaricaPdf = (c: PrimoServizioCittadino) => {
    generaSchedaSingola(
      c as unknown as Record<string, unknown>,
      schedaCittadinoFields,
      schedaCittadinoTitle,
      HEADER_PDF,
      `scheda_cittadino_${c.idCittadino}.pdf`
    );
  };

  return (
    <div>
      <p className="hint">
        Inserisci codice fiscale, codice identificativo (hash) oppure ID del cittadino.
      </p>
      <div className="search-row">
        <input
          type="text"
          value={criterio}
          placeholder="CF / codice identificativo / ID"
          onChange={(e) => setCriterio(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && cerca()}
        />
        <button onClick={cerca} disabled={loading || !criterio.trim()}>
          {loading ? 'Ricerca…' : 'Cerca'}
        </button>
      </div>

      {errore && <div className="alert error">{errore}</div>}

      {cercato && !errore && risultati.length === 0 && (
        <div className="alert warning">
          Il cittadino non è presente. Verifica i dati inseriti ed effettua una nuova ricerca.
        </div>
      )}

      {risultati.length > 0 && (
        <table className="result-table">
          <thead>
            <tr>
              <th>ID cittadino</th>
              <th>Nome progetto</th>
              <th>Data primo servizio</th>
              <th>Tipologia</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {risultati.map((c, i) => (
              <tr key={`${c.idCittadino}-${i}`}>
                <td>{c.idCittadino}</td>
                <td>{c.nomeServizio ?? '-'}</td>
                <td>{c.dataServizio ?? '-'}</td>
                <td>{c.tipologiaServizio ?? '-'}</td>
                <td>
                  <button onClick={() => scaricaPdf(c)}>Scarica PDF</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
