import { formFieldI } from './formHelper';

/* eslint-disable */
export const RegexpType = {
  EMAIL: 'email',
  NUMBER: 'number',
  STRING: 'string',
  ADDRESS: 'address',
  ALPHA_NUMERIC: 'alphaNumeric',
  ALPHA_NUMERIC_INPUT: 'alphaNumericInput',
  FISCAL_CODE: 'fiscalCode',
  POSTAL_CODE: 'postalCode',
  PASSWORD: 'password',
  MOBILE_PHONE: 'mobile_phone',
  TELEPHONE: 'telephone',
  DATE: 'date',
  BOOLEAN: 'booleanInput',
};

const RegexpRule = {
  [RegexpType.EMAIL]:
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/gi,
  [RegexpType.NUMBER]: /^\d+$/g,
  [RegexpType.STRING]:
    /^[a-zA-Z0-9!@#$Â£â‚¬%^&*()_+\-=\[\]{};':"\\|,.<>Â°Â§\/?Ã¨Ã©Ã²Ã Ã¬Ã¹Ã§ ]*$/,
  [RegexpType.ADDRESS]:
    /^[a-zA-Z0-9_\/.,Ã¨Ã©Ã²Ã Ã¬Ã¹'](?:[a-zA-Z0-9_\/.,'\sÃ¨Ã©Ã²Ã Ã¬Ã¹\-]+)?$/gi,
  [RegexpType.ALPHA_NUMERIC]: /^[a-z A-Z 0-9_.-]*$/gi,
  [RegexpType.ALPHA_NUMERIC_INPUT]: /^[a-z A-Z 0-9 àèìòù _.-{}:,"()]*$/gi,
  [RegexpType.FISCAL_CODE]:
    /^[A-Z]{6}[0-9]{2}[A-Z][0-9]{2}[A-Z][0-9]{3}[A-Z]$/i,
  [RegexpType.POSTAL_CODE]: /^[0-9]{5}$/gm,
  [RegexpType.PASSWORD]: /^(?=.*[a-zA-Z0-9])(?=.{8,})/,
  [RegexpType.MOBILE_PHONE]:
    /^(\((00|\+)39\)|(00|\+)39)?(38[890]|34[7-90]|36[680]|33[3-90]|32[89])\d{7}$/,
  [RegexpType.TELEPHONE]: /^([0-9]*\-?\ ?\/?[0-9]*)$/,
};

export const validator = (
  {
    regex = RegexpType.ALPHA_NUMERIC,
    required: requiredObj = false,
    touched = false,
  },
  data: formFieldI['value'],
  required = false
) => {
  const isRequired = requiredObj || required;
  if (isRequired && touched) {
    if (data) {
      if (regex === RegexpType.BOOLEAN) {
        return typeof data === 'boolean';
      } else if (regex === RegexpType.DATE && Date.parse(data.toString()))
        return !!new Date(data.toString()).valueOf();
      return new RegExp(RegexpRule[regex]).test(data.toString());
    }
    return false;
  } else if (data) {
    if (regex === RegexpType.BOOLEAN) {
      return typeof data === 'boolean';
    }
    if (regex === RegexpType.DATE && Date.parse(data.toString()))
      return !!new Date(data.toString()).valueOf();
    return new RegExp(RegexpRule[regex]).test(data.toString());
  }
  return true;
};
