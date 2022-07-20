import React, { useEffect, useRef, useState } from 'react';
import { Icon, Nav } from 'design-react-kit';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { formTypes } from '../utils';
import {
  CRUDActionsI,
  CRUDActionTypes,
  ItemsListI,
} from '../../../../../utils/common';
import { TableRowI } from '../../../../../components/Table/table';
import { ButtonInButtonsBar } from '../../../../../components/ButtonsBar/buttonsBar';
import {
  closeModal,
  openModal,
} from '../../../../../redux/features/modal/modalSlice';
import { useDispatch } from 'react-redux';
import DetailLayout from '../../../../../components/DetailLayout/detailLayout';
import ConfirmDeleteModal from '../modals/confirmDeleteModal';
import ManageProject from '../modals/manageProject';
import ManageHeadquarter from '../../../../../components/AdministrativeArea/Entities/Headquarters/ManageHeadquarter/manageHeadquarter';
import { useAppSelector } from '../../../../../redux/hooks';
import {
  selectDevice,
  updateBreadcrumb,
} from '../../../../../redux/features/app/appSlice';
import clsx from 'clsx';
import {
  selectAuthorities,
  selectProjects,
} from '../../../../../redux/features/administrativeArea/administrativeAreaSlice';
import { EmptySection, NavLink } from '../../../../../components';
import ProjectAccordionForm from '../../../../forms/formProjects/ProjectAccordionForm/ProjectAccordionForm';
import FormAuthorities from '../../../../forms/formAuthorities';
import ManagePartnerAuthority from '../modals/managePartnerAuthority';
import {
  DeleteEntity,
  TerminateEntity,
} from '../../../../../redux/features/administrativeArea/administrativeAreaThunk';
import {
  GetAuthorityManagerDetail,
  RemovePartnerAuthority,
  RemoveReferentDelegate,
  UserAuthorityRole,
} from '../../../../../redux/features/administrativeArea/authorities/authoritiesThunk';
import {
  ActivateProject,
  GetProjectDetail,
} from '../../../../../redux/features/administrativeArea/projects/projectsThunk';
import TerminateEntityModal from '../../../../../components/AdministrativeArea/Entities/General/TerminateEntityModal/TerminateEntityModal';
import ManageDelegate from '../modals/manageDelegate';
import ManageReferal from '../modals/manageReferal';
import DeleteAuthorityModal from '../../../../../components/AdministrativeArea/Entities/General/DeleteAuthorityModal/DeleteAuthorityModal';
import ManageProjectManagerAuthority from '../modals/manageProjectManagerAuthority';
import DeleteReferentDelegateModal from '../../../../../components/AdministrativeArea/Entities/General/DeleteReferentDelegateModal/DeleteReferentDelegateModal';
import ManageManagerAuthority from '../modals/manageManagerAuthority';

const tabs = {
  INFO: 'info',
  ENTE_GESTORE: 'ente-gestore',
  ENTI_PARTNER: 'enti-partner',
  SEDI: 'sedi',
};

export const buttonsPositioning = {
  TOP: 'top',
  BOTTOM: 'bottom',
};

