import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import { PrintFieldI } from './printTextField';
import './printFields.scss';
import { FormGroup } from 'design-react-kit';
import { Form, Input } from '../../../../../../../components';

export interface multiLevelOptionsI {
  label: string;
  options: { label: string; value: string | number; upperLevel: string }[];
}

const PrintBoxField: React.FC<PrintFieldI> = (props) => {
  const { info, className, optionsLevel2 } = props;
  const [multiLevelOptions, setMultiLevelOptions] = useState<
    multiLevelOptionsI[]
  >([]);

  useEffect(() => {
    updateOptions();
  }, [info, optionsLevel2]);

  const updateOptions = () => {
    const tmpOptions: multiLevelOptionsI[] = [];
    (info.enumLevel1 || [])?.map((opt) => {
      tmpOptions.push({ label: opt, options: [] });
    });
    (optionsLevel2 || [])?.map(({ label, value, upperLevel }) => {
      const index = tmpOptions.findIndex((v) => v.label === upperLevel);
      tmpOptions[index].options.push({
        label: label,
        value: value,
        upperLevel: upperLevel,
      });
    });
    setMultiLevelOptions(tmpOptions);
  };

  const renderOptions = (
    options: { label: string; value: string | number; upperLevel: string }[]
  ) => (
    <FormGroup check>
      {(options || []).map(
        (
          opt: { label: string; value: string | number; upperLevel: string },
          ii: number
        ) => (
          <Input
            key={ii}
            id={`checkbox-${opt.label}`}
            type='checkbox'
            label={opt.label}
            aria-label={opt.label}
            disabled
          />
        )
      )}
    </FormGroup>
  );

  const renderLevel1 = (values: multiLevelOptionsI[]) => (
    <>
      {(values || []).map((val: multiLevelOptionsI, i: number) => (
        <div
          key={i}
          className={clsx(
            'print-fields-container__half-width',
            'print-fields-container__box-field',
            'd-inline-block',
            'mr-3 my-3',
            'align-top',
            info?.id === '10' && 'print-fields-container__min-height-short',
            info?.id === '25' && 'print-fields-container__min-height-long'
          )}
        >
          <div className='print-fields-container__box-field__box-title'>
            <strong>{val.label}</strong>
          </div>
          <div className='print-fields-container__box-field__box-content'>
            {renderOptions(val.options)}
          </div>
        </div>
      ))}
    </>
  );

  return (
    <div className={clsx(className, 'w-100')}>
      <Form id='form-print-box' className={clsx('mx-0')}>
        <p>
          <strong>{info.title}</strong>{' (scelta mutipla)'}
        </p>
        <div>{renderLevel1(multiLevelOptions)}</div>
      </Form>
    </div>
  );
};

export default PrintBoxField;
