import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Form, Input } from '../../components';
import withFormHandler, {
  withFormHandlerProps,
} from '../../hoc/withFormHandler';
import { selectUtenti } from '../../redux/features/administrativeArea/administrativeAreaSlice';
import { GetUserDetail } from '../../redux/features/administrativeArea/user/userThunk';
import { useAppSelector } from '../../redux/hooks';
import { formFieldI, newForm, newFormField } from '../../utils/formHelper';
import { RegexpType } from '../../utils/validator';

interface ProgramInformationI {
  /*formData:
    | {
        name?: string;
        lastName?: string;
        role?: string;
        userId?: string;
        fiscalCode?: string;
        email?: string;
        phone?: string;
      }
    | undefined;*/
  formDisabled?: boolean;
  sendNewValues?: (param?: { [key: string]: formFieldI['value'] }) => void;
  setIsFormValid?: (param: boolean | undefined) => void;
  creation?: boolean;
}

interface FormEnteGestoreProgettoFullInterface
  extends withFormHandlerProps,
    ProgramInformationI {}
const FormUser: React.FC<FormEnteGestoreProgettoFullInterface> = (props) => {
  const {
    //    getFormValues = () => ({}),
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
  const { userId } = useParams();
  const formData: { [key: string]: string } | undefined =
    useAppSelector(selectUtenti)?.detail?.info;
  const dispatch = useDispatch();

  useEffect(() => {
    if (!creation) {
      dispatch(GetUserDetail(userId || ''));
    }
  }, [creation]);

  useEffect(() => {
    if (formData) {
      setFormValues(formData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData]);

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
          {...form?.name}
          col='col-lg-6 col-12'
          label='Nome'
          placeholder='Inserisci nome programma'
          onInputChange={(value, field) => {
            onInputDataChange(value, field);
          }}
        />

        <Input
          {...form?.lastName}
          col='col-12 col-lg-6'
          label='Cognome'
          placeholder='Inserisci cognome'
          onInputChange={(value, field) => {
            onInputDataChange(value, field);
          }}
        />
      </Form.Row>
      <Form.Row className='justify-content-between px-0 px-lg-5 mx-5'>
        <Input
          {...form?.userId}
          col='col-12 col-lg-6'
          label='User id'
          placeholder='Inserisci user id'
          onInputChange={(value, field) => {
            onInputDataChange(value, field);
          }}
        />
        <Input
          {...form?.fiscalCode}
          label='Codice fiscale'
          col='col-12 col-lg-6'
          placeholder='Inserisci codice fiscale'
          onInputChange={(value, field) => {
            onInputDataChange(value, field);
          }}
        />
      </Form.Row>
      <Form.Row className='justify-content-between px-0 px-lg-5 mx-5'>
        <Input
          {...form?.email}
          label='Email'
          col='col-12 col-lg-6'
          placeholder='Inserisci email'
          onInputChange={(value, field) => {
            onInputDataChange(value, field);
          }}
        />
        <Input
          {...form?.phone}
          col='col-12 col-lg-6'
          label='Telefono'
          placeholder='Inserisci telefono'
          onInputChange={(value, field) => {
            onInputDataChange(value, field);
          }}
        />
      </Form.Row>
    </Form>
  );
};

const form = newForm([
  newFormField({
    field: 'name',
  }),
  newFormField({
    field: 'lastName',
  }),
  /*newFormField({
    field: 'role',
  }),*/
  newFormField({
    field: 'userId',
  }),
  newFormField({
    field: 'fiscalCode',
  }),
  newFormField({
    field: 'email',
    regex: RegexpType.EMAIL,
  }),
  newFormField({
    field: 'phone',
  }),
]);
export default withFormHandler({ form }, FormUser);
