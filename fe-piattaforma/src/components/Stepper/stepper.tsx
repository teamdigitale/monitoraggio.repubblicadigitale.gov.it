import clsx from 'clsx';
/* import { Icon } from 'design-react-kit';
import CheckNoCircle from '/public/assets/img/icon-check-no-circle.png'; */
import React, { memo } from 'react';
import './stepper.scss';

interface StepperI {
  nSteps: number;
  currentStep?: number;
  className?: string;
}

const Stepper: React.FC<StepperI> = (props) => {
  const { nSteps, currentStep = 0, className } = props;
  const arraySteps = Array.from(Array(nSteps).keys());

  return (
    <div className={clsx(className, 'stepper-container', 'position-relative')}>
      <div
        className={clsx(
          'd-flex',
          'flex-row',
          'justify-content-between',
          'w-100'
        )}
      >
        {arraySteps.map((index) => (
          <div
            className={clsx(
              index <= currentStep ? 'primary-bg-a9' : 'bg-white',
              'stepper-container__icon-container',
              'stepper-container__icon'
            )}
            key={index}
          >
            {index <= currentStep ? (
              <p className='text-white font-weight-bold'> {index + 1} </p>
            ) : (
              <p className='primary-color-a9 font-weight-bold'> {index + 1} </p>
            )}
          </div>
        ))}
      </div>
      <div className='stepper-container__line primary-bg-a9' />
    </div>
  );
};

export default memo(Stepper);
