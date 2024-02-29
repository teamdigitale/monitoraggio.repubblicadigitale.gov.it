import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import GenericModal from '../../../../../components/Modals/GenericModal/genericModal';
import { closeModal } from '../../../../../redux/features/modal/modalSlice';
import {
  CreateUserContext,
  EditUser,
} from '../../../../../redux/features/user/userThunk';
import { formFieldI, FormHelper, FormI } from '../../../../../utils/formHelper';
import FormOnboarding from '../../../../facilitator/Onboarding/formRegistrazione';
import { formTypes } from '../utils';

const id = formTypes.PROFILE;

const ManageProfile: React.FC = () => {
  const [newFormValues, setNewFormValues] = useState<{
    [key: string]: formFieldI['value'];
  }>({});
  //const user = useAppSelector(selectUser);
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const dispatch = useDispatch();

  const onSubmit = async () => {
    if (isFormValid) {
      const res = await dispatch(EditUser(newFormValues));
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (res) {
        if (newFormValues?.codiceFiscale)
          dispatch(CreateUserContext(newFormValues.codiceFiscale.toString()));
        dispatch(closeModal());
      }
    }
  };

  return (
    <GenericModal
      id={id}
      primaryCTA={{
        disabled: !isFormValid,
        label: 'Conferma',
        onClick: () => onSubmit?.(),
      }}
      secondaryCTA={{
        label: 'Annulla',
        onClick: () => dispatch(closeModal()),
      }}
    >
      <FormOnboarding
        sendNewForm={(newForm: FormI) =>
          setNewFormValues(FormHelper.getFormValues(newForm))
        }
        setIsFormValid={setIsFormValid}
      />
    </GenericModal>
  );
};

export default ManageProfile;
