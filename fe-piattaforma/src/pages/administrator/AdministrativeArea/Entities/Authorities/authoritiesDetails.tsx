import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { selectDevice } from '../../../../../redux/features/app/appSlice';
import clsx from 'clsx';
import FormAuthorities from '../../../../forms/formAuthorities';

const AuthoritiesDetails = () => {
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

  const onActionClick: CRUDActionsI = {
    [CRUDActionTypes.VIEW]: (td: TableRowI | string) => {
      navigate(
        `/area-amministrativa/progetti/${typeof td === 'string' ? td : td?.id}`
      );
    },
  };

  useEffect(() => {
    setButtonsPosition('TOP');
    setCurrentForm(<FormAuthorities formDisabled />);
    setCorrectModal(<ManageGenericAuthority />);
    setDeleteText('Confermi di voler eliminare questo programma?');
    setItemList({
      title: 'Profili',
      items: [
        {
          nome: 'progetto',
          stato: 'active',
          actions: onActionClick,
          id: 'progetto',
        },
        {
          nome: 'progetto2',
          stato: 'active',
          actions: onActionClick,
          id: 'progetto2',
        },
      ],
    });
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
              id: formTypes.ENTE_PARTNER,
              payload: { title: 'Modifica programma' },
            })
          ),
      },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const device = useAppSelector(selectDevice);

  return (
    <div
      className={clsx(
        device.mediaIsPhone
          ? 'd-flex flex-row container'
          : 'd-flex flex-row mt-5 container'
      )}
    >
      <div className='d-flex flex-column w-100'>
        <div className='container'>
          <DetailLayout
            titleInfo={{
              title: 'Comune di Como',
              status: 'ATTIVO',
              upperTitle: { icon: [PeopleIcon], text: 'Ente' },
            }}
            formButtons={correctButtons}
            itemsList={itemList}
            buttonsPosition={buttonsPosition}
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

export default AuthoritiesDetails;
