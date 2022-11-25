import { Button, FormGroup, Icon, Label } from 'design-react-kit';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Input, Loader } from '../../../components';
import CommentSection from '../../../components/Comments/commentSection';
import SectionDetail from '../../../components/DocumentDetail/sectionDetail';
import DeleteForumModal from '../../../components/General/DeleteForumEntity/DeleteForumEntity';
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
  DeleteItem,
  DocumentRate,
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
  const [usefullStatus, setUsefullStatus] = useState<number>(0);

  const getItemDetails = async () => {
    if (userId && id) {
      const res = await dispatch(GetItemDetail(id, userId, 'document'));
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (res) {
        dispatch(GetCommentsList(id, userId));
      } else {
        navigate('/documenti', { replace: true });
      }
    }
  };

  useEffect(() => {
    getItemDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, id]);

  useEffect(() => {
    if (
      docDetails?.usefull_status &&
      docDetails?.usefull_status !== usefullStatus
    )
      setUsefullStatus(docDetails?.usefull_status);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [docDetails?.usefull_status]);

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

  const onCommentDelete = async (commentId: string, reason: string) => {
    await dispatch(DeleteComment(commentId, reason));
    if (id && userId) {
      dispatch(GetCommentsList(id, userId));
      dispatch(GetItemDetail(id, userId, 'document'));
    }
  };

  const handleRate = async (rate: 1 | 2) => {
    if (id && rate) {
      setUsefullStatus(rate);
      const res = await dispatch(DocumentRate(id, rate));
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (res) {
        dispatch(
          ActionTracker({
            target: 'tnd',
            action_type: 'RATING',
            event_type: 'DOCUMENTI',
            event_value: rate === 1 ? 'Y' : 'N',
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            category: docDetails?.category_label || docDetails?.category,
          })
        );
      }
    }
  };

  const onEntityDelete = async (entityId: string, reason: string) => {
    await dispatch(DeleteItem(entityId, reason));
    navigate(-1);
  };

  const backButton = (
    <Button
      onClick={() => navigate('/documenti', { replace: true })}
      className='px-0'
      aria-label='vai ai documenti'
    >
      <Icon
        icon='it-chevron-left'
        color='primary'
        aria-label='vai ai documenti'
        aria-hidden
      />
      <span className='primary-color ml-1'>Vai ai documenti</span>
    </Button>
  );

  if (!docDetails?.id) return <Loader />;

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
              id: 'delete-forum-entity',
              payload: {
                text: 'Confermi di voler eliminare questo contenuto?',
                id: id,
                entity: 'document',
                author: docDetails.author,
                textLabel: "Inserisci il motivo dell'eliminazione",
              },
            })
          )
        }
        onEditClick={() =>
          dispatch(
            openModal({
              id: 'documentModal',
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

      <div className='d-flex align-items-center w-100 mb-5'>
        <span className='d-none d-md-flex border-box-utility' />
        <div className='d-flex justify-content-center align-items-center px-3 mx-auto'>
          <span className='pr-3 border-box-utility__label'>
            Ti è stato utile?
          </span>
          <div className='d-flex'>
            <Form id='form-utilità' legend='Form ti è stato utile?' showMandatory={false}>
              <FormGroup check className='d-flex align-items-center mt-0 pr-2'>
                <div className='d-flex align-items-center mr-3'>
                  <Input
                    name='rate'
                    type='radio'
                    id='rate-si'
                    checked={Number(usefullStatus) === 1}
                    onClick={() => handleRate(1)}
                    aria-labelledby='rate-siDescription'
                    withLabel={false}
                  />
                  <Label check htmlFor='rate-si' id='rate-siDescription'>
                    Si
                  </Label>
                </div>
                <div className='d-flex align-items-center'>
                  <Input
                    name='rate'
                    type='radio'
                    id='rate-no'
                    checked={Number(usefullStatus) === 2}
                    onClick={() => handleRate(2)}
                    aria-labelledby='rate-noDescription'
                    withLabel={false}
                  />
                  <Label check htmlFor='rate-no' id='rate-noDescription'>
                    No
                  </Label>
                </div>
              </FormGroup>
            </Form>
          </div>
        </div>
        <span className='d-none d-md-flex border-box-utility' />
      </div>
      {commentsList.length ? <CommentSection section='documents' /> : null}
      <ManageDocument />
      <ManageComment />
      <ManageReport />
      <DeleteForumModal
        onClose={() => dispatch(closeModal())}
        onConfirm={(payload: any) => {
          switch (payload.entity) {
            case 'document':
              onEntityDelete(payload.id, payload.reason);
              break;
            case 'comment':
              onCommentDelete(payload.id, payload.reason);
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
