import React from 'react';
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
import UserAvatar from '../Avatar/UserAvatar/UserAvatar';
import { selectImmagineProfilo } from '../../redux/features/user/userSlice';
import { openModal } from '../../redux/features/modal/modalSlice';
import ManageProfilePic from '../../pages/administrator/AdministrativeArea/Entities/modals/manageProfilePic';

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
  noTitleEllipsis?: boolean;
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
    profilePicture = '',
    isForumLayout,
    inline = false,
    noTitleEllipsis = false,
  } = props;

  const device = useAppSelector(selectDevice);
  const dispatch = useDispatch();
  const immagineProfilo = useAppSelector(selectImmagineProfilo);

  return (
    <div className={clsx(!isForumLayout && 'd-flex w-100 flex-wrap')}>
      {upperTitle ? (
        <div
          className={clsx(
            'd-flex',
            'flex-row',
            'justify-content-center',
            'align-items-center',
            'w-100'
          )}
        >
          <Icon
            icon={upperTitle.icon}
            size='sm'
            className={clsx('icon-color', enteIcon && 'ente-icon', 'mr-2')}
            aria-label='Sezione'
          />
          <p
            className={clsx(
              'h6',
              'mb-0',
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
            'd-flex flex-row w-100 justify-content-center align-items-center',
          device.mediaIsPhone && !isForumLayout && 'flex-column'
        )}
      >
        {iconAvatar && !device.mediaIsPhone ? (
          <div className={clsx('position-relative')}>
            <UserAvatar
              avatarImage={profilePicture || immagineProfilo}
              user={{ uSurname: surname, uName: name }}
              size={AvatarSizes.Big}
              font={AvatarTextSizes.Big}
              lightColor={device.mediaIsPhone}
              isUserProfile={isUserProfile}
            />

            {isUserProfile && (
              <Button
                onClick={() =>
                  dispatch(
                    openModal({
                      id: 'update-profile-pic-modal',
                      payload: { title: 'Aggiorna immagine profilo' },
                    })
                  )
                }
                className={clsx(
                  'camera-icon',
                  'primary-bg',
                  'position-absolute',
                  'rounded-circle',
                  'section-title__icon-container',
                  'profile-picture-btn'
                )}
                style={{
                  bottom: device.mediaIsPhone ? '' : '-10px',
                  left: device.mediaIsPhone ? '' : '-10px',
                }}
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
            )}
          </div>
        ) : null}
        <div
          style={{
            //minWidth: '150px',
            maxWidth: !inline ? '350px' : 'unset',
          }}
          className={clsx(
            //!isForumLayout && 'text-center',
            iconAvatar && !device.mediaIsPhone && 'ml-1',
            status && device.mediaIsDesktop && 'mr-1'
          )}
        >
          <div
            className={clsx(
              !isForumLayout
                ? noTitleEllipsis
                  ? 'custom-section-title__section-title primary-color-a9 text-center'
                  : 'custom-section-title__section-title main-title primary-color-a9 text-center'
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
          <div className={clsx(!device.mediaIsPhone && 'ml-2')}>
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
        <div className='d-flex w-100 justify-content-center'>
          <p className='primary-color-a9 mb-0'> {subTitle} </p>
        </div>
      ) : null}
      <ManageProfilePic isPreview />
    </div>
  );
};

export default SectionTitle;
