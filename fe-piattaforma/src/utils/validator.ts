import isEmpty from 'lodash.isempty';
import { AddressInfoI } from '../components/AdministrativeArea/Entities/Headquarters/AccordionAddressList/AccordionAddress/AccordionAddress';
import { formFieldI } from './formHelper';

/* eslint-disable */
export const RegexpType = {
  EMAIL: 'email',
  NUMBER: 'number',
  STRING: 'string',
  ADDRESS: 'address',
  REGISTRY: 'registry',
  ALPHA_NUMERIC: 'alphaNumeric',
  ALPHA_NUMERIC_INPUT: 'alphaNumericInput',
  FISCAL_CODE: 'fiscalCode',
  POSTAL_CODE: 'postalCode',
  PASSWORD: 'password',
  PASSWORD_TOOL: 'password_tool',
  MOBILE_PHONE: 'mobile_phone',
  MOBILE_PHONE_PREFIX: 'mobile_phone_prefix',
  TELEPHONE: 'telephone',
  DATE: 'date',
  BOOLEAN: 'booleanInput',
  TIME: 'time',
  TIMESTAMP: 'timestamp',
  PIVA: 'piva',
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
  [RegexpType.ALPHA_NUMERIC_INPUT]: /^[a-z A-Z 0-9 àèìòù \'\S _.-{}:,"()]*$/gi,
  [RegexpType.REGISTRY]: /^[a-z A-Z àèìòù \']{2,30}/gi,
  [RegexpType.FISCAL_CODE]:
    /^[A-Z]{6}[0-9]{2}[A-Z][0-9]{2}[A-Z][0-9]{3}[A-Z]$/i,
  [RegexpType.POSTAL_CODE]: /^[0-9]{5}$/gm,
  [RegexpType.PASSWORD]:
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]{8,64}$/,
  [RegexpType.PASSWORD_TOOL]:
    /^(?=.*?[A-Z])(?=(.*[\d]){1,})(?=(.*[\W]){1,})(?!.*\s).{8,64}|(?=.*?[A-Z])(?=(.*[a-z]){1,})(?=(.*[\W]){1,})(?!.*\s).{8,64}|(?=.*?[A-Z])(?=(.*[a-z]){1,})(?=(.*[\d]){1,})(?!.*\s).{8,64}|(?=(.*[a-z]){1,})(?=(.*[\d]){1,})(?=(.*[\W]){1,})(?!.*\s).{8,64}$/gm,
  MOBILE_PHONE_PREFIX:
    /^\+((?:9[679]|8[035789]|6[789]|5[90]|42|3[578]|2[1-689])|9[0-58]|8[1246]|6[0-6]|5[1-8]|4[013-9]|3[0-469]|2[70]|7|1)(?:\W*\d){0,13}/g,
  [RegexpType.TELEPHONE]: /^[0-9]{6,20}$/gi,
  [RegexpType.TIME]: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/g,
  [RegexpType.TIMESTAMP]:
    /^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}(Z?)$/gm,
  [RegexpType.PIVA]: /^[0-9]{11}$/gm,
};

export const validator = (
  {
    regex = RegexpType.ALPHA_NUMERIC,
    required: requiredObj = false,
    touched = false,
    maximum,
    minimum,
  }: {
    regex?: string;
    required?: boolean;
    touched?: boolean;
    maximum?: string | number | undefined;
    minimum?: string | number | undefined;
  },
  data: formFieldI['value'],
  required = false
) => {
  const isRequired = requiredObj || required;
  /*  if (isRequired && touched) { */
  if (data) {
    if (regex === RegexpType.BOOLEAN) {
      return typeof data === 'boolean';
    } else if (regex === RegexpType.DATE && Date.parse(data.toString())) {
      if (
        maximum &&
        Date.parse(maximum.toString()) - Date.parse(data.toString()) < 0
      ) {
        return false;
      } else if (
        minimum &&
        Date.parse(data.toString()) - Date.parse(minimum.toString()) < 0
      ) {
        return false;
      }
      return !!new Date(data.toString()).valueOf();
    } else if (regex !== RegexpType.NUMBER && (minimum || maximum)) {
      if (maximum && Number(maximum) - data.toString()?.length < 0) {
        return false;
      } else if (minimum && Number(minimum) - data.toString()?.length > 0) {
        return false;
      }
    } else if (regex === RegexpType.NUMBER && (minimum || maximum)) {
      if (maximum && Number(maximum) < Number(data)) {
        return false;
      } else if (minimum && Number(minimum) > Number(data)) {
        return false;
      }
    }
    return new RegExp(RegexpRule[regex]).test(data.toString());
  } else {
    if (isRequired && touched) {
      return false;
    } else {
      return true;
    }
  }
};
export const validateAddressList = (addressList: AddressInfoI[]) => {
  return addressList
    .filter((addressList) => !addressList.indirizzoSede?.cancellato)
    .every((addressInfo) => {
      let isValid = true;
      isValid =
        !isEmpty(addressInfo.fasceOrarieAperturaIndirizzoSede) &&
        Object.entries(addressInfo.fasceOrarieAperturaIndirizzoSede).some(
          ([_key, value]) => value !== null
        ) &&
        isValid;
      isValid = Object.entries(addressInfo.indirizzoSede).every(
        ([key, value]) =>
          ['via', 'provincia', 'comune', 'cap'].includes(key) ? value : true
      );
      return isValid;
    });
};
