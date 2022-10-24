import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
  closeModal,
  ModalPayloadI,
  selectModalId,
  selectModalPayload,
} from '../redux/features/modal/modalSlice';
import { useAppSelector } from '../redux/hooks';

interface withModalStateProps {
  closable?: boolean;
  onClose?: () => void;
  payload?: ModalPayloadI;
  title?: string;
  id?: string;
}

const withModalState =
  <P extends object>(
    Component: React.ComponentType<P>
  ): React.FC<P & withModalStateProps> =>
  // eslint-disable-next-line react/display-name
  (props: withModalStateProps) => {
    const { closable = false } = props;
    const dispatch = useDispatch();
    const payload = useAppSelector(selectModalPayload);
    const currentId = useAppSelector(selectModalId);

    const handleOnClose = () => {
      try {
        if (props.onClose) props.onClose();
      } catch (e) {
        console.log(e);
      } finally {
        if (closable) dispatch(closeModal());
      }
    };

    const manageEscListener = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleOnClose();
        if (!closable) dispatch(closeModal());
        window.removeEventListener('keyup', manageEscListener);
      }
    };

    useEffect(() => {
      if (props.id === currentId) {
        window.addEventListener('keyup', manageEscListener);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentId]);

    return (
      <Component
        {...(props as P)}
        onClose={handleOnClose}
        payload={{ ...payload, ...props.payload }}
      />
    );
  };

export default withModalState;
