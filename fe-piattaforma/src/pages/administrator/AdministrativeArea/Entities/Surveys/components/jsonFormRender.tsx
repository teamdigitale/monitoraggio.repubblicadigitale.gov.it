import React, { useEffect } from 'react';
import { Form, Input, Rating, Select } from '../../../../../../components';
import withFormHandler, {
  withFormHandlerProps,
} from '../../../../../../hoc/withFormHandler';
import { formFieldI, newForm } from '../../../../../../utils/formHelper';
import CheckboxGroup from '../../../../../../components/Form/checkboxGroup';
import {
  generateForm,
  SchemaI,
  SchemaUiI,
} from '../../../../../../utils/jsonFormHelper';

interface JsonFormRenderI extends withFormHandlerProps {
  schema?: SchemaI | undefined;
  schemaUI?: SchemaUiI | undefined;
}

const renderInputByType = (
  formField: formFieldI,
  onInputChange: withFormHandlerProps['onInputChange'] = () => ({})
) => {
  switch (formField.type) {
    case 'text':
    default: {
      return (
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        <Input {...formField} onInputBlur={onInputChange} />
      );
    }
    case 'select': {
      if (formField.options?.length) {
        return (
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          <Select
            {...formField}
            onInputChange={onInputChange}
            placeholder='Seleziona'
          />
        );
      }
      break;
    }
    case 'checkbox': {
      if (formField.options?.length) {
        return (
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          <CheckboxGroup {...formField} onInputChange={onInputChange} />
        );
      }
      return (
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        <Input {...formField} onInputChange={onInputChange} />
      );
    }
    case 'range':
      return (
        <>
          <label>{formField.field}</label>
          <Rating onChange={(val) => onInputChange(val, formField.field)} />
        </>
      );
  }
};

const JsonFormRender: React.FC<JsonFormRenderI> = (props) => {
  const {
    schema,
    schemaUI,
    form = {},
    onInputChange = () => ({}),
    updateForm = () => ({}),
  } = props;
  console.log(schema, schemaUI, form, onInputChange);

  useEffect(() => {
    if (schema) {
      updateForm(generateForm(schema));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schema]);

  if (!schema && form) return null;

  return (
    <Form id='compile-survey-form'>
      {Object.keys(form).map((field) => (
        <React.Fragment key={field}>
          {renderInputByType(form[field], onInputChange)}
        </React.Fragment>
      ))}
    </Form>
  );
};

const form = newForm();
export default withFormHandler({ form }, JsonFormRender);
