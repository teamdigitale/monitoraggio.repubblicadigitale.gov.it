import { Toggle } from 'design-react-kit';
import React from 'react';
import { selectHeadquarters } from '../../../../../redux/features/administrativeArea/administrativeAreaSlice';
import { useAppSelector } from '../../../../../redux/hooks';
import Form from '../../../../Form/form';
import AccordionAddressList from '../AccordionAddressList/AccordionAddressList';
import FormHeadquarter from '../FormHeadquarter/FormHeadquarter';

const HeadquarterDetailsContent = () => {
  const headquarterDetails =
    useAppSelector(selectHeadquarters).detail?.dettagliInfoSede;

  return (
    <>
      <FormHeadquarter formDisabled />
      <Form id='form-headquarter-details' className='mb-5 pr-5' showMandatory={false}>
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
        detailAccordion
      />
    </>
  );
};

export default HeadquarterDetailsContent;
