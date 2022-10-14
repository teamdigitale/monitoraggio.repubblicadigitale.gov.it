import { Dispatch } from "@reduxjs/toolkit";
import API from "../../../../utils/apiHelper";
import { hideLoader, showLoader } from "../../app/appSlice";
import { setNotificationsList } from "../forumSlice";

const GetUserNotificationsListAction = {
    type: 'forum/GetUserNotificationsList',
};

export const GetUserNotificationsList = () => async (dispatch: Dispatch) => {
    try {
        dispatch(showLoader());
        dispatch({ ...GetUserNotificationsListAction });
        const res = await API.get(`/reports`)
        if (res) {
            dispatch(setNotificationsList([...res.data.data.items]));
        }

    } catch (error) {
        console.log('GetUserNotifications error', error);
    } finally {
        dispatch(hideLoader());
    }
};

const ReadNotificationAction = {
    type: 'forum/ReadNotification',
};

export const ReadNotification = (notificationId: string) => async (dispatch: Dispatch) => {
    try {
        dispatch(showLoader());
        dispatch({ ...ReadNotificationAction });
        await API.post(`notification/${notificationId}/read`)

    } catch (error) {
        console.log('ReadNotification error', error);
    } finally {
        dispatch(hideLoader());
    }
};

const DeleteNotificationAction = {
    type: 'forum/DeleteNotification',
};

export const DeleteNotification = (notificationId: string) => async (dispatch: Dispatch) => {
    try {
        dispatch(showLoader());
        dispatch({ ...DeleteNotificationAction });
        await API.post(`notification/${notificationId}/delete`)

    } catch (error) {
        console.log('DeleteNotification error', error);
    } finally {
        dispatch(hideLoader());
    }
};