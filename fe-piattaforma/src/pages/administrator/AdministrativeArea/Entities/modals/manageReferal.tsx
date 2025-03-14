import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { SearchBar } from '../../../../../components';
import GenericModal from '../../../../../components/Modals/GenericModal/genericModal';
import {
  TableHeadingI,
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
import { formFieldI } from '../../../../../utils/formHelper';
import FormUser from '../../../../forms/formUser';
import { formTypes } from '../utils';
import '../../../../../components/SearchBar/searchBar.scss';
import { selectedSteps } from '../../../CitizensArea/Entities/SearchCitizenModal/searchCitizenModal';
import { useFiscalCodeValidation } from '../../../../../hooks/useFiscalCodeValidation';
import ExistingCitizenInfo from '../../../../forms/formServices/ExistingCitizenInfo';
import NoResultsFoundCitizen from '../../../../../components/NoResultsFoundCitizen/noResultsFoundCitizen';

const id = formTypes.REFERENTE;

export const headings: TableHeadingI[] = [
  {
    label: 'Cognome',
    field: 'cognome',
    size: 'medium',
  },
  {
    label: 'Nome',
    field: 'nome',
    size: 'medium',
  },
  {
    label: 'Codice Fiscale',
    field: 'codiceFiscale',
    size: 'medium',
  },
];

interface ManageReferalFormI {
  enteType?: string;
  formDisabled?: boolean;
  creation?: boolean;
  legend?: string | undefined;
  authoritySection?: () => void;
}

interface ManageReferalI extends withFormHandlerProps, ManageReferalFormI {}

const ManageReferal: React.FC<ManageReferalI> = ({
  enteType,
  clearForm = () => ({}),
  // formDisabled,
  creation = false,
  legend = '',
  authoritySection,
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
    dispatch(setUsersList(null));
    setIsFormValid(false);
    // dispatch(resetUserDetails());
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
              userId,
              !isUserSelected
            )
          );
          if(enteType == formTypes.ENTE_PARTNER){
            await dispatch(GetPartnerAuthorityDetail(projectId, authorityId));
          }
          if (userId) await dispatch(GetUserDetails(userId));
        } else if (authority?.id) {
          res = await dispatch(
            AssignManagerAuthorityReferentDelegate(
              authority.id,
              projectId,
              newFormValues,
              'progetto',
              'REGP',
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
            'REG',
            userId,
            !isUserSelected
          )
        );
        await dispatch(GetAuthorityManagerDetail(entityId, 'programma'));
        if (userId) await dispatch(GetUserDetails(userId));
      }
      if (!res) {
        resetModal();
      }else if(authoritySection){
        authoritySection();
      } 
    }
  };

  const handleSearchUser = async (search: string) => {
    resetModal(false);
    // dispatch(resetUserDetails());
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
        {usersList && usersList.length > 0 && <ExistingCitizenInfo newVersion = {true} />}
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
  }else if(!creation){ //apro in modifica
    content = (
      <div>
        {usersList && usersList.length > 0 && <ExistingCitizenInfo newVersion = {true} />}
        <FormUser
          creation={creation}
          formDisabled={false}
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
  } else if (alreadySearched && (usersList?.length === 0 || !usersList) && !showForm ) {
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
        label: creation ? 'Aggiungi' : 'Salva',
        onClick: handleSaveReferal,
      }}
      secondaryCTA={{
        label: 'Annulla',
        onClick: resetModal,
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

export default ManageReferal;
