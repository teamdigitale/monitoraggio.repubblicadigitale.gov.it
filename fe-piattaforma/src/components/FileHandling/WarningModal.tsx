import GenericModal from '../Modals/GenericModal/genericModal';
import { Icon } from 'design-react-kit';
import React, { ReactNode } from 'react';

export default function WarningModal(props: {
  id: string;
  onConfirm: () => void;
  onClose: () => void;
  children: ReactNode;
  confirmLabel?: string;
}) {
  const confirmLabel = props.confirmLabel ?? 'Capisco e desidero proseguire';

  return (
    <GenericModal
      id={props.id}
      primaryCTA={{
        label: confirmLabel,
        onClick: props.onConfirm,
        buttonsClass: 'btn-modal-info',
      }}
      onClose={props.onClose}
      centerButtons
    >
      <div className='d-flex flex-column justify-content-center px-5 mb-4'>
        <div className='d-flex justify-content-center mb-4'>
          <Icon
            icon='it-error'
            style={{ width: '111px', height: '111px', fill: '#FF9900' }}
            aria-label='Errore'
            aria-hidden
          />
        </div>
        <div className='text-center'>{props.children}</div>
      </div>
    </GenericModal>
  );
}
