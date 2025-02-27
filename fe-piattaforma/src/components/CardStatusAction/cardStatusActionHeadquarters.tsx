import clsx from 'clsx';
import {
  Button,
  CardReadMore,
  Icon,
  UncontrolledTooltip,
} from 'design-react-kit';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { CRUDActionsI, CRUDActionTypes } from '../../utils/common';
import { useAppSelector } from '../../redux/hooks';
import { selectDevice } from '../../redux/features/app/appSlice';
import StatusChip from '../StatusChip/statusChip';

const fieldMappedForTranslations: { [key: string]: string } = {
  serviziErogati: 'provided_services',
  nFacilitatori: 'nr_facilitators',
  nVolontari: 'nr_volunteers',
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
  showPencil?: boolean;
  showEye?: boolean;
  showBlank?: boolean;
}

const CardStatusActionHeadquarters: React.FC<CardStatusActionI> = (props) => {
  const { title, subtitle, status, actionView, fullInfo, onActionClick, id, showEye= false, showPencil=false, showBlank=false } =
    props;
  const device = useAppSelector(selectDevice);

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
            'card-status-action__title',
            'pr-4',
            'text-truncate'
          )}
        >
          <span className='neutral-1-color-a8 card-status-action__title'>
            <strong>{title}</strong>
            {subtitle && <span className='neutral-1-color-a8'>{subtitle}</span>}
          </span>
        </div>

        <div
          className={clsx(
            'd-flex',
            'flex-row',
            'align-items-center',
            device.mediaIsPhone
              ? 'align-items-start justify-content-start'
              : 'd-flex flex-row  justify-content-end'
          )}
        >
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
                !showBlank ? (
                  <Button
                    onClick={() => {
                      onActionClick[CRUDActionTypes.VIEW](id);
                    }}
                    className={clsx(device.mediaIsPhone ? 'px-0' : 'px-4')}
                  >
                    {showPencil ? (
                      <div>
                        <Icon
                          color='primary'
                          icon='it-pencil'
                          size='sm'
                          aria-label={`Vai al dettaglio di ${title || fullInfo?.programma}`}
                        />
                        <span className='neutral-1-color-a8 weight-600 text-wrap ml-1'>
                          Modifica
                        </span>
                      </div>
                    ) : showEye ? (
                      <div>
                        <Icon
                          color='primary'
                          icon='it-password-visible'
                          size='sm'
                          aria-label={`Vai al dettaglio di ${title || fullInfo?.programma}`}
                        />
                        <span className='neutral-1-color-a8 weight-600 text-wrap ml-1'>
                          Visualizza
                        </span>
                      </div>
                    ) : (
                      <Icon
                        color='primary'
                        icon='it-chevron-right'
                        size='sm'
                        aria-label={`Vai al dettaglio di ${title || fullInfo?.programma}`}
                      />
                    )}
                  </Button>
                ) : <div style={{opacity:0, padding: '0px 20px'}}>
                      <Icon
                        color='primary'
                        icon='it-password-visible'
                        size='sm'
                        aria-label={`Vai al dettaglio di ${title || fullInfo?.programma}`}
                      />
                      <span className='neutral-1-color-a8 weight-600 text-wrap ml-1'>
                        Visualizza
                      </span>
                    </div>
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
                    aria-label={`Anteprima di ${title}`}
                  />
                </Button>
              ) : null}
            </span>
          ) : null}
        </div>
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
                  style={{ minWidth: key === 'ente_ref' ? '250px' : '120px' }}
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
  );
};

// export default memo(CardStatusAction, (prevProps, currentProps) => {
//   // TODO: check
//   return !isEqual(prevProps, currentProps);
// });
export default CardStatusActionHeadquarters;
