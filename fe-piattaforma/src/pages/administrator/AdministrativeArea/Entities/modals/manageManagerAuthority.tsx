import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { SearchBar, Table } from '../../../../../components';
import GenericModal from '../../../../../components/Modals/GenericModal/genericModal';
import {
  TableHeadingI,
  TableRowI,
} from '../../../../../components/Table/table';

import { withFormHandlerProps } from '../../../../../hoc/withFormHandler';
import {
  selectAuthorities,
  setAuthoritiesList,
  setAuthorityDetails,
} from '../../../../../redux/features/administrativeArea/administrativeAreaSlice';
import {
  CreateManagerAuthority,
  GetAuthoritiesBySearch,
  GetAuthorityDetail,
  UpdateManagerAuthority,
} from '../../../../../redux/features/administrativeArea/authorities/authoritiesThunk';
import { closeModal } from '../../../../../redux/features/modal/modalSlice';
import { useAppSelector } from '../../../../../redux/hooks';
import { CRUDActionsI, CRUDActionTypes } from '../../../../../utils/common';
import { formFieldI } from '../../../../../utils/formHelper';
import FormAuthorities from '../../../../forms/formAuthorities';
import { GetProjectDetail } from '../../../../../redux/features/administrativeArea/projects/projectsThunk';
import { GetProgramDetail } from '../../../../../redux/features/administrativeArea/programs/programsThunk';

const id = 'ente-gestore';

export const headings: TableHeadingI[] = [
  {
    label: 'Nome',
    field: 'label',
    size: 'medium',
  },
  {
    label: 'ID',
    field: 'id',
    size: 'medium',
  },
  {
    label: 'Tipologia',
    field: 'tipologia',
    size: 'medium',
  },
];

interface ManageManagerAuthorityFormI {
  formDisabled?: boolean;
  creation?: boolean;
}

interface ManageManagerAuthorityI
  extends withFormHandlerProps,
    ManageManagerAuthorityFormI {}

const ManageManagerAuthority: React.FC<ManageManagerAuthorityI> = ({
  formDisabled,
  creation = false,
}) => {
  const [newFormValues, setNewFormValues] = useState<{
    [key: string]: formFieldI['value'];
  }>({});
  const [isFormValid, setIsFormValid] = useState<boolean>(true);
  const dispatch = useDispatch();
  const { entityId, projectId } = useParams();
  const authoritiesList = useAppSelector(selectAuthorities).list;

  useEffect(() => {
    if (creation) dispatch(setAuthorityDetails({}));
  }, [creation]);

  const handleSaveEnte = async () => {
    if (isFormValid) {
      // Update
      if (newFormValues.id) {
        if (projectId) {
          // Project
          await dispatch(
            UpdateManagerAuthority({ ...newFormValues }, projectId, 'progetto')
          );
        } else if (entityId) {
          // Program
          await dispatch(
            UpdateManagerAuthority({ ...newFormValues }, entityId, 'programma')
          );
        }
      }
      // Creation
      else {
        if (projectId) {
          // Project
          await dispatch(
            CreateManagerAuthority({ ...newFormValues }, projectId, 'progetto')
          );
          dispatch(GetProjectDetail(projectId));
        } else if (entityId) {
          // Program
          await dispatch(
            CreateManagerAuthority({ ...newFormValues }, entityId, 'programma')
          );
          dispatch(GetProgramDetail(entityId));
        }
      }

      dispatch(closeModal());
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

  /***
   * CASES
   *
   * 1 Add Authority
   *  authorityDetail = {}
   *  authoritiesList = null
   *  Need to show form empty
   *  Allow search authrities
   * 2 Authorities List Fetch
   *  List is empty -> Show empty form
   *  List has one element -> Show form prefilled
   *  List has more element -> Show List for select
   *  Selectfrom list -> Show form prefilled
   * 3 Modify Authority
   *  Show form prefilled
   *
   */

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
      ></Table>
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
        onClick: () => window.location.reload(),
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

export default ManageManagerAuthority;
