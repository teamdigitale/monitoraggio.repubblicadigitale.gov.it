import clsx from 'clsx';
import { Button, Icon } from 'design-react-kit';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CommentSection from '../../../components/Comments/commentSection';
import SectionDetail from '../../../components/DocumentDetail/sectionDetail';
import { selectDevice } from '../../../redux/features/app/appSlice';
import { useAppSelector } from '../../../redux/hooks';
import { Comment } from '../../../components';
import { useDispatch } from 'react-redux';
import {
  selectCommentsList,
  selectTopicDetail,
} from '../../../redux/features/forum/forumSlice';
import { GetItemDetail } from '../../../redux/features/forum/forumThunk';
//import { GetCommentsList } from '../../../redux/features/forum/comments/commentsThunk';
import ManageTopic from '../../administrator/AdministrativeArea/Entities/modals/manageTopic';
import ManageReport from '../../administrator/AdministrativeArea/Entities/modals/manageReport';
import {
  closeModal,
  openModal,
} from '../../../redux/features/modal/modalSlice';
import DeleteEntityModal from '../../../components/AdministrativeArea/Entities/General/DeleteEntityModal/DeleteEntityModal';
import { selectUser } from '../../../redux/features/user/userSlice';

const CommunityDetails = () => {
  const navigate = useNavigate();
  const device = useAppSelector(selectDevice);
  const [showAllComments, setShowAllComments] = useState<boolean>(false);
  const dispatch = useDispatch();
  const topicDetails = useAppSelector(selectTopicDetail);
  const comments = useAppSelector(selectCommentsList);
  const { id } = useParams();
  const userId = useAppSelector(selectUser)?.id;

  useEffect(() => {
    userId && id && dispatch(GetItemDetail(id, userId, 'community'));
    // dispatch(GetCommentsList('itemId'));
  }, [id, userId]);

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

  const AllComments = (
    <Button
      size='xs'
      className='p-0 d-flex flex-row align-items-center'
      onClick={() => setShowAllComments(!showAllComments)}
    >
      <div
        className={clsx(
          'd-flex',
          'flex-row',
          'align-items-center',
          device.mediaIsDesktop
            ? 'justify-content-end'
            : 'justify-content-start py-3'
        )}
      >
        <p
          className={clsx(
            'primary-color',
            'font-weight-bold',
            !device.mediaIsPhone ? 'pl-2' : 'pr-2',
            'text-nowrap',
            'letter-spacing'
          )}
        >
          {`${
            !showAllComments
              ? `LEGGI TUTTI I COMMENTI`
              : `NASCONDI TUTTI I COMMENTI`
          }`}
        </p>
        <span
          className='primary-color pl-1 letter-spacing'
          style={{ fontWeight: 400 }}
        >{`(${comments.length})`}</span>
      </div>
    </Button>
  );

  return (
    <div className='container'>
      {backButton}
      <SectionDetail
        {...topicDetails}
        isCommunity
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
        onEditClick={() => dispatch(openModal({ id: 'topicModal' }))}
        onReportClick={() => dispatch(openModal({ id: 'reportModal' }))}
      />
      <CommentSection section="community" />
      <div className='border-bottom-box-comments mt-5'></div>
      <div
        className={clsx(
          device.mediaIsPhone && 'd-flex justify-content-center',
          'py-4'
        )}
      >
        {AllComments}
      </div>
      <div>
        {showAllComments
          ? comments.map((comment, i) => <Comment key={i} {...comment} />)
          : null}
      </div>
      <ManageTopic />
      <ManageReport />
      <DeleteEntityModal
        onClose={() => dispatch(closeModal())}
        onConfirm={() => console.log()}
      />
    </div>
  );
};

export default CommunityDetails;
