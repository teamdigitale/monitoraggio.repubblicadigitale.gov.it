import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { entityStatus, formTypes, userRoles } from '../utils';
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
  selectPrograms,
  selectProjects,
  setHeadquarterDetails,
} from '../../../../../redux/features/administrativeArea/administrativeAreaSlice';
import ManageDelegate from '../modals/manageDelegate';
import ManageReferal from '../modals/manageReferal';
import ManageHeadquarter from '../../../../../components/AdministrativeArea/Entities/Headquarters/ManageHeadquarter/manageHeadquarter';
import {
  GetPartnerAuthorityDetail,
  RemovePartnerAuthority,
  RemoveReferentDelegate,
  UserAuthorityRole,
} from '../../../../../redux/features/administrativeArea/authorities/authoritiesThunk';
import { RemoveAuthorityHeadquarter } from '../../../../../redux/features/administrativeArea/headquarters/headquartersThunk';
import DeleteEntityModal from '../../../../../components/AdministrativeArea/Entities/General/DeleteEntityModal/DeleteEntityModal';
import {
  Accordion,
  CardStatusAction,
  EmptySection,
} from '../../../../../components';
import ManagePartnerAuthority from '../modals/managePartnerAuthority';
import useGuard from '../../../../../hooks/guard';
import { GetProjectDetail } from '../../../../../redux/features/administrativeArea/projects/projectsThunk';
import { GetProgramDetail } from '../../../../../redux/features/administrativeArea/programs/programsThunk';
import IconNote from '/public/assets/img/it-note-primary.png';

