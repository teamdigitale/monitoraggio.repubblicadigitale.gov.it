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
      <Form className={clsx('d-flex', 'align-items-end')}>
        <p className='invisible'>
          <strong>{info.form['question-description'].value}</strong>
        </p>
        <FormGroup check>
          <Input
            id={`checkbox-${info.form['question-description'].value}`}
            type='checkbox'
            label={info.form['question-description'].value}
            aria-label={info.form['question-description'].value}
            disabled
          />
        </FormGroup>
      </Form>
    </div>
  );
};

export default PrintCheckboxField;
