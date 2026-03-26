
import {
  generaSchedaSingola,
  generaSchedeMultiple,
} from '../../../pdf/generate';
import type { Utente } from '../../../pdf/SchedaUtente';

const logoSrc = '/img/logo.png';

// Mock dati prova
const utentiMock: Utente[] = Array.from({ length: 100 }).map((_, i) => ({
  id: String(i + 1),
  nome: `Mario_${i + 1}`,
  cognome: `Rossi_${i + 1}`,
  dataNascita: '01/01/1990',
  codiceFiscale: 'RSSMRA90A01H501Z',
  email: `mario${i + 1}@example.com`,
  telefono: '3331234567',
  indirizzo: 'Via Roma 1',
  citta: 'Roma',
  cap: '00100',
  provincia: 'RM',
  note: i % 2 ? 'Note opzionali' : '',
}));

export default function AzioniPDF() {
  const handleSingolo = async () => {
    await generaSchedaSingola(utentiMock[0], logoSrc);
  };

  const handleMultiplo = async () => {
    await generaSchedeMultiple(utentiMock, logoSrc);
  };

  return (
    <div style={{ padding: 24, display: 'flex', gap: 12 }}>
      <button onClick={handleSingolo}>
        Scarica PDF Singolo
      </button>

      <button onClick={handleMultiplo}>
        Scarica PDF Multipagina
      </button>
    </div>
  );
}
