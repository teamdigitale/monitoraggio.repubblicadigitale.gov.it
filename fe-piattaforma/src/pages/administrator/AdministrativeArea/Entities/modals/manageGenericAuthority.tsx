import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
//import { useDispatch } from 'react-redux';
import GenericModal from '../../../../../components/Modals/GenericModal/genericModal';

import { withFormHandlerProps } from '../../../../../hoc/withFormHandler';
import { resetAuthorityDetails } from '../../../../../redux/features/administrativeArea/administrativeAreaSlice';
import { UpdateAuthorityDetails } from '../../../../../redux/features/administrativeArea/authorities/authoritiesThunk';
import { closeModal } from '../../../../../redux/features/modal/modalSlice';
import { formFieldI } from '../../../../../utils/formHelper';
import FormAuthorities from '../../../../forms/formAuthorities';
import { formTypes } from '../utils';

const id = formTypes.ENTE_PARTNER;

interface ManageEntePartnerFormI {
  formDisabled?: boolean;
  creation?: boolean;
}

interface ManageEnteGestoreProgettoI
  extends withFormHandlerProps,
    ManageEntePartnerFormI {}

const ManageGenericAuthority: React.FC<ManageEnteGestoreProgettoI> = ({
  clearForm = () => ({}),
  formDisabled,
  creation = false,
}) => {
  const [newFormValues, setNewFormValues] = useState<{
    [key: string]: formFieldI['value'];
  }>({});
  const [isFormValid, setIsFormValid] = useState<boolean>(true);

  const dispatch = useDispatch();

  const handleSaveEnte = () => {
    if (isFormValid) {
      dispatch(
        UpdateAuthorityDetails(newFormValues['id']?.toString(), newFormValues)
      );
    }
    clearForm();
    dispatch(resetAuthorityDetails());
    dispatch(closeModal());
  };

  return (
    <GenericModal
      id={id}
      primaryCTA={{
        disabled: !isFormValid,
        label: 'Conferma',
        onClick: handleSaveEnte,
      }}
      secondaryCTA={{
        label: 'Annulla',
        onClick: () => clearForm?.(),
      }}
    >
      <div className='px-5'>
        <FormAuthorities
          creation={creation}
          formDisabled={!!formDisabled}
          sendNewValues={(newData?: { [key: string]: formFieldI['value'] }) =>
            setNewFormValues({ ...newData })
          }
          setIsFormValid={(value: boolean | undefined) =>
            setIsFormValid(!!value)
          }
        />
      </div>
    </GenericModal>
  );
};

export default ManageGenericAuthority;
