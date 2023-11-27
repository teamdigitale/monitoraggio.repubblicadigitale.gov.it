import clsx from 'clsx';
import React, { useCallback, useEffect, useState } from 'react';
import { Form, Input, Select } from '../../../components';
import CheckboxGroup from '../../../components/Form/checkboxGroup';
import withFormHandler, {
  withFormHandlerProps,
} from '../../../hoc/withFormHandler';
import { selectQuestionarioTemplateSnapshot } from '../../../redux/features/administrativeArea/administrativeAreaSlice';
import { selectEntityDetail } from '../../../redux/features/citizensArea/citizensAreaSlice';
import { useAppSelector } from '../../../redux/hooks';
import {
  formFieldI,
  FormHelper,
  FormI,
  newForm,
  newFormField,
} from '../../../utils/formHelper';
import { generateForm } from '../../../utils/jsonFormHelper';
import { RegexpType } from '../../../utils/validator';
import { FormCitizenI } from '../formCitizen';
import { citizenFormDropdownOptions } from '../constantsFormCitizen';
import { mappaMesi } from '../../../consts/monthsMapForFiscalCode';
import { OptionType } from '../../../components/Form/select';

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
    sendNewValues = () => ({}),
    setIsFormValid = () => ({}),
    getFormValues = () => ({}),
    updateForm = () => ({}),
    searchValue,
    creation = false,
    legend = '',
  } = props;

  if (form && form['3'] && searchValue?.type === 'numeroDoc') {
    form['3'].required = true;
  }
  const formDisabled = !!props.formDisabled;
  const formData: {
    [key: string]: formFieldI['value'] | undefined;
  } = useAppSelector(selectEntityDetail)?.dettaglioCittadino;
  const [dynamicForm, setDynamicForm] = useState<FormI>({});
  const surveyTemplateQ1: any = useAppSelector(
    selectQuestionarioTemplateSnapshot
  )?.sezioniQuestionarioTemplate?.[0];

  useEffect(() => {
    if (surveyTemplateQ1) {
      const formFromSchema = generateForm(
        JSON.parse(surveyTemplateQ1.schema.json)
      );
      Object.keys(formFromSchema).forEach((key: string) => {
        formFromSchema[key].label = formFromSchema[key].value?.toString() || '';
        formFromSchema[key].value = '';
        formFromSchema[key].options = formFromSchema[key]?.options?.map(
          (opt: OptionType) => ({
            label: opt.label,
            value:
              opt.value === 'Codice fiscale non disponibile'
                ? 'true'
                : opt.value,
          })
        );
      });
      setDynamicForm(formFromSchema);
    }
  }, [surveyTemplateQ1 && Object.keys(surveyTemplateQ1)?.length]);

  useEffect(() => {
    if (dynamicForm) updateForm(dynamicForm);
  }, [dynamicForm]);

  useEffect(() => {
    if (!creation && formData && form && Object.keys(form)?.length) {
      const newValues: { [key: string]: formFieldI['value'] } = {};
      Object.keys(form).map((key: string) => {
        const keyBE = form[key]?.keyBE;
        if (keyBE) newValues[key] = formData[keyBE];
      });
      setFormValues(newValues);
    }
  }, [formData]);

  const decodeGenderFromFiscalCode = useCallback((cf: string) => {
    const mese = parseInt(cf.substring(9, 11), 10);
    return mese <= 31 ? 'M' : 'F';
  }, []);

  const determineAgeGroup = useCallback((age: number): string => {
    if (age >= 18 && age <= 29) {
      return '1';
    } else if (age >= 30 && age <= 54) {
      return '2';
    } else if (age >= 55 && age <= 74) {
      return '3';
    } else {
      return '4';
    }
  }, []);

  const decodeAgeFromFiscalCode = useCallback(
    (cf: string) => {
      const today = new Date();
      const rangeCentury = parseInt(
        today.getFullYear().toString().substring(2)
      );
      const isFemale = cf.charAt(9) >= '4';
      const dayOfBirth = parseInt(cf.substring(9, 11)) - (isFemale ? 40 : 0);
      const century = parseInt(cf.substring(6, 8));
      const yearOfBirth =
        century <= rangeCentury ? 2000 + century : 1900 + century;
      const month = mappaMesi.get(cf.charAt(8).toUpperCase()) as number;
      const dateOfBirth = new Date(yearOfBirth, month, dayOfBirth);
      const age = today.getFullYear() - dateOfBirth.getFullYear();
      if (
        today.getMonth() < dateOfBirth.getMonth() ||
        (today.getMonth() === dateOfBirth.getMonth() &&
          today.getDate() < dateOfBirth.getDate())
      ) {
        return determineAgeGroup(age - 1);
      }
      return determineAgeGroup(age);
    },
    [determineAgeGroup]
  );

  useEffect(() => {
    if (form && form['1'] && searchValue?.type === 'codiceFiscale') {
      form['1'].required = true;
      form['1'].value = searchValue?.value;
    }
    if (form && form['2']) {
      form['2'].value = searchValue?.type === 'numeroDoc';
    }
    if (form && form['3'] && searchValue?.type === 'numeroDoc') {
      form['3'].required = true;
    }
    if (form && form['4'] && searchValue?.type === 'numeroDoc') {
      form['4'].value = searchValue?.value;
    }
    if (form && form['5']) {
      form['5'].required = true;
      if (searchValue?.type === 'codiceFiscale') {
        form['5'].value = decodeGenderFromFiscalCode(searchValue.value);
      } else {
        form['5'].value = 'Preferisco non rispondere';
      }
    }
    if (form && form['6']) {
      form['6'].required = true;
      if (searchValue?.type === 'codiceFiscale') {
        form['6'].value = decodeAgeFromFiscalCode(searchValue.value);
      }
    }
  }, [form, decodeAgeFromFiscalCode, decodeGenderFromFiscalCode, searchValue]);

  const onInputDataChange = (
    value: formFieldI['value'],
    field?: formFieldI['field']
  ) => {
    onInputChange(value, field);
    setIsFormValid(FormHelper.isValidForm(form));
  };

  useEffect(() => {
    sendNewValues(getFormValues?.());
    setIsFormValid(FormHelper.isValidForm(form));
  }, [form]);

  const getAnswerType = (field: formFieldI): any => {
    switch (field.type) {
      case 'date':
      case 'time':
      case 'number':
      case 'text': {
        if (field.keyBE === 'codiceFiscale') {
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
              disabled={true}
              onInputChange={onInputDataChange}
              placeholder={`${field.label}`}
              required={searchValue?.type === 'codiceFiscale'}
              value={
                searchValue?.type === 'codiceFiscale' ? searchValue?.value : ''
              }
            />
          );
        }

        if (field.keyBE === 'numeroDocumento') {
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
              disabled={true}
              onInputChange={onInputDataChange}
              placeholder={`${field.label}`}
              touched={true}
              required={searchValue?.type === 'numeroDoc'}
              value={
                searchValue?.type === 'numeroDoc' ? searchValue?.value : ''
              }
            />
          );
        }

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
            onInputChange={onInputDataChange}
            placeholder={`${field.label}`}
          />
        );
      }
      case 'select': {
        if (field.keyBE === 'tipoDocumento') {
          return (
            <Select
              {...field}
              id={`input-${field}`}
              field={field.field}
              label={field.label || ''}
              col={'col-12 col-lg-6'}
              onInputChange={onInputDataChange}
              placeholder={`Seleziona ${field.label?.toLowerCase()}`}
              options={field.options}
              required={searchValue?.type === 'numeroDoc'}
              isDisabled={formDisabled || searchValue?.type === 'codiceFiscale'}
              value={
                searchValue?.type === 'numeroDoc'
                  ? searchValue?.value
                  : field.value
              }
              wrapperClassName='mb-5 pr-lg-3'
            />
          );
        }

        if (field.keyBE === 'genere') {
          return (
            <Select
              {...field}
              id={`input-${field}`}
              field={field.field}
              label={field.label || ''}
              col={'col-12 col-lg-6'}
              onInputChange={onInputDataChange}
              placeholder={`Seleziona ${field.label?.toLowerCase()}`}
              options={field.options}
              isDisabled={formDisabled || searchValue?.type === 'codiceFiscale'}
              value={
                searchValue?.type === 'codiceFiscale'
                  ? decodeGenderFromFiscalCode(searchValue?.value as string)
                  : 'Preferisco non rispondere'
              }
              wrapperClassName='mb-5 pr-lg-3'
            />
          );
        }

        if (field.keyBE === 'fasciaDiEtaId') {
          return (
            <Select
              {...field}
              id={`input-${field}`}
              field={field.field}
              label={field.label || ''}
              col={'col-12 col-lg-6'}
              onInputChange={onInputDataChange}
              placeholder={`Seleziona ${field.label?.toLowerCase()}`}
              options={field.options}
              isDisabled={formDisabled || searchValue?.type === 'codiceFiscale'}
              value={
                searchValue?.type === 'codiceFiscale'
                  ? decodeAgeFromFiscalCode(searchValue?.value as string)
                  : field.value
              }
              wrapperClassName='mb-5 pr-lg-3'
            />
          );
        }

        return (
          <Select
            {...field}
            id={`input-${field}`}
            field={field.field}
            label={field.label || ''}
            col={'col-12 col-lg-6'}
            required={field.required || false}
            onInputChange={onInputDataChange}
            placeholder={`Seleziona ${field.label?.toLowerCase()}`}
            options={field.options}
            isDisabled={formDisabled}
            value={field.value}
            wrapperClassName='mb-5 pr-lg-3'
          />
        );
      }
      case 'checkbox': {
        if (field.keyBE === 'codiceFiscaleNonDisponibile') {
          return (
            <CheckboxGroup
              {...field}
              id={`input-${field}`}
              field={field.field}
              className={clsx('col-12 col-lg-6')}
              noLabel={field.keyBE === 'codiceFiscaleNonDisponibile'}
              styleLabelForm
              classNameLabelOption='pl-5'
              disabled={searchValue?.type !== ''}
              value={searchValue?.type === 'numeroDoc'}
              required={searchValue?.type === 'numeroDoc'}
            />
          );
        }

        // checkbox if options
        if (field.options && field.options?.length) {
          return (
            <CheckboxGroup
              {...field}
              id={`input-${field}`}
              field={field.field}
              styleLabelForm
              classNameLabelOption='pl-5'
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
    <Form
      legend={legend}
      id='form-citizen'
      className='mt-3'
      formDisabled={formDisabled}
      marginShowMandatory={false}
      customMargin='mb-3 pb-3 ml-2'
    >
      <div className='d-inline-flex flex-wrap w-100'>
        {form &&
          Object.keys(form).map((key) => (
            <React.Fragment key={key}>
              {getAnswerType(form[key])}
            </React.Fragment>
          ))}
      </div>
    </Form>
  );
};

const form = newForm([
  newFormField({
    keyBE: 'codiceFiscale',
    id: '1',
    field: '1',
    label: 'Codice fiscale',
    required: false,
  }),
  newFormField({
    keyBE: 'codiceFiscaleNonDisponibile',
    id: '2',
    field: '2',
    type: 'checkbox',
    options: citizenFormDropdownOptions['codiceFiscaleNonDisponibile'],
    required: false,
  }),
  newFormField({
    keyBE: 'tipoDocumento',
    id: '3',
    field: '3',
    label: 'Tipo documento',
    options: citizenFormDropdownOptions['tipoDocumento'],
    type: 'select',
    required: false,
  }),
  newFormField({
    keyBE: 'numeroDocumento',
    id: '4',
    field: '4',
    label: 'Numero documento',
    type: 'text',
    required: false,
    regex: RegexpType.DOCUMENT_NUMBER,
  }),
  newFormField({
    keyBE: 'genere',
    id: '5',
    field: '5',
    label: 'Genere',
    options: citizenFormDropdownOptions['genere'],
    type: 'select',
    required: false,
  }),
  newFormField({
    keyBE: 'fasciaDiEtaId',
    id: '6',
    field: '6',
    label: 'Fascia di età',
    options: citizenFormDropdownOptions['fasciaDiEtaId'],
    type: 'select',
    required: true,
  }),
  newFormField({
    keyBE: 'titoloDiStudio',
    id: '7',
    field: '7',
    label: 'Titolo di studio (livello più alto raggiunto)',
    options: citizenFormDropdownOptions['titoloDiStudio'],
    type: 'select',
    required: true,
  }),
  newFormField({
    keyBE: 'occupazione',
    id: '8',
    field: '8',
    label: 'Stato occupazionale',
    options: citizenFormDropdownOptions['statoOccupazionale'],
    type: 'select',
    required: true,
  }),
  newFormField({
    keyBE: 'provincia',
    id: '9',
    field: '9',
    label: 'Provincia di domicilio',
    type: 'select',
    options: citizenFormDropdownOptions['provincia'],
    required: true,
  }),
  newFormField({
    keyBE: 'cittadinanza',
    id: '10',
    field: '10',
    label: 'Cittadinanza',
    options: citizenFormDropdownOptions['cittadinanza'],
    type: 'select',
    required: true,
  }),
]);

export default withFormHandler({ form }, FormServiceCitizenFull);
