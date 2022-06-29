import React, { useState } from 'react';
import AccordionAddress, {
  AddressInfoI,
} from './AccordionAddress/AccordionAddress';

interface AccordionAddressListI {
  addressList: AddressInfoI[];
  onSetAddressList: (addressList: AddressInfoI[]) => void;
}

const AccordionAddressList: React.FC<AccordionAddressListI> = ({
  addressList,
  onSetAddressList,
}) => {
  const [newAddressInfo, setNewAddressInfo] = useState<AddressInfoI>({
    address: '',
    openDays: [],
  });

  const addressListChangeHandler = (
    changedAddressInfo: AddressInfoI,
    index: number
  ) => {
    onSetAddressList(
      addressList.map((addressInfo: AddressInfoI, i: number) =>
        i === index ? { ...changedAddressInfo } : addressInfo
      )
    );
  };

  const newAddressHandler = (isOpen: boolean) => {
    if (!isOpen && newAddressInfo.address.trim() !== '') {
      onSetAddressList([...addressList, newAddressInfo]);
      setNewAddressInfo({
        address: '',
        openDays: [],
      });
    }
  };

  return (
    <>
      {addressList.map((address, index) => (
        <AccordionAddress
          key={index}
          index={index + 1}
          addressInfo={address}
          onAddressInfoChange={(addressInfo: AddressInfoI) =>
            addressListChangeHandler(addressInfo, index)
          }
        />
      ))}

      <AccordionAddress
        index={addressList.length + 1}
        addressInfo={newAddressInfo}
        onAddressInfoChange={setNewAddressInfo}
        handleOnToggle={(isOpen: boolean) => newAddressHandler(isOpen)}
      />
    </>
  );
};

export default AccordionAddressList;
