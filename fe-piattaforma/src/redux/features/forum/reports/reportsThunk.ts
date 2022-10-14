import { Dispatch } from "@reduxjs/toolkit";
import API from "../../../../utils/apiHelper";
import { hideLoader, showLoader } from "../../app/appSlice";
import { setReportsList } from "../forumSlice";

const GetReportsListAction = {
    type: 'forum/GetReportsList',
};

export const GetReportsList = () => async (dispatch: Dispatch) => {
    try {
        dispatch(showLoader());
        dispatch({ ...GetReportsListAction });
        const res = await API.get(`/reports`)
        if (res) {
            dispatch(setReportsList([...res.data.data.items]));
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
        await API.post(`/item/${itemId}/report`, { reason })

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
        await API.post(`/comment/${commentId}/report`, { reason })

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
        await API.post(`/report/${reportId}/delete`, {})

    } catch (error) {
        console.log('DeleteReport error', error);
    } finally {
        dispatch(hideLoader());
    }
};