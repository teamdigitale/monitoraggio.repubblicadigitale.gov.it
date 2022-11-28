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
  notActiveSurvey?: boolean;
  isDocumentsCta?: boolean;
  marginRight?: boolean;
  forumAlignment?: boolean;
}

const ButtonsBar: React.FC<StickyButtonsI> = ({
  buttons = [],
  citizenList = false,
  citizenDeleteChange = false,
  isUserProfile = false,
  notActiveSurvey = false,
  isDocumentsCta = false,
  marginRight = false,
  forumAlignment = false,
}) => {
  const device = useAppSelector(selectDevice);

  return (
    <div
      className={clsx(
        marginRight ? 'buttons-bar-marginRight' : 'buttons-bar',
        forumAlignment ? 'buttons-bar-alignment' : 'button-bar',
        isDocumentsCta && 'flex-column',
        citizenList ? 'justify-content-start' : 'align-items-end',
        citizenDeleteChange ? 'flex-nowrap' : null,
        isUserProfile && 'mr-2',
        'pt-2',
        device.mediaIsPhone && 'py-2',
        notActiveSurvey && !device.mediaIsDesktop && 'flex-column'
      )}
    >
      {buttons.map((button: ButtonInButtonsBar, index: number) => {
        const buttonProps = {
          ...button,
          buttonClass: undefined,
          iconColor: undefined,
          iconForButton: undefined,
          text: undefined, // for accessibility
        };
        return (
          <Button
            key={index}
            {...buttonProps}
            className={clsx(
              'text-nowrap',
              'd-flex',
              'px-2',
              'align-items-center',
              'justify-content-center',
              button.buttonClass
            )}
            size='xs'
            aria-label={button.text}
          >
            {button.iconForButton && (
              <Icon
                icon={button.iconForButton}
                size='sm'
                color={button.iconColor || 'white'}
                className='mr-1'
                aria-label={button.text}
                aria-hidden
              />
            )}
            {button.text}
          </Button>
        );
      })}
    </div>
  );
};

export default ButtonsBar;
