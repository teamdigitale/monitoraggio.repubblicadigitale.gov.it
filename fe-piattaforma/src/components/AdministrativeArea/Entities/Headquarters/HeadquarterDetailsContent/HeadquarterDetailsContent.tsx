import React, { useEffect } from 'react';
import { selectHeadquarters } from '../../../../../redux/features/administrativeArea/administrativeAreaSlice';
import { useAppSelector } from '../../../../../redux/hooks';
import AccordionAddressList from '../AccordionAddressList/AccordionAddressList';
import FormHeadquarter from '../FormHeadquarter/FormHeadquarter';

const HeadquarterDetailsContent = () => {
  const headquarterDetails =
    useAppSelector(selectHeadquarters).detail?.dettagliInfoSede;
  // This addressList is used to fill the address detail section until mocks
  // will be updated.
  // const [addressList, _setAddressList] = useState<AddressInfoI[]>([
  //   {
  //     address: 'Corso Montenapoleone',
  //     CAP: '00000',
  //     province: 'Milano',
  //     city: 'Milano',
  //     openDays: [
  //       {
  //         index: 0,
  //         hourSpan: [
  //           ['08:00', '12:00'],
  //           ['13:00', '18:00'],
  //         ],
  //       },
  //       {
  //         index: 2,
  //         hourSpan: [
  //           ['09:00', '12:00'],
  //           ['14:00', '18:00'],
  //         ],
  //       },
  //     ],
  //   },
  // ]);

  useEffect(() => {
    // console.log(headquarterDetails);
  }, [headquarterDetails]);

  /**
   *  An accordion is used to display address to reduce space but in case it is
   * required it can be modified.
   * Mobile version for detail does not exist in figma.
   */

  return (
    <>
      <FormHeadquarter formDisabled />
      <AccordionAddressList
        addressList={headquarterDetails?.indirizziSedeFasceOrarie || []}
        isReadOnly
      />
    </>
  );
};

export default HeadquarterDetailsContent;
