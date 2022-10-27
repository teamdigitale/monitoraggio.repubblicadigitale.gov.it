import clsx from 'clsx';
import React from 'react';
import { useDispatch } from 'react-redux';
import { selectDevice } from '../../redux/features/app/appSlice';
import { openModal } from '../../redux/features/modal/modalSlice';
import { useAppSelector } from '../../redux/hooks';
import { CommentI } from './comment';
import CommentAnswer from './commentAnswer';

interface AnswerSectionI {
  replies?: CommentI[];
  thread?: boolean;
  showReplies?: boolean;
}

const AnswersSection: React.FC<AnswerSectionI> = (props) => {
  const { thread, showReplies, replies } = props;
  const device = useAppSelector(selectDevice);

  const dispatch = useDispatch();

  return (
    <div>
      {showReplies && (
        <div
          className={clsx(
            'd-flex',
            'flex-column',
            'left-alignment',
            !device.mediaIsPhone ? 'py-4' : 'py-2',
            thread && !device.mediaIsPhone && 'comment-container__thread'
          )}
        >
          {replies &&
            replies.map((comment, index: number) => (
              <CommentAnswer
                key={index}
                {...comment}
                noBorder={replies.length > 1 && index < replies.length - 1}
                onDeleteComment={() =>
                  dispatch(
                    openModal({
                      id: 'delete-forum-entity',
                      payload: {
                        text: 'Confermi di voler eliminare questo contenuto?',
                        entity: 'comment',
                        id: comment.id,
                        author: comment.author
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
                      },
                    })
                  )
                }
              />
            ))}
        </div>
      )}
    </div>
  );
};

export default AnswersSection;
