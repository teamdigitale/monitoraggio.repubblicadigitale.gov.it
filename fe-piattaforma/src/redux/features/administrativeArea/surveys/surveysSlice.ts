import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  defaultQuestionsCitizenAnagraphic,
  defaultQuestionsBookingAnagraphic,
  defaultQuestionsServiceAnagraphic,
  defaultQuestionsServiceContent,
} from '../../../../pages/administrator/AdministrativeArea/Entities/Surveys/questionariConstants';
import { newForm, newFormField } from '../../../../utils/formHelper';
import { transformJsonToForm } from '../../../../utils/jsonFormHelper';
import { RootState } from '../../../store';
import { newQuestion, newSection } from './surveysThunk';

export interface SurveyQuestionI {
  id?: string;
  form?: any;
  name?: string;
  type?: string;
  values?: string;
  isDefault?: boolean;
  editMode?: boolean;
  cloneMode?: boolean;
}

export interface SurveySectionI {
  id?: string;
  questions?: SurveyQuestionI[];
  sectionTitle: string;
  type?: 'first' | 'standard' | string;
  positionSection?: number;
  handleActiveSection?: (sectionID: string) => void;
  isSectionActive?: boolean;
  editMode?: boolean;
  cloneMode?: boolean;
}

export interface SurveyStateI {
  surveyId: string;
  surveyStatus: string;
  defaultRFD: boolean;
  defaultSCD: boolean;
  lastUpdate: string;
  form?: any;
  sections: SurveySectionI[];
}

const baseSections = [
  newSection({
    id: 'anagraphic-citizen-section',
    sectionTitle: 'Anagrafica del cittadino',
    questions: defaultQuestionsCitizenAnagraphic.map((elem) =>
      newQuestion({
        id: elem.id,
        name: elem.name,
        type: elem.type,
        isDefault: elem.isDefault,
        values: elem.values,
      })
    ),
  }),
  newSection({
    id: 'anagraphic-booking-section',
    sectionTitle: 'Anagrafica della prenotazione',
    questions: defaultQuestionsBookingAnagraphic.map((elem) =>
      newQuestion({
        id: elem.id,
        name: elem.name,
        type: elem.type,
        isDefault: elem.isDefault,
        values: elem.values,
      })
    ),
  }),
  newSection({
    id: 'anagraphic-service-section',
    sectionTitle: 'Anagrafica del servizio',
    questions: defaultQuestionsServiceAnagraphic.map((elem) =>
      newQuestion({
        id: elem.id,
        name: elem.name,
        type: elem.type,
        isDefault: elem.isDefault,
        values: elem.values,
      })
    ),
  }),
  newSection({
    id: 'content-service-section',
    sectionTitle: 'Contenuti del servizio',
    questions: defaultQuestionsServiceContent.map((elem) =>
      newQuestion({
        id: elem.id,
        name: elem.name,
        type: elem.type,
        isDefault: elem.isDefault,
        values: elem.values,
      })
    ),
  }),
];

const baseSurveyForm = newForm([
  newFormField({
    field: 'survey-name',
    required: true,
    value: 'Questionario di default',
  }),
  newFormField({
    field: 'survey-description',
    required: true,
    value: 'Questionario padre di tutti',
  }),
]);

const initialState: SurveyStateI = {
  surveyId: '',
  surveyStatus: '',
  defaultRFD: false,
  defaultSCD: false,
  lastUpdate: '',
  form: baseSurveyForm,
  sections: [...baseSections],
};

