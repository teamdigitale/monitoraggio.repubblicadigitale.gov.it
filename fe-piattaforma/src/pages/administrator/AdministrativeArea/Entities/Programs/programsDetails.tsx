import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Icon, Nav } from 'design-react-kit';
import {
  closeModal,
  openModal,
} from '../../../../../redux/features/modal/modalSlice';
import { useDispatch } from 'react-redux';
import ConfirmDeleteModal from '../modals/confirmDeleteModal';

import { ButtonInButtonsBar } from '../../../../../components/ButtonsBar/buttonsBar';
import { formTypes } from '../utils';
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
  updateBreadcrumb,
} from '../../../../../redux/features/app/appSlice';
import {
  selectAuthorities,
  selectPrograms,
  selectSurveys,
} from '../../../../../redux/features/administrativeArea/administrativeAreaSlice';
import { EmptySection, NavLink } from '../../../../../components';
import ProgramlInfoAccordionForm from '../../../../forms/formPrograms/ProgramAccordionForm/ProgramInfoAccordionForm';
import FormAuthorities from '../../../../forms/formAuthorities';
import ManageDelegate from '../modals/manageDelegate';
import ManageReferal from '../modals/manageReferal';
import { GetAllSurveys } from '../../../../../redux/features/administrativeArea/surveys/surveysThunk';
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
import { RemoveManagerAuthority } from '../../../../../redux/features/administrativeArea/authorities/authoritiesThunk';
import TerminateEntityModal from '../../../../../components/AdministrativeArea/Entities/General/TerminateEntityModal/TerminateEntityModal';

const tabs = {
  INFO: 'info',
  ENTE: 'ente',
  QUESTIONARI: 'questionari',
  PROGETTI: 'progetti',
};

