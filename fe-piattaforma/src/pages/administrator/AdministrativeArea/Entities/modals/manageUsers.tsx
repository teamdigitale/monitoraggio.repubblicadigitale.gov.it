import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import GenericModal from '../../../../../components/Modals/GenericModal/genericModal';
import { withFormHandlerProps } from '../../../../../hoc/withFormHandler';
import {
  CreateUser,
  GetUserDetails,
  UpdateUser,
} from '../../../../../redux/features/administrativeArea/user/userThunk';
import {
  closeModal,
  selectModalPayload,
} from '../../../../../redux/features/modal/modalSlice';
import { useAppSelector } from '../../../../../redux/hooks';
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
  legend?: string | undefined;
}

interface ManageUsersI extends withFormHandlerProps, ManageUsersFormI {}

const ManageUsers: React.FC<ManageUsersI> = ({
  clearForm = () => ({}),
  formDisabled,
  creation = false,
  legend = '',
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [newFormValues, setNewFormValues] = useState<{
    [key: string]: formFieldI['value'];
  }>({});
  const [isFormValid, setIsFormValid] = useState<boolean>(true);
  const userIdPayload = useAppSelector(selectModalPayload)?.userId;
  const { userId } = useParams();

  const resetModal = (toClose = true) => {
    clearForm();
    if (toClose) dispatch(closeModal());
  };

  const handleSaveEnte = async () => {
    if (isFormValid) {
      let res: any = null;
      if (creation) {
        res = await dispatch(CreateUser(newFormValues));
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (res?.data?.idUtente) {
          navigate(
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            `/area-amministrativa/utenti/${res.data.idUtente}`
          );
        }
      } else {
        res = await dispatch(UpdateUser(userId || userIdPayload, newFormValues));
        dispatch(GetUserDetails(userId || userIdPayload));
      }

      if (!res?.errorCode) resetModal();
    }
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
        onClick: resetModal,
      }}
    >
      <FormUser
        creation={creation}
        formDisabled={!!formDisabled}
        sendNewValues={(newData?: { [key: string]: formFieldI['value'] }) =>
          setNewFormValues({ ...newData })
        }
        setIsFormValid={(value: boolean | undefined) => setIsFormValid(!!value)}
        legend={legend}
      />
    </GenericModal>
  );
};

export default ManageUsers;
