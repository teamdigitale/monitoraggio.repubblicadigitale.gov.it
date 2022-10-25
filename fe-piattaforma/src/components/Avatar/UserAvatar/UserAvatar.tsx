import clsx from 'clsx';
import React from 'react';
import { selectDevice } from '../../../redux/features/app/appSlice';
import { useAppSelector } from '../../../redux/hooks';
import AvatarInitials, {
  AvatarSizes,
  AvatarTextSizes,
} from '../AvatarInitials/avatarInitials';

interface UserAvatarI {
  avatarImage?: string | undefined;
  user?: {
    uSurname: string | undefined;
    uName: string | undefined;
  };
  lightColor?: boolean | undefined;
  size?: AvatarSizes;
  font?: AvatarTextSizes;
  isUserProfile?: boolean | string | undefined;
}

const UserAvatar: React.FC<UserAvatarI> = (props) => {
  const {
    avatarImage = '',
    size,
    user = { uSurname: '', uName: '' },
    /*  lightColor = false,
    font, */
    isUserProfile = false,
  } = props;

  const device = useAppSelector(selectDevice);
  return (
    <div
      className={clsx(
        'rounded-circle',
        'd-flex',
        'align-items-center',
        'justify-content-center',
        'font-weight-light',
        `avatar-user-container__circle-width${size}`,
        'mr-2',
        avatarImage && 'border border-primary'
      )}
      style={{
        width: isUserProfile || size === AvatarSizes.Big ? '68px' : '35px',
        height: isUserProfile || size === AvatarSizes.Big ? '68px' : '35px',
      }}
    >
      {avatarImage ? (
        <img
          src={avatarImage}
          alt='avatar'
          className='avatar-user-container__avatar-image'
          style={{ borderRadius: '50%', width: '100%', height: '100%' }}
        />
      ) : (
        <AvatarInitials
          user={{ uSurname: user.uSurname, uName: user.uName }}
          lightColor={device.mediaIsPhone}
          size={
            isUserProfile || size === AvatarSizes.Big
              ? AvatarSizes.Big
              : AvatarSizes.Small
          }
          font={
            isUserProfile || size === AvatarSizes.Big
              ? AvatarTextSizes.Big
              : AvatarTextSizes.Small
          }
        />
      )}
    </div>
  );
};

export default UserAvatar;
