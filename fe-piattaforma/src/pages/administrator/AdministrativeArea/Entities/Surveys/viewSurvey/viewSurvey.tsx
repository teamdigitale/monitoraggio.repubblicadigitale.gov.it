import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import moment from 'moment/moment';
import DetailLayout from '../../../../../../components/DetailLayout/detailLayout';
import { OptionType } from '../../../../../../components/Form/select';
import {
  selectQuestionarioTemplateSnapshot,
  selectServiceQuestionarioTemplateIstanze,
  selectServices,
} from '../../../../../../redux/features/administrativeArea/administrativeAreaSlice';
import {
  GetCompiledSurveyCitizenService,
  GetServicesDetail,
} from '../../../../../../redux/features/administrativeArea/services/servicesThunk';
import { SurveySectionPayloadI } from '../../../../../../redux/features/administrativeArea/surveys/surveysSlice';
import { setInfoIdsBreadcrumb } from '../../../../../../redux/features/app/appSlice';
import { useAppSelector } from '../../../../../../redux/hooks';
import { formatAndParseJsonString } from '../../../../../../utils/common';
import { FormI } from '../../../../../../utils/formHelper';
import { generateForm } from '../../../../../../utils/jsonFormHelper';
import JsonFormRender from '../components/jsonFormRender';

// Separatore embedded usato dal BE per concatenare piu' voci in un singolo
// elemento di un array di risposta (legacy CSV-import + alcuni questionari).
const SECTION_SIGN = '§';

// Coppie (sectionKey, questionId) delle domande sensibili che richiedono
// mascheramento del valore. Estratte come costanti per evitare stringhe magiche
// nel branching della normalizzazione.
const SENSITIVE_QUESTIONS = {
  CODICE_FISCALE: { section: '2', question: '4' },
  NUMERO_DOCUMENTO: { section: '4', question: '6' },
  // Caso particolare: per (2, 31) il valore mascherato deriva dal primo
  // elemento dell'array originale, non dal frammento split su §.
  SECTION_2_Q31_RAW: { section: '2', question: '31' },
} as const;

// Etichette usate sia come marker nei dati BE sia come valori restituiti al FE.
const PRIVACY_LABELS = {
  CODICE_FISCALE_NON_DISPONIBILE: 'Codice fiscale non disponibile',
  CODICE_FISCALE_NASCOSTO: 'Codice fiscale disponibile ma non visualizzabile',
  NUMERO_DOCUMENTO_NON_DISPONIBILE: 'Numero documento non disponibile',
  NUMERO_DOCUMENTO_NASCOSTO:
    'Numero documento disponibile ma non visualizzabile',
  CODICE_FISCALE_NASCOSTO_STRING_BRANCH:
    'Codice Fiscale disponibile ma non visualizzabile',
} as const;

// Chiavi usate nel ramo "string-encoded" della section (quando properties[key]
// arriva come stringa JSON encoded).
const STRING_BRANCH_KEYS = {
  CODICE_FISCALE: '1',
  NUMERO_DOCUMENTO: '4',
} as const;

const isSensitiveMatch = (
  pair: { section: string; question: string },
  sectionKey: string,
  questionId: string
) => pair.section === sectionKey && pair.question === questionId;

/** Converte un valore in stringa e sostituisce § con , (separatore visivo). */
const sanitizeValue = (value: unknown): string =>
  (value ?? '').toString().replaceAll(SECTION_SIGN, ',');

/**
 * Applica il mascheramento privacy a un singolo frammento di risposta
 * (ottenuto dallo split su §) in base alla coppia (sectionKey, questionId).
 * `rawAnswers` serve come fallback per il caso particolare (2, 31).
 */
const maskPrivacyForFragment = (
  sectionKey: string,
  questionId: string,
  fragment: string,
  rawAnswers: unknown[]
): string => {
  if (isSensitiveMatch(SENSITIVE_QUESTIONS.CODICE_FISCALE, sectionKey, questionId)) {
    return fragment === PRIVACY_LABELS.CODICE_FISCALE_NON_DISPONIBILE
      ? sanitizeValue(fragment)
      : PRIVACY_LABELS.CODICE_FISCALE_NASCOSTO;
  }
  if (isSensitiveMatch(SENSITIVE_QUESTIONS.NUMERO_DOCUMENTO, sectionKey, questionId)) {
    return fragment === PRIVACY_LABELS.NUMERO_DOCUMENTO_NON_DISPONIBILE
      ? sanitizeValue(fragment)
      : PRIVACY_LABELS.NUMERO_DOCUMENTO_NASCOSTO;
  }
  if (isSensitiveMatch(SENSITIVE_QUESTIONS.SECTION_2_Q31_RAW, sectionKey, questionId)) {
    return sanitizeValue(rawAnswers?.[0]);
  }
  return sanitizeValue(fragment);
};

