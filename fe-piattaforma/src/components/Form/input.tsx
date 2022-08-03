import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { Input as InputKit, InputProps, Label } from 'design-react-kit';
import { formFieldI } from '../../utils/formHelper';
import { dayOfWeek } from '../../pages/administrator/AdministrativeArea/Entities/utils';
import clsx from 'clsx';

/**
 * A fix for input warning has been made, maybe it could be the case to improve input component
 * design in a second time
 */
export interface InputI extends Omit<InputProps, 'value'> {
  col?: string | undefined;
  field?: string;
  id?: string | undefined;
  disabled?: boolean | undefined;
  maximum?: string | number | undefined;
  minimum?: string | number | undefined;
  onInputBlur?:
    | ((value: formFieldI['value'], field?: string) => void)
    | undefined;
  onInputChange?:
    | ((value: formFieldI['value'], field?: string) => void)
    | undefined;
  value?: formFieldI['value'];
  withLabel?: boolean;
  className?: string;
}

const Input: React.FC<InputI> = (props) => {
  const {
    checked = false,
    col = props.wrapperClassName ?? 'col-auto',
    field,
    id,
    disabled,
    label = props.field,
    maximum,
    minimum,
    name,
    onInputChange,
    onInputBlur,
    placeholder = '',
    required = false,
    type = 'text',
    valid,
    value = '',
    withLabel = props.type !== 'radio',
    className = '',
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

  const handleCheckChange = (e: ChangeEvent<HTMLInputElement>) => {
    const isChecked = e?.currentTarget.checked;
    setChecked(isChecked);
  };

  const handleInputOnChange = (e?: ChangeEvent<HTMLInputElement>) => {
    const element = e?.currentTarget as HTMLInputElement;
    setVal(element.value ?? '');
  };

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    switch (type) {
      case 'checkbox':
      case 'radio':
        handleCheckChange(e);
        break;
      default:
        handleInputOnChange(e);
        break;
    }
  };

  const InputProps: InputProps = {
    checked:
      type === 'checkbox' || (type === 'radio' && onInputChange)
        ? check
        : undefined,
    id: id || field || `input-${new Date().getTime()}`,
    max:
      (type === 'number' || type === 'date') && maximum ? maximum : undefined,
    maxLength: type === 'text' && maximum ? Number(maximum) : undefined,
    min:
      (type === 'number' || type === 'date') && minimum ? minimum : undefined,
    minLength: type === 'text' && minimum ? Number(minimum) : undefined,
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
  InputProps.label = withLabel
    ? label && required && !disabled
      ? label + ' *'
      : label
    : '';

  const inputRef = useRef<HTMLInputElement>(null);
  const inputLabel = inputRef.current?.nextElementSibling;

  useEffect(() => {
    if (!withLabel && inputRef && !dayOfWeek) {
      inputLabel?.classList.add('sr-only');
    }
    if (!withLabel && inputRef) {
      inputLabel?.classList.add('visibility-hidden');
    }
  }, [withLabel, inputLabel]);

  const blackList = [
    'checked',
    'col',
    'dependencyFlag',
    'dependencyNotFlag',
    'enumLevel1',
    'enumLevel2',
    'field',
    'flag',
    'keyService',
    'maximum',
    'minimum',
    'onInputBlur',
    'onInputChange',
    'placeholder',
    'preset',
    'privacy',
    'relatedFrom',
    'relatedTo',
    'touched',
    'withLabel',
  ];

  const BaseProps = Object.fromEntries(
    Object.entries(props).filter(([key]) => !blackList.includes(key))
  );

  if (type === 'radio') {
    return (
      <div
        className={clsx(
          'radio-btn-container',
          'd-inline-flex',
          'position-relative'
        )}
      >
        <InputKit
          {...BaseProps}
          {...InputProps}
          label={withLabel ? undefined : label}
          onChange={handleOnChange}
          value={typeof val === 'number' ? val : val?.toString() || ''}
          innerRef={inputRef}
        />
        <Label check htmlFor={id}>
          {withLabel ? <span>{label}</span> : null}
        </Label>
      </div>
    );
  }

  return (
    <InputKit
      {...BaseProps}
      {...InputProps}
      placeholder={type === 'date' ? 'dd/mm/yy' : placeholder}
      onChange={handleOnChange}
      value={typeof val === 'number' ? val : val?.toString() || ''}
      innerRef={inputRef}
      className={clsx(className, 'pr-lg-3')}
    />
  );
};

export default Input;
