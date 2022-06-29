import React from 'react';
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
      address: address,
      province: province,
      city: city,
      CAP: CAP,
    });
  };

  const openDayAddHandler = (dayIndex: number) => {
    onAddressInfoChange({
      ...addressInfo,
      openDays: [
        ...addressInfo.openDays,
        {
          index: dayIndex,
          hourSpan: [
            ['09:00', '13:00'],
            ['14:00', '18:00'],
          ],
        },
      ],
    });
  };

  const openDayRemoveHandler = (dayIndex: number) => {
    onAddressInfoChange({
      ...addressInfo,
      openDays: addressInfo.openDays.filter((day) => day.index !== dayIndex),
    });
  };

  const timeChangeHandler = (dayIndex: number, timeSpan: string[][]) => {
    onAddressInfoChange({
      ...addressInfo,
      openDays: addressInfo.openDays.map((day) =>
        day.index === dayIndex ? { ...day, hourSpan: [timeSpan.flat()] } : day
      ),
    });
  };

  return (
    <div className='row px-5'>
      <div className='col'>
        <AddressForm
          address={addressInfo.address}
          province={addressInfo.province}
          city={addressInfo.city}
          CAP={addressInfo.CAP}
          onAddressChange={(address, province, city, CAP) =>
            addressChangeHandler(address, province, city, CAP)
          }
        />
        <OpenDaysSelect
          openDays={addressInfo.openDays}
          onAddOpenDay={openDayAddHandler}
          onRemoveOpenDay={openDayRemoveHandler}
          onTimeChange={timeChangeHandler}
        />
      </div>
    </div>
  );
};

export default AddressInfoForm;
