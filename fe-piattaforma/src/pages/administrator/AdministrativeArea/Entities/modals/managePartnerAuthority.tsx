import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { SearchBar } from '../../../../../components';
import GenericModal from '../../../../../components/Modals/GenericModal/genericModal';

import { withFormHandlerProps } from '../../../../../hoc/withFormHandler';
import {
  resetAuthorityDetails,
  selectAuthorities,
  setAuthoritiesList,
  setAuthorityDetails,
} from '../../../../../redux/features/administrativeArea/administrativeAreaSlice';
import {
  CreatePartnerAuthority,
  GetAuthoritiesBySearch,
  GetAuthorityDetail,
  GetPartnerAuthorityDetail,
  UpdatePartnerAuthority,
} from '../../../../../redux/features/administrativeArea/authorities/authoritiesThunk';
import { GetProjectDetail } from '../../../../../redux/features/administrativeArea/projects/projectsThunk';
import { closeModal } from '../../../../../redux/features/modal/modalSlice';
import { useAppSelector } from '../../../../../redux/hooks';
import { formFieldI } from '../../../../../utils/formHelper';
import FormAuthorities from '../../../../forms/formAuthorities';
import ExistingEnteInfo from '../../../../forms/formServices/ExistingEnteInfo';
import NoResultsFoundEnte from '../../../../../components/NoResultsFoundEnte/noResultsFoundEnte';
import { dispatchNotify } from '../../../../../utils/notifictionHelper';

const id = 'ente-partner';

interface ManagePartnerAuthorityFormI {
  formDisabled?: boolean;
  creation?: boolean;
  legend?: string | undefined;
}

interface ManageProjectPartnerAuthorityI
  extends withFormHandlerProps,
    ManagePartnerAuthorityFormI {}

const ManagePartnerAuthority: React.FC<ManageProjectPartnerAuthorityI> = ({
  clearForm = () => ({}),
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
  const { projectId, authorityId } = useParams();
  const authoritiesList = useAppSelector(selectAuthorities).list;
  const [firstOpen, setFirstOpen] = useState<boolean>(true);
  const [isEnteSelected, setIsEnteSelected] = useState(false);
  const [searchedFiscalCode, setSearchedFiscalCode] = useState<string>('');

  useEffect(() => {
    if (creation) dispatch(setAuthorityDetails({}));
  }, [creation]);

  const resetModal = (toClose = true) => {
    clearForm();
    setIsFormValid(false);
    setShowForm(false);
    setAlreadySearched(false);
    setFirstOpen(true);
    setIsEnteSelected(false);
    dispatch(setAuthoritiesList(null));
    // dispatch(resetAuthorityDetails());
    if (toClose) dispatch(closeModal());
  };

  

  const handleSearchAuthority = async (search: string) => {
    if(search.length !== 11) {
      dispatchNotify({
        status: 'error',
        message: 'Il codice fiscale deve essere lungo 11 caratteri',
        title: 'Attenzione',
        closable: true
    });
      return;
    }
    resetModal(false);
    dispatch(resetAuthorityDetails());
    setSearchedFiscalCode(search);
    const result = await dispatch(GetAuthoritiesBySearch(search)) as any;
    setAlreadySearched(true);    
    if (result?.data[0]) { //!
      dispatch(GetAuthorityDetail(result?.data[0].id as string, true));
      setShowForm(true);
      setFirstOpen(false);
      setIsFormValid(true);
      setIsEnteSelected(true);
    }
    // setShowForm(false);
    // setAlreadySearched(true);
  };

  const handleSaveEnte = async () => {
    if (isFormValid) {
      let res: any = null;
      if (newFormValues.id) {
        // Update
        if (projectId) {
          await dispatch(
            UpdatePartnerAuthority({ ...newFormValues }, projectId)
          );

          authorityId &&
            dispatch(GetPartnerAuthorityDetail(projectId, authorityId));
        }
      } else {
        // Create
        if (projectId) {
          res = await dispatch(
            CreatePartnerAuthority({ ...newFormValues }, projectId)
          );
        }
      }

      if (projectId && !authorityId) dispatch(GetProjectDetail(projectId));
      if (!res?.errorCode) {
        resetModal();
        dispatch(closeModal());
      }
    }
  };

  // The table makes me work with function defined this way
  // const handleSelectAuthority: CRUDActionsI = {
  //   [CRUDActionTypes.SELECT]: (td: TableRowI | string) => {
  //     if (typeof td !== 'string') {
  //       dispatch(GetAuthorityDetail(td.id as string, true));
  //       dispatch(setAuthoritiesList(null));
  //     }
  //     setShowForm(true);
  //   },
  // };

  const addNewEnte = () => {
    setAlreadySearched(false);
    setShowForm(true);
    setFirstOpen(false);
  };

  let content;
  
  if (showForm && !firstOpen) {    
    content = (
      <div>
        {authoritiesList && authoritiesList.length > 0 && <ExistingEnteInfo/>}
        <FormAuthorities
        noIdField
        creation={creation}
        formDisabled={isEnteSelected}
        sendNewValues={(newData?: { [key: string]: formFieldI['value'] }) => {
          setNewFormValues({ ...newData });
        }}
        setIsFormValid={(value: boolean | undefined) => setIsFormValid(!!value)}
        legend={legend}
        initialFiscalCode={searchedFiscalCode}
      />
      </div>
    );
  } else if (alreadySearched && (authoritiesList?.length === 0 || !authoritiesList) && !showForm ) {
    content = (
    <div style={{ margin: '50px 0' }}>
      <NoResultsFoundEnte onClickCta={addNewEnte}/>
    </div>
    );
  }

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
        onClick: resetModal,
      }}
      subtitle={<>
        Inserisci il <strong>codice fiscale</strong> dell'Ente e verifica che
        sia già registrato sulla piattaforma.
        <br />
        Se non è presente, compila la sua scheda.
      </>}
    >
      <div>
        <SearchBar
          className={clsx(
            'w-100',
            'py-4',
            'px-5',
            // 'search-bar-borders',
            'search-bar-custom'
          )}
          placeholder='Inserisci il codice fiscale dell’ente'
          onSubmit={handleSearchAuthority}
          onReset={() => {
            resetModal(false);
            setShowForm(false);
            dispatch(setAuthorityDetails({}));
          }}
          title=''
          search
        />
        <div className='mx-5'>{content}</div>
      </div>
    </GenericModal>
  );
};

export default ManagePartnerAuthority;
