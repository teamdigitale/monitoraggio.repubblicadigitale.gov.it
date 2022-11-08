import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { EmptySection, SearchBar, Table } from '../../../../../components';
import GenericModal from '../../../../../components/Modals/GenericModal/genericModal';
import {
  TableHeadingI,
  TableRowI,
} from '../../../../../components/Table/table';

import { withFormHandlerProps } from '../../../../../hoc/withFormHandler';
import {
  //resetAuthorityDetails,
  selectAuthorities,
  selectEnteGestoreProgetto,
  selectEnteGestoreProgramma,
  setAuthoritiesList,
  setAuthorityDetails,
} from '../../../../../redux/features/administrativeArea/administrativeAreaSlice';
import {
  CreateManagerAuthority,
  GetAuthoritiesBySearch,
  GetAuthorityDetail,
  GetAuthorityManagerDetail,
  UpdateManagerAuthority,
} from '../../../../../redux/features/administrativeArea/authorities/authoritiesThunk';
import { closeModal } from '../../../../../redux/features/modal/modalSlice';
import { useAppSelector } from '../../../../../redux/hooks';
import { CRUDActionsI, CRUDActionTypes } from '../../../../../utils/common';
import { formFieldI } from '../../../../../utils/formHelper';
import FormAuthorities from '../../../../forms/formAuthorities';
import { GetProjectDetail } from '../../../../../redux/features/administrativeArea/projects/projectsThunk';
import { GetProgramDetail } from '../../../../../redux/features/administrativeArea/programs/programsThunk';
import clsx from 'clsx';

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
  clearForm = () => ({}),
  formDisabled,
  creation = false,
}) => {
  const [newFormValues, setNewFormValues] = useState<{
    [key: string]: formFieldI['value'];
  }>({});
  const [isFormValid, setIsFormValid] = useState<boolean>(true);
  const [noResult, setNoResult] = useState(false);
  const dispatch = useDispatch();
  const { entityId, projectId } = useParams();
  const authoritiesList = useAppSelector(selectAuthorities).list;
  const enteGestoreProgettoId = useAppSelector(selectEnteGestoreProgetto);
  const enteGestoreProgrammaId = useAppSelector(selectEnteGestoreProgramma);

  useEffect(() => {
    dispatch(setAuthoritiesList(null));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (authoritiesList && authoritiesList.length === 0) {
      setNoResult(true);
    } else {
      setNoResult(false);
    }
  }, [authoritiesList]);

  const resetModal = () => {
    clearForm();
    if (creation) {
      dispatch(setAuthorityDetails(null));
    } else {
      projectId && dispatch(GetAuthorityManagerDetail(projectId, 'progetto'));
      entityId && dispatch(GetAuthorityManagerDetail(entityId, 'programma'));
    }
    setNoResult(false);
    dispatch(closeModal());
    //dispatch(resetAuthorityDetails());
  };

  /*useEffect(() => {
    if (creation) {
      //dispatch(resetAuthorityDetails());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [creation]);*/

  const handleSaveEnte = async () => {
    if (isFormValid) {
      // Update
      if (newFormValues.id) {
        if (projectId) {
          // Project
          const res: any = await dispatch(
            UpdateManagerAuthority(
              { ...newFormValues },
              enteGestoreProgettoId,
              projectId,
              'progetto'
            )
          );
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          if (res && !res.errorCode) {
            await dispatch(GetProjectDetail(projectId));
            dispatch(GetAuthorityManagerDetail(projectId, 'progetto'));
            resetModal();
          }
        } else if (entityId) {
          // Program
          const res: any = await dispatch(
            UpdateManagerAuthority(
              { ...newFormValues },
              enteGestoreProgrammaId,
              entityId,
              'programma'
            )
          );
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          if (res && !res.errorCode) {
            await dispatch(GetProgramDetail(entityId));
            dispatch(GetAuthorityManagerDetail(entityId, 'programma'));
            resetModal();
          }
        }
      }
      // Creation
      else {
        let res: any = null;
        if (projectId) {
          // Project
          res = await dispatch(
            CreateManagerAuthority({ ...newFormValues }, projectId, 'progetto')
          );

          if (!res?.errorCode) {
            await dispatch(GetProjectDetail(projectId));
            dispatch(GetAuthorityManagerDetail(projectId, 'progetto'));
            resetModal();
          }
        } else if (entityId) {
          // Program
          res = await dispatch(
            CreateManagerAuthority({ ...newFormValues }, entityId, 'programma')
          );
          if (!res?.errorCode) {
            await dispatch(GetProgramDetail(entityId));
            dispatch(GetAuthorityManagerDetail(entityId, 'programma'));
            resetModal();
          }
        }
      }
    }
  };

  /*  const handleSearchAuthority = (search: string) => {
    dispatch(GetAuthoritiesBySearch(search));
  };
 */
  // The table makes me work with function defined this way
  const handleSelectAuthority: CRUDActionsI = {
    [CRUDActionTypes.SELECT]: (td: TableRowI | string) => {
      if (typeof td !== 'string') {
        dispatch(GetAuthorityDetail(td.id as string, true));
        dispatch(setAuthoritiesList(null));
      }
    },
  };

  const handleSearchAuthority = (search: string) => {
    if (search) dispatch(GetAuthoritiesBySearch(search));
  };

  let content = (
    <FormAuthorities
      noIdField
      creation={creation}
      formDisabled={!!formDisabled}
      sendNewValues={(newData?: { [key: string]: formFieldI['value'] }) =>
        setNewFormValues({ ...newData })
      }
      setIsFormValid={(value: boolean | undefined) => setIsFormValid(!!value)}
    />
  );

  if (authoritiesList && authoritiesList.length > 0) {
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
  }

  if (noResult) {
    content = <EmptySection title='Nessun risultato' withIcon horizontal />;
  }

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

  /*   */

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
      centerButtons
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
          placeholder='Inserisci il nome, l’ID o il codice fiscale dell’ente'
          onSubmit={handleSearchAuthority}
          title='Cerca'
          onReset={() => {
            dispatch(setAuthoritiesList(null));
            if (creation) {
              dispatch(setAuthorityDetails(null));
              clearForm();
            } else {
              projectId &&
                dispatch(GetAuthorityManagerDetail(projectId, 'progetto'));
              entityId &&
                dispatch(GetAuthorityManagerDetail(entityId, 'programma'));
            }
          }}
          search
        />
        <div className='mx-5'>{content}</div>
      </div>
    </GenericModal>
  );
};

export default ManageManagerAuthority;
