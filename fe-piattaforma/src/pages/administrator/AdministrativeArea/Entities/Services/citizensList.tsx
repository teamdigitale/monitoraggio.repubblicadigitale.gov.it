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
import { DetailsRow, EmptySection } from '../../../../../components';
import { CRUDActionsI, CRUDActionTypes } from '../../../../../utils/common';
import { TableRowI } from '../../../../../components/Table/table';
import { ButtonInButtonsBar } from '../../../../../components/ButtonsBar/buttonsBar';
import { openModal } from '../../../../../redux/features/modal/modalSlice';
import { CardCounterI } from '../../../../../components/CardCounter/cardCounter';
import { formTypes } from '../utils';
import ManageCitizenInService from '../modals/manageCitizenInService';
import ConfirmSentSurveyModal from '../modals/confirmSentSurveyModal';
import { resetCompilingSurveyForm } from '../../../../../redux/features/administrativeArea/surveys/surveysSlice';

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
  };
}

const statusDropdownLabel = 'statiQuestionario';

const CitizensList: React.FC = () => {
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

  useEffect(() => {
    dispatch(resetCompilingSurveyForm());
  }, []);

  const getServiceDetailsCitizens = () => {
    dispatch(GetCitizenListServiceDetail(serviceId));
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
    dispatch(setEntityFilters({ criterioRicerca: searchValue }));
  };

  const searchInformation: SearchInformationI = {
    title: 'Cerca cittadino',
    onHandleSearch: handleOnSearch,
    placeholder:
      'Cerca cittadino per nome, cognome, codice fiscale o  numero  documento',
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
      text: 'Carica lista cittadini',
      outline: true,
      iconForButton: 'it-upload',
      buttonClass: 'btn-secondary',
      iconColor: 'primary',
      color: 'primary',
    },
    {
      text: 'Aggiungi cittadino',
      color: 'primary',
      onClick: () => {
        dispatch(openModal({ id: 'search-citizen-modal' }));
      },
    },
  ];

  const emptyButtons: ButtonInButtonsBar[] = [
    {
      size: 'xs',
      outline: true,
      buttonClass: 'btn-secondary',
      color: 'primary',
      text: 'Carica lista cittadini',
      onClick: () => console.log('carica csv'),
    },
    {
      size: 'xs',
      color: 'primary',
      text: 'Aggiungi cittadino',
      onClick: () =>
        dispatch(
          openModal({
            id: 'search-citizen-modal',
          })
        ),
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

  return (
    <div>
      {citizens?.cittadini?.length > 0 ? (
        <GenericSearchFilterTableLayout
          searchInformation={searchInformation}
          dropdowns={dropdowns}
          buttonsList={buttons}
          filtersList={filtersList}
          cardsCounter={cardsCounter}
          isDetail
          citizenList={true}
          tooltip
          tooltiptext='Cerca cittadino per nome, cognome, codice fiscale o  numero  documento'
        >
          {(citizens?.cittadini || []).map((citizen: CitizenI, i: number) => (
            <DetailsRow
              key={i}
              nome={citizen?.nome + ' ' + citizen?.cognome}
              stato={citizen?.statoQuestionario?.replace('_', ' ') || ''}
              onActionClick={onActionClick}
              id={citizen?.idCittadino || ''}
              innerInfo={{
                ID: citizen?.idCittadino || '-',
                'Codice Fiscale': citizen?.codiceFiscale || '-',
                'Numero Documento': citizen?.numeroDocumento || '-',
              }}
              rowInfoType='questionario'
              idQuestionario={citizen?.idQuestionario || ''}
            />
          ))}
        </GenericSearchFilterTableLayout>
      ) : (
        <EmptySection
          title='Questa sezione è ancora vuota'
          subtitle='Aggiungi i cittadini'
          buttons={emptyButtons}
        />
      )}
      <ManageCitizenInService />
      <ConfirmSentSurveyModal />
    </div>
  );
};

export default CitizensList;
