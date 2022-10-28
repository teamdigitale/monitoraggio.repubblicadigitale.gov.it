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
  title: string | undefined;
  status?: string | undefined;
  upperTitle?: {
    icon: string | any;
    text: string;
  };
  subTitle?: string;
  iconAvatar?: boolean;
  name?: string | undefined;
  surname?: string | undefined;
  isUserProfile?: boolean | string | undefined;
  enteIcon?: boolean;
  profilePicture?: string | undefined;
  isForumLayout?: boolean;
  inline?: boolean;
}

const SectionTitle: React.FC<SectionTitleI> = (props) => {
  const {
    title = '',
    status,
    upperTitle,
    subTitle,
    iconAvatar,
    name,
    surname,
    isUserProfile = false,
    enteIcon = false,
    profilePicture,
    isForumLayout,
    inline = false,
  } = props;

  const device = useAppSelector(selectDevice);
  const dispatch = useDispatch();

  const inputRef = useRef<HTMLInputElement>(null);
  const addProfilePicture = () => {
    if (inputRef.current !== null) {
      inputRef.current.click();
    }
  };

  const updateImage = async () => {
    if (isUserProfile) {
      const input: HTMLInputElement = document.getElementById(
        'profile_pic'
      ) as HTMLInputElement;

      if (input.files?.length) {
        const selectedImage = input.files[0];
        const res = await dispatch(UploadUserPic(selectedImage));
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (res) {
          // TODO reload is temporary
          window.location.reload();
        }
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
    }
  };

  return (
    <div className={clsx(!isForumLayout && 'd-flex w-100 flex-wrap mx-auto')}>
      {upperTitle ? (
        <div className='d-flex flex-row justify-content-center w-100'>
          <Icon
            icon={upperTitle.icon}
            size='sm'
            className={clsx('icon-color', enteIcon && 'ente-icon', 'mr-2')}
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
          !isForumLayout &&
            'd-flex w-100 justify-content-center align-items-center',
          device.mediaIsPhone && !isForumLayout && 'flex-column'
        )}
      >
        {iconAvatar && !device.mediaIsPhone ? (
          <div className={clsx('position-relative', 'ml-4')}>
            <UserAvatar
              avatarImage={profilePicture}
              user={{ uSurname: surname, uName: name }}
              size={AvatarSizes.Big}
              font={AvatarTextSizes.Big}
              lightColor={device.mediaIsPhone}
              isUserProfile={isUserProfile}
            />

            {isUserProfile && (
              <div
                className={clsx(
                  'camera-icon',
                  'primary-bg',
                  'position-absolute',
                  'rounded-circle',
                  'section-title__icon-container'
                )}
                style={{
                  bottom: device.mediaIsPhone ? '' : '-10px',
                  left: device.mediaIsPhone ? '' : '-10px',
                }}
              >
                <input
                  type='file'
                  id='profile_pic'
                  onChange={updateImage}
                  accept='.png, .jpeg, .jpg'
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
                      top: '7px',
                      left: '7px',
                    }}
                  />
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className='placeholder-div'></div>
        )}
        <div
          style={{ minWidth: '150px', maxWidth: !inline ? '350px' : 'unset' }}
          className={clsx(!isForumLayout && 'text-center mx-3')}
        >
          <div
            className={clsx(
              !isForumLayout
                ? 'custom-section-title__section-title main-title primary-color-a9 text-center d-block'
                : 'font-weight-semibold h5 primary-color-a10'
            )}
          >
            {/*
             <span
            aria-level={1}
            className={clsx(
              isForumLayout
                ? 'font-weight-semibold h5'
                : 'custom-section-title custom-section-title__section-title'
            )}
          >
            {title}
          </span>
             */}
            <p
              //className={clsx(inline && !device.mediaIsPhone && 'text-nowrap')}
            >
              {title}
            </p>
            {/* </span> */}
          </div>
        </div>
        {status ? (
          <div>
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
        ) : (
          <div className='placeholder-div'></div>
        )}
      </div>
      {subTitle ? (
        <div className='d-flex w-100 justify-content-center'>
          <p className='primary-color-a9 mb-0'> {subTitle} </p>
        </div>
      ) : null}
    </div>
  );
};

export default SectionTitle;
