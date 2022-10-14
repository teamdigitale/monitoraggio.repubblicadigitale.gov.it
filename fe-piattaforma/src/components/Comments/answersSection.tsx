import clsx from 'clsx';
import React from 'react';
import { selectDevice } from '../../redux/features/app/appSlice';
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
  return (
    <div>
      {showReplies && (
        <div
          className={clsx(
            'd-flex',
            'flex-column',
            !device.mediaIsPhone ? 'padding-left py-4 ml-4' : 'py-2',
            thread && !device.mediaIsPhone && 'comment-container__thread'
          )}
        >
          {replies &&
            replies.map((comment, index: number) => (
              <CommentAnswer
                key={index}
                {...comment}
                noBorder={replies.length > 1 && index < replies.length - 1}
              />
            ))}
        </div>
      )}
    </div>
  );
};

export default AnswersSection;
