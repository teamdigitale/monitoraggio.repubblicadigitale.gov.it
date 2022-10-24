import React from 'react';
import ReactDOM from 'react-dom';
import { useDispatch } from 'react-redux';
import { Alert, Icon } from 'design-react-kit';
import clsx from 'clsx';
import { useAppSelector } from '../../redux/hooks';
import {
  removeNotify,
  selectNotification,
} from '../../redux/features/notification/notificationSlice';

const getColorByStatus = (status: string | undefined) => {
  switch (status) {
    case 'message':
    default:
      return 'info';
    case 'error':
      return 'danger';
    case 'warning':
      return 'warning';
    case 'success':
      return 'success';
  }
};

const ToastNotifications: React.FC = () => {
  const notification = useAppSelector(selectNotification);
  const dispatch = useDispatch();
  const body = document.getElementsByTagName('body')[0];

  const handleCloseNotify = (id?: string | number) => {
    dispatch(removeNotify({ id }));
  };

  if (!notification?.length) return null;

  return ReactDOM.createPortal(
    <div
      className={clsx(
        'notification-handler-container',
        'd-inline-flex',
        'flex-column',
        'justify-content-end',
        'w-100',
        'position-fixed',
        'pr-2'
      )}
    >
      {notification.map((notify) => (
        <Alert
          key={notify?.id}
          className='notify-card position-relative'
          color={getColorByStatus(notify?.status)}
        >
          {notify?.title ? <p><strong>{notify?.title}</strong></p> : null}
          {notify?.message}
          {notify?.closable ? (
            <Icon
              className='icon-close position-absolute'
              icon='it-close'
              aria-label='Chiudi notifica'
              onClick={() => (notify?.id ? handleCloseNotify(notify.id) : null)}
            />
          ) : null}
        </Alert>
      ))}
    </div>,
    body
  );
};

export default ToastNotifications;
