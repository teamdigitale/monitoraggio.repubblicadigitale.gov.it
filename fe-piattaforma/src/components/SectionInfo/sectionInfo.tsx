import clsx from 'clsx';
import { Button, CardProps, CardTitle, Col, Icon } from 'design-react-kit';
import React, { memo, useState } from 'react';
import { selectDevice } from '../../redux/features/app/appSlice';
import { useAppSelector } from '../../redux/hooks';
import './sectionInfo.scss';

export interface SectionInfoI extends CardProps {
  title?: string;
  body?: string;
}

const SectionInfo: React.FC<SectionInfoI> = (props) => {
  const { title, body = '' } = props;

  const [sectionInfoClose, setSectionInfoClose] = useState<boolean>(true);

  const closeSectionInfo = () => {
    setSectionInfoClose(!sectionInfoClose);
  };

  const device = useAppSelector(selectDevice);

  return (
    <div className={clsx('section-info-card', 'primary-bg-b1')}>
      {sectionInfoClose ? (
        <div
          className={clsx(
            'ml-2',
            'bg-white',
            'px-4',
            'py-4',
            'h-100',
            'd-flex',
            'flex-column',
            'section-info-card__white-card'
          )}
        >
          <Col>
            <CardTitle className='h5 mb-2 section-info-card__maxLinesTitle primary-color'>
              <div className='d-flex flex-row align-items-center'>
                <Icon
                  color='primary'
                  icon='it-pin'
                  size='sm'
                  aria-label='calendar'
                  className='mr-2'
                />
                <h1 className={clsx(!device.mediaIsDesktop ? 'h5' : 'h4')}>
                  {title}
                </h1>

                <Button
                  onClick={() => {
                    closeSectionInfo();
                  }}
                  className='close-button pr-0 pt-0'
                >
                  <Icon
                    color='primary'
                    icon='it-close-big'
                    size='sm'
                    aria-label='calendar'
                  />
                </Button>
              </div>
            </CardTitle>
          </Col>
          <div
            dangerouslySetInnerHTML={{ __html: body }}
            className='section-info-list'
          />
        </div>
      ) : null}
    </div>
  );
};

export default memo(SectionInfo);
