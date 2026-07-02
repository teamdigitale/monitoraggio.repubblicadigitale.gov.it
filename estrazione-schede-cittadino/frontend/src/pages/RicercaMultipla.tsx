import { useMemo, useState } from 'react';
import { ricercaMultipla } from '../api';
import type { RicercaMultiplaResult } from '../types';
import { generaSchedeMultiple } from '../pdf/generate';
import { schedaCittadinoFields, schedaCittadinoTitle } from '../pdf/fieldsConfig';

const HEADER_PDF = '/header_pdf_cittadino.jpg';
const MAX_RIGHE = 100;

export default function RicercaMultipla() {
  const [testo, setTesto] = useState('');
  const [risultato, setRisultato] = useState<RicercaMultiplaResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [errore, setErrore] = useState('');

  const righe = useMemo(
    () =>
      testo
        .split('\n')
        .map((r) => r.replace(/;+$/, '').trim())
        .filter((r) => r.length > 0),
    [testo]
  );

  const overLimit = righe.length > MAX_RIGHE;

  const cerca = async () => {
    if (righe.length === 0 || overLimit) return;
    setLoading(true);
    setErrore('');
    try {
      const data = await ricercaMultipla(righe);
      setRisultato(data);
    } catch (e) {
      setRisultato(null);
      setErrore('Errore durante la ricerca. Verifica che il backend sia raggiungibile.');
    } finally {
      setLoading(false);
    }
  };

  const scaricaSchede = () => {
    if (!risultato || risultato.trovati.length === 0) return;
    generaSchedeMultiple(
      risultato.trovati as unknown as Record<string, unknown>[],
      schedaCittadinoFields,
      schedaCittadinoTitle,
      HEADER_PDF,
      `schede_cittadini_${risultato.trovati.length}.pdf`
    );
  };

  const scaricaElencoScarti = () => {
    if (!risultato || risultato.nonTrovati.length === 0) return;
    const righeCsv = ['Numero riga;Codice'];
    risultato.nonTrovati.forEach((s) => righeCsv.push(`${s.riga};${s.codice}`));
    const blob = new Blob([righeCsv.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `elenco_scarti_${risultato.nonTrovati.length}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <p className="hint">
        Inserisci un codice identificativo (hash) per riga. Massimo {MAX_RIGHE} righe.
      </p>
      <textarea
        rows={10}
        value={testo}
        placeholder={'codice1\ncodice2\n…'}
        onChange={(e) => {
          setTesto(e.target.value);
          if (risultato) setRisultato(null);
        }}
        className={overLimit ? 'invalid' : ''}
      />
      <div className={overLimit ? 'counter over' : 'counter'}>
        {righe.length} / {MAX_RIGHE} righe
      </div>

      <div className="search-row">
        <button onClick={cerca} disabled={loading || righe.length === 0 || overLimit}>
          {loading ? 'Ricerca…' : 'Cerca elenco'}
        </button>
      </div>

      {errore && <div className="alert error">{errore}</div>}

      {risultato && (
        <div className="risultato-multiplo">
          {risultato.trovati.length > 0 && (
            <div className="box box-ok">
              <span>Cittadini trovati: {risultato.trovati.length}</span>
              <button onClick={scaricaSchede}>Scarica schede (PDF)</button>
            </div>
          )}
          {risultato.nonTrovati.length > 0 && (
            <div className="box box-warn">
              <span>Cittadini non trovati: {risultato.nonTrovati.length}</span>
              <button onClick={scaricaElencoScarti}>Scarica elenco (CSV)</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
