import React, { useEffect } from 'react';
import { useAppSelector } from '../../../redux/hooks';
import { selectDevice } from '../../../redux/features/app/appSlice';
import {
  CommonFields,
  FormI,
  newForm,
  newFormField,
} from '../../../utils/formHelper';
import withFormHandler, {
  withFormHandlerProps,
} from '../../../hoc/withFormHandler';
import { OptionType } from '../../../components/Form/select';
import { Form, Input } from '../../../components';
import clsx from 'clsx';
import { selectUser } from '../../../redux/features/user/userSlice';
import { RegexpType } from '../../../utils/validator';

export interface FormOnboardingI {
  onInputChange?: withFormHandlerProps['onInputChange'];
  onSubmitForm?: () => void;
  optionsSelect?: OptionType[];
  formDisabled?: boolean;
  creation?: boolean;
  sendNewForm?: (newForm: FormI) => void;
  setIsFormValid?: (param: boolean) => void;
}

interface FormProfileI extends withFormHandlerProps, FormOnboardingI {}
const FormOnboarding: React.FC<FormProfileI> = (props) => {
  const {
    setFormValues = () => ({}),
    setIsFormValid = () => ({}),
    form,
    isValidForm,
    onInputChange,
    sendNewForm = () => ({}),
  } = props;

  const device = useAppSelector(selectDevice);
  const user = useAppSelector(selectUser);
  const formDisabled = !!props.formDisabled;

  useEffect(() => {
    if (user?.codiceFiscale) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      setFormValues(user);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    if (form) sendNewForm(form);
    setIsFormValid(Boolean(isValidForm));
  }, [form, isValidForm]);

  const bootClass = 'justify-content-between px-0 px-lg-5 mx-2';

  return (
    <div className={clsx(device.mediaIsPhone ? 'mx-4 mt-5' : 'mt-5 container')}>
      <Form
        id='form-onboarding'
        className={clsx('mt-5', 'mb-5', 'pt-5', 'onboarding__form-container')}
        formDisabled={formDisabled}
      >
        <Form.Row className={bootClass}>
          <Input
            {...form?.nome}
            disabled
            label='Nome'
            required
            //placeholder='Inserisci nome'
            col='col-12 col-md-6'
            onInputChange={onInputChange}
          />
          <Input
            {...form?.cognome}
            disabled
            required
            label='Cognome'
            //placeholder='Inserisci cognome'
            col='col-12 col-md-6'
            onInputChange={onInputChange}
          />
          <Input
            {...form?.codiceFiscale}
            disabled
            required
            label='Codice Fiscale'
            //placeholder='Inserisci Codice Fiscale'
            col='col-12 col-md-6'
            type='text'
            onInputChange={onInputChange}
          />
          <Input
            {...form?.email}
            required
            label='Email'
            //placeholder='Inserisci email'
            col='col-12 col-md-6'
            onInputChange={onInputChange}
          />
          <Input
            {...form?.telefono}
            required
            label='Telefono'
            //placeholder='Inserisci telefono'
            col='col-12 col-md-6'
            onInputChange={onInputChange}
          />
          <Input
            {...form?.bio}
            required
            label='Posizione Lavorativa'
            //placeholder='Posizione Lavorativa'
            col='col-12 col-md-6'
            onInputChange={onInputChange}
            className={clsx(device.mediaIsPhone && 'mb-0')}
          />
        </Form.Row>
      </Form>
    </div>
  );
};

const form: FormI = newForm([
  newFormField({
    ...CommonFields.NOME,
    field: 'nome',
    required: true,
    id: 'name',
  }),
  newFormField({
    ...CommonFields.COGNOME,
    field: 'cognome',
    required: true,
    id: 'surname',
  }),
  newFormField({
    ...CommonFields.EMAIL,
    field: 'email',
    required: true,
    id: 'email',
  }),
  newFormField({
    ...CommonFields.CODICE_FISCALE,
    field: 'codiceFiscale',
    required: true,
    id: 'fiscalcode',
  }),
  newFormField({
    field: 'telefono',
    required: true,
    id: 'telefono',
    minimum: 9,
    maximum: 20,
    regex: RegexpType.TELEPHONE,
  }),
  newFormField({
    field: 'bio',
    id: 'mansione',
    required: true,
    maximum: 160,
  }),
]);

export default withFormHandler({ form }, FormOnboarding);
