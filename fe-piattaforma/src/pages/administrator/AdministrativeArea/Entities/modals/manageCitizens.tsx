import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import GenericModal from '../../../../../components/Modals/GenericModal/genericModal';
import { withFormHandlerProps } from '../../../../../hoc/withFormHandler';
import { UpdateCitizenDetail } from '../../../../../redux/features/citizensArea/citizensAreaThunk';
import { formFieldI } from '../../../../../utils/formHelper';
import FormCitizen from '../../../../forms/formCitizen';
import { formTypes } from '../utils';

const id = formTypes.CITIZENS;

interface ManageCitizensFormI {
  formDisabled?: boolean;
  creation?: boolean;
  idCitizen?: string | undefined;
  onClose: () => void;
}

interface ManageCitizensI extends withFormHandlerProps, ManageCitizensFormI {}

const ManageCitizens: React.FC<ManageCitizensI> = ({
  clearForm,
  idCitizen,
  onClose,
}) => {
  const dispatch = useDispatch();
  const [newFormValues, setNewFormValues] = useState<{
    [key: string]: formFieldI['value'];
  }>({});
  const [isFormValid, setIsFormValid] = useState<boolean>(true);

  const editCitizen = () => {
    if (isFormValid) {
      // console.log(newFormValues);
      dispatch(UpdateCitizenDetail(idCitizen, newFormValues));
    }
    if(onClose) onClose();
  };

  return (
    <GenericModal
      id={id}
      primaryCTA={{
        disabled: !isFormValid,
        label: 'Salva',
        onClick: () => editCitizen(),
      }}
      secondaryCTA={{
        label: 'Annulla',
        onClick: () => clearForm?.(),
      }}
    >
      <div className='px-3'>
        <FormCitizen
          sendNewValues={(newData?: { [key: string]: formFieldI['value'] }) => {
            setNewFormValues({ ...newData });
          }}
          isFormValid={(isValid: boolean) => setIsFormValid(isValid)}
          creation
        />
      </div>
    </GenericModal>
  );
};

export default ManageCitizens;
