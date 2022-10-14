import { Dispatch } from "@reduxjs/toolkit";
import API from "../../../../utils/apiHelper";
import { hideLoader, showLoader } from "../../app/appSlice";
import { setCommentsList } from "../forumSlice";

const GetCommentsListAction = {
    type: 'forum/GetCommentsList',
};

export const GetCommentsList = (itemId: string) => async (dispatch: Dispatch) => {
    try {
        dispatch(showLoader());
        dispatch({ ...GetCommentsListAction });
        const res = await API.get(`/item/${itemId}/comments/user/userId`)
        if (res) {
            dispatch(setCommentsList([...res.data.data.items]));
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

export const CreateComment = (itemId: string, comment: string) => async (dispatch: Dispatch) => {
    try {
        dispatch(showLoader());
        dispatch({ ...CreateCommentAction });
        await API.post(`/item/${itemId}/create`, {
            comment_body: comment
        })


    } catch (error) {
        console.log('CreateComment error', error);
    } finally {
        dispatch(hideLoader());
    }
};

const UpdateCommentAction = {
    type: 'forum/UpdateComment',
};

export const UpdateComment = (commentId: string, comment: string) => async (dispatch: Dispatch) => {
    try {
        dispatch(showLoader());
        dispatch({ ...UpdateCommentAction });
        await API.post(`/comment/${commentId}/update`, {
            comment_body: comment
        })


    } catch (error) {
        console.log('UpdateComment error', error);
    } finally {
        dispatch(hideLoader());
    }
};


const ReplyCommentAction = {
    type: 'forum/ReplyComment',
};

export const ReplyComment = (commentId: string, comment: string) => async (dispatch: Dispatch) => {
    try {
        dispatch(showLoader());
        dispatch({ ...ReplyCommentAction });
        await API.post(`/comment/${commentId}/reply`, {
            comment_body: comment
        })


    } catch (error) {
        console.log('ReplyComment error', error);
    } finally {
        dispatch(hideLoader());
    }
};


const DeleteCommentAction = {
    type: 'forum/DeleteComment',
};

export const DeleteComment = (commentId: string) => async (dispatch: Dispatch) => {
    try {
        dispatch(showLoader());
        dispatch({ ...DeleteCommentAction });
        await API.post(`/comment/${commentId}/delete`, {
        })

    } catch (error) {
        console.log('DeleteComment error', error);
    } finally {
        dispatch(hideLoader());
    }
};