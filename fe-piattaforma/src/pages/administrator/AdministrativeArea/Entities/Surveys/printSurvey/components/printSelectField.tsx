import clsx from 'clsx';
import React from 'react';
import { PrintFieldI } from './printTextField';
import './printFields.scss';
import { FormGroup } from 'design-react-kit';
import { Form, Input } from '../../../../../../../components';

const PrintSelectField: React.FC<PrintFieldI> = (props) => {
  const { info, className } = props;
  const values = JSON.parse(info.form['question-values'].value);

  return (
    <div className={clsx(className, 'w-100')}>
      <Form className={clsx('d-flex', 'align-items-end')}>
        <p>
          <strong>{info.form['question-description'].value}</strong>
        </p>
        <Form className='mr-3 d-flex flex-column'>
          {(values || []).map(
            (val: { label: string; value: string }, i: number) => (
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
            )
          )}
        </Form>
      </Form>
    </div>
  );
};

export default PrintSelectField;
