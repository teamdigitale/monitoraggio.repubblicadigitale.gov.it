import React, { useEffect } from 'react';
import GenericModal from '../../../components/Modals/GenericModal/genericModal';
import withFormHandler, {
  withFormHandlerProps,
} from '../../../hoc/withFormHandler';
import { newForm, newFormField } from '../../../utils/formHelper';
import { useDispatch } from 'react-redux';
import { closeModal } from '../../../redux/features/modal/modalSlice';
import { Form, Input } from '../../../components';
import { useAppSelector } from '../../../redux/hooks';
import { selectUser } from '../../../redux/features/user/userSlice';
import { WorkDocsRegistration } from '../../../redux/features/forum/forumThunk';
import { RegexpType } from '../../../utils/validator';

interface WorkdocsRegistrationModalI extends withFormHandlerProps {
  onClose?: () => void;
  onRegistrationComplete?: () => void;
}

const WorkdocsRegistrationModal: React.FC<WorkdocsRegistrationModalI> = (
  props
) => {
  const { email, id: idUtente = '' } = useAppSelector(selectUser) || {};
  const {
    isValidForm,
    form,
    clearForm = () => ({}),
    onClose = () => ({}),
    onRegistrationComplete = () => ({}),
    onInputChange = () => ({}),
    getFormValues = () => ({}),
    updateForm = () => ({}),
  } = props;

  const dispatch = useDispatch();

  const resetModal = () => {
    clearForm();
    onClose();
    dispatch(closeModal());
  };

  const handleOnSubmit = async () => {
    if (isValidForm && email && idUtente) {
      try {
        const res = await dispatch(
          WorkDocsRegistration({
            email,
            idUtente,
            username: email,
            password: getFormValues()?.password?.toString() || '',
          })
        );
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (res) {
          onRegistrationComplete();
          resetModal();
        }
      } catch (err) {
        console.log('WorkdocsRegistrationModal error', err);
      }
    }
  };

  useEffect(() => {
    if (
      form?.password?.value &&
      form?.confirmPassword?.value &&
      form?.password?.value !== form?.confirmPassword?.value
    ) {
      updateForm({
        ...form,
        confirmPassword: {
          ...form.confirmPassword,
          valid: false,
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form?.password?.value, form?.confirmPassword?.value]);

  return (
    <GenericModal
      id='workdocs-registration'
      primaryCTA={{
        disabled: !isValidForm,
        label: 'Registrati',
        onClick: handleOnSubmit,
      }}
      secondaryCTA={{
        label: 'Annulla',
        onClick: resetModal,
      }}
      title='Registrazione WorkDocs'
    >
      <div className='my-3 px-4'>
        <p className='text-center mb-5'>
          Crea una nuova utenza <strong>WorkDocs</strong> per accedere al tool
          di <br />
          collaboration con la tua email: {email}
        </p>
        <Form id='workdocs-registration-form' className='my-3 mx-2'>
          <Form.Row className='justify-content-between px-0 px-lg-5 mx-4'>
            <Input
              {...form?.password}
              col='col-12'
              onInputBlur={onInputChange}
            />
            <Input
              {...form?.confirmPassword}
              col='col-12'
              onInputBlur={onInputChange}
            />
          </Form.Row>
        </Form>
      </div>
    </GenericModal>
  );
};

const form = newForm([
  newFormField({
    field: 'password',
    id: 'password',
    label: 'Crea una nuova password',
    required: true,
    type: 'password',
    regex: RegexpType.PASSWORD_TOOL,
  }),
  newFormField({
    field: 'confirmPassword',
    id: 'confirm-password',
    label: 'Conferma password',
    required: true,
    type: 'password',
  }),
]);
export default withFormHandler({ form }, WorkdocsRegistrationModal);
