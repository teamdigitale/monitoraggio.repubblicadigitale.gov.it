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
  GetServicesDetail,
  UpdateService,
} from '../../../../../redux/features/administrativeArea/services/servicesThunk';
import { useAppSelector } from '../../../../../redux/hooks';
import { getUserHeaders } from '../../../../../redux/features/user/userThunk';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();
  const idServizio = useAppSelector(selectModalPayload)?.idServizio;
  const [newFormsValues, setNewFormsValues] = useState<{
    [key: string]: formFieldI['value'];
  }>({});
  const [areFormsValid, setAreFormsValid] = useState<boolean>(true);
  const [questionarioCompilatoQ3, setQuestionarioCompilatoQ3] =
    useState<string>('');
  const { codiceFiscale, codiceRuolo, idProgramma, idProgetto } =
    getUserHeaders();

  const createPayload = (answersForms: {
    [key: string]: formFieldI['value'];
  }) => {
    const answersQ3 =
      "{'id':'anagraphic-service-section','title':'Anagrafica del servizio','properties':" +
      questionarioCompilatoQ3?.replaceAll('"', "'") +
      '}';

    const payload = {
      data: answersForms['22'] || '',
      durataServizio: answersForms['23'] || '',
      idEnte: answersForms?.idEnte,
      idSede: answersForms?.idSede,
      nomeServizio: answersForms?.nomeServizio,
      profilazioneParam: {
        codiceFiscaleUtenteLoggato: codiceFiscale,
        codiceRuoloUtenteLoggato: codiceRuolo,
        idProgetto: idProgetto,
        idProgramma: idProgramma,
      },
      sezioneQuestionarioCompilatoQ3: answersQ3,
      tipoDiServizioPrenotato: answersForms['26'],
    };
    return payload;
  };

  const handleCreateService = async () => {
    if (areFormsValid) {
      if (creation) {
        const res = await dispatch(
          CreateService(createPayload(newFormsValues))
        );
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (res?.data?.idServizio)
          navigate(
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            `/area-amministrativa/servizi/${res?.data?.idServizio}/info`
          );
      } else {
        await dispatch(
          UpdateService(idServizio, createPayload(newFormsValues))
        );
        dispatch(GetServicesDetail(idServizio));
      }
    }
    dispatch(closeModal());
  };

  return (
    <GenericModal
      id={id}
      primaryCTA={{
        disabled: !areFormsValid,
        label: creation ? 'Crea servizio' : 'Salva',
        onClick: handleCreateService,
      }}
      secondaryCTA={{
        label: 'Annulla',
        onClick: () => clearForm?.(),
      }}
    >
      <div className='px-3'>
        <FormService
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
