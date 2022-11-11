import clsx from 'clsx';
import { CardProps, CardText, CardTitle, Icon } from 'design-react-kit';
import React, { memo } from 'react';

import { selectDevice } from '../../redux/features/app/appSlice';
import { useAppSelector } from '../../redux/hooks';
import {
  AvatarSizes,
  AvatarTextSizes,
} from '../Avatar/AvatarInitials/avatarInitials';
import './cardProfile.scss';
import { UserStateI } from '../../redux/features/user/userSlice';
import UserAvatar from '../Avatar/UserAvatar/UserAvatar';

interface CardProfileI extends CardProps {
  className?: string;
  activeProfile?: boolean;
  user: UserStateI['user'];
  profile?: any;
  profilePicture?: string | undefined;
}

const CardProfile: React.FC<CardProfileI> = (props) => {
  const {
    className,
    activeProfile,
    user = {},
    profile = {},
    profilePicture,
  } = props;

  const device = useAppSelector(selectDevice);

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
          'pr-2',
          'py-3',
          'h-100',
          'd-flex',
          'flex-row',
          'align-items-center',
          'justify-content-between',
          'card-profile-container__white-card'
        )}
      >
        <div
          className={clsx('d-flex', 'flex-row', 'align-items-center', 'pl-2')}
        >
          {activeProfile ? (
            <div
              className={clsx(
                'card-profile-container__icon',
                'mr-1',
                !activeProfile && 'card-profile-container__opacity'
              )}
            >
              <UserAvatar
                avatarImage={profilePicture}
                user={{ uSurname: user?.cognome, uName: user?.nome }}
                size={AvatarSizes.Small}
                font={AvatarTextSizes.Small}
                lightColor={device.mediaIsPhone}
              />
            </div>
          ) : (
            <div className='spacing' />
          )}
          <div>
            <CardTitle className='mb-1 primary-color-a12 '>
              <span
                className={clsx(
                  activeProfile && 'font-weight-semibold',
                  'switch-profile-titles'
                )}
              >
                {profile?.descrizioneRuolo}
                {device.mediaIsPhone && <br />}
                {profile?.nomeEnte ? (
                  <em className='switch-profile-subs pr-1'>
                    {` "${profile?.nomeEnte}" `}
                  </em>
                ) : null}
              </span>
            </CardTitle>
            <CardText
              className={clsx(
                activeProfile && 'primary-color-b7',
                !activeProfile && 'neutral-2-color-a5',
                'switch-profile-subs'
              )}
            >
              {profile?.nomeProgramma}
              {profile?.nomeProgettoBreve
                ? `, ${profile?.nomeProgettoBreve}`
                : ''}
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
