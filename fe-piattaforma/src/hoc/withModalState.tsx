import React from 'react';
import { useDispatch } from 'react-redux';
import {
  closeModal,
  ModalPayloadI,
  selectModalPayload,
} from '../redux/features/modal/modalSlice';
import { useAppSelector } from '../redux/hooks';

interface withModalStateProps {
  closable?: boolean;
  onClose?: () => void;
  payload?: ModalPayloadI;
  title?: string;
}

const withModalState =
  <P extends object>(
    Component: React.ComponentType<P>
  ): React.FC<P & withModalStateProps> =>
  // eslint-disable-next-line react/display-name
  (props: withModalStateProps) => {
    const { closable = true } = props;
    const dispatch = useDispatch();
    const payload = useAppSelector(selectModalPayload);

    const handleOnClose = () => {
      try {
        if (props.onClose) props.onClose();
      } catch (e) {
        console.log(e);
      } finally {
        if (closable) dispatch(closeModal());
      }
    };

    return (
      <Component
        {...(props as P)}
        onClose={handleOnClose}
        payload={{ ...payload, ...props.payload }}
      />
    );
  };

export default withModalState;
