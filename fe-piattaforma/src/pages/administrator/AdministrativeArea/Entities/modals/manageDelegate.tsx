import React, { useEffect, useState } from 'react';
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
import {
  closeModal,
  selectModalState,
} from '../../../../../redux/features/modal/modalSlice';
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
  legend?: string | undefined;
}

interface ManageDelegateI extends withFormHandlerProps, ManageDelgateFormI {}

const ManageDelegate: React.FC<ManageDelegateI> = ({
  clearForm = () => ({}),
  // formDisabled,
  creation = false,
  legend = '',
}) => {
  const [newFormValues, setNewFormValues] = useState<{
    [key: string]: formFieldI['value'];
  }>({});
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const [showForm, setShowForm] = useState<boolean>(true);
  const [alreadySearched, setAlreadySearched] = useState<boolean>(false);
  const dispatch = useDispatch();
  const usersList = useAppSelector(selectUsers).list;
  const { entityId, projectId, authorityId, userId } = useParams();
  const authority = useAppSelector(selectAuthorities).detail.dettagliInfoEnte;
  const open = useAppSelector(selectModalState);
  const [isUserSelected, setIsUserSelected] = useState(false);

  const resetModal = (toClose = true) => {
    clearForm();
    setShowForm(true);
    setAlreadySearched(false);
    setIsUserSelected(false);
    dispatch(setUsersList(null));
    if (toClose) dispatch(closeModal());
  };

  useEffect(() => {
    if (open) {
      resetModal(false);
      if (creation) dispatch(resetUserDetails());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, creation]);

  // useEffect(() => {
  //   dispatch(resetUserDetails());
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [creation]);

  const handleSaveDelegate = async () => {
    if (isFormValid && (authority?.id || authorityId)) {
      let res: any = null;
      if (projectId) {
        if (authorityId) {
          res = await dispatch(
            AssignPartnerAuthorityReferentDelegate(
              authorityId,
              projectId,
              newFormValues,
              'DEPP',
              userId,
              !isUserSelected,
            )
          );
          await dispatch(
            GetPartnerAuthorityDetail(projectId, authorityId || authority?.id)
          );
          if (userId) await dispatch(GetUserDetails(userId));
        } else if (authority?.id) {
          res = await dispatch(
            AssignManagerAuthorityReferentDelegate(
              authority?.id,
              projectId,
              newFormValues,
              'progetto',
              'DEGP',
              userId,
              !isUserSelected,
            )
          );

          await dispatch(GetAuthorityManagerDetail(projectId, 'progetto'));
          if (userId) await dispatch(GetUserDetails(userId));
        }
      } else if (entityId) {
        res = await dispatch(
          AssignManagerAuthorityReferentDelegate(
            authority?.id || authorityId,
            entityId,
            newFormValues,
            'programma',
            'DEG',
            userId,
            !isUserSelected,
          )
        );
        await dispatch(GetAuthorityManagerDetail(entityId, 'programma'));
        if (userId) dispatch(GetUserDetails(userId));
      }
      if (!res) {
        resetModal();
      }
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
        dispatch(GetUserDetails(td.id as string, true));
      }
      setShowForm(true);
      setIsUserSelected(true);
    },
  };

  let content;

  if (showForm) {
    content = (
      <FormUser
        creation={creation}
        formDisabled={isUserSelected}
        sendNewValues={(newData?: { [key: string]: formFieldI['value'] }) =>
          setNewFormValues({ ...newData })
        }
        setIsFormValid={(value: boolean | undefined) => setIsFormValid(!!value)}
        fieldsToHide={['ruolo', 'tipoContratto']}
        legend={legend}
      />
    );
  } else if (usersList && usersList.length > 0) {
    content = (
      <Table
        heading={headings}
        values={usersList.map((item) => ({
          nome: item.nome,
          cognome: item.cognome,
          id: item.id || item.codiceFiscale,
          codiceFiscale: item.codiceFiscale,
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
    content = <EmptySection title='Nessun risultato' withIcon horizontal />;
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
        onClick: resetModal,
      }}
      centerButtons
    >
      <div>
        {creation ? (
          <SearchBar
            className={clsx(
              'w-100',
              'py-4',
              'px-5',
              'search-bar-borders',
              'search-bar-bg'
            )}
            placeholder='Inserisci il codice fiscale dell’utente'
            onSubmit={handleSearchUser}
            onReset={() => {
              resetModal(false);
              dispatch(resetUserDetails());
            }}
            title='Cerca'
            search
            infoText={
              usersList?.length ? `${usersList?.length} risultati trovati` : ''
            }
          />
        ) : null}
        <div className='mx-5'>{content}</div>
      </div>
    </GenericModal>
  );
};

export default ManageDelegate;
