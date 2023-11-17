import { Dispatch, Selector } from '@reduxjs/toolkit';
import { OptionType } from '../../../components/Form/select';
import API from '../../../utils/apiHelper';
import { hideLoader, showLoader } from '../../features/app/appSlice';
import { RootState } from '../../store';
import { EntityFilterValuesPayloadI } from '../administrativeArea/administrativeAreaThunk';
import {
  setDocDetail,
  setDocsList,
  setForumFilterOptions,
  setNewsDetail,
  setNewsList,
  setTagsList,
  setTopicDetail,
  setTopicsList,
} from './forumSlice';
import { transformFiltersToQueryParams } from '../../../utils/common';
import { setEntityPagination } from '../administrativeArea/administrativeAreaSlice';
import { getUserHeaders } from '../user/userThunk';
import axios from 'axios';
import { getSessionValues } from '../../../utils/sessionHelper';

export const proxyCall = async (
  url: string,
  httpMethod: 'GET' | 'POST',
  body: any = {},
  filePayload: any = {}
) => {
  const { idProgramma, idProgetto, idEnte } = getUserHeaders();
  const codiceFiscale = JSON.parse(getSessionValues('user')).codiceFiscale;
  const codiceRuolo = JSON.parse(getSessionValues('profile')).codiceRuolo;
  body = {
    cfUtenteLoggato: codiceFiscale,
    codiceRuoloUtenteLoggato: codiceRuolo
  }
  const pass = false;
  if(body && body.cfUtenteLoggato && pass){
    return await API.post(`${process?.env?.NOTIFICHE}/drupal/forward`, {
      url: `/api${url}`,
      metodoHttp: httpMethod,
      cfUtenteLoggato: codiceFiscale,
      codiceRuoloUtenteLoggato: codiceRuolo,
      profilo: { idProgramma, idProgetto, idEnte },
      ...filePayload,
    });
  }
};

const GetNewsFiltersAction = {
  type: 'forum/GetNewsFilters',
};
export const GetNewsFilters =
  () => async (dispatch: Dispatch, select: Selector) => {
    try {
      dispatch(showLoader());
      dispatch({ ...GetNewsFiltersAction });
      const {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        forum: { filters },
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        user: {
          profilo: { idProgramma } = {
            idProgramma: '',
          },
        },
      } = select((state: RootState) => state);
      const body = {
        categories: [
          {
            label: '',
            value:
              (filters.categories || [])
                .map(({ value }: { value: string }) => value)
                .join(',') || '',
          },
        ],
        programs: [
          {
            label: '',
            value:
              (filters.programs || [])
                .map(({ value }: { value: string }) => value)
                .join(',') || `${idProgramma ? `public,${idProgramma}` : ''}`,
          },
        ],
        interventions: [
          {
            label: '',
            value:
              (filters.interventions || [])
                .map(({ value }: { value: string }) => value)
                .join(',') || '',
          },
        ],
      };
      const queryParameters = transformFiltersToQueryParams(body);
      const res = await proxyCall(`/board/filters${queryParameters}`, 'GET');
      if (res?.data?.data) {
        dispatch(
          setForumFilterOptions(
            Object.fromEntries(
              Object.entries(res?.data?.data).map(([key, value]: any) => [
                key,
                Object.entries(value).map(([k, v]) => ({ id: k, label: v })),
              ])
            )
          )
        );
        return res;
      }
    } catch (error) {
      console.log('GetNewsFilters error', error);
      return false;
    } finally {
      dispatch(hideLoader());
    }
  };

