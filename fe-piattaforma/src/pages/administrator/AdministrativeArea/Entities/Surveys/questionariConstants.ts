export const answerType = [
  { label: 'Testuale', value: 'text' },
  { label: 'Numerica', value: 'number' },
  { label: 'Calendario', value: 'date' },
  { label: 'Lista valori', value: 'select' },
  { label: 'Scelta multipla', value: 'checkbox' },
  { label: 'Gradimento', value: 'range' },
];

export const defaultQuestionsCitizenAnagraphic = [
  { id: '1', name: 'Nome', type: 'text', isDefault: true, values: '' },
  { id: '2', name: 'Cognome', type: 'text', isDefault: true, values: '' },
  {
    id: '3',
    name: 'Codice fiscale',
    type: 'text',
    isDefault: true,
    values: '',
  },
  {
    id: '4',
    name: 'Tipo documento',
    type: 'select',
    isDefault: true,
    values:
      '[{"label":"CI","value":"CI"}, {"label":"Passaporto","value":"Passaporto"}]',
  },
  {
    id: '5',
    name: 'Numero documento',
    type: 'text',
    isDefault: true,
    values: '',
  },
  {
    id: '6',
    name: 'Genere',
    type: 'select',
    isDefault: true,
    values: '[{"label":"F","value":"F"}, {"label":"M","value":"M"}]',
  },
  {
    id: '7',
    name: 'Anno di nascita',
    type: 'number',
    isDefault: true,
    values: '',
  },
  {
    id: '8',
    name: 'Titolo di studio',
    type: 'text',
    isDefault: true,
    values: '',
  },
  {
    id: '9',
    name: 'Stato occupazioneale - livello I',
    type: 'text',
    isDefault: true,
    values: '',
  },
  {
    id: '10',
    name: 'Stato occupazioneale - livello II',
    type: 'text',
    isDefault: true,
    values: '',
  },
  {
    id: '11',
    name: 'Stato occupazioneale - livello III',
    type: 'text',
    isDefault: true,
    values: '',
  },
  { id: '12', name: 'Cittadinanza', type: 'text', isDefault: true, values: '' },
  {
    id: '13',
    name: 'Comune di domicilio',
    type: 'text',
    isDefault: true,
    values: '',
  },
  {
    id: '14',
    name: 'Categorie fragili',
    type: 'select',
    isDefault: true,
    values: '[{"label":"Si","value":"Si"}, {"label":"No","value":"No"}]',
  },
  { id: '15', name: 'Email', type: 'text', isDefault: true, values: '' },
  {
    id: '16',
    name: 'Numero cellulare',
    type: 'text',
    isDefault: true,
    values: '',
  },
  { id: '17', name: 'Telefono', type: 'text', isDefault: true, values: '' },
  {
    id: '18',
    name: 'Consenso trattamento dei dati',
    type: 'checkbox',
    isDefault: true,
    values: '[{"label":"Si","value":"Si"}]',
  },
  {
    id: '19',
    name: 'Data di conferimento consenso',
    type: 'date',
    isDefault: true,
    values: '',
  },
];

export const defaultQuestionsBookingAnagraphic = [
  {
    id: '20',
    name: 'Prima volta che si usufruisce del servizio di facilitazione/formazione',
    type: 'select',
    isDefault: true,
    values: '[{"label":"Si","value":"Si"}, {"label":"No","value":"No"}]',
  },
  {
    id: '21',
    name: 'Se non è la prima volta, indicare il servizio di cui si è fruito in passato',
    type: 'text',
    isDefault: true,
    values: '',
  },
];

export const defaultQuestionsServiceAnagraphic = [
  { id: '22', name: 'Data', type: 'date', isDefault: true, values: '' },
  { id: '23', name: 'Ora inizio', type: 'text', isDefault: true, values: '' },
  { id: '24', name: 'Ora fine', type: 'text', isDefault: true, values: '' },
  {
    id: '25',
    name: 'Tipo di servizio prenotato',
    type: 'select',
    isDefault: true,
    values:
      '[{"label":"Servizio 1","value":"Servizio 1"}, {"label":"Servizio 2","value":"Servizio 2"}]',
  },
  {
    id: '26',
    name: 'Specificare ambito facilitazione/formazione - livello I',
    type: 'text',
    isDefault: true,
    values: '',
  },
  {
    id: '27',
    name: 'Specificare ambito facilitazione/formazione - livello II',
    type: 'text',
    isDefault: true,
    values: '',
  },
  {
    id: '28',
    name: 'Specificare ambito servizi pubblici digitali',
    type: 'text',
    isDefault: true,
    values: '',
  },
  {
    id: '29',
    name: 'Dettagli del servizio',
    type: 'text',
    isDefault: true,
    values: '',
  },
];

export const defaultQuestionsServiceContent = [
  {
    id: '30',
    name: 'Come hai saputo di questo servizio specifico?',
    type: 'select',
    isDefault: true,
    values:
      '[{"label":"Internet","value":"Internet"}, {"label":"Random","value":"Random"}]',
  },
  {
    id: '31',
    name: 'Quale motivo ti ha spinto a prenotare?',
    type: 'text',
    isDefault: true,
    values: '',
  },
  {
    id: '32',
    name: 'Hai intenzione di tornare?',
    type: 'select',
    isDefault: true,
    values: '[{"label":"Si","value":"Si"}, {"label":"No","value":"No"}]',
  },
  {
    id: '33',
    name: 'In quale ambito di facilitazione/formazione dei interessato?',
    type: 'text',
    isDefault: true,
    values: '',
  },
  {
    id: '34',
    name: 'Cosa ti è più utile per risolvere i problemi legati al digitale?',
    type: 'text',
    isDefault: true,
    values: '',
  },
];
