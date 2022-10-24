import React, { useState } from 'react';
import GenericModal from '../../../../Modals/GenericModal/genericModal';
import OTPIconFrame from '/public/assets/img/otp-icon-frame.png';
import clsx from 'clsx';
import InputOTP from '../../../../General/InputOTP/InputOTP';

type StepType = 'sms-send' | 'otp-check';

const ManageOTP = () => {
  const [stepOTP, setSetOTP] = useState<StepType>('sms-send');

  // This two function need to be modified when AWS Pinpoint is integrated
  const onSentSMS = () => {
    setSetOTP('otp-check');
  };

  const onSubmitCode = () => {
    console.log('Code submit');
  };

  let content = null;
  let label = '';

  // This switch manage what to show in the modal when step change
  switch (stepOTP) {
    case 'sms-send':
      label = 'Invia SMS';
      content = (
        <>
          <p
            className={clsx(
              'h6',
              'font-weight-semibold',
              'mx-5',
              'text-lg-nowrap'
            )}
          >
            Completa la procedura di consenso al trattamento dei dati personali.
          </p>
          <p
            className={clsx(
              'h6',
              'font-weight-semibold',
              'mx-5',
              'text-lg-nowrap'
            )}
          >
            Il codice OTP sarà inviato al numero che hai indicato
          </p>
          <p className='my-3 h6'>+39 123456789</p>
        </>
      );
      break;
    case 'otp-check':
      label = 'Conferma';
      content = (
        <>
          <p className={clsx('h6', 'font-weight-semibold', 'mx-5', 'mb-5')}>
            Inserisci il codice OTP pr verifica
          </p>

          <InputOTP />

          <p className={clsx('h6', 'font-weight-light', 'mx-5', 'mt-5')}>
            Non hai ricevuto l SMS?
            <u className='font-weight-semibold'> Invia di nuovo </u>
          </p>
        </>
      );
      break;
    default:
      break;
  }

  return (
    <div className='d-flex flex-column aling-items-center'>
      <GenericModal
        id='OTPModal'
        title='Invia SMS'
        primaryCTA={{
          label: label,
          onClick: stepOTP === 'sms-send' ? onSentSMS : onSubmitCode,
        }}
        withIcon
        icon={OTPIconFrame}
        centerButtons
      >
        <div
          className={clsx(
            'h-100',
            'd-flex',
            'flex-wrap',
            'flex-column',
            'w-auto',
            'text-center',
            'justify-content-center',
            'align-items-center',
            'mx-3',
            'mx-lg-4',
            'px-lg-3',
            'mx-md-5',
            'px-md-4',
            'mx-sm-5',
            'px-sm-4'
          )}
        >
          {content}
        </div>
      </GenericModal>
    </div>
  );
};

export default ManageOTP;
