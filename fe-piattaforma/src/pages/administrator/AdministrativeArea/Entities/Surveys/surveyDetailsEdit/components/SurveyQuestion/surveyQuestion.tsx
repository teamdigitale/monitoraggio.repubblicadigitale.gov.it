import clsx from 'clsx';
import { Button, FormGroup, Icon, Toggle } from 'design-react-kit';
import React, { memo, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Form, Input, Select } from '../../../../../../../../components';
import { OptionType } from '../../../../../../../../components/Form/select';
import {
  removeSurveyQuestion,
  selectSurveyQuestion,
  setSurveyQuestionFieldValue,
  SurveyQuestionI,
} from '../../../../../../../../redux/features/administrativeArea/surveys/surveysSlice';
import { selectDevice } from '../../../../../../../../redux/features/app/appSlice';
import { useAppSelector } from '../../../../../../../../redux/hooks';
import { FormHelper } from '../../../../../../../../utils/formHelper';
import { answerType } from '../../../surveyConstants';
import MultiOptionForm from './multiOptionForm';

export interface SurveyQuestionComponentI extends SurveyQuestionI {
  className?: string;
  position?: number;
  sectionID?: string | undefined;
}

const SurveyQuestion: React.FC<SurveyQuestionComponentI> = (props) => {
  const dispatch = useDispatch();
  const {
    id,
    className,
    form,
    position = 1,
    sectionID = new Date().getTime().toString(),
    editMode = false,
    cloneMode = false,
  } = props;
  const [open, setOpen] = useState<boolean>(false);

  const surveyQuestion = useAppSelector((state) =>
    selectSurveyQuestion(state, sectionID, position)
  );

  const handleOnInputChange = (
    value: string | number,
    field: string,
    newForm = form
  ) => {
    if (value === 'select' || value === 'checkbox') {
      setOpen(true);
    }
    dispatch(
      setSurveyQuestionFieldValue({
        sectionID,
        questionID: id,
        form: FormHelper.onInputChange(newForm, value, field),
      })
    );
  };

  const handleDeleteQuestion = () => {
    dispatch(removeSurveyQuestion({ sectionID, questionID: id || '' }));
  };

  useEffect(() => {
    if (surveyQuestion?.form) {
      const answer = surveyQuestion?.form['question-type']?.value;
      const isRequired = answer === 'select' || answer === 'checkbox';
      const { value, field } = surveyQuestion?.form['question-values'] || {};
      handleOnInputChange(isRequired ? value : '', field, {
        ...surveyQuestion.form,
        'question-values': {
          ...surveyQuestion.form['question-values'],
          required: isRequired,
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [surveyQuestion?.form['question-type']?.value]);

  const getAnswer = (answer: string | number = 'text') => {
    switch (answer) {
      case 'select':
      case 'checkbox':
        return (
          <MultiOptionForm
            areValuesDefault={form['question-default'].value}
            values={surveyQuestion?.form['question-values'].value}
            onFormChange={(values: OptionType[]) =>
              handleOnInputChange(
                JSON.stringify(values),
                surveyQuestion?.form['question-values'].field
              )
            }
          />
        );
      default:
        return;
    }
  };

  const device = useAppSelector(selectDevice);

  const questionButton = () => (
    <div>
      {!open && (
        <>
          {!form['question-default'].value && (
            <Button onClick={handleDeleteQuestion} className='px-2'>
              <Icon
                color='primary'
                icon='it-delete'
                size='sm'
                aria-label='Elimina domanda'
              />
            </Button>
          )}
          <Button
            onClick={() => {
              setOpen(true);
            }}
            className={clsx(
              'px-2',
              form['question-type']?.value !== 'select' &&
                form['question-type']?.value !== 'checkbox' &&
                'invisible'
            )}
          >
            <Icon
              color='primary'
              icon='it-expand'
              size='sm'
              aria-label='mostra'
            />
          </Button>
        </>
      )}
      {open && (
        <Button onClick={() => setOpen(false)} className='px-2'>
          <Icon
            color='primary'
            icon='it-collapse'
            size='sm'
            aria-label='Chiudi domanda'
          />
        </Button>
      )}
    </div>
  );

  return (
    <>
      <div
        className={clsx(
          'd-flex',
          'flex-column',
          'survey-question-container__closed-box',
          !open && 'mb-3',
          form['question-default'].value &&
            'survey-question-container__default-bg',
          !form['question-default'].value &&
            'survey-question-container__shadow',
          !(editMode || cloneMode) &&
            sectionID !== 'anagraphic-citizen-section' &&
            sectionID !== 'anagraphic-booking-section' &&
            'survey-question-container__default-bg',
          (editMode || cloneMode) &&
            sectionID !== 'anagraphic-citizen-section' &&
            sectionID !== 'anagraphic-booking-section' &&
            'survey-question-container__shadow',
        )}
      >
        <div
          className={clsx(
            'd-flex',
            'align-items-lg-center',
            'justify-content-between',
            'survey-question-container__header'
          )}
        >
          <div className='d-flex flex-row flex-grow-1 align-items-center justify-content-between w-100'>
            <div className='d-flex align-items-center flex-grow-1'>
              <span className='mr-4'>{position + 1}</span>
              {(!editMode && !cloneMode) ||
              ((editMode || cloneMode) &&
                (sectionID === 'anagraphic-citizen-section' ||
                  sectionID === 'anagraphic-booking-section')) ? (
                <span className='survey-question-container__question-description'>
                  <strong>
                    {surveyQuestion?.form['question-description'].value}
                  </strong>
                </span>
              ) : (
                <Form
                  id={`form-input-${id}`}
                  key={id}
                  className={clsx(
                    className,
                    'flex-grow-1',
                    'survey-question-container mb-3'
                    //device.mediaIsPhone && 'px-3'
                  )}
                >
                  <div>
                    <Input
                      {...form['question-description']}
                      label={`Testo della domanda ${position}`}
                      onInputBlur={handleOnInputChange}
                      id={`section-${sectionID}-question-${position}-description`}
                      placeholder='Inserisci testo domanda'
                      withLabel={false}
                      className='mb-0 w-100'
                      type={device.mediaIsPhone ? 'textarea' : undefined}
                      aria-label={`Testo della domanda ${position}`}
                    />
                  </div>
                </Form>
              )}
            </div>

            {!device.mediaIsDesktop && questionButton()}
          </div>
          <div
            className={clsx(
              'd-flex',
              'flex-row',
              'justify-content-between',
              'survey-question-container__box-right',
              'ml-lg-5',
              'ml-0',
              'pl-lg-0',
              'pr-4'
            )}
          >
            <div className='d-flex flex-column'>
              <span>Predefinita</span>
              <span>
                <strong>{form['question-default'].value ? 'Sì' : 'No'}</strong>
              </span>
            </div>
            <div className='d-flex flex-column'>
              <span>Tipologia risposta</span>
              {(!editMode || !cloneMode) && form['question-default']?.value ? (
                <span>
                  <strong>
                    {
                      answerType.filter(
                        (type) => type.value === form['question-type']?.value
                      )[0]?.label
                    }
                  </strong>
                </span>
              ) : (
                <Form id={`form-select-${id}`}>
                  <Select
                    {...form['question-type']}
                    id={`section-${sectionID}-question-${position}-type`}
                    label='Tipologia risposta'
                    aria-label='Tipologia risposta'
                    options={answerType}
                    onInputChange={handleOnInputChange}
                    withLabel={false}
                    placeholder='Seleziona tipologia risposta'
                    wrapperClassName='mb-0 w-100'
                  />
                </Form>
              )}
            </div>

            {device.mediaIsDesktop && questionButton()}
          </div>
        </div>
        {(editMode || cloneMode) && !form['question-default']?.value && (
          <div className='bg-white mt-3'>
            <Form id={`form-toggle-${id}`}>
              <FormGroup check className='d-flex justify-content-end w-100'>
                <Toggle
                  label='Campo obbligatorio'
                  disabled={false}
                  onChange={(e) =>
                    handleOnInputChange(
                      e.target.checked.toString(),
                      surveyQuestion?.form['question-required'].field
                    )
                  }
                />
              </FormGroup>
            </Form>
          </div>
        )}
      </div>

      {open &&
      (form['question-type']?.value === 'select' ||
        form['question-type']?.value === 'checkbox') ? (
        <div
          className={clsx(
            'px-4 pb-4',
            'mb-3',
            form['question-default'].value &&
              'survey-question-container__default-bg',
            !form['question-default'].value &&
              'survey-question-container__shadow survey-question-container__expanded-box',
            !(editMode || cloneMode) &&
              sectionID !== 'anagraphic-citizen-section' &&
              sectionID !== 'anagraphic-booking-section' &&
              'survey-question-container__default-bg',
            (editMode || cloneMode) &&
              sectionID !== 'anagraphic-citizen-section' &&
              sectionID !== 'anagraphic-booking-section' &&
              'survey-question-container__shadow survey-question-container__expanded-box'
          )}
        >
          {getAnswer(surveyQuestion?.form['question-type']?.value)}
        </div>
      ) : (
        <div className='mb-3' />
      )}
    </>
  );
};

export default memo(SurveyQuestion);
