import { Toggle } from 'design-react-kit';
import React, { useEffect } from 'react';
import { selectHeadquarters } from '../../../../../redux/features/administrativeArea/administrativeAreaSlice';
import { useAppSelector } from '../../../../../redux/hooks';
import Form from '../../../../Form/form';
import AccordionAddressList from '../AccordionAddressList/AccordionAddressList';
import FormHeadquarter from '../FormHeadquarter/FormHeadquarter';

const HeadquarterDetailsContent = () => {
  const headquarterDetails =
    useAppSelector(selectHeadquarters).detail?.dettagliInfoSede;

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
      <Form className='mb-5 pr-5'>
        <Form.Row>
          <div className='col-10 col-md-4'>
            <Toggle
              label='Sede Itinerante'
              readOnly
              disabled
              checked={headquarterDetails?.itinere}
            />
          </div>
        </Form.Row>
      </Form>
      <AccordionAddressList
        addressList={headquarterDetails?.indirizziSedeFasceOrarie || []}
        isReadOnly
      />
    </>
  );
};

export default HeadquarterDetailsContent;
