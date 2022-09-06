import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { FormGroup, Label } from 'design-react-kit';
import Input, { InputI } from './input';
import Form from './form';
import { OptionType } from './select';

interface CheckboxGroupI extends InputI {
  options?: OptionType[] | undefined;
  separator?: string;
  label?: string;
  styleLabelForm?: boolean;
  className?: string;
  noLabel?: boolean;
  classNameLabelOption?: string;
  optionsInColumn?: boolean;
}

const CheckboxGroup: React.FC<CheckboxGroupI> = (props) => {
  const {
    field,
    onInputChange,
    options = [],
    separator = ',',
    value = '',
    label,
    styleLabelForm = false,
    className = '',
    noLabel = false,
    classNameLabelOption = '',
    disabled = false,
    optionsInColumn = false,
  } = props;
  const parseExternalValue = () => value.toString().split(separator);
  const [values, setValues] = useState<string[]>(parseExternalValue());

  useEffect(() => {
    setValues(parseExternalValue());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  useEffect(() => {
    if (onInputChange) {
      const newValues = values.filter((val) => val !== '').join(separator);
      const areEquals = value === newValues;
      if (!areEquals) onInputChange(newValues, field);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.join(',')]);

  const handleOnChange = (value: string | number) => {
    const valueIndex = values.findIndex((v) => v === value.toString());
    if (valueIndex !== -1) {
      const newValues = [...values];
      newValues.splice(valueIndex, 1);
      setValues(newValues);
    } else {
      setValues([...values, value.toString()]);
    }
  };

  return (
    <div
      className={clsx(className, 'checkbox-group', 'form-group', 'col-auto')}
    >
      {!noLabel && (
        <div>
          {label ? (
            <p
              className={clsx(
                'h6',
                styleLabelForm && 'compile-survey-container__label-checkbox'
              )}
            >
              {label}
            </p>
          ) : (
            <p className='h6'>{field}</p>
          )}
        </div>
      )}
      <Form.Row className={clsx(optionsInColumn && 'd-flex flex-column')}>
        {options.map((check) => (
          <FormGroup check inline key={check.value} className={clsx(optionsInColumn && 'compile-survey-container__max-width-column')}>
            <Input
              {...check}
              field={`${field} ${check.label}`}
              checked={values.includes(check.value.toString())}
              onKeyDown={(e) =>
                e.key == ' ' ? handleOnChange(check.value) : ''
              }
              onInputChange={() => handleOnChange(check.value)}
              col='col-4'
              type='checkbox'
              withLabel={false}
              key={check.value}
              label={label}
              disabled={disabled}
            />
            <Label
              for={`${field} ${check.label}`}
              check
              className={clsx(classNameLabelOption, optionsInColumn && 'compile-survey-container__label-column')}
            >
              {check.label}
            </Label>
          </FormGroup>
        ))}
      </Form.Row>
    </div>
  );
};

export default CheckboxGroup;
