import React from 'react';
import { Button, ButtonProps, Icon } from 'design-react-kit';
import clsx from 'clsx';
import { useAppSelector } from '../../redux/hooks';
import { selectDevice } from '../../redux/features/app/appSlice';

export interface ButtonInButtonsBar extends ButtonProps {
  text: string;
  iconForButton?: string;
  iconColor?: string;
  buttonClass?: string;
}

interface StickyButtonsI {
  buttons: ButtonInButtonsBar[];
  citizenList?: boolean;
  citizenDeleteChange?: boolean;
  isUserProfile?: boolean;
}

const ButtonsBar: React.FC<StickyButtonsI> = ({
  buttons = [],
  citizenList = false,
  citizenDeleteChange = false,
  isUserProfile = false,
}) => {
  const device = useAppSelector(selectDevice);

  return (
    <div
      className={clsx(
        'buttons-bar',
        citizenList ? 'justify-content-start' : 'justify-content-end',
        citizenDeleteChange ? 'flex-nowrap' : null,
        isUserProfile && 'mr-2',
        'pt-2',
        device.mediaIsPhone && 'py-2'
      )}
    >
      {buttons.map((button: ButtonInButtonsBar, index: number) => {
        const buttonProps = {
          ...button,
          buttonClass: undefined,
          iconColor: undefined,
          iconForButton: undefined,
        };
        return (
          <Button
            key={index}
            {...buttonProps}
            className={clsx('text-nowrap', 'px-2', button.buttonClass)}
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
        );
      })}
    </div>
  );
};

export default ButtonsBar;
