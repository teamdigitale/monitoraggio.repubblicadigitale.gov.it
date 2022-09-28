import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { EmptySection, SearchBar } from '../../../../../components';
import GenericModal from '../../../../../components/Modals/GenericModal/genericModal';
import Table, { TableRowI } from '../../../../../components/Table/table';

import { withFormHandlerProps } from '../../../../../hoc/withFormHandler';
import {
  // resetAuthorityDetails,
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
import { CRUDActionsI, CRUDActionTypes } from '../../../../../utils/common';
import { formFieldI } from '../../../../../utils/formHelper';
import FormAuthorities from '../../../../forms/formAuthorities';
import { headings } from './manageManagerAuthority';

const id = 'ente-partner';

interface ManagePartnerAuthorityFormI {
  formDisabled?: boolean;
  creation?: boolean;
}

interface ManageProjectPartnerAuthorityI
  extends withFormHandlerProps,
    ManagePartnerAuthorityFormI {}

const ManagePartnerAuthority: React.FC<ManageProjectPartnerAuthorityI> = ({
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
  const { projectId, authorityId } = useParams();
  const authoritiesList = useAppSelector(selectAuthorities).list;

  useEffect(() => {
    if (creation) dispatch(setAuthorityDetails({}));
  }, [creation]);

  const resetModal = (toClose = true) => {
    clearForm();
    setShowForm(true);
    setAlreadySearched(false);
    // dispatch(resetAuthorityDetails());
    if (toClose) dispatch(closeModal());
  };

  const handleSearchAuthority = (search: string) => {
    if (search) dispatch(GetAuthoritiesBySearch(search));
    setShowForm(false);
    setAlreadySearched(true);
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
  const handleSelectAuthority: CRUDActionsI = {
    [CRUDActionTypes.SELECT]: (td: TableRowI | string) => {
      if (typeof td !== 'string') {
        dispatch(GetAuthorityDetail(td.id as string));
        dispatch(setAuthoritiesList(null));
      }
      setShowForm(true);
    },
  };

  let content;

  if (showForm) {
    content = (
      <FormAuthorities
        noIdField
        creation={creation}
        formDisabled={!!formDisabled}
        sendNewValues={(newData?: { [key: string]: formFieldI['value'] }) => {
          setNewFormValues({ ...newData });
        }}
        setIsFormValid={(value: boolean | undefined) => setIsFormValid(!!value)}
      />
    );
  } else if (authoritiesList && authoritiesList.length > 0) {
    content = (
      <Table
        heading={headings}
        values={authoritiesList.map((item) => ({
          label: item.nome,
          id: item.id,
          tipologia: item.tipologia,
        }))}
        onActionRadio={handleSelectAuthority}
        id='table'
      />
    );
  } else if (
    alreadySearched &&
    (authoritiesList?.length === 0 || !authoritiesList) &&
    !showForm
  ) {
    content = <EmptySection title={'Nessun risultato'} withIcon horizontal />;
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
          placeholder='Inserisci il nome, l’identificativo o il codice fiscale dell’ente'
          onSubmit={handleSearchAuthority}
          onReset={() => {
            setShowForm(true);
            dispatch(setAuthorityDetails({}));
          }}
          title='Cerca'
          search
        />
        <div className='mx-5'>{content}</div>
      </div>
    </GenericModal>
  );
};

export default ManagePartnerAuthority;
