import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import GenericModal from '../../../../../components/Modals/GenericModal/genericModal';
import { withFormHandlerProps } from '../../../../../hoc/withFormHandler';
import {
  CreateCategory,
  GetCategoriesList,
  UpdateCategory,
} from '../../../../../redux/features/forum/categories/categoriesThunk';
import {
  closeModal,
  selectModalPayload,
} from '../../../../../redux/features/modal/modalSlice';
import { useAppSelector } from '../../../../../redux/hooks';
import { formFieldI } from '../../../../../utils/formHelper';
import CategoryFrom from './Category/categoryForm';

const id = 'category';

interface CategoryModalFormI {
  formDisabled?: boolean;
  creation?: boolean;
}

interface ManageCategoryI extends withFormHandlerProps, CategoryModalFormI {}

const ManageCategory: React.FC<ManageCategoryI> = (props) => {
  const { formDisabled } = props;

  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const [newFormValues, setNewFormValues] = useState<{
    [key: string]: formFieldI['value'];
  }>({});
  const payload = useAppSelector(selectModalPayload);
  const dispatch = useDispatch();

  useEffect(() => {
    if (payload && payload.term_name && payload.term_type) {
      setNewFormValues({
        term_type: payload.term_type,
        term_name: payload.term_name,
      });
    }
  }, [payload]);

  const handleSaveCategory = async () => {
    if (payload?.id) {
      const res = await dispatch(
        UpdateCategory({ term_name: newFormValues.term_name }, payload.id)
      );
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (res) {
        dispatch(GetCategoriesList({}));
        resetModal();
      }
    } else {
      const res = await dispatch(CreateCategory(newFormValues));
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (res) {
        dispatch(GetCategoriesList({}));
        resetModal();
      }
    }
  };

  const resetModal = () => {
    setNewFormValues({});
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
      onClose={resetModal}
    >
      <CategoryFrom
        creation={!payload?.id}
        formDisabled={!!formDisabled}
        newFormValues={newFormValues}
        sendNewValues={(newData?: { [key: string]: formFieldI['value'] }) => {
          setNewFormValues({ ...newData });
        }}
        setIsFormValid={(value: boolean | undefined) => setIsFormValid(!!value)}
      />
    </GenericModal>
  );
};

export default ManageCategory;
