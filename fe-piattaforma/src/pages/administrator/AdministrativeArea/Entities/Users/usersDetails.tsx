import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Icon } from 'design-react-kit';
import clsx from 'clsx';
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
import ManageUsers from '../modals/manageUsers';
import { useAppSelector } from '../../../../../redux/hooks';
import {
  selectDevice,
  setInfoIdsBreadcrumb,
} from '../../../../../redux/features/app/appSlice';
import FormUser from '../../../../forms/formUser';
import { selectUsers } from '../../../../../redux/features/administrativeArea/administrativeAreaSlice';
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

const UsersDetails = () => {
  const [currentForm, setCurrentForm] = useState<React.ReactElement>();
  const [currentModal, setCorrectModal] = useState<React.ReactElement>();
  const [itemList, setItemList] = useState<ItemsListI | null>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userDetails = useAppSelector(selectUsers)?.detail;
  const { dettaglioUtente: userInfo = {}, dettaglioRuolo: userRoles = [] } =
    userDetails;
  const { mediaIsDesktop /* mediaIsPhone */ } = useAppSelector(selectDevice);
  const headquarterInfo = userInfo?.authorityRef || undefined;
  const { entityId, userType, userId, projectId } = useParams();
  const { hasUserPermission } = useGuard();

  useEffect(() => {
    //if (userId) dispatch(GetUserDetails(userId));
    if (userId && userInfo?.nome && userRoles) {
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
  }, [userId, userInfo, userRoles]);

  const onActionClick: CRUDActionsI = {
    [CRUDActionTypes.VIEW]: (td: TableRowI | string) => {
      navigate(
        `/area-amministrativa/progetti/${typeof td === 'string' ? td : td?.id}`
      );
    },
  };

  useEffect(() => {
    if (
      userType === formTypes.FACILITATORE ||
      userType === formTypes.VOLONTARIO
    ) {
      setCurrentForm(<FormFacilitator formDisabled />);
      setCorrectModal(<ManageFacilitator />);
    } else {
      setCurrentForm(<FormUser formDisabled />);
      setCorrectModal(<ManageUsers />);
    }
  }, [userType]);

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
    if (userType) {
      switch (userType) {
        case formTypes.DELEGATI:
          return formTypes.DELEGATO;
        case formTypes.REFERENTI:
          return formTypes.REFERENTE;
        case formTypes.FACILITATORE:
          return formTypes.FACILITATORE;
        case formTypes.VOLONTARIO:
          return formTypes.VOLONTARIO;
        default:
          'utente';
      }
    }
    return 'utente';
  };

  const getModalID = () => {
    if (userType) {
      switch (userType) {
        case formTypes.DELEGATO:
          return formTypes.DELEGATO;
        case formTypes.REFERENTE:
          return formTypes.REFERENTE;
        case formTypes.FACILITATORE:
        case formTypes.VOLONTARIO:
          return formTypes.FACILITATORE;
        default:
          return formTypes.USER;
      }
    }
  };

  const getModalPayload = () => {
    if (userType) {
      switch (userType) {
        case formTypes.DELEGATI:
          return 'Modifica Delegato';
        case formTypes.REFERENTI:
          return 'Modifica Referente';
        case formTypes.FACILITATORE:
        case formTypes.VOLONTARIO:
          return 'Modifica Facilitatore';
        default:
          return 'Modifica Utente';
      }
    }
  };

  const getUserStatus = () => {
    if (
      userType === formTypes.DELEGATI ||
      (userType === formTypes.REFERENTI && userRoles?.length) ||
      userType === formTypes.FACILITATORE ||
      userType === formTypes.VOLONTARIO
    ) {
      const id = projectId || entityId;
      const entityRole = userRoles.filter(
        (role: { id: string | number }) =>
          role.id?.toString().toLowerCase() === id?.toString().toLowerCase()
      )[0];
      return entityRole?.stato;
    }
    return userInfo?.stato;
  };

  const handleDeleteUserRole = async (ruolo: string) => {
    if (userId) {
      const res = await dispatch(UserDeleteRole({ cfUtente: userId, ruolo }));
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (res) {
        dispatch(GetUserDetails(userId));
      }
    }
  };

  const buttons: ButtonInButtonsBar[] = hasUserPermission(['upd.anag.utenti'])
    ? [
        {
          size: 'xs',
          color: 'primary',
          outline: true,
          text: 'Elimina',
          disabled: getUserStatus() === 'ATTIVO',
          onClick: () => dispatch(openModal({ id: 'confirmDeleteModal' })),
        },
        {
          size: 'xs',
          color: 'primary',
          text: 'Modifica',
          onClick: () =>
            dispatch(
              openModal({
                id: getModalID(),
                payload: {
                  title: getModalPayload(),
                  codiceFiscale: userId,
                },
              })
            ),
        },
      ]
    : [
        {
          size: 'xs',
          color: 'primary',
          outline: true,
          text: 'Elimina',
          disabled: getUserStatus() === 'ATTIVO',
          onClick: () => dispatch(openModal({ id: 'confirmDeleteModal' })),
        },
      ];

  return (
    <div className='d-flex flex-row'>
      <div className='d-flex flex-column w-100'>
        <div>
          <DetailLayout
            titleInfo={{
              title: userInfo?.nome + ' ' + userInfo?.cognome,
              status: getUserStatus(),
              upperTitle: { icon: 'it-user', text: getUpperTitle() },
              subTitle: headquarterInfo,
              iconAvatar: true,
              name: userInfo?.nome,
              surname: userInfo?.cognome,
            }}
            formButtons={buttons}
            itemsList={itemList}
            buttonsPosition={'BOTTOM'}
            goBackPath='/area-amministrativa/utenti'
          >
            {currentForm}
          </DetailLayout>
          {!(entityId || projectId) &&
          userRoles?.length &&
          userType === 'utenti' ? (
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
                          handleDeleteUserRole(role.codiceRuolo || role.nome);
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
          {currentModal ? currentModal : null}
          <ConfirmDeleteModal
            onConfirm={() => {
              dispatch(closeModal());
            }}
            onClose={() => {
              dispatch(closeModal());
            }}
            text={'Confermi di voler eliminare questo utente?'}
          />
          <AddUserRole />
        </div>
      </div>
    </div>
  );
};

export default UsersDetails;
