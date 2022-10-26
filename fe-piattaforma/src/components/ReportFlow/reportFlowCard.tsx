import { Button, Icon } from 'design-react-kit';
import React, { ReactElement, useState } from 'react';
import ReportFlowIcon from '../../../public/assets/img/report-flow-icon.png';
import DoubleChevronRight from '../../../public/assets/img/double-chevron-right-blue.png';
import DoubleChevronLeft from '../../../public/assets/img/double-chevron-left-blue.png';
import clsx from 'clsx';
import FrecciaDown from '../../../public/assets/img/down-line-arrow.png';
import FrecciaRight from '../../../public/assets/img/right-line-arrow.png';

interface ReportFlowI {
  title?: string;
  text?: ReactElement;
}

const ReportFlowCard: React.FC<ReportFlowI> = (props) => {
  let { title = 'TUTORIAL SEGNALAZIONI', text = 'PROCEDURE E VISTE' } = props;

  const [currentStep, setCurrentStep] = useState<number>(0);

  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const previousStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const sections = '(NEWS, TOPIC, DOCUMENTI)';

  const possibleActions = (
    <div className='d-flex flex-row justify-content-row align-items-center'>
      <Icon icon='it-more-items' color='primary' />
      <span className='font-weight-bold'> AZIONI POSSIBILI </span>
    </div>
  );

  const reportFlowPagesTitle = () => {
    switch (currentStep) {
      case 0:
        return (title = `VISTA AUTORE DEL CONTENUTO ${sections}`);
      case 1:
        return (title = `VISTA MODERATORE ${sections}`);
      case 2:
        return (title = `FLUSSO DI SEGNALAZIONE - STEP 1 ${sections}`);
      case 3:
        return (title = `FLUSSO DI SEGNALAZIONE - STEP 2 ${sections}`);
      case 4:
        return (title = `FLUSSO DI SEGNALAZIONE - STEP 3 ${sections}`);
      case 5:
        return (title = `FLUSSO DI SEGNALAZIONE - STEP 4 ${sections}`);
      case 6:
        return (title = `FLUSSO DI SEGNALAZIONE - STEP 5 ${sections}`);
      default: {
        title;
      }
    }
  };

  const reportFlowPagesText = () => {
    switch (currentStep) {
      case 0:
        return (text = (
          <>
            <div className='d-flex flex-row justify-content-center mb-4'>
              {possibleActions}
            </div>
            <div className='d-flex flex-row justify-content-center mt-2'>
              <div
                className={clsx(
                  'report-flow-container__bordered-box',
                  'd-flex ',
                  'flex-column',
                  'align-items-center',
                  'mr-3'
                )}
              >
                <div
                  className={clsx(
                    'd-flex ',
                    'flex-row',
                    'justify-content-center',
                    'align-items-center',
                    'mb-2'
                  )}
                >
                  <Icon icon='it-delete' color='primary' className='mr-2' />
                  <span className='font-weight-bold primary-color'>
                    {' '}
                    ELIMINA{' '}
                  </span>
                </div>

                <p className='text-center'>
                  {' '}
                  per eliminare il contenuto <br /> (apre la modale di conferma){' '}
                </p>
              </div>
              <div
                className={clsx(
                  'report-flow-container__bordered-box',
                  'd-flex ',
                  'flex-column',
                  'align-items-center'
                )}
              >
                <div
                  className={clsx(
                    'd-flex ',
                    'flex-row',
                    'justify-content-center',
                    'align-items-center',
                    'mb-2'
                  )}
                >
                  <Icon icon='it-pencil' color='primary' className='mr-2' />
                  <span className='font-weight-bold primary-color'>
                    {' '}
                    MODIFICA{' '}
                  </span>
                </div>
                <p className='text-center'>
                  {' '}
                  per modificare il contenuto (apre modale prevalorizzata in
                  edit mode){' '}
                </p>
              </div>
            </div>
          </>
        ));
      case 1:
        return (text = (
          <>
            <div className='d-flex flex-row justify-content-center align-items-center mb-4'>
              {possibleActions}{' '}
              <span className='font-weight-bold ml-1'> SUL POST </span>
            </div>
            <div className='d-flex flex-row'>
              <div className='d-flex flex-column align-items-center mr-3'>
                <div
                  className={clsx(
                    'report-flow-container__bordered-box',
                    'd-flex ',
                    'flex-column',
                    'align-items-center'
                  )}
                >
                  <div
                    className={clsx(
                      'd-flex ',
                      'flex-row',
                      'justify-content-center',
                      'align-items-center',
                      'mb-2'
                    )}
                  >
                    <Icon icon='it-delete' color='primary' className='mr-2' />
                    <span className='font-weight-bold primary-color'>
                      {' '}
                      ELIMINA{' '}
                    </span>
                  </div>
                  <p className='text-center'>
                    {' '}
                    per eliminare il post (apre modale di conferma con
                    inserimento motivazione){' '}
                  </p>
                </div>
                <img src={FrecciaDown} alt='freccia' />
              </div>
              <div className='d-flex flex-column align-items-center'>
                <div
                  className={clsx(
                    'report-flow-container__bordered-box',
                    'd-flex ',
                    'flex-column',
                    'align-items-center'
                  )}
                >
                  <div
                    className={clsx(
                      'd-flex ',
                      'flex-row',
                      'justify-content-center',
                      'align-items-center',
                      'mb-2'
                    )}
                  >
                    <Icon icon='it-pencil' color='primary' className='mr-2' />
                    <span className='font-weight-bold primary-color'>
                      {' '}
                      MODIFICA{' '}
                    </span>
                  </div>
                  <p className='text-center'>
                    {' '}
                    per modificare il post (apre modale prevalorizzata in edit
                    mode){' '}
                  </p>
                </div>
                <img src={FrecciaDown} alt='freccia' />
              </div>
            </div>
            <p className='text-nowrap'>
              {' '}
              Queste azioni fanno scaturire una{' '}
              <strong> notifica all&apos;autore del post </strong>{' '}
              dell&apos;avvenuta moderazione.{' '}
            </p>
            {/* blocco 1 */}
            <div className='d-flex flex-row justify-content-center align-items-center my-4'>
              {possibleActions}
              <span className='font-weight-bold ml-1'> SUI COMMENTI </span>
            </div>
            <div className='d-flex flex-row'>
              <div className='d-flex flex-column align-items-center mr-3'>
                <div
                  className={clsx(
                    'report-flow-container__bordered-box',
                    'd-flex ',
                    'flex-column',
                    'align-items-center'
                  )}
                >
                  <div
                    className={clsx(
                      'd-flex ',
                      'flex-row',
                      'justify-content-center',
                      'align-items-center',
                      'mb-2'
                    )}
                  >
                    <Icon icon='it-delete' color='primary' className='mr-2' />
                    <span className='font-weight-bold primary-color'>
                      {' '}
                      ELIMINA{' '}
                    </span>
                  </div>
                  <p className='text-center'>
                    {' '}
                    per eliminare il commento (apre modale di conferma con
                    inserimento motivazione){' '}
                  </p>
                </div>
                <img src={FrecciaDown} alt='freccia' />
              </div>
              <div className='d-flex flex-column align-items-center'>
                <div
                  className={clsx(
                    'report-flow-container__bordered-box',
                    'd-flex ',
                    'flex-column',
                    'align-items-center'
                  )}
                >
                  <div
                    className={clsx(
                      'd-flex ',
                      'flex-row',
                      'justify-content-center',
                      'align-items-center',
                      'mb-2'
                    )}
                  >
                    <Icon icon='it-pencil' color='primary' className='mr-2' />
                    <span className='font-weight-bold primary-color'>
                      {' '}
                      MODIFICA{' '}
                    </span>
                  </div>
                  <p className='text-center'>
                    {' '}
                    per modificare il commento (apre modale prevalorizzata in
                    edit mode){' '}
                  </p>
                </div>
                <img src={FrecciaDown} alt='freccia' />
              </div>
            </div>
            <p className='text-nowrap'>
              {' '}
              Queste azioni fanno scaturire una{' '}
              <strong> notifica all&apos;autore del commento </strong>{' '}
              dell&apos;avvenuta moderazione.{' '}
            </p>
            {/* blocco 2 */}
          </>
        ));
      case 2:
        return (text = (
          <>
            <div className='d-flex justify-content-center mb-4'>
              <h1 className='h4'>
                {' '}
                <u>UTENTE IN LETTURA </u>{' '}
              </h1>
            </div>
            <div className='d-flex flex-row justify-content-center align-items-center mb-4'>
              {possibleActions}{' '}
              <span className='font-weight-bold ml-1'> SUL POST </span>
            </div>
            <div className='d-flex flex-row align-items-center'>
              <div
                className={clsx(
                  'report-flow-container__bordered-box',
                  'd-flex ',
                  'flex-column',
                  'align-items-center'
                )}
              >
                <div
                  className={clsx(
                    'd-flex ',
                    'flex-row',
                    'justify-content-center',
                    'align-items-center',
                    'mb-2'
                  )}
                >
                  <Icon icon='it-error' color='danger' className='mr-2' />
                  <span className='font-weight-bold primary-color'>
                    {' '}
                    SEGNALA{' '}
                  </span>
                </div>
                <p className='text-center'>
                  {' '}
                  per segnalare il post <br /> (apre modale prevalorizzata in
                  edit mode){' '}
                </p>
              </div>
              <img src={FrecciaRight} alt='freccia-dx' />
              <p className='text-center px-5 text-nowrap'>
                Questa azione fa scaturire una{' '}
                <strong>
                  {' '}
                  notifica al <br /> moderatore{' '}
                </strong>{' '}
                con la motivazione dell&apos;utente
              </p>
            </div>
            <div className='d-flex flex-row justify-content-center align-items-center my-4'>
              {possibleActions}
              <span className='font-weight-bold ml-1'> SUI COMMENTI </span>
            </div>
            <div className='d-flex flex-row align-items-center'>
              <div
                className={clsx(
                  'report-flow-container__bordered-box',
                  'd-flex ',
                  'flex-column',
                  'align-items-center'
                )}
              >
                <div
                  className={clsx(
                    'd-flex ',
                    'flex-row',
                    'justify-content-center',
                    'align-items-center',
                    'mb-2'
                  )}
                >
                  <Icon icon='it-error' color='danger' className='mr-2' />
                  <span className='font-weight-bold primary-color'>
                    {' '}
                    SEGNALA{' '}
                  </span>
                </div>
                <p className='text-center'>
                  {' '}
                  per segnalare il commento <br /> (apre modale prevalorizzata
                  in edit mode){' '}
                </p>
              </div>
              <img src={FrecciaRight} alt='freccia-dx' />
              <p className='text-center px-5 text-nowrap'>
                Questa azione fa scaturire una{' '}
                <strong>
                  {' '}
                  notifica al <br /> moderatore{' '}
                </strong>{' '}
                con la motivazione dell&apos;utente
              </p>
            </div>
          </>
        ));
      case 3:
        return (text = (
          <>
            <div className='d-flex justify-content-center mb-4'>
              <h1 className='h4'>
                {' '}
                <u> MODERATORE </u>{' '}
              </h1>
            </div>
            <div className='d-flex flex-column align-items-center'>
              <div
                className={clsx(
                  'report-flow-container__bordered-box',
                  'd-flex ',
                  'flex-column',
                  'align-items-center'
                )}
              >
                <p className='text-center pt-4 mt-3'>
                  {' '}
                  Il <strong> moderatore </strong> riceverà una notifica di
                  segnalazione.{' '}
                </p>
              </div>
              <img src={FrecciaDown} alt='freccia' />
              <p>
                Al click sulla notifica verrà indirizzato alla pagina di{' '}
                <strong> Gestione segnalazioni </strong>
              </p>
            </div>
            <p className='pb-3 pt-5'>
              <strong>Note:</strong>{' '}
              <em>
                La notifica di segnalazione sarà visibile anche nella pagina di
                gestione notifiche, con collegamento alla pagina di Gestione
                segnalazioni.
              </em>{' '}
            </p>
          </>
        ));
      case 4:
        return (text = (
          <>
            <div className='d-flex justify-content-center mb-4'>
              <h1 className='h4'>
                {' '}
                <u> MODERATORE </u>{' '}
              </h1>
            </div>
            <p className='mb-3'>
              {' '}
              La pagina di <strong> Gestione segnalazioni </strong> è una lista
              contenente tutte le segnalazioni che il moderatore ha ricevuto.
            </p>
            <div className='d-flex flex-row justify-content-center mb-4'>
              {possibleActions}
            </div>
            <div className='d-flex flex-row align-items-center mb-3'>
              <div
                className={clsx(
                  'report-flow-container__bordered-box',
                  'd-flex ',
                  'flex-column',
                  'align-items-center',
                  'pt-4'
                )}
              >
                <div
                  className={clsx(
                    'd-flex ',
                    'flex-row',
                    'justify-content-center',
                    'align-items-center',
                    'my-2'
                  )}
                >
                  <Icon icon='it-delete' color='primary' className='mr-2' />
                  <span className='font-weight-bold primary-color'>
                    {' '}
                    ELIMINA{' '}
                  </span>
                </div>
                <p className='text-center'> per eliminare la segnalazione </p>
              </div>
              <img src={FrecciaRight} alt='freccia-dx' />
              <p className='text-center px-5 text-nowrap'>
                il post o commento segnalati rimarranno <br /> visibili nella
                pagina di dettaglio
              </p>
            </div>
            <div className='d-flex flex-row align-items-center'>
              <div
                className={clsx(
                  'report-flow-container__bordered-box',
                  'd-flex ',
                  'flex-column',
                  'align-items-center'
                )}
              >
                <div
                  className={clsx(
                    'd-flex ',
                    'flex-row',
                    'justify-content-center',
                    'align-items-center',
                    'mb-2'
                  )}
                >
                  <span className='font-weight-bold primary-color'>
                    {' '}
                    VAI AL DETTAGLIO{' '}
                  </span>
                  <Icon
                    icon='it-chevron-right'
                    color='primary'
                    className='mr-2'
                  />
                </div>
                <p className='text-center'>
                  {' '}
                  per visualizzare il dettaglio del post/commento segnalato{' '}
                </p>
              </div>
              <img src={FrecciaRight} alt='freccia-dx' />
              <p className='text-center px-5 text-nowrap'>
                il moderatore atterra sul dettaglio del <br /> post/commento
                segnalato
              </p>
            </div>
          </>
        ));
      case 5:
        return (text = (
          <>
            <div className='d-flex flex-row justify-content-center align-items-center mb-4'>
              {possibleActions}{' '}
              <span className='font-weight-bold ml-1'> SUL POST </span>
            </div>
            <div className='d-flex flex-row'>
              <div className='d-flex flex-column align-items-center mr-3'>
                <div
                  className={clsx(
                    'report-flow-container__bordered-box',
                    'd-flex ',
                    'flex-column',
                    'align-items-center'
                  )}
                >
                  <div
                    className={clsx(
                      'd-flex ',
                      'flex-row',
                      'justify-content-center',
                      'align-items-center',
                      'mb-2'
                    )}
                  >
                    <Icon icon='it-delete' color='primary' className='mr-2' />
                    <span className='font-weight-bold primary-color'>
                      {' '}
                      ELIMINA{' '}
                    </span>
                  </div>
                  <p className='text-center'>
                    {' '}
                    per eliminare il post (apre modale di conferma con
                    inserimento motivazione){' '}
                  </p>
                </div>
                <img src={FrecciaDown} alt='freccia' />
              </div>
              <div className='d-flex flex-column align-items-center'>
                <div
                  className={clsx(
                    'report-flow-container__bordered-box',
                    'd-flex ',
                    'flex-column',
                    'align-items-center'
                  )}
                >
                  <div
                    className={clsx(
                      'd-flex ',
                      'flex-row',
                      'justify-content-center',
                      'align-items-center',
                      'mb-2'
                    )}
                  >
                    <Icon icon='it-pencil' color='primary' className='mr-2' />
                    <span className='font-weight-bold primary-color'>
                      {' '}
                      MODIFICA{' '}
                    </span>
                  </div>
                  <p className='text-center'>
                    {' '}
                    per modificare il post (apre modale prevalorizzata in edit
                    mode){' '}
                  </p>
                </div>
                <img src={FrecciaDown} alt='freccia' />
              </div>
            </div>
            <p className='text-nowrap'>
              {' '}
              Queste azioni fanno scaturire una{' '}
              <strong> notifica all&apos;autore del post </strong>{' '}
              dell&apos;avvenuta moderazione.{' '}
            </p>
            {/* blocco 1 */}
            <div className='d-flex flex-row justify-content-center align-items-center my-4'>
              {possibleActions}
              <span className='font-weight-bold ml-1'> SUI COMMENTI </span>
            </div>
            <div className='d-flex flex-row'>
              <div className='d-flex flex-column align-items-center mr-3'>
                <div
                  className={clsx(
                    'report-flow-container__bordered-box',
                    'd-flex ',
                    'flex-column',
                    'align-items-center'
                  )}
                >
                  <div
                    className={clsx(
                      'd-flex ',
                      'flex-row',
                      'justify-content-center',
                      'align-items-center',
                      'mb-2'
                    )}
                  >
                    <Icon icon='it-delete' color='primary' className='mr-2' />
                    <span className='font-weight-bold primary-color'>
                      {' '}
                      ELIMINA{' '}
                    </span>
                  </div>
                  <p className='text-center'>
                    {' '}
                    per eliminare il commento (apre modale di conferma con
                    inserimento motivazione){' '}
                  </p>
                </div>
                <img src={FrecciaDown} alt='freccia' />
              </div>
              <div className='d-flex flex-column align-items-center'>
                <div
                  className={clsx(
                    'report-flow-container__bordered-box',
                    'd-flex ',
                    'flex-column',
                    'align-items-center'
                  )}
                >
                  <div
                    className={clsx(
                      'd-flex ',
                      'flex-row',
                      'justify-content-center',
                      'align-items-center',
                      'mb-2'
                    )}
                  >
                    <Icon icon='it-pencil' color='primary' className='mr-2' />
                    <span className='font-weight-bold primary-color'>
                      {' '}
                      MODIFICA{' '}
                    </span>
                  </div>
                  <p className='text-center'>
                    {' '}
                    per modificare il commento (apre modale prevalorizzata in
                    edit mode){' '}
                  </p>
                </div>
                <img src={FrecciaDown} alt='freccia' />
              </div>
            </div>
            <p className='text-nowrap'>
              {' '}
              Queste azioni fanno scaturire una{' '}
              <strong> notifica all&apos;autore del commento </strong>{' '}
              dell&apos;avvenuta moderazione.{' '}
            </p>
            {/* blocco 2 */}
          </>
        ));
      case 6:
        return (text = (
          <>
            <div className='d-flex justify-content-center mb-4'>
              <h1 className='h4'>
                {' '}
                <u> AUTORE DEL CONTENUTO </u>{' '}
              </h1>
            </div>
            <div
              className={clsx(
                'report-flow-container__bordered-box',
                'd-flex ',
                'flex-column',
                'align-items-center'
              )}
            >
              <p className='text-center pt-4 mt-3'>
                {' '}
                <strong> L&apos;autore del contenuto </strong> riceverà una
                notifica di eliminazione o modifica del post/commento.{' '}
              </p>
            </div>
          </>
        ));
      default: {
        text;
      }
    }
  };

  return (
    <div className='report-flow-container report-flow-container__background'>
      <div className='report-flow-container__text-box'>
        <h1 className='pb-3 font-weight-bold h4'>{reportFlowPagesTitle()}</h1>
        <div className='pb-4'>{reportFlowPagesText()}</div>
        <div
          className={clsx(
            'd-flex',
            'flex-row',
            'justify-content-between',
            'panel-border'
          )}
        >
          <div>
            <div
              className={clsx(
                'd-flex',
                'flex-row',
                'align-items-center',
                'justify-content-end'
              )}
            >
              {currentStep > 0 ? (
                <>
                  <div>
                    <Icon
                      icon={DoubleChevronLeft}
                      size='xs'
                      aria-label='icona indietro'
                    />
                  </div>
                  <div>
                    <Button onClick={previousStep} className='button-text'>
                      INDIETRO
                    </Button>
                  </div>
                </>
              ) : null}
            </div>
          </div>
          <div
            className={clsx(
              'd-flex',
              'flex-row',
              'align-items-center',
              'justify-content-end'
            )}
          >
            {currentStep < 6 ? (
              <>
                <div>
                  <Button onClick={nextStep} className='button-text'>
                    PROSEGUI
                  </Button>
                </div>
                <div>
                  <Icon
                    icon={DoubleChevronRight}
                    size='xs'
                    aria-label='icona avanti'
                  />
                </div>
              </>
            ) : null}
          </div>
        </div>
      </div>

      <div
        className='report-flow-container__image'
        style={{ maxWidth: '66px', maxHeight: '88px' }}
      >
        <img src={ReportFlowIcon} alt='icona flusso segnalazione' />
      </div>
    </div>
  );
};

export default ReportFlowCard;
