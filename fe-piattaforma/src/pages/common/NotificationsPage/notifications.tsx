import { Button, Container, Icon } from 'design-react-kit';
import React, { memo, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { EmptySection, Paginator } from '../../../components';
import { selectDevice } from '../../../redux/features/app/appSlice';
import { selectEntityPagination } from '../../../redux/features/administrativeArea/administrativeAreaSlice';
import { useAppSelector } from '../../../redux/hooks';
import './notifications.scss';
import clsx from 'clsx';
import Input from '../../../components/Form/input';
import MailReadDark from '/public/assets/img/mail-open-dark.png';
import MailReadCheck from '/public/assets/img/mail-open-primary.png';
import DeleteCheck from '/public/assets/img/it-delete-primary.png';
import PillDropDown from '../../../components/PillDropDown/pillDropDown';
import Notification from './components/Notifications/notification';
import {
  selectUserNotification,
  selectUserNotificationToRead,
} from '../../../redux/features/user/userSlice';
import {
  DeleteNotification,
  GetNotificationsByUser,
  ReadNotification,
} from '../../../redux/features/user/userThunk';
import { setEntityPagination } from '../../../redux/features/administrativeArea/administrativeAreaSlice';
import {
  selectFilters,
  setForumFilters,
} from '../../../redux/features/forum/forumSlice';
import { getUnreadNotificationsCount } from '../../../utils/common';

const Notifications: React.FC = () => {
  const device = useAppSelector(selectDevice);
  const isMobile = device.mediaIsPhone;

  const notificationsList = useAppSelector(selectUserNotification);
  const notificationCounter = useAppSelector(selectUserNotificationToRead);
  const dispatch = useDispatch();
  const pagination = useAppSelector(selectEntityPagination);
  const { pageNumber, pageSize, totalPages } = pagination;
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>(
    []
  );
  const { sort } = useAppSelector(selectFilters);

  useEffect(() => {
    handleOnChangePage(1);
    getUnreadNotificationsCount(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    dispatch(GetNotificationsByUser());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNumber, pageSize, sort]);

  const handleOnChangePage = (pageNumber: number) => {
    dispatch(setEntityPagination({ pageNumber, pageSize }));
  };

  const onSelectAll = () => {
    if (
      notificationsList.every((notification) =>
        selectedNotifications.includes(notification.id)
      )
    ) {
      setSelectedNotifications([]);
    } else {
      setSelectedNotifications(
        notificationsList.map((notification) => notification.id)
      );
    }
  };

  const onDeleteSelected = async () => {
    await dispatch(DeleteNotification(selectedNotifications));
    setSelectedNotifications([]);
    dispatch(GetNotificationsByUser());
    getUnreadNotificationsCount(true);
  };

  const onReadSelected = async () => {
    await dispatch(ReadNotification(selectedNotifications));
    setSelectedNotifications([]);
    dispatch(GetNotificationsByUser());
    getUnreadNotificationsCount(true);
  };

  return (
    <>
      {isMobile ? (
        <>
          <div
            className={clsx(
              'mt-5',
              'justify-content-center',
              'align-items-end',
              'container'
            )}
          >
            <div className='title'>
              <h3 className='primary-color-a9 m-0'>
                Le mie notifiche
                {notificationCounter ? (
                  <span className='badge'>{notificationCounter}</span>
                ) : null}
              </h3>
            </div>
            <div className='container'>
              <PillDropDown isNotifications={true} />
            </div>
          </div>
          <div className='notifications-card-container d-flex container'>
            <div className={clsx('d-flex')}>
              <div className='d-flex'>
                <Button
                  disabled={selectedNotifications.length === 0}
                  onClick={onReadSelected}
                >
                  <Icon
                    icon={
                      selectedNotifications.length
                        ? MailReadCheck
                        : MailReadDark
                    }
                    size='sm'
                    aria-label='Segna come letto'
                    aria-hidden
                    className='mr-1'
                  />
                </Button>
              </div>
              <div className='d-flex'>
                <Button
                  disabled={selectedNotifications.length === 0}
                  onClick={onDeleteSelected}
                >
                  <Icon
                    icon={
                      selectedNotifications.length ? DeleteCheck : 'it-delete'
                    }
                    size='sm'
                    aria-label='Elimina'
                    aria-hidden
                    className='mr-1'
                  />
                </Button>
              </div>
            </div>

            <Input
              role='checkbox'
              className='notification-card-checkbar'
              type='checkbox'
              onInputChange={() => onSelectAll()}
              checked={notificationsList.every((notification) =>
                selectedNotifications.includes(notification.id)
              )}
              aria-label='checkbox per tutte le notifiche'
            />
          </div>
        </>
      ) : (
        <>
          <div className='d-flex justify-content-between align-items-end container'>
            <div className='title'>
              <h3 className='primary-color-a9 m-0'>
                Le mie notifiche
                {notificationCounter ? (
                  <span className='badge'>{notificationCounter}</span>
                ) : null}
              </h3>
            </div>
            <PillDropDown
              isNotifications={true}
              onChange={({ value }) =>
                dispatch(setForumFilters({ sort: [{ label: value, value }] }))
              }
            />
          </div>

          <div className='notifications-card-container container d-flex'>
            <Input
              role='checkbox'
              className='notification-card-checkbar'
              type='checkbox'
              onInputChange={() => onSelectAll()}
              checked={notificationsList.every((notification) =>
                selectedNotifications.includes(notification.id)
              )}
              aria-label='checkbox per tutte le notifiche'
            />
            <div className={clsx('d-flex')}>
              <Button
                className='d-flex align-items-center'
                disabled={selectedNotifications.length === 0}
                onClick={onReadSelected}
              >
                <Icon
                  icon={
                    selectedNotifications.length ? MailReadCheck : MailReadDark
                  }
                  size='sm'
                  aria-label='Segna come letto'
                  aria-hidden
                  className='mr-1'
                />
                <span
                  className={clsx(
                    selectedNotifications.length
                      ? 'text-primary-action'
                      : 'text-secondary-action'
                  )}
                >
                  Segna come già letto
                </span>
              </Button>

              <Button
                className='d-flex align-items-center'
                disabled={selectedNotifications.length === 0}
                onClick={onDeleteSelected}
              >
                <Icon
                  icon={
                    selectedNotifications.length ? DeleteCheck : 'it-delete'
                  }
                  size='sm'
                  aria-label='Elimina'
                  aria-hidden
                  className='mr-1'
                />
                <span
                  className={clsx(
                    selectedNotifications.length
                      ? 'text-primary-action'
                      : 'text-secondary-action'
                  )}
                >
                  Elimina
                </span>
              </Button>
            </div>
          </div>
        </>
      )}
      <Container className='pb-lg-5 pb-5'>
        {notificationsList?.length > 0 ? (
          (notificationsList || []).map((notification) => (
            <div
              key={notification.id}
              className={clsx(
                notification.status ? '' : 'notifications-card-unread'
              )}
            >
              <Notification
                {...notification}
                onSelect={(id: string) =>
                  setSelectedNotifications((prev) =>
                    prev.includes(id)
                      ? prev.filter((v) => v !== id)
                      : [...prev, id]
                  )
                }
                notificationsPreview={false}
                onClick={() => dispatch(ReadNotification([notification.id]))}
                isChecked={selectedNotifications.includes(notification.id)}
              />
            </div>
          ))
        ) : (
          <EmptySection title='Non ci sono notifiche' />
        )}
      </Container>
      {!isMobile && pageNumber && notificationsList?.length > 0 ? (
        <Paginator
          pageSize={pageSize}
          activePage={pageNumber}
          center
          total={totalPages}
          onChange={handleOnChangePage}
        />
      ) : null}
    </>
  );
};

export default memo(Notifications);
