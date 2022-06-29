import React from 'react';
import Accordion from '../../../../../Accordion/accordion';
import AddressForm from '../../../../../General/AddressForm/AddressForm';
import OpenDaysSelect from '../../OpenDaysSelect/OpenDaysSelect';

export interface OpenDay {
  index: number;
  hourSpan: string[][];
}

export interface AddressInfoI {
  address: string;
  CAP: string;
  city: string;
  province: string;
  openDays: OpenDay[];
}

interface AccordionAddressI {
  addressInfo: AddressInfoI;
  index: number;
  onAddressInfoChange: (addressInfo: AddressInfoI) => void;
  handleOnToggle?: (isOpen: boolean) => void;
  isReadOnly?: boolean | undefined;
}

const AccordionAddress: React.FC<AccordionAddressI> = ({
  addressInfo,
  isReadOnly = false,
  index,
  onAddressInfoChange,
  handleOnToggle,
}) => {
  const accordionToggleHandler = (isOpen: boolean) => {
    if (handleOnToggle) handleOnToggle(isOpen);
  };

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
        day.index === dayIndex ? { ...day, hourSpan: timeSpan } : day
      ),
    });
  };

  return (
    <Accordion
      title={`Indirizzo ${index}`}
      className='my-5 px-5'
      handleOnToggle={(isOpen: boolean) => accordionToggleHandler(isOpen)}
    >
      <AddressForm
        address={addressInfo.address}
        province={addressInfo.province}
        city={addressInfo.city}
        CAP={addressInfo.CAP}
        onAddressChange={(address, province, city, CAP) =>
          addressChangeHandler(address, province, city, CAP)
        }
        formDisabled={isReadOnly}
      />

      <OpenDaysSelect
        openDays={addressInfo.openDays}
        onAddOpenDay={openDayAddHandler}
        onRemoveOpenDay={openDayRemoveHandler}
        onTimeChange={timeChangeHandler}
        isReadOnly={isReadOnly}
      />
    </Accordion>
  );
};

export default AccordionAddress;
