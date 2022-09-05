import React, { useEffect, useState } from 'react';
import GenericModal from '../../../../../components/Modals/GenericModal/genericModal';
import { useDispatch } from 'react-redux';
import { closeModal } from '../../../../../redux/features/modal/modalSlice';
import { useAppSelector } from '../../../../../redux/hooks';
import {
  CittadinoInfoI,
  selectCitizenSearchResponse,
} from '../../../../../redux/features/citizensArea/citizensAreaSlice';
import CitizenTableResult from './citizenTableResult';
import NoResultsFound from '../../../../../components/NoResultsFound/noResultsFound';
import Infocard from '../../../../../components/InfoCard/infoCard';
import { formFieldI } from '../../../../../utils/formHelper';
import { selectServices } from '../../../../../redux/features/administrativeArea/administrativeAreaSlice';
import SearchBarOptionsCitizen from '../../../../../components/SearchBarOptionsCitizen/searchBarOptionsCitizen';
import FormServiceCitizenBase from '../../../../forms/formServices/formServiceCitizenBase';
import FormServiceCitizenFull from '../../../../forms/formServices/formServiceCitizenFull';
import { generateForm } from '../../../../../utils/jsonFormHelper';
import { useParams } from 'react-router-dom';
import { AssociateCitizenToService, GetCitizenListServiceDetail } from '../../../../../redux/features/administrativeArea/services/servicesThunk';

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

