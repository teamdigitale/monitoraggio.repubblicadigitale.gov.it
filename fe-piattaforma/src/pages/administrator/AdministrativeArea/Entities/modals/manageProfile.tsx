import React, { useState } from 'react';
import GenericModal from '../../../../../components/Modals/GenericModal/genericModal';
import { withFormHandlerProps } from '../../../../../hoc/withFormHandler';
import { formFieldI } from '../../../../../utils/formHelper';
import FormOnboarding from '../../../../facilitator/Onboarding/formOnboarding';
import { formTypes } from '../utils';

const id = formTypes.PROFILE;

interface ManageProfileFormI {
  formDisabled?: boolean;
  creation?: boolean;
}

interface ManageProfileI extends withFormHandlerProps, ManageProfileFormI {}

const ManageProfile: React.FC<ManageProfileI> = ({
  clearForm,
  formDisabled,
  /*   creation = false, */
}) => {
  const [newFormValues, setNewFormValues] = useState<{
    [key: string]: formFieldI['value'];
  }>({});
  const [isFormValid, setIsFormValid] = useState<boolean>(true);

  const handleSaveProfile = () => {
    if (isFormValid) {
      console.log(newFormValues);
      // TODO update with real api
    }
  };

  return (
    <GenericModal
      id={id}
      primaryCTA={{
        disabled: !isFormValid,
        label: 'Conferma',
        onClick: () => handleSaveProfile,
      }}
      secondaryCTA={{
        label: 'Annulla',
        onClick: () => clearForm?.(),
      }}
    >
      <FormOnboarding
        formDisabled={!!formDisabled}
        sendNewValues={(newData?: { [key: string]: formFieldI['value'] }) =>
          setNewFormValues({ ...newData })
        }
        setIsFormValid={(value: boolean | undefined) => setIsFormValid(!!value)}
      />
    </GenericModal>
  );
};

export default ManageProfile;
