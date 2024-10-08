import React, { ChangeEvent } from 'react';
import Autocomplete from 'accessible-autocomplete/react';
import { InputProps } from 'design-react-kit';
import clsx from 'clsx';

export interface AutocompleteI extends Omit<InputProps, 'value'> {
  id: string;
  source: Array<string> | ((query: string, populateResults: (results: string[]) => void) => void);
  col?: string | undefined;
  inputClasses?: string | null;
  hintClasses?: string | null;
  menuAttributes?: { [key: string]: string };
  menuClasses?: string | null;
  autoselect?: boolean;
  confirmOnBlur?: boolean;
  cssNamespace?: string;
  defaultValue?: string;
  displayMenu?: 'inline' | 'overlay';
  minLength?: number;
  name?: string;
  onConfirm?: (confirmed: string) => void;
  onInputChange?: (value: string, field?: string) => void;
  placeholder?: string;
  label?: string;
  required?: boolean;
  showAllValues?: boolean;
  showNoOptionsFound?: boolean;
  shortDropdownMenu?: boolean;
  templates?: {
    inputValue?: (suggestion: string) => string;
    suggestion?: (suggestion: string) => string;
  };
  dropdownArrow?: (props: { className: string }) => string | JSX.Element;
  tNoResults?: () => string;
  tStatusQueryTooShort?: (minQueryLength: number) => string;
  tStatusNoResults?: () => string;
  tStatusSelectedOption?: (selectedOption: string, length: number, index: number) => string;
  tStatusResults?: (length: number, contentSelectedOption: string) => string;
  tAssistiveHint?: () => string;
}

const AutocompleteComponent: React.FC<AutocompleteI> = (props) => {
  const {
    id,
    source,
    inputClasses,
    hintClasses,
    menuAttributes,
    col = props.col ?? 'col-auto',
    menuClasses,
    autoselect,
    confirmOnBlur,
    cssNamespace,
    defaultValue,
    displayMenu,
    minLength,
    name,
    placeholder,
    label,
    shortDropdownMenu = false,
    required,
    showAllValues,
    showNoOptionsFound,
    templates,
    onInputChange,
    onConfirm,
    dropdownArrow,
    tNoResults,
    tStatusQueryTooShort,
    tStatusNoResults,
    tStatusSelectedOption,
    tStatusResults,
    tAssistiveHint,
  } = props;

  return (
    <div
      className={clsx(
        'bootstrap-select-wrapper',
        'form-group',
        col,
        inputClasses
      )}
    >
      {label && (
        <label
          id={`${(label || 'label select').replace(/\s/g, '-')}`}
          className='text-decoration-none'
        >
          {label}
          {required && ' *'}
        </label>
      )}
      <Autocomplete
        id={id}
        source={source}
        className={'border-select-value'}
        placeholder={placeholder}
        required={required}
        name={name}
        onChange={onInputChange}
        hintProps={{ className: `autocomplete__input ${hintClasses}` }}
        menuProps={{
          className: `autocomplete__menu ${menuClasses}`,
          ...menuAttributes,
        }}
        aria-labelledby={`${(label || 'label select').replace(/\s/g, '-')}`}
        classNamePrefix={clsx(
          shortDropdownMenu ? 'bootstrap-select-short' : 'bootstrap-select'
        )}
        autoselect={autoselect}
        confirmOnBlur={confirmOnBlur}
        cssNamespace={cssNamespace}
        defaultValue={defaultValue}
        displayMenu={displayMenu}
        minLength={minLength}
        showAllValues={showAllValues}
        showNoOptionsFound={showNoOptionsFound}
        templates={templates}
        dropdownArrow={dropdownArrow}
        tNoResults={tNoResults}
        tStatusQueryTooShort={tStatusQueryTooShort}
        tStatusNoResults={tStatusNoResults}
        tStatusSelectedOption={tStatusSelectedOption}
        tStatusResults={tStatusResults}
        tAssistiveHint={tAssistiveHint}
        onConfirm={onConfirm}
      />
    </div>
  );
};

export default AutocompleteComponent;