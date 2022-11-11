import React from 'react';
import { ButtonInButtonsBar } from '../ButtonsBar/buttonsBar';
import { Icon } from 'design-react-kit';
import { ButtonsBar } from '../index';
import clsx from 'clsx';

interface EmptySectionI {
  title: string;
  subtitle?: string;
  icon?: string;
  buttons?: ButtonInButtonsBar[];
  withIcon?: boolean;
  aside?: boolean;
  horizontal?: boolean;
  noMargin?: boolean;
}

const EmptySection: React.FC<EmptySectionI> = ({
  title,
  subtitle,
  icon,
  buttons,
  withIcon,
  aside,
  horizontal,
  noMargin,
}) => {
  return (
    <div
      className={clsx(
        'd-flex',
        !noMargin && 'my-5',
        horizontal
          ? 'flex-row justify-content-center align-items-center'
          : 'justify-content-center align-items-center flex-column',
        aside && 'justify-content-start',
        'empty-section',
        'w-100'
      )}
    >
      {withIcon && (
        <Icon
          icon={icon || 'it-warning-circle'}
          className={clsx('empty-section__icon ', horizontal && 'mr-3')}
          aria-label='Sezione vuota'
        />
      )}
      <div className='d-flex flex-column align-items-center'>
        <h1 className='h5 text-black'>
          {title || 'Questa sezione è ancora vuota'}
        </h1>
        {subtitle && <h2 className='h6'>{subtitle}</h2>}
      </div>
      {buttons && <ButtonsBar buttons={buttons} />}
    </div>
  );
};

export default EmptySection;
