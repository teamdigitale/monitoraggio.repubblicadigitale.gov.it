import clsx from 'clsx';
import { Icon } from 'design-react-kit';
import React from 'react';
import './avatarInitials.scss';

export enum AvatarSizes {
  Big = '__big',
  Small = '__small',
}

export enum AvatarTextSizes {
  Big = '__font-big',
  Small = '__font-small',
}

export interface AvatarInitialsI {
  user: {
    uName: string | undefined;
    uSurname: string | undefined;
  };
  lightColor?: boolean | undefined;
  size?: AvatarSizes;
  font?: AvatarTextSizes;
}

const AvatarInitials: React.FC<AvatarInitialsI> = (props) => {
  const {
    user: { uName = '', uSurname = '' },
    lightColor = false,
    size,
    font,
  } = props;

  const getInitials = (name: string, surname: string) => {
    const userName = name.charAt(0).toUpperCase();
    const userSurname = surname.charAt(0).toUpperCase();

    return userName + userSurname;
  };

  return (
    <div
      className={clsx(
        'rounded-circle',
        lightColor
          ? 'text-white lightgrey-bg-b1'
          : 'primary-color neutral-2-bg',
        'd-flex',
        'align-items-center',
        'justify-content-center',
        'font-weight-light',
        `avatar-initials-container__circle-width${size}`,
        'mr-2'
      )}
    >
      {uName && uSurname ? (
        <p className={`m-1 initials${font}`}>{getInitials(uName, uSurname)}</p>
      ) : (
        <Icon icon='it-user' color='primary' className='p-1' />
      )}
    </div>
  );
};

export default AvatarInitials;
