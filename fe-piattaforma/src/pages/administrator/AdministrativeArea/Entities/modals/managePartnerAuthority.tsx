import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { SearchBar } from '../../../../../components';
import GenericModal from '../../../../../components/Modals/GenericModal/genericModal';
import Table, { TableRowI } from '../../../../../components/Table/table';

import { withFormHandlerProps } from '../../../../../hoc/withFormHandler';
import {
  selectAuthorities,
  setAuthoritiesList,
  setAuthorityDetails,
} from '../../../../../redux/features/administrativeArea/administrativeAreaSlice';
import {
  CreatePartnerAuthority,
  GetAuthoritiesBySearch,
  GetAuthorityDetail,
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
  clearForm,
  formDisabled,
  creation = false,
}) => {
  const [newFormValues, setNewFormValues] = useState<{
    [key: string]: formFieldI['value'];
  }>({});
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const dispatch = useDispatch();
  const { projectId } = useParams();
  const authoritiesList = useAppSelector(selectAuthorities).list;

  useEffect(() => {
    if (creation) dispatch(setAuthorityDetails({}));
  }, [creation]);

  const handleSaveEnte = async () => {
    if (isFormValid) {
      if (newFormValues.id) {
        // Update
        projectId &&
          (await dispatch(
            UpdatePartnerAuthority({ ...newFormValues }, projectId)
          ));
      } else {
        // Create
        projectId &&
          (await dispatch(
            CreatePartnerAuthority({ ...newFormValues }, projectId)
          ));
      }
      dispatch(closeModal());
      if(projectId) dispatch(GetProjectDetail(projectId));
    }
  };

  const handleSearchAuthority = (search: string) => {
    dispatch(GetAuthoritiesBySearch(search));
  };

  // The table makes me work with function defined this way
  const handleSelectAuthority: CRUDActionsI = {
    [CRUDActionTypes.SELECT]: (td: TableRowI | string) => {
      if (typeof td !== 'string') {
        dispatch(GetAuthorityDetail(td.id as string));
        dispatch(setAuthoritiesList(null));
      }
    },
  };

  let content = (
    <FormAuthorities
      creation={creation}
      formDisabled={!!formDisabled}
      sendNewValues={(newData?: { [key: string]: formFieldI['value'] }) => {
        setNewFormValues({ ...newData });
      }}
      setIsFormValid={(value: boolean | undefined) => setIsFormValid(!!value)}
    />
  );

  if (authoritiesList && authoritiesList.length > 0)
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
        onClick: () => clearForm?.() && dispatch(closeModal()),
      }}
    >
      <div className='mx-5'>
        <SearchBar
          className='w-75 py-5'
          placeholder='Inserisci il nome, l’identificativo o il codice fiscale dell’ente'
          onSubmit={handleSearchAuthority}
        />
        {content}
      </div>
    </GenericModal>
  );
};

export default ManagePartnerAuthority;
