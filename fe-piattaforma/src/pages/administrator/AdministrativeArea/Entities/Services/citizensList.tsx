import React, { useEffect, useState } from 'react';
import GenericSearchFilterTableLayout, {
  SearchInformationI,
} from '../../../../../components/genericSearchFilterTableLayout/genericSearchFilterTableLayout';
import {
  DropdownFilterI,
  FilterI,
} from '../../../../../components/DropdownFilter/dropdownFilter';
import { useAppSelector } from '../../../../../redux/hooks';
import {
  resetSezioniQuestionarioTemplateIstanze,
  selectEntityFilters,
  selectEntityFiltersOptions,
  selectServices,
  setEntityFilters,
} from '../../../../../redux/features/administrativeArea/administrativeAreaSlice';
import {
  GetCitizenListServiceDetail,
  GetServicesDetailFilters,
  SendSurveyToCitizen,
} from '../../../../../redux/features/administrativeArea/services/servicesThunk';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { formFieldI } from '../../../../../utils/formHelper';
import { DetailsRow, EmptySection, Table } from '../../../../../components';
import { CRUDActionsI, CRUDActionTypes } from '../../../../../utils/common';
import {
  newTable,
  TableHeadingI,
  TableRowI,
} from '../../../../../components/Table/table';
import { ButtonInButtonsBar } from '../../../../../components/ButtonsBar/buttonsBar';
import { openModal } from '../../../../../redux/features/modal/modalSlice';
import { CardCounterI } from '../../../../../components/CardCounter/cardCounter';
import { formTypes } from '../utils';
import ManageCitizenInService from '../modals/manageCitizenInService';
import ConfirmSentSurveyModal from '../modals/confirmSentSurveyModal';
import { resetCompilingSurveyForm } from '../../../../../redux/features/administrativeArea/surveys/surveysSlice';
import UploadCSVModal from '../../../../../components/AdministrativeArea/Entities/General/UploadCSVModal/UploadCSVModal';
import moment from 'moment';

const CitizenTemplate = '/assets/entity_templates/template_cittadino.xlsx';

export interface CitizenI {
  idCittadino?: string;
  nome?: string;
  cognome?: string;
  stato?: string;
  codiceFiscale?: string;
  idQuestionario?: string;
  statoQuestionario?: string;
  numeroDocumento?: string;
  innerInfo?: {
    ID: string;
    codiceFiscale: string;
    numeroDocumento: string;
    dataUltimoAggiornamento: number;
  };
  dataUltimoAggiornamento?: number;
}

const statusDropdownLabel = 'statiQuestionario';

const CitizenListTableHeading: TableHeadingI[] = [
  {
    label: 'Nome',
    field: 'nome',
    size: 'medium',
  },
  {
    label: 'Cognome',
    field: 'cognome',
    size: 'medium',
  },
  {
    label: 'Codice Fiscale',
    field: 'codiceFiscale',
    size: 'medium',
  },
  {
    label: 'Esito',
    field: 'esito',
    size: 'small',
  },
];

