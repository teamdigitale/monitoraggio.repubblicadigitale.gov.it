import clsx from 'clsx';
import React from 'react';
import { formFieldI } from '../../../../../../../utils/formHelper';
import './printFields.scss';

export interface PrintFieldI {
  info: formFieldI;
  className?: string;
  noLabel?: boolean;
  halfWidth?: boolean;
  optionsLevel2?:
    | { label: string; value: string | number; upperLevel: string }[]
    | undefined;
}

const PrintTextField: React.FC<PrintFieldI> = (props) => {
  const { info, className } = props;

  return (
    <div
      className={clsx(
        className,
        'print-fields-container__text-field',
        (info.label || '').length > 50
          ? 'w-100'
          : 'print-fields-container__half-width'
      )}
    >
      <p className='d-flex flex-column mb-3'>
        <strong>{info.label}</strong>
        <input className='border-0' />
      </p>
    </div>
  );
};

export default PrintTextField;
