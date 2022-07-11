import React from 'react';
import './sectionTitle.scss';
import { useAppSelector } from '../../redux/hooks';
import { selectDevice } from '../../redux/features/app/appSlice';
import clsx from 'clsx';
import AvatarInitials, {
  AvatarSizes,
  AvatarTextSizes,
} from '../AvatarInitials/avatarInitials';
import StatusChip from '../StatusChip/statusChip';
import { Icon } from 'design-react-kit';

interface SectionTitleI {
  title: string;
  status?: string;
  upperTitle?: {
    icon: string;
    text: string;
  };
  subTitle?: string;
  iconAvatar?: boolean;
  name?: string;
  surname?: string;
}

const SectionTitle: React.FC<SectionTitleI> = (props) => {
  const { title, status, upperTitle, subTitle, iconAvatar, name, surname } =
    props;
  const device = useAppSelector(selectDevice);

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
          device.mediaIsPhone ? 'flex-column align-items-center' : 'flex-row'
        )}
      >
        {iconAvatar && (
          <AvatarInitials
            user={{ uName: name || '', uSurname: surname || '' }}
            size={AvatarSizes.Big}
            font={AvatarTextSizes.Big}
          />
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
