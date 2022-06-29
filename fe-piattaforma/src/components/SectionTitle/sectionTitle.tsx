import React from 'react';
import { Chip, ChipLabel, Icon } from 'design-react-kit';
import './sectionTitle.scss';
import { useAppSelector } from '../../redux/hooks';
import { selectDevice } from '../../redux/features/app/appSlice';
import clsx from 'clsx';

interface SectionTitleI {
  title: string;
  status?: string;
  upperTitle?: {
    icon: string;
    text: string;
  };
  subTitle?: string;
}

const SectionTitle: React.FC<SectionTitleI> = (props) => {
  const { title, status, upperTitle, subTitle } = props;
  const { mediaIsDesktop, mediaIsTablet, mediaIsPhone } =
    useAppSelector(selectDevice);

  return (
    <div className='custom-section-title'>
      {upperTitle ? (
        <div className='d-flex flex-row'>
          <Icon
            icon={upperTitle.icon}
            size='sm'
            color='primary'
            className='mr-1'
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
            {upperTitle.text || 'utente'}
          </p>
        </div>
      ) : null}

      <div className='d-flex flex-row'>
        <div className='custom-section-title__section-title primary-color-a9 text-center'>
          <span role='heading' aria-level={1}>
            {' '}
            {title}{' '}
          </span>
        </div>
        {(mediaIsDesktop || mediaIsTablet || mediaIsPhone) && status ? (
          <Chip
            className={clsx(
              'table-container__status-label',
              'mx-3',
              'primary-bg-a9',
              'mt-3',
              'no-border'
            )}
          >
            <ChipLabel className='text-white'>{status}</ChipLabel>
          </Chip>
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
