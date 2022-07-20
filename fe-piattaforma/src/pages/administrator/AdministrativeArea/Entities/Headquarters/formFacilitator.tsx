import clsx from 'clsx';
import React, { useState } from 'react';
import { Form, Input } from '../../../../../components';
import withFormHandler, {
  withFormHandlerProps,
} from '../../../../../hoc/withFormHandler';
import {
  formFieldI,
  newForm,
  newFormField,
} from '../../../../../utils/formHelper';
import FormUser from '../../../../forms/formUser';

interface FacilitatorI {
  creation?: boolean;
  formDisabled?: boolean;
  sendNewValues?: (param?: { [key: string]: formFieldI['value'] }) => void;
  setIsFormValid?: (param: boolean | undefined) => void;
}

interface FacilitatorFormI extends FacilitatorI, withFormHandlerProps {}

const FormFacilitator: React.FC<FacilitatorFormI> = (props) => {
  const {
    //setFormValues = () => ({}),
    form,
    onInputChange = () => ({}),
    sendNewValues = () => ({}),
    isValidForm,
    setIsFormValid = () => ({}),
    getFormValues = () => ({}),
    creation = false,
    formDisabled = false,
  } = props;

  const [, /* newFormValues */ setNewFormValues] = useState<{
    [key: string]: formFieldI['value'];
  }>({});

  const onInputDataChange = (
    value: formFieldI['value'],
    field?: formFieldI['field']
  ) => {
    onInputChange(value, field);
    sendNewValues(getFormValues());
    setIsFormValid(isValidForm);
  };

  const bootClass = 'justify-content-between px-0 px-lg-5 mx-2';

  return (
    <Form formDisabled={formDisabled} className='mb-0'>
      <FormUser
        creation={creation}
        formDisabled={!!formDisabled}
        sendNewValues={(newData?: { [key: string]: formFieldI['value'] }) =>
          setNewFormValues({ ...newData })
        }
        setIsFormValid={(value: boolean | undefined) => setIsFormValid(!!value)}
      />
      <Form.Row className={clsx(bootClass, 'mt-0')}>
        <Input
          {...form?.tipoDiContratto}
          required
          label='Tipo di Contratto'
          col='col-12 col-lg-6'
          placeholder='Tipologia di contratto'
          onInputChange={(value, field) => {
            onInputDataChange(value, field);
          }}
        />
      </Form.Row>
    </Form>
  );
};

const form = newForm([
  newFormField({
    field: 'tipoDiContratto',
    id: 'tipoDiContratto',
  }),
]);

export default withFormHandler({ form }, FormFacilitator);
