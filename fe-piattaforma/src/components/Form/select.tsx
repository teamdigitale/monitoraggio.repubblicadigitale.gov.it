import React, { useEffect, useState } from 'react';
import { Select as SelectKit, SelectProps } from 'design-react-kit';
import clsx from 'clsx';
import { formFieldI } from '../../utils/formHelper';

export type OptionType = {
  value: string | number;
  label: string;
};

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface SelectI
  extends Omit<SelectProps<OptionType, boolean, any>, 'type'> {
  col?: string | undefined;
  field?: formFieldI['field'];
  label?: string;
  onInputChange:
    | ((value: formFieldI['value'], field?: formFieldI['field']) => void)
    | undefined;
  options?: OptionType[] | undefined;
  placeholder?: string;
  required?: boolean;
  value?: string | number | undefined;
  wrapperClassName?: string;
  withLabel?: boolean;
}

const Select: React.FC<SelectI> = (props) => {
  const {
    col = props.wrapperClassName ?? 'col-auto',
    field,
    label = props.field,
    onInputChange,
    options = [],
    value = '',
    wrapperClassName,
    withLabel = true,
  } = props;
  const [selectedOption, setSelectedOption] = useState<OptionType>();

  useEffect(() => {
    if (
      onInputChange &&
      selectedOption?.value !== value &&
      selectedOption?.value
    )
      onInputChange(selectedOption?.value, field);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedOption]);

  useEffect(() => {
    if (options?.length) {
      const newSelectedOption = options.find(
        (opt) => opt.value.toString() === value?.toString()
      );
      if (
        newSelectedOption?.value !== selectedOption?.value &&
        newSelectedOption
      )
        setSelectedOption(newSelectedOption);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const handleChange = (option: OptionType) => {
    setSelectedOption(option);
  };

  const BaseProps = {
    ...props,
    col: undefined,
    field: undefined,
    onInputBlur: undefined,
    onInputChange: undefined,
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
          id={`${(label || 'label select').replace(/\s/g, '-')}`}
          className='text-decoration-none'
        >
          {label}
        </label>
      ) : null}
      <SelectKit
        {...BaseProps}
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        onChange={handleChange}
        options={options}
        value={selectedOption}
        color='primary'
        classNamePrefix='bootstrap-select'
        aria-labelledby={`${(label || 'label select').replace(/\s/g, '-')}`}
      />
    </div>
  );
};

export default Select;
