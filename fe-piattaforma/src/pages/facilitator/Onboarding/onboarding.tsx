import React from 'react';
import { useAppSelector } from '../../../redux/hooks';
import { selectDevice } from '../../../redux/features/app/appSlice';
import OnboardingDesktop from './view/onboardingDesktop';
import OnboardingMobile from './view/onboardingMobile';
import { newForm, newFormField } from '../../../utils/formHelper';
import withFormHandler, {
  withFormHandlerProps,
} from '../../../hoc/withFormHandler';
import { OptionType } from '../../../components/Form/select';

export interface OnboardingI {
  addProfilePicture?: () => void;
  onInputChange?: withFormHandlerProps['onInputChange'];
  onSubmitForm?: () => void;
  optionsSelect?: OptionType[];
  form: withFormHandlerProps['form'];
}

const Onboarding: React.FC<withFormHandlerProps> = (props) => {
  const { onInputChange = () => ({}) } = props;
  const device = useAppSelector(selectDevice);

  const addProfilePicture = () => {
    console.log('add picture');
  };

  const onSubmitForm = () => {
    console.log('onSubmit', props.getFormValues && props.getFormValues());
  };

  const optionsSelect = [
    { label: 'Italia', value: 'Italia' },
    { label: 'Europa', value: 'Europa' },
    { label: 'Extra-UE', value: 'Extra-UE' },
  ];

  const componentProps = {
    addProfilePicture,
    onInputChange,
    onSubmitForm,
    optionsSelect,
    form: props.form,
  };

  if (device?.mediaIsPhone) {
    return <OnboardingMobile {...componentProps} />;
  }
  return <OnboardingDesktop {...componentProps} />;
};

const formOnboarding = newForm([
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
    field: 'birthdate',
    required: true,
    id: 'birthday',
  }),
  newFormField({
    field: 'mobile',
    required: true,
    id: 'mobile',
  }),
  newFormField({
    field: 'telephone',
    id: 'telephone',
  }),
  newFormField({
    field: 'residency',
    required: true,
    id: 'residency',
  }),
  newFormField({
    field: 'citizenship',
    id: 'citizenship',
  }),
]);

export default withFormHandler({ form: formOnboarding }, Onboarding);
