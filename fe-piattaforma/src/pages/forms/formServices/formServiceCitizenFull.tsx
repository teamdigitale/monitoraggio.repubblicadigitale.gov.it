import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import { Form, Input, Select, SelectMultiple } from '../../../components';
import CheckboxGroup from '../../../components/Form/checkboxGroup';
import { OptionTypeMulti } from '../../../components/Form/selectMultiple';
import withFormHandler, {
  withFormHandlerProps,
} from '../../../hoc/withFormHandler';
import { selectQuestionarioTemplateSnapshot } from '../../../redux/features/administrativeArea/administrativeAreaSlice';
import { selectEntityDetail } from '../../../redux/features/citizensArea/citizensAreaSlice';
// import { selectDevice } from '../../redux/features/app/appSlice';
import { useAppSelector } from '../../../redux/hooks';
import {
  formFieldI,
  FormHelper,
  FormI,
  newForm,
} from '../../../utils/formHelper';
import { generateForm } from '../../../utils/jsonFormHelper';
import { FormCitizenI } from '../formCitizen';

interface FormEnteGestoreProgettoFullInterface
  extends withFormHandlerProps,
    FormCitizenI {}

const FormServiceCitizenFull: React.FC<FormEnteGestoreProgettoFullInterface> = (
  props
) => {
  const {
    setFormValues = () => ({}),
    form,
    onInputChange = () => ({}),
    sendNewValues,
    // isValidForm,
    setIsFormValid = () => ({}),
    getFormValues,
    updateForm = () => ({}),
    creation = false,
  } = props;

  // const device = useAppSelector(selectDevice);
  const formDisabled = !!props.formDisabled;
  const formData: {
    [key: string]: formFieldI['value'] | undefined;
  } = useAppSelector(selectEntityDetail)?.dettaglioCittadino;
  const [dynamicForm, setDynamicForm] = useState<FormI>({});
  const surveyTemplateQ1: any = useAppSelector(
    selectQuestionarioTemplateSnapshot
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
  )?.sezioniQuestionarioTemplate?.[0];

  useEffect(() => {
    if (surveyTemplateQ1) {
      const formFromSchema = generateForm(
        JSON.parse(surveyTemplateQ1.schema.json)
      );
      delete formFromSchema['18']; // tipo consenso non parte dell'anagrafica
      delete formFromSchema['19']; // data consenso non parte dell'anagrafica
      Object.keys(formFromSchema).forEach((key: string) => {
        formFromSchema[key].label = formFromSchema[key].value?.toString() || '';
        formFromSchema[key].value = '';
        if (Number(key) === 4 || Number(key) === 5 || Number(key) === 6) {
          formFromSchema[key].required = false;
        }
      });
      setDynamicForm(formFromSchema);
    }
  }, [surveyTemplateQ1 && Object.keys(surveyTemplateQ1)?.length]);

  useEffect(() => {
    if (dynamicForm) updateForm(dynamicForm);
  }, [dynamicForm]);

  useEffect(() => {
    if (!creation && formData && form && Object.keys(form)?.length > 0) {
      const newValues: { [key: string]: formFieldI['value'] } = {};
      Object.keys(form).map((key: string) => {
        const keyBE = form[key]?.keyBE;
        if (keyBE) newValues[key] = formData[keyBE];
      });
      setFormValues(newValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData]);

  const handleCheckboxChange = (
    value?: formFieldI['value'],
    field?: formFieldI['field']
  ) => {
    const tmpForm = FormHelper.onInputChange(form, value, field);
    const referenceBoolean = !tmpForm[4]?.value;
    tmpForm[3].required = referenceBoolean;
    tmpForm[5].required = !referenceBoolean;
    tmpForm[6].required = !referenceBoolean;
    updateForm(tmpForm);
  };

  const onInputDataChange = (
    value: formFieldI['value'],
    field?: formFieldI['field']
  ) => {
    onInputChange?.(value, field);
    setIsFormValid?.(FormHelper.isValidForm(form));
  };

  useEffect(() => {
    sendNewValues?.(getFormValues?.());
    setIsFormValid?.(FormHelper.isValidForm(form));
  }, [form]);

  const getAnswerType = (field: formFieldI) => {
    switch (field.type) {
      case 'date':
      case 'time':
      case 'number':
      case 'text': {
        return (
          <Input
            {...field}
            id={`input-${field.field}`}
            col={
              field.label && field.label?.length > 30
                ? 'col-12'
                : 'col-12 col-lg-6'
            }
            label={field.label}
            type={field.type}
            required={field.required || false}
            onInputChange={(value, field) => {
              onInputDataChange(value, field);
            }}
            placeholder={`Inserisci ${field.label?.toLowerCase()}`}
          />
        );
      }
      case 'select': {
        return (
          <Select
            {...field}
            id={`input-${field}`}
            field={field.field}
            label={field.label || ''}
            col={field.field === '9' ? 'col-12' : 'col-12 col-lg-6'}
            required={field.required || false}
            onInputChange={(value, field) => {
              onInputDataChange(value, field);
            }}
            placeholder={`Inserisci ${field.label?.toLowerCase()}`}
            options={field.options}
            isDisabled={formDisabled}
            value={field.value}
            wrapperClassName='mb-5 pr-lg-3'
          />
        );
      }
      case 'checkbox': {
        // checkbox if options
        if (field.options && field.options?.length > 0) {
          return (
            <CheckboxGroup // TODO: fix accessibilità onkeydown
              {...field}
              id={`input-${field}`}
              field={field.field}
              className={clsx(
                Number(field.field) === 18 ? 'col-12' : 'col-12 col-lg-6',
                'compile-survey-container__checkbox-margin'
              )}
              label={
                Number(field.field) === 18 ? 'Data conferimento consenso' : ''
              }
              noLabel={Number(field.field) === 4}
              options={field.options}
              onInputChange={handleCheckboxChange}
              styleLabelForm
              classNameLabelOption='pl-5'
              disabled={Number(field.field) === 18}
            />
          );
        }
        // multiple select if enumLevel1 & enumLevel2
        if (
          form &&
          field.format === 'multiple-select' &&
          field.enumLevel1?.length &&
          field.enumLevel2?.length
        ) {
          let relatedTo = '';
          const multiSelectOptions: {
            label: string;
            options: { label: string; value: string; upperLevel: string }[];
          }[] = [];
          if (field.enumLevel1) {
            (field.enumLevel1 || []).forEach((opt) => {
              multiSelectOptions.push({
                label: opt,
                options: [],
              });
            });
          }
          Object.keys(form).forEach((key: string) => {
            if (form[key].field === field.relatedTo)
              relatedTo = form[key].field || '';
          });
          if (
            form &&
            field?.relatedTo &&
            form[relatedTo]?.enumLevel2 &&
            multiSelectOptions?.length > 0
          ) {
            (form[relatedTo]?.enumLevel2 || []).forEach(
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
          // mappa valori
          const valuesSecondLevel = form[relatedTo]?.value;
          const values: OptionTypeMulti[] = [];
          Array.isArray(valuesSecondLevel) &&
            (valuesSecondLevel || []).map((val: string) => {
              let upperLevel = '';
              Object.keys(multiSelectOptions).forEach((key: any) => {
                if (
                  multiSelectOptions[key].options.filter((x) => x.label === val)
                    ?.length > 0
                ) {
                  upperLevel = multiSelectOptions[key].label;
                }
              });
              values.push({
                label: val,
                value: val,
                upperLevel: upperLevel,
              });
            });
          return (
            <SelectMultiple
              {...field}
              field={field.field}
              secondLevelField={relatedTo}
              id={`multiple-select-${field.id}`}
              col='col-12'
              label={`${field?.label}`}
              aria-label={`${field?.label}`}
              options={multiSelectOptions}
              required={field.required || false}
              onInputChange={(value: formFieldI['value'], field) => {
                const values: string[] = [];
                if (Array.isArray(value))
                  value.map((val: string) => values.push(val));
                onInputDataChange(value, field);
              }}
              //   onSecondLevelInputChange --> non serve
              placeholder='Seleziona'
              isDisabled={formDisabled}
              value={values}
              wrapperClassName='mb-5 pr-lg-3'
            />
          );
        }
        return (
          <Input
            {...field}
            className={clsx('mr-3', 'mb-3')}
            col='col-12 col-lg-6'
            onInputBlur={onInputChange}
            label={`${field?.label}`}
            required={field.required || false}
          />
        );
      }
      default:
        return '';
    }
  };

  return (
    <Form id='form-citizen' className='mt-5' formDisabled={formDisabled}>
      <div className='d-inline-flex flex-wrap w-100'>
        {form &&
          Object.keys(form).map((key) => <>{getAnswerType(form[key])}</>)}
      </div>
    </Form>
  );
};

const form = newForm([]);

export default withFormHandler({ form }, FormServiceCitizenFull);
