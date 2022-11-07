import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { EmptySection, SearchBar } from '../../../../../components';
import GenericModal from '../../../../../components/Modals/GenericModal/genericModal';
import Table, {
  TableHeadingI,
  TableRowI,
} from '../../../../../components/Table/table';
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
import '../../../../../components/SearchBar/searchBar.scss';

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
    field: 'codiceFiscale',
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
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const [showForm, setShowForm] = useState<boolean>(true);
  const [alreadySearched, setAlreadySearched] = useState<boolean>(false);
  const dispatch = useDispatch();
  const usersList = useAppSelector(selectUsers).list;
  const { entityId, projectId, authorityId, userId } = useParams();
  const authority = useAppSelector(selectAuthorities).detail.dettagliInfoEnte;
  const open = useAppSelector(selectModalState);

  const resetModal = (toClose = true) => {
    clearForm();
    setShowForm(true);
    setAlreadySearched(false);
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

  const handleSaveReferal = async () => {
    if (isFormValid && (authority?.id || authorityId)) {
      let res: any = null;
      // Project details
      if (projectId) {
        if (authorityId) {
          res = await dispatch(
            AssignPartnerAuthorityReferentDelegate(
              authorityId,
              projectId,
              newFormValues,
              'REPP',
              userId
            )
          );
          await dispatch(GetPartnerAuthorityDetail(projectId, authorityId));
          if (userId) await dispatch(GetUserDetails(userId));
        } else if (authority?.id) {
          res = await dispatch(
            AssignManagerAuthorityReferentDelegate(
              authority.id,
              projectId,
              newFormValues,
              'progetto',
              'REGP',
              userId
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
            'REG',
            userId
          )
        );
        await dispatch(GetAuthorityManagerDetail(entityId, 'programma'));
        if (userId) await dispatch(GetUserDetails(userId));
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
        fieldsToHide={['ruolo', 'tipoContratto']}
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
        onClick: handleSaveReferal,
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
            placeholder='Inserisci il nome, l’ID o il codice fiscale dell’utente'
            onSubmit={handleSearchUser}
            onReset={() => {
              resetModal(false);
              dispatch(resetUserDetails());
            }}
            title='Cerca'
            search
          />
        ) : null}
        <div className='mx-5'>{content}</div>
      </div>
    </GenericModal>
  );
};

export default ManageReferal;
