import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import GenericSearchFilterTableLayout, {
  SearchInformationI,
} from '../../../../../components/genericSearchFilterTableLayout/genericSearchFilterTableLayout';
import {
  selectEntityFilters,
  selectEntityFiltersOptions,
  selectEntityList,
  selectEntityPagination,
  setEntityFilters,
  setEntityPagination,
} from '../../../../../redux/features/citizensArea/citizensAreaSlice';
import {
  DownloadEntityValues,
  GetEntityFilterValues,
  GetEntityValues,
} from '../../../../../redux/features/citizensArea/citizensAreaThunk';
import { useAppSelector } from '../../../../../redux/hooks';
import { EmptySection, Paginator, Table } from '../../../../../components';
import {
  DropdownFilterI,
  FilterI,
} from '../../../../../components/DropdownFilter/dropdownFilter';
import { newTable, TableRowI } from '../../../../../components/Table/table';
import { TableHeading } from '../../utils';
import { CRUDActionsI, CRUDActionTypes } from '../../../../../utils/common';
import { formFieldI } from '../../../../../utils/formHelper';
import SearchCitizenModal from '../SearchCitizenModal/searchCitizenModal';
import PageTitle from '../../../../../components/PageTitle/pageTitle';
import { updateBreadcrumb } from '../../../../../redux/features/app/appSlice';

const entity = 'citizensArea';
const siteDropdownLabel = 'idsSedi';

const Citizens = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchDropdown, setSearchDropdown] = useState<
    { filterId: string; value: formFieldI['value'] }[]
  >([]);
  const [filterDropdownSelected, setFilterDropdownSelected] =
    useState<string>('');

  const filtersList = useAppSelector(selectEntityFilters);
  const pagination = useAppSelector(selectEntityPagination);
  const citizensList = useAppSelector(selectEntityList);
  const dropdownFilterOptions = useAppSelector(selectEntityFiltersOptions);

  const { criterioRicerca, idsSedi } = filtersList;

  const { pageNumber } = pagination;

  const handleOnSearch = (searchValue: string) => {
    dispatch(setEntityFilters({ criterioRicerca: searchValue }));
  };

  useEffect(() => {
    dispatch(setEntityPagination({ pageSize: 8 }));
    dispatch(
      updateBreadcrumb([
        {
          label: 'Area Cittadini',
          url: '/area-cittadini',
          link: false,
        },
        {
          label: 'I miei cittadini',
          url: '/area-cittadini',
          link: true,
        },
      ])
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getListaCittadini = () => {
    dispatch(GetEntityValues({ entity }));
  };

  useEffect(() => {
    getListaCittadini();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [criterioRicerca, idsSedi, pageNumber]);

  useEffect(() => {
    if (filterDropdownSelected !== siteDropdownLabel) {
      dispatch(GetEntityFilterValues('sedi'));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [criterioRicerca, idsSedi]);

  const handleOnSearchDropdownOptions = (
    searchValue: formFieldI['value'],
    filterId: string
  ) => {
    const searchDropdownValues = [...searchDropdown];
    if (
      searchDropdownValues?.length > 0 &&
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

  const handleOnChangePage = (pageNumber: number = pagination?.pageNumber) => {
    dispatch(setEntityPagination({ pageNumber }));
  };

  const searchInformation: SearchInformationI = {
    autocomplete: false,
    onHandleSearch: handleOnSearch,
    placeholder: 'Inserisci il codice fiscale del cittadino che stai cercando',
    isClearable: true,
    title: 'Cerca cittadino',
  };

  const handleDropdownFilters = (values: FilterI[], filterKey: string) => {
    setFilterDropdownSelected(filterKey);
    dispatch(setEntityFilters({ [filterKey]: [...values] }));
  };

  const dropdowns: DropdownFilterI[] = [
    {
      filterName: 'Sede',
      options: dropdownFilterOptions['sedi'],
      onOptionsChecked: (options) =>
        handleDropdownFilters(options, siteDropdownLabel),
      id: siteDropdownLabel,
      values: filtersList[siteDropdownLabel] || [],
      handleOnSearch: (searchKey) => {
        handleOnSearchDropdownOptions(searchKey, siteDropdownLabel);
      },
      valueSearch: searchDropdown?.filter(
        (f) => f.filterId === siteDropdownLabel
      )[0]?.value,
    },
  ];

  const updateTableValues = () => {
    const table = newTable(
      TableHeading,
      (citizensList || []).map((td) => ({
        id: td.id,
        name: td.nome + ' ' + td.cognome,
        numeroServizi: td.numeroServizi,
        numeroQuestionariCompilati: td.numeroQuestionariCompilati,
      }))
    );
    return table;
  };

  const [tableValues, setTableValues] = useState(updateTableValues());

  useEffect(() => {
    if (Array.isArray(citizensList) && citizensList.length)
      setTableValues(updateTableValues());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [citizensList?.length]);

  const onActionClick: CRUDActionsI = {
    [CRUDActionTypes.VIEW]: (td: TableRowI | string) => {
      navigate(`${typeof td === 'string' ? td : td?.id}`);
    },
    // [CRUDActionTypes.EDIT]: (td: TableRowI | string) => {
    //   console.log(td);
    // },
    // [CRUDActionTypes.DELETE]: (td: TableRowI | string) => {
    //   console.log(td);
    // },
  };

  const handleDownloadList = () => {
    dispatch(DownloadEntityValues());
  };

  const PageTitleCitizen: {
    title: string;
    subtitle: string;
    textCta: string;
    iconCta: string;
    ctaPrintText: string;
  } = {
    title: 'Area Cittadini',
    subtitle:
      'Qui puoi consultare la lista dei cittadini e i questionari da compilare e già completati',
    textCta: '',
    iconCta: '',
    ctaPrintText: '',
  };

  return (
    <>
      <PageTitle title='I miei cittadini' />
      <GenericSearchFilterTableLayout
        searchInformation={searchInformation}
        dropdowns={dropdowns}
        filtersList={filtersList}
        // cta={() => {
        //   dispatch(openModal({ id: 'search-citizen-modal' }));
        // }}
        // ctaPrint={() => window.open('/stampa-questionario', '_blank')}
        {...PageTitleCitizen}
        resetFilterDropdownSelected={(filterKey: string) =>
          setFilterDropdownSelected(filterKey)
        }
        citizen
        ctaDownload={handleDownloadList}
      >
        {citizensList?.length && tableValues?.values?.length ? (
          <div>
            <Table
              {...tableValues}
              id='table'
              onCellClick={(field, row) => console.log(field, row)}
              //onRowClick={row => console.log(row)}
              withActions
              onActionClick={onActionClick}
              totalCounter={pagination?.totalElements}
            />
            {pagination?.pageNumber ? (
              <Paginator
                activePage={pagination?.pageNumber}
                center
                refID='#table'
                pageSize={pagination?.pageSize}
                total={pagination?.totalPages}
                onChange={handleOnChangePage}
              />
            ) : null}
          </div>
        ) : (
          <EmptySection title='Non ci sono cittadini' />
        )}
        <SearchCitizenModal />
      </GenericSearchFilterTableLayout>
    </>
  );
};

export default Citizens;
