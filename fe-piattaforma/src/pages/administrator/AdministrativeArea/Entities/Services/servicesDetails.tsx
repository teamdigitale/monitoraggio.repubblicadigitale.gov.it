import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../../../../../redux/hooks';
import { selectServices } from '../../../../../redux/features/administrativeArea/administrativeAreaSlice';
import { GetServicesDetail } from '../../../../../redux/features/administrativeArea/services/servicesThunk';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import DetailLayout from '../../../../../components/DetailLayout/detailLayout';
import { ButtonInButtonsBar } from '../../../../../components/ButtonsBar/buttonsBar';
import {
  closeModal,
  openModal,
} from '../../../../../redux/features/modal/modalSlice';
import { formTypes } from '../utils';
import { updateBreadcrumb } from '../../../../../redux/features/app/appSlice';
import FormServices from '../../../../forms/formServices';
import { Nav, NavItem } from 'design-react-kit';
import { EmptySection, NavLink } from '../../../../../components';
import ManageServices from '../modals/manageService';
import SearchCitizenModal from '../../../CitizensArea/Entities/SearchCitizenModal/searchCitizenModal';
import {
  CRUDActionsI,
  CRUDActionTypes,
  ItemsListI,
} from '../../../../../utils/common';
import { TableRowI } from '../../../../../components/Table/table';
import CitizensList, { CitizenI } from './citizensList';

const tabs = {
  INFO: 'info',
  CITIZENS: 'cittadini',
};

const ServicesDetails = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const serviceDetails: {
    info: { [key: string]: string };
    cittadini: CitizenI[];
  } = useAppSelector(selectServices)?.detail;
  const dettagliRef = useRef<HTMLSpanElement>(null);
  const cittadiniRef = useRef<HTMLSpanElement>(null);
  const [activeTab, setActiveTab] = useState<string>(tabs.INFO);
  const [content, setContent] = useState<React.ReactElement>();
  const [itemList, setItemList] = useState<ItemsListI | null>();
  const location = useLocation();

  useEffect(() => {
    if (serviceId && serviceDetails.info.nome) {
      dispatch(
        updateBreadcrumb([
          {
            label: 'Area Amministrativa',
            url: '/area-amministrativa',
            link: false,
          },
          {
            label: 'Servizi',
            url: '/area-amministrativa/servizi',
            link: true,
          },
          {
            label: serviceDetails.info.nome,
            url: `/area-amministrativa/servizi/${serviceId}`,
            link: false,
          },
        ])
      );
    }
  }, [serviceId]);

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

  const emptyButtons: ButtonInButtonsBar[] = [
    {
      size: 'xs',
      outline: true,
      color: 'primary',
      text: ' Carica lista cittadini',
      onClick: () => console.log('carica csv'),
    },
    {
      size: 'xs',
      color: 'primary',
      text: 'Aggiungi cittadino',
      onClick: () =>
        dispatch(
          openModal({
            id: 'search-citizen-modal',
          })
        ),
    },
  ];

  const onActionClick: CRUDActionsI = {
    [CRUDActionTypes.VIEW]: (td: TableRowI | string) => {
      navigate(
        `/area-amministrativa/progetti/${typeof td === 'string' ? td : td?.id}`
      );
      console.log(td);
    },
  };

  useEffect(() => {
    setItemList({
      title: 'Progetti associati',
      items: [
        {
          nome: 'Progetto 1',
          stato: 'active',
          actions: onActionClick,
          id: 'progetto1',
        },
        {
          nome: 'Progetto 2',
          stato: 'active',
          actions: onActionClick,
          id: 'progetto2',
        },
      ],
    });
  }, []);

  useEffect(() => {
    const locationSplit = location.pathname.split('/');
    if (locationSplit.length > 0) {
      switch (locationSplit[locationSplit.length - 1]) {
        case tabs.INFO:
          setActiveTab(tabs.INFO);
          setContent(<FormServices formDisabled />);
          break;
        case tabs.CITIZENS:
          setActiveTab(tabs.CITIZENS);
          setContent(
            serviceDetails?.cittadini.length === 0 ? (
              <EmptySection
                title='Questa sezione è ancora vuota'
                subtitle='Aggiungi i cittadini'
                buttons={emptyButtons}
              />
            ) : (
              <CitizensList citizens={serviceDetails.cittadini} />
            )
          );
          break;
        default:
          setActiveTab(tabs.INFO);
      }
      centerActiveItem();
    }
  }, [location, serviceDetails]);

  useEffect(() => {
    scrollTo(0, 0);
    centerActiveItem();
  }, [activeTab]);

  useEffect(() => {
    dispatch(GetServicesDetail(serviceId));
  }, []);

  const buttons: ButtonInButtonsBar[] = [
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
      text: 'Modifica',
      onClick: () =>
        dispatch(
          openModal({
            id: formTypes.SERVICES,
            payload: { title: 'Modifica servizio' },
          })
        ),
    },
  ];

  const buttonsCitizen: ButtonInButtonsBar[] = [
    {
      size: 'xs',
      outline: true,
      color: 'primary',
      text: 'Stampa questionario',
      iconForButton: 'it-print',
      iconColor: 'primary',
      onClick: () => console.log('stampa questionario'),
    },
    {
      size: 'xs',
      color: 'primary',
      text: 'Invia questionario a tutti',
      onClick: () => console.log('invia questionario a tutti'),
    },
  ];

  const nav = (
    <Nav tabs className='mb-5 overflow-hidden'>
      <NavItem>
        <span ref={dettagliRef}>
          <NavLink
            to={`/area-amministrativa/servizi/${serviceId}/${tabs.INFO}`}
            active={activeTab === tabs.INFO}
          >
            Dettagli servizio
          </NavLink>
        </span>
      </NavItem>
      <NavItem>
        <span ref={cittadiniRef}>
          <NavLink
            to={`/area-amministrativa/servizi/${serviceId}/${tabs.CITIZENS}`}
            active={activeTab === tabs.CITIZENS}
          >
            Cittadini
          </NavLink>
        </span>
      </NavItem>
    </Nav>
  );
  return (
    <div className='d-flex flex-row container'>
      <div className='d-flex flex-column w-100'>
        <div className='container'>
          <DetailLayout
            formButtons={
              activeTab === tabs.CITIZENS && serviceDetails.cittadini.length
                ? buttonsCitizen
                : buttons
            }
            titleInfo={{
              title: serviceDetails.info.nome,
              status: serviceDetails.info.stato,
              upperTitle: { icon: 'it-calendar', text: 'Servizio' },
            }}
            buttonsPosition='BOTTOM'
            itemsList={itemList}
            showItemsList={activeTab === tabs.INFO}
            nav={nav}
            goBackTitle='Elenco servizi'
          >
            {content}
          </DetailLayout>
          <ManageServices />
          <SearchCitizenModal
            onConfirmText='Aggiungi'
            onConfirmFunction={(
              newCitizen:
                | {
                    [key: string]:
                      | string
                      | number
                      | boolean
                      | Date
                      | string[]
                      | undefined;
                  }
                | undefined
            ) => {
              console.log('aggiungi cittadino', newCitizen);
              dispatch(closeModal());
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ServicesDetails;
