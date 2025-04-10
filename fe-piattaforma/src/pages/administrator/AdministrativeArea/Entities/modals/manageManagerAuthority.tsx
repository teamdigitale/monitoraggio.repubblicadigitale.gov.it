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
  resetAuthorityDetails,
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
import { formFieldI } from '../../../../../utils/formHelper';
import FormAuthorities from '../../../../forms/formAuthorities';
import { GetProjectDetail } from '../../../../../redux/features/administrativeArea/projects/projectsThunk';
import { GetProgramDetail } from '../../../../../redux/features/administrativeArea/programs/programsThunk';
import clsx from 'clsx';
import ExistingEnteInfo from '../../../../forms/formServices/ExistingEnteInfo';
import NoResultsFoundEnte from '../../../../../components/NoResultsFoundEnte/noResultsFoundEnte';
import { dispatchNotify } from '../../../../../utils/notifictionHelper';

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
  legend?: string | undefined;
}

interface ManageManagerAuthorityI
  extends withFormHandlerProps,
  ManageManagerAuthorityFormI { }

const ManageManagerAuthority: React.FC<ManageManagerAuthorityI> = ({
  clearForm = () => ({}),
  creation = false,
  legend = '',
}) => {
  const [newFormValues, setNewFormValues] = useState<{
    [key: string]: formFieldI['value'];
  }>({});
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  // const [noResult, setNoResult] = useState(false);
  const dispatch = useDispatch();
  const { entityId, projectId } = useParams();
  const authoritiesList = useAppSelector(selectAuthorities).list;
  const enteGestoreProgettoId = useAppSelector(selectEnteGestoreProgetto);
  const enteGestoreProgrammaId = useAppSelector(selectEnteGestoreProgramma);
  const [firstOpen, setFirstOpen] = useState<boolean>(true);
  const [isEnteSelected, setIsEnteSelected] = useState(false);
  const [searchedFiscalCode, setSearchedFiscalCode] = useState<string>('');
  const [showForm, setShowForm] = useState<boolean>(true);
  const [alreadySearched, setAlreadySearched] = useState<boolean>(false);
  useEffect(() => {
    dispatch(setAuthoritiesList(null));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const resetModal = (toClose = true) => {
    clearForm();
    setShowForm(false);
    setAlreadySearched(false);
    setFirstOpen(true);
    setIsFormValid(false);
    setIsEnteSelected(false);
    if (creation) {
      dispatch(setAuthorityDetails(null));
    } else {
      projectId && dispatch(GetAuthorityManagerDetail(projectId, 'progetto'));
      entityId && dispatch(GetAuthorityManagerDetail(entityId, 'programma'));
    }
    dispatch(setAuthoritiesList(null));
    if (toClose) dispatch(closeModal());
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
  // const handleSelectAuthority: CRUDActionsI = {
  //   [CRUDActionTypes.SELECT]: (td: TableRowI | string) => {
  //     if (typeof td !== 'string') {
  //       dispatch(GetAuthorityDetail(td.id as string, true));
  //       dispatch(setAuthoritiesList(null));
  //     }
  //   },
  // };

  const handleSearchAuthority = async (search: string) => {
    if (search.length !== 11) {
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

  const addNewEnte = () => {
    setAlreadySearched(false);
    setShowForm(true);
    setFirstOpen(false);
  };

  let content;

  if (showForm && !firstOpen) {
    content = (
      <div>
        {authoritiesList && authoritiesList.length > 0 && <ExistingEnteInfo />}
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
  } else if (!creation) { //apro in modifica
    content = (
      <div>
        {authoritiesList && authoritiesList.length > 0 && <ExistingEnteInfo />}
        <FormAuthorities
          creation={creation}
          formDisabled={false}
          setIsFormValid={(value: boolean | undefined) => setIsFormValid(!!value)}
          sendNewValues={(newData?: { [key: string]: formFieldI['value'] }) =>
            setNewFormValues({ ...newData })
          }
          legend={legend}
        />
      </div>
    );
  } else if (alreadySearched && (authoritiesList?.length === 0 || !authoritiesList) && !showForm) {
    content = (
      <div style={{ margin: '50px 0' }}>
        <NoResultsFoundEnte onClickCta={addNewEnte} />
      </div>
    );
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
      {...(creation && {
        subtitle: (<>
          Inserisci il <strong>codice fiscale</strong> dell'Ente e verifica che
          sia già registrato sulla piattaforma.
          <br />
          Se non è presente, compila la sua scheda.
        </>),
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
              'search-bar-custom'
            )}
            placeholder='Inserisci il codice fiscale dell’ente'
            onSubmit={handleSearchAuthority}
            title=''
            onReset={() => {
              resetModal(false);
              setShowForm(false);
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
        ) : null}
        <div className='mx-5'>{content}</div>
      </div>
    </GenericModal>
  );
};

export default ManageManagerAuthority;