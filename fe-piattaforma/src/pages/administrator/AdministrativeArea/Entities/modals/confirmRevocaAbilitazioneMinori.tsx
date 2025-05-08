import React from 'react';
import GenericModal from '../../../../../components/Modals/GenericModal/genericModal';
import { Icon } from 'design-react-kit';

const id = 'confirmRevocaAbilitazioneMinori';

interface ConfirmDeleteModalI {
  onConfirm: () => void;
  onClose: () => void;
  nomeProgramma: string;
}

const ConfirmRevocaAbilitazioneMinori: React.FC<ConfirmDeleteModalI> = (props) => {
  const { onConfirm, onClose, nomeProgramma } = props;

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
      <div className='d-flex flex-column justify-content-center m-5 '>
        <div className='d-flex justify-content-center mb-4'>
          <Icon
            icon='it-error'
            style={{ width: '111px', height: '111px', fill: '#FF9900' }}
            aria-label='Errore'
          />
        </div>
              <span className='text-center' style={{ fontSize: '1.25rem' }}>
                Il programma {nomeProgramma} non sarà abilitato a gestire i codici fiscali delle persone di minore età.<br />
                Potrà comunque essere abilitato in futuro.
              </span>
              <span className='text-center mt-3 mb-5' style={{ fontSize: '1.25rem' }}>
                Confermi di voler procedere?
              </span>
      </div>
    </GenericModal>
  );
};

export default ConfirmRevocaAbilitazioneMinori;