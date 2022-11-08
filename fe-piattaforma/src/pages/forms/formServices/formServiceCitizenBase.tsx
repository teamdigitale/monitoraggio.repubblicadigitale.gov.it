import React, { useEffect } from 'react';
import { Form, Input, PrefixPhone } from '../../../components';
import { TableRowI } from '../../../components/Table/table';
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

interface FormServiceCitizenBaseI {
  selectedCitizen?: CittadinoInfoI | TableRowI | string;
}
interface FormEnteGestoreProgettoFullInterface
  extends withFormHandlerProps,
    FormServiceCitizenBaseI,
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
    selectedCitizen = undefined,
  } = props;

  // const device = useAppSelector(selectDevice);
  const formDisabled = !!props.formDisabled;
  const formDataCitizens: CittadinoInfoI[] = useAppSelector(
    selectCitizenSearchResponse
  );

  useEffect(() => {
    if (formDataCitizens?.length === 1) {
      const values = { ...formDataCitizens[0] };
      setFormValues(values);
    } else if (formDataCitizens?.length > 1 && selectedCitizen) {
      const values = {
        ...formDataCitizens[
          formDataCitizens.findIndex(
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            (x) => x.idCittadino === selectedCitizen?.id
          )
        ],
      };
      setFormValues(values);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formDataCitizens]);

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
    ...CommonFields.NUMERO_TELEFONICO,
    field: 'cellulare',
    id: 'numeroCellulare',
    label: 'Cellulare',
    type: 'text',
    //required: true,
  }),
  newFormField({
    ...CommonFields.NUMERO_TELEFONICO,
    field: 'telefono',
    id: 'telefono',
    label: 'Cellulare',
    type: 'text',
  }),
]);

export default withFormHandler({ form }, FormServiceCitizenBase);
