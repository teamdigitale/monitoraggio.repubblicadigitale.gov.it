
import { Document } from '@react-pdf/renderer';
import { SchedaUtentePage, Utente } from './SchedaUtente';
import React from 'react';

export const DocumentoSchede: React.FC<{ utenti: Utente[]; logoSrc: string }> = (props) => {
  const { utenti, logoSrc } = props;

  return (
    <Document>
      {utenti.map((u, i) => (
        <SchedaUtentePage
          key={u.id || `${u.cognome}-${u.nome}-${i}`}
          u={u}
          logoSrc={logoSrc}
          pageIndex={i}
          pagesTotal={utenti.length}
        />
      ))}
    </Document>
  );
};
