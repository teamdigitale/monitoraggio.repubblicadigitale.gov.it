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
import { GetAllServices } from '../../../../../redux/features/administrativeArea/services/servicesThunk';
import {
  selectServices,
  selectEntityFilters,
  selectEntityFiltersOptions,
  selectEntityPagination,
  setEntityFilters,
  setEntityPagination,
  resetServiceDetails,
} from '../../../../../redux/features/administrativeArea/administrativeAreaSlice';
import ManageServices from '../modals/manageService';
import { formTypes } from '../utils';
import { formatDate } from '../../../../../utils/datesHelper';
import {
  DownloadEntityValuesQueryParams,
  GetEntityFilterQueryParamsValues,
} from '../../../../../redux/features/administrativeArea/administrativeAreaThunk';
import useGuard from '../../../../../hooks/guard';

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

  const { hasUserPermission } = useGuard();

  const { criterioRicerca, policies, stato, tipologiaServizio } = filtersList;

  const { pageNumber } = pagination;

  const getAllFilters = () => {
    if (filterDropdownSelected !== 'stato')
      dispatch(
        GetEntityFilterQueryParamsValues({ entity, dropdownType: 'stati' })
      );
    if (filterDropdownSelected !== 'tipologiaServizio')
      dispatch(
        GetEntityFilterQueryParamsValues({
          entity,
          dropdownType: 'tipologiaServizio',
        })
      );
  };

  useEffect(() => {
    dispatch(setEntityPagination({ pageSize: 8 }));
    dispatch(resetServiceDetails());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getTypeService = (typeService: string[]) => {
    if (typeService?.length === 1) return typeService?.[0];
    else
      return (
        <p>
          <strong> {typeService?.length} </strong> tipologie
        </p>
      );
  };

  const updateTableValues = () => {
    const table = newTable(
      TableHeadingServicesList,
      servicesList.map((td) => {
        return {
          ...td,
          nome: td?.nome,
          data: td?.data || formatDate(Number(td?.data), 'snakeDate') || '-',
          stato: <StatusChip status={td?.stato} rowTableId={td?.id} />,
          tipologiaServizio: getTypeService(td?.tipologiaServizio),
        };
      })
    );
    return table;
  };

  const [tableValues, setTableValues] = useState(updateTableValues());

  useEffect(() => {
    if (Array.isArray(servicesList) && servicesList.length)
      setTableValues(updateTableValues());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [servicesList]);

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
    filterKey: 'stato' | 'tipologiaServizio'
  ) => {
    setFilterDropdownSelected(filterKey);
    if (
      filtersList[filterKey] &&
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      filtersList[filterKey]?.length > values?.length
    ) {
      const dropdownType =
        filterKey === 'stato'
          ? 'stati'
          : filterKey === 'tipologiaServizio'
          ? 'tipologiaServizio'
          : '';
      dispatch(GetEntityFilterQueryParamsValues({ entity, dropdownType: dropdownType, noFilters: true }));
    }
    dispatch(setEntityFilters({ [filterKey]: [...values] }));
  };

  const handleOnSearchDropdownOptions = (
    searchValue: formFieldI['value'],
    filterId: 'stato' | 'tipologiaServizio'
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
    title: 'Cerca servzio',
  };

  const onActionClick: CRUDActionsI = hasUserPermission(['view.card.serv'])
    ? {
        [CRUDActionTypes.VIEW]: (td: TableRowI | string) => {
          navigate(`${typeof td === 'string' ? td : td?.id}/info`);
        },
      }
    : {};

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
      cta={hasUserPermission(['new.serv']) ? newService : undefined}
      ctaDownload={
        hasUserPermission(['list.dwnl.serv']) ? handleDownloadList : undefined
      }
      resetFilterDropdownSelected={(filterKey: string) =>
        setFilterDropdownSelected(filterKey)
      }
      tooltip
      tooltiptext={searchInformation.placeholder}
    >
      <div>
        {servicesList?.length && tableValues?.values?.length ? (
          <>
            <Table
              {...tableValues}
              id='table-services'
              onActionClick={onActionClick}
              onCellClick={(field, row) => console.log(field, row)}
              withActions
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
          </>
        ) : (
          <EmptySection
            title='Non sono presenti servizi'
            subtitle='associati al tuo ruolo'
            icon='it-note'
            withIcon
          />
        )}
      </div>
      <ManageServices creation />
    </GenericSearchFilterTableLayout>
  );
};

export default Services;
