import clsx from 'clsx';
import { Label } from 'design-react-kit';
import React, { ChangeEvent, useEffect, useRef, useState, CSSProperties } from 'react';
import { formFieldI } from '../../utils/formHelper';

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
  style?: CSSProperties; 
}

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
  subLabel?: string; 
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
    maximum = 1500,
    minimum,
    name,
    onInputChange,
    onInputBlur,
    placeholder = '',
    required = false,
    resize = false,
    value = '',
    withLabel = true,
    className = '',
    subLabel, 
    style, 
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
    setVal(element.value ?  element.value?.substring(0,Number(maximum)):'');
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
    name: name ?? id,
  };

  TextAreaProps.label =
    withLabel && label
      ? required && !disabled
        ? `${label} *`
        : label
      : '';

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const inputLabel = inputRef.current?.nextElementSibling;

  useEffect(() => {
    if (!withLabel && inputRef) {
      inputLabel?.classList.add('sr-only', 'visibility-hidden');
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
    'subLabel',
    'style',
  ];

  const BaseProps = Object.fromEntries(
    Object.entries(props).filter(([key]) => !blackList.includes(key))
  );

  return (
    <div
      className={clsx('bootstrap-select-wrapper', 'form-group', 'mb-0', col)}
      style={style}
    >
      {withLabel && (
        <>
          <Label htmlFor={TextAreaProps.id} className="px-0" style={style}>
            {TextAreaProps.label}
          </Label>
          {subLabel && 
          <p
            className="form-text mb-2"
            style={{
              textAlign: 'left',
              marginLeft: '7px',
              fontSize: '0.9rem',
            }}
          >{subLabel}</p>}
        </>
      )}

      <textarea
        {...BaseProps}
        {...TextAreaProps}
        placeholder={placeholder}
        onChange={handleOnChange}
        value={val}
        ref={inputRef}
        className={clsx(className)}
        style={{ resize: !resize ? 'none' : 'unset' }}
      />
    </div>
  );
};

export default TextArea;