const GetNewsListAction = {
  type: 'forum/GetNewsList',
};
export const GetNewsList =
  (
    forcedFilters: {
      [key: string]: { label: string; value: string }[] | undefined;
    } = {},
    updateStore = true
  ) =>
  async (dispatch: Dispatch, select: Selector) => {
    try {
      dispatch(showLoader());
      dispatch({ ...GetNewsListAction, forcedFilters, updateStore });
      const {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        administrativeArea: { pagination },
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        forum: { filters },
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        user: {
          profilo: { idProgramma } = {
            idProgramma: '',
          },
        },
      } = select((state: RootState) => state);
      const body = {
        ...filters,
        categories: [
          {
            label: '',
            value:
              (filters.categories || [])
                .map(({ value }: { value: string }) => value)
                .join(',') || 'all',
          },
        ],
        programs: [
          {
            label: '',
            value:
              (filters.programs || [])
                .map(({ value }: { value: string }) => value)
                .join(',') ||
              `${idProgramma ? `public,${idProgramma}` : 'all'}`,
          },
        ],
        interventions: [
          {
            label: '',
            value:
              (filters.interventions || [])
                .map(({ value }: { value: string }) => value)
                .join(',') || 'all',
          },
        ],
        page: [{ value: Math.max(0, pagination.pageNumber - 1) }],
        items_per_page: [{ value: pagination.pageSize }],
        //sort: [{ value: filters.sort }],
        ...forcedFilters,
      };
      const queryParamFilters = transformFiltersToQueryParams(body).replace(
        'sort',
        'sort_by'
      );
      const res = await proxyCall(`/board/items${queryParamFilters}`, 'GET');
      if (updateStore) {
        if (res?.data?.data) {
          dispatch(setNewsList(res.data.data.items || []));
          dispatch(
            setEntityPagination({
              totalPages: res.data.data.pager?.total_pages || 0,
              totalElements: res.data.data.pager?.total_items || 0,
            })
          );
        }
      }
      return res;
    } catch (error) {
      console.log('GetNewsList error', error);
      return false;
    } finally {
      dispatch(hideLoader());
    }
  };

const GetTopicsFiltersAction = {
  type: 'forum/GetTopicsFilters',
};
export const GetTopicsFilters =
  () => async (dispatch: Dispatch, select: Selector) => {
    try {
      dispatch(showLoader());
      dispatch({ ...GetTopicsFiltersAction });
      const {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        forum: { filters },
      } = select((state: RootState) => state);
      const body = {
        categories: (filters.categories || []).map(
          ({ value }: { value: string }) => ({
            label: value,
            value,
          })
        ),
      };
      const queryParameters = transformFiltersToQueryParams(body);
      const res = await proxyCall(
        `/community/filters${queryParameters}`,
        'GET'
      );
      if (res?.data?.data) {
        dispatch(
          setForumFilterOptions(
            Object.fromEntries(
              Object.entries(res?.data?.data).map(([key, value]: any) => [
                key,
                Object.entries(value).map(([k, v]) => ({ id: k, label: v })),
              ])
            )
          )
        );
      }
      return res;
    } catch (error) {
      console.log('GetTopicsFilters error', error);
      return false;
    } finally {
      dispatch(hideLoader());
    }
  };

const GetTopicsListAction = {
  type: 'forum/GetTopicsList',
};
export const GetTopicsList =
  (
    forcedFilters?: {
      [key: string]: { label: string; value: string }[] | undefined;
    },
    updateStore = true
  ) =>
  async (dispatch: Dispatch, select: Selector) => {
    try {
      dispatch(showLoader());
      dispatch({ ...GetTopicsListAction, forcedFilters, updateStore });
      const {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        administrativeArea: { pagination },
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        forum: { filters },
      } = select((state: RootState) => state);
      const queryParamFilters = transformFiltersToQueryParams({
        ...filters,
        categories: filters.categories?.length
          ? filters.categories
          : [{ value: 'all' }],
        page: [{ value: Math.max(0, pagination.pageNumber - 1) }],
        items_per_page: [{ value: pagination.pageSize }],
        //sort: [{ value: filters.sort }],
        ...forcedFilters,
      }).replace('sort', 'sort_by');
      //.replace('categories', 'category')
      const res = await proxyCall(
        `/community/items${queryParamFilters}`,
        'GET'
      );
      if (updateStore) {
        if (res?.data?.data) {
          dispatch(setTopicsList(res.data.data.items || []));
          dispatch(
            setEntityPagination({
              totalPages: res.data.data.pager?.total_pages || 0,
              totalElements: res.data.data.pager?.total_items || 0,
            })
          );
        }
      }
      return res;
    } catch (error) {
      console.log('GetTopicsList error', error);
      return false;
    } finally {
      dispatch(hideLoader());
    }
  };

