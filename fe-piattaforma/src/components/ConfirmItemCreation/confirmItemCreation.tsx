import clsx from 'clsx';
import React from 'react';
import BigCheckGreen from '../../../public/assets/img/green-check-circle.png';

interface ConfirmModalI {
  description?: string;
}
const ConfirmItemCreation: React.FC<ConfirmModalI> = ({ description }) => {
  return (
    <div
      className={clsx(
        'd-flex',
        'flex-column',
        'justify-content-center',
        'align-items-center',
        'mb-5'
      )}
    >
      <img alt='check-step' src={BigCheckGreen} style={{ width: '115px' }} />

      <p className='h5 neutral-1-color-a8 mt-4'>{description}</p>
    </div>
  );
};

export default ConfirmItemCreation;
