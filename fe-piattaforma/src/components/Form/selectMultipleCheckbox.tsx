import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
// import { MultiValue } from 'react-select';
import { multiLevelOptionsI } from '../../pages/administrator/AdministrativeArea/Entities/Surveys/printSurvey/components/printBoxField';
import { formFieldI } from '../../utils/formHelper';
import CheckboxGroup from './checkboxGroup';
import Form from './form';
import { SelectMultipleI } from './selectMultiple';

export type OptionTypeMulti = {
  value: string;
  label: string;
  upperLevel: string;
};

const SelectMultipleCheckbox: React.FC<SelectMultipleI> = (props) => {
  const {
    id = `${new Date().getTime()}`,
    col = props.wrapperClassName ?? 'col-auto',
    onFieldsChange,
    field,
    secondLevelField = undefined,
    label = props.field,
    options = [],
    required = false,
    valueSecondLevelString = '',
    wrapperClassName,
    withLabel = true,
    isDisabled = false,
  } = props;

  const [multipleValuesString, setMultipleValuesString] = useState<{
    [key: string]: string;
  }>({});

  useEffect(() => {
    let tempString = '';
    Object.keys(multipleValuesString).map((key: string) => {
      tempString = tempString + multipleValuesString[key] + '§';
    });
    tempString = tempString.slice(0, tempString?.length - 1);

    if (valueSecondLevelString !== tempString) {
      const tempMultipleValues: {
        [key: string]: string;
      } = {};
      (options || []).map((opt) => {
        let optValuesString = '';
        (opt.options || []).map((op) => {
          if (valueSecondLevelString?.includes(op.label)) {
            optValuesString = optValuesString + op.label + '§';
          }
        });
        tempMultipleValues[opt.label] =
          optValuesString?.length > 0
            ? optValuesString.slice(0, optValuesString?.length - 1)
            : optValuesString;
      });
      setMultipleValuesString(tempMultipleValues);
    }
  }, [valueSecondLevelString]);

  useEffect(() => {
    const firstLevelAnswers: string[] = [];
    let secondLevelAnswers: string[] = [];
    Object.keys(multipleValuesString)?.map((key: string) => {
      if (multipleValuesString[key] && multipleValuesString[key] !== '') {
        firstLevelAnswers.push(key);
        secondLevelAnswers = [
          ...secondLevelAnswers,
          ...multipleValuesString[key].split('§').filter((val) => val !== ''),
        ];
      }
    });
    if (valueSecondLevelString !== secondLevelAnswers.join('§')) {
      if (onFieldsChange && field && secondLevelField)
        onFieldsChange({
          [field]: firstLevelAnswers,
          [secondLevelField]: secondLevelAnswers,
        });
    }
  }, [multipleValuesString]);

  const handleCheckboxChange = (
    value?: formFieldI['value'],
    field?: formFieldI['field']
  ) => {
    const tempString = multipleValuesString;
    if (field && (value || value === '')) tempString[field] = value.toString();
    setMultipleValuesString({ ...tempString });
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
          className='text-decoration-none pl-0 pb-2'
        >
          {label}
          {required && !isDisabled && ' *'}
        </label>
      ) : null}
      <Form id={id} className='mx-0' showMandatory={false}>
        <div className='px-2'>
          {(options || []).map((val: multiLevelOptionsI, i: number) => (
            <div key={i} className='select-multiple-checkbox__options'>
              <div className='select-multiple-checkbox__box-field__box-title'>
                {val.label}
              </div>
              <div className='select-multiple-checkbox__box-field__box-content'>
                <CheckboxGroup
                  className='col-12'
                  onInputChange={handleCheckboxChange}
                  field={val.label}
                  styleLabelForm
                  noLabel
                  disabled={isDisabled}
                  optionsInColumn
                  separator='§'
                  options={val.options}
                  value={multipleValuesString?.[val.label]}
                />
              </div>
            </div>
          ))}
        </div>
      </Form>
    </div>
  );
};
export default SelectMultipleCheckbox;
