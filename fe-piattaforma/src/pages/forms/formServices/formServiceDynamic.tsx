import React, { useEffect, useState } from 'react';
import { Form, Input, Select, SelectMultiple } from '../../../components';
import CheckboxGroup from '../../../components/Form/checkboxGroup';
import { OptionTypeMulti } from '../../../components/Form/selectMultiple';
import withFormHandler, {
  withFormHandlerProps,
} from '../../../hoc/withFormHandler';
import { selectSezioneQ3compilato } from '../../../redux/features/administrativeArea/administrativeAreaSlice';
// import { selectDevice } from '../../../redux/features/app/appSlice';
import { useAppSelector } from '../../../redux/hooks';
import { formatAndParseJsonString } from '../../../utils/common';
import {
  formFieldI,
  FormHelper,
  FormI,
  newForm,
} from '../../../utils/formHelper';

interface FormServicesI {
  formDisabled?: boolean;
  sendNewValues?: (param?: { [key: string]: formFieldI['value'] }) => void;
  setIsFormValid?: (param: boolean) => void;
  creation?: boolean;
  dynamicFormQ3?: FormI;
}

interface FormEnteGestoreProgettoFullInterface
  extends withFormHandlerProps,
    FormServicesI {}

const separator = '§';

const FormServiceDynamic: React.FC<FormEnteGestoreProgettoFullInterface> = (
  props
) => {
  const {
    setFormValues = () => ({}),
    form,
    onInputChange,
    sendNewValues,
    setIsFormValid = () => ({}),
    getFormValues,
    creation = false,
    updateForm = () => ({}),
    dynamicFormQ3,
  } = props;
  // const device = useAppSelector(selectDevice);
  // const isMobile = device.mediaIsPhone;
  const sezioneQ3 = useAppSelector(
    selectSezioneQ3compilato
  )?.sezioneQ3Compilato;
  const formDisabled = !!props.formDisabled;
  const [sezioneQ3Compilato, setSezioneQ3Compilato] = useState<{
    [key: string]: string | string[];
  }>({});

  useEffect(() => {
    // to get the schema of filled fields
    if (
      !creation &&
      typeof sezioneQ3 !== 'string' &&
      sezioneQ3?.json &&
      typeof sezioneQ3?.json === 'string'
    ) {
      setSezioneQ3Compilato(formatAndParseJsonString(sezioneQ3?.json));
    }
  }, [sezioneQ3]);

  useEffect(() => {
    // to update the form with the pre-filled values
    if (
      !creation &&
      form &&
      Object.keys(form)?.length > 0 &&
      Object.keys(sezioneQ3Compilato)?.length > 0 &&
      Array.isArray(sezioneQ3Compilato?.properties)
    ) {
      const newFormData: { [key: string]: string | string[] } = {};
      sezioneQ3Compilato?.properties.map((value) => {
        Object.keys(value).map((key: string) => {
          if (key === '25' || key === '26') {
            // multiple values
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            newFormData[key] = (value[key] || ['']).map((e: string) => e.replaceAll(separator, ','));
          } else {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            newFormData[key] = (value[key] || ['']).map((e: string) => e.replaceAll(separator, ',')).join(separator);
          }
          //newFormData[key] = (value[key] || ['']).map((e: string) => e.replaceAll(separator, ',')).join(separator);
        });
      });
      setFormValues(newFormData);
    }
  }, [sezioneQ3Compilato, form && Object.keys(form)?.length]);

  useEffect(() => {
    // to update form structure
    if (dynamicFormQ3) updateForm(dynamicFormQ3);
  }, [dynamicFormQ3 && Object.keys(dynamicFormQ3)?.length]);

  useEffect(() => {
    sendNewValues?.(getFormValues?.());
    setIsFormValid?.(FormHelper.isValidForm(form));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form]);

  const onInputDataChange = (
    value: formFieldI['value'],
    field?: formFieldI['field']
  ) => {
    onInputChange?.(value, field);
    setIsFormValid?.(FormHelper.isValidForm(form));
  };

  const getAnswerType = (field: formFieldI) => {
    switch (field.type) {
      case 'date':
      case 'time':
      case 'text': {
        return (
          <Input
            {...field}
            id={`input-${field.field}`}
            col={
              field.label && field.label?.length > 20
                ? 'col-12'
                : 'col-12 col-lg-6'
            }
            label={field.label}
            type={field.type}
            required
            onInputChange={onInputDataChange}
            placeholder={`Inserisci ${field.label?.toLowerCase()}`}
            disabled={formDisabled}
          />
        );
      }
      case 'select': {
        return (
          <Select
            id={`input-${field}`}
            field={field.field}
            label={field.label || ''}
            col={field.field === '24' ? 'col-12' : 'col-12 col-lg-6'}
            required={field.required || false}
            onInputChange={onInputDataChange}
            placeholder={`Inserisci ${field.label?.toLowerCase()}`}
            options={field.options}
            isDisabled={formDisabled}
            value={field.value}
            wrapperClassName='mb-5 pr-lg-3'
          />
        );
      }
      case 'checkbox': {
        //nascondi field level2
        if (field.format === 'multiple-select' && field.relatedFrom !== '') {
          return null;
        }
        // visualizza field level1 e mappa opzioni
        if (
          form &&
          field.format === 'multiple-select' &&
          field.relatedTo !== ''
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
              field={field.field}
              secondLevelField={relatedTo}
              id={`multiple-select-${field.id}`}
              col='col-12'
              label={`${field?.label}`}
              aria-label={field?.label}
              options={multiSelectOptions}
              required={field.required || false}
              onInputChange={onInputDataChange}
              onSecondLevelInputChange={onInputDataChange}
              placeholder='Seleziona'
              isDisabled={formDisabled}
              value={values}
              classNamePrefix='form-service-dynamic'
            />
          );
        }
        return (
          <CheckboxGroup
            {...field}
            col='col-12'
            onInputChange={onInputChange}
            label={`${field?.label}`}
            styleLabelForm
            disabled={formDisabled}
            optionsInColumn
            separator={separator}
          />
        );
      }
      default:
        return '';
    }
  };

  return (
    <Form id='form-service-dynamic' formDisabled={formDisabled}>
      <div className='d-inline-flex flex-wrap w-100'>
        {form &&
          Object.keys(form).map((key) => <React.Fragment key={key}>{getAnswerType(form[key])}</React.Fragment>)}
      </div>
    </Form>
  );
};

const form = newForm([]);

export default withFormHandler({ form }, FormServiceDynamic);
