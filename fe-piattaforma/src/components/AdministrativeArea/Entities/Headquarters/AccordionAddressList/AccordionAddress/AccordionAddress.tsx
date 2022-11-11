import clsx from 'clsx';
import {
  Accordion,
  AccordionBody,
  AccordionHeader,
  Button,
  Icon,
} from 'design-react-kit';
import React, { useState } from 'react';
import { dayCode } from '../../../../../../pages/administrator/AdministrativeArea/Entities/utils';
import AddressForm from '../../../../../General/AddressForm/AddressForm';
import OpenDaysSelect from '../../OpenDaysSelect/OpenDaysSelect';

export interface OpenDayHours {
  [key: string]: string | null;
}

export interface Address {
  cancellato?: boolean;
  id?: string;
  via: string;
  civico: string;
  comune: string;
  provincia: string;
  cap: string;
  regione: string;
  nazione: string;
}

export interface AddressInfoI {
  indirizzoSede: Address;
  fasceOrarieAperturaIndirizzoSede: OpenDayHours;
}

interface AccordionAddressI {
  addressInfo: AddressInfoI;
  index: number;
  canBeDeleted?: boolean;
  onAddressInfoChange: (addressInfo: AddressInfoI) => void;
  handleOnToggle?: (isOpen: boolean) => void;
  isReadOnly?: boolean | undefined;
  detailAccordion?: boolean;
  roleList?: boolean;
}

const AccordionAddress: React.FC<AccordionAddressI> = ({
  addressInfo,
  isReadOnly = false,
  index,
  onAddressInfoChange,
  canBeDeleted = false,
  detailAccordion = false,
  roleList = false,
  // handleOnToggle,
}) => {
  const [addressOpen, setAddressOpen] = useState(index === 1);
  // const accordionToggleHandler = (isOpen: boolean) => {
  //   if (handleOnToggle) handleOnToggle(isOpen);
  // };

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
        provincia: province,
        regione: state,
        comune: city,
        cap: CAP,
      },
    });
  };

  const addressRemoveHandler = () => {
    onAddressInfoChange({
      ...addressInfo,
      indirizzoSede: {
        ...addressInfo.indirizzoSede,
        cancellato: true,
      },
    });
  };

  const openDayAddHandler = (dayIndex: number) => {
    const newTimeSlots = { ...addressInfo.fasceOrarieAperturaIndirizzoSede };
    newTimeSlots[`${dayCode[dayIndex]}OrarioApertura1`] = '';
    newTimeSlots[`${dayCode[dayIndex]}OrarioChiusura1`] = '';

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
    newTimeSlots[`${dayCode[dayIndex]}OrarioApertura2`] = timeSpan[1][0]  ? timeSpan[1][0] : null;
    newTimeSlots[`${dayCode[dayIndex]}OrarioChiusura2`] = timeSpan[1][1]  ? timeSpan[1][1] : null;

    onAddressInfoChange({
      ...addressInfo,
      fasceOrarieAperturaIndirizzoSede: { ...newTimeSlots },
    });
  };

  return (
    <Accordion
      iconLeft
      className={clsx(!roleList && 'accordion-container__gray-title')}
    >
      <AccordionHeader
        active={addressOpen}
        onToggle={() => setAddressOpen((prev) => !prev)}
        className='d-flex align-items-center'
      >
        <span
          className={clsx(
            detailAccordion && 'accordion-container__header-acc',
            'mr-auto'
          )}
        >{`Indirizzo ${index}`}</span>
        {canBeDeleted && !isReadOnly && (
          <Button
            onClick={(e) => {
              e.stopPropagation();
              addressRemoveHandler();
            }}
            className='pl-3 pr-0'
          >
            <Icon
              color='primary'
              icon='it-less-circle'
              size='sm'
              aria-label='Elimina'
            />
          </Button>
        )}
      </AccordionHeader>
      <AccordionBody className='px-0 pt-5' active={addressOpen}>
        <AddressForm
          address={addressInfo.indirizzoSede.via}
          province={addressInfo.indirizzoSede.provincia}
          state={addressInfo.indirizzoSede.regione}
          city={addressInfo.indirizzoSede.comune}
          CAP={addressInfo.indirizzoSede.cap}
          onAddressChange={(address, province, state, city, CAP) =>
            addressChangeHandler(address, province, state, city, CAP)
          }
          formDisabled={isReadOnly}
        />

        <OpenDaysSelect
          openDays={addressInfo.fasceOrarieAperturaIndirizzoSede || {}}
          index={index}
          onAddOpenDay={openDayAddHandler}
          onRemoveOpenDay={openDayRemoveHandler}
          onTimeChange={timeChangeHandler}
          isReadOnly={isReadOnly}
        />
      </AccordionBody>
    </Accordion>
  );
};

export default AccordionAddress;
