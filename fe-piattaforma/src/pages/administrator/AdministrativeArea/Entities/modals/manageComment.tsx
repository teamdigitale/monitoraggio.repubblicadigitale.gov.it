import React, { useEffect, useState } from 'react';
import { withFormHandlerProps } from '../../../../../hoc/withFormHandler';
import { useDispatch } from 'react-redux';
import GenericModal from '../../../../../components/Modals/GenericModal/genericModal';
import {
  closeModal,
  selectModalPayload,
} from '../../../../../redux/features/modal/modalSlice';
import FormAddComment from '../../../../forms/formComments/formAddComment';
import { useAppSelector } from '../../../../../redux/hooks';
import { useParams } from 'react-router-dom';
import {
  CreateComment,
  GetCommentsList,
  ReplyComment,
  UpdateComment,
} from '../../../../../redux/features/forum/comments/commentsThunk';
import { selectUser } from '../../../../../redux/features/user/userSlice';
import {
  ActionTracker,
  GetItemDetail,
} from '../../../../../redux/features/forum/forumThunk';

const modalId = 'comment-modal';

interface ManageCommentFormI {
  formDisabled?: boolean;
  creation?: boolean;
}

interface ManageCommentI extends withFormHandlerProps, ManageCommentFormI {}

const ManageComment: React.FC<ManageCommentI> = ({
  clearForm,
  formDisabled,
  creation = false,
}) => {
  const [newComment, setNewComment] = useState('');
  const dispatch = useDispatch();
  const payload = useAppSelector(selectModalPayload);
  const { id } = useParams();
  const userId = useAppSelector(selectUser)?.id;

  useEffect(() => {
    if (payload) setNewComment(payload.body || '');
  }, [payload]);

  const resetModal = () => {
    if (id && userId) dispatch(GetCommentsList(id, userId));
    setNewComment('');
    dispatch(closeModal());
  };

  const handleSaveComment = async () => {
    if (newComment.trim() !== '' && id && payload && userId) {
      switch (payload.action) {
        case 'comment': {
          const res = await dispatch(CreateComment(id, newComment as string));
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          if (res) {
            userId &&
              dispatch(GetItemDetail(id, userId, payload.entity || 'forum'));
            dispatch(
              ActionTracker({
                target: 'tnd',
                action_type: 'COMMENTO',
                event_type:
                  payload.entity === 'board'
                    ? 'NEWS'
                    : payload.entity === 'forum'
                    ? 'TOPIC'
                    : 'DOCUMENTI',
                category: payload.category_label || payload.category,
              })
            );
            resetModal();
          }
          break;
        }
        case 'edit':
          {
            const res = await dispatch(UpdateComment(payload.id, newComment));
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            if (res) {
              resetModal();
            }
          }
          break;
        case 'reply':
          {
            const res = await dispatch(ReplyComment(payload.id, newComment));
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            if (res) {
              resetModal();
            }
          }
          break;
        default:
          break;
      }
    }
  };

  return (
    <GenericModal
      id={modalId}
      primaryCTA={{
        disabled: newComment?.toString()?.trim() === '',
        label: 'Pubblica',
        onClick: handleSaveComment,
      }}
      secondaryCTA={{
        label: 'Annulla',
        onClick: () => {
          clearForm?.();
          dispatch(closeModal());
        },
      }}
      centerButtons
    >
      <FormAddComment
        creation={creation}
        formDisabled={!!formDisabled}
        newValue={newComment}
        sendNewValues={(newComment: string) => setNewComment(newComment)}
        textLabel={payload?.textLabel}
      />
    </GenericModal>
  );
};

export default ManageComment;
