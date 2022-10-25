import React, { ReactElement } from 'react';
import { useAppSelector } from '../../redux/hooks';
import ModalsPortal from './modalsPortal';
import {
  selectExpandModal,
  selectModalId,
} from '../../redux/features/modal/modalSlice';
import Curtain from '../Curtain/curtain';
import clsx from 'clsx';
import FocusTrap from 'focus-trap-react';
import { selectDevice } from '../../redux/features/app/appSlice';

interface ModalI {
  id: string;
  children: ReactElement[];
  onClose?: () => void;
  isRoleManaging?: boolean;
  isUserRole?: boolean;
  className?: string | undefined;
  isRocketChatModal?: boolean;
}

const Modal: React.FC<ModalI> = (props) => {
  const { id, children, onClose, isRoleManaging, isRocketChatModal } = props;
  const currentId = useAppSelector(selectModalId);
  const expandedModal = useAppSelector(selectExpandModal);

  const handleCloseModal = () => {
    if (onClose) onClose();
  };

  const device = useAppSelector(selectDevice);

  const isMobile = device.mediaIsPhone || device.mediaIsTablet;

  return currentId === id ? (
    <ModalsPortal.Source>
      <Curtain open noscroll onClick={handleCloseModal} />
      <FocusTrap focusTrapOptions={{ allowOutsideClick: true }}>
        <div
          className={clsx(
            'd-flex',
            'justify-content-around',
            isMobile && 'mt-3'
          )}
        >
          <div
            className={clsx(
              'modal-wrapper',
              'd-flex',
              'm-auto',
              'align-items-center',
              'justify-content-center',
              'position-fixed',
              isRoleManaging && isMobile
                ? 'h-100 w-100 py-5 px-4 rounded'
                : isMobile && 'h-100 w-100',
              !isMobile && 'h-75',
              !isMobile && 'modal-dialog-centered'
            )}
            style={{ width: isRocketChatModal ? '95%' : '' }}
          >
            <div
              className={clsx(
                'modal-content',
                isRoleManaging && isMobile
                  ? 'h-100'
                  : isMobile
                  ? 'h-100 pt-5'
                  : expandedModal
                  ? 'user-role-modal'
                  : isRocketChatModal
                  ? 'mt-5'
                  : 'h-auto'
              )}
              style={{ width: isRocketChatModal ? '95%' : '' }}
            >
              {children}
            </div>
          </div>
        </div>
      </FocusTrap>
    </ModalsPortal.Source>
  ) : null;
};

export default Modal;
