import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Form, Input } from '../../components';
import withFormHandler, {
  withFormHandlerProps,
} from '../../hoc/withFormHandler';
import { selectUsers } from '../../redux/features/administrativeArea/administrativeAreaSlice';
import { GetUserDetails } from '../../redux/features/administrativeArea/user/userThunk';
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
    setFormValues = () => ({}),
    form,
    onInputChange = () => ({}),
    sendNewValues = () => ({}),
    isValidForm,
    setIsFormValid = () => ({}),
    getFormValues = () => ({}),
    creation = false,
  } = props;

  const formDisabled = !!props.formDisabled;
  const { userId } = useParams();
  const formData: { [key: string]: string } | undefined =
    useAppSelector(selectUsers)?.detail?.dettaglioUtente;
  const dispatch = useDispatch();

  useEffect(() => {
    if (!creation) {
      userId && dispatch(GetUserDetails(userId));
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
    onInputChange(value, field);
    sendNewValues(getFormValues());
    setIsFormValid(isValidForm);
  };

  useEffect(() => {
    sendNewValues(getFormValues());
  }, [form]);

  return (
    <Form className='mt-5 mb-5' formDisabled={formDisabled}>
      <Form.Row>
        {/* <Input
          {...form?.userId}
          col='col-12 col-lg-6'
          label='User id'
          placeholder='Inserisci user id'
          onInputChange={(value, field) => {
            onInputDataChange(value, field);
          }}
        /> */}
        <Input
          {...form?.nome}
          col='col-lg-6 col-12'
          label='Nome'
          placeholder='Inserisci nome utente'
          onInputChange={(value, field) => {
            onInputDataChange(value, field);
          }}
        />
        <Input
          {...form?.cognome}
          col='col-12 col-lg-6'
          label='Cognome'
          placeholder='Inserisci cognome utente'
          onInputChange={(value, field) => {
            onInputDataChange(value, field);
          }}
        />
      </Form.Row>
      <Form.Row>
        <Input
          {...form?.codiceFiscale}
          label='Codice fiscale'
          col='col-12 col-lg-6'
          placeholder='Inserisci codice fiscale'
          onInputChange={(value, field) => {
            onInputDataChange(value, field);
          }}
        />
        <Input
          {...form?.telefono}
          col='col-12 col-lg-6'
          label='Telefono'
          placeholder='Inserisci telefono'
          onInputChange={(value, field) => {
            onInputDataChange(value, field);
          }}
        />
      </Form.Row>
      <Form.Row>
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
          {...form?.mansione}
          label='Bio'
          col='col-12 col-lg-6'
          placeholder='Inserisci bio'
          onInputChange={(value, field) => {
            onInputDataChange(value, field);
          }}
        />
      </Form.Row>
      {/* <Form.Row>
       <Input
          {...form?.authorityRef}
          col='col-12 col-lg-6'
          label='Ente di riferimento'
          placeholder='Inserisci ente di riferimento'
          onInputChange={(value, field) => {
            onInputDataChange(value, field);
          }}
        />
      </Form.Row> */}
    </Form>
  );
};

const form = newForm([
  newFormField({
    field: 'nome',
    id: 'name',
  }),
  newFormField({
    field: 'cognome',
    id: 'cognome',
  }),
  newFormField({
    field: 'id',
    id: 'id',
  }),
  newFormField({
    field: 'codiceFiscale',
    id: 'codiceFiscale',
    regex: RegexpType.FISCAL_CODE,
  }),
  newFormField({
    field: 'email',
    regex: RegexpType.EMAIL,
    id: 'email',
  }),
  newFormField({
    field: 'telefono',
    id: 'telefono',
    regex: RegexpType.MOBILE_PHONE,
  }),
  /*
  newFormField({
    field: 'authorityRef',
    id: 'authorityRef',
  }),
  */
  newFormField({ // TODO: update when return field bio
    field: 'mansione',
    id: 'bio',
  }),
]);
export default withFormHandler({ form }, FormUser);
