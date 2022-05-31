import React, { useState } from 'react';
import GenericModal from '../../../../../components/Modals/GenericModal/genericModal';

import { withFormHandlerProps } from '../../../../../hoc/withFormHandler';

import { formTypes } from '../utils';
import { formFieldI } from '../../../../../utils/formHelper';
import FormHeadquarters from '../../../../forms/formHeadquarters';

const id = formTypes.SEDE;

interface ManageSediFormI {
  formDisabled?: boolean;
  creation?: boolean;
}

interface ManageSediI extends withFormHandlerProps, ManageSediFormI {}

const ManageHeadquarter: React.FC<ManageSediI> = ({
  clearForm,
  formDisabled,
  creation = false,
}) => {
  const [newFormValues, setNewFormValues] = useState<{
    [key: string]: formFieldI['value'];
  }>({});
  const [isFormValid, setIsFormValid] = useState<boolean>(true);

  const handleSaveSite = () => {
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
        onClick: handleSaveSite,
      }}
      secondaryCTA={{
        label: 'Annulla',
        onClick: () => clearForm?.(),
      }}
    >
      <FormHeadquarters
        creation={creation}
        formDisabled={!!formDisabled}
        sendNewValues={(newData) => setNewFormValues({ ...newData })}
        setIsFormValid={(value: boolean | undefined) => setIsFormValid(!!value)}
      />
    </GenericModal>
  );
};

export default ManageHeadquarter;
