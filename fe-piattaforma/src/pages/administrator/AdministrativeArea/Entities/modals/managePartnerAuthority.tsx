import React, { useState } from 'react';
import GenericModal from '../../../../../components/Modals/GenericModal/genericModal';

import { withFormHandlerProps } from '../../../../../hoc/withFormHandler';
import { formFieldI } from '../../../../../utils/formHelper';
import FormAuthorities from '../../../../forms/formAuthorities';

const id = 'ente-gestore-progetto';

interface ManageEntePartnerFormI {
  formDisabled?: boolean;
  creation?: boolean;
}

interface ManageEnteGestoreProgettoI
  extends withFormHandlerProps,
    ManageEntePartnerFormI {}

const ManagePartnerAuthority: React.FC<ManageEnteGestoreProgettoI> = ({
  clearForm,
  formDisabled,
  creation = false,
}) => {
  const [newFormValues, setNewFormValues] = useState<{
    [key: string]: formFieldI['value'];
  }>({});
  const [isFormValid, setIsFormValid] = useState<boolean>(true);

  const handleSaveEnte = () => {
    if (isFormValid) {
      console.log(newFormValues);
      // TODO call to update the values
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
        onClick: () => clearForm?.(),
      }}
    >
      <FormAuthorities
        creation={creation}
        formDisabled={!!formDisabled}
        sendNewValues={(newData?: { [key: string]: formFieldI['value'] }) =>
          setNewFormValues({ ...newData })
        }
        setIsFormValid={(value: boolean | undefined) => setIsFormValid(!!value)}
      />
    </GenericModal>
  );
};

export default ManagePartnerAuthority;
