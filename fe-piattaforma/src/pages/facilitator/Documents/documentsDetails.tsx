import { Button, Icon } from 'design-react-kit';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import DeleteEntityModal from '../../../components/AdministrativeArea/Entities/General/DeleteEntityModal/DeleteEntityModal';
import CommentSection from '../../../components/Comments/commentSection';
import SectionDetail from '../../../components/DocumentDetail/sectionDetail';
import { setInfoIdsBreadcrumb } from '../../../redux/features/app/appSlice';
import {
  DeleteComment,
  GetCommentsList,
} from '../../../redux/features/forum/comments/commentsThunk';
import {
  selectCommentsList,
  selectDocDetail,
} from '../../../redux/features/forum/forumSlice';
import {
  DeleteItem,
  GetItemDetail,
} from '../../../redux/features/forum/forumThunk';
import {
  closeModal,
  openModal,
} from '../../../redux/features/modal/modalSlice';
import { selectUser } from '../../../redux/features/user/userSlice';
import { useAppSelector } from '../../../redux/hooks';
import ManageComment from '../../administrator/AdministrativeArea/Entities/modals/manageComment';
import ManageDocument from '../../administrator/AdministrativeArea/Entities/modals/manageDocument';
import ManageReport from '../../administrator/AdministrativeArea/Entities/modals/manageReport';
import './documentsDetails.scss';

const DocumentsDetails = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const docDetails = useAppSelector(selectDocDetail);
  const { id } = useParams();
  const userId = useAppSelector(selectUser)?.id;
  const commentsList = useAppSelector(selectCommentsList);

  useEffect(() => {
    if (userId && id) {
      dispatch(GetItemDetail(id, userId, 'document'));
      dispatch(GetCommentsList(id, userId));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, id]);

  useEffect(() => {
    if (docDetails?.id && docDetails?.title) {
      dispatch(
        setInfoIdsBreadcrumb({
          id: docDetails?.id,
          nome: docDetails?.title,
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [docDetails]);

  const onCommentDelete = async (commentId: string) => {
    await dispatch(DeleteComment(commentId));
    if (id && userId) {
      dispatch(GetCommentsList(id, userId));
      dispatch(GetItemDetail(id, userId, 'document'));
    }
  };

  const backButton = (
    <Button onClick={() => navigate(-1)} className='px-0'>
      <Icon
        icon='it-chevron-left'
        color='primary'
        aria-label='Torna indietro'
      />
      <span className='primary-color'> Torna indietro </span>
    </Button>
  );
  return (
    <div className='container'>
      {backButton}
      <SectionDetail
        {...docDetails}
        section='documents'
        isDocument
        onDeleteClick={() =>
          dispatch(
            openModal({
              id: 'delete-entity',
              payload: {
                text: 'Confermi di voler eliminare questo contenuto?',
                id: id,
                entity: 'document',
              },
            })
          )
        }
        onEditClick={() =>
          dispatch(
            openModal({
              id: 'documentModal',
              payload: {
                title: 'Modifica documento',
              },
            })
          )
        }
        onReportClick={() =>
          dispatch(
            openModal({
              id: 'report-modal',
              payload: {
                entity: 'document',
              },
            })
          )
        }
      />
      {commentsList.length ? <CommentSection section='ducuments' /> : null}
      <div className='border mt-3'></div>
      <ManageDocument />
      <ManageComment />
      <ManageReport />
      <DeleteEntityModal
        onClose={() => dispatch(closeModal())}
        onConfirm={(payload: any) => {
          switch (payload.entity) {
            case 'document':
              dispatch(DeleteItem(payload.id));
              navigate(-1);
              break;
            case 'comment':
              onCommentDelete(payload.id);
              break;
            default:
              break;
          }
          dispatch(closeModal());
        }}
      />
    </div>
  );
};

export default DocumentsDetails;
