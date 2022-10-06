import React, { useEffect, useRef, useState } from 'react';
import { Icon, Nav, Tooltip } from 'design-react-kit';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { entityStatus, formTypes, userRoles } from '../utils';
import {
  CRUDActionsI,
  CRUDActionTypes,
  ItemsListI,
} from '../../../../../utils/common';
import {
  newTable,
  TableHeadingI,
  TableRowI,
} from '../../../../../components/Table/table';
import { ButtonInButtonsBar } from '../../../../../components/ButtonsBar/buttonsBar';
import {
  closeModal,
  openModal,
} from '../../../../../redux/features/modal/modalSlice';
import { useDispatch } from 'react-redux';
import DetailLayout from '../../../../../components/DetailLayout/detailLayout';
import ManageProject from '../modals/manageProject';
import ManageHeadquarter from '../../../../../components/AdministrativeArea/Entities/Headquarters/ManageHeadquarter/manageHeadquarter';
import { useAppSelector } from '../../../../../redux/hooks';
import {
  selectDevice,
  setInfoIdsBreadcrumb,
} from '../../../../../redux/features/app/appSlice';
import clsx from 'clsx';
import {
  selectAuthorities,
  selectProjects,
} from '../../../../../redux/features/administrativeArea/administrativeAreaSlice';
import {
  Accordion,
  CardStatusAction,
  EmptySection,
  NavLink,
  Table,
} from '../../../../../components';
import ProjectAccordionForm from '../../../../forms/formProjects/ProjectAccordionForm/ProjectAccordionForm';
import FormAuthorities from '../../../../forms/formAuthorities';
import ManagePartnerAuthority from '../modals/managePartnerAuthority';
import {
  DeleteEntity,
  TerminateEntity,
} from '../../../../../redux/features/administrativeArea/administrativeAreaThunk';
import {
  GetAuthorityManagerDetail,
  RemoveManagerAuthority,
  RemoveReferentDelegate,
  TerminatePartnerAuthority,
  UserAuthorityRole,
} from '../../../../../redux/features/administrativeArea/authorities/authoritiesThunk';
import {
  ActivateProject,
  GetProjectDetail,
} from '../../../../../redux/features/administrativeArea/projects/projectsThunk';
import TerminateEntityModal from '../../../../../components/AdministrativeArea/Entities/General/TerminateEntityModal/TerminateEntityModal';
import ManageDelegate from '../modals/manageDelegate';
import ManageReferal from '../modals/manageReferal';
import ManageManagerAuthority from '../modals/manageManagerAuthority';
import { RemoveAuthorityHeadquarter } from '../../../../../redux/features/administrativeArea/headquarters/headquartersThunk';
import DeleteEntityModal from '../../../../../components/AdministrativeArea/Entities/General/DeleteEntityModal/DeleteEntityModal';
import useGuard from '../../../../../hooks/guard';
import UploadCSVModal from '../../../../../components/AdministrativeArea/Entities/General/UploadCSVModal/UploadCSVModal';
import { selectProfile } from '../../../../../redux/features/user/userSlice';

const EntiPartnerTemplate =
  '/assets/entity_templates/template_ente-partner.csv';

const tabs = {
  INFO: 'info',
  ENTE_GESTORE: 'ente-gestore-progetto',
  ENTI_PARTNER: 'enti-partner',
  SEDI: 'sedi',
};

export const buttonsPositioning = {
  TOP: 'top',
  BOTTOM: 'bottom',
};

const EntePartnerTableHeading: TableHeadingI[] = [
  {
    label: 'Nome Ente',
    field: 'nome',
  },
  {
    label: 'Codice Fiscale',
    field: 'codiceFiscale',
  },
  {
    label: 'Esito',
    field: 'esito',
  },
];

