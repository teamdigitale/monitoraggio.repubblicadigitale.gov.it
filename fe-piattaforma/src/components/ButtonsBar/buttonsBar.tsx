import React from 'react';
import { Button, ButtonProps, Icon } from 'design-react-kit';

export interface ButtonInButtonsBar extends ButtonProps {
  text: string;
  iconForButton?: string;
  iconColor?: string;
}

interface StickyButtonsI {
  buttons: ButtonInButtonsBar[];
}

const ButtonsBar: React.FC<StickyButtonsI> = ({ buttons = [] }) => {
  return (
    <div className='buttons-bar justify-content-lg-end justify-content-around'>
      {buttons.map((button: ButtonInButtonsBar, index: number) => (
        <Button
          key={index}
          {...button}
          tabIndex={-1}
          className='text-nowrap btn-xs'
        >
          {button.iconForButton && (
            <Icon
              icon={button.iconForButton}
              size='sm'
              color={button.iconColor || 'white'}
              className='mr-2'
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
