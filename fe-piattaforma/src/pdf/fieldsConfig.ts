export type FieldEntry =
  | { type: 'section'; title: string }
  | { type: 'field'; key: string; label: string; half?: boolean; small?: boolean };

export const schedaCittadinoTitle = 'Dati Cittadino';

export const schedaCittadinoFields: FieldEntry[] = [
  { type: 'field', key: 'codiceFiscale', label: 'Codice identificativo unico', half: false },
  { type: 'field', key: 'genere', label: 'Genere', half: true },
  { type: 'field', key: 'fascia', label: 'Fascia di età', half: true },
  { type: 'field', key: 'titoloDiStudio', label: 'Titolo di studio', half: true },
  { type: 'field', key: 'occupazione', label: 'Stato occupazionale', half: true },
  { type: 'field', key: 'cittadinanza', label: 'Cittadinanza', half: true },
  { type: 'section', title: 'Dati primo servizio fruito' },
  { type: 'field', key: 'regioneProvincia', label: 'Regione o provincia autonoma', half: true },
  { type: 'field', key: 'nomeGestore', label: 'Ente titolare del progetto', half: true },
  { type: 'field', key: 'cup', label: 'CUP', half: true },
  { type: 'field', key: 'nomeServizio', label: 'Nome del progetto', half: true },
  { type: 'field', key: 'nomePuntoFacilitazione', label: 'Nome del punto di facilitazione', half: true },
  { type: 'field', key: 'indirizzoPuntoFacilitazione', label: 'Indirizzo del punto di facilitazione', half: true },
  { type: 'field', key: 'nomeFacilitatore', label: 'Nome del facilitatore', half: true },
  { type: 'field', key: 'dataServizio', label: 'Data di erogazione', half: true },
  { type: 'field', key: 'tipologiaServizio', label: 'Tipologia del servizio', half: true },
  { type: 'field', key: 'competenzaDigitale', label: 'Competenza digitale', half: true },
];
