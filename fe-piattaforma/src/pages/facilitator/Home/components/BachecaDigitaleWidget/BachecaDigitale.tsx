import clsx from 'clsx';
import { Container } from 'design-react-kit';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { EmptySection, Paginator } from '../../../../../components';
import CardShowcase from '../../../../../components/CardShowcase/cardShowcase';
import {
  DropdownFilterI,
  FilterI,
} from '../../../../../components/DropdownFilter/dropdownFilter';
import ForumLayout from '../../../../../components/ForumLayout/ForumLayout';
import {
  selectDevice,
  setPublishedContent,
} from '../../../../../redux/features/app/appSlice';
import {
  selectFilterOptions,
  selectFilters,
  selectNewsList,
  setForumFilters,
} from '../../../../../redux/features/forum/forumSlice';
import {
  GetNewsFilters,
  GetNewsList,
} from '../../../../../redux/features/forum/forumThunk';
import { openModal } from '../../../../../redux/features/modal/modalSlice';
import { useAppSelector } from '../../../../../redux/hooks';
import ManageNews from '../../../../administrator/AdministrativeArea/Entities/modals/manageNews';
import {
  selectEntityPagination,
  setEntityPagination,
} from '../../../../../redux/features/administrativeArea/administrativeAreaSlice';
import { formFieldI } from '../../../../../utils/formHelper';
import useGuard from '../../../../../hooks/guard';

const BachecaCta = {
  textCta: 'Crea News',
  iconCta: 'it-plus',
};

// for dropdown filters, don't change
const categoryDropdownLabel = 'categories';
const policyDropdownLabel = 'interventions';
const programDropdownLabel = 'programs';

const BachecaDigitale = () => {
  const device = useAppSelector(selectDevice);
  const newsList = useAppSelector(selectNewsList);
  const filtersList = useAppSelector(selectFilters);
  const dropdownFilterOptions = useAppSelector(selectFilterOptions);
  const pagination = useAppSelector(selectEntityPagination);
  const [searchDropdown, setSearchDropdown] = useState<
    { filterId: string; value: formFieldI['value'] }[]
  >([]);
  const [popularNews, setPopularNews] = useState([]);
  const dispatch = useDispatch();
  const { hasUserPermission } = useGuard();

  const { interventions, programs, categories, sort } = filtersList;
  const { pageNumber, pageSize } = pagination;

  const handleOnChangePage = (
    pageNumber: number = pagination?.pageNumber,
    pageSize = pagination?.pageSize
  ) => {
    dispatch(setEntityPagination({ pageNumber: pageNumber, pageSize }));
  };

  const getNewsList = () => {
    dispatch(GetNewsList());
  };

  const getPopularNews = async () => {
    const itemPerPage = '12';
    const res = await dispatch(
      GetNewsList(
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
      setPopularNews(res?.data?.data?.items);
    }
  };

  const getAllFilters = () => {
    dispatch(GetNewsFilters());
  };

  useEffect(() => {
    handleOnChangePage(1, 9);
    dispatch(setPublishedContent(true));
    getPopularNews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getNewsList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    interventions,
    programs,
    categories,
    sort?.[0]?.value,
    pageNumber,
    pageSize,
  ]);

  useEffect(() => {
    getAllFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interventions, programs, categories]);

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
    {
      filterName: 'Intervento',
      options: (dropdownFilterOptions['interventions'] || [])
        .map(({ label, id }) => ({
          label: id === 'public' ? 'Tutti gli interventi' : label,
          value: id,
        }))
        .sort((a, b) => {
          if (a.value > b.value) return -1;
          if (a.value < b.value) return 1;
          return 0;
        }),
      id: policyDropdownLabel,
      onOptionsChecked: (options) =>
        handleDropdownFilters(options, policyDropdownLabel),
      className: 'mr-3',
      values: filtersList[policyDropdownLabel] || [],
      handleOnSearch: (searchKey) => {
        handleOnSearchDropdownOptions(searchKey, policyDropdownLabel);
      },
      valueSearch: searchDropdown?.filter(
        (f) => f.filterId === policyDropdownLabel
      )[0]?.value,
    },
    {
      filterName: 'Programma',
      options: (dropdownFilterOptions['programs'] || [])
        .map(({ label, id }) => ({
          label,
          value: id,
        }))
        .sort((a, b) => {
          if (a.value > b.value) return -1;
          if (a.value < b.value) return 1;
          return 0;
        }),
      onOptionsChecked: (options) =>
        handleDropdownFilters(options, programDropdownLabel),
      id: programDropdownLabel,
      className: 'mr-3',
      values: filtersList[programDropdownLabel] || [],
      handleOnSearch: (searchKey) => {
        handleOnSearchDropdownOptions(searchKey, programDropdownLabel);
      },
      valueSearch: searchDropdown?.filter(
        (f) => f.filterId === programDropdownLabel
      )[0]?.value,
    },
  ];

  return (
    <div>
      <div>
        <ForumLayout
          title='Bacheca'
          sectionTitle='Le news più popolari'
          dropdowns={dropdowns}
          filtersList={filtersList}
          {...BachecaCta}
          sortFilter
          cta={
            hasUserPermission(['new.news'])
              ? () =>
                  dispatch(
                    openModal({
                      id: 'newsModal',
                    })
                  )
              : undefined
          }
          cards={popularNews}
          isNews
        >
          <Container className='pb-5'>
            <div
              className={clsx(
                'row',
                device.mediaIsPhone
                  ? 'justify-content-center'
                  : 'justify-content-start'
              )}
            >
              {newsList?.length ? (
                newsList.map((showCaseElement, i) => (
                  <div
                    key={i}
                    className={clsx(
                      'my-2',
                      !device.mediaIsPhone && 'mx-2',
                      'align-cards'
                    )}
                  >
                    <CardShowcase {...showCaseElement} role='button' />
                  </div>
                ))
              ) : (
                <EmptySection title='Non ci sono news' />
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
      <ManageNews creation />
    </div>
  );
};

export default BachecaDigitale;
