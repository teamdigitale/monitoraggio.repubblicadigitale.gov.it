import clsx from 'clsx';
import { CardProps, CardText, CardTitle, Icon } from 'design-react-kit';
import React, { memo } from 'react';
//import { selectDevice } from '../../redux/features/app/appSlice';
//import { useAppSelector } from '../../redux/hooks';
import './cardProfile.scss';

interface CardProfileI extends CardProps {
  name?: string;
  program?: string;
  className?: string;
  activeProfile?: boolean;
  user?: { name: string; surname: string; role: string } | undefined;
}

const getInitials = (name: string, surname: string) => {
  const userName = name.charAt(0).toUpperCase();
  const userSurname = surname.charAt(0).toUpperCase();

  return userName + userSurname;
};

//const device = useAppSelector(selectDevice);

const CardProfile: React.FC<CardProfileI> = (props) => {
  const { name, program, className, activeProfile, user } = props;

  return (
    <div
      className={clsx(
        className,
        activeProfile && 'primary-bg-b1',
        !activeProfile && 'primary-bg-white',
        'card-profile-container',
        'justify-content-center',
        'mb-3'
      )}
    >
      <div
        className={clsx(
          'ml-2',
          'bg-white',
          'px-2',
          'py-4',
          'h-100',
          'd-flex',
          'flex-row',
          'align-items-center',
          'justify-content-between',
          'card-profile-container__white-card'
        )}
      >
        <div className='d-flex flex-row align-items-center pl-2'>
          {activeProfile ? (
            <div
              className={clsx(
                'card-profile-container__icon mr-2',
                !activeProfile && 'card-profile-container__opacity '
              )}
            >
              <div
                className={clsx(
                  'rounded-circle',
                  'neutral-2-bg',
                  'd-flex',
                  'align-items-center',
                  'justify-content-center',
                  'primary-color',
                  'font-weight-light',
                  'initials'
                )}
                style={{ height: '53px', width: '53px' }}
              >
                <span> {user && getInitials(user.name, user.surname)} </span>
              </div>
            </div>
          ) : null}
          <div>
            <CardTitle className='mb-1 primary-color-a12'>
              {activeProfile ? (
                <em>
                  <strong>{name}</strong>
                </em>
              ) : (
                <em>
                  <span>{name}</span>
                </em>
              )}
            </CardTitle>
            <CardText
              className={clsx(
                activeProfile && 'primary-color-a12',
                !activeProfile && 'neutral-2-color-a3'
              )}
            >
              {program}
            </CardText>
          </div>
        </div>
        {activeProfile && (
          <div className='d-flex justify-content-between align-content-center'>
            <Icon
              color='primary'
              icon='it-check'
              size=''
              aria-label='Profilo selezionato'
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(CardProfile);
