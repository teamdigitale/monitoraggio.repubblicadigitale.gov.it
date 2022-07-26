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
  RemoveAuthorityHeadquarter,
  RemoveHeadquarterFacilitator,
} from '../../../../../../redux/features/administrativeArea/headquarters/headquartersThunk';
import {
  selectHeadquarters,
  setUserDetails,
} from '../../../../../../redux/features/administrativeArea/administrativeAreaSlice';
import ManageFacilitator from '../../../../../../components/AdministrativeArea/Entities/Headquarters/ManageFacilitator/ManageFacilitator';
import DeleteEntityModal from '../../../../../../components/AdministrativeArea/Entities/General/DeleteEntityModal/DeleteEntityModal';
import { ButtonInButtonsBar } from '../../../../../../components/ButtonsBar/buttonsBar';

const HeadquartersDetails = () => {
  const { mediaIsPhone } = useAppSelector(selectDevice);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { headquarterId, projectId, authorityId } = useParams();
  const headquarterfacilitators =
    useAppSelector(selectHeadquarters).detail?.facilitatoriSede;
  const headquarterDetails =
    useAppSelector(selectHeadquarters).detail?.dettagliInfoSede;

  const programDetails =
    useAppSelector(selectHeadquarters).detail?.dettaglioProgetto;

  const onActionClick: CRUDActionsI = {
    [CRUDActionTypes.VIEW]: (td: TableRowI | string) => {
      navigate(
        `/area-amministrativa/progetti/${projectId}/${authorityId}/${formTypes.FACILITATORE}/${td}`
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
    if (headquarterId && projectId && authorityId) {
      dispatch(GetHeadquarterDetails(headquarterId, authorityId, projectId));
      dispatch(setUserDetails(null));
    }
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

  const buttons: ButtonInButtonsBar[] = [
    {
      size: 'xs',
      outline: true,
      color: 'primary',
      text: 'Elimina',
      disabled: headquarterDetails?.stato === 'ATTIVO',
      onClick: () =>
        dispatch(
          openModal({
            id: 'delete-entity',
            payload: {
              entity: 'headquarter',
              text: 'Confermi di volere eliminare questa sede?',
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
            id: formTypes.SEDE,
            payload: { title: 'Modifica Sede' },
          })
        ),
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
      dispatch(setUserDetails(null));
    }
  };

  const removeHeadquarter = async () => {
    if (projectId && authorityId && headquarterId) {
      await dispatch(
        RemoveAuthorityHeadquarter(authorityId, headquarterId, projectId)
      );
    }

    navigate(-1);

    dispatch(closeModal());
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
              title: headquarterDetails?.nome,
              status: headquarterDetails?.stato,
              upperTitle: { icon: 'it-map-marker-plus', text: formTypes.SEDE },
              subTitle: programDetails?.nomeBreve,
            }}
            formButtons={buttons}
            itemsAccordionList={itemAccordionList}
            buttonsPosition='TOP'
          >
            <HeadquarterDetailsContent />
          </DetailLayout>
          <ManageHeadquarter />
          <ManageFacilitator creation={true} />
          <DeleteEntityModal
            onClose={() => dispatch(closeModal())}
            onConfirm={(payload) => {
              if (payload?.entity === 'facilitator') {
                removeFacilitator(payload?.userCF);
              }

              if (payload?.entity === 'headquarter') {
                removeHeadquarter();
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