const GetDocumentsFiltersAction = {
  type: 'forum/GetDocumentsFilters',
};
export const GetDocumentsFilters =
  () => async (dispatch: Dispatch, select: Selector) => {
    try {
      dispatch(showLoader());
      dispatch({ ...GetDocumentsFiltersAction });
      const {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        forum: { filters },
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        user: {
          profilo: { idProgramma } = {
            idProgramma: '',
          },
        },
      } = select((state: RootState) => state);
      const body = {
        categories: [
          {
            label: '',
            value:
              (filters.categories || [])
                .map(({ value }: { value: string }) => value)
                .join(',') || '',
          },
        ],
        programs: [
          {
            label: '',
            value:
              (filters.programs || [])
                .map(({ value }: { value: string }) => value)
                .join(',') || `${idProgramma ? `public,${idProgramma}` : ''}`,
          },
        ],
        interventions: [
          {
            label: '',
            value:
              (filters.interventions || [])
                .map(({ value }: { value: string }) => value)
                .join(',') || '',
          },
        ],
      };
      const queryParameters = transformFiltersToQueryParams(body);
      const res = await proxyCall(`/document/filters${queryParameters}`, 'GET');
      if (res?.data?.data) {
        dispatch(
          setForumFilterOptions(
            Object.fromEntries(
              Object.entries(res?.data?.data).map(([key, value]: any) => [
                key,
                Object.entries(value).map(([k, v]) => ({ id: k, label: v })),
              ])
            )
          )
        );
      }
      return res;
    } catch (error) {
      console.log('GetDocumentsFilters error', error);
      return false;
    } finally {
      dispatch(hideLoader());
    }
  };

const GetDocumentsListAction = {
  type: 'forum/GetDocumentsList',
};
export const GetDocumentsList =
  (
    forcedFilters?: {
      [key: string]: { label: string; value: string }[] | undefined;
    },
    updateStore = true
  ) =>
  async (dispatch: Dispatch, select: Selector) => {
    try {
      dispatch(showLoader());
      dispatch({ ...GetDocumentsListAction, forcedFilters, updateStore });
      const {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        administrativeArea: { pagination },
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        forum: { filters },
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        user: {
          profilo: { idProgramma } = {
            idProgramma: '',
          },
        },
      } = select((state: RootState) => state);
      const queryParamFilters = transformFiltersToQueryParams({
        ...filters,
        categories: [
          {
            label: '',
            value:
              (filters.categories || [])
                .map(({ value }: { value: string }) => value)
                .join(',') || 'all',
          },
        ],
        programs: [
          {
            label: '',
            value:
              (filters.programs || [])
                .map(({ value }: { value: string }) => value)
                .join(',') ||
              `${idProgramma ? `public,${idProgramma}` : 'all'}`,
          },
        ],
        interventions: [
          {
            label: '',
            value:
              (filters.interventions || [])
                .map(({ value }: { value: string }) => value)
                .join(',') || 'all',
          },
        ],
        page: [{ value: Math.max(0, pagination.pageNumber - 1) }],
        items_per_page: [{ value: pagination.pageSize }],
        //sort: [{ value: filters.sort }],
        ...forcedFilters,
      }).replace('sort', 'sort_by');
      //.replace('categories', 'category')
      const res = await proxyCall(`/document/items${queryParamFilters}`, 'GET');
      if (updateStore) {
        if (res?.data?.data) {
          dispatch(setDocsList(res.data.data.items || []));
          dispatch(
            setEntityPagination({
              totalPages: res.data.data.pager?.total_pages || 0,
              totalElements: res.data.data.pager?.total_items || 0,
            })
          );
        }
      }
      return res;
    } catch (error) {
      console.log('GetDocumentsList error', error);
      return false;
    } finally {
      dispatch(hideLoader());
    }
  };

