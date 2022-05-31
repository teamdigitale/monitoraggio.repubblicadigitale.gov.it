import React, { useEffect, useState } from 'react';
import GenericModal from '../../../../../components/Modals/GenericModal/genericModal';
import {} from '../../../../../components';
import CitizenFormResult from './citizenFormResult';
//import NoResultsFound from '../../../../../components/NoResultsFound/noResultsFound';
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

const id = 'search-citizen-modal';

export const selectedSteps = {
  FISCAL_CODE: 'codiceFiscale',
  DOC_NUMBER: 'numeroDoc',
};

const SearchCitizenModal: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<string>();
  const dispatch = useDispatch();
  const citizenData: CittadinoInfoI | CittadinoInfoI[] | undefined =
    useAppSelector(selectEntitySearchResponse);
  const multipleCitizenData: CittadinoInfoI[] = useAppSelector(
    selectEntitySearchMultiResponse
  );

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

  useEffect(() => {
    setCurrentStep(selectedSteps.FISCAL_CODE);
  }, []);

  const loadCorrectStep = () => {
    if (
      (!isEmpty(citizenData) || !isEmpty(multipleCitizenData)) &&
      (currentStep === selectedSteps.FISCAL_CODE ||
        currentStep === selectedSteps.DOC_NUMBER)
    ) {
      return isEmpty(citizenData) ? (
        <CitizenTableResult data={multipleCitizenData} />
      ) : (
        <>
          <Infocard
            text='Il cittadino inserito non è incluso nella tua lista ma è già presente in piattaforma'
            icon={{
              icon: 'it-user',
              color: 'white',
              backgroundColor: '#D1E7FF',
              borderRadius: '50%',
              size: 'lg',
            }}
          />
          <CitizenFormResult data={citizenData} />
        </>
      );
    }
    if (isEmpty(citizenData)) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return <NoResultsFound />;
    }
  };

  const onClose = () => {
    dispatch(closeModal());
  };

  const onConfirm = () => {
    console.log('on confirm');
  };

  return (
    <GenericModal
      id={id}
      title='Aggiungi cittadino'
      noPaddingPrimary
      primaryCTA={{
        label: 'Compila questionario',
        onClick: onConfirm,
        disabled: isEmpty(citizenData),
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
          <SearchBarOptions
            setCurrentStep={setCurrentStep}
            currentStep={currentStep}
            steps={selectedSteps}
          />

          <div className='d-block px-5 mt-5'>{loadCorrectStep()}</div>
        </div>
      </div>
    </GenericModal>
  );
};

export default SearchCitizenModal;
