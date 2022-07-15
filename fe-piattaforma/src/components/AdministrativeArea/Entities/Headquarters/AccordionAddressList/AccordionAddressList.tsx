import React, { useState } from 'react';
import AccordionAddress, {
  AddressInfoI,
} from './AccordionAddress/AccordionAddress';

export interface AccordionAddressListI {
  addressList: AddressInfoI[];
  onSetAddressList?: (addressList: AddressInfoI[]) => void;
  isReadOnly?: boolean;
}

const AccordionAddressList: React.FC<AccordionAddressListI> = ({
  addressList,
  onSetAddressList,
  isReadOnly = false,
}) => {
  const [newAddressInfo, setNewAddressInfo] = useState<AddressInfoI>({
    indirizzoSede: {
      via: '',
      civico: '',
      comune: '',
      provincia: '',
      cap: '',
      regione: '',
      nazione: '',
    },
    fasceOrarieAperturaIndirizzoSede: [],
  });

  const addressListChangeHandler = (
    changedAddressInfo: AddressInfoI,
    index: number
  ) => {
    onSetAddressList &&
      onSetAddressList(
        addressList.map((addressInfo: AddressInfoI, i: number) =>
          i === index ? { ...changedAddressInfo } : addressInfo
        )
      );
  };

  const newAddressHandler = (isOpen: boolean) => {
    if (!isOpen && newAddressInfo.indirizzoSede.via.trim() !== '') {
      onSetAddressList && onSetAddressList([...addressList, newAddressInfo]);
      setNewAddressInfo({
        indirizzoSede: {
          via: '',
          civico: '',
          comune: '',
          provincia: '',
          cap: '',
          regione: '',
          nazione: '',
        },
        fasceOrarieAperturaIndirizzoSede: [],
      });
    }
  };

  return (
    <>
      {addressList.map((address, index) => (
        <AccordionAddress
          isReadOnly={isReadOnly}
          key={index}
          index={index + 1}
          addressInfo={address}
          onAddressInfoChange={(addressInfo: AddressInfoI) =>
            addressListChangeHandler(addressInfo, index)
          }
        />
      ))}

      {!isReadOnly && (
        <AccordionAddress
          index={addressList.length + 1}
          addressInfo={newAddressInfo}
          onAddressInfoChange={setNewAddressInfo}
          handleOnToggle={(isOpen: boolean) => newAddressHandler(isOpen)}
        />
      )}
    </>
  );
};

export default AccordionAddressList;
