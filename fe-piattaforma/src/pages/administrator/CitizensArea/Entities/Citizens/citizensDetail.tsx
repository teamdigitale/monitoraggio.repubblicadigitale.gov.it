import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { GetEntityDetail } from '../../../../../redux/features/citizensArea/citizensAreaThunk';
import { useAppSelector } from '../../../../../redux/hooks';
import {
  //clearInfoForm,
  selectEntityDetail,
} from '../../../../../redux/features/citizensArea/citizensAreaSlice';
import FormCitizen from '../../../../forms/formCitizen';
import DetailLayout from '../../../../../components/DetailLayout/detailLayout';
import {
  closeModal,
  openModal,
} from '../../../../../redux/features/modal/modalSlice';
import ManageCitizens from '../../../AdministrativeArea/Entities/modals/manageCitizens';
import { formTypes } from '../../../AdministrativeArea/Entities/utils';
import { updateBreadcrumb } from '../../../../../redux/features/app/appSlice';
import CitizenServices from './CitizenServices';

const CitizensDetail: React.FC = () => {
  const dispatch = useDispatch();
  const { idCittadino } = useParams();
  const citizen = useAppSelector(selectEntityDetail);

  useEffect(() => {
    dispatch(
      updateBreadcrumb([
        {
          label: 'Area Cittadini',
          url: '/area-cittadini',
          link: false,
        },
        {
          label: 'I miei cittadini',
          url: '/area-cittadini/',
          link: true,
        },
        {
          label: `${citizen?.dettaglioCittadino?.name}`,
          url: `/area-amministrativa/${citizen?.dettaglioCittadino?.idCittadino}`,
          link: false,
        },
      ])
    );
  }, [citizen]);

  useEffect(() => {
    // dispatch(clearInfoForm());
    dispatch(GetEntityDetail(idCittadino));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const citizenButtons = [
    {
      color: 'primary',
      text: 'Modifica',
      className: 'align-self-end mr-2',
      onClick: () =>
        dispatch(
          openModal({
            id: formTypes.CITIZENS,
            payload: {
              title: 'Modifica cittadino',
            },
          })
        ),
    },
  ];

  return (
    <div className='container pb-3'>
      <DetailLayout
        titleInfo={{
          title:
            citizen?.dettaglioCittadino?.nome +
            ' ' +
            citizen?.dettaglioCittadino?.cognome,
          status: '',
          upperTitle: { icon: 'it-user', text: 'Cittadino' },
        }}
        buttonsPosition='TOP'
        goBackTitle='I miei cittadini'
        goBackPath='/area-cittadini'
        formButtons={citizenButtons}
      >
        <FormCitizen formDisabled />
      </DetailLayout>
      <CitizenServices servizi={citizen?.serviziCittadino} />{' '}
      <ManageCitizens
        idCitizen={idCittadino}
        onClose={() => dispatch(closeModal())}
      />
    </div>
  );
};

export default CitizensDetail;
