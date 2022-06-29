import React from 'react';
import { Button, Chip, ChipLabel, Icon } from 'design-react-kit';
import clsx from 'clsx';
import {
  statusBgColor,
  statusColor,
} from '../../pages/administrator/CitizensArea/utils';
import { CRUDActionsI, CRUDActionTypes } from '../../utils/common';

interface DetailsRowI {
  id: string;
  nome: string;
  stato: string;
  onActionClick: CRUDActionsI;
  innerInfo: { [key: string]: string };
  rowInfoType: string;
}

const statusCases = {
  SENT: 'INVIATO',
  NOT_SENT: 'NON INVIATO',
  FILLED_OUT: 'COMPILATO',
};

const DetailsRow: React.FC<DetailsRowI> = ({
  id,
  nome,
  stato,
  onActionClick,
  innerInfo,
  rowInfoType,
}) => {
  const loadIcons = () => {
    switch (stato.toUpperCase()) {
      case statusCases.NOT_SENT:
        return (
          <>
            <Button
              onClick={() => onActionClick[CRUDActionTypes.COMPILE](id)}
              aria-label='Compila riga'
            >
              <Icon
                icon='it-plus-circle'
                color='primary'
                size='sm'
                aria-label='Compila riga'
              />
            </Button>
            <Button
              onClick={() => onActionClick[CRUDActionTypes.SEND](id)}
              aria-label='Invia questionario'
            >
              <Icon
                icon='it-external-link'
                color='primary'
                size='sm'
                aria-label='Invia questionario'
              />
            </Button>
          </>
        );
      case statusCases.SENT:
        return (
          <>
            <Button
              onClick={() => onActionClick[CRUDActionTypes.COMPILE](id)}
              aria-label='Compila riga'
            >
              <Icon
                icon='it-plus-circle'
                color='primary'
                size='sm'
                aria-label='Compila riga'
              />
            </Button>
            <Button
              onClick={() => onActionClick[CRUDActionTypes.SEND](id)}
              aria-label='Invia questionario disabilitato'
              disabled
            >
              <Icon
                icon='it-external-link'
                color='primary'
                size='sm'
                aria-label='Invia questionario disabilitato'
              />
            </Button>
          </>
        );
      case statusCases.FILLED_OUT:
        return (
          <Button
            onClick={() => onActionClick[CRUDActionTypes.VIEW](id)}
            aria-label='Visualizza questionario'
          >
            <Icon
              icon='it-zoom-in'
              color='primary'
              size='sm'
              aria-label='Compila riga'
            />
          </Button>
        );
      default:
        break;
    }
  };

  return (
    <div className='details-row neutral-1-color-a8'>
      <div className='details-row__left-section'>
        {onActionClick[CRUDActionTypes.EDIT] && (
          <Button
            onClick={() => onActionClick[CRUDActionTypes.EDIT](id)}
            className='mr-2 p-0 details-row__name'
            aria-label='Modifica riga'
          >
            <Icon
              icon='it-pencil'
              color='primary'
              size='sm'
              aria-label='Modifica riga'
            />
          </Button>
        )}
        <div className='details-row__name'>
          <h2 className='h5 font-weight-semibold'>{nome}</h2>
        </div>
      </div>
      <div className='details-row__info'>
        {Object.keys(innerInfo).map((x, index) => (
          <div key={index}>
            <span className='font-weight-normal primary-color-a12'>{x}: </span>
            <span className='text-uppercase'>{innerInfo[x]}</span>
          </div>
        ))}
      </div>
      <div className='details-row__right-section primary-color-b1'>
        <span className='text-uppercase'>{rowInfoType}</span>
        <div>
          <Chip
            className={clsx(
              'table-container__status-label',
              statusBgColor(stato),
              'no-border'
            )}
          >
            <ChipLabel className={statusColor(stato)}>
              {stato.toUpperCase()}
            </ChipLabel>
          </Chip>
          {loadIcons()}
        </div>
      </div>
    </div>
  );
};

export default DetailsRow;
