import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
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
import Select, { OptionType } from '../../../components/Form/select';
import { Form, Input } from '../../../components';
import { selectUser } from '../../../redux/features/user/userSlice';
import { contractTypes } from '../../administrator/AdministrativeArea/Entities/utils';

export interface FormOnboardingI {
  onInputChange?: withFormHandlerProps['onInputChange'];
  onSubmitForm?: () => void;
  optionsSelect?: OptionType[];
  formDisabled?: boolean;
  creation?: boolean;
  sendNewForm?: (newForm: FormI) => void;
  setIsFormValid?: (param: boolean) => void;
  isProfile?: boolean;
}

interface FormProfileI extends withFormHandlerProps, FormOnboardingI {}
const FormOnboarding: React.FC<FormProfileI> = (props) => {
  const {
    setFormValues = () => ({}),
    updateFormField = () => ({}),
    setIsFormValid = () => ({}),
    form,
    isValidForm,
    onInputChange,
    sendNewForm = () => ({}),
    isProfile = false,
  } = props;

  const device = useAppSelector(selectDevice);
  const user = useAppSelector(selectUser) || {};
  const formDisabled = !!props.formDisabled;

  const [showBio, setShowBio] = useState(false);
  const [showTipoContratto, setShowTipoContratto] = useState(false);

  useEffect(() => {
    if (user?.codiceFiscale) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      setFormValues(user);
      setShowBio(
        user.mostraBio
        /*&& !!user?.profiliUtente?.filter(
          ({ codiceRuolo }) =>
            codiceRuolo === userRoles.REG ||
            codiceRuolo === userRoles.REGP ||
            codiceRuolo === userRoles.DEG ||
            codiceRuolo === userRoles.DEGP ||
            codiceRuolo === userRoles.REPP ||
            codiceRuolo === userRoles.DEPP
        ).length*/
      );
      setShowTipoContratto(
        user.mostraTipoContratto
        /*&& !!user?.profiliUtente?.filter(
          ({ codiceRuolo }) =>
            codiceRuolo === userRoles.FAC || codiceRuolo === userRoles.VOL
        ).length*/
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    if (form) sendNewForm(form);
    setIsFormValid(Boolean(isValidForm));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form, isValidForm]);

  useEffect(() => {
    if (showBio && form?.bio)
      setTimeout(
        () => updateFormField({ ...form.bio, required: showBio }),
        500
      );
  }, [showBio]);

  useEffect(() => {
    if (showTipoContratto && form?.tipoContratto)
      setTimeout(
        () =>
          updateFormField({
            ...form.tipoContratto,
            required: showTipoContratto,
          }),
        500
      );
  }, [showTipoContratto]);

  /* const bootClass = 'justify-content-between px-0 px-lg-5 mx-2'; */

  return (
    <div className={clsx(device.mediaIsPhone ? 'mx-4 mt-5' : 'mt-5 container')}>
      <Form
        id='form-onboarding'
        className={clsx('mt-5', 'mb-5', 'pt-5', 'onboarding__form-container')}
        formDisabled={formDisabled}
      >
        <Form.Row /* className={bootClass} */>
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
          {isProfile ? (
            <Input
              value={user?.id || ''}
              disabled
              label='ID'
              col='col-12 col-md-6'
            />
          ) : (
            <span />
          )}
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
          {showBio ? (
            <Input
              {...form?.bio}
              required
              label='Posizione Lavorativa'
              //placeholder='Posizione Lavorativa'
              col='col-12 col-md-6'
              onInputChange={onInputChange}
              className={clsx(device.mediaIsPhone && 'mb-0')}
            />
          ) : (
            <span />
          )}
          {showTipoContratto ? (
            formDisabled ? (
              <Input
                {...form?.tipoContratto}
                label='Tipo di Contratto'
                col='col-12 col-lg-6'
                // placeholder='Tipologia di contratto'
                onInputChange={onInputChange}
              />
            ) : (
              <Select
                {...form?.tipoContratto}
                value={form?.tipoContratto?.value as string}
                col='col-12 col-lg-6'
                label='Tipo di Contratto'
                placeholder='Seleziona tipo di contratto'
                options={contractTypes}
                onInputChange={onInputChange}
                wrapperClassName='mb-5'
                aria-label='contratto'
                required
              />
            )
          ) : (
            <span />
          )}
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
    ...CommonFields.TELEFONO,
    field: 'telefono',
    required: true,
    id: 'telefono',
  }),
  newFormField({
    field: 'bio',
    id: 'mansione',
    //required: true,
    maximum: 160,
  }),
  newFormField({
    field: 'tipoContratto',
    id: 'tipoContratto',
  }),
]);

export default withFormHandler({ form }, FormOnboarding);
