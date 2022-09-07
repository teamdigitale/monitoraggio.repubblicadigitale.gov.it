import React from 'react';
import { Button, Icon } from 'design-react-kit';
import { CRUDActionsI, CRUDActionTypes } from '../../utils/common';
import StatusChip from '../StatusChip/statusChip';

interface DetailsRowI {
  id: string;
  nome: string;
  stato: string;
  onActionClick: CRUDActionsI;
  innerInfo: { [key: string]: string };
  rowInfoType: string;
  idQuestionario?: string;
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
  idQuestionario = '',
}) => {
  const loadIcons = () => {
    switch (stato.toUpperCase()) {
      case statusCases.SENT:
        return (
          <>
            <Button
              onClick={() => onActionClick[CRUDActionTypes.COMPILE](idQuestionario)}
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
              onClick={() => onActionClick[CRUDActionTypes.SEND]({ idCittadino: id, idQuestionario: idQuestionario})}
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
      case statusCases.NOT_SENT:
        return (
          <>
            <Button
              onClick={() => onActionClick[CRUDActionTypes.COMPILE](idQuestionario)}
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
              onClick={() => onActionClick[CRUDActionTypes.SEND]({ idCittadino: id, idQuestionario: idQuestionario})}
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
      case statusCases.FILLED_OUT:
        return (
          <Button
            onClick={() => onActionClick[CRUDActionTypes.VIEW](idQuestionario)}
            aria-label='Visualizza questionario'
          >
            <Icon
              icon='it-file'
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
            aria-label='Modifica cittadino'
          >
            <Icon
              icon='it-pencil'
              color='primary'
              size='sm'
              aria-label='Modifica cittadino'
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
          <StatusChip status={stato} noTooltip />
          {loadIcons()}
        </div>
      </div>
    </div>
  );
};

export default DetailsRow;
