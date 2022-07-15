import React from 'react';
import { dayOfWeek } from '../../../../../pages/administrator/AdministrativeArea/Entities/utils';
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
        cap: CAP,
      },
    });
  };

  const openDayAddHandler = (dayIndex: number) => {
    onAddressInfoChange({
      ...addressInfo,
      fasceOrarieAperturaIndirizzoSede: [
        ...addressInfo.fasceOrarieAperturaIndirizzoSede,
        {
          giornoAperturaSede: dayOfWeek[dayIndex].slice(0, 3).toUpperCase(),
          orarioAperturaSede: '09:00',
          orarioChiusuraSede: '12:00',
        },
        {
          giornoAperturaSede: dayOfWeek[dayIndex].slice(0, 3).toUpperCase(),
          orarioAperturaSede: '14:00',
          orarioChiusuraSede: '18:00',
        },
      ],
    });
  };

  const openDayRemoveHandler = (dayIndex: number) => {
    onAddressInfoChange({
      ...addressInfo,
      fasceOrarieAperturaIndirizzoSede:
        addressInfo.fasceOrarieAperturaIndirizzoSede.filter(
          (day) =>
            !dayOfWeek[dayIndex]
              .toUpperCase()
              .includes(day.giornoAperturaSede.toUpperCase())
        ),
    });
  };

  const timeChangeHandler = (dayIndex: number, timeSpan: string[][]) => {
    onAddressInfoChange({
      ...addressInfo,
      fasceOrarieAperturaIndirizzoSede: [
        ...addressInfo.fasceOrarieAperturaIndirizzoSede.filter(
          (day) =>
            !dayOfWeek[dayIndex]
              .toUpperCase()
              .includes(day.giornoAperturaSede.toUpperCase())
        ),
        ...addressInfo.fasceOrarieAperturaIndirizzoSede
          .filter((day) =>
            dayOfWeek[dayIndex]
              .toUpperCase()
              .includes(day.giornoAperturaSede.toUpperCase())
          )
          .map((day, i) => ({
            ...day,
            orarioAperturaSede: timeSpan[i][0],
            orarioChiusuraSede: timeSpan[i][1],
          })),
      ],
    });
  };

  return (
    <div className='row px-5'>
      <div className='col'>
        <AddressForm
          address={addressInfo.indirizzoSede.via}
          province={addressInfo.indirizzoSede.provincia}
          city={addressInfo.indirizzoSede.comune}
          CAP={addressInfo.indirizzoSede.cap}
          onAddressChange={(address, province, city, CAP) =>
            addressChangeHandler(address, province, city, CAP)
          }
        />
        <OpenDaysSelect
          openDays={addressInfo.fasceOrarieAperturaIndirizzoSede}
          onAddOpenDay={openDayAddHandler}
          onRemoveOpenDay={openDayRemoveHandler}
          onTimeChange={timeChangeHandler}
        />
      </div>
    </div>
  );
};

export default AddressInfoForm;
