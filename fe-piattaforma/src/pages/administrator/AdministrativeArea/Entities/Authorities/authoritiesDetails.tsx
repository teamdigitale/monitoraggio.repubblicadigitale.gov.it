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
import ManageGenericAuthority from '../modals/manageGenericAuthority';
import PeopleIcon from '/public/assets/img/people-icon.png';
import { useAppSelector } from '../../../../../redux/hooks';
import {
  selectDevice,
  setInfoIdsBreadcrumb,
} from '../../../../../redux/features/app/appSlice';
import clsx from 'clsx';
import FormAuthorities from '../../../../forms/formAuthorities';
import {
  selectAuthorities,
  setHeadquarterDetails,
} from '../../../../../redux/features/administrativeArea/administrativeAreaSlice';
import ManageDelegate from '../modals/manageDelegate';
import ManageReferal from '../modals/manageReferal';
import ManageHeadquarter from '../../../../../components/AdministrativeArea/Entities/Headquarters/ManageHeadquarter/manageHeadquarter';
import {
  GetPartnerAuthorityDetail,
  RemoveReferentDelegate,
  UserAuthorityRole,
} from '../../../../../redux/features/administrativeArea/authorities/authoritiesThunk';
import { RemoveAuthorityHeadquarter } from '../../../../../redux/features/administrativeArea/headquarters/headquartersThunk';
import DeleteEntityModal from '../../../../../components/AdministrativeArea/Entities/General/DeleteEntityModal/DeleteEntityModal';
import { CardStatusAction } from '../../../../../components';
import ManagePartnerAuthority from '../modals/managePartnerAuthority';

const AuthoritiesDetails = () => {
  const authorityDetails = useAppSelector(selectAuthorities)?.detail;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { projectId, authorityId } = useParams();
  const profiles = useAppSelector(selectAuthorities).detail.profili;
  const device = useAppSelector(selectDevice);

  useEffect(() => {
    dispatch(setHeadquarterDetails(null));
  }, []);

  useEffect(() => {
    if (authorityId && authorityDetails?.dettagliInfoEnte?.nome) {
      dispatch(
        setInfoIdsBreadcrumb({
          id: authorityId,
          nome: authorityDetails?.dettagliInfoEnte?.nome,
        })
      );
    }
  }, [authorityId, authorityDetails]);

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
      dispatch(
        openModal({
          id: 'delete-entity',
          payload: {
            entity: 'referent-delegate',
            cf: td,
            role: 'REPP',
            text: 'Confermi di voler eliminare questo referente?',
          },
        })
      );
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
      dispatch(
        openModal({
          id: 'delete-entity',
          payload: {
            entity: 'referent-delegate',
            cf: td,
            role: 'DEPP',
            text: 'Confermi di voler eliminare questo delegato?',
          },
        })
      );
    },
  };

  const onActionClickSede: CRUDActionsI = {
    [CRUDActionTypes.VIEW]: (td: TableRowI | string) => {
      projectId &&
        authorityId &&
        navigate(
          `/area-amministrativa/progetti/${projectId}/enti/${authorityId}/sedi/${td}`
        );
    },
    [CRUDActionTypes.DELETE]: (td: TableRowI | string) => {
      dispatch(
        openModal({
          id: 'delete-entity',
          payload: {
            entity: 'headquarter',
            headquarterId: td,
            text: 'Confermi di voler eliminare questa sede?',
          },
        })
      );
    },
  };

  if (projectId && authorityDetails) {
    itemAccordionList = [
      {
        title: 'Referenti',
        items:
          authorityDetails?.referentiEntePartner?.map(
            (ref: { [key: string]: string }) => ({
              // TODO: check when BE add codiceFiscale
              ...ref,
              id: ref.codiceFiscale,
              actions: onActionClickReferenti,
            })
          ) || [],
      },
      {
        title: 'Delegati',
        items:
          authorityDetails?.delegatiEntePartner?.map(
            (del: { [key: string]: string }) => ({
              ...del,
              id: del.codiceFiscale,
              actions: onActionClickDelegati,
            })
          ) || [],
      },
      {
        title: 'Sedi',
        items:
          authorityDetails?.sediEntePartner?.map(
            (sedi: { [key: string]: string }) => ({
              ...sedi,
              actions: onActionClickSede,
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
      onClick: () =>
        dispatch(
          openModal({
            id: 'delete-entity',
            payload: {
              entity: 'authority',
              text: 'Confermi di voler eliminare questo ente?',
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
            id: projectId ? 'ente-partner' : 'ente',
            payload: { title: 'Modifica ente' },
          })
        ),
    },
  ];

  const removeReferentDelegate = async (
    cf: string,
    role: UserAuthorityRole
  ) => {
    if (projectId && authorityId) {
      await dispatch(RemoveReferentDelegate(authorityId, projectId, cf, role));
      dispatch(GetPartnerAuthorityDetail(projectId, authorityId));
    }
    dispatch(closeModal());
  };

  const removeHeadquarter = async (headquarterId: string) => {
    if (projectId && authorityId) {
      await dispatch(
        RemoveAuthorityHeadquarter(authorityId, headquarterId, projectId)
      );

      dispatch(GetPartnerAuthorityDetail(projectId, authorityId));
    }

    dispatch(closeModal());
  };

  const handleOnProfileView = (profile: {
    id: string | number;
    profilo: string;
  }) => {
    const profilo = profile?.profilo.toLowerCase().trim();
    let redirectURL = '/area-amministrativa/';
    switch (profilo) {
      case 'ente gestore di programma':
        redirectURL = `${redirectURL}programmi/${profile?.id}/info`;
        break;
      case '':
      default:
        redirectURL = `${redirectURL}progetti/${profile?.id}/info`;
        break;
    }
    navigate(redirectURL, {
      replace: true,
    });
  };

  return (
    <div className={clsx('d-flex', 'flex-row', device.mediaIsPhone && 'mt-5')}>
      <div className='d-flex flex-column w-100'>
        <div>
          <DetailLayout
            titleInfo={{
              title: authorityDetails?.dettagliInfoEnte?.nome,
              status: authorityDetails?.dettagliInfoEnte?.stato,
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
          {authorityDetails?.profili?.length ? (
            <div className={clsx('my-5')}>
              <h5 className={clsx('primary-color', 'mb-4')}>Profili</h5>
              {authorityDetails?.profili.map((profile: any) => (
                <CardStatusAction
                  key={profile.id}
                  id={profile.id}
                  status={profile.stato}
                  title={profile.nome}
                  fullInfo={
                    profile.referenti.length === 0
                      ? { profilo: profile.profilo }
                      : {
                          profilo: profile.profilo,
                          ref:
                            profile.referenti.length > 1
                              ? `Referenti associati:${profile.referenti.length}`
                              : profile.referenti,
                        }
                  }
                  onActionClick={{
                    [CRUDActionTypes.VIEW]: () => handleOnProfileView(profile),
                  }}
                />
              ))}
            </div>
          ) : null}
          <ManageGenericAuthority />
          <ManagePartnerAuthority />
          <ManageDelegate />
          <ManageReferal />
          <ManageHeadquarter creation={true} enteType='partner' />
          <DeleteEntityModal
            onClose={() => dispatch(closeModal())}
            onConfirm={(payload) => {
              if (payload?.entity === 'referent-delegate')
                removeReferentDelegate(payload?.cf, payload?.role);
              if (payload?.entity === 'headquarter')
                removeHeadquarter(payload?.headquarterId);
              if (payload?.entity === 'authority') dispatch(closeModal());
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default AuthoritiesDetails;