/**
 * Estrae i valori da un payload "object-like": properties[key] e' un dizionario
 * { questionId: string[] }. Per ogni domanda, se ci sono piu' risposte le
 * sanitizza tutte; altrimenti splitta sull'unico elemento sul carattere § e
 * applica il mascheramento privacy fragment-by-fragment.
 */
const extractFromObjectValue = (
  sectionKey: string,
  questionsMap: Record<string, unknown[]>
): Record<string, string | string[]> => {
  const out: Record<string, string | string[]> = {};
  Object.entries(questionsMap).forEach(([questionId, answers]) => {
    const safeAnswers = answers ?? [];
    if (safeAnswers.length > 1) {
      // Risposta multi-valore: nessun mascheramento, solo sanitize di ciascuno.
      out[questionId] = safeAnswers.map(sanitizeValue);
      return;
    }
    // Risposta singola: [0] puo' essere undefined se array vuoto, gestito da
    // sanitizeValue tramite ?? ''. Lo splittiamo su § per gestire i payload
    // legacy multi-voce concatenati e applichiamo il mascheramento privacy.
    out[questionId] = (safeAnswers[0] ?? '')
      .toString()
      .split(SECTION_SIGN)
      .map((fragment) =>
        maskPrivacyForFragment(sectionKey, questionId, fragment, safeAnswers)
      );
  });
  return out;
};

