import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { SearchBar } from '../../../../../components';
import GenericModal from '../../../../../components/Modals/GenericModal/genericModal';
import Table, {
  TableHeadingI,
  TableRowI,
} from '../../../../../components/Table/table';
import { withFormHandlerProps } from '../../../../../hoc/withFormHandler';
import {
  selectAuthorities,
  selectUsers,
  setUsersList,
} from '../../../../../redux/features/administrativeArea/administrativeAreaSlice';
import {
  AssignReferentDelegate,
  GetAuthorityManagerDetail,
} from '../../../../../redux/features/administrativeArea/authorities/authoritiesThunk';
import {
  GetUserDetails,
  GetUsersBySearch,
} from '../../../../../redux/features/administrativeArea/user/userThunk';
import { closeModal } from '../../../../../redux/features/modal/modalSlice';
import { useAppSelector } from '../../../../../redux/hooks';
import { CRUDActionsI, CRUDActionTypes } from '../../../../../utils/common';
import { formFieldI } from '../../../../../utils/formHelper';
import FormUser from '../../../../forms/formUser';
import { formTypes } from '../utils';

const id = formTypes.REFERENTE;

export const headings: TableHeadingI[] = [
  {
    label: 'Nome',
    field: 'nome',
    size: 'medium',
  },
  {
    label: 'Cognome',
    field: 'cognome',
    size: 'medium',
  },
  {
    label: 'Codice Fiscale',
    field: 'id',
    size: 'medium',
  },
];

interface ManageReferalFormI {
  formDisabled?: boolean;
  creation?: boolean;
}

interface ManageReferalI extends withFormHandlerProps, ManageReferalFormI {}

const ManageReferal: React.FC<ManageReferalI> = ({
  clearForm = () => ({}),
  formDisabled,
  creation = false,
}) => {
  const [newFormValues, setNewFormValues] = useState<{
    [key: string]: formFieldI['value'];
  }>({});
  const [isFormValid, setIsFormValid] = useState<boolean>(true);
  const dispatch = useDispatch();
  const usersList = useAppSelector(selectUsers).list;
  const { entityId, projectId } = useParams();
  const authorityId =
    useAppSelector(selectAuthorities).detail.dettagliInfoEnte?.id;

  const handleSaveReferal = async () => {
    if (isFormValid && authorityId) {
      if (entityId) {
        await dispatch(
          AssignReferentDelegate(
            authorityId,
            entityId,
            newFormValues,
            'programma',
            'REG'
          )
        );
        await dispatch(GetAuthorityManagerDetail(entityId, 'programma'));
      }

      if (projectId) {
        await dispatch(
          AssignReferentDelegate(
            authorityId,
            projectId,
            newFormValues,
            'progetto',
            'REGP'
          )
        );
        await dispatch(GetAuthorityManagerDetail(projectId, 'progetto'));
      }

      dispatch(closeModal());
    }
  };

  const handleSearchUser = (search: string) => {
    if (search) dispatch(GetUsersBySearch(search));
  };

  const handleSelectUser: CRUDActionsI = {
    [CRUDActionTypes.SELECT]: (td: TableRowI | string) => {
      if (typeof td !== 'string') {
        dispatch(GetUserDetails(td.id as string));
        dispatch(setUsersList(null));
      }
    },
  };

  let content = (
    <FormUser
      creation={creation}
      formDisabled={!!formDisabled}
      sendNewValues={(newData?: { [key: string]: formFieldI['value'] }) =>
        setNewFormValues({ ...newData })
      }
      setIsFormValid={(value: boolean | undefined) => setIsFormValid(!!value)}
    />
  );

  if (usersList && usersList.length > 0)
    content = (
      <Table
        heading={headings}
        values={usersList.map((item) => ({
          nome: item.nome,
          cognome: item.cognome,
          id: item.codiceFiscale,
        }))}
        onActionRadio={handleSelectUser}
        id='table'
      />
    );

  return (
    <GenericModal
      id={id}
      primaryCTA={{
        disabled: !isFormValid,
        label: 'Conferma',
        onClick: handleSaveReferal,
      }}
      secondaryCTA={{
        label: 'Annulla',
        onClick: () => clearForm(),
      }}
    >
      <div className='mx-5'>
        <SearchBar
          className='w-75 py-5'
          placeholder='Inserisci il nome, l’identificativo o il codice fiscale dell’utente'
          onSubmit={handleSearchUser}
        />

        {content}
      </div>
    </GenericModal>
  );
};

export default ManageReferal;
