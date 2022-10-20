import {
  Button,
  Icon,
  DropdownMenu,
  LinkList,
  Dropdown,
  DropdownToggle,
} from 'design-react-kit';
import React, { memo, useEffect, useState } from 'react';
import './notification.scss';
import clsx from 'clsx';
import { useAppSelector } from '../../../../../redux/hooks';
import { selectDevice } from '../../../../../redux/features/app/appSlice';
import Input from '../../../../../components/Form/input';
import moment from 'moment';
import HeartIconRead from '/public/assets/img/it-heart.png'
import HeartIconUnread from '/public/assets/img/it-heart-white.png'
import CommentIconRead from '/public/assets/img/it-comment.png'
import CommentIconUnread from '/public/assets/img/it-comment-white.png'
import { getUserIdsFromNotification } from '../../../../../utils/common';
import { useDispatch } from 'react-redux';
import { getAnagraphicID, selectAnagraphics } from '../../../../../redux/features/anagraphic/anagraphicSlice';
export interface NotificationI {
  id?: string;
  date?: string;
  node_id?: string;
  node_bundle?: string;
  message?: string;
  status?: boolean;
  action?: string;
  onSelect?: (value: string) => void;
  notificationsPreview?: boolean;
  isChecked?: boolean;
  onClick?: () => void;
}

const Notification: React.FC<NotificationI> = (props) => {
  const {
    date,
    message,
    status = false,
    id,
    action,
    onSelect,
    notificationsPreview = true,
    isChecked = false,
    onClick = () => ({}),
  } = props;

  const [openUser, setOpenUser] = useState<boolean>(false);
  const dispatch = useDispatch()
  const usersAnagraphic = useAppSelector(selectAnagraphics)
  const [populatedMessage, setPopulatedMessage] = useState('')

  useEffect(() => {
    if (message) {
      const { userId, authorId } = getUserIdsFromNotification(message)
      if (userId) dispatch(getAnagraphicID({ id: userId }))
      if (authorId) dispatch(getAnagraphicID({ id: authorId }))
    }
  }, [message])


  useEffect(() => {
    if (usersAnagraphic && message) {
      const { userId, authorId } = getUserIdsFromNotification(message)
      const splittedMessage = message.split('$')
      if (userId)  splittedMessage[1] = usersAnagraphic[userId] ? `<span class=${status ? "name" : ""} >${usersAnagraphic[userId].nome} ${usersAnagraphic[userId].cognome}</span>` : ''
      if (authorId)  splittedMessage[3] = usersAnagraphic[authorId] ? `${usersAnagraphic[authorId].nome} ${usersAnagraphic[authorId].cognome}` : ''
      
      
      setPopulatedMessage(splittedMessage.join(''))
    }
  }, [usersAnagraphic])

  const onDelete = () => { }


  const getIconByAction = (action: string, status: boolean) => {
    switch (action) {
      case 'board_update':
      case 'community_update':
      case 'document_update':
      case 'comment_update':
        return 'it-file'
      case 'board_delete':
      case 'community_delete':
      case 'document_delete':
      case 'comment_delete':
        return 'it-delete'
      case 'board_like':
      case 'community_like':
      case 'document_like':
      case 'comment_like':
        return status ? HeartIconUnread : HeartIconRead
      case 'board_comment':
      case 'community_comment':
      case 'document_comment':
      case 'comment_reply':
        return status ? CommentIconUnread : CommentIconRead
      case 'board_report':
      case 'community_report':
      case 'document_report':
      case 'comment_report':
        return 'it-error'
      default:
        break;
    }
    return ''
  }

  const userDropDown = () => (
    <Dropdown
      className={clsx(
        'p-0',
        'header-container__top__user-dropdown',
        'd-flex',
        'justify-content-end',
        'notifications-list-container__more-items',
        status && 'notifications-list-container__more-items-unread'
      )}
      isOpen={openUser}
      toggle={() => setOpenUser(!openUser)}
    >
      <DropdownToggle
        caret
        className='complementary-1-color-a1 shadow-none btn-secondary-none bg-transparent'
      >
        <div className='d-flex notifications-list-container__more-items justify-content-end'>
          <Icon
            icon='it-more-items'
            size='lg'
            className='mr-2'
            color='primary'
          />
        </div>
      </DropdownToggle>
      <DropdownMenu role='menu' tag='ul'>
        <LinkList role='none'>
          <li role='none' className='d-flex align-items-center px-4'>
            <Button
              className={clsx(
                'primary-color-b1',
                'py-2',
                'w-100',
                'd-flex',
                'justify-content-between'
              )}
              role='menuitem'
              onClick={onClick}
            >
              <Icon
                className='pr-2'
                color='primary'
                icon='it-check-circle'
                size='sm'
              />
              Segna come letta
            </Button>
          </li>
        </LinkList>
      </DropdownMenu>
    </Dropdown>
  );

  const device = useAppSelector(selectDevice);
  const isMobile = device.mediaIsPhone;
  return (
    <div
      className={clsx(
        'd-flex',
        'flex-column',
        'notifications-list-container',
        'pt-3',
        status && 'notifications-list-container__unread'
      )}
    >
      <div className='d-flex justify-content-between align-items-center'>
        <div className='d-flex'>
          {!isMobile && !notificationsPreview ? (
            <Input
              className='notification-list-checkbar'
              type='checkbox'
              onInputChange={() => onSelect && id && onSelect(id)}
              checked={isChecked}
            />
          ) : null}
          <div
            className={clsx(
              'p-2',
              isMobile ? 'ml-2' : '',
              notificationsPreview && 'ml-3',
              status ? 'icon-unread' : 'icon-read'
            )}
          >
            <Icon
              icon={action ? getIconByAction(action, status) : 'it-box'}
              size="sm"
              style={{
                backgroundColor: `${status ? '#06c' : '#d1e7ff'}`
              }}
            />
          </div>
          <div
            className={clsx(
              isMobile
                ? 'd-flex flex-column ml-1'
                : 'd-flex flex-row justify-content-between notifications-list-container__text',
              notificationsPreview && 'ml-3'
            )}
          >
            <p className='neutral-1-color-a8' dangerouslySetInnerHTML={{ __html: populatedMessage }}>
            </p>
          </div>
        </div>
        {notificationsPreview ? (
          userDropDown()
        ) : isMobile ? (
          <div>
            <Input
              className='notification-list-checkbar'
              type='checkbox'
              onInputChange={() => onSelect && id && onSelect(id)}
              checked={isChecked}
            />
          </div>
        ) : (
          <div className='notifications-list-container__icon-close'>
            <Icon
              color='primary'
              icon='it-close'
              size='lg'
              onClick={onDelete}
            />
          </div>
        )}
      </div>
      <div
        className={clsx('d-flex', 'align-items-center', 'pl-5', 'pb-2', 'ml-4')}
      >
        <Icon icon='it-calendar' size='xs' color='primary' />
        <p className='neutral-1-color-a8 px-2 mr-4'>{moment(date).format('DD/MM/YYYY')}</p>
        <Icon icon='it-clock' size='xs' color='primary' />
        <p className='neutral-1-color-a8 px-2'>{moment(date).format('hh:mm')}</p>
      </div>
    </div>
  );
};

export default memo(Notification);
