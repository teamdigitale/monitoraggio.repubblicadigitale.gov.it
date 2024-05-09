import moment from 'moment';
import { CSVRecord } from '../models/RecordCSV.model';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const AES256 = require('aes-everywhere');

export const generateServiceName = (
  serviceTypeString: string
): { serviceName: string; rejectedTypes: string[] } => {
  const serviceAbbreviations: { [key: string]: string } = {
    'Facilitazione individuale': 'facind',
    'Facilitazione di gruppo': 'facgru',
    'Formazione in presenza': 'forminp',
    'Formazione individuale': 'formind',
    Altro: 'Altro',
  };

  const date = moment().format('YYYYMMDD');
  const serviceTypes = serviceTypeString.split(';').map((type) => type.trim());
  let result = '';
  const rejectedTypes: string[] = [];

  for (const type of serviceTypes) {
    if (serviceAbbreviations[type]) {
      result += (result ? '-' : 'Import_') + serviceAbbreviations[type];
    } else {
      rejectedTypes.push(type);
    }
  }

  return {
    serviceName: result ? `${result}_${date}` : '',
    rejectedTypes: rejectedTypes,
  };
};

export const mandatoryFields: (keyof CSVRecord)[] = [
  'IDFacilitatore',
  'NominativoFacilitatore',
  'IDSede',
  'NominativoSede',
  'AN3',
  'AN4',
  'AN7',
  'AN8',
  'AN9',
  'AN10',
  'AN11',
  'AN12',
  'SE1',
  'SE2',
  'SE3',
  'SE4',
  'SE5',
  'SE6',
];

export function encryptFiscalCode(filteredRecord: CSVRecord) {
  return filteredRecord.AN3
    ? AES256.encrypt(filteredRecord.AN3, process?.env?.AES256_KEY)
    : '';
}

export function encryptDocumentAndDetermineType(
  filteredRecord: CSVRecord,
  encryptedFiscalCode: string
) {
  let encryptedDocNumber = '';
  let tipoDocumento = '';

  if (!encryptedFiscalCode) {
    encryptedDocNumber = filteredRecord.AN6
      ? AES256.encrypt(filteredRecord.AN6, process?.env?.AES256_KEY)
      : '';
    tipoDocumento = filteredRecord.AN5 || '';
  }
  return {
    encryptedDocNumber,
    tipoDocumento,
  };
}

export const validateFields = (
  record: CSVRecord,
  validateFiscalCode: (fiscalCode: string) => boolean
): string[] => {
  const errors: string[] = [];
  let mandatoryStartFields = [...mandatoryFields];
  if (record.AN5 && record.AN6) {
    mandatoryStartFields = mandatoryStartFields.filter((val) => val !== 'AN3');
  }

  const missingFields = mandatoryStartFields.filter(
    (field) =>
      !record[field as keyof CSVRecord] ||
      record[field as keyof CSVRecord] === ''
  );

  if (record.AN4 === 'SI') {
    if (!record.AN5 || record.AN5.trim() === '') {
      missingFields.push('AN5');
    }
    if (!record.AN6 || record.AN6.trim() === '') {
      missingFields.push('AN6');
    }
  }

  if (missingFields.length > 0) {
    const isMultipleMissing = missingFields.length > 1;
    const fieldText = isMultipleMissing ? 'I campi' : 'Il campo';
    const verbForm = isMultipleMissing ? 'sono' : 'è';
    const emptyForm = isMultipleMissing ? 'vuoti' : 'vuoto';
    errors.push(
      `${fieldText} "${missingFields.join(', ')}" ${verbForm} obbligator${
        isMultipleMissing ? 'i' : 'io'
      } e non ${isMultipleMissing ? 'possono' : 'può'} essere ${emptyForm}.`
    );
  }

  if (record.AN4 !== 'SI' && record.AN3 && !validateFiscalCode(record.AN3)) {
    errors.push('Il Codice Fiscale inserito è invalido.');
  }
  return errors;
};

export const generateServiceSection = (record: CSVRecord) => ({
  id: 'anagraphic-service-section',
  title: 'Informazioni sul servizio',
  properties: [
    { '22': [moment(record.SE1).format('YYYY-MM-DD')] },
    { '23': [record.SE2] },
    { '24': [record.SE3] },
    { '25': [record.SE4] },
    { '26': [record.SE5] },
    { '27': [record.SE6] },
    { '28': [record.SE7] },
  ],
});

export const generateExperienceSection = (record: CSVRecord) => ({
  id: 'content-service-section',
  title: 'Informazioni sull’esperienza',
  properties: [
    { '29': [record.ES1] },
    { '30': [record.ES2] },
    { '31': [record.ES3] },
    { '32': [record.ES4] },
    { '33': [record.ES5] },
    { '34': [record.ES6] },
  ],
});

export const ageCategoryMap: { [key: string]: number } = {
  'da 18 a 29': 1,
  'da 30 a 54': 2,
  'da 55 a 74': 3,
  '75 e oltre': 4,
};
