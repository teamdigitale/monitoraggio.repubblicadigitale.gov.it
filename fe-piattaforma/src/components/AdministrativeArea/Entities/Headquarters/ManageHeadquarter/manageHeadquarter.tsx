import React, { useEffect, useState } from 'react';
import GenericModal from '../../../../Modals/GenericModal/genericModal';
import { withFormHandlerProps } from '../../../../../hoc/withFormHandler';
import { formTypes } from '../../../../../pages/administrator/AdministrativeArea/Entities/utils';
import { formFieldI } from '../../../../../utils/formHelper';
import FormHeadquarters from '../HeadquartersForm/formHeadquarters';
import { AddressInfoI } from '../AccordionAddressList/AccordionAddress/AccordionAddress';
import { Form } from '../../../..';
import { Toggle } from 'design-react-kit';
import AccordionAddressList from '../AccordionAddressList/AccordionAddressList';
import AddressInfoForm from '../AddressInfoForm/AddressInfoForm';
import { useParams } from 'react-router-dom';
import { useAppSelector } from '../../../../../redux/hooks';
import {
  selectHeadquarters,
  selectProjects,
  setHeadquarterDetails,
  setHeadquartersList,
} from '../../../../../redux/features/administrativeArea/administrativeAreaSlice';
import { useDispatch } from 'react-redux';
import {
  AssignAuthorityHeadquarter,
  GetHeadquarterDetails,
  GetHeadquartersBySearch,
} from '../../../../../redux/features/administrativeArea/headquarters/headquartersThunk';
import SearchBar from '../../../../SearchBar/searchBar';
import clsx from 'clsx';
import { CRUDActionsI, CRUDActionTypes } from '../../../../../utils/common';
import Table, { TableHeadingI, TableRowI } from '../../../../Table/table';
import EmptySection from '../../../../EmptySection/emptySection';
import { validateAddressList } from '../../../../../utils/validator';
import { GetAuthorityManagerDetail } from '../../../../../redux/features/administrativeArea/authorities/authoritiesThunk';
import { closeModal } from '../../../../../redux/features/modal/modalSlice';

const id = formTypes.SEDE;

const headings: TableHeadingI[] = [
  {
    label: 'ID',
    field: 'id',
    size: 'medium',
  },
  {
    label: 'Nome',
    field: 'nome',
    size: 'medium',
  },
];

interface ManageSediFormI {
  formDisabled?: boolean;
  creation?: boolean;
}

interface ManageSediI extends withFormHandlerProps, ManageSediFormI {}