const GetItemsListAction = {
  type: 'forum/GetItemsList',
};
export const GetItemsList =
  (entity: 'board' | 'community' | 'document') =>
  async (dispatch: Dispatch, select: Selector) => {
    try {
      dispatch(showLoader());
      dispatch({ ...GetItemsListAction });
      const {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        administrativeArea: { filters },
      } = select((state: RootState) => state);
      const category = filters.filtroCategories
        ? filters.filtroCategories[0].value
        : 'all';
      const program = filters.filtroIdsProgrammi
        ? filters.filtroIdsProgrammi[0].value
        : 'all';
      const policy = filters.filtroPolicies
        ? filters.filtroPolicies[0].value
        : 'all';

      const res = await proxyCall(
        `/${entity}/items?categories=${category}&programs=${program}&interventions=${policy}`,
        'GET'
      );
      // const res = await API.get(`/${entity}/items`);
      if (res?.data?.data?.items) {
        switch (entity) {
          case 'board':
            dispatch(setNewsList(res.data.data.items));
            break;
          case 'community':
            dispatch(setTopicsList(res.data.data.items));
            break;
          case 'document':
            dispatch(setDocsList(res.data.data?.items));
            break;
          default:
            break;
        }
      }
    } catch (error) {
      console.log('GetItemsList error', error);
    } finally {
      dispatch(hideLoader());
    }
  };

const GetItemsBySearchAction = {
  type: 'forum/GetItemsBySearch',
};

export const GetItemsBySearch =
  (search: string) => async (dispatch: Dispatch) => {
    try {
      dispatch(showLoader());
      dispatch({ ...GetItemsBySearchAction });
      const res = await Promise.all([
        proxyCall(
          `/search/board/items?keys=${search}&page=0&items_per_page=24`,
          'GET'
        ),
        proxyCall(
          `/search/community/items?keys=${search}&page=0&items_per_page=24`,
          'GET'
        ),
        proxyCall(
          `/search/document/items?keys=${search}&page=0&items_per_page=24`,
          'GET'
        ),
      ]);
      if (res) {
        dispatch(
          setNewsList(
            (res[0]?.data?.data?.items || []).filter(
              ({ item_type }: { item_type: string }) =>
                item_type === 'board_item'
            )
          )
        );
        dispatch(
          setTopicsList(
            (res[1]?.data?.data?.items || []).filter(
              ({ item_type }: { item_type: string }) =>
                item_type === 'community_item'
            )
          )
        );
        dispatch(
          setDocsList(
            (res[2]?.data?.data?.items || []).filter(
              ({ item_type }: { item_type: string }) =>
                item_type === 'document_item'
            )
          )
        );
      }
    } catch (error) {
      console.log('GetItemsBySearch error', error);
    } finally {
      dispatch(hideLoader());
    }
  };

const GetItemsByUserAction = {
  type: 'forum/GetItemsByUser',
};

export const GetItemsByUser = () => async (dispatch: Dispatch) => {
  try {
    dispatch(showLoader());
    dispatch({ ...GetItemsByUserAction });
    const { idUtente } = getUserHeaders();
    const res = await Promise.all([
      proxyCall(
        `/user/${idUtente}/items?item_type=board_item&page=0&items_per_page=24`,
        'GET'
      ),
      proxyCall(
        `/user/${idUtente}/items?item_type=community_item&page=0&items_per_page=24`,
        'GET'
      ),
      proxyCall(
        `/user/${idUtente}/items?item_type=document_item&page=0&items_per_page=24`,
        'GET'
      ),
    ]);
    if (res) {
      dispatch(
        setNewsList(
          (res[0]?.data.data.items || []).filter(
            ({ item_type }: { item_type: string }) => item_type === 'board_item'
          )
        )
      );
      dispatch(
        setTopicsList(
          (res[1]?.data.data.items || []).filter(
            ({ item_type }: { item_type: string }) =>
              item_type === 'community_item'
          )
        )
      );
      dispatch(
        setDocsList(
          (res[2]?.data.data.items || []).filter(
            ({ item_type }: { item_type: string }) =>
              item_type === 'document_item'
          )
        )
      );
    }
  } catch (error) {
    console.log('GetItemsByUser error', error);
  } finally {
    dispatch(hideLoader());
  }
};

