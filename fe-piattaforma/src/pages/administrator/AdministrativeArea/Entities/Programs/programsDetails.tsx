import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Icon, Nav, Tooltip } from 'design-react-kit';
import {
  closeModal,
  openModal,
} from '../../../../../redux/features/modal/modalSlice';
import { useDispatch } from 'react-redux';

import { ButtonInButtonsBar } from '../../../../../components/ButtonsBar/buttonsBar';
import { entityStatus, formTypes } from '../utils';
import {
  CRUDActionsI,
  CRUDActionTypes,
  ItemListElemI,
  ItemsListI,
} from '../../../../../utils/common';
import { TableRowI } from '../../../../../components/Table/table';
import DetailLayout from '../../../../../components/DetailLayout/detailLayout';
import ManageProgram from '../modals/manageProgram';
import ManageManagerAuthority from '../modals/manageManagerAuthority';
import { useAppSelector } from '../../../../../redux/hooks';
import {
  selectDevice,
  setInfoIdsBreadcrumb,
} from '../../../../../redux/features/app/appSlice';
import {
  selectAuthorities,
  selectPrograms,
  selectSurveys,
} from '../../../../../redux/features/administrativeArea/administrativeAreaSlice';
import {
  Accordion,
  CardStatusAction,
  EmptySection,
  NavLink,
} from '../../../../../components';
import ProgramlInfoAccordionForm from '../../../../forms/formPrograms/ProgramAccordionForm/ProgramInfoAccordionForm';
import FormAuthorities from '../../../../forms/formAuthorities';
import ManageDelegate from '../modals/manageDelegate';
import ManageReferal from '../modals/manageReferal';
import ManageProject from '../modals/manageProject';
import {
  DeleteEntity,
  TerminateEntity,
} from '../../../../../redux/features/administrativeArea/administrativeAreaThunk';
import {
  GetProgramDetail,
  UpdateProgramSurveyDefault,
} from '../../../../../redux/features/administrativeArea/programs/programsThunk';
import PreviewSurvey from '../modals/previewSurvey';
import {
  GetAuthorityManagerDetail,
  RemoveManagerAuthority,
  RemoveReferentDelegate,
  UserAuthorityRole,
} from '../../../../../redux/features/administrativeArea/authorities/authoritiesThunk';
import TerminateEntityModal from '../../../../../components/AdministrativeArea/Entities/General/TerminateEntityModal/TerminateEntityModal';
import DeleteEntityModal from '../../../../../components/AdministrativeArea/Entities/General/DeleteEntityModal/DeleteEntityModal';
import useGuard from '../../../../../hooks/guard';
import { formFieldI } from '../../../../../utils/formHelper';
import { GetSurveyAllLight } from '../../../../../redux/features/administrativeArea/surveys/surveysThunk';
import clsx from 'clsx';
import { roles } from '../Users/usersDetails';

const tabs = {
  INFO: 'info',
  ENTE: 'ente-gestore-programma',
  QUESTIONARI: 'questionari',
  PROGETTI: 'progetti',
};

