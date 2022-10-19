import { Dispatch } from "@reduxjs/toolkit";
import { hideLoader, showLoader } from "../../app/appSlice";
import { setReportsList } from "../forumSlice";
import { proxyCall } from "../forumThunk";

const GetReportsListAction = {
    type: 'forum/GetReportsList',
};

export const GetReportsList = () => async (dispatch: Dispatch) => {
    try {
        dispatch(showLoader());
        dispatch({ ...GetReportsListAction });
        const res = await proxyCall(`/reports`, 'GET')
        if (res) {
            dispatch(setReportsList(res.data.data.items || []));
        }

    } catch (error) {
        console.log('GetReportsList error', error);
    } finally {
        dispatch(hideLoader());
    }
};

const CreateItemReportAction = {
    type: 'forum/CreateItemReport',
};

export const CreateItemReport = (itemId: string, reason: string) => async (dispatch: Dispatch) => {
    try {
        dispatch(showLoader());
        dispatch({ ...CreateItemReportAction });
        await proxyCall(`/item/${itemId}/report`, 'POST', { reason })

    } catch (error) {
        console.log('CreateItemReport error', error);
    } finally {
        dispatch(hideLoader());
    }
};

const CreateCommentReportAction = {
    type: 'forum/CreateCommentReport',
};

export const CreateCommentReport = (commentId: string, reason: string) => async (dispatch: Dispatch) => {
    try {
        dispatch(showLoader());
        dispatch({ ...CreateCommentReportAction });
        await proxyCall(`/comment/${commentId}/report`, 'POST', { reason })

    } catch (error) {
        console.log('CreateCommentReport error', error);
    } finally {
        dispatch(hideLoader());
    }
};


const DeleteReportAction = {
    type: 'forum/DeleteReport',
};

export const DeleteReport = (reportId: string) => async (dispatch: Dispatch) => {
    try {
        dispatch(showLoader());
        dispatch({ ...DeleteReportAction });
        await proxyCall(`/report/${reportId}/delete`, 'POST', {})

    } catch (error) {
        console.log('DeleteReport error', error);
    } finally {
        dispatch(hideLoader());
    }
};