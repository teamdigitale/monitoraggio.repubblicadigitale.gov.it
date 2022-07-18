import React from 'react';
import { dayOfWeek } from '../../../../../../pages/administrator/AdministrativeArea/Entities/utils';
import Accordion from '../../../../../Accordion/accordion';
import AddressForm from '../../../../../General/AddressForm/AddressForm';
import OpenDaysSelect from '../../OpenDaysSelect/OpenDaysSelect';

export interface OpenDayHours {
  giornoAperturaSede: string;
  orarioAperturaSede: string;
  orarioChiusuraSede: string;
}

export interface Address {
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
  fasceOrarieAperturaIndirizzoSede: OpenDayHours[];
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
      indirizzoSede: {
        ...addressInfo.indirizzoSede,
        via: address,
        provincia: province,
        comune: city,
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
    <Accordion
      title={`Indirizzo ${index}`}
      className='my-5 px-5'
      handleOnToggle={(isOpen: boolean) => accordionToggleHandler(isOpen)}
    >
      <AddressForm
        address={addressInfo.indirizzoSede.via}
        province={addressInfo.indirizzoSede.provincia}
        city={addressInfo.indirizzoSede.comune}
        CAP={addressInfo.indirizzoSede.cap}
        onAddressChange={(address, province, city, CAP) =>
          addressChangeHandler(address, province, city, CAP)
        }
        formDisabled={isReadOnly}
      />

      <OpenDaysSelect
        openDays={addressInfo.fasceOrarieAperturaIndirizzoSede}
        index={index}
        onAddOpenDay={openDayAddHandler}
        onRemoveOpenDay={openDayRemoveHandler}
        onTimeChange={timeChangeHandler}
        isReadOnly={isReadOnly}
      />
    </Accordion>
  );
};

export default AccordionAddress;
