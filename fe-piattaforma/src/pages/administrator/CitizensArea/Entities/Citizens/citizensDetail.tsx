import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { GetEntityDetail } from '../../../../../redux/features/citizensArea/citizensAreaThunk';
import { useAppSelector } from '../../../../../redux/hooks';
import {
  //clearInfoForm,
  selectEntityDetail,
} from '../../../../../redux/features/citizensArea/citizensAreaSlice';
import CitizenQuestionari from './CitizenQuestionari';
import Sticky from 'react-sticky-el';
import { ButtonsBar } from '../../../../../components';
import FormCitizen from '../../../../forms/formCitizen';
import DetailLayout from '../../../../../components/DetailLayout/detailLayout';
import { openModal } from '../../../../../redux/features/modal/modalSlice';
import ManageCitizens from '../../../AdministrativeArea/Entities/modals/manageCitizens';
import { formTypes } from '../../../AdministrativeArea/Entities/utils';
import { updateBreadcrumb } from '../../../../../redux/features/app/appSlice';

const CitizensDetail: React.FC = () => {
  const dispatch = useDispatch();
  const { codFiscale } = useParams();
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
          label: `${citizen.info.name}`,
          url: `/area-amministrativa/${citizen.info.codiceFiscale}`,
          link: false,
        },
      ])
    );
  }, [citizen]);

  useEffect(() => {
    // dispatch(clearInfoForm());
    dispatch(GetEntityDetail(codFiscale));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const citizenButtons = [
    {
      outline: true,
      color: 'primary',
      text: 'Modifica',
      className: 'align-self-end mr-2',
      onClick: () => dispatch(
        openModal({
          id: formTypes.CITIZENS,
          payload: {
            title: 'Modifica cittadino',
          },
        })
      ),
    },

    {
      color: 'primary',
      iconForButton: 'it-plus',
      text: 'Compila questionario',
      className: 'align-self-end',
      outline: false,
      onClick: () => console.log('compila questionario'),
    },
  ];

  return (
    <div className='container pb-3'>
      <DetailLayout
        titleInfo={{ // TODO: update
          title: 'Mario Rossi', 
          status: 'ATTIVO',
          upperTitle: { icon: 'it-user', text: 'Cittadino' },
        }}
        buttonsPosition='TOP'
        goBackTitle='I miei cittadini'
      >
        <FormCitizen  info={citizen?.info} formDisabled/>
      </DetailLayout>
      <CitizenQuestionari questionari={citizen?.questionari} />
      <Sticky mode='bottom'>
        <ButtonsBar buttons={citizenButtons} />
      </Sticky>
      <ManageCitizens />
    </div>
  );
};

export default CitizensDetail;
