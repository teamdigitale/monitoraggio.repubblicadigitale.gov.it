import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import GenericModal from '../../../../../components/Modals/GenericModal/genericModal';
import { withFormHandlerProps } from '../../../../../hoc/withFormHandler';
import { headings } from '../../../../../pages/administrator/AdministrativeArea/Entities/modals/manageReferal';
import { formTypes } from '../../../../../pages/administrator/AdministrativeArea/Entities/utils';
import {
  resetUserDetails,
  selectHeadquarters,
  selectUsers,
  setUsersList,
} from '../../../../../redux/features/administrativeArea/administrativeAreaSlice';
import {
  AssignHeadquarterFacilitator,
  GetHeadquarterDetails,
} from '../../../../../redux/features/administrativeArea/headquarters/headquartersThunk';
import {
  GetUserDetails,
  GetUsersBySearch,
  UpdateUser,
} from '../../../../../redux/features/administrativeArea/user/userThunk';
import {
  closeModal,
  selectModalState,
} from '../../../../../redux/features/modal/modalSlice';
import { useAppSelector } from '../../../../../redux/hooks';
import { CRUDActionsI, CRUDActionTypes } from '../../../../../utils/common';
import { formFieldI } from '../../../../../utils/formHelper';
import EmptySection from '../../../../EmptySection/emptySection';
import SearchBar from '../../../../SearchBar/searchBar';
import Table, { TableRowI } from '../../../../Table/table';
import FormFacilitator from '../FormFacilitator/FormFacilitator';

const id = formTypes.FACILITATORE;

interface ManageFacilitatorFormI {
  formDisabled?: boolean;
  creation?: boolean;
}

interface ManageFacilitatorI
  extends withFormHandlerProps,
    ManageFacilitatorFormI {}

const ManageFacilitator: React.FC<ManageFacilitatorI> = ({
  clearForm = () => ({}),
  formDisabled,
  creation = false,
}) => {
  const [newFormValues, setNewFormValues] = useState<{
    [key: string]: formFieldI['value'];
  }>({});
  const [isFormValid, setIsFormValid] = useState<boolean>(true);
  const usersList = useAppSelector(selectUsers).list;
  const [noResult, setNoResult] = useState(false);
  const dispatch = useDispatch();
  const { projectId, authorityId, headquarterId, userId } = useParams();
  const programPolicy =
    useAppSelector(selectHeadquarters).detail?.programmaPolicy;
  const open = useAppSelector(selectModalState);

  useEffect(() => {
    dispatch(setUsersList(null));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (creation && open) {
      dispatch(resetUserDetails());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [creation, open]);

  useEffect(() => {
    if (usersList && usersList.length === 0) {
      setNoResult(true);
    } else {
      setNoResult(false);
    }
  }, [usersList]);

  const handleSaveEnte = async () => {
    if (isFormValid && newFormValues) {
      let res: any = null;
      if (
        projectId &&
        authorityId &&
        headquarterId &&
        programPolicy &&
        creation
      ) {
        res = await dispatch(
          AssignHeadquarterFacilitator(
            newFormValues,
            authorityId,
            projectId,
            headquarterId,
            programPolicy
          )
        );
        dispatch(GetHeadquarterDetails(headquarterId, authorityId, projectId));
      } else if (userId) {
        res = await dispatch(
          UpdateUser(userId, {
            ...newFormValues,
          })
        );

        dispatch(GetUserDetails(userId));
      }

      if (!res?.errorCode) dispatch(closeModal());
    }
  };

  const handleSelectUser: CRUDActionsI = {
    [CRUDActionTypes.SELECT]: (td: TableRowI | string) => {
      if (typeof td !== 'string') {
        dispatch(GetUserDetails(td.id as string, true));
        dispatch(setUsersList(null));
      }
    },
  };

  const handleSearchUser = (search: string) => {
    if (search) dispatch(GetUsersBySearch(search));
  };

  let content = (
    <FormFacilitator
      formDisabled={!!formDisabled}
      sendNewValues={(newData?: { [key: string]: formFieldI['value'] }) =>
        setNewFormValues({ ...newData })
      }
      setIsFormValid={(value: boolean | undefined) => setIsFormValid(!!value)}
      creation={creation}
    />
  );

  if (usersList && usersList.length) {
    content = (
      <Table
        heading={headings}
        values={usersList.map((item) => ({
          id: item.id || item.codiceFiscale,
          codiceFiscale: item.codiceFiscale,
          nome: item.nome,
          cognome: item.cognome,
        }))}
        onActionRadio={handleSelectUser}
        id='table'
      />
    );
  }

  if (noResult) {
    content = (
      <EmptySection
        withIcon
        title='Nessun risultato'
        subtitle='Inserisci nuovamente i dati richiesti'
      />
    );
  }

  const handleCancel = () => {
    clearForm();
    dispatch(closeModal());
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
        onClick: () => handleCancel(),
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
              dispatch(setUsersList(null));
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

export default ManageFacilitator;
