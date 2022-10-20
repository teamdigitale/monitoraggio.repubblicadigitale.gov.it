import { Button, Container, Icon } from 'design-react-kit';
import React, { memo, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Paginator } from '../../../components';
import PageTitle from '../../../components/PageTitle/pageTitle';
import { selectDevice } from '../../../redux/features/app/appSlice';
import { selectEntityPagination } from '../../../redux/features/citizensArea/citizensAreaSlice';
import { useAppSelector } from '../../../redux/hooks';
import './notifications.scss';
import clsx from 'clsx';
import Input from '../../../components/Form/input';
import MailRead from '/public/assets/img/mail-open.png';
import MailReadCheck from '/public/assets/img/mail-open-check.png';
import Delete from '/public/assets/img/delete.png';
import DeleteCheck from '/public/assets/img/delete-check.png';
import PillDropDown from '../../../components/PillDropDown/pillDropDown';
import Notification from './components/Notifications/notification';
import { selectUser, selectUserNotification } from '../../../redux/features/user/userSlice';
import { GetNotificationsByUser } from '../../../redux/features/user/userThunk';

const Notifications: React.FC = () => {
  const device = useAppSelector(selectDevice);
  const isMobile = device.mediaIsPhone;

  // TODO integrate notification
  const notificationsList = useAppSelector(selectUserNotification);
  const userId = useAppSelector(selectUser)?.id
  const dispatch = useDispatch();
  const pagination = useAppSelector(selectEntityPagination);
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);

  useEffect(() => {
    userId && dispatch(GetNotificationsByUser(userId))
  }, [userId])

  // const handleOnChangePage = (pageNumber: number = pagination?.pageNumber) => {
  //   dispatch(setEntityPagination({ pageNumber }));
  // };
  // useEffect(() => {
  //   dispatch(setEntityPagination({ pageSize: 3 }));
  // }, []);

  const onSelectAll = () => {
    if (notificationsList.every(notification => selectedNotifications.includes(notification.id))) {
      setSelectedNotifications([])
    } else {
      setSelectedNotifications(notificationsList.map(notification => notification.id))
    }
  }

  const onDeleteSelected = () => {

  }

  const onReadSelected = () => { }

  return (
    <>
      {isMobile ? (
        <>
          <div className={clsx('mt-5', 'justify-content-center', 'container')}>
            <PageTitle title='Le Tue Notifiche' badge={true} />
            <div className='container'>
              <PillDropDown isNotifications={true} />
            </div>
          </div>
          <div className='notifications-card-container d-flex container'>
            <div className={clsx('d-flex')}>
              <div className='d-flex'>
                <Button

                  onClick={onReadSelected}
                >
                  <Icon
                    icon={selectedNotifications.length ? MailReadCheck : MailRead}
                    size='sm'
                    aria-label='Segna come letto'
                    className='mr-1'
                  />
                </Button>
              </div>
              <div className='d-flex'>
                <Button
                  onClick={onDeleteSelected}
                >
                  <Icon
                    icon={selectedNotifications.length ? DeleteCheck : Delete}
                    size='sm'
                    aria-label='Elimina'
                    className='mr-1'
                  />
                </Button>
              </div>
            </div>
            <Input
              className='notification-card-checkbar'
              type='checkbox'
              onInputChange={() => onSelectAll()}
              checked={notificationsList.every(notification => selectedNotifications.includes(notification.id))}
            />
          </div>
        </>
      ) : (
        <>
          <div className='d-flex justify-content-between container'>
            <PageTitle title='Le Tue Notifiche' badge={true} />
            <PillDropDown isNotifications={true} />
          </div>
          
            <div className='notifications-card-container container d-flex'>
              <Input
                className='notification-card-checkbar'
                type='checkbox'
                onInputChange={() => onSelectAll()}
                checked={notificationsList.every(notification => selectedNotifications.includes(notification.id))}
              />
              <div className={clsx('d-flex')}>
                <Button
                  className='d-flex align-items-center'
                  onClick={onReadSelected}
                >
                  <Icon
                    icon={selectedNotifications.length ? MailReadCheck : MailRead}
                    size='sm'
                    aria-label='Segna come letto'
                    className='mr-1'
                  />

                  <span className={clsx(selectedNotifications.length ? 'text-primary-action' : 'text-secondary-action')}>Segna come già letto</span>
                </Button>

                <Button
                  className='d-flex align-items-center'
                  onClick={onDeleteSelected}
                >
                  <Icon
                    icon={selectedNotifications.length ? DeleteCheck : Delete}
                    size='sm'
                    aria-label='Elimina'
                    className='mr-1'
                  />

                  <span className={clsx(selectedNotifications.length ? 'text-primary-action' : 'text-secondary-action')}>Elimina</span>
                </Button>
              </div>
            </div>
        </>
      )}
      <Container className='pb-lg-5 pb-5'>{notificationsList
        .map((notification, i) => (
          <div key={i} role='button' className={clsx(!!notification.status && 'notifications-card-unread')}>
            <Notification
              // TODO update key with a unique value
              {...notification}
              onSelect={(id: string) => setSelectedNotifications(prev => prev.includes(id) ? prev.filter(v => v !== id) : [...prev, id])}
              notificationsPreview={false}
              isChecked={selectedNotifications.includes(notification.id)}
            />
          </div>
        ))}</Container>
      {!isMobile && pagination?.pageNumber ? (
        <Paginator
          pageSize={notificationsList.length}
          activePage={pagination?.pageNumber}
          center
          refID='#notification'
          total={pagination.pageNumber}
        // onChange={handleOnChangePage}
        />
      ) : null}
    </>
  );
};

export default memo(Notifications);
