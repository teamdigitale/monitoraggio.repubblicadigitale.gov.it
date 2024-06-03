import moment from 'moment';
import { CSVRecord } from '../models/RecordCSV.model';
import {
  ageGroupMap,
  bookingReasonMap,
  citizenshipMap,
  digitalProblemSolvingMap,
  discoveryMethodServiceMap,
  documentTypeMap,
  educationLevelMap,
  firstLevelCompetenceMap,
  genderMap,
  occupationalStatusMap,
  publicServiceDomainMap,
  repeatExperienceMap,
  secondLevelCompetenceMap,
  serviceBookingTypeMap,
  serviceNameMap,
} from './ResponseCodeMappings';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const AES256 = require('aes-everywhere');

export const generateServiceName = (
  serviceTypeString: string
): { serviceName: string; rejectedTypes: string[] } => {
  const serviceAbbreviations: { [key: string]: string } = {
    A: 'facind',
    B: 'facgru',
    C: 'forminp',
    D: 'formind',
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
  'AN1',
  'AN2',
  'AN3',
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

    if (filteredRecord.AN5) {
      tipoDocumento = documentTypeMap[filteredRecord.AN5];
    }
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
  if (
    record.AN4 === 'SI' &&
    (!record.AN5 ||
      record.AN5.trim() === '' ||
      !record.AN6 ||
      record.AN6.trim() === '')
  ) {
    mandatoryStartFields = mandatoryStartFields.filter((val) => val !== 'AN3');
  }

  if (record.AN4 === 'SI') {
    if (!mandatoryStartFields.includes('AN5')) {
      mandatoryStartFields.push('AN5');
    }
    if (!mandatoryStartFields.includes('AN6')) {
      mandatoryStartFields.push('AN6');
    }
  } else if (record.AN4 === 'NO' && !mandatoryStartFields.includes('AN3')) {
    mandatoryStartFields.push('AN3');
  }

  const missingFields = mandatoryStartFields.filter(
    (field) =>
      !record[field as keyof CSVRecord] ||
      record[field as keyof CSVRecord] === ''
  );

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
  if (record.SE7 && record.SE7.length > 600) {
    errors.push(
      'Il limite massimo per la descrizione del servizio é di 600 caratteri.'
    );
  }

  return errors;
};

export function checkMapValues(record: CSVRecord, errors: string[]) {
  const mapFields = [
    { key: 'AN5', map: documentTypeMap },
    { key: 'AN7', map: genderMap },
    { key: 'AN8', map: ageGroupMap },
    { key: 'AN9', map: educationLevelMap },
    { key: 'AN10', map: occupationalStatusMap },
    { key: 'AN11', map: citizenshipMap },
    { key: 'SE3', map: serviceNameMap, multi: true },
    { key: 'SE4', map: firstLevelCompetenceMap, multi: true },
    { key: 'SE5', map: secondLevelCompetenceMap, multi: true },
    { key: 'SE6', map: publicServiceDomainMap, multi: true },
    { key: 'PR2', map: serviceBookingTypeMap, multi: true },
    { key: 'ES1', map: discoveryMethodServiceMap, multi: true },
    { key: 'ES2', map: bookingReasonMap, multi: true },
    { key: 'ES3', map: repeatExperienceMap, multi: true },
    { key: 'ES5', map: digitalProblemSolvingMap, multi: true },
  ];

  mapFields.forEach(({ key, map, multi }) => {
    const fieldValue = record[key];
    if (fieldValue !== undefined && fieldValue !== null && fieldValue !== '') {
      const values = multi
        ? fieldValue
            .split(';')
            .map((value: string) => value.trim())
            .filter((value: string) => value !== '')
        : [fieldValue.trim()];

      const invalidValues = values.filter((value: string) => !map[value]);

      if (invalidValues.length > 0) {
        invalidValues.forEach((value: string) => {
          errors.push(
            `Il valore "${value}" per il campo "${key}" non risulta una risposta valida.`
          );
        });
      }
    }
  });
}

export function generateDescriptionFromMappedValues(
  value: string | undefined,
  map: { [key: string]: string }
): string {
  if (!value) return '';

  const values = value.split(';').map((value) => value.trim());
  return values
    .map((value) => map[value] || '')
    .filter((value) => value)
    .join('; ');
}

export const generateServiceSection = (record: CSVRecord) => ({
  id: 'anagraphic-service-section',
  title: 'Informazioni sul servizio',
  properties: [
    { '22': [moment(record.SE1).format('YYYY-MM-DD')] },
    { '23': [record.SE2] },
    { '24': [generateDescriptionFromMappedValues(record.SE3, serviceNameMap)] },
    {
      '25': [
        generateDescriptionFromMappedValues(
          record.SE4,
          firstLevelCompetenceMap
        ),
      ],
    },
    {
      '26': [
        generateDescriptionFromMappedValues(
          record.SE5,
          secondLevelCompetenceMap
        ),
      ],
    },
    {
      '27': [
        generateDescriptionFromMappedValues(record.SE6, publicServiceDomainMap),
      ],
    },
    { '28': [record.SE7] },
  ],
});

export const generateExperienceSection = (record: CSVRecord) => ({
  id: 'content-service-section',
  title: 'Informazioni sull’esperienza',
  properties: [
    {
      '29': [
        generateDescriptionFromMappedValues(
          record.ES1,
          discoveryMethodServiceMap
        ),
      ],
    },
    {
      '30': [generateDescriptionFromMappedValues(record.ES2, bookingReasonMap)],
    },
    {
      '31': [
        generateDescriptionFromMappedValues(record.ES3, repeatExperienceMap),
      ],
    },
    { '32': [record.ES4] },
    {
      '33': [
        generateDescriptionFromMappedValues(
          record.ES5,
          digitalProblemSolvingMap
        ),
      ],
    },
    { '1663320201383': [record.ES6] },
  ],
});

export const mapKeysToServiceNames = (keysString: string): string[] => {
  const keys = keysString.split(';');
  return keys.map((key) => serviceNameMap[key.trim()] ?? '');
};

export function getAgeGroupCodeByYear(date?: Date): string | void {
  if (!date) return;

  const age = new Date().getFullYear() - date.getFullYear();
  if (age >= 18 && age <= 29) return 'A';
  if (age >= 30 && age <= 54) return 'B';
  if (age >= 55 && age <= 74) return 'C';
  if (age >= 75) return 'D';
}

export function getSE4ValueFromSE5Value(SE5: string): string {
  const SE5Values = SE5.split(';');
  const results = new Set<string>();
  SE5Values.forEach((value) => {
    const SE5Value = parseInt(value);
    if (SE5Value > 0 && SE5Value <= 3) {
      results.add('A');
    } else if (SE5Value > 3 && SE5Value <= 9) {
      results.add('B');
    } else if (SE5Value === 10) {
      results.add('C');
    } else if (SE5Value > 10 && SE5Value <= 12) {
      results.add('D');
    } else if (SE5Value === 13) {
      results.add('E');
    }
  });
  return [...results]
    .map((result: string) => firstLevelCompetenceMap[result])
    .join('; ');
}
