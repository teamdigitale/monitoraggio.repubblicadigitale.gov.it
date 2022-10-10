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
import { setInfoIdsBreadcrumb } from '../../../../../redux/features/app/appSlice';
import CitizenServices from './CitizenServices';

const CitizensDetail: React.FC = () => {
  const dispatch = useDispatch();
  const { idCittadino } = useParams();
  const citizen = useAppSelector(selectEntityDetail);

  useEffect(() => {
    // For breadcrumb
    if (idCittadino && citizen?.dettaglioCittadino?.nome) {
      dispatch(
        setInfoIdsBreadcrumb({
          id: idCittadino,
          nome:
            citizen?.dettaglioCittadino?.cognome +
            ' ' +
            citizen?.dettaglioCittadino?.nome,
        })
      );
    }
  }, [idCittadino, citizen]);

  useEffect(() => {
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
            citizen?.dettaglioCittadino?.cognome +
            ' ' +
            citizen?.dettaglioCittadino?.nome,
          status: '',
          upperTitle: { icon: 'it-user', text: 'Cittadino' },
        }}
        buttonsPosition='BOTTOM'
        goBackTitle='I miei cittadini'
        goBackPath='/area-cittadini'
        formButtons={citizenButtons}
      >
        <FormCitizen formDisabled />
      </DetailLayout>
      <CitizenServices servizi={citizen?.serviziCittadino} />
      <ManageCitizens
        idCitizen={idCittadino}
        onClose={() => dispatch(closeModal())}
      />
    </div>
  );
};

export default CitizensDetail;
