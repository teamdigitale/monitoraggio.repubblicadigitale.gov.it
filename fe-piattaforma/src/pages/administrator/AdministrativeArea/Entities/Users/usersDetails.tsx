import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Button, Icon } from 'design-react-kit';
import clsx from 'clsx';
import { entityStatus, formTypes } from '../utils';
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
import ManageUsers from '../modals/manageUsers';
import { useAppSelector } from '../../../../../redux/hooks';
import {
  selectDevice,
  setInfoIdsBreadcrumb,
} from '../../../../../redux/features/app/appSlice';
import FormUser from '../../../../forms/formUser';
import {
  selectAuthorities,
  selectHeadquarters,
  selectPrograms,
  selectUsers,
  setUserDetails,
} from '../../../../../redux/features/administrativeArea/administrativeAreaSlice';
import { CardStatusAction } from '../../../../../components';
import ManageFacilitator from '../../../../../components/AdministrativeArea/Entities/Headquarters/ManageFacilitator/ManageFacilitator';
import FormFacilitator from '../../../../../components/AdministrativeArea/Entities/Headquarters/FormFacilitator/FormFacilitator';
import { formFieldI } from '../../../../../utils/formHelper';
import AddUserRole from '../modals/addUserRole';
import {
  GetUserDetails,
  UserDeleteRole,
} from '../../../../../redux/features/administrativeArea/user/userThunk';
import useGuard from '../../../../../hooks/guard';
import { GetProgramDetail } from '../../../../../redux/features/administrativeArea/programs/programsThunk';
import {
  GetHeadquarterDetails,
  RemoveHeadquarterFacilitator,
} from '../../../../../redux/features/administrativeArea/headquarters/headquartersThunk';
import DeleteEntityModal from '../../../../../components/AdministrativeArea/Entities/General/DeleteEntityModal/DeleteEntityModal';
import DetailLayout from '../../../../../components/DetailLayout/detailLayout';
import {
  RemoveReferentDelegate,
  UserAuthorityRole,
} from '../../../../../redux/features/administrativeArea/authorities/authoritiesThunk';
import { GetPartnerAuthorityDetail } from '../../../../../redux/features/administrativeArea/authorities/authoritiesThunk';
import ManageDelegate from '../modals/manageDelegate';
import ManageReferal from '../modals/manageReferal';

export const roles = {
  VOL: 'VOL',
  FAC: 'FAC',
  REG: 'REG',
  DEG: 'DEG',
  REGP: 'REGP',
  DEGP: 'DEGP',
  REPP: 'REPP',
  DEPP: 'DEPP',
  USR: 'utenti',
};

