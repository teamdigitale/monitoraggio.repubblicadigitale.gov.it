import React, { useEffect } from 'react';
import { Form, Input } from '../../../components';
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
import { formFieldI, newForm, newFormField } from '../../../utils/formHelper';
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
    legend = '',
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
    <Form
      legend={legend}
      id='form-citizen'
      className='mt-5'
      formDisabled={formDisabled}
    >
      <Form.Row>
        <Input
          {...form?.idCittadino}
          col='col-12 col-lg-6'
          label='ID'
          placeholder='ID'
          onInputChange={onInputDataChange}
        />
        <Input
          {...form?.codiceFiscale}
          col='col-12 col-lg-6'
          label='Codice fiscale'
          placeholder='Codice fiscale'
          value={`${
            form?.codiceFiscale.value
              ? 'Codice fiscale disponibile ma non visualizzabile'
              : 'Codice fiscale non presente'
          }  `}
          onInputChange={onInputDataChange}
        />
        <Input
          {...form?.numeroDocumento}
          col='col-12 col-lg-6'
          label='Numero Documento'
          placeholder='Numero documento'
          value={`${
            form?.numeroDocumento.value
              ? 'Numero Documento disponibile ma non visualizzabile'
              : 'Numero Documento non presente'
          }  `}
          onInputChange={onInputDataChange}
        />
      </Form.Row>
    </Form>
  );
};

const form = newForm([
  newFormField({
    field: 'idCittadino',
    id: 'idCittadino',
    type: 'text',
  }),
  newFormField({
    field: 'codiceFiscale',
    id: 'codiceFiscale',
    type: 'text',
  }),
  newFormField({
    field: 'numeroDocumento',
    id: 'numeroDocumento',
    type: 'text',
  }),
]);

export default withFormHandler({ form }, FormServiceCitizenBase);
