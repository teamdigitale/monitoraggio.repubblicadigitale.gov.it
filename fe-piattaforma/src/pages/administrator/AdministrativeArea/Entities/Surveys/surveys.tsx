import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FormGroup, Toggle } from 'design-react-kit';
//import clsx from 'clsx';
import { Paginator, StatusChip, Table } from '../../../../../components';
import { newTable, TableRowI } from '../../../../../components/Table/table';
import { useAppSelector } from '../../../../../redux/hooks';
import {
  selectEntityFilters,
  selectEntityFiltersOptions,
  selectSurveys,
  selectEntityPagination,
  setEntityFilters,
  setEntityPagination,
} from '../../../../../redux/features/administrativeArea/administrativeAreaSlice';
import {
  DownloadEntityValues,
  // GetEntityValues,
  GetEntityFilterValues,
  // DownloadEntityValues,
} from '../../../../../redux/features/administrativeArea/administrativeAreaThunk';
import { TableHeadingQuestionnaires } from '../utils';

import GenericSearchFilterTableLayout, {
  SearchInformationI,
} from '../../../../../components/genericSearchFilterTableLayout/genericSearchFilterTableLayout';
import { CRUDActionsI, CRUDActionTypes } from '../../../../../utils/common';

import {
  DropdownFilterI,
  FilterI,
} from '../../../../../components/DropdownFilter/dropdownFilter';

import { formFieldI } from '../../../../../utils/formHelper';
//import SideSelection from '../../../../../components/SideSelection/sideSelection';
import PageTitle from '../../../../../components/PageTitle/pageTitle';
import {
  //selectDevice,
  updateBreadcrumb,
} from '../../../../../redux/features/app/appSlice';
import {
  GetAllSurveys,
  GetFilterValuesSurvey,
  UpdateSurveyExclusiveField,
} from '../../../../../redux/features/administrativeArea/surveys/surveysThunk';

const entity = 'questionarioTemplate';
const statusDropdownLabel = 'stati';