const AuthoritiesDetails = () => {
  const authorityDetails = useAppSelector(selectAuthorities)?.detail;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { entityId, projectId, authorityId, authorityType } = useParams();
  const profiles = useAppSelector(selectAuthorities).detail.profili;
  const device = useAppSelector(selectDevice);
  const { hasUserPermission } = useGuard();
  const projectDetail =
    useAppSelector(selectProjects).detail?.dettagliInfoProgetto;
  const { nome: projectName, stato: projectState } = projectDetail || {};
  const programDetails =
    useAppSelector(selectPrograms).detail?.dettagliInfoProgramma || {};

  useEffect(() => {
    dispatch(setHeadquarterDetails(null));
    // For breadcrumb
    if (!projectName && projectId) {
      dispatch(GetProjectDetail(projectId));
    }
    if (entityId && !programDetails?.nomeBreve)
      dispatch(GetProgramDetail(entityId));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // For breadcrumb
    if (entityId && programDetails?.nomeBreve) {
      dispatch(
        setInfoIdsBreadcrumb({
          id: entityId,
          nome: programDetails?.nomeBreve,
        })
      );
    }
    if (projectId && projectName) {
      dispatch(
        setInfoIdsBreadcrumb({
          id: projectId,
          nome: projectName,
        })
      );
    }
    if (authorityId && authorityDetails?.dettagliInfoEnte?.nome) {
      dispatch(
        setInfoIdsBreadcrumb({
          id: authorityId,
          nome: authorityDetails?.dettagliInfoEnte?.nome,
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authorityId, authorityDetails, projectName]);

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
      if (entityId && projectId) {
        navigate(
          `/area-amministrativa/programmi/${entityId}/progetti/${projectId}/${authorityType}/${authorityId}/${userRoles.REPP}/${td}`
        );
      } else {
        projectId &&
          navigate(
            `/area-amministrativa/progetti/${projectId}/${authorityType}/${authorityId}/${userRoles.REPP}/${td}`
          );
      }
    },
    [CRUDActionTypes.DELETE]: (td: TableRowI | string) => {
      dispatch(
        openModal({
          id: 'delete-entity',
          payload: {
            entity: 'referent-delegate',
            cf: td,
            role: 'REPP',
            text: 'Confermi di voler disassociare questo referente?',
          },
        })
      );
    },
  };

  // Function need to be checked
  const onActionClickDelegati: CRUDActionsI = {
    [CRUDActionTypes.VIEW]: (td: TableRowI | string) => {
      if (entityId && projectId) {
        navigate(
          `/area-amministrativa/programmi/${entityId}/progetti/${projectId}/${authorityType}/${authorityId}/${userRoles.DEPP}/${td}`
        );
      } else {
        projectId &&
          navigate(
            `/area-amministrativa/progetti/${projectId}/${authorityType}/${authorityId}/${userRoles.DEPP}/${td}`
          );
      }
    },
    [CRUDActionTypes.DELETE]: (td: TableRowI | string) => {
      dispatch(
        openModal({
          id: 'delete-entity',
          payload: {
            entity: 'referent-delegate',
            cf: td,
            role: 'DEPP',
            text: 'Confermi di voler disassociare questo delegato?',
          },
        })
      );
    },
  };

  const onActionClickSede: CRUDActionsI = {
    [CRUDActionTypes.VIEW]: (td: TableRowI | string) => {
      projectId && authorityId && navigate(`sedi/${td}`);
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
              ...ref,
              id: ref?.id,
              actions:
                ref.stato !== entityStatus.ATTIVO ||
                projectState === entityStatus.TERMINATO
                  ? {
                      [CRUDActionTypes.VIEW]:
                        onActionClickReferenti[CRUDActionTypes.VIEW],
                    }
                  : {
                      [CRUDActionTypes.VIEW]:
                        onActionClickReferenti[CRUDActionTypes.VIEW],
                      [CRUDActionTypes.DELETE]: hasUserPermission([
                        'del.ref_del.partner',
                      ])
                        ? onActionClickReferenti[CRUDActionTypes.DELETE]
                        : undefined,
                    },
            })
          ) || [],
      },
      {
        title: 'Delegati',
        items:
          authorityDetails?.delegatiEntePartner?.map(
            (del: { [key: string]: string }) => ({
              ...del,
              id: del?.id,
              actions:
                del.stato !== entityStatus.ATTIVO ||
                projectState === entityStatus.TERMINATO
                  ? {
                      [CRUDActionTypes.VIEW]:
                        onActionClickDelegati[CRUDActionTypes.VIEW],
                    }
                  : {
                      [CRUDActionTypes.VIEW]:
                        onActionClickDelegati[CRUDActionTypes.VIEW],
                      [CRUDActionTypes.DELETE]: hasUserPermission([
                        'del.ref_del.partner',
                      ])
                        ? onActionClickDelegati[CRUDActionTypes.DELETE]
                        : undefined,
                    },
            })
          ) || [],
      },
      {
        title: 'Sedi',
        items:
          authorityDetails?.sediEntePartner?.map(
            (sedi: { [key: string]: string }) => ({
              ...sedi,
              actions: sedi.associatoAUtente
                ? {
                    [CRUDActionTypes.VIEW]:
                      onActionClickSede[CRUDActionTypes.VIEW],
                    [CRUDActionTypes.DELETE]:
                      sedi.stato !== entityStatus.ATTIVO ||
                      projectState === entityStatus.TERMINATO
                        ? undefined
                        : hasUserPermission(['del.sede.partner'])
                        ? onActionClickSede[CRUDActionTypes.DELETE]
                        : undefined,
                  }
                : {},
            })
          ) || [],
      },
    ];
  }

  const deleteButton: ButtonInButtonsBar = {
    size: 'xs',
    color: 'primary',
    outline: true,
    buttonClass: 'btn-secondary',
    text: 'Elimina',
    disabled:
      authorityDetails?.dettagliInfoEnte?.statoEnte !==
        entityStatus.NON_ATTIVO || projectState === entityStatus.TERMINATO,
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
  };

  const editButton: ButtonInButtonsBar = {
    size: 'xs',
    color: 'primary',
    text: 'Modifica',
    onClick: () =>
      dispatch(
        openModal({
          id: 'ente',
          payload: { title: 'Modifica ente' },
        })
      ),
  };

  let buttons: ButtonInButtonsBar[] =
    authorityDetails?.dettagliInfoEnte?.statoEnte !== entityStatus.TERMINATO &&
    projectState !== entityStatus.TERMINATO &&
    hasUserPermission(['upd.card.enti'])
      ? [editButton]
      : [];

  if (projectId) {
    buttons = [];
    if (hasUserPermission(['del.ente.partner'])) {
      buttons.push(deleteButton);
    }
    if (
      authorityDetails?.dettagliInfoEnte?.statoEnte !==
        entityStatus.TERMINATO &&
      projectState !== entityStatus.TERMINATO &&
      hasUserPermission(['upd.ente.partner'])
    ) {
      buttons.push(editButton);
    }
  }

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

  const removeAuthority = async (authorityId: string, projectId?: string) => {
    if (projectId) {
      await dispatch(RemovePartnerAuthority(authorityId, projectId));
    }

    dispatch(closeModal());
    navigate(-1);
  };

  const getAccordionCTA = (title?: string) => {
    switch (title) {
      case 'Referenti':
      case 'Delegati':
        return authorityDetails?.dettagliInfoEnte?.statoEnte !==
          entityStatus.TERMINATO &&
          projectState !== entityStatus.TERMINATO &&
          hasUserPermission(['add.ref_del.partner'])
          ? {
              cta: `Aggiungi ${title}`,
              ctaAction: () =>
                dispatch(
                  openModal({
                    id:
                      title === 'Referenti'
                        ? formTypes.REFERENTE
                        : formTypes.DELEGATO,
                    payload: {
                      title: `Aggiungi ${title}`,
                    },
                  })
                ),
            }
          : {
              cta: null,
              ctaAction: () => ({}),
            };
      case 'Sedi':
        return authorityDetails?.dettagliInfoEnte?.statoEnte !==
          entityStatus.TERMINATO &&
          projectState !== entityStatus.TERMINATO &&
          hasUserPermission(['add.sede.partner'])
          ? {
              cta: `Aggiungi Sede`,
              ctaAction: () =>
                dispatch(
                  openModal({
                    id: formTypes.SEDE,
                    payload: {
                      title: `Aggiungi Sede`,
                    },
                  })
                ),
            }
          : {
              cta: null,
              ctaAction: () => ({}),
            };
      default:
        return {
          cta: null,
          ctaAction: () => ({}),
        };
    }
  };

  return (
    <div
      className={clsx(
        'd-flex',
        'flex-row',
        'container',
        device.mediaIsPhone && 'mt-5'
      )}
    >
      <div className='d-flex flex-column w-100 container'>
        <div>
          <DetailLayout
            titleInfo={{
              title: authorityDetails?.dettagliInfoEnte?.nome,
              status: authorityDetails?.dettagliInfoEnte?.stato,
              upperTitle: { icon: PeopleIcon, text: 'Ente' },
              subTitle: projectDetail?.nomeBreve || projectDetail?.nome || '',
            }}
            enteIcon
            formButtons={buttons}
            itemsList={itemsList}
            // itemsAccordionList={itemAccordionList}
            buttonsPosition='BOTTOM'
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
          {itemAccordionList?.length
            ? itemAccordionList?.map((item, index) => (
                <Accordion
                  key={index}
                  title={item.title || ''}
                  totElem={item.items.length}
                  cta={getAccordionCTA(item.title).cta}
                  onClickCta={getAccordionCTA(item.title)?.ctaAction}
                  lastBottom={index === itemAccordionList.length - 1}
                  detailAccordion
                >
                  {item.items?.length ? (
                    item.items.map((cardItem) => (
                      <CardStatusAction
                        key={cardItem.id}
                        title={`${cardItem.cognome ? cardItem.cognome : ''} ${
                          cardItem.nome
                        }`.trim()}
                        status={cardItem.stato}
                        id={cardItem.id}
                        fullInfo={cardItem.fullInfo}
                        cf={cardItem.codiceFiscale}
                        onActionClick={cardItem.actions}
                      />
                    ))
                  ) : (
                    <EmptySection
                      title={`Non sono presenti ${item.title?.toLowerCase()} ${
                        item.title?.toLowerCase() === 'sedi'
                          ? `associate.`
                          : `associati.`
                      }`}
                      icon={IconNote}
                      withIcon
                      noMargin
                    />
                  )}
                </Accordion>
              ))
            : null}
          {authorityDetails?.profili?.length ? (
            <div className={clsx('my-5')}>
              <h5 className={clsx('primary-color', 'mb-4')}>Profili</h5>
              {authorityDetails?.profili.map((profile: any) => (
                <CardStatusAction
                  key={profile.id}
                  id={profile.id}
                  status={profile.stato}
                  title={!profile.tipoEntita ? profile.nome : undefined}
                  fullInfo={
                    !profile.referenti?.length
                      ? {
                          progetto:
                            profile.tipoEntita?.toLowerCase() === 'progetto'
                              ? profile.nome
                              : undefined,
                          programma:
                            profile.tipoEntita?.toLowerCase() === 'programma'
                              ? profile.nome
                              : undefined,
                          profilo: profile.profilo,
                        }
                      : {
                          progetto:
                            profile.tipoEntita?.toLowerCase() === 'progetto'
                              ? profile.nome
                              : undefined,
                          programma:
                            profile.tipoEntita?.toLowerCase() === 'programma'
                              ? profile.nome
                              : undefined,
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
          <ManageGenericAuthority legend="form modifica ente, i campi con l'asterisco sono obbligatori" />
          <ManagePartnerAuthority legend="form modifica ente partner, i campi con l'asterisco sono obbligatori" />
          <ManageDelegate
            legend="form aggiunta delegato, i campi con l'asterisco sono obbligatori"
            creation
          />
          <ManageReferal
            legend="form aggiunta referente, i campi con l'asterisco sono obbligatori"
            creation
          />
          <ManageHeadquarter
            legend="form aggiunta sede, i campi con l'asterisco sono obbligatori"
            creation
            enteType='partner'
          />
          <DeleteEntityModal
            onClose={() => dispatch(closeModal())}
            onConfirm={(payload) => {
              if (payload?.entity === 'referent-delegate')
                removeReferentDelegate(payload?.cf, payload?.role);
              if (payload?.entity === 'headquarter')
                removeHeadquarter(payload?.headquarterId);
              if (payload?.entity === 'authority')
                authorityId && removeAuthority(authorityId, projectId);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default AuthoritiesDetails;
