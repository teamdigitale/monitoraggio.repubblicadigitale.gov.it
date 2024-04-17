import { useState, useEffect, useCallback } from 'react';
import { hideLoader, showLoader } from '../redux/features/app/appSlice';
import { proxyCall } from '../redux/features/forum/forumThunk';
import { addMoreCategoriesList, selectCategoriesList } from '../redux/features/forum/forumSlice';
import { useDispatch } from 'react-redux';
import store from '../redux/store';

type TermType = 'board_categories' | 'community_categories' | 'document_categories';


export const useInfiniteScrollCategories = (termType: TermType)=> {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const dispatch = useDispatch();

  const fetchData = useCallback(() => {
    if (currentPage >= totalPages && totalPages !== 0) return;

    const queryParamFilters = `?term_type=${termType}&page=${currentPage}&items_per_page=9`;

    dispatch(showLoader());
    proxyCall(`/category/retrieve${queryParamFilters}`, 'GET')
      .then(res => {
        if (res.data && res.data.data) {
          const { pager, items: newItems } = res.data.data;
          setTotalPages(pager.total_pages);
          const existingCategories: Set<number> = new Set(selectCategoriesList(store.getState()).map(item => item.id));
          const uniqueNewItems = newItems.filter((newItem: { id: number; }) => !existingCategories.has(newItem.id));
          dispatch(addMoreCategoriesList(uniqueNewItems));
        }
      })
      .catch(error => {
        console.error(`Failed to fetch ${termType} categories`, error);
      })
      .finally(() => {
        dispatch(hideLoader());
      });
  }, [currentPage, dispatch, termType, totalPages]);


  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleScrollToBottom = useCallback(() => {
    if (currentPage < totalPages) {
      setCurrentPage(prevPage => prevPage + 1);
    }
  }, [currentPage, totalPages]);

  return { handleScrollToBottom };
};


