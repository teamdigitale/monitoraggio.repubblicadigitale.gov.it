import clsx from 'clsx';
import React from 'react';
import { selectDevice } from '../../../redux/features/app/appSlice';
import { useAppSelector } from '../../../redux/hooks';
import AvatarInitials, {
  AvatarSizes,
  AvatarTextSizes,
} from '../AvatarInitials/avatarInitials';

interface UserAvatarI {
  avatarImage?: string | File | undefined;
  user?: {
    uSurname: string | undefined;
    uName: string | undefined;
  };
  lightColor?: boolean | undefined;
  size?: AvatarSizes;
  font?: AvatarTextSizes;
  isUserProfile?: boolean | string | undefined;
  isPreview?: boolean;
}

const UserAvatar: React.FC<UserAvatarI> = (props) => {
  const device = useAppSelector(selectDevice);
  const {
    avatarImage = '',
    size,
    user = { uSurname: '', uName: '' },
    /*  lightColor = false,
    font, */
    isUserProfile = false,
    isPreview = false,
  } = props;

  return (
    <div
      className={clsx(
        'rounded-circle',
        'd-flex',
        'align-items-center',
        'justify-content-center',
        'font-weight-light',
        `avatar-user-container__circle-width${size}`,
        !(isUserProfile && device.mediaIsPhone) && 'mr-2',
        avatarImage && 'border border-primary'
      )}
      style={{
        width:
          isUserProfile || size === AvatarSizes.Big
            ? '67px'
            : size === AvatarSizes.Medium
            ? '58px'
            : size === AvatarSizes.Preview
            ? '120px'
            : '39px',
        height:
          isUserProfile || size === AvatarSizes.Big
            ? '67px'
            : size === AvatarSizes.Medium
            ? '58px'
            : size === AvatarSizes.Preview
            ? '120px'
            : '39px',
      }}
    >
      {avatarImage ? (
        <img
          src={avatarImage as string}
          alt='immagine utente'
          aria-hidden
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
              : size === AvatarSizes.Medium
              ? AvatarSizes.Medium
              : isPreview
              ? AvatarSizes.Preview
              : AvatarSizes.Small
          }
          font={
            isUserProfile || size === AvatarSizes.Big
              ? AvatarTextSizes.Big
              : size === AvatarSizes.Medium
              ? AvatarTextSizes.Medium
              : AvatarTextSizes.Small
          }
        />
      )}
    </div>
  );
};

export default UserAvatar;
