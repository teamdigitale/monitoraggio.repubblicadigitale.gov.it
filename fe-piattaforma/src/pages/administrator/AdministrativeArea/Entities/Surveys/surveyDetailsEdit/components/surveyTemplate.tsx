import React, { useEffect } from 'react';
import { Button, Icon } from 'design-react-kit';
import { useDispatch } from 'react-redux';
import clsx from 'clsx';
import { Form, Input } from '../../../../../../../components';
import SurveySection from './../components/surveySection';
import { useAppSelector } from '../../../../../../../redux/hooks';
import { FormHelper } from '../../../../../../../utils/formHelper';
import { selectDevice } from '../../../../../../../redux/features/app/appSlice';
import {
  SurveySectionI,
  selectSurveySections,
  SurveyQuestionI,
  selectSurveyForm,
  setSurveyFormFieldValue,
  selectSurveyName,
} from '../../../../../../../redux/features/administrativeArea/surveys/surveysSlice';
import { SetSurveyQuestion } from '../../../../../../../redux/features/administrativeArea/surveys/surveysThunk';
import { idQ1, idQ2 } from '../../surveyConstants';

interface SurveyTemplateI {
  editMode?: boolean;
  cloneMode?: boolean;
  modal?: boolean;
}

const SurveyTemplate: React.FC<SurveyTemplateI> = ({
  editMode = false,
  cloneMode = false,
  modal = false,
}) => {
  const dispatch = useDispatch();
  const form = useAppSelector(selectSurveyForm);
  const sections = useAppSelector(selectSurveySections) || [];
  const surveyName = useAppSelector(selectSurveyName);

  useEffect(() => {
    if (cloneMode && surveyName) {
      dispatch(
        setSurveyFormFieldValue({
          form: FormHelper.onInputChange(
            form,
            surveyName + ' clone',
            'survey-name'
          ),
        })
      );
    }
  }, [surveyName]);

  const handleOnInputChange = (
    value: string | number | boolean | Date | string[] | undefined,
    field: string | undefined
  ) => {
    dispatch(
      setSurveyFormFieldValue({
        form: FormHelper.onInputChange(form, value, field),
      })
    );
  };

  const handleNewQuestion = (sectionId: string) => {
    dispatch(SetSurveyQuestion({ sectionId: sectionId }));
  };

  const checkValidityQuestions = (questions: SurveyQuestionI[]) => {
    let isValid = true;
    if (questions?.length > 0) {
      questions.map((question: SurveyQuestionI) => {
        !FormHelper.isValidForm(question.form) ? (isValid = false) : '';
        if (
          (question.form['question-type'].value === 'select' ||
            question.form['question-type'].value === 'checkbox') &&
          question.form['question-values'].value === ''
        ) {
          isValid = false;
        }
      });
    }
    return isValid;
  };

  const device = useAppSelector(selectDevice);

  return (
    <>
      <Form id='form-survey-template' className='pt-5'>
        <Form.Row
          className={clsx(
            device.mediaIsPhone ? '' : 'd-flex justify-content-start'
          )}
        >
          <Input
            {...form['survey-name']}
            col='col-12 col-lg-6 '
            label='Nome'
            id='survey-field-name'
            onInputBlur={handleOnInputChange}
            placeholder='Inserici nome questionario'
            disabled={!editMode && !cloneMode}
            className={clsx(
              device.mediaIsPhone || device.mediaIsTablet ? 'w-100' : 'w-75'
            )}
            maximum={100}
          />
          <Input
            {...form['survey-description']}
            col='col-12 col-lg-6'
            label='Descrizione'
            id='survey-field-description'
            onInputBlur={handleOnInputChange}
            placeholder='Inserici una descrizione del questionario'
            disabled={!editMode && !cloneMode}
            className={clsx(
              device.mediaIsPhone || device.mediaIsTablet ? 'w-100' : 'w-75'
            )}
            maximum={100}
          />
        </Form.Row>
      </Form>
      {sections.map((section: SurveySectionI, i: number) => (
        <>
          <React.Fragment key={section.id}>
            <SurveySection
              {...section}
              positionSection={i}
              sectionTitle={`${i + 1}. ${section.sectionTitle}`}
              editMode={editMode}
              cloneMode={cloneMode}
            />
          </React.Fragment>
          <div
            className={clsx(
              device.mediaIsPhone
                ? 'flex-column d-flex'
                : 'd-flex justify-content-end',
              'w-100'
            )}
          >
            {!modal &&
              (editMode || cloneMode) &&
              section.id !== idQ1 &&
              section.id !== idQ2 && (
                <Button
                  onClick={() => handleNewQuestion(section?.id || '')}
                  className={clsx(
                    device.mediaIsPhone
                      ? 'd-flex text-nowrap'
                      : 'd-flex justify-content-between ml-3 text-nowrap'
                  )}
                  disabled={
                    !checkValidityQuestions(section.questions || []) ||
                    !(editMode || cloneMode)
                  }
                >
                  <Icon
                    color='primary'
                    icon='it-plus-circle'
                    size='sm'
                    className='mr-2'
                    aria-label='Aggiungi domanda'
                  />
                  Aggiungi domanda
                </Button>
              )}
          </div>
          {i !== sections?.length - 1 && <hr />}
        </>
      ))}
    </>
  );
};

export default SurveyTemplate;
