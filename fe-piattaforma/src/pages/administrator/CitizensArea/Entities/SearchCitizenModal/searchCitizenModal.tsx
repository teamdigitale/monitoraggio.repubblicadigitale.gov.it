import React, { useEffect, useState } from 'react';
import GenericModal from '../../../../../components/Modals/GenericModal/genericModal';
import { useDispatch } from 'react-redux';
import { closeModal } from '../../../../../redux/features/modal/modalSlice';
import { useAppSelector } from '../../../../../redux/hooks';
import {
  CittadinoInfoI,
  selectEntitySearchMultiResponse,
  selectEntitySearchResponse,
} from '../../../../../redux/features/citizensArea/citizensAreaSlice';
import isEmpty from 'lodash.isempty';
import CitizenTableResult from './citizenTableResult';
import NoResultsFound from '../../../../../components/NoResultsFound/noResultsFound';
import Infocard from '../../../../../components/InfoCard/infoCard';
import SearchBarOptions from '../../../../../components/SearchBarOptions/searchBarOptions';
import { formFieldI } from '../../../../../utils/formHelper';
import { TableRowI } from '../../../../../components/Table/table';
import { addCitizenToList } from '../../../../../redux/features/administrativeArea/administrativeAreaSlice';
import FormCitizen from '../../../../forms/formCitizen';

const id = 'search-citizen-modal';

export const selectedSteps = {
  FISCAL_CODE: 'codiceFiscale',
  DOC_NUMBER: 'numeroDoc',
  ADD_CITIZEN: 'addCitizen',
};

interface SearchCitizenModalI {
  onConfirmText?: string;
  onConfirmFunction?: (
    newCitizen:
      | {
          [key: string]:
            | string
            | number
            | boolean
            | Date
            | string[]
            | undefined;
        }
      | undefined
  ) => void;
}

/*
 Casistiche in fase di ricerca nella sezione dei servizi:
 1. l'utente trovato è unico. In quel caso citizenData contiene un oggetto, si clicca aggiungi e fine.
 2. vengono trovati utenti multipli, quindi citizenData è un array di oggetti => si renderizza la tabella da cui l'utente seleziona una
    riga e poi preme aggiungi
 3. non si trova l'utente cercato, attualmente impostato con la response che contiene la proprietà *message* => **il backend deve darci
    modo di differenziare se abbiamo il citizenData vuoto perché
    ancora non abbiamo cercato, o se abbiamo cercato ma non abbiamo risultati**:
      a. se si preme aggiungi la prima volta, viene visualizzato il form di creazione di un utente che ritorna i dati inseriti che vengono
         salvati in newUserValues
      b. se si preme aggiungi la seconda volta, questo utente viene creato e conseguentemente aggiunto al servizio (azioni da fare dentro
         allo stesso thunk per averle sincrone)
  */

