import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Nav, NavItem } from 'design-react-kit';
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
import { selectDevice } from '../../../../../redux/features/app/appSlice';
import { selectProgrammi } from '../../../../../redux/features/administrativeArea/administrativeAreaSlice';
import { NavLink } from '../../../../../components';
import GeneralInfoAccordionForm from '../../../../forms/formPrograms/ProgramAccordionForm/generalInfoAccordionForm';
import FormAuthorities from '../../../../forms/formAuthorities';
const tabs = {
  INFO: 'info',
  ENTE: 'ente',
  QUESTIONARI: 'questionari',
  PROGETTI: 'progetti',
};

const ProgramsDetails: React.FC = () => {
  const { mediaIsDesktop } = useAppSelector(selectDevice);
  const programma = useAppSelector(selectProgrammi);
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
  const navigate = useNavigate();
  const location = useLocation();
  const { entityId } = useParams();

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
      navigate(`/area-amministrativa/${typeof td === 'string' ? td : td?.id}`);
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

  const onActionClickSedi: CRUDActionsI = {
    [CRUDActionTypes.VIEW]: (td: TableRowI | string) => {
      navigate(
        `/area-amministrativa/utenti/${typeof td === 'string' ? td : td?.id}`
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

  const gestoreRef = useRef<HTMLSpanElement>(null);
  const questionariRef = useRef<HTMLSpanElement>(null);
  const projectRef = useRef<HTMLSpanElement>(null);
  const infoRef = useRef<HTMLSpanElement>(null);

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
        setCurrentForm(<GeneralInfoAccordionForm />);
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
        setItemAccordionList([
          {
            title: 'Referenti',
            items: [
              {
                nome: 'Referente 1',
                stato: 'active',
                actions: onActionClickReferenti,
                id: 'ref1',
              },
            ],
          },
          {
            title: 'Delegati',
            items: [
              {
                nome: 'Delegato 1',
                stato: 'active',
                actions: onActionClickDelegati,
                id: 'del1',
              },
            ],
          },
          {
            title: 'Headquarters',
            items: [
              {
                nome: 'Sede 122',
                stato: 'active',
                actions: onActionClickSedi,
                id: 'sede1',
                fullInfo: {
                  ente_ref: 'Comune di Milano',
                  nFacilitatori: '8',
                  serviziErogati: 'Facilitazione',
                },
              },
              {
                nome: 'Sede 2',
                stato: 'active',
                actions: onActionClickSedi,
                id: 'sede2',
                fullInfo: {
                  ente_ref: 'Comune di Como',
                  nFacilitatori: '15',
                  serviziErogati: 'Formazione',
                },
              },
            ],
          },
        ]);
        break;
      case tabs.QUESTIONARI:
        setCurrentForm(undefined);
        setCorrectModal(undefined);
        setItemList({
          items: [
            {
              nome: 'questionario',
              stato: 'active',
              actions: onActionClickQuestionari,
              id: 'questionario',
            },
            {
              nome: 'questionario2',
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
  }, [activeTab, mediaIsDesktop, programma]);

  const formButtons: ButtonInButtonsBar[] = [
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
            id: modalIdToOpen,
            payload: { title: editItemModalTitle },
          })
        ),
    },
  ];

  const nav = (
    <Nav tabs className='mb-5 overflow-hidden'>
      <span ref={infoRef}>
        <NavItem>
          <NavLink
            to={`/area-amministrativa/programmi/${entityId}/${tabs.INFO}`}
            active={activeTab === tabs.INFO}
          >
            Informazioni generali
          </NavLink>
        </NavItem>
      </span>
      <span ref={gestoreRef}>
        <NavItem>
          <NavLink
            to={`/area-amministrativa/programmi/${entityId}/${tabs.ENTE}`}
            active={activeTab === tabs.ENTE}
          >
            Ente gestore
          </NavLink>
        </NavItem>
      </span>
      <span ref={questionariRef}>
        <NavItem>
          <NavLink
            to={`/area-amministrativa/programmi/${entityId}/${tabs.QUESTIONARI}`}
            active={activeTab === tabs.QUESTIONARI}
          >
            Questionari
          </NavLink>
        </NavItem>
      </span>
      <span ref={projectRef}>
        <NavItem>
          <NavLink
            active={activeTab === tabs.PROGETTI}
            to={`/area-amministrativa/programmi/${entityId}/${tabs.PROGETTI}`}
          >
            Progetti
          </NavLink>
        </NavItem>
      </span>
    </Nav>
  );

  const showButtons = () => activeTab === tabs.INFO || activeTab === tabs.ENTE;

  return (
    <div className='container pb-3'>
      <DetailLayout
        nav={nav}
        titleInfo={{
          title: 'Nome programs 1 breve',
          status: 'ATTIVO',
          upperTitle: { icon: 'it-user', text: 'Programma' },
        }}
        Form={currentForm}
        formButtons={showButtons() ? formButtons : []}
        itemsAccordionList={itemAccordionList}
        itemsList={itemList}
        buttonsPosition='TOP'
        goBackTitle='Vai alla Lista programmi'
      />
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
    </div>
  );
};

export default ProgramsDetails;
