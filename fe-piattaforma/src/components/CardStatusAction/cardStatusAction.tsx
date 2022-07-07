import clsx from 'clsx';
import {
  Button,
  CardReadMore,
  Chip,
  ChipLabel,
  FormGroup,
  Icon,
  Label,
} from 'design-react-kit';
import React, { memo, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { CRUDActionsI, CRUDActionTypes } from '../../utils/common';
import { useAppSelector } from '../../redux/hooks';
import { selectDevice } from '../../redux/features/app/appSlice';
// import isEqual from 'lodash.isequal';
import Input from '../Form/input';

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

  const getStatusLabel = (status: string) => {
    switch (status.toUpperCase()) {
      case 'COMPLETED':
        return 'COMPLETATO';
      case 'ACTIVE':
      case 'ATTIVO':
        return 'ATTIVO';
      case 'NOT_COMPLETED':
        return 'DA COMPLETARE';
      default:
        return status.toUpperCase;
    }
  };
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
        'flex-row',
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
          device.mediaIsDesktop || device.mediaIsTablet
            ? 'd-flex flex-row justify-content-between align-items-center mt-4 mb-3 w-100'
            : 'd-flex flex-row flex-wrap justify-content-start align-items-center mt-4 mb-3'
        )}
      >
        <div>
          <span className='neutral-1-color-a8 card-status-action__title pl-2'>
            <strong>{title}</strong>
            {subtitle && <span className='neutral-1-color-a8'>{subtitle}</span>}
          </span>
        </div>

        {fullInfo && Object.keys(fullInfo).length ? (
          <div
            className={clsx(
              'd-flex',
              'flex-grow-1',
              'justify-content-start',
              'ml-5',
              'pl-5'
            )}
          >
            {Object.keys(fullInfo).map((key, index) => {
              return (
                <div className='d-flex flex-column' key={index}>
                  <span className='primary-color-a12 mr-2'>
                    {t(fieldMappedForTranslations[key])}
                  </span>
                  <span className='neutral-1-color-a8 weight-600'>
                    {fullInfo[key]}
                  </span>
                </div>
              );
            })}
          </div>
        ) : null}
        <div
          className={clsx(
            'd-flex',
            'flex-row',
            device.mediaIsPhone
              ? 'align-items-start justify-content-start'
              : 'd-flex flex-row align-items-center justify-content-end'
          )}
        >
          <div className='d-flex flex-row align-items-center'>
            {status && (
              <Chip
                className={clsx(
                  'table-container__status-label',
                  'primary-bg-a9',
                  'mr-4',
                  'section-chip',
                  'no-border',
                  device.mediaIsPhone ? 'mx-0 ml-2 my-3' : 'mx-3'
                )}
              >
                <ChipLabel className='text-white text-uppercase my-1'>
                  {getStatusLabel(status)}
                </ChipLabel>
              </Chip>
            )}
          </div>
          {!device.mediaIsPhone && actionView && (
            <CardReadMore
              text={t('visualize')}
              iconName='it-arrow-right'
              href=''
            />
          )}

          {device.mediaIsDesktop && onActionClick && id ? (
            <span className='d-flex align-items-center'>
              {onActionClick[CRUDActionTypes.DELETE] ? (
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
              ) : null}
              {onActionClick[CRUDActionTypes.VIEW] ? (
                <Button
                  onClick={() => {
                    onActionClick[CRUDActionTypes.VIEW](id);
                  }}
                  className='px-4'
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
