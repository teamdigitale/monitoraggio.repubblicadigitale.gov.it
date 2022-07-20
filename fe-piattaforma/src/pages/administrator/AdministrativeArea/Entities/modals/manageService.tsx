import React, { useState } from 'react';
import GenericModal from '../../../../../components/Modals/GenericModal/genericModal';

import { withFormHandlerProps } from '../../../../../hoc/withFormHandler';

import { formTypes } from '../utils';
import { formFieldI } from '../../../../../utils/formHelper';
import FormService from '../../../../forms/formServices/formService';
import { useDispatch } from 'react-redux';
import {
  closeModal,
  selectModalPayload,
} from '../../../../../redux/features/modal/modalSlice';
import {
  CreateService,
  GetAllServices,
  UpdateService,
} from '../../../../../redux/features/administrativeArea/services/servicesThunk';
import { useAppSelector } from '../../../../../redux/hooks';

const id = formTypes.SERVICES;

interface ManageServicesFormI {
  formDisabled?: boolean;
  creation?: boolean;
}

interface ManageServicesI extends withFormHandlerProps, ManageServicesFormI {}

const ManageServices: React.FC<ManageServicesI> = ({
  clearForm,
  formDisabled,
  creation,
}) => {
  const dispatch = useDispatch();
  const idServizio = useAppSelector(selectModalPayload)?.idServizio;
  const [newFormsValues, setNewFormsValues] = useState<{
    [key: string]: formFieldI['value'];
  }>({});
  const [areFormsValid, setAreFormsValid] = useState<boolean>(true);
  const [questionarioCompilatoQ3, setQuestionarioCompilatoQ3] =
    useState<string>('');

  const createPayload = (answersForms: {
    [key: string]: formFieldI['value'];
  }) => {
    const answersQ3 =
      "{'id':'anagraphic-service-section','title':'Anagrafica del servizio','properties':[" +
      questionarioCompilatoQ3?.replaceAll('"', "'") +
      ']}';

    const payload = {
      data: answersForms['22'] || '',
      durataServizio: answersForms?.durataServizio,
      idEnte: answersForms?.nomeEnte,
      idSede: answersForms?.nomeSede,
      nomeServizio: answersForms?.nomeServizio,
      profilazioneParam: {
        // TODO: update profilazione MOCK
        codiceFiscaleUtenteLoggato: 'UTENTE1',
        codiceRuoloUtenteLoggato: 'DTD',
        idProgetto: 0,
        idProgramma: 0,
      },
      questionarioCompilatoQ3: answersQ3,
      tipoDiServizioPrenotato: answersForms['25'] || '',
    };
    return payload;
  };

  const handleCreateService = () => {
    if (areFormsValid) {
      if (creation) {
        dispatch(CreateService(createPayload(newFormsValues)));
      } else {
        dispatch(UpdateService(idServizio, createPayload(newFormsValues)));
      }
    }
    dispatch(closeModal());
    dispatch(GetAllServices());
  };

  return (
    <GenericModal
      id={id}
      primaryCTA={{
        disabled: !areFormsValid,
        label: 'Crea servizio',
        onClick: handleCreateService,
      }}
      secondaryCTA={{
        label: 'Annulla',
        onClick: () => clearForm?.(),
      }}
    >
      <div className='px-3'>
        <FormService // TODO: fix validity
          creation={creation || false}
          formDisabled={!!formDisabled}
          sendNewFormsValues={(newData?: {
            [key: string]: formFieldI['value'];
          }) => {
            setNewFormsValues({ ...newData });
          }}
          areFormsValid={(isValid: boolean) => setAreFormsValid(isValid)}
          getQuestioanarioCompilatoQ3={(answersQ3: string) =>
            setQuestionarioCompilatoQ3(answersQ3)
          }
        />
      </div>
    </GenericModal>
  );
};

export default ManageServices;
