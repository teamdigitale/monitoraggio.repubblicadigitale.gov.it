import clsx from 'clsx';
import { Button, CardReadMore, FormGroup, Icon, Label } from 'design-react-kit';
import React, { memo, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { CRUDActionsI, CRUDActionTypes } from '../../utils/common';
import { useAppSelector } from '../../redux/hooks';
import { selectDevice } from '../../redux/features/app/appSlice';
// import isEqual from 'lodash.isequal';
import Input from '../Form/input';
import StatusChip from '../StatusChip/statusChip';

const fieldMappedForTranslations: { [key: string]: string } = {
  serviziErogati: 'provided_services',
  nFacilitatori: 'nr_facilitators',
  ente: 'body',
  id: 'id',
  ente_ref: 'ente_ref',
  profilo: 'Profilo',
  ruoli: 'Ruoli',
  ref: 'Referenti',
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
  cf?: string | undefined;
  moreThanOneSurvey?: boolean;
  onCheckedChange?: (checked: string) => void;
}

const CardStatusAction: React.FC<CardStatusActionI> = (props) => {
  const {
    title,
    subtitle,
    status,
    actionView,
    fullInfo,
    onActionClick,
    id,
    moreThanOneSurvey = false,
    onCheckedChange,
  } = props;
  const device = useAppSelector(selectDevice);
  const [isChecked, setIsChecked] = useState<string>('');

  useEffect(() => {
    if (onCheckedChange) {
      onCheckedChange(isChecked);
    }
  }, [isChecked]);

  const { t } = useTranslation();

  return (
    <div
      className={clsx(
        'd-flex',
        'flex-column',
        'card-status-action',
        'mx-3',
        'mb-3',
        device.mediaIsPhone && 'py-0'
      )}
    >
      <div
        className={clsx(
          'd-flex',
          'align-items-center',
          'justify-content-start'
        )}
      >
        {moreThanOneSurvey && (
          <FormGroup check>
            <Input
              aria-label='Radio button'
              name='gruppo1'
              type='radio'
              id={`radio${id}`}
              onClick={() => setIsChecked(`${id}`)}
              checked={isChecked === `radio${id}`}
            />
            <Label className='sr-only'>Radio button</Label>
          </FormGroup>
        )}
      </div>
      <div
        className={clsx(
          'd-flex',
          'justify-content-between',
          'align-items-center',
          'mt-4',
          'mb-3',
          'w-100',
          'flex-row',
          device.mediaIsPhone && 'flex-wrap'
        )}
      >
        <div
          className={clsx(
            device.mediaIsPhone && 'title',
            'd-flex',
            'flex-row',
            'justify-content-between',
            'align-items-center',
            'flex-wrap'
          )}
        >
          <div
            style={{
              minWidth: device.mediaIsDesktop ? '300px' : '200px',
            }}
          >
            <span className='neutral-1-color-a8 card-status-action__title text-wrap'>
              <strong>{title}</strong>
              {subtitle && (
                <span className='neutral-1-color-a8'>{subtitle}</span>
              )}
            </span>
          </div>

          {fullInfo && Object.keys(fullInfo).length ? (
            <div
              className={clsx(
                device.mediaIsPhone
                  ? 'd-flex flex-column align-items-start'
                  : 'd-flex flex-row flex-wrap'
              )}
            >
              {Object.keys(fullInfo).map((key, index) => {
                return (
                  <div
                    className={clsx(
                      'd-flex',
                      'flex-column',
                      'py-3',
                      device.mediaIsPhone && 'px-1',
                      device.mediaIsTablet && 'pr-2',
                      device.mediaIsDesktop && 'pr-5'
                    )}
                    key={index}
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
        <div
          className={clsx(
            'd-flex',
            'flex-row',
            'align-items-center',
            device.mediaIsPhone
              ? 'align-items-start justify-content-start'
              : 'd-flex flex-row justify-content-end'
          )}
        >
          <div
            className={clsx(
              'd-flex',
              'flex-row',
              'align-items-center',
              'justify-content-end'
            )}
            style={{ minWidth: device.mediaIsDesktop ? '150px' : '' }}
          >
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
                rowTableId={id}
                chipWidth
              />
            )}
          </div>
          {!device.mediaIsPhone && actionView && (
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
                  className={clsx(device.mediaIsPhone ? 'px-0' : 'px-2')}
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
    </div>
  );
};

// export default memo(CardStatusAction, (prevProps, currentProps) => {
//   // TODO: check
//   return !isEqual(prevProps, currentProps);
// });
export default memo(CardStatusAction);
