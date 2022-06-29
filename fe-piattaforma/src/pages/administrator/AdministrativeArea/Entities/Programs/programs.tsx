import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Paginator, StatusChip, Table } from '../../../../../components';
import { newTable, TableRowI } from '../../../../../components/Table/table';
import { useAppSelector } from '../../../../../redux/hooks';
import {
  resetProgramDetails,
  selectEntityFilters,
  selectEntityFiltersOptions,
  selectEntityPagination,
  selectPrograms,
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
  GetAllPrograms,
  GetFilterValues,
} from '../../../../../redux/features/administrativeArea/programs/programsThunk';
import { updateBreadcrumb } from '../../../../../redux/features/app/appSlice';

const statusDropdownLabel = 'stati';
const policyDropdownLabel = 'policies';

const Programs = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const programmiList = useAppSelector(selectPrograms);
  const filtersList = useAppSelector(selectEntityFilters);
  const pagination = useAppSelector(selectEntityPagination);
  const dropdownFilterOptions = useAppSelector(selectEntityFiltersOptions);
  const [searchDropdown, setSearchDropdown] = useState<
    { filterId: string; value: formFieldI['value'] }[]
  >([]);

  const { criterioRicerca, policies, stati } = filtersList;

  const { pageNumber } = pagination;

  const getAllFilters = () => {
    dispatch(GetFilterValues('stati'));
    dispatch(GetFilterValues('policies'));
  };

  useEffect(() => {
    dispatch(setEntityPagination({ pageSize: 1 }));
    getAllFilters();
    /**
     * When the component is rendered the breadcrumb is initialized with
     * the rigth path. This operation is performed in every component that
     * needs breadcrumb
     */
    dispatch(
      updateBreadcrumb([
        {
          label: 'Area Amministrativa',
          url: '/area-amministrativa',
          link: false,
        },
        {
          label: 'Programmi',
          url: '/area-amministrativa/programmi',
          link: true,
        },
      ])
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateTableValues = () => {
    const table = newTable(
      TableHeading,
      programmiList.list.map((td) => {
        return {
          label: td.nomeBreve,
          id: td.id,
          policy: td.policy,
          enteGestore: td.enteGestore,
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
    setTableValues(updateTableValues());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [programmiList]);

  const getProgramsList = () => {
    dispatch(GetAllPrograms());
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
      filterName: 'Policy',
      options: dropdownFilterOptions[policyDropdownLabel],
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
      "Inserisci il nome, l'identificativo o il nome dell'ente gestore",
    isClearable: true,
    title: 'Cerca programma',
  };

  const onActionClick: CRUDActionsI = {
    [CRUDActionTypes.VIEW]: (td: TableRowI | string) => {
      console.log(td);
      //TODO REPLACE WITH DYNAMIC ID WHEN WE HAVE THE APIS
      navigate('321321/info');
    },
  };

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
      cta={newProgram}
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
          total={programmiList.list.length}
          onChange={handleOnChangePage}
        />
      </div>
      <ManageProgram creation />
    </GenericSearchFilterTableLayout>
  );
};

export default Programs;
