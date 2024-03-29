import clsx from 'clsx';
import {
  Button,
  CardReadMore,
  Icon,
  Label,
  UncontrolledTooltip,
} from 'design-react-kit';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { CRUDActionsI, CRUDActionTypes } from '../../utils/common';
import { useAppSelector } from '../../redux/hooks';
import { selectDevice } from '../../redux/features/app/appSlice';
import Input from '../Form/input';
import StatusChip from '../StatusChip/statusChip';

const fieldMappedForTranslations: { [key: string]: string } = {
  serviziErogati: 'provided_services',
  nFacilitatori: 'nr_facilitators',
  ente: 'body',
  id: 'id',
  ente_ref: 'ente_ref',
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
  moreThanOneSurvey?: boolean;
  onCheckedChange?: (checked: string) => void;
}

const CardStatusActionSurveys: React.FC<CardStatusActionI> = (props) => {
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
      {moreThanOneSurvey && (
        <div className='mt-2 mr-3'>
          <Input
            aria-label={title}
            name='gruppo1'
            type='radio'
            id={`radio${id}`}
            onClick={() => setIsChecked(`${id}`)}
            checked={isChecked === `radio${id}`}
          />
          <Label htmlFor={`radio${id}`} className='sr-only'>
            {title}
          </Label>
        </div>
      )}
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
          <div className='card-status-action__title w-100 pr-4 text-truncate'>
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
                device.mediaIsPhone ? 'mx-0 ml-2 my-4' : 'mx-3'
              )}
              status={status}
              rowTableId={id}
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
                <>
                  <Button
                    onClick={() => {
                      onActionClick[CRUDActionTypes.DELETE](id);
                    }}
                    className='pl-3 pr-0'
                    id={`icon-delete-${id}`}
                  >
                    <Icon
                      color='primary'
                      icon='it-less-circle'
                      size='sm'
                      aria-label={`Rimuovi ${title}`}
                    />
                  </Button>
                  <UncontrolledTooltip
                    placement='top'
                    target={`icon-delete-${id}`}
                  >
                    Rimuovi
                  </UncontrolledTooltip>
                </>
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
                  aria-label={`Vai al dettaglio di ${title}`}
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
                  icon='it-password-visible'
                  size='sm'
                  aria-label={`Anteprima di ${title}`}
                />
              </Button>
            ) : null}
          </span>
        ) : null}
      </div>
    </div>
  );
};

// export default memo(CardStatusAction, (prevProps, currentProps) => {
//   // TODO: check
//   return !isEqual(prevProps, currentProps);
// });
export default CardStatusActionSurveys;
