import clsx from 'clsx';
import { Label } from 'design-react-kit';
import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
//import { TextArea as TextAreaKit } from 'design-react-kit';
//import { TextAreaProps } from 'design-react-kit/src/Input/TextArea';
import { formFieldI } from '../../utils/formHelper';

//TODO integrate design-react-kit TextArea -> actually there are some TS problems with the library

interface TextAreaPropsI {
  className?: string;
  cols?: number;
  rows?: number;
  maxLength?: number | undefined;
  minLength?: number | undefined;
  onBlur?: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  id?: string;
  label?: string | undefined;
  name?: string | undefined;
  placeholder?: string;
  required?: boolean;
  wrapperClassName?: string;
}

//export interface TextAreaI extends Omit<TextAreaProps, 'value'> {
export interface TextAreaI extends TextAreaPropsI {
  col?: string | undefined;
  field?: string;
  disabled?: boolean | undefined;
  maximum?: string | number | undefined;
  minimum?: string | number | undefined;
  onInputBlur?:
    | ((value: formFieldI['value'], field?: string) => void)
    | undefined;
  onInputChange?:
    | ((value: formFieldI['value'], field?: string) => void)
    | undefined;
  resize?: boolean;
  value?: formFieldI['value'];
  withLabel?: boolean;
}

const TextArea: React.FC<TextAreaI> = (props) => {
  const {
    col = props.wrapperClassName ?? 'col-auto',
    cols = 100,
    rows = 5,
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
    resize = false,
    //valid,
    value = '',
    withLabel = true,
  } = props;

  const [val, setVal] = useState(value.toString());

  useEffect(() => {
    setVal(value.toString());
  }, [value]);

  useEffect(() => {
    if (onInputChange && val !== value) onInputChange(val, field);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [val]);

  const handleOnChange = (e?: ChangeEvent<HTMLTextAreaElement>) => {
    const element = e?.currentTarget as HTMLTextAreaElement;
    setVal(element.value ?? '');
  };

  const TextAreaProps: TextAreaPropsI = {
    cols,
    rows,
    id: id || field || `textarea-${new Date().getTime()}`,
    maxLength: maximum ? Number(maximum) : undefined,
    minLength: minimum ? Number(minimum) : undefined,
    onBlur: (e) => {
      if (onInputBlur) onInputBlur(val, field);
      handleOnChange(e);
    },
    required,
    wrapperClassName: col,
  };

  /*if (valid !== undefined) {
    TextAreaProps.valid = valid && !!value;
    TextAreaProps.invalid = !valid;
  }*/

  TextAreaProps.name = name ?? TextAreaProps.id;
  TextAreaProps.label = withLabel
    ? label && required && !disabled
      ? `${label} *`
      : label
    : '';

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const inputLabel = inputRef.current?.nextElementSibling;

  useEffect(() => {
    if (!withLabel && inputRef) {
      inputLabel?.classList.add('sr-only visibility-hidden');
    }
  }, [withLabel, inputLabel]);

  const blackList = [
    'col',
    'field',
    'maximum',
    'minimum',
    'onInputBlur',
    'onInputChange',
    'placeholder',
    'touched',
    'withLabel',
  ];

  const BaseProps = Object.fromEntries(
    Object.entries(props).filter(([key]) => !blackList.includes(key))
  );

  return (
    <div className={clsx('bootstrap-select-wrapper', 'form-group', 'mb-0')}>
      <Label htmlFor={id} className='text-decoration-none'>
        {label}
      </Label>
      <textarea
        {...BaseProps}
        {...TextAreaProps}
        placeholder={placeholder}
        onChange={handleOnChange}
        value={val}
        //innerRef={inputRef}
        ref={inputRef}
        style={{ resize: !resize ? 'none' : 'unset' }}
      />
    </div>
  );
};

export default TextArea;
