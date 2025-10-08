import React from 'react';
import { Spinner } from 'design-react-kit';
import clsx from 'clsx';

interface LoadingSpinnerProps {
  message?: string;
  small?: boolean;
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = 'Caricamento in corso', 
  small = false, 
  className 
}) => (
  <div
    className={clsx(
      'd-flex',
      'flex-column',
      'justify-content-center',
      'align-items-center',
      'w-100',
      small ? 'py-3' : 'py-5',
      className
    )}
  >
    <Spinner active />
    {message && (
      <p className={clsx('text-muted', 'mt-3', 'mb-0', small && 'small')}>
        {message}
      </p>
    )}
  </div>
);

export default LoadingSpinner;