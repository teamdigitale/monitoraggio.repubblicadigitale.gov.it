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
  GetServicesDetail,
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

interface CitizensListI {
  citizens: [];
}

const statusDropdownLabel = 'stati';

const CitizensList: React.FC<CitizensListI> = ({ citizens }) => {
  const { serviceId } = useParams();
  const dispatch = useDispatch();
  const dropdownFilterOptions = useAppSelector(selectEntityFiltersOptions);
  const filtersList = useAppSelector(selectEntityFilters);
  const { criterioRicerca, stati } = filtersList;
  const [searchDropdown, setSearchDropdown] = useState<
    { filterId: string; value: formFieldI['value'] }[]
  >([]);

  const getServiceDetails = () => {
    dispatch(GetServicesDetail(serviceId));
  };

  const getAllFilters = () => {
    dispatch(GetServicesDetailFilters());
  };

  useEffect(() => {
    getAllFilters();
    getServiceDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [criterioRicerca, stati]);

  const serachInformation: SearchInformationI = {
    title:
      'Cerca cittadino per nome, cognome, codice fiscale o  numero  documento',
    onHandleSearch: (searchValue: string) => console.log(searchValue),
    placeholder:
      'Cerca cittadino per nome, cognome, codice fiscale o  numero  documento',
    autocomplete: false,
    isClearable: true,
  };

  useEffect(() => {
    console.log(citizens);
  }, [citizens]);

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
      filterName: 'Stati',
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

  return (
    <GenericSearchFilterTableLayout
      searchInformation={serachInformation}
      dropdowns={dropdowns}
      buttonsList={buttons}
      showButtons={false}
      filtersList={filtersList}
    >
      {citizens.map((citizen: any) => (
        <DetailsRow
          nome={citizen.nome}
          stato={citizen.stato}
          onActionClick={onActionClick}
          id={citizen.name}
          innerInfo={citizen.innerInfo}
          rowInfoType='questionario'
        />
      ))}
    </GenericSearchFilterTableLayout>
  );
};

export default CitizensList;
