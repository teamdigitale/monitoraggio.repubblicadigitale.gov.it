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
  movingHeadquarter?: boolean;
  detailAccordion?: boolean;
  roleList?: boolean;
}

const AccordionAddressList: React.FC<AccordionAddressListI> = ({
  addressList,
  onSetAddressList,
  isReadOnly = false,
  movingHeadquarter = false,
  detailAccordion = false,
  roleList = false,
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
      {addressList.map((address, index, arr) =>
        !address.indirizzoSede?.cancellato ? (
          <AccordionAddress
            isReadOnly={isReadOnly}
            key={index}
            index={
              arr.slice(0, index + 1).filter((a) => !a.indirizzoSede.cancellato)
                .length
            }
            addressInfo={address}
            canBeDeleted={
              movingHeadquarter
                ? arr.filter((a) => !a.indirizzoSede.cancellato).length > 2
                : arr.filter((a) => !a.indirizzoSede.cancellato).length > 1
            }
            onAddressInfoChange={(addressInfo: AddressInfoI) =>
              addressListChangeHandler(addressInfo, index)
            }
            detailAccordion={detailAccordion}
            roleList={roleList}
          />
        ) : null
      )}
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