const ProgramsDetails: React.FC = () => {
  const { mediaIsDesktop } = useAppSelector(selectDevice);
  const program = useAppSelector(selectPrograms).detail;
  const surveyList = program?.questionari;
  const otherSurveyList = useAppSelector(selectSurveys);
  const projectsList = program?.progetti;
  const authorityInfo = useAppSelector(selectAuthorities)?.detail;
  const dispatch = useDispatch();
  const [deleteText, setDeleteText] = useState<string>('');
  const [editItemModalTitle, setEditItemModalTitle] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>(tabs.INFO);
  const [currentForm, setCurrentForm] = useState<React.ReactElement>();
  const [emptySection, setEmptySection] = useState<React.ReactElement>();
  const [currentModal, setCorrectModal] = useState<React.ReactElement>();
  const [itemList, setItemList] = useState<ItemsListI | null>();
  const [itemAccordionList, setItemAccordionList] = useState<
    ItemsListI[] | null
  >();
  const [modalIdToOpen, setModalIdToOpen] = useState<string>(
    formTypes.PROGRAMMA
  );
  const [correctButtons, setCorrectButtons] = useState<ButtonInButtonsBar[]>(
    []
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
    if (entityId) dispatch(GetProgramDetail(entityId));
  }, [entityId]);

  useEffect(() => {
    if (entityId && programDetails) {
      dispatch(
        updateBreadcrumb([
          {
            label: 'Area Amministrativa',
            url: '/area-amministrativa',
            link: false,
          },
          {
            label: 'Programmi',
            url: '/area-amministrativa/programmi',
            link: true,
          },
          {
            label: programDetails.nomeBreve,
            url: `/area-amministrativa/programmi/${entityId}`,
            link: false,
          },
        ])
      );
    }
  }, [entityId, programDetails]);

  const onActionClickReferenti: CRUDActionsI = {
    [CRUDActionTypes.VIEW]: (td: TableRowI | string) => {
      navigate(
        `/area-amministrativa/${formTypes.REFERENTI}/${
          typeof td === 'string' ? td : td?.id
        }`
      );
    },
    [CRUDActionTypes.DELETE]: (td: TableRowI | string) => {
      // dispatch(RemoveReferentDelegate())
      console.log(td);
    },
  };

  const onActionClickDelegati: CRUDActionsI = {
    [CRUDActionTypes.VIEW]: (td: TableRowI | string) => {
      navigate(
        `/area-amministrativa/${formTypes.DELEGATI}/${
          typeof td === 'string' ? td : td?.id
        }`
      );
    },
    [CRUDActionTypes.DELETE]: (td: TableRowI | string) => {
      console.log(td);
    },
  };
  const onActionClickQuestionariView: CRUDActionsI = {
    [CRUDActionTypes.VIEW]: (td: TableRowI | string) => {
      navigate(
        `/area-amministrativa/questionari/${
          typeof td === 'string' ? td : td?.id
        }`
      );
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

  const onActionClickProgetti: CRUDActionsI = {
    [CRUDActionTypes.VIEW]: (td: TableRowI | string) => {
      console.log(td);

      navigate(`${td}/info`);
    },
    [CRUDActionTypes.DELETE]: (td: TableRowI | string) => {
      console.log('delete', td);
    },
  };

  const gestoreRef = useRef<HTMLLIElement>(null);
  const questionariRef = useRef<HTMLLIElement>(null);
  const projectRef = useRef<HTMLLIElement>(null);
  const infoRef = useRef<HTMLLIElement>(null);

  const AuthoritySection = () => {
    if (managerAuthorityId) {
      setModalIdToOpen(formTypes.ENTE_GESTORE_PROGRAMMA),
        setDeleteText(
          'Confermi di voler eliminare questo gestore di programs?'
        ),
        setEditItemModalTitle('Modifica ente gestore programs'),
        setCurrentForm(
          <FormAuthorities
            formDisabled
            enteType={formTypes.ENTE_GESTORE_PROGRAMMA}
          />
        ),
        setCorrectModal(<ManageManagerAuthority />),
        setItemList(null),
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
                  id: 'ente-gestore',
                  payload: { title: 'Modifica ente gestore programma' },
                })
              ),
          },
        ]),
        setItemAccordionList([
          {
            title: 'Referenti',
            items:
              authorityInfo?.referentiEnteGestore?.map(
                (ref: { [key: string]: string }) => ({
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
                  ...del,
                  actions: onActionClickDelegati,
                })
              ) || [],
          },
        ]);
      setEmptySection(undefined);
    } else {
      return (
        setCurrentForm(undefined),
        setCorrectModal(<ManageManagerAuthority creation />),
        setCorrectButtons([]),
        setItemAccordionList([]),
        setEmptySection(
          <EmptySection
            title={'Questa sezione è ancora vuota'}
            subtitle={
              'Per attivare il progetto aggiungi un Ente gestore di Programma'
            }
            buttons={EmptySectionButtons.slice(1, 2)}
          />
        )
      );
    }
  };

  const getListaQuestionari = () => {
    dispatch(GetAllSurveys(true));
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
    // update program detail
    if (entityId) await dispatch(GetProgramDetail(entityId));
  };

  useEffect(() => {
    if (changeSurveyButtonVisible) {
      setCorrectButtons([
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
      ]);
    } else if (changeSurveyButtonVisible === false) {
      setSurveyDefault({
        items: [{ ...surveyList[0], actions: onActionClickQuestionariPreview }],
      });
      setCorrectButtons([
        {
          size: 'xs',
          color: 'primary',
          outline: true,
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
  }, [
    changeSurveyButtonVisible,
    newSurveyDefaultId,
    otherSurveyList?.list?.length,
  ]);

  const SurveyListSection = () => {
    setCorrectModal(undefined);
    setItemAccordionList(null);
    setCurrentForm(undefined);
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
      setCorrectButtons([
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
      ]);
      setEmptySection(undefined);
    } else {
      setItemList(undefined),
        setCorrectButtons([]),
        setEmptySection(
          <EmptySection
            title={'Questa sezione è ancora vuota'}
            subtitle={'Per attivare il programma aggiungi un Questionario'}
            buttons={EmptySectionButtons.slice(0, 1)}
          />
        );
    }
  };

  const ProjectsSection = () => {
    setCorrectModal(undefined);
    setItemAccordionList(null);
    setCurrentForm(undefined);
    setCorrectModal(<ManageProject creation />);
    if (projectsList?.length) {
      setCorrectButtons([
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
      ]),
        setItemList({
          items: projectsList?.map(
            (progetto: { id: string; nome: string; stato: string }) => ({
              ...progetto,
              fullInfo: { id: progetto.id },
              actions: onActionClickProgetti,
            })
          ),
        });
      setEmptySection(undefined);
    } else {
      setCorrectButtons([]);
      setEmptySection(
        <EmptySection
          title={'Questa sezione è ancora vuota'}
          subtitle={'Per attivare il programma aggiungi un Progetto'}
          buttons={EmptySectionButtons.slice(2)}
        />
      ),
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
        default:
          setActiveTab(tabs.INFO);
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
        formButtons = [
          {
            size: 'xs',
            color: 'danger',
            outline: true,
            text: 'Termina programma',
            onClick: () => dispatch(openModal({ id: 'terminate-entity' })),
          },
          {
            size: 'xs',
            color: 'primary',
            text: 'Modifica',
            onClick: () =>
              dispatch(
                openModal({
                  id: modalIdToOpen,
                  payload: { title: editItemModalTitle },
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
                  id: modalIdToOpen,
                  payload: { title: editItemModalTitle },
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
        setModalIdToOpen(formTypes.PROGRAMMA);
        setCurrentForm(<ProgramlInfoAccordionForm />);
        setCorrectModal(<ManageProgram />);
        setDeleteText('Confermi di voler eliminare questo programma?');
        setEditItemModalTitle('Modifica programma');
        setItemAccordionList([]);
        setItemList(null);
        setCorrectButtons(programInfoButtons());
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    activeTab,
    mediaIsDesktop,
    programDetails,
    authorityInfo,
    surveyDefault?.items[0]?.id,
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
          {!entityId ? (
            <div>
              <span className='mr-1'> * Ente gestore </span>
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
          {!surveyList?.length ? (
            <div>
              <span className='mr-1'> * Questionari </span>
              <Icon icon='it-warning-circle' size='sm' />
            </div>
          ) : (
            'Questionari'
          )}
        </NavLink>
      </li>
      <li ref={projectRef}>
        <NavLink
          active={activeTab === tabs.PROGETTI}
          to={`/area-amministrativa/programmi/${entityId}/${tabs.PROGETTI}`}
        >
          {!projectsList?.length ? (
            <div>
              <span className='mr-1'> * Progetti </span>
              <Icon icon='it-warning-circle' size='sm' />
            </div>
          ) : (
            'Progetti'
          )}
        </NavLink>
      </li>
    </Nav>
  );

  // const showINFOButtons = () => activeTab === tabs.INFO;
  // const showENTEButtons = () => activeTab === tabs.ENTE;
  // const showPROGETTIButtons = () => activeTab === tabs.PROGETTI;
  const showQUESTIONARIButtons = () => activeTab === tabs.QUESTIONARI;

  const terminateProgram = async (
    programId: string,
    terminationDate: string
  ) => {
    await dispatch(TerminateEntity(programId, 'programma', terminationDate));
    dispatch(closeModal());
    window.location.reload();
  };

  return (
    <div className='pb-3'>
      <DetailLayout
        nav={nav}
        titleInfo={{
          title: programDetails.nomeBreve,
          status: programDetails.stato,
          upperTitle: { icon: 'it-user', text: 'Programma' },
        }}
        formButtons={correctButtons}
        currentTab={activeTab}
        itemsAccordionList={itemAccordionList}
        itemsList={itemList}
        buttonsPosition={showQUESTIONARIButtons() ? 'BOTTOM' : 'TOP'}
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
      {currentModal ? currentModal : null}
      <ConfirmDeleteModal
        onConfirm={() => {
          switch (activeTab) {
            case tabs.INFO:
              entityId && dispatch(DeleteEntity('programma', entityId));
              navigate(-1);
              break;
            case tabs.ENTE:
              entityId &&
                managerAuthority &&
                managerAuthority?.id &&
                dispatch(
                  RemoveManagerAuthority(
                    managerAuthority.id,
                    entityId,
                    'programma'
                  )
                );
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
        text='Confermi di voler terminare il Programma?'
        onClose={() => dispatch(closeModal())}
        onConfirm={(terminationDate: string) =>
          terminationDate &&
          entityId &&
          terminateProgram(entityId, terminationDate)
        }
      />
      <ManageDelegate />
      <ManageReferal />
      {/* /<ManageProgramManagerAuthority /> */}
      <ManageProject creation />
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
  );
};

export default ProgramsDetails;
