import { Dispatch, Selector } from '@reduxjs/toolkit';
import API from '../../../../utils/apiHelper';
import { mapOptions } from '../../../../utils/common';
import {
  FormHelper,
  newForm,
  newFormField,
} from '../../../../utils/formHelper';
import { generateJsonFormSchema } from '../../../../utils/jsonFormHelper';
import { RegexpType } from '../../../../utils/validator';
import { RootState } from '../../../store';
import { hideLoader, showLoader } from '../../app/appSlice';
import {
  setEntityFilterOptions,
  setSurveysList,
  setSurveyDetail,
} from '../administrativeAreaSlice';
import {
  setSurveyInfoForm,
  setSurveyQuestion,
  setSurveySection,
  SurveyQuestionI,
  SurveySectionI,
} from './surveysSlice';
import { getUserHeaders } from '../../user/userThunk';

export interface SurveyLightI {
  id: string;
  nome: string;
  tipo: string;
  stato: string;
  defaultSCD: boolean;
  defaultRFD: boolean;
  descrizione: string;
  dataUltimaModifica: string;
}

// Changes in endpoints request and response may require changes in the actions below

const GetAllSurveysAction = { type: 'administrativeArea/getAllSurveys' };

export const GetAllSurveys =
  (isDetail?: boolean) => async (dispatch: Dispatch, select: Selector) => {
    try {
      dispatch(showLoader());
      // I dispatch this action because it has been done in other file
      // in the same place but I think it's not too useful (it is not managed by reducer),
      dispatch({ ...GetAllSurveysAction });
      const {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        administrativeArea: { filters, pagination },
      } = select((state: RootState) => state);
      const endpoint = '/questionarioTemplate/all';
      // const { codiceFiscale, codiceRuolo, idProgramma, idProgetto } =
      //   getUserHeaders();
      const body = {
        codiceFiscaleUtenteLoggato: 'UTENTE1', // TODO: aggiorna con variabile
        codiceRuoloUtenteLoggato: 'DTD', // TODO: aggiorna con variabile
        idProgetto: 0, // TODO: aggiorna con variabile
        idProgramma: 0, // TODO: aggiorna con variabile
      };
      let res;
      if (body) {
        res = await API.post(endpoint, body, {
          params: isDetail
            ? {}
            : {
                currPage: Math.max(0, pagination.pageNumber - 1),
                pageSize: pagination.pageSize,
                ...filters,
              },
        });
      }
      if (res?.data)
        dispatch(setSurveysList({ data: res.data.questionariTemplate }));
    } finally {
      dispatch(hideLoader());
    }
  };

const GetFilterValuesSurveyAction = {
  type: 'administrativeArea/getFilterValuesSurvey',
};

export const GetFilterValuesSurvey =
  (dropdownType: 'tipo' | 'stato') =>
  async (dispatch: Dispatch, select: Selector) => {
    try {
      dispatch(showLoader());
      dispatch({ ...GetFilterValuesSurveyAction });
      const {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        administrativeArea: { filters },
      } = select((state: RootState) => state);
      const { codiceFiscale, codiceRuolo, idProgramma } = getUserHeaders();
      const body = {
        cfUtente: codiceFiscale,
        codiceRuolo,
        filtroRequest: { ...filters },
        idProgramma,
      };
      const endpoint = `/questionario/${dropdownType}/dropdown`;
      const res = await API.post(endpoint, body);
      if (res.data)
        dispatch(
          setEntityFilterOptions({
            [dropdownType]: mapOptions(res.data.data.list),
          })
        );
    } catch (error) {
      console.log('GetFilterValuesAction error');
    } finally {
      dispatch(hideLoader());
    }
  };

const GetSurveyDetailAction = { type: 'administrativeArea/getSurveyDetail' };

export const GetSurveyDetail =
  (idSurvey: string) => async (dispatch: Dispatch) => {
    try {
      dispatch(showLoader());
      dispatch({ ...GetSurveyDetailAction });
      const res = await API.get(`questionari/${idSurvey}`);
      if (res.data) dispatch(setSurveyDetail(res.data));
    } catch (error) {
      console.log('GetSurveyDetail error', error);
    } finally {
      dispatch(hideLoader());
    }
  };

