import React, { useEffect, useState } from 'react';
import Input, { InputI } from './input';
import { formFieldI, FormI, FormHelper } from '../../utils/formHelper';
import './form.scss';

const isExtValueValid = (val: formFieldI['value'], touched: boolean) => {
  const valString = (val || '')?.toString();
  const splitted = valString.split(':');
  if (!touched && val === '') {
    return true;
  }
  return (Number(splitted[0]) || Number(splitted[0]) === 0) &&
    (Number(splitted[1]) || Number(splitted[1]) === 0)
    ? true
    : false;
};

interface DurationI extends InputI {
  setIsFormValid?: (value: boolean) => void;
  formValues?: FormI;
}

const Duration: React.FC<DurationI> = (props) => {
  const {
    id = props.id || props.field || `input-duration-${new Date().getTime()}`,
    value: extValue = '',
    onInputChange = () => ({}),
    touched = false,
    setIsFormValid = () => ({}),
    formValues = {},
  } = props;
  const [value, setValue] = useState<string>(extValue.toString() || '');
  const [validDuration, setValidDuration] = useState(
    isExtValueValid(extValue, touched)
  );

  const handleOnDurationChange = (val: formFieldI['value']) => {
    const isValid = validateDuration(val);

    const updatedFormValues = {
      ...formValues,
      [props.field ?? 'duration']: {
        ...formValues?.[props.field ?? 'duration'],
        value: val ?? '',
        valid: isValid,
        touched: true,
      },
    };

    setValidDuration(isValid);
    setIsFormValid?.(FormHelper.isValidForm(updatedFormValues) && isValid);
  };



  const handleOnBlur = () => {
    const valString = (value || '')?.toString();
    const splitted = valString.split(':');
    let manipulatedValue = valString;

    if (splitted[0]?.length === 1 && !splitted[1]) {
      manipulatedValue = '0' + manipulatedValue;
    }
    if (splitted[0] && !splitted[1]) {
      manipulatedValue = valString.includes(':')
        ? manipulatedValue + '00'
        : manipulatedValue + ':00';
    }
    if (splitted[1] && splitted[1]?.length === 1) {
      manipulatedValue = splitted[0] + ':0' + splitted[1];
    }

    const isValid = validateDuration(manipulatedValue);

    setValue(manipulatedValue);
    if (isValid) {
      onInputChange(manipulatedValue, props.field);
    }
    setValidDuration(isValid);
    setIsFormValid?.(FormHelper.isValidForm(formValues) && isValid);
  };


  const validateDuration = (val: formFieldI['value']): boolean => {
    const valString = (val || '')?.toString();
    const splitted = valString.split(':');
    let isValid = false;

    if (!valString) return false;
    if (valString?.includes('+') || valString?.includes('-')) return false;
    if (splitted[0]?.length > 3) return false;

    if (Number(splitted[0]) === 0 || Number(splitted[0]) % 1 === 0) {
      if (
        Number(splitted[1]) ||
        (Number(splitted[1]) === 0 && Number(splitted[0]) !== 0)
      ) {
        if (splitted[1]?.length > 2) {
          isValid = false;
        } else {
          if (Number(splitted[1]) <= 59 && valString !== ':') {
            isValid = true;
          }
        }
      } else if (!splitted[1]) {
        isValid = true;
      }
    }

    return isValid;
  };


  useEffect(() => {
    if (extValue !== value) {
      setValue(extValue.toString());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [extValue]);

  return (
    <Input
      {...props}
      id={id}
      type='text'
      placeholder='hh:mm'
      maximum={6}
      minimum={1}
      onInputBlur={handleOnBlur}
      onInputChange={(val) => {
        setValue((val ?? '').toString());
        handleOnDurationChange(val);
      }}
      value={value}
      valid={validDuration}
    />
  );
};

export default Duration;