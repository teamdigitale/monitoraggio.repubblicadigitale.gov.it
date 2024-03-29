import { Dispatch } from '@reduxjs/toolkit';
import { hideLoader, showLoader } from '../../app/appSlice';
import { setCommentsList } from '../forumSlice';
import { proxyCall } from '../forumThunk';

const GetCommentsListAction = {
  type: 'forum/GetCommentsList',
};

export const GetCommentsList =
  (itemId: string, userId: string) => async (dispatch: Dispatch) => {
    try {
      dispatch(showLoader());
      dispatch({ ...GetCommentsListAction });
      const res = await proxyCall(
        `/item/${itemId}/comments/user/${userId}`,
        'GET'
      );
      // const res = await API.get(`/item/${itemId}/comments/user/${userId}`)
      if (res) {
        dispatch(setCommentsList(res.data?.data?.items || []));
      }
    } catch (error) {
      console.log('GetCommentsList error', error);
    } finally {
      dispatch(hideLoader());
    }
  };

const CreateCommentAction = {
  type: 'forum/CreateComment',
};

export const CreateComment =
  (itemId: string, comment: string) => async (dispatch: Dispatch) => {
    try {
      dispatch(showLoader());
      dispatch({ ...CreateCommentAction });
      if (comment) {
        const res = await proxyCall(`/item/${itemId}/comment`, 'POST', {
          comment_body: comment?.toString(),
        });
        return res;
      }
    } catch (error) {
      console.log('CreateComment error', error);
      return false;
    } finally {
      dispatch(hideLoader());
    }
  };

const UpdateCommentAction = {
  type: 'forum/UpdateComment',
};

export const UpdateComment =
  (commentId: string, comment: string) => async (dispatch: Dispatch) => {
    try {
      dispatch(showLoader());
      dispatch({ ...UpdateCommentAction });
      const res = await proxyCall(`/comment/${commentId}/update`, 'POST', {
        comment_body: comment,
      });
      return res;
    } catch (error) {
      console.log('UpdateComment error', error);
      return false;
    } finally {
      dispatch(hideLoader());
    }
  };

const ReplyCommentAction = {
  type: 'forum/ReplyComment',
};

export const ReplyComment =
  (commentId: string, comment: string) => async (dispatch: Dispatch) => {
    try {
      dispatch(showLoader());
      dispatch({ ...ReplyCommentAction });
      const res = await proxyCall(`/comment/${commentId}/reply`, 'POST', {
        comment_body: comment,
      });
      return res;
    } catch (error) {
      console.log('ReplyComment error', error);
      return false;
    } finally {
      dispatch(hideLoader());
    }
  };

const DeleteCommentAction = {
  type: 'forum/DeleteComment',
};

export const DeleteComment =
  (commentId: string, reason: string) => async (dispatch: Dispatch) => {
    try {
      dispatch(showLoader());
      dispatch({ ...DeleteCommentAction });
      await proxyCall(`/comment/${commentId}/delete`, 'POST', {
        reason: reason?.trim() !== "" ? reason : 'owner',
      });
    } catch (error) {
      console.log('DeleteComment error', error);
    } finally {
      dispatch(hideLoader());
    }
  };

const ManageCommentEventAction = {
  type: 'forum/ManageCommentEvent',
};

export const ManageCommentEvent =
  (commentId: string, event: 'like' | 'unlike' | 'view') =>
  async (dispatch: Dispatch) => {
    try {
      dispatch(showLoader());
      dispatch({ ...ManageCommentEventAction });
      await proxyCall(`/comment/${commentId}/${event}`, 'POST', {});
    } catch (error) {
      console.log('ManageCommentEvent error', error);
    } finally {
      dispatch(hideLoader());
    }
  };
