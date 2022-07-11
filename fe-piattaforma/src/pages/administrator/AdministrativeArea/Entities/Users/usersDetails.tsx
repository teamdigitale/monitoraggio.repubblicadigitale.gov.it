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
import { GetUserDetail } from '../../../../../redux/features/administrativeArea/user/userThunk';
import { selectUsers } from '../../../../../redux/features/administrativeArea/administrativeAreaSlice';

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
  const userInfo = useAppSelector(selectUsers)?.detail?.info;
  const { mediaIsDesktop /* mediaIsPhone */ } = useAppSelector(selectDevice);

  useEffect(() => {
    dispatch(GetUserDetail('1'));
  }, []);

  const headquarterInfo = userInfo?.authorityRef || undefined;

  const { entityId, userType } = useParams();

  useEffect(() => {
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
          label: entityId,
          url: `/area-amministrativa/utenti/${entityId}`,
          link: false,
        },
      ])
    );
  }, [entityId]);

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
              id: formTypes.USER,
              payload: { title: 'Modifica utente' },
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

  return (
    <div className='d-flex flex-row'>
      <div className='d-flex flex-column w-100'>
        <div>
          <DetailLayout
            titleInfo={{
              title: 'Antonio Rossi',
              status: 'ATTIVO',
              upperTitle: { icon: 'it-user', text: getUpperTitle() },
              subTitle: headquarterInfo,
              iconAvatar: true,
              name: userInfo?.name,
              surname: userInfo?.lastName,
            }}
            formButtons={correctButtons}
            itemsList={itemList}
            buttonsPosition={buttonsPosition}
            goBackPath='/area-amministrativa/utenti'
          >
            {currentForm}
          </DetailLayout>
          {currentModal ? currentModal : null}
          <ConfirmDeleteModal
            onConfirm={() => {
              console.log('confirm delete');
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
