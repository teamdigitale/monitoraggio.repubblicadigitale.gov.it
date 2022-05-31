import React from 'react';
import { useDispatch } from 'react-redux';
import { Alert, Icon } from 'design-react-kit';
import { useAppSelector } from '../../redux/hooks';
import {
  removeNotify,
  selectNotification,
} from '../../redux/features/notification/notificationSlice';
import clsx from 'clsx';

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

const NotificationHandler: React.FC = () => {
  const notification = useAppSelector(selectNotification);
  const dispatch = useDispatch();

  const handleCloseNotify = (id: string | number) => {
    dispatch(removeNotify({ id }));
  };

  if (!notification?.length) return null;

  return (
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
          className='position-relative'
          color={getColorByStatus(notify?.status)}
        >
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
    </div>
  );
};

export default NotificationHandler;
