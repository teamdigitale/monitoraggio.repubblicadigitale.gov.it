import {
  Button,
  Dropdown,
  DropdownMenu,
  DropdownToggle,
  Icon,
  LinkList,
} from 'design-react-kit';
import React, { useState } from 'react';

//import CuoreBluPieno from '../../../public/assets/img/filled-blue-heart.png';
import clsx from 'clsx';
//import AnswersSection from './answersSection';
//import CommentAnswer from './commentAnswer';
import AnswersSection from './answersSection';
import SocialBar from './socialBar';
import { useAppSelector } from '../../redux/hooks';
import { selectDevice } from '../../redux/features/app/appSlice';
import { useDispatch } from 'react-redux';
import { openModal } from '../../redux/features/modal/modalSlice';
import AvatarInitials, {
  AvatarSizes,
  AvatarTextSizes,
} from '../Avatar/AvatarInitials/avatarInitials';

/*  when we will make the pages we will do a .map() ro render all the comments and add the "thread" as shown in FIGMA*/

export interface CommentI {
  id?: string | undefined;
  body: string | undefined;
  date: string | undefined;
  author?: string;
  likes: number;
  views?: number;
  replies: any[];
  isDocument?: boolean;
  isAnswer?: boolean;
  isCommentSection?: boolean;
  thread?: boolean;
  noBorder?: boolean;
  onDeleteComment?: () => void;
  onEditComment?: () => void;
}

const Comment: React.FC<CommentI> = (props) => {
  const {
    body,
    date,
    // author,
    replies,
    likes,
    views,
    id,
    isAnswer,
    thread = false,
    onDeleteComment = () => ({}),
    onEditComment = () => ({}),
  } = props;

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isReported, setIsReported] = useState<boolean>(false);
  const [showReplies, setShowReplies] = useState<boolean>(false);
  const device = useAppSelector(selectDevice);
  const dispatch = useDispatch();

  const commentDropdown = () => (
    <Dropdown
      className='comment-container__comment-dropdown'
      isOpen={isOpen}
      toggle={() => setIsOpen(!isOpen)}
    >
      <DropdownToggle caret className='bg-white shadow-none'>
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
                      icon={item.DropdownIcon.icon}
                      color={item.DropdownIcon.color}
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

  const commentDropdownOptions = [
    {
      optionName: 'ELIMINA',
      DropdownIcon: {
        icon: 'it-delete',
        color: 'primary',
      },
      action: () => onDeleteComment(),
    },
    {
      optionName: 'MODIFICA',
      DropdownIcon: {
        icon: 'it-pencil',
        color: 'primary',
      },
      action: () => onEditComment(),
    },
    {
      optionName: 'SEGNALA',
      DropdownIcon: {
        icon: 'it-error',
        color: 'danger',
      },
      action: () => {
        dispatch(
          openModal({
            id: 'reportModal',
          })
        ),
          setIsReported(true);
      },
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

  return (
    <div
      className={clsx(
        !isAnswer
          ? 'comment-container__comment-card'
          : 'pt-3 comment-container__answer'
      )}
      id={id}
    >
      <div
        className={clsx(
          'comment-container',
          'd-flex',
          'flex-row',
          'justify-content-between',
          'align-items-center',
          'w-100',
          !device.mediaIsDesktop && 'pb-2'
        )}
      >
        <div
          className={clsx(
            'd-flex',
            'flex-row',
            'justify-content-start',
            'align-items-center'
          )}
        >
          <div className={clsx(!device.mediaIsPhone ? 'mr-1' : 'mr-3')}>
            <AvatarInitials
              user={{ uName: 'Tizio', uSurname: 'Caio' }}
              size={AvatarSizes.Big}
              font={AvatarTextSizes.Big}
            />
          </div>
          <div
            className={clsx(
              'd-flex',
              'flex-row',
              'align-items-center',
              'justify-content-start'
            )}
          >
            <p
              className={clsx(
                device.mediaIsPhone ? 'text-wrap' : 'text-nowrap ml-2'
              )}
            >
              <strong>Tizio Caio</strong>{' '}
              <span className={clsx(device.mediaIsPhone && 'text-nowrap')}>
                {' - '}
                <span> {date}</span>
              </span>
            </p>
          </div>
        </div>
        <div
          className={clsx(
            'd-flex flex-row justify-content-end',
            isReported && 'align-items-center'
          )}
        >
          {isReported && <Icon icon='it-error' color='danger' />}
          {commentDropdown()}
        </div>
        {/* comment heading ^^^^ */}
      </div>
      <div
        className={clsx(
          !device.mediaIsPhone && 'ml-4 padding-left',
          showReplies && replies && replies.length > 1 && !device.mediaIsPhone
            ? thread && 'comment-container__thread'
            : null
        )}
      >
        <div style={{ width: '94%' }}>{body}</div>
        <div className='comment-container__border mt-4 mb-2'></div>
        <SocialBar
          replies={replies.length}
          views={views}
          onShowReplies={() => setShowReplies((prev) => !prev)}
          showReplies={showReplies}
          likes={likes}
          onLike={() => ({})}
          onComment={() =>
            dispatch(
              openModal({
                id: 'addCommentModal',
                payload: { title: 'Aggiungi risposta al commento' },
              })
            )
          }
        />
      </div>

      {/* conditional will be added one we have the comment array to let this be rendered only when the length is > 0 
       AnswerSection will take an Array in input to let the .map() render the answers which are now mocked in the component itself
   */}
      <AnswersSection
        showReplies={showReplies}
        replies={replies}
        thread={thread}
      />
    </div>
  );
};

export default Comment;
