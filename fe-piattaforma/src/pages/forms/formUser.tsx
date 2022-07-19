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
    isValidForm,
    onInputChange = () => ({}),
    sendNewValues = () => ({}),
    setIsFormValid = () => ({}),
    getFormValues = () => ({}),
    creation = false,
  } = props;

  const formDisabled = !!props.formDisabled;
  const { userId } = useParams();
  const formData: { [key: string]: string } =
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
    onInputChange?.(value, field);
    sendNewValues?.(getFormValues?.());
  };

  useEffect(() => {
    setIsFormValid?.(isValidForm);
  }, [form]);

  const bootClass = 'justify-content-between px-0 px-lg-5 mx-2';

  return (
    <Form className='mt-5 mb-5' formDisabled={formDisabled}>
      <Form.Row className={bootClass}>
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
          required
          col='col-lg-6 col-12'
          label='Nome'
          // placeholder='Inserisci nome utente'
          onInputChange={(value, field) => {
            onInputDataChange(value, field);
          }}
        />
        <Input
          {...form?.cognome}
          required
          col='col-12 col-lg-6'
          label='Cognome'
          // placeholder='Inserisci cognome utente'
          onInputChange={(value, field) => {
            onInputDataChange(value, field);
          }}
        />
      </Form.Row>
      <Form.Row className={bootClass}>
        <Input
          {...form?.codiceFiscale}
          required
          label='Codice fiscale'
          col='col-12 col-lg-6'
          // placeholder='Inserisci codice fiscale'
          onInputChange={(value, field) => {
            onInputDataChange(value, field);
          }}
        />
        <Input
          {...form?.telefono}
          required
          col='col-12 col-lg-6'
          label='Telefono'
          // placeholder='Inserisci telefono'
          onInputChange={(value, field) => {
            onInputDataChange(value, field);
          }}
        />
      </Form.Row>
      <Form.Row className={bootClass}>
        <Input
          {...form?.email}
          label='Indirizzo email'
          col='col-12 col-lg-6'
          // placeholder='Inserisci email'
          onInputChange={(value, field) => {
            onInputDataChange(value, field);
          }}
        />
        <Input
          {...form?.mansione}
          label='Mansione'
          col='col-12 col-lg-6'
          // placeholder='Inserisci bio'
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
    id: 'nome',
    required: true,
  }),
  newFormField({
    field: 'cognome',
    id: 'cognome',
    required: true,
  }),
  newFormField({
    field: 'id',
    id: 'id',
  }),
  newFormField({
    field: 'codiceFiscale',
    id: 'codiceFiscale',
    regex: RegexpType.FISCAL_CODE,
    required: true,
  }),
  newFormField({
    field: 'email',
    regex: RegexpType.EMAIL,
    id: 'email',
    required: true,
  }),
  newFormField({
    field: 'telefono',
    id: 'telefono',
    regex: RegexpType.TELEPHONE,
    required: true,
  }),
  /*
  newFormField({
    field: 'authorityRef',
    id: 'authorityRef',
  }),
  */
  newFormField({
    field: 'mansione',
    id: 'mansione',
    required: true,
  }),
]);
export default withFormHandler({ form }, FormUser);
