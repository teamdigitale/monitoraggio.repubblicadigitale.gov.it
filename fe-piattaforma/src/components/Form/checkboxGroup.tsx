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
  } = props;
  const [values, setValues] = useState<string[]>(
    value.toString().split(separator)
  );

  useEffect(() => {
    setValues(value.toString().split(separator));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  useEffect(() => {
    if (onInputChange)
      onInputChange(values.filter((val) => val !== '').join(separator), field);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values]);

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
      <Form.Row>
        {options.map((check) => (
          <FormGroup check inline key={check.value}>
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
            />
            <Label for={`${field} ${check.label}`} check>
              {check.label}
            </Label>
          </FormGroup>
        ))}
      </Form.Row>
    </div>
  );
};

export default CheckboxGroup;
