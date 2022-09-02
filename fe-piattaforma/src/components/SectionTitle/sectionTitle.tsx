import React, { useRef } from 'react';
import './sectionTitle.scss';
import { useAppSelector } from '../../redux/hooks';
import { selectDevice } from '../../redux/features/app/appSlice';
import clsx from 'clsx';
import AvatarInitials, {
  AvatarSizes,
  AvatarTextSizes,
} from '../AvatarInitials/avatarInitials';
import StatusChip from '../StatusChip/statusChip';
import { Button, Icon } from 'design-react-kit';

interface SectionTitleI {
  title: string;
  status?: string | undefined;
  upperTitle?: {
    icon: string | any;
    text: string;
  };
  subTitle?: string;
  iconAvatar?: boolean;
  name?: string | undefined;
  surname?: string | undefined;
  isUserProfile?: boolean;
}

const SectionTitle: React.FC<SectionTitleI> = (props) => {
  const {
    title,
    status,
    upperTitle,
    subTitle,
    iconAvatar,
    name,
    surname,
    isUserProfile = false,
  } = props;
  const device = useAppSelector(selectDevice);

  const inputRef = useRef<HTMLInputElement>(null);
  const addProfilePicture = () => {
    if (inputRef.current !== null) {
      inputRef.current.click();
    }
  };

  const updateImage = () => {
    const input: HTMLInputElement = document.getElementById(
      'profile_pic'
    ) as HTMLInputElement;

    if (input.files?.length) {
      const selectedImage = input.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(selectedImage);
      reader.onloadend = () => {
        return reader.result;
      };
    }
  };

  return (
    <div className='custom-section-title'>
      {upperTitle ? (
        <div className='d-flex flex-row'>
          <Icon
            icon={upperTitle.icon}
            size='sm'
            className='mr-1 icon-color'
            aria-label='Sezione'
          />
          <p
            className={clsx(
              'h6',
              'custom-section-title__upper-text',
              'primary-color-a9',
              'text-uppercase'
            )}
          >
            {upperTitle.text}
          </p>
        </div>
      ) : null}

      <div
        className={clsx(
          'd-flex',
          device.mediaIsPhone ? 'flex-column align-items-center' : 'flex-row',
          isUserProfile && 'position-relative'
        )}
      >
        {iconAvatar && (
          <AvatarInitials
            user={{ uName: name || '', uSurname: surname || '' }}
            size={AvatarSizes.Big}
            font={AvatarTextSizes.Big}
          />
        )}
        {isUserProfile && (
          <div
            className={clsx(
              'camera-icon',
              'primary-bg',
              'position-absolute',
              'rounded-circle',
              'onboarding__icon-container'
            )}
            style={{ bottom: '-10px', left: '-10px' }}
          >
            <input
              type='file'
              id='profile_pic'
              onChange={updateImage}
              accept='image/*, .png, .jpeg, .jpg'
              capture
              ref={inputRef}
              className='sr-only'
            />
            <Button
              onClick={addProfilePicture}
              size='xs'
              className='profile-picture-btn'
            >
              <Icon
                size='xs'
                icon='it-camera'
                /* padding */
                color='white'
                aria-label='Foto'
                className='position-absolute'
                style={{ top: '7px', left: '7px' }}
              />
            </Button>
          </div>
        )}
        <div className='custom-section-title__section-title primary-color-a9 text-nowrap'>
          <span role='heading' aria-level={1}>
            {' '}
            {title}{' '}
          </span>
        </div>
        {status ? (
          <StatusChip
            className={clsx(
              'table-container__status-label',
              'primary-bg-a9',
              'mr-4',
              'section-chip',
              'no-border',
              device.mediaIsPhone ? 'mx-0 ml-2 my-3' : 'mx-3'
            )}
            status={status}
            rowTableId={name?.replace(/\s/g, '') || new Date().getTime()}
          />
        ) : null}
      </div>
      {subTitle ? (
        <div className='ml-3'>
          <p className='primary-color-a9 mb-0'> {subTitle} </p>
        </div>
      ) : null}
    </div>
  );
};

export default SectionTitle;
