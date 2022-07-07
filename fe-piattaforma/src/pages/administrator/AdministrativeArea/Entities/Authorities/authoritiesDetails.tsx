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

const AuthoritiesDetails = () => {
  const authorityDetails =
    useAppSelector(selectAuthorities)?.detail.dettagliInfoEnte;
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

  const { idEnte } = useParams();
  const profiles = useAppSelector(selectAuthorities).detail.profili;

  useEffect(() => {
    if (authorityDetails?.nomeBreve && idEnte) {
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
            url: `/area-amministrativa/programmi/${idEnte}`,
            link: false,
          },
        ])
      );
    }
  }, [idEnte]);

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
      items: profiles
        ? profiles.map((profile: any) => ({
            nome: profile.nome,
            stato: profiles.stato,
            actions: onActionClick,
            id: profiles.id,
          }))
        : [],
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
  }, [profiles]);

  const device = useAppSelector(selectDevice);

  return (
    <div className={clsx('d-flex', 'flex-row', device.mediaIsPhone && 'mt-5')}>
      <div className='d-flex flex-column w-100'>
        <div>
          <DetailLayout
            titleInfo={{
              title: authorityDetails?.nome,
              status: authorityDetails?.stato,
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
