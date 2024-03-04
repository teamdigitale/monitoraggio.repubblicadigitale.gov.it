import React from 'react';
import { Button, Icon, UncontrolledTooltip } from 'design-react-kit';
import { CRUDActionsI, CRUDActionTypes } from '../../utils/common';
import PasswordVisible from '/public/assets/img/it-password-visible.png';
import ItPlusCircle from '/public/assets/img/it-plus-circle-primary.png';
import StatusChip from '../StatusChip/statusChip';

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
  NOT_FILLED: 'NON COMPILATA',
  FILLED_OUT: 'COMPILATA',
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
    <tr className='details-row-table'>
      <td className='details-row__info'>
        <div className='content-info'>
          <span className='text-uppercase font-weight-bold primary-color-a12 text-nowrap'>
            ID Cittadino:
          </span>
          <span className='text-uppercase'>{id}</span>
        </div>
      </td>
      <td className='details-row__info'>
        <div className='content-info'>
          <span className='text-uppercase font-weight-bold primary-color-a12 text-nowrap'>
            Data ultimo aggiornamento:
          </span>
          <span className='text-uppercase'>
            {innerInfo['DataUltimoAggiornamento']}
          </span>
        </div>
      </td>
      <td className='details-row__info'>
        <div className='details-row__right'>
          <div className='primary-color-b1'>
            <span className='text-uppercase'>{rowInfoType}</span>
          </div>
          <div>
            <StatusChip status={stato} />
          </div>
        </div>
      </td>
      <td className='details-row__info'>
        <div className='content-info'>
          <div className='hidden'>azioni</div>
          <div className='details-row-icon'>
            <span>{loadIcons()}</span>
          </div>
        </div>
      </td>
    </tr>
  );
};

export default DetailsRow;
