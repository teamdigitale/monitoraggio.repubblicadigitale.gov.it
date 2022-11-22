import React, { useEffect } from 'react';
import { Form } from '../../../components';
import TextArea from '../../../components/Form/textarea';
import withFormHandler, {
  withFormHandlerProps,
} from '../../../hoc/withFormHandler';
import { newForm, newFormField } from '../../../utils/formHelper';

interface addCommentI extends withFormHandlerProps {
  formDisabled?: boolean;
  sendNewValues?: (comment: string) => void;
  setIsFormValid?: (param: boolean | undefined) => void;
  newValue?: string;
  creation?: boolean;
}

const FormAddComment: React.FC<addCommentI> = (props) => {
  const {
    form,
    newValue,
    onInputChange = () => ({}),
    sendNewValues = () => ({}),
    getFormValues = () => ({}),
    updateForm = () => ({}),
  } = props;
  const formDisabled = !!props.formDisabled;

  useEffect(() => {
    if (newValue)
      updateForm(
        newForm([
          newFormField({
            field: 'text',
            label: 'Testo',
            id: 'text',
            required: true,
            value: newValue,
          }),
        ])
      );
  }, [newValue]);

  useEffect(() => {
    const newText = getFormValues().text;

    if (newText !== undefined) sendNewValues(newText as string);
  }, [form]);

  return (
    <Form
      id='form-add-comment'
      className='mt-5 mb-0 d-flex justify-content-center'
      formDisabled={formDisabled}
    >
      <Form.Row className='px-lg-5 mx-2 px-0'>
        <TextArea
          {...form?.text}
          rows={6}
          cols={100}
          maximum={1500}
          className='mb-1 mt-3'
          onInputChange={onInputChange}
          placeholder=' '
          withLabel
        />
      </Form.Row>
      <Form.Row className='px-lg-5 mx-2 px-0'>
        <small className='font-italic form-text text-muted mb-5'>
          Massimo 1500 caratteri
        </small>
      </Form.Row>
    </Form>
  );
};

const form = newForm([
  newFormField({
    field: 'text',
    id: 'text',
    label: 'Digita qui sotto il testo',
    required: true,
    type: 'textarea',
  }),
]);

export default withFormHandler({ form }, FormAddComment);
