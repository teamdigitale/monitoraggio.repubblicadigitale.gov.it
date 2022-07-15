import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import GenericModal from '../../../../../components/Modals/GenericModal/genericModal';
import { withFormHandlerProps } from '../../../../../hoc/withFormHandler';
import { formTypes } from '../../../../../pages/administrator/AdministrativeArea/Entities/utils';
import FormUser from '../../../../../pages/forms/formUser';
import { GetUsersBySearch } from '../../../../../redux/features/administrativeArea/user/userThunk';
import { formFieldI } from '../../../../../utils/formHelper';
import SearchBar from '../../../../SearchBar/searchBar';

const id = formTypes.FACILITATORE;

interface ManageFacilitatorFormI {
  formDisabled?: boolean;
  creation?: boolean;
}

interface ManageFacilitatorI
  extends withFormHandlerProps,
    ManageFacilitatorFormI {}

const ManageFacilitator: React.FC<ManageFacilitatorI> = ({
  clearForm,
  formDisabled,
  creation = false,
}) => {
  const [newFormValues, setNewFormValues] = useState<{
    [key: string]: formFieldI['value'];
  }>({});
  const [isFormValid, setIsFormValid] = useState<boolean>(true);
  const dispatch = useDispatch();

  const handleSaveEnte = () => {
    if (isFormValid) {
      console.log(newFormValues);
      // TODO update with real api
    }
  };

  const handleSearchUser = (search: string) => {
    if (search) dispatch(GetUsersBySearch(search));
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
      <div className='mx-5'>
        <SearchBar
          className='w-75 py-5'
          placeholder='Inserisci il nome, l’identificativo o il codice fiscale dell’utente'
          onSubmit={handleSearchUser}
        />
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

export default ManageFacilitator;
