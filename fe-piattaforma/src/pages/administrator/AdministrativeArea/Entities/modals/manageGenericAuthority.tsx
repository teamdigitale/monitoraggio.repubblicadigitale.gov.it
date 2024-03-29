import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
//import { useDispatch } from 'react-redux';
import GenericModal from '../../../../../components/Modals/GenericModal/genericModal';

import { withFormHandlerProps } from '../../../../../hoc/withFormHandler';
import { resetAuthorityDetails } from '../../../../../redux/features/administrativeArea/administrativeAreaSlice';
import {
  GetAuthorityDetail,
  UpdateAuthorityDetails,
} from '../../../../../redux/features/administrativeArea/authorities/authoritiesThunk';
import { closeModal } from '../../../../../redux/features/modal/modalSlice';
import { formFieldI } from '../../../../../utils/formHelper';
import FormAuthorities from '../../../../forms/formAuthorities';

const id = 'ente';

interface ManageEntePartnerFormI {
  formDisabled?: boolean;
  creation?: boolean;
  legend?: string | undefined;
}

interface ManageEnteGestoreProgettoI
  extends withFormHandlerProps,
    ManageEntePartnerFormI {}

const ManageGenericAuthority: React.FC<ManageEnteGestoreProgettoI> = ({
  clearForm = () => ({}),
  formDisabled,
  creation = false,
  legend = '',
}) => {
  const [newFormValues, setNewFormValues] = useState<{
    [key: string]: formFieldI['value'];
  }>({});
  const [isFormValid, setIsFormValid] = useState<boolean>(true);
  const { authorityId } = useParams();

  const dispatch = useDispatch();

  const resetModal = (toClose = true) => {
    clearForm();
    if (toClose) dispatch(closeModal());
  };

  const handleSaveEnte = async () => {
    if (isFormValid) {
      const res: any = await dispatch(
        UpdateAuthorityDetails(newFormValues['id']?.toString(), newFormValues)
      );
      if (!res?.errorCode && authorityId) {
        clearForm();
        await dispatch(resetAuthorityDetails());
        await dispatch(GetAuthorityDetail(authorityId));
        resetModal();
      }
    }
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
        onClick: resetModal,
      }}
    >
      <div className='px-5'>
        <FormAuthorities
          noIdField
          creation={creation}
          formDisabled={!!formDisabled}
          sendNewValues={(newData?: { [key: string]: formFieldI['value'] }) =>
            setNewFormValues({ ...newData })
          }
          setIsFormValid={(value: boolean | undefined) =>
            setIsFormValid(!!value)
          }
          legend={legend}
        />
      </div>
    </GenericModal>
  );
};

export default ManageGenericAuthority;
