// import clsx from 'clsx';
import { Button, Icon } from 'design-react-kit';
import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CommentSection from '../../../components/Comments/commentSection';
import SectionDetail from '../../../components/DocumentDetail/sectionDetail';
// import { selectDevice } from '../../../redux/features/app/appSlice';
import { useAppSelector } from '../../../redux/hooks';
// import { Comment } from '../../../components';
import { useDispatch } from 'react-redux';
import {
  selectCommentsList,
  selectTopicDetail,
} from '../../../redux/features/forum/forumSlice';
import {
  ActionTracker,
  DeleteItem,
  GetItemDetail,
  ManageItemEvent,
} from '../../../redux/features/forum/forumThunk';
import ManageTopic from '../../administrator/AdministrativeArea/Entities/modals/manageTopic';
import ManageReport from '../../administrator/AdministrativeArea/Entities/modals/manageReport';
import {
  closeModal,
  openModal,
} from '../../../redux/features/modal/modalSlice';
import DeleteEntityModal from '../../../components/AdministrativeArea/Entities/General/DeleteEntityModal/DeleteEntityModal';
import { selectUser } from '../../../redux/features/user/userSlice';
import ManageComment from '../../administrator/AdministrativeArea/Entities/modals/manageComment';
import {
  DeleteComment,
  GetCommentsList,
} from '../../../redux/features/forum/comments/commentsThunk';
import { setInfoIdsBreadcrumb } from '../../../redux/features/app/appSlice';

const CommunityDetails = () => {
  const navigate = useNavigate();
  // const device = useAppSelector(selectDevice);
  // const [showAllComments, setShowAllComments] = useState<boolean>(false);
  const dispatch = useDispatch();
  const topicDetails = useAppSelector(selectTopicDetail);
  const commentsList = useAppSelector(selectCommentsList);
  const { id } = useParams();
  const userId = useAppSelector(selectUser)?.id;

  const getItemDetails = async () => {
    if (id && userId) {
      dispatch(ManageItemEvent(id, 'view'));
      dispatch(GetCommentsList(id, userId));
      const res = await dispatch(GetItemDetail(id, userId, 'community'));
      if (res) {
        dispatch(ActionTracker({
          target: 'tnd',
          action_type: 'VISUALIZZAZIONE',
          event_type: 'TOPIC',
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          category: res?.data?.data?.items?.[0]?.category,
        }));
      }
    }
  };

  useEffect(() => {
    getItemDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, userId]);

  useEffect(() => {
    if (topicDetails?.id && topicDetails?.title) {
      dispatch(
        setInfoIdsBreadcrumb({
          id: topicDetails?.id,
          nome: topicDetails?.title,
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topicDetails]);

  const backButton = (
    <Button onClick={() => navigate(-1)} className='px-0'>
      <Icon
        icon='it-chevron-left'
        color='primary'
        aria-label='Torna indietro'
      />
      <span className='primary-color'>Torna indietro</span>
    </Button>
  );

  // const AllComments = (
  //   <Button
  //     size='xs'
  //     className='p-0 d-flex flex-row align-items-center'
  //     onClick={() => setShowAllComments(!showAllComments)}
  //   >
  //     <div
  //       className={clsx(
  //         'd-flex',
  //         'flex-row',
  //         'align-items-center',
  //         device.mediaIsDesktop
  //           ? 'justify-content-end'
  //           : 'justify-content-start py-3'
  //       )}
  //     >
  //       <p
  //         className={clsx(
  //           'primary-color',
  //           'font-weight-bold',
  //           !device.mediaIsPhone ? 'pl-2' : 'pr-2',
  //           'text-nowrap',
  //           'letter-spacing'
  //         )}
  //       >
  //         {`${!showAllComments
  //             ? `LEGGI TUTTI I COMMENTI`
  //             : `NASCONDI TUTTI I COMMENTI`
  //           }`}
  //       </p>
  //       <span
  //         className='primary-color pl-1 letter-spacing'
  //         style={{ fontWeight: 400 }}
  //       >{`(${comments.length})`}</span>
  //     </div>
  //   </Button>
  // );

  const onCommentDelete = async (commentId: string) => {
    await dispatch(DeleteComment(commentId));
    if (id && userId) {
      dispatch(GetCommentsList(id, userId));
      dispatch(GetItemDetail(id, userId, 'community'));
    }
  };

  return (
    <div className='container'>
      {backButton}
      <SectionDetail
        {...topicDetails}
        section='community'
        onDeleteClick={() =>
          dispatch(
            openModal({
              id: 'delete-entity',
              payload: {
                text: 'Confermi di voler eliminare questo contenuto?',
                id: id,
                entity: 'community',
              },
            })
          )
        }
        onEditClick={() =>
          dispatch(
            openModal({
              id: 'topicModal',
              payload: {
                title: 'Modifica topic',
              },
            })
          )
        }
        onReportClick={() =>
          dispatch(
            openModal({
              id: 'report-modal',
              payload: {
                entity: 'community',
              },
            })
          )
        }
      />
      {commentsList.length ? <CommentSection section='community' /> : null}
      {/* <div className='border-bottom-box-comments mt-5'></div>
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
      </div> */}
      <ManageTopic />
      <ManageReport />
      <ManageComment />
      <DeleteEntityModal
        onClose={() => dispatch(closeModal())}
        onConfirm={(payload: any) => {
          switch (payload.entity) {
            case 'community':
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

export default CommunityDetails;
