import React, { useEffect, useState } from 'react';
import GenericModal from '../../../../../components/Modals/GenericModal/genericModal';
import { useDispatch } from 'react-redux';
import { closeModal } from '../../../../../redux/features/modal/modalSlice';
import { useAppSelector } from '../../../../../redux/hooks';
import {
  CittadinoInfoI,
  selectCitizenSearchResponse,
  setCitizenSearchResults,
} from '../../../../../redux/features/citizensArea/citizensAreaSlice';
import CitizenTableResult from './citizenTableResult';
import Infocard from '../../../../../components/InfoCard/infoCard';
import { formFieldI } from '../../../../../utils/formHelper';
import {
  selectQuestionarioTemplateSnapshot,
  selectServices,
} from '../../../../../redux/features/administrativeArea/administrativeAreaSlice';
import SearchBarOptionsCitizen from '../../../../../components/SearchBarOptionsCitizen/searchBarOptionsCitizen';
import FormServiceCitizenBase from '../../../../forms/formServices/formServiceCitizenBase';
import FormServiceCitizenFull from '../../../../forms/formServices/formServiceCitizenFull';
import { generateForm } from '../../../../../utils/jsonFormHelper';
import { useParams } from 'react-router-dom';
import {
  AssociateCitizenToService,
  GetCitizenListServiceDetail,
} from '../../../../../redux/features/administrativeArea/services/servicesThunk';
import { SurveySectionPayloadI } from '../../../../../redux/features/administrativeArea/surveys/surveysSlice';
import { TableRowI } from '../../../../../components/Table/table';
import NoResultsFoundCitizen from '../../../../../components/NoResultsFoundCitizen/noResultsFoundCitizen';
import clsx from 'clsx';

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
      | undefined,
    fullAnagraphicCitizen: boolean
  ) => void;
  creation?: boolean;
}

