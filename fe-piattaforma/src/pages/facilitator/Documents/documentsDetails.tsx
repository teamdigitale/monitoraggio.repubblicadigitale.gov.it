import { Button, Icon } from 'design-react-kit';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import DeleteEntityModal from '../../../components/AdministrativeArea/Entities/General/DeleteEntityModal/DeleteEntityModal';
import CommentSection from '../../../components/Comments/commentSection';
import SectionDetail from '../../../components/DocumentDetail/sectionDetail';
import { DeleteComment, GetCommentsList } from '../../../redux/features/forum/comments/commentsThunk';
import { selectCommentsList, selectDocDetail } from '../../../redux/features/forum/forumSlice';
import { DeleteItem, GetItemDetail } from '../../../redux/features/forum/forumThunk';
import {
  closeModal,
  openModal,
} from '../../../redux/features/modal/modalSlice';
import { selectUser } from '../../../redux/features/user/userSlice';
import { useAppSelector } from '../../../redux/hooks';
import ManageComment from '../../administrator/AdministrativeArea/Entities/modals/manageComment';
import ManageDocument from '../../administrator/AdministrativeArea/Entities/modals/manageDocument';
import ManageReport from '../../administrator/AdministrativeArea/Entities/modals/manageReport';
// import { DocumentCardDetailMock } from '../../playground';
import './documentsDetails.scss';

const DocumentsDetails = () => {
  // const device = useAppSelector(selectDevice);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const docDetails = useAppSelector(selectDocDetail);
  const { id } = useParams()
  const userId = useAppSelector(selectUser)?.id;
  const commentsList = useAppSelector(selectCommentsList)

  useEffect(() => {
    if (userId && id) {
      dispatch(GetItemDetail(id, userId, 'document'));
      dispatch(GetCommentsList(id, userId));
    }
  }, [userId, id]);

  const onCommentDelete = async (commentId: string) => {
    await dispatch(DeleteComment(commentId));
    if (id && userId) {
      dispatch(GetCommentsList(id, userId))
      dispatch(GetItemDetail(id, userId, 'document'))
    }
  }

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
        isDocument
        onDeleteClick={() =>
          dispatch(
            openModal({
              id: 'delete-entity',
              payload: {
                text: 'Confermi di voler eliminare questo contenuto?',
                id: id,
                entity: 'document'
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
        onReportClick={() => dispatch(openModal({
          id: 'report-modal', payload: {
            entity: 'document'
          }
        }))}
      />
      {/* <div
        className={clsx(
          'd-flex',
          'align-items-center',
          !device.mediaIsPhone ? 'mt-5' : 'justify-content-center mt-3'
        )}
      >
        {!device.mediaIsPhone ? (
          <div className='border-box-utility mr-4'></div>
        ) : null}
        <div className='d-flex align-items-center mx-2'>
          <h6 className='mb-0 primary-color mr-3'>Ti è stato utile?</h6>
          <Form id='form-document-detail-utility'>
            <FormGroup check inline>
              <div className='pb-2 mr-2'>
                <Input
                  name='utility'
                  type='radio'
                  id={`utils`}
                  label='si'
                  withLabel
                />
              </div>
              <div className='pb-2'>
                <Input
                  name='utility'
                  type='radio'
                  id={`not-utils`}
                  label='no'
                  withLabel
                />
              </div>
            </FormGroup>
          </Form>
        </div>
        {!device.mediaIsPhone ? (
          <div className='border-box-utility ml-4'></div>
        ) : null}
      </div> */}
      {commentsList.length ? <CommentSection section="ducuments" /> : null}
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
              onCommentDelete(payload.id)
              break;
            default:
              break;
          }
          dispatch(closeModal())
        }}
      />
    </div>
  );
};

export default DocumentsDetails;
