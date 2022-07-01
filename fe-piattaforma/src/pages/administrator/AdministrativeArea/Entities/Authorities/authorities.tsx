import React, { useEffect, useState } from 'react';
import { TableHeadingEntities } from '../utils';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../../../../../redux/hooks';
import {
  selectAuthorities,
  selectEntityFilters,
  selectEntityFiltersOptions,
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
import { Paginator, Table } from '../../../../../components';
import { CRUDActionsI, CRUDActionTypes } from '../../../../../utils/common';
import { formFieldI } from '../../../../../utils/formHelper';
import { useNavigate } from 'react-router-dom';
import ManageGenericAuthority from '../modals/manageGenericAuthority';

import {
  AuthoritiesLightI,
  GetAllEnti,
  GetFilterValuesEnti,
} from '../../../../../redux/features/administrativeArea/authorities/authoritiesThunk';
import { updateBreadcrumb } from '../../../../../redux/features/app/appSlice';

const profileDropdownLabel = 'profili';
const projectDropdownLabel = 'progetti';
const programDropdownLabel = 'programmi';

const Authorities: React.FC = () => {
  const dispatch = useDispatch();
  const entiList = useAppSelector(selectAuthorities);
  const filtersList = useAppSelector(selectEntityFilters);
  const pagination = useAppSelector(selectEntityPagination);
  const dropdownFilterOptions = useAppSelector(selectEntityFiltersOptions);
  const [searchDropdown, setSearchDropdown] = useState<
    { filterId: string; value: formFieldI['value'] }[]
  >([]);
  const navigate = useNavigate();
  const { criterioRicerca, progetti, profili, stati, programmi } = filtersList;
  const { pageNumber } = pagination;

  const getAllFilters = () => {
    dispatch(GetFilterValuesEnti(profileDropdownLabel));
    dispatch(GetFilterValuesEnti(projectDropdownLabel));
    dispatch(GetFilterValuesEnti(programDropdownLabel));
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
          label: 'Enti',
          url: '/area-amministrativa/enti',
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
  }, [criterioRicerca, progetti, profili, stati, pageNumber, programmi]);

  const updateTableValues = () => {
    const table = newTable(
      TableHeadingEntities,
      entiList.list.map((td: AuthoritiesLightI) => ({
        id: td.id,
        nome: td.nome,
        tipologia: td.tipologia,
        profilo: td.profilo,
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
  }, [entiList]);

  const getProjectsList = () => {
    dispatch(GetAllEnti());
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
      filterName: 'Profilo',
      options: dropdownFilterOptions[profileDropdownLabel],
      onOptionsChecked: (options) =>
        handleDropdownFilters(options, profileDropdownLabel),
      id: profileDropdownLabel,
      values: filtersList[profileDropdownLabel] || [],
      handleOnSearch: (searchKey) => {
        handleOnSearchDropdownOptions(searchKey, profileDropdownLabel);
      },
      valueSearch: searchDropdown?.filter(
        (f) => f.filterId === profileDropdownLabel
      )[0]?.value,
    },
    {
      filterName: 'Programma',
      options: dropdownFilterOptions[programDropdownLabel],
      onOptionsChecked: (options) =>
        handleDropdownFilters(options, programDropdownLabel),
      id: programDropdownLabel,
      values: filtersList[programDropdownLabel] || [],
      handleOnSearch: (searchKey) => {
        handleOnSearchDropdownOptions(searchKey, programDropdownLabel);
      },
      valueSearch: searchDropdown?.filter(
        (f) => f.filterId === programDropdownLabel
      )[0]?.value,
    },
    {
      filterName: 'Progetto',
      options: dropdownFilterOptions[projectDropdownLabel],
      onOptionsChecked: (options) =>
        handleDropdownFilters(options, projectDropdownLabel),
      id: projectDropdownLabel,
      values: filtersList[projectDropdownLabel] || [],
      handleOnSearch: (searchKey) => {
        handleOnSearchDropdownOptions(searchKey, projectDropdownLabel);
      },
      valueSearch: searchDropdown?.filter(
        (f) => f.filterId === projectDropdownLabel
      )[0]?.value,
    },
  ];

  const searchInformation: SearchInformationI = {
    autocomplete: false,
    onHandleSearch: handleOnSearch,
    placeholder:
      "Inserisci il nome, l'identificativo o il codice fiscale dell'ente",
    isClearable: true,
    title: 'Cerca progetto',
  };

  const onActionClick: CRUDActionsI = {
    [CRUDActionTypes.VIEW]: (td: TableRowI | string) => {
      navigate(`${typeof td === 'string' ? td : td.id}`);
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
  };

  const ctaProgetti = {
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
      /*  {...ctaProgetti}
      cta={newGestoreProgetto} */
    >
      <div className='mt-5'>
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
          total={entiList.list.length}
          onChange={handleOnChangePage}
        />
      </div>
      <ManageGenericAuthority creation />
    </GenericSearchFilterTableLayout>
  );
};

export default Authorities;
