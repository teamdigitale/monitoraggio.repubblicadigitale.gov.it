import clsx from 'clsx';
import React from 'react';
import { useDispatch } from 'react-redux';
import ManageComment from '../../pages/administrator/AdministrativeArea/Entities/modals/manageComment';
import { selectDevice } from '../../redux/features/app/appSlice';
import { selectCommentsList } from '../../redux/features/forum/forumSlice';
import { closeModal, openModal } from '../../redux/features/modal/modalSlice';
import { useAppSelector } from '../../redux/hooks';
import DeleteEntityModal from '../AdministrativeArea/Entities/General/DeleteEntityModal/DeleteEntityModal';
import SectionTitle from '../SectionTitle/sectionTitle';
import Comment from './comment';

interface commentSectionI {
  isDocument?: boolean;
  isCommentSection?: boolean;
  isThread?: boolean;
  isPreviewNews?: boolean;
}

const CommentSection: React.FC<commentSectionI> = ({
  /* isThread = false, */
  isPreviewNews,
}) => {
  const comments = useAppSelector(selectCommentsList);
  const dispatch = useDispatch();
  const device = useAppSelector(selectDevice);

  return (
    <div className={clsx(!isPreviewNews && 'pt-5')}>
      <div
        className={clsx(
          'container',
          'd-flex',
          'justify-content-start',
          'pb-4',
          device.mediaIsPhone && 'pt-5'
        )}
      >
        <SectionTitle title='Commenti pubblicati' isForumLayout />
      </div>
      {comments.map((comment, i) => (
        <Comment
          key={i}
          thread={comments.length > 1}
          {...comment}
          onDeleteComment={() =>
            dispatch(
              openModal({
                id: 'delete-entity',
                payload: {
                  text: 'Confermi di voler eliminare questo contenuto?',
                },
              })
            )
          }
          onEditComment={() =>
            dispatch(
              openModal({
                id: 'addCommentModal',
                payload: { title: 'Modifica commento' },
              })
            )
          }
        />
      ))}
      <ManageComment />
      <DeleteEntityModal
        onClose={() => dispatch(closeModal())}
        onConfirm={() => console.log()}
      />
    </div>
  );
};

export default CommentSection;
