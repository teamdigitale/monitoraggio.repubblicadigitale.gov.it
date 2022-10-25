import React from 'react';
/* import { useDispatch } from 'react-redux'; */
import GenericModal from '../GenericModal/genericModal';
import './rocketChatModal.scss';
/* import { closeModal } from '../../../redux/features/modal/modalSlice'; */
import RocketChat from '../../RocketChat/rocketChat';

const id = 'rocketChatModal';

const RocketChatModal = () => {
  /* const dispatch = useDispatch(); */

  /* const resetModal = () => {
    dispatch(closeModal());
  }; */

  return (
    <GenericModal
      id={id}
      title='Chat'
      /* onClose={resetModal}
      closable */
      isRocketChatModal
    >
      <div className='px-2'>
        <RocketChat />
      </div>
    </GenericModal>
  );
};

export default RocketChatModal;
