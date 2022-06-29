import clsx from 'clsx';
import { Button, CardReadMore, Chip, ChipLabel, Icon } from 'design-react-kit';
import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { CRUDActionsI, CRUDActionTypes } from '../../utils/common';
import { useAppSelector } from '../../redux/hooks';
import { selectDevice } from '../../redux/features/app/appSlice';
import AccordionRow from '../AccordionRow/accordionRow';
import {
  statusBgColor,
  statusColor,
} from '../../pages/administrator/AdministrativeArea/Entities/utils';
import isEqual from 'lodash.isequal';

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
}

const CardStatusAction: React.FC<CardStatusActionI> = (props) => {
  const { mediaIsDesktop } = useAppSelector(selectDevice);
  const { title, subtitle, status, actionView, fullInfo, onActionClick, id } =
    props;

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

  const { t } = useTranslation();

  if (mediaIsDesktop) {
    return (
      <div
        className={clsx(
          'd-flex',
          'flex-row',
          'justify-content-between',
          'align-items-center',
          'my-3',
          'card-status-action'
        )}
      >
        <div
          className={clsx(
            'd-flex align-items-center',
            subtitle && 'flex-column'
          )}
        >
          <span className='neutral-1-color-a8 card-status-action__title'>
            <strong>{title}</strong>
            {subtitle && <span className='neutral-1-color-a8'>{subtitle}</span>}
          </span>
        </div>
        {fullInfo && Object.keys(fullInfo).length ? (
          <div className='d-flex flex-grow-1 justify-content-around'>
            {Object.keys(fullInfo).map((key, index) => {
              return (
                <div className='d-flex flex-column' key={index}>
                  <span className='primary-color-a12'>
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

        <div className='d-flex flex-row'>
          {status && (
            <Chip
              className={clsx(
                'table-container__status-label',
                'mx-3',
                'primary-bg-a9',
                'mt-3',
                'mr-4',
                'section-chip',
                'no-border'
              )}
            >
              <ChipLabel className='text-white text-uppercase'>
                {getStatusLabel(status)}
              </ChipLabel>
            </Chip>
          )}
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
            </span>
          ) : null}
        </div>
      </div>
    );
  } else {
    return (
      <AccordionRow
        title={title}
        clickViewAction={() =>
          onActionClick?.[CRUDActionTypes.VIEW](id as string)
        }
        innerInfo={{ ...fullInfo, id: id ? id : '' }}
        StatusElement={
          <Chip
            className={clsx(
              'table-container__status-label',
              statusBgColor(status ? status : ''),
              'no-border'
            )}
          >
            <ChipLabel className={statusColor(status ? status : '')}>
              {status?.toUpperCase()}
            </ChipLabel>
          </Chip>
        }
      />
    );
  }
};

export default memo(CardStatusAction, (prevProps, currentProps) => {
  return !isEqual(prevProps, currentProps);
});