const CitizensList: React.FC<{ dataServizio: Date }> = ({ dataServizio }) => {
  const { serviceId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const citizens = useAppSelector(selectServices)?.detail?.cittadini;
  const dropdownFilterOptions = useAppSelector(selectEntityFiltersOptions);
  const filtersList = useAppSelector(selectEntityFilters);
  const { criterioRicerca, statiQuestionario } = filtersList;
  const [searchDropdown, setSearchDropdown] = useState<
    { filterId: string; value: formFieldI['value'] }[]
  >([]);
  const [citizenListTable, setCitizenListTable] = useState(
    newTable(CitizenListTableHeading, [])
  );

  useEffect(() => {
    dispatch(resetCompilingSurveyForm());
    dispatch(resetSezioniQuestionarioTemplateIstanze());
  }, []);
  const [alreadySearched, setAlreadySearched] = useState(false);

  const getServiceDetailsCitizens = () => {
    dispatch(GetCitizenListServiceDetail(serviceId, true));
  };

  const getAllFilters = () => {
    dispatch(GetServicesDetailFilters(serviceId));
  };

  useEffect(() => {
    getAllFilters();
    getServiceDetailsCitizens();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [criterioRicerca, statiQuestionario]);

  const handleOnSearch = (searchValue: string) => {
    dispatch(
      setEntityFilters({
        criterioRicerca: searchValue,
      })
    );
    setAlreadySearched(true);
  };

  const searchInformation: SearchInformationI = {
    title: 'Cerca cittadino',
    onHandleSearch: handleOnSearch,
    placeholder: 'Cerca cittadino per codice fiscale',
    autocomplete: false,
    isClearable: true,
  };

  const handleDropdownFilters = (
    values: FilterI[],
    filterKey: 'statiQuestionario'
  ) => {
    dispatch(setEntityFilters({ [filterKey]: [...values] }));
  };

  const handleOnSearchDropdownOptions = (
    searchValue: formFieldI['value'],
    filterId: 'statiQuestionario'
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

  const onActionClick: CRUDActionsI = {
    [CRUDActionTypes.VIEW]: (td: TableRowI | string) => {
      navigate(
        `/area-amministrativa/servizi/${serviceId}/cittadini/compilato/${td}`
      );
    },
    [CRUDActionTypes.EDIT]: (td: TableRowI | string) => {
      dispatch(
        openModal({
          id: formTypes.SERVICE_CITIZEN,
          payload: { idCittadino: td, serviceId: serviceId, viewMode: false },
        })
      );
    },
    // [CRUDActionTypes.PRINT]: (td: TableRowI | string) => {
    //   console.log(td);
    //   //TODO REPLACE WITH DYNAMIC ID WHEN WE HAVE THE APIS
    // },
    // [CRUDActionTypes.DELETE]: (td: TableRowI | string) => {
    //   console.log(td);
    //   //TODO REPLACE WITH DYNAMIC ID WHEN WE HAVE THE APIS
    // },
    [CRUDActionTypes.COMPILE]: (td: TableRowI | string) => {
      navigate(
        `/area-amministrativa/servizi/${serviceId}/cittadini/compila/${td}`
      );
    },
    [CRUDActionTypes.SEND]: async (td: TableRowI | string) => {
      if (typeof td !== 'string') {
        const res = await dispatch(
          SendSurveyToCitizen(
            td?.idCittadino.toString(),
            td?.idQuestionario.toString()
          )
        );
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (res === 'error') {
          dispatch(
            openModal({
              id: 'confirmSentSurveyModal',
              payload: {
                text: 'Questionario non inviato correttamente!',
                error: true,
              },
            })
          );
        } else {
          dispatch(
            openModal({
              id: 'confirmSentSurveyModal',
              payload: {
                text: 'Questionario inviato correttamente!',
                error: false,
              },
            })
          );
        }
      }
      getServiceDetailsCitizens();
      getAllFilters();
    },
  };

  const buttons: ButtonInButtonsBar[] = [
    {
      text: 'Aggiungi cittadino',
      color: 'primary',
      disabled: moment().isBefore(moment(dataServizio)),
      onClick: () => {
        dispatch(openModal({ id: 'search-citizen-modal' }));
      },
    },
  ];

  const cardsCounter: CardCounterI[] = [
    {
      title: 'Cittadini partecipanti',
      counter: citizens?.numeroCittadini || 0,
      icon: 'it-user',
      className: 'mr-4',
    },
    {
      title: 'Questionari compilati',
      counter: citizens?.numeroQuestionariCompilati || 0,
      icon: 'it-file',
    },
  ];

  const handleCitizenUploadEsito = (esito: { list: any[] }) => {
    const { list = [] } = esito;
    const table = newTable(
      CitizenListTableHeading,
      list.map((td: any) => ({
        nome: td.nome,
        cognome: td.cognome,
        codiceFiscale: td.codiceFiscale,
        esito: (td.esito || '').toUpperCase().includes('OK')
          ? 'Riuscito'
          : 'Non riuscito',
        failedCSV: td.esito.toUpperCase().includes('KO'),
        onTooltipInfo: td.esito,
      }))
    );
    setCitizenListTable(table);
  };

  return (
    <div>
      {citizens?.cittadini?.length > 0 ||
      (citizens?.cittadini?.length === 0 && alreadySearched) ? (
        <GenericSearchFilterTableLayout
          searchInformation={searchInformation}
          dropdowns={dropdowns}
          buttonsList={buttons}
          filtersList={filtersList}
          cardsCounter={cardsCounter}
          isDetail
          citizenList={true}
          tooltip
          tooltiptext='Cerca cittadino per codice fiscale'
        >
          <table className='details-table-container'>
            {(citizens?.cittadini || []).map((citizen: CitizenI, i: number) => (
              <DetailsRow
                key={i}
                stato={citizen?.statoQuestionario?.replace('_', ' ') || ''}
                onActionClick={onActionClick}
                id={citizen?.idCittadino || ''}
                innerInfo={{
                  id: citizen?.idCittadino || '-',
                  DataUltimoAggiornamento: moment(
                    citizen?.dataUltimoAggiornamento
                  ).format('DD-MM-YYYY HH:mm'),
                }}
                rowInfoType='Rilevazione esperienza'
                idQuestionario={citizen?.idQuestionario || ''}
              />
            ))}
          </table>
          {citizens?.cittadini?.length === 0 && alreadySearched && (
            <EmptySection title='Cittadino non associato al servizio' />
          )}
        </GenericSearchFilterTableLayout>
      ) : (
        moment().isBefore(moment(dataServizio)) ? (
          <EmptySection
            title='La data del servizio è impostata nel futuro'
            subtitle='Sarà possibile aggiungere i cittadini a questo servizio a partire dalla data indicata'
            buttons={buttons}
          />
          ) : (
          <EmptySection
            title='Questa sezione è ancora vuota'
            subtitle='Aggiungi i cittadini'
            buttons={buttons}
          />
          )
        )}
      <ManageCitizenInService />
      <ConfirmSentSurveyModal />
      <UploadCSVModal
        accept='.xlsx'
        onClose={() => {
          if (serviceId) dispatch(GetCitizenListServiceDetail(serviceId, true));
        }}
        onEsito={handleCitizenUploadEsito}
        template={CitizenTemplate}
        templateName='cittadini-template.xlsx'
        citizens
      >
        <Table
          {...citizenListTable}
          succesCSV
          withActions
          id='table-ente-partner'
        />
      </UploadCSVModal>
    </div>
  );
};

export default CitizensList;
