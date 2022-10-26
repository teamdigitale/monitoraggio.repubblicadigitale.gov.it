import clsx from 'clsx';
import { Container } from 'design-react-kit';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { CardCommunity, EmptySection, Paginator } from '../../../components';
import {
  DropdownFilterI,
  FilterI,
} from '../../../components/DropdownFilter/dropdownFilter';
import ForumLayout from '../../../components/ForumLayout/ForumLayout';
import { setPublishedContent } from '../../../redux/features/app/appSlice';
import {
  selectFilterOptions,
  selectFilters,
  selectTopicsList,
  setForumFilters,
} from '../../../redux/features/forum/forumSlice';

import {
  GetTopicsFilters,
  GetTopicsList,
} from '../../../redux/features/forum/forumThunk';

import { openModal } from '../../../redux/features/modal/modalSlice';

import { useAppSelector } from '../../../redux/hooks';
import ManageTopic from '../../administrator/AdministrativeArea/Entities/modals/manageTopic';
/* import { CommunityPropsMock } from '../../facilitator/Home/components/CommunityWidget/communityWidget'; */
import './community.scss';
import {
  selectEntityPagination,
  setEntityPagination,
} from '../../../redux/features/administrativeArea/administrativeAreaSlice';
import { formFieldI } from '../../../utils/formHelper';
import useGuard from '../../../hooks/guard';

// for dropdown filters, don't change
const categoryDropdownLabel = 'categories';

const TopicCta = {
  textCta: 'Crea topic',
  iconCta: 'it-plus',
};

const Community = () => {
  const topicsList = useAppSelector(selectTopicsList);
  const filtersList = useAppSelector(selectFilters);
  const dropdownFilterOptions = useAppSelector(selectFilterOptions);
  const pagination = useAppSelector(selectEntityPagination);
  const [searchDropdown, setSearchDropdown] = useState<
    { filterId: string; value: formFieldI['value'] }[]
  >([]);
  const [popularTopics, setPopularTopics] = useState([]);
  const dispatch = useDispatch();
  const { hasUserPermission } = useGuard();

  const { categories, sort } = filtersList;
  const { pageNumber } = pagination;

  const handleOnChangePage = (
    pageNumber: number = pagination?.pageNumber,
    pageSize = pagination?.pageSize
  ) => {
    dispatch(setEntityPagination({ pageNumber, pageSize }));
  };

  const getTopicsList = () => {
    dispatch(GetTopicsList());
  };

  const getPopularTopics = async () => {
    const itemPerPage = '12';
    const res = await dispatch(
      GetTopicsList(
        {
          sort: [{ label: 'likes', value: 'likes' }],
          page: [{ label: '0', value: '0' }],
          items_per_page: [{ label: itemPerPage, value: itemPerPage }],
        },
        false
      )
    );
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (res?.data?.data?.items) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      setPopularTopics(res?.data?.data?.items);
    }
  };

  const getAllFilters = () => {
    dispatch(GetTopicsFilters());
  };

  useEffect(() => {
    handleOnChangePage(1, 9);
    dispatch(setPublishedContent(true));
    getPopularTopics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getTopicsList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categories, sort?.[0], pageNumber]);

  useEffect(() => {
    getAllFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categories]);

  const handleDropdownFilters = (values: FilterI[], filterKey: string) => {
    dispatch(setForumFilters({ [filterKey]: [...values] }));
  };

  const handleOnSearchDropdownOptions = (
    searchValue: formFieldI['value'],
    filterId: string
  ) => {
    const searchDropdownValues = [...searchDropdown];
    if (
      searchDropdownValues?.length &&
      searchDropdownValues?.findIndex((f) => f.filterId === filterId) !== -1
    ) {
      searchDropdownValues[
        searchDropdownValues.findIndex((f) => f.filterId === filterId)
      ].value = searchValue;
    } else {
      searchDropdownValues.push({ filterId: filterId, value: searchValue });
    }
    setSearchDropdown(searchDropdownValues);
  };

  const dropdowns: DropdownFilterI[] = [
    {
      filterName: 'Categoria',
      options:
        dropdownFilterOptions && dropdownFilterOptions['categories']
          ? dropdownFilterOptions['categories'].map(({ label, id }) => ({
              label,
              value: id,
            }))
          : [],
      id: categoryDropdownLabel,
      onOptionsChecked: (options) =>
        handleDropdownFilters(options, categoryDropdownLabel),
      className: 'mr-3',
      values: filtersList[categoryDropdownLabel] || [],
      handleOnSearch: (searchKey) => {
        handleOnSearchDropdownOptions(searchKey, categoryDropdownLabel);
      },
      valueSearch: searchDropdown?.filter(
        (f) => f.filterId === categoryDropdownLabel
      )[0]?.value,
    },
  ];

  return (
    <div>
      <div>
        <ForumLayout
          title='Community'
          sectionTitle='I topic più popolari'
          dropdowns={dropdowns}
          filtersList={{}}
          {...TopicCta}
          sortFilter
          cta={
            hasUserPermission(['new.topic'])
              ? () =>
                  dispatch(
                    openModal({
                      id: 'topicModal',
                      payload: {
                        title: 'Crea topic',
                      },
                    })
                  )
              : undefined
          }
          cards={popularTopics}
          isCommunity
        >
          <Container className='pb-5'>
            <div className='row'>
              {topicsList?.length ? (
                topicsList.map((communityElement, i) => (
                  <div
                    key={i}
                    className={clsx(
                      'col-12',
                      'col-md-6',
                      'col-lg-4',
                      'my-2',
                      'align-cards'
                    )}
                  >
                    <CardCommunity {...communityElement} role='button' />
                  </div>
                ))
              ) : (
                <EmptySection title='Non ci sono topic' />
              )}
            </div>
          </Container>
          {pagination?.totalPages ? (
            <div className='pb-5'>
              <Paginator
                activePage={pagination?.pageNumber}
                center
                pageSize={pagination?.pageSize}
                total={pagination?.totalPages}
                onChange={handleOnChangePage}
              />
            </div>
          ) : null}
        </ForumLayout>
      </div>
      <ManageTopic creation />
    </div>
  );
};

export default Community;
