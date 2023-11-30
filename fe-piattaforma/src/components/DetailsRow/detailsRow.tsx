import React from 'react';
import { Button, Icon, UncontrolledTooltip } from 'design-react-kit';
import { CRUDActionsI, CRUDActionTypes } from '../../utils/common';
import StatusChip from '../StatusChip/statusChip';
import PasswordVisible from '/public/assets/img/it-password-visible.png';
import ItPlusCircle from '/public/assets/img/it-plus-circle-primary.png';

interface DetailsRowI {
  id: string;
  stato: string;
  onActionClick: CRUDActionsI;
  innerInfo: { [key: string]: string };
  rowInfoType: string;
  idQuestionario?: string;
}

const statusCases = {
  SENT: 'INVIATO',
  NOT_FILLED: 'NON COMPILATO',
  FILLED_OUT: 'COMPILATO',
};

const DetailsRow: React.FC<DetailsRowI> = ({
  id,
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
              onClick={() =>
                onActionClick[CRUDActionTypes.COMPILE](idQuestionario)
              }
              id={`button-1-compile-${id}`}
            >
              <Icon
                icon={ItPlusCircle}
                color='primary'
                size='sm'
                aria-label={`Compila questionario di ${id}`}
              />
            </Button>
            {/*
            <Button
              onClick={() =>
                onActionClick[CRUDActionTypes.SEND]({
                  idCittadino: id,
                  idQuestionario: idQuestionario,
                })
              }
              id={`button-1-send-${id}`}
            >
              <Icon
                icon={ItMail}
                color='primary'
                size='sm'
                aria-label={`Invia questionario a ${nome}`}
              />
            </Button>

            <UncontrolledTooltip
              placement='top'
              target={`button-1-compile-${id}`}
            >
              Compila questionario
            </UncontrolledTooltip>
            <UncontrolledTooltip placement='top' target={`button-1-send-${id}`}>
              Invia questionario
            </UncontrolledTooltip>*/}
          </>
        );
      case statusCases.NOT_FILLED:
        return (
          <>
            <Button
              onClick={() =>
                onActionClick[CRUDActionTypes.COMPILE](idQuestionario)
              }
              id={`button-2-compile-${id}`}
            >
              <Icon
                icon={ItPlusCircle}
                color='primary'
                size='sm'
                aria-label={`Compila questionario di ${id}`}
              />
            </Button>
            {/*
            <Button
              onClick={() =>
                onActionClick[CRUDActionTypes.SEND]({
                  idCittadino: id,
                  idQuestionario: idQuestionario,
                })
              }
              id={`button-2-send-${id}`}
            >
              <Icon
                icon={ItMail}
                color='primary'
                size='sm'
                aria-label={`Invia questionario a ${nome}`}
              />
            </Button>
            <UncontrolledTooltip
              placement='top'
              target={`button-2-compile-${id}`}
            >
              Compila questionario
            </UncontrolledTooltip>
            <UncontrolledTooltip placement='top' target={`button-2-send-${id}`}>
              Invia questionario
            </UncontrolledTooltip>*/}
          </>
        );
      case statusCases.FILLED_OUT:
        return (
          <>
            <Button
              onClick={() =>
                onActionClick[CRUDActionTypes.VIEW](idQuestionario)
              }
              id={`button-view-${id}`}
            >
              <Icon
                icon={PasswordVisible}
                className='icons__icon-visible-password'
                color='primary'
                size='sm'
                aria-label={`Visualizza questionario compilato di ${id}`}
              />
            </Button>
            <UncontrolledTooltip placement='top' target={`button-view-${id}`}>
              Visualizza questionario
            </UncontrolledTooltip>
          </>
        );
      default:
        break;
    }
  };

  return (
    <div className='details-row neutral-1-color-a8'>
      <div className='details-row__left-section'>
        {/*}
        {onActionClick[CRUDActionTypes.EDIT] && (
          <>
            <Button
              onClick={() => onActionClick[CRUDActionTypes.EDIT](id)}
              className='mr-2 p-0 details-row__name'
              id={`button-edit-citizen-${id}`}
            >
              <Icon
                icon={ItPencil}
                color='primary'
                size='sm'
                aria-label={`Modifica anagrafica del cittadino ${id}`}
              />
            </Button>
            <UncontrolledTooltip
              placement='top'
              target={`button-edit-citizen-${id}`}
            >
              Modifica cittadino
            </UncontrolledTooltip>
          </>
        )}*/}
        <div className='details-row__info'>
          <div>
            <span className='text-uppercase font-weight-bold primary-color-a12 text-nowrap'>
              ID Cittadino:
            </span>
            <span className='text-uppercase'>{id}</span>
          </div>
        </div>
        <div className='details-row__info'>
          <div>
            <span className='text-uppercase font-weight-bold primary-color-a12 text-nowrap'>
              Data ultimo aggiornamento:
            </span>
            <span className='text-uppercase'>
              {innerInfo['DataUltimoAggiornamento']}
            </span>
          </div>
        </div>
        <div className='details-row__right-section primary-color-b1'>
          <span className='text-uppercase'>{rowInfoType}</span>
          <div>
            <StatusChip status={stato} />
            {loadIcons()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailsRow;
