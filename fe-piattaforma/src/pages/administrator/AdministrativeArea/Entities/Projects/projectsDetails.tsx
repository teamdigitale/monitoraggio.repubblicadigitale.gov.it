import React, { useEffect, useRef, useState } from 'react';
import { Nav } from 'design-react-kit';
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
import ManageEntiPartner from '../modals/managePartnerAuthority';
import { useAppSelector } from '../../../../../redux/hooks';
import {
  selectDevice,
  updateBreadcrumb,
} from '../../../../../redux/features/app/appSlice';
import clsx from 'clsx';
import { selectProjects } from '../../../../../redux/features/administrativeArea/administrativeAreaSlice';
//import { GetProjectDetail } from '../../../../../redux/features/administrativeArea/projects/projectsThunk';
import { NavLink } from '../../../../../components';
import ProjectAccordionForm from '../../../../forms/formProjects/ProjectAccordionForm/ProjectAccordionForm';
import FormAuthorities from '../../../../forms/formAuthorities';
import ManagePartnerAuthority from '../modals/managePartnerAuthority';
import { DeleteEntity } from '../../../../../redux/features/administrativeArea/administrativeAreaThunk';

const tabs = {
  INFO: 'info',
  ENTE_GESTORE: 'ente-gestore-progetto',
  ENTI_PARTNER: 'enti-partner-progetto',
  SEDI: 'sedi',
};

export const buttonsPositioning = {
  TOP: 'top',
  BOTTOM: 'bottom',
};