export const getTypeQuestionFirstSection = (id: string) => {
  switch (id) {
    case 'Nome':
    case 'Nazionalità':
    case 'Email':
    case 'Cognome':
    case 'Codice Fiscale':
    case 'Titolo di studio':
    case 'N Documento':
    case 'Occupazione':
      return 'text';
    case "Fascia d'età":
    case 'Telefono':
      return 'number';
    case 'Consenso al trattamento dati':
      return 'multiple';
    default:
      return '';
  }
};

export const newQuestion = (
  {
    id = new Date().getTime().toString(),
    form,
    name,
    type,
    isDefault,
    values,
  }: SurveyQuestionI = {
    id: new Date().getTime().toString(),
  }
) => ({
  id,
  form:
    form ||
    newForm([
      newFormField({
        field: 'question-description',
        required: true,
        value: name || '',
      }),
      newFormField({
        field: 'question-type',
        required: true,
        value: type || 'text',
      }),
      newFormField({
        field: 'question-values',
        value: values ? values : '',
      }),
      newFormField({
        field: 'question-required',
        value: isDefault || false,
      }),
      newFormField({
        field: 'question-default',
        value: isDefault || false,
        regex: RegexpType.BOOLEAN,
      }),
    ]),
});

export const newSection = (
  {
    id = new Date().getTime().toString(),
    questions = [],
    sectionTitle = 'Sezione',
    type = 'standard',
  }: SurveySectionI = {
    id: new Date().getTime().toString(),
    questions: [],
    sectionTitle: 'Sezione',
    type: 'standard',
  }
) => ({
  id,
  questions,
  sectionTitle,
  type,
});

const SetSurveySectionAction = { type: 'surveys/SetSurveySection' };
export const SetSurveySection =
  (payload?: any) => async (dispatch: Dispatch) => {
    try {
      // console.log({ payload });
      // TODO manage update section
      dispatch({ ...SetSurveySectionAction, payload });
      dispatch(showLoader());
      dispatch(
        setSurveySection({
          section: newSection({
            sectionTitle: 'Sezione',
            questions: [newQuestion()],
          }),
        })
      );
    } finally {
      dispatch(hideLoader());
    }
  };

const SetSurveyQuestionAction = {
  type: 'surveys/SetSurveyQuestionAction',
};
export const SetSurveyQuestion =
  (payload: { sectionId: string }) => async (dispatch: Dispatch) => {
    try {
      dispatch({ ...SetSurveyQuestionAction, payload });
      dispatch(showLoader());
      dispatch(
        setSurveyQuestion({
          question: newQuestion(),
          sectionID: payload.sectionId,
        })
      );
    } finally {
      dispatch(hideLoader());
    }
  };

const transformQuestionToFormField = (question: any, questionId: string) => {
  return newFormField({
    field: question['question-description'],
    options: question['question-values']
      ? JSON.parse(question['question-values'])
      : undefined,
    required: question['question-required'],
    type: question['question-type'],
    preset: question['question-default'],
    id: questionId,
  });
};

export interface SurveyCreationBodyI {
  'survey-id'?: string;
  'survey-status'?: string;
  'default-RFD'?: boolean;
  'default-SCD'?: boolean;
  'last-update'?: string;
  'survey-name'?: string;
  'survey-description'?: string;
  sections?: {
    id: string;
    title: string;
    schema: string;
    schemaUI?: string | undefined;
    'default-section': boolean;
  }[];
}

