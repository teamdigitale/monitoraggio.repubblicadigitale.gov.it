import React, { useEffect } from 'react';
import { useAppSelector } from '../../../redux/hooks';
import { selectDevice } from '../../../redux/features/app/appSlice';
import {
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
import {RegexpType} from "../../../utils/validator";

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
      setFormValues(user);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.codiceFiscale]);

  useEffect(() => {
    if (form) sendNewForm(form);
    setIsFormValid(Boolean(isValidForm));
  }, [form, isValidForm]);

  const bootClass = 'justify-content-between px-0 px-lg-5 mx-2';

  return (
    <div className={clsx(device.mediaIsPhone ? 'mx-4 mt-5' : 'mt-5 container')}>
      <Form
        className={clsx('mt-5', 'mb-5', 'pt-5', 'onboarding__form-container')}
        formDisabled={formDisabled}
      >
        <Form.Row className={bootClass}>
          <Input
            {...form?.nome}
            disabled
            label='Nome'
            required
            placeholder='Inserisci nome'
            col='col-12 col-md-6'
            onInputChange={onInputChange}
          />
          <Input
            {...form?.cognome}
            disabled
            required
            label='Cognome'
            placeholder='Inserisci cognome'
            col='col-12 col-md-6'
            onInputChange={onInputChange}
          />
        </Form.Row>
        <Form.Row className={bootClass}>
          <Input
            {...form?.codiceFiscale}
            disabled
            required
            label='Codice Fiscale'
            placeholder='Inserisci Codice Fiscale'
            col='col-12 col-md-6'
            type='text'
            onInputChange={onInputChange}
          />
          <Input
            {...form?.email}
            required
            label='Email'
            placeholder='Inserisci email'
            col='col-12 col-md-6'
            onInputChange={onInputChange}
          />
        </Form.Row>
        <Form.Row className={bootClass}>
          <Input
            {...form?.telefono}
            required
            label='Telefono'
            placeholder='Inserisci telefono'
            col='col-12 col-md-6'
            onInputChange={onInputChange}
          />
          <Input
            {...form?.bio}
            required
            label='Bio'
            placeholder='Nome Mansione'
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
    field: 'nome',
    required: true,
    id: 'name',
    minimum: 3,
    maximum: 30,
    regex: RegexpType.REGISTRY,
  }),
  newFormField({
    field: 'cognome',
    required: true,
    id: 'surname',
    minimum: 2,
    maximum: 30,
    regex: RegexpType.REGISTRY,
  }),
  newFormField({
    field: 'email',
    required: true,
    id: 'email',
    minimum: 5,
    maximum: 50,
    regex: RegexpType.EMAIL,
  }),
  newFormField({
    field: 'codiceFiscale',
    required: true,
    id: 'fiscalcode',
    regex: RegexpType.FISCAL_CODE,
    maximum: 16,
    minimum: 16,
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
    id: 'bio',
    required: true,
    maximum: 160,
  }),
]);

export default withFormHandler({ form }, FormOnboarding);
