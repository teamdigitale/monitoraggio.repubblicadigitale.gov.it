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
import { idQ1, titleQ1 } from '../Surveys/surveyConstants';

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
      const sezioneQ1Questionario = `{"id":"${idQ1}","title":"${titleQ1}","properties":${createStringOfCompiledSurveySection(
        newFormValues
      ).replaceAll('"', "'")}}`;

      const body = {
        annoNascita: newFormValues?.['8'],
        categoriaFragili: newFormValues?.['13'],
        cittadinanza: newFormValues?.['11'],
        codiceFiscale: newFormValues?.['3'],
        codiceFiscaleNonDisponibile: newFormValues?.['4'] !== '' ? true : false,
        cognome: newFormValues?.['2'],
        comuneDomicilio: newFormValues?.['12'],
        email: newFormValues?.['14'],
        genere: newFormValues?.['7'],
        nome: newFormValues?.['1'],
        numeroCellulare: newFormValues?.['16'],
        numeroDocumento: newFormValues?.['6'],
        prefisso: newFormValues?.['15'],
        questionarioQ1: sezioneQ1Questionario,
        statoOccupazionale: newFormValues?.['10'],
        telefono: newFormValues?.['17'],
        tipoDocumento: newFormValues?.['5'],
        titoloStudio: newFormValues?.['9'],
      };
      const res = await dispatch(UpdateCitizenDetail(idCitizen, body));
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (res) {
        dispatch(GetEntityDetail(idCitizen));
        if (onClose) onClose();
      }
    }
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