const GetItemDetailsAction = {
  type: 'forum/GetItemDetails',
};

export const GetItemDetail =
  (
    itemId: string,
    userId: string,
    entity: 'board' | 'community' | 'document'
  ) =>
  async (dispatch: Dispatch) => {
    try {
      dispatch(showLoader());
      dispatch({ ...GetItemDetailsAction });

      const res = await proxyCall(
        `/${entity}/item/${itemId}/user/${userId}`,
        'GET'
      );
      if (res) {
        switch (entity) {
          case 'board':
            dispatch(setNewsDetail(res.data.data.items[0]));
            break;
          case 'community':
            dispatch(setTopicDetail(res.data.data.items[0]));
            break;
          case 'document':
            dispatch(setDocDetail(res.data.data.items[0]));
            break;
          default:
            break;
        }
        return res;
      }
      return false;
    } catch (error) {
      console.log('GetItemsDetails error', error);
      return false;
    } finally {
      dispatch(hideLoader());
    }
  };

const GetItemsFilterValuesAction = {
  type: 'forum/GetItemsFilterValues',
};

export const GetItemsFilterValues =
  (payload: EntityFilterValuesPayloadI) =>
  async (dispatch: Dispatch, select: Selector) => {
    try {
      dispatch(showLoader());
      dispatch({ ...GetItemsFilterValuesAction, payload });
      const {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        forum: { filters },
      } = select((state: RootState) => state);
      const filtroRequest: {
        [key: string]: string | undefined;
      } = {};
      Object.keys(filters).forEach((filter: string) => {
        if (
          filter === 'criterioRicerca' ||
          filter === 'filtroCriterioRicerca'
        ) {
          filtroRequest[filter] =
            filters[filter]?.value || filters[filter] || null;
        } else {
          filtroRequest[filter] = filters[filter]?.map(
            (value: OptionType) => value.value
          );
        }
      });
      const body = filtroRequest;
      const NewsFiltersEndpoint = `/news`;
      const res = await API.post(NewsFiltersEndpoint, body);
      if (res?.data) {
        const filterResponse = {
          [payload.dropdownType]: res.data.data.map((option: string) => ({
            label:
              payload.dropdownType === 'categoria' ||
              payload.dropdownType === 'policies' ||
              payload.dropdownType === 'programmi'
                ? option[0] + option.slice(1).toLowerCase()
                : option,
            value: option,
          })),
        };

        if (payload.dropdownType === 'news') {
          filterResponse[payload.dropdownType] = res.data.data.map(
            (option: { nome: string; id: string | number }) => ({
              label: option.nome,
              value: option.id,
            })
          );
        }

        dispatch(setForumFilterOptions(filterResponse));
      }
    } catch (error) {
      console.log('GetNewsFilterValues error', error);
    } finally {
      dispatch(hideLoader());
    }
  };

const CreateItemAction = {
  type: 'forum/CreateItem',
};

export const CreateItem =
  (payload: any, entity: 'board' | 'community' | 'document') =>
  async (dispatch: Dispatch) => {
    try {
      dispatch(showLoader());
      dispatch({ ...CreateItemAction });
      const res = await proxyCall(`/${entity}/item/create`, 'POST', {
        ...payload,
        cover: undefined,
        attachment: undefined,
      });
      if (res?.data?.data) {
        let uploadFile = true;
        if (payload.cover?.data) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          uploadFile = await UploadFileLocal(
            res.data.data.id,
            payload.cover,
            'cover'
          );
        }
        if (payload.attachment?.data) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          uploadFile = await UploadFileLocal(
            res.data.data.id,
            payload.attachment,
            'attachment'
          );
        }
        return uploadFile ? res : false;
      }
      return res;
    } catch (error) {
      console.log('CreateItem error', error);
      return false;
    } finally {
      dispatch(hideLoader());
    }
  };

