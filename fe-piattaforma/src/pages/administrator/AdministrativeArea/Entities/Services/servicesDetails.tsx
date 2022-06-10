import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../../../../../redux/hooks';
import { selectServices } from '../../../../../redux/features/administrativeArea/administrativeAreaSlice';
import { GetServicesDetail } from '../../../../../redux/features/administrativeArea/services/servicesThunk';
import { useLocation, useParams } from 'react-router-dom';
import clsx from 'clsx';
import DetailLayout from '../../../../../components/DetailLayout/detailLayout';
import { ButtonInButtonsBar } from '../../../../../components/ButtonsBar/buttonsBar';
import { openModal } from '../../../../../redux/features/modal/modalSlice';
import { formTypes } from '../utils';
import { selectDevice } from '../../../../../redux/features/app/appSlice';
import FormServices from '../../../../forms/formServices';
import { Nav, NavItem } from 'design-react-kit';
import { EmptySection, NavLink } from '../../../../../components';
import ManageServices from '../modals/manageService';
import SearchCitizenModal from '../../../CitizensArea/Entities/SearchCitizenModal/searchCitizenModal';
import CitizensList from './citizensList';

const tabs = {
  INFO: 'info',
  CITIZENS: 'cittadini',
};

const ServicesDetails = () => {
  const { serviceId } = useParams();
  const dispatch = useDispatch();
  const serviceDetails: { info: { [key: string]: string }; cittadini: [] } =
    useAppSelector(selectServices)?.detail;
  const { mediaIsPhone } = useAppSelector(selectDevice);
  const dettagliRef = useRef<HTMLSpanElement>(null);
  const cittadiniRef = useRef<HTMLSpanElement>(null);
  const [activeTab, setActiveTab] = useState<string>(tabs.INFO);
  const [content, setContent] = useState<React.ReactElement>();
  const location = useLocation();

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

  useEffect(() => {
    const locationSplit = location.pathname.split('/');
    if (locationSplit.length > 0) {
      switch (locationSplit[locationSplit.length - 1]) {
        case tabs.INFO:
          setActiveTab(tabs.INFO);
          setContent(<FormServices />);
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

      text: ' Modifica',
      onClick: () =>
        dispatch(
          openModal({
            id: formTypes.SERVICES,
            payload: { title: 'Modifica servizio' },
          })
        ),
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
    <div
      className={clsx(
        mediaIsPhone
          ? 'd-flex flex-row container'
          : 'd-flex flex-row mt-5 container'
      )}
    >
      <div className='d-flex flex-column w-100'>
        <div className='container'>
          <DetailLayout
            formButtons={
              activeTab === tabs.CITIZENS && !serviceDetails.cittadini.length
                ? undefined
                : buttons
            }
            titleInfo={{
              title: serviceDetails.info.nome,
              status: serviceDetails.info.stato,
              upperTitle: { icon: 'it-calendar', text: 'Servizio' },
            }}
            buttonsPosition='BOTTOM'
            nav={nav}
          >
            {content}
          </DetailLayout>
          <ManageServices />
          <SearchCitizenModal
            onConfirmText='Aggiungi cittadino'
            onConfirmFunction={() => {
              console.log('banana');
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ServicesDetails;