const ManageHeadquarter: React.FC<ManageSediI> = ({
  formDisabled,
  creation = false,
}) => {
  const [newFormValues, setNewFormValues] = useState<{
    [key: string]: formFieldI['value'];
  }>({});
  const [isFormValid, setIsFormValid] = useState<boolean>(true);
  const [noResult, setNoResult] = useState(false);

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
      fasceOrarieAperturaIndirizzoSede: {},
    },
  ]);

  // flag for conditionally render multiple address selection
  const [movingHeadquarter, setMovingHeadquarter] = useState<boolean>(false);
  const { projectId } = useParams();
  const authorityId =
    useAppSelector(selectProjects).detail?.idEnteGestoreProgetto;
  const headquartersList = useAppSelector(selectHeadquarters).list;
  const headquarterDetails =
    useAppSelector(selectHeadquarters).detail?.dettagliInfoSede;
  const dispatch = useDispatch();

  useEffect(() => {
    if (headquarterDetails) {
      if (headquarterDetails?.indirizziSedeFasceOrarie)
        setAddressList([...headquarterDetails.indirizziSedeFasceOrarie]);
      if (headquarterDetails?.itinere)
        setMovingHeadquarter(headquarterDetails.itinere);
    } else {
      setAddressList([
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
          fasceOrarieAperturaIndirizzoSede: {},
        },
      ]);
      setMovingHeadquarter(false);
    }
  }, [headquarterDetails]);

  useEffect(() => {
    if (headquartersList && headquartersList.length === 0) {
      setNoResult(true);
    } else {
      setNoResult(false);
    }
  }, [headquartersList]);

  useEffect(() => {
    if (!movingHeadquarter) {
      setAddressList((prevList) =>
        prevList.map((add, i) =>
          i !== 0
            ? {
                ...add,
                indirizzoSede: { ...add.indirizzoSede, cancellato: true },
              }
            : { ...add }
        )
      );
    } else {
      const newAddressList = [...addressList];
      while (
        newAddressList.filter((address) => !address.indirizzoSede?.cancellato)
          .length < 2
      ) {
        newAddressList.push({
          indirizzoSede: {
            via: '',
            civico: '',
            comune: '',
            provincia: '',
            cap: '',
            regione: '',
            nazione: '',
          },
          fasceOrarieAperturaIndirizzoSede: {},
        });
      }

      setAddressList([...newAddressList]);
    }
  }, [movingHeadquarter]);

  const handleSelectHeadquarter: CRUDActionsI = {
    [CRUDActionTypes.SELECT]: (td: TableRowI | string) => {
      if (typeof td !== 'string') {
        dispatch(GetHeadquarterDetails(td.id as string));
        dispatch(setHeadquartersList(null));
      }
    },
  };

  const handleSaveAssignHeadquarter = async () => {
    if (isFormValid && validateAddressList(addressList)) {
      if (newFormValues && addressList.length > 0) {
        if (projectId && authorityId) {
          await dispatch(
            AssignAuthorityHeadquarter(
              authorityId,
              {
                itinere: movingHeadquarter,
                ...newFormValues,
                indirizziSedeFasceOrarie: [
                  ...addressList.map((addressInfo) => ({
                    indirizzoSede: {
                      ...addressInfo.indirizzoSede,
                      nazione: 'ITA',
                    },
                    fasceOrarieAperturaIndirizzoSede: {
                      ...addressInfo.fasceOrarieAperturaIndirizzoSede,
                    },
                  })),
                ],
              },
              projectId
            )
          );

          await dispatch(GetAuthorityManagerDetail(projectId, 'progetto'));
          dispatch(closeModal());
        }
      }
    }
  };

  const handleSearchHeadquarter = (search: string) => {
    if (search) dispatch(GetHeadquartersBySearch(search));
  };

  const handleSearchReset = () => {
    dispatch(setHeadquartersList(null));
    dispatch(setHeadquarterDetails(null));
    setAddressList([
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
        fasceOrarieAperturaIndirizzoSede: {},
      },
    ]);
    setMovingHeadquarter(false);
  };

  let content = (
    <>
      <FormHeadquarters
        creation={creation}
        formDisabled={!!formDisabled}
        sendNewValues={(newData) => setNewFormValues({ ...newData })}
        setIsFormValid={(value: boolean | undefined) => setIsFormValid(!!value)}
      />
      <Form className='mx-5 mb-5'>
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

  if (headquartersList && headquartersList.length > 0) {
    content = (
      <Table
        heading={headings}
        values={headquartersList.map((item) => ({
          id: item.id,
          nome: item.nome,
        }))}
        onActionRadio={handleSelectHeadquarter}
        id='table'
      />
    );
  }

  if (noResult) {
    content = (
      <EmptySection
        withIcon
        title='Nessun risultato'
        subtitle='Inserisci nuovamente i dati richiesti'
      />
    );
  }

  return (
    <GenericModal
      id={id}
      primaryCTA={{
        disabled: !isFormValid,
        label: 'Conferma',
        onClick: handleSaveAssignHeadquarter,
      }}
      secondaryCTA={{
        label: 'Annulla',
        onClick: () => dispatch(setHeadquarterDetails(null)),
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
          onReset={handleSearchReset}
          title='Cerca'
          search
        />
        <div className='mx-5'>{content}</div>
      </div>
    </GenericModal>
  );
};

export default ManageHeadquarter;