const UpdateItemAction = {
  type: 'forum/UpdateItem',
};

export const UpdateItem =
  (itemId: string, payload: any, entity: 'board' | 'community' | 'document') =>
  async (dispatch: Dispatch) => {
    try {
      dispatch(showLoader());
      dispatch({ ...UpdateItemAction });
      const res = await proxyCall(`/${entity}/item/${itemId}/update`, 'POST', {
        ...Object.fromEntries(
          Object.entries(payload).filter(([key, _value]) => key !== '')
        ),
        cover: undefined,
        attachment: undefined,
      });
      if (res?.data?.data) {
        let uploadFile = true;
        if (payload.cover?.data) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          uploadFile = await UploadFileLocal(
            res.data.data.id,
            payload.cover,
            'cover'
          );
        } else if (payload.removeCover) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          uploadFile = await RemoveFileLocal(res.data.data.id, 'cover');
        }
        if (payload.attachment?.data) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          uploadFile = await UploadFileLocal(
            res.data.data.id,
            payload.attachment,
            'attachment'
          );
        } else if (payload.removeAttachment) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          uploadFile = await RemoveFileLocal(res.data.data.id, 'attachment');
        }
        return uploadFile ? res : false;
      }
    } catch (error) {
      console.log('UpdateItem error', error);
      return false;
    } finally {
      dispatch(hideLoader());
    }
  };

const UploadFileLocal = async (
  itemId: string,
  payload: any,
  type: 'cover' | 'attachment'
) => {
  try {
    const res = await proxyCall(`/item/${itemId}/file/upload`, 'POST', null, {
      fileBase64ToUpload: payload.data,
      filenameToUpload: payload.name,
      isUploadFile: true,
      type,
    });
    return res;
  } catch (error) {
    console.log('UploadFileLocal error', error);
    return false;
  }
};

const RemoveFileLocal = async (
  itemId: string,
  type: 'cover' | 'attachment'
) => {
  try {
    const res = await proxyCall(`/item/${itemId}/file/upload`, 'POST', {
      type,
    });
    return res;
  } catch (error) {
    console.log('RemoveFileLocal error', error);
    return false;
  }
};

const DeleteItemAction = {
  type: 'forum/DeleteItem',
};

export const DeleteItem =
  (itemId: string, reason: string) => async (dispatch: Dispatch) => {
    try {
      dispatch(showLoader());
      dispatch({ ...DeleteItemAction });
      await proxyCall(`/item/${itemId}/delete`, 'POST', {
        reason: reason?.trim() !== '' ? reason : 'owner',
      });
    } catch (error) {
      console.log('DeleteItem error', error);
    } finally {
      dispatch(hideLoader());
    }
  };

const ManageItemEventAction = {
  type: 'forum/ManageItemEvent',
};

export const ManageItemEvent =
  (itemId: string, event: 'like' | 'unlike' | 'view' | 'downloaded') =>
  async (dispatch: Dispatch) => {
    try {
      dispatch(showLoader());
      dispatch({ ...ManageItemEventAction });
      const res = await proxyCall(`/item/${itemId}/${event}`, 'POST');
      return res;
    } catch (error) {
      console.log('ManageItemEvent error', error);
      return false;
    } finally {
      dispatch(hideLoader());
    }
  };

const GetTagsListAction = {
  type: 'forum/GetTagsList',
};

