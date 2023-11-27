import {province} from "../../consts/province";

export const citizenFormDropdownOptions = {
  codiceFiscaleNonDisponibile: [
    {
      label: 'Codice fiscale non disponibile',
      value: 'true',
    },
  ],
  genere: [
    { label: 'F', value: 'F' },
    { label: 'M', value: 'M' },
    { label: 'Non binario', value: 'Non binario' },
    { label: 'Preferisco non rispondere', value: 'Preferisco non rispondere'}
  ],
  tipoDocumento: [
    { label: 'Carta di Identità', value: 'Carta di Identità' },
    { label: 'Patente', value: 'Patente' },
    { label: 'Passaporto', value: 'Passaporto' },
    { label: 'Permesso di soggiorno', value: 'Permesso di soggiorno' },
    { label: 'Altro', value: 'Altro'}
  ],
  cittadinanza: [
    { label: 'Italiana', value: 'Italiana' },
    {
      label: "Straniera, di un Paese ALL’INTERNO dell’Unione Europea",
      value: "Straniera, di un Paese ALL’INTERNO dell’Unione Europea",
    },
    {
      label: "Straniera, di un Paese AL DI FUORI dell'Unione Europea",
      value: "Straniera, di un Paese AL DI FUORI dell'Unione Europea",
    },
  ],
  categoriaFragili: [
    { label: 'Rifugiato/ Migrante', value: 'Rifugiato/ Migrante' },
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
      label: 'Licenza elementare / Scuola primaria',
      value: 'Licenza elementare / Scuola primaria',
    },
    {
      label: 'Licenza media inferiore / Scuola secondaria di I grado (3 anni)',
      value: 'Licenza media inferiore / Scuola secondaria di I grado (3 anni)',
    },
    {
      label:
        'Diploma di scuola superiore (diploma di maturità) / Scuola secondaria di II grado (5 anni)',
      value:
        'Diploma di scuola superiore (diploma di maturità) / Scuola secondaria di II grado (5 anni)',
    },
    {
      label:
        'Diploma professionale (3 anni) / Istituti professionali / Istituti di Istruzione e Formazione Professionale (IeFP)',
      value:
        'Diploma professionale (3 anni) / Istituti professionali / Istituti di Istruzione e Formazione Professionale (IeFP)',
    },
    {
      label: 'Laurea (3 anni)',
      value: 'Laurea (3 anni)',
    },
    {
      label:
        'Laurea magistrale (5 anni) / Master di I livello / Specializzazione post-laurea (2 anni)',
      value:
        'Laurea magistrale (5 anni) / Master di I livello / Specializzazione post-laurea (2 anni)',
    },
    {
      label: 'Dottorato, Master di II livello o titoli equiparati',
      value: 'Dottorato, Master di II livello o titoli equiparati',
    },
    {
      label: 'Non conosciuto / Non fornito / Altro',
      value: 'Non conosciuto / Non fornito / Altro',
    },
  ],
  tipoConferimentoConsenso: [
    { label: 'Cartaceo', value: 'CARTACEO' },
    { label: 'Email', value: 'EMAIL' },
    { label: 'Online', value: 'ONLINE' },
  ],
  statoOccupazionale: [
    {
      label: 'Dipendente a tempo indeterminato',
      value: 'Dipendente a tempo indeterminato',
    },
    {
      label: 'Dipendente a tempo determinato',
      value: 'Dipendente a tempo determinato',
    },
    { label: 'Imprenditore', value: 'Imprenditore' },
    { label: 'Libero professionista', value: 'Libero professionista' },
    { label: 'Commerciante/ Artigiano', value: 'Commerciante/ Artigiano' },
    { label: 'Inoccupato/a', value: 'Inoccupato/a' },
    { label: 'Disoccupato/a', value: 'Disoccupato/a' },
    { label: 'Volontario/a', value: 'Volontario/a' },
    {
      label: 'Studente o studentessa / in formazione',
      value: 'Studente o studentessa / in formazione',
    },
    {
      label: 'Persona ritirata dal lavoro / Pensionato/a',
      value: 'Persona ritirata dal lavoro / Pensionato/a',
    },
    { label: 'Casalinga/o', value: 'Casalinga/o' },
    { label: 'Inabile al lavoro', value: 'Inabile al lavoro' },
    { label: 'Altro', value: 'Altro' },
  ],
  fasciaDiEtaId: [
    { label: '18-29', value: '1' },
    { label: '30-54', value: '2' },
    { label: '55-74', value: '3' },
    { label: '75 e oltre', value: '4' }
  ],
  provincia: province
};
