import React, { useEffect, useState } from 'react';
import { TableHeading } from '../utils';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../../../../../redux/hooks';
import {
  selectEntityFilters,
  selectEntityFiltersOptions,
  selectEntityPagination,
  selectProjects,
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
import { Paginator, StatusChip, Table } from '../../../../../components';
import { CRUDActionsI, CRUDActionTypes } from '../../../../../utils/common';
import { formFieldI } from '../../../../../utils/formHelper';
import ManageProject from '../modals/manageProject';
import { useNavigate } from 'react-router-dom';
import {
  GetAllProjects,
  GetFilterValuesProjects,
} from '../../../../../redux/features/administrativeArea/projects/projectsThunk';
import { updateBreadcrumb } from '../../../../../redux/features/app/appSlice';

const statusDropdownLabel = 'stati';
const policyDropdownLabel = 'policies';
const programDropdownLabel = 'programmi';

const Projects: React.FC = () => {
  const dispatch = useDispatch();
  const progettiList = useAppSelector(selectProjects);
  const filtersList = useAppSelector(selectEntityFilters);
  const pagination = useAppSelector(selectEntityPagination);
  const dropdownFilterOptions = useAppSelector(selectEntityFiltersOptions);
  const [searchDropdown, setSearchDropdown] = useState<
    { filterId: string; value: formFieldI['value'] }[]
  >([]);
  const navigate = useNavigate();
  const { criterioRicerca, policies, stati, programmi } = filtersList;
  const { pageNumber } = pagination;

  const getAllFilters = () => {
    dispatch(GetFilterValuesProjects(statusDropdownLabel));
    dispatch(GetFilterValuesProjects(policyDropdownLabel));
    dispatch(GetFilterValuesProjects(programDropdownLabel));
  };

  useEffect(() => {
    dispatch(setEntityPagination({ pageSize: 2 }));
    getAllFilters();
    dispatch(
      updateBreadcrumb([
        {
          label: 'Area Amministrativa',
          url: '/area-amministrativa',
          link: false,
        },
        {
          label: 'Progetti',
          url: '/area-amministrativa/progetti',
          link: true,
        },
      ])
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getAllFilters();
    getProjectsList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [criterioRicerca, policies, stati, pageNumber, programmi]);

  const updateTableValues = () => {
    const table = newTable(
      TableHeading,
      progettiList.list.map((td) => ({
        id: td.id,
        label: td.nomeBreve,
        policy: td.policy,
        enteGestore: td.enteGestore,
        status: <StatusChip status={td.stato} rowTableId={td.id} />,
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
  }, [progettiList]);

  const getProjectsList = () => {
    dispatch(GetAllProjects());
  };

  useEffect(() => {
    getProjectsList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtersList, pagination]);

  const handleOnChangePage = (pageNumber: number = pagination?.pageNumber) => {
    dispatch(setEntityPagination({ pageNumber }));
  };

  const handleDropdownFilters = (values: FilterI[], filterKey: string) => {
    dispatch(setEntityFilters({ [filterKey]: [...values] }));
  };

  const handleOnSearch = (searchValue: string) => {
    dispatch(
      setEntityFilters({ nomeLike: { label: searchValue, value: searchValue } })
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
      filterName: 'Policy',
      options: dropdownFilterOptions[policyDropdownLabel],
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
      options: dropdownFilterOptions[programDropdownLabel],
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
      options: dropdownFilterOptions[statusDropdownLabel],
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

  const searchInformation: SearchInformationI = {
    autocomplete: false,
    onHandleSearch: handleOnSearch,
    placeholder:
      "Inserisci il nome del progetto, l'identificativo o il nome dell'ente gestore",
    isClearable: true,
    title: 'Cerca progetto',
  };

  const onActionClick: CRUDActionsI = {
    [CRUDActionTypes.VIEW]: (td: TableRowI | string) => {
      navigate(`${typeof td === 'string' ? td : td.id}/info`);
    },
  };

  /* const newGestoreProgetto = () => {
    dispatch(
      openModal({
        id: formTypes.PROGETTO,
        payload: {
          title: 'Crea un nuovo progetto',
        },
      })
    );
  }; */

  /* const ctaProgetti = {
    title: 'Area Amministrativa',
    subtitle:
      'Qui potrai gestire utenti, enti, programmi e progetti e creare i questionari',
    textCta: 'Crea nuovo progetto',
    iconCta: 'it-plus',
  }; */

  return (
    <GenericSearchFilterTableLayout
      searchInformation={searchInformation}
      dropdowns={dropdowns}
      filtersList={filtersList}
      /* {...ctaProgetti}
      cta={newGestoreProgetto} */
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
          total={progettiList.list.length}
          onChange={handleOnChangePage}
        />
      </div>
      <ManageProject creation />
    </GenericSearchFilterTableLayout>
  );
};

export default Projects;
