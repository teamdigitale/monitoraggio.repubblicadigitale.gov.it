import React, { useEffect } from 'react';
import { Form } from '../../../components';
import TextArea from '../../../components/Form/textarea';
import withFormHandler, {
  withFormHandlerProps,
} from '../../../hoc/withFormHandler';
import { formFieldI, newForm, newFormField } from '../../../utils/formHelper';

interface addCommentI extends withFormHandlerProps {
  formDisabled?: boolean;
  sendNewValues?: (param?: { [key: string]: formFieldI['value'] }) => void;
  setIsFormValid?: (param: boolean | undefined) => void;
  creation?: boolean;
}

const FormAddComment: React.FC<addCommentI> = (props) => {
  const {
    form,
    isValidForm,
    onInputChange = () => ({}),
    sendNewValues = () => ({}),
    setIsFormValid = () => ({}),
    getFormValues = () => ({}),
  } = props;
  const formDisabled = !!props.formDisabled;

  useEffect(() => {
    setIsFormValid?.(isValidForm);
    sendNewValues?.(getFormValues?.());
  }, [form]);

  const bootClass = 'justify-content-between px-0 px-lg-5 mx-2';
  return (
    <Form
      id='form-add-comment'
      className='mt-5 mb-0'
      formDisabled={formDisabled}
    >
      <Form.Row className={bootClass}>
        <TextArea
          {...form?.descrizione}
          rows={6}
          cols={100}
          maxLength={1500}
          className='mb-1 mt-3'
          label='Testo'
          placeholder=' '
          onInputChange={onInputChange}
          required
        />
      </Form.Row>
      <Form.Row className={bootClass}>
        <small className='font-italic form-text text-muted mb-5'>
          Massimo 1500 caratteri
        </small>
      </Form.Row>
    </Form>
  );
};

const form = newForm([
  newFormField({
    field: 'testo',
    label: 'Testo',
    id: 'testo',
    required: true,
  }),
]);

export default withFormHandler({ form }, FormAddComment);
