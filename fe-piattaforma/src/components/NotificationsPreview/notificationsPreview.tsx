import React, { useEffect } from 'react';
import ReactDOM from 'react-dom'
import clsx from 'clsx';
import './notificationsPreview.scss';
import ClickOutside from '../../hoc/ClickOutside';
import { focusId, MenuItem } from '../../utils/common';
import { Button, Icon } from 'design-react-kit';
import Notification from '../../pages/common/NotificationsPage/components/Notifications/notification';
import { useAppSelector } from '../../redux/hooks';
import { selectUserNotificationsPreview } from '../../redux/features/user/userSlice';
import { NavLink } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  GetNotificationsByUser,
  ReadNotification,
} from '../../redux/features/user/userThunk';
import EmptySection from '../EmptySection/emptySection';

interface NotificationsPreviewProps {
  open: boolean;
  setOpen: (state: boolean) => void;
  menuRoutes: MenuItem[];
}

const NotificationsPreview: React.FC<NotificationsPreviewProps> = (props) => {
  const { open, setOpen } = props;
  const dispatch = useDispatch();
  // TODO integrate notification
  const notificationsList = useAppSelector(selectUserNotificationsPreview);

  const body = document.getElementsByTagName('body')[0];

  useEffect(() => {
    const body = document.querySelector('body') as HTMLBodyElement;
    if (open) {
      focusId('hamburger');
      body.style.overflowY = 'hidden';
      dispatch(
        GetNotificationsByUser(
          { status: [{ value: 0 }], items_per_page: [{ value: 9 }], page: [{ value: 0 }], sort: [{ value: 'created_desc' }] },
          true
        )
      );
    } else {
      body.style.overflowY = 'unset';
    }
  }, [open]);

  const onReadNotification = async (id: string) => {
    await dispatch(ReadNotification([id]));
    dispatch(
      GetNotificationsByUser(
        { status: [{ value: 0 }], items_per_page: [{ value: 9 }], page: [{ value: 0 }], sort: [{ value: 'created_desc' }] },
        true
      )
    );
  };

  return ReactDOM.createPortal(
    <ClickOutside callback={() => setOpen(false)}>
      <div className={clsx('notifications-preview', open && 'open')}>
        <div className='shadow'>
          <div className='w-100 d-flex justify-content-end'>
            <Button onClick={() => setOpen(false)} className='p-0'>
              <Icon icon='it-close' />
            </Button>
          </div>
          <div className='preview-header'>
            <h3 className='primary-color-a9'>
              Area notifiche
              {/*<span className='badge'>
                {
                  notificationsList.filter(
                    (notification) => !notification.status
                  ).length
                }
              </span>*/}
            </h3>
          </div>
        </div>
        <div className='notifications-list'>
          {notificationsList?.length > 0 ? (
            notificationsList.map((notification, i) => (
              <div
                key={i}
                className={clsx(
                  notification.status ? '' : 'notifications-card-unread'
                )}
              >
                <Notification
                  // TODO update key with a unique value
                  {...notification}
                  notificationsPreview={true}
                  onClick={() => onReadNotification(notification.id)}
                />
              </div>
            ))
          ) : (
            <EmptySection title='Non ci sono notifiche' />
          )}
        </div>
        <div className='text-center py-3 top-shadow'>
          <NavLink to='/notifiche' className='primary-color archive' onClick={() => setOpen(false)}>
            ARCHIVIO NOTIFICHE
            {/*{notificationsList.length}*/}
          </NavLink>
        </div>
      </div>
    </ClickOutside>,
    body
  );

  // return (
  //   <ClickOutside callback={() => setOpen(false)}>
  //     <div className={clsx('notifications_nav', 'mr-2', !open && 'invisible')}>
  //       <div className={`notificationsNav ${open ? 'showNotifications' : ''}`}>
  //         <div
  //           className={clsx('px-0', 'py-0', 'd-flex', 'flex-column-reverse')}
  //           id='hamburger'
  //         >
  //           <div  className='d-flex flex-column' style={{ height: '100%' }}>
  //             <div
  //               className={clsx(
  //                 'd-flex',
  //                 'flex-row',
  //                 'align-items-center',
  //                 'justify-content-center',
  //                 'container',
  //                 'pt-4'
  //               )}
  //             >
  //               <h3
  //                 className={clsx('py-2', 'mb-2', 'primary-color-a9', 'pl-1')}
  //               >
  //                 Area notifiche
  //               </h3>
  //               <span className='badge-notifications'>
  //                 {
  //                   notificationsList.filter(
  //                     (notificationsList) => !notificationsList.status
  //                   ).length
  //                 }
  //               </span>
  //             </div>
  //             <div style={{ flexGrow: '1', overflow: 'hidden' }}>
  //             {notificationsList
  //               .map((notification, i) => (
  //                 <div key={i} role='button' className={clsx(!!notification.status && 'notifications-card-unread')}>
  //                   <Notification
  //                     // TODO update key with a unique value
  //                     {...notification}
  //                     notificationsPreview={true}
  //                   />
  //                 </div>
  //               ))}
  //             </div>
  //             <a
  //               className='d-flex justify-content-center primary-color align-items-center pt-5'
  //               href='/notifiche'
  //             >
  //               ARCHIVIO NOTIFICHE ({notificationsList.length})
  //             </a>
  //           </div>
  //           <div className='pr-0'>
  //             <Button
  //               className={clsx('button-close-nav', 'pr-0', 'pt-0')}
  //               onClick={() => setOpen(false)}
  //               aria-hidden={!open}
  //             >
  //               <Icon
  //                 icon='it-close'
  //                 size=''
  //                 color='primary'
  //                 className={clsx(
  //                   'rounded-circle',
  //                   'mt-2',
  //                   'close_nav',
  //                   'white',
  //                   !open && 'd-none'
  //                 )}
  //                 aria-label='chiudi'
  //               />
  //             </Button>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   </ClickOutside>
  // );
};

export default NotificationsPreview;
