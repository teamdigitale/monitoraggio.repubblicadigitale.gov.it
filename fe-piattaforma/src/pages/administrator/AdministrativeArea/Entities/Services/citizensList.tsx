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
  setEntityFilters,
} from '../../../../../redux/features/administrativeArea/administrativeAreaSlice';
import {
  CitizenListI,
  GetCitizenListServiceDetail,
  GetServicesDetailFilters,
} from '../../../../../redux/features/administrativeArea/services/servicesThunk';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { formFieldI } from '../../../../../utils/formHelper';
import { DetailsRow } from '../../../../../components';
import { CRUDActionsI, CRUDActionTypes } from '../../../../../utils/common';
import { TableRowI } from '../../../../../components/Table/table';
import { ButtonInButtonsBar } from '../../../../../components/ButtonsBar/buttonsBar';
import { openModal } from '../../../../../redux/features/modal/modalSlice';
import { CardCounterI } from '../../../../../components/CardCounter/cardCounter';

export interface CitizenI {
  id?: string;
  nome?: string;
  stato?: string;
  innerInfo?: {
    ID: string;
    codiceFiscale: string;
  };
}

interface CitizensListI {
  citizens: CitizenListI;
}

const statusDropdownLabel = 'statiQuestionario';

const CitizensList: React.FC<CitizensListI> = ({ citizens }) => {
  const { serviceId } = useParams();
  const dispatch = useDispatch();
  const dropdownFilterOptions = useAppSelector(selectEntityFiltersOptions);
  const filtersList = useAppSelector(selectEntityFilters);
  const { criterioRicerca, statiQuestionario } = filtersList;
  const [searchDropdown, setSearchDropdown] = useState<
    { filterId: string; value: formFieldI['value'] }[]
  >([]);

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
    title:
      'Cerca cittadino per nome, cognome, codice fiscale o  numero  documento',
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
      console.log(td);
      //TODO REPLACE WITH DYNAMIC ID WHEN WE HAVE THE APIS
    },
    [CRUDActionTypes.EDIT]: (td: TableRowI | string) => {
      console.log(td);
      //TODO REPLACE WITH DYNAMIC ID WHEN WE HAVE THE APIS
    },
    [CRUDActionTypes.PRINT]: (td: TableRowI | string) => {
      console.log(td);
      //TODO REPLACE WITH DYNAMIC ID WHEN WE HAVE THE APIS
    },
    [CRUDActionTypes.DELETE]: (td: TableRowI | string) => {
      console.log(td);
      //TODO REPLACE WITH DYNAMIC ID WHEN WE HAVE THE APIS
    },
    [CRUDActionTypes.COMPILE]: (td: TableRowI | string) => {
      console.log(td);
      //TODO REPLACE WITH DYNAMIC ID WHEN WE HAVE THE APIS
    },
    [CRUDActionTypes.SEND]: (td: TableRowI | string) => {
      console.log(td);
      //TODO REPLACE WITH DYNAMIC ID WHEN WE HAVE THE APIS
    },
  };

  const buttons: ButtonInButtonsBar[] = [
    {
      text: 'Carica lista cittadini',
      outline: true,
      iconForButton: 'it-upload',
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
    <div className='container'>
      <GenericSearchFilterTableLayout
        searchInformation={searchInformation}
        dropdowns={dropdowns}
        buttonsList={buttons}
        //showButtons={false}
        filtersList={filtersList}
        cardsCounter={cardsCounter}
      >
        {(citizens?.servizi || []).map((citizen: CitizenI, i: number) => (
          <DetailsRow
            key={i}
            nome={citizen.nome || ''}
            stato={citizen.stato || ''}
            onActionClick={onActionClick}
            id={citizen.nome || ''}
            innerInfo={citizen.innerInfo || { ID: '', codiceFiscale: '' }}
            rowInfoType='questionario'
          />
        ))}
      </GenericSearchFilterTableLayout>
    </div>
  );
};

export default CitizensList;
