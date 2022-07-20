import React, { useEffect, useState } from 'react';
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
import ManageUsers from '../modals/manageUsers';
import { useAppSelector } from '../../../../../redux/hooks';
import {
  selectDevice,
  updateBreadcrumb,
} from '../../../../../redux/features/app/appSlice';
import FormUser from '../../../../forms/formUser';
import { selectUsers } from '../../../../../redux/features/administrativeArea/administrativeAreaSlice';
import clsx from 'clsx';
import { CardStatusAction } from '../../../../../components';

const UsersDetails = () => {
  const [deleteText, setDeleteText] = useState<string>('');
  const [currentForm, setCurrentForm] = useState<React.ReactElement>();
  const [currentModal, setCorrectModal] = useState<React.ReactElement>();
  const [itemList, setItemList] = useState<ItemsListI | null>();
  const [correctButtons, setCorrectButtons] = useState<ButtonInButtonsBar[]>(
    []
  );
  const [buttonsPosition, setButtonsPosition] = useState<'TOP' | 'BOTTOM'>(
    'TOP'
  );
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userDetails = useAppSelector(selectUsers)?.detail;
  const { dettaglioUtente: userInfo = {}, dettaglioRuolo: userRoles = [] } =
    userDetails;
  const { mediaIsDesktop /* mediaIsPhone */ } = useAppSelector(selectDevice);
  const headquarterInfo = userInfo?.authorityRef || undefined;
  const { entityId, userType, userId, projectId } = useParams();

  useEffect(() => {
    //if (userId) dispatch(GetUserDetails(userId));
    dispatch(
      updateBreadcrumb([
        {
          label: 'Area Amministrativa',
          url: '/area-amministrativa',
          link: false,
        },
        {
          label: 'Utenti',
          url: '/area-amministrativa/utenti',
          link: true,
        },
        {
          label: userId,
          url: `/area-amministrativa/utenti/${userId}`,
          link: false,
        },
      ])
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const onActionClick: CRUDActionsI = {
    [CRUDActionTypes.VIEW]: (td: TableRowI | string) => {
      navigate(
        `/area-amministrativa/progetti/${typeof td === 'string' ? td : td?.id}`
      );
    },
  };

  useEffect(() => {
    setButtonsPosition('TOP');
    setCurrentForm(<FormUser formDisabled />);
    setCorrectModal(<ManageUsers />);
    setDeleteText('Confermi di voler eliminare questo utente?');
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
    setCorrectButtons([
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
              id: getModalID(),
              payload: { title: getModalPayload() },
            })
          ),
      },
    ]);
  }, [mediaIsDesktop]);

  const getUpperTitle = () => {
    if (userType) {
      switch (userType) {
        case formTypes.DELEGATI:
          return formTypes.DELEGATO;
        case formTypes.REFERENTI:
          return formTypes.REFERENTE;
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
        default:
          return 'Modifica Utente';
      }
    }
  };

  const getUserStatus = () => {
    if (
      userType === formTypes.DELEGATI ||
      (userType === formTypes.REFERENTI && userRoles?.length)
    ) {
      const id = projectId || entityId;
      const entityRole = userRoles.filter(
        (role: { id: string | number }) =>
          role.id?.toString().toLowerCase() === id?.toString().toLowerCase()
      )[0];
      return entityRole?.statoP;
    }
    return userInfo?.stato;
  };

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
            formButtons={correctButtons}
            itemsList={itemList}
            buttonsPosition={buttonsPosition}
            goBackPath='/area-amministrativa/utenti'
          >
            {currentForm}
          </DetailLayout>
          {!(entityId || projectId) && userRoles?.length ? (
            <div className={clsx('my-5')}>
              <h5 className={clsx('primary-color', 'mb-4')}>
                Ruoli
              </h5>
              {userRoles.map((role: any) => (
                <CardStatusAction
                  key={role.id}
                  id={role.id}
                  status={role.stato}
                  title={role.nome}
                  subtitle={role.ruolo}
                  onActionClick={{
                    [CRUDActionTypes.VIEW]: () =>
                      navigate(`/area-amministrativa/programmi/${role?.id}`, {
                        replace: true,
                      }),
                  }}
                />
              ))}
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
            text={deleteText}
          />
        </div>
      </div>
    </div>
  );
};

export default UsersDetails;
