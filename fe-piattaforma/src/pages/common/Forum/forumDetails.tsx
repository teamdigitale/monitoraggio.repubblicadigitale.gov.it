import React, { useEffect } from 'react';
import { Button, Icon } from 'design-react-kit';
import { useNavigate, useParams } from 'react-router-dom';
import CommentSection from '../../../components/Comments/commentSection';
import SectionDetail from '../../../components/DocumentDetail/sectionDetail';
import { useAppSelector } from '../../../redux/hooks';
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
import { selectUser } from '../../../redux/features/user/userSlice';
import ManageComment from '../../administrator/AdministrativeArea/Entities/modals/manageComment';
import {
  DeleteComment,
  GetCommentsList,
} from '../../../redux/features/forum/comments/commentsThunk';
import { setInfoIdsBreadcrumb } from '../../../redux/features/app/appSlice';
import DeleteForumModal from '../../../components/General/DeleteForumEntity/DeleteForumEntity';
import { Loader } from '../../../components';

const ForumDetails = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const topicDetails = useAppSelector(selectTopicDetail);
  const commentsList = useAppSelector(selectCommentsList);
  const { id } = useParams();
  const userId = useAppSelector(selectUser)?.id;

  const getItemDetails = async () => {
    if (id && userId) {
      const res = await dispatch(GetItemDetail(id, userId, 'community'));
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (res) {
        dispatch(ManageItemEvent(id, 'view'));
        dispatch(GetCommentsList(id, userId));
        dispatch(
          ActionTracker({
            target: 'tnd',
            action_type: 'VISUALIZZAZIONE',
            event_type: 'TOPIC',
            category:
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              res?.data?.data?.items?.[0]?.category_label ||
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              res?.data?.data?.items?.[0]?.category,
          })
        );
      } else {
        navigate('/community', { replace: true });
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
    <Button
      onClick={() => navigate('/community', { replace: true })}
      className='px-0'
      aria-label='vai alla community'
    >
      <Icon
        icon='it-chevron-left'
        color='primary'
        aria-label='vai alla community'
        aria-hidden
      />
      <span className='primary-color ml-1'>Vai alla community</span>
    </Button>
  );

  const onCommentDelete = async (commentId: string, reason: string) => {
    await dispatch(DeleteComment(commentId, reason));
    if (id && userId) {
      dispatch(GetCommentsList(id, userId));
      dispatch(GetItemDetail(id, userId, 'community'));
    }
  };

  const onEntityDelete = async (entityId: string, reason: string) => {
    await dispatch(DeleteItem(entityId, reason));
    navigate(-1);
  };

  if (!topicDetails?.id) return <Loader />;

  return (
    <div className='container'>
      {backButton}
      <SectionDetail
        {...topicDetails}
        section='community'
        onDeleteClick={() =>
          dispatch(
            openModal({
              id: 'delete-forum-entity',
              payload: {
                text: 'Confermi di voler eliminare questo contenuto?',
                id: id,
                entity: 'community',
                author: topicDetails.author,
                textLabel: "Inserisci il motivo dell'eliminazione",
              },
            })
          )
        }
        onEditClick={() =>
          dispatch(
            openModal({
              id: 'topicModal',
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
      <DeleteForumModal
        onClose={() => dispatch(closeModal())}
        onConfirm={(payload: any) => {
          switch (payload.entity) {
            case 'community':
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

export default ForumDetails;
