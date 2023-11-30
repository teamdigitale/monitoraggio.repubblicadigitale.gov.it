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
import { useAppSelector } from '../../../redux/hooks';
import { formFieldI, newForm, newFormField } from '../../../utils/formHelper';
import { FormCitizenI } from '../formCitizen';
import ExistingCitizenInfo from './ExistingCitizenInfo';

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
  }, [form, isValidForm, setIsFormValid]);

  return (
    <>
      <ExistingCitizenInfo />
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
            placeholder='ID'
            onInputChange={onInputDataChange}
          />
          <Input
            {...form?.codiceFiscale}
            col='col-12 col-lg-6'
            placeholder='Codice fiscale'
            value={`${
              form?.codiceFiscale.value
                ? 'Codice fiscale disponibile ma non visualizzabile'
                : 'Codice fiscale non presente'
            }  `}
            onInputChange={onInputDataChange}
          />
          <Input
            {...form?.tipoDocumento}
            placeholder='Tipo documento'
            onInputChange={onInputDataChange}
            col='col-12 col-lg-6'
            wrapperClassName='mb-5 pr-lg-3'
          />
          <Input
            {...form?.numeroDocumento}
            col='col-12 col-lg-6'
            placeholder='Numero documento'
            value={`${
              form?.numeroDocumento.value
                ? 'Numero Documento disponibile ma non visualizzabile'
                : 'Numero Documento non presente'
            }  `}
            onInputChange={onInputDataChange}
          />
          <Input
            {...form?.genere}
            placeholder='Genere'
            onInputChange={onInputDataChange}
            col='col-12 col-lg-6'
            wrapperClassName='mb-5 pr-lg-3'
          />
          <Input
            {...form?.fasciaDiEta}
            placeholder='Fascia di età'
            onInputChange={onInputDataChange}
            col='col-12 col-lg-6'
            wrapperClassName='mb-5 pr-lg-3'
          />
          <Input
            {...form?.titoloStudio}
            placeholder='Titolo di studio (livello più alto raggiunto)'
            onInputChange={onInputDataChange}
            col='col-12 col-lg-6'
            wrapperClassName='mb-5 pr-lg-3'
          />
          <Input
            {...form?.statoOccupazionale}
            placeholder='Stato occupazionale'
            onInputChange={onInputDataChange}
            col='col-12 col-lg-6'
            wrapperClassName='mb-5 pr-lg-3'
          />
          <Input
            {...form?.provinciaDiDomicilio}
            placeholder='Provincia di domicilio'
            col='col-12 col-lg-6'
            onInputChange={onInputDataChange}
            wrapperClassName='mb-5 pr-lg-3'
          />
          <Input
            {...form?.cittadinanza}
            placeholder='Cittadinanza'
            onInputChange={onInputDataChange}
            col='col-12 col-lg-6'
            wrapperClassName='mb-5 pr-lg-3'
          />
        </Form.Row>
      </Form>
    </>
  );
};

const form = newForm([
  newFormField({
    field: 'idCittadino',
    id: 'idCittadino',
    type: 'text',
    label: 'ID Cittadino',
  }),
  newFormField({
    field: 'codiceFiscale',
    id: 'codiceFiscale',
    type: 'text',
    label: 'Codice fiscale',
  }),
  newFormField({
    field: 'tipoDocumento',
    type: 'text',
    id: 'tipoDocumento',
    label: 'Tipo documento',
  }),
  newFormField({
    field: 'numeroDocumento',
    id: 'numeroDocumento',
    type: 'text',
    label: 'Numero documento',
  }),
  newFormField({
    field: 'genere',
    id: 'genere',
    type: 'text',
    label: 'Genere',
  }),
  newFormField({
    field: 'fasciaDiEta',
    id: 'fasciaDiEta',
    type: 'text',
    label: 'Fascia di età',
  }),
  newFormField({
    id: 'titoloStudio',
    field: 'titoloStudio',
    type: 'text',
    label: 'Titolo di studio (livello più alto raggiunto)',
  }),
  newFormField({
    field: 'statoOccupazionale',
    id: 'statoOccupazionale',
    type: 'text',
    label: 'Stato occupazionale',
  }),
  newFormField({
    field: 'provinciaDiDomicilio',
    id: 'provinciaDiDomicilio',
    type: 'text',
    label: 'Provincia di domicilio',
  }),
  newFormField({
    field: 'cittadinanza',
    id: 'cittadinanza',
    type: 'text',
    label: 'Cittadinanza',
  }),
]);

export default withFormHandler({ form }, FormServiceCitizenBase);
