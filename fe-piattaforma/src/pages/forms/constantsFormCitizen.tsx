export const citizenFormDropdownOptions = {
  'flag-codice-fiscale': [
    {
      label: 'Codice fiscale non disponibile',
      value: 'Codice fiscale non disponibile',
    },
  ],
  genere: [
    { label: 'F', value: 'F' },
    { label: 'M', value: 'M' },
  ],
  tipoDocumento: [
    { label: 'Identità', value: 'Identità' },
    { label: 'Patente', value: 'Patente' },
    { label: 'Passaporto', value: 'Passaporto' },
    { label: 'Permesso di soggiorno', value: 'Permesso di soggiorno' },
  ],
  cittadinanza: [
    { label: 'Italiana', value: 'Italiana' },
    { label: 'Altro - UE', value: 'Altro - UE' },
    { label: 'Altro - non UE', value: 'Altro - non UE' },
  ],
  categoriaFragili: [
    { label: 'Rifugiato', value: 'Rifugiato' },
    { label: 'Migrante', value: 'Migrante' },
    {
      label: 'Percettore di sussidio di disabilità',
      value: 'Percettore di sussidio di disabilità',
    },
    {
      label: 'Altro percettore di sussidio (es. reddito di cittadinanza)',
      value: 'Altro percettore di sussidio (es. reddito di cittadinanza)',
    },
  ],
  titoloDiStudio: [
    {
      label: 'Diploma di istruzione primaria (scuola elementare)',
      value: 'Diploma di istruzione primaria (scuola elementare)',
    },
    {
      label: '"Diploma di scuola secondaria di I livello (scuola media)',
      value: '"Diploma di scuola secondaria di I livello (scuola media)',
    },
    {
      label:
        'Diploma di scuola secondaria di II livello o ITP (maturità o di tecnico superiore - ITS)',
      value:
        'Diploma di scuola secondaria di II livello o ITP (maturità o di tecnico superiore - ITS)',
    },
    {
      label: 'Laurea di I livello (triennale)',
      value: 'Laurea di I livello (triennale)',
    },
    {
      label: 'Laurea di II livello (specialistica o magistrale)',
      value: 'Laurea di II livello (specialistica o magistrale)',
    },
    { label: 'Dottorato o Master', value: 'Dottorato o Master' },
    {
      label: 'Non conosciuto / non fornito / Altro',
      value: 'Non conosciuto / non fornito / Altro',
    },
  ],
  tipoConferimentoConsenso: [
    { label: 'Cartaceo', value: 'Cartaceo' },
    { label: 'Email', value: 'Email' },
    { label: 'Online', value: 'Online' },
  ],
  statoOccupazionale: ['Occupato', 'Inoccupato', 'Disoccupato', 'Altro'],
  occupazione: [
    { label: 'Dipendente', value: 'Dipendente', upperLevel: 'Occupato' },
    {
      label: 'Lavoro autonomo',
      value: 'Lavoro autonomo',
      upperLevel: 'Occupato',
    },
    {
      label:
        'A (non presta attività lavorativa con un regolare contratto di assunzione, es. prestazioni occasionali)',
      value:
        'A (non presta attività lavorativa con un regolare contratto di assunzione, es. prestazioni occasionali)',
      upperLevel: 'Inoccupato',
    },
    {
      label: 'B (in cerca di lavoro per la prima volta)',
      value: 'B (in cerca di lavoro per la prima volta)',
      upperLevel: 'Inoccupato',
    },
    {
      label: 'A (da 365 giorni e meno)',
      value: 'A (da 365 giorni e meno)',
      upperLevel: 'Disoccupato',
    },
    {
      label: 'B (da 365 giorni e più)',
      value: 'B (da 365 giorni e più)',
      upperLevel: 'Disoccupato',
    },
    {
      label: 'Studente/In formazione',
      value: 'Studente/In formazione',
      upperLevel: 'Altro',
    },
    { label: 'Pensionato', value: 'Pensionato', upperLevel: 'Altro' },
  ],
};
