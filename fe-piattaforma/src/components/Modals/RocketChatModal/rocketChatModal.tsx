import React from 'react';
import { useDispatch } from 'react-redux';
import { Button, Icon } from 'design-react-kit';
import './rocketChatModal.scss';
import RocketChat from '../../RocketChat/rocketChat';
import { useAppSelector } from '../../../redux/hooks';
import {
  closeModal,
  selectModalId,
} from '../../../redux/features/modal/modalSlice';
import clsx from 'clsx';
import { selectDevice } from '../../../redux/features/app/appSlice';

const id = 'rocketChatModal';

const RocketChatModal = () => {
  const currentId = useAppSelector(selectModalId);
  const dispatch = useDispatch();
  const device = useAppSelector(selectDevice);

  const isMobile = device.mediaIsPhone || device.mediaIsTablet;

  const resetModal = () => {
    dispatch(closeModal());
  };

  return (
    <div
      className={clsx('rocketchat-modal', 'position-fixed', 'w-100')}
      style={{ display: currentId === id ? 'block' : 'none' }}
    >
      <div
        className={clsx('curtain-wrapper', 'position-fixed', 'w-100', 'h-100')}
        role='dialog'
        aria-label='Curtain modale'
      >
        <div className={clsx('d-flex', 'justify-content-around')}>
          <div
            className={clsx(
              'modal-wrapper',
              'd-flex',
              'm-auto',
              'align-items-center',
              'justify-content-center',
              'position-fixed',
              isMobile && 'h-100 w-100',
              !isMobile && 'h-75',
              !isMobile && 'modal-dialog-centered'
            )}
            style={{ width: !isMobile ? '95%' : 'unset' }}
          >
            <div className={clsx('modal-content', isMobile && 'h-100 pt-5')}>
              <Button
                onClick={resetModal}
                className='close-button align-self-end'
              >
                <Icon
                  color='primary'
                  icon='it-close-big'
                  size='sm'
                  aria-label='chiudi'
                />
              </Button>
              <div className='px-2'>
                <RocketChat />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RocketChatModal;
