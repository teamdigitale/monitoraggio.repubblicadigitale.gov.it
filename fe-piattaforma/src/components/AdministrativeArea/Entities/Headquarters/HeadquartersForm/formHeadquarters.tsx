import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Form, Input, Select } from '../../../..';
import withFormHandler, {
  withFormHandlerProps,
} from '../../../../../hoc/withFormHandler';
import { selectHeadquarters } from '../../../../../redux/features/administrativeArea/administrativeAreaSlice';
import { GetHeadquartersDetail } from '../../../../../redux/features/administrativeArea/headquarters/headquartersThunk';
import { useAppSelector } from '../../../../../redux/hooks';
import {
  formFieldI,
  newForm,
  newFormField,
} from '../../../../../utils/formHelper';

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
    type: 'select',
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
    useAppSelector(selectHeadquarters)?.detail?.info;
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
    <Form className='my-5 mx-5' formDisabled={formDisabled}>
      <Form.Row className='justify-content-between'>
        <Input
          {...form?.name}
          label='Nome'
          col='col-12 col-lg-6'
          onInputChange={onInputDataChange}
          placeholder='Inserisci nome programma'
        />
        <Select
          label='Servizi Erogati'
          col='col-12 col-lg-6'
          onInputChange={onInputDataChange}
        />
      </Form.Row>
    </Form>
  );
};

export default withFormHandler({ form }, Sedi);