export const GetTagsList = () => async (dispatch: Dispatch) => {
  try {
    dispatch(showLoader());
    dispatch({ ...GetTagsListAction });
    const res = await proxyCall(`/tags/retrieve`, 'GET');
    // const res = await API.get(`/tags/retrieve`);
    if (res) {
      dispatch(setTagsList(res.data.data.items || []));
    }
  } catch (error) {
    console.log('GetItemsList error', error);
  } finally {
    dispatch(hideLoader());
  }
};

const DocumentRateAction = {
  type: 'forum/DocumentRate',
};

export const DocumentRate =
  (itemId: string, rate: 1 | 2) => async (dispatch: Dispatch) => {
    try {
      dispatch(showLoader());
      dispatch({ ...DocumentRateAction, itemId, rate });
      const res = await proxyCall(`/item/${itemId}/usefull`, 'POST', {
        status: rate,
      });
      return res;
    } catch (error) {
      console.log('DocumentRate error', error);
      return false;
    } finally {
      dispatch(hideLoader());
    }
  };

const ActionTrackerAction = {
  type: 'forum/ActionTracker',
};
interface ActionTrackerI {
  target: 'chat' | 'wd' | 'tnd';
  action_type?:
    | 'click'
    | 'CREAZIONE'
    | 'VISUALIZZAZIONE'
    | 'COMMENTO'
    | 'LIKE'
    | 'VISUALIZZAZIONE-DOWNLOAD'
    | 'RATING';
  event_type?: 'TOPIC' | 'NEWS' | 'DOCUMENTI';
  event_value?: 'Y' | 'N' | undefined;
  category?: string | undefined;
  codiceRuolo?: string;
  idProgramma?: string;
}
const newActionTracker = ({
  action_type,
  event_type,
  event_value,
  target,
  category,
  codiceRuolo,
  idProgramma,
}: ActionTrackerI) => ({
  event: (target === 'chat' || target === 'wd'
    ? 'click'
    : action_type
  )?.toLowerCase(),
  event_type: (target === 'tnd' ? event_type : null)?.toLowerCase(),
  event_value: event_value || null,
  role_code: codiceRuolo || null,
  category: category?.toString() || null,
  program_id: idProgramma?.toString() || null,
});
export const ActionTracker =
  (payload: ActionTrackerI) => async (dispatch: Dispatch, select: Selector) => {
    try {
      const { target, action_type = 'click' } = payload;
      dispatch({ ...ActionTrackerAction, ...payload });
      if (action_type) {
        const {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          user: {
            profilo: { idProgramma, codiceRuolo } = {
              idProgramma,
              codiceRuolo,
            },
          },
        } = select((state: RootState) => state);
        const body = newActionTracker({
          ...payload,
          codiceRuolo,
          idProgramma,
        });
        let BE_url = process?.env?.REACT_APP_BE_BASE_URL;
        if (BE_url?.charAt(BE_url?.length - 1) === '/') {
          BE_url = BE_url.slice(0, -1);
        }
        axios.post(
          `${BE_url}/drupal/forward`,
          {
            url: `/api/user/action/${target}/track`,
            metodoHttp: 'POST',
            body: body ? JSON.stringify(body) : null,
          },
          {
            headers: {
              'Content-Type': 'application/json',
              authToken: JSON.parse(getSessionValues('auth'))?.id_token,
              userRole: JSON.parse(getSessionValues('profile'))?.codiceRuolo,
            },
          }
        );
      }
    } catch (error) {
      console.log('ActionTracker error', error);
    }
  };

const WorkDocsRegistrationAction = {
  type: 'forum/WorkDocsRegistration',
};

export const WorkDocsRegistration =
  (body: {
    email: string;
    password: string;
    idUtente: string;
    username: string;
  }) =>
  async (dispatch: Dispatch) => {
    try {
      dispatch(showLoader());
      dispatch({ ...WorkDocsRegistrationAction, body });
      const res = await API.post(
        '/integrazione/workdocs/crea-attiva-utente',
        body
      );
      if (res) {
        return res;
      }
    } catch (error) {
      console.log('WorkDocsRegistration error', error);
      return false;
    } finally {
      dispatch(hideLoader());
    }
  };
