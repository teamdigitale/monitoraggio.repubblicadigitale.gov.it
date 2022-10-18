import { Dispatch } from '@reduxjs/toolkit';
import API from '../../../../utils/apiHelper';
import { hideLoader, showLoader } from '../../app/appSlice';
import { setCategoriesList } from '../forumSlice';
import { proxyCall } from '../forumThunk';

const GetCategoriesListAction = {
  type: 'forum/GetCategorisList',
};

export const GetCategoriesList =
  ({
    type = 'all',
  }: {
    type?:
      | 'all'
      | 'board_categories'
      | 'community_categories'
      | 'document_categories';
  }) =>
  async (dispatch: Dispatch) => {
    try {
      dispatch(showLoader());
      dispatch({ ...GetCategoriesListAction });
      const res = await proxyCall(
        `/category/retrieve?term_type=${type}`,
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
    await proxyCall('/category/create', 'POST', { ...payload });
    // await API.post('/category/create', {
    //   ...payload,
    // });
  } catch (error) {
    console.log('CreateCategory error', error);
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
      await API.post(`/category/${categoryId}/update`, {
        ...payload,
      });
    } catch (error) {
      console.log('UpdateCategory error', error);
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
      await API.post(`/category/${categoryId}/delete`);
    } catch (error) {
      console.log('DeleteCategory error', error);
    } finally {
      dispatch(hideLoader());
    }
  };
