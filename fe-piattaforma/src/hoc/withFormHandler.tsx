import React, { useState } from 'react';
import { formFieldI, FormHelper, FormI } from '../utils/formHelper';

export interface withFormHandlerProps {
  clearForm?: () => void;
  form?: FormI;
  getFormValues?: () => { [key: string]: formFieldI['value'] };
  setFormValues?: (newFormValues: {
    [key: string]: formFieldI['value'];
  }) => void;
  isValidForm?: boolean;
  onInputChange?: (
    value: formFieldI['value'],
    field?: formFieldI['field']
  ) => FormI;
  updateForm?: (newForm: FormI) => void;
  updateFormField?: (
    formField: formFieldI | string,
    action?: 'add' | 'remove'
  ) => void;
}

const withFormHandler =
  <P extends object>(
    mainProps: {
      form: FormI;
    },
    Component: React.ComponentType<P>
  ): React.FC<P & withFormHandlerProps> =>
  // eslint-disable-next-line react/display-name
  (props: withFormHandlerProps) => {
    const [form, setForm] = useState<FormI>(mainProps.form);

    const onFormClear = () => {
      if (mainProps?.form) setForm(mainProps.form);
    };

    const onInputChange = (
      value: formFieldI['value'],
      field: formFieldI['field']
    ) => {
      if (
        form &&
        Object.keys(form).length !== 0 &&
        Object.getPrototypeOf(form) === Object.prototype &&
        value !== undefined &&
        value !== null &&
        field
      ) {
        setForm(FormHelper.onInputChange(form, value, field));
      }
    };

    const setFormValues = (newFormValues: {
      [key: string]: string | number;
    }) => {
      setForm(FormHelper.setFormValues(form, newFormValues) || form);
    };

    const updateFormField = (
      formField: formFieldI | string,
      action: 'add' | 'remove' = 'add'
    ) => {
      setForm(FormHelper.updateFormField(form, formField, action) || form);
    };

    const updateForm = (newForm: FormI = {}) => {
      setForm({ ...form, ...newForm });
    };

    return (
      <Component
        {...(props as P)}
        form={form}
        isValidForm={FormHelper.isValidForm(form)}
        getFormValues={() => FormHelper.getFormValues(form)}
        setFormValues={setFormValues}
        onInputChange={onInputChange}
        clearForm={onFormClear}
        updateForm={updateForm}
        updateFormField={updateFormField}
      />
    );
  };

export default withFormHandler;