const ProjectsDetails = () => {
  const { mediaIsDesktop, mediaIsPhone } = useAppSelector(selectDevice);
  const progetti = useAppSelector(selectProjects);
  const [deleteText, setDeleteText] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>(tabs.INFO);
  const [currentForm, setCurrentForm] = useState<React.ReactElement>();
  const [currentModal, setCorrectModal] = useState<React.ReactElement>();
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
  const { projectId } = useParams();
  const projectshortName =
    progetti.detail?.dettaglioProgetto?.generalInfo?.nomeBreve;

  useEffect(() => {
    if (projectId && projectshortName) {
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
            label: projectshortName,
            url: `/area-amministrativa/progetti/${projectId}`,
            link: false,
          },
        ])
      );
    }
  }, [projectId, projectshortName]);

  useEffect(() => {
    scrollTo(0, 0);
    centerActiveItem();
  }, [activeTab]);

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
    if (locationSplit.length > 0) {
      switch (locationSplit[locationSplit.length - 1]) {
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
      }
    }
  }, [location]);

  const replaceLastUrlSection = (tab: string): string => {
    const { pathname } = location;
    const splitLocation = pathname.split('/');
    splitLocation[splitLocation.length - 1] = tab;
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
          Ente gestore
        </NavLink>
      </li>
      <li ref={partnerRef}>
        <NavLink
          to={replaceLastUrlSection(tabs.ENTI_PARTNER)}
          active={activeTab === tabs.ENTI_PARTNER}
        >
          Enti partner
        </NavLink>
      </li>
      <li ref={sediRef}>
        <NavLink
          to={replaceLastUrlSection(tabs.SEDI)}
          active={activeTab === tabs.SEDI}
        >
          Sedi
        </NavLink>
      </li>
    </Nav>
  );

  const onActionClickEntiPartner: CRUDActionsI = {
    [CRUDActionTypes.VIEW]: (td: TableRowI | string) => {
      navigate(
        `/area-amministrativa/enti/${typeof td === 'string' ? td : td?.id}`
      );
    },
    [CRUDActionTypes.DELETE]: (td: TableRowI | string) => {
      console.log(td);
    },
  };

  const onActionClickSede: CRUDActionsI = {
    [CRUDActionTypes.VIEW]: (td: TableRowI | string) => {
      navigate(
        `/area-amministrativa/sedi/${typeof td === 'string' ? td : td?.id}`
      );
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

  useEffect(() => {
    const locationSplit = location.pathname.split('/');
    if (locationSplit.length === 5) {
      switch (locationSplit[4]) {
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
      }
    }
  }, [location]);

  useEffect(() => {
    switch (activeTab) {
      case tabs.INFO:
        setButtonsPosition('TOP');
        setCurrentForm(<ProjectAccordionForm />);
        setCorrectModal(<ManageProject />);
        setDeleteText('Confermi di voler eliminare questo programma?');
        setItemAccordionList([]);
        setItemList(null);
        setCorrectButtons([
          {
            size: 'xs',
            color: 'danger',
            outline: true,
            text: 'Termina progetto',
            onClick: () => console.log('termina progetto'),
          },
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
                  id: formTypes.PROGETTO,
                  payload: { title: 'Modifica progetto' },
                })
              ),
          },
        ]);
        break;
      case tabs.ENTE_GESTORE:
        setButtonsPosition('TOP');
        setDeleteText(
          'Confermi di voler eliminare questo gestore di progetto?'
        );
        setCurrentForm(
          <FormAuthorities
            formDisabled
            enteType={formTypes.ENTE_GESTORE_PROGETTO}
          />
        );
        setCorrectModal(<ManagePartnerAuthority />);
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
                  id: formTypes.ENTE_GESTORE_PROGETTO,
                  payload: { title: 'Modifica ente gestore progetto' },
                })
              ),
          },
        ]);
        break;
      case tabs.ENTI_PARTNER:
        // eslint-disable-next-line no-case-declarations
        const entiPartnerList =
          progetti.detail?.entiPartner?.map(
            (ente: {
              id: string;
              nome: string;
              ref: string;
              stato: string;
            }) => ({
              ...ente,
              fullInfo: { ref: ente.ref },
              actions: onActionClickEntiPartner,
            })
          ) || [];
        setButtonsPosition('BOTTOM');
        setCurrentForm(undefined);
        setCorrectModal(<ManageEntiPartner creation />);
        setItemList({
          items: [...entiPartnerList] || [],
        });
        setItemAccordionList(null);
        setCorrectButtons([
          {
            size: 'xs',
            color: 'primary',
            text: 'Carica lista enti partner',
            onClick: () => console.log('carica lista enti partner'),
          },
          {
            size: 'xs',
            outline: true,
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
        ]);
        break;
      case tabs.SEDI:
        // eslint-disable-next-line no-case-declarations
        const sediList =
          progetti.detail?.sedi?.map(
            (sede: { id: string; nome: string; stato: string }) => ({
              ...sede,
              actions: onActionClickSede,
            })
          ) || [];
        setButtonsPosition('BOTTOM');
        setCurrentForm(undefined);
        setCorrectModal(<ManageHeadquarter creation />);
        setItemList({
          items: [...sediList],
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
        break;
      default:
        return;
    }
  }, [activeTab, mediaIsDesktop, progetti]);

  return (
    <div
      className={clsx(
        mediaIsPhone
          ? 'd-flex flex-row mt-5container'
          : 'd-flex flex-row container'
      )}
    >
      <div className='d-flex flex-column w-100'>
        <div className='container'>
          <DetailLayout
            nav={nav}
            titleInfo={{
              title: 'Nome Progetto 1 breve',
              status: 'ATTIVO',
              upperTitle: { icon: 'it-user', text: 'Progetto' },
              subTitle: 'Programma 1 nome breve',
            }}
            formButtons={correctButtons}
            itemsAccordionList={itemAccordionList}
            itemsList={itemList}
            buttonsPosition={buttonsPosition}
            goBackTitle='Elenco progetti'
          >
            {currentForm}
          </DetailLayout>
          {currentModal ? currentModal : null}
          <ConfirmDeleteModal
            onConfirm={() => {
              console.log('confirm delete');
              projectId && dispatch(DeleteEntity(projectId, 'progetto'));
              dispatch(closeModal());
            }}
            onClose={() => {
              dispatch(closeModal());
            }}
            text={deleteText}
          />
        </div>
      </div>
    </div>
  );
};

export default ProjectsDetails;
