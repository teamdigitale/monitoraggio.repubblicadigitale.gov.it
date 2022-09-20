import React, { useRef } from 'react';
import './sectionTitle.scss';
import { useAppSelector } from '../../redux/hooks';
import { selectDevice } from '../../redux/features/app/appSlice';
import clsx from 'clsx';
import {
  AvatarSizes,
  AvatarTextSizes,
} from '../Avatar/AvatarInitials/avatarInitials';
import StatusChip from '../StatusChip/statusChip';
import { Button, Icon } from 'design-react-kit';
import { useDispatch } from 'react-redux';
import { UploadUserPic } from '../../redux/features/user/userThunk';
import UserAvatar from '../Avatar/UserAvatar/UserAvatar';

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
  enteIcon?: boolean;
  profilePicture?: string | undefined;
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
    enteIcon = false,
    profilePicture,
  } = props;

  const device = useAppSelector(selectDevice);
  const dispatch = useDispatch();

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
      dispatch(UploadUserPic(selectedImage));

      /*
      const reader = new FileReader();
      //reader.readAsBinaryString(selectedImage);
      reader.readAsDataURL(selectedImage);
      reader.onloadend = () => {
        console.log(reader);
        //return reader.result;
        dispatch(UploadUserPic(reader.result));
      };*/
    }
  };

  return (
    <div className='custom-section-title'>
      {upperTitle ? (
        <div className='d-flex flex-row'>
          <Icon
            icon={upperTitle.icon}
            size={'sm'}
            className={clsx('mr-1', 'icon-color', enteIcon && 'ente-icon')}
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
          'position-relative'
        )}
      >
        {iconAvatar && (
          <UserAvatar
            avatarImage={profilePicture}
            user={{ uName: name, uSurname: surname }}
            size={device.mediaIsPhone ? AvatarSizes.Big : AvatarSizes.Small}
            font={
              device.mediaIsPhone ? AvatarTextSizes.Big : AvatarTextSizes.Small
            }
            lightColor={device.mediaIsPhone}
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
            style={{
              bottom: device.mediaIsDesktop
                ? '-10px'
                : device.mediaIsPhone
                ? '90px'
                : '',
              left: device.mediaIsDesktop
                ? '-10px'
                : device.mediaIsPhone
                ? '75px'
                : '',
            }}
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
                color='white'
                aria-label='Foto'
                className='position-absolute'
                style={{
                  top: '4px',
                  left: '5px',
                }}
              />
            </Button>
          </div>
        )}
        <div
          className={clsx(
            'custom-section-title__section-title',
            'primary-color-a9',
            'text-wrap text-center',
            !device.mediaIsPhone && 'position-relative'
          )}
        >
          <span
            /* role='heading' */ aria-level={1}
            className={clsx(
              'custom-section-title',
              'custom-section-title__section-title'
            )}
          >
            {title}
          </span>
        </div>
        {status ? (
          <div
            className={clsx(!device.mediaIsPhone && 'position-absolute status')}
          >
            <StatusChip
              className={clsx(
                'table-container__status-label',
                'primary-bg-a9',
                'ml-4',
                'section-chip',
                'no-border',
                device.mediaIsPhone ? 'mx-0 ml-2 my-3' : 'mx-3'
              )}
              status={status}
              rowTableId={name?.replace(/\s/g, '') || new Date().getTime()}
            />
          </div>
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
