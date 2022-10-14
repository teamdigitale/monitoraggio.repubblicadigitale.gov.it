import clsx from 'clsx';
import { Button, FormGroup, Icon } from 'design-react-kit';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Form, Input } from '../../../components';
import DeleteEntityModal from '../../../components/AdministrativeArea/Entities/General/DeleteEntityModal/DeleteEntityModal';
import CommentSection from '../../../components/Comments/commentSection';
import SectionDetail from '../../../components/DocumentDetail/sectionDetail';
import { selectDevice } from '../../../redux/features/app/appSlice';
import { GetCommentsList } from '../../../redux/features/forum/comments/commentsThunk';
import { selectDocDetail } from '../../../redux/features/forum/forumSlice';
import { GetItemDetail } from '../../../redux/features/forum/forumThunk';
import {
  closeModal,
  openModal,
} from '../../../redux/features/modal/modalSlice';
import { useAppSelector } from '../../../redux/hooks';
import ManageDocument from '../../administrator/AdministrativeArea/Entities/modals/manageDocument';
import ManageReport from '../../administrator/AdministrativeArea/Entities/modals/manageReport';
// import { DocumentCardDetailMock } from '../../playground';
import './documentsDetails.scss';

const DocumentsDetails = () => {
  const device = useAppSelector(selectDevice);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const docDetails = useAppSelector(selectDocDetail);

  useEffect(() => {
    dispatch(GetItemDetail('id', 'userId', 'document'));
    dispatch(GetCommentsList('itemId'));
  }, []);

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
        onReportClick={() => dispatch(openModal({ id: 'reportModal' }))}
      />
      <div
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
      </div>
      <CommentSection isDocument isCommentSection />
      <div className='border mt-3'></div>
      <ManageDocument />
      <ManageReport />
      <DeleteEntityModal
        onClose={() => dispatch(closeModal())}
        onConfirm={() => console.log()}
      />
    </div>
  );
};

export default DocumentsDetails;