const SearchCitizenModal: React.FC<SearchCitizenModalI> = ({
  onConfirmText,
}) => {
  const [currentStep, setCurrentStep] = useState<string>(
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
  const [selectedCitizen, setSelectedCitizen] = useState<any>('');
  const [validForm, setFormValid] = useState<boolean>(false);
  const [alreadySearched, setAlreadySearched] = useState<boolean>(false);
  const [showFormCompleteForm, setShowFormCompleteForm] =
    useState<boolean>(false);
  // const surveyTemplateQ1: any = useAppSelector(
  //   selectQuestionarioTemplateSnapshot
  // )?.[0];
  // TODO: quando BE ritorna il questionarioTemplate con le key BE togliere stringa!
  const Q1 =
    '{"type":"object","properties":{"1":{"id":"1","title":"Nome","type":"string","order":1,"keyBE":"nome"},"2":{"id":"2","title":"Cognome","type":"string","order":2,"keyBE":"cognome"},"3":{"id":"3","title":"Codice fiscale","type":"string", "dependencyNotFlag":"4","order":3,"regex":"fiscalCode","keyBE":"codiceFiscale"},"4":{"id":"4","title":"Codice fiscale non disponibile","type":"object","properties":{"Codice fiscale non disponibile":{"type":"boolean"}},"flag":"flag","order":4,"keyBE":"codiceFiscaleNonDisponibile"},"5":{"id":"5","title":"Tipo documento","type":"string","enum":["Identità","Patente","Passaporto","Permesso di soggiorno"],"dependencyFlag":"4","order":5,"keyBE":"tipoDocumento"},"6":{"id":"6","title":"Numero documento","type":"string","dependencyFlag":"4","order":6,"keyBE":"numeroDocumento"},"7":{"id":"7","title":"Genere","type":"string","enum":["F","M"],"order":7,"keyBE":"genere"},"8":{"id":"8","title":"Anno di nascita","type":"number","order":8,"keyBE":"annoNascita"},"9":{"id":"9","title":"Titolo di studio (livello più alto raggiunto)","type":"multiple","enum":["Diploma di istruzione primaria (scuola elementare)","Diploma di scuola secondaria di I livello (scuola media)","Diploma di scuola secondaria di II livello o ITP (maturità o di tecnico superiore - ITS)","Laurea di I livello (triennale)","Laurea di II livello (specialistica o magistrale)","Dottorato o Master","Non conosciuto / non fornito / Altro"],"order":9,"keyBE":"titoloStudio"},"10":{"id":"10","title":"Stato occupazionale","type":"object","order":10,"format":"multiple-select","relatedTo":"10","relatedFrom":"10","enumLevel1":["Occupato","Inoccupato","Disoccupato","Altro"],"enumLevel2":[{"label":"Dipendente","value":"Dipendente","upperLevel":"Occupato"},{"label":"Lavoro autonomo","value":"Lavoro autonomo","upperLevel":"Occupato"},{"label":"A (non presta attività lavorativa con un regolare contratto di assunzione, es. prestazioni occasionali)","value":"A (non presta attività lavorativa con un regolare contratto di assunzione, es. prestazioni occasionali)","upperLevel":"Inoccupato"},{"label":"B (in cerca di lavoro per la prima volta)","value":"B (in cerca di lavoro per la prima volta)","upperLevel":"Inoccupato"},{"label":"A (da 365 giorni e meno)","value":"A (da 365 giorni e meno)","upperLevel":"Disoccupato"},{"label":"B (da 365 giorni e più)","value":"B (da 365 giorni e più)","upperLevel":"Disoccupato"}, {"label":"Studente/In formazione","value":"Studente/In formazione","upperLevel":"Altro"},{"label":"Pensionato","value":"Pensionato","upperLevel":"Altro"}],"keyBE":"statoOccupazionale"},"11":{"id":"11","title":"Cittadinanza","type":"string","enum":["Italiana","Altro - UE","Altro - non UE"],"order":11,"keyBE":"cittadinanza"},"12":{"id":"12","title":"Comune di domicilio","type":"string","order":12,"keyBE":"comuneDomicilio"},"13":{"id":"13","title":"Categoria fragili","type":"string","enum":["No","Rifugiato / Migrante","Percettore di sussidio di disabilità","Altro percettore di sussidio (es. reddito di cittadinanza)"],"order":13,"keyBE":"categoriaFragili"},"14":{"id":"14","title":"Email","type":"string","order":14,"regex":"email","keyBE":"email"},"15":{"id":"15","title":"Prefisso","type":"string","order":15,"regex":"mobile_phone_prefix","keyBE":"prefisso"},"16":{"id":"16","title":"Numero di cellulare","type":"string","order":16,"regex":"telephone","keyBE":"numeroCellulare"},"17":{"id":"17","title":"Telefono","type":"string","order":17,"regex":"telephone","keyBE":"telefono"},"18":{"id":"18","title":"Consenso trattamento dei dati","type":"object","properties":{"Online":{"type":"boolean"},"Cartaceo":{"type":"boolean"},"Email":{"type":"boolean"}},"privacy":"privacy","order":18},"19":{"id":"19","title":"Data di conferimento consenso","type":"date","privacy":"privacy","order":19}},"required":["1","2","3","4","5","6","7","8","9","10","11","12","14","15","16","17","18","19"],"default":["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19"]}';

  useEffect(() => {
    if (currentStep !== selectedSteps.ADD_CITIZEN) {
      setShowFormCompleteForm(false);
    }
  }, [currentStep]);

  const onClose = () => {
    dispatch(closeModal());
  };

  const resetModal = () => {
    setCurrentStep(selectedSteps.FISCAL_CODE);
    setAlreadySearched(false);
    onClose();
  };

  useEffect(() => {
    resetModal();
  }, []);

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
        return <NoResultsFound />;
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
        />
      );
    }
    return (
      <>
        {citizensList?.cittadini.filter(
          (cit) => cit.idCittadino === citizensData[0]?.idCittadino
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
        const sezioneQ1Template = generateForm(JSON.parse(Q1)); // TODO: sotituire Q1 con surveyTemplateQ1 quando BE aggiunge chiavi al template
        Object.keys(sezioneQ1Template).map((key: string) => {
          if (
            sezioneQ1Template[key]?.keyBE &&
            newUserValues
          ) {
            if (sezioneQ1Template[key].keyBE === 'codiceFiscaleNonDisponibile') { 
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
                  ? newUserValues[key]
                  : JSON.stringify(newUserValues[key]);
            }
          }
        });
      } else {
        body = {
          codiceFiscale: selectedCitizen.codiceFiscale,
          codiceFiscaleNonDisponibile: false,
        };
      }
      if(serviceId) await dispatch(AssociateCitizenToService({ idServizio: serviceId, body }));
      // rifaccio get cittadini servizio
      dispatch(GetCitizenListServiceDetail(serviceId));
    }
    resetModal();
  };

  const addCitizen = () => {
    setCurrentStep(selectedSteps.ADD_CITIZEN);
    if (alreadySearched && !(citizensData?.length > 0)) {
      setShowFormCompleteForm(true);
    }
  };

  return (
    <GenericModal
      id={id}
      title='Aggiungi cittadino'
      noPaddingPrimary
      primaryCTA={{
        label: `${onConfirmText || 'Compila questionario'}`,
        onClick:
          currentStep === selectedSteps.FISCAL_CODE ||
          currentStep === selectedSteps.DOC_NUMBER
            ? addCitizen
            : onConfirm,
        disabled:
          !alreadySearched ||
          (currentStep === selectedSteps.ADD_CITIZEN && !validForm),
      }}
      secondaryCTA={{
        label: 'Annulla',
        onClick: resetModal,
      }}
      centerButtons
      onClose={resetModal}
    >
      <div className='d-flex flex-column search-citizen-modal'>
        <div className='mb-5'>
          <SearchBarOptionsCitizen
            setCurrentStep={setCurrentStep}
            currentStep={currentStep}
            steps={(({ FISCAL_CODE, DOC_NUMBER }) => ({
              FISCAL_CODE,
              DOC_NUMBER,
            }))(selectedSteps)}
            alreadySearched={(searched) => setAlreadySearched(searched)}
          />
          <div className='d-block px-5 mt-5'>
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
