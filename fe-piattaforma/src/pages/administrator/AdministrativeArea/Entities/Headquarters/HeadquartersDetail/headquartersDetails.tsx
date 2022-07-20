import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { formTypes } from '../../utils';
import {
  CRUDActionsI,
  CRUDActionTypes,
  ItemsListI,
} from '../../../../../../utils/common';
import { TableRowI } from '../../../../../../components/Table/table';
import { ButtonInButtonsBar } from '../../../../../../components/ButtonsBar/buttonsBar';
import {
  closeModal,
  openModal,
} from '../../../../../../redux/features/modal/modalSlice';
import { useDispatch } from 'react-redux';
import DetailLayout from '../../../../../../components/DetailLayout/detailLayout';
import ConfirmDeleteModal from '../../modals/confirmDeleteModal';
import { useAppSelector } from '../../../../../../redux/hooks';
import { selectDevice } from '../../../../../../redux/features/app/appSlice';
import clsx from 'clsx';
import ManageHeadquarter from '../../../../../../components/AdministrativeArea/Entities/Headquarters/ManageHeadquarter/manageHeadquarter';
import HeadquarterDetailsContent from '../../../../../../components/AdministrativeArea/Entities/Headquarters/HeadquarterDetailsContent/HeadquarterDetailsContent';
import {
  GetHeadquarterDetails,
  HeadquarterFacilitator,
} from '../../../../../../redux/features/administrativeArea/headquarters/headquartersThunk';
import { selectHeadquarters } from '../../../../../../redux/features/administrativeArea/administrativeAreaSlice';
import ManageFacilitator from '../../../../../../components/AdministrativeArea/Entities/Headquarters/ManageFacilitator/ManageFacilitator';

const HeadquartersDetails = () => {
  const { mediaIsDesktop, mediaIsPhone } = useAppSelector(selectDevice);
  const [itemAccordionList, setItemAccordionList] = useState<
    ItemsListI[] | null
  >();
  const [correctButtons, setCorrectButtons] = useState<ButtonInButtonsBar[]>(
    []
  );
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { entityId } = useParams();
  const headquarterfacilitators =
    useAppSelector(selectHeadquarters).detail?.facilitatoriSede;

  const onActionClick: CRUDActionsI = {
    [CRUDActionTypes.VIEW]: (td: TableRowI | string) => {
      navigate(
        `/area-amministrativa/utenti/${typeof td === 'string' ? td : td?.id}`
      );
    },
  };

  useEffect(() => {
    if (entityId) dispatch(GetHeadquarterDetails(entityId));
  }, [entityId]);

  useEffect(() => {
    setItemAccordionList([
      {
        title: 'Facilitatori',
        items:
          headquarterfacilitators?.map(
            (facilitator: HeadquarterFacilitator) => ({
              nome: `${facilitator.nome} ${facilitator.cognome}`,
              stato: facilitator.stato,
              actions: onActionClick,
              id: facilitator.id,
            })
          ) || [],
      },
    ]);
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
              id: formTypes.SEDE,
              payload: { title: 'Modifica sede' },
            })
          ),
      },
    ]);
  }, [mediaIsDesktop, headquarterfacilitators]);

  return (
    <div
      className={clsx(
        mediaIsPhone
          ? 'd-flex flex-row container'
          : 'd-flex flex-row mt-5 container'
      )}
    >
      <div className='d-flex flex-column w-100'>
        <div className='container'>
          <DetailLayout
            titleInfo={{
              title: 'Sede 1',
              status: 'ATTIVO',
              upperTitle: { icon: 'it-map-marker-plus', text: formTypes.SEDE },
              subTitle: 'Programma 1 nome breve',
            }}
            formButtons={correctButtons}
            itemsAccordionList={itemAccordionList}
            buttonsPosition='TOP'
          >
            <HeadquarterDetailsContent />
          </DetailLayout>
          <ManageHeadquarter />
          <ManageFacilitator />
          <ConfirmDeleteModal
            onConfirm={() => {
              dispatch(closeModal());
            }}
            onClose={() => {
              dispatch(closeModal());
            }}
            text='Confermi di voler eliminare questa sede?'
          />
        </div>
      </div>
    </div>
  );
};

export default HeadquartersDetails;
