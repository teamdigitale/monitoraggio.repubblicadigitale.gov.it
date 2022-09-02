import clsx from 'clsx';
import { Button, CardProps, CardTitle, Col, Icon } from 'design-react-kit';
import React, { memo } from 'react';
import './sectionInfo.scss';
import { selectDevice } from '../../redux/features/app/appSlice';
import { useAppSelector } from '../../redux/hooks';

export interface SectionInfoI extends CardProps {
  title?: string;
  body?: string;
  open?: boolean | undefined;
  setIsOpen?: (value: boolean) => void;
}

const SectionInfo: React.FC<SectionInfoI> = (props) => {
  const { title, body = '', open, setIsOpen } = props;

  const device = useAppSelector(selectDevice);

  return (
    <div className={clsx('section-info-card', 'primary-bg-b1')}>
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
                onClick={() => (setIsOpen ? setIsOpen(!open) : null)}
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
    </div>
  );
};

export default memo(SectionInfo);
