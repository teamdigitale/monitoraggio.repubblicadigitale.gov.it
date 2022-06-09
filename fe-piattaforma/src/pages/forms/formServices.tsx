import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Form, Input } from '../../components';
import withFormHandler, {
  withFormHandlerProps,
} from '../../hoc/withFormHandler';
import { selectServices } from '../../redux/features/administrativeArea/administrativeAreaSlice';
import { GetServicesDetail } from '../../redux/features/administrativeArea/services/servicesThunk';
import { useAppSelector } from '../../redux/hooks';
import { formFieldI, newForm, newFormField } from '../../utils/formHelper';

interface FormServicesI {
  formDisabled?: boolean;
  sendNewValues?: (param?: { [key: string]: formFieldI['value'] }) => void;
  setIsFormValid?: (param: boolean | undefined) => void;
  creation?: boolean;
}

interface FormEnteGestoreProgettoFullInterface
  extends withFormHandlerProps,
    FormServicesI {}

const form = newForm([
  newFormField({
    field: 'nome',
  }),

  newFormField({
    field: 'tipologia',
  }),
  newFormField({
    field: 'ambito1',
  }),
  newFormField({
    field: 'ambito2',
  }),
  newFormField({
    field: 'ambito3',
  }),
  newFormField({
    field: 'dettagli',
  }),
]);

const Services: React.FC<FormEnteGestoreProgettoFullInterface> = (props) => {
  const {
    setFormValues = () => ({}),
    form,
    onInputChange,
    sendNewValues,
    isValidForm,
    setIsFormValid,
    getFormValues,
    creation = false,
  } = props;

  const formDisabled = !!props.formDisabled;
  // @ts-ignore
  const formData = useAppSelector(selectServices)?.detail?.info;
  const dispatch = useDispatch();

  useEffect(() => {
    if (!creation) {
      dispatch(GetServicesDetail('idSede'));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [creation]);

  useEffect(() => {
    if (formData) {
      setFormValues(formData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData]);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    () => {};
  }, []);

  const onInputDataChange = (
    value: formFieldI['value'],
    field?: formFieldI['field']
  ) => {
    onInputChange?.(value, field);
    sendNewValues?.(getFormValues?.());
    setIsFormValid?.(isValidForm);
  };

  return (
    <Form className='mt-5 mb-5' formDisabled={formDisabled}>
      <Form.Row className='justify-content-between px-0 px-lg-5 mx-5'>
        <Input
          {...form?.nome}
          id={`input-${form?.nome.field}`}
          label='Nome servizio'
          col='col-12'
          onInputChange={(value, field) => {
            onInputDataChange(value, field);
          }}
          placeholder='Nome servizio'
        />
      </Form.Row>
      <Form.Row className='justify-content-between px-0 px-lg-5 mx-5'>
        <Input
          {...form?.tipologia}
          id={`input-${form?.tipologia.field}`}
          label='Tipo di servizio prenotato'
          col='col-12 col-lg-6'
          onInputChange={(value, field) => {
            onInputDataChange(value, field);
          }}
          placeholder='Tipo di servizio prenotato'
        />
        <Input
          {...form?.ambito1}
          id={`input-${form?.ambito1.field}`}
          col='col-12 col-lg-6'
          label='Specificare ambito facilitazione / formazione I *'
          placeholder='Specificare ambito facilitazione / formazione I *'
          onInputChange={(value, field) => {
            onInputDataChange(value, field);
          }}
        />
      </Form.Row>
      <Form.Row className='justify-content-between px-0 px-lg-5 mx-5'>
        <Input
          {...form?.ambito2}
          id={`input-${form?.ambito2.field}`}
          label='Specificare ambito facilitazione / formazione II *'
          placeholder='Specificare ambito facilitazione / formazione II *'
          col='col-12 col-lg-6'
          onInputChange={(value, field) => {
            onInputDataChange(value, field);
          }}
        />
        <Input
          {...form?.ambito3}
          id={`input-${form?.ambito3.field}`}
          col='col-12 col-lg-6'
          label='Specificare ambito facilitazione / formazione III *'
          placeholder='Specificare ambito facilitazione / formazione III *'
          onInputChange={(value, field) => {
            onInputDataChange(value, field);
          }}
        />
      </Form.Row>
      <Form.Row className='justify-content-between px-0 px-lg-5 mx-5'>
        <Input
          {...form?.dettagli}
          id={`input-${form?.dettagli.field}`}
          col='col-12'
          label='Dettagli del servizio (es. argomento ed esigenza specifici) *'
          placeholder='Dettagli del servizio (es. argomento ed esigenza specifici) *'
          onInputChange={(value, field) => {
            onInputDataChange(value, field);
          }}
        />
      </Form.Row>
    </Form>
  );
};

export default withFormHandler({ form }, Services);
