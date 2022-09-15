import clsx from 'clsx';
import React, { memo } from 'react';

interface ProgressBarI {
  currentStep?: number;
  className?: string;
  steps: string[];
  step?: string | string[];
}

const ProgressBar: React.FC<ProgressBarI> = (props) => {
  const { steps, currentStep = 1, className } = props;

  return (
    <div
      className={clsx(
        className,
        'progress-bar-container',
        'position-relative',
        'w-100'
      )}
    >
      <p
        className={clsx(
          'progress-bar-container',
          'primary-color',
          'pl-4',
          'py-3',
          'font-weight-semibold'
        )}
      >
        {steps[currentStep - 1]}
      </p>
      <div className='progress-bar-container__line-bar'>
        <div
          className='progress-bar-container__percentage-line'
          style={{
            width: `${Math.floor((currentStep * 100) / steps.length)}%`,
          }}
        ></div>
      </div>
    </div>
  );
};

export default memo(ProgressBar);