const ProjectsDetails = () => {
  const { mediaIsDesktop, mediaIsPhone } = useAppSelector(selectDevice);
  const project = useAppSelector(selectProjects).detail;
  const projectDetails = project.dettagliInfoProgetto;
  const managingAuthorityID = project.idEnteGestoreProgetto;
  const partnerAuthoritiesList = project.entiPartner;
  const headquarterList = project?.sedi;
  const authorityInfo = useAppSelector(selectAuthorities).detail;
  const [deleteText, setDeleteText] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>(tabs.INFO);
  const [currentForm, setCurrentForm] = useState<React.ReactElement>();
  const [currentModal, setCorrectModal] = useState<React.ReactElement>();
  const [emptySection, setEmptySection] = useState<React.ReactElement>();
  const [itemList, setItemList] = useState<ItemsListI | null>();
  const [itemAccordionList, setItemAccordionList] = useState<
    ItemsListI[] | null
  >();
  const [correctButtons, setCorrectButtons] = useState<ButtonInButtonsBar[]>(
    []
  );
  const [buttonsPosition, setButtonsPosition] = useState<'TOP' | 'BOTTOM'>(
    'TOP'
  );
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const gestoreRef = useRef<HTMLLIElement>(null);
  const partnerRef = useRef<HTMLLIElement>(null);
  const sediRef = useRef<HTMLLIElement>(null);
  const infoRef = useRef<HTMLLIElement>(null);
  const { entityId, projectId } = useParams();
  const shortName = project.detail?.dettaglioProgetto?.nomeBreve;
  const managerAuthority =
    useAppSelector(selectAuthorities).detail?.dettagliInfoEnte;

  useEffect(() => {
    if (projectId && shortName) {
      dispatch(
        updateBreadcrumb([
          {
            label: 'Area Amministrativa',
            url: '/area-amministrativa',
            link: false,
          },
          {
            label: 'Progetti',
            url: '/area-amministrativa/progetti',
            link: true,
          },
          {
            label: shortName,
            url: `/area-amministrativa/progetti/${projectId}`,
            link: false,
          },
        ])
      );
    }
  }, [projectId, shortName]);

  useEffect(() => {
    scrollTo(0, 0);
    centerActiveItem();
  }, [activeTab]);

  const getActionRedirectURL = (userType: string, userId: string) => {
    if (entityId) {
      return `/area-amministrativa/programmi/${entityId}/progetti/${projectId}/${userType}/${userId}`;
    }
    return `/area-amministrativa/progetti/${projectId}/${userType}/${userId}`;
  };

  const onActionClickReferenti: CRUDActionsI = {
    [CRUDActionTypes.VIEW]: (td: TableRowI | string) => {
      navigate(
        getActionRedirectURL(
          formTypes.REFERENTI,
          (typeof td === 'string' ? td : td.codiceFiscale).toString()
        )
      );
      /*`/area-amministrativa/${formTypes.REFERENTI}/${
          typeof td === 'string' ? td : td?.codiceFiscale
        }`
      );*/
    },
    [CRUDActionTypes.DELETE]: (td: TableRowI | string) => {
      // dispatch(RemoveReferentDelegate())
      console.log(td);
      dispatch(
        openModal({
          id: 'delete-referent-delegate',
          payload: {
            cf: '',
            role: 'REGP',
            text: 'Confermi di voler eliminare questo referente?',
          },
        })
      );
    },
  };

  const onActionClickDelegati: CRUDActionsI = {
    [CRUDActionTypes.VIEW]: (td: TableRowI | string) => {
      navigate(
        getActionRedirectURL(
          formTypes.DELEGATI,
          (typeof td === 'string' ? td : td.codiceFiscale).toString()
        )
      );
      /*`/area-amministrativa/${formTypes.DELEGATI}/${
          typeof td === 'string' ? td : td?.codiceFiscale
        }`
      );*/
    },
    [CRUDActionTypes.DELETE]: (td: TableRowI | string) => {
      console.log(td);
      dispatch(
        openModal({
          id: 'delete-referent-delegate',
          payload: {
            cf: '',
            role: 'DEGP',
            text: 'Confermi di voler eliminare questo delegato?',
          },
        })
      );
    },
  };

  const centerActiveItem = () => {
    switch (activeTab) {
      case tabs.INFO:
        infoRef.current?.scrollIntoView({ inline: 'center' });
        break;
      case tabs.ENTE_GESTORE:
        gestoreRef.current?.scrollIntoView({ inline: 'center' });
        break;
      case tabs.ENTI_PARTNER:
        partnerRef.current?.scrollIntoView({ inline: 'center' });
        break;
      case tabs.SEDI:
        sediRef.current?.scrollIntoView({ inline: 'center' });
        break;
      default:
        infoRef.current?.scrollIntoView({ inline: 'center' });
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
      iconForButton: 'it-download',
      iconColor: 'primary',
      outline: true,
      text: 'Carica lista enti partner',
      onClick: () => console.log('carica lista enti partner'),
    },
    {
      size: 'xs',
      color: 'primary',
      text: ' Aggiungi Ente partner',
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
      setButtonsPosition('TOP');
      setDeleteText('Confermi di voler eliminare questo gestore di progetto?');
      setCurrentForm(
        <FormAuthorities
          formDisabled
          enteType={formTypes.ENTE_GESTORE_PROGETTO}
        />
      );
      setCorrectModal(<ManageProjectManagerAuthority />);
      setItemList(null);
      setCorrectButtons([
        {
          size: 'xs',
          outline: true,
          color: 'primary',
          text: 'Elimina',
          onClick: () => dispatch(openModal({ id: 'confirmDeleteModal' })),
        },
        {
          size: 'xs',
          color: 'primary',
          text: 'Modifica',
          onClick: () =>
            dispatch(
              openModal({
                id: 'ente-gestore-progetto',
                payload: { title: 'Modifica ente gestore progetto' },
              })
            ),
        },
      ]);
      setItemAccordionList([
        {
          title: 'Referenti',
          items:
            authorityInfo?.referentiEnteGestore?.map(
              (ref: { [key: string]: string }) => ({
                // TODO: check when BE add codiceFiscale
                ...ref,
                actions: onActionClickReferenti,
              })
            ) || [],
        },
        {
          title: 'Delegati',
          items:
            authorityInfo?.delegatiEnteGestore?.map(
              (del: { [key: string]: string }) => ({
                // TODO: check when BE add codiceFiscale
                ...del,
                actions: onActionClickDelegati,
              })
            ) || [],
        },
        {
          title: 'Sedi',
          items:
            authorityInfo?.sediGestoreProgetto?.map(
              (sedi: { [key: string]: string }) => ({
                ...sedi,
              })
            ) || [],
        },
      ]);
      setEmptySection(undefined);
    } else {
      setItemList(null);
      setCorrectButtons([]);
      setCurrentForm(undefined);
      setCorrectModal(<ManageProjectManagerAuthority creation />);
      setEmptySection(
        <EmptySection
          title={'Questa sezione è ancora vuota'}
          subtitle={'Per attivare il progetto aggiungi un Ente gestore'}
          buttons={EmptySectionButtons.slice(0, 1)}
        />
      );
    }
  };

  const PartnerAuthoritySection = () => {
    setCorrectModal(<ManagePartnerAuthority creation />);
    if (partnerAuthoritiesList?.length) {
      setButtonsPosition('BOTTOM');
      setCurrentForm(undefined);
      setItemList({
        items: partnerAuthoritiesList?.map(
          (entePartner: {
            id: string;
            nome: string;
            referenti: string;
            stato: string;
          }) => ({
            ...entePartner,
            fullInfo: { ref: entePartner.referenti },
            actions: onActionClickEntiPartner,
          })
        ),
      });
      setItemAccordionList(null);
      setCorrectButtons(partnerAuthorityButtons);
      setEmptySection(undefined);
    } else {
      setItemAccordionList(null);
      setCurrentForm(undefined);
      setItemList(null);
      setCorrectButtons([]);
      setEmptySection(
        <EmptySection
          title={'Questa sezione è ancora vuota'}
          withIcon
          icon='it-note'
          subtitle={'Per attivare il progetto aggiungi un Ente partner'}
          buttons={partnerAuthorityButtons}
        />
      );
    }
  };

  const HeadquartersSection = () => {
    if (headquarterList?.length) {
      setButtonsPosition('TOP');
      setCurrentForm(undefined);
      setCorrectModal(<ManageHeadquarter creation />);
      setItemList({
        items: headquarterList?.map(
          (sede: {
            id: string;
            nome: string;
            stato: string;
            enteDiRiferimento: string;
            nrFacilitatori: number;
            serviziErogati: string;
          }) => ({
            ...sede,
            fullInfo: {
              ente_ref: sede.enteDiRiferimento,
              nFacilitatori: sede.nrFacilitatori,
              serviziErogati: sede.serviziErogati,
            },
            actions: onActionClickSede,
          })
        ),
      });
      setItemAccordionList(null);
      setCorrectButtons([
        {
          size: 'xs',
          outline: true,
          color: 'primary',
          text: ' Aggiungi sede',
          onClick: () =>
            dispatch(
              openModal({
                id: formTypes.SEDE,
                payload: { title: 'Sede' },
              })
            ),
        },
      ]);
      setEmptySection(undefined);
    } else {
      setItemAccordionList(null);
      setCurrentForm(undefined);
      setItemList(null);
      setCorrectButtons([]);
      setEmptySection(
        <EmptySection
          title={'Questa sezione è ancora vuota'}
          withIcon
          icon='it-note'
          subtitle={'Per attivare il progetto aggiungi una Sede'}
          buttons={EmptySectionButtons.slice(2)}
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
        >
          {!managingAuthorityID ? (
            <div>
              <span className='mr-1'> * Ente gestore </span>
              <Icon icon='it-warning-circle' size='sm' />
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
          {!partnerAuthoritiesList?.length ? (
            <div>
              <span className='mr-1'> * Enti Partner </span>
              <Icon icon='it-warning-circle' size='sm' />
            </div>
          ) : (
            'Enti Partner'
          )}
        </NavLink>
      </li>
      <li ref={sediRef}>
        <NavLink
          to={replaceLastUrlSection(tabs.SEDI)}
          active={activeTab === tabs.SEDI}
        >
          {!headquarterList?.length ? (
            <div>
              <span className='mr-1'> * Sedi </span>
              <Icon icon='it-warning-circle' size='sm' />
            </div>
          ) : (
            'Sedi'
          )}
        </NavLink>
      </li>
    </Nav>
  );

  const removeAuthorityPartner = async (
    authorityId: string,
    projectId: string
  ) => {
    await dispatch(RemovePartnerAuthority(authorityId, projectId));
    dispatch(closeModal());
    dispatch(GetProjectDetail(projectId));
  };

  const removeManagerAuthority = async (
    authorityId: string,
    projectId: string
  ) => {
    await dispatch(
      removeManagerAuthority(authorityId, projectId /* , 'progetto' */)
    );
    await dispatch(GetAuthorityManagerDetail(projectId, 'progetto'));
  };

  const projectActivation = async () => {
    await dispatch(ActivateProject(projectDetails?.id));
    dispatch(GetProjectDetail(projectDetails?.id));
  };

  const onActionClickEntiPartner: CRUDActionsI = {
    [CRUDActionTypes.VIEW]: (td: TableRowI | string) => {
      projectId &&
        navigate(`/area-amministrativa/progetti/${projectId}/enti/${td}`);
    },
    [CRUDActionTypes.DELETE]: (td: TableRowI | string) => {
      dispatch(
        openModal({
          id: 'delete-authority',
          payload: {
            authorityId: td,
          },
        })
      );
      // projectId && removeAuthorityPartner(td as string, projectId);
    },
  };

  const onActionClickSede: CRUDActionsI = {
    [CRUDActionTypes.VIEW]: (td: TableRowI | string) => {
      navigate(`/area-amministrativa/sedi/${td}`);
    },
    [CRUDActionTypes.DELETE]: (td: TableRowI | string) => {
      console.log(td);
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
        formButtons = [
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
        ];
        break;
      case 'NON ATTIVO':
        formButtons = [
          {
            size: 'xs',
            outline: true,
            color: 'primary',
            text: 'Elimina',
            onClick: () => dispatch(openModal({ id: 'confirmDeleteModal' })),
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
        ];
        break;
      case 'ATTIVABILE':
        formButtons = [
          {
            size: 'xs',
            outline: true,
            color: 'primary',
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
        ];
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
        setButtonsPosition('TOP');
        setCurrentForm(<ProjectAccordionForm />);
        setCorrectModal(<ManageProject />);
        setDeleteText('Confermi di voler eliminare questo programma?');
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
    await dispatch(TerminateEntity(projectId, 'progetto', terminationDate));
    dispatch(closeModal());
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

  return (
    <div className={clsx(mediaIsPhone && 'mt-5', 'd-flex', 'flex-row')}>
      <div className='d-flex flex-column w-100'>
        <div>
          <DetailLayout
            nav={nav}
            titleInfo={{
              title: projectDetails?.nome,
              status: projectDetails?.stato,
              upperTitle: { icon: 'it-user', text: 'Progetto' },
              subTitle: projectDetails?.nomeBreve,
            }}
            currentTab={activeTab}
            formButtons={correctButtons}
            itemsAccordionList={itemAccordionList}
            itemsList={itemList}
            buttonsPosition={buttonsPosition}
            goBackTitle='Elenco progetti'
            goBackPath='/area-amministrativa/progetti'
          >
            <>
              {currentForm}
              {emptySection}
            </>
          </DetailLayout>
          {currentModal ? currentModal : null}
          <ConfirmDeleteModal
            onConfirm={() => {
              switch (activeTab) {
                case tabs.INFO:
                  projectId && dispatch(DeleteEntity('progetto', projectId));
                  break;
                case tabs.ENTE_GESTORE:
                  projectId &&
                    managerAuthority &&
                    managerAuthority?.id &&
                    removeManagerAuthority(managerAuthority.id, projectId);
                  break;
                default:
                  break;
              }

              dispatch(closeModal());
            }}
            onClose={() => {
              dispatch(closeModal());
            }}
            text={deleteText}
          />
          <TerminateEntityModal
            text='Confermi di voler terminare il Progetto?'
            onClose={() => dispatch(closeModal())}
            onConfirm={(terminationDate: string) =>
              terminationDate &&
              projectId &&
              terminateProject(projectId, terminationDate)
            }
          />
          <DeleteAuthorityModal
            text="Confermi di voler eliminare l'ente partner"
            onClose={() => dispatch(closeModal())}
            onConfirm={(id: string) =>
              projectId && removeAuthorityPartner(id, projectId)
            }
          />
          <DeleteReferentDelegateModal
            onClose={() => dispatch(closeModal())}
            onConfirm={(cf: string, role: UserAuthorityRole) =>
              removeReferentDelegate(cf, role)
            }
          />
          <ManageDelegate />
          <ManageReferal />
          <ManageHeadquarter />
          <ManageManagerAuthority />
        </div>
      </div>
    </div>
  );
};

export default ProjectsDetails;
