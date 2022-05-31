import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Form, Input } from '../../components';
import withFormHandler, {
  withFormHandlerProps,
} from '../../hoc/withFormHandler';
import { selectSedi } from '../../redux/features/administrativeArea/administrativeAreaSlice';
import { GetHeadquartersDetail } from '../../redux/features/administrativeArea/headquarters/headquartersThunk';
import { useAppSelector } from '../../redux/hooks';
import { formFieldI, newForm, newFormField } from '../../utils/formHelper';

interface ProgramInformationI {
  formDisabled?: boolean;
  sendNewValues?: (param?: { [key: string]: formFieldI['value'] }) => void;
  setIsFormValid?: (param: boolean | undefined) => void;
  creation?: boolean;
}

interface FormEnteGestoreProgettoFullInterface
  extends withFormHandlerProps,
    ProgramInformationI {}

const form = newForm([
  newFormField({
    field: 'idSede',
  }),

  newFormField({
    field: 'name',
  }),
  newFormField({
    field: 'services',
  }),
  newFormField({
    field: 'address',
  }),
  newFormField({
    field: 'ente',
  }),
]);

const Sedi: React.FC<FormEnteGestoreProgettoFullInterface> = (props) => {
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
  const formData: { [key: string]: string } | undefined =
    useAppSelector(selectSedi)?.detail?.info;
  const dispatch = useDispatch();

  useEffect(() => {
    if (!creation) {
      dispatch(GetHeadquartersDetail('idSede'));
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
          {...form?.idSede}
          label='ID Sede'
          col='col-12 col-lg-6'
          onInputChange={(value, field) => {
            onInputDataChange(value, field);
          }}
          placeholder='Inserisci nome programma'
        />
        <Input
          {...form?.name}
          label='Nome'
          col='col-12 col-lg-6'
          onInputChange={(value, field) => {
            onInputDataChange(value, field);
          }}
          placeholder='Inserisci nome programma'
        />
      </Form.Row>
      <Form.Row className='justify-content-between px-0 px-lg-5 mx-5'>
        <Input
          {...form?.services}
          col='col-12 col-lg-6'
          label='Servizi erogati'
          onInputChange={(value, field) => {
            onInputDataChange(value, field);
          }}
        />
        <Input
          {...form?.address}
          label='Indirizzo'
          col='col-12 col-lg-6'
          onInputChange={(value, field) => {
            onInputDataChange(value, field);
          }}
        />
      </Form.Row>
      <Form.Row className='justify-content-between px-0 px-lg-5 mx-5'>
        <Input
          {...form?.ente}
          col='col-12 col-lg-6'
          label='Ente di riferimento'
          onInputChange={(value, field) => {
            onInputDataChange(value, field);
          }}
        />
      </Form.Row>
    </Form>
  );
};

export default withFormHandler({ form }, Sedi);