const SearchCitizenModal: React.FC<SearchCitizenModalI> = () => {
  const [currentStep, setCurrentStep] = useState<string>(
    selectedSteps.FISCAL_CODE
  );
  const [radioFilter, setRadioFilter] = useState<string>(
    selectedSteps.FISCAL_CODE
  );
  const dispatch = useDispatch();
  const { serviceId } = useParams();
  const citizensData: CittadinoInfoI[] = useAppSelector(
    selectCitizenSearchResponse
  );
  const citizensList = useAppSelector(selectServices)?.detail?.cittadini;
  const [newUserValues, setNewUserValues] = useState<{
    [key: string]: string | number | boolean | Date | string[] | undefined;
  }>();
  const [selectedCitizen, setSelectedCitizen] = useState<
    CittadinoInfoI | TableRowI | string
  >({});
  const [validForm, setFormValid] = useState<boolean>(false);
  const [alreadySearched, setAlreadySearched] = useState<boolean>(false);
  const [showFormCompleteForm, setShowFormCompleteForm] =
    useState<boolean>(false);
  const surveyTemplateQ1: SurveySectionPayloadI | string = useAppSelector(
    selectQuestionarioTemplateSnapshot
  )?.sezioniQuestionarioTemplate?.[0];
  const [stringQ1, setStringQ1] = useState<string>('');

  useEffect(() => {
    if (typeof surveyTemplateQ1 !== 'string') {
      typeof surveyTemplateQ1?.schema !== 'string'
        ? setStringQ1(surveyTemplateQ1?.schema.json)
        : null;
    }
  }, [surveyTemplateQ1]);

  useEffect(() => {
    if (currentStep !== selectedSteps.ADD_CITIZEN) {
      setShowFormCompleteForm(false);
    }
  }, [currentStep]);

  const onClose = () => {
    setCurrentStep(selectedSteps.FISCAL_CODE);
    dispatch(closeModal());
  };

  const resetModal = (dontClose?: boolean) => {
    if (!dontClose) {
      setRadioFilter(selectedSteps.FISCAL_CODE);
      setCurrentStep(selectedSteps.FISCAL_CODE);
    }
    setShowFormCompleteForm(false);
    setAlreadySearched(false);
    setSelectedCitizen({});
    dispatch(setCitizenSearchResults([]));
    if (!dontClose) onClose();
  };

  useEffect(() => {
    resetModal();
  }, []);

  const addCitizen = () => {
    setCurrentStep(selectedSteps.ADD_CITIZEN);
    if (alreadySearched && !(citizensData?.length > 0)) {
      setShowFormCompleteForm(true);
    }
  };

  const loadFirstStep = () => {
    if (!alreadySearched) {
      return null;
    } else {
      if (citizensData?.length > 1) {
        return (
          <CitizenTableResult
            data={citizensData}
            onCitizenSelected={(citizen) => {
              setSelectedCitizen(citizen);
              setCurrentStep(selectedSteps.ADD_CITIZEN);
            }}
          />
        );
      } else if (citizensData?.length === 1) {
        setCurrentStep(selectedSteps.ADD_CITIZEN);
        setSelectedCitizen(citizensData?.[0]);
      } else if (citizensData?.length === 0) {
        return <NoResultsFoundCitizen onClickCta={addCitizen} />;
      }
    }
  };

  const loadSecondStep = () => {
    if (showFormCompleteForm) {
      return (
        <FormServiceCitizenFull
          sendNewValues={(newData?: { [key: string]: formFieldI['value'] }) => {
            setNewUserValues({ ...newData });
          }}
          setIsFormValid={(isValid: boolean) => setFormValid(isValid)}
          creation
          legend="Form di creazione cittadino, i campi con l'asterisco sono obbligatori"
        />
      );
    }
    return (
      <>
        {citizensList?.cittadini.filter(
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          (cit) => cit.idCittadino === selectedCitizen?.id
        )?.length > 0 && (
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
        )}
        <FormServiceCitizenBase
          sendNewValues={(newData?: { [key: string]: formFieldI['value'] }) => {
            setNewUserValues({ ...newData });
          }}
          setIsFormValid={(isValid: boolean) => setFormValid(isValid)}
          formDisabled
          selectedCitizen={selectedCitizen}
          legend='form cittadino già esistente'
        />
      </>
    );
  };

  const onConfirm = async () => {
    if (
      currentStep === selectedSteps.FISCAL_CODE ||
      currentStep === selectedSteps.DOC_NUMBER
    ) {
      setCurrentStep(selectedSteps.ADD_CITIZEN);
    } else if (currentStep === selectedSteps.ADD_CITIZEN) {
      let body: { [key: string]: formFieldI['value'] } = {};
      if (showFormCompleteForm) {
        const sezioneQ1Template = generateForm(JSON.parse(stringQ1));
        Object.keys(sezioneQ1Template).map((key: string) => {
          if (sezioneQ1Template[key]?.keyBE && newUserValues) {
            if (
              sezioneQ1Template[key].keyBE === 'codiceFiscaleNonDisponibile'
            ) {
              // FLAG codiceFiscaleNonDisponibile
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              body[sezioneQ1Template[key].keyBE] =
                newUserValues[key] !== '' ? true : false;
            } else {
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              body[sezioneQ1Template[key].keyBE] =
                typeof newUserValues[key] === 'string'
                  ? newUserValues[key]?.toString().replaceAll("'", "’")
                  : JSON.stringify(newUserValues[key]);
            }
          }
        });
        body['nuovoCittadino'] = true;
      } else {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (selectedCitizen?.codiceFiscale) {
          body = {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            codiceFiscale: selectedCitizen?.codiceFiscale,
            codiceFiscaleNonDisponibile: false,
            nuovoCittadino: false,
          };
        } else {
          body = {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            numeroDocumento: selectedCitizen?.numeroDocumento,
            codiceFiscaleNonDisponibile: true,
            nuovoCittadino: false,
          };
        }
      }
      if (serviceId) {
        const res = await dispatch(
          AssociateCitizenToService({ idServizio: serviceId, body })
        );
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (res) {
          // rifaccio get cittadini servizio
          dispatch(GetCitizenListServiceDetail(serviceId));
          resetModal();
        }
      }
    }
  };

  return (
    <GenericModal
      id={id}
      title='Aggiungi cittadino'
      noPaddingPrimary
      primaryCTA={{
        label: 'Aggiungi',
        onClick: () => onConfirm(),
        disabled:
          (currentStep === selectedSteps.FISCAL_CODE &&
            !(Object.keys(selectedCitizen)?.length > 0)) ||
          (currentStep === selectedSteps.DOC_NUMBER &&
            !(Object.keys(selectedCitizen)?.length > 0)) ||
          (currentStep === selectedSteps.ADD_CITIZEN && !validForm),
      }}
      secondaryCTA={{
        label: 'Annulla',
        onClick: resetModal,
      }}
      centerButtons
    >
      <div className='d-flex flex-column search-citizen-modal'>
        <div className='mb-5'>
          <SearchBarOptionsCitizen
            setCurrentStep={setCurrentStep}
            setRadioFilter={setRadioFilter}
            currentStep={radioFilter}
            steps={(({ FISCAL_CODE, DOC_NUMBER }) => ({
              FISCAL_CODE,
              DOC_NUMBER,
            }))(selectedSteps)}
            alreadySearched={(searched) => setAlreadySearched(searched)}
            resetModal={() => {
              resetModal(true);

              setCurrentStep(radioFilter);
            }}
          />
          <div className={clsx('d-block px-5', currentStep === selectedSteps.ADD_CITIZEN ? 'mt-3':'mt-5')}>
            {currentStep === selectedSteps.FISCAL_CODE ||
            currentStep === selectedSteps.DOC_NUMBER
              ? loadFirstStep()
              : loadSecondStep()}
          </div>
        </div>
      </div>
    </GenericModal>
  );
};

export default SearchCitizenModal;
