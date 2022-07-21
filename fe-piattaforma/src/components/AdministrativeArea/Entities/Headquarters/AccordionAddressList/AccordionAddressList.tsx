import clsx from 'clsx';
import { Button, Icon } from 'design-react-kit';
import React from 'react';
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

  const newAddressHandler = () => {
    onSetAddressList &&
      onSetAddressList([
        ...addressList,
        {
          indirizzoSede: {
            via: '',
            civico: '',
            comune: '',
            provincia: '',
            cap: '',
            regione: '',
            nazione: '',
          },
          fasceOrarieAperturaIndirizzoSede: {},
        },
      ]);
  };

  return (
    <div>
      {addressList
        .filter((address) => !address.indirizzoSede?.cancellato)
        .map((address, index, arr) => (
          <AccordionAddress
            isReadOnly={isReadOnly}
            key={index}
            index={index + 1}
            addressInfo={address}
            canBeDeleted={arr.length > 2}
            onAddressInfoChange={(addressInfo: AddressInfoI) =>
              addressListChangeHandler(addressInfo, index)
            }
          />
        ))}
      {!isReadOnly && (
        <div
          className={clsx(
            'w-100',
            'mb-5',
            'mt-3',
            'd-flex',
            'justify-content-end'
          )}
        >
          <Button
            onClick={newAddressHandler}
            className='d-flex justify-content-between'
            type='button'
          >
            <Icon
              color='primary'
              icon='it-plus-circle'
              size='sm'
              className='mr-2'
              aria-label='Aggiungi'
            />
            Aggiungi Indirizzo
          </Button>
        </div>
      )}
    </div>
  );
};

export default AccordionAddressList;
