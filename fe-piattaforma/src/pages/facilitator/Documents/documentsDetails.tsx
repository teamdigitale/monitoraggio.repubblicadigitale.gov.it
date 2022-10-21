import { Button, FormGroup, Icon } from 'design-react-kit';
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
  ActionTracker,
  DeleteItem, DocumentRate,
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

  const handleRate = async (rate: 1 | 2) => {
    if (id && rate) {
      await dispatch(DocumentRate(id, rate));
      dispatch(ActionTracker({
        target: 'tnd',
        action_type: 'RATING',
        event_type: 'DOCUMENTI',
        event_value: rate === 1 ? 'Y' : 'N',
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        category: docDetails?.category,
      }));
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

      <div className='d-flex align-items-center w-100'>
        <span
          className='d-none d-md-flex'
          style={{
            height: '2px',
            flexGrow: '1',
            backgroundColor: '#797C80',
          }}
        />
        <div className='d-flex justify-content-center align-items-center px-3 mx-auto'>
          <span
            className='pr-3'
            style={{
              color: '#2079D4',
              fontWeight: '700',
            }}
          >
            Ti è stato utile?
          </span>
          <div className='d-flex'>
            <FormGroup check className='d-flex align-items-center mt-0 pr-2'>
              {/*
                            <Input name='rate' type='radio' id='si' />
              <label className='mb-0'>SI</label>

              <Input name='rate' type='radio' id='no' />
              <label className='mb-0'>NO</label>
              */}
              <Button onClick={() => handleRate(1)}>Si</Button>
              <Button onClick={() => handleRate(2)}>No</Button>
            </FormGroup>
          </div>
        </div>
        <span
          className='d-none d-md-flex'
          style={{
            height: '2px',
            flexGrow: '1',
            backgroundColor: '#797C80',
          }}
        />
      </div>
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
