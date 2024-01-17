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
  NOT_SENT: 'NON INVIATO',
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
      case statusCases.NOT_SENT:
        return (
          <Button
            tabIndex={-1}
            className='button-hidden button-icon'
            id={`button-1-not-sent-${id}`}
          >
            <Icon icon={ItPlusCircle} color='primary' size='sm' />
          </Button>
        );
      case statusCases.SENT:
        return (
          <>
            <Button
              className='button-icon'
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
              className='button-icon'
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
              className='button-icon'
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
    <div className='details-row-table neutral-1-color-a8'>
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
      <div className='left-primary-row primary-color-b1'>
        <span className='text-uppercase'>{rowInfoType}</span>
      </div>
      <div className='details-row__right-section '>
        <StatusChip status={stato} />
        <div className='icon-button-relative'>
          <div className='icon-container'>{loadIcons()}</div>
        </div>
      </div>
    </div>
  );
};

export default DetailsRow;
