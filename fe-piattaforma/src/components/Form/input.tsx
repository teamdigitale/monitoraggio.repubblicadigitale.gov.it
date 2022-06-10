import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { Input as InputKit, InputProps } from 'design-react-kit';
import { formFieldI } from '../../utils/formHelper';

export interface InputI extends Omit<InputProps, 'value'> {
  col?: string | undefined;
  field?: string;
  id?: string | undefined;
  onInputBlur?:
    | ((value: formFieldI['value'], field?: string) => void)
    | undefined;
  onInputChange?:
    | ((value: formFieldI['value'], field?: string) => void)
    | undefined;
  value?: formFieldI['value'];
  withLabel?: boolean;
}

const Input: React.FC<InputI> = (props) => {
  const {
    checked = false,
    col = props.wrapperClassName ?? 'col-auto',
    field,
    id,
    label = props.field,
    name,
    onInputChange,
    onInputBlur,
    placeholder = '',
    required = false,
    type = 'text',
    valid,
    value = '',
    withLabel = true,
  } = props;

  const [val, setVal] = useState<formFieldI['value']>(value);
  const [check, setChecked] = useState<boolean>(checked);

  useEffect(() => {
    setVal(value);
  }, [value]);

  useEffect(() => {
    setChecked(checked);
  }, [checked]);

  useEffect(() => {
    if (onInputChange && val !== value) onInputChange(val, field);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [val]);

  useEffect(() => {
    if (onInputChange && check !== checked) onInputChange(check, field);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [check]);

  const BaseProps = {
    ...props,
    checked: undefined,
    col: undefined,
    field: undefined,
    onInputBlur: undefined,
    onInputChange: undefined,
    placeholder: type === 'date' ? 'dd/mm/aaaa' : placeholder,
    withLabel: undefined,
  };

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const element = e?.currentTarget.checked;
    setChecked(element);
  };

  const handleInputOnChange = (e?: ChangeEvent<HTMLInputElement>) => {
    const element = e?.currentTarget as HTMLInputElement;
    setVal(element.value ?? '');
  };

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    switch (type) {
      case 'checkbox':
        handleCheckboxChange(e);
        break;
      default:
        handleInputOnChange(e);
        break;
    }
  };

  const InputProps: InputProps = {
    checked: type === 'checkbox' ? check : undefined,
    id: id || field || `input-${new Date().getTime()}`,
    onBlur: (e) => {
      if (onInputBlur) onInputBlur(val, field);
      handleOnChange(e);
    },
    required,
    type,
    wrapperClassName: col,
  };

  if (valid !== undefined) {
    InputProps.valid = valid && !!value;
    InputProps.invalid = !valid;
  }

  InputProps.name = name ?? InputProps.id;
  InputProps.label = withLabel ? label ?? InputProps.name : '';

  const inputRef = useRef<HTMLInputElement>(null);
  const inputLabel = inputRef.current?.nextElementSibling;

  useEffect(() => {
    if (!withLabel && inputRef) {
      inputLabel?.classList.add('visibility-hidden');
    }
  }, [withLabel, inputLabel]);

  return (
    <InputKit
      {...BaseProps}
      {...InputProps}
      onChange={handleOnChange}
      value={typeof val === 'number' ? val : val?.toString() || ''}
      innerRef={inputRef}
    />
  );
};

export default Input;
