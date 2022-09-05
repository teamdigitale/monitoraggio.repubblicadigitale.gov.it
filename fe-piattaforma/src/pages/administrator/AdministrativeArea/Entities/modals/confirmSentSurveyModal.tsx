import React from 'react';
import GenericModal from '../../../../../components/Modals/GenericModal/genericModal';
import { Icon } from 'design-react-kit';
import { closeModal, selectModalPayload } from '../../../../../redux/features/modal/modalSlice';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../../../../../redux/hooks';

const id = 'confirmSentSurveyModal';

const ConfirmSentSurveyModal: React.FC = () => {
  const dispatch = useDispatch();
  const payload = useAppSelector(selectModalPayload);

  return (
    <GenericModal
      id={id}
      primaryCTA={{
        label: 'Chiudi',
        onClick: () => dispatch(closeModal()),
      }}
      centerButtons
      onClose={() => dispatch(closeModal())}
    >
      <div className='d-flex flex-column justify-content-center'>
        <div className='d-flex justify-content-center mb-4'>
          <Icon
            icon='it-check-circle'
            style={{ width: '111px', height: '111px', fill: '#1F9C70' }}
            aria-label='Invio questionario confermato'
          />
        </div>
        <div className='text-center'>{payload?.text}</div>
      </div>
    </GenericModal>
  );
};

export default ConfirmSentSurveyModal;