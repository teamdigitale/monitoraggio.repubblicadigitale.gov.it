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
import { getUserIdsFromNotification } from '../../../../../utils/common';
import { useDispatch } from 'react-redux';
import {
  getAnagraphicID,
  selectAnagraphics,
} from '../../../../../redux/features/anagraphic/anagraphicSlice';
import NotificationIcon from './NotificationIcon/NotificationIcon';
import {
  DeleteNotification,
  GetNotificationsByUser,
} from '../../../../../redux/features/user/userThunk';
import DeleteCheck from '/public/assets/img/delete-check.png';

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
    action = '',
    // node_id = '',
    // node_bundle = '',
    onSelect,
    notificationsPreview = true,
    isChecked = false,
    onClick = () => ({}),
  } = props;

  const device = useAppSelector(selectDevice);
  const isMobile = device.mediaIsPhone;
  const [openUser, setOpenUser] = useState<boolean>(false);
  const dispatch = useDispatch();
  const usersAnagraphic = useAppSelector(selectAnagraphics);
  const [populatedMessage, setPopulatedMessage] = useState('');
  // const navigate = useNavigate()

  useEffect(() => {
    if (message) {
      const { userId, authorId } = getUserIdsFromNotification(message);
      if (userId) dispatch(getAnagraphicID({ id: userId }));
      if (authorId) dispatch(getAnagraphicID({ id: authorId }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [message]);

  useEffect(() => {
    if (usersAnagraphic && message) {
      const { userId, authorId } = getUserIdsFromNotification(message);
      const splittedMessage = message.split('$');
      if (userId)
        splittedMessage[1] = usersAnagraphic[userId]
          ? `<span style=${status ? '' : 'color:#06c;font-weight:600;'} >${
              usersAnagraphic[userId].nome
            } ${usersAnagraphic[userId].cognome}</span>`
          : '';
      if (authorId)
        splittedMessage[3] = usersAnagraphic[authorId]
          ? `${usersAnagraphic[authorId].nome} ${usersAnagraphic[authorId].cognome}`
          : '';
      setPopulatedMessage(splittedMessage.join(''));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usersAnagraphic]);

  const onDelete = async () => {
    id && (await dispatch(DeleteNotification([id])));
    dispatch(GetNotificationsByUser());
  };

  // const onNavigateToItem = () => {
  //   switch (node_bundle) {
  //     case 'board_item':
  //       navigate(`/bacheca/${node_id}`)
  //       break;
  //     case 'community_item':
  //       navigate(`/community/${node_id}`)
  //       break
  //     case 'document_item':
  //       navigate(`/documenti/${node_id}`)
  //       break;
  //     default:
  //       break;
  //   }
  // }

  const userDropDown = (
    <Dropdown
      className='ml-auto'
      isOpen={openUser}
      toggle={() => setOpenUser(!openUser)}
    >
      <DropdownToggle
        caret
        className='complementary-1-color-a1 shadow-none btn-secondary-none bg-transparent p-0'
        style={{
          border: 'none',
        }}
        onClick={(e) => e.stopPropagation()}
        aria-label=''
      >
        <Icon
          icon='it-more-items'
          size=''
          color='primary'
          aria-label='menu azioni delle notifiche'
        />
      </DropdownToggle>
      <DropdownMenu role='menu' tag='ul'>
        <LinkList role='list'>
          <li role='none' className='d-flex align-items-center px-4'>
            <Button
              className={clsx(
                'primary-color-b1',
                'p-0',
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
                aria-label='conferma'
                aria-hidden
              />
              <span>Segna come letta</span>
            </Button>
          </li>
        </LinkList>
      </DropdownMenu>
    </Dropdown>
  );

  return (
    <div
    // className={clsx(
    //   'd-flex',
    //   'flex-column',
    //   'notifications-list-container',
    //   'pt-3',
    //   status && 'notifications-list-container__unread'
    // )}
    >
      <div
        className={clsx(
          `notifications-list-container`,
          !status && 'unread',
          isMobile && !notificationsPreview && 'reverse'
        )}
        // onClick={() => onNavigateToItem()}
      >
        {/* className='d-flex justify-content-between align-items-center'> */}

        {!notificationsPreview ? (
          <div
            className='d-flex align-items-center justify-content-center mr-2'
            style={{
              width: '48px',
              height: '48px',
            }}
          >
            <Input
              id={id}
              role='checkbox'
              className='notification-list-checkbar'
              type='checkbox'
              onClick={(e) => e.stopPropagation()}
              onInputChange={() => onSelect && id && onSelect(id)}
              checked={isChecked}
              aria-label='checkbox della notifica'
            />
          </div>
        ) : null}
        <div>
          <div className='d-flex align-items-center'>
            <NotificationIcon status={status} action={action} />
            <p
              className='neutral-1-color-a8 pl-3'
              dangerouslySetInnerHTML={{ __html: populatedMessage }}
            />
          </div>
          <div
            style={{
              marginLeft: '40px',
            }}
            className={clsx('d-flex', 'align-items-center', 'pl-3')}
          >
            <Icon
              icon='it-calendar'
              size='xs'
              color='primary'
              aria-label='Data'
            />
            <p className='neutral-1-color-a8 px-2 mr-4'>
              {moment(date).format('DD/MM/YYYY')}
            </p>
            <Icon icon='it-clock' size='xs' color='primary' aria-label='Ora' />
            <p className='neutral-1-color-a8 px-2'>
              {moment(date).format('hh:mm')}
            </p>
          </div>
        </div>

        {notificationsPreview ? userDropDown : null}
        {!isMobile && !notificationsPreview ? (
          <div className='ml-auto d-flex align-items-center' role='button'>
            <Icon
              color='primary'
              icon={DeleteCheck}
              size='sm'
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              aria-label='Chiudi'
            />
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default memo(Notification);
