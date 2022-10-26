import React, { useEffect } from 'react';
import { Form, Input, Select } from '../../../../../../components';
import withFormHandler, {
  withFormHandlerProps,
} from '../../../../../../hoc/withFormHandler';
import {
  formFieldI,
  newForm,
  newFormField,
} from '../../../../../../utils/formHelper';

interface CategoriesInfoI {
  formDisabled?: boolean;
  newFormValues?: {
    [key: string]: formFieldI['value'];
  };
  sendNewValues?: (param?: { [key: string]: formFieldI['value'] }) => void;
  setIsFormValid?: (param: boolean | undefined) => void;
  creation?: boolean | undefined;
  noIdField?: boolean | undefined;
}

interface CategoriesFormI extends CategoriesInfoI, withFormHandlerProps {}

const CategoryForm: React.FC<CategoriesFormI> = (props) => {
  const {
    /*   setFormValues = () => ({}), */
    form,
    /*  formDisabled = false,  */
    newFormValues,
    isValidForm,
    onInputChange = () => ({}),
    sendNewValues = () => ({}),
    setIsFormValid = () => ({}),
    getFormValues = () => ({}),
    updateForm = () => ({}),
    creation = false,
    /*
    noIdField = false,
    
    clearForm = () => ({}), */
  } = props;

  useEffect(() => {
    if (newFormValues) {
      if (form) {
        const populatedForm: formFieldI[] = Object.entries(newFormValues).map(
          ([key, value]) =>
            newFormField({
              ...form[key],
              value: value || '',
            })
        );

        updateForm(newForm(populatedForm));
      }
    }
  }, [])

  useEffect(() => {
    setIsFormValid(isValidForm);
    sendNewValues({ ...getFormValues() });
  }, [form]);

  const bootClass = 'justify-content-between px-0 px-lg-5 mx-2';
  return (
    <Form id='form-categories' className='my-5 pb-5'>
      <Form.Row className={bootClass}>
        <Input
          {...form?.term_name}
          col='col-12 col-lg-6'
          label='Nome categoria'
          onInputChange={onInputChange}
          required
        />
        <Select
          {...form?.term_type}
          required
          value={form?.term_type.value as string}
          isDisabled={!creation}
          col='col-12 col-lg-6'
          label='Sezione'
          options={[
            { label: 'Bacheca', value: 'board_categories' },
            { label: 'Community', value: 'community_categories' },
            { label: 'Documenti', value: 'document_categories' },
          ]}
          placeholder='Seleziona la sezione'
          onInputChange={onInputChange}
          wrapperClassName='mb-5 pr-lg-3'
          aria-label='tipologia'
        />
      </Form.Row>
    </Form>
  );
};

const form = newForm([
  newFormField({
    field: 'term_name',
    id: 'term_name',
    required: true,
    type: 'text',
  }),
  newFormField({
    field: 'term_type',
    id: 'term_type',
    required: true,
    type: 'select',
  }),
]);

export default withFormHandler({ form }, CategoryForm);
