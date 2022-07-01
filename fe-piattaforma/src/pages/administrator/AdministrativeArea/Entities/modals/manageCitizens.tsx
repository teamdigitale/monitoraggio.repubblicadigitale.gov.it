import React, { useState } from 'react';
import GenericModal from '../../../../../components/Modals/GenericModal/genericModal';

import { withFormHandlerProps } from '../../../../../hoc/withFormHandler';
import { formFieldI } from '../../../../../utils/formHelper';
import FormCitizen from '../../../../forms/formCitizen';
import { formTypes } from '../utils';

const id = formTypes.CITIZENS;

interface ManageCitizensFormI {
  /* formData?:
    | {
        name?: string;
        lastName?: string;
        role?: string;
        userId?: string;
        fiscalCode?: string;
        email?: string;
        phone?: string;
      }
    | undefined;*/
  formDisabled?: boolean;
  creation?: boolean;
}

interface ManageCitizensI extends withFormHandlerProps, ManageCitizensFormI {}

const ManageCitizens: React.FC<ManageCitizensI> = ({
  clearForm,
  //   formDisabled,
  // creation = false,
}) => {
  const [newFormValues, setNewFormValues] = useState<{
    [key: string]: formFieldI['value'];
  }>({});
  const [isFormValid, setIsFormValid] = useState<boolean>(true);

  const editCitizen = () => {
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
      />
      </div>
    </GenericModal>
  );
};

export default ManageCitizens;
