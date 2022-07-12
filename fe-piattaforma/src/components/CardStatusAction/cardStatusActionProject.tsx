import clsx from 'clsx';
import { Button, CardReadMore, Icon } from 'design-react-kit';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { CRUDActionsI, CRUDActionTypes } from '../../utils/common';
import { useAppSelector } from '../../redux/hooks';
import { selectDevice } from '../../redux/features/app/appSlice';
import StatusChip from '../StatusChip/statusChip';

const fieldMappedForTranslations: { [key: string]: string } = {
  id: 'id',
};

interface CardStatusActionI {
  title: string;
  subtitle?: string;
  status?: string | undefined;
  actionView?: boolean;
  referente?: string;
  fullInfo?:
    | {
        [key: string]: string;
      }
    | undefined;
  onActionClick?: CRUDActionsI;
  id?: string | undefined;
}

const CardStatusActionProject: React.FC<CardStatusActionI> = (props) => {
  const { title, subtitle, status, actionView, fullInfo, onActionClick, id } =
    props;
  const device = useAppSelector(selectDevice);
  const { t } = useTranslation();

  return (
    <div
      className={clsx(
        'card-status-action',
        'mx-3',
        'mb-3',
        'py-3',
        'd-flex',
        'flex-row',
        'align-items-center',
        device.mediaIsPhone && 'position-relative'
      )}
    >
      <div
        className={clsx(
          'd-flex',
          'w-100',
          !device.mediaIsPhone
            ? 'flex-row justify-content-between'
            : 'flex-column align-items-start'
        )}
      >
        <div
          className={clsx(
            'd-flex',
            !device.mediaIsPhone
              ? 'flex-row justify-content-between align-items-center'
              : 'flex-column align-items-start'
          )}
        >
          <div className='card-status-action__title w-100'>
            <span className='neutral-1-color-a8'>
              <strong>{title}</strong>
              {subtitle && (
                <span className='neutral-1-color-a8'>{subtitle}</span>
              )}
            </span>
          </div>

          <div>
            {fullInfo && Object.keys(fullInfo).length ? (
              <div className={clsx('d-flex', 'flex-row', 'flex-wrap')}>
                {Object.keys(fullInfo).map((key, index) => {
                  return (
                    <div
                      className={clsx(
                        'd-flex',
                        'flex-column',
                        'py-3',
                        device.mediaIsPhone ? 'px-1' : 'pr-5'
                      )}
                      key={index}
                      style={{ minWidth: '120px' }}
                    >
                      <span className='primary-color-a12 mr-2 text-wrap'>
                        {t(fieldMappedForTranslations[key])}
                      </span>
                      <span className='neutral-1-color-a8 weight-600 text-wrap'>
                        {fullInfo[key] === null ? '---' : fullInfo[key]}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : null}
          </div>
        </div>
        <div className='d-flex flex-row align-items-center'>
          {status && (
            <StatusChip
              className={clsx(
                'table-container__status-label',
                'primary-bg-a9',
                'mr-4',
                'section-chip',
                'no-border',
                device.mediaIsPhone ? 'mx-0 ml-2' : 'mx-3'
              )}
              status={status}
              chipWidth
            />
          )}
        </div>
      </div>
      <div
        className={clsx(
          device.mediaIsPhone && 'position-absolute px-4',
          'card-crud'
        )}
      >
        {actionView && (
          <CardReadMore
            text={t('visualize')}
            iconName='it-arrow-right'
            href=''
          />
        )}

        {onActionClick && id ? (
          <span className='d-flex align-items-center'>
            {onActionClick[CRUDActionTypes.DELETE] ? (
              device.mediaIsPhone ? null : (
                <Button
                  onClick={() => {
                    onActionClick[CRUDActionTypes.DELETE](id);
                  }}
                  className='pl-3 pr-0'
                >
                  <Icon
                    color='primary'
                    icon='it-delete'
                    size='sm'
                    aria-label='Elimina'
                  />
                </Button>
              )
            ) : null}
            {onActionClick[CRUDActionTypes.VIEW] ? (
              <Button
                onClick={() => {
                  onActionClick[CRUDActionTypes.VIEW](id);
                }}
                className={clsx(device.mediaIsPhone ? 'px-0' : 'px-4')}
              >
                <Icon
                  color='primary'
                  icon='it-chevron-right'
                  size='sm'
                  aria-label='Seleziona'
                />
              </Button>
            ) : null}
            {onActionClick[CRUDActionTypes.PREVIEW] ? (
              <Button
                onClick={() => {
                  onActionClick[CRUDActionTypes.PREVIEW](id);
                }}
                className='px-4'
              >
                <Icon
                  color='primary'
                  icon='it-file'
                  size='sm'
                  aria-label='Preview'
                />
              </Button>
            ) : null}
          </span>
        ) : null}
      </div>
    </div>
  );
};

export default CardStatusActionProject;
