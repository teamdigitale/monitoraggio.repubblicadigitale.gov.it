import React from 'react';
import { useAppSelector } from '../../../redux/hooks';
import { selectDevice } from '../../../redux/features/app/appSlice';
import Profile from '/public/assets/img/change-profile.png';
import { FormI, newForm, newFormField } from '../../../utils/formHelper';
import withFormHandler, {
  withFormHandlerProps,
} from '../../../hoc/withFormHandler';
import { OptionType } from '../../../components/Form/select';
import { Form, Input } from '../../../components';
import { Button, FormGroup, Icon, Label } from 'design-react-kit';
import clsx from 'clsx';

export interface OnboardingI {
  addProfilePicture?: () => void;
  onInputChange?: withFormHandlerProps['onInputChange'];
  onSubmitForm?: () => void;
  optionsSelect?: OptionType[];
  form: withFormHandlerProps['form'];
}

const FormOnboarding: React.FC<withFormHandlerProps> = (props) => {
  const { onInputChange = () => ({}) } = props;
  const device = useAppSelector(selectDevice);

  const addProfilePicture = () => {
    console.log('add picture');
  };

  const onSubmitForm = () => {
    console.log('onSubmit', props.getFormValues && props.getFormValues());
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
        <Form
          className={clsx('mt-5', 'mb-5', 'pt-5', 'onboarding__form-container')}
        >
          <Form.Row>
            <Input
              {...form?.name}
              label='Nome'
              required
              placeholder='Inserisci nome'
              col='col-12 col-md-6'
              onInputChange={onInputChange}
            />
            <Input
              {...form?.surname}
              required
              label='Cognome'
              placeholder='Inserisci cognome'
              col='col-12 col-md-6'
              onInputChange={onInputChange}
            />
          </Form.Row>
          <Form.Row>
            <Input
              {...form?.ID}
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
          <Form.Row>
            <Input
              {...form?.mobile}
              required
              label='Mobile'
              placeholder='Inserisci mobile'
              col='col-12 col-md-6'
              onInputChange={onInputChange}
            />
            <Input
              {...form?.BIO}
              required
              label='Bio'
              placeholder='Nome Mansione'
              col='col-12 col-md-6'
              onInputChange={onInputChange}
              className={clsx(device.mediaIsPhone && 'mb-0')}
            />
          </Form.Row>
          <div
            className={clsx(
              'd-flex flex-row justify-content-start',
              device.mediaIsPhone && 'mt-5',
              'mt-3'
            )}
          >
            <FormGroup check>
              <Input type='checkbox' checked={false} withLabel={false} />
              <Label>
                Consenso al <a href='/'> Trattamento dei dati personali </a>
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
            <Button color='primary' onClick={onSubmitForm}>
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
    field: 'name',
    required: true,
    id: 'name',
  }),
  newFormField({
    field: 'surname',
    required: true,
    id: 'surname',
  }),
  newFormField({
    field: 'email',
    required: true,
    id: 'email',
  }),
  newFormField({
    field: 'ID',
    required: true,
    id: 'fiscal code',
  }),
  newFormField({
    field: 'mobile',
    required: true,
    id: 'mobile',
  }),
  newFormField({
    field: 'BIO',
    id: 'bio',
  }),
]);

export default withFormHandler({ form }, FormOnboarding);
