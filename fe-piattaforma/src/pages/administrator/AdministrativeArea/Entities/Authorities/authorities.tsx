import React, { useEffect, useState } from 'react';
import { TableHeadingEntities } from '../utils';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../../../../../redux/hooks';
import {
  resetAuthorityDetails,
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
import { EmptySection, Paginator, Table } from '../../../../../components';
import { CRUDActionsI, CRUDActionTypes } from '../../../../../utils/common';
import { formFieldI } from '../../../../../utils/formHelper';
import { useNavigate } from 'react-router-dom';
import ManageGenericAuthority from '../modals/manageGenericAuthority';

import { AuthoritiesLightI } from '../../../../../redux/features/administrativeArea/authorities/authoritiesThunk';
import {
  DownloadEntityValues,
  GetEntityFilterValues,
  GetEntityValues,
} from '../../../../../redux/features/administrativeArea/administrativeAreaThunk';
import useGuard from '../../../../../hooks/guard';
import IconNote from '/public/assets/img/it-note-primary.png';

const entity = 'ente';
const profileDropdownLabel = 'profili';
const projectDropdownLabel = 'idsProgetti';
const programDropdownLabel = 'idsProgrammi';

const Authorities: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { enti: entiList = [] } = useAppSelector(selectEntityList);
  const filtersList = useAppSelector(selectEntityFilters);
  const pagination = useAppSelector(selectEntityPagination);
  const dropdownFilterOptions = useAppSelector(selectEntityFiltersOptions);
  const [searchDropdown, setSearchDropdown] = useState<
    { filterId: string; value: formFieldI['value'] }[]
  >([]);
  const [filterDropdownSelected, setFilterDropdownSelected] =
    useState<string>('');

  const { hasUserPermission } = useGuard();

  const { criterioRicerca, idsProgetti, profili, idsProgrammi } = filtersList;

  const { pageNumber } = pagination;

  const getAllFilters = () => {
    if (filterDropdownSelected !== 'profili')
      dispatch(GetEntityFilterValues({ entity, dropdownType: 'profili' }));
    if (filterDropdownSelected !== 'idsProgetti')
      dispatch(GetEntityFilterValues({ entity, dropdownType: 'progetti' }));
    if (filterDropdownSelected !== 'idsProgrammi')
      dispatch(GetEntityFilterValues({ entity, dropdownType: 'programmi' }));
  };

  useEffect(() => {
    dispatch(setEntityPagination({ pageSize: 8 }));
    dispatch(resetAuthorityDetails());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getAuthoritiesList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [criterioRicerca, idsProgetti, profili, idsProgrammi, pageNumber]);

  useEffect(() => {
    getAllFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [criterioRicerca, idsProgetti, profili, idsProgrammi]);

  const updateTableValues = () => {
    const table = newTable(
      TableHeadingEntities,
      entiList.map((td: AuthoritiesLightI) => ({
        id: td.id,
        nome: td.nome,
        tipologia: td.tipologia,
        profilo:
          td.profilo.split(',').length === 1 ? (
            td.profilo
          ) : (
            <p>
              <strong> {td.profilo.split(',').length} </strong> profili
              assegnati
            </p>
          ),
      }))
    );
    return table;
  };

  const [tableValues, setTableValues] = useState(updateTableValues());

  useEffect(() => {
    if (Array.isArray(entiList) && entiList.length)
      setTableValues(updateTableValues());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entiList]);

  const getAuthoritiesList = () => {
    dispatch(GetEntityValues({ entity }));
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
        filterKey === 'profili'
          ? 'profili'
          : filterKey === 'idsProgetti'
          ? 'progetti'
          : filterKey === 'idsProgrammi'
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
        criterioRicerca: searchValue,
      })
    );
  };

  const handleOnSearchDropdownOptions = (
    searchValue: formFieldI['value'],
    filterId: string
  ) => {
    const searchDropdownValues = [...searchDropdown];
    if (
      searchDropdownValues?.length &&
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
      options: dropdownFilterOptions['programmi'],
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
      options: dropdownFilterOptions['progetti'],
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

  const handleDownloadList = () => {
    dispatch(DownloadEntityValues({ entity }));
  };

  const searchInformation: SearchInformationI = {
    autocomplete: false,
    onHandleSearch: handleOnSearch,
    placeholder: "Inserisci il nome, l'ID o il codice fiscale dell'ente",
    isClearable: true,
    title: 'Cerca ente',
  };

  const onActionClick: CRUDActionsI = hasUserPermission(['view.card.enti'])
    ? {
        [CRUDActionTypes.VIEW]: (td: TableRowI | string) => {
          navigate(`${typeof td === 'string' ? td : td.id}`);
        },
      }
    : {};

  return (
    <GenericSearchFilterTableLayout
      searchInformation={searchInformation}
      dropdowns={dropdowns}
      filtersList={filtersList}
      ctaDownload={
        hasUserPermission(['list.dwnl.enti']) ? handleDownloadList : undefined
      }
      resetFilterDropdownSelected={() => setFilterDropdownSelected('')}
      tooltip
      tooltiptext={searchInformation.placeholder}
    >
      <div>
        {entiList?.length && tableValues?.values?.length ? (
          <>
            <Table
              {...tableValues}
              id='table'
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
            title='Non sono presenti enti per la tua ricerca'
            icon={IconNote}
            withIcon
          />
        )}
      </div>
      <ManageGenericAuthority
        legend="form creazione ente, i campi con l'asterisco sono obbligatori"
        creation
      />
    </GenericSearchFilterTableLayout>
  );
};

export default Authorities;
