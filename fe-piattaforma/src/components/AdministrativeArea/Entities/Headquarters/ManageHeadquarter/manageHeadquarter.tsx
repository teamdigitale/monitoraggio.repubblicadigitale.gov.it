import React, { useEffect, useState } from 'react';
import GenericModal from '../../../../Modals/GenericModal/genericModal';
import { withFormHandlerProps } from '../../../../../hoc/withFormHandler';
import { formTypes } from '../../../../../pages/administrator/AdministrativeArea/Entities/utils';
import { formFieldI } from '../../../../../utils/formHelper';
import FormHeadquarter from '../FormHeadquarter/FormHeadquarter';
import { AddressInfoI } from '../AccordionAddressList/AccordionAddress/AccordionAddress';
import { Form } from '../../../..';
import { Toggle } from 'design-react-kit';
import AccordionAddressList from '../AccordionAddressList/AccordionAddressList';
// import AddressInfoForm from '../AddressInfoForm/AddressInfoForm';
import { useParams } from 'react-router-dom';
import { useAppSelector } from '../../../../../redux/hooks';
import {
  resetHeadquarterDetails,
  selectAuthorities,
  selectHeadquarters,
  setHeadquartersList,
} from '../../../../../redux/features/administrativeArea/administrativeAreaSlice';
import { useDispatch } from 'react-redux';
import {
  AssignAuthorityHeadquarter,
  GetHeadquarterDetails,
  GetHeadquarterLightDetails,
  GetHeadquartersBySearch,
} from '../../../../../redux/features/administrativeArea/headquarters/headquartersThunk';
import SearchBar from '../../../../SearchBar/searchBar';
import clsx from 'clsx';
import { CRUDActionsI, CRUDActionTypes } from '../../../../../utils/common';
import Table, { TableHeadingI, TableRowI } from '../../../../Table/table';
import EmptySection from '../../../../EmptySection/emptySection';
import { validateAddressList } from '../../../../../utils/validator';
import {
  GetAuthorityManagerDetail,
  GetPartnerAuthorityDetail,
} from '../../../../../redux/features/administrativeArea/authorities/authoritiesThunk';
import {
  closeModal,
  selectModalState,
  // selectModalId,
  // selectModalState,
} from '../../../../../redux/features/modal/modalSlice';

const id = formTypes.SEDE;

const headings: TableHeadingI[] = [
  {
    label: 'Nome',
    field: 'nome',
    size: 'medium',
  },
  {
    label: 'ID',
    field: 'id',
    size: 'medium',
  },
];

interface ManageHeadquarterFormI {
  formDisabled?: boolean;
  creation?: boolean;
  enteType?: 'partner' | 'manager';
  legend?: string | undefined;
}

interface ManageHeadquarterI
  extends withFormHandlerProps,
    ManageHeadquarterFormI {}

