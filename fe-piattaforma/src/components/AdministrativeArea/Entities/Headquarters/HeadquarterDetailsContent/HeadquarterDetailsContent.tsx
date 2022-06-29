import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { selectHeadquarters } from '../../../../../redux/features/administrativeArea/administrativeAreaSlice';
import { GetHeadquartersDetail } from '../../../../../redux/features/administrativeArea/headquarters/headquartersThunk';
import { useAppSelector } from '../../../../../redux/hooks';
import { AddressInfoI } from '../AccordionAddressList/AccordionAddress/AccordionAddress';
import AccordionAddressList from '../AccordionAddressList/AccordionAddressList';
import FormHeadquarters from '../HeadquartersForm/formHeadquarters';

const HeadquarterDetailsContent = () => {
  const dispatch = useDispatch();
  const { entityId } = useParams();

  const headquarterDetails = useAppSelector(selectHeadquarters);
  // This addressList is used to fill the address detail section until mocks
  // will be updated.
  const [addressList, _setAddressList] = useState<AddressInfoI[]>([
    {
      address: 'Corso Montenapoleone',
      CAP: '00000',
      province: 'Milano',
      city: 'Milano',
      openDays: [
        {
          index: 0,
          hourSpan: [
            ['08:00', '12:00'],
            ['13:00', '18:00'],
          ],
        },
        {
          index: 2,
          hourSpan: [
            ['09:00', '12:00'],
            ['14:00', '18:00'],
          ],
        },
      ],
    },
  ]);

  useEffect(() => {
    if (entityId) dispatch(GetHeadquartersDetail(entityId));
  }, [entityId]);

  useEffect(() => {
    console.log(headquarterDetails);
  }, [headquarterDetails]);

  /**
   *  An accordion is used to display address to reduce space but in case it is
   * required it can be modified.
   * Mobile version for detail does not exist in figma.
   */

  return (
    <>
      <FormHeadquarters formDisabled />
      <AccordionAddressList addressList={addressList} isReadOnly />
    </>
  );
};

export default HeadquarterDetailsContent;
