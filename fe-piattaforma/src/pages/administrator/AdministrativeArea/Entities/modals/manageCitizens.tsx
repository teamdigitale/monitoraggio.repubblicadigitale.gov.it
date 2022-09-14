import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import GenericModal from '../../../../../components/Modals/GenericModal/genericModal';
import { withFormHandlerProps } from '../../../../../hoc/withFormHandler';
import {
  GetEntityDetail,
  UpdateCitizenDetail,
} from '../../../../../redux/features/citizensArea/citizensAreaThunk';
import { createStringOfCompiledSurveySection } from '../../../../../utils/common';
import { formFieldI } from '../../../../../utils/formHelper';
import FormCitizen from '../../../../forms/formCitizen';
import { formTypes } from '../utils';
import { closeModal } from '../../../../../redux/features/modal/modalSlice';

const id = formTypes.CITIZENS;

interface ManageCitizensFormI {
  formDisabled?: boolean;
  creation?: boolean;
  idCitizen?: string | undefined;
  onClose: () => void;
}

interface ManageCitizensI extends withFormHandlerProps, ManageCitizensFormI {}

const ManageCitizens: React.FC<ManageCitizensI> = ({
  clearForm = () => ({}),
  idCitizen,
  onClose,
}) => {
  const dispatch = useDispatch();
  const [newFormValues, setNewFormValues] = useState<{
    [key: string]: formFieldI['value'];
  }>({});
  const [isFormValid, setIsFormValid] = useState<boolean>(true);

  const editCitizen = async () => {
    if (isFormValid) {
      const sezioneQ1Questionario =
        '{"id":"anagraphic-citizen-section","title":"Informazioni anagrafiche","properties":' +
        createStringOfCompiledSurveySection(newFormValues).replaceAll(
          '"',
          "'"
        ) +
        '}';

      const body = {
        ...newFormValues,
        codiceFiscaleNonDisponibile: newFormValues?.codiceFiscaleNonDisponibile !== '' ? true:false,
        questionarioQ1: sezioneQ1Questionario,
      };
      await dispatch(UpdateCitizenDetail(idCitizen, body));
    }
    dispatch(GetEntityDetail(idCitizen));
    if (onClose) onClose();
  };

  return (
    <GenericModal
      id={id}
      primaryCTA={{
        disabled: !isFormValid,
        label: 'Salva',
        onClick: editCitizen,
      }}
      secondaryCTA={{
        label: 'Annulla',
        onClick: () => {
          clearForm();
          dispatch(closeModal());
        },
      }}
    >
      <div className='px-3'>
        <FormCitizen
          sendNewValues={(newData?: { [key: string]: formFieldI['value'] }) => {
            setNewFormValues({ ...newData });
          }}
          setIsFormValid={(isValid: boolean) => setIsFormValid(isValid)}
          creation
        />
      </div>
    </GenericModal>
  );
};

export default ManageCitizens;
