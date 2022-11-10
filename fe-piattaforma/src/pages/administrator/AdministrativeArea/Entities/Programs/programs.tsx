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
  resetProgramDetails,
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
import { formTypes, TableHeading } from '../utils';
import GenericSearchFilterTableLayout, {
  SearchInformationI,
} from '../../../../../components/genericSearchFilterTableLayout/genericSearchFilterTableLayout';
import { CRUDActionsI, CRUDActionTypes } from '../../../../../utils/common';
import { formFieldI } from '../../../../../utils/formHelper';
import { openModal } from '../../../../../redux/features/modal/modalSlice';
import { useNavigate } from 'react-router-dom';
import ManageProgram from '../modals/manageProgram';
import {
  GetEntityValues,
  GetEntityFilterValues,
  DownloadEntityValues,
} from '../../../../../redux/features/administrativeArea/administrativeAreaThunk';
import useGuard from '../../../../../hooks/guard';

const entity = 'programma';
const statusDropdownLabel = 'filtroStati';
const policyDropdownLabel = 'filtroPolicies';

const Programs = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { hasUserPermission } = useGuard();
  const { programmi: programmiList = [] } = useAppSelector(selectEntityList);
  const filtersList = useAppSelector(selectEntityFilters);
  const pagination = useAppSelector(selectEntityPagination);
  const dropdownFilterOptions = useAppSelector(selectEntityFiltersOptions);
  const [searchDropdown, setSearchDropdown] = useState<
    { filterId: string; value: formFieldI['value'] }[]
  >([]);
  const [filterDropdownSelected, setFilterDropdownSelected] =
    useState<string>('');

  const { filtroCriterioRicerca, filtroPolicies, filtroStati } = filtersList;

  const { pageNumber } = pagination;

  const getAllFilters = () => {
    if (filterDropdownSelected !== 'filtroStati')
      dispatch(GetEntityFilterValues({ entity, dropdownType: 'stati' }));
    if (filterDropdownSelected !== 'filtroPolicies')
      dispatch(GetEntityFilterValues({ entity, dropdownType: 'policies' }));
  };

  useEffect(() => {
    dispatch(setEntityPagination({ pageSize: 8 }));
    dispatch(resetProgramDetails());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateTableValues = () => {
    const table = newTable(
      TableHeading,
      programmiList.map((td: any) => {
        return {
          label: td.nomeBreve || td.nome,
          id: td.codice || td.id,
          policy: td.policy,
          enteGestore: td.enteGestore || td.nomeEnteGestore,
          status: <StatusChip status={td.stato} rowTableId={td.id} />,
        };
      })
    );
    return table;
  };

  const [tableValues, setTableValues] = useState(updateTableValues());

  useEffect(() => {
    if (Array.isArray(programmiList) && programmiList.length)
      setTableValues(updateTableValues());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [programmiList]);

  const getProgramsList = () => {
    dispatch(GetEntityValues({ entity }));
  };

  useEffect(() => {
    getProgramsList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtroCriterioRicerca, filtroPolicies, filtroStati, pageNumber]);

  useEffect(() => {
    getAllFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtroCriterioRicerca, filtroPolicies, filtroStati]);

  const handleOnChangePage = (pageNumber: number = pagination?.pageNumber) => {
    dispatch(setEntityPagination({ pageNumber }));
  };

  const handleDownloadList = () => {
    dispatch(DownloadEntityValues({ entity }));
  };

  const handleOnSearch = (searchValue: string) => {
    dispatch(
      setEntityFilters({
        filtroCriterioRicerca: searchValue,
      })
    );
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
    placeholder: "Inserisci il nome, l'ID o il nome dell'ente gestore",
    isClearable: true,
    title: 'Cerca programma',
  };

  const onActionClick: CRUDActionsI = hasUserPermission(['view.card.prgm.full'])
    ? {
        [CRUDActionTypes.VIEW]: (td: TableRowI | string) => {
          if (typeof td !== 'string') {
            const programId = programmiList.filter(
              (program: any) =>
                program?.codice?.toString().toLowerCase() ===
                td.id.toString().toLowerCase()
            )[0].id;
            navigate(`${programId}/info`);
          }
        },
      }
    : {};

  const newProgram = () => {
    dispatch(resetProgramDetails());
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
    textCta: 'Crea programma',
    iconCta: 'it-plus',
  };

  return (
    <GenericSearchFilterTableLayout
      searchInformation={searchInformation}
      dropdowns={dropdowns}
      filtersList={filtersList}
      {...programCta}
      cta={hasUserPermission(['new.prgm']) ? newProgram : undefined}
      ctaDownload={
        programmiList?.length &&
        tableValues?.values?.length &&
        hasUserPermission(['list.dwnl.prgm'])
          ? handleDownloadList
          : undefined
      }
      resetFilterDropdownSelected={() => setFilterDropdownSelected('')}
      tooltiptext={searchInformation.placeholder}
      tooltip
    >
      <div>
        {programmiList?.length && tableValues?.values?.length ? (
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
            title='Non sono presenti programmi'
            subtitle='associati al tuo ruolo'
            icon='it-note'
            withIcon
          />
        )}
      </div>
      <ManageProgram creation />
    </GenericSearchFilterTableLayout>
  );
};

export default Programs;
