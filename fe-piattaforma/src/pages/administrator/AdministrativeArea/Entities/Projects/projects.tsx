import React, { useEffect, useState } from 'react';
import { TableHeading } from '../utils';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../../../../../redux/hooks';
import {
  resetProjectDetails,
  selectEntityFilters,
  selectEntityFiltersOptions,
  selectEntityList,
  selectEntityPagination,
  setEntityFilters,
  setEntityPagination,
} from '../../../../../redux/features/administrativeArea/administrativeAreaSlice';
import { newTable, TableRowI } from '../../../../../components/Table/table';
import {
  DropdownFilterI,
  FilterI,
} from '../../../../../components/DropdownFilter/dropdownFilter';
import GenericSearchFilterTableLayout, {
  SearchInformationI,
} from '../../../../../components/genericSearchFilterTableLayout/genericSearchFilterTableLayout';
import {
  EmptySection,
  Paginator,
  StatusChip,
  Table,
} from '../../../../../components';
import { CRUDActionsI, CRUDActionTypes } from '../../../../../utils/common';
import { formFieldI } from '../../../../../utils/formHelper';
import ManageProject from '../modals/manageProject';
import { useNavigate } from 'react-router-dom';
import {
  DownloadEntityValues,
  GetEntityFilterValues,
  GetEntityValues,
} from '../../../../../redux/features/administrativeArea/administrativeAreaThunk';
import useGuard from '../../../../../hooks/guard';

const entity = 'progetto';
const statusDropdownLabel = 'filtroStati';
const policyDropdownLabel = 'filtroPolicies';
const programDropdownLabel = 'filtroIdsProgrammi';

const Projects: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { hasUserPermission } = useGuard();
  const { progetti: progettiList = [] } = useAppSelector(selectEntityList);
  const filtersList = useAppSelector(selectEntityFilters);
  const pagination = useAppSelector(selectEntityPagination);
  const dropdownFilterOptions = useAppSelector(selectEntityFiltersOptions);
  const [searchDropdown, setSearchDropdown] = useState<
    { filterId: string; value: formFieldI['value'] }[]
  >([]);
  const {
    filtroCriterioRicerca,
    filtroPolicies,
    filtroStati,
    filtroIdsProgrammi,
  } = filtersList;
  const { pageNumber } = pagination;
  const [filterDropdownSelected, setFilterDropdownSelected] =
    useState<string>('');

  const getAllFilters = () => {
    if (filterDropdownSelected !== 'filtroStati')
      dispatch(GetEntityFilterValues({ entity, dropdownType: 'stati' }));
    if (filterDropdownSelected !== 'filtroPolicies')
      dispatch(GetEntityFilterValues({ entity, dropdownType: 'policies' }));
    if (filterDropdownSelected !== 'filtroIdsProgrammi')
      dispatch(GetEntityFilterValues({ entity, dropdownType: 'programmi' }));
  };

  useEffect(() => {
    dispatch(setEntityPagination({ pageSize: 8 }));
    dispatch(resetProjectDetails());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getAllFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtroCriterioRicerca, filtroPolicies, filtroStati, filtroIdsProgrammi]);

  useEffect(() => {
    getProjectsList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    filtroCriterioRicerca,
    filtroPolicies,
    filtroStati,
    filtroIdsProgrammi,
    pageNumber,
  ]);

  const updateTableValues = () => {
    //TODO align keys when API Integation is done
    const table = newTable(
      TableHeading,
      progettiList.map((td: any) => ({
        id: td.id,
        label: td.nomeBreve || td.nome,
        policy: td.policy,
        enteGestore: td.enteGestore || td.nomeEnteGestore,
        status: <StatusChip status={td.stato} rowTableId={td.id} />,
      }))
    );
    return table;
  };

  const [tableValues, setTableValues] = useState(updateTableValues());

  useEffect(() => {
    if (Array.isArray(progettiList) && progettiList.length)
      setTableValues(updateTableValues());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progettiList]);

  const getProjectsList = () => {
    dispatch(GetEntityValues({ entity: 'progetto' }));
  };

  const handleOnChangePage = (pageNumber: number = pagination?.pageNumber) => {
    dispatch(setEntityPagination({ pageNumber }));
  };

  const handleDropdownFilters = (values: FilterI[], filterKey: string) => {
    setFilterDropdownSelected(filterKey);
    if (
      filtersList[filterKey] &&
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      filtersList[filterKey]?.length > values?.length
    ) {
      const dropdownType =
        filterKey === 'filtroStati'
          ? 'stati'
          : filterKey === 'filtroPolicies'
          ? 'policies'
          : filterKey === 'filtroIdsProgrammi'
          ? 'programmi'
          : '';
      dispatch(
        GetEntityFilterValues({
          entity,
          dropdownType: dropdownType,
          noFilters: true,
        })
      );
    }
    dispatch(setEntityFilters({ [filterKey]: [...values] }));
  };

  const handleOnSearch = (searchValue: string) => {
    dispatch(
      setEntityFilters({
        filtroCriterioRicerca: searchValue,
      })
    );
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
  };

  const dropdowns: DropdownFilterI[] = [
    {
      filterName: 'Intervento',
      options: dropdownFilterOptions['policies'],
      onOptionsChecked: (options) =>
        handleDropdownFilters(options, policyDropdownLabel),
      id: policyDropdownLabel,
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
      options: dropdownFilterOptions['programmi'],
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
    {
      filterName: 'Stato',
      options: dropdownFilterOptions['stati'],
      onOptionsChecked: (options) =>
        handleDropdownFilters(options, statusDropdownLabel),
      id: statusDropdownLabel,
      className: 'mr-3',
      values: filtersList[statusDropdownLabel] || [],
      handleOnSearch: (searchKey) => {
        handleOnSearchDropdownOptions(searchKey, statusDropdownLabel);
      },
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
      "Inserisci il nome del progetto, l'ID o il nome dell'ente gestore",
    isClearable: true,
    title: 'Cerca progetto',
  };

  const onActionClick: CRUDActionsI = {
    [CRUDActionTypes.VIEW]: (td: TableRowI | string) => {
      navigate(`${typeof td === 'string' ? td : td.id}/info`);
    },
  };

  return (
    <GenericSearchFilterTableLayout
      searchInformation={searchInformation}
      dropdowns={dropdowns}
      filtersList={filtersList}
      resetFilterDropdownSelected={() => setFilterDropdownSelected('')}
      ctaDownload={
        progettiList?.length &&
        tableValues?.values?.length &&
        hasUserPermission(['list.dwnl.prgt'])
          ? handleDownloadList
          : undefined
      }
      tooltip
      tooltiptext={searchInformation.placeholder}
    >
      <div>
        {progettiList?.length && tableValues?.values?.length ? (
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
            title='Non sono presenti progetti'
            subtitle='associati al tuo ruolo'
            icon='it-note'
            withIcon
          />
        )}
      </div>
      <ManageProject creation />
    </GenericSearchFilterTableLayout>
  );
};

export default Projects;
