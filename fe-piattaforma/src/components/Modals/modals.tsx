import React, { ReactElement } from 'react';
import { useAppSelector } from '../../redux/hooks';
import ModalsPortal from './modalsPortal';
import { selectModalId } from '../../redux/features/modal/modalSlice';
import Curtain from '../Curtain/curtain';
import clsx from 'clsx';
import FocusTrap from 'focus-trap-react';
import { selectDevice } from '../../redux/features/app/appSlice';

interface ModalI {
  id: string;
  children: ReactElement[];
  onClose?: () => void;
}

const Modal: React.FC<ModalI> = (props) => {
  const { id, children, onClose } = props;
  const currentId = useAppSelector(selectModalId);

  const handleCloseModal = () => {
    if (onClose) onClose();
  };

  const device = useAppSelector(selectDevice);

  const isMobile = device.mediaIsPhone || device.mediaIsTablet;

  return currentId === id ? (
    <ModalsPortal.Source>
      <Curtain open noscroll onClick={handleCloseModal} />
      <FocusTrap>
        <div
          className={clsx(
            isMobile
              ? 'd-flex justify-content-around'
              : 'd-flex justify-content-around mt-3'
          )}
        >
          <div
            className={clsx(
              'modal-wrapper',
              'd-flex',
              'm-auto',
              'align-items-center',
              'justify-content-center',
              !isMobile && 'h-75',
              isMobile && 'h-100',
              isMobile && 'w-100',
              'position-fixed',
              !isMobile && 'modal-dialog-centered',
              !isMobile && 'mt-4'
            )}
          >
            <div
              className={clsx('modal-content', isMobile ? 'h-100' : 'h-auto')}
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
