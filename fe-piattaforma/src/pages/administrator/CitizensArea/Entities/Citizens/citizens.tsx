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
  GetEntityFilterValues,
  GetEntityValues,
} from '../../../../../redux/features/citizensArea/citizensAreaThunk';
import { useAppSelector } from '../../../../../redux/hooks';
import { Paginator, StatusChip, Table } from '../../../../../components';
import {
  DropdownFilterI,
  FilterI,
} from '../../../../../components/DropdownFilter/dropdownFilter';
import { newTable, TableRowI } from '../../../../../components/Table/table';
import { TableHeading } from '../../utils';
import { CRUDActionsI, CRUDActionTypes } from '../../../../../utils/common';
import { formFieldI } from '../../../../../utils/formHelper';
import SearchCitizenModal from '../SearchCitizenModal/searchCitizenModal';
import { openModal } from '../../../../../redux/features/modal/modalSlice';
import PageTitle from '../../../../../components/PageTitle/pageTitle';
import { updateBreadcrumb } from '../../../../../redux/features/app/appSlice';
//import { openModal } from '../../../../../redux/features/modal/modalSlice';

const entity = 'citizensArea';
const policyDropdownLabel = 'policies';
const programDropdownLabel = 'programmi';
const projectDropdownLabel = 'progetti';
const siteDropdownLabel = 'sedi';

