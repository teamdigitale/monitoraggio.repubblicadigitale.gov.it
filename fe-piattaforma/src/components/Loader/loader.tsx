import React from 'react';
import { Spinner } from 'design-react-kit';
import clsx from 'clsx';

const Loader: React.FC = () => (
  <div
    className={clsx(
      'spinner-container',
      'position-fixed',
      'w-100',
      'h-100',
      'd-flex',
      'justify-content-center',
      'align-items-center'
    )}
  >
    <Spinner active />
  </div>
);

export default Loader;
