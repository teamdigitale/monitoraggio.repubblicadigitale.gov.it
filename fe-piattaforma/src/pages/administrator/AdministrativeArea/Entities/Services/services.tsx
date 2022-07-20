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
  DropdownFilterI,
  FilterI,
} from '../../../../../components/DropdownFilter/dropdownFilter';
import { TableHeadingServicesList } from '../../../CitizensArea/utils';

import GenericSearchFilterTableLayout, {
  SearchInformationI,
} from '../../../../../components/genericSearchFilterTableLayout/genericSearchFilterTableLayout';
import { CRUDActionsI, CRUDActionTypes } from '../../../../../utils/common';
import { formFieldI } from '../../../../../utils/formHelper';
import { openModal } from '../../../../../redux/features/modal/modalSlice';
import { useNavigate } from 'react-router-dom';
import {
  GetAllServices,
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
import { formatDate } from '../../../../../utils/datesHelper';
import { DownloadEntityValuesQueryParams, GetEntityFilterQueryParamsValues } from '../../../../../redux/features/administrativeArea/administrativeAreaThunk';

const entity = 'servizio';
const statusDropdownLabel = 'stato';
const serviceTypeDropdownLabel = 'tipologiaServizio';

const Services = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const servicesList = useAppSelector(selectServices)?.list;
  const filtersList = useAppSelector(selectEntityFilters);
  const pagination = useAppSelector(selectEntityPagination);
  const dropdownFilterOptions = useAppSelector(selectEntityFiltersOptions);
  const [searchDropdown, setSearchDropdown] = useState<
    { filterId: string; value: formFieldI['value'] }[]
  >([]);
  const [filterDropdownSelected, setFilterDropdownSelected] =
    useState<string>('');

  const { criterioRicerca, policies, stato, tipologiaServizio } = filtersList;

  const { pageNumber } = pagination;

  const getAllFilters = () => {
    if (filterDropdownSelected !== 'stato')
      dispatch(GetEntityFilterQueryParamsValues({ entity, dropdownType: 'stati' }));
    if (filterDropdownSelected !== 'tipologiaServizio')
      dispatch(
        GetEntityFilterQueryParamsValues({ entity, dropdownType: 'tipologiaServizio' })
      );
  };

  useEffect(() => {
    dispatch(setEntityPagination({ pageSize: 8 }));
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
      TableHeadingServicesList,
      servicesList.map((td) => {
        return {
          ...td,
          nome: td.nome,
          data: formatDate(td.data, 'shortDate') || '-',
          status: <StatusChip status={td.stato} rowTableId={td.id} />,
        };
      })
    );
    return table;
  };

  const [tableValues, setTableValues] = useState(updateTableValues());
  
  useEffect(() => {
    if (Array.isArray(servicesList))
      setTableValues(updateTableValues());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [servicesList?.length]);

  const getServicesList = () => {
    dispatch(GetAllServices());
  };

  useEffect(() => {
    getServicesList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [criterioRicerca, policies, stato, tipologiaServizio, pageNumber]);

  useEffect(() => {
    getAllFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [criterioRicerca, policies, stato, tipologiaServizio]);

  const handleOnChangePage = (pageNumber: number = pagination?.pageNumber) => {
    dispatch(setEntityPagination({ pageNumber }));
  };

  const handleOnSearch = (searchValue: string) => {
    dispatch(setEntityFilters({ criterioRicerca: searchValue }));
  };

  const handleDropdownFilters = (
    values: FilterI[],
    filterKey:
      | 'stato'
      | 'tipologiaServizio'
  ) => {
    setFilterDropdownSelected(filterKey);
    dispatch(setEntityFilters({ [filterKey]: [...values] }));
  };

  const handleOnSearchDropdownOptions = (
    searchValue: formFieldI['value'],
    filterId:
      | 'stato'
      | 'tipologiaServizio'
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
      filterName: 'Tipo di servizio prenotato',
      options: dropdownFilterOptions[serviceTypeDropdownLabel],
      id: serviceTypeDropdownLabel,
      onOptionsChecked: (options) =>
        handleDropdownFilters(options, serviceTypeDropdownLabel),
      values: filtersList[serviceTypeDropdownLabel] || [],
      handleOnSearch: (searchKey) =>
        handleOnSearchDropdownOptions(searchKey, serviceTypeDropdownLabel),
      valueSearch: searchDropdown?.filter(
        (f) => f.filterId === serviceTypeDropdownLabel
      )[0]?.value,
    },
    {
      filterName: 'Stato',
      options: dropdownFilterOptions['stati'],
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
      navigate(`${typeof td === 'string' ? td : td?.id}/info`);
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

  const handleDownloadList = () => {
    dispatch(DownloadEntityValuesQueryParams({ entity }));
  };

  return (
    <GenericSearchFilterTableLayout
      searchInformation={searchInformation}
      dropdowns={dropdowns}
      filtersList={filtersList}
      {...servicesCta}
      cta={newService}
      ctaDownload={handleDownloadList}
      resetFilterDropdownSelected={(filterKey: string) =>
        setFilterDropdownSelected(filterKey)
      }
    >
      <div>
        {servicesList?.length && tableValues?.values?.length ? (
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
              total={servicesList.length}
              onChange={handleOnChangePage}
            />
          </>
        ) : (
          <EmptySection title='Non ci sono servizi' />
        )}
      </div>
      <ManageServices creation />
    </GenericSearchFilterTableLayout>
  );
};

export default Services;
