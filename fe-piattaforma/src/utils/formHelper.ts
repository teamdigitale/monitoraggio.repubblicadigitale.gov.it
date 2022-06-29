import { OptionType } from '../components/Form/select';
import { RegexpType, validator } from './validator';

declare type InputType =
  | 'text'
  | 'email'
  | 'select'
  | 'file'
  | 'radio'
  | 'checkbox'
  | 'textarea'
  | 'button'
  | 'reset'
  | 'submit'
  | 'date'
  | 'datetime-local'
  | 'hidden'
  | 'image'
  | 'month'
  | 'number'
  | 'range'
  | 'search'
  | 'tel'
  | 'url'
  | 'week'
  | 'password'
  | 'datetime'
  | 'time'
  | 'color';

export interface formFieldI {
  field: string;
  value?: string | number | boolean | Date | string[];
  valid?: boolean;
  type?: InputType;
  required?: boolean;
  regex?: string;
  touched?: boolean;
  options?: OptionType[] | undefined;
  minimum?: string | number | undefined;
  maximum?: string | number | undefined;
  preset?: boolean;
  id?: string;
  label?: string;
  flag?: boolean;
  dependencyFlag?: string;
  dependencyNotFlag?: string;
  order?: string | number;
  format?: string;
  relatedFrom?: string;
  relatedTo?: string;
  enumLevel1?: string[] | undefined;
  enumLevel2?:
    | { label: string; value: string; upperLevel: string }[]
    | undefined;
}
export interface FormI {
  [key: string]: formFieldI;
}

export const newFormField = ({
  field,
  value = '',
  valid,
  type = 'text',
  required = false,
  regex = RegexpType.ALPHA_NUMERIC_INPUT,
  touched = false,
  options,
  minimum,
  maximum,
  preset = false,
  id = new Date().getTime().toString(),
  label = '',
  flag = false,
  dependencyFlag = '',
  dependencyNotFlag = '',
  order = 1,
  format = 'text',
  relatedFrom = '',
  relatedTo = '',
  enumLevel1,
  enumLevel2,
}: formFieldI) => ({
  field,
  value,
  valid: valid || !(required && touched),
  type,
  required,
  regex,
  touched,
  options,
  minimum,
  maximum,
  preset,
  id,
  label,
  flag,
  dependencyFlag,
  dependencyNotFlag,
  order,
  format,
  relatedFrom,
  relatedTo,
  enumLevel1,
  enumLevel2,
});

export const newForm = (fields: formFieldI[] = [], keepPosition = false) => {
  let form = {};
  fields.forEach(
    (
      {
        field = '',
        valid = false,
        value,
        type,
        required,
        regex,
        touched = false,
        options,
        minimum,
        maximum,
        preset = false,
        id = new Date().getTime().toString(),
        label,
        flag,
        dependencyFlag,
        dependencyNotFlag,
        order,
        format,
        relatedFrom,
        relatedTo,
        enumLevel1,
        enumLevel2,
      },
      i: number
    ) => {
      form = {
        ...form,
        [`${keepPosition ? `${i + 1}-` : ''}${field}`]: {
          field,
          value,
          valid,
          type,
          required,
          regex,
          touched,
          options,
          minimum,
          maximum,
          preset,
          id,
          label,
          flag,
          dependencyFlag,
          dependencyNotFlag,
          order,
          format,
          relatedFrom,
          relatedTo,
          enumLevel1,
          enumLevel2,
        },
      };
    }
  );
  return form;
};

export const FormHelper = {
  onInputChange: (
    form: FormI = {},
    value?: formFieldI['value'],
    field?: formFieldI['field']
  ) => {
    const newForm = { ...form };
    if (newForm && (value || value === '') && field) {
      newForm[field] = {
        ...newForm[field],
        touched: true,
        valid: validator({ ...newForm[field], touched: true }, value),
        value,
      };
    }
    return newForm;
  },
  isValidForm: (form: FormI = {}) => {
    let isValid = true;
    Object.keys(form).forEach((key: string) => {
      const { required = false, value, valid = false } = form[key] || {};
      isValid = isValid && (required ? Boolean(value) && valid : valid);
    });
    return isValid;
  },
  getFormValues: (form: FormI = {}) => {
    const values: {
      [key: string]: formFieldI['value'];
    } = {};
    Object.keys(form).forEach((key: string) => {
      values[key] = form[key]?.value;
    });
    return values;
  },
  setFormValues: (
    form: FormI = {},
    newFormValues: {
      [key: string]: string | number;
    } = {}
  ) => {
    const newForm = { ...form };
    if (
      newForm &&
      Object.keys(newForm).length !== 0 &&
      Object.getPrototypeOf(newForm) === Object.prototype
    ) {
      Object.keys(newFormValues).forEach((field) => {
        newForm[field] = {
          ...newForm[field],
          valid: validator(newForm[field], (newFormValues as any)[field]),
          value: newFormValues[field],
        };
      });
      return newForm;
    }
  },
  updateFormField: (
    form: FormI = {},
    formField: formFieldI | string,
    action: 'add' | 'remove' = 'add'
  ) => {
    switch (action) {
      case 'add': {
        if (typeof formField !== 'string' && formField?.field) {
          return { ...form, [formField.field]: { ...formField } };
        }
        break;
      }
      case 'remove': {
        const newForm = { ...form };
        delete newForm[formField?.toString()];
        return newForm;
      }
      default:
    }
  },
};
