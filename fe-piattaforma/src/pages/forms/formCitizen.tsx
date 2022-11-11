import clsx from 'clsx';
import React, { useEffect } from 'react';
import { Form, Input, PrefixPhone, Select } from '../../components';
import CheckboxGroup from '../../components/Form/checkboxGroup';
import withFormHandler, {
  withFormHandlerProps,
} from '../../hoc/withFormHandler';
import {
  CittadinoInfoI,
  selectEntityDetail,
} from '../../redux/features/citizensArea/citizensAreaSlice';
import { useAppSelector } from '../../redux/hooks';
import { formatDate } from '../../utils/datesHelper';
import {
  CommonFields,
  formFieldI,
  FormHelper,
  newForm,
  newFormField,
} from '../../utils/formHelper';
import { RegexpType } from '../../utils/validator';
import { citizenFormDropdownOptions } from './constantsFormCitizen';

export interface FormCitizenI {
  formDisabled?: boolean;
  sendNewValues?: (param?: { [key: string]: formFieldI['value'] }) => void;
  setIsFormValid?: (param: boolean) => void;
  creation?: boolean;
  info?: CittadinoInfoI;
  editMode?: boolean;
  legend?: string | undefined;
}

interface FormEnteGestoreProgettoFullInterface
  extends withFormHandlerProps,
    FormCitizenI {}

