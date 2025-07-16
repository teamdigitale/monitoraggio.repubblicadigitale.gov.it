import React from 'react';
import GenericModal from '../../../components/Modals/GenericModal/genericModal';
import { Icon } from 'design-react-kit';
import { closeModal } from '../../../redux/features/modal/modalSlice';
import { useDispatch } from 'react-redux';

const id = 'AnnullaAssistenza';


const AnnullaAssistenzaModal: React.FC = () => {

    const dispatch = useDispatch();

    const onClose = () => {
        dispatch(closeModal());
    };

    const onConfirm = () => {
        window.close();
    };

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
      showCloseBtn={true}
    >
      <div className='d-flex flex-column justify-content-center align-items-center m-5 text-center'>
        <div className='d-flex justify-content-center mb-4'>
            <Icon
            icon='it-error'
            style={{ width: '111px', height: '111px', fill: '#FF9900' }}
            aria-label='Errore'
            />
        </div>

        <p className="mb-3 fs-5">
            Confermi di voler uscire dalla richiesta di assistenza tecnica?
        </p>
        <p>
            I dati inseriti verranno cancellati
        </p>
        </div>

    </GenericModal>
  );
};

export default AnnullaAssistenzaModal;