import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { EmptySection, SearchBar, Table } from '../../../../../components';
import GenericModal from '../../../../../components/Modals/GenericModal/genericModal';
import { TableRowI } from '../../../../../components/Table/table';
import { withFormHandlerProps } from '../../../../../hoc/withFormHandler';
import {
  resetUserDetails,
  selectAuthorities,
  selectUsers,
  setUsersList,
} from '../../../../../redux/features/administrativeArea/administrativeAreaSlice';
import {
  AssignManagerAuthorityReferentDelegate,
  AssignPartnerAuthorityReferentDelegate,
  GetAuthorityManagerDetail,
  GetPartnerAuthorityDetail,
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
import { headings } from './manageReferal';
import '../../../../../components/SearchBar/searchBar.scss';
import clsx from 'clsx';

const id = formTypes.DELEGATO;

interface ManageDelgateFormI {
  formDisabled?: boolean;
  creation?: boolean;
}

interface ManageDelegateI extends withFormHandlerProps, ManageDelgateFormI {}

const ManageDelegate: React.FC<ManageDelegateI> = ({
  clearForm = () => ({}),
  formDisabled,
  creation = false,
}) => {
  const [newFormValues, setNewFormValues] = useState<{
    [key: string]: formFieldI['value'];
  }>({});
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const [showForm, setShowForm] = useState<boolean>(true);
  const [alreadySearched, setAlreadySearched] = useState<boolean>(false);
  const dispatch = useDispatch();
  const usersList = useAppSelector(selectUsers).list;
  const { entityId, projectId, authorityId } = useParams();
  const authority = useAppSelector(selectAuthorities).detail.dettagliInfoEnte;

  const resetModal = () => {
    clearForm();
    setShowForm(true);
    setAlreadySearched(false);
    dispatch(setUsersList(null));
    dispatch(resetUserDetails());
  };

  const handleSaveDelegate = async () => {
    if (isFormValid && authority?.id) {
      if (projectId) {
        if (authorityId) {
          await dispatch(
            AssignPartnerAuthorityReferentDelegate(
              authorityId,
              projectId,
              newFormValues,
              'DEPP'
            )
          );

          dispatch(GetPartnerAuthorityDetail(projectId, authorityId));
        } else {
          await dispatch(
            AssignManagerAuthorityReferentDelegate(
              authority.id,
              projectId,
              newFormValues,
              'progetto',
              'DEGP'
            )
          );

          dispatch(GetAuthorityManagerDetail(projectId, 'progetto'));
        }
      } else if (entityId) {
        await dispatch(
          AssignManagerAuthorityReferentDelegate(
            authority.id,
            entityId,
            newFormValues,
            'programma',
            'DEG'
          )
        );
        dispatch(GetAuthorityManagerDetail(entityId, 'programma'));
      }
      resetModal();
      dispatch(closeModal());
    }
  };

  const handleSearchUser = (search: string) => {
    if (search) dispatch(GetUsersBySearch(search));
    setShowForm(false);
    setAlreadySearched(true);
  };

  const handleSelectUser: CRUDActionsI = {
    [CRUDActionTypes.SELECT]: (td: TableRowI | string) => {
      if (typeof td !== 'string') {
        dispatch(GetUserDetails(td.id as string));
      }
      setShowForm(true);
    },
  };

  let content;

  if (showForm) {
    content = (
      <FormUser
        creation={creation}
        formDisabled={!!formDisabled}
        sendNewValues={(newData?: { [key: string]: formFieldI['value'] }) =>
          setNewFormValues({ ...newData })
        }
        setIsFormValid={(value: boolean | undefined) => setIsFormValid(!!value)}
      />
    );
  } else if (usersList && usersList.length > 0) {
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
  } else if (
    alreadySearched &&
    (usersList?.length === 0 || !usersList) &&
    !showForm
  ) {
    content = <EmptySection title={'Nessun risultato'} withIcon horizontal />;
  }

  return (
    <GenericModal
      id={id}
      primaryCTA={{
        disabled: !isFormValid,
        label: 'Salva',
        onClick: handleSaveDelegate,
      }}
      secondaryCTA={{
        label: 'Annulla',
        onClick: () => resetModal(),
      }}
      centerButtons
    >
      <div>
        <SearchBar
          className={clsx(
            'w-100',
            'py-4',
            'px-5',
            'search-bar-borders',
            'search-bar-bg'
          )}
          placeholder='Inserisci il nome, l’identificativo o il codice fiscale dell’utente'
          onSubmit={handleSearchUser}
          onReset={() => setShowForm(true)}
          title='Cerca'
          search
        />
        <div className='mx-5'>{content}</div>
      </div>
    </GenericModal>
  );
};

export default ManageDelegate;
