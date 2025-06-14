import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import GenericModal from '../../../../../components/Modals/GenericModal/genericModal';
import { withFormHandlerProps } from '../../../../../hoc/withFormHandler';
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
import { formFieldI } from '../../../../../utils/formHelper';
import SearchBar from '../../../../SearchBar/searchBar';
import FormFacilitator from '../FormFacilitator/FormFacilitator';
import { selectedSteps } from '../../../../../pages/administrator/CitizensArea/Entities/SearchCitizenModal/searchCitizenModal';
import { useFiscalCodeValidation } from '../../../../../hooks/useFiscalCodeValidation';
import ExistingCitizenInfo from '../../../../../pages/forms/formServices/ExistingCitizenInfo';
import NoResultsFoundCitizen from '../../../../NoResultsFoundCitizen/noResultsFoundCitizen';

const id = formTypes.FACILITATORE;

interface ManageFacilitatorFormI {
  formDisabled?: boolean;
  creation?: boolean;
  legend?: string | undefined;
  updateFacilitators?: () => void;
}

interface ManageFacilitatorI
  extends withFormHandlerProps,
  ManageFacilitatorFormI { }

const ManageFacilitator: React.FC<ManageFacilitatorI> = ({
  clearForm = () => ({}),
  // formDisabled,
  creation = false,
  legend = '',
  updateFacilitators
}) => {
  const [newFormValues, setNewFormValues] = useState<{
    [key: string]: formFieldI['value'];
  }>({});
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const usersList = useAppSelector(selectUsers).list;
  const [noResult, setNoResult] = useState(false);
  const dispatch = useDispatch();
  const { projectId, authorityId, headquarterId, userId, identeDiRiferimento } = useParams();
  const programPolicy =
    useAppSelector(selectHeadquarters).detail?.programmaPolicy;
  const open = useAppSelector(selectModalState);
  const [isUserSelected, setIsUserSelected] = useState(false);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [firstOpen, setFirstOpen] = useState<boolean>(true);
  const [searchedFiscalCode, setSearchedFiscalCode] = useState<string>('');
  const [alreadySearched, setAlreadySearched] = useState<boolean>(false);
  const { canSubmit, onQueryChange, setCanSubmit } = useFiscalCodeValidation();

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
    if (usersList && usersList.length === 0) {
      setNoResult(true);
    } else {
      setNoResult(false);
    }
  }, [usersList]);

  const handleSaveEnte = async () => {
    if (isFormValid && newFormValues) {
      const authority = authorityId ? authorityId : identeDiRiferimento;
      let res: any = null;
      if (
        projectId &&
        authority &&
        headquarterId &&
        programPolicy &&
        creation
      ) {
        res = await dispatch(
          AssignHeadquarterFacilitator(
            newFormValues,
            authority,
            projectId,
            headquarterId,
            programPolicy
          )
        );
        dispatch(GetHeadquarterDetails(headquarterId, authority, projectId));
      } else if (userId && !isUserSelected) {
        res = await dispatch(
          UpdateUser(userId, {
            ...newFormValues,
          })
        );

        dispatch(GetUserDetails(userId));
      }
      if (!res?.errorCode) {
        dispatch(closeModal());
        handleCancel();
      }else if(updateFacilitators) {
        updateFacilitators();
      }
    }
    setIsFormValid(false);
    setIsUserSelected(false);
  };

  // const handleSelectUser: CRUDActionsI = {
  //   [CRUDActionTypes.SELECT]: (td: TableRowI | string) => {
  //     if (typeof td !== 'string') {
  //       dispatch(GetUserDetails(td.id as string, true));
  //       dispatch(setUsersList(null));
  //       setIsUserSelected(true);
  //       setIsFormValid(true)
  //     }
  //   },
  // };

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
        <FormFacilitator
          formDisabled={isUserSelected}
          sendNewValues={(newData?: { [key: string]: formFieldI['value'] }) =>
            setNewFormValues({ ...newData })
          }
          setIsFormValid={(value: boolean | undefined) => setIsFormValid(!!value || isUserSelected)}
          creation={creation}
          legend={legend}
          initialFiscalCode={searchedFiscalCode}
        />
      </div>
    );
  }else if(!creation){ //apro in modifica
    content = (
      <div>
        {usersList && usersList.length > 0 && <ExistingCitizenInfo newVersion={true} />}
        <FormFacilitator
          formDisabled={false}
          sendNewValues={(newData?: { [key: string]: formFieldI['value'] }) =>
            setNewFormValues({ ...newData })
          }
          setIsFormValid={(value: boolean | undefined) => setIsFormValid(!!value || isUserSelected)}
          creation={creation}
          legend={legend}
          initialFiscalCode={searchedFiscalCode}
        />
      </div>
    );
  } else if (noResult && !showForm) {
    content = (
      <div style={{ margin: '50px 0' }}>
        <NoResultsFoundCitizen onClickCta={addNewCitizen} newVersion={true} />
      </div>
    );
  }

  const handleCancel = () => {
    setIsUserSelected(false);
    clearForm();
    dispatch(closeModal());
    setShowForm(false);
    setAlreadySearched(false);
    setIsUserSelected(false);
    setIsFormValid(false);
    setFirstOpen(true);
    dispatch(setUsersList(null));
  };

  return (
    <GenericModal
      id={id}
      primaryCTA={{
        disabled: !isFormValid,
        label: creation ? 'Aggiungi' : 'Modifica',
        onClick: handleSaveEnte,
      }}
      secondaryCTA={{
        label: 'Annulla',
        onClick: () => handleCancel(),
      }}
      centerButtons
      {...(creation && {
        subtitle: (
          <>
            Inserisci il <strong>codice fiscale</strong> dell'utente e verifica che
            sia già registrato sulla piattaforma.
            <br />
            Se non è presente, compila la sua scheda.
          </>
        ),
      })}
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
              dispatch(setUsersList(null));
              dispatch(resetUserDetails());
              setCanSubmit(false);
              resetModal(false);
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

export default ManageFacilitator;
