import React, { useEffect } from 'react';
import clsx from 'clsx';
import './notificationsPreview.scss';
import ClickOutside from '../../hoc/ClickOutside';
import { focusId, MenuItem } from '../../utils/common';
import { Button, Icon } from 'design-react-kit';
import Notification from '../../pages/common/NotificationsPage/components/Notifications/notification';
import { useAppSelector } from '../../redux/hooks';
import { selectUserNotification } from '../../redux/features/user/userSlice';

interface NotificationsPreviewProps {
  open: boolean;
  setOpen: (state: boolean) => void;
  menuRoutes: MenuItem[];
}

const NotificationsPreview: React.FC<NotificationsPreviewProps> = (props) => {
  const { open, setOpen } = props;

  // TODO integrate notification
  const notificationsList = useAppSelector(selectUserNotification);

  useEffect(() => {
    const body = document.querySelector('body') as HTMLBodyElement;
    if (open) {
      focusId('hamburger');
      body.style.overflowY = 'hidden';
    } else {
      body.style.overflowY = 'unset';
    }
  }, [open]);

  return (
    <ClickOutside callback={() => setOpen(false)}>
      <div className={clsx('notifications_nav', 'mr-2', !open && 'invisible')}>
        <div className={`notificationsNav ${open ? 'showNotifications' : ''}`}>
          <div
            className={clsx('px-0', 'py-0', 'd-flex', 'flex-column-reverse')}
            id='hamburger'
          >
            <div>
              <div
                className={clsx(
                  'd-flex',
                  'flex-row',
                  'align-items-center',
                  'justify-content-center',
                  'container',
                  'pt-4'
                )}
              >
                <h3
                  className={clsx('py-2', 'mb-2', 'primary-color-a9', 'pl-1')}
                >
                  Area notifiche
                </h3>
                <span className='badge-notifications'>
                  {
                    notificationsList.filter(
                      (notificationsList) => notificationsList.unread === true
                    ).length
                  }
                </span>
              </div>
              {notificationsList
                .map((notification, i) => (
                  <div key={i} role='button' className={clsx(!!notification.status && 'notifications-card-unread')}>
                    <Notification
                      // TODO update key with a unique value
                      {...notification}
                      notificationsPreview={true}
                    />
                  </div>
                ))}
              <a
                className='d-flex justify-content-center primary-color align-items-center pt-5'
                href='/notifiche'
              >
                ARCHIVIO NOTIFICHE ({notificationsList.length})
              </a>
            </div>
            <div className='pr-0'>
              <Button
                className={clsx('button-close-nav', 'pr-0', 'pt-0')}
                onClick={() => setOpen(false)}
                aria-hidden={!open}
              >
                <Icon
                  icon='it-close'
                  size=''
                  color='primary'
                  className={clsx(
                    'rounded-circle',
                    'mt-2',
                    'close_nav',
                    'white',
                    !open && 'd-none'
                  )}
                  aria-label='chiudi'
                />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </ClickOutside>
  );
};

export default NotificationsPreview;
