import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../../../../../redux/hooks';
import {
  selectQuestionarioTemplateSnapshot,
  selectServices,
} from '../../../../../redux/features/administrativeArea/administrativeAreaSlice';
import {
  CitizenListI,
  DeleteService,
  GetCitizenListServiceDetail,
  GetServicesDetail,
  GetServicesDetailFilters,
  SendSurveyToAll,
} from '../../../../../redux/features/administrativeArea/services/servicesThunk';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import DetailLayout from '../../../../../components/DetailLayout/detailLayout';
import { ButtonInButtonsBar } from '../../../../../components/ButtonsBar/buttonsBar';
import {
  closeModal,
  openModal,
} from '../../../../../redux/features/modal/modalSlice';
import { formTypes } from '../utils';
import { setInfoIdsBreadcrumb } from '../../../../../redux/features/app/appSlice';
import { Nav, NavItem } from 'design-react-kit';
import { NavLink } from '../../../../../components';
import ManageServices from '../modals/manageService';
import SearchCitizenModal from '../../../CitizensArea/Entities/SearchCitizenModal/searchCitizenModal';
import {
  CRUDActionsI,
  CRUDActionTypes,
  ItemListElemI,
  ItemsListI,
} from '../../../../../utils/common';
import { TableRowI } from '../../../../../components/Table/table';
import CitizensList from './citizensList';
import FormService from '../../../../forms/formServices/formService';
import useGuard from '../../../../../hooks/guard';
import clsx from 'clsx';
import DeleteEntityModal from '../../../../../components/AdministrativeArea/Entities/General/DeleteEntityModal/DeleteEntityModal';
import ConfirmSentSurveyModal from '../modals/confirmSentSurveyModal';

const tabs = {
  INFO: 'info',
  CITIZENS: 'cittadini',
};

