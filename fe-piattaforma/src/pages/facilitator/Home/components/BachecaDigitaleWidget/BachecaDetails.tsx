import clsx from 'clsx';
import { Button, Icon } from 'design-react-kit';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import AnteprimaBachecaNews from '../../../../../components/AnteprimaNews/anteprimaNews';
import CommentSection from '../../../../../components/Comments/commentSection';
import DeleteForumModal from '../../../../../components/General/DeleteForumEntity/DeleteForumEntity';
/* import { singleNewsMock } from '../../../../../components/MocksWave3/Mocks'; */
import {
  /* selectDevice, */ setInfoIdsBreadcrumb,
} from '../../../../../redux/features/app/appSlice';
import {
  DeleteComment,
  GetCommentsList,
} from '../../../../../redux/features/forum/comments/commentsThunk';
import {
  selectCommentsList,
  selectNewsDetail,
} from '../../../../../redux/features/forum/forumSlice';
import {
  ActionTracker,
  DeleteItem,
  GetItemDetail,
  ManageItemEvent,
} from '../../../../../redux/features/forum/forumThunk';
import {
  closeModal,
  openModal,
} from '../../../../../redux/features/modal/modalSlice';
import { selectUser } from '../../../../../redux/features/user/userSlice';
import { useAppSelector } from '../../../../../redux/hooks';
import ManageComment from '../../../../administrator/AdministrativeArea/Entities/modals/manageComment';
import ManageNews from '../../../../administrator/AdministrativeArea/Entities/modals/manageNews';
import ManageReport from '../../../../administrator/AdministrativeArea/Entities/modals/manageReport';

const BachecaDetails = () => {
  /*  const device = useAppSelector(selectDevice) */
  const navigate = useNavigate();
  const newsDetail = useAppSelector(selectNewsDetail);
  const commentsList = useAppSelector(selectCommentsList);
  const userId = useAppSelector(selectUser)?.id;
  const dispatch = useDispatch();
  const { id } = useParams();

  const getItemDetails = async () => {
    if (id && userId) {
      dispatch(ManageItemEvent(id, 'view'));
      dispatch(GetCommentsList(id, userId));
      const res = await dispatch(GetItemDetail(id, userId, 'board'));
      if (res) {
        dispatch(
          ActionTracker({
            target: 'tnd',
            action_type: 'VISUALIZZAZIONE',
            event_type: 'NEWS',
            category:
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              res?.data?.data?.items?.[0]?.category_label ||
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              res?.data?.data?.items?.[0]?.category,
          })
        );
      }
    }
  };

  useEffect(() => {
    getItemDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, userId]);

  useEffect(() => {
    if (newsDetail?.id && newsDetail?.title) {
      dispatch(
        setInfoIdsBreadcrumb({
          id: newsDetail?.id,
          nome: newsDetail?.title,
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newsDetail]);

  if (!id) {
    navigate(-1);
    return null;
  }

  const onCommentDelete = async (commentId: string, reason: string) => {
    await dispatch(DeleteComment(commentId, reason));
    id && userId && dispatch(GetCommentsList(id, userId));
  };

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

  const onEntityDelete = async (entityId: string, reason: string) => {
    await dispatch(DeleteItem(entityId, reason));
    navigate(-1);
  };

  return (
    <div className={clsx('container', 'mb-5')}>
      {backButton}
      <AnteprimaBachecaNews
        {...newsDetail}
        onEditNews={() =>
          dispatch(
            openModal({
              id: 'newsModal',
              payload: {
                title: 'Modifica news',
              },
            })
          )
        }
        onReportNews={() =>
          dispatch(
            openModal({
              id: 'report-modal',
              payload: {
                entity: 'board',
              },
            })
          )
        }
        onDeleteNews={() =>
          dispatch(
            openModal({
              id: 'delete-forum-entity',
              payload: {
                text: 'Confermi di voler eliminare questo contenuto?',
                id: id,
                entity: 'board',
                author: newsDetail.author
              },
            })
          )
        }
      />
      {newsDetail.enable_comments && commentsList.length ? (
        <div className='mt-5'>
          <CommentSection section='board' />
        </div>
      ) : null}
      <ManageReport />
      <ManageNews />
      <ManageComment />
      <DeleteForumModal
        onClose={() => dispatch(closeModal())}
        onConfirm={(payload: any) => {
          switch (payload.entity) {
            case 'board':
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

export default BachecaDetails;
