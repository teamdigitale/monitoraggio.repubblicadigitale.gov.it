import React, { useEffect, useState } from 'react';
import GenericModal from '../../../../Modals/GenericModal/genericModal';
import { withFormHandlerProps } from '../../../../../hoc/withFormHandler';
import { formTypes } from '../../../../../pages/administrator/AdministrativeArea/Entities/utils';
import { formFieldI } from '../../../../../utils/formHelper';
import FormHeadquarter from '../FormHeadquarter/FormHeadquarter';
import { AddressInfoI } from '../AccordionAddressList/AccordionAddress/AccordionAddress';
import { Form } from '../../../..';
import Select from '../../../../Form/select';
import { Icon, UncontrolledTooltip } from 'design-react-kit';
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
  GetTipologieUbicazione,
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
  ManageHeadquarterFormI { }

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
        tipologiaUbicazione: null,
      },
      fasceOrarieAperturaIndirizzoSede: {},
    },
  ]);

  // flag for conditionally render multiple address selection
  const [movingHeadquarter, setMovingHeadquarter] = useState<boolean>(false);
  const [serviziAltreLingue, setServiziAltreLingue] = useState<boolean | null>(
    null
  );
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
    dispatch(GetTipologieUbicazione());
  }, [dispatch]);

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
            tipologiaUbicazione: null,
          },
          fasceOrarieAperturaIndirizzoSede: {},
        },
      ]);
      setMovingHeadquarter(false);
      setServiziAltreLingue(null);
      dispatch(resetHeadquarterDetails());
      dispatch(setHeadquartersList(null));
    }
  }, [open, creation]);

  useEffect(() => {
    // Allinea lo stato locale ai valori canonical dello store ad ogni apertura
    // della modale: cosi' eventuali modifiche non confermate (utente chiude
    // senza salvare) non persistono alla riapertura. Senza la dep su `open`
    // l'effect non riscatterebbe perche' headquarterDetails non cambia.
    if (headquarterDetails && open) {
      if (headquarterDetails?.indirizziSedeFasceOrarie) {
        setAddressList([...headquarterDetails.indirizziSedeFasceOrarie]);
      }
      if (headquarterDetails?.itinere)
        setMovingHeadquarter(headquarterDetails.itinere);
      // Reset esplicito anche al caso "BE = null/undefined" per ripristinare
      // il placeholder "Seleziona" dopo una modifica non salvata.
      setServiziAltreLingue(
        typeof headquarterDetails?.serviziAltreLingue === 'boolean'
          ? headquarterDetails.serviziAltreLingue
          : null
      );
    }
  }, [headquarterDetails, open]);

  useEffect(() => {
    if (headquartersList && headquartersList.length === 0) {
      setNoResult(true);
    } else {
      setNoResult(false);
    }
  }, [headquartersList]);

  useEffect(() => {
  const isAddressFilled = (address: AddressInfoI) => {
    return Object.values(address.indirizzoSede).some(value => value !== '');
  };

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
          tipologiaUbicazione: null,
        },
        fasceOrarieAperturaIndirizzoSede: {},
      });
    }
    setAddressList([...newAddressList]);
  } else {
    // Rimuovi gli indirizzi aggiuntivi quando movingHeadquarter è false
    const newAddressList = addressList.filter((address, index) => {
      return index === 0 || isAddressFilled(address);
    });
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

  const isAllFormDataValid = (): boolean =>
    isFormValid && serviziAltreLingue !== null && validateAddressList(addressList);

  const handleSaveAssignHeadquarter = async () => {
    if (isAllFormDataValid()) {
      if (newFormValues && addressList.length) {
        if (projectId && (((authorityId || identeDiRiferimento) && headquarterId) || authorityInfo)) {
          const res: any = await dispatch(
            AssignAuthorityHeadquarter(
              authorityId ? authorityId : authorityInfo?.id,
              {
                itinere: movingHeadquarter,
                serviziAltreLingue,
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
          tipologiaUbicazione: null,
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
        legend='Sede itinerante e servizi in altre lingue'
        id='form-manage-headquarter'
        className='mb-0'
        showMandatory={false}
      >
        <Form.Row className='justify-content-between'>
          <Select
            id='select-sede-itinerante'
            label='Sede itinerante'
            labelAfter={
              <>
                <span
                  id='tooltip-sede-itinerante'
                  className='d-inline-flex ml-2 align-middle'
                >
                  <Icon
                    icon='it-info-circle'
                    size='sm'
                    color='primary'
                    aria-label='Informazione sede itinerante'
                  />
                </span>
                <UncontrolledTooltip
                  placement='right'
                  target='tooltip-sede-itinerante'
                  autohide={false}
                >
                  <strong>Che cos&apos;è una sede itinerante?</strong>
                  <br />
                  Per sede itinerante si intende qualsiasi soluzione logistica
                  che garantisca la presenza periodica del punto di
                  facilitazione sul territorio, per esempio i mezzi mobili
                  attrezzati (come i camper) oppure i team di facilitatori che
                  operano periodicamente presso spazi messi a disposizione da
                  comuni, enti pubblici o soggetti privati aderenti
                  all&apos;iniziativa. Scopri di più sul{' '}
                  <a
                    href='https://dtd-gov.notion.site/3-I-luoghi-della-facilitazione-digitale-b88f2c81c3f445bc81b1d583cd9e1283'
                    target='_blank'
                    rel='noopener noreferrer'
                    style={{ color: '#fff', textDecoration: 'underline' }}
                  >
                    Manuale della Facilitazione
                  </a>
                  .
                </UncontrolledTooltip>
              </>
            }
            required
            col='col-12 col-lg-6'
            value={movingHeadquarter ? 'true' : 'false'}
            options={[
              { value: 'false', label: 'No' },
              { value: 'true', label: 'Sì' },
            ]}
            onInputChange={(value) => setMovingHeadquarter(value === 'true')}
            subLabel={
              movingHeadquarter ? MIN_ADDRESSES_REQUIRED : undefined
            }
          />
          <Select
            id='select-servizi-altre-lingue'
            label='Servizi offerti in altre lingue'
            required
            col='col-12 col-lg-6'
            value={
              serviziAltreLingue === null
                ? ''
                : serviziAltreLingue
                ? 'true'
                : 'false'
            }
            placeholder='Seleziona'
            options={[
              {
                value: 'true',
                label: 'Sì, altre lingue diverse dall’italiano',
              },
              { value: 'false', label: 'No, solo in lingua italiana' },
            ]}
            onInputChange={(value) => setServiziAltreLingue(value === 'true')}
          />
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
        disabled: !isAllFormDataValid(),
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
                    tipologiaUbicazione: null,
                  },
                  fasceOrarieAperturaIndirizzoSede: {},
                },
              ]);
              setMovingHeadquarter(false);
              setServiziAltreLingue(null);
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
