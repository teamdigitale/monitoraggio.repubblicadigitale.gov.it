import clsx from 'clsx';
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
import {
  CommonFields,
  formFieldI,
  newForm,
  newFormField,
} from '../../utils/formHelper';
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

  useEffect(() => {
    setIsFormValid?.(isValidForm);
    sendNewValues?.(getFormValues?.());
  }, [form]);

  const bootClass = 'justify-content-between px-0 px-lg-5 mx-2';

  return (
    <Form className='mt-5 mb-0' formDisabled={formDisabled}>
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
          onInputChange={onInputChange}
        />
        <Input
          {...form?.cognome}
          required
          col='col-12 col-lg-6'
          label='Cognome'
          // placeholder='Inserisci cognome utente'
          onInputChange={onInputChange}
        />
      </Form.Row>
      <Form.Row className={bootClass}>
        <Input
          {...form?.codiceFiscale}
          required
          label='Codice fiscale'
          col='col-12 col-lg-6'
          // placeholder='Inserisci codice fiscale'
          onInputChange={onInputChange}
        />
        <Input
          {...form?.telefono}
          required
          col='col-12 col-lg-6'
          label='Telefono'
          // placeholder='Inserisci telefono'
          onInputChange={onInputChange}
        />
      </Form.Row>
      <Form.Row className={clsx(bootClass, 'mb-0')}>
        <Input
          {...form?.email}
          label='Indirizzo email'
          col='col-12 col-lg-6'
          // placeholder='Inserisci email'
          onInputChange={onInputChange}
        />
        <Input
          {...form?.mansione}
          label='Posizione Lavorativa'
          col='col-12 col-lg-6'
          // placeholder='Inserisci bio'
          onInputChange={onInputChange}
        />
      </Form.Row>
      {/* <Form.Row>
       <Input
          {...form?.authorityRef}
          col='col-12 col-lg-6'
          label='Ente di riferimento'
          placeholder='Inserisci ente di riferimento'
           onInputChange={onInputChange}
        />
      </Form.Row> */}
    </Form>
  );
};

const form = newForm([
  newFormField({
    ...CommonFields.NOME,
    field: 'nome',
    id: 'nome',
    required: true,
  }),
  newFormField({
    ...CommonFields.COGNOME,
    field: 'cognome',
    id: 'cognome',
    required: true,
  }),
  newFormField({
    field: 'id',
    id: 'id',
  }),
  newFormField({
    ...CommonFields.CODICE_FISCALE,
    field: 'codiceFiscale',
    id: 'codiceFiscale',
    required: true,
  }),
  newFormField({
    ...CommonFields.EMAIL,
    field: 'email',
    id: 'email',
    required: true,
  }),
  newFormField({
    field: 'telefono',
    id: 'telefono',
    regex: RegexpType.TELEPHONE,
    required: true,
    minimum: 9,
    maximum: 20,
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
    maximum: 160,
  }),
]);
export default withFormHandler({ form }, FormUser);