const SetSurveyCreationAction = { type: 'surveys/SetSurveyCreation' };
export const SetSurveyCreation =
  (isClone: boolean) => async (dispatch: Dispatch, select: Selector) => {
    try {
      dispatch({ ...SetSurveyCreationAction, isClone });
      dispatch(showLoader());
      const {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        survey,
      } = select((state: RootState) => state);
      if (survey) {
        let valid = true;
        valid = valid && FormHelper.isValidForm(survey.form);
        if (valid) {
          const body: SurveyCreationBodyI = {
            ...FormHelper.getFormValues(survey.form),
            sections: [],
          };
          survey.sections.forEach((section: SurveySectionI, index: number) => {
            // valid = valid && FormHelper.isValidForm(section.form);
            if (valid) {
              const finalForm: any = [];
              (section.questions || []).forEach((question: SurveyQuestionI) => {
                valid = valid && FormHelper.isValidForm(question.form);
                if (valid) {
                  finalForm.push(
                    transformQuestionToFormField(
                      FormHelper.getFormValues(question.form),
                      question.id || ''
                    )
                  );
                }
              });
              // if (!isClone) {    // non presenti nel payload delle POST/PUT
              //   body['survey-id'] = survey.surveyId;
              //   body['survey-status'] = survey.surveyStatus;
              //   body['default-RFD'] = survey.defaultRFD;
              //   body['default-SCD'] = survey.defaultSCD;
              //   body['last-update'] = survey.lastUpdate;
              // }
              if (isClone) {
                body['survey-name'] =
                  survey.form['survey-name']?.value + ' clone';
              }
              body.sections?.push({
                id: section.id || `${new Date().getTime()}`,
                title: section.sectionTitle,
                ...generateJsonFormSchema(
                  newForm(finalForm, true),
                  index,
                  survey.sectionsSchemaResponse
                ),
                'default-section': true,
              });
            }
          });
          if (valid) {
            let res;
            if (isClone) {
              res = await API.post(`questionarioTemplate`, body);
            } else {
              res = await API.put(
                `questionarioTemplate/${survey.surveyId}`,
                body
              );
            }
            if (res) {
              /* TODO: controllo se post andata a buon fine */
            }
          }
        }
      }
    } finally {
      dispatch(hideLoader());
    }
  };

const GetSurveyInfoAction = { type: 'surveys/GetSurveyInfo' };
export const GetSurveyInfo =
  (questionarioId: string) => async (dispatch: Dispatch) => {
    try {
      dispatch(showLoader());
      dispatch({ ...GetSurveyInfoAction, questionarioId });
      const res = await API.get(`questionarioTemplate/${questionarioId}`);
      if (res?.data) {
        dispatch(setSurveyInfoForm(res.data));
      }
    } catch (e) {
      console.error('questionario detail GetSurveyInfo', e);
    } finally {
      dispatch(hideLoader());
    }
  };

const PostFormCompletedByCitizenAction = {
  type: 'surveys/PostFormCompletedByCitizen',
};
export const PostFormCompletedByCitizen =
  (payload?: any) => async (dispatch: Dispatch) => {
    try {
      dispatch(showLoader());
      dispatch({ ...PostFormCompletedByCitizenAction, payload });
      const entityEndpoint = `/`;
      const body = {
        payload,
      };
      const res = await API.post(entityEndpoint, body);
      if (res) {
        /* TODO: controllo se post andata a buon fine */
      }
    } catch (e) {
      console.error(
        'post questionario compilato PostFormCompletedByCitizen',
        e
      );
    } finally {
      dispatch(hideLoader());
    }
  };

// Thunk for updating exclusive field in Questionario entity

export const UpdateSurveyExclusiveField =
  (payload?: any) => async (dispatch: any) => {
    dispatch(showLoader());
    const { flagType, /*flagChecked,*/ surveyId } = payload;
    try {
      const endpoint = `/questionarioTemplate/aggiornadefault/${surveyId}?tipoDefault=${
        flagType === 'scd' ? 'defaultSCD' : 'defaultRFD'
      }`;

      await API.patch(endpoint);
      dispatch(hideLoader());
    } catch (error) {
      dispatch(hideLoader());
    }
  };

const UpdateSurveyDefaultAction = {
  type: 'surveys/UpdateSurveyDefault',
};

export const UpdateSurveyDefault =
  (idQuestionario: string) => async (dispatch: Dispatch) => {
    try {
      dispatch(showLoader());
      dispatch({ ...UpdateSurveyDefaultAction, idQuestionario });
      const res = await API.put(
        `/questionarioTemplate/aggiornadefault/${idQuestionario}`
      );
      if (res) {
        /* TODO: controllo se post andata a buon fine */
      }
    } catch (e) {
      console.error('UpdateSurveyDefault error', e);
    } finally {
      dispatch(hideLoader());
    }
  };
