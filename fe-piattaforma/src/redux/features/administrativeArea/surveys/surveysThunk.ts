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
import { GetEntityValues } from '../administrativeAreaThunk';
import {
  setSurveyInfoForm,
  setSurveyQuestion,
  setSurveySection,
  SurveyQuestionI,
  SurveySectionI,
} from './surveysSlice';

export interface SurveyLightI {
  id: string;
  name: string;
  lastChangeDate: string;
  status: string;
  default_SCD: boolean;
  default_RFD: boolean;
}

// Changes in endpoints request and response may require changes in the actions below

const GetAllSurveysAction = { type: 'administrativeArea/getAllSurveys' };

export const GetAllSurveys =
  () => async (dispatch: Dispatch, select: Selector) => {
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
      const endpoint = '/questionari/all';
      const body = {
        ...filters,
      };
      let res;
      if (body) {
        res = await API.post(endpoint, body, {
          params: {
            currPage: pagination.pageNumber,
            pageSize: pagination.pageSize,
          },
        });
      } else {
        res = await API.get(endpoint, {
          params: {
            currPage: pagination.pageNumber,
            pageSize: pagination.pageSize,
          },
        });
      }

      if (res.data) dispatch(setSurveysList({ data: res.data.data.list }));
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
      const body = {
        cfUtente: '',
        codiceRuolo: '',
        filtroRequest: { ...filters },
        idProgramma: 0,
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
  }[];
}

const SetSurveyCreationAction = { type: 'surveys/SetSurveyCreation' };
export const SetSurveyCreation =
  (payload?: any) => async (dispatch: Dispatch, select: Selector) => {
    try {
      dispatch({ ...SetSurveyCreationAction, payload });
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
              body['survey-id'] = survey.surveyId;
              body['survey-status'] = survey.surveyStatus;
              body['default-RFD'] = survey.defaultRFD;
              body['default-SCD'] = survey.defaultSCD;
              body['last-update'] = survey.lastUpdate;
              body.sections?.push({
                id: section.id || `${new Date().getTime()}`,
                title: section.sectionTitle,
                ...generateJsonFormSchema(
                  newForm(finalForm, true),
                  index,
                  survey.sectionsSchemaResponse
                ),
              });
            }
          });
          if (valid) {
            // TODO create jsonForm and submit to API
            console.log('body', body);
          }
        }
      }
    } finally {
      dispatch(hideLoader());
    }
  };

const GetSurveyInfoAction = { type: 'questionario/GetSurveyInfo' };
export const GetSurveyInfo =
  (questionarioId: string) => async (dispatch: Dispatch) => {
    try {
      dispatch(showLoader());
      dispatch({ ...GetSurveyInfoAction, questionarioId });
      // const res = await API.get(`questionario/${questionarioId}`); // TODO: decommenta quando integrano chiamata
      const res = await API.get(`questionario/1`);
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
  type: 'questionario/PostFormCompletedByCitizen',
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
    // console.log(payload);

    const { flagType, flagChecked, surveyId } = payload;
    try {
      const endpoint = `questionari/${
        flagType === 'scd' ? 'default-scd' : 'default-rfd'
      }`;
      await API.patch(endpoint, {
        surveyId,
        flagChecked,
      });
      dispatch(hideLoader());
      dispatch(GetEntityValues({ entity: 'questionari' }));
    } catch (error) {
      dispatch(hideLoader());
    }
  };
