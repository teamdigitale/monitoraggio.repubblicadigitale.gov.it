import React, { useState } from 'react';
import {
  Form,
  Input,
  Rating,
  Select,
  SelectMultiple,
} from '../../../../../../components';
import { formFieldI, FormI } from '../../../../../../utils/formHelper';
import CheckboxGroup from '../../../../../../components/Form/checkboxGroup';
import clsx from 'clsx';
import '../compileSurvey/compileSurvey.scss';
import { useEffect } from 'react';
import { setCompilingSurveyForm } from '../../../../../../redux/features/administrativeArea/surveys/surveysSlice';
import { useDispatch } from 'react-redux';
interface JsonFormRenderI {
  form: FormI;
  onInputChange: (
    value: formFieldI['value'],
    field?: formFieldI['field']
  ) => void;
  currentStep: number;
}

const JsonFormRender: React.FC<JsonFormRenderI> = (props) => {
  const { form = {}, onInputChange = () => ({}), currentStep } = props;
  const dispatch = useDispatch();

  useEffect(() => {
    if (currentStep === 3) {
      // last step
      dispatch(setCompilingSurveyForm({ id: currentStep, form }));
    }
  }, [currentStep]);

  const updateFormToOrder = () => {
    return Object.keys(form).sort(
      (a, b) => Number(form[a].order) - Number(form[b].order)
    );
  };
  const [orderedForm, setOrderedForm] = useState(updateFormToOrder());

  useEffect(() => {
    setOrderedForm(updateFormToOrder());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form]);

  const renderInputByType = (formField: formFieldI) => {
    switch (formField?.type) {
      case 'text':
      default: {
        return (
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          <Input
            {...formField}
            className={clsx(
              'd-inline-block',
              formField.label?.toLowerCase() === 'prefisso' &&
                'compile-survey-container__prefix-width',
              formField.label?.toLowerCase().includes('cellulare') &&
                'compile-survey-container__mobile-width',
              formField.label?.toLowerCase() !== 'prefisso' &&
                !(formField.label?.toLowerCase().includes('cellulare')) &&
                'compile-survey-container__half-width',
              'mr-3',
              'mb-3'
            )}
            label={`${formField?.label} ${formField?.required ? '*' : ''}`}
            onInputBlur={onInputChange}
          />
        );
      }
      case 'select': {
        if (formField.options?.length) {
          return (
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            <Select
              {...formField}
              wrapperClassName={clsx(
                'd-inline-block',
                'compile-survey-container__half-width',
                'compile-survey-container__select-margin',
                'mr-3',
                'mb-3'
              )}
              onInputChange={onInputChange}
              placeholder={`Seleziona ${
                (formField?.label || '')?.length < 20
                  ? formField?.label?.toLowerCase()
                  : ''
              }`}
              label={`${formField?.label} ${formField?.required ? '*' : ''}`}
            />
          );
        }
        break;
      }
      case 'checkbox': {
        if (
          formField.format === 'multiple-select' &&
          formField.relatedFrom !== ''
        ) {
          return null;
        }
        if (
          formField.format === 'multiple-select' &&
          formField.relatedTo !== ''
        ) {
          const multiSelectOptions: {
            label: string;
            options: { label: string; value: string; upperLevel: string }[];
          }[] = [];
          if (formField.enumLevel1) {
            (formField.enumLevel1 || []).forEach((opt) => {
              multiSelectOptions.push({
                label: opt,
                options: [],
              });
            });
          }
          if (
            formField?.relatedTo &&
            form[formField.relatedTo].enumLevel2 &&
            multiSelectOptions?.length > 0
          ) {
            (form[formField.relatedTo].enumLevel2 || []).forEach(
              ({ label, value, upperLevel }) => {
                const index = multiSelectOptions.findIndex(
                  (v) => v.label === upperLevel
                );
                multiSelectOptions[index].options.push({
                  label: label,
                  value: value,
                  upperLevel: upperLevel,
                });
              }
            );
          }
          return (
            <SelectMultiple
              field={formField.field}
              secondLevelField={formField.relatedTo}
              id={`multiple-select-${formField.id}`}
              label={`${formField?.label}`}
              aria-label={`${formField?.label}`}
              options={multiSelectOptions}
              required={formField.required || false}
              onInputChange={onInputChange}
              onSecondLevelInputChange={onInputChange}
              placeholder='Seleziona'
              wrapperClassName={clsx(
                'd-inline-block',
                'compile-survey-container__half-width',
                'compile-survey-container__select-margin',
                'mr-3',
                'mb-3'
              )}
            />
          );
        }
        if (formField.options?.length) {
          return (
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            <CheckboxGroup
              {...formField}
              className={clsx(
                'd-inline-block',
                'compile-survey-container__half-width',
                'compile-survey-container__select-margin',
                'mr-3',
                'mb-3'
              )}
              onInputChange={onInputChange}
              label={`${formField?.label} ${formField?.required ? '*' : ''}`}
              styleLabelForm
            />
          );
        }
        return (
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          <Input
            {...formField}
            className={clsx(
              'd-inline-block',
              'compile-survey-container__half-width',
              'mr-3',
              'mb-3'
            )}
            onInputBlur={onInputChange}
            label={`${formField?.label} ${formField?.required ? '*' : ''}`}
          />
        );
      }
      case 'range':
        return (
          <>
            <label>{formField.field}</label>
            <Rating onChange={(val) => onInputChange(val, formField.field)} />
          </>
        );
    }
  };

  return (
    <Form id='compile-survey-form'>
      {orderedForm.map((field) => (
        <React.Fragment key={field}>
          {renderInputByType(form[field])}
        </React.Fragment>
      ))}
    </Form>
  );
};

export default JsonFormRender;
