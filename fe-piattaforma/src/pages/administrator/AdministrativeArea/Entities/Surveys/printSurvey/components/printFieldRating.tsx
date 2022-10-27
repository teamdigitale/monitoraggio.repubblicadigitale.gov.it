import clsx from 'clsx';
import React from 'react';
import { Rating } from '../../../../../../../components';
import './printFields.scss';
import { PrintFieldI } from './printTextField';

const PrintFieldRating: React.FC<PrintFieldI> = (props) => {
  const { info, className } = props;

  return (
    <div
      className={clsx(
        className,
        (info.title || '').length > 50
          ? 'w-100'
          : 'print-fields-container__half-width'
      )}
    >
      <p className='d-flex flex-column mb-3'>
        <strong className='mb-2'>{info.title}</strong>
        <Rating />
      </p>
    </div>
  );
};

export default PrintFieldRating;