const SearchCitizenModal: React.FC<SearchCitizenModalI> = ({
  onConfirmText,
  onConfirmFunction,
}) => {
  const [currentStep, setCurrentStep] = useState<string>(
    selectedSteps.FISCAL_CODE
  );
  const dispatch = useDispatch();
  const citizenData: CittadinoInfoI | CittadinoInfoI[] | undefined =
    useAppSelector(selectEntitySearchResponse);
  const multipleCitizenData: CittadinoInfoI[] = useAppSelector(
    selectEntitySearchMultiResponse
  );
  const [newUserValues, setNewUserValues] = useState<{
    [key: string]: string | number | boolean | Date | string[] | undefined;
  }>();
  const [selectedCitizen, setSelectedCitizen] = useState<TableRowI | string>(
    ''
  );
  const [validForm, setFormValid] = useState<boolean>(false);

  useEffect(() => {
    if (
      citizenData &&
      Object.keys(citizenData).length !== 0 &&
      Object.getPrototypeOf(citizenData) === Object.prototype
    ) {
      //setCurrentStep(selectedSteps.RESULT_FOUND);
    } else {
      // setCurrentStep(selectedSteps.RESULT_NOT_FOUND);
    }
  }, [citizenData]);

  const loadCorrectStep = () => {
    if (
      (!isEmpty(citizenData) || !isEmpty(multipleCitizenData)) &&
      !citizenData.message &&
      (currentStep === selectedSteps.FISCAL_CODE ||
        currentStep === selectedSteps.DOC_NUMBER)
    ) {
      return isEmpty(citizenData) ? (
        <CitizenTableResult
          data={multipleCitizenData}
          onCitizenSelected={(citizen) => setSelectedCitizen(citizen)}
        />
      ) : (
        <>
          <Infocard
            text='Il cittadino inserito è già incluso nella tua lista I miei cittadini'
            icon={{
              icon: 'it-user',
              color: 'white',
              backgroundColor: '#D1E7FF',
              borderRadius: '50%',
              size: 'lg',
            }}
          />
          <FormCitizen info={citizenData} />
        </>
      );
    }
    if (currentStep === selectedSteps.ADD_CITIZEN) {
      return (
        <FormCitizen
          sendNewValues={(newData?: { [key: string]: formFieldI['value'] }) => {
            setNewUserValues({ ...newData });
          }}
          isFormValid={(isValid: boolean) => setFormValid(isValid)}
          creation
        />
      );
    }
    if (citizenData.message) {
      return <NoResultsFound />;
    }
  };

  const onClose = () => {
    dispatch(closeModal());
  };

  const onConfirm = () => {
    if (onConfirmFunction) {
      if (
        citizenData.message &&
        (currentStep === selectedSteps.FISCAL_CODE ||
          currentStep === selectedSteps.DOC_NUMBER)
      ) {
        setCurrentStep(selectedSteps.ADD_CITIZEN);
      } else if (currentStep === selectedSteps.ADD_CITIZEN) {
        return onConfirmFunction(newUserValues);
      }
    }
    if (typeof selectedCitizen === 'object') {
      // TODO: manca POST per aggiungere cittadino?
      dispatch(
        addCitizenToList({
          id: `${new Date().getTime()}`,
          nome: selectedCitizen?.nome + ' ' + selectedCitizen?.cognome,
          stato: 'NON INVIATO', // TODO: rendere campo dinamico
          innerInfo: {
            ID: '', // TODO: rendere campo dinamico
            codiceFiscale: selectedCitizen?.codiceFiscale.toString(),
          },
        })
      );
    }
    onClose();
  };

  const addCitizen = () => {
    setCurrentStep(selectedSteps.ADD_CITIZEN);
  };

  return (
    <GenericModal
      id={id}
      title='Aggiungi cittadino'
      noPaddingPrimary
      primaryCTA={{
        label: `${onConfirmText || 'Compila questionario'}`,
        onClick:
          citizenData.message &&
          (currentStep === selectedSteps.FISCAL_CODE ||
            currentStep === selectedSteps.DOC_NUMBER)
            ? addCitizen
            : onConfirm,
        disabled:
          (isEmpty(citizenData) &&
            !citizenData?.message &&
            (isEmpty(multipleCitizenData) || selectedCitizen === '')) ||
          (currentStep === selectedSteps.ADD_CITIZEN && !validForm),
      }}
      secondaryCTA={{
        label: 'Annulla',
        onClick: onClose,
      }}
      centerButtons
      onClose={onClose}
    >
      <div className='d-flex flex-column search-citizen-modal'>
        <div className='mb-5'>
          {currentStep !== selectedSteps.ADD_CITIZEN && (
            <SearchBarOptions
              setCurrentStep={setCurrentStep}
              currentStep={currentStep}
              steps={(({ FISCAL_CODE, DOC_NUMBER }) => ({
                FISCAL_CODE,
                DOC_NUMBER,
              }))(selectedSteps)}
            />
          )}
          <div className='d-block px-5 mt-5'>{loadCorrectStep()}</div>
        </div>
      </div>
    </GenericModal>
  );
};

export default SearchCitizenModal;
