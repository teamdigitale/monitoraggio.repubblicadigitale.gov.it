import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { useDispatch } from 'react-redux';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../../redux/hooks';
import {
  hideBreadCrumb,
  selectDevice,
} from '../../../redux/features/app/appSlice';
import {
  CommonFields,
  FormI,
  newForm,
  newFormField,
} from '../../../utils/formHelper';
import withFormHandler, {
  withFormHandlerProps,
} from '../../../hoc/withFormHandler';
import { Button } from 'design-react-kit';
import {
  login,
  logout,
  selectUser,
} from '../../../redux/features/user/userSlice';
import {
  CreateUserContext,
  EditUser,
  LogoutRedirect,
  SelectUserRole,
} from '../../../redux/features/user/userThunk';
import { openModal } from '../../../redux/features/modal/modalSlice';
import { defaultRedirectUrl } from '../../../routes';
import './registrazione.scss';
import FormRegistrazione from './formRegistrazione';

interface ProfilePicI {
  image?: boolean;
}

interface RegistrazioneI extends ProfilePicI, withFormHandlerProps {}

const Registrazione: React.FC<RegistrazioneI> = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const device = useAppSelector(selectDevice);
  const user = useAppSelector(selectUser);
  const [isValidForm, setIsValidForm] = useState<boolean>(false);
  const { getFormValues = () => ({}), updateForm = () => ({}) } = props;
  const [ruolo, setRuolo] = useState<string>(''); 

  useEffect(() => {
    const userRuolo: any = user;
    setRuolo(userRuolo.ruoli[0].nomeRuolo.toLowerCase() as string);
    if (user?.integrazione) {
      selectUserRole();
      dispatch(hideBreadCrumb());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  if (!user?.codiceFiscale) return <Navigate to={defaultRedirectUrl} replace />;

  const loginUser = () => {
    //navigate(defaultRedirectUrl, { replace: true });
    dispatch(login());
  };

  const selectUserRole = async (newUser?: any) => {
    const usr = newUser || user;
    if (!usr.profiliUtente?.length) {
      dispatch(logout());
      navigate('/errore/A01', { replace: true });
    } else if (usr.profiliUtente?.length > 1) {
      dispatch(
        openModal({
          id: 'switchProfileModal',
          payload: {
            onSubmit: loginUser,
          },
        })
      );
    } else {
      const res = await dispatch(SelectUserRole(usr.profiliUtente[0], true));
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (res) loginUser();
    }
  };

  const onSubmitForm = async () => {
    try {
      //if (isValidForm) {
      const res = await dispatch(EditUser(getFormValues()));
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (res) {
        const res2 = await dispatch(CreateUserContext());
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (res2) {
          selectUserRole(res2);
        }
      }
      // }
    } catch {
      dispatch(LogoutRedirect());
    }
  };

  if (user?.integrazione)
    return <div className='empty-page' style={{ height: '70vh' }} />;

  return (
    <div className={clsx(device.mediaIsPhone ? 'mx-4 mt-5' : 'mt-5 container')}>
      <h1
        className={clsx(
          device.mediaIsPhone
            ? 'h3 my-2 text-primary'
            : 'h3 mt-2 mb-2 text-primary'
        )}
      >
        Compila i dati del tuo profilo e completa la registrazione
      </h1>
      <div className='col-12  mt-4'>
        <p className='h6 complementary-1-color-b8 font-weight-normal'>
          Per completare il tuo profilo da {ruolo} abbiamo bisogno di alcuni
          tuoi dati. <br /> Completa i campi obbligatori per procedere.
        </p>
        <FormRegistrazione
          sendNewForm={updateForm}
          setIsFormValid={(isValid: boolean) => setIsValidForm(isValid)}
        />
        <div
          className={clsx(
            'd-flex mb-3 mt-5',
            'justify-content-between',
            'align-items-center',
            device.mediaIsPhone && 'flex-column align-items-center '
          )}
        >
          {/* eslint-disable-next-line react/no-unescaped-entities */}
          <a href='/informativa-privacy-e-cookie' target='_blank'>
            Leggi l'informativa sul trattamento dei dati personali
          </a>
          <Button
            disabled={!isValidForm}
            color='primary'
            onClick={onSubmitForm}
            className={clsx(
              'd-flex',
              device.mediaIsPhone && 'w-100 mt-3 justify-content-center'
            )}
          >
            Completa Registrazione
          </Button>
        </div>
      </div>
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
  }),
  newFormField({
    field: 'bio',
    id: 'mansione',
    required: true,
  }),
  newFormField({
    field: 'consenso',
    required: true,
    type: 'checkbox',
    value: false,
  }),
]);

export default withFormHandler({ form }, Registrazione);
