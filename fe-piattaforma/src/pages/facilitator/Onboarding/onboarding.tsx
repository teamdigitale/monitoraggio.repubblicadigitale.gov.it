import React, { useEffect } from 'react';
import clsx from 'clsx';
import { useDispatch } from 'react-redux';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../../redux/hooks';
import {
  hideBreadCrumb,
  selectDevice,
} from '../../../redux/features/app/appSlice';
import Profile from '/public/assets/img/change-profile.png';
import {
  CommonFields,
  FormI,
  newForm,
  newFormField,
} from '../../../utils/formHelper';
import withFormHandler, {
  withFormHandlerProps,
} from '../../../hoc/withFormHandler';
import { Form, Input } from '../../../components';
import { Button, FormGroup, Icon, Label } from 'design-react-kit';
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
import FormOnboarding from './formOnboarding';
import { defaultRedirectUrl } from '../../../routes';
import '../../../../src/pages/facilitator/Onboarding/onboarding.scss';

interface ProfilePicI {
  image?: boolean;
}

interface OnboardingI extends ProfilePicI, withFormHandlerProps {}

const Onboarding: React.FC<OnboardingI> = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const device = useAppSelector(selectDevice);
  const user = useAppSelector(selectUser);
  const image = user?.immagineProfilo || Profile;
  const {
    form,
    isValidForm,
    getFormValues = () => ({}),
    onInputChange = () => ({}),
    updateForm = () => ({}),
  } = props;

  useEffect(() => {
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
      if (isValidForm) {
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
      }
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
          Per completare il tuo profilo da facilitatore abbiamo bisogno di
          alcuni tuoi dati. <br /> Completa i campi obbligatori per procedere.
        </p>
        {!device.mediaIsPhone ? (
          <div
            className={clsx(
              'd-flex',
              'flex-row',
              'mt-5',
              'pb-4',
              'align-items-center',
              'pt-3'
            )}
          >
            <div role='button' tabIndex={0} className=' position-relative'>
              <div className='rounded-circle onboarding__img-profile position-relative mr-3'>
                <img
                  src={image}
                  alt='profile'
                  className='rounded-circle w-100 h-100'
                />

                <Button
                  onClick={() =>
                    dispatch(
                      openModal({
                        id: 'update-profile-pic-modal',
                        payload: { title: 'Aggiorna immagine profilo' },
                      })
                    )
                  }
                  className={clsx(
                    'onboarding__icon-container',
                    'primary-bg',
                    'position-absolute',
                    'rounded-circle',
                    'profile-picture-btn'
                  )}
                >
                  <Icon
                    size=''
                    icon='it-camera'
                    color='white'
                    aria-label='Foto'
                    className='position-absolute onboarding__icon'
                  />
                </Button>
              </div>
            </div>
            <div>
              <p className='complementary-1-color-b8 mb-0'>
                <strong>Foto profilo</strong>
              </p>
              <p className='complementary-1-color-b8' style={{ fontSize: 14 }}>
                Carica una foto per personalizzare il tuo profilo.
              </p>
            </div>
          </div>
        ) : null}
        <FormOnboarding sendNewForm={updateForm} />
        <Form
          id='form-onboarding'
          className={clsx('mt-5', 'mb-5', 'pt-5', 'onboarding__form-container')}
          showMandatory={false}
        >
          <div
            className={clsx(
              'd-flex flex-row justify-content-start',
              device.mediaIsPhone && 'mt-5',
              'mt-3'
            )}
          >
            <FormGroup check>
              <Input
                aria-label='checkbox-consenso'
                id='checkbox-consenso'
                field='consenso'
                type='checkbox'
                checked={Boolean(form?.consenso?.value)}
                onInputChange={(v) => onInputChange(v, form?.consenso?.field)}
                withLabel={false}
              />
              <Label check for='checkbox-consenso'>
                Consenso al&nbsp;<a href='/'>Trattamento dei dati personali</a>
              </Label>
            </FormGroup>
          </div>
          <div
            className={clsx(
              'd-flex mb-3 mt-5',
              device.mediaIsPhone && 'justify-content-center',
              'justify-content-end'
            )}
          >
            <Button
              disabled={!isValidForm}
              color='primary'
              onClick={onSubmitForm}
            >
              Completa Registrazione
            </Button>
          </div>
          {/* <p className={clsx('primary-color-a12', 'mt-5', 'mb-1', 'pb-2')}>
            *Campo obbligatorio
          </p> */}
        </Form>
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

export default withFormHandler({ form }, Onboarding);
