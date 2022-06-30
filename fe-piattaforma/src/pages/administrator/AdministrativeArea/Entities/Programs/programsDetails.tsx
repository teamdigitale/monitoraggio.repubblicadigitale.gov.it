import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Nav } from 'design-react-kit';
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
  ItemsListI,
} from '../../../../../utils/common';
import { TableRowI } from '../../../../../components/Table/table';
import DetailLayout from '../../../../../components/DetailLayout/detailLayout';
import ManageProgram from '../modals/manageProgram';
import ManageProgramManagerAuthority from '../modals/manageProgramManagerAuthority';
import { useAppSelector } from '../../../../../redux/hooks';
import {
  selectDevice,
  updateBreadcrumb,
} from '../../../../../redux/features/app/appSlice';
import {
  selectAuthorities,
  selectPrograms,
} from '../../../../../redux/features/administrativeArea/administrativeAreaSlice';
import { NavLink } from '../../../../../components';
import ProgramlInfoAccordionForm from '../../../../forms/formPrograms/ProgramAccordionForm/ProgramInfoAccordionForm';
import FormAuthorities from '../../../../forms/formAuthorities';
import ManageDelegate from '../modals/manageDelegate';
import ManageReferal from '../modals/manageReferal';
import { DeleteEntity } from '../../../../../redux/features/administrativeArea/administrativeAreaThunk';

const tabs = {
  INFO: 'info',
  ENTE: 'ente',
  QUESTIONARI: 'questionari',
  PROGETTI: 'progetti',
};

