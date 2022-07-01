import React from 'react';
import { ButtonInButtonsBar } from '../ButtonsBar/buttonsBar';
import { Icon } from 'design-react-kit';
import { ButtonsBar } from '../index';
import clsx from 'clsx';

interface EmptySectionI {
  title: string;
  subtitle: string;
  icon?: string;
  buttons?: ButtonInButtonsBar[];
}

const EmptySection: React.FC<EmptySectionI> = ({
  title,
  subtitle,
  icon,
  buttons,
}) => {
  return (
    <div
      className={clsx(
        'd-flex',
        'justify-content-center',
        'align-items-center',
        'empty-section',
        'flex-column',
        'w-100'
      )}
    >
      <Icon
        icon={icon || 'it-warning-circle'}
        className='empty-section__icon'
      />
      <h1 className='h5'>{title || 'Questa sezione è ancora vuota'}</h1>
      {subtitle && <h2 className='h6'>{subtitle}</h2>}
      {buttons && <ButtonsBar buttons={buttons} />}
    </div>
  );
};

export default EmptySection;
