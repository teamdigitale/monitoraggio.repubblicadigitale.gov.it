import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import GenericModal from '../../../../../components/Modals/GenericModal/genericModal';
import { withFormHandlerProps } from '../../../../../hoc/withFormHandler';
import { selectQuestionarioTemplateSnapshot } from '../../../../../redux/features/administrativeArea/administrativeAreaSlice';
import { GetCitizenListServiceDetail } from '../../../../../redux/features/administrativeArea/services/servicesThunk';
import { SurveySectionPayloadI } from '../../../../../redux/features/administrativeArea/surveys/surveysSlice';
import {
  GetEntityDetail,
  UpdateCitizenDetail,
} from '../../../../../redux/features/citizensArea/citizensAreaThunk';
import {
  closeModal,
  selectModalPayload,
} from '../../../../../redux/features/modal/modalSlice';
import { useAppSelector } from '../../../../../redux/hooks';
import { createStringOfCompiledSurveySection } from '../../../../../utils/common';
import { formFieldI } from '../../../../../utils/formHelper';
import { generateForm } from '../../../../../utils/jsonFormHelper';
import FormServiceCitizenFull from '../../../../forms/formServices/formServiceCitizenFull';

import { formTypes } from '../utils';

const id = formTypes.SERVICE_CITIZEN;

interface ManageCitizenInServiceFormI {
  formDisabled?: boolean;
  creation?: boolean;
}

interface ManageCitizenInServiceI
  extends withFormHandlerProps,
    ManageCitizenInServiceFormI {}

const ManageCitizenInService: React.FC<ManageCitizenInServiceI> = ({
  clearForm,
  //   formDisabled,
}) => {
  const dispatch = useDispatch();
  const [newFormValues, setNewFormValues] = useState<{
    [key: string]: formFieldI['value'];
  }>({});
  const [isFormValid, setIsFormValid] = useState<boolean>(true);
  const idCittadino = useAppSelector(selectModalPayload)?.idCittadino;
  const serviceId = useAppSelector(selectModalPayload)?.serviceId;
  const viewMode = useAppSelector(selectModalPayload)?.viewMode;
  const surveyTemplateQ1: string | SurveySectionPayloadI = useAppSelector(
    selectQuestionarioTemplateSnapshot
  )?.sezioniQuestionarioTemplate?.[0];
  const [Q1, setQ1] = useState<string>('');

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (surveyTemplateQ1) setQ1(surveyTemplateQ1?.schema.json);
  }, [surveyTemplateQ1]);

  useEffect(() => {
    if (idCittadino) dispatch(GetEntityDetail(idCittadino));
  }, [idCittadino]);

  const resetModal = () => {
    clearForm?.();
    dispatch(closeModal());
  };

  const handleCitizenInService = async () => {
    let body: { [key: string]: formFieldI['value'] } = {};

    const sezioneQ1Template = generateForm(JSON.parse(Q1));
    Object.keys(sezioneQ1Template).map((key: string) => {
      if (sezioneQ1Template[key]?.keyBE && newFormValues) {
        if (sezioneQ1Template[key].keyBE === 'codiceFiscaleNonDisponibile') {
          // FLAG codiceFiscaleNonDisponibile
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          body[sezioneQ1Template[key].keyBE] =
            newFormValues[key] !== '' ? true : false;
        } else {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          body[sezioneQ1Template[key].keyBE] =
            typeof newFormValues[key] === 'string'
              ? newFormValues[key]
              : JSON.stringify(newFormValues[key]);
        }
      }
    });

    const sezioneQ1Questionario =
      "{'id':'anagraphic-citizen-section','title':'Informazioni anagrafiche','properties':" +
      createStringOfCompiledSurveySection(newFormValues).replaceAll('"', "'") +
      '}';

    body = {
      ...body,
      questionarioQ1: sezioneQ1Questionario,
    };
    if (idCittadino) await dispatch(UpdateCitizenDetail(idCittadino, body));
    // rifaccio get cittadini servizio
    dispatch(GetCitizenListServiceDetail(serviceId));
    resetModal();
  };

  const modalCTAs = !viewMode
    ? {
        primaryCTA: {
          disabled: !isFormValid,
          label: 'Salva',
          onClick: handleCitizenInService,
        },
        secondaryCTA: {
          label: 'Annulla',
          onClick: resetModal,
        },
      }
    : {
        secondaryCTA: {
          label: 'Chiudi',
          onClick: resetModal,
        },
      };

  return (
    <GenericModal id={id} title='Modifica cittadino' {...modalCTAs}>
      <FormServiceCitizenFull
        formDisabled={viewMode}
        sendNewValues={(newData?: { [key: string]: formFieldI['value'] }) => {
          setNewFormValues({ ...newData });
        }}
        setIsFormValid={(isValid: boolean) => setIsFormValid(isValid)}
      />
    </GenericModal>
  );
};

export default ManageCitizenInService;
