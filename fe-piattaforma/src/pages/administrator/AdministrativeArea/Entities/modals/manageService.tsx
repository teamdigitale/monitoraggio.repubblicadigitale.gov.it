import React, { useEffect, useState } from 'react';
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
import { idQ3, titleQ3 } from '../Surveys/surveyConstants';
import { resetServiceDetails } from '../../../../../redux/features/administrativeArea/administrativeAreaSlice';

const id = formTypes.SERVICES;

interface ManageServicesFormI {
  formDisabled?: boolean;
  creation?: boolean;
  legend?: string | undefined;
  edit?: boolean;
}

interface ManageServicesI extends withFormHandlerProps, ManageServicesFormI {}

const ManageServices: React.FC<ManageServicesI> = ({
  clearForm = () => ({}),
  formDisabled,
  creation,
  legend = '',
  edit,
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
  const { idProgramma, idProgetto, idEnte } = getUserHeaders();

  useEffect(() => {
    if (creation) dispatch(resetServiceDetails());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [creation]);

  const resetModal = (toClose = true) => {
    clearForm();
    if (toClose) dispatch(closeModal());
  };

  const createPayload = (answersForms: {
    [key: string]: formFieldI['value'];
  }) => {
    const answersQ3 = `{"id":"${idQ3}","title":"${titleQ3}","properties":${questionarioCompilatoQ3?.replaceAll(
      '"',
      "'"
    )}}`;
    const tipologiaServizio = answersForms['24']?.toString()?.split('§');
    const payload = {
      data: answersForms['22'] || '',
      durataServizio: answersForms['23'] || '',
      idEnteServizio: idEnte,
      idSedeServizio: answersForms?.idSede,
      nomeServizio: answersForms?.nomeServizio,
      /*profilazioneParam: {
        codiceFiscaleUtenteLoggato: codiceFiscale,
        codiceRuoloUtenteLoggato: codiceRuolo,
        idProgetto,
        idProgramma,
        idEnte,
      },*/
      idProgetto,
      idProgramma,
      idEnte,
      sezioneQuestionarioCompilatoQ3: answersQ3,
      tipoDiServizioPrenotato: tipologiaServizio,
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
        if (res?.data?.idServizio) {
          navigate(
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            `/area-amministrativa/servizi/${res?.data?.idServizio}/info`
          );
          resetModal();
        }
      } else {
        const res = await dispatch(
          UpdateService(idServizio, createPayload(newFormsValues))
        );
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (res) {
          dispatch(GetServicesDetail(idServizio));
          resetModal();
        }
      }
    }
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
        onClick: resetModal,
      }}
    >
      <div className='px-3'>
        <FormService
          creation={creation || false}
          edit={edit || false}
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
          legend={legend}
        />
      </div>
    </GenericModal>
  );
};

export default ManageServices;
