import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
import ManageGenericAuthority from '../modals/manageGenericAuthority';
import PeopleIcon from '/public/assets/img/people-icon.png';
import { useAppSelector } from '../../../../../redux/hooks';
import {
  selectDevice,
  updateBreadcrumb,
} from '../../../../../redux/features/app/appSlice';
import clsx from 'clsx';
import FormAuthorities from '../../../../forms/formAuthorities';
import { selectAuthorities } from '../../../../../redux/features/administrativeArea/administrativeAreaSlice';
import ManageDelegate from '../modals/manageDelegate';
import ManageReferal from '../modals/manageReferal';
import ManageHeadquarter from '../../../../../components/AdministrativeArea/Entities/Headquarters/ManageHeadquarter/manageHeadquarter';

const AuthoritiesDetails = () => {
  const authorityDetails =
    useAppSelector(selectAuthorities)?.detail.dettagliInfoEnte;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { projectId, authorityId } = useParams();
  const profiles = useAppSelector(selectAuthorities).detail.profili;
  const device = useAppSelector(selectDevice);

  useEffect(() => {
    if (authorityDetails?.nomeBreve && authorityId) {
      dispatch(
        updateBreadcrumb([
          {
            label: 'Area Amministrativa',
            url: '/area-amministrativa',
            link: false,
          },
          {
            label: 'Enti',
            url: '/area-amministrativa/enti',
            link: true,
          },
          {
            label: authorityDetails?.nomeBreve,
            url: `/area-amministrativa/enti/${authorityId}`,
            link: false,
          },
        ])
      );
    }
  }, [authorityId]);

  const onActionClick: CRUDActionsI = {
    [CRUDActionTypes.VIEW]: (td: TableRowI | string) => {
      navigate(`/area-amministrativa/progetti/${td}`);
    },
  };

  const itemsList = {
    title: 'Profili',
    items: profiles
      ? profiles.map((profile: any) => ({
          nome: profile.nome,
          stato: profile.stato,
          actions: onActionClick,
          id: profile.id,
        }))
      : [],
  };

  let itemAccordionList: ItemsListI[] = [];

  // Function need to be checked
  const onActionClickReferenti: CRUDActionsI = {
    [CRUDActionTypes.VIEW]: (td: TableRowI | string) => {
      navigate(
        `/area-amministrativa/${formTypes.REFERENTI}/${
          typeof td === 'string' ? td : td?.codiceFiscale
        }`
      );
    },
    [CRUDActionTypes.DELETE]: (td: TableRowI | string) => {
      // dispatch(RemoveReferentDelegate())
      console.log(td);
    },
  };

  // Function need to be checked
  const onActionClickDelegati: CRUDActionsI = {
    [CRUDActionTypes.VIEW]: (td: TableRowI | string) => {
      navigate(
        `/area-amministrativa/${formTypes.DELEGATI}/${
          typeof td === 'string' ? td : td?.codiceFiscale
        }`
      );
    },
    [CRUDActionTypes.DELETE]: (td: TableRowI | string) => {
      console.log(td);
    },
  };

  if (projectId && authorityDetails) {
    itemAccordionList = [
      {
        title: 'Referenti',
        items:
          authorityDetails?.referentiEnteGestore?.map(
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
          authorityDetails?.delegatiEnteGestore?.map(
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
          authorityDetails?.sediGestoreProgetto?.map(
            (sedi: { [key: string]: string }) => ({
              ...sedi,
            })
          ) || [],
      },
    ];
  }

  const buttons: ButtonInButtonsBar[] = [
    {
      size: 'xs',
      color: 'primary',
      outline: true,
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
            id: formTypes.ENTE_PARTNER,
            payload: { title: 'Modifica programma' },
          })
        ),
    },
  ];

  return (
    <div className={clsx('d-flex', 'flex-row', device.mediaIsPhone && 'mt-5')}>
      <div className='d-flex flex-column w-100'>
        <div>
          <DetailLayout
            titleInfo={{
              title: authorityDetails?.nome,
              status: authorityDetails?.stato,
              upperTitle: { icon: PeopleIcon, text: 'Ente' },
            }}
            formButtons={buttons}
            itemsList={itemsList}
            itemsAccordionList={itemAccordionList}
            buttonsPosition='TOP'
            goBackPath={
              projectId
                ? `/area-amministrativa/progetti/${projectId}/enti-partner`
                : '/area-amministrativa/enti'
            }
          >
            <FormAuthorities
              formDisabled
              enteType={projectId ? formTypes.ENTE_PARTNER : ''}
            />
          </DetailLayout>
          <ManageGenericAuthority />
          <ManageDelegate />
          <ManageReferal />
          <ManageHeadquarter />
          <ConfirmDeleteModal
            onConfirm={() => {
              console.log('confirm delete');
              dispatch(closeModal());
            }}
            onClose={() => {
              dispatch(closeModal());
            }}
            text='Confermi di voler eliminare questo ente?'
          />
        </div>
      </div>
    </div>
  );
};

export default AuthoritiesDetails;