/**
 * Estrae i valori da un payload "string-encoded" (properties[key] arrivata come
 * stringa JSON con apici singoli). Decodifica, normalizza gli apici, parsa e
 * applica il mascheramento privacy sui campi sensibili.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const extractFromStringValue = (encoded: string): Record<string, any> => {
  const parsed = JSON.parse(decodeURI(encoded).replaceAll("'", '"'));
  if (parsed?.[STRING_BRANCH_KEYS.CODICE_FISCALE]) {
    parsed[STRING_BRANCH_KEYS.CODICE_FISCALE][0] =
      parsed[STRING_BRANCH_KEYS.CODICE_FISCALE][0] !== ''
        ? PRIVACY_LABELS.CODICE_FISCALE_NASCOSTO_STRING_BRANCH
        : PRIVACY_LABELS.CODICE_FISCALE_NON_DISPONIBILE;
  } else if (parsed?.[STRING_BRANCH_KEYS.NUMERO_DOCUMENTO]) {
    parsed[STRING_BRANCH_KEYS.NUMERO_DOCUMENTO][0] =
      parsed[STRING_BRANCH_KEYS.NUMERO_DOCUMENTO][0] !== ''
        ? PRIVACY_LABELS.NUMERO_DOCUMENTO_NASCOSTO
        : PRIVACY_LABELS.NUMERO_DOCUMENTO_NON_DISPONIBILE;
  }
  return parsed;
};

const ViewSurvey: React.FC = () => {
  const dispatch = useDispatch();
  const { serviceId, idQuestionarioCompilato } = useParams();
  const [sections, setSections] = useState<SurveySectionPayloadI[]>([]);
  const surveyStore: string | SurveySectionPayloadI[] = useAppSelector(
    selectQuestionarioTemplateSnapshot
  )?.sezioniQuestionarioTemplate;
  const compiledSurveyCitizen = useAppSelector(
    selectServiceQuestionarioTemplateIstanze
  );
  const serviceDetails = useAppSelector(selectServices)?.detail;
  const [arrayForms, setArrayForms] = useState<FormI[]>([]);

  useEffect(() => {
    // For breadcrumb
    if (serviceId && serviceDetails?.dettaglioServizio?.nomeServizio) {
      dispatch(
        setInfoIdsBreadcrumb({
          id: serviceId,
          nome: serviceDetails?.dettaglioServizio?.nomeServizio,
        })
      );
    }
  }, [serviceId, serviceDetails]);

  useEffect(() => {
    // se refresh get service detail & risposte compilato
    dispatch(GetServicesDetail(serviceId));
    if (idQuestionarioCompilato)
      dispatch(GetCompiledSurveyCitizenService(idQuestionarioCompilato));
  }, []);

  useEffect(() => {
    if (surveyStore?.length && typeof surveyStore !== 'string')
      setSections(surveyStore); // le sezioni sono del questionario associato al servizio
  }, [surveyStore]);

  const getValuesSurvey = (section: {
    id: string;
    properties: any;
    title: string;
  }): Record<string, unknown> => {
    // Il payload puo' arrivare gia' "unwrapped" (solo properties) oppure col
    // wrapper { id, properties, title }: in entrambi i casi serve iterare sulle
    // sezioni del dizionario di domande.
    const sectionsMap = section?.properties || section;
    if (!sectionsMap || typeof sectionsMap !== 'object') {
      return {};
    }

    const result: Record<string, unknown> = {};
    Object.entries(sectionsMap).forEach(([sectionKey, rawValue]) => {
      if (rawValue && typeof rawValue === 'object') {
        // Ramo principale: la sezione e' un dizionario { questionId: string[] }.
        Object.assign(
          result,
          extractFromObjectValue(sectionKey, rawValue as Record<string, unknown[]>)
        );
        return;
      }
      if (typeof rawValue === 'string') {
        // Ramo legacy: la sezione arriva serializzata come stringa JSON.
        try {
          Object.assign(result, extractFromStringValue(rawValue));
        } catch (e) {
          // Payload malformato: log e prosegui con le altre sezioni.
          console.warn('getValuesSurvey: parsing stringa fallito', e);
        }
      }
    });
    return result;
  };

  useEffect(() => {
    const forms: FormI[] = [];
    // create form and prefill the sections
    if (sections?.length) {
      (sections || []).map((section: SurveySectionPayloadI, index: number) => {
        const newForm = generateForm(
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          JSON.parse(section.schema?.json),
          true
        );
        if (newForm['18']?.options) {
          newForm['18'].options = newForm['18']?.options?.map(
            (opt: OptionType) => ({
              label: opt.label,
              value: opt.value.toString().toUpperCase(),
            })
          );
        }
        if (
          compiledSurveyCitizen?.length &&
          compiledSurveyCitizen?.[index]?.domandaRisposta?.json
        ) {
          const sectionParsed: {
            id: string;
            properties: { [key: string]: string[] };
            title: string;
          } = formatAndParseJsonString(
            compiledSurveyCitizen?.[index]?.domandaRisposta?.json
          );
          // Il tipo reale e' { [questionId]: string | string[] }: alcune
          // risposte multi-valore arrivano come array. Manteniamo unknown e
          // facciamo cast nei punti specifici (es. .toString() su key 19).
          const values: Record<string, unknown> =
            getValuesSurvey(sectionParsed);
          Object.keys(newForm).map((key: string) => {
            // I valori possibili sono string o string[] (vedi return type di
            // getValuesSurvey): entrambi assegnabili a formFieldI['value'].
            newForm[key].value = values[key] as string | string[];
            if (key === '19') {
              newForm[key].value =
                moment(values[key]?.toString(), 'DD-MM-YYYY').format(
                  'DD-MM-YYYY'
                ) || '';
            }
          });
        }
        forms.push(newForm);
      });
    }
    setArrayForms(forms);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sections, compiledSurveyCitizen]);

  return (
    <div className='mb-5 container'>
      <div className='container'>
        <DetailLayout
          titleInfo={{
            title:
              serviceDetails?.questionarioTemplateSnapshot?.nomeQuestionarioTemplate?.toString(),
            status: '',
            upperTitle: { icon: 'it-file', text: 'Questionario' },
          }}
          buttonsPosition='BOTTOM'
          goBackTitle='Cittadini partecipanti'
          goBackPath={`/area-amministrativa/servizi/${serviceId}/cittadini`}
        />
        {sections?.length
          ? sections.map((section: SurveySectionPayloadI, index: number) => (
              <>
                <p
                  className={clsx(
                    'h5',
                    'primary-color',
                    'lightgrey-bg-c2',
                    'mb-4',
                    'mt-3',
                    'p-3',
                    'font-weight-bold'
                  )}
                >
                  {section.titolo}
                </p>
                <JsonFormRender form={arrayForms[index]} viewMode />
              </>
            ))
          : null}
      </div>
    </div>
  );
};

export default ViewSurvey;
