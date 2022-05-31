import React from 'react';
import GenericModal from '../../../../../components/Modals/GenericModal/genericModal';
import { Icon } from 'design-react-kit';

const id = 'confirmDeleteModal';

interface ConfirmDeleteModalI {
  onConfirm: () => void;
  onClose: () => void;
  text: string;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalI> = (props) => {
  const { onConfirm, onClose, text } = props;

  return (
    <GenericModal
      id={id}
      primaryCTA={{
        label: 'Conferma',
        onClick: onConfirm,
      }}
      secondaryCTA={{
        label: 'Annulla',
        onClick: onClose,
      }}
      centerButtons
      onClose={onClose}
    >
      <div className='d-flex flex-column justify-content-center'>
        <div className='d-flex justify-content-center mb-4'>
          <Icon
            icon='it-error'
            style={{ width: '111px', height: '111px', fill: '#FF9900' }}
            aria-label='Errore'
          />
        </div>
        <div className='text-center'>{text}</div>
      </div>
    </GenericModal>
  );
};

export default ConfirmDeleteModal;
