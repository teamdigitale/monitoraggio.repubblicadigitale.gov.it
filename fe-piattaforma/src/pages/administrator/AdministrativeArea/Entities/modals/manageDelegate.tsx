import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { SearchBar } from '../../../../../components';
import GenericModal from '../../../../../components/Modals/GenericModal/genericModal';
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
import { formFieldI } from '../../../../../utils/formHelper';
import FormUser from '../../../../forms/formUser';
import { formTypes } from '../utils';
import '../../../../../components/SearchBar/searchBar.scss';
import clsx from 'clsx';
import { selectedSteps } from '../../../CitizensArea/Entities/SearchCitizenModal/searchCitizenModal';
import { useFiscalCodeValidation } from '../../../../../hooks/useFiscalCodeValidation';
import NoResultsFoundCitizen from '../../../../../components/NoResultsFoundCitizen/noResultsFoundCitizen';
import ExistingCitizenInfo from '../../../../forms/formServices/ExistingCitizenInfo';

const id = formTypes.DELEGATO;

interface ManageDelgateFormI {
  formDisabled?: boolean;
  creation?: boolean;
  legend?: string | undefined;
}

interface ManageDelegateI extends withFormHandlerProps, ManageDelgateFormI { }

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
  const [showForm, setShowForm] = useState<boolean>(false);
  const [firstOpen, setFirstOpen] = useState<boolean>(true);
  const [searchedFiscalCode, setSearchedFiscalCode] = useState<string>('');
  const [alreadySearched, setAlreadySearched] = useState<boolean>(false);
  const dispatch = useDispatch();
  const usersList = useAppSelector(selectUsers).list;
  const { entityId, projectId, authorityId, userId } = useParams();
  const authority = useAppSelector(selectAuthorities).detail.dettagliInfoEnte;
  const open = useAppSelector(selectModalState);
  const [isUserSelected, setIsUserSelected] = useState(false);
  const { canSubmit, onQueryChange, setCanSubmit } = useFiscalCodeValidation();

  const resetModal = (toClose = true) => {
    clearForm();
    setShowForm(false);
    setAlreadySearched(false);
    setIsUserSelected(false);
    setFirstOpen(true);
    setIsFormValid(false);
    dispatch(resetUserDetails());
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
              !isUserSelected
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
              !isUserSelected
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
            !isUserSelected
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

  const handleSearchUser = async (search: string) => {
    resetModal(false);
    dispatch(resetUserDetails());
    setCanSubmit(false);
    setSearchedFiscalCode(search);
    const result = await dispatch(GetUsersBySearch(search)) as any;
    setAlreadySearched(true);
    if (result?.data[0]) { //!
      dispatch(GetUserDetails(result?.data[0].id as string, true));
      setShowForm(true);
      setFirstOpen(false);
      setIsUserSelected(true);
      setIsFormValid(true);
    }
  };

  // const handleSelectUser: CRUDActionsI = {
  //   [CRUDActionTypes.SELECT]: (td: TableRowI | string) => {
  //     if (typeof td !== 'string') {
  //       dispatch(GetUserDetails(td.id as string, true));
  //     }
  //     setShowForm(true);
  //     setIsUserSelected(true);
  //     setIsFormValid(true);
  //   },
  // };

  const addNewCitizen = () => {
    setAlreadySearched(false);
    setShowForm(true);
    setFirstOpen(false);
  };

  let content;

  if (showForm && !firstOpen) {
    content = (
      <div>
        {usersList && usersList.length > 0 && <ExistingCitizenInfo newVersion={true} />}
        <FormUser
          creation={creation}
          formDisabled={isUserSelected}
          setIsFormValid={(value: boolean | undefined) => setIsFormValid(!!value || isUserSelected)}
          sendNewValues={(newData?: { [key: string]: formFieldI['value'] }) =>
            setNewFormValues({ ...newData })
          }
          fieldsToHide={['ruolo', 'tipoContratto']}
          legend={legend}
          initialFiscalCode={searchedFiscalCode}
        />
      </div>
    );
  } else if (alreadySearched && (usersList?.length === 0 || !usersList) && !showForm) {
    content = (
      <div style={{ margin: '50px 0' }}>
        <NoResultsFoundCitizen onClickCta={addNewCitizen} newVersion={true} />
      </div>
    );
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
      subtitle={<>
        Inserisci il <strong>codice fiscale</strong> dell'utente e verifica che
        sia già registrato sulla piattaforma.
        <br />
        Se non è presente, compila la sua scheda.
      </>}
    >
      <div>
        {creation ? (
          <SearchBar
            className={clsx(
              'w-100',
              'py-4',
              'px-5',
              // 'search-bar-borders',
              // 'search-bar-bg'
            )}
            searchType={selectedSteps.FISCAL_CODE}
            onQueryChange={onQueryChange}
            disableSubmit={!canSubmit}
            placeholder='Inserisci il codice fiscale dell’utente'
            onSubmit={handleSearchUser}
            onReset={() => {
              resetModal(false);
              dispatch(resetUserDetails());
              setCanSubmit(false);
            }}
            title=''
            search
          />
        ) : null}
        <div className='mx-5'>{content}</div>
      </div>
    </GenericModal>
  );
};

export default ManageDelegate;
