import { Dispatch } from '@reduxjs/toolkit';
import { hideLoader, showLoader } from '../../app/appSlice';
import { setCategoriesList } from '../forumSlice';
import { proxyCall } from '../forumThunk';

const GetCategoriesListAction = {
  type: 'forum/GetCategorisList',
};

export const GetCategoriesList =
  ({
    type = 'all',
    // TODO keep 1 char in keys because drupal API expects at least 1 char, anyway it'll filter starting from 2 chars
    keys = 'a',
  }: {
    type?:
      | 'all'
      | 'board_categories'
      | 'community_categories'
      | 'document_categories';
    keys?: string;
  }) =>
  async (dispatch: Dispatch) => {
    try {
      dispatch(showLoader());
      dispatch({ ...GetCategoriesListAction });
      const res = await proxyCall(
        `/category/retrieve?term_type=${type}${keys ? `&keys=${keys}` : ''}`,
        'GET'
      );
      // const res = await API.get(`/category/retrieve`)
      if (res) {
        dispatch(setCategoriesList(res.data.data.items || []));
      }
    } catch (error) {
      console.log('GetCategoriesList error', error);
    } finally {
      dispatch(hideLoader());
    }
  };

const CreateCategoryAction = {
  type: 'forum/CreateCategory',
};

export const CreateCategory = (payload: any) => async (dispatch: Dispatch) => {
  try {
    dispatch(showLoader());
    dispatch({ ...CreateCategoryAction });
    const res = await proxyCall('/category/create', 'POST', { ...payload });
    return res;
    // await API.post('/category/create', {
    //   ...payload,
    // });
  } catch (error) {
    console.log('CreateCategory error', error);
    return false;
  } finally {
    dispatch(hideLoader());
  }
};

const UpdateCategoryAction = {
  type: 'forum/UpdateCategory',
};

export const UpdateCategory =
  (payload: any, categoryId: string) => async (dispatch: Dispatch) => {
    try {
      dispatch(showLoader());
      dispatch({ ...UpdateCategoryAction });
      const res = await proxyCall(`/category/${categoryId}/update`, 'POST', {
        ...payload,
      });
      return res;
    } catch (error) {
      console.log('UpdateCategory error', error);
      return false;
    } finally {
      dispatch(hideLoader());
    }
  };

const DeleteCategoryAction = {
  type: 'forum/DeleteCategory',
};

export const DeleteCategory =
  (categoryId: string) => async (dispatch: Dispatch) => {
    try {
      dispatch(showLoader());
      dispatch({ ...DeleteCategoryAction });
      const res = await proxyCall(`/category/${categoryId}/delete`, 'POST', {});
      return res;
    } catch (error) {
      console.log('DeleteCategory error', error);
      return false;
    } finally {
      dispatch(hideLoader());
    }
  };
