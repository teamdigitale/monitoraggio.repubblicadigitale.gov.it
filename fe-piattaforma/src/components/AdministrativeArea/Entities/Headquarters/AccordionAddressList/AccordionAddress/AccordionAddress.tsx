import React from 'react';
import Accordion from '../../../../../Accordion/accordion';
import AddressForm from '../../../../../General/AddressForm/AddressForm';
import OpenDaysSelect from '../../OpenDaysSelect/OpenDaysSelect';

export interface OpenDay {
  index: number;
  hourSpan: string[];
}

export interface AddressInfoI {
  address: string;
  openDays: OpenDay[];
}

interface AccordionAddressI {
  addressInfo: AddressInfoI;
  index: number;
  onAddressInfoChange: (addressInfo: AddressInfoI) => void;
  handleOnToggle?: (isOpen: boolean) => void;
}

const AccordionAddress: React.FC<AccordionAddressI> = ({
  addressInfo,
  index,
  onAddressInfoChange,
  handleOnToggle,
}) => {
  const accordionToggleHandler = (isOpen: boolean) => {
    if (handleOnToggle) handleOnToggle(isOpen);
  };

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
    <Accordion
      title={`Indirizzo ${index}`}
      className='mt-5 mb-5 px-5'
      handleOnToggle={(isOpen: boolean) => accordionToggleHandler(isOpen)}
    >
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
    </Accordion>
  );
};

export default AccordionAddress;
