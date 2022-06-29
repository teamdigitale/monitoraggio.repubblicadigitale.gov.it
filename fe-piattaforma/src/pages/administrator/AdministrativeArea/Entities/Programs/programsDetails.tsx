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

  /**
   * The entity id is passed to the breadcrumb but it maybe the case to
   * pass the entity short name, we can access it to the store even if the
   * thunk action to get details is performed in the form component
   */
  const { entityId } = useParams();
  const entityShortName =
    programma.detail?.dettaglioProgramma?.generalInfo.nomeBreve;

  useEffect(() => {
    if (entityId && entityShortName) {
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
            label: entityShortName,
            url: `/area-amministrativa/programmi/${entityId}`,
            link: false,
          },
        ])
      );
    }
  }, [entityId]);

  const onActionClickReferenti: CRUDActionsI = {
    [CRUDActionTypes.VIEW]: (td: TableRowI | string) => {
      navigate(
        `/area-amministrativa/utenti/${typeof td === 'string' ? td : td?.id}`
      );
    },
    [CRUDActionTypes.DELETE]: (td: TableRowI | string) => {
      console.log(td);
    },
  };

  const onActionClickDelegati: CRUDActionsI = {
    [CRUDActionTypes.VIEW]: (td: TableRowI | string) => {
      navigate(
        `/area-amministrativa/utenti/${typeof td === 'string' ? td : td?.id}`
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
        setCurrentForm(undefined);
        setCorrectModal(undefined);
        setItemList({
          items: [
            {
              nome: 'Questionario 1',
              stato: 'active',
              actions: onActionClickQuestionari,
              id: 'questionario',
            },
            {
              nome: 'Questionario 2',
              stato: 'active',
              actions: onActionClickQuestionari,
              id: 'questionario2',
            },
          ],
        });
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
  }, [activeTab, mediaIsDesktop, programma, authorityInfo]);

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

  return (
    <div className='container pb-3'>
      <DetailLayout
        nav={nav}
        titleInfo={{
          title: 'Nome programs 1 breve',
          status: 'ATTIVO',
          upperTitle: { icon: 'it-user', text: 'Programma' },
        }}
        formButtons={
          showINFOButtons()
            ? formButtons
            : showENTEButtons()
            ? correctButtons
            : []
        }
        currentTab={activeTab}
        itemsAccordionList={itemAccordionList}
        itemsList={itemList}
        buttonsPosition='TOP'
        goBackTitle='Elenco programmi'
      >
        {currentForm}
      </DetailLayout>
      {currentModal ? currentModal : null}
      <ConfirmDeleteModal
        onConfirm={() => {
          console.log('confirm delete');
          dispatch(closeModal());
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