const ManageHeadquarter: React.FC<ManageHeadquarterI> = ({
  formDisabled,
  creation = false,
  enteType = 'manager',
  legend = '',
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
  const { projectId, authorityId, headquarterId, identeDiRiferimento } =
    useParams();
  const authorityInfo =
    useAppSelector(selectAuthorities).detail?.dettagliInfoEnte;
  const headquartersList = useAppSelector(selectHeadquarters).list;
  const headquarterDetails =
    useAppSelector(selectHeadquarters).detail?.dettagliInfoSede;
  const dispatch = useDispatch();
  // const modalId = useAppSelector(selectModalId);
  const open = useAppSelector(selectModalState);
  const MIN_ADDRESSES_REQUIRED =
    'Per creare una sede itinerante, compila le informazioni relative ad almeno due indirizzi.';

  useEffect(() => {
    if (creation && open) {
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
      dispatch(resetHeadquarterDetails());
      dispatch(setHeadquartersList(null));
    }
  }, [open, creation]);

  useEffect(() => {
    if (headquarterDetails) {
      if (headquarterDetails?.indirizziSedeFasceOrarie)
        setAddressList([...headquarterDetails.indirizziSedeFasceOrarie]);
      if (headquarterDetails?.itinere)
        setMovingHeadquarter(headquarterDetails.itinere);
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
    if (movingHeadquarter) {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [movingHeadquarter]);

  const handleSelectHeadquarter: CRUDActionsI = {
    [CRUDActionTypes.SELECT]: (td: TableRowI | string) => {
      if (typeof td !== 'string') {
        dispatch(GetHeadquarterLightDetails(td.id as string));
        dispatch(setHeadquartersList(null));
      }
    },
  };

  const handleSaveAssignHeadquarter = async () => {
    if (isFormValid && validateAddressList(addressList)) {
      if (newFormValues && addressList.length) {
        if (projectId && ((authorityId && headquarterId) || authorityInfo)) {
          const res: any = await dispatch(
            AssignAuthorityHeadquarter(
              authorityId ? authorityId : authorityInfo?.id,
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
              projectId,
              creation
            )
          );

          if (authorityId && headquarterId) {
            dispatch(
              GetHeadquarterDetails(headquarterId, authorityId, projectId)
            );
          } else {
            if (enteType === 'manager')
              dispatch(GetAuthorityManagerDetail(projectId, 'progetto'));
            if (enteType === 'partner')
              dispatch(GetPartnerAuthorityDetail(projectId, authorityInfo?.id));
          }
          if (!res?.errorCode) {
            handleSearchReset();
            dispatch(closeModal());
          }
        }
      }
    }
  };

  const handleSearchHeadquarter = (search: string) => {
    if (search) dispatch(GetHeadquartersBySearch(search));
  };

  const handleSearchReset = () => {
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
    if (headquarterId && projectId && (authorityId || identeDiRiferimento)) {
      dispatch(
        GetHeadquarterDetails(
          headquarterId,
          authorityId || identeDiRiferimento || '',
          projectId
        )
      );
    } else if (headquarterId) {
      dispatch(GetHeadquarterLightDetails(headquarterId));
    }

    // dispatch(closeModal());
  };

  let content = (
    <>
      <FormHeadquarter
        creation={creation}
        formDisabled={!!formDisabled}
        sendNewValues={(newData) => setNewFormValues({ ...newData })}
        setIsFormValid={(value: boolean | undefined) => setIsFormValid(!!value)}
        legend={legend}
      />
      <Form
        legend='interruttore sede itinerante'
        id='form-manage-headquarter'
        className='mx-5 mb-5'
        showMandatory={false}
      >
        <Form.Row>
          <div className='col-10 col-md-6'>
            <Toggle
              label='Sede Itinerante'
              checked={movingHeadquarter}
              onChange={(e) => setMovingHeadquarter(e.target.checked)}
            />
          </div>
          <div>
            {movingHeadquarter && (
              <span className='d-block no-wrap'>{MIN_ADDRESSES_REQUIRED}</span>
            )}
          </div>
        </Form.Row>
      </Form>

      <AccordionAddressList
        addressList={addressList}
        onSetAddressList={(newAddressList: AddressInfoI[]) =>
          setAddressList([...newAddressList])
        }
        movingHeadquarter={movingHeadquarter}
        detailAccordion
      />
    </>
  );

  if (headquartersList && headquartersList.length) {
    content = (
      <Table
        heading={headings}
        values={headquartersList.map((item) => ({
          nome: item.nome,
          id: item.id,
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
        disabled: !isFormValid || !validateAddressList(addressList),
        label: 'Conferma',
        onClick: handleSaveAssignHeadquarter,
      }}
      secondaryCTA={{
        label: 'Annulla',
        onClick: () => {
          handleSearchReset();
          dispatch(closeModal());
        },
      }}
      centerButtons
    >
      <div>
        {creation ? (
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
            onReset={() => {
              dispatch(resetHeadquarterDetails());
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
              dispatch(setHeadquartersList(null));
            }}
            title='Cerca'
            search
            infoText={
              headquartersList?.length
                ? `${headquartersList?.length} risultati trovati`
                : ''
            }
          />
        ) : null}
        <div className='mx-5'>{content}</div>
      </div>
    </GenericModal>
  );
};

export default ManageHeadquarter;