const Citizens = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchDropdown, setSearchDropdown] = useState<
    { filterId: string; value: formFieldI['value'] }[]
  >([]);

  const filtersList = useAppSelector(selectEntityFilters);
  const pagination = useAppSelector(selectEntityPagination);
  const citizensList = useAppSelector(selectEntityList);
  const dropdownFilterOptions = useAppSelector(selectEntityFiltersOptions);

  const { criterioRicerca, policies, stati } = filtersList;

  const { pageNumber } = pagination;

  const handleOnSearch = (searchValue: string) => {
    dispatch(setEntityFilters({ criterioRicerca: searchValue }));
  };

  useEffect(() => {
    getListaCittadini();
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
  }, [criterioRicerca, policies, stati, pageNumber]);

  useEffect(() => {
    dispatch(setEntityPagination({ pageSize: 3 }));
    dispatch(GetEntityFilterValues(policyDropdownLabel));
    dispatch(GetEntityFilterValues(programDropdownLabel));
    dispatch(GetEntityFilterValues(projectDropdownLabel));
    dispatch(GetEntityFilterValues(siteDropdownLabel));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getListaCittadini = () => {
    dispatch(GetEntityValues({ entity }));
  };

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
    dispatch(
      GetEntityFilterValues(filterId, {
        filterName: searchValue,
      })
    ); // esempio di parametro con cui filtrare le opzioni tramite api
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

  const dropdowns: DropdownFilterI[] = [
    {
      filterName: 'Policy',
      options: dropdownFilterOptions[policyDropdownLabel],
      onOptionsChecked: (options) =>
        handleDropdownFilters(options, policyDropdownLabel),
      id: policyDropdownLabel,
      className: 'mr-3',
      values: filtersList[policyDropdownLabel],
      handleOnSearch: (searchKey) => {
        handleOnSearchDropdownOptions(searchKey, policyDropdownLabel);
      },
      valueSearch: searchDropdown?.filter(
        (f) => f.filterId === policyDropdownLabel
      )[0]?.value,
    },
    {
      filterName: 'Programma',
      options: dropdownFilterOptions[programDropdownLabel],
      onOptionsChecked: (options) =>
        handleDropdownFilters(options, programDropdownLabel),
      id: programDropdownLabel,
      className: 'mr-3',
      values: filtersList[programDropdownLabel],
      handleOnSearch: (searchKey) => {
        handleOnSearchDropdownOptions(searchKey, programDropdownLabel);
      },
      valueSearch: searchDropdown?.filter(
        (f) => f.filterId === programDropdownLabel
      )[0]?.value,
    },
    {
      filterName: 'Progetto',
      options: dropdownFilterOptions[projectDropdownLabel],
      onOptionsChecked: (options) =>
        handleDropdownFilters(options, projectDropdownLabel),
      id: projectDropdownLabel,
      className: 'mr-3',
      values: filtersList[projectDropdownLabel],
      handleOnSearch: (searchKey) => {
        handleOnSearchDropdownOptions(searchKey, projectDropdownLabel);
      },
      valueSearch: searchDropdown?.filter(
        (f) => f.filterId === projectDropdownLabel
      )[0]?.value,
    },
    {
      filterName: 'Sede',
      options: dropdownFilterOptions[siteDropdownLabel],
      onOptionsChecked: (options) =>
        handleDropdownFilters(options, siteDropdownLabel),
      id: siteDropdownLabel,
      values: filtersList[siteDropdownLabel],
      handleOnSearch: (searchKey) => {
        handleOnSearchDropdownOptions(searchKey, siteDropdownLabel);
      },
      valueSearch: searchDropdown?.filter(
        (f) => f.filterId === siteDropdownLabel
      )[0]?.value,
    },
  ];

  const handleDropdownFilters = (values: FilterI[], filterKey: string) => {
    dispatch(setEntityFilters({ [filterKey]: [...values] }));
  };

  const updateTableValues = () => {
    const table = newTable(
      TableHeading,
      (citizensList || []).map((td) => ({
        id: td.id,
        name: td.nome,
        submitted: td.submitted,
        onDraft: td.onDraft,
        status: <StatusChip status={td.status} rowTableId={td.id} />,
      }))
    );
    return {
      ...table,
      // TODO remove slice after BE integration
      values: table.values.slice(
        pagination?.pageNumber * pagination?.pageSize - pagination?.pageSize,
        pagination?.pageNumber * pagination?.pageSize
      ),
    };
  };

  const [tableValues, setTableValues] = useState(updateTableValues());

  useEffect(() => {
    setTableValues(updateTableValues());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [citizensList]);

  const onActionClick: CRUDActionsI = {
    [CRUDActionTypes.CREATE]: (td: TableRowI | string) => {
      console.log(td);
    },
    [CRUDActionTypes.VIEW]: (td: TableRowI | string) => {
      navigate(`${typeof td === 'string' ? td : td?.id}`);
    },
    [CRUDActionTypes.EDIT]: (td: TableRowI | string) => {
      console.log(td);
    },
    [CRUDActionTypes.DELETE]: (td: TableRowI | string) => {
      console.log(td);
    },
  };

  const PageTitleMock: {
    title: string;
    subtitle: string;
    textCta: string;
    iconCta: string;
    ctaPrintText: string;
  } = {
    title: 'Area Cittadini',
    subtitle:
      'Qui puoi consultare la lista dei cittadini e i questionari da compilare e gi?? completati',
    textCta: 'Compila questionario',
    iconCta: 'it-plus',
    ctaPrintText: 'Stampa questionario',
  };

  return (
    <>
      <PageTitle title={'I miei cittadini'} />
      <GenericSearchFilterTableLayout
        searchInformation={searchInformation}
        dropdowns={dropdowns}
        filtersList={filtersList}
        cta={() => {
          dispatch(openModal({ id: 'search-citizen-modal' }));
        }}
        ctaPrint={() => window.open('/stampa-questionario', '_blank')}
        {...PageTitleMock}
      >
        <div>
          <Table
            {...tableValues}
            id='table'
            //onActionClick={(action, row) => console.log(action, row)}
            onCellClick={(field, row) => console.log(field, row)}
            //onRowClick={row => console.log(row)}
            withActions
            onActionClick={onActionClick}
          />
          <Paginator
            activePage={pagination?.pageNumber}
            center
            refID='#table'
            pageSize={pagination?.pageSize}
            total={citizensList?.length}
            onChange={handleOnChangePage}
          />
        </div>
        <SearchCitizenModal />
      </GenericSearchFilterTableLayout>
    </>
  );
};

export default Citizens;
