import React, { useState } from 'react';
import GenericModal from '../../../../../components/Modals/GenericModal/genericModal';
import { withFormHandlerProps } from '../../../../../hoc/withFormHandler';
import { formFieldI } from '../../../../../utils/formHelper';
import FormUser from '../../../../forms/formUser';
import { formTypes } from '../utils';

const id = formTypes.USER;

interface ManageUsersFormI {
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

interface ManageUsersI extends withFormHandlerProps, ManageUsersFormI {}

const ManageUsers: React.FC<ManageUsersI> = ({
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
      // TODO update with real api
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
      <div className='px-5'>
        <FormUser
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

export default ManageUsers;
