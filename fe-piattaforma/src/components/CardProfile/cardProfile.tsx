import clsx from 'clsx';
import { CardProps, CardText, CardTitle, Icon } from 'design-react-kit';
import React, { memo } from 'react';

import { selectDevice } from '../../redux/features/app/appSlice';
import { useAppSelector } from '../../redux/hooks';
import AvatarInitials, {
  AvatarSizes,
  AvatarTextSizes,
} from '../AvatarInitials/avatarInitials';
import './cardProfile.scss';

interface CardProfileI extends CardProps {
  name?: string;
  program?: string;
  className?: string;
  activeProfile?: boolean;
  user: { name: string; surname: string; role?: string };
}

const CardProfile: React.FC<CardProfileI> = (props) => {
  const { program, className, activeProfile, user } = props;

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
          'px-2',
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
                'mr-2',
                !activeProfile && 'card-profile-container__opacity'
              )}
            >
              <AvatarInitials
                user={{ uName: user?.name, uSurname: user?.surname }}
                size={device.mediaIsPhone ? AvatarSizes.Big : AvatarSizes.Small}
                font={
                  device.mediaIsPhone
                    ? AvatarTextSizes.Big
                    : AvatarTextSizes.Small
                }
                lightColor={device.mediaIsPhone}
              />
            </div>
          ) : null}
          <div>
            <CardTitle className='mb-1 primary-color-a12'>
              {activeProfile ? (
                <span>
                  <strong>Delegato </strong>
                  <em>
                    <strong>{user.name}</strong>
                  </em>
                </span>
              ) : (
                <span>
                  <strong>Referente </strong>
                  <em>
                    <strong>{user.name}</strong>
                  </em>
                </span>
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
