import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { PaginationI } from '../administrativeArea/administrativeAreaSlice';

export interface ForumStateI {
  filters: {
    [key: string]:
      | { label: string; value: string | number | any[] }[]
      | undefined;
  };
  filterOptions: {
    [key: string]: { label: string; id: string | number | any[] }[] | undefined;
  };
  pagination: PaginationI;
  news: {
    list: any[];
    detail: any;
  };
  topics: {
    list: any[];
    detail: any;
  };
  docs: {
    list: any[];
    detail: any;
  };
  comments: any[];
  categories: any[];
  tags: any[];
  reports: any[];
  notifications: any[];
}

const initialState: ForumStateI = {
  filters: {
    sort: [{ label: 'created', value: 'created' }],
  },
  filterOptions: {
    categories: [],
    programs: [],
    interventions: [],
  },
  pagination: {
    pageSize: 8,
    pageNumber: 1,
    totalPages: 1,
    totalElements: 0,
  },
  news: {
    list: [],
    detail: {},
  },
  topics: {
    list: [],
    detail: {},
  },
  docs: {
    list: [],
    detail: {},
  },
  comments: [],
  categories: [],
  tags: [],
  reports: [],
  notifications: [],
};

export const forumSlice = createSlice({
  name: 'forum',
  initialState,
  reducers: {
    setNewsList: (state, action: PayloadAction<any>) => {
      state.news.list = action.payload;
    },
    setNewsDetail: (state, action: PayloadAction<any>) => {
      state.news.detail = { ...action.payload };
    },
    setTopicsList: (state, action: PayloadAction<any>) => {
      state.topics.list = [...action.payload];
    },
    setTopicDetail: (state, action: PayloadAction<any>) => {
      state.topics.detail = { ...action.payload };
    },
    setDocsList: (state, action: PayloadAction<any>) => {
      state.docs.list = [...action.payload];
    },
    setDocDetail: (state, action: PayloadAction<any>) => {
      state.docs.detail = { ...action.payload };
    },
    setForumFilters: (state, action: PayloadAction<any>) => {
      state.filters = {
        ...state.filters,
        ...action.payload,
      };
    },
    setForumFilterOptions: (state, action: PayloadAction<any>) => {
      state.filterOptions = {
        ...state.filterOptions,
        ...action.payload,
      };
    },
    setCategoriesList: (state, action: PayloadAction<any>) => {
      state.categories = [...action.payload];
    },
    setCommentsList: (state, action: PayloadAction<any>) => {
      state.comments = [...action.payload];
    },
    setTagsList: (state, action: PayloadAction<any>) => {
      state.tags = [...action.payload];
    },
    setReportsList: (state, action: PayloadAction<any>) => {
      state.reports = [...action.payload];
    },
    setNotificationsList: (state, action: PayloadAction<any>) => {
      state.notifications = [...action.payload];
    },
    resetForumRecords: () => initialState,
    cleanForumFilters: (state, action: PayloadAction<any>) => {
      if (action.payload) {
        let newFilterValue = null;
        if (Array.isArray(state.filters[action.payload.filterKey])) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          newFilterValue = state.filters[action.payload.filterKey].filter(
            (f: any) => f.value !== action.payload.value
          );
          if (!newFilterValue?.length) {
            newFilterValue = null;
          }
        }

        state.filters = {
          ...state.filters,
          [action.payload.filterKey]: newFilterValue,
        };
      } else {
        state.filters = initialState.filters;
      }
    },
  },
});

export const {
  setNewsList,
  setNewsDetail,
  setTopicsList,
  setTopicDetail,
  setDocsList,
  setDocDetail,
  setForumFilters,
  setForumFilterOptions,
  setCategoriesList,
  setCommentsList,
  setTagsList,
  setReportsList,
  setNotificationsList,
  resetForumRecords,
  cleanForumFilters,
} = forumSlice.actions;

export const selectNewsList = (state: RootState) => state.forum.news.list;
export const selectNewsDetail = (state: RootState) => state.forum.news.detail;
export const selectTopicsList = (state: RootState) => state.forum.topics.list;
export const selectTopicDetail = (state: RootState) =>
  state.forum.topics.detail;
export const selectDocsList = (state: RootState) => state.forum.docs.list;
export const selectDocDetail = (state: RootState) => state.forum.docs.detail;
export const selectFilters = (state: RootState) => state.forum.filters;
export const selectFilterOptions = (state: RootState) =>
  state.forum.filterOptions;
export const selectCategoriesList = (state: RootState) =>
  state.forum.categories;
export const selectCommentsList = (state: RootState) => state.forum.comments;
export const selectTagsList = (state: RootState) => state.forum.tags;
export const selectReportsList = (state: RootState) => state.forum.reports;
export const selectNotificationsList = (state: RootState) =>
  state.forum.notifications;

export default forumSlice.reducer;