export const surveysSlice = createSlice({
  name: 'survey',
  initialState,
  reducers: {
    setSurveyFormFieldValue: (state, action: PayloadAction<any>) => {
      if (action.payload.form) {
        state.form = action.payload.form;
      }
    },
    setSurveySection: (
      state,
      action: PayloadAction<{ section: SurveySectionI }>
    ) => {
      if (action.payload.section) {
        const newStateSections = state.sections;
        const newStateSectionIndex = newStateSections?.findIndex(
          (section) => section.id === action.payload.section.id
        );
        if (newStateSectionIndex >= 0) {
          newStateSections[newStateSectionIndex] = action.payload.section;
        } else {
          newStateSections.push(action.payload.section);
        }
        state.sections = newStateSections;
      }
    },
    removeSurveySection: (
      state,
      action: PayloadAction<{ section: SurveySectionI }>
    ) => {
      if (action.payload.section?.id) {
        const newStateSections = state.sections.filter(
          (section) => section.id !== action.payload.section.id
        );
        if (newStateSections.length) {
          state.sections = newStateSections;
        } else {
          state.sections = initialState.sections;
        }
      }
    },
    setSurveySectionFieldValue: (state, action: PayloadAction<any>) => {
      const { sectionID, form } = action.payload;
      if (sectionID && form) {
        const newStateSectionIndex = state.sections.findIndex(
          (section) => section.id === sectionID
        );
        if (newStateSectionIndex >= 0) {
          const newSurveySections = state.sections.map((section, i) => {
            if (i === newStateSectionIndex) {
              return {
                ...section,
                form: {
                  ...form,
                },
              };
            }
            return section;
          });
          state.sections = newSurveySections;
        }
      }
    },
    setSurveyQuestion: (
      state,
      action: PayloadAction<{ question: SurveyQuestionI; sectionID: string }>
    ) => {
      if (action.payload.question) {
        const newStateSections = state.sections;
        const sectionIndex = state.sections.findIndex(
          (section) => section.id === action.payload.sectionID
        );
        newStateSections[sectionIndex].questions?.push(action.payload.question);
        state.sections = newStateSections;
      } else {
        state.sections = initialState.sections;
      }
    },
    removeSurveyQuestion: (
      state,
      action: PayloadAction<{ sectionID: string; questionID: string }>
    ) => {
      if (action.payload.sectionID && action.payload.questionID) {
        const newStateSections = state.sections;
        const sectionIndex = state.sections.findIndex(
          (section) => section.id === action.payload.sectionID
        );
        if (
          sectionIndex >= 0 &&
          (state.sections[sectionIndex].questions?.length || 1) > 1
        ) {
          const questionToRemove = state.sections[sectionIndex].questions?.find(
            (question) => question.id === action.payload.questionID
          );
          if (questionToRemove?.id) {
            newStateSections[sectionIndex] = {
              ...newStateSections[sectionIndex],
              questions:
                newStateSections[sectionIndex].questions?.filter(
                  (question) => question.id !== questionToRemove.id
                ) || [],
            };
            state.sections = newStateSections;
          }
        }
      }
    },
    cloneSurveyQuestion: (
      state,
      action: PayloadAction<{ sectionID: string; questionID: string }>
    ) => {
      if (action.payload.sectionID && action.payload.sectionID) {
        const newStateSections = state.sections;
        const sectionIndex = state.sections.findIndex(
          (section) => section.id === action.payload.sectionID
        );
        if (
          sectionIndex >= 0 &&
          newStateSections[sectionIndex]?.questions?.length
        ) {
          const sectionQuestion = (
            state.sections[sectionIndex].questions || []
          ).filter((question) => question.id === action.payload.questionID);
          if (sectionQuestion?.length) {
            newStateSections[sectionIndex].questions?.push(
              newQuestion({ form: sectionQuestion[0].form })
            );
          }
        }
      }
    },
    setSurveyQuestionFieldValue: (state, action: PayloadAction<any>) => {
      const { sectionID, questionID, form } = action.payload;
      if (sectionID && questionID && form) {
        const newStateSectionIndex = state.sections.findIndex(
          (section) => section.id === sectionID
        );
        if (newStateSectionIndex >= 0) {
          const newStateQuestionIndex = (
            state.sections[newStateSectionIndex].questions || []
          ).findIndex((question) => question.id === questionID);
          if (newStateQuestionIndex >= 0) {
            const newSurveySections = state.sections.map((section, i) => {
              if (i === newStateSectionIndex) {
                const newSectionQuestions = section.questions?.map(
                  (question, j) => {
                    if (j === newStateQuestionIndex) {
                      return {
                        ...question,
                        form: {
                          ...form,
                        },
                      };
                    }
                    return question;
                  }
                );
                return {
                  ...section,
                  questions:
                    newSectionQuestions ||
                    initialState.sections[1].questions ||
                    [],
                };
              }
              return section;
            });
            state.sections = newSurveySections;
          }
        }
      }
    },
    setSurveyInfoForm: (state, action: PayloadAction<any>) => {
      const surveyDetails = transformJsonToForm(action.payload);
      if (surveyDetails) {
        state.surveyId = surveyDetails.surveyId;
        state.surveyStatus = surveyDetails.surveyStatus;
        state.defaultRFD = surveyDetails.defaultRFD;
        state.defaultSCD = surveyDetails.defaultSCD;
        state.lastUpdate = surveyDetails.lastUpdate;
        state.form = surveyDetails.form;
        state.sections = surveyDetails.sections;
      }
    },
  },
});

export const {
  setSurveyFormFieldValue,
  setSurveySection,
  removeSurveySection,
  setSurveySectionFieldValue,
  setSurveyQuestion,
  removeSurveyQuestion,
  cloneSurveyQuestion,
  setSurveyQuestionFieldValue,
  setSurveyInfoForm,
} = surveysSlice.actions;

export const selectSurveyForm = (state: RootState) => state.survey.form;

export const selectSurveySections = (state: RootState) => state.survey.sections;

export const selectSurveyQuestion = (
  state: RootState,
  sectionID: string,
  questionID: number
) => {
  const idSection = state.survey.sections.findIndex(
    (section: SurveySectionI) => section.id === sectionID
  );
  return state.survey.sections[idSection].questions?.[questionID];
};

export default surveysSlice.reducer;
