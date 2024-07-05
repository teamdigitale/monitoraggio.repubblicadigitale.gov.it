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
import {
  downloadActivityReportResume,
  generateDownloadPUActivityReport,
} from '../services/activityReportService';
import { cutValueAfterRange, downloadGeneratedFile } from './common';
import { RegistroAttivita } from '../models/RegistroAttivita.model';
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
    E: 'Altro',
  };

  const date = moment().format('YYYYMMDD');
  const serviceTypes = serviceTypeString.split(':').map((type) => type.trim());
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

const maxDate = moment('2024-05-31', 'YYYY-MM-DD');

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
  const mandatoryStartFields = [...mandatoryFields];

  const missingFields = mandatoryStartFields.filter(
    (field) =>
      !record[field as keyof CSVRecord] ||
      record[field as keyof CSVRecord] === ''
  );

  if (missingFields.length > 0) {
    const isMultipleMissing = missingFields.length > 1;
    const fieldText = isMultipleMissing ? 'I campi' : 'Il campo';
    const verbForm = isMultipleMissing ? 'sono' : "e'";
    const emptyForm = isMultipleMissing ? 'vuoti' : 'vuoto';
    errors.push(
      `${fieldText} "${missingFields.join(', ')}" ${verbForm} obbligator${
        isMultipleMissing ? 'i' : 'io'
      } e non ${isMultipleMissing ? 'possono' : 'puo'} essere ${emptyForm}.`
    );
  }

  if (record.AN3 && !validateFiscalCode(record.AN3)) {
    errors.push("Il Codice Fiscale inserito e' invalido.");
  }
  if (record.SE1) {
    const parsedDate = moment(record.SE1);
    if (!parsedDate.isValid()) {
      errors.push("La data inserita per il servizio non e' valida.");
    } else if (parsedDate.isAfter(maxDate)) {
      errors.push("La data del servizio e' successiva al 31 Maggio 2024.");
    }
  }

  if (record.SE2) {
    if (record.SE2.length >= 5) {
      const valoreDurataServizio = record.SE2.trim().substring(0, 5);
      console.log(valoreDurataServizio);
      if (
        !containsOnlyNumber(valoreDurataServizio.substring(0, 1)) ||
        !containsOnlyNumber(valoreDurataServizio.substring(1, 2)) ||
        valoreDurataServizio.substring(2, 3) !== ':' ||
        !containsOnlyNumber(valoreDurataServizio.substring(3, 4)) ||
        !containsOnlyNumber(valoreDurataServizio.substring(4, 5))
      ) {
        errors.push(
          'Il formato del campo SE2 non rispetta i criteri di formattazione'
        );
      }
    } else {
      errors.push(
        'Il formato del campo SE2 non rispetta i criteri di formattazione'
      );
    }
  }

  if (record.SE7) record.SE7 = cutValueAfterRange(record.SE7, 600);
  if (record.ES4) record.ES4 = cutValueAfterRange(record.ES4, 600);

  return errors;
};

export function containsOnlyNumber(value: string): boolean {
  return value >= '0' && value <= '9';
}

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
            .split(':')
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

export function checkMapSpaces(record: CSVRecord, errors: string[]) {
  const mapFields = [
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

  mapFields.forEach(({ key }) => {
    const fieldValue = record[key];
    if (fieldValue !== undefined && fieldValue !== null && fieldValue !== '') {
      let splittedValues = fieldValue.split(':')
      let hasSpace = splittedValues.some((value: string) => value.includes(' '))
      if (hasSpace) {
        errors.push(
          `Il campo "${key}" non risulta formattato correttamente.`
        );
      }
    }
  });
}

export function generateDescriptionFromMappedValues(
  value: string | undefined,
  map: { [key: string]: string }
): string {
  if (!value) return '';

  const values = value.split(':').map((value) => value.trim());
  return values
    .map((value) => map[value] || '')
    .filter((value) => value)
    .join(': ');
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
  const keys = keysString.split(':');
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
  const SE5Values = SE5.split(':');
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
    .join(': ');
}

export function downloadResume(activityReport: RegistroAttivita) {
  generateDownloadPUActivityReport(activityReport.id)
    .then((presignedUrl) => {
      return downloadActivityReportResume(presignedUrl.data.uri);
    })
    .then((res) => downloadFile(res.data, activityReport.fileName as string));
}

function downloadFile(f: string, name: string) {
  downloadGeneratedFile(new File([new Blob([f])], name));
}

export const mapRule = new Map<string, string>([
  ['DEG', 'DELEGATO ENTE GESTORE PROGRAMMA'],
  ['DEGP', 'DELEGATO ENTE GESTORE PROGETTO'],
  ['DEPP', 'DELEGATO ENTE PARTNER'],
  ['DSCU', 'DPGSCU'],
  ['DTD', 'DTD AMMINISTRATORE'],
  ['FAC', 'FACILITATORE'],
  ['MOD', 'MODERATORE'],
  ['REG', 'REFERENTE ENTE GESTORE PROGRAMMA'],
  ['REGP', 'REFERENTE ENTE GESTORE PROGETTO'],
  ['REPP', 'REFERENTE ENTE PARTNER'],
  ['VOL', 'VOLONTARIO'],
]);
