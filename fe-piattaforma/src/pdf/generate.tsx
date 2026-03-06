
import { pdf } from '@react-pdf/renderer';
import { DocumentoSchede } from './DocumentoSchede';
import type { Utente } from './SchedaUtente';
import React from 'react';

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export async function generaSchedaSingola(utente: Utente, logoSrc: string) {
  const blob = await pdf(<DocumentoSchede utenti={[utente]} logoSrc={logoSrc} />).toBlob();
  downloadBlob(blob, `scheda_${utente.cognome}_${utente.nome}.pdf`);
}

export async function generaSchedeMultiple(utenti: Utente[], logoSrc: string) {
  const blob = await pdf(<DocumentoSchede utenti={utenti} logoSrc={logoSrc} />).toBlob();
  downloadBlob(blob, `schede_${utenti.length}pagine.pdf`);
}
