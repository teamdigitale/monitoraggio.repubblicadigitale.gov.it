import React, { useEffect } from 'react';
import { Form, Input, PrefixPhone } from '../../../components';
import withFormHandler, {
  withFormHandlerProps,
} from '../../../hoc/withFormHandler';
import {
  CittadinoInfoI,
  selectCitizenSearchResponse,
} from '../../../redux/features/citizensArea/citizensAreaSlice';
// import { selectDevice } from '../../../redux/features/app/appSlice';
import { useAppSelector } from '../../../redux/hooks';
import {
  CommonFields,
  formFieldI,
  newForm,
  newFormField,
} from '../../../utils/formHelper';
import { RegexpType } from '../../../utils/validator';
import { FormCitizenI } from '../formCitizen';

interface FormEnteGestoreProgettoFullInterface
  extends withFormHandlerProps,
    FormCitizenI {}

const FormServiceCitizenBase: React.FC<FormEnteGestoreProgettoFullInterface> = (
  props
) => {
  const {
    form,
    onInputChange = () => ({}),
    sendNewValues,
    // isValidForm,
    setIsFormValid = () => ({}),
    getFormValues,
    setFormValues = () => ({}),
    //creation = false,
    isValidForm = false,
  } = props;

  // const device = useAppSelector(selectDevice);
  const formDisabled = !!props.formDisabled;
  const formData: CittadinoInfoI = useAppSelector(
    selectCitizenSearchResponse
  )?.[0];

  useEffect(() => {
    if (formData) {
      const values = { ...formData };
      setFormValues(values);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData]);

  const onInputDataChange = (
    value: formFieldI['value'],
    field?: formFieldI['field']
  ) => {
    onInputChange?.(value, field);
    sendNewValues?.(getFormValues?.());
  };

  useEffect(() => {
    setIsFormValid(isValidForm);
  }, [form]);

  console.log('FormServiceCitizenBase', isValidForm, form);

  return (
    <Form id='form-citizen' className='mt-5' formDisabled={formDisabled}>
      <Form.Row>
        <Input
          {...form?.nome}
          col='col-12 col-lg-6'
          placeholder={`Inserisci ${form?.nome?.label?.toLowerCase()}`}
          onInputChange={onInputDataChange}
          required
        />
        <Input
          {...form?.cognome}
          col='col-12 col-lg-6'
          placeholder={`Inserisci ${form?.cognome?.label?.toLowerCase()}`}
          onInputChange={onInputDataChange}
          required
        />
        <Input
          {...form?.codiceFiscale}
          col='col-12 col-lg-6'
          label='Codice fiscale'
          placeholder='Inserisci codice fiscale'
          onInputChange={onInputDataChange}
          required
        />
        <Input
          {...form?.email}
          col='col-12 col-lg-6'
          placeholder={`Inserisci ${form?.email?.label?.toLowerCase()}`}
          onInputChange={onInputDataChange}
          required
        />
        <PrefixPhone
          {...form?.prefisso}
          placeholder={`Inserisci ${form?.prefisso?.label?.toLowerCase()}`}
          onInputChange={onInputDataChange}
        />
        <Input
          {...form?.cellulare}
          col='col-8 col-lg-4'
          placeholder={`Inserisci ${form?.cellulare?.label?.toLowerCase()}`}
          onInputChange={onInputDataChange}
        />
      </Form.Row>
    </Form>
  );
};

const form = newForm([
  newFormField({
    ...CommonFields.NOME,
    field: 'nome',
    label: 'Nome',
    id: 'name',
  }),
  newFormField({
    ...CommonFields.COGNOME,
    field: 'cognome',
    label: 'Cognome',
    id: 'surname',
  }),
  newFormField({
    ...CommonFields.CODICE_FISCALE,
    field: 'codiceFiscale',
    id: 'codiceFiscale',
    label: 'Codice fiscale',
  }),
  newFormField({
    ...CommonFields.EMAIL,
    field: 'email',
    id: 'email',
    label: 'Email',
    required: true,
  }),
  newFormField({
    field: 'prefisso',
    id: 'prefisso',
    regex: RegexpType.MOBILE_PHONE_PREFIX,
    label: 'Prefisso',
    type: 'text',
    //required: true,
  }),
  newFormField({
    field: 'cellulare',
    id: 'numeroCellulare',
    regex: RegexpType.TELEPHONE,
    label: 'Cellulare',
    type: 'text',
    //required: true,
  }),
  newFormField({
    field: 'telefono',
    id: 'telefono',
    regex: RegexpType.TELEPHONE,
    label: 'Cellulare',
    type: 'text',
  }),
]);

export default withFormHandler({ form }, FormServiceCitizenBase);