const ProjectsDetails = () => {
  const { mediaIsDesktop, mediaIsPhone } = useAppSelector(selectDevice);
  const { codiceRuolo: userRole } = useAppSelector(selectProfile) || {};
  const project = useAppSelector(selectProjects).detail;
  const projectDetails = project.dettagliInfoProgetto;
  const programDetails = project.dettagliInfoProgramma;
  const managingAuthorityID = project.idEnteGestoreProgetto;
  const partnerAuthoritiesList = project.entiPartner;
  const headquarterList = project?.sedi;
  const authorityInfo = useAppSelector(selectAuthorities).detail;
  const [activeTab, setActiveTab] = useState<string>(tabs.INFO);
  const [currentForm, setCurrentForm] = useState<React.ReactElement>();
  const [currentModal, setCorrectModal] = useState<React.ReactElement>();
  const [emptySection, setEmptySection] = useState<React.ReactElement>();
  const [itemList, setItemList] = useState<ItemsListI | null>();
  const [itemAccordionList, setItemAccordionList] = useState<
    ItemsListI[] | null
  >();
  const [openOne, toggleOne] = useState(false);
  const [correctButtons, setCorrectButtons] = useState<ButtonInButtonsBar[]>(
    []
  );
  const [buttonsPosition, setButtonsPosition] = useState<'TOP' | 'BOTTOM'>(
    'TOP'
  );
  const [entePartnerTable, setEntePartnerTable] = useState(
    newTable(EntePartnerTableHeading, [])
  );
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const gestoreRef = useRef<HTMLLIElement>(null);
  const partnerRef = useRef<HTMLLIElement>(null);
  const sediRef = useRef<HTMLLIElement>(null);
  const infoRef = useRef<HTMLLIElement>(null);
  const {
    entityId,
    projectId,
    identeDiRiferimento,
    authorityType,
    authorityId,
  } = useParams();
  const managerAuthority =
    useAppSelector(selectAuthorities).detail?.dettagliInfoEnte;

  const { hasUserPermission } = useGuard();

  useEffect(() => {
    // For breadcrumb
    if (location.pathname === `/area-amministrativa/progetti/${entityId}`) {
      navigate(`/area-amministrativa/progetti/${entityId}/info`);
    }
    if (
      location.pathname ===
      `/area-amministrativa/progetti/${entityId}/${identeDiRiferimento}`
    ) {
      navigate(`/area-amministrativa/progetti/${entityId}/info`);
    }
    if (
      location.pathname ===
      `/area-amministrativa/progetti/${projectId}/ente-gestore-progetto/${authorityId}`
    ) {
      navigate(
        `/area-amministrativa/progetti/${projectId}/ente-gestore-progetto`
      );
    }
    if (
      location.pathname ===
      `/area-amministrativa/programmi/${entityId}/progetti/${projectId}`
    ) {
      navigate(
        `/area-amministrativa/programmi/${entityId}/progetti/${projectId}/info`
      );
    }
  }, []);

  useEffect(() => {
    // For breadcrumb
    if (projectId && projectDetails?.nome) {
      dispatch(
        setInfoIdsBreadcrumb({
          id: programDetails?.id,
          nome: programDetails?.nomeBreve,
        })
      );
      dispatch(
        setInfoIdsBreadcrumb({ id: projectId, nome: projectDetails?.nome })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId, projectDetails, activeTab]);

  useEffect(() => {
    scrollTo(0, 0);
    centerActiveItem();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const getActionRedirectURL = (userType: string, userId: string) => {
    if (entityId && authorityType && managingAuthorityID) {
      return `/area-amministrativa/programmi/${entityId}/progetti/${projectId}/${authorityType}/${managingAuthorityID}/${userType}/${userId}`;
    }
    return `/area-amministrativa/progetti/${projectId}/ente-gestore-progetto/${managingAuthorityID}/${userType}/${userId}`;
  };

  const onActionClickReferenti: CRUDActionsI = hasUserPermission([
    'del.ref_del.gest.prgt',
  ])
    ? {
        [CRUDActionTypes.VIEW]: (td: TableRowI | string) => {
          navigate(
            getActionRedirectURL(
              userRoles.REGP,
              (typeof td === 'string' ? td : td.id).toString()
            )
          );
        },
        [CRUDActionTypes.DELETE]: (td: TableRowI | string) => {
          dispatch(
            openModal({
              id: 'delete-entity',
              payload: {
                entity: 'referent-delegate',
                cf: td,
                role: 'REGP',
                text: 'Confermi di voler disassociare questo referente?',
              },
            })
          );
        },
      }
    : {
        [CRUDActionTypes.VIEW]: (td: TableRowI | string) => {
          navigate(
            getActionRedirectURL(
              userRoles.REGP,
              (typeof td === 'string' ? td : td.id).toString()
            )
          );
        },
      };

  const onActionClickDelegati: CRUDActionsI = hasUserPermission([
    'del.ref_del.gest.prgt',
  ])
    ? {
        [CRUDActionTypes.VIEW]: (td: TableRowI | string) => {
          navigate(
            getActionRedirectURL(
              userRoles.DEGP,
              (typeof td === 'string' ? td : td.id).toString()
            )
          );
        },
        [CRUDActionTypes.DELETE]: (td: TableRowI | string) => {
          dispatch(
            openModal({
              id: 'delete-entity',
              payload: {
                entity: 'referent-delegate',
                cf: td,
                role: 'DEGP',
                text: 'Confermi di voler disassociare questo delegato?',
              },
            })
          );
        },
      }
    : {
        [CRUDActionTypes.VIEW]: (td: TableRowI | string) => {
          navigate(
            getActionRedirectURL(
              userRoles.DEGP,
              (typeof td === 'string' ? td : td.id).toString()
            )
          );
        },
      };

  const centerActiveItem = () => {
    switch (activeTab) {
      case tabs.INFO:
        infoRef.current?.scrollIntoView({ block: 'center' });
        break;
      case tabs.ENTE_GESTORE:
        gestoreRef.current?.scrollIntoView({ block: 'center' });
        break;
      case tabs.ENTI_PARTNER:
        partnerRef.current?.scrollIntoView({ block: 'center' });
        break;
      case tabs.SEDI:
        sediRef.current?.scrollIntoView({ block: 'center' });
        break;
      default:
        infoRef.current?.scrollIntoView({ block: 'center' });
        break;
    }
  };

  useEffect(() => {
    const locationSplit = location.pathname.split('/');
    if (locationSplit?.length > 0) {
      switch (locationSplit[locationSplit?.length - 1]) {
        case tabs.INFO:
          setActiveTab(tabs.INFO);
          break;
        case tabs.ENTE_GESTORE:
          setActiveTab(tabs.ENTE_GESTORE);
          break;
        case tabs.ENTI_PARTNER:
          setActiveTab(tabs.ENTI_PARTNER);
          break;
        case tabs.SEDI:
          setActiveTab(tabs.SEDI);
          break;
        default:
          setActiveTab(tabs.INFO);
          break;
      }
    }
  }, [location]);

  const partnerAuthorityButtons: ButtonInButtonsBar[] = [
    {
      size: 'xs',
      color: 'primary',
      iconForButton: 'it-upload',
      iconColor: 'primary',
      outline: true,
      buttonClass: 'btn-secondary',
      text: 'Carica lista enti partner',
      onClick: () =>
        dispatch(
          openModal({
            id: 'upload-csv',
            payload: {
              title: 'Carica lista enti partner',
              entity: 'enti',
              endpoint: `/ente/partner/upload/${projectId}`,
            },
          })
        ),
    },
    {
      size: 'xs',
      color: 'primary',
      text: ' Aggiungi ente partner',
      onClick: () =>
        dispatch(
          openModal({
            id: formTypes.ENTE_PARTNER,
            payload: { title: 'Aggiungi ente partner' },
          })
        ),
    },
  ];

  const EmptySectionButtons: ButtonInButtonsBar[] = [
    {
      size: 'xs',
      color: 'primary',
      text: 'Aggiungi un nuovo Ente gestore Progetto',
      onClick: () =>
        dispatch(
          openModal({
            id: 'ente-gestore',
            payload: { title: 'Aggiungi Ente gestore Progetto' },
          })
        ),
    },
    {
      size: 'xs',
      color: 'primary',
      text: 'Aggiungi un nuovo Ente Partner',
      onClick: () =>
        dispatch(
          openModal({
            id: 'ente-partner',
            payload: { title: 'Aggiungi Ente partner' },
          })
        ),
    },
    {
      size: 'xs',
      color: 'primary',
      text: 'Aggiungi una nuova Sede',
      onClick: () =>
        dispatch(
          openModal({
            id: 'sede',
            payload: { title: 'Aggiungi Sede' },
          })
        ),
    },
  ];

  const AuthoritySection = () => {
    if (managingAuthorityID) {
      setButtonsPosition('BOTTOM');
      setCurrentForm(
        <FormAuthorities
          formDisabled
          enteType={formTypes.ENTE_GESTORE_PROGETTO}
        />
      );
      setCorrectModal(<ManageManagerAuthority />);
      setItemList(null);
      setCorrectButtons(
        authorityInfo?.dettagliInfoEnte?.statoEnte !== entityStatus.TERMINATO &&
          hasUserPermission(['upd.enti.gest.prgt'])
          ? [
              {
                size: 'xs',
                outline: true,
                color: 'primary',
                buttonClass: 'btn-secondary',
                text: 'Elimina',
                onClick: () =>
                  dispatch(
                    openModal({
                      id: 'delete-entity',
                      payload: {
                        entity: 'authority',
                        text: 'Confermi di volere eliminare questo gestore di progetto?',
                      },
                    })
                  ),
              },
              {
                size: 'xs',
                color: 'primary',
                text: 'Modifica',
                onClick: () =>
                  dispatch(
                    openModal({
                      id: 'ente-gestore',
                      payload: { title: 'Modifica ente gestore progetto' },
                    })
                  ),
              },
            ]
          : []
      );
      setItemAccordionList([
        {
          title: 'Referenti',
          items:
            authorityInfo?.referentiEnteGestore?.map(
              (ref: { [key: string]: string }) => ({
                ...ref,
                id: ref.id,
                codiceFiscale: ref.codiceFiscale,
                actions:
                  authorityInfo?.dettagliInfoEnte?.statoEnte ===
                    entityStatus.TERMINATO || ref?.stato !== entityStatus.ATTIVO
                    ? {
                        [CRUDActionTypes.VIEW]:
                          onActionClickReferenti[CRUDActionTypes.VIEW],
                      }
                    : onActionClickReferenti,
              })
            ) || [],
        },
        {
          title: 'Delegati',
          items:
            authorityInfo?.delegatiEnteGestore?.map(
              (del: { [key: string]: string }) => ({
                ...del,
                id: del.id,
                codiceFiscale: del.codiceFiscale,
                actions:
                  authorityInfo?.dettagliInfoEnte?.statoEnte ===
                    entityStatus.TERMINATO || del?.stato !== entityStatus.ATTIVO
                    ? {
                        [CRUDActionTypes.VIEW]:
                          onActionClickDelegati[CRUDActionTypes.VIEW],
                      }
                    : onActionClickDelegati,
              })
            ) || [],
        },
        {
          title: 'Sedi',
          items:
            authorityInfo?.sediGestoreProgetto?.map(
              (sedi: { [key: string]: string }) => ({
                ...sedi,
                actions:
                  authorityInfo?.dettagliInfoEnte?.statoEnte ===
                    entityStatus.TERMINATO && sedi.associatoAUtente
                    ? {
                        [CRUDActionTypes.VIEW]:
                          onActionClickSede[CRUDActionTypes.VIEW],
                      }
                    : sedi.associatoAUtente
                    ? {
                        [CRUDActionTypes.VIEW]:
                          onActionClickSede[CRUDActionTypes.VIEW],
                        [CRUDActionTypes.DELETE]:
                          sedi.stato !== entityStatus.ATTIVO
                            ? undefined
                            : hasUserPermission(['del.sede.gest.prgt'])
                            ? onActionClickSede[CRUDActionTypes.DELETE]
                            : undefined,
                      }
                    : {},
              })
            ) || [],
        },
      ]);
      setEmptySection(undefined);
    } else {
      setItemList(null);
      setCorrectButtons([]);
      setItemAccordionList([]);
      setCurrentForm(undefined);
      setCorrectModal(<ManageManagerAuthority creation />);
      setEmptySection(
        <EmptySection
          title={'Questa sezione è ancora vuota'}
          subtitle={'Per attivare il progetto aggiungi un Ente gestore'}
          buttons={
            hasUserPermission(['add.enti.gest.prgt'])
              ? EmptySectionButtons.slice(0, 1)
              : []
          }
        />
      );
    }
  };

  const PartnerAuthoritySection = () => {
    setCorrectModal(<ManagePartnerAuthority creation />);
    if (
      partnerAuthoritiesList?.filter(
        (entePartner: { associatoAUtente: boolean }) =>
          entePartner.associatoAUtente
      )?.length
    ) {
      setButtonsPosition('BOTTOM');
      setCurrentForm(undefined);
      setItemList({
        items: partnerAuthoritiesList
          .filter(
            (entePartner: { associatoAUtente: boolean }) =>
              entePartner.associatoAUtente
          )
          ?.map(
            (entePartner: {
              id: string;
              nome: string;
              referenti: string;
              stato: string;
            }) => ({
              ...entePartner,
              fullInfo: { ref: entePartner.referenti },
              actions:
                entePartner.stato !== entityStatus.ATTIVO ||
                projectDetails?.stato === entityStatus.TERMINATO
                  ? {
                      [CRUDActionTypes.VIEW]:
                        onActionClickEntiPartner[CRUDActionTypes.VIEW],
                    }
                  : {
                      [CRUDActionTypes.VIEW]:
                        onActionClickEntiPartner[CRUDActionTypes.VIEW],
                      [CRUDActionTypes.DELETE]: hasUserPermission([
                        'del.ente.partner',
                      ])
                        ? (td: TableRowI | string) => {
                            dispatch(
                              openModal({
                                id: 'delete-entity',
                                payload: {
                                  entity: 'partner-authority',
                                  authorityId: td,
                                  text: 'Confermi di volere disassociare questo Ente partner?',
                                },
                              })
                            );
                            // projectId && removeAuthorityPartner(td as string, projectId);
                          }
                        : undefined,
                    },
            })
          ),
      });
      setItemAccordionList(null);
      setCorrectButtons(
        hasUserPermission(['add.ente.partner']) &&
          projectDetails?.stato !== entityStatus.TERMINATO
          ? partnerAuthorityButtons
          : []
      );
      setEmptySection(undefined);
    } else {
      setItemAccordionList(null);
      setCurrentForm(undefined);
      setItemList(null);
      setCorrectButtons([]);
      setEmptySection(
        <EmptySection
          title='Questa sezione è ancora vuota'
          withIcon
          icon='it-note'
          //subtitle='Per attivare il progetto aggiungi un Ente partner'
          buttons={
            hasUserPermission(['add.ente.partner']) &&
            projectDetails?.stato !== entityStatus.TERMINATO
              ? partnerAuthorityButtons
              : []
          }
        />
      );
    }
  };

  const HeadquartersSection = () => {
    if (headquarterList?.length) {
      setButtonsPosition('BOTTOM');
      setCurrentForm(undefined);
      setCorrectModal(<ManageHeadquarter creation />);
      setItemList({
        items: headquarterList?.map(
          (sede: {
            id: string;
            nome: string;
            stato: string;
            enteDiRiferimento: string;
            identeDiRiferimento?: string | number;
            nrFacilitatori: number;
            serviziErogati: string;
            associatoAUtente: boolean;
          }) => ({
            ...sede,
            fullInfo: {
              ente_ref: sede.enteDiRiferimento,
              nFacilitatori: sede.nrFacilitatori,
              serviziErogati: sede.serviziErogati,
            },
            actions: sede.associatoAUtente
              ? {
                  [CRUDActionTypes.VIEW]: (td: TableRowI | string) => {
                    if (entityId && projectId) {
                      navigate(
                        `/area-amministrativa/programmi/${entityId}/progetti/${projectId}/${sede?.identeDiRiferimento}/sedi/${td}`
                      );
                    } else {
                      projectId &&
                        navigate(
                          `/area-amministrativa/progetti/${projectId}/${sede?.identeDiRiferimento}/sedi/${td}`
                        );
                    }
                  },
                }
              : undefined,
          })
        ),
      });
      setItemAccordionList(null);
      setCorrectButtons([
        // {
        //   size: 'xs',
        //   outline: true,
        //   color: 'primary',
        //   text: ' Aggiungi sede',
        //   onClick: () =>
        //     dispatch(
        //       openModal({
        //         id: formTypes.SEDE,
        //         payload: { title: 'Sede' },
        //       })
        //     ),
        // },
      ]);
      setEmptySection(undefined);
    } else {
      setItemAccordionList(null);
      setCurrentForm(undefined);
      setItemList(null);
      setCorrectButtons([]);
      setEmptySection(
        <EmptySection
          title='Non sono presenti sedi associate'
          withIcon
          icon='it-note'
          subtitle='Per attivare il progetto aggiungi una sede all’ente gestore o ad un ente partner'
          // buttons={EmptySectionButtons.slice(2)}
        />
      );
    }
  };

  const replaceLastUrlSection = (tab: string): string => {
    const { pathname } = location;
    const splitLocation = pathname.split('/');
    splitLocation[splitLocation?.length - 1] = tab;
    return splitLocation.join('/');
  };

  const nav = (
    <Nav tabs className='mb-5 overflow-hidden'>
      <li ref={infoRef}>
        <NavLink
          to={replaceLastUrlSection(tabs.INFO)}
          // onClick={() => replaceLastUrlSection(tabs.INFO)}
          active={activeTab === tabs.INFO}
        >
          Informazioni generali
        </NavLink>
      </li>
      <li ref={gestoreRef}>
        <NavLink
          to={replaceLastUrlSection(tabs.ENTE_GESTORE)}
          active={activeTab === tabs.ENTE_GESTORE}
          enteGestore={!managingAuthorityID}
        >
          {!managingAuthorityID ? (
            <div id='tab-ente-gestore-progetto'>
              * Ente gestore
              <Tooltip
                placement='bottom'
                target='tab-ente-gestore-progetto'
                isOpen={openOne}
                toggle={() => toggleOne(!openOne)}
              >
                Compilazione obbligatoria
              </Tooltip>
              <Icon icon='it-warning-circle' size='xs' />
            </div>
          ) : (
            'Ente gestore'
          )}
        </NavLink>
      </li>
      <li ref={partnerRef}>
        <NavLink
          to={replaceLastUrlSection(tabs.ENTI_PARTNER)}
          active={activeTab === tabs.ENTI_PARTNER}
        >
          <span> Enti partner </span>
        </NavLink>
      </li>
      <li ref={sediRef}>
        <NavLink
          to={replaceLastUrlSection(tabs.SEDI)}
          active={activeTab === tabs.SEDI}
        >
          <span> Sedi </span>
        </NavLink>
      </li>
    </Nav>
  );

  const terminateAuthorityPartner = async (
    authorityId: string,
    projectId: string
  ) => {
    await dispatch(TerminatePartnerAuthority(authorityId, projectId));
    dispatch(closeModal());
    dispatch(GetProjectDetail(projectId));
  };

  const removeManagerAuthority = async (
    authorityId: string,
    projectId: string
  ) => {
    await dispatch(RemoveManagerAuthority(authorityId, projectId, 'progetto'));
    await dispatch(GetProjectDetail(projectId));
    dispatch(closeModal());
  };

  const projectActivation = async () => {
    await dispatch(ActivateProject(projectDetails?.id));
    dispatch(GetProjectDetail(projectDetails?.id));
  };

  const onActionClickEntiPartner: CRUDActionsI = {
    [CRUDActionTypes.VIEW]: (td: TableRowI | string) => {
      if (entityId && projectId) {
        navigate(
          `/area-amministrativa/programmi/${entityId}/progetti/${projectId}/enti-partner/${td}`
        );
      } else {
        projectId &&
          navigate(
            `/area-amministrativa/progetti/${projectId}/enti-partner/${td}`
          );
      }
    },
  };

  const onActionClickSede: CRUDActionsI = {
    [CRUDActionTypes.VIEW]: (td: TableRowI | string) => {
      if (entityId && projectId && managingAuthorityID) {
        navigate(
          `/area-amministrativa/programmi/${entityId}/progetti/${projectId}/ente-gestore-progetto/${managingAuthorityID}/sedi/${td}`
        );
      } else {
        projectId &&
          managingAuthorityID &&
          navigate(
            `/area-amministrativa/progetti/${projectId}/ente-gestore-progetto/${managingAuthorityID}/sedi/${td}`
          );
      }
    },
    [CRUDActionTypes.DELETE]: (td: TableRowI | string) => {
      dispatch(
        openModal({
          id: 'delete-entity',
          payload: {
            entity: 'headquarter',
            text: 'Confermi di volere disassociare questa sede?',
            headquarterId: td,
          },
        })
      );
    },
  };

  useEffect(() => {
    scrollTo(0, 0);
    centerActiveItem();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const projectInfoButtons = () => {
    let formButtons: ButtonInButtonsBar[] = [];

    switch (projectDetails?.stato) {
      case 'ATTIVO':
        formButtons = hasUserPermission(['upd.car.prgt', 'term.prgt'])
          ? [
              {
                size: 'xs',
                color: 'danger',
                outline: true,
                text: 'Termina progetto',
                onClick: () => dispatch(openModal({ id: 'terminate-entity' })),
              },
              {
                size: 'xs',
                color: 'primary',
                text: 'Modifica',
                onClick: () =>
                  dispatch(
                    openModal({
                      id: formTypes.PROGETTO,
                      payload: { title: 'Modifica progetto' },
                    })
                  ),
              },
            ]
          : hasUserPermission(['upd.car.prgt'])
          ? [
              {
                size: 'xs',
                color: 'primary',
                text: 'Modifica',
                onClick: () =>
                  dispatch(
                    openModal({
                      id: formTypes.PROGETTO,
                      payload: { title: 'Modifica progetto' },
                    })
                  ),
              },
            ]
          : hasUserPermission(['term.prgt'])
          ? [
              {
                size: 'xs',
                color: 'danger',
                outline: true,
                text: 'Termina progetto',
                onClick: () =>
                  dispatch(
                    openModal({
                      id: 'terminate-entity',
                      payload: {
                        entity: 'project',
                        text: 'Confermi di voler terminare il Progetto?',
                      },
                    })
                  ),
              },
            ]
          : [];
        break;
      case 'NON ATTIVO':
        formButtons = hasUserPermission(['del.prgt', 'upd.car.prgt'])
          ? [
              {
                size: 'xs',
                outline: true,
                buttonClass: 'btn-secondary',
                color: 'primary',
                text: 'Elimina',
                onClick: () =>
                  dispatch(
                    openModal({
                      id: 'delete-entity',
                      payload: {
                        entity: 'project',
                        text: 'Confermi di volere eliminare questo progetto?',
                      },
                    })
                  ),
              },
              {
                size: 'xs',
                color: 'primary',
                text: 'Modifica',
                onClick: () =>
                  dispatch(
                    openModal({
                      id: formTypes.PROGETTO,
                      payload: { title: 'Modifica progetto' },
                    })
                  ),
              },
            ]
          : hasUserPermission(['upd.car.prgt'])
          ? [
              {
                size: 'xs',
                color: 'primary',
                text: 'Modifica',
                onClick: () =>
                  dispatch(
                    openModal({
                      id: formTypes.PROGETTO,
                      payload: { title: 'Modifica progetto' },
                    })
                  ),
              },
            ]
          : hasUserPermission(['del.prgt'])
          ? [
              {
                size: 'xs',
                outline: true,
                color: 'primary',
                buttonClass: 'btn-secondary',
                text: 'Elimina',
                onClick: () =>
                  dispatch(
                    openModal({
                      id: 'delete-entity',
                      payload: {
                        entity: 'project',
                        text: 'Confermi di volere eliminare questo progetto?',
                      },
                    })
                  ),
              },
            ]
          : [];
        break;
      case 'ATTIVABILE':
        formButtons = hasUserPermission(['act.prgt', 'upd.car.prgt'])
          ? [
              {
                size: 'xs',
                outline: true,
                color: 'primary',
                buttonClass: 'btn-secondary',
                text: 'Attiva',
                onClick: () => projectActivation(),
              },
              {
                size: 'xs',
                color: 'primary',
                text: 'Modifica',
                onClick: () =>
                  dispatch(
                    openModal({
                      id: formTypes.PROGETTO,
                      payload: { title: 'Modifica progetto' },
                    })
                  ),
              },
            ]
          : hasUserPermission(['upd.car.prgt'])
          ? [
              {
                size: 'xs',
                color: 'primary',
                text: 'Modifica',
                onClick: () =>
                  dispatch(
                    openModal({
                      id: formTypes.PROGETTO,
                      payload: { title: 'Modifica progetto' },
                    })
                  ),
              },
            ]
          : hasUserPermission(['act.prgt'])
          ? [
              {
                size: 'xs',
                outline: true,
                buttonClass: 'btn-secondary',
                color: 'primary',
                text: 'Attiva',
                onClick: () => projectActivation(),
              },
            ]
          : [];

        break;
      case 'TERMINATO':
      default:
        break;
    }
    return formButtons;
  };

  useEffect(() => {
    switch (activeTab) {
      case tabs.INFO:
        setButtonsPosition('BOTTOM');
        setCurrentForm(<ProjectAccordionForm />);
        setCorrectModal(<ManageProject />);
        setItemAccordionList([]);
        setItemList(null);
        setCorrectButtons(projectInfoButtons());
        setEmptySection(undefined);
        break;
      case tabs.ENTE_GESTORE:
        AuthoritySection();
        break;
      case tabs.ENTI_PARTNER:
        PartnerAuthoritySection();
        break;
      case tabs.SEDI:
        HeadquartersSection();
        break;
      default:
        return;
    }
  }, [
    activeTab,
    mediaIsDesktop,
    projectDetails,
    authorityInfo,
    partnerAuthoritiesList,
  ]);

  const terminateProject = async (
    projectId: string,
    terminationDate: string
  ) => {
    const res = await dispatch(
      TerminateEntity(projectId, 'progetto', terminationDate)
    );
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (res) {
      dispatch(GetProjectDetail(projectId));
      dispatch(closeModal());
    }
  };

  const removeReferentDelegate = async (
    cf: string,
    role: UserAuthorityRole
  ) => {
    if (projectId && managingAuthorityID) {
      await dispatch(
        RemoveReferentDelegate(managingAuthorityID, projectId, cf, role)
      );
      dispatch(GetAuthorityManagerDetail(projectId, 'progetto'));
    }
    dispatch(closeModal());
  };

  const removeHeadquarter = async (headquarterId: string) => {
    if (projectId && managingAuthorityID) {
      await dispatch(
        RemoveAuthorityHeadquarter(
          managingAuthorityID,
          headquarterId,
          projectId
        )
      );

      dispatch(GetAuthorityManagerDetail(projectId, 'progetto'));
    }

    dispatch(closeModal());
  };

  const getAccordionCTA = (title?: string) => {
    switch (title) {
      case 'Referenti':
      case 'Delegati':
        return authorityInfo?.dettagliInfoEnte?.statoEnte !==
          entityStatus.TERMINATO && hasUserPermission(['add.ref_del.gest.prgt'])
          ? {
              cta: `Aggiungi ${title}`,
              ctaAction: () =>
                dispatch(
                  openModal({
                    id:
                      title === 'Referenti'
                        ? formTypes.REFERENTE
                        : formTypes.DELEGATO,
                    payload: {
                      title: `Aggiungi ${title}`,
                    },
                  })
                ),
            }
          : {
              cta: null,
              ctaAction: () => ({}),
            };
      case 'Sedi':
        return authorityInfo?.dettagliInfoEnte?.statoEnte !==
          entityStatus.TERMINATO && hasUserPermission(['add.sede.gest.prgt'])
          ? {
              cta: `Aggiungi Sede`,
              ctaAction: () =>
                dispatch(
                  openModal({
                    id: formTypes.SEDE,
                    payload: {
                      title: `Aggiungi Sede`,
                    },
                  })
                ),
            }
          : {
              cta: null,
              ctaAction: () => ({}),
            };
      default:
        return {
          cta: null,
          ctaAction: () => ({}),
        };
    }
  };

  const handleEnteUploadEsito = (esito: { list: any[] }) => {
    const { list = [] } = esito;
    const table = newTable(
      EntePartnerTableHeading,
      list.map((td: any) => ({
        nome: td.nomeBreve || td.nome,
        codiceFiscale: td.piva || td.codiceFiscale,
        esito: (td.esito || '').toUpperCase().includes('OK')
          ? 'Riuscito'
          : 'Fallito',
        failedCSV: td.esito.toUpperCase().includes('KO'),
        onTooltipInfo: td.esito,
      }))
    );
    setEntePartnerTable(table);
  };

  // const onConfirmDeleteEntityModal = async (payload: {[key: string]: string | UserAuthorityRole}) => {
  //   if (payload?.entity === 'referent-delegate')
  //     removeReferentDelegate(payload?.cf, payload?.role);
  //   if (payload?.entity === 'headquarter')
  //     removeHeadquarter(payload?.headquarterId);
  //   if (payload?.entity === 'partner-authority')
  //     projectId && removeAuthorityPartner(payload?.authorityId, projectId);
  //   if (payload?.entity === 'authority')
  //     projectId &&
  //       managerAuthority &&
  //       managerAuthority?.id &&
  //       removeManagerAuthority(managerAuthority.id, projectId);
  //   if (payload?.entity === 'project' && projectId) {
  //     await dispatch(DeleteEntity('progetto', projectId));
  //     navigate(-1);
  //   }
  // };

  return (
    <div
      className={clsx(
        mediaIsPhone && 'mt-5',
        'd-flex',
        'flex-row',
        'container'
      )}
    >
      <div className='d-flex flex-column w-100 container'>
        <div>
          <DetailLayout
            nav={nav}
            titleInfo={{
              title: projectDetails?.nome,
              status: projectDetails?.stato,
              upperTitle: { icon: 'it-user', text: 'Progetto' },
              subTitle: programDetails?.nomeBreve,
            }}
            currentTab={activeTab}
            formButtons={correctButtons}
            // itemsAccordionList={itemAccordionList}
            itemsList={itemList}
            buttonsPosition={buttonsPosition}
            goBackPath='/area-amministrativa/progetti'
            goBackTitle={
              location.pathname.includes(
                `/area-amministrativa/progetti/${projectId}`
              )
                ? 'Elenco progetti'
                : 'Torna indietro'
            }
            showGoBack={
              userRole !== userRoles.REGP &&
              userRole !== userRoles.DEGP &&
              userRole !== userRoles.FAC &&
              userRole !== userRoles.VOL
            }
          >
            <>
              {currentForm}
              {emptySection}
            </>
          </DetailLayout>
          {itemAccordionList?.length
            ? itemAccordionList?.map((item, index) => (
                <Accordion
                  key={index}
                  title={item.title || ''}
                  totElem={item.items.length}
                  cta={getAccordionCTA(item.title).cta}
                  onClickCta={getAccordionCTA(item.title)?.ctaAction}
                  lastBottom={index === itemAccordionList.length - 1}
                  detailAccordion
                >
                  {item.items?.length ? (
                    item.items.map((cardItem) => (
                      <CardStatusAction
                        key={cardItem.id}
                        title={`${cardItem.cognome ? cardItem.cognome : ''} ${
                          cardItem.nome
                        }`.trim()}
                        status={cardItem.stato}
                        id={cardItem.id}
                        fullInfo={cardItem.fullInfo}
                        cf={cardItem.codiceFiscale}
                        onActionClick={cardItem.actions}
                      />
                    ))
                  ) : (
                    <EmptySection
                      title={`Non sono presenti ${item.title?.toLowerCase()} ${
                        item.title?.toLowerCase() === 'sedi'
                          ? `associate.`
                          : `associati.`
                      }`}
                      horizontal
                      aside
                    />
                  )}
                </Accordion>
              ))
            : null}
          {activeTab === tabs.INFO && !entityId && programDetails?.id ? (
            <div className={clsx('my-5')}>
              <h5 className={clsx('mb-4')} style={{ color: '#5C6F82' }}>
                Programma associato
              </h5>
              <CardStatusAction
                id={programDetails?.id}
                status={programDetails?.stato}
                title={programDetails?.nomeBreve}
                onActionClick={{
                  [CRUDActionTypes.VIEW]: () =>
                    navigate(
                      `/area-amministrativa/programmi/${programDetails?.id}/info`,
                      { replace: true }
                    ),
                }}
              />
            </div>
          ) : null}
          {currentModal ? currentModal : null}
          <TerminateEntityModal
            minDate={projectDetails?.dataInizio?.toString()}
            onConfirm={(_entity: string, terminationDate: string) =>
              terminationDate &&
              projectId &&
              terminateProject(projectId, terminationDate)
            }
          />
          <DeleteEntityModal
            onClose={() => dispatch(closeModal())}
            onConfirm={async (payload) => {
              if (payload?.entity === 'referent-delegate')
                removeReferentDelegate(payload?.cf, payload?.role);
              if (payload?.entity === 'headquarter')
                removeHeadquarter(payload?.headquarterId);
              if (payload?.entity === 'partner-authority')
                projectId &&
                  terminateAuthorityPartner(payload?.authorityId, projectId);
              if (payload?.entity === 'authority')
                projectId &&
                  managerAuthority &&
                  managerAuthority?.id &&
                  removeManagerAuthority(managerAuthority.id, projectId);
              if (payload?.entity === 'project' && projectId) {
                await dispatch(DeleteEntity('progetto', projectId));
                navigate(-1);
              }
            }}
          />
          <UploadCSVModal
            accept='.csv'
            onClose={() => {
              if (projectId) dispatch(GetProjectDetail(projectId));
            }}
            onEsito={handleEnteUploadEsito}
            template={EntiPartnerTemplate}
            templateName='enti_partner-template.csv'
          >
            <Table
              {...entePartnerTable}
              withActions
              succesCSV
              id='table-ente-partner'
            />
          </UploadCSVModal>
          <ManageDelegate creation />
          <ManageReferal creation />
          <ManageHeadquarter creation />
        </div>
      </div>
    </div>
  );
};

export default ProjectsDetails;
