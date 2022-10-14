import React, { useState } from 'react';
import { withFormHandlerProps } from '../../../../../hoc/withFormHandler';
import { useDispatch } from 'react-redux';
import { formFieldI } from '../../../../../utils/formHelper';
import GenericModal from '../../../../../components/Modals/GenericModal/genericModal';
import { closeModal } from '../../../../../redux/features/modal/modalSlice';
import FormAddComment from '../../../../forms/formComments/formAddComment';

const id = 'addCommentModal';
interface ManageCommentFormI {
  formDisabled?: boolean;
  creation?: boolean;
}

interface ManageCommentI extends withFormHandlerProps, ManageCommentFormI {}

const ManageComment: React.FC<ManageCommentI> = ({
  clearForm,
  formDisabled,
  creation = false,
}) => {
  const [newFormValues, setNewFormValues] = useState<{
    [key: string]: formFieldI['value'];
  }>({});
  const [isFormValid, setIsFormValid] = useState<boolean>(true);
  const dispatch = useDispatch();
  const handleSaveComment = () => {
    console.log(newFormValues);
  };
  return (
    <GenericModal
      id={id}
      primaryCTA={{
        disabled: !isFormValid,
        label: creation ? 'Conferma' : 'Salva',
        onClick: handleSaveComment,
      }}
      secondaryCTA={{
        label: 'Annulla',
        onClick: () => {
          clearForm?.();
          dispatch(closeModal());
        },
      }}
      centerButtons
    >
      <FormAddComment
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

export default ManageComment;
