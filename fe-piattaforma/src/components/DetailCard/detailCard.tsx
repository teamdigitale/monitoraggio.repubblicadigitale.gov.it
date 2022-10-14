import React from 'react';
import { Icon } from 'design-react-kit';
import clsx from 'clsx';
import { selectDevice } from '../../redux/features/app/appSlice';
import { useAppSelector } from '../../redux/hooks';

export interface DetailCardI {
  isCommunity?: boolean | undefined;
  entity?: string | undefined,
  entity_type?: string | undefined;
  program_label?: string | undefined;
  intervention?: string | undefined
}

const DetailCard: React.FC<DetailCardI> = (props) => {
  const { isCommunity, intervention, program_label, entity, entity_type } = props;
  const device = useAppSelector(selectDevice);
  return (
    <div
      className={clsx(
        'detail-card-container',
        'lightgrey-bg-b4',
        'd-flex',
        !device.mediaIsPhone && isCommunity
          ? 'align-items-center'
          : 'align-items-start',
        isCommunity && !device.mediaIsPhone
          ? 'p-3'
          : device.mediaIsPhone
          ? 'py-3 px-2'
          : 'p-4'
      )}
    >
      <div
        className={clsx(
          device.mediaIsPhone
            ? 'detail-card-container icon-it-pa-container__phone'
            : isCommunity
            ? 'detail-card-container icon-it-pa-container__community'
            : 'detail-card-container icon-it-pa-container',
          'd-flex',
          'justify-content-center',
          'align-items-center',
          !device.mediaIsPhone && 'mx-3'
        )}
      >
        <Icon
          icon='it-pa'
          size={device.mediaIsPhone ? 'sm' : isCommunity ? '' : 'lg'}
          fill='#66A5E3'
        />
      </div>

     
            <div
              className={clsx(!device.mediaIsPhone ? 'pl-3' : 'pl-2')}
              style={{ lineHeight: '32px' }}
            >
              {!device.mediaIsPhone ? (
                <p>
                  <b>Ente:</b> {entity}
                  <b className='mx-2'>|</b>
                  <b>Tipologia:</b> {entity_type}
                </p>
              ) : (
                <div style={{ fontSize: '14px' }}>
                  <p>
                    <b>Ente:</b> {entity}
                  </p>
                  <p>
                    <b>Tipologia:</b> {entity_type}
                  </p>
                </div>
              )}
              {(intervention && program_label) && (
                <div
                  style={{
                    fontSize: device.mediaIsPhone ? '14px' : '',
                    lineHeight: '32px',
                  }}
                >
                  <p>
                    <b>Intervento:</b> {intervention}
                  </p>
                  <p>
                    <b>Programma:</b> {program_label}
                  </p>
                </div>
              )}
            </div>
    </div>
  );
};

export default DetailCard;
