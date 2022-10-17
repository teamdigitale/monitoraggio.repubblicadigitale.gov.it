import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import GenericModal from '../../../../../components/Modals/GenericModal/genericModal';
import { withFormHandlerProps } from '../../../../../hoc/withFormHandler';
import {
  CreateCategory,
  GetCategoriesList,
} from '../../../../../redux/features/forum/categories/categoriesThunk';
import { closeModal } from '../../../../../redux/features/modal/modalSlice';
import { formFieldI } from '../../../../../utils/formHelper';
import CategoryFrom from './Category/categoryForm';

const id = 'category';

interface CategoryModalFormI {
  formDisabled?: boolean;
  creation?: boolean;
}

interface ManageCategoryI extends withFormHandlerProps, CategoryModalFormI {}

const ManageCategory: React.FC<ManageCategoryI> = (props) => {
  const { formDisabled, creation = false } = props;

  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const [newFormValues, setNewFormValues] = useState<{
    [key: string]: formFieldI['value'];
  }>({});
  const dispatch = useDispatch();

  const handleSaveCategory = async () => {
    await dispatch(CreateCategory(newFormValues));
    dispatch(GetCategoriesList({}));
    dispatch(closeModal());
  };

  return (
    <GenericModal
      id={id}
      primaryCTA={{
        disabled: !isFormValid,
        label: 'Conferma',
        onClick: () => handleSaveCategory(),
      }}
      secondaryCTA={{
        label: 'Annulla',
        onClick: () => dispatch(closeModal()),
      }}
    >
      <CategoryFrom
        creation={creation}
        formDisabled={!!formDisabled}
        sendNewValues={(newData?: { [key: string]: formFieldI['value'] }) => {
          setNewFormValues({ ...newData });
        }}
        setIsFormValid={(value: boolean | undefined) => setIsFormValid(!!value)}
      />
    </GenericModal>
  );
};

export default ManageCategory;
