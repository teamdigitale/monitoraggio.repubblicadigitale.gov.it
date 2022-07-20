import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  EmptySection,
  Paginator,
  StatusChip,
  Table,
} from '../../../../../components';
import { newTable, TableRowI } from '../../../../../components/Table/table';
import { useAppSelector } from '../../../../../redux/hooks';
import {
  selectEntityFilters,
  selectEntityFiltersOptions,
  selectEntityList,
  selectEntityPagination,
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
  //GetAllUsers,
  GetFilterValuesUtenti,
} from '../../../../../redux/features/administrativeArea/user/userThunk';
import { updateBreadcrumb } from '../../../../../redux/features/app/appSlice';
import {
  DownloadEntityValues,
  GetEntityValues
} from '../../../../../redux/features/administrativeArea/administrativeAreaThunk';

const entity = 'utente';
const statusDropdownLabel = 'stati';
const ruoliDropdownLabel = 'ruoli';

const Users = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const usersList = useAppSelector(selectEntityList)?.utenti;
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
    dispatch(setEntityPagination({ pageSize: 8 }));
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
      usersList
        ? usersList?.map((td: any) => {
            return {
              id: td.id,
              label: td.nome,
              role: td.ruoli,
              status: <StatusChip status={td.stato} rowTableId={td.id} />,
              codiceFiscale: td.codiceFiscale,
            };
          })
        : []
    );
    return table;
  };

  const [tableValues, setTableValues] = useState(updateTableValues());

  useEffect(() => {
    if (Array.isArray(usersList)) setTableValues(updateTableValues());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usersList?.length]);

  const getUsersList = () => {
    //dispatch(GetAllUsers());
    dispatch(GetEntityValues({ entity: 'utente' }));
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
    dispatch(setEntityFilters({ criterioRicerca: searchValue }));
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

  const handleDownloadList = () => {
    dispatch(DownloadEntityValues({ entity }));
  };

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
      navigate(
        `/area-amministrativa/utenti/${
          typeof td === 'string' ? td : td?.codiceFiscale
        }`
      );
    },
  };

  const newUser = () => {
    dispatch(
      openModal({
        id: formTypes.USER,
        payload: {
          title: 'Crea un nuovo utente',
        },
      })
    );
  };

  const userCta = {
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
      {...userCta}
      cta={newUser}
      ctaDownload={handleDownloadList}
      resetFilterDropdownSelected={(filterKey: string) =>
        setFilterDropdownSelected(filterKey)
      }
    >
      {usersList?.length && tableValues?.values?.length ? (
        <>
          <Table
            {...tableValues}
            id='table'
            onActionClick={onActionClick}
            onCellClick={(field, row) => console.log(field, row)}
            //onRowClick={row => console.log(row)}
            withActions
            totalCounter={pagination?.totalElements}
          />
          <Paginator
            activePage={pagination?.pageNumber}
            center
            refID='#table'
            pageSize={pagination?.pageSize}
            total={pagination?.totalPages}
            onChange={handleOnChangePage}
          />
        </>
      ) : (
        <EmptySection
          title='Non sono presenti utenti'
          subtitle='associati al tuo ruolo'
          icon='it-note'
          withIcon
        />
      )}
      <ManageUsers creation />
    </GenericSearchFilterTableLayout>
  );
};

export default Users;
