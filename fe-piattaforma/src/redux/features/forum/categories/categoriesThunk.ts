import { Dispatch, Selector } from '@reduxjs/toolkit';
import { hideLoader, showLoader } from '../../app/appSlice';
import { setCategoriesList } from '../forumSlice';
import { proxyCall } from '../forumThunk';
import { RootState } from '../../../store';
import { transformFiltersToQueryParams } from '../../../../utils/common';
import { setEntityPagination } from '../../administrativeArea/administrativeAreaSlice';

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
    keys?: string | undefined;
  }) =>
  async (dispatch: Dispatch, select: Selector) => {
    try {
      dispatch(showLoader());
      dispatch({ ...GetCategoriesListAction });
      const {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        administrativeArea: { pagination },
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        forum: { filters },
      } = select((state: RootState) => state);
      const itemPerPage = 30;
      const keys =
        (filters.searchValue || [])
          .map(({ value }: { value: string }) => value)
          .join(',')
          ?.trim() || undefined;
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
        page: [
          { label: 'page', value: Math.max(0, pagination.pageNumber - 1) },
        ],
        items_per_page: [
          { label: 'items_per_page', value: itemPerPage },
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
      if (res?.data?.data) {
        dispatch(setCategoriesList(res.data.data.items || []));
        dispatch(
          setEntityPagination({
            totalPages: res.data.data.pager?.total_pages || 0,
            totalElements: res.data.data.pager?.total_items || 0,
          })
        );
        return res;
      }
      return false;
    } catch (error) {
      console.log('GetCategoriesList error', error);
      return false;
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
