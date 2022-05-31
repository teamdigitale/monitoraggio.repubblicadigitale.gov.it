import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { GetEntityDetail } from '../../../../../redux/features/citizensArea/citizensAreaThunk';
import { useAppSelector } from '../../../../../redux/hooks';
import {
  //clearInfoForm,
  selectEntityDetail,
} from '../../../../../redux/features/citizensArea/citizensAreaSlice';
import CitizenForm from './CitizenForm';
import CitizenQuestionari from './CitizenQuestionari';
import Sticky from 'react-sticky-el';
import { ButtonsBar } from '../../../../../components';

const CitizensDetail: React.FC = () => {
  const dispatch = useDispatch();
  const { codFiscale } = useParams();
  const citizen = useAppSelector(selectEntityDetail);
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
    },

    {
      color: 'primary',
      iconForButton: 'it-plus',
      text: 'Compila questionario',
      className: 'align-self-end',
      outline: false,
    },
  ];

  return (
    <>
      <CitizenForm info={citizen?.info} />
      <CitizenQuestionari questionari={citizen?.questionari} />
      <Sticky mode='bottom'>
        <ButtonsBar buttons={citizenButtons} />
      </Sticky>
    </>
  );
};

export default CitizensDetail;
