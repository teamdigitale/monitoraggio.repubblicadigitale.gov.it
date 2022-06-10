import React from 'react';
import { ButtonInButtonsBar } from '../ButtonsBar/buttonsBar';
import { Icon } from 'design-react-kit';
import { ButtonsBar } from '../index';

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
    <div className='d-flex justify-content-center align-items-center empty-section flex-column w-100'>
      <Icon icon={icon || 'it-note'} className='empty-section__icon' />
      <h3>{title || 'Questa sezione è ancora vuota'}</h3>
      {subtitle && <h4>{subtitle}</h4>}
      {buttons && <ButtonsBar buttons={buttons} />}
    </div>
  );
};

export default EmptySection;
