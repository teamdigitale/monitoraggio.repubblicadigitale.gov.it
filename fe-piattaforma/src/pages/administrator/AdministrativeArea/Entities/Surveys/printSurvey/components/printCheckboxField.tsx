import clsx from 'clsx';
import React from 'react';
import { PrintFieldI } from './printTextField';
import './printFields.scss';
import { FormGroup } from 'design-react-kit';
import { Form, Input } from '../../../../../../../components';

const PrintCheckboxField: React.FC<PrintFieldI> = (props) => {
  const { info, className } = props;

  return (
    <div
      className={clsx(
        className,
        'w-100',
        'print-fields-container__checkbox-field'
      )}
    >
      <Form id='form-print-checkbox' className={clsx('d-flex', 'align-items-end')}>
        <p className='invisible'>
          <strong>{info.label}</strong> {'(scelta multipla)'}
        </p>
        <FormGroup check>
          <Input
            id={`checkbox-${info.value}`}
            type='checkbox'
            label={info.value?.toString()}
            aria-label={info.value?.toString()}
            disabled
          />
        </FormGroup>
      </Form>
    </div>
  );
};

export default PrintCheckboxField;
