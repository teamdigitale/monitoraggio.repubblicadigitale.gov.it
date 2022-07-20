import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import GenericModal from '../../../../../components/Modals/GenericModal/genericModal';
import { withFormHandlerProps } from '../../../../../hoc/withFormHandler';
import { CreateUser } from '../../../../../redux/features/administrativeArea/user/userThunk';
import { closeModal } from '../../../../../redux/features/modal/modalSlice';
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
  const dispatch = useDispatch();
  const [newFormValues, setNewFormValues] = useState<{
    [key: string]: formFieldI['value'];
  }>({});
  const [isFormValid, setIsFormValid] = useState<boolean>(true);

  const handleSaveEnte = () => {
    if (isFormValid) {
      dispatch(CreateUser(newFormValues));
    }
    dispatch(closeModal());
  };

  return (
    <GenericModal
      id={id}
      primaryCTA={{
        disabled: !isFormValid,
        label: creation ? 'Conferma' : 'Salva',
        onClick: handleSaveEnte,
      }}
      secondaryCTA={{
        label: 'Annulla',
        onClick: () => clearForm?.(),
      }}
    >
      <FormUser
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

export default ManageUsers;
