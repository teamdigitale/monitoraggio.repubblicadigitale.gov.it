import clsx from 'clsx';
import React from 'react';
import { useDispatch } from 'react-redux';
import { selectCommentsList } from '../../redux/features/forum/forumSlice';
import { openModal } from '../../redux/features/modal/modalSlice';
import { useAppSelector } from '../../redux/hooks';
import SectionTitle from '../SectionTitle/sectionTitle';
import Comment from './comment';

interface commentSectionI {
  section: 'board' | 'community' | 'documents';
}

const CommentSection: React.FC<commentSectionI> = ({ section }) => {
  const comments = useAppSelector(selectCommentsList);
  const dispatch = useDispatch();

  return (
    <div className='pb-4'>
      <div
        className={clsx('container', 'd-flex', 'justify-content-start', 'pb-4')}
      >
        <SectionTitle title='Commenti pubblicati' isForumLayout />
      </div>
      {comments.map((comment, i) => (
        <Comment
          key={`${comment.id}-${comment.body}`}
          section={section}
          thread={comments.length > 1 && i < comments.length - 1}
          isReply={true}
          {...comment}
          onDeleteComment={() =>
            dispatch(
              openModal({
                id: 'delete-forum-entity',
                payload: {
                  text: 'Confermi di voler eliminare questo contenuto?',
                  entity: 'comment',
                  id: comment.id,
                  author: comment.author,
                  textLabel: "Inserisci il motivo dell'eliminazione",
                },
              })
            )
          }
          onEditComment={() =>
            dispatch(
              openModal({
                id: 'comment-modal',
                payload: {
                  title: 'Modifica commento',
                  action: 'edit',
                  id: comment.id,
                  body: comment.body,
                  textLabel: 'Digita qui sotto il testo',
                },
              })
            )
          }
        />
      ))}
    </div>
  );
};

export default CommentSection;
