import clsx from 'clsx';
import {
  Button,
  Dropdown,
  DropdownMenu,
  DropdownToggle,
  Icon,
  LinkList,
} from 'design-react-kit';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { selectDevice } from '../../redux/features/app/appSlice';
import { openModal } from '../../redux/features/modal/modalSlice';
import { useAppSelector } from '../../redux/hooks';
import { formatDate } from '../../utils/datesHelper';
import AvatarInitials, {
  AvatarSizes,
  AvatarTextSizes,
} from '../Avatar/AvatarInitials/avatarInitials';

import { CommentI } from './comment';

const CommentAnswer: React.FC<CommentI> = (props) => {
  const {
    body,
    date,
    id,
    noBorder = false,
    onEditComment = () => ({}),
    onDeleteComment = () => ({}),
  } = props;

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dispatch = useDispatch();
  const device = useAppSelector(selectDevice);

  const commentDropdownOptions = [
    {
      optionName: 'ELIMINA',
      DropdowniIcon: {
        icon: 'it-delete',
        color: 'primary',
      },
      action: () => onDeleteComment(),
    },
    {
      optionName: 'MODIFICA',
      DropdowniIcon: {
        icon: 'it-pencil',
        color: 'primary',
      },
      action: () => onEditComment(),
    },
    {
      optionName: 'SEGNALA',
      DropdowniIcon: {
        icon: 'it-error',
        color: 'danger',
      },
      action: () =>
        dispatch(
          openModal({
            id: 'report-modal',
            payload: {
              entity: 'comment',
              id: id,
            },
          })
        ),
    },
  ];

  /* 
      funzione da legare alla modale con annesse chiamate API per aggiornare il campo
  
      const editComment = () => {
    
      } 
    */

  /*  const reportComment = () => {
    commentArray.filter((singleComment: CommentI) => singleComment.id !== id)
    if ( singleComment.id === id ) {
       setIsReported(true) 
    }
  } */

  /*  const deleteComment = () => {
    commentArray.filter((singleComment: CommentI) => singleComment.id !== id)
    if ( singleComment.id === id ) {
      commentArray.pop(singleComment);
    } */

  const commentDropdown = () => (
    <Dropdown
      className='comment-container__comment-dropdown'
      isOpen={isOpen}
      toggle={() => setIsOpen(!isOpen)}
    >
      <DropdownToggle
        caret
        className='shadow-none'
        style={{ background: 'rgba(242, 246, 250, 0.5)' }}
      >
        <div
          className={clsx('d-inline-flex', 'align-items-center', 'text.white')}
        >
          <div>
            <Button>
              <Icon icon='it-more-items' color='primary' />
            </Button>
          </div>
        </div>
      </DropdownToggle>
      <DropdownMenu role='menu' tag='ul'>
        <LinkList role='none'>
          {commentDropdownOptions.map((item, i) => (
            <li key={i} role='none' onClick={() => setIsOpen(!isOpen)}>
              <Button
                className={clsx('primary-color-b1', 'py-2', 'w-100')}
                role='menuitem'
                onClick={() => item.action && item.action()}
              >
                <div
                  className={clsx(
                    'd-flex',
                    'flex-row',
                    'justify-content-around',
                    'align-items-center'
                  )}
                >
                  <div>
                    <Icon
                      icon={item.DropdowniIcon.icon}
                      color={item.DropdowniIcon.color}
                    />
                  </div>
                  <div>{item.optionName}</div>
                </div>
              </Button>
            </li>
          ))}
        </LinkList>
      </DropdownMenu>
    </Dropdown>
  );
  return (
    <div
      className={clsx(
        'comment-container__answer',
        !device.mediaIsPhone ? 'pt-4 pr-2' : 'pt-3 pl-3'
      )}
      id={id}
    >
      <div className='d-flex justify-content-between w-100 py-2'>
        <div
          className={clsx(
            'd-flex',
            'flex-row',
            'justify-content-start',
            'align-items-center'
          )}
        >
          <div className='mr-1'>
            <AvatarInitials
              user={{
                uName: 'Tizio',
                uSurname: 'Caio',
              }}
              size={AvatarSizes.Big}
              font={AvatarTextSizes.Big}
            />
          </div>
          <div
            className={clsx(
              'd-flex',
              device.mediaIsDesktop ? 'flex-row' : 'flex-column',
              'align-items-center',
              'justify-content-start',
              'ml-2'
            )}
          >
            <p
              className={clsx(
                device.mediaIsPhone ? 'text-wrap' : 'text-nowrap'
              )}
            >
              <strong>Tizio Caio</strong>
              &nbsp;-&nbsp;
              <span>{date && formatDate(date, 'shortDate')}</span>
            </p>
          </div>
        </div>
        <div className='d-flex flex-row justify-content-end'>
          {/* {isReported && <Icon icon='it-warning-circle' color='danger' />} */}
          {commentDropdown()}
        </div>
        {/* comment heading ^^^^ */}
      </div>
      <div
        className={clsx('pb-4', !device.mediaIsPhone && 'ml-4 padding-left')}
        style={{ width: device.mediaIsDesktop ? '90%' : '94%' }}
      >
        {body}
      </div>
      {noBorder && <div className='border-bottom-box-answer mt-2'></div>}
      {/* conditional will be added one we have the comment array to let this be rendered only when the length is > 0 
       AnswerSection will take an Array in input to let the .map() render the answers which are now mocked in the component itself
   */}
    </div>
  );
};

export default CommentAnswer;
