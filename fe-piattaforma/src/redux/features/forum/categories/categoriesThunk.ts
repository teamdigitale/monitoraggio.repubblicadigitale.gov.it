import { Dispatch, Selector } from '@reduxjs/toolkit';
import { hideLoader, showLoader } from '../../app/appSlice';
import { setCategoriesList } from '../forumSlice';
import { proxyCall } from '../forumThunk';
import { RootState } from '../../../store';
import { transformFiltersToQueryParams } from '../../../../utils/common';

const GetCategoriesListAction = {
  type: 'forum/GetCategorisList',
};

export const GetCategoriesList =
  ({
    type = 'all',
    keys,
  }: {
    type?:
      | 'all'
      | 'board_categories'
      | 'community_categories'
      | 'document_categories';
    keys?: string | undefined;
  }) =>
  async (dispatch: Dispatch, select: Selector) => {
    try {
      dispatch(showLoader());
      dispatch({ ...GetCategoriesListAction });
      const {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        forum: { filters },
      } = select((state: RootState) => state);
      const body = {
        categorySections: [
          {
            label: '',
            value:
              (filters.categorySections || [])
                .map(({ value }: { value: string }) => value)
                .join(',') ||
              type ||
              'all',
          },
        ],
      };
      const queryParamFilters = transformFiltersToQueryParams(body).replace(
        'categorySections',
        'term_type'
      );
      const res = await proxyCall(
        `/category/retrieve${queryParamFilters}${keys ? `&keys=${keys}` : ''}`,
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
