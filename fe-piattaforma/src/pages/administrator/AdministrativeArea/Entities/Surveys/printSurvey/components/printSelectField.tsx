import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import { PrintFieldI } from './printTextField';
import './printFields.scss';
import { FormGroup } from 'design-react-kit';
import { Form, Input } from '../../../../../../../components';

const PrintSelectField: React.FC<PrintFieldI> = (props) => {
  const { info, className, noLabel = false, halfWidth = false } = props;
  const [options, setOptions] = useState<string[]>([]);

  useEffect(() => {
    if(info?.properties){
      const tmpOptions: string[] = [];
      Object.keys(info.properties).map((key: string) => {
        tmpOptions.push(key);
      });
      setOptions(tmpOptions);
    }else if(info?.enum){
      setOptions(info.enum);
    }
  },[info]);

  return (
    <div
      className={clsx(
        className,
        halfWidth ? 'print-fields-container__half-width' : 'w-100'
      )}
    >
      {!noLabel && (
        <p>
          <strong>{info.title}</strong>
          {' (una sola scelta)'}
        </p>
      )}
      <Form id='form-print-select' className={clsx('mr-3', 'mt-3', 'd-flex', 'flex-column')}>
        {(options || []).map((key: string, i: number) => (
          <FormGroup
            check
            key={i}
            className='print-fields-container__checkbox-field'
          >
            <Input
              id={`checkbox-select-${key}`}
              type='checkbox'
              label={key}
              aria-label={key}
            />
          </FormGroup>
        ))}
      </Form>
    </div>
  );
};

export default PrintSelectField;