const ServicesDetails = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const serviceDetails: {
    dettaglioServizio: { [key: string]: string };
    progettiAssociatiAlServizio: {
      id: string;
      nomeBreve: string;
      stato: string;
    }[];
    cittadini: CitizenListI;
  } = useAppSelector(selectServices)?.detail;
  const dettagliRef = useRef<HTMLSpanElement>(null);
  const cittadiniRef = useRef<HTMLSpanElement>(null);
  const [activeTab, setActiveTab] = useState<string>(tabs.INFO);
  const [content, setContent] = useState<React.ReactElement>();
  const [itemList, setItemList] = useState<ItemsListI | null>();
  const location = useLocation();
  const { hasUserPermission } = useGuard();
  const idQuestionarioTemplate = useAppSelector(
    selectQuestionarioTemplateSnapshot
  )?.idQuestionarioTemplate;

  useEffect(() => {
    // For breadcrumb
    if (location.pathname === `/area-amministrativa/servizi/${serviceId}`) {
      navigate(`/area-amministrativa/servizi/${serviceId}/info`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // For breadcrumb
    if (serviceId && serviceDetails?.dettaglioServizio?.nomeServizio) {
      dispatch(
        setInfoIdsBreadcrumb({
          id: serviceId,
          nome: serviceDetails?.dettaglioServizio?.nomeServizio,
        })
      );
    }
  }, [serviceId, serviceDetails, activeTab]);

  const centerActiveItem = () => {
    switch (activeTab) {
      case tabs.INFO:
        dettagliRef.current?.scrollIntoView({ inline: 'center' });
        break;
      case tabs.CITIZENS:
        cittadiniRef?.current?.scrollIntoView({ inline: 'center' });
        break;
      default:
        dettagliRef.current?.scrollIntoView({ inline: 'center' });
        break;
    }
  };

  useEffect(() => {
    /*  scrollTo(0, 0); */
    centerActiveItem();
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === tabs.INFO) dispatch(GetServicesDetail(serviceId));
    if (activeTab === tabs.CITIZENS)
      dispatch(GetCitizenListServiceDetail(serviceId));
  }, []);

  const onActionClick: CRUDActionsI = {
    [CRUDActionTypes.VIEW]: (td: TableRowI | string) => {
      navigate(`/area-amministrativa/progetti/${td}`);
    },
  };

  useEffect(() => {
    if (serviceDetails?.progettiAssociatiAlServizio?.length) {
      const projectsAssociated: ItemListElemI[] = [];
      serviceDetails.progettiAssociatiAlServizio.map((elem) =>
        projectsAssociated.push({
          id: elem.id,
          nome: elem.nomeBreve,
          stato: elem.stato,
          actions: onActionClick,
        })
      );
      setItemList({
        title: 'Progetti associati',
        items: [...projectsAssociated],
      });
    }
  }, [serviceDetails]);

  useEffect(() => {
    const locationSplit = location.pathname.split('/');
    if (locationSplit.length) {
      switch (locationSplit[locationSplit.length - 1]) {
        case tabs.INFO:
          setActiveTab(tabs.INFO);
          setContent(
            <FormService legend='form informazioni servizio' formDisabled />
          );
          break;
        case tabs.CITIZENS:
          setActiveTab(tabs.CITIZENS);
          setContent(<CitizensList />);
          break;
        default:
          setActiveTab(tabs.INFO);
      }
      centerActiveItem();
    }
  }, [location, serviceDetails]);

  const buttons: ButtonInButtonsBar[] = hasUserPermission([
    'upd.card.serv',
    'del.serv',
  ])
    ? [
        {
          size: 'xs',
          outline: true,
          color: 'primary',
          text: 'Elimina',
          disabled:
            serviceDetails?.dettaglioServizio?.statoServizio !== 'NON ATTIVO',
          onClick: () =>
            dispatch(
              openModal({
                id: 'delete-entity',
                payload: {
                  text: 'Confermi di volere eliminare questo servizio?',
                },
              })
            ),
        },
        {
          size: 'xs',
          color: 'primary',
          text: 'Modifica',
          disabled:
            serviceDetails?.dettaglioServizio?.statoServizio !== 'NON ATTIVO',
          onClick: () =>
            dispatch(
              openModal({
                id: formTypes.SERVICES,
                payload: { title: 'Modifica servizio', idServizio: serviceId },
              })
            ),
        },
      ]
    : hasUserPermission(['del.serv'])
    ? [
        {
          size: 'xs',
          outline: true,
          color: 'primary',
          text: 'Elimina',
          disabled:
            serviceDetails?.dettaglioServizio?.statoServizio !== 'NON ATTIVO',
          onClick: () =>
            dispatch(
              openModal({
                id: 'delete-entity',
                payload: {
                  text: 'Confermi di volere eliminare questo servizio?',
                },
              })
            ),
        },
      ]
    : hasUserPermission(['upd.card.serv'])
    ? [
        {
          size: 'xs',
          color: 'primary',
          text: 'Modifica',
          disabled:
            serviceDetails?.dettaglioServizio?.statoServizio !== 'NON ATTIVO',
          onClick: () =>
            dispatch(
              openModal({
                id: formTypes.SERVICES,
                payload: { title: 'Modifica servizio', idServizio: serviceId },
              })
            ),
        },
      ]
    : [];

  const buttonsCitizen: ButtonInButtonsBar[] = [
    {
      size: 'xs',
      outline: true,
      color: 'primary',
      buttonClass: 'btn-secondary',
      text: 'Stampa questionario',
      iconForButton: 'it-print',
      iconColor: 'primary',
      onClick: () =>
        window.open(
          `/area-amministrativa/servizi/${serviceId}/stampa-questionario/${idQuestionarioTemplate}`,
          '_blank'
        ),
    },
    {
      size: 'xs',
      color: 'primary',
      text: 'Invia questionario a tutti',
      onClick: async () => {
        const res = await dispatch(SendSurveyToAll(serviceId));
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (res === 'error') {
          dispatch(
            openModal({
              id: 'confirmSentSurveyModal',
              payload: {
                text: 'Questionari non inviati correttamente!',
                error: true,
              },
            })
          );
        } else {
          dispatch(
            openModal({
              id: 'confirmSentSurveyModal',
              payload: {
                text: 'Questionari inviati correttamente!',
                error: false,
              },
            })
          );
        }
        dispatch(GetCitizenListServiceDetail(serviceId));
        dispatch(GetServicesDetailFilters(serviceId));
      },
    },
  ];

  const onConfirmDelete = async () => {
    if (serviceId) await dispatch(DeleteService(serviceId));
    dispatch(closeModal());
    navigate('/area-amministrativa/servizi');
  };

  const nav = (
    <Nav tabs className='mb-5 overflow-hidden' role='menu'>
      <NavItem role='none'>
        <span ref={dettagliRef}>
          <NavLink
            to={`/area-amministrativa/servizi/${serviceId}/${tabs.INFO}`}
            active={activeTab === tabs.INFO}
            role='menuitem'
            onKeyDown={() => setActiveTab(tabs.INFO)}
          >
            Dettagli servizio
          </NavLink>
        </span>
      </NavItem>
      <NavItem role='none'>
        <span ref={cittadiniRef}>
          <NavLink
            to={`/area-amministrativa/servizi/${serviceId}/${tabs.CITIZENS}`}
            active={activeTab === tabs.CITIZENS}
            role='menuitem'
            onKeyDown={() => setActiveTab(tabs.CITIZENS)}
          >
            Cittadini
          </NavLink>
        </span>
      </NavItem>
    </Nav>
  );

  return (
    <div
      className={clsx('d-flex', 'container', 'justify-content-center', 'w-100')}
      style={{ maxWidth: 'auto' }}
    >
      <div className='container'>
        <DetailLayout
          formButtons={activeTab === tabs.CITIZENS ? buttonsCitizen : buttons}
          titleInfo={{
            title: serviceDetails.dettaglioServizio?.nomeServizio,
            status: serviceDetails.dettaglioServizio?.statoServizio,
            upperTitle: { icon: 'it-calendar', text: 'Servizio' },
            subTitle: serviceDetails.dettaglioServizio?.nominativoFacilitatore,
          }}
          currentTab={activeTab}
          buttonsPosition='BOTTOM'
          itemsList={itemList}
          showItemsList={activeTab === tabs.INFO}
          nav={nav}
          goBackTitle='Elenco servizi'
          goBackPath='/area-amministrativa/servizi'
          /* citizenList
          citizenDeleteChange */
        >
          <div className='mx-auto'>{content}</div>
        </DetailLayout>
        <ManageServices legend="Form modifica servizio, i campi con l'asterisco sono obbligatori" />
        <SearchCitizenModal />
        <DeleteEntityModal
          onClose={() => dispatch(closeModal())}
          onConfirm={() => onConfirmDelete()}
        />
        <ConfirmSentSurveyModal />
      </div>
    </div>
  );
};

export default ServicesDetails;
