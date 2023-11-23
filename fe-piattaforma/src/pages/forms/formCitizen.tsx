import clsx from 'clsx';
import React, { useEffect } from 'react';
import { Form, Input, Select } from '../../components';
import withFormHandler, {
  withFormHandlerProps,
} from '../../hoc/withFormHandler';
import {
  CittadinoInfoI,
  selectEntityDetail,
} from '../../redux/features/citizensArea/citizensAreaSlice';
import { useAppSelector } from '../../redux/hooks';
import {
  CommonFields,
  formFieldI,
  FormHelper,
  newForm,
  newFormField,
} from '../../utils/formHelper';
import { RegexpType } from '../../utils/validator';
import { citizenFormDropdownOptions } from './constantsFormCitizen';
import { SearchValue } from './models/searchValue.model';

export interface FormCitizenI {
  formDisabled?: boolean;
  sendNewValues?: (param?: { [key: string]: formFieldI['value'] }) => void;
  setIsFormValid?: (param: boolean) => void;
  creation?: boolean;
  info?: CittadinoInfoI;
  editMode?: boolean;
  legend?: string | undefined;
  searchValue?: SearchValue;
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
    //editMode = false,
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
      className={clsx(formDisabled ? 'mt-5' : 'mt-3')}
      formDisabled={formDisabled}
      marginShowMandatory={false}
      customMargin='mb-3 pb-3'
    >
      <Form.Row>
        <Input
          {...form?.['1']}
          col='col-12 col-lg-6'
          placeholder={`${form?.['1']?.label}`}
          onInputChange={onInputDataChange}
        />
        <Input
          {...form?.['2']}
          col='col-12 col-lg-6'
          placeholder={`${form?.['2']?.label}`}
          onInputChange={onInputDataChange}
          value={form?.[2].value ? 'Codice fiscale disponibile ma non visualizzabile' : 'Codice fiscale non presente'}
        />
        <Select
          {...form?.['3']}
          placeholder={`${form?.['3']?.label}`}
          onInputChange={onInputDataChange}
          col='col-12 col-lg-6'
          options={citizenFormDropdownOptions['tipoDocumento']}
          isDisabled={formDisabled}
          wrapperClassName='mb-5 pr-lg-3'
        />
        <Input
          {...form?.['4']}
          col='col-12 col-lg-6'
          placeholder={`${form?.['4']?.label}`}
          onInputChange={onInputDataChange}
          value={form?.[4].value ? 'Documento disponibile ma non visualizzabile' : 'Documento non presente'}
        />
        <Select
          {...form?.['5']}
          placeholder={`${form?.['5']?.label}`}
          onInputChange={onInputDataChange}
          col='col-12 col-lg-6'
          options={citizenFormDropdownOptions['genere']}
          isDisabled={formDisabled}
          wrapperClassName='mb-5 pr-lg-3'
        />
        <Select
          {...form?.['6']}
          placeholder={`${form?.['6']?.label}`}
          onInputChange={onInputDataChange}
          col='col-12 col-lg-6'
          options={citizenFormDropdownOptions['fasciaDiEta']}
          isDisabled={formDisabled}
          wrapperClassName='mb-5 pr-lg-3'
        />
        <Select
          {...form?.['7']}
          placeholder={`Seleziona ${form?.['7']?.label?.toLowerCase()}`}
          onInputChange={onInputDataChange}
          col='col-12 col-lg-6'
          options={citizenFormDropdownOptions['titoloDiStudio']}
          isDisabled={formDisabled}
          wrapperClassName='mb-5 pr-lg-3'
        />
        <Select
          {...form?.['8']}
          placeholder={`Seleziona ${form?.['8']?.label?.toLowerCase()}`}
          onInputChange={onInputDataChange}
          col='col-12 col-lg-6'
          options={citizenFormDropdownOptions['statoOccupazionale']}
          isDisabled={formDisabled}
          wrapperClassName='mb-5 pr-lg-3'
        />
        <Input
          {...form?.['9']}
          placeholder={`${form?.['9']?.label}`}
          onInputChange={onInputDataChange}
          col='col-12 col-lg-6'
        />
        <Select
          {...form?.['10']}
          placeholder={`Seleziona ${form?.['10']?.label?.toLowerCase()}`}
          onInputChange={onInputDataChange}
          col='col-12 col-lg-6'
          options={citizenFormDropdownOptions['cittadinanza']}
          isDisabled={formDisabled}
          wrapperClassName='mb-5 pr-lg-3'
        />
      </Form.Row>
    </Form>
  );
};

const form = newForm([
  newFormField({
    keyBE: 'id',
    label: 'ID Cittadino',
    id: '1',
    field: '1',
    required: true
  }),
  newFormField({
    ...CommonFields.CODICE_FISCALE,
    keyBE: 'codiceFiscale',
    id: '2',
    field: '2',
    label: 'Codice fiscale',
    required: true,
  }),
  newFormField({
    keyBE: 'tipoDocumento',
    id: '3',
    field: '3',
    label: 'Tipo documento',
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
    type: 'select',
    required: true,
  }),
  newFormField({
    keyBE: 'fasciaDiEta',
    id: '6',
    field: '6',
    label: 'Fascia di età',
    type: 'select',
    required: true,
  }),
  newFormField({
    keyBE: 'titoloStudio',
    id: '7',
    field: '7',
    label: 'Titolo di studio (livello più alto raggiunto)',
    type: 'select',
    required: true,
  }),
  newFormField({
    keyBE: 'statoOccupazionale',
    id: '8',
    field: '8',
    label: 'Stato occupazionale',
    type: 'select',
    required: true,
  }),
  newFormField({
    keyBE: 'provincia',
    id: '9',
    field: '9',
    label: 'Provincia di domicilio',
    type: 'text',
    required: true,
  }),
  newFormField({
    keyBE: 'cittadinanza',
    id: '10',
    field: '10',
    label: 'Cittadinanza',
    type: 'select',
    required: true,
  }),
]);

export default withFormHandler({ form }, FormCitizen);
