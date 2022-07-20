import clsx from 'clsx';
import { Table } from 'design-react-kit';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { EmptySection, SearchBar } from '../../../../../components';
import GenericModal from '../../../../../components/Modals/GenericModal/genericModal';
import { TableRowI } from '../../../../../components/Table/table';

import { withFormHandlerProps } from '../../../../../hoc/withFormHandler';
import {
  selectAuthorities,
  setAuthorityDetails,
} from '../../../../../redux/features/administrativeArea/administrativeAreaSlice';
import {
  GetAuthoritiesBySearch,
  GetAuthorityDetail,
} from '../../../../../redux/features/administrativeArea/authorities/authoritiesThunk';
import { useAppSelector } from '../../../../../redux/hooks';
import { CRUDActionsI, CRUDActionTypes } from '../../../../../utils/common';
import { formFieldI } from '../../../../../utils/formHelper';
import FormAuthorities from '../../../../forms/formAuthorities';
import { headings } from './manageManagerAuthority';

const id = 'ente-gestore-progetto';

interface ManageEnteGestoreProgettoFormI {
  formDisabled?: boolean;
  creation?: boolean;
}

interface ManageEnteGestoreProgettoI
  extends withFormHandlerProps,
    ManageEnteGestoreProgettoFormI {}

const ManageProjectManagerAuthority: React.FC<ManageEnteGestoreProgettoI> = ({
  clearForm,
  formDisabled,
  creation,
}) => {
  const [newFormValues, setNewFormValues] = useState<{
    [key: string]: formFieldI['value'];
  }>({});
  const [isFormValid, setIsFormValid] = useState<boolean>(true);
  const [showForm, setShowForm] = useState<boolean>(true);
  const [alreadySearched, setAlreadySearched] = useState<boolean>(false);
  const authoritiesList = useAppSelector(selectAuthorities).list;
  const dispatch = useDispatch();

  useEffect(() => {
    if (creation) dispatch(setAuthorityDetails({}));
  }, [creation]);

  const handleSaveEnte = () => {
    if (isFormValid) {
      console.log(newFormValues);
      // TODO call to update the values
    }
  };

  const handleSearchAuthority = (search: string) => {
    if (search) dispatch(GetAuthoritiesBySearch(search));
    setShowForm(false);
    setAlreadySearched(true);
  };
  const handleSelectAuthority: CRUDActionsI = {
    [CRUDActionTypes.SELECT]: (td: TableRowI | string) => {
      if (typeof td !== 'string') {
        dispatch(GetAuthorityDetail(td.id as string));
      }
      setShowForm(true);
    },
  };

  let content;

  if (showForm) {
    content = (
      <FormAuthorities
        creation={creation}
        formDisabled={!!formDisabled}
        sendNewValues={(newData?: { [key: string]: formFieldI['value'] }) =>
          setNewFormValues({ ...newData })
        }
        setIsFormValid={(value: boolean | undefined) => setIsFormValid(!!value)}
      />
    );
  } else if (authoritiesList && authoritiesList.length > 0) {
    content = (
      <Table
        heading={headings}
        values={authoritiesList.map((item) => ({
          nome: item.nome,
        }))}
        onActionRadio={handleSelectAuthority}
        id='table'
      />
    );
  } else if (
    alreadySearched &&
    (authoritiesList?.length === 0 || !authoritiesList)
  ) {
    content = (
      <EmptySection
        title={'Nessun risultato'}
        subtitle={'Inserisci nuovamente i dati richiesti'}
        withIcon
        horizontal
      />
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
        onClick: () => clearForm?.(),
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
          placeholder='Inserisci il nome, l’identificativo o il codice fiscale dell’ente'
          onSubmit={handleSearchAuthority}
          title='Cerca'
          search
        />
        {content}
      </div>
    </GenericModal>
  );
};

export default ManageProjectManagerAuthority;
