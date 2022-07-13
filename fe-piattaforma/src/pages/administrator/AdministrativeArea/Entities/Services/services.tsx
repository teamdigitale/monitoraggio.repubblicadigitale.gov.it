import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Paginator, StatusChip, Table } from '../../../../../components';
import { newTable, TableRowI } from '../../../../../components/Table/table';
import { useAppSelector } from '../../../../../redux/hooks';
import {
  DropdownFilterI,
  FilterI,
} from '../../../../../components/DropdownFilter/dropdownFilter';
import { TableHeadingEventsList } from '../../../CitizensArea/utils';

import GenericSearchFilterTableLayout, {
  SearchInformationI,
} from '../../../../../components/genericSearchFilterTableLayout/genericSearchFilterTableLayout';
import { CRUDActionsI, CRUDActionTypes } from '../../../../../utils/common';
import { formFieldI } from '../../../../../utils/formHelper';
import { openModal } from '../../../../../redux/features/modal/modalSlice';
import { useNavigate } from 'react-router-dom';
import {
  GetAllEvents,
  GetEntityFilterValues,
} from '../../../../../redux/features/administrativeArea/services/servicesThunk';
import {
  selectServices,
  selectEntityFilters,
  selectEntityFiltersOptions,
  selectEntityPagination,
  setEntityFilters,
  setEntityPagination,
} from '../../../../../redux/features/administrativeArea/administrativeAreaSlice';
import ManageServices from '../modals/manageService';
import { formTypes } from '../utils';
import { updateBreadcrumb } from '../../../../../redux/features/app/appSlice';

const entity = 'servizi';
const statusDropdownLabel = 'stati';

const Services = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const eventsList = useAppSelector(selectServices)?.list;
  const filtersList = useAppSelector(selectEntityFilters);
  const pagination = useAppSelector(selectEntityPagination);
  const dropdownFilterOptions = useAppSelector(selectEntityFiltersOptions);
  const [searchDropdown, setSearchDropdown] = useState<
    { filterId: string; value: formFieldI['value'] }[]
  >([]);
  const [filterDropdownSelected, setFilterDropdownSelected] =
    useState<string>('');

  const { criterioRicerca, policies, stati } = filtersList;

  const { pageNumber } = pagination;

  const getAllFilters = () => {
    // TODO: check chiavi filtri
    if (filterDropdownSelected !== 'filtroStati')
      dispatch(GetEntityFilterValues({ entity, dropdownType: 'stati' }));
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
          label: 'Servizi',
          url: '/area-amministrativa/servizi',
          link: true,
        },
      ])
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateTableValues = () => {
    const table = newTable(
      TableHeadingEventsList,
      eventsList.map((td) => {
        return {
          ...td,
          nome: td.name,
          status: <StatusChip status={td.status} rowTableId={td.id} />,
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
    setTableValues(updateTableValues());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventsList]);

  const getProgramsList = () => {
    dispatch(GetAllEvents());
  };

  useEffect(() => {
    getAllFilters();
    getProgramsList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [criterioRicerca, policies, stati, pageNumber]);

  const handleOnChangePage = (pageNumber: number = pagination?.pageNumber) => {
    dispatch(setEntityPagination({ pageNumber }));
  };

  const handleOnSearch = (searchValue: string) => {
    dispatch(setEntityFilters({ criterioRicerca: searchValue }));
  };

  const handleDropdownFilters = (
    values: FilterI[],
    filterKey: 'policies' | 'stati' | 'programmi' | 'progetti'
  ) => {
    setFilterDropdownSelected(filterKey);
    dispatch(setEntityFilters({ [filterKey]: [...values] }));
  };

  const handleOnSearchDropdownOptions = (
    searchValue: formFieldI['value'],
    filterId: 'policies' | 'stati' | 'programmi' | 'progetti'
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
    placeholder: "Inserisci l'identificativo o il nome del servizio",
    isClearable: true,
    title: 'Cerca programma',
  };

  const onActionClick: CRUDActionsI = {
    [CRUDActionTypes.VIEW]: (td: TableRowI | string) => {
      console.log(td);
      navigate('event1/info');
    },
  };

  const newService = () => {
    dispatch(
      openModal({
        id: formTypes.SERVICES,
        payload: {
          title: 'Crea un nuovo servizio',
        },
      })
    );
  };

  const servicesCta = {
    title: 'Lista Servizi',
    subtitle: "Inserisci l'identificativo o il nome del servizio",
    textCta: 'Crea servizio',
    iconCta: 'it-plus',
  };

  return (
    <GenericSearchFilterTableLayout
      searchInformation={searchInformation}
      dropdowns={dropdowns}
      filtersList={filtersList}
      {...servicesCta}
      cta={newService}
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
        total={eventsList.length}
        onChange={handleOnChangePage}
      />
      <ManageServices creation />
    </GenericSearchFilterTableLayout>
  );
};

export default Services;