const UsersDetails = () => {
  const [currentForm, setCurrentForm] = useState<React.ReactElement>();
  const [itemList, setItemList] = useState<ItemsListI | null>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userDetails = useAppSelector(selectUsers)?.detail;
  const { dettaglioUtente: userInfo = {}, dettaglioRuolo: userRoles = [] } =
    userDetails;
  const { mediaIsDesktop } = useAppSelector(selectDevice);
  const headquarterInfo = userInfo?.authorityRef || undefined;
  const {
    entityId,
    userRole,
    userId,
    projectId,
    headquarterId,
    authorityId,
    authorityType,
  } = useParams();
  const { hasUserPermission } = useGuard();
  const location = useLocation();
  const programName =
    useAppSelector(selectPrograms).detail?.dettagliInfoProgramma?.nomeBreve;
  const headquarterDetails = useAppSelector(selectHeadquarters).detail;
  const headquarterName = headquarterDetails?.dettagliInfoSede?.nome;
  const projectName = headquarterDetails?.dettaglioProgetto?.nomeBreve;
  const authorityName =
    useAppSelector(selectAuthorities)?.detail?.dettagliInfoEnte?.nome;

  useEffect(() => {
    // For breadcrumb
    if (!programName && entityId) {
      dispatch(GetProgramDetail(entityId));
    }
    if (headquarterId && authorityId && projectId) {
      dispatch(GetHeadquarterDetails(headquarterId, authorityId, projectId));
    }
    if (!authorityName && projectId && authorityId) {
      dispatch(GetPartnerAuthorityDetail(projectId, authorityId));
    }
  }, []);

  useEffect(() => {
    // For breadcrumb
    if (userId && userInfo?.nome && userRoles) {
      if (projectId && projectName) {
        dispatch(
          setInfoIdsBreadcrumb({
            id: projectId,
            nome: projectName,
          })
        );
      }
      if (authorityId && authorityName) {
        dispatch(
          setInfoIdsBreadcrumb({
            id: authorityId,
            nome: authorityName,
          })
        );
      }
      if (headquarterId && headquarterName) {
        dispatch(
          setInfoIdsBreadcrumb({
            id: headquarterId,
            nome: headquarterName,
          })
        );
      }
      if (entityId && programName) {
        dispatch(
          setInfoIdsBreadcrumb({
            id: entityId,
            nome: programName,
          })
        );
      }
      dispatch(
        setInfoIdsBreadcrumb({
          id: entityId,
          nome: userRoles?.filter(
            (rol: { [key: string]: formFieldI['value'] }) =>
              rol.id?.toString() === entityId
          )[0]?.nome,
        })
      );
      dispatch(
        setInfoIdsBreadcrumb({
          id: userId,
          nome: userInfo?.nome + ' ' + userInfo?.cognome,
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    userId,
    userInfo,
    userRoles,
    headquarterName,
    projectName,
    authorityName,
  ]);

  const onActionClick: CRUDActionsI = {
    [CRUDActionTypes.VIEW]: (td: TableRowI | string) => {
      navigate(
        `/area-amministrativa/progetti/${typeof td === 'string' ? td : td?.id}`
      );
    },
  };

  useEffect(() => {
    if (userRole === roles.FAC || userRole === roles.VOL) {
      setCurrentForm(<FormFacilitator formDisabled />);
    } else {
      setCurrentForm(<FormUser formDisabled />);
    }
  }, [userRole]);

  useEffect(() => {
    setItemList({
      title: 'Ruoli',
      items: [
        {
          nome: 'ruolo1',
          stato: 'active',
          actions: onActionClick,
          id: 'ruolo1',
        },
        {
          nome: 'ruolo2',
          stato: 'active',
          actions: onActionClick,
          id: 'ruolo2',
        },
      ],
    });
  }, [mediaIsDesktop, userInfo]);

  const getUpperTitle = () => {
    if (userRole) {
      switch (userRole) {
        case roles.DEG:
        case roles.DEGP:
        case roles.DEPP:
          return formTypes.DELEGATO;
        case roles.REG:
        case roles.REGP:
        case roles.REPP:
          return formTypes.REFERENTE;
        case roles.FAC:
          return formTypes.FACILITATORE;
        case roles.VOL:
          return formTypes.VOLONTARIO;
        default:
          'utente';
      }
    }
    return 'utente';
  };

  const getModalID = () => {
    if (userRole) {
      switch (userRole) {
        case roles.DEG:
        case roles.DEGP:
        case roles.DEPP:
          return formTypes.DELEGATO;
        case roles.REG:
        case roles.REGP:
        case roles.REPP:
          return formTypes.REFERENTE;
        case roles.FAC:
        case roles.VOL:
          return formTypes.FACILITATORE;
        default:
          return formTypes.USER;
      }
    }
  };

  const getModalPayload = () => {
    if (userRole) {
      switch (userRole) {
        case roles.DEG:
        case roles.DEGP:
        case roles.DEPP:
          return 'Modifica Delegato';
        case roles.REG:
        case roles.REGP:
        case roles.REPP:
          return 'Modifica Referente';
        case roles.FAC:
        case roles.VOL:
          return 'Modifica Facilitatore';
        default:
          return 'Modifica Utente';
      }
    }
  };

  const includeModalByRole = () => {
    if (userRole) {
      switch (userRole) {
        case roles.DEG:
        case roles.DEGP:
        case roles.DEPP:
          return <ManageDelegate />;
        case roles.REG:
        case roles.REGP:
        case roles.REPP:
          return <ManageReferal />;
        case roles.FAC:
        case roles.VOL:
          return <ManageFacilitator />;
        default:
          return <ManageUsers />;
      }
    }
  };

  const getUserRoleStatus = () => {
    if (
      userRole &&
      Object.values(roles).includes(userRole) &&
      userRoles?.length
    ) {
      const id = projectId || entityId;
      const entityRole = userRoles.filter(
        (role: { id: string | number; codiceRuolo: string }) =>
          role.id?.toString().toLowerCase() === id?.toString().toLowerCase() &&
          role.codiceRuolo === userRole
      )[0];

      return entityRole?.stato;
    }
    return userInfo?.stato;
  };

  const deleteButton: ButtonInButtonsBar = {
    size: 'xs',
    color: 'primary',
    outline: true,
    buttonClass: 'btn-secondary',
    text: 'Elimina',
    disabled: getUserRoleStatus() === entityStatus.ATTIVO,
    onClick: () =>
      dispatch(
        openModal({
          id: 'delete-entity',
          payload: {
            text: 'Confermi di volere eliminare questo utente?',
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
          id: getModalID(),
          payload: {
            title: getModalPayload(),
            userId: userId || userInfo?.id,
          },
        })
      ),
  };

  const getButtons = () => {
    const buttons: ButtonInButtonsBar[] = [];
    if (userRole === roles.USR && hasUserPermission(['del.utente'])) {
      buttons.push(deleteButton);
    } else if (userRole === roles.FAC || userRole === roles.VOL) {
      buttons.push(deleteButton);
    } else if (
      authorityType &&
      userRole &&
      [
        roles.REG,
        roles.REGP,
        roles.REPP,
        roles.DEG,
        roles.DEGP,
        roles.DEPP,
      ].includes(userRole) &&
      getUserRoleStatus() !== entityStatus.TERMINATO
    ) {
      switch (authorityType) {
        case formTypes.ENTE_GESTORE_PROGRAMMA: {
          if (hasUserPermission(['del.ref_del.gest.prgm'])) {
            buttons.push(deleteButton);
          }
          break;
        }
        case formTypes.ENTE_GESTORE_PROGETTO: {
          if (hasUserPermission(['del.ref_del.gest.prgt'])) {
            buttons.push(deleteButton);
          }
          break;
        }
        case formTypes.ENTI_PARTNER: {
          if (hasUserPermission(['del.ref_del.partner'])) {
            buttons.push(deleteButton);
          }
          break;
        }
        default:
          break;
      }
    }
    if (userRole === roles.USR && hasUserPermission(['upd.anag.utenti'])) {
      buttons.push(editButton);
    } else if (userRole === roles.FAC || userRole === roles.VOL) {
      buttons.push(editButton);
    } else if (
      authorityType &&
      userRole &&
      [
        roles.REG,
        roles.REGP,
        roles.REPP,
        roles.DEG,
        roles.DEGP,
        roles.DEPP,
      ].includes(userRole) &&
      getUserRoleStatus() !== entityStatus.TERMINATO
    ) {
      switch (authorityType) {
        case formTypes.ENTE_GESTORE_PROGRAMMA: {
          if (hasUserPermission(['add.ref_del.gest.prgm'])) {
            buttons.push(editButton);
          }
          break;
        }
        case formTypes.ENTE_GESTORE_PROGETTO: {
          if (hasUserPermission(['add.ref_del.gest.prgt'])) {
            buttons.push(editButton);
          }
          break;
        }
        case formTypes.ENTI_PARTNER: {
          if (hasUserPermission(['add.ref_del.partner'])) {
            buttons.push(editButton);
          }
          break;
        }
        default:
          break;
      }
    }
    return buttons;
  };

  const removeFacilitator = async (userCF: string) => {
    if (userCF && headquarterId && projectId && authorityId) {
      await dispatch(
        RemoveHeadquarterFacilitator(
          userCF,
          authorityId,
          projectId,
          headquarterId
        )
      );
    }
  };

  const removeReferentDelegate = async (
    cf: string,
    role: UserAuthorityRole
  ) => {
    if (authorityId) {
      projectId &&
        (await dispatch(
          RemoveReferentDelegate(authorityId, projectId, cf, role)
        ));
      entityId &&
        (await dispatch(
          RemoveReferentDelegate(authorityId, entityId, cf, role)
        ));
    }
  };

  const onConfirmDelete = async (role?: string) => {
    if (userRole === roles.FAC || userRole === roles.VOL) {
      await removeFacilitator(userInfo.codiceFiscale);
      dispatch(closeModal());
      dispatch(setUserDetails(null));
      navigate(-1);
    } else if (
      userRole &&
      [
        roles.REG,
        roles.REGP,
        roles.REPP,
        roles.DEG,
        roles.DEGP,
        roles.DEPP,
      ].includes(userRole)
    ) {
      await removeReferentDelegate(
        userInfo.codiceFiscale,
        userRole as UserAuthorityRole
      );
      dispatch(closeModal());
      dispatch(setUserDetails(null));
      navigate(-1);
    } else if (role && userId) {
      await dispatch(UserDeleteRole({ idUtente: userId, ruolo: role }));
      await dispatch(GetUserDetails(userId));
      dispatch(closeModal());
    }
  };

  return (
    <div className='d-flex flex-row container'>
      <div className='d-flex flex-column w-100 container'>
        <div>
          <DetailLayout
            titleInfo={{
              title: userInfo?.nome + ' ' + userInfo?.cognome,
              status: getUserRoleStatus(),
              upperTitle: { icon: 'it-user', text: getUpperTitle() },
              subTitle: headquarterInfo,
              iconAvatar: true,
              name: userInfo?.nome,
              surname: userInfo?.cognome,
            }}
            formButtons={getButtons()}
            itemsList={itemList}
            buttonsPosition='BOTTOM'
            goBackPath='/area-amministrativa/utenti'
            goBackTitle={
              location.pathname === `/area-amministrativa/utenti/${userId}`
                ? 'Elenco utenti'
                : 'Torna indietro'
            }
          >
            {currentForm}
          </DetailLayout>
          {!(entityId || projectId) &&
          userRoles?.length &&
          userRole === roles.USR ? (
            <div className={clsx('my-5')}>
              {hasUserPermission(['add.del.ruolo.utente']) ? (
                <div className={clsx('w-100', 'position-relative')}>
                  <h5 className={clsx('primary-color', 'mb-4')}>Ruoli</h5>
                  <div className='d-flex cta-buttons'>
                    <Button
                      onClick={() => dispatch(openModal({ id: 'AddUserRole' }))}
                      className='d-flex justify-content-between'
                      type='button'
                    >
                      <Icon
                        color='primary'
                        icon='it-plus-circle'
                        size='sm'
                        className='mr-2'
                        aria-label='Aggiungi'
                      />
                      Aggiungi ruolo
                    </Button>
                  </div>
                </div>
              ) : null}
              {userRoles.map((role: any) => {
                let roleActions = {};
                if (role.id) {
                  roleActions = {
                    [CRUDActionTypes.VIEW]: () =>
                      navigate(`/area-amministrativa/programmi/${role?.id}`, {
                        replace: true,
                      }),
                  };
                } else {
                  roleActions = hasUserPermission(['add.del.ruolo.utente'])
                    ? {
                        [CRUDActionTypes.DELETE]: () => {
                          dispatch(
                            openModal({
                              id: 'delete-entity',
                              payload: {
                                entity: 'role',
                                text: 'Confermi di volere eliminare questo ruolo?',
                                role: role.codiceRuolo || role.nome,
                              },
                            })
                          );
                        },
                      }
                    : {};
                }
                return (
                  <CardStatusAction
                    key={role.id}
                    id={role.id || role.codiceRuolo || role.nome}
                    status={role.statoP}
                    title={role.nome}
                    fullInfo={role.stato && { ruoli: role.ruolo }}
                    onActionClick={roleActions}
                  />
                );
              })}
            </div>
          ) : null}
          <DeleteEntityModal
            onClose={() => dispatch(closeModal())}
            onConfirm={(payload) => onConfirmDelete(payload?.role)}
          />
          <AddUserRole />
          {includeModalByRole()}
        </div>
      </div>
    </div>
  );
};

export default UsersDetails;
