import React from 'react';
import { dayCode } from '../../../../../pages/administrator/AdministrativeArea/Entities/utils';
import AddressForm from '../../../../General/AddressForm/AddressForm';
import { AddressInfoI } from '../AccordionAddressList/AccordionAddress/AccordionAddress';
import OpenDaysSelect from '../OpenDaysSelect/OpenDaysSelect';

interface AddressInfoFormI {
  addressInfo: AddressInfoI;
  onAddressInfoChange: (addressInfo: AddressInfoI) => void;
}

const AddressInfoForm: React.FC<AddressInfoFormI> = ({
  addressInfo,
  onAddressInfoChange,
}) => {
  const addressChangeHandler = (
    address: string,
    province: string,
    state: string,
    city: string,
    CAP: string
  ) => {
    onAddressInfoChange({
      ...addressInfo,
      indirizzoSede: {
        ...addressInfo.indirizzoSede,
        via: address,
        comune: city,
        provincia: province,
        regione: state,
        cap: CAP,
      },
    });
  };

  const openDayAddHandler = (dayIndex: number) => {
    const newTimeSlots = { ...addressInfo.fasceOrarieAperturaIndirizzoSede };
    newTimeSlots[`${dayCode[dayIndex]}OrarioApertura1`] = '09:00';
    newTimeSlots[`${dayCode[dayIndex]}OrarioChiusura1`] = '12:00';
    newTimeSlots[`${dayCode[dayIndex]}OrarioApertura2`] = '14:00';
    newTimeSlots[`${dayCode[dayIndex]}OrarioChiusura2`] = '18:00';

    onAddressInfoChange({
      ...addressInfo,
      fasceOrarieAperturaIndirizzoSede: {
        ...newTimeSlots,
      },
    });
  };

  const openDayRemoveHandler = (dayIndex: number) => {
    const newTimeSlots = { ...addressInfo.fasceOrarieAperturaIndirizzoSede };
    newTimeSlots[`${dayCode[dayIndex]}OrarioApertura1`] = null;
    newTimeSlots[`${dayCode[dayIndex]}OrarioChiusura1`] = null;
    newTimeSlots[`${dayCode[dayIndex]}OrarioApertura2`] = null;
    newTimeSlots[`${dayCode[dayIndex]}OrarioChiusura2`] = null;

    onAddressInfoChange({
      ...addressInfo,
      fasceOrarieAperturaIndirizzoSede: { ...newTimeSlots },
    });
  };

  const timeChangeHandler = (dayIndex: number, timeSpan: string[][]) => {
    const newTimeSlots = { ...addressInfo.fasceOrarieAperturaIndirizzoSede };
    newTimeSlots[`${dayCode[dayIndex]}OrarioApertura1`] = timeSpan[0][0];
    newTimeSlots[`${dayCode[dayIndex]}OrarioChiusura1`] = timeSpan[0][1];
    newTimeSlots[`${dayCode[dayIndex]}OrarioApertura2`] = timeSpan[1][0];
    newTimeSlots[`${dayCode[dayIndex]}OrarioChiusura2`] = timeSpan[1][1];

    onAddressInfoChange({
      ...addressInfo,
      fasceOrarieAperturaIndirizzoSede: { ...newTimeSlots },
    });
  };
  return (
    <div className='row px-5'>
      <div className='col'>
        <AddressForm
          address={addressInfo.indirizzoSede.via}
          province={addressInfo.indirizzoSede.provincia}
          state={addressInfo.indirizzoSede.regione}
          city={addressInfo.indirizzoSede.comune}
          CAP={addressInfo.indirizzoSede.cap}
          onAddressChange={(address, province, state, city, CAP) =>
            addressChangeHandler(address, province, state, city, CAP)
          }
        />
        <OpenDaysSelect
          openDays={addressInfo.fasceOrarieAperturaIndirizzoSede || {}}
          onAddOpenDay={openDayAddHandler}
          onRemoveOpenDay={openDayRemoveHandler}
          onTimeChange={timeChangeHandler}
        />
      </div>
    </div>
  );
};

export default AddressInfoForm;
