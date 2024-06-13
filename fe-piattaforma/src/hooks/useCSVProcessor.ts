import Papa from 'papaparse';
import { useCallback, useState } from 'react';
import { ServiziElaboratiDto } from '../models/ServiziElaboratiDto.model';
import { ElaboratoCsvRequest } from '../models/ElaboratoCsvRequest.model';
import { useFiscalCodeValidation } from './useFiscalCodeValidation';
import { getUserHeaders } from '../redux/features/user/userThunk';
import moment from 'moment';
import { CSVRecord } from '../models/RecordCSV.model';
import {
  checkMapValues,
  encryptDocumentAndDetermineType,
  encryptFiscalCode,
  generateExperienceSection,
  generateServiceName,
  generateServiceSection,
  generateDescriptionFromMappedValues,
  mapKeysToServiceNames,
  validateFields,
  getSE4ValueFromSE5Value,
  getAgeGroupCodeByYear,
} from '../utils/csvUtils';
import {
  ageGroupMap,
  bookingReasonMap,
  citizenshipMap,
  discoveryMethodServiceMap,
  educationLevelMap,
  occupationalStatusMap,
  repeatExperienceMap,
  secondLevelCompetenceMap,
  serviceNameMap,
} from '../utils/ResponseCodeMappings';
import * as CodiceFiscaleUtils from '@marketto/codice-fiscale-utils';
import IPersonalInfo from '@marketto/codice-fiscale-utils/src/interfaces/personal-info.interface';
const {
  idProgetto,
  idEnte,
  codiceRuoloUtenteLoggato,
  cfUtenteLoggato,
  idProgramma,
} = getUserHeaders();

const headersCSV = [
  'IDFacilitatore',
  'NominativoFacilitatore',
  'IDSede',
  'NominativoSede',
  'AN1',
  'AN2',
  'AN3',
  'AN4',
  'AN5',
  'AN6',
  'AN7',
  'AN8',
  'AN9',
  'AN10',
  'AN11',
  'AN12',
  'AN14',
  'AN17',
  'PR1',
  'PR2',
  'SE1',
  'SE2',
  'SE3',
  'SE4',
  'SE5',
  'SE6',
  'SE7',
  'ES1',
  'ES2',
  'ES3',
  'ES4',
  'ES5',
  'ES6',
];

