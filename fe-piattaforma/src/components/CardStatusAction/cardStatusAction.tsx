import clsx from 'clsx';
import {
  Button,
  CardReadMore,
  FormGroup,
  Icon,
  Label,
  UncontrolledTooltip,
} from 'design-react-kit';
import React, { memo, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { CRUDActionsI, CRUDActionTypes } from '../../utils/common';
import { useAppSelector } from '../../redux/hooks';
import { selectDevice } from '../../redux/features/app/appSlice';
// import isEqual from 'lodash.isequal';
import Input from '../Form/input';
import StatusChip from '../StatusChip/statusChip';
import { userRoles } from '../../pages/administrator/AdministrativeArea/Entities/utils';
import { useNavigate, useParams } from 'react-router-dom';
import { selectPrograms } from '../../redux/features/administrativeArea/administrativeAreaSlice';

const fieldMappedForTranslations: { [key: string]: string } = {
  serviziErogati: 'provided_services',
  nFacilitatori: 'nr_facilitators',
  ente: 'body',
  id: 'id',
  ente_ref: 'ente_ref',
  profilo: 'Profilo',
  ruoli: 'Ruolo',
  ref: 'Referenti',
  progetto: 'Progetto',
  programma: 'Programma',
};

interface CardStatusActionI {
  title?: string | undefined;
  subtitle?: string;
  status?: string | undefined;
  actionView?: boolean;
  referente?: string;
  fullInfo?:
  | {
    [key: string]: string | undefined;
  }
  | undefined;
  onActionClick?: CRUDActionsI;
  id?: string | undefined;
  cf?: string | undefined;
  moreThanOneSurvey?: boolean;
  onCheckedChange?: (checked: string) => void;
  activeRole?: boolean;
  showArrow?: boolean;
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
    cf,
    moreThanOneSurvey = false,
    onCheckedChange,
    activeRole = false,
    showArrow = true,
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
        device.mediaIsPhone && 'py-0',
        activeRole && 'active-role-border'
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
            'align-items-center',
            'flex-wrap',
            'flex-grow-1'
          )}
        >
          {title || subtitle ? (
            <div
              className='card-status-action__title w-100 pr-4 text-truncate'
              style={{
                minWidth: device.mediaIsDesktop ? '300px' : '200px',
              }}
            >
              <span className='neutral-1-color-a8 card-status-action__title text-wrap'>
                {title ? <strong>{title}</strong> : null}
                {subtitle ? (
                  <span className='neutral-1-color-a8'>{subtitle}</span>
                ) : null}
              </span>
            </div>
          ) : null}
          {fullInfo && Object.keys(fullInfo).length ? (
            <div
              className={clsx(
                device.mediaIsPhone
                  ? 'd-flex flex-column align-items-start'
                  : 'd-flex flex-row w-100 flex-wrap'
              )}
            >
              {Object.keys(fullInfo).length ? (
                <div
                  className={clsx(
                    device.mediaIsPhone
                      ? 'd-flex flex-column align-items-start'
                      : 'd-flex flex-row w-100 flex-wrap'
                  )}
                >
                  {(() => {
                    const keys = Object.keys(fullInfo);
                    const group1 = keys.slice(2, 4); // Indici 2 e 3
                    const group2 = keys.slice(0, 2); // Indici 0 e 1
                    const orderedKeys = [...group1, ...group2];

                    return orderedKeys.map((key, index) => {
                      if (!fullInfo[key]) return null;
                      return (
                        <div
                          className={clsx(
                            'd-flex',
                            'flex-column',
                            'py-3',
                            device.mediaIsPhone && 'px-1',
                            device.mediaIsTablet && 'pr-2',
                            device.mediaIsDesktop && 'pr-5',
                            'status-action-width',
                          )}
                          key={index}
                        >
                          <span className='primary-color-a12 mr-2 text-wrap'>
                            {t(fieldMappedForTranslations[key])}
                          </span>
                          {group2.includes(key) ? (
                            <a
                              href={`#${fullInfo[key]}`}
                              className='weight-600 text-wrap'
                              style={{ color: '#0066CC' }}
                              onClick={() => {
                                onActionClick?.[CRUDActionTypes.VIEW]?.(id ?? '-');
                              }}
                            >
                              {fullInfo[key] === null ? '---' : fullInfo[key]}
                            </a>
                          ) : (
                            <span className='neutral-1-color-a8 weight-600 text-wrap'>
                              {fullInfo[key] === null ? '---' : fullInfo[key]}
                            </span>
                          )}
                        </div>
                      );
                    });
                  })()}
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
        <div
          className={clsx(
            'd-flex',
            'flex-row',
            'align-items-center',
            device.mediaIsPhone
              ? 'align-items-start justify-content-start w-100'
              : 'd-flex flex-row justify-content-end'
          )}
        >
          <div
            className={clsx(
              'd-flex',
              'flex-column',
              'align-items-center',
              'justify-content-end'
            )}
            style={{
              minWidth: device.mediaIsDesktop
                ? '190px'
                : device.mediaIsTablet
                  ? '170px'
                  : 'unset',
              marginBottom: '34px'
            }}
          >
            {status && (
              <>
                <span className='primary-color-a12 mr-2 text-wrap'>Stato Ruolo</span>
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
              </>
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
                        onActionClick[CRUDActionTypes.DELETE](cf ? cf : id);
                      }}
                      className='pl-3 pr-0'
                      id={`icon-delete-${cf || id}`.replaceAll(' ', '_')}
                    >
                      <Icon
                        color='primary'
                        icon='it-less-circle'
                        size='sm'
                        aria-label={`Rimuovi ${title || fullInfo?.programma}`}
                      />
                    </Button>
                    <UncontrolledTooltip
                      placement='top'
                      target={`icon-delete-${cf || id}`.replaceAll(' ', '_')}
                    >
                      Rimuovi
                    </UncontrolledTooltip>
                  </>
                )
              ) : null}
              {showArrow && onActionClick[CRUDActionTypes.VIEW] ? (
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
                    aria-label={`Vai al dettaglio di ${title || fullInfo?.programma
                      }`}
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
                    aria-label={`Anteprima di ${title || fullInfo?.programma}`}
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