const Surveys = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const questionariList = useAppSelector(selectSurveys);
  const dropdownFilterOptions = useAppSelector(selectEntityFiltersOptions);
  const filtersList = useAppSelector(selectEntityFilters);
  const pagination = useAppSelector(selectEntityPagination);
  const [searchDropdown, setSearchDropdown] = useState<
    { filterId: string; value: formFieldI['value'] }[]
  >([]);

  const { criterioRicerca, stati } = filtersList;

  const { pageNumber } = pagination;

  useEffect(() => {
    dispatch(setEntityPagination({ pageSize: 3 }));
    dispatch(
      updateBreadcrumb([
        {
          label: 'Area Amministrativa',
          url: '/area-amministrativa',
          link: false,
        },
        {
          label: 'Questionari',
          url: '/area-amministrativa/questionari',
          link: true,
        },
      ])
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateTableValues = () => {
    const table = newTable(
      TableHeadingQuestionnaires,
      questionariList?.list.map((td) => ({
        id: td.id,
        label: td.nome,
        type: td.tipo,
        status: <StatusChip status={td.stato} rowTableId={td.id} />,
        lastChangeDate: td.dataUltimaModifica,
        default_SCD: (
          <FormGroup check className='table-container__toggle-button'>
            <Toggle
              label=''
              aria-labelledby={`toggle-SCD-${td.id}`}
              disabled={false}
              checked={td.defaultSCD}
              onChange={(e) =>
                handleToggleChange('scd', e.target.checked, td.id)
              }
            />
            <span id={`toggle-SCD-${td.id}`} className='d-none'>
              Default toggle SCD {td.id}
            </span>
          </FormGroup>
        ),
        default_RFD: (
          <FormGroup check className='table-container__toggle-button'>
            <Toggle
              label=''
              aria-labelledby={`toggle-RFD-${td.id}`}
              disabled={false}
              checked={td.defaultRFD}
              onChange={(e) =>
                handleToggleChange('rfd', e.target.checked, td.id)
              }
            />
            <span id={`toggle-RFD-${td.id}`} className='d-none'>
              Default toggle RFD {td.id}
            </span>
          </FormGroup>
        ),
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

  const questionaraireCta = {
    title: 'Area Amministrativa',
    subtitle:
      'Qui potrai gestire utenti, enti, programmi e progetti e creare i questionari',
    textCta: 'Crea nuovo questionario',
    iconCta: 'it-plus',
  };
  const addendumCta = {
    title: 'Area Amministrativa',
    subtitle:
      'Qui potrai gestire utenti, enti, programmi e progetti e creare i questionari',
    textCta: 'Crea nuovo addendum',
    iconCta: 'it-plus',
  };

  interface QuestionnaireFilter {
    label: string;
    key?: string;
    value: string;
  }

  const questionnaireOptionsMock: QuestionnaireFilter[] = [
    { label: 'Questionari', key: 'questionnaire', value: 'questionnaire' },
    { label: 'Addendum', key: 'addendum', value: 'Addendum' },
  ];

  const [filter /* setFilter */] = useState<QuestionnaireFilter>(
    questionnaireOptionsMock[0]
  );

  useEffect(() => {
    setTableValues(updateTableValues());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionariList]);

  const getSurveysList = () => {
    dispatch(GetAllSurveys());
  };

  const getAllFilters = () => {
    dispatch(
      GetEntityFilterValues({ entity, dropdownType: statusDropdownLabel })
    );
  };

  useEffect(() => {
    getAllFilters();
    getSurveysList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [criterioRicerca, stati, pageNumber]);

  const handleOnChangePage = (pageNumber: number = pagination?.pageNumber) => {
    dispatch(setEntityPagination({ pageNumber }));
  };

  const handleOnSearch = (searchValue: string) => {
    dispatch(setEntityFilters({ criterioRicerca: searchValue }));
  };

  // HANDLE TOGGLE CHANGE for SCD and RFD
  const handleToggleChange = (
    flagType: 'scd' | 'rfd',
    flagChecked: boolean,
    surveyId: string
  ) => {
    dispatch(UpdateSurveyExclusiveField({ flagType, flagChecked, surveyId }));
  };

  const handleDropdownFilters = (values: FilterI[], filterKey: string) => {
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
    dispatch(GetFilterValuesSurvey(filterId as 'tipo' | 'stato')); // esempio di parametro con cui filtrare le opzioni tramite api
  };

  const handleDownloadList = () => {
    dispatch(DownloadEntityValues({ entity }));
  };

  const searchInformation: SearchInformationI = {
    autocomplete: false,
    onHandleSearch: handleOnSearch,
    placeholder:
      filter.value === 'questionnaire'
        ? "Inserisci il nome o l'identificativo del questionario"
        : 'Cerca addendum',
    isClearable: true,
    title:
      filter.value === 'questionnaire'
        ? 'Cerca Questionario'
        : 'Cerca Addendum',
  };

  const dropdowns: DropdownFilterI[] = [
    {
      filterName: 'Stato',
      options: dropdownFilterOptions[statusDropdownLabel],
      onOptionsChecked: (options) =>
        handleDropdownFilters(options, statusDropdownLabel),
      id: statusDropdownLabel,
      values: filtersList[statusDropdownLabel],
      handleOnSearch: (searchKey) =>
        handleOnSearchDropdownOptions(searchKey, statusDropdownLabel),
      valueSearch: searchDropdown
        ?.filter((f) => f.filterId === statusDropdownLabel)[0]
        ?.value?.toString(),
    },
  ];

  const onActionClick: CRUDActionsI = {
    [CRUDActionTypes.VIEW]: (td: TableRowI | string) => {
      navigate(
        `/area-amministrativa/questionari/${
          typeof td !== 'string' ? td.id : td
        }/info`
      );
    },
    [CRUDActionTypes.CLONE]: (td: TableRowI | string) => {
      // TODO: chiamata per clonare questionario
      navigate(
        `/area-amministrativa/questionari/${
          typeof td !== 'string' ? td.id : td
        }/clona`
      );
    },
  };

  const objectToPass =
    filter.value === 'questionnaire'
      ? { ...questionaraireCta }
      : { ...addendumCta };

  //const device = useAppSelector(selectDevice);

  return (
    /*  <div className={clsx(device.mediaIsDesktop && 'row')}>
     {device.mediaIsDesktop && (
        <div className='col-2 mr-2'>
          <SideSelection
            filterOptions={questionnaireOptionsMock}
            onFilterChange={setFilter}
            defaultOption={questionnaireOptionsMock[0]}
          />
        </div>
      )}  */

    <div>
      <PageTitle
        title={
          filter.value === 'questionnaire'
            ? 'Elenco Questionari'
            : 'Elenco Addendum'
        }
      />
      <GenericSearchFilterTableLayout
        searchInformation={searchInformation}
        filtersList={filtersList}
        dropdowns={dropdowns}
        {...objectToPass}
        ctaDownload={handleDownloadList}
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
            total={questionariList.list.length}
            onChange={handleOnChangePage}
          />
        </div>
      </GenericSearchFilterTableLayout>
    </div>
    /* </div> */
  );
};

export default Surveys;
