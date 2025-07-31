import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { Input as InputKit, InputProps, Label } from 'design-react-kit';
import clsx from 'clsx';
import { formFieldI } from '../../utils/formHelper';
import { dayOfWeek } from '../../pages/administrator/AdministrativeArea/Entities/utils';
import { isSafariBrowser } from '../../utils/common';

// Funzione per preservare le virgolette non escapate nel contenuto testuale
const preserveQuotes = (text: string): string => {
  // Sostituisce tutte le &quot; con " per preservare il testo originale
  let processedText = text.replace(/&quot;/g, '"');
  
  // Gestione specifica per il pattern '.."' usando zero-width space per prevenire escaping
  // Aggiunge uno zero-width space (\u200B) prima delle virgolette problematiche
  processedText = processedText.replace(/\.\."/g, '..\u200B"');
  
  return processedText;
};

// Funzione per ripulire il testo quando viene caricato nell'input
const cleanInputText = (text: string): string => {
  // Rimuove gli zero-width space che potrebbero essere stati aggiunti precedentemente
  return text.replace(/\u200B/g, '');
};

const blackList = [
  'checked',
  'col',
  'dependencyFlag',
  'dependencyNotFlag',
  'enumLevel1',
  'enumLevel2',
  'field',
  'flag',
  'format',
  'keyBE',
  'maximum',
  'minimum',
  'onInputBlur',
  'onInputChange',
  'order',
  'placeholder',
  'preset',
  'regex',
  'relatedFrom',
  'relatedTo',
  'touched',
  'withLabel',
  'keyBE',
];

/**
 * A fix for input warning has been made, maybe it could be the case to improve input component
 * design in a second time
 */
export interface InputI extends Omit<InputProps, 'value'> {
  col?: string | undefined;
  field?: string;
  id?: string | undefined;
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
  touched?: boolean;
  validationText?: string
}

const Input: React.FC<InputI> = (props) => {
  const {
    checked = false,
    col = props.wrapperClassName ?? 'col-auto',
    field,
    id,
    disabled = false,
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
    onClick,
    validationText
  } = props;

  const [val, setVal] = useState<formFieldI['value']>(
    typeof value === 'string' ? cleanInputText(value) : value
  );
  const [check, setChecked] = useState<boolean>(checked);

  useEffect(() => {
    setVal(typeof value === 'string' ? cleanInputText(value) : value);
  }, [value]);

  useEffect(() => {
    setChecked(checked);
  }, [checked]);

  useEffect(() => {
    const cleanedVal = typeof val === 'string' ? cleanInputText(val) : val;
    const cleanedValue = typeof value === 'string' ? cleanInputText(value) : value;
    
    // Confronta solo se c'è una vera differenza nel contenuto, ignorando gli zero-width spaces
    if (onInputChange && cleanedVal !== cleanedValue) {
      const outputValue = typeof val === 'string' ? preserveQuotes(val) : val;
      onInputChange(outputValue, field);
    }
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
      type === 'checkbox' || (type === 'radio' && (onInputChange || onClick))
        ? check
        : undefined,
    id: id || field || `input-${new Date().getTime()}`,
    name: name ?? id,
    max:
      (type === 'number' || type === 'date') && maximum ? maximum : undefined,
    maxLength: type === 'text' && maximum ? Number(maximum) : undefined,
    min:
      (type === 'number' || type === 'date') && minimum
        ? minimum
        : minimum === 0
        ? 0
        : undefined,
    minLength: type === 'text' && minimum ? Number(minimum) : undefined,
    onBlur: (e) => {
      if (onInputBlur) {
        const outputValue = typeof val === 'string' ? preserveQuotes(val) : val;
        onInputBlur(outputValue, field);
      }
      handleOnChange(e);
    },
    disabled,
    required,
    type,
    wrapperClassName: col,
    infoText: !valid && validationText ? validationText : '',
  };

  if (valid !== undefined) {
    InputProps.valid = valid && !!value;
    InputProps.invalid = !valid;
  }

  InputProps.label = withLabel
    ? label && required && !disabled
      ? `${label} *`
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
        <Label check htmlFor={InputProps.id}>
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
      className={clsx(className, 'pr-lg-3', isSafariBrowser() && 'safari-field-color')}
    />
  );
};

export default Input;
