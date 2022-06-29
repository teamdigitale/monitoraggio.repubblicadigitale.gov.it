import clsx from 'clsx';
import { Select as SelectKit } from 'design-react-kit';
import React, { useEffect, useState } from 'react';
import { MultiValue } from 'react-select';
import { formFieldI } from '../../utils/formHelper';
// import { OptionType } from './select';

export type OptionTypeMulti = {
  value: string | number;
  label: string;
  upperLevel: string;
};

export interface SelectMultipleI {
  id: string;
  col?: string | undefined;
  field?: formFieldI['field'];
  secondLevelField?: formFieldI['field'] | undefined;
  label?: string;
  options?: { label: string; options: OptionTypeMulti[] }[] | undefined;
  onInputChange: (
    value: formFieldI['value'],
    field?: formFieldI['field']
  ) => void;
  onSecondLevelInputChange: (
    value: formFieldI['value'],
    field?: formFieldI['field']
  ) => void;
  placeholder?: string;
  required?: boolean;
  value?: string | number | undefined;
  wrapperClassName?: string;
  withLabel?: boolean;
}

const SelectMultiple: React.FC<SelectMultipleI> = (props) => {
  const {
    id,
    col = props.wrapperClassName ?? 'col-auto',
    onInputChange,
    onSecondLevelInputChange,
    field,
    secondLevelField = undefined,
    label = props.field,
    options = [],
    required = false,
    //value = '',
    wrapperClassName,
    withLabel = true,
  } = props;

  const [selectedOptions, setSelectedOptions] = useState<
    MultiValue<OptionTypeMulti>
  >([]);
  const [arrayVal, setArrayVal] = useState<string[]>([]);

  useEffect(() => {
    if (onInputChange && selectedOptions?.length > 0) {
      const values: string[] = [];
      selectedOptions.map((opt) => arrayVal.push(opt.label.toString()));
      setArrayVal(values);
      onInputChange(arrayVal, secondLevelField);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedOptions]);

  useEffect(() => {
    const upperLevelArray: string[] = [];
    selectedOptions.map((opt) =>{
      upperLevelArray.includes(opt.upperLevel.toString()) ? null:upperLevelArray.push(opt.upperLevel.toString());
    });
    onSecondLevelInputChange(upperLevelArray,field);
  },[arrayVal]);

  const handleChange = (selectedOption: MultiValue<OptionTypeMulti>) => {
    setSelectedOptions(selectedOption);
  };

  return (
    <div
      className={clsx(
        'bootstrap-select-wrapper',
        'form-group',
        col,
        wrapperClassName
      )}
    >
      {withLabel ? (
        <label
          id={`${(label || 'label-select').replace(/\s/g, '-')}`}
          className='text-decoration-none'
        >
          {label}
          {required && ' *'}
        </label>
      ) : null}
      <SelectKit
        id={id}
        isMulti={true}
        value={selectedOptions}
        onChange={handleChange}
        options={options}
        placeholder='Scegli una opzione'
        aria-label={`${(label || 'label-select').replace(/\s/g, '-')}`}
      />
    </div>
  );
};
export default SelectMultiple;
