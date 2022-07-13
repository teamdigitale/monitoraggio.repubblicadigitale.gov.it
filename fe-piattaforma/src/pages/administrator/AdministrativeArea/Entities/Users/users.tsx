import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Paginator, StatusChip, Table } from '../../../../../components';
import { newTable, TableRowI } from '../../../../../components/Table/table';
import { useAppSelector } from '../../../../../redux/hooks';
import {
  selectEntityFilters,
  selectEntityFiltersOptions,
  selectEntityPagination,
  selectUsers,
  setEntityFilters,
  setEntityPagination,
} from '../../../../../redux/features/administrativeArea/administrativeAreaSlice';
import {
  DropdownFilterI,
  FilterI,
} from '../../../../../components/DropdownFilter/dropdownFilter';
import { formTypes, TableHeadingUsers } from '../utils';

import GenericSearchFilterTableLayout, {
  SearchInformationI,
} from '../../../../../components/genericSearchFilterTableLayout/genericSearchFilterTableLayout';
import { CRUDActionsI, CRUDActionTypes } from '../../../../../utils/common';
import { formFieldI } from '../../../../../utils/formHelper';
import { openModal } from '../../../../../redux/features/modal/modalSlice';
import { useNavigate } from 'react-router-dom';
import ManageUsers from '../modals/manageUsers';

import {
  GetAllUtenti,
  GetFilterValuesUtenti,
} from '../../../../../redux/features/administrativeArea/user/userThunk';
import { updateBreadcrumb } from '../../../../../redux/features/app/appSlice';

const statusDropdownLabel = 'stati';
const ruoliDropdownLabel = 'ruoli';

const Programmi = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const usersList = useAppSelector(selectUsers);
  const filtersList = useAppSelector(selectEntityFilters);
  const pagination = useAppSelector(selectEntityPagination);
  const dropdownFilterOptions = useAppSelector(selectEntityFiltersOptions);
  const [searchDropdown, setSearchDropdown] = useState<
    { filterId: string; value: formFieldI['value'] }[]
  >([]);
  const [filterDropdownSelected, setFilterDropdownSelected] =
    useState<string>('');

  const { criterioRicerca, ruoli, stati } = filtersList;

  const { pageNumber } = pagination;

  const getAllFilters = () => {
    // TODO: check chiavi filtri
    if (filterDropdownSelected !== 'filtroStati')
      dispatch(GetFilterValuesUtenti(statusDropdownLabel));
    if (filterDropdownSelected !== 'ruoli')
      dispatch(GetFilterValuesUtenti(ruoliDropdownLabel));
  };

  useEffect(() => {
    dispatch(setEntityPagination({ pageSize: 1 }));
    getAllFilters();
    dispatch(
      updateBreadcrumb([
        {
          label: 'Area Amministrativa',
          url: '/area-amministrativa',
          link: false,
        },
        {
          label: 'Utenti',
          url: '/area-amministrativa/utenti',
          link: true,
        },
      ])
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateTableValues = () => {
    const table = newTable(
      TableHeadingUsers,
      usersList.list.map((td) => {
        return {
          id: td.id,
          label: td.nome,
          role: td.ruoli,
          status: <StatusChip status={td.stato} rowTableId={td.id} />,
        };
      })
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
    if (Array.isArray(usersList) && usersList.length) setTableValues(updateTableValues());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usersList]);

  const getUsersList = () => {
    dispatch(GetAllUtenti());
  };

  useEffect(() => {
    getUsersList();
    getAllFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [criterioRicerca, ruoli, stati, pageNumber]);

  const handleOnChangePage = (pageNumber: number = pagination?.pageNumber) => {
    dispatch(setEntityPagination({ pageNumber }));
  };

  const handleOnSearch = (searchValue: string) => {
    dispatch(
      setEntityFilters({ nomeLike: { label: searchValue, value: searchValue } })
    );
  };

  const handleDropdownFilters = (
    values: FilterI[],
    filterKey: 'ruoli' | 'stati'
  ) => {
    setFilterDropdownSelected(filterKey);
    dispatch(setEntityFilters({ [filterKey]: [...values] }));
  };

  const handleOnSearchDropdownOptions = (
    searchValue: formFieldI['value'],
    filterId: 'ruoli' | 'stati'
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

  const dropdowns: DropdownFilterI[] = [
    {
      filterName: 'Ruoli',
      options: dropdownFilterOptions[ruoliDropdownLabel],
      id: ruoliDropdownLabel,
      onOptionsChecked: (options) =>
        handleDropdownFilters(options, ruoliDropdownLabel),
      values: filtersList[ruoliDropdownLabel] || [],
      handleOnSearch: (searchKey) => {
        handleOnSearchDropdownOptions(searchKey, ruoliDropdownLabel);
      },
      valueSearch: searchDropdown?.filter(
        (f) => f.filterId === ruoliDropdownLabel
      )[0]?.value,
    },
    {
      filterName: 'Stato',
      options: dropdownFilterOptions[statusDropdownLabel],
      id: statusDropdownLabel,
      onOptionsChecked: (options) =>
        handleDropdownFilters(options, statusDropdownLabel),
      values: filtersList[statusDropdownLabel] || [],
      handleOnSearch: (searchKey) =>
        handleOnSearchDropdownOptions(searchKey, statusDropdownLabel),
      valueSearch: searchDropdown?.filter(
        (f) => f.filterId === statusDropdownLabel
      )[0]?.value,
    },
  ];

  const searchInformation: SearchInformationI = {
    autocomplete: false,
    onHandleSearch: handleOnSearch,
    placeholder:
      "Inserisci il nome, il cognome, l'identificativo o il codice fiscale dell'utente",
    isClearable: true,
    title: 'Cerca programma',
  };

  const onActionClick: CRUDActionsI = {
    [CRUDActionTypes.VIEW]: (td: TableRowI | string) => {
      console.log(td);
      //TODO REPLACE WITH DYNAMIC ID WHEN WE HAVE THE APIS
      navigate('321321');
    },
  };

  const newProgram = () => {
    dispatch(
      openModal({
        id: formTypes.PROGRAMMA,
        payload: {
          title: 'Crea un nuovo programma',
        },
      })
    );
  };

  const programCta = {
    title: 'Area Amministrativa',
    subtitle:
      'Qui potrai gestire utenti, enti, programmi e progetti e creare i questionari',
    textCta: 'Crea Utente',
    iconCta: 'it-plus',
  };

  return (
    <GenericSearchFilterTableLayout
      searchInformation={searchInformation}
      dropdowns={dropdowns}
      filtersList={filtersList}
      {...programCta}
      cta={newProgram}
      resetFilterDropdownSelected={(filterKey: string) => setFilterDropdownSelected(filterKey)}
    >
      <Table
        {...tableValues}
        id='table'
        onActionClick={onActionClick}
        onCellClick={(field, row) => console.log(field, row)}
        //onRowClick={row => console.log(row)}
        withActions
      />
      <Paginator
        activePage={pagination?.pageNumber}
        center
        refID='#table'
        pageSize={pagination?.pageSize}
        total={usersList.list.length}
        onChange={handleOnChangePage}
      />
      <ManageUsers creation />
    </GenericSearchFilterTableLayout>
  );
};

export default Programmi;
