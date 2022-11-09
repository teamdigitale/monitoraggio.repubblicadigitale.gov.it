import React, { useEffect, useState } from 'react';
import Input, { InputI } from './input';
import { formFieldI } from '../../utils/formHelper';
import './form.scss';

const isExtValueValid = (val: formFieldI['value'], touched: boolean) => {
  const valString = (val || '')?.toString();
  const splitted = valString.split(':');
  if(!touched && val === ''){
    return true;
  }
  return (Number(splitted[0]) || Number(splitted[0]) === 0) &&
    (Number(splitted[1]) || Number(splitted[1]) === 0)
    ? true
    : false;
};

const Duration: React.FC<InputI> = (props) => {
  const {
    id = props.id || props.field || `input-duration-${new Date().getTime()}`,
    value: extValue = '',
    onInputChange = () => ({}),
    touched = false,
  } = props;
  const [value, setValue] = useState<string>(extValue.toString() || '');
  const [validDuration, setValidDuration] = useState(isExtValueValid(extValue, touched));

  const handleOnDurationChange = (val: formFieldI['value']) => {
    const valString = (val || '')?.toString();
    const splitted = valString.split(':');
    if(valString?.includes('+') || valString?.includes('-')){
      // + & - are not accepted
      setValidDuration(false);
    }else if (splitted[0]?.length > 3) {
      // max hours 999
      setValidDuration(false);
    } else {
      if (Number(splitted[0]) && (Number(splitted[0]) === 0 || Number(splitted[0]) % 1 === 0)) {
        // hours is number || 0
        if (Number(splitted[1]) || Number(splitted[1]) === 0) {
          // minutes is number || 0
          if (splitted[1]?.length > 2) {
            // max minutes has two digits
            setValidDuration(false);
          } else {
            if (Number(splitted[1]) <= 59 && valString !== ':') {
              setValidDuration(true);
              setValue(valString);
            } else {
              // minutes is bigger than 59
              setValidDuration(false);
            }
          }
        } else if (!splitted[1]) {
          // minutes do not exist
          setValidDuration(true);
          setValue(valString);
        } else if (!Number(splitted[1])) {
          // minutes is not number
          setValidDuration(false);
        }
      } else {
        // hours is not number or hours is not integer
        setValidDuration(false);
      }
    }
  };

  useEffect(() => {
    if (extValue !== value) handleOnDurationChange(extValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [extValue]);

  useEffect(() => {
    if (value !== extValue) {
      const valString = (value || '')?.toString();
      const splitted = valString.split(':');
      let manipulatedValue = valString;
      if (splitted[0]?.length === 1 && !splitted[1]) {
        manipulatedValue = '0' + manipulatedValue;
      }
      if (splitted[0] && !splitted[1]) {
        valString.includes(':')
          ? (manipulatedValue = manipulatedValue + '00')
          : (manipulatedValue = manipulatedValue + ':00');
      }
      if (splitted[1] && splitted[1]?.length === 1) {
        manipulatedValue = splitted[0] + ':0' + splitted[1];
      }
      setValue(manipulatedValue);
      onInputChange(manipulatedValue, props.field);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <Input
      {...props}
      id={id}
      type='text'
      placeholder='hh:mm'
      maximum={6}
      minimum={1}
      onInputBlur={handleOnDurationChange}
      value={value}
      onInputChange={() => ({})}
      valid={validDuration}
    />
  );
};

export default Duration;
