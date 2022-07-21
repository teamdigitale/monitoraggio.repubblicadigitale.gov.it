import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { formTypes } from '../../utils';
import { CRUDActionsI, CRUDActionTypes } from '../../../../../../utils/common';
import { TableRowI } from '../../../../../../components/Table/table';
import {
  closeModal,
  openModal,
} from '../../../../../../redux/features/modal/modalSlice';
import { useDispatch } from 'react-redux';
import DetailLayout from '../../../../../../components/DetailLayout/detailLayout';
import { useAppSelector } from '../../../../../../redux/hooks';
import { selectDevice } from '../../../../../../redux/features/app/appSlice';
import clsx from 'clsx';
import ManageHeadquarter from '../../../../../../components/AdministrativeArea/Entities/Headquarters/ManageHeadquarter/manageHeadquarter';
import HeadquarterDetailsContent from '../../../../../../components/AdministrativeArea/Entities/Headquarters/HeadquarterDetailsContent/HeadquarterDetailsContent';
import {
  GetHeadquarterDetails,
  HeadquarterFacilitator,
  RemoveHeadquarterFacilitator,
} from '../../../../../../redux/features/administrativeArea/headquarters/headquartersThunk';
import { selectHeadquarters } from '../../../../../../redux/features/administrativeArea/administrativeAreaSlice';
import ManageFacilitator from '../../../../../../components/AdministrativeArea/Entities/Headquarters/ManageFacilitator/ManageFacilitator';
import DeleteEntityModal from '../../../../../../components/AdministrativeArea/Entities/General/DeleteEntityModal/DeleteEntityModal';

const HeadquartersDetails = () => {
  const { mediaIsPhone } = useAppSelector(selectDevice);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { headquarterId, projectId, authorityId } = useParams();
  const headquarterfacilitators =
    useAppSelector(selectHeadquarters).detail?.facilitatoriSede;

  const onActionClick: CRUDActionsI = {
    [CRUDActionTypes.VIEW]: (td: TableRowI | string) => {
      navigate(
        `/area-amministrativa/utenti/${typeof td === 'string' ? td : td?.id}`
      );
    },
    [CRUDActionTypes.DELETE]: (td: TableRowI | string) => {
      dispatch(
        openModal({
          id: 'delete-entity',
          payload: {
            userCF: td,
            text: 'Confermi di voler eliminare questo facilitatore?',
            entity: 'facilitator',
          },
        })
      );
    },
  };

  useEffect(() => {
    if (headquarterId && projectId && authorityId)
      dispatch(GetHeadquarterDetails(headquarterId, authorityId, projectId));
  }, [headquarterId, projectId, authorityId]);

  const itemAccordionList = [
    {
      title: 'Facilitatori',
      items:
        headquarterfacilitators?.map((facilitator: HeadquarterFacilitator) => ({
          nome: `${facilitator.nome} ${facilitator.cognome}`,
          stato: facilitator.stato,
          actions: onActionClick,
          id: facilitator?.codiceFiscale,
        })) || [],
    },
  ];

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

      dispatch(GetHeadquarterDetails(headquarterId, authorityId, projectId));
    }
  };

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
            formButtons={[]}
            itemsAccordionList={itemAccordionList}
            buttonsPosition='TOP'
          >
            <HeadquarterDetailsContent />
          </DetailLayout>
          <ManageHeadquarter />
          <ManageFacilitator />
          <DeleteEntityModal
            onClose={() => dispatch(closeModal())}
            onConfirm={(payload) => {
              if (payload?.entity === 'facilitator') {
                removeFacilitator(payload?.userCF);
              }

              dispatch(closeModal());
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default HeadquartersDetails;
