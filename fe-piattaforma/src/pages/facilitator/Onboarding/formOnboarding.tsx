import React, { useEffect } from 'react';
import { useAppSelector } from '../../../redux/hooks';
import { selectDevice } from '../../../redux/features/app/appSlice';
import {
  formFieldI,
  FormI,
  newForm,
  newFormField,
} from '../../../utils/formHelper';
import withFormHandler, {
  withFormHandlerProps,
} from '../../../hoc/withFormHandler';
import { OptionType } from '../../../components/Form/select';
import { Form, Input } from '../../../components';
import { Button, FormGroup, Label } from 'design-react-kit';
import clsx from 'clsx';
import { selectUsers } from '../../../redux/features/administrativeArea/administrativeAreaSlice';
import { useDispatch } from 'react-redux';
import { GetUserDetail } from '../../../redux/features/administrativeArea/user/userThunk';
import { useParams } from 'react-router-dom';

export interface FormOnboardingI {
  onInputChange?: withFormHandlerProps['onInputChange'];
  onSubmitForm?: () => void;
  optionsSelect?: OptionType[];
  formDisabled?: boolean;
  creation?: boolean;
  sendNewValues?: (param?: { [key: string]: formFieldI['value'] }) => void;
  setIsFormValid?: (param: boolean | undefined) => void;
}

interface FormProfileI extends withFormHandlerProps, FormOnboardingI {}
const FormOnboarding: React.FC<FormProfileI> = (props) => {
  const {
    getFormValues = () => ({}),
    setFormValues = () => ({}),
    form,
    isValidForm,
    setIsFormValid,
    onInputChange,
    creation = false,
    sendNewValues,
  } = props;

  const device = useAppSelector(selectDevice);
  const { userId } = useParams();
  const formDisabled = !!props.formDisabled;
  const formData: { [key: string]: string } | undefined =
    useAppSelector(selectUsers)?.detail?.info;
  const dispatch = useDispatch();

  const onSubmitForm = () => {
    console.log('onSubmit', props.getFormValues && props.getFormValues());
  };

  useEffect(() => {
    if (!creation) {
      dispatch(GetUserDetail(userId || ''));
    }
  }, [creation]);

  useEffect(() => {
    if (formData) {
      setFormValues(formData);
    }
  }, [formData]);

  const onInputDataChange = (
    value: formFieldI['value'],
    field?: formFieldI['field']
  ) => {
    onInputChange?.(value, field);
    sendNewValues?.(getFormValues?.());
    setIsFormValid?.(isValidForm);
  };

  const bootClass = 'justify-content-between px-0 px-lg-5 mx-2';

  return (
    <div className={clsx(device.mediaIsPhone ? 'mx-4 mt-5' : 'mt-5 container')}>
      <Form
        className={clsx('mt-5', 'mb-5', 'pt-5', 'onboarding__form-container')}
        formDisabled={formDisabled}
      >
        <Form.Row className={bootClass}>
          <Input
            {...form?.name}
            label='Nome'
            required
            placeholder='Inserisci nome'
            col='col-12 col-md-6'
            onInputChange={(value, field) => {
              onInputDataChange(value, field);
            }}
          />
          <Input
            {...form?.lastName}
            required
            label='Cognome'
            placeholder='Inserisci cognome'
            col='col-12 col-md-6'
            onInputChange={(value, field) => {
              onInputDataChange(value, field);
            }}
          />
        </Form.Row>
        <Form.Row className={bootClass}>
          <Input
            {...form?.fiscalCode}
            required
            label='Codice Fiscale'
            placeholder='Inserisci Codice Fiscale'
            col='col-12 col-md-6'
            type='text'
            onInputChange={(value, field) => {
              onInputDataChange(value, field);
            }}
          />
          <Input
            {...form?.email}
            required
            label='Email'
            placeholder='Inserisci email'
            col='col-12 col-md-6'
            onInputChange={(value, field) => {
              onInputDataChange(value, field);
            }}
          />
        </Form.Row>
        <Form.Row className={bootClass}>
          <Input
            {...form?.phone}
            required
            label='Mobile'
            placeholder='Inserisci mobile'
            col='col-12 col-md-6'
            onInputChange={(value, field) => {
              onInputDataChange(value, field);
            }}
          />
          <Input
            {...form?.bio}
            required
            label='Bio'
            placeholder='Nome Mansione'
            col='col-12 col-md-6'
            onInputChange={(value, field) => {
              onInputDataChange(value, field);
            }}
            className={clsx(device.mediaIsPhone && 'mb-0')}
          />
        </Form.Row>
      </Form>
      {!(formDisabled || !creation) ? (
        <>
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
        </>
      ) : null}
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
    field: 'lastName',
    required: true,
    id: 'surname',
  }),
  newFormField({
    field: 'email',
    required: true,
    id: 'email',
  }),
  newFormField({
    field: 'fiscalCode',
    required: true,
    id: 'fiscalCode',
  }),
  newFormField({
    field: 'phone',
    required: true,
    id: 'phone',
  }),
  newFormField({
    field: 'bio',
    id: 'bio',
  }),
]);

export default withFormHandler({ form }, FormOnboarding);
