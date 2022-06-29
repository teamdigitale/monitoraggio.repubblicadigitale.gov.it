import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Chip, ChipLabel } from 'design-react-kit';
import clsx from 'clsx';
import { Paginator, Table } from '../../../../../components';
import { newTable, TableRowI } from '../../../../../components/Table/table';
import { useAppSelector } from '../../../../../redux/hooks';
import {
  DropdownFilterI,
  FilterI,
} from '../../../../../components/DropdownFilter/dropdownFilter';
import {
  statusBgColor,
  statusColor,
  TableHeadingEventsList,
} from '../../../CitizensArea/utils';

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

  const { criterioRicerca, policies, stati } = filtersList;

  const { pageNumber } = pagination;

  const getAllFilters = () => {
    dispatch(GetEntityFilterValues());
  };

  useEffect(() => {
    dispatch(setEntityPagination({ pageSize: 1 }));
    getAllFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateTableValues = () => {
    const table = newTable(
      TableHeadingEventsList,
      eventsList.map((td) => {
        return {
          ...td,
          status: (
            <Chip
              className={clsx(
                'table-container__status-label',
                'no-border',
                statusBgColor(td.stato)
              )}
            >
              <ChipLabel className={statusColor(td.stato)}>
                {td.stato.toUpperCase()}
              </ChipLabel>
            </Chip>
          ),
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
    dispatch(
      setEntityFilters({ nomeLike: { label: searchValue, value: searchValue } })
    );
  };

  const handleDropdownFilters = (
    values: FilterI[],
    filterKey: 'policies' | 'stati'
  ) => {
    dispatch(setEntityFilters({ [filterKey]: [...values] }));
  };

  const handleOnSearchDropdownOptions = (
    searchValue: formFieldI['value'],
    filterId: 'policies' | 'stati'
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
      filterName: 'Stati',
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
      "Inserisci il nome, l'identificativo o il nome dell'ente gestore del programma che stai cercando",
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
    >
      <div>
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
      </div>
      <ManageServices creation />
    </GenericSearchFilterTableLayout>
  );
};

export default Services;
