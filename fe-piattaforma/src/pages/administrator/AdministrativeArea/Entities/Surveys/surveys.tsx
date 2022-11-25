import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FormGroup, Toggle } from 'design-react-kit';
import {
  EmptySection,
  Paginator,
  StatusChip,
  Table,
} from '../../../../../components';
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
  DownloadEntityValuesQueryParams,
  GetEntityFilterQueryParamsValues,
} from '../../../../../redux/features/administrativeArea/administrativeAreaThunk';
import {
  TableHeadingQuestionnaires,
  TableHeadingQuestionnairesLite,
} from '../utils';

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
  GetAllSurveys,
  UpdateSurveyExclusiveField,
} from '../../../../../redux/features/administrativeArea/surveys/surveysThunk';
import { formatDate } from '../../../../../utils/datesHelper';
import useGuard from '../../../../../hooks/guard';
import { resetSurveyDetails } from '../../../../../redux/features/administrativeArea/surveys/surveysSlice';
import IconNote from '/public/assets/img/it-note-primary.png';

const entity = 'questionarioTemplate';
const statusDropdownLabel = 'stato';

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
  const [filterDropdownSelected, setFilterDropdownSelected] =
    useState<string>('');

  const { hasUserPermission } = useGuard();

  const { criterioRicerca, stato } = filtersList;

  const { pageNumber } = pagination;

  useEffect(() => {
    dispatch(setEntityPagination({ pageSize: 8 }));
    dispatch(resetSurveyDetails());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateTableValues = () => {
    const table = newTable(
      hasUserPermission(['new.quest.templ'])
        ? TableHeadingQuestionnaires
        : TableHeadingQuestionnairesLite,
      questionariList?.list.map((td) => ({
        idShort: td.id.split('-')[0],
        id: td.id,
        nome: td.nome,
        status: <StatusChip status={td.stato} rowTableId={td.id} />,

        dataUltimaModifica:
          formatDate(td.dataUltimaModifica, 'shortDate') || '-',
        defaultSCD: (
          <FormGroup check className='table-container__toggle-button'>
            {console.log(td)}
            <Toggle
              label=''
              aria-labelledby={`toggle-SCD-${td.id}`}
              disabled={!hasUserPermission(['new.quest.templ'])}
              checked={td.defaultSCD}
              onChange={(e) =>
                handleToggleChange('SCD', e.target.checked, td.id)
              }
            />
            <span id={`toggle-SCD-${td.id}`} className='d-none'>
              {td?.nome} Default SCD
            </span>
          </FormGroup>
        ),
        defaultRFD: (
          <FormGroup check className='table-container__toggle-button'>
            <Toggle
              label=''
              aria-labelledby={`toggle-RFD-${td.id}`}
              disabled={!hasUserPermission(['new.quest.templ'])}
              checked={td.defaultRFD}
              onChange={(e) =>
                handleToggleChange('RFD', e.target.checked, td.id)
              }
            />
            <span id={`toggle-RFD-${td.id}`} className='d-none'>
              {td?.nome} Default RFD
            </span>
          </FormGroup>
        ),
      }))
    );
    return table;
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
    if (Array.isArray(questionariList?.list) && questionariList.list.length)
      setTableValues(updateTableValues());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionariList?.list]);

  const getSurveysList = () => {
    dispatch(GetAllSurveys());
  };

  const getAllFilters = () => {
    // TODO: check chiavi filtri
    if (filterDropdownSelected !== 'stato')
      dispatch(
        GetEntityFilterQueryParamsValues({
          entity,
          dropdownType: 'stati',
        })
      );
  };

  useEffect(() => {
    getAllFilters();
    getSurveysList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [criterioRicerca, stato, pageNumber]);

  const handleOnChangePage = (pageNumber: number = pagination?.pageNumber) => {
    dispatch(setEntityPagination({ pageNumber }));
  };

  const handleOnSearch = (searchValue: string) => {
    dispatch(setEntityFilters({ criterioRicerca: searchValue }));
  };

  // HANDLE TOGGLE CHANGE for SCD and RFD
  const handleToggleChange = async (
    flagType: 'SCD' | 'RFD',
    flagChecked: boolean,
    surveyId: string
  ) => {
    await dispatch(
      UpdateSurveyExclusiveField({ flagType, flagChecked, surveyId })
    );
    // update the table
    await dispatch(GetAllSurveys());
  };

  const handleDropdownFilters = (values: FilterI[], filterKey: string) => {
    setFilterDropdownSelected(filterKey);
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

  const handleDownloadList = () => {
    dispatch(DownloadEntityValuesQueryParams({ entity }));
  };

  const searchInformation: SearchInformationI = {
    autocomplete: false,
    onHandleSearch: handleOnSearch,
    placeholder:
      filter.value === 'questionnaire'
        ? "Inserisci il nome o l'ID del questionario"
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
      options: dropdownFilterOptions['stati'],
      onOptionsChecked: (options) =>
        handleDropdownFilters(options, statusDropdownLabel),
      id: statusDropdownLabel,
      values: filtersList[statusDropdownLabel] || [],
      handleOnSearch: (searchKey) =>
        handleOnSearchDropdownOptions(searchKey, statusDropdownLabel),
      valueSearch: searchDropdown
        ?.filter((f) => f.filterId === statusDropdownLabel)[0]
        ?.value?.toString(),
    },
  ];

  const onActionClick: CRUDActionsI = hasUserPermission([
    'view.quest.templ',
    'new.quest.templ',
  ])
    ? {
        [CRUDActionTypes.VIEW]: (td: TableRowI | string) => {
          navigate(
            `/area-amministrativa/questionari/${
              typeof td !== 'string' ? td.id : td
            }`
          );
        },
        [CRUDActionTypes.CLONE]: (td: TableRowI | string) => {
          navigate(
            `/area-amministrativa/questionari/${
              typeof td !== 'string' ? td.id : td
            }/clona`
          );
        },
      }
    : hasUserPermission(['view.quest.templ'])
    ? {
        [CRUDActionTypes.VIEW]: (td: TableRowI | string) => {
          navigate(
            `/area-amministrativa/questionari/${
              typeof td !== 'string' ? td.id : td
            }`
          );
        },
      }
    : hasUserPermission(['new.quest.templ'])
    ? {
        [CRUDActionTypes.CLONE]: (td: TableRowI | string) => {
          navigate(
            `/area-amministrativa/questionari/${
              typeof td !== 'string' ? td.id : td
            }/clona`
          );
        },
      }
    : {};

  const objectToPass =
    filter.value === 'questionnaire'
      ? { ...questionaraireCta }
      : { ...addendumCta };

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
            ? 'Elenco questionari'
            : 'Elenco Addendum'
        }
        sectionInfo={hasUserPermission(['new.quest.templ'])}
        defaultOpen={hasUserPermission(['new.quest.templ'])}
      />
      <GenericSearchFilterTableLayout
        searchInformation={searchInformation}
        filtersList={filtersList}
        dropdowns={dropdowns}
        {...objectToPass}
        ctaDownload={handleDownloadList}
        resetFilterDropdownSelected={() => setFilterDropdownSelected('')}
        tooltip
        tooltiptext={searchInformation.placeholder}
      >
        <div>
          {questionariList?.list?.length && tableValues?.values?.length ? (
            <>
              <Table
                {...tableValues}
                id='table'
                onActionClick={onActionClick}
                onCellClick={(field, row) => console.log(field, row)}
                withActions
                totalCounter={pagination?.totalElements}
                surveysTable
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
              title='Non sono presenti questionari'
              subtitle='associati al tuo ruolo'
              icon={IconNote}
              withIcon
            />
          )}
        </div>
      </GenericSearchFilterTableLayout>
    </div>
    /* </div> */
  );
};

export default Surveys;
