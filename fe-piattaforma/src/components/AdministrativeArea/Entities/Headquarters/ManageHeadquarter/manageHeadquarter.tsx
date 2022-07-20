import React, { useState } from 'react';
import GenericModal from '../../../../Modals/GenericModal/genericModal';

import { withFormHandlerProps } from '../../../../../hoc/withFormHandler';

import { formTypes } from '../../../../../pages/administrator/AdministrativeArea/Entities/utils';
import { formFieldI } from '../../../../../utils/formHelper';
import FormHeadquarters from '../HeadquartersForm/formHeadquarters';
import { AddressInfoI } from '../AccordionAddressList/AccordionAddress/AccordionAddress';
import { Form } from '../../../..';
import { Table, Toggle } from 'design-react-kit';
import AccordionAddressList from '../AccordionAddressList/AccordionAddressList';
import AddressInfoForm from '../AddressInfoForm/AddressInfoForm';
import { useParams } from 'react-router-dom';
import { useAppSelector } from '../../../../../redux/hooks';
import {
  selectHeadquarters,
  selectProjects,
} from '../../../../../redux/features/administrativeArea/administrativeAreaSlice';
import { useDispatch } from 'react-redux';
import {
  AssignAuthorityHeadquarter,
  GetHeadquarterDetails,
  GetHeadquartersBySearch,
} from '../../../../../redux/features/administrativeArea/headquarters/headquartersThunk';
import SearchBar from '../../../../SearchBar/searchBar';
import clsx from 'clsx';
import { headings } from '../../../../../pages/administrator/AdministrativeArea/Entities/modals/manageManagerAuthority';
import { CRUDActionsI, CRUDActionTypes } from '../../../../../utils/common';
import { TableRowI } from '../../../../Table/table';
import EmptySection from '../../../../EmptySection/emptySection';

const id = formTypes.SEDE;

interface ManageSediFormI {
  formDisabled?: boolean;
  creation?: boolean;
}

interface ManageSediI extends withFormHandlerProps, ManageSediFormI {}

const ManageHeadquarter: React.FC<ManageSediI> = ({
  clearForm,
  formDisabled,
  creation = false,
}) => {
  const [newFormValues, setNewFormValues] = useState<{
    [key: string]: formFieldI['value'];
  }>({});
  const [isFormValid, setIsFormValid] = useState<boolean>(true);
  const [showForm, setShowForm] = useState<boolean>(true);
  const [alreadySearched, setAlreadySearched] = useState<boolean>(false);

  // This has to be populated with data from the store as soon we have a
  // well defined mock
  const [addressList, setAddressList] = useState<AddressInfoI[]>([
    {
      indirizzoSede: {
        via: '',
        civico: '',
        comune: '',
        provincia: '',
        cap: '',
        regione: '',
        nazione: '',
      },
      fasceOrarieAperturaIndirizzoSede: [],
    },
  ]);

  // flag for conditionally render multiple address selection
  const [movingHeadquarter, setMovingHeadquarter] = useState<boolean>(false);
  const { projectId } = useParams();
  const authorityId =
    useAppSelector(selectProjects).detail?.idEnteGestoreProgetto;
  const headquarterList = useAppSelector(selectHeadquarters).list;
  const dispatch = useDispatch();

  const handleSelectHeadquarter: CRUDActionsI = {
    [CRUDActionTypes.SELECT]: (td: TableRowI | string) => {
      if (typeof td !== 'string') {
        dispatch(GetHeadquarterDetails(td.id as string));
      }
      setShowForm(true);
    },
  };

  let content;

  if (showForm) {
    content = (
      <>
        <FormHeadquarters
          creation={creation}
          formDisabled={!!formDisabled}
          sendNewValues={(newData) => setNewFormValues({ ...newData })}
          setIsFormValid={(value: boolean | undefined) =>
            setIsFormValid(!!value)
          }
        />
        <Form className='px-5 mb-3'>
          <Form.Row>
            <div className='col-10 col-md-6'>
              <Toggle
                label='Sede Itinerante'
                checked={movingHeadquarter}
                onChange={(e) => setMovingHeadquarter(e.target.checked)}
              />
            </div>
          </Form.Row>
        </Form>

        {movingHeadquarter ? (
          <AccordionAddressList
            addressList={addressList}
            onSetAddressList={(addressList: AddressInfoI[]) =>
              setAddressList([...addressList])
            }
          />
        ) : (
          <AddressInfoForm
            addressInfo={addressList[0]}
            onAddressInfoChange={(addressInfo: AddressInfoI) =>
              setAddressList([addressInfo])
            }
          />
        )}
      </>
    );
  } else if (headquarterList && headquarterList.length > 0) {
    content = (
      <Table
        heading={headings}
        values={headquarterList.map((item) => ({
          nome: item.nome,
          id: item.id,
        }))}
        onActionRadio={handleSelectHeadquarter}
        id='table'
      />
    );
  } else if (
    alreadySearched &&
    (headquarterList?.length === 0 || !headquarterList) &&
    !showForm
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

  // useEffect(() => {
  //   if (movingHeadquarter) setAddressList((prevList) => [prevList[0]]);
  // }, [movingHeadquarter]);

  const handleSaveSite = async () => {
    // addressList need in future probably will have some validators but now
    // there is no clue about the headquarter model structure and requirements

    if (isFormValid) {
      if (newFormValues && addressList.length > 0) {
        if (projectId && authorityId) {
          await dispatch(
            AssignAuthorityHeadquarter(authorityId, newFormValues, projectId)
          );
        }
      }
    }
  };

  const handleSearchHeadquarter = (search: string) => {
    if (search) dispatch(GetHeadquartersBySearch(search));
    setShowForm(false);
    setAlreadySearched(true);
  };

  return (
    <GenericModal
      id={id}
      primaryCTA={{
        disabled: !isFormValid,
        label: 'Conferma',
        onClick: handleSaveSite,
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
            'lightgrey-bg-c2'
          )}
          placeholder='Inserisci il nome della sede che stai cercando'
          onSubmit={handleSearchHeadquarter}
          title='Cerca'
          search
        />
        {content}
      </div>
    </GenericModal>
  );
};

export default ManageHeadquarter;