const ProgramsDetails: React.FC = () => {
  const { hasUserPermission } = useGuard();
  const program = useAppSelector(selectPrograms).detail;
  const surveyList = program?.questionari;
  const otherSurveyList = useAppSelector(selectSurveys);
  const projectsList = program?.progetti;
  const authorityInfo = useAppSelector(selectAuthorities)?.detail;
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState<string>(tabs.INFO);
  const [currentForm, setCurrentForm] = useState<React.ReactElement>();
  const [emptySection, setEmptySection] = useState<React.ReactElement>();
  const [currentModal, setCorrectModal] = useState<React.ReactElement>();
  const [itemList, setItemList] = useState<ItemsListI | null>();
  const [itemAccordionList, setItemAccordionList] = useState<
    ItemsListI[] | null
  >();
  const [openOne, toggleOne] = useState(false);

  const [edit, setEdit] = useState<boolean>(false);
  const [correctButtons, setCorrectButtons] = useState<ButtonInButtonsBar[]>(
    []
  );
  const [buttonsPosition, setButtonsPosition] = useState<'TOP' | 'BOTTOM'>(
    'TOP'
  );
  const navigate = useNavigate();
  const location = useLocation();
  const [surveyDefault, setSurveyDefault] = useState<ItemsListI | undefined>(
    undefined
  );
  const [radioButtonsSurveys, setRadioButtonsSurveys] =
    useState<boolean>(false);
  const [changeSurveyButtonVisible, setChangeSurveyButtonVisible] = useState<
    boolean | undefined
  >(true);
  const [surveyPreviewId, setSurveyPreviewId] = useState<string>('');
  const [newSurveyDefaultId, setNewSurveyDefaultId] = useState<string>('');
  const device = useAppSelector(selectDevice);

  /**
   * The entity id is passed to the breadcrumb but it maybe the case to
   * pass the entity short name, we can access it to the store even if the
   * thunk action to get details is performed in the form component
   */
  const { entityId } = useParams();

  const programDetails =
    useAppSelector(selectPrograms).detail?.dettagliInfoProgramma || {};

  const managerAuthorityId =
    useAppSelector(selectPrograms).detail?.idEnteGestoreProgramma;

  const managerAuthority =
    useAppSelector(selectAuthorities).detail?.dettagliInfoEnte;

  useEffect(() => {
    // For breadcrumb
    if (location.pathname === `/area-amministrativa/programmi/${entityId}`) {
      navigate(`/area-amministrativa/programmi/${entityId}/info`);
    }
  }, []);

  useEffect(() => {
    if (entityId) dispatch(GetProgramDetail(entityId));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entityId]);

  useEffect(() => {
    // For breadcrumb
    if (entityId && programDetails?.nomeBreve) {
      dispatch(
        setInfoIdsBreadcrumb({ id: entityId, nome: programDetails?.nomeBreve })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entityId, programDetails]);

  const getActionRedirectURL = (userType: string, userId: string) => {
    return `/area-amministrativa/programmi/${entityId}/ente-gestore-programma/${managerAuthorityId}/${userType}/${userId}`;
  };

  const onActionClickReferenti: CRUDActionsI = hasUserPermission([
    'del.ref_del.gest.prgm',
  ])
    ? {
        [CRUDActionTypes.VIEW]: (td: TableRowI | string) => {
          navigate(
            getActionRedirectURL(
              roles.REG,
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
                role: 'REG',
                text: 'Confermi di voler eliminare questo referente?',
              },
            })
          );
        },
      }
    : {
        [CRUDActionTypes.VIEW]: (td: TableRowI | string) => {
          navigate(
            getActionRedirectURL(
              roles.REG,
              (typeof td === 'string' ? td : td.id).toString()
            )
          );
        },
      };

  const onActionClickDelegati: CRUDActionsI = hasUserPermission([
    'del.ref_del.gest.prgm',
  ])
    ? {
        [CRUDActionTypes.VIEW]: (td: TableRowI | string) => {
          navigate(
            getActionRedirectURL(
              roles.DEG,
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
                role: 'DEG',
                text: 'Confermi di voler eliminare questo delegato?',
              },
            })
          );
        },
      }
    : {
        [CRUDActionTypes.VIEW]: (td: TableRowI | string) => {
          navigate(
            getActionRedirectURL(
              roles.DEG,
              (typeof td === 'string' ? td : td.id).toString()
            )
          );
        },
      };

  const onActionClickQuestionariView: CRUDActionsI = {
    [CRUDActionTypes.VIEW]: (td: TableRowI | string) => {
      navigate(`${td}`);
    },
  };
  const onActionClickQuestionariPreview: CRUDActionsI = {
    [CRUDActionTypes.PREVIEW]: (td: TableRowI | string) => {
      if (typeof td === 'string') {
        setSurveyPreviewId(td);
        setNewSurveyDefaultId(td);
      }
      dispatch(
        openModal({
          id: 'previewSurveyModal',
          payload: {
            title: `Visualizza questionario`,
          },
        })
      );
    },
  };

  const onActionClickProgetti: CRUDActionsI = hasUserPermission(['del.prgt'])
    ? {
        [CRUDActionTypes.VIEW]: (td: TableRowI | string) => {
          navigate(`${td}/info`);
        },
        [CRUDActionTypes.DELETE]: (td: TableRowI | string) => {
          dispatch(
            openModal({
              id: 'terminate-entity',
              payload: {
                entity: 'project',
                projectId: td,
                text: 'Confermi di volere terminare il Progetto?',
              },
            })
          );
        },
      }
    : {
        [CRUDActionTypes.VIEW]: (td: TableRowI | string) => {
          navigate(`${td}/info`);
        },
      };

  const gestoreRef = useRef<HTMLLIElement>(null);
  const questionariRef = useRef<HTMLLIElement>(null);
  const projectRef = useRef<HTMLLIElement>(null);
  const infoRef = useRef<HTMLLIElement>(null);

  const AuthoritySection = () => {
    if (managerAuthorityId) {
      setCurrentForm(
        <FormAuthorities
          formDisabled
          enteType={formTypes.ENTE_GESTORE_PROGRAMMA}
        />
      );
      setCorrectModal(<ManageManagerAuthority />);
      setItemList(null);
      setCorrectButtons(
        hasUserPermission(['upd.enti.gest.prgm'])
          ? [
              {
                size: 'xs',
                outline: true,
                color: 'primary',
                text: 'Elimina',
                buttonClass: 'btn-secondary',
                disabled:
                  authorityInfo?.referentiEnteGestore?.filter(
                    (ref: { [key: string]: formFieldI['value'] }) =>
                      ref.stato === 'ATTIVO'
                  )?.length > 0,
                onClick: () =>
                  dispatch(
                    openModal({
                      id: 'delete-entity',
                      payload: {
                        entity: 'authority',
                        text: 'Confermi di volere eliminare questo gestore di programma?',
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
                      payload: { title: 'Modifica ente gestore programma' },
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
                id: ref?.id,
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
                id: del?.id,
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
      ]);
      setEmptySection(undefined);
    } else {
      setCurrentForm(undefined);
      setCorrectModal(<ManageManagerAuthority creation />);
      setCorrectButtons([]);
      setItemAccordionList([]);
      setEmptySection(
        <EmptySection
          title='Questa sezione è ancora vuota'
          withIcon
          icon='it-note'
          subtitle='Per attivare il progetto aggiungi un Ente gestore di Programma'
          buttons={
            program?.dettagliInfoProgramma?.stato !== entityStatus.TERMINATO &&
            hasUserPermission(['add.enti.gest.prgm'])
              ? EmptySectionButtons.slice(1, 2)
              : []
          }
        />
      );
    }
  };

  const getListaQuestionari = () => {
    dispatch(GetSurveyAllLight());
  };

  useEffect(() => {
    getListaQuestionari();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cancelSurvey = () => {
    setChangeSurveyButtonVisible(true);
    setRadioButtonsSurveys(false);
  };

  const confirmSurvey = async () => {
    setChangeSurveyButtonVisible(true);
    setRadioButtonsSurveys(false);
    await dispatch(
      UpdateProgramSurveyDefault({
        idProgramma: entityId?.toString() || '',
        idQuestionario: newSurveyDefaultId,
      })
    );
    if (entityId) dispatch(GetProgramDetail(entityId));
  };

  useEffect(() => {
    if (changeSurveyButtonVisible && activeTab === tabs.QUESTIONARI) {
      setCorrectButtons(
        program?.dettagliInfoProgramma?.stato !== entityStatus.TERMINATO &&
          hasUserPermission(['upd.rel.quest_prgm'])
          ? [
              {
                size: 'xs',
                color: 'primary',
                text: 'Cambia questionario',
                disabled: otherSurveyList?.list?.length < 2,
                onClick: () => {
                  setChangeSurveyButtonVisible(false);
                  setRadioButtonsSurveys(true);
                },
              },
            ]
          : []
      );
    } else if (changeSurveyButtonVisible === false) {
      setSurveyDefault({
        items: [{ ...surveyList[0], actions: onActionClickQuestionariPreview }],
      });
      setCorrectButtons([
        {
          size: 'xs',
          color: 'primary',
          outline: true,
          buttonClass: 'btn-secondary',
          text: 'Annulla',
          onClick: () => cancelSurvey(),
        },
        {
          size: 'xs',
          color: 'primary',
          text: 'Conferma',
          onClick: () => confirmSurvey(),
        },
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    changeSurveyButtonVisible,
    newSurveyDefaultId,
    otherSurveyList?.list?.length,
  ]);

  const SurveyListSection = () => {
    setCorrectModal(undefined);
    setItemAccordionList(null);
    setCurrentForm(undefined);
    setButtonsPosition('BOTTOM');
    if (surveyList?.length) {
      setSurveyDefault({
        items: [
          {
            ...surveyList[0],
            actions: changeSurveyButtonVisible
              ? onActionClickQuestionariView
              : onActionClickQuestionariPreview,
          },
        ],
      });
      if (otherSurveyList?.list?.length) {
        const otherSurveys: ItemListElemI[] = [];
        otherSurveyList?.list?.map((elem) =>
          otherSurveys.push({
            ...elem,
            actions: onActionClickQuestionariPreview,
          })
        );
        if (surveyDefault?.items[0]?.id) {
          setItemList({
            items: [
              ...(otherSurveys || []).filter(
                (elem) => elem.id !== surveyDefault?.items[0]?.id
              ),
            ],
          });
        }
      }
      setCorrectButtons(
        program?.dettagliInfoProgramma?.stato !== entityStatus.TERMINATO &&
          hasUserPermission(['upd.rel.quest_prgm'])
          ? [
              {
                size: 'xs',
                color: 'primary',
                text: 'Cambia questionario',
                disabled: !(
                  otherSurveyList?.list?.filter(
                    (elem) => elem.id !== surveyDefault?.items[0]?.id
                  )?.length > 0
                ),
                onClick: () => {
                  setChangeSurveyButtonVisible(false);
                  setRadioButtonsSurveys(true);
                },
              },
            ]
          : []
      );
      setEmptySection(undefined);
    } else {
      setItemList(undefined);
      setCorrectButtons([]);
      setEmptySection(
        <EmptySection
          title='Questa sezione è ancora vuota'
          subtitle='Per attivare il programma aggiungi un Questionario'
          buttons={
            program?.dettagliInfoProgramma?.stato !== entityStatus.TERMINATO &&
            hasUserPermission(['upd.rel.quest_prgm'])
              ? EmptySectionButtons.slice(0, 1)
              : []
          }
          withIcon
          icon='it-note'
        />
      );
    }
  };

  const ProjectsSection = () => {
    setCorrectModal(undefined);
    setItemAccordionList(null);
    setCurrentForm(undefined);
    setCorrectModal(<ManageProject creation />);
    if (
      projectsList?.filter(
        (progetto: { associatoAUtente: boolean }) => progetto.associatoAUtente
      )?.length
    ) {
      setCorrectButtons(
        program?.dettagliInfoProgramma?.stato !== entityStatus.TERMINATO &&
          hasUserPermission(['add.prgt'])
          ? [
              {
                size: 'xs',
                color: 'primary',
                text: 'Aggiungi Progetto',
                onClick: () =>
                  dispatch(
                    openModal({
                      id: formTypes.PROGETTO,
                      payload: { title: 'Aggiungi Progetto' },
                    })
                  ),
              },
            ]
          : []
      );
      setItemList({
        items: projectsList
          .filter(
            (progetto: { associatoAUtente: boolean }) =>
              progetto.associatoAUtente
          )
          ?.map((progetto: { id: string; nome: string; stato: string }) => ({
            ...progetto,
            fullInfo: { id: progetto.id },
            actions:
              progetto?.stato !== entityStatus.ATTIVO
                ? {
                    [CRUDActionTypes.VIEW]:
                      onActionClickProgetti[CRUDActionTypes.VIEW],
                  }
                : onActionClickProgetti,
          })),
      });
      setEmptySection(undefined);
    } else {
      setCorrectButtons([]);
      setEmptySection(
        <EmptySection
          title='Questa sezione è ancora vuota'
          subtitle='Per attivare il programma aggiungi un Progetto'
          buttons={
            program?.dettagliInfoProgramma?.stato !== entityStatus.TERMINATO
              ? EmptySectionButtons.slice(2)
              : []
          }
          withIcon
          icon='it-note'
        />
      );
      setItemList({
        items: [],
      });
    }
  };

  useEffect(() => {
    scrollTo(0, 0);
    centerActiveItem();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const centerActiveItem = () => {
    switch (activeTab) {
      case tabs.INFO:
        infoRef.current?.scrollIntoView({ inline: 'center' });
        break;
      case tabs.ENTE:
        gestoreRef.current?.scrollIntoView({ inline: 'center' });
        break;
      case tabs.QUESTIONARI:
        questionariRef.current?.scrollIntoView({ inline: 'center' });
        break;
      case tabs.PROGETTI:
        projectRef.current?.scrollIntoView({ inline: 'center' });
        break;
      default:
        infoRef.current?.scrollIntoView({ inline: 'center' });
        break;
    }
  };

  useEffect(() => {
    const locationSplit = location.pathname.split('/');
    if (locationSplit.length > 0) {
      switch (locationSplit[locationSplit.length - 1]) {
        case tabs.INFO:
        default:
          setActiveTab(tabs.INFO);
          break;
        case tabs.ENTE:
          setActiveTab(tabs.ENTE);
          break;
        case tabs.QUESTIONARI:
          setActiveTab(tabs.QUESTIONARI);
          break;
        case tabs.PROGETTI:
          setActiveTab(tabs.PROGETTI);
          break;
      }
    }
  }, [location]);

  const EmptySectionButtons: ButtonInButtonsBar[] = [
    {
      size: 'xs',
      color: 'primary',
      text: 'Aggiungi un nuovo Questionario',
      onClick: () => console.log('crea questionario'),
    },
    {
      size: 'xs',
      color: 'primary',
      text: 'Aggiungi Ente gestore di Programma',
      onClick: () =>
        dispatch(
          openModal({
            id: 'ente-gestore',
            payload: { title: 'Aggiungi Ente gestore Programma' },
          })
        ),
    },
    {
      size: 'xs',
      color: 'primary',
      text: 'Aggiungi un nuovo Progetto',
      onClick: () =>
        dispatch(
          openModal({
            id: formTypes.PROGETTO,
            payload: { title: 'Aggiungi Progetto' },
          })
        ),
    },
  ];

  const programInfoButtons = () => {
    let formButtons: ButtonInButtonsBar[] = [];
    switch (programDetails?.stato) {
      case 'ATTIVO':
        formButtons = hasUserPermission(['upd.enti.card.prgm', 'end.prgm'])
          ? [
              {
                size: 'xs',
                color: 'danger',
                outline: true,
                text: 'Termina programma',
                onClick: () =>
                  dispatch(
                    openModal({
                      id: 'terminate-entity',
                      payload: {
                        entity: 'program',
                        text: 'Confermi di volere terminare il Programma?',
                      },
                    })
                  ),
              },
              {
                size: 'xs',
                color: 'primary',
                text: 'Modifica',
                onClick: () => {
                  dispatch(
                    openModal({
                      id: formTypes.PROGRAMMA,
                      payload: { title: 'Modifica Programma' },
                    })
                  );
                  setEdit(true);
                },
              },
            ]
          : hasUserPermission(['upd.enti.card.prgm'])
          ? [
              {
                size: 'xs',
                color: 'primary',
                text: 'Modifica',
                onClick: () => {
                  dispatch(
                    openModal({
                      id: formTypes.PROGRAMMA,
                      payload: { title: 'Modifica Programma' },
                    })
                  );
                  setEdit(true);
                },
              },
            ]
          : hasUserPermission(['end.prgm'])
          ? [
              {
                size: 'xs',
                color: 'danger',
                outline: true,
                text: 'Termina programma',
                onClick: () => dispatch(openModal({ id: 'terminate-entity' })),
              },
            ]
          : [];
        break;
      case 'NON ATTIVO':
        formButtons = hasUserPermission(['del.prgm', 'upd.enti.card.prgm'])
          ? [
              {
                size: 'xs',
                outline: true,
                color: 'primary',
                text: 'Elimina',
                buttonClass: 'btn-secondary',
                onClick: () =>
                  dispatch(
                    openModal({
                      id: 'delete-entity',
                      payload: {
                        entity: 'program',
                        text: 'Confermi di volere eliminare questo programma?',
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
                      id: formTypes.PROGRAMMA,
                      payload: { title: 'Modifica Programma' },
                    })
                  ),
              },
            ]
          : hasUserPermission(['upd.enti.card.prgm'])
          ? [
              {
                size: 'xs',
                color: 'primary',
                text: 'Modifica',
                onClick: () =>
                  dispatch(
                    openModal({
                      id: formTypes.PROGRAMMA,
                      payload: { title: 'Modifica Programma' },
                    })
                  ),
              },
            ]
          : hasUserPermission(['del.prgm'])
          ? [
              {
                size: 'xs',
                outline: true,
                color: 'primary',
                text: 'Elimina',
                buttonClass: 'btn-secondary',
                onClick: () =>
                  dispatch(
                    openModal({
                      id: 'delete-entity',
                      payload: {
                        entity: 'program',
                        text: 'Confermi di volere eliminare questo programma?',
                      },
                    })
                  ),
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

  const handleActiveTab = (tab: string) => {
    switch (tab) {
      case tabs.INFO:
        setCurrentForm(<ProgramlInfoAccordionForm />);
        setCorrectModal(<ManageProgram edit={edit} />);
        setItemAccordionList([]);
        setButtonsPosition('BOTTOM');
        setItemList(null);
        setCorrectButtons(programInfoButtons());
        setEmptySection(undefined);
        break;
      case tabs.ENTE:
        AuthoritySection();
        break;
      case tabs.QUESTIONARI:
        SurveyListSection();
        break;
      case tabs.PROGETTI:
        // eslint-disable-next-line no-case-declarations
        ProjectsSection();
        break;
      default:
        return;
    }
  };

  useEffect(() => {
    handleActiveTab(activeTab);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    activeTab,
    programDetails,
    authorityInfo,
    surveyDefault?.items[0]?.id,
    authorityInfo?.referentiEnteGestore,
  ]);

  const nav = (
    <Nav tabs className='mb-5 overflow-hidden'>
      <li ref={infoRef}>
        <NavLink
          to={`/area-amministrativa/programmi/${entityId}/${tabs.INFO}`}
          active={activeTab === tabs.INFO}
        >
          Informazioni generali
        </NavLink>
      </li>
      <li ref={gestoreRef}>
        <NavLink
          to={`/area-amministrativa/programmi/${entityId}/${tabs.ENTE}`}
          active={activeTab === tabs.ENTE}
        >
          {!managerAuthorityId ? (
            <div id='tab-ente-gestore'>
              <span className='mr-1'> * Ente gestore </span>
              <Tooltip
                placement='bottom'
                target='tab-ente-gestore'
                isOpen={openOne}
                toggle={() => toggleOne(!openOne)}
              >
                Compilazione obbligatoria
              </Tooltip>
              <Icon icon='it-warning-circle' size='sm' />
            </div>
          ) : (
            'Ente gestore'
          )}
        </NavLink>
      </li>
      <li ref={questionariRef}>
        <NavLink
          to={`/area-amministrativa/programmi/${entityId}/${tabs.QUESTIONARI}`}
          active={activeTab === tabs.QUESTIONARI}
        >
          <span> Questionari </span>
        </NavLink>
      </li>
      <li ref={projectRef}>
        <NavLink
          active={activeTab === tabs.PROGETTI}
          to={`/area-amministrativa/programmi/${entityId}/${tabs.PROGETTI}`}
        >
          <span> Progetti </span>
        </NavLink>
      </li>
    </Nav>
  );

  // const showINFOButtons = () => activeTab === tabs.INFO;
  // const showENTEButtons = () => activeTab === tabs.ENTE;
  // const showPROGETTIButtons = () => activeTab === tabs.PROGETTI;
  //const showQUESTIONARIButtons = () => activeTab === tabs.QUESTIONARI;

  const terminateProgram = async (
    programId: string,
    terminationDate: string
  ) => {
    await dispatch(TerminateEntity(programId, 'programma', terminationDate));
    dispatch(GetProgramDetail(programId));
    dispatch(closeModal());
  };

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
    if (entityId && managerAuthorityId) {
      await dispatch(
        RemoveReferentDelegate(managerAuthorityId, entityId, cf, role)
      );
      dispatch(GetAuthorityManagerDetail(entityId, 'programma'));
    }
    dispatch(closeModal());
  };
  const deleteProject = async (projectId: string) => {
    await dispatch(DeleteEntity('progetto', projectId));
    dispatch(closeModal());
    if (entityId) dispatch(GetProgramDetail(entityId));
  };

  const removeManagerAuthority = async (
    authorityId: string,
    programId: string
  ) => {
    await dispatch(RemoveManagerAuthority(authorityId, programId, 'programma'));
    dispatch(GetProgramDetail(programId));
    dispatch(closeModal());
  };

  const getAccordionCTA = (title?: string) => {
    switch (title) {
      case 'Referenti':
      case 'Delegati':
        return authorityInfo?.dettagliInfoEnte?.statoEnte !==
          entityStatus.TERMINATO && hasUserPermission(['add.ref_del.gest.prgm'])
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

      default:
        return {
          cta: null,
          ctaAction: () => ({}),
        };
    }
  };

  return (
    <div
      className={clsx(
        device.mediaIsPhone && 'mt-5',
        'd-flex',
        'flex-row',
        'container'
      )}
    >
      <div className='d-flex flex-column w-100 container'>
        <DetailLayout
          nav={nav}
          titleInfo={{
            title: programDetails.nomeBreve,
            status: programDetails.stato,
            upperTitle: { icon: 'it-user', text: 'Programma' },
          }}
          formButtons={correctButtons}
          currentTab={activeTab}
          // itemsAccordionList={itemAccordionList}
          itemsList={itemList}
          buttonsPosition={buttonsPosition}
          goBackTitle='Elenco programmi'
          goBackPath='/area-amministrativa/programmi'
          surveyDefault={surveyDefault}
          isRadioButtonItem={radioButtonsSurveys}
          onRadioChange={(surveyCheckedId: string) =>
            setNewSurveyDefaultId(surveyCheckedId)
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
              >
                {item.items?.length ? (
                  item.items.map((cardItem) => (
                    <CardStatusAction
                      key={cardItem.id}
                      title={`${cardItem.nome} ${
                        cardItem.cognome ? cardItem.cognome : ''
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
                    title={`Non esistono ${item.title?.toLowerCase()} associati`}
                    horizontal
                    aside
                  />
                )}
              </Accordion>
            ))
          : null}
        {currentModal ? currentModal : null}
        <TerminateEntityModal
          onClose={() => dispatch(closeModal())}
          onConfirm={(entity: string, terminationDate: string, id?: string) => {
            switch (entity) {
              case 'program':
                terminationDate &&
                  entityId &&
                  terminateProgram(entityId, terminationDate);
                break;
              case 'project':
                terminationDate && id && terminateProject(id, terminationDate);
                break;
              default:
                dispatch(closeModal());
                break;
            }
          }}
        />
        <ManageDelegate creation />
        <ManageReferal creation />
        {/* /<ManageProgramManagerAuthority /> */}
        <ManageProject creation />
        <DeleteEntityModal
          onClose={() => dispatch(closeModal())}
          onConfirm={async (payload) => {
            if (payload?.entity === 'referent-delegate')
              removeReferentDelegate(payload?.cf, payload?.role);
            if (payload?.entity === 'project')
              deleteProject(payload?.projectId);
            if (payload?.entity === 'program' && entityId) {
              await dispatch(DeleteEntity('programma', entityId));
              navigate(-1);
            }
            if (payload?.entity === 'authority')
              entityId &&
                managerAuthority &&
                managerAuthority?.id &&
                removeManagerAuthority(managerAuthority.id, entityId);
          }}
        />
        <PreviewSurvey
          surveyId={surveyPreviewId}
          onClose={() => dispatch(closeModal())}
          primaryCtaAction={() => {
            confirmSurvey();
            dispatch(closeModal());
          }}
          secondaryCtaAction={() => cancelSurvey()}
        />
      </div>
    </div>
  );
};

export default ProgramsDetails;
