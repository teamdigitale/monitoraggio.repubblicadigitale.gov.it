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
  sanitizeFields,
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
  checkMapSpaces,
  excelSerialDateToJSDate,
  excelSerialTimeToHHMM,
} from '../utils/csvUtils';
import {
  ageGroupMap,
  bookingReasonMap,
  citizenshipMap,
  discoveryMethodServiceMap,
  educationLevelMap,
  occupationalStatusMap,
  repeatExperienceMap,
  serviceNameMap,
} from '../utils/ResponseCodeMappings';
import * as CodiceFiscaleUtils from '@marketto/codice-fiscale-utils';
import IPersonalInfo from '@marketto/codice-fiscale-utils/src/interfaces/personal-info.interface';
import * as XLSX from 'xlsx';
import { useAppSelector } from '../redux/hooks';
import { selectProjects } from '../redux/features/administrativeArea/administrativeAreaSlice';
import { policy } from '../pages/administrator/AdministrativeArea/Entities/utils';

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

export function useFileProcessor(file: File | undefined, removeFile: () => void) {
  const { isValidFiscalCode } = useFiscalCodeValidation();
  const [isProcessing, setIsProcessing] = useState(false);
  const projectDetail = useAppSelector(selectProjects).detail?.dettagliInfoProgetto;

  const handleExcelFileUpload = (file: File): Promise<CSVRecord[]> => {
    return new Promise((resolve, reject) => {
      if (file) {
        const reader = new FileReader();

        reader.onload = (e) => {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData: CSVRecord[] = XLSX.utils.sheet_to_json(worksheet, {
            header: 1,
            defval: '',
            blankrows: false,
          });

          const mappedData: CSVRecord[] = jsonData.slice(3).map((row: any) => {
            // salto le prime 3 righe che contengono intestazioni
            const record: CSVRecord = {} as CSVRecord;
            headersCSV.forEach((key, index) => {
              record[key] = row[index]?.toString() || '';
            });
            return record;
          });
          resolve(mappedData);
        };

        reader.onerror = (e) => {
          reject(e);
        };

        reader.readAsArrayBuffer(file);
      } else {
        reject(new Error('Nessun file selezionato'));
      }
    });
  };

  const processFile = useCallback(async () => {
    return new Promise<ElaboratoCsvRequest>(async (resolve, reject) => {
      function rejectWithMessage(message: string) {
        setIsProcessing(false);
        reject({ message });
      }

      if (file) {
        setIsProcessing(true);
        const fileExtension = file.name.split('.').pop()?.toLowerCase();

        if (fileExtension === 'csv') {
          if (projectDetail?.policy == policy.RFD) {
            Papa.parse<CSVRecord>(file, {
              header: true,
              quoteChar: '"',
              escapeChar: '"',
              skipEmptyLines: true,
              complete: (results: Papa.ParseResult<CSVRecord>) => {
                // if(results.data.length > 3000) {
                //   rejectWithMessage(
                //     "Visto l'elevato numero di caricamenti odierni, ti chiediamo di inserire file contenenti un massimo di 3000 righe"
                //   );
                //   return;
                // }

                if (!headersCSV.every((header) => header in results.data[0])) {
                  rejectWithMessage(
                    'Il file inserito non é conforme ai criteri di elaborazione, assicurati che tutte le colonne siano presenti.'
                  );
                  return;
                }

                for (let r in results.data) {
                  if (
                    Object.keys(headersCSV).length !=
                    Object.keys(results.data[r]).length
                  ) {
                    rejectWithMessage(
                      'Il file inserito non é conforme ai criteri di elaborazione, assicurati che tutte le colonne siano presenti.'
                    );
                    return;
                  }
                }

                const serviziValidati: ServiziElaboratiDto[] = [];
                const serviziScartati: ServiziElaboratiDto[] = [];
                const data: CSVRecord[] = results.data;

                if (data.length > 0) {
                  data.forEach((record: CSVRecord, index: number) => {
                    sanitizeFields(record);
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
                    checkMapSpaces(record, errors);
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
  
                    if ( filteredRecord.AN3 && !getAgeGroupCodeByYear(cfData.date)) {
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
                    estensioneInput: fileExtension
                  };
                  resolve(serviziElaborati);
                  setIsProcessing(false);
                } else {
                  rejectWithMessage(
                    'Il file inserito non é conforme ai criteri di elaborazione, assicurati che siano presenti dei dati da elaborare.'
                  );
                }
              },
              error: (error: Error) => {
                setIsProcessing(false);
                reject(error);
              },
            });
          } else {
            setIsProcessing(false);
            removeFile();
            rejectWithMessage(
              'Tipo file non supportato.'
            );
          }
          /*else {
            reject({
              message:
                "Nessun file selezionato. Si prega di caricare un file per procedere con l'elaborazione.",
            });
          }*/
        } else if (fileExtension === 'xlsx' || fileExtension === 'xls') {
          if (projectDetail?.policy == policy.SCD) {
            try {
              const excelData = await handleExcelFileUpload(file);
  
              const serviziValidati: ServiziElaboratiDto[] = [];
              const serviziScartati: ServiziElaboratiDto[] = [];
  
              if (excelData.length > 0) {
                excelData.forEach((record: CSVRecord, index: number) => {
                  sanitizeFields(record);
                  const { AN14: _AN14, AN17: _AN17, ...filteredRecord } = record;
                  filteredRecord.AN3 = filteredRecord.AN3.trim();
                  filteredRecord.SE1 = excelSerialDateToJSDate(Number(filteredRecord.SE1));
                  //filteredRecord.SE2 = excelSerialTimeToHHMM(filteredRecord.SE2);
                  const { rejectedTypes } = generateServiceName(filteredRecord.SE3);
                  const errors = validateFields(
                    filteredRecord,
                    isValidFiscalCode
                  );
                  checkMapValues(record, errors);
                  checkMapSpaces(record, errors);
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

                if ( filteredRecord.AN3 && !getAgeGroupCodeByYear(cfData.date)) {
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
                  estensioneInput: fileExtension
                };
                resolve(serviziElaborati);
                setIsProcessing(false);
              } else {
                rejectWithMessage(
                  'Il file inserito non è conforme ai criteri di elaborazione, assicurati che siano presenti dei dati da elaborare.'
                );
              }
            } catch (error) {
              setIsProcessing(false);
              reject(error);
            }
          }else{
            setIsProcessing(false);
            removeFile();
            rejectWithMessage(
              'Tipo file non supportato.'
            );
          }
        } else {
          rejectWithMessage(
            'Formato di file non supportato. Si prega di caricare un file CSV o XLSX.'
          );
        }
      } else {
        reject({
          message:
            "Nessun file selezionato. Si prega di caricare un file per procedere con l'elaborazione.",
        });
      }
    });
  }, [file, isValidFiscalCode, projectDetail]);

  return {
    processFile,
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
    const errorNotes = errors.length > 0 ? errors.join('- ') : '';
    const tipoDiServizioPrenotato: string[] = mapKeysToServiceNames(
      filteredRecord.SE3
    );

    const ageGroup = getAgeGroupCodeByYear(cfData.date);
    const parsedDate = moment(filteredRecord.SE1);
    return {
      servizioRequest: {
        nomeServizio: serviceName,
        data: parsedDate.isValid() ? parsedDate.format('YYYY-MM-DD') : null,
        durataServizio: filteredRecord.SE2.trim().substring(0, 5),
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
        competenzeTrattateSecondoLivello: filteredRecord.SE5,
        ambitoServiziDigitaliTrattati: filteredRecord.SE6,
        descrizioneDettagliServizio: filteredRecord.SE7,
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
        risoluzioneProblemiDigitali: filteredRecord.ES5,
        valutazioneInStelle: filteredRecord.ES6,
        numeroRiga: rowIndex,
      },
    };
  }
}
