import {
  Button,
  Dropdown,
  DropdownMenu,
  DropdownToggle,
  Icon,
  LinkList,
} from 'design-react-kit';
import React, { useEffect, useState } from 'react';

import clsx from 'clsx';
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
import {
  GetCommentsList,
  ManageCommentEvent,
} from '../../redux/features/forum/comments/commentsThunk';
import { useParams } from 'react-router-dom';
import { selectUser } from '../../redux/features/user/userSlice';
import {
  getAnagraphicID,
  selectAnagraphics,
} from '../../redux/features/anagraphic/anagraphicSlice';
import { formatDate } from '../../utils/datesHelper';
import useGuard from '../../hooks/guard';

export interface CommentI {
  id?: string | undefined;
  body: string | undefined;
  date: string | undefined;
  author?: string;
  likes: number;
  user_like?: boolean;
  views?: number;
  replies: any[];
  isAnswer?: boolean;
  thread?: boolean;
  noBorder?: boolean;
  section: 'board' | 'community' | 'documents';
  onDeleteComment?: () => void;
  onEditComment?: () => void;
}

const Comment: React.FC<CommentI> = (props) => {
  const {
    body,
    date,
    author,
    section,
    replies,
    likes,
    user_like,
    views,
    id,
    isAnswer,
    thread = false,
    onDeleteComment = () => ({}),
    onEditComment = () => ({}),
  } = props;

  const [detailDropdownOptions, setDetailDropdownOptions] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [showReplies, setShowReplies] = useState<boolean>(false);
  const device = useAppSelector(selectDevice);
  const dispatch = useDispatch();
  const { hasUserPermission } = useGuard();

  const { id: itemId } = useParams();
  const userId = useAppSelector(selectUser)?.id;

  const authorAnagraphic = useAppSelector(selectAnagraphics)[author || 0] || {
    nome: 'Utente',
    cognome: 'Anonimo',
  };

  const deleteOption = {
    optionName: 'ELIMINA',
    DropdownIcon: {
      icon: 'it-delete',
      color: 'primary',
    },
    action: onDeleteComment,
  };

  const editOption = {
    optionName: 'MODIFICA',
    DropdownIcon: {
      icon: 'it-pencil',
      color: 'primary',
    },
    action: onEditComment,
  };

  const reportOption = {
    optionName: 'SEGNALA',
    DropdownIcon: {
      icon: 'it-error',
      color: 'danger',
    },
    action: () => {
      dispatch(
        openModal({
          id: 'report-modal',
          payload: {
            entity: 'comment',
            id: id,
          },
        })
      );
    },
  };

  const setDetailDropdownOptionsByPermission = () => {
    const authorizedOption = [];
    if (
      hasUserPermission([
        section === 'board'
          ? 'del.news'
          : section === 'community'
          ? 'del.topic'
          : section === 'documents'
          ? 'del.doc'
          : 'hidden',
      ])
    ) {
      authorizedOption.push(deleteOption);
    }
    if (
      hasUserPermission([
        section === 'board'
          ? 'upd.news'
          : section === 'community'
          ? 'upd.topic'
          : section === 'documents'
          ? 'upd.doc'
          : 'hidden',
      ])
    ) {
      authorizedOption.push(editOption);
    }
    if (
      hasUserPermission([
        section === 'board'
          ? 'rprt.news'
          : section === 'community'
          ? 'rprt.topic'
          : section === 'documents'
          ? 'rprt.doc'
          : 'hidden',
      ])
    ) {
      authorizedOption.push(reportOption);
    }
    setDetailDropdownOptions(authorizedOption);
  };

  useEffect(() => {
    setDetailDropdownOptionsByPermission();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (author && !authorAnagraphic?.id) {
      dispatch(getAnagraphicID({ id: author }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authorAnagraphic]);

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
          {detailDropdownOptions.map((item, i) => (
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
        'pb-3',
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
              user={{
                uName: authorAnagraphic?.nome,
                uSurname: authorAnagraphic?.cognome,
              }}
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
              <strong>
                {authorAnagraphic?.nome}&nbsp;{authorAnagraphic?.cognome}
              </strong>
              <span className={clsx(device.mediaIsPhone && 'text-nowrap')}>
                &nbsp;-&nbsp;
                <span>{date && formatDate(date, 'shortDate')}</span>
              </span>
            </p>
          </div>
        </div>
        <div
          className={clsx(
            'd-flex flex-row justify-content-end'
            // isReported && 'align-items-center'
          )}
        >
          {/* {isReported && <Icon icon='it-error' color='danger' />} */}
          {commentDropdown()}
        </div>
        {/* comment heading ^^^^ */}
      </div>
      <div
        className={clsx(
          !device.mediaIsPhone && 'ml-4 padding-left',
          showReplies && replies && replies.length > 0 && !device.mediaIsPhone
            ? thread && 'comment-container__thread'
            : null
        )}
      >
        <div style={{ width: '94%' }}>{body}</div>
        <div className='comment-container__border mt-4 mb-2'></div>
        <SocialBar
          replies={section === 'community' ? replies.length : undefined}
          views={section === 'community' ? views : undefined}
          onShowReplies={
            section === 'community' && replies.length
              ? () => setShowReplies((prev) => !prev)
              : undefined
          }
          showReplies={section === 'community' ? showReplies : undefined}
          likes={likes}
          user_like={user_like}
          onLike={async () => {
            if (id) {
              if (user_like as boolean) {
                await dispatch(ManageCommentEvent(id, 'unlike'));
              } else {
                await dispatch(ManageCommentEvent(id, 'like'));
              }

              itemId && userId && dispatch(GetCommentsList(itemId, userId));
            }
          }}
          onComment={
            section === 'community'
              ? () =>
                  dispatch(
                    openModal({
                      id: 'comment-modal',
                      payload: {
                        title: 'Aggiungi risposta al commento',
                        action: 'reply',
                        id: id,
                      },
                    })
                  )
              : undefined
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
