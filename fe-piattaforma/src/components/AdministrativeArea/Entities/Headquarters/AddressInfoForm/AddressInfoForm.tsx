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
  const addressChangeHandler = (address: string) => {
    onAddressInfoChange({
      ...addressInfo,
      address: address,
    });
  };

  const openDayAddHandler = (dayIndex: number) => {
    onAddressInfoChange({
      ...addressInfo,
      openDays: [
        ...addressInfo.openDays,
        { index: dayIndex, hourSpan: ['08:00', '18:00'] },
      ],
    });
  };

  const openDayRemoveHandler = (dayIndex: number) => {
    onAddressInfoChange({
      ...addressInfo,
      openDays: addressInfo.openDays.filter((day) => day.index !== dayIndex),
    });
  };

  const timeChangeHandler = (dayIndex: number, timeSpan: string[]) => {
    onAddressInfoChange({
      ...addressInfo,
      openDays: addressInfo.openDays.map((day) =>
        day.index === dayIndex ? { ...day, hourSpan: [...timeSpan] } : day
      ),
    });
  };

  return (
    <div className='row px-5'>
      <div className='col'>
        <AddressForm
          address={addressInfo.address}
          onAddressChange={(address: string) => addressChangeHandler(address)}
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