export function useCSVProcessor(file: File | undefined) {
  const { isValidFiscalCode } = useFiscalCodeValidation();
  const [isProcessing, setIsProcessing] = useState(false);
  const processCSV = useCallback(() => {
    return new Promise<ElaboratoCsvRequest>((resolve, reject) => {
      function rejectWithMessage(message: string) {
        setIsProcessing(false);
        reject({ message });
      }

      if (file) {
        setIsProcessing(true);
        Papa.parse<CSVRecord>(file, {
          header: true,
          skipEmptyLines: true,
          complete: (results: Papa.ParseResult<CSVRecord>) => {
            if (!headersCSV.every((header) => header in results.data[0])) {
              rejectWithMessage(
                'Il file inserito non é conforme ai criteri di elaborazione, assicurati che tutte le colonne siano presenti.'
              );
            } else {
              const serviziValidati: ServiziElaboratiDto[] = [];
              const serviziScartati: ServiziElaboratiDto[] = [];
              const data: CSVRecord[] = results.data;
              if (data.length > 0) {
                data.forEach((record: CSVRecord, index: number) => {
                  const {
                    AN14: _AN14,
                    AN17: _AN17,
                    ...filteredRecord
                  } = record;
                  filteredRecord.AN3 = filteredRecord.AN3.trim();
                  const { rejectedTypes } = generateServiceName(
                    filteredRecord.SE3
                  );
                  const errors = validateFields(
                    filteredRecord,
                    isValidFiscalCode
                  );
                  checkMapValues(record, errors);
                  if (
                    rejectedTypes.length > 0 &&
                    filteredRecord.SE3 &&
                    filteredRecord.SE3.trim() !== ''
                  ) {
                    errors.push(
                      `Servizio non riconosciuto nel campo SE3: ${rejectedTypes.join(
                        ', '
                      )}. Assicurati che i tipi di servizio inseriti siano corretti`
                    );
                  }

                  const cfData: IPersonalInfo =
                    CodiceFiscaleUtils.Parser.cfDecode(filteredRecord.AN3);

                  if (!getAgeGroupCodeByYear(cfData.date)) {
                    errors.push('Il cittadino deve essere maggiorenne.');
                  }

                  const isValidFields = errors.length === 0;
                  const servizioElaborato: ServiziElaboratiDto =
                    mappingDatiElaborati(
                      filteredRecord,
                      errors,
                      index + 1,
                      cfData
                    );
                  if (isValidFields && rejectedTypes.length === 0) {
                    serviziValidati.push(servizioElaborato);
                  } else {
                    serviziScartati.push(servizioElaborato);
                  }
                });
                const serviziElaborati: ElaboratoCsvRequest = {
                  serviziValidati: serviziValidati,
                  serviziScartati: serviziScartati,
                };
                resolve(serviziElaborati);
                setIsProcessing(false);
              } else {
                rejectWithMessage(
                  'Il file inserito non é conforme ai criteri di elaborazione, assicurati che siano presenti dei dati da elaborare.'
                );
              }
            }
          },
          error: (error: Error) => {
            setIsProcessing(false);
            reject(error);
          },
        });
      } else {
        reject({
          message:
            "Nessun file selezionato. Si prega di caricare un file per procedere con l'elaborazione.",
        });
      }
    });
  }, [file, isValidFiscalCode]);

  return {
    processCSV,
    isProcessing,
  };

  function mappingDatiElaborati(
    filteredRecord: CSVRecord,
    errors: string[],
    rowIndex: number,
    cfData: IPersonalInfo
  ): ServiziElaboratiDto {
    const sezioneQuestionarioCompilatoQ3 =
      generateServiceSection(filteredRecord);
    const sezioneQ4Questionario = generateExperienceSection(filteredRecord);
    const encryptedFiscalCode = encryptFiscalCode(filteredRecord);
    const documentDetails = encryptDocumentAndDetermineType(
      filteredRecord,
      encryptedFiscalCode
    );
    const { serviceName } = generateServiceName(filteredRecord.SE3);
    const errorNotes = errors.length > 0 ? errors.join(', ') : '';
    const tipoDiServizioPrenotato: string[] = mapKeysToServiceNames(
      filteredRecord.SE3
    );

    const ageGroup = getAgeGroupCodeByYear(cfData.date);
    const parsedDate = moment(filteredRecord.SE1, 'DD/MM/YYYY');
    return {
      servizioRequest: {
        nomeServizio: serviceName,
        data: parsedDate.isValid() ? parsedDate.format('YYYY-MM-DD') : null,
        durataServizio: filteredRecord.SE2,
        idEnteServizio: idEnte,
        idProgetto: idProgetto,
        idEnte: idEnte,
        idProgramma: idProgramma,
        cfUtenteLoggato: cfUtenteLoggato,
        codiceRuoloUtenteLoggato: codiceRuoloUtenteLoggato,
        idSedeServizio: Number(filteredRecord.IDSede),
        tipoDiServizioPrenotato: tipoDiServizioPrenotato,
        sezioneQuestionarioCompilatoQ3: JSON.stringify(
          sezioneQuestionarioCompilatoQ3
        ),
      },
      nuovoCittadinoServizioRequest: {
        cfUtenteLoggato: cfUtenteLoggato,
        codiceFiscale: encryptedFiscalCode,
        codiceFiscaleNonDisponibile: filteredRecord.AN4 === 'SI',
        numeroDocumento: '',
        tipoDocumento: documentDetails.tipoDocumento,
        idEnte: idEnte,
        idProgetto: idProgetto,
        idProgramma: idProgramma,
        genere: cfData.gender ?? '',
        fasciaDiEtaId: ageGroupMap[ageGroup ?? -1],
        titoloStudio: educationLevelMap[filteredRecord.AN9],
        statoOccupazionale: occupationalStatusMap[filteredRecord.AN10],
        provinciaDiDomicilio: filteredRecord.AN12,
        cittadinanza: citizenshipMap[filteredRecord.AN11],
        nuovoCittadino: false,
      },
      questionarioCompilatoRequest: {
        cfUtenteLoggato: cfUtenteLoggato,
        codiceRuoloUtenteLoggato: codiceRuoloUtenteLoggato,
        sezioneQ4Questionario: JSON.stringify(sezioneQ4Questionario),
      },
      campiAggiuntiviCSV: {
        note: errorNotes,
        idFacilitatore: filteredRecord.IDFacilitatore,
        nominativoFacilitatore: filteredRecord.NominativoFacilitatore,
        nominativoSede: filteredRecord.NominativoSede,
        tipologiaServiziPrenotato: generateDescriptionFromMappedValues(
          filteredRecord.SE3,
          serviceNameMap
        ),
        competenzeTrattatePrimoLivello: getSE4ValueFromSE5Value(
          filteredRecord.SE5
        ),
        competenzeTrattateSecondoLivello: generateDescriptionFromMappedValues(
          filteredRecord.SE5,
          secondLevelCompetenceMap
        ),
        modalitaConoscenzaServizioPrenotato:
          generateDescriptionFromMappedValues(
            filteredRecord.ES1,
            discoveryMethodServiceMap
          ),
        motivoPrenotazione: generateDescriptionFromMappedValues(
          filteredRecord.ES2,
          bookingReasonMap
        ),
        primoUtilizzoServizioFacilitazione: '',
        serviziPassatiFacilitazione: '',
        valutazioneRipetizioneEsperienza: generateDescriptionFromMappedValues(
          filteredRecord.ES3,
          repeatExperienceMap
        ),
        ambitoFacilitazioneFormazioneInteressato: filteredRecord.ES4 || '',
        numeroRiga: rowIndex,
      },
    };
  }
}
