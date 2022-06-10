import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Form, Input } from '../../components';
import withFormHandler, {
  withFormHandlerProps,
} from '../../hoc/withFormHandler';
import { selectUsers } from '../../redux/features/administrativeArea/administrativeAreaSlice';
import { GetUserDetail } from '../../redux/features/administrativeArea/user/userThunk';
import { useAppSelector } from '../../redux/hooks';
import { formFieldI, newForm, newFormField } from '../../utils/formHelper';
import { RegexpType } from '../../utils/validator';

interface UserInformationI {
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

interface UserFormI extends withFormHandlerProps, UserInformationI {}
const FormUser: React.FC<UserFormI> = (props) => {
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
    useAppSelector(selectUsers)?.detail?.info;
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

  const bootClass = 'justify-content-between px-0 px-lg-5 mx-5';

  return (
    <Form className='mt-5 mb-5' formDisabled={formDisabled}>
      <Form.Row className={bootClass}>
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
      <Form.Row className={bootClass}>
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
      <Form.Row className={bootClass}>
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
    id: 'name',
  }),
  newFormField({
    field: 'lastName',
    id: 'lastName',
  }),
  newFormField({
    field: 'userId',
    id: 'userId',
  }),
  newFormField({
    field: 'fiscalCode',
    id: 'fiscalCode',
  }),
  newFormField({
    field: 'email',
    regex: RegexpType.EMAIL,
    id: 'email',
  }),
  newFormField({
    field: 'phone',
    id: 'phone',
  }),
]);
export default withFormHandler({ form }, FormUser);