const ProgramsDetails: React.FC = () => {
  const { mediaIsDesktop } = useAppSelector(selectDevice);
  const programma = useAppSelector(selectPrograms);
  const authorityInfo = useAppSelector(selectAuthorities)?.detail || {};
  const dispatch = useDispatch();
  const [deleteText, setDeleteText] = useState<string>('');
  const [editItemModalTitle, setEditItemModalTitle] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>(tabs.INFO);
  const [currentForm, setCurrentForm] = useState<React.ReactElement>();
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
  const [surveyDefault, setSurveyDefault] = useState<ItemsListI | null>();
  const [radioButtonsSurveys, setRadioButtonsSurveys] =
    useState<boolean>(false);
  const [changeSurveyButtonVisible, setChangeSurveyButtonVisible] =
    useState<boolean>(true);

  /**
   * The entity id is passed to the breadcrumb but it maybe the case to
   * pass the entity short name, we can access it to the store even if the
   * thunk action to get details is performed in the form component
   */
  const { entityId } = useParams();
  // TODO remove mock
  const { nomeBreve, stato = 'ATTIVO' } =
    programma?.detail?.dettagliInfoProgramma || {};

  useEffect(() => {
    if (entityId && nomeBreve) {
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
            label: nomeBreve,
            url: `/area-amministrativa/programmi/${entityId}`,
            link: false,
          },
        ])
      );
    }
  }, [entityId, nomeBreve]);

  const onActionClickReferenti: CRUDActionsI = {
    [CRUDActionTypes.VIEW]: (td: TableRowI | string) => {
      navigate(
        `/area-amministrativa/${formTypes.REFERENTI}/${
          typeof td === 'string' ? td : td?.id
        }`
      );
    },
    [CRUDActionTypes.DELETE]: (td: TableRowI | string) => {
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
  const onActionClickQuestionari: CRUDActionsI = {
    [CRUDActionTypes.VIEW]: (td: TableRowI | string) => {
      navigate(
        `/area-amministrativa/questionari/${
          typeof td === 'string' ? td : td?.id
        }`
      );
    },
    [CRUDActionTypes.DELETE]: (td: TableRowI | string) => {
      console.log(td);
    },
  };

  const onActionClickProgetti: CRUDActionsI = {
    [CRUDActionTypes.VIEW]: (td: TableRowI | string) => {
      navigate(`${typeof td === 'string' ? td : td?.id}/info`);
    },
    [CRUDActionTypes.DELETE]: (td: TableRowI | string) => {
      console.log(td);
    },
  };

  const gestoreRef = useRef<HTMLLIElement>(null);
  const questionariRef = useRef<HTMLLIElement>(null);
  const projectRef = useRef<HTMLLIElement>(null);
  const infoRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    scrollTo(0, 0);
    centerActiveItem();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  useEffect(() => {
    if (changeSurveyButtonVisible) {
      setCorrectButtons(
        buttonSurvey.filter((button) => button.text === 'Cambia questionario')
      );
    } else {
      setCorrectButtons(
        buttonSurvey.filter((button) => button.text !== 'Cambia questionario')
      );
    }
  }, [changeSurveyButtonVisible]);

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

  const itemMock = [
    {
      nome: 'Questionario 1',
      stato: 'active',
      actions: onActionClickQuestionari,
      id: 'questionario',
      default: true,
    },
    {
      nome: 'Questionario 2',
      stato: 'active',
      actions: onActionClickQuestionari,
      id: 'questionario2',
      default: false,
    },
    {
      nome: 'Questionario 3',
      stato: 'active',
      actions: onActionClickQuestionari,
      id: 'questionario3',
      default: false,
    },
    {
      nome: 'Questionario 4',
      stato: 'active',
      actions: onActionClickQuestionari,
      id: 'questionario4',
      default: false,
    },
  ];

  const buttonSurvey: ButtonInButtonsBar[] = [
    {
      size: 'xs',
      color: 'primary',
      outline: true,
      text: 'Annulla',
      onClick: () => {
        setChangeSurveyButtonVisible(true);
        // console.log('Annulla');
      },
    },
    {
      size: 'xs',
      color: 'primary',
      text: 'Conferma',
      onClick: () => {
        setChangeSurveyButtonVisible(true);
        // console.log('Conferma', surveyDefault?.items[0].id);  TODO: richiama api PUT new default survey
      },
    },
    {
      size: 'xs',
      color: 'primary',
      text: 'Cambia questionario',
      onClick: () => {
        setRadioButtonsSurveys(true);
        setChangeSurveyButtonVisible(false);
      },
    },
  ];

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
      }
    }
  }, [location]);

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
        break;
      case tabs.ENTE:
        setModalIdToOpen(formTypes.ENTE_GESTORE_PROGRAMMA);
        setDeleteText(
          'Confermi di voler eliminare questo gestore di programs?'
        );
        setEditItemModalTitle('Modifica ente gestore programs');
        setCurrentForm(
          <FormAuthorities
            formDisabled
            enteType={formTypes.ENTE_GESTORE_PROGRAMMA}
          />
        );
        setCorrectModal(<ManageProgramManagerAuthority />);
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
            outline: true,
            color: 'primary',
            text: ' Modifica',
            onClick: () =>
              dispatch(
                openModal({
                  id: formTypes.ENTE_GESTORE_PROGRAMMA,
                  payload: { title: 'Modifica ente gestore programma' },
                })
              ),
          },
        ]);
        setItemAccordionList([
          {
            title: 'Referenti',
            items:
              authorityInfo?.referenti?.map(
                (ref: { [key: string]: string }) => ({
                  ...ref,
                  actions: onActionClickReferenti,
                })
              ) || [],
          },
          {
            title: 'Delegati',
            items:
              authorityInfo?.delegati?.map(
                (del: { [key: string]: string }) => ({
                  ...del,
                  actions: onActionClickDelegati,
                })
              ) || [],
          },
        ]);
        break;
      case tabs.QUESTIONARI:
        // eslint-disable-next-line no-case-declarations
        setCurrentForm(undefined);
        setCorrectModal(undefined);
        if (!radioButtonsSurveys) {
          setSurveyDefault({
            items: itemMock.filter((item) => item.default === true),
          });
          setItemList({
            items: itemMock.filter((item) => item.default === false),
          });
        }

        setItemAccordionList(null);
        break;
      case tabs.PROGETTI:
        // eslint-disable-next-line no-case-declarations
        const progettiList = programma.detail?.progetti?.map(
          (progetto: { id: string; nome: string; stato: string }) => ({
            ...progetto,
            fullInfo: { id: progetto.id },
            actions: onActionClickProgetti,
          })
        );
        setCurrentForm(undefined);
        setCorrectModal(undefined);
        setItemList({
          items: [...(progettiList || [])],
        });
        setItemAccordionList(null);
        break;
      default:
        return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    activeTab,
    mediaIsDesktop,
    programma,
    authorityInfo,
    surveyDefault?.items[0].id,
  ]);

  const formButtons: ButtonInButtonsBar[] = [
    {
      size: 'xs',
      color: 'danger',
      outline: true,
      text: 'Termina programma',
      onClick: () => console.log('termina progetto'),
    },
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
      text: ' Modifica',
      onClick: () =>
        dispatch(
          openModal({
            id: modalIdToOpen,
            payload: { title: editItemModalTitle },
          })
        ),
    },
  ];

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
          Ente gestore
        </NavLink>
      </li>
      <li ref={questionariRef}>
        <NavLink
          to={`/area-amministrativa/programmi/${entityId}/${tabs.QUESTIONARI}`}
          active={activeTab === tabs.QUESTIONARI}
        >
          Questionari
        </NavLink>
      </li>
      <li ref={projectRef}>
        <NavLink
          active={activeTab === tabs.PROGETTI}
          to={`/area-amministrativa/programmi/${entityId}/${tabs.PROGETTI}`}
        >
          Progetti
        </NavLink>
      </li>
    </Nav>
  );

  const showINFOButtons = () => activeTab === tabs.INFO;
  const showENTEButtons = () => activeTab === tabs.ENTE;
  const showQUESTIONARIButtons = () => activeTab === tabs.QUESTIONARI;

  const onChangeSurveyDefault = (surveyCheckedId: string) => {
    if (surveyCheckedId !== '') {
      const newItems = [...itemMock];
      newItems[
        newItems.findIndex((item) => item.id === surveyDefault?.items[0].id)
      ].default = false;
      newItems[
        newItems.findIndex((item) => item.id === surveyCheckedId)
      ].default = true;
      setSurveyDefault({
        items: newItems.filter((item) => item.id === surveyCheckedId),
      });
      // non serve in teoria, itemList dovrebbe aggiornarsi con la get dopo la put del questionario di default
      // setItemList({
      //   items: newItems.filter((item) => item.default === false),
      // });
    }
  };

  return (
    <div className='container pb-3'>
      <DetailLayout
        nav={nav}
        titleInfo={{
          title: nomeBreve,
          status: stato,
          upperTitle: { icon: 'it-user', text: 'Programma' },
        }}
        formButtons={
          showINFOButtons()
            ? formButtons
            : showENTEButtons()
            ? correctButtons
            : showQUESTIONARIButtons()
            ? correctButtons
            : []
        }
        currentTab={activeTab}
        itemsAccordionList={itemAccordionList}
        itemsList={itemList}
        buttonsPosition={showQUESTIONARIButtons() ? 'BOTTOM' : 'TOP'}
        goBackTitle='Elenco programmi'
        surveyDefault={surveyDefault}
        isRadioButtonItem={radioButtonsSurveys}
        onRadioChange={(surveyCheckedId: string) =>
          onChangeSurveyDefault(surveyCheckedId)
        }
      >
        {currentForm}
      </DetailLayout>
      {currentModal ? currentModal : null}
      <ConfirmDeleteModal
        onConfirm={() => {
          console.log('confirm delete');
          entityId && dispatch(DeleteEntity('programma', entityId));
          dispatch(closeModal());
          navigate(-1);
        }}
        onClose={() => {
          dispatch(closeModal());
        }}
        text={deleteText}
      />
      <ManageDelegate />
      <ManageReferal />
    </div>
  );
};

export default ProgramsDetails;
