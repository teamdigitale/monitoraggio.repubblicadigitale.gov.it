import clsx from 'clsx';
import React from 'react';
import { PrintFieldI } from './printTextField';
import './printFields.scss';
import { FormGroup } from 'design-react-kit';
import { Form, Input } from '../../../../../../../components';
import { OptionType } from '../../../../../../../components/Form/select';

const PrintSelectField: React.FC<PrintFieldI> = (props) => {
  const { info, className, noLabel = false, halfWidth = false } = props;

  return (
    <div
      className={clsx(
        className,
        halfWidth ? 'print-fields-container__half-width' : 'w-100'
      )}
    >
      {!noLabel && (
        <p>
          <strong>{info.label}</strong>
          {' (una sola scelta)'}
        </p>
      )}
      <Form className={clsx('mr-3', 'mt-3', 'd-flex', 'flex-column')}>
        {(info.options || []).map((val: OptionType, i: number) => (
          <FormGroup
            check
            key={i}
            className='print-fields-container__checkbox-field'
          >
            <Input
              id={`checkbox-select-${val.label}`}
              type='checkbox'
              label={val.label}
              aria-label={val.label}
              disabled
            />
          </FormGroup>
        ))}
      </Form>
    </div>
  );
};

export default PrintSelectField;
