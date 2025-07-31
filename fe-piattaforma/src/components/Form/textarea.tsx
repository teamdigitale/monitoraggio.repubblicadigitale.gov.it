import clsx from 'clsx';
import { Label } from 'design-react-kit';
import React, { ChangeEvent, useEffect, useRef, useState, CSSProperties } from 'react';
import { formFieldI } from '../../utils/formHelper';

// Funzione per preservare le virgolette non escapate nel contenuto testuale
const preserveQuotes = (text: string): string => {
  // Sostituisce tutte le &quot; con " per preservare il testo originale
  let processedText = text.replace(/&quot;/g, '"');
  
  // Gestione specifica per il pattern '.."' usando zero-width space per prevenire escaping
  // Aggiunge uno zero-width space (\u200B) prima delle virgolette problematiche
  processedText = processedText.replace(/\.\."/g, '..\u200B"');
  
  return processedText;
};

// Funzione per ripulire il testo quando viene caricato nella textarea
const cleanInputText = (text: string): string => {
  // Rimuove gli zero-width space che potrebbero essere stati aggiunti precedentemente
  return text.replace(/\u200B/g, '');
};

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

  const [val, setVal] = useState(cleanInputText(value.toString()));

  useEffect(() => {
    setVal(cleanInputText(value.toString()));
  }, [value]);

  useEffect(() => {
    const cleanedVal = cleanInputText(val);
    const cleanedValue = cleanInputText(value.toString());
    
    // Confronta solo se c'è una vera differenza nel contenuto, ignorando gli zero-width spaces
    if (onInputChange && cleanedVal !== cleanedValue) {
      onInputChange(preserveQuotes(val), field);
    }
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
      if (onInputBlur) onInputBlur(preserveQuotes(val), field);
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