const FormCitizen: React.FC<FormEnteGestoreProgettoFullInterface> = (props) => {
  const {
    // setFormValues = () => ({}),
    form,
    onInputChange = () => ({}),
    sendNewValues,
    // isValidForm,
    setIsFormValid = () => ({}),
    getFormValues,
    setFormValues = () => ({}),
    updateForm = () => ({}),
    editMode = false,
    legend = '',
  } = props;

  // const device = useAppSelector(selectDevice);
  const formDisabled = !!props.formDisabled;
  const formData: {
    [key: string]: formFieldI['value'] | undefined;
  } = useAppSelector(selectEntityDetail)?.dettaglioCittadino;

  useEffect(() => {
    if (formData && form) {
      const values: { [key: string]: formFieldI['value'] | undefined } = {};
      Object.keys(formData).map((keyData: string) => {
        Object.keys(form).map((keyForm: string) => {
          if (form[keyForm]?.keyBE === keyData) {
            values[keyForm] = formData[keyData];
          }
        });
      });
      if (!formData?.tipoConferimentoConsenso) {
        values['18'] = '$consenso';
      }
      if (!formData?.dataConferimentoConsenso) {
        values['19'] = '$dataConsenso';
      }
      if (formData?.codiceFiscale === '') {
        values['4'] = 'Codice fiscale non disponibile';
        handleCheckboxChange('Codice fiscale non disponibile', '4');
      }
      setFormValues(values);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData]);

  const handleCheckboxChange = (
    value?: formFieldI['value'],
    field?: formFieldI['field']
  ) => {
    if (field === '4') {
      const tmpForm = FormHelper.onInputChange(form, value, field);
      const referenceBoolean = !tmpForm?.['4']?.value;
      tmpForm['3'].required = referenceBoolean;
      tmpForm['3'].disabled = !referenceBoolean;
      if (referenceBoolean === false) {
        tmpForm['3'].valid = true;
        tmpForm['3'].value = '';
      }
      tmpForm['5'].required = !referenceBoolean;
      tmpForm['6'].required = !referenceBoolean;
      updateForm(tmpForm);
    }
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

  return (
    <Form
      legend={legend}
      id='form-citizen'
      className='mt-5'
      formDisabled={formDisabled}
    >
      <Form.Row>
        <Input
          {...form?.['1']}
          col='col-12 col-lg-6'
          placeholder={`Inserisci ${form?.['1']?.label?.toLowerCase()}`}
          onInputChange={onInputDataChange}
        />
        <Input
          {...form?.['2']}
          col='col-12 col-lg-6'
          placeholder={`Inserisci ${form?.['2']?.label?.toLowerCase()}`}
          onInputChange={onInputDataChange}
        />
        <Input
          {...form?.['3']}
          col='col-12 col-lg-6'
          label='Codice fiscale'
          placeholder='Inserisci codice fiscale'
          onInputChange={onInputDataChange}
        />
        {editMode ? (
          <CheckboxGroup
            {...form?.['4']}
            className='col-12 col-lg-6'
            options={citizenFormDropdownOptions['codiceFiscaleNonDisponibile']}
            onInputChange={handleCheckboxChange}
            noLabel
            classNameLabelOption='pl-5'
          />
        ) : (
          <span />
        )}
        <Select
          {...form?.['5']}
          placeholder={`Inserisci ${form?.['5']?.label?.toLowerCase()}`}
          onInputChange={onInputDataChange}
          col='col-12 col-lg-6'
          options={citizenFormDropdownOptions['tipoDocumento']}
          isDisabled={formDisabled}
          wrapperClassName='mb-5 pr-lg-3'
        />
        <Input
          {...form?.['6']}
          col='col-12 col-lg-6'
          placeholder={`Inserisci ${form?.['6']?.label?.toLowerCase()}`}
          onInputChange={onInputDataChange}
        />
        <Select
          {...form?.['7']}
          placeholder={`Inserisci ${form?.['7']?.label?.toLowerCase()}`}
          onInputChange={onInputDataChange}
          col='col-12 col-lg-6'
          options={citizenFormDropdownOptions['genere']}
          isDisabled={formDisabled}
          wrapperClassName='mb-5 pr-lg-3'
        />
        <Input
          {...form?.['8']}
          col='col-12 col-lg-6'
          placeholder={`Inserisci ${form?.['8']?.label?.toLowerCase()}`}
          onInputChange={onInputDataChange}
        />
        <Select
          {...form?.['9']}
          placeholder={`Seleziona ${form?.['9']?.label?.toLowerCase()}`}
          onInputChange={onInputDataChange}
          col='col-12 col-lg-6'
          options={citizenFormDropdownOptions['titoloStudio']}
          isDisabled={formDisabled}
          wrapperClassName='mb-5 pr-lg-3'
        />
        <Select
          {...form?.['10']}
          placeholder={`Seleziona ${form?.['10']?.label?.toLowerCase()}`}
          onInputChange={onInputDataChange}
          col='col-12 col-lg-6'
          options={citizenFormDropdownOptions['statoOccupazionale']}
          isDisabled={formDisabled}
          wrapperClassName='mb-5 pr-lg-3'
        />
        <Select
          {...form?.['11']}
          placeholder={`Inserisci ${form?.['11']?.label?.toLowerCase()}`}
          onInputChange={onInputDataChange}
          col='col-12 col-lg-6'
          options={citizenFormDropdownOptions['cittadinanza']}
          isDisabled={formDisabled}
          wrapperClassName='mb-5 pr-lg-3'
        />
        <Input
          {...form?.['12']}
          col='col-12 col-lg-6'
          placeholder={`Inserisci ${form?.['13']?.label?.toLowerCase()}`}
          onInputChange={onInputDataChange}
        />
        <Select
          {...form?.['13']}
          placeholder={`Inserisci ${form?.['13']?.label?.toLowerCase()}`}
          onInputChange={onInputDataChange}
          col='col-12 col-lg-6'
          options={citizenFormDropdownOptions['categoriaFragili']}
          isDisabled={formDisabled}
          wrapperClassName='mb-5 pr-lg-3'
        />
        <Input
          {...form?.['14']}
          col='col-12 col-lg-6'
          placeholder={`Inserisci ${form?.['14']?.label?.toLowerCase()}`}
          onInputChange={onInputDataChange}
          required
        />
        <PrefixPhone
          {...form?.['15']}
          placeholder={`Inserisci ${form?.['15']?.label?.toLowerCase()}`}
          onInputChange={onInputDataChange}
        />
        <Input
          {...form?.['16']}
          col='col-8 col-lg-4'
          placeholder={`Inserisci ${form?.['17']?.label?.toLowerCase()}`}
          onInputChange={onInputDataChange}
        />
        <Input
          {...form?.['17']}
          col='col-12 col-lg-6'
          placeholder={`Inserisci ${form?.['17']?.label?.toLowerCase()}`}
          onInputChange={onInputDataChange}
        />
        {form?.['18']?.value === '$consenso' ||
        form?.['18']?.value === null ||
        form?.['18']?.value === '' ? (
          <CheckboxGroup
            className={clsx(
              'col-12 col-lg-6',
              'compile-survey-container__checkbox-margin'
            )}
            options={[
              { label: "Gestita dall'ente", value: "Gestita dall'ente" },
            ]}
            onInputChange={onInputDataChange}
            styleLabelForm
            classNameLabelOption='pl-5'
            label='Presa visione dell’informativa privacy'
            value="Gestita dall'ente"
            disabled
          />
        ) : (
          <span />
        )}
        {form?.['18']?.value &&
        ['ONLINE', 'EMAIL', 'CARTACEO'].includes(
          form?.['18']?.value.toString()
        ) ? (
          <CheckboxGroup
            {...form?.['18']}
            className={clsx(
              'col-12 col-lg-6',
              'compile-survey-container__checkbox-margin'
            )}
            options={citizenFormDropdownOptions['tipoConferimentoConsenso']}
            styleLabelForm
            classNameLabelOption='pl-5'
            disabled
          />
        ) : (
          <span />
        )}
        {form?.['19']?.value && form?.['19']?.value !== '$dataConsenso' ? (
          <Input
            {...form?.['19']}
            col='col-12 col-lg-6'
            disabled
            value={
              formatDate(
                Number(formData?.dataConferimentoConsenso),
                'snakeDate'
              ) || ''
            }
          />
        ) : (
          <span />
        )}
      </Form.Row>
    </Form>
  );
};

const form = newForm([
  newFormField({
    ...CommonFields.NOME,
    keyBE: 'nome',
    label: 'Nome',
    id: '1',
    field: '1',
    required: true,
    regex: RegexpType.NAME_SURNAME,
  }),
  newFormField({
    ...CommonFields.COGNOME,
    keyBE: 'cognome',
    label: 'Cognome',
    id: '2',
    field: '2',
    required: true,
    regex: RegexpType.NAME_SURNAME,
  }),
  newFormField({
    ...CommonFields.CODICE_FISCALE,
    keyBE: 'codiceFiscale',
    id: '3',
    field: '3',
    label: 'Codice fiscale',
    required: true,
  }),
  newFormField({
    keyBE: 'codiceFiscaleNonDisponibile',
    id: '4',
    field: '4',
    type: 'checkbox',
    required: false,
  }),
  newFormField({
    keyBE: 'tipoDocumento',
    id: '5',
    field: '5',
    label: 'Tipo documento',
    type: 'select',
    required: false,
  }),
  newFormField({
    keyBE: 'numeroDocumento',
    id: '6',
    field: '6',
    label: 'Numero documento',
    type: 'text',
    required: false,
    regex: RegexpType.DOCUMENT_NUMBER,
  }),
  newFormField({
    keyBE: 'genere',
    id: '7',
    field: '7',
    label: 'Genere',
    type: 'select',
    required: true,
  }),
  newFormField({
    keyBE: 'annoNascita',
    id: '8',
    field: '8',
    regex: RegexpType.NUMBER,
    label: 'Anno di nascita',
    type: 'number',
    required: true,
    minimum: 1920,
    maximum: 2020,
  }),
  newFormField({
    keyBE: 'titoloStudio',
    id: '9',
    field: '9',
    label: 'Titolo di studio (livello più alto raggiunto)',
    type: 'select',
    required: true,
  }),
  newFormField({
    keyBE: 'statoOccupazionale',
    id: '10',
    field: '10',
    label: 'Stato occupazionale',
    type: 'select',
    required: true,
  }),
  newFormField({
    keyBE: 'cittadinanza',
    id: '11',
    field: '11',
    label: 'Cittadinanza',
    type: 'select',
    required: true,
  }),
  newFormField({
    keyBE: 'comuneDomicilio',
    id: '12',
    field: '12',
    label: 'Comune di domicilio',
    type: 'text',
    required: true,
  }),
  newFormField({
    keyBE: 'categoriaFragili',
    id: '13',
    field: '13',
    label: 'Categorie fragili',
    type: 'select',
  }),
  newFormField({
    ...CommonFields.EMAIL,
    keyBE: 'email',
    id: '14',
    field: '14',
    label: 'Email',
    required: true,
  }),
  newFormField({
    keyBE: 'prefisso',
    id: '15',
    field: '15',
    regex: RegexpType.MOBILE_PHONE_PREFIX,
    label: 'Prefisso',
    type: 'text',
    required: true,
  }),
  newFormField({
    ...CommonFields.NUMERO_TELEFONICO,
    keyBE: 'numeroCellulare',
    id: '16',
    field: '16',
    label: 'Cellulare',
    type: 'text',
    required: true,
  }),
  newFormField({
    ...CommonFields.NUMERO_TELEFONICO,
    keyBE: 'telefono',
    id: '17',
    field: '17',
    label: 'Telefono',
    type: 'text',
  }),
  newFormField({
    keyBE: 'tipoConferimentoConsenso',
    id: '18',
    field: '18',
    label: 'Tipo conferimento consenso',
    type: 'checkbox',
    // required: true,
  }),
  newFormField({
    keyBE: 'dataConferimentoConsenso',
    id: '19',
    field: '19',
    regex: RegexpType.DATE,
    label: 'Data conferimento consenso',
    type: 'date',
    // required: true,
  }),
]);

export default withFormHandler({ form }, FormCitizen);
