import React from 'react';
import clsx from 'clsx';
import { useDispatch } from 'react-redux';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../../redux/hooks';
import { selectDevice } from '../../../redux/features/app/appSlice';
import Profile from '/public/assets/img/change-profile.png';
import { FormI, newForm, newFormField } from '../../../utils/formHelper';
import withFormHandler, {
  withFormHandlerProps,
} from '../../../hoc/withFormHandler';
import { Form, Input } from '../../../components';
import { Button, FormGroup, Icon, Label } from 'design-react-kit';
import { login, selectUser } from '../../../redux/features/user/userSlice';
import { SelectUserRole } from '../../../redux/features/user/userThunk';
import { openModal } from '../../../redux/features/modal/modalSlice';
import FormOnboarding from './formOnboarding';

const Onboarding: React.FC<withFormHandlerProps> = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const device = useAppSelector(selectDevice);
  const user = useAppSelector(selectUser);
  const {
    form,
    isValidForm,
    onInputChange = () => ({}),
    updateForm = () => ({}),
  } = props;

  if (!user?.codiceFiscale) return <Navigate to='/auth' replace />;

  const addProfilePicture = () => {
    console.log('add picture');
  };

  const onSubmitForm = () => {
    console.log('onSubmit', props.getFormValues && props.getFormValues());
    if (isValidForm) {
      if (user.profiliUtente?.length > 1) {
        dispatch(
          openModal({
            id: 'switchProfileModal',
            payload: {
              onSubmit: () => {
                dispatch(login());
                navigate('/');
              },
            },
          })
        );
      } else {
        dispatch(SelectUserRole(user.profiliUtente[0]));
        dispatch(login());
        navigate('/');
      }
    }
  };

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
            <div
              onMouseDown={addProfilePicture}
              role='button'
              tabIndex={0}
              className=' position-relative'
            >
              <img
                src={Profile}
                alt=''
                className='onboarding__img-profile mr-2'
              />
              <div
                className={clsx(
                  'onboarding__icon-container',
                  'primary-bg',
                  'position-absolute',
                  'rounded-circle'
                )}
                style={{ bottom: '40px', right: '50px' }}
              >
                <Icon
                  size='lg'
                  icon='it-camera'
                  padding
                  color='white'
                  aria-label='Foto'
                />
              </div>
            </div>
            <div>
              <p className='complementary-1-color-b8 mb-0'>
                <strong>Foto profilo*</strong>
              </p>
              <p className='complementary-1-color-b8' style={{ fontSize: 14 }}>
                Carica una foto per personalizzare il tuo profilo.
              </p>
            </div>
          </div>
        ) : null}
        <FormOnboarding sendNewForm={(newForm) => updateForm(newForm)} />
        <Form
          className={clsx('mt-5', 'mb-5', 'pt-5', 'onboarding__form-container')}
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
              Completa Regitrazione
            </Button>
          </div>
          <p className={clsx('primary-color-a12', 'mt-5', 'mb-1', 'pb-2')}>
            *Campo obbligatorio
          </p>
        </Form>
      </div>
    </div>
  );
};

const form: FormI = newForm([
  newFormField({
    field: 'nome',
    required: true,
    id: 'name',
  }),
  newFormField({
    field: 'cognome',
    required: true,
    id: 'surname',
  }),
  newFormField({
    field: 'email',
    required: true,
    id: 'email',
  }),
  newFormField({
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
    id: 'bio',
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
