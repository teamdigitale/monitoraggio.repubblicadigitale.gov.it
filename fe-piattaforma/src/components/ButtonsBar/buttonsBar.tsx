import React from 'react';
import { Button, ButtonProps, Icon } from 'design-react-kit';
import clsx from 'clsx';
import { useAppSelector } from '../../redux/hooks';
import { selectDevice } from '../../redux/features/app/appSlice';

export interface ButtonInButtonsBar extends ButtonProps {
  text: string;
  iconForButton?: string;
  iconColor?: string;
}

interface StickyButtonsI {
  buttons: ButtonInButtonsBar[];
}

const ButtonsBar: React.FC<StickyButtonsI> = ({ buttons = [] }) => {
  const device = useAppSelector(selectDevice);

  return (
    <div
      className={clsx(
        'buttons-bar',
        'justify-content-end',
        'pt-2',
        device.mediaIsPhone && 'py-2 flex-nowrap'
      )}
    >
      {buttons.map((button: ButtonInButtonsBar, index: number) => (
        <Button
          key={index}
          {...button}
          tabIndex={-1}
          className={clsx('text-nowrap', 'px-2')}
          size='xs'
        >
          {button.iconForButton && (
            <Icon
              icon={button.iconForButton}
              size='sm'
              color={button.iconColor || 'white'}
              className='mr-1'
              aria-label={button.text}
            />
          )}
          <span>{button.text}</span>
        </Button>
      ))}
    </div>
  );
};

export default ButtonsBar;
