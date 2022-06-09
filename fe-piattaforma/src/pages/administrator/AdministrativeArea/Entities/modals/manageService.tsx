import React, { useState } from 'react';
import GenericModal from '../../../../../components/Modals/GenericModal/genericModal';

import { withFormHandlerProps } from '../../../../../hoc/withFormHandler';

import { formTypes } from '../utils';
import { formFieldI } from '../../../../../utils/formHelper';
import FormServices from '../../../../forms/formServices';

const id = formTypes.SERVICES;

interface ManageServicesFormI {
  formDisabled?: boolean;
  creation?: boolean;
}

interface ManageServicesI extends withFormHandlerProps, ManageServicesFormI {}

const ManageServices: React.FC<ManageServicesI> = ({
  clearForm,
  formDisabled,
  creation = false,
}) => {
  const [newFormValues, setNewFormValues] = useState<{
    [key: string]: formFieldI['value'];
  }>({});
  const [isFormValid, setIsFormValid] = useState<boolean>(true);

  const handleCreateService = () => {
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
        label: 'Crea servizio',
        onClick: handleCreateService,
      }}
      secondaryCTA={{
        label: 'Annulla',
        onClick: () => clearForm?.(),
      }}
    >
      <FormServices
        creation={creation}
        formDisabled={!!formDisabled}
        sendNewValues={(newData) => setNewFormValues({ ...newData })}
        setIsFormValid={(value: boolean | undefined) => setIsFormValid(!!value)}
      />
    </GenericModal>
  );
};

export default ManageServices;
