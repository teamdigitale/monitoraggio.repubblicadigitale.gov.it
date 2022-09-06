import { Card, CardBody, Icon } from 'design-react-kit';
import ColoredListBullets from '/public/assets/img/blue-list-bullets.png';
import React from 'react';
import clsx from 'clsx';
import { useAppSelector } from '../../redux/hooks';
import { selectDevice } from '../../redux/features/app/appSlice';

interface InfoPanelI {
  title?: string;
  list?: string[];
  onlyList?: boolean;
  colsNo?: number;
  openData?: boolean;
  HTMLlist?: boolean;
  body?: string;
}

const InfoPanel: React.FC<InfoPanelI> = (props) => {
  const {
    title,
    list = [],
    onlyList = false,
    colsNo,
    openData = false,
    HTMLlist = false,
    body = '',
  } = props;
  const device = useAppSelector(selectDevice);
  const colStyle = device.mediaIsPhone
    ? `1fr`
    : colsNo && !device.mediaIsPhone
    ? `repeat(${colsNo}, 1fr)`
    : 'repeat(3,1fr)';

  return (
    <div className='info-panel pt-2'>
      {onlyList ? (
        <div
          className={clsx(
            'info-panel__list-container',
            device.mediaIsPhone && 'pl-4'
          )}
          style={{ gridTemplateColumns: `${colStyle}` }}
        >
          {!HTMLlist ? (
            list.map((item, index) => (
              <div
                key={index}
                className={clsx(
                  'd-flex',
                  'flex-row',
                  'align-items-center',
                  'mt-1',
                  'pr-2'
                )}
              >
                <div className='d-flex flex-row align-items-center'>
                  <Icon icon={ColoredListBullets} />
                  <p className='text-nowrap'>{item}</p>
                </div>
              </div>
            ))
          ) : (
            <div
              dangerouslySetInnerHTML={{ __html: body }}
              className='section-info-list'
            />
          )}
        </div>
      ) : (
        <>
          {title ? <p className='h6 info-panel__title'>{title}</p> : null}

          <Card spacing className='card-bg pr-2'>
            <CardBody className={clsx('pb-0', !device.mediaIsPhone && 'pl-5')}>
              <div
                className={clsx(
                  'info-panel__list-container',
                  device.mediaIsPhone && 'pl-4'
                )}
                style={{ gridTemplateColumns: !HTMLlist ? `${colStyle}` : '' }}
              >
                {!HTMLlist ? (
                  list.map((item, index) => (
                    <div
                      key={index}
                      className={clsx(
                        'd-flex',
                        'flex-column',
                        'align-items-start',
                        'mt-1',
                        device.mediaIsPhone && 'mb-3'
                      )}
                    >
                      <div
                        className={clsx(
                          'd-flex',
                          'flex-row',
                          'align-items-center',
                          openData && 'pl-3 pr-5 py-2'
                        )}
                      >
                        <div>
                          <Icon icon={ColoredListBullets} />
                          <p className='text-nowrap'>{item}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div
                    dangerouslySetInnerHTML={{ __html: body }}
                    className='section-info-list'
                  />
                )}
              </div>
            </CardBody>
          </Card>
        </>
      )}
    </div>
  );
};

export default InfoPanel;
