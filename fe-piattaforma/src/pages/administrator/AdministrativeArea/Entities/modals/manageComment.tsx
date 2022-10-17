import React, { useEffect, useState } from 'react';
import { withFormHandlerProps } from '../../../../../hoc/withFormHandler';
import { useDispatch } from 'react-redux';
import GenericModal from '../../../../../components/Modals/GenericModal/genericModal';
import { closeModal, selectModalPayload } from '../../../../../redux/features/modal/modalSlice';
import FormAddComment from '../../../../forms/formComments/formAddComment';
import { useAppSelector } from '../../../../../redux/hooks';
import { useParams } from 'react-router-dom';
import { CreateComment, GetCommentsList, ReplyComment, UpdateComment } from '../../../../../redux/features/forum/comments/commentsThunk';
import { selectUser } from '../../../../../redux/features/user/userSlice';

const modalId = 'comment-modal';
interface ManageCommentFormI {
  formDisabled?: boolean;
  creation?: boolean;
}

interface ManageCommentI extends withFormHandlerProps, ManageCommentFormI { }

const ManageComment: React.FC<ManageCommentI> = ({
  clearForm,
  formDisabled,
  creation = false,
}) => {
  const [newComment, setNewComment] = useState('')
  const dispatch = useDispatch();
  const payload = useAppSelector(selectModalPayload)
  const { id } = useParams()
  const userId = useAppSelector(selectUser)?.id

  useEffect(() => {
    if (payload && payload.body) setNewComment(payload.body)
  }, [payload])

  const handleSaveComment = async () => {
    if (newComment.trim() !== '' && id && payload && userId) {
      switch (payload.action) {
        case 'comment':
          await dispatch(CreateComment(id, newComment as string))
          break;
        case 'edit':
          await dispatch(UpdateComment(payload.id, newComment))
          break;
        case 'reply':
          await dispatch(ReplyComment(payload.id, newComment))
          break;
        default:
          break;
      }
      dispatch(GetCommentsList(id, userId))
      dispatch(closeModal())
    }
  };
  return (
    <GenericModal
      id={modalId}
      primaryCTA={{
        disabled: newComment.trim() === '',
        label: creation ? 'Conferma' : 'Salva',
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
        sendNewValues={(newComment: string) =>
          setNewComment(newComment)
        }
      />
    </GenericModal>
  );
};

export default ManageComment;
